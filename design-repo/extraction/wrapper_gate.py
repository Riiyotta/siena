#!/usr/bin/env python3
"""Whole-page-wrapper quality gate: no "section" may secretly be a whole page.

Reads the REAL rendered heights recorded in extraction/measured-values.json -> sectionHeights
(written by extraction/measure_heights.mjs from the built clone at 1440px) and checks them
against the templates. It needs no clone, browser or network, so it also runs in a standalone
copy; the numbers are evidence, this file is the verifier.

Rules (thresholds are pinned HERE, not read from the data; the data must not weaken them):
  MISSING      every route and every template node instance must have a numeric measurement.
               A node may be out of flow (heightPx 0) only if it is one of the pinned
               out-of-flow types (fixed/absolute chrome, the portal modal, the phone-only
               quirk block). Anything else with no height is an ERROR, never a silent skip.
  SEQUENCE     the measured node sequence of each route is a valid instance of its template
               (membership, order, required, repeatable, repeatCounts, routeVariants).
  HERO_WARN    a hero.* section taller than 1800px is a WARNING.
  HERO_FAIL    a hero.* section taller than 3000px is an ERROR unless it has an entry in
               sectionHeights.heroWhitelist with reviewedBy, a justification of >= 30
               characters, and a maxHeightPx strictly above the measured height.
  SHARE        one section holding more than 50% of a page's in-flow height is a WARNING;
               sectionHeights.shareReviewed records the reviewed ones (reviewedBy,
               justification >= 30 chars, maxSharePct); a reviewed section that has grown
               past its maxSharePct is an ERROR.
  H1           exactly one visible H1 per page; on a page with a hero it must sit inside the
               hero.* node (a hero-like block that is not classed hero is an error); on the
               hero-less templates it must sit inside a content.*-header node.
  COHERENCE    routes sharing one template must share >= 60% of their section types
               (Jaccard), so unrelated page types cannot hide behind matching outer wrappers.
  ACCOUNTING   node heights sum to inFlowHeightPx, which is within 10% of the document height.

Run:  python3 extraction/wrapper_gate.py          (prints findings, exit 1 on any error)
verify_all.py runs the same evaluate() as numbered check 13; adversarial_test.py and
prove_drift.py prove it fails on bad input.
"""
import json
import os
import sys

DR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(DR, "schema"))

HERO_WARN_PX = 1800
HERO_FAIL_PX = 3000
SHARE_WARN = 0.5
MIN_JUSTIFICATION = 30
MIN_JACCARD = 0.6
MAX_UNATTRIBUTED = 0.10
# fixed / absolutely positioned / portal / phone-only: legitimately no in-flow height at 1440
OUT_OF_FLOW = {"shell.navbar", "shell.lead-header", "shell.lab-nav", "overlay.partner-modal", "quirk.phone-empty-block"}
HEADER_TYPES = ("content.index-header", "content.article-header", "content.legal-header")


def _num(x):
    return isinstance(x, (int, float)) and not isinstance(x, bool)


def _reviewed(entry, key_fields):
    """Return an error string if a review entry is not a real review, else None."""
    for f in key_fields:
        if not isinstance(entry.get(f), str) or not entry[f]:
            return f"missing {f!r}"
    if not isinstance(entry.get("reviewedBy"), str) or len(entry["reviewedBy"].strip()) < 3:
        return "missing reviewedBy"
    j = entry.get("justification")
    if not isinstance(j, str) or len(j.strip()) < MIN_JUSTIFICATION:
        return f"justification must be >= {MIN_JUSTIFICATION} characters"
    return None


def evaluate(mv, repo):
    """mv = measured-values.json (parsed); repo = schema/semantic_validate.load_repo().
    Returns (errors, warnings, info) as lists of strings."""
    import semantic_validate as SV  # noqa: E402

    errors, warnings, info = [], [], []
    sh = mv.get("sectionHeights")
    if not isinstance(sh, dict) or not isinstance(sh.get("routes"), dict):
        return ["[wrapper-gate] measured-values.json has no sectionHeights.routes: heights were never recorded (missing measurement)"], warnings, info
    if sh.get("viewportPx") != 1440:
        errors.append(f"[wrapper-gate] sectionHeights.viewportPx must be 1440, got {sh.get('viewportPx')!r}")
    gate = sh.get("gate", {})
    for k, want in (("heroWarnPx", HERO_WARN_PX), ("heroFailPx", HERO_FAIL_PX), ("shareWarn", SHARE_WARN), ("minJaccard", MIN_JACCARD)):
        if gate.get(k) != want:
            errors.append(f"[wrapper-gate] sectionHeights.gate.{k} is {gate.get(k)!r} but the gate pins {want} (thresholds may not be weakened in the data)")
    templates = repo["templates"]
    route_tpl = {r: t for t in templates.values() for r in t["routes"]}
    routes = sh["routes"]
    for r in sorted(set(route_tpl) - set(routes)):
        errors.append(f"[wrapper-gate] {r}: no measurement recorded (missing measurement)")
    for r in sorted(set(routes) - set(route_tpl)):
        errors.append(f"[wrapper-gate] {r}: measured but not a route of any template")

    wl = {(e.get("route"), e.get("section")): e for e in sh.get("heroWhitelist", [])}
    wl_used = set()
    rv_ok = {(e.get("route"), e.get("section")): e for e in sh.get("shareReviewed", [])}
    rv_used = set()
    for e in sh.get("heroWhitelist", []):
        bad = _reviewed(e, ("route", "section"))
        if bad:
            errors.append(f"[wrapper-gate] heroWhitelist entry {e.get('route')} {e.get('section')}: {bad}")
        if not _num(e.get("maxHeightPx")):
            errors.append(f"[wrapper-gate] heroWhitelist entry {e.get('route')} {e.get('section')}: maxHeightPx must be a number")
    for e in sh.get("shareReviewed", []):
        bad = _reviewed(e, ("route", "section"))
        if bad:
            errors.append(f"[wrapper-gate] shareReviewed entry {e.get('route')} {e.get('section')}: {bad}")
        if not _num(e.get("maxSharePct")):
            errors.append(f"[wrapper-gate] shareReviewed entry {e.get('route')} {e.get('section')}: maxSharePct must be a number")

    types_by_route = {}
    hero_max = (0, None, None)
    for route in sorted(set(routes) & set(route_tpl)):
        rec = routes[route]
        tpl = route_tpl[route]
        nodes = rec.get("nodes")
        if not isinstance(nodes, list) or not nodes:
            errors.append(f"[wrapper-gate] {route}: no node measurements (missing measurement)")
            continue
        # SEQUENCE: reuse the semantic validator's real template cross-reference
        doc = {"template": tpl["id"], "route": route, "nodes": [{"type": n.get("section"), "variant": n.get("variant")} for n in nodes]}
        seq_out = []
        SV.check_template(doc, repo, seq_out)
        for sev, rule, msg in seq_out:
            errors.append(f"[wrapper-gate] {route}: measured node sequence is not a valid {tpl['id']} instance ({rule}: {msg})")
        cons = tpl.get("constraints", {})
        types = [n.get("section") for n in nodes]
        types_by_route[route] = set(types)
        for s, (lo, hi) in cons.get("repeatCounts", {}).items():
            c = types.count(s)
            if not lo <= c <= hi:
                errors.append(f"[wrapper-gate] {route}: {s} measured {c} times; {tpl['id']} allows {lo}-{hi}")
        for s, var in cons.get("routeVariants", {}).get(route, {}).items():
            for n in nodes:
                if n.get("section") == s and n.get("variant") != var:
                    errors.append(f"[wrapper-gate] {route}: {s} measured with variant {n.get('variant')!r}, route binds {var!r}")
        rr = cons.get("routeNodeRules", {}).get(route, {})
        for s in rr.get("require", []):
            if s not in types:
                errors.append(f"[wrapper-gate] {route}: measured nodes lack required {s}")
        for s in rr.get("forbid", []):
            if s in types:
                errors.append(f"[wrapper-gate] {route}: measured nodes include forbidden {s}")
        # MISSING per node
        total = 0
        route_bad = False
        for i, n in enumerate(nodes):
            s = n.get("section")
            h = n.get("heightPx")
            if not _num(h) or h < 0:
                errors.append(f"[wrapper-gate] {route}: node #{i} {s} has no numeric heightPx (missing measurement)")
                route_bad = True
                continue
            if not isinstance(n.get("inFlow"), bool):
                errors.append(f"[wrapper-gate] {route}: node #{i} {s} lacks a boolean inFlow (missing measurement)")
            if s not in OUT_OF_FLOW and (h <= 0 or n.get("inFlow") is not True):
                errors.append(f"[wrapper-gate] {route}: node #{i} {s} has no in-flow height; only {sorted(OUT_OF_FLOW)} may be out of flow (missing measurement)")
            if s in OUT_OF_FLOW and h != 0:
                errors.append(f"[wrapper-gate] {route}: node #{i} {s} is an out-of-flow type but records {h}px")
            if not _num(n.get("h1Count")):
                errors.append(f"[wrapper-gate] {route}: node #{i} {s} lacks h1Count (missing measurement)")
            total += h
        # ACCOUNTING
        doc_h = rec.get("documentHeightPx")
        if not _num(doc_h) or doc_h <= 0:
            errors.append(f"[wrapper-gate] {route}: documentHeightPx missing (missing measurement)")
            continue
        if rec.get("inFlowHeightPx") != total:
            errors.append(f"[wrapper-gate] {route}: inFlowHeightPx {rec.get('inFlowHeightPx')} != sum of node heights {total}")
        if total > doc_h + 2 or (doc_h - total) > MAX_UNATTRIBUTED * doc_h:
            errors.append(f"[wrapper-gate] {route}: node heights sum to {total}px but the document is {doc_h}px (more than {int(MAX_UNATTRIBUTED * 100)}% unattributed or over-counted)")
        if route_bad or total <= 0:
            continue
        # HERO thresholds
        heroes = [n for n in nodes if str(n.get("section", "")).startswith("hero.")]
        if len(heroes) > 1:
            errors.append(f"[wrapper-gate] {route}: {len(heroes)} hero.* sections measured on one page")
        for n in heroes:
            h = n["heightPx"]
            if h > hero_max[0]:
                hero_max = (h, route, n["section"])
            key = (route, n["section"])
            if h > HERO_FAIL_PX:
                e = wl.get(key)
                if e is None:
                    errors.append(f"[wrapper-gate] {route}: {n['section']} is {h}px tall (> {HERO_FAIL_PX}px): a hero this tall is a whole-page wrapper; split it or add a reviewed heroWhitelist entry")
                else:
                    wl_used.add(key)
                    if not (_num(e.get("maxHeightPx")) and e["maxHeightPx"] > h):
                        errors.append(f"[wrapper-gate] {route}: {n['section']} measures {h}px but its whitelist maxHeightPx is {e.get('maxHeightPx')!r} (must be above the measured height)")
                    else:
                        warnings.append(f"[wrapper-gate] {route}: {n['section']} is {h}px (> {HERO_FAIL_PX}px) but whitelisted by {e.get('reviewedBy')}: {e.get('justification')}")
            elif h > HERO_WARN_PX:
                warnings.append(f"[wrapper-gate] {route}: {n['section']} is {h}px tall (> {HERO_WARN_PX}px): check it is not a page/article wrapper")
        # SHARE
        for n in nodes:
            share = n["heightPx"] / total
            if share > SHARE_WARN:
                key = (route, n["section"])
                e = rv_ok.get(key)
                pct = round(share * 100, 1)
                if e is None:
                    warnings.append(f"[wrapper-gate] {route}: {n['section']} holds {pct}% of the page's in-flow height ({n['heightPx']} of {total}px); unreviewed")
                else:
                    rv_used.add(key)
                    if _num(e.get("maxSharePct")) and pct > e["maxSharePct"]:
                        errors.append(f"[wrapper-gate] {route}: {n['section']} now holds {pct}% (> reviewed maxSharePct {e['maxSharePct']}); re-review it")
                    else:
                        warnings.append(f"[wrapper-gate] {route}: {n['section']} holds {pct}% of the page ({n['heightPx']} of {total}px); reviewed by {e.get('reviewedBy')}")
        # H1
        if rec.get("h1Total") != 1:
            errors.append(f"[wrapper-gate] {route}: {rec.get('h1Total')} visible H1 element(s); a page has exactly one")
        holders = [n for n in nodes if n.get("h1Count", 0) > 0]
        if sum(n.get("h1Count", 0) for n in holders) != rec.get("h1Total"):
            errors.append(f"[wrapper-gate] {route}: H1 count per node does not add up to the page's {rec.get('h1Total')}")
        if heroes:
            for n in holders:
                if not str(n["section"]).startswith("hero."):
                    errors.append(f"[wrapper-gate] {route}: the page H1 sits inside {n['section']}, not the hero: a hero-like block that is not classed hero")
            if not any(str(n["section"]).startswith("hero.") for n in holders):
                errors.append(f"[wrapper-gate] {route}: the page has a hero but its H1 is not inside it")
        else:
            for n in holders:
                if n["section"] not in HEADER_TYPES:
                    errors.append(f"[wrapper-gate] {route}: hero-less page whose H1 sits inside {n['section']}; expected one of {HEADER_TYPES}")
    for key in sorted(set(wl) - wl_used):
        warnings.append(f"[wrapper-gate] heroWhitelist entry {key[0]} {key[1]} grants nothing (hero is not over {HERO_FAIL_PX}px); remove it")
    for key in sorted(set(rv_ok) - rv_used):
        warnings.append(f"[wrapper-gate] shareReviewed entry {key[0]} {key[1]} no longer applies (section is not over 50%); remove it")

    # COHERENCE
    for tid, t in sorted(templates.items()):
        rs = [r for r in t["routes"] if r in types_by_route]
        for i in range(len(rs)):
            for j in range(i + 1, len(rs)):
                a, b = types_by_route[rs[i]], types_by_route[rs[j]]
                jac = len(a & b) / len(a | b)
                if jac < MIN_JACCARD:
                    errors.append(f"[wrapper-gate] {tid}: {rs[i]} and {rs[j]} share only {jac:.0%} of their section types (< {MIN_JACCARD:.0%}); they are not one page type")
                else:
                    info.append((tid, rs[i], rs[j], round(jac, 2)))
    info.append(("hero-max", hero_max))
    return errors, warnings, info


def main():
    import semantic_validate as SV  # noqa: E402

    mv = json.load(open(os.path.join(DR, "extraction", "measured-values.json"), encoding="utf-8"))
    errors, warnings, info = evaluate(mv, SV.load_repo())
    routes = mv.get("sectionHeights", {}).get("routes", {})
    n_nodes = sum(len(r.get("nodes", [])) for r in routes.values())
    hero = next((i for i in info if i and i[0] == "hero-max"), None)
    print(f"wrapper gate: {len(routes)} routes, {n_nodes} measured node instances; tallest hero {hero[1][0]}px ({hero[1][1]} {hero[1][2]}); {len(warnings)} warning(s), {len(errors)} error(s)")
    for w in warnings:
        print("WARN ", w)
    for e in errors:
        print("ERROR", e)
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
