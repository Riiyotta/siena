#!/usr/bin/env python3
"""Prove that the drift checks in verify_all.py actually FAIL on bad input.

For each case: copy the repo (plus a FROZEN copy of every source file it cites, so a
concurrent edit of the live clone cannot turn a clean copy into a false failure) into a
fresh OS temp directory, inject exactly one defect, run verify_all.py there, and require a
non-zero exit with the expected [tag] in the output. Finally an untouched scratch copy must
pass the full verify_all.py (adversarial suite included). The live repo is never modified.

Run: python3 extraction/prove_drift.py
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile

DR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARENT = os.path.dirname(DR)
HAVE_SRC = all(os.path.isdir(os.path.join(PARENT, d)) for d in ("src", "specs")) and os.path.exists(os.path.join(PARENT, "CLONE_SPEC.md"))


def scratch():
    tmp = tempfile.mkdtemp(prefix="siena-drift-")
    dst = os.path.join(tmp, "design-repo")
    shutil.copytree(DR, dst, ignore=shutil.ignore_patterns("__pycache__", "*.zip", ".DS_Store"))
    if HAVE_SRC:
        mv = json.load(open(os.path.join(DR, "extraction", "measured-values.json"), encoding="utf-8"))
        for rel in sorted({c["file"] for c in mv["citations"].values()} | {"src/routes.js", "CLONE_SPEC.md", "ia.json", "IA.md", "matrix.csv"}):
            s = os.path.join(PARENT, rel)
            if os.path.exists(s):
                os.makedirs(os.path.dirname(os.path.join(tmp, rel)), exist_ok=True)
                shutil.copy2(s, os.path.join(tmp, rel))
    return tmp, dst


def edit(dst, rel, fn):
    p = os.path.join(dst, rel)
    d = json.load(open(p, encoding="utf-8"))
    fn(d)
    json.dump(d, open(p, "w", encoding="utf-8"), indent=2, ensure_ascii=False)


def append(dst, rel, text):
    with open(os.path.join(dst, rel), "a", encoding="utf-8") as f:
        f.write(text)


def run(dst, fast=True):
    cmd = [sys.executable, os.path.join(dst, "extraction", "verify_all.py")] + (["--skip-adversarial"] if fast else [])
    r = subprocess.run(cmd, capture_output=True, text=True)
    return r.returncode, r.stdout + r.stderr


def first_cite(d):
    return sorted(d["citations"])[0]


def wrong_lines(d):
    c = d["citations"]["tw.rainbow"]
    c["lines"] = "1"


def edit_routes_src(dst):
    p = os.path.join(os.path.dirname(dst), "src", "routes.js")
    s = open(p, encoding="utf-8").read().replace("'/about-us': { forceScrolled: true },", "'/about-us': { forceScrolled: false },")
    open(p, "w", encoding="utf-8").write(s)


def ia_text(rel, fn):
    """Edit a sibling IA file (ia.json / IA.md / matrix.csv) in the scratch tree, beside design-repo/."""
    def edit_ia(dst):
        p = os.path.join(os.path.dirname(dst), rel)
        text = open(p, encoding="utf-8").read()
        open(p, "w", encoding="utf-8").write(fn(text))
    return edit_ia


def grow_hero(sh, new_h=3500):
    for n in sh["routes"]["/"]["nodes"]:
        if n["section"] == "hero.home":
            d = new_h - n["heightPx"]
            n["heightPx"] = new_h
            sh["routes"]["/"]["inFlowHeightPx"] += d
            sh["routes"]["/"]["documentHeightPx"] += d


def whitelist_short(sh):
    grow_hero(sh)
    sh["heroWhitelist"].append({"route": "/", "section": "hero.home", "reviewedBy": "someone", "justification": "too short", "maxHeightPx": 4000})


def tamper_hist(d):
    d["foundation"]["color"]["ink"]["900"]["$extensions"]["histogram"] = "textColor:#122023=9999"


CASES = [
    ("phantom allowlist entry", "allowlist-parity", lambda d: edit(d, "tokens/llm/component-allowlist.json", lambda j: j["components"].append("component.ghost"))),
    ("orphan contract (allowlist entry removed)", "allowlist-parity", lambda d: edit(d, "tokens/llm/component-allowlist.json", lambda j: j["sections"].remove("section.cta.main"))),
    ("allowlist settable props drift from the schema", "allowlist-parity", lambda d: edit(d, "tokens/llm/component-allowlist.json", lambda j: j["settableNodeProperties"].append("style"))),
    ("out-of-range citation", "citation", lambda d: edit(d, "extraction/measured-values.json", lambda j: j["citations"]["tw.rainbow"].__setitem__("lines", "99990-99999"))),
    ("in-range but wrong citation", "citation", lambda d: edit(d, "extraction/measured-values.json", wrong_lines)),
    ("cite id used but undefined", "citation", lambda d: edit(d, "sections/cta-main.json", lambda j: j["measuredFrom"].append("spec.ghost"))),
    ("wrong manifest count", "manifest-counts", lambda d: edit(d, "registry.manifest.json", lambda j: j["counts"].__setitem__("sections", 99))),
    ("README counts marker stale", "readme-counts", lambda d: open(os.path.join(d, "README.md"), "w").write(open(os.path.join(d, "README.md")).read().replace('"routes": 35', '"routes": 34'))),
    ("allowlistVersion drift", "version-parity", lambda d: edit(d, "registry.manifest.json", lambda j: j.__setitem__("allowlistVersion", "9.9.9"))),
    ("entryPoint outside the package", "entrypoint", lambda d: edit(d, "registry.manifest.json", lambda j: j["entryPoints"]["evidence"].append("../CLONE_SPEC.md"))),
    ("asset role changed to a different VALID policy", "asset-role", lambda d: edit(d, "assets/asset-roles.json", lambda j: j["roles"]["photo.person-real"].__setitem__("policy", "may-generate-new"))),
    ("logo role relaxed to may-generate-new", "asset-role", lambda d: edit(d, "assets/asset-roles.json", lambda j: j["roles"]["logo.customer"].__setitem__("policy", "may-generate-new"))),
    ("raw hex in a section contract", "raw-value", lambda d: edit(d, "sections/hero-home.json", lambda j: j["constraints"].__setitem__("background", "#F3F0EB"))),
    ("raw px in a component contract", "raw-value", lambda d: edit(d, "components/faq-item.json", lambda j: j["props"].__setitem__("gap", "13px"))),
    ("dangling token reference", "contract-ref", lambda d: edit(d, "primitives/button.json", lambda j: j["tokens"].append("{foundation.space.999}"))),
    ("graph rule with no validator code", "graph-vs-validator", lambda d: edit(d, "compatibility/graph.json", lambda j: j["rules"].append({"id": "GHOST_RULE", "severity": "error", "text": "x"}))),
    ("graph exception prose drops a real exception", "graph-vs-validator", lambda d: edit(d, "compatibility/graph.json", lambda j: [r.__setitem__("text", "Exactly one hero. No exceptions.") for r in j["rules"] if r["id"] == "ONE_HERO"])),
    ("graph adjacency diverges from templates", "graph", lambda d: edit(d, "compatibility/graph.json", lambda j: j["adjacency"]["shell.navbar"]["canPrecede"].append("shell.footer"))),
    ("template references a phantom section", "phantom-ref", lambda d: edit(d, "templates/templates.json", lambda j: j["templates"]["template.legal"]["nodes"].insert(1, {"section": "hero.ghost", "variants": ["x"], "required": True, "repeatable": False}))),
    ("template binds an undefined variant", "phantom-ref", lambda d: edit(d, "templates/templates.json", lambda j: j["templates"]["template.home"]["nodes"][1].__setitem__("variants", ["home", "dark"]))),
    ("route claimed by two templates", "route-coverage", lambda d: edit(d, "templates/templates.json", lambda j: j["templates"]["template.about"]["routes"].append("/careers"))),
    ("out-of-scope route modelled", "route-coverage", lambda d: edit(d, "templates/templates.json", lambda j: j["templates"]["template.legal"]["routes"].append("/blog"))),
    ("NAV_OVERRIDES changed in src/routes.js", "nav-overrides", edit_routes_src),
    ("schema out of date versus a section contract", "schema", lambda d: edit(d, "sections/faq-accordion.json", lambda j: j["contentModel"]["properties"]["items"].__setitem__("maxItems", 9))),
    ("token catalog out of date", "catalog", lambda d: edit(d, "tokens/00-foundation/radius.json", lambda j: j["foundation"]["radius"]["24"].__setitem__("$value", "25px"))),
    ("policy category that is not a catalog key", "token-policy", lambda d: edit(d, "tokens/llm/token-policy.json", lambda j: j["rules"]["rawValueRestrictions"].__setitem__("shadow", "x"))),
    ("histogram evidence falsified on a token", "token-evidence", lambda d: edit(d, "tokens/00-foundation/color.json", tamper_hist)),
    ("broken real example", "example", lambda d: edit(d, "schema/example.pagespec.json", lambda j: j["nodes"].pop(1))),
    # ---- retrieval eligibility, provenance vs taxonomy, classification
    ("partner modal flipped to retrievalEligible true in its contract", "retrieval", lambda d: edit(d, "sections/overlay-partner-modal.json", lambda j: [j.__setitem__("retrievalEligible", True), j.pop("retrievalIneligibleReason")])),
    ("retrievalIneligibleSections entry dropped from the allowlist", "retrieval", lambda d: edit(d, "tokens/llm/component-allowlist.json", lambda j: j["retrievalIneligibleSections"].remove("section.quirk.phone-empty-block"))),
    ("an ordinary section flagged ineligible", "retrieval", lambda d: edit(d, "sections/hero-home.json", lambda j: [j.__setitem__("retrievalEligible", False), j.__setitem__("retrievalIneligibleReason", "Pretend this hero is a utility block so retrieval skips it.")])),
    ("retrievalEligible stored as a string", "section-contract", lambda d: edit(d, "sections/overlay-partner-modal.json", lambda j: j.__setitem__("retrievalEligible", "false"))),
    ("semantic.category drifts from the section category", "section-contract", lambda d: edit(d, "sections/hero-home.json", lambda j: j["semantic"].__setitem__("category", "feature"))),
    ("source.lines no longer match the cited lines", "section-contract", lambda d: edit(d, "sections/hero-home.json", lambda j: j["source"].__setitem__("lines", "1-2"))),
    ("source citation points at an undefined id", "section-contract", lambda d: edit(d, "sections/hero-home.json", lambda j: [j["source"].__setitem__("citation", "jsx.ghost"), j["source"].__setitem__("id", "source.jsx.ghost")])),
    ("conversion promo classed back as a feature", "class-policy", lambda d: edit(d, "sections/cta-agent-promo.json", lambda j: [j.__setitem__("category", "feature"), j["semantic"].__setitem__("category", "feature")])),
    ("unreviewed CTA field added to a feature section", "class-policy", lambda d: edit(d, "sections/features-icon-grid.json", lambda j: j["contentModel"]["properties"].__setitem__("cta", {"type": "object"}))),
    # ---- whole-page-wrapper gate (recorded real heights)
    ("hero measured at 3500px without a review", "wrapper-gate", lambda d: edit(d, "extraction/measured-values.json", lambda j: grow_hero(j["sectionHeights"]))),
    ("whitelisted hero with a too-short justification", "wrapper-gate", lambda d: edit(d, "extraction/measured-values.json", lambda j: whitelist_short(j["sectionHeights"]))),
    ("a route's recorded measurements removed", "wrapper-gate", lambda d: edit(d, "extraction/measured-values.json", lambda j: j["sectionHeights"]["routes"].pop("/pricing"))),
    ("one section's height missing", "wrapper-gate", lambda d: edit(d, "extraction/measured-values.json", lambda j: j["sectionHeights"]["routes"]["/"]["nodes"][2].pop("heightPx"))),
    ("a hero-like block (H1 outside the hero)", "wrapper-gate", lambda d: edit(d, "extraction/measured-values.json", lambda j: [j["sectionHeights"]["routes"]["/"]["nodes"][1].__setitem__("h1Count", 0), j["sectionHeights"]["routes"]["/"]["nodes"][2].__setitem__("h1Count", 1)])),
    ("unrelated routes sharing one template", "wrapper-gate", lambda d: edit(d, "extraction/measured-values.json", lambda j: j["sectionHeights"]["routes"]["/book-a-demo"].update(nodes=[n for n in j["sectionHeights"]["routes"]["/book-a-demo"]["nodes"] if n["section"] != "testimonials.slider"]))),
    # ---- IA parity (ia.json / IA.md / matrix.csv beside design-repo/)
    ("ia.json brings back the superseded legal-document section", "ia-parity", ia_text("ia.json", lambda t: t.replace('"content.legal-section"', '"content.legal-document"', 1))),
    ("ia.json drops a route", "ia-parity", ia_text("ia.json", lambda t: t.replace('"/privacy-policy"', '"/privacy-policy-x"', 1))),
    ("matrix.csv stale (a section row removed)", "ia-parity", ia_text("matrix.csv", lambda t: "\n".join(l for l in t.split("\n") if not l.startswith("content.legal-section,")))),
    ("IA.md stale (section no longer mentioned)", "ia-parity", ia_text("IA.md", lambda t: t.replace("`content.article-faq`", "`content.article-faqq`"))),
    ("machine path in the docs", "abs-path", lambda d: append(d, "README.md", "\n/Us" + "ers/someone/design-repo\n")),
]


def main():
    bad = skipped = 0
    for name, tag, fn in CASES:
        if tag in ("citation", "nav-overrides", "ia-parity") and not HAVE_SRC:
            print(f"SKIPPED {name:52} needs the clone source beside design-repo/")
            skipped += 1
            continue
        tmp, dst = scratch()
        try:
            if tag == "catalog":
                fn(dst)
            else:
                fn(dst)
            code, out = run(dst)
            ok = code != 0 and f"[{tag}]" in out
            print(f"{'CAUGHT' if ok else 'MISSED':7} {name:52} expects [{tag}]" + ("" if ok else "\n" + out[-900:]))
            bad += not ok
        finally:
            shutil.rmtree(tmp, ignore_errors=True)
    tmp, dst = scratch()
    try:
        code, out = run(dst, fast=False)
        ok = code == 0
        print(f"{'PASS' if ok else 'FAIL':7} untouched scratch copy passes the full verify_all.py (incl. adversarial)" + ("" if ok else "\n" + out[-1500:]))
        bad += not ok
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    ran = len(CASES) - skipped
    print(f"drift proof: FAILED ({bad} problem(s))" if bad else f"drift proof: {ran}/{ran} injected defects caught, clean copy passes" + (f" ({skipped} skipped: no sibling source)" if skipped else ""))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
