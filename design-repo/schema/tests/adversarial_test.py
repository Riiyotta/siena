#!/usr/bin/env python3
"""Adversarial suite: every mutation must be REJECTED (with the named rule among its error
findings), every warn-case must WARN without erroring, and every control must PASS with zero
errors.

Controls = the two hand-built real examples + one control synthesized generically for EVERY
template from that template's own node list (schema-driven minimal content + the template's
route/variant bindings). A new template is covered automatically the moment it is added to
templates/templates.json; only rule-specific negative mutations are hand-written.

Run: python3 schema/tests/adversarial_test.py   (exit 0 only if everything behaves)
"""
import copy
import json
import os
import sys

DR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(DR, "schema"))
import semantic_validate as SV  # noqa: E402

REPO = SV.load_repo()
J = lambda rel: json.load(open(os.path.join(DR, rel), encoding="utf-8"))  # noqa: E731
HOME = J("schema/example.pagespec.json")
INSIGHTS = J("schema/examples/insights.pagespec.json")
VERIFIED_SLIDES = next(n for n in HOME["nodes"] if n["type"] == "testimonials.slider")["content"]["slides"]

# ------------------------------------------------------------------ synthesizer
PATTERN_SAMPLES = {
    "^(assets|svg|lottie|video)/[A-Za-z0-9._-]+$": "assets/example.webp",
    "^U\\+[0-9A-F]{4}$": "U+F890",
    "^[0-9]{1,2}:[0-5][0-9]$": "1:05",
    "^[A-Za-z0-9_-]{11}$": "AbCdEfGhIjK",
    "^[a-z]+$": "engage",
    "^[a-z0-9-]+$": "chat-v1",
}


def synth(schema, key=None, parent_keys=()):
    if "const" in schema:
        return schema["const"]
    if "enum" in schema:
        if key in ("source", "copySource") and "placeholder" in schema["enum"]:
            return "placeholder"
        return schema["enum"][0]
    t = schema.get("type")
    if t == "object":
        props = schema.get("properties", {})
        return {k: synth(props[k], k, tuple(props)) for k in schema.get("required", [])}
    if t == "array":
        return [synth(schema["items"], key) for _ in range(schema.get("minItems", 0))]
    if t in ("number", "integer"):
        return schema.get("minimum", 0)
    if t == "boolean":
        return False
    if t == "string":
        pat = schema.get("pattern")
        if pat in PATTERN_SAMPLES:
            return PATTERN_SAMPLES[pat]
        if pat and pat.startswith("^(/"):
            return "/book-a-demo"
        if key == "text" and ("source" in parent_keys or "copySource" in parent_keys):
            return "Placeholder copy"
        mw = schema.get("maxWords", 2)
        return "Example" if mw < 2 else "Example copy"
    raise ValueError(f"cannot synthesize {schema}")


def M(pattern):
    return {"pattern": pattern, "reducedMotionFallback": REPO["recipes"][pattern]["reducedMotionFallback"]}


def fix_node(nd, tpl, route):
    t, v, c = nd["type"], nd["variant"], nd["content"]
    ovr = REPO["routing"]["navOverrides"].get(route, {})
    if t == "shell.navbar":
        c["state"] = "forced-scrolled" if ovr.get("forceScrolled") else "auto"
        c["cta"] = {"label": ovr.get("ctaLabel", "Book a demo"), "href": ovr.get("ctaHref", "/book-a-demo")}
        nd["variant"] = "careers-cta" if "ctaLabel" in ovr else "forced-scrolled" if ovr.get("forceScrolled") else "standard"
    if t == "testimonials.slider":
        if v == "titled":
            c["eyebrow"], c["title"] = "Example", "Example copy"
        if v == "panel-static":
            nd["motion"] = M("none")
        if tpl["constraints"].get("testimonialSet"):
            c["slides"] = copy.deepcopy(VERIFIED_SLIDES)
            nd["motion"] = M("slide-horizontal")
    if t == "feature.sticky-scroll":
        base = c["blocks"][0]
        n_blocks = {"home": 3, "compare": 4, "addons": 3, "docs-single": 1, "shopping-steps": 3}.get(v, 3)
        c["blocks"] = [copy.deepcopy(base) for _ in range(n_blocks)]
        for i, b in enumerate(c["blocks"]):
            if v in ("home", "addons") or (v == "compare" and i == n_blocks - 1):
                b["cta"] = {"label": "Book a demo", "href": "/book-a-demo", "style": "xlg-dark"}
            if v == "addons":
                b["bullets"] = [{"lead": "Example", "text": "Example copy"}]
    if t == "integrations.logo-grid":
        if v in ("home", "compare"):
            c["cta"] = {"label": "Explore all integrations", "href": "https://www.siena.cx/integrations"}
        if v == "partner-groups":
            g = c["groups"][0]
            c["groups"] = [dict(copy.deepcopy(g), label="Example"), dict(copy.deepcopy(g), label="Example")]
    if t == "hero.home":
        row = c["tickerRows"][0]
        if v == "home":
            c["tickerRows"], c["phoneHeadline"] = [row, copy.deepcopy(row)], "Example copy"
        else:
            c["subtitleSecondary"] = "Example copy"
    if t == "cta.main":
        c["button"] = {"label": "Become a partner", "action": "open-modal"} if v == "metrics-image" else {"label": "Book a demo", "href": "/book-a-demo", "action": "navigate"}
    if t == "hero.partner":
        c["cta"] = {"label": "Become a partner", "action": "open-modal"}


def synth_control(tpl):
    route = tpl["routes"][0]
    cons = tpl["constraints"]
    rv = cons.get("routeVariants", {}).get(route, {})
    rr = cons.get("routeNodeRules", {}).get(route, {})
    nodes = []
    for i, tn in enumerate(tpl["nodes"]):
        sec = tn["section"]
        if not tn["required"] and sec not in rr.get("require", []):
            continue
        if sec in rr.get("forbid", []):
            continue
        reps = cons.get("repeatCounts", {}).get(sec, [1])[0] if tn["repeatable"] else 1
        contract = REPO["sections"][sec]
        for r in range(reps):
            var = rv.get(sec, tn["variants"][0])
            nd = {"id": f"n{i}-{r}", "type": sec, "variant": var, "content": synth(contract["contentModel"]), "motion": M(contract["motion"]["allowedPatterns"][0])}
            fix_node(nd, tpl, route)
            nodes.append(nd)
    return {"id": "page." + tpl["id"].split(".", 1)[1], "route": route, "template": tpl["id"], "theme": "light", "head": {"title": "Example page"}, "nodes": nodes}


CONTROLS = {tid: synth_control(t) for tid, t in REPO["templates"].items()}


# ------------------------------------------------------------------ mutation helpers
def node(doc, typ, k=0):
    return [n for n in doc["nodes"] if n["type"] == typ][k]


def mut(base, fn):
    d = copy.deepcopy(base)
    fn(d)
    return d


def drop(typ):
    return lambda d: d.__setitem__("nodes", [n for n in d["nodes"] if n["type"] != typ])


def swap(a, b):
    def f(d):
        t = [n["type"] for n in d["nodes"]]
        i, j = t.index(a), t.index(b)
        d["nodes"][i], d["nodes"][j] = d["nodes"][j], d["nodes"][i]
    return f


def setp(typ, path, value, k=0):
    def f(d):
        t = node(d, typ, k)
        for p in path[:-1]:
            t = t[p]
        t[path[-1]] = value
    return f


def delp(typ, path):
    def f(d):
        t = node(d, typ)
        for p in path[:-1]:
            t = t[p]
        del t[path[-1]]
    return f


def dup(typ, at=-1):
    def f(d):
        n = copy.deepcopy(node(d, typ))
        n["id"] += "-copy"
        d["nodes"].insert(len(d["nodes"]) + at if at < 0 else at, n)
    return f


def insert(at, nd):
    return lambda d: d["nodes"].insert(at, copy.deepcopy(nd))


C = CONTROLS
LONG = " ".join(["word"] * 60)
NAV, HERO, TESTI, STICKY, METRICS, STORIES, FEAT, INTEG, CTA, FOOT = ("shell.navbar", "hero.home", "testimonials.slider", "feature.sticky-scroll", "stats.metrics", "stories.carousel", "features.lottie-grid", "integrations.logo-grid", "cta.main", "shell.footer")
EMPTY_BLOCK = C["template.ai-native-vs-addons"]["nodes"][4]
MODAL = node(C["template.partner"], "overlay.partner-modal")

MUTATIONS = [
    # ---- schema layer
    ("unknown template enum", HOME, lambda d: d.__setitem__("template", "template.blog"), "SCHEMA"),
    ("theme not in enum", HOME, lambda d: d.__setitem__("theme", "dark"), "SCHEMA"),
    ("invented node type alias", HOME, setp(HERO, ["type"], "hero.homepage"), "SCHEMA"),
    ("variant not defined for the section", HOME, setp(HERO, ["variant"], "split"), "SCHEMA"),
    ("missing required content field", HOME, delp(HERO, ["content", "headline"]), "SCHEMA"),
    ("missing reducedMotionFallback", HOME, delp(HERO, ["motion", "reducedMotionFallback"]), "SCHEMA"),
    ("wrong reducedMotionFallback for the recipe", HOME, setp(HERO, ["motion", "reducedMotionFallback"], "paused"), "SCHEMA"),
    ("invented motion field", HOME, setp(HERO, ["motion", "inventedAnimation"], "spin"), "SCHEMA"),
    ("motion pattern not allowed for the section", HOME, setp(HERO, ["motion"], {"pattern": "ticker-vertical", "reducedMotionFallback": "paused"}), "SCHEMA"),
    ("delayMs not a measured delay", HOME, setp(HERO, ["motion", "delayMs"], 250), "SCHEMA"),
    ("invented node property (style override)", HOME, setp(HERO, ["style"], {"color": "red"}), "SCHEMA"),
    ("invented content field", HOME, setp(HERO, ["content", "backgroundColor"], "#ff0000"), "SCHEMA"),
    ("invented assetRole value", HOME, lambda d: node(d, HERO)["content"]["images"][0].__setitem__("assetRole", "illustration.ai-generated"), "SCHEMA"),
    ("assetRole of the wrong kind in a field", HOME, lambda d: node(d, HERO)["content"]["images"][0].__setitem__("assetRole", "logo.customer"), "SCHEMA"),
    ("asset ref outside the clone public folders", HOME, lambda d: node(d, HERO)["content"]["images"][0].__setitem__("assetRef", "https://cdn.example.com/x.png"), "SCHEMA"),
    ("form that submits somewhere", INSIGHTS, setp("cta.demo-form", ["content", "submitBehavior"], "post"), "SCHEMA"),
    ("quote source outside the enum", HOME, lambda d: node(d, TESTI)["content"]["slides"][0]["quote"].__setitem__("source", "real"), "SCHEMA"),
    ("seven feature cards", HOME, lambda d: node(d, FEAT)["content"]["cards"].append(copy.deepcopy(node(d, FEAT)["content"]["cards"][0])), "SCHEMA"),
    ("two metric stats instead of three", HOME, lambda d: node(d, METRICS)["content"]["stats"].pop(), "SCHEMA"),
    ("twelve testimonial slides", HOME, lambda d: node(d, TESTI)["content"]["slides"].append(copy.deepcopy(node(d, TESTI)["content"]["slides"][0])), "SCHEMA"),
    ("mailto to an outside domain", HOME, setp(CTA, ["content", "button", "href"], "mailto:someone@gmail.com"), "SCHEMA"),
    ("headline with two italic spans", HOME, setp(FEAT, ["content", "title"], "The *agentic* *commerce* platform"), "SCHEMA"),
    ("route with a trailing slash", HOME, lambda d: d.__setitem__("route", "/pricing/"), "SCHEMA"),
    # ---- template cross-reference (declared template vs its REAL node list)
    ("declared template contradicts the node list", HOME, lambda d: d.__setitem__("template", "template.insights-landing"), "TEMPLATE_NODES"),
    ("route not served by the declared template", HOME, lambda d: d.__setitem__("route", "/pricing"), "ROUTE"),
    ("insights template on the home route", INSIGHTS, lambda d: d.__setitem__("route", "/"), "ROUTE"),
    ("section not in the template", HOME, insert(5, node(INSIGHTS, "banner.announcement-strip")), "TEMPLATE_NODES"),
    ("right section, variant not allowed by template", HOME, setp(INTEG, ["variant"], "compare"), "TEMPLATE_NODES"),
    ("mandatory section removed (metrics)", HOME, drop(METRICS), "TEMPLATE_NODES"),
    ("mandatory section removed (hero)", HOME, drop(HERO), "TEMPLATE_NODES"),
    ("fixed-position section reordered (stories before metrics)", HOME, swap(METRICS, STORIES), "TEMPLATE_ORDER"),
    ("non-repeatable section duplicated (stories)", HOME, dup(STORIES, -2), "TEMPLATE_NODES"),
    ("third static testimonial on qa", C["template.qa-agent"], dup("testimonials.slider", -3), "TEMPLATE_NODES"),
    ("lab statements swapped (variant order)", C["template.ai-lab"], lambda d: [node(d, "lab.statement", 0).__setitem__("variant", "what-is"), node(d, "lab.statement", 1).__setitem__("variant", "intro")], "TEMPLATE_ORDER"),
    # ---- chrome / routing
    ("navbar not first", HOME, swap(NAV, HERO), "NAV_FIRST"),
    ("footer not last", HOME, swap(CTA, FOOT), "FOOTER_LAST"),
    ("pricing rendered with the global nav", C["template.lead-gen"], lambda d: d["nodes"].__setitem__(0, copy.deepcopy(node(HOME, NAV))), "CHROME_MATCHES_ROUTE"),
    ("ai-lab rendered with the global nav", C["template.ai-lab"], lambda d: d["nodes"].__setitem__(0, copy.deepcopy(node(HOME, NAV))), "CHROME_MATCHES_ROUTE"),
    ("careers nav without the open-roles CTA", C["template.careers"], setp(NAV, ["content", "cta"], {"label": "Book a demo", "href": "/book-a-demo"}), "NAV_OVERRIDE"),
    ("about-us nav not forced scrolled", C["template.about"], setp(NAV, ["content", "state"], "auto"), "NAV_OVERRIDE"),
    ("home nav forced scrolled", HOME, setp(NAV, ["content", "state"], "forced-scrolled"), "NAV_OVERRIDE"),
    ("blog route recreated locally", HOME, lambda d: d.__setitem__("route", "/blog"), "OUT_OF_SCOPE_ROUTE"),
    ("local link into an out-of-scope section", HOME, setp(INTEG, ["content", "cta", "href"], "/integrations"), "OUT_OF_SCOPE_ROUTE"),
    ("local link to an unmodelled route", HOME, setp(CTA, ["content", "button", "href"], "/contact"), "LINK_TARGETS"),
    ("external host not allowlisted", HOME, lambda d: node(d, STORIES)["content"]["cards"][0].__setitem__("href", "https://evil.example.com/x"), "LINK_TARGETS"),
    # ---- rhythm
    ("second hero", HOME, insert(2, node(HOME, HERO) | {"id": "hero-2"}), "ONE_HERO"),
    ("hero on a hero-less template (named exception honoured, not abused)", C["template.legal"], insert(1, node(HOME, HERO) | {"id": "hero-x"}), "ONE_HERO"),
    ("hero not directly after the nav", HOME, swap(HERO, TESTI), "HERO_AFTER_CHROME"),
    ("one-per-page section twice", HOME, dup(METRICS, -4), "ONE_PER_PAGE"),
    ("same section back to back", INSIGHTS, dup("banner.announcement-strip", 3), "NO_ADJACENT_SAME_SECTION"),
    ("CTA no longer closes the page", HOME, swap(INTEG, CTA), "CTA_CLOSES_PAGE"),
    ("quirk block placed on the homepage", HOME, insert(5, EMPTY_BLOCK), "QUIRK_REGISTERED"),
    # ---- provenance / placeholder policy
    ("fabricated quote marked verified", HOME, lambda d: node(d, TESTI)["content"]["slides"][0]["quote"].__setitem__("text", "Siena doubled our revenue overnight."), "QUOTE_PROVENANCE"),
    ("verified quote attributed to another person", HOME, lambda d: node(d, TESTI)["content"]["slides"][0].__setitem__("name", "Paige Zachs"), "QUOTE_PROVENANCE"),
    ("invented quote passed off as placeholder", C["template.partner"], lambda d: node(d, TESTI)["content"]["slides"][0]["quote"].__setitem__("text", "Siena is the best partner we ever had."), "QUOTE_PROVENANCE"),
    ("placeholder quote on a homepage-set template", HOME, lambda d: node(d, TESTI)["content"]["slides"][0].__setitem__("quote", {"text": "Placeholder quote copy", "source": "placeholder"}), "TESTIMONIAL_SET"),
    ("placeholder prose not marked", C["template.legal"], lambda d: node(d, "content.legal-document")["content"]["blocks"][0].__setitem__("body", {"text": "You agree to these terms.", "copySource": "placeholder"}), "PLACEHOLDER_MARKED"),
    ("lorem filler passed off as real copy", INSIGHTS, lambda d: node(d, "hero.insights")["content"]["subtitle"].__setitem__("copySource", "real"), "PLACEHOLDER_MARKED"),
    # ---- route bindings inside shared templates
    ("insights landing route with the subpage hero", INSIGHTS, setp("hero.insights", ["variant"], "subpage"), "ROUTE_VARIANT"),
    ("customer-feedback route with integrations", INSIGHTS, lambda d: d.__setitem__("route", "/insights/customer-feedback-analytics-software"), "ROUTE_NODE_RULES"),
    ("pricing without the how-pricing block", C["template.lead-gen"], drop("features.icon-grid"), "ROUTE_NODE_RULES"),
    ("insights with two media rows", INSIGHTS, lambda d: d.__setitem__("nodes", [n for n in d["nodes"] if n["id"] not in ("row-3", "row-4", "row-5")]), "REPEAT_COUNTS"),
    # ---- variant rules
    ("titled slider without its title", HOME, delp(TESTI, ["content", "title"]), "VARIANT_RULES"),
    ("home sticky block without its CTA", HOME, lambda d: node(d, STICKY)["content"]["blocks"][1].__delitem__("cta"), "VARIANT_RULES"),
    ("compare sticky with a CTA on block 1", C["template.compare"], lambda d: node(d, STICKY)["content"]["blocks"][0].__setitem__("cta", {"label": "Book a demo", "href": "/book-a-demo", "style": "xlg-dark"}), "VARIANT_RULES"),
    ("home integrations without the explore CTA", HOME, delp(INTEG, ["content", "cta"]), "VARIANT_RULES"),
    ("home hero with one ticker row", HOME, lambda d: node(d, HERO)["content"]["tickerRows"].pop(), "VARIANT_RULES"),
    ("partner CTA that navigates instead of opening the modal", C["template.partner"], setp(CTA, ["content", "button"], {"label": "Book a demo", "href": "/book-a-demo", "action": "navigate"}), "VARIANT_RULES"),
    # ---- assets / ids
    ("duplicate node ids", HOME, setp(METRICS, ["id"], "hero"), "UNIQUE_IDS"),
    # ---- runtime maxWords
    ("hero headline over budget", HOME, setp(HERO, ["content", "headline"], LONG), "MAX_WORDS"),
    ("nested bullet over budget", HOME, lambda d: node(d, STICKY)["content"]["blocks"][0]["bullets"][0].__setitem__("text", LONG), "MAX_WORDS"),
    ("head title over budget", HOME, lambda d: d["head"].__setitem__("title", LONG), "MAX_WORDS"),
]

# rules whose fixture needs another template's node
MUTATIONS = [m for m in MUTATIONS if m[3] is not None]
MUTATIONS += [
    ("partner modal on a page without hero.partner", C["template.refer"], insert(-1, MODAL), "MODAL_OPENER"),
    ("youtube embed outside the conversation article", HOME, lambda d: node(d, HERO)["content"]["images"][0].__setitem__("assetRole", "embed.youtube"), "SCHEMA"),
]
MUTATIONS = [m for m in MUTATIONS if m[3] is not None]

WARN_CASES = [
    ("homepage-set template showing fewer than 11 slides", HOME, lambda d: node(d, TESTI)["content"]["slides"].pop(), "TESTIMONIAL_SET_COUNT"),
]


def direct_cases():
    """Rules a schema-valid PageSpec cannot reach (the schema blocks the input first) are
    exercised at the graph layer directly, so their code path is still proven."""
    results = []
    d = copy.deepcopy(HOME)
    d["nodes"].insert(5, copy.deepcopy(node(C["template.about"], "story.horizontal-scroll")) | {"id": "hs"})
    out = []
    SV.check_graph_rules(d, REPO, REPO["templates"]["template.home"], out)
    results.append(("two scroll-jacking sections (graph layer)", any(r[1] == "MOTION_BUDGET" and r[0] == "warn" for r in out), "warn MOTION_BUDGET"))
    d = copy.deepcopy(INSIGHTS)
    node(d, "cta.demo-form")["content"]["submitBehavior"] = "post"
    out = []
    SV.check_graph_rules(d, REPO, REPO["templates"]["template.insights-landing"], out)
    results.append(("form submitBehavior post (graph layer)", any(r[1] == "FORMS_STATIC" and r[0] == "error" for r in out), "error FORMS_STATIC"))
    d = copy.deepcopy(C["template.conversation-detail"])
    node(d, "cta.newsletter")["content"]["video"] = {"assetRole": "embed.youtube", "videoId": "AbCdEfGhIjK"}
    out = []
    SV.check_graph_rules(d, REPO, REPO["templates"]["template.conversation-detail"], out)
    results.append(("second youtube embed outside the article (graph layer)", any(r[1] == "EMBED_ALLOWLIST" for r in out), "error EMBED_ALLOWLIST"))
    d = copy.deepcopy(INSIGHTS)
    node(d, "logos.static-row")["content"]["logos"][0]["assetRole"] = "photo.person-real"
    out = []
    SV.check_graph_rules(d, REPO, REPO["templates"]["template.insights-landing"], out)
    results.append(("role not registered for the section (graph layer)", any(r[1] == "ASSET_ROLE_USAGE" for r in out), "error ASSET_ROLE_USAGE"))
    return results


def main():
    fails = rejected = 0
    for name, base, fn, rule in MUTATIONS:
        res = SV.validate_pagespec(mut(base, fn), REPO)
        errs = [r for r in res if r[0] == "error"]
        ok = bool(errs) and any(r[1] == rule for r in errs)
        rejected += ok
        print(f"{'REJECTED' if ok else 'NOT REJECTED':12} {name:62} expects {rule}" + ("" if ok else f"  got {[r[1] for r in res][:5]}"))
        fails += not ok
    for name, base, fn, rule in WARN_CASES:
        res = SV.validate_pagespec(mut(base, fn), REPO)
        ok = any(r[1] == rule and r[0] == "warn" for r in res) and not any(r[0] == "error" for r in res)
        print(f"{'WARNS' if ok else 'WRONG':12} {name:62} expects warn {rule}" + ("" if ok else f"  got {res[:3]}"))
        fails += not ok
    for name, ok, what in direct_cases():
        print(f"{'CAUGHT' if ok else 'MISSED':12} {name:62} expects {what}")
        fails += not ok
    controls = [("homepage example (real copy)", HOME), ("insights example (real copy)", INSIGHTS)] + [(f"synthesized control {tid} ({c['route']})", c) for tid, c in sorted(CONTROLS.items())]
    passed = 0
    for name, doc in controls:
        res = SV.validate_pagespec(doc, REPO)
        ok = not res
        passed += ok
        print(f"{'CONTROL PASS' if ok else 'CONTROL FAIL':12} {name}" + ("" if ok else f"  {res[:3]}"))
        fails += not ok
    covered = {d["template"] for _, d in controls}
    missing = sorted(set(REPO["templates"]) - covered)
    if missing:
        print("CONTROL GAP: templates without a control:", missing)
        fails += 1
    print(f"adversarial: {rejected}/{len(MUTATIONS)} mutations rejected, {len(WARN_CASES)} warn-case(s), {len(direct_cases())} direct graph-layer case(s), {passed}/{len(controls)} controls pass with zero findings, {len(covered)}/{len(REPO['templates'])} templates covered")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
