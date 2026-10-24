#!/usr/bin/env python3
"""Semantic validator for Siena PageSpec instances: everything JSON Schema cannot express.

Usage:  python3 schema/semantic_validate.py page.json [more.json ...]
Exit 0 when there are no error-severity findings. Warnings never fail the run.

Section CONTRACTS (not PageSpecs) are checked by validate_section_contract(): meta schema
(schema/section-contract.schema.json), pinned retrieval eligibility, provenance-vs-taxonomy
(source vs semantic), and the classification policy (schema/section-classification.json).

Layers, in order:
  1. Draft-07 schema (schema/pagespec.schema.json). If it fails, later layers are skipped.
  2. Template cross-reference: the declared template's REAL node list, keyed on
     (section, variant): membership, order, required, repeatable; route membership.
  3. Graph rules from compatibility/graph.json (every rule id is implemented below;
     extraction/verify_all.py asserts the two sets are identical).
  4. Per-instance maxWords budgets from the section contracts (+ head).
  5. mode "generated" (a new page for ANY OTHER brand), GENERATED_MODE_* rules: no reference-only / blocked asset role,
     only the roles the section lists in generatedAssetRoles, no source brand / URL / customer / person / marketing copy /
     asset file, quotes and copy of `generated` provenance. Mode "reference" keeps every rule above unchanged.
Findings are (severity, rule, message) tuples.
"""
import glob
import hashlib
import json
import os
import re
import sys
from urllib.parse import urlparse

import jsonschema

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_schema as BS  # noqa: E402

DR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

IMPLEMENTED_RULES = {
    "NAV_FIRST", "FOOTER_LAST", "CHROME_MATCHES_ROUTE", "NAV_OVERRIDE", "ONE_HERO", "HERO_AFTER_CHROME",
    "ONE_PER_PAGE", "MAX_PER_PAGE", "NO_ADJACENT_SAME_SECTION", "CTA_CLOSES_PAGE", "QUIRK_REGISTERED",
    "OUT_OF_SCOPE_ROUTE", "LINK_TARGETS", "FORMS_STATIC", "EMBED_ALLOWLIST", "QUOTE_PROVENANCE",
    "PLACEHOLDER_MARKED", "TESTIMONIAL_SET", "TESTIMONIAL_SET_COUNT", "ROUTE_VARIANT", "ROUTE_NODE_RULES",
    "VARIANT_RULES", "REPEAT_COUNTS", "MOTION_BUDGET", "ASSET_ROLE_USAGE", "UNIQUE_IDS", "MODAL_OPENER", "CHAPTER_PARITY",
}

# mode "generated": every rule id raised by check_generated() (verify_all asserts each is raised in code and proven by a test)
GENERATED_MODE_RULES = {
    "GENERATED_MODE_REFERENCE_ASSET", "GENERATED_MODE_ROLE", "GENERATED_MODE_ASSET_REF", "GENERATED_MODE_SOURCE_BRAND",
    "GENERATED_MODE_SOURCE_URL", "GENERATED_MODE_EXTERNAL_URL", "GENERATED_MODE_SOURCE_PERSON", "GENERATED_MODE_SOURCE_CUSTOMER",
    "GENERATED_MODE_SOURCE_COPY", "GENERATED_MODE_QUOTE", "GENERATED_MODE_PLACEHOLDER_COPY", "GENERATED_MODE_THIRD_PARTY",
}
# Keys whose string values are the contract's own vocabulary (enum members, ids of the closed registries), not rendered text.
STRUCTURAL_KEYS = {"type", "variant", "template", "theme", "mode", "assetRole", "assetRef", "style", "action", "state", "speaker", "control",
                   "source", "copySource", "kind", "layout", "mediaSide", "network", "visual", "submitBehavior", "linkSet", "phoneLayout",
                   "phoneGrid", "visibleAt", "formula", "anchorId", "codepoint", "pattern", "reducedMotionFallback"}

# Utility/runtime UI that a retrieval index must skip. Pinned HERE (and, independently, as a
# second literal in extraction/verify_all.py) so flipping the flag in a contract, the allowlist
# or the registry cannot silently re-admit a modal or a blank-block quirk.
RETRIEVAL_INELIGIBLE = {"overlay.partner-modal", "quirk.phone-empty-block"}
SOURCE_TAGS = {".jsx": "clone-component", ".css": "clone-stylesheet", ".md": "measured-spec"}

CHROME_HEAD = ("shell.navbar", "shell.lead-header", "shell.lab-nav")
CHROME_TAIL = ("shell.footer", "shell.legal-row")
CLOSERS = ("cta.main", "cta.demo-form", "cta.newsletter", "cta.lab-newsletter")
NO_HERO_TEMPLATES = {"template.conversations-index", "template.conversation-detail", "template.legal"}
ADJACENT_OK = {"feature.media-row", "lab.statement", "content.transcript-chapter", "content.legal-section"}
SCROLL_JACKING = {"sticky-step-switch", "hscroll-scrub"}
LOREM = re.compile(r"\b(lorem|ipsum|dolor|consectetur|adipiscing|eiusmod|tempor|incididunt)\b", re.I)
PLACEHOLDER_START = re.compile(r"^\s*(placeholder|lorem)\b", re.I)


def _load(rel):
    with open(os.path.join(DR, rel), encoding="utf-8") as f:
        return json.load(f)


def load_repo():
    sections = {}
    for f in sorted(glob.glob(os.path.join(DR, "sections", "*.json"))):
        d = json.load(open(f, encoding="utf-8"))
        sections[d["typeId"]] = d
    mv = _load("extraction/measured-values.json")
    tpls = _load("templates/templates.json")
    return {
        "schema": _load("schema/pagespec.schema.json"),
        "templates": tpls["templates"],
        "routing": tpls["routing"],
        "graph": _load("compatibility/graph.json"),
        "assets": _load("assets/asset-roles.json")["roles"],
        "quotes": {q["sha256"]: q for q in _load("assets/verified-quotes.json")["quotes"]},
        "quoteKeys": {(q["sha256"], q["person"]) for q in _load("assets/verified-quotes.json")["quotes"]},
        "recipes": _load("tokens/10-semantic/motion.json")["motion"]["recipe"],
        "sections": sections,
        "allRoutes": {r for t in tpls["templates"].values() for r in t["routes"]},
        "quirks": mv["quirks"],
        "citations": mv["citations"],
        "classification": _load("schema/section-classification.json"),
        "contractSchema": _load("schema/section-contract.schema.json"),
        "sourceBrand": _load("assets/asset-roles.json")["sourceBrand"],
        "sourceHashes": {k: set(v) for k, v in _load("assets/source-copy-hashes.json").items() if isinstance(v, list)},
    }


def words(s):
    return len(re.findall(r"\S+", s))


def norm_quote(s):
    return re.sub(r"\s+", " ", s).strip()


# ------------------------------------------------------------------ layer 2
def constraint_route(doc, tpl):
    """Route whose per-route constraints (nav override, route variants / node rules) apply. A reference page is bound to its real route;
    a generated page may live at any non-brand route and then inherits the template's first (canonical) route's constraints."""
    r = doc.get("route")
    if doc.get("mode") == "generated" and tpl and r not in tpl["routes"]:
        return tpl["routes"][0]
    return r


def check_template(doc, repo, out):
    tpl = repo["templates"].get(doc.get("template"))
    if tpl is None:
        out.append(("error", "TEMPLATE", f"unknown template {doc.get('template')!r}"))
        return None
    if doc.get("mode") != "generated" and doc.get("route") not in tpl["routes"]:
        out.append(("error", "ROUTE", f"route {doc.get('route')!r} is not served by {tpl['id']} (routes: {tpl['routes']})"))
    tnodes = tpl["nodes"]
    used = [0] * len(tnodes)
    ptr = 0
    for j, nd in enumerate(doc.get("nodes", [])):
        typ, var = nd.get("type"), nd.get("variant")
        match = None
        for k in range(ptr, len(tnodes)):
            t = tnodes[k]
            if t["section"] == typ and var in t["variants"] and (used[k] == 0 or t["repeatable"]):
                match = k
                break
        if match is None:
            same_type = [k for k, t in enumerate(tnodes) if t["section"] == typ]
            if not same_type:
                out.append(("error", "TEMPLATE_NODES", f"nodes[{j}] {typ} is not in {tpl['id']}'s node list"))
            elif not any(var in tnodes[k]["variants"] for k in same_type):
                allowed = sorted({v for k in same_type for v in tnodes[k]["variants"]})
                out.append(("error", "TEMPLATE_NODES", f"nodes[{j}] ({typ}, {var}) variant not allowed in {tpl['id']} (allowed {allowed})"))
            elif all(used[k] and not tnodes[k]["repeatable"] for k in same_type if var in tnodes[k]["variants"]):
                out.append(("error", "TEMPLATE_NODES", f"nodes[{j}] ({typ}, {var}) appears more often than {tpl['id']} allows"))
            else:
                out.append(("error", "TEMPLATE_ORDER", f"nodes[{j}] ({typ}, {var}) is out of order for {tpl['id']} (expected order {[t['section'] for t in tnodes]})"))
            continue
        used[match] += 1
        ptr = match if tnodes[match]["repeatable"] else match + 1
    for k, t in enumerate(tnodes):
        if t["required"] and used[k] == 0:
            out.append(("error", "TEMPLATE_NODES", f"required node ({t['section']}, {t['variants']}) missing for {tpl['id']}"))
    return tpl


# ------------------------------------------------------------------ helpers
def walk(x, fn, path="", parent=None):
    if isinstance(x, dict):
        fn(x, path, parent)
        for k, v in x.items():
            walk(v, fn, f"{path}.{k}", x)
    elif isinstance(x, list):
        for i, v in enumerate(x):
            walk(v, fn, f"{path}[{i}]", parent)


def hrefs(x, path=""):
    found = []
    if isinstance(x, dict):
        for k, v in x.items():
            if k in ("href", "linkedin", "x") and isinstance(v, str):
                found.append((f"{path}.{k}", v))
            else:
                found += hrefs(v, f"{path}.{k}")
    elif isinstance(x, list):
        for i, v in enumerate(x):
            found += hrefs(v, f"{path}[{i}]")
    return found


# ------------------------------------------------------------------ layer 3
def check_graph_rules(doc, repo, tpl, out):
    nodes = doc.get("nodes", [])
    types = [n.get("type") for n in nodes]
    gen = doc.get("mode") == "generated"
    route = constraint_route(doc, tpl)
    tid = doc.get("template")
    cons = (tpl or {}).get("constraints", {})
    routing = repo["routing"]
    ovr = routing["navOverrides"].get(route, {})
    sev = {r["id"]: r["severity"] for r in repo["graph"]["rules"]}

    def add(rule, msg):
        out.append((sev.get(rule, "error"), rule, msg))

    # NAV_FIRST / FOOTER_LAST
    heads = [t for t in types if t in CHROME_HEAD]
    if not types or types[0] not in CHROME_HEAD or len(heads) != 1:
        add("NAV_FIRST", f"exactly one chrome head {CHROME_HEAD} must be the first node (got {heads})")
    tails = [t for t in types if t in CHROME_TAIL]
    if not types or types[-1] not in CHROME_TAIL or len(tails) != 1:
        add("FOOTER_LAST", f"exactly one chrome tail {CHROME_TAIL} must be the last node (got {tails})")
    # CHROME_MATCHES_ROUTE
    want_head, want_tail = ("shell.lead-header", "shell.legal-row") if ovr.get("hideChrome") else ("shell.lab-nav", "shell.footer") if ovr.get("hideNav") else ("shell.navbar", "shell.footer")
    if types and (types[0] != want_head or types[-1] != want_tail):
        add("CHROME_MATCHES_ROUTE", f"route {route} renders {want_head} ... {want_tail} (src/routes.js NAV_OVERRIDES); got {types[0]} ... {types[-1]}")
    # NAV_OVERRIDE
    for n in nodes:
        if n.get("type") != "shell.navbar":
            continue
        c = n.get("content", {})
        want_state = "forced-scrolled" if ovr.get("forceScrolled") else "auto"
        want_cta = {"label": ovr.get("ctaLabel", routing["defaultNavCta"]["label"]), "href": ovr.get("ctaHref", routing["defaultNavCta"]["href"])}
        want_var = "careers-cta" if "ctaLabel" in ovr else "forced-scrolled" if ovr.get("forceScrolled") else "standard"
        if c.get("state") != want_state:
            add("NAV_OVERRIDE", f"navbar state {c.get('state')!r} but route {route} requires {want_state!r}")
        if c.get("cta") != want_cta and not gen:
            add("NAV_OVERRIDE", f"navbar cta {c.get('cta')} but route {route} requires {want_cta}")
        if n.get("variant") != want_var:
            add("NAV_OVERRIDE", f"navbar variant {n.get('variant')!r} but route {route} requires {want_var!r}")
    # ONE_HERO / HERO_AFTER_CHROME
    heroes = [i for i, t in enumerate(types) if t and t.startswith("hero.")]
    if tid in NO_HERO_TEMPLATES:
        if heroes:
            add("ONE_HERO", f"{tid} is a hero-less template (named exception) but has {len(heroes)} hero node(s)")
    elif len(heroes) != 1:
        add("ONE_HERO", f"exactly one hero.* node required, found {len(heroes)}")
    if heroes and heroes[0] != 1:
        add("HERO_AFTER_CHROME", f"the hero must directly follow the chrome head (index 1), found at {heroes[0]}")
    # ONE_PER_PAGE / MAX_PER_PAGE
    for t in sorted(set(types)):
        sec = repo["sections"].get(t)
        if not sec:
            continue
        c = types.count(t)
        if sec["constraints"].get("onePerPage") and c > 1:
            add("ONE_PER_PAGE", f"{t} appears {c} times (onePerPage)")
        mx = sec["constraints"].get("maxPerPage")
        if mx is not None and c > mx:
            add("MAX_PER_PAGE", f"{t} appears {c} times (maxPerPage {mx})")
    # NO_ADJACENT_SAME_SECTION
    for a, b in zip(types, types[1:]):
        if a == b and a not in ADJACENT_OK:
            add("NO_ADJACENT_SAME_SECTION", f"{a} directly follows itself (allowed only for {sorted(ADJACENT_OK)})")
    # CTA_CLOSES_PAGE
    closers = [i for i, t in enumerate(types) if t in CLOSERS]
    if closers and types and types[-1] in CHROME_TAIL:
        last = closers[-1]
        between = types[last + 1:-1]
        if any(t != "overlay.partner-modal" for t in between):
            add("CTA_CLOSES_PAGE", f"{types[last]} must be the last content node before {types[-1]} (only overlay.partner-modal may sit between); found {between}")
    # QUIRK_REGISTERED
    for t in types:
        sec = repo["sections"].get(t)
        allowed = (sec or {}).get("constraints", {}).get("allowedTemplatesOnly")
        if allowed is not None and tid not in allowed:
            add("QUIRK_REGISTERED", f"{t} is a registered live-site quirk allowed only on {allowed}, not {tid}")
    # OUT_OF_SCOPE_ROUTE / LINK_TARGETS
    oos = routing["outOfScopePrefixes"]
    if not gen and any(route == p or (route or "").startswith(p + "/") for p in oos):
        add("OUT_OF_SCOPE_ROUTE", f"route {route} is deliberately out of scope (must not be recreated; link to live siena.cx)")
    allowed_hosts = set(routing["externalHostAllowlist"])
    for n in nodes:
        for path, h in hrefs(n.get("content", {}), f"nodes[{n.get('id')}]"):
            if gen:
                continue  # generated hrefs are restricted by the schema (internal or reserved hosts) and scanned by GENERATED_MODE_SOURCE_URL
            if h.startswith("/"):
                p = h.split("#", 1)[0]
                if any(p == o or p.startswith(o + "/") for o in oos):
                    add("OUT_OF_SCOPE_ROUTE", f"{path}: {h} points at an out-of-scope section locally; use https://www.siena.cx{p}")
                elif p not in repo["allRoutes"]:
                    add("LINK_TARGETS", f"{path}: {h} is not a modelled route")
            elif h.startswith("https://"):
                host = urlparse(h).netloc
                if host not in allowed_hosts:
                    add("LINK_TARGETS", f"{path}: external host {host!r} not in the allowlist")
    # FORMS_STATIC / EMBED_ALLOWLIST / ASSET_ROLE_USAGE
    embeds = []

    def visit_node(n):
        def fn(d, path, parent):
            if "submitBehavior" in d and d["submitBehavior"] != "none":
                add("FORMS_STATIC", f"{path}: submitBehavior must be 'none' (forms are static look-alikes)")
            r = d.get("assetRole")
            if isinstance(r, str):
                role = repo["assets"].get(r)
                if role is None:
                    add("ASSET_ROLE_USAGE", f"{path}: unknown assetRole {r!r}")
                elif n.get("type") not in role["usedBy"]:
                    add("ASSET_ROLE_USAGE", f"{path}: role {r!r} not allowed in {n.get('type')} (usedBy {role['usedBy']})")
                if r == "embed.youtube":
                    embeds.append((n.get("type"), path))
        walk(n.get("content", {}), fn, f"nodes[{n.get('id')}]")
    for n in nodes:
        visit_node(n)
    if len(embeds) > 1 or any(t != "media.video-embed" for t, _ in embeds):
        add("EMBED_ALLOWLIST", f"external embeds allowed only once, in media.video-embed; found {embeds}")
    # QUOTE_PROVENANCE / PLACEHOLDER_MARKED (reference pages: verified-vs-placeholder; generated pages: GENERATED_MODE_QUOTE / _PLACEHOLDER_COPY)
    for n in ([] if gen else nodes):
        def fn(d, path, parent):
            if set(d) == {"text", "source"} and d.get("source") in ("verified", "placeholder"):
                text = d["text"]
                if d["source"] == "placeholder":
                    if not PLACEHOLDER_START.match(text):
                        add("QUOTE_PROVENANCE", f"{path}: placeholder quote must start with 'Placeholder' (never a fabricated quote attributed to a real person)")
                else:
                    h = hashlib.sha256(norm_quote(text).encode("utf-8")).hexdigest()
                    person = (parent or {}).get("name") or (parent or {}).get("company")
                    if h not in repo["quotes"]:
                        add("QUOTE_PROVENANCE", f"{path}: 'verified' quote does not match any registered verbatim quote (assets/verified-quotes.json)")
                    elif (h, person) not in repo["quoteKeys"]:
                        add("QUOTE_PROVENANCE", f"{path}: verified quote is registered for {repo['quotes'][h]['person']!r}, not {person!r}")
            if set(d) == {"text", "copySource"}:
                text, src = d["text"], d["copySource"]
                if src == "placeholder" and not PLACEHOLDER_START.match(text):
                    add("PLACEHOLDER_MARKED", f"{path}: copySource placeholder text must start with 'Placeholder'/'Lorem'")
                elif src == "real-opening-placeholder-tail" and not LOREM.search(text):
                    add("PLACEHOLDER_MARKED", f"{path}: real-opening-placeholder-tail text must carry the lorem tail")
                elif src == "real" and LOREM.search(text):
                    add("PLACEHOLDER_MARKED", f"{path}: copySource real but the text contains placeholder vocabulary")
        walk(n.get("content", {}), fn, f"nodes[{n.get('id')}]")
    # TESTIMONIAL_SET / TESTIMONIAL_SET_COUNT
    tset = None if gen else cons.get("testimonialSet")  # the homepage set is the source's verified quotes: meaningless for a generated page
    if tset:
        for n in nodes:
            if n.get("type") == "testimonials.slider":
                slides = n.get("content", {}).get("slides", [])
                bad = [i for i, s in enumerate(slides) if s.get("quote", {}).get("source") != "verified"]
                if bad:
                    add("TESTIMONIAL_SET", f"{tid} reuses the verified homepage set; slides {bad} are not verified")
                if len(slides) != tset["expectedCount"]:
                    add("TESTIMONIAL_SET_COUNT", f"{tid} shows {tset['expectedCount']} slides on the live site; this PageSpec has {len(slides)}")
    # ROUTE_VARIANT / ROUTE_NODE_RULES
    for sec_id, var in cons.get("routeVariants", {}).get(route, {}).items():
        for n in nodes:
            if n.get("type") == sec_id and n.get("variant") != var:
                add("ROUTE_VARIANT", f"route {route} binds {sec_id} to variant {var!r}, got {n.get('variant')!r}")
    rr = cons.get("routeNodeRules", {}).get(route, {})
    for s in rr.get("require", []):
        if s not in types:
            add("ROUTE_NODE_RULES", f"route {route} requires {s}")
    for s in rr.get("forbid", []):
        if s in types:
            add("ROUTE_NODE_RULES", f"route {route} must not render {s}")
    # REPEAT_COUNTS
    for s, (lo, hi) in cons.get("repeatCounts", {}).items():
        c = types.count(s)
        if not lo <= c <= hi:
            add("REPEAT_COUNTS", f"{s} appears {c} times; {tid} allows {lo}-{hi}")
    # VARIANT_RULES
    for n in nodes:
        check_variant_rules(n, add)
    # MOTION_BUDGET
    jack = [n.get("id") for n in nodes if n.get("motion", {}).get("pattern") in SCROLL_JACKING]
    if len(jack) > 1:
        add("MOTION_BUDGET", f"{len(jack)} scroll-jacking sections on one page {jack} (no real route has more than one)")
    # UNIQUE_IDS
    ids = [n.get("id") for n in nodes]
    if len(set(ids)) != len(ids):
        add("UNIQUE_IDS", f"duplicate node ids {sorted({i for i in ids if ids.count(i) > 1})}")
    # CHAPTER_PARITY: the chapters index lists exactly the transcript chapters that follow it
    for ci in [n for n in nodes if n.get("type") == "content.article-chapter-index"]:
        listed = [c.get("title") for c in ci.get("content", {}).get("chapters", [])]
        got = [n.get("content", {}).get("chapter") for n in nodes if n.get("type") == "content.transcript-chapter"]
        if listed != got:
            add("CHAPTER_PARITY", f"chapters index lists {len(listed)} chapter(s) {listed[:3]}... but the page has {len(got)} transcript chapter(s) {got[:3]}...; titles and order must match")
    # MODAL_OPENER
    if "overlay.partner-modal" in types:
        openers = [n for n in nodes if n.get("type") == "hero.partner" and n.get("content", {}).get("cta", {}).get("action") == "open-modal"]
        if not openers:
            add("MODAL_OPENER", "overlay.partner-modal needs a hero.partner whose cta opens it")


def check_variant_rules(n, add):
    t, v, c = n.get("type"), n.get("variant"), n.get("content", {})
    if t == "testimonials.slider":
        has_title = "title" in c or "eyebrow" in c
        if v == "titled" and not ("title" in c and "eyebrow" in c):
            add("VARIANT_RULES", f"{n.get('id')}: titled slider needs eyebrow and title")
        if v != "titled" and has_title:
            add("VARIANT_RULES", f"{n.get('id')}: only the titled slider carries an eyebrow/title")
        if v == "panel-static" and (len(c.get("slides", [])) != 1 or n.get("motion", {}).get("pattern") != "none"):
            add("VARIANT_RULES", f"{n.get('id')}: panel-static is exactly one slide with motion 'none'")
        if v != "panel-static" and n.get("motion", {}).get("pattern") == "none" and len(c.get("slides", [])) > 1:
            add("VARIANT_RULES", f"{n.get('id')}: multi-slide sliders use slide-horizontal")
    elif t == "feature.sticky-scroll":
        blocks = c.get("blocks", [])
        ctas = [("cta" in b) for b in blocks]
        if v == "home" and (len(blocks) != 3 or not all(ctas)):
            add("VARIANT_RULES", f"{n.get('id')}: home sticky scroll is 3 blocks, each with a CTA")
        if v == "compare" and (len(blocks) != 4 or ctas != [False, False, False, True]):
            add("VARIANT_RULES", f"{n.get('id')}: compare sticky scroll is 4 blocks with a CTA only on the last")
        if v == "addons" and (len(blocks) != 3 or not all(ctas) or not all(all(isinstance(x, dict) and "lead" in x for x in b.get("bullets", [])) for b in blocks)):
            add("VARIANT_RULES", f"{n.get('id')}: add-ons sticky scroll is 3 blocks, each with a CTA and bold-lead bullets")
        if v == "docs-single" and len(blocks) != 1:
            add("VARIANT_RULES", f"{n.get('id')}: docs-single has exactly one block")
        if v == "shopping-steps" and len(blocks) != 3:
            add("VARIANT_RULES", f"{n.get('id')}: shopping-steps has exactly three steps")
    elif t == "integrations.logo-grid":
        if v in ("home", "compare") and "cta" not in c:
            add("VARIANT_RULES", f"{n.get('id')}: {v} integrations keep the 'Explore all integrations' CTA")
        if v in ("insights", "about-investors", "partner-groups") and "cta" in c:
            add("VARIANT_RULES", f"{n.get('id')}: {v} integrations have no CTA")
        groups = c.get("groups", [])
        if v == "partner-groups" and (len(groups) != 2 or not all("label" in g for g in groups)):
            add("VARIANT_RULES", f"{n.get('id')}: partner-groups is exactly two labelled groups")
        if v != "partner-groups" and len(groups) != 1:
            add("VARIANT_RULES", f"{n.get('id')}: {v} integrations have a single unlabelled group")
    elif t == "hero.home":
        rows = c.get("tickerRows", [])
        if v == "home" and (len(rows) != 2 or "phoneHeadline" not in c):
            add("VARIANT_RULES", f"{n.get('id')}: home hero has two ticker rows and a phone headline")
        if v == "addons" and (len(rows) != 1 or "subtitleSecondary" not in c):
            add("VARIANT_RULES", f"{n.get('id')}: add-ons hero has one ticker row and a second subtitle line")
    elif t == "cta.main":
        b = c.get("button", {})
        if v == "metrics-image" and b.get("action") != "open-modal":
            add("VARIANT_RULES", f"{n.get('id')}: metrics-image CTA opens the partner modal")
        if v != "metrics-image" and (b.get("action") != "navigate" or "href" not in b):
            add("VARIANT_RULES", f"{n.get('id')}: CTA button navigates (href required)")


# ------------------------------------------------------------------ layer 4
def walk_maxwords(schema, inst, path, out):
    if not isinstance(schema, dict):
        return
    if isinstance(inst, str) and "maxWords" in schema:
        n = words(inst)
        if n > schema["maxWords"]:
            out.append(("error", "MAX_WORDS", f"{path}: {n} words exceeds maxWords {schema['maxWords']}"))
    elif isinstance(inst, dict) and "properties" in schema:
        for k, v in inst.items():
            if k in schema["properties"]:
                walk_maxwords(schema["properties"][k], v, f"{path}.{k}", out)
    elif isinstance(inst, list) and "items" in schema:
        for i, v in enumerate(inst):
            walk_maxwords(schema["items"], v, f"{path}[{i}]", out)


def validate_pagespec(doc, repo=None):
    repo = repo or load_repo()
    out = []
    v = jsonschema.Draft7Validator(repo["schema"])
    for e in sorted(v.iter_errors(doc), key=lambda e: [str(p) for p in e.path]):
        out.append(("error", "SCHEMA", f"{'/'.join(str(p) for p in e.path) or '<root>'}: {e.message[:200]}"))
    if out:
        return out
    tpl = check_template(doc, repo, out)
    check_graph_rules(doc, repo, tpl, out)
    gen = doc["mode"] == "generated"
    for n in doc["nodes"]:
        try:
            model = BS.generated_model(repo["sections"][n["type"]], repo["assets"]) if gen else repo["sections"][n["type"]]["contentModel"]
        except (ValueError, KeyError) as e:
            out.append(("error", "GENERATED_ROLES", f"{n['type']}: the generated content model cannot be derived: {e}"))
            continue
        walk_maxwords(model, n["content"], f"nodes[{n['id']}]", out)
    walk_maxwords(repo["schema"]["definitions"]["head"], doc["head"], "head", out)
    if gen:
        check_generated(doc, repo, out)
    return out


# ------------------------------------------------------------------ mode "generated"
def _brand_res(repo):
    """Compiled source-identity patterns (cached on the repo dict). Matching is case-insensitive; a pattern may scope (?-i:...)."""
    if "_res" not in repo:
        sb = repo["sourceBrand"]
        comp = lambda pats: re.compile("|".join(f"(?:{p})" for p in pats), re.I) if pats else None  # noqa: E731
        repo["_res"] = {
            "GENERATED_MODE_SOURCE_BRAND": comp(sb["brand"]["patterns"]),
            "GENERATED_MODE_SOURCE_URL": comp(sb["urls"]["hostPatterns"] + sb["urls"]["personalHandlePatterns"]),
            "GENERATED_MODE_SOURCE_PERSON": comp(sb["people"]["patterns"]),
            "GENERATED_MODE_SOURCE_CUSTOMER": comp(sb["customers"]["patterns"]),
            "GENERATED_MODE_THIRD_PARTY": comp(sb["thirdPartyPlatforms"]["patterns"]),
        }
    return repo["_res"]


COPY_WORDS = re.compile(r"[a-z0-9]+(?:'[a-z]+)?")
URL_ANY = re.compile(r"https?://([A-Za-z0-9.-]+)", re.I)


def _norm_words(s):
    s = s.lower().replace("\u2019", "'").replace("\u2018", "'")
    return COPY_WORDS.findall(re.sub(r"\*|_|`", " ", s))


def _h16(s):
    return hashlib.sha256(s.encode("utf-8")).hexdigest()[:16]


def text_leaves(x, path="", skip=STRUCTURAL_KEYS):
    """Every human-readable string of a PageSpec subtree: (path, text). Structural vocabulary keys and motion are skipped."""
    if isinstance(x, dict):
        for k, v in x.items():
            if k in skip or k == "motion":
                continue
            yield from text_leaves(v, f"{path}.{k}", skip)
    elif isinstance(x, list):
        for i, v in enumerate(x):
            yield from text_leaves(v, f"{path}[{i}]", skip)
    elif isinstance(x, str):
        yield path, x


def check_generated(doc, repo, out):
    """GENERATED_MODE_* rules: a generated page is a different brand and must carry nothing of the source."""
    res = _brand_res(repo)
    sb = repo["sourceBrand"]
    hashes = repo["sourceHashes"]
    add = lambda rule, msg, sev="error": out.append((sev, rule, msg))  # noqa: E731
    leaves = [("id", doc.get("id", "")), ("route", doc.get("route", ""))]
    leaves += [(f"head.{k}", v) for k, v in doc.get("head", {}).items() if isinstance(v, str)]
    for n in doc.get("nodes", []):
        leaves.append((f"nodes[{n.get('id')}].id", n.get("id", "")))
        leaves += list(text_leaves(n.get("content", {}), f"nodes[{n.get('id')}]"))
    reserved = tuple(sb["urls"]["reservedHostSuffixes"])
    for path, raw in leaves:
        text = raw if not re.fullmatch(r"[a-z0-9/#._:-]+", raw) else re.sub(r"[-_/.]+", " ", raw) + " " + raw  # slugs, routes and ids: hyphens are word breaks
        for rule in ("GENERATED_MODE_SOURCE_BRAND", "GENERATED_MODE_SOURCE_URL", "GENERATED_MODE_SOURCE_PERSON", "GENERATED_MODE_SOURCE_CUSTOMER"):
            m = res[rule].search(text) if res[rule] else None
            if m:
                add(rule, f"{path}: names the source ({m.group(0)!r}); a generated page is a different brand")
        m = res["GENERATED_MODE_THIRD_PARTY"].search(text) if res["GENERATED_MODE_THIRD_PARTY"] else None
        if m:
            add("GENERATED_MODE_THIRD_PARTY", f"{path}: names {m.group(0)!r}, a third-party product the source mentions (allowed, but check it is intended)", "warn")
        for host in URL_ANY.findall(text):
            host = host.lower().rstrip(".")
            if not host.endswith(reserved) and not res["GENERATED_MODE_SOURCE_URL"].search(host):
                add("GENERATED_MODE_EXTERNAL_URL", f"{path}: real URL host {host!r}; use a reserved .example/.invalid host")
        w = _norm_words(text)
        if len(w) >= sb["copy"]["shingleWords"]:
            hit = next((" ".join(w[i:i + sb["copy"]["shingleWords"]]) for i in range(len(w) - sb["copy"]["shingleWords"] + 1) if _h16(" ".join(w[i:i + sb["copy"]["shingleWords"]])) in hashes["copyShingles"]), None)
            if hit:
                add("GENERATED_MODE_SOURCE_COPY", f"{path}: reproduces source marketing copy (5-word run {hit!r}); write original copy")
        if LOREM.search(text):
            add("GENERATED_MODE_PLACEHOLDER_COPY", f"{path}: lorem filler is not original copy; generated pages carry generated copy")
    # asset roles: availability, per-section list, asset file
    for n in doc.get("nodes", []):
        sec = repo["sections"].get(n.get("type"))
        allowed = (sec or {}).get("generatedAssetRoles", [])

        def fn(d, path, parent):
            r = d.get("assetRole")
            if isinstance(r, str):
                spec = repo["assets"].get(r)
                if spec is not None and spec.get("availability") != "generation-safe":
                    subs = ", ".join(spec.get("generationSafeSubstitutes", [])) or "none: omit the slot"
                    add("GENERATED_MODE_REFERENCE_ASSET", f"{path}: role {r!r} is {spec.get('availability')} and cannot appear in a generated page (use: {subs})")
                elif r not in allowed:
                    add("GENERATED_MODE_ROLE", f"{path}: role {r!r} is not a generated-mode role of {n.get('type')} (allowed: {', '.join(allowed) or 'none'})")
            ref = d.get("assetRef")
            if isinstance(ref, str):
                stem = os.path.splitext(ref.rsplit("/", 1)[-1])[0].lower()
                if _h16(stem) in hashes["assetStems"]:
                    add("GENERATED_MODE_ASSET_REF", f"{path}: assetRef {ref!r} is a file of the source (screenshot / media reuse)")
                if ref.split("/", 1)[0] not in sb["assets"]["allowedRefPrefixes"]:
                    add("GENERATED_MODE_ASSET_REF", f"{path}: assetRef {ref!r} must be under {sb['assets']['allowedRefPrefixes']}")
            if set(d) == {"text", "source"}:
                if d["source"] != "generated":
                    add("GENERATED_MODE_QUOTE", f"{path}: quote source {d['source']!r}; a generated page carries only generated quotes")
                if hashlib.sha256(norm_quote(d["text"]).encode("utf-8")).hexdigest() in repo["quotes"]:
                    add("GENERATED_MODE_QUOTE", f"{path}: reproduces a verified quote of a real person")
        walk(n.get("content", {}), fn, f"nodes[{n.get('id')}]")


# ------------------------------------------------------------------ section contracts
def _source_tag(file):
    if file == "src/routes.js":
        return "clone-config"
    for ext, tag in SOURCE_TAGS.items():
        if file.endswith(ext):
            return tag
    return "clone-data" if file.endswith(".js") else None


def _names(x, out):
    if isinstance(x, dict):
        for k, v in x.items():
            if k == "properties" and isinstance(v, dict):
                for kk, vv in v.items():
                    out.add(kk)
                    _names(vv, out)
            else:
                _names(v, out)
    elif isinstance(x, list):
        for v in x:
            _names(v, out)


def validate_section_contract(c, repo=None):
    """Meta-layer findings for ONE section contract: (severity, rule, message) tuples."""
    repo = repo or load_repo()
    out = []
    t = c.get("typeId", "?")
    pol = repo["classification"]
    for e in sorted(jsonschema.Draft7Validator(repo["contractSchema"]).iter_errors(c), key=lambda e: [str(p) for p in e.path]):
        out.append(("error", "CONTRACT_SCHEMA", f"{t}: {'/'.join(str(p) for p in e.path) or '<root>'}: {e.message[:160]}"))
    if out:
        return out
    # retrieval eligibility: pinned per section, independent of the flag a contract carries
    want = t not in RETRIEVAL_INELIGIBLE
    if c["retrievalEligible"] is not want:
        out.append(("error", "RETRIEVAL_PINNED", f"{t}: retrievalEligible is {c['retrievalEligible']} but the validator pins it to {want} (RETRIEVAL_INELIGIBLE = {sorted(RETRIEVAL_INELIGIBLE)})"))
    segs = set(t.replace("-", ".").split("."))
    hit = sorted(segs & set(pol["utilityIdSegments"]))
    if hit and c["retrievalEligible"]:
        out.append(("error", "RETRIEVAL_PINNED", f"{t}: id segment(s) {hit} mark a utility/runtime section (cookie/consent/dialog/modal/overlay...), which must be retrievalEligible false"))
    # provenance (source) and taxonomy (semantic) are distinct closed objects
    sem, src = c["semantic"], c["source"]
    if sem["id"] != "semantic." + t:
        out.append(("error", "SOURCE_SEMANTIC", f"{t}: semantic.id {sem['id']!r} must be 'semantic.{t}'"))
    if sem["category"] != c["category"]:
        out.append(("error", "SOURCE_SEMANTIC", f"{t}: semantic.category {sem['category']!r} != category {c['category']!r}"))
    if src["id"] == sem["id"] or src["id"].split(".", 1)[1] == sem["id"].split(".", 1)[1]:
        out.append(("error", "SOURCE_SEMANTIC", f"{t}: source.id and semantic.id must be different identities (provenance vs taxonomy)"))
    if src["id"] != "source." + src["citation"]:
        out.append(("error", "SOURCE_SEMANTIC", f"{t}: source.id {src['id']!r} must be 'source.{src['citation']}'"))
    if src["citation"] not in c["measuredFrom"]:
        out.append(("error", "SOURCE_SEMANTIC", f"{t}: source.citation {src['citation']!r} is not one of the contract's measuredFrom ids"))
    cit = repo["citations"].get(src["citation"])
    if cit is None:
        out.append(("error", "SOURCE_SEMANTIC", f"{t}: source.citation {src['citation']!r} is not defined in extraction/measured-values.json"))
    else:
        if (cit["file"], cit["lines"]) != (src["file"], src["lines"]):
            out.append(("error", "SOURCE_SEMANTIC", f"{t}: source file/lines {src['file']}:{src['lines']} differ from the citation's {cit['file']}:{cit['lines']}"))
        if _source_tag(src["file"]) != src["tag"]:
            out.append(("error", "SOURCE_SEMANTIC", f"{t}: source.tag {src['tag']!r} does not match the cited file {src['file']} ({_source_tag(src['file'])!r})"))
    # generated-mode asset roles: closed, generation-safe, and exactly what the generated content model derives
    gen_roles = c["generatedAssetRoles"]
    for r in gen_roles:
        spec = repo["assets"].get(r)
        if spec is None:
            out.append(("error", "GENERATED_ROLES", f"{t}: generatedAssetRoles names unknown role {r!r}"))
        elif spec["availability"] != "generation-safe":
            out.append(("error", "GENERATED_ROLES", f"{t}: generatedAssetRoles lists {r!r}, which is {spec['availability']}"))
    try:
        derived = BS.derived_generated_roles(c, repo["assets"])
    except (ValueError, KeyError) as e:
        out.append(("error", "GENERATED_ROLES", f"{t}: the generated content model cannot be derived: {e}"))
    else:
        if sorted(gen_roles) != derived:
            out.append(("error", "GENERATED_ROLES", f"{t}: generatedAssetRoles {sorted(gen_roles)} != the roles its generated content model derives {derived}"))
    # classification policy
    prefix = t.split(".", 1)[0]
    cat = c["category"]
    want_cat = pol["idPrefixCategory"].get(prefix)
    if want_cat and cat not in want_cat:
        out.append(("error", "CLASS_POLICY", f"{t}: id prefix {prefix!r} requires category {want_cat}, got {cat!r}"))
    if cat == "hero" and prefix != "hero":
        out.append(("error", "CLASS_POLICY", f"{t}: category hero is only for hero.* sections"))
    if cat == "conversion" and prefix not in pol["conversionCategoryOnlyForPrefixes"]:
        out.append(("error", "CLASS_POLICY", f"{t}: conversion blocks must be cta.* / overlay.* (got prefix {prefix!r})"))
    if cat == "feature" and prefix in pol["editorialPrefixesNeverFeature"]:
        out.append(("error", "CLASS_POLICY", f"{t}: editorial/news/proof prefix {prefix!r} must not be classed feature"))
    if cat not in ("conversion", "hero", "shell"):
        names = set()
        _names(c["contentModel"], names)
        ctas = sorted(names & set(pol["ctaPropertyNames"]))
        if ctas:
            why = pol["inlineCtaReviewed"].get(t)
            if not why or len(why) < 30:
                out.append(("error", "CLASS_POLICY", f"{t}: CTA-like field(s) {ctas} in a {cat} section; class it cta.*/conversion or add a reviewed entry (>= 30 chars) to inlineCtaReviewed"))
    return out


def main(argv):
    files = [a for a in argv if not a.startswith("--")]
    if not files:
        print(__doc__)
        return 2
    repo = load_repo()
    bad = 0
    for f in files:
        res = validate_pagespec(json.load(open(f, encoding="utf-8")), repo)
        errs = [r for r in res if r[0] == "error"]
        for sev, rule, msg in res:
            print(f"  {sev.upper():5} {rule}: {msg}")
        print(f"{f}: {len(errs)} error(s), {len(res) - len(errs)} warning(s)")
        bad += bool(errs)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
