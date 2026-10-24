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
sys.path.insert(0, os.path.join(DR, "extraction"))
import semantic_validate as SV  # noqa: E402
import build_schema as BS  # noqa: E402

REPO = SV.load_repo()
J = lambda rel: json.load(open(os.path.join(DR, rel), encoding="utf-8"))  # noqa: E731
HOME = J("schema/example.pagespec.json")
INSIGHTS = J("schema/examples/insights.pagespec.json")
GHOME = J("schema/examples/generated.template.home.pagespec.json")
GPROD = J("schema/examples/generated.template.product.pagespec.json")
GART = J("schema/examples/generated.template.conversation-detail.pagespec.json")
GLEG = J("schema/examples/generated.template.legal.pagespec.json")
VERIFIED_SLIDES = next(n for n in HOME["nodes"] if n["type"] == "testimonials.slider")["content"]["slides"]

# ------------------------------------------------------------------ synthesizer
PATTERN_SAMPLES = {
    "^(assets|svg|lottie|video)/[A-Za-z0-9._-]+$": "assets/example.webp",
    "^(placeholder|generated|user-supplied)/[A-Za-z0-9._-]+$": "placeholder/example.webp",
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


def fix_node(nd, tpl, route, mode="reference"):
    gen = mode == "generated"
    ext_href = "https://docs.example/integrations" if gen else "https://www.siena.cx/integrations"
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
        if tpl["constraints"].get("testimonialSet") and not gen:
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
            c["cta"] = {"label": "Explore all integrations", "href": ext_href}
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


def synth_control(tpl, mode="reference"):
    route = tpl["routes"][0]
    gen = mode == "generated"
    probe = [] if not gen else []
    if gen:
        SV.check_generated({"id": "page.probe", "route": route, "head": {}, "nodes": []}, REPO, probe)
    if gen and any(r[0] == "error" for r in probe):
        route = "/generated-" + tpl["id"].split(".", 1)[1].replace("siena", "agent")
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
        model = BS.generated_model(contract, REPO["assets"]) if gen else contract["contentModel"]
        for r in range(reps):
            var = rv.get(sec, tn["variants"][0])
            nd = {"id": f"n{i}-{r}", "type": sec, "variant": var, "content": synth(model), "motion": M(contract["motion"]["allowedPatterns"][0])}
            fix_node(nd, tpl, route if not gen else SV.constraint_route({"mode": mode, "route": route}, tpl), mode)
            nodes.append(nd)
    pid = "page." + ("generated-" if gen else "") + tpl["id"].split(".", 1)[1].replace("siena", "agent" if gen else "siena")
    return {"id": pid, "mode": mode, "route": route, "template": tpl["id"], "theme": "light", "head": {"title": "Example page"}, "nodes": nodes}


CONTROLS = {tid: synth_control(t) for tid, t in REPO["templates"].items()}
GEN_CONTROLS = {tid: synth_control(t, "generated") for tid, t in REPO["templates"].items()}


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
    ("placeholder prose not marked", C["template.legal"], lambda d: node(d, "content.legal-section")["content"]["blocks"][0].__setitem__("body", {"text": "You agree to these terms.", "copySource": "placeholder"}), "PLACEHOLDER_MARKED"),
    ("lorem filler passed off as real copy", INSIGHTS, lambda d: node(d, "hero.insights")["content"]["subtitle"].__setitem__("copySource", "real"), "PLACEHOLDER_MARKED"),
    # ---- route bindings inside shared templates
    ("insights landing route with the subpage hero", INSIGHTS, setp("hero.insights", ["variant"], "subpage"), "ROUTE_VARIANT"),
    ("customer-feedback route with integrations", INSIGHTS, lambda d: d.__setitem__("route", "/insights/customer-feedback-analytics-software"), "ROUTE_NODE_RULES"),
    ("pricing without the how-pricing block", C["template.lead-gen"], drop("features.icon-grid"), "ROUTE_NODE_RULES"),
    ("insights with two media rows", INSIGHTS, lambda d: d.__setitem__("nodes", [n for n in d["nodes"] if n["id"] not in ("row-3", "row-4", "row-5")]), "REPEAT_COUNTS"),
    # ---- decomposed long-form pages (article / legal / index)
    ("chapters index lists a chapter the transcript lacks", C["template.conversation-detail"], lambda d: node(d, "content.article-chapter-index")["content"]["chapters"].__setitem__(0, {"time": "1:05", "title": "A chapter that has no transcript part"}), "CHAPTER_PARITY"),
    ("extra transcript chapter the index does not list", C["template.conversation-detail"], lambda d: d["nodes"].insert(max(i for i, n in enumerate(d["nodes"]) if n["type"] == "content.transcript-chapter") + 1, dict(copy.deepcopy(node(C["template.conversation-detail"], "content.transcript-chapter")), id="extra-chapter", content=dict(copy.deepcopy(node(C["template.conversation-detail"], "content.transcript-chapter")["content"]), chapter="Not listed in the index"))), "CHAPTER_PARITY"),
    ("fewer than three transcript chapters", C["template.conversation-detail"], lambda d: d.__setitem__("nodes", [n for n in d["nodes"] if n["id"] != "n5-2"]), "REPEAT_COUNTS"),
    ("whole article collapsed into one chapter-less body (transcript removed)", C["template.conversation-detail"], drop("content.transcript-chapter"), "TEMPLATE_NODES"),
    ("article header on the legal template", C["template.legal"], insert(1, node(C["template.conversation-detail"], "content.article-header")), "TEMPLATE_NODES"),
    ("legal part rendered with the other document's variant", C["template.legal"], setp("content.legal-section", ["variant"], "privacy"), "ROUTE_VARIANT"),
    ("legal document without its header", C["template.legal"], drop("content.legal-header"), "TEMPLATE_NODES"),
    ("index grid before its header", C["template.conversations-index"], swap("content.index-header", "content.conversation-grid"), "TEMPLATE_ORDER"),
    ("agent promo (conversion) moved after the demo form", INSIGHTS, swap("cta.agent-promo", "cta.demo-form"), "TEMPLATE_ORDER"),
    ("legal placeholder prose not marked (per-part body)", C["template.legal"], lambda d: node(d, "content.legal-section")["content"]["blocks"][0].__setitem__("body", {"text": "You agree to these terms.", "copySource": "placeholder"}), "PLACEHOLDER_MARKED"),
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

# ---- mode: reference | generated. Mutations of the generated examples; each must be rejected with the named rule.
SRC_PHRASE = "Our mission is to humanize the internet by turning customer interactions into meaningful relationships."  # pinned in verify_all.COPY_PROBES (shorter form)
GN = lambda t, k=0: node(GHOME, t, k)  # noqa: E731


def gnav(d, k, v):
    node(d, "shell.navbar")["content"]["brand"][k] = v


def gslide(d, k, v, typ=TESTI):
    node(d, typ)["content"]["slides"][0][k] = v


GEN_MUTATIONS = [
    # ---- mode field
    ("PageSpec without mode", HOME, lambda d: d.pop("mode"), "SCHEMA"),
    ("generated PageSpec without mode", GHOME, lambda d: d.pop("mode"), "SCHEMA"),
    ("mode outside the enum (wrong case)", GHOME, lambda d: d.__setitem__("mode", "Generated"), "SCHEMA"),
    ("mode null", HOME, lambda d: d.__setitem__("mode", None), "SCHEMA"),
    ("mode invented value 'hybrid'", GHOME, lambda d: d.__setitem__("mode", "hybrid"), "SCHEMA"),
    ("reference example flipped to generated", HOME, lambda d: d.__setitem__("mode", "generated"), "SCHEMA"),
    ("insights reference example flipped to generated", INSIGHTS, lambda d: d.__setitem__("mode", "generated"), "SCHEMA"),
    ("generated example flipped to reference", GHOME, lambda d: d.__setitem__("mode", "reference"), "SCHEMA"),
    ("reference page using a generation-safe-only role", HOME, lambda d: node(d, HERO)["content"]["tickerRows"][0][0].__setitem__("assetRole", "logo.placeholder"), "SCHEMA"),
    ("reference page with a generated assetRef", HOME, lambda d: node(d, HERO)["content"]["images"][0].__setitem__("assetRef", "generated/scene-1.webp"), "SCHEMA"),
    # ---- logo / brand leakage
    ("Siena wordmark role in the navbar brand", GHOME, lambda d: gnav(d, "assetRole", "brand.siena-wordmark"), "SCHEMA"),
    ("Siena glyph role in the navbar brand", GHOME, lambda d: gnav(d, "assetRole", "brand.siena-glyph"), "SCHEMA"),
    ("Siena name as the brand name", GHOME, lambda d: gnav(d, "name", "Siena"), "GENERATED_MODE_SOURCE_BRAND"),
    ("brand alt text names Siena", GHOME, lambda d: gnav(d, "alt", "Siena wordmark"), "GENERATED_MODE_SOURCE_BRAND"),
    ("footer brand name 'Siena AI'", GHOME, lambda d: node(d, "shell.footer")["content"]["brand"].__setitem__("name", "Siena AI"), "GENERATED_MODE_SOURCE_BRAND"),
    ("SOC 2 compliance badge in a generated footer", GHOME, lambda d: node(d, "shell.footer")["content"].__setitem__("complianceBadge", {"assetRole": "badge.compliance", "assetRef": "placeholder/badge.svg"}), "SCHEMA"),
    ("footer without a brand mark (implicit Siena wordmark)", GHOME, lambda d: node(d, "shell.footer")["content"].pop("brand"), "SCHEMA"),
    ("footer link set 'global' (the Siena link set)", GHOME, lambda d: node(d, "shell.footer")["content"].__setitem__("linkSet", "global"), "SCHEMA"),
    ("navbar link set 'global'", GHOME, lambda d: node(d, "shell.navbar")["content"].__setitem__("linkSet", "global"), "SCHEMA"),
    ("page id names Siena", GHOME, lambda d: d.__setitem__("id", "page.siena-landing"), "GENERATED_MODE_SOURCE_BRAND"),
    ("route names Siena", GPROD, lambda d: d.__setitem__("route", "/ask-siena"), "GENERATED_MODE_SOURCE_BRAND"),
    ("head title names Siena", GHOME, lambda d: d["head"].__setitem__("title", "Support that scales | Siena AI"), "GENERATED_MODE_SOURCE_BRAND"),
    ("head description names Siena", GHOME, lambda d: d["head"].__setitem__("description", "Built by the team behind siena.cx"), "GENERATED_MODE_SOURCE_BRAND"),
    ("heading names Siena", GHOME, setp(HERO, ["content", "headline"], "Why teams choose Siena"), "GENERATED_MODE_SOURCE_BRAND"),
    ("CTA label names Siena", GHOME, setp(CTA, ["content", "button", "label"], "Try Siena"), "GENERATED_MODE_SOURCE_BRAND"),
    ("body text names Siena", GHOME, lambda d: node(d, FEAT)["content"]["cards"][0].__setitem__("body", "Siena handles every question."), "GENERATED_MODE_SOURCE_BRAND"),
    ("alt text names Siena", GHOME, lambda d: node(d, HERO)["content"]["images"][0].__setitem__("alt", "Siena hero illustration"), "GENERATED_MODE_SOURCE_BRAND"),
    ("node id names Siena", GHOME, setp(METRICS, ["id"], "siena-metrics"), "GENERATED_MODE_SOURCE_BRAND"),
    ("lower-case source name in a label", GHOME, lambda d: node(d, STICKY)["content"]["blocks"][0]["bullets"][0].__setitem__("text", "works like sienaai does"), "GENERATED_MODE_SOURCE_BRAND"),
    # ---- source marketing copy
    ("source sentence reused as the hero subtitle", GHOME, setp(HERO, ["content", "subtitle"], SRC_PHRASE), "GENERATED_MODE_SOURCE_COPY"),
    ("source 5-word run hidden inside a longer sentence", GHOME, setp(HERO, ["content", "subtitle"], "Our answers help teams to humanize the internet by turning customer interactions into loyal buyers."), "GENERATED_MODE_SOURCE_COPY"),
    ("source phrase in a metrics headline", GHOME, setp(METRICS, ["content", "headline"], "Teams grow by turning customer interactions into meaningful relationships every day"), "GENERATED_MODE_SOURCE_COPY"),
    ("source phrase in a transcript paragraph", GART, lambda d: node(d, "content.transcript-chapter")["content"]["turns"][0]["paragraphs"][0].__setitem__("text", "Brands that win on CX run on Siena, she said."), "GENERATED_MODE_SOURCE_COPY"),
    ("source phrase in a chapter title", GART, lambda d: node(d, "content.transcript-chapter")["content"].__setitem__("chapter", "Our mission is to humanize the internet"), "GENERATED_MODE_SOURCE_COPY"),
    ("lorem filler passed off as generated copy", GLEG, lambda d: node(d, "content.legal-section")["content"]["blocks"][0]["body"].__setitem__("text", "Lorem ipsum dolor sit amet consectetur adipiscing elit."), "GENERATED_MODE_PLACEHOLDER_COPY"),
    ("placeholder copySource in a generated page", GLEG, lambda d: node(d, "content.legal-section")["content"]["blocks"][0]["body"].__setitem__("copySource", "placeholder"), "SCHEMA"),
    ("'real' copySource in a generated page", GART, lambda d: node(d, "content.article-summary")["content"]["summary"][0].__setitem__("copySource", "real"), "SCHEMA"),
    ("verified quote source in a generated page", GHOME, lambda d: node(d, TESTI)["content"]["slides"][0]["quote"].__setitem__("source", "verified"), "SCHEMA"),
    ("placeholder quote source in a generated page", GHOME, lambda d: node(d, TESTI)["content"]["slides"][0]["quote"].__setitem__("source", "placeholder"), "SCHEMA"),
    ("homepage testimonial set (reference-only) pasted into a generated page", GHOME, lambda d: node(d, TESTI)["content"].__setitem__("slides", copy.deepcopy(VERIFIED_SLIDES)), "SCHEMA"),
    # ---- screenshot / media reuse
    ("source asset file name as a generated ref", GHOME, lambda d: node(d, HERO)["content"]["images"][0].__setitem__("assetRef", "generated/jBdT2KuAbfPtfHNsxcWh0L50xk.webp"), "GENERATED_MODE_ASSET_REF"),
    ("same stem, other extension", GHOME, lambda d: node(d, HERO)["content"]["images"][0].__setitem__("assetRef", "user-supplied/jBdT2KuAbfPtfHNsxcWh0L50xk.png"), "GENERATED_MODE_ASSET_REF"),
    ("source customer logo file reused as a placeholder logo", GHOME, lambda d: node(d, HERO)["content"]["tickerRows"][0][0].__setitem__("assetRef", "placeholder/L2fbLFnO4rG3Y9WhTn2Zmg90Q.png"), "GENERATED_MODE_ASSET_REF"),
    ("clone asset path (assets/...) as a ref", GHOME, lambda d: node(d, HERO)["content"]["images"][0].__setitem__("assetRef", "assets/jBdT2KuAbfPtfHNsxcWh0L50xk.webp"), "SCHEMA"),
    ("clone svg path (svg/...) as a ref", GHOME, lambda d: node(d, HERO)["content"]["tickerRows"][0][0].__setitem__("assetRef", "svg/ticker1-equip.svg"), "SCHEMA"),
    ("remote source URL as a ref", GHOME, lambda d: node(d, HERO)["content"]["images"][0].__setitem__("assetRef", "https://framerusercontent.com/images/jBdT2KuAbfPtfHNsxcWh0L50xk.webp"), "SCHEMA"),
    ("source product screenshot role (ui-mock-image)", GHOME, lambda d: node(d, STICKY)["content"]["blocks"][0]["visual"]["background"].__setitem__("assetRole", "product.ui-mock-image"), "SCHEMA"),
    ("editorial scene photo role", GPROD, lambda d: node(d, "agents.expert-team")["content"]["cards"][0]["image"].__setitem__("assetRole", "photo.editorial-scene"), "SCHEMA"),
    ("source editorial illustration role", GHOME, lambda d: node(d, HERO)["content"]["images"][0].__setitem__("assetRole", "illustration.editorial"), "SCHEMA"),
    ("source card background role", GHOME, lambda d: node(d, STICKY)["content"]["blocks"][0]["visual"]["background"].__setitem__("assetRole", "image.card-background"), "SCHEMA"),
    ("source lottie animation role", GHOME, lambda d: node(d, FEAT)["content"]["cards"][0]["animation"].__setitem__("assetRole", "animation.lottie"), "SCHEMA"),
    ("source decorative video loop role", GHOME, lambda d: node(d, STICKY)["content"]["blocks"][0]["visual"]["background"].__setitem__("assetRole", "video.decorative-loop"), "SCHEMA"),
    ("source YouTube embed with the source's video id", GART, lambda d: node(d, "media.video-embed")["content"].__setitem__("video", {"assetRole": "embed.youtube", "videoId": "8SEXP6zopwo"}), "SCHEMA"),
    ("licensed Font Awesome icon glyph", GPROD, lambda d: node(d, "agents.expert-team")["content"]["benefits"][0].__setitem__("icon", {"assetRole": "icon.glyph", "codepoint": "U+F890"}), "SCHEMA"),
    ("generation-safe role that this section does not list", GHOME, lambda d: node(d, HERO)["content"]["images"][0].__setitem__("assetRole", "video.user-supplied"), "SCHEMA"),
    ("invented role in a generated page", GHOME, lambda d: node(d, HERO)["content"]["images"][0].__setitem__("assetRole", "illustration.stock-photo"), "SCHEMA"),
    # ---- customer logos / people photos
    ("real customer logo role in the hero ticker", GHOME, lambda d: node(d, HERO)["content"]["tickerRows"][0][0].__setitem__("assetRole", "logo.customer"), "SCHEMA"),
    ("real investor logo role in a logo grid", GHOME, lambda d: node(d, INTEG)["content"]["groups"][0]["tiles"][0]["logo"].__setitem__("assetRole", "logo.partner-investor"), "SCHEMA"),
    ("real integration logo role in a logo grid", GHOME, lambda d: node(d, INTEG)["content"]["groups"][0]["tiles"][0]["logo"].__setitem__("assetRole", "logo.integration"), "SCHEMA"),
    ("real person photo role on a testimonial", GHOME, lambda d: node(d, TESTI)["content"]["slides"][0]["photo"].__setitem__("assetRole", "photo.person-real"), "SCHEMA"),
    ("real customer logo role on a testimonial", GHOME, lambda d: node(d, TESTI)["content"]["slides"][0]["logo"].__setitem__("assetRole", "logo.customer"), "SCHEMA"),
    ("customer logo role on a story card", GHOME, lambda d: node(d, STORIES)["content"]["cards"][0]["logo"].__setitem__("assetRole", "logo.customer"), "SCHEMA"),
    # ---- source URLs
    ("source site URL as a CTA href", GHOME, lambda d: node(d, "shell.navbar")["content"]["cta"].__setitem__("href", "https://www.siena.cx/book-a-demo"), "SCHEMA"),
    ("real external host as a CTA href", GHOME, setp(CTA, ["content", "button", "href"], "https://acme.com/start"), "SCHEMA"),
    ("example.com (not a .example host) as an href", GHOME, setp(CTA, ["content", "button", "href"], "https://example.com/start"), "SCHEMA"),
    ("mailto to the source's domain", GHOME, setp(CTA, ["content", "button", "href"], "mailto:careers@siena.cx"), "SCHEMA"),
    ("mailto to a real mail provider", GHOME, setp(CTA, ["content", "button", "href"], "mailto:someone@gmail.com"), "SCHEMA"),
    ("source URL typed into body text", GHOME, lambda d: node(d, FEAT)["content"]["cards"][0].__setitem__("body", "Read more at https://www.siena.cx/blog today."), "GENERATED_MODE_SOURCE_URL"),
    ("source security-portal host in text", GART, lambda d: node(d, "content.article-faq")["content"]["faq"][0]["answer"].__setitem__("text", "Visit sienaai.trust.site for details."), "GENERATED_MODE_SOURCE_URL"),
    ("source social handle in text", GART, lambda d: node(d, "content.article-faq")["content"]["faq"][0]["answer"].__setitem__("text", "Follow x.com/lisapopovici for updates."), "GENERATED_MODE_SOURCE_URL"),
    ("source LinkedIn profile in text", GART, lambda d: node(d, "content.article-faq")["content"]["faq"][0]["answer"].__setitem__("text", "See linkedin.com/in/negrau for the profile."), "GENERATED_MODE_SOURCE_URL"),
    ("source event link in text", GART, lambda d: node(d, "content.article-faq")["content"]["faq"][0]["answer"].__setitem__("text", "Register at https://luma.com/qspvr322 now."), "GENERATED_MODE_SOURCE_URL"),
    ("real third-party URL in text", GART, lambda d: node(d, "content.article-faq")["content"]["faq"][0]["answer"].__setitem__("text", "Details live at https://acme-support.com/help for now."), "GENERATED_MODE_EXTERNAL_URL"),
    ("route is a source customer's story slug", GART, lambda d: d.__setitem__("route", "/conversations/spanx-kylah-field-real-work"), "GENERATED_MODE_SOURCE_CUSTOMER"),
    # ---- people and customer identities
    ("testimonial author is a real customer (Kylah Field)", GHOME, lambda d: gslide(d, "name", "Kylah Field"), "GENERATED_MODE_SOURCE_PERSON"),
    ("testimonial author is a real customer (Paige Zachs)", GHOME, lambda d: gslide(d, "name", "Paige Zachs"), "GENERATED_MODE_SOURCE_PERSON"),
    ("testimonial author lower-cased real name", GHOME, lambda d: gslide(d, "name", "kylah field"), "GENERATED_MODE_SOURCE_PERSON"),
    ("founder named in a role line", GHOME, lambda d: gslide(d, "role", "Advisor, with Lisa Popovici"), "GENERATED_MODE_SOURCE_PERSON"),
    ("founder as the article guest", GART, lambda d: node(d, "content.article-header")["content"]["guest"].__setitem__("name", "Andrei Negrau"), "GENERATED_MODE_SOURCE_PERSON"),
    ("team member in the article headline", GART, lambda d: node(d, "content.article-header")["content"].__setitem__("headline", "Hudson Lofchie on calmer support"), "GENERATED_MODE_SOURCE_PERSON"),
    ("person photo alt names a real person", GHOME, lambda d: node(d, TESTI)["content"]["slides"][0]["photo"].__setitem__("alt", "Photo of Jeremy Thurswell"), "GENERATED_MODE_SOURCE_PERSON"),
    ("case-study customer as the article guest brand", GART, lambda d: node(d, "content.article-header")["content"]["guest"].__setitem__("brand", "Thrive Causemetics"), "GENERATED_MODE_SOURCE_CUSTOMER"),
    ("real customer in a testimonial role", GHOME, lambda d: gslide(d, "role", "VP of Global CX at Spanx"), "GENERATED_MODE_SOURCE_CUSTOMER"),
    ("real customer in a story card title", GHOME, lambda d: node(d, STORIES)["content"]["cards"][0].__setitem__("title", "How Terra Kaffe cut handle time"), "GENERATED_MODE_SOURCE_CUSTOMER"),
    ("real customer logo alt text", GHOME, lambda d: node(d, HERO)["content"]["tickerRows"][0][0].__setitem__("alt", "Simple Modern logo"), "GENERATED_MODE_SOURCE_CUSTOMER"),
    ("real investor named in a heading", GHOME, setp(CTA, ["content", "heading"], "Backed by Sierra Ventures"), "GENERATED_MODE_SOURCE_CUSTOMER"),
    ("rare-word customer in its own capitalisation", GHOME, setp(CTA, ["content", "heading"], "Why Coterie switched"), "GENERATED_MODE_SOURCE_CUSTOMER"),
    ("ALL-CAPS source customer", GHOME, setp(CTA, ["content", "heading"], "Trusted by FIGS and others"), "GENERATED_MODE_SOURCE_CUSTOMER"),
]
GEN_WARN_CASES = [
    ("third-party product named in generated copy only warns", GHOME, lambda d: node(d, FEAT)["content"]["cards"][0].__setitem__("body", "Connects to Shopify and Zendesk out of the box."), "GENERATED_MODE_THIRD_PARTY"),
]
GEN_CONTROL_EDITS = [
    ("ordinary English words that are also source customer names (create, hero, true) are allowed", GHOME, setp(CTA, ["content", "heading"], "Create a true hero moment"), None),
    ("an unrelated fictional person and company", GHOME, lambda d: [gslide(d, "name", "Imelda Voss"), gslide(d, "role", "Director at Harrow Lane")], None),
    ("a reserved .example host in an href", GHOME, setp(CTA, ["content", "button", "href"], "https://shop.example/start"), None),
    ("a reserved .invalid mailto", GHOME, setp(CTA, ["content", "button", "href"], "mailto:care@brightloop.invalid"), None),
    ("a user-supplied logo and photo", GHOME, lambda d: [node(d, TESTI)["content"]["slides"][0]["photo"].update(assetRole="photo.user-supplied", assetRef="user-supplied/team-photo.webp"), node(d, TESTI)["content"]["slides"][0]["logo"].update(assetRole="logo.user-supplied", assetRef="user-supplied/customer-logo.svg")], None),
]
MUTATIONS += GEN_MUTATIONS

WARN_CASES = [
    ("homepage-set template showing fewer than 11 slides", HOME, lambda d: node(d, TESTI)["content"]["slides"].pop(), "TESTIMONIAL_SET_COUNT"),
] + GEN_WARN_CASES


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
    # ---- generated layer, directly: rules the schema blocks first are exercised on schema-invalid input so their code path is proven too
    def gen_out(doc, repo=None):
        out = []
        SV.check_generated(doc, repo or REPO, out)
        return out

    def has(out, rule, sev="error"):
        return any(r[1] == rule and r[0] == sev for r in out)

    d = copy.deepcopy(GHOME)
    node(d, HERO)["content"]["tickerRows"][0][0]["assetRole"] = "logo.customer"
    results.append(("blocked role logo.customer (generated layer)", has(gen_out(d), "GENERATED_MODE_REFERENCE_ASSET"), "error GENERATED_MODE_REFERENCE_ASSET"))
    d = copy.deepcopy(GHOME)
    node(d, "shell.footer")["content"]["brand"]["assetRole"] = "brand.siena-wordmark"
    results.append(("reference-only role brand.siena-wordmark (generated layer)", has(gen_out(d), "GENERATED_MODE_REFERENCE_ASSET"), "error GENERATED_MODE_REFERENCE_ASSET"))
    d = copy.deepcopy(GHOME)
    node(d, HERO)["content"]["images"][0]["assetRole"] = "video.user-supplied"
    results.append(("generation-safe role not listed for the section (generated layer)", has(gen_out(d), "GENERATED_MODE_ROLE"), "error GENERATED_MODE_ROLE"))
    d = copy.deepcopy(GHOME)
    node(d, "shell.navbar")["content"]["cta"]["href"] = "https://www.siena.cx/book-a-demo"
    results.append(("source URL in an href (generated layer)", has(gen_out(d), "GENERATED_MODE_SOURCE_URL"), "error GENERATED_MODE_SOURCE_URL"))
    d = copy.deepcopy(GHOME)
    node(d, "shell.navbar")["content"]["cta"]["href"] = "https://acme.com/x"
    results.append(("real external URL in an href (generated layer)", has(gen_out(d), "GENERATED_MODE_EXTERNAL_URL"), "error GENERATED_MODE_EXTERNAL_URL"))
    d = copy.deepcopy(GHOME)
    node(d, HERO)["content"]["images"][0]["assetRef"] = "assets/hero.webp"
    results.append(("clone-relative assetRef (generated layer)", has(gen_out(d), "GENERATED_MODE_ASSET_REF"), "error GENERATED_MODE_ASSET_REF"))
    d = copy.deepcopy(GHOME)
    node(d, TESTI)["content"]["slides"][0]["quote"]["source"] = "verified"
    results.append(("verified quote source (generated layer)", has(gen_out(d), "GENERATED_MODE_QUOTE"), "error GENERATED_MODE_QUOTE"))
    invented = "A control sentence that stands in for a verified quote of a real person."
    patched = dict(REPO, quotes=dict(REPO["quotes"], **{SV.hashlib.sha256(SV.norm_quote(invented).encode("utf-8")).hexdigest(): {"person": "Nobody"}}))
    d = copy.deepcopy(GHOME)
    node(d, TESTI)["content"]["slides"][0]["quote"]["text"] = invented
    results.append(("quote equal to a registered verified quote (hash match)", has(gen_out(d, patched), "GENERATED_MODE_QUOTE") and not has(gen_out(d), "GENERATED_MODE_QUOTE"), "error GENERATED_MODE_QUOTE (patched registry only)"))
    phrase = "violet lanterns drift above quiet"
    patched2 = dict(REPO, sourceHashes=dict(REPO["sourceHashes"], copyShingles=REPO["sourceHashes"]["copyShingles"] | {SV._h16(phrase)}))
    d = copy.deepcopy(GHOME)
    node(d, HERO)["content"]["subtitle"] = "We say violet lanterns drift above quiet harbour towns twice."
    results.append(("5-word run equal to a registered source shingle (hash match)", has(gen_out(d, patched2), "GENERATED_MODE_SOURCE_COPY") and not has(gen_out(d), "GENERATED_MODE_SOURCE_COPY"), "error GENERATED_MODE_SOURCE_COPY (patched registry only)"))
    results.append(("empty source registry accepts a leaking page (the registry is what enforces)", not has(gen_out(copy.deepcopy(GHOME) | {"route": "/x"}, dict(REPO, _res={k: None for k in SV._brand_res(REPO)})), "GENERATED_MODE_SOURCE_BRAND"), "control: pins in verify_all.py catch an emptied registry"))
    return results


# ------------------------------------------------------------------ section-contract layer
# Contracts are not PageSpecs, so these mutate an in-memory copy of one contract and run
# semantic_validate.validate_section_contract(); each must be rejected with the named rule.
def contract(t):
    return copy.deepcopy(REPO["sections"][t])


def cset(path, value):
    def f(c):
        for p in path[:-1]:
            c = c[p]
        c[path[-1]] = value
    return f


def cdel(path):
    def f(c):
        for p in path[:-1]:
            c = c[p]
        del c[path[-1]]
    return f


def cutility_clone(c):
    c["typeId"] = "cta.cookie-consent"
    c["id"] = c["registryId"] = "section.cta.cookie-consent"
    c["semantic"]["id"] = "semantic.cta.cookie-consent"


def cinline_cta(c):
    c["contentModel"]["properties"]["cta"] = {"type": "object"}


CONTRACT_MUTATIONS = [
    ("partner modal flagged retrievalEligible true", "overlay.partner-modal", lambda c: [c.__setitem__("retrievalEligible", True), c.pop("retrievalIneligibleReason")], "RETRIEVAL_PINNED"),
    ("phone-empty-block quirk flagged retrievalEligible true", "quirk.phone-empty-block", lambda c: [c.__setitem__("retrievalEligible", True), c.pop("retrievalIneligibleReason")], "RETRIEVAL_PINNED"),
    ("an ordinary hero flagged ineligible (not in the pinned set)", "hero.home", lambda c: [c.__setitem__("retrievalEligible", False), c.__setitem__("retrievalIneligibleReason", "Pretend this hero is a utility block so retrieval skips it.")], "RETRIEVAL_PINNED"),
    ("a cookie-consent style utility section left eligible", "cta.main", cutility_clone, "RETRIEVAL_PINNED"),
    ("retrievalEligible as the string 'false'", "overlay.partner-modal", cset(["retrievalEligible"], "false"), "CONTRACT_SCHEMA"),
    ("ineligible without a reason", "overlay.partner-modal", cdel(["retrievalIneligibleReason"]), "CONTRACT_SCHEMA"),
    ("reason too short to be a reason", "overlay.partner-modal", cset(["retrievalIneligibleReason"], "utility"), "CONTRACT_SCHEMA"),
    ("eligible section carrying a stale reason", "hero.home", cset(["retrievalIneligibleReason"], "This reason should not exist on an eligible section at all."), "CONTRACT_SCHEMA"),
    ("retrievalEligible missing", "hero.home", cdel(["retrievalEligible"]), "CONTRACT_SCHEMA"),
    ("extra field invented on source", "hero.home", cset(["source", "license"], "mit"), "CONTRACT_SCHEMA"),
    ("extra field invented on semantic", "hero.home", cset(["semantic", "citation"], "jsx.hero"), "CONTRACT_SCHEMA"),
    ("source object missing", "hero.home", cdel(["source"]), "CONTRACT_SCHEMA"),
    ("category outside the closed taxonomy", "hero.home", cset(["category"], "marketing"), "CONTRACT_SCHEMA"),
    ("semantic.id not derived from the typeId", "hero.home", cset(["semantic", "id"], "semantic.hero.other"), "SOURCE_SEMANTIC"),
    ("semantic.category differs from the section category", "hero.home", cset(["semantic", "category"], "feature"), "SOURCE_SEMANTIC"),
    ("source.id not derived from its citation", "hero.home", cset(["source", "id"], "source.jsx.other"), "SOURCE_SEMANTIC"),
    ("source citation not among measuredFrom", "hero.home", lambda c: c["measuredFrom"].remove(c["source"]["citation"]), "SOURCE_SEMANTIC"),
    ("source citation undefined in the evidence ledger", "hero.home", lambda c: [c["source"].__setitem__("citation", "jsx.ghost"), c["source"].__setitem__("id", "source.jsx.ghost"), c["measuredFrom"].append("jsx.ghost")], "SOURCE_SEMANTIC"),
    ("source lines differ from the cited lines", "hero.home", cset(["source", "lines"], "1-2"), "SOURCE_SEMANTIC"),
    ("source file differs from the cited file", "hero.home", cset(["source", "file"], "src/pages/Home.jsx"), "SOURCE_SEMANTIC"),
    ("source tag wrong for the cited file", "hero.home", cset(["source", "tag"], "measured-spec"), "SOURCE_SEMANTIC"),
    ("cta.* section classed as a feature", "cta.demo-form", cset(["category"], "feature"), "CLASS_POLICY"),
    ("conversion promo classed back as a feature", "cta.agent-promo", cset(["category"], "feature"), "CLASS_POLICY"),
    ("conversion category on a non-cta id", "feature.pipeline", cset(["category"], "conversion"), "CLASS_POLICY"),
    ("editorial stories classed as features", "stories.carousel", cset(["category"], "feature"), "CLASS_POLICY"),
    ("article header classed as a hero", "content.article-header", cset(["category"], "hero"), "CLASS_POLICY"),
    ("hero.* classed as content", "hero.home", cset(["category"], "content"), "CLASS_POLICY"),
    ("unreviewed CTA field inside a feature section", "features.icon-grid", cinline_cta, "CLASS_POLICY"),
    # ---- generated-mode asset roles of a section
    ("generatedAssetRoles lists a blocked role (logo.customer)", "hero.home", lambda c: c["generatedAssetRoles"].append("logo.customer"), "GENERATED_ROLES"),
    ("generatedAssetRoles lists a reference-only role (illustration.editorial)", "hero.home", lambda c: c["generatedAssetRoles"].append("illustration.editorial"), "GENERATED_ROLES"),
    ("generatedAssetRoles lists the Siena wordmark", "shell.lead-header", lambda c: c["generatedAssetRoles"].append("brand.siena-wordmark"), "GENERATED_ROLES"),
    ("generatedAssetRoles lists an unknown role", "hero.home", lambda c: c["generatedAssetRoles"].append("logo.invented"), "GENERATED_ROLES"),
    ("generatedAssetRoles drops a derived role", "hero.home", lambda c: c["generatedAssetRoles"].pop(), "GENERATED_ROLES"),
    ("generatedAssetRoles widened with a generation-safe role the slots do not derive", "hero.home", lambda c: c["generatedAssetRoles"].append("icon.generated"), "GENERATED_ROLES"),
    ("generatedAssetRoles missing", "hero.home", cdel(["generatedAssetRoles"]), "CONTRACT_SCHEMA"),
    ("generatedAssetRoles not a list", "hero.home", cset(["generatedAssetRoles"], "logo.placeholder"), "CONTRACT_SCHEMA"),
    ("footer generatedOverrides no longer removes the compliance badge", "shell.footer", lambda c: c["generatedOverrides"].pop("removeProperties"), "GENERATED_ROLES"),
    ("generatedOverrides with an invented key", "shell.navbar", lambda c: c["generatedOverrides"].__setitem__("allowSourceBrand", True), "CONTRACT_SCHEMA"),
]


def contract_cases():
    results = []
    for name, t, fn, rule in CONTRACT_MUTATIONS:
        c = contract(t)
        # keep the mutated contract's derived fields consistent unless the mutation is about them
        fn(c)
        # semantic.category follows category unless the case is about the mismatch
        if rule == "CLASS_POLICY" and "semantic" in c and c["semantic"]["category"] != c["category"]:
            c["semantic"]["category"] = c["category"]
        errs = [r for r in SV.validate_section_contract(c, REPO) if r[0] == "error"]
        results.append((name, bool(errs) and any(r[1] == rule for r in errs), rule, errs))
    clean = [(t, SV.validate_section_contract(c, REPO)) for t, c in sorted(REPO["sections"].items())]
    return results, clean


# ------------------------------------------------------------------ whole-page-wrapper gate
import wrapper_gate as WG  # noqa: E402,E501

MV = J("extraction/measured-values.json")
R_ABOUT, R_HOME, R_INS = "/about-us", "/", "/insights"


def gmut(fn):
    d = copy.deepcopy(MV)
    fn(d["sectionHeights"])
    return d


def grow(route, section, new_h, k=0):
    """Change one measured node and keep the page accounting self-consistent (so only the intended rule trips)."""
    def f(sh):
        rec = sh["routes"][route]
        n = [x for x in rec["nodes"] if x["section"] == section][k]
        delta = new_h - n["heightPx"]
        n["heightPx"] = new_h
        rec["inFlowHeightPx"] += delta
        rec["documentHeightPx"] += delta
        rec["unattributedPx"] = rec["documentHeightPx"] - rec["inFlowHeightPx"]
    return f


def both(*fs):
    return lambda sh: [f(sh) for f in fs]


WHO = "Reviewer (adversarial fixture)"
WL = lambda route, section, mx, just="A long enough justification that explains why this hero is legitimately this tall.": lambda sh: sh["heroWhitelist"].append({"route": route, "section": section, "reviewedBy": WHO, "justification": just, "maxHeightPx": mx})  # noqa: E731
GATE_ERRORS = [
    ("hero measured at 3500px with no review", gmut(grow(R_HOME, "hero.home", 3500)), "whole-page wrapper"),
    ("whitelisted hero with a 12-character justification", gmut(both(grow(R_HOME, "hero.home", 3500), WL(R_HOME, "hero.home", 4000, "too short..."))), "justification must be"),
    ("whitelisted hero whose maxHeightPx is below the measurement", gmut(both(grow(R_HOME, "hero.home", 3500), WL(R_HOME, "hero.home", 3400))), "must be above the measured height"),
    ("whitelist entry without reviewedBy", gmut(both(grow(R_HOME, "hero.home", 3500), lambda sh: sh["heroWhitelist"].append({"route": R_HOME, "section": "hero.home", "justification": "A long enough justification that explains why this hero is legitimately tall.", "maxHeightPx": 4000}))), "missing reviewedBy"),
    ("a whole route's measurement removed", gmut(lambda sh: sh["routes"].pop("/pricing")), "no measurement recorded"),
    ("sectionHeights block removed entirely", None, "never recorded"),
    ("one node's heightPx deleted", gmut(lambda sh: sh["routes"][R_HOME]["nodes"][2].pop("heightPx")), "no numeric heightPx"),
    ("one node's heightPx null", gmut(lambda sh: sh["routes"][R_HOME]["nodes"][2].__setitem__("heightPx", None)), "no numeric heightPx"),
    ("an in-flow section recorded with zero height", gmut(grow(R_HOME, "stats.metrics", 0)), "no in-flow height"),
    ("a node dropped from a route's measurements", gmut(lambda sh: sh["routes"][R_HOME]["nodes"].pop(3)), "not a valid"),
    ("measured sequence out of template order", gmut(lambda sh: sh["routes"][R_HOME]["nodes"].insert(2, sh["routes"][R_HOME]["nodes"].pop(4))), "not a valid"),
    ("a second hero measured on a page", gmut(lambda sh: sh["routes"][R_HOME]["nodes"].insert(2, copy.deepcopy(sh["routes"][R_HOME]["nodes"][1]))), "hero.* sections measured"),
    ("page H1 sits in a non-hero block", gmut(lambda sh: [sh["routes"][R_HOME]["nodes"][1].__setitem__("h1Count", 0), sh["routes"][R_HOME]["nodes"][2].__setitem__("h1Count", 1)]), "hero-like block"),
    ("two H1 on one page", gmut(lambda sh: sh["routes"][R_HOME].__setitem__("h1Total", 2)), "exactly one"),
    ("hero-less legal page whose H1 is in the body part", gmut(lambda sh: [sh["routes"]["/privacy-policy"]["nodes"][1].__setitem__("h1Count", 0), sh["routes"]["/privacy-policy"]["nodes"][2].__setitem__("h1Count", 1)]), "hero-less page"),
    ("inFlowHeightPx does not equal the node sum", gmut(lambda sh: sh["routes"][R_HOME].__setitem__("inFlowHeightPx", 5)), "!= sum of node heights"),
    ("nodes cover far less than the document", gmut(lambda sh: sh["routes"][R_HOME].__setitem__("documentHeightPx", 30000)), "unattributed"),
    ("gate threshold weakened in the data", gmut(lambda sh: sh["gate"].__setitem__("heroFailPx", 9000)), "may not be weakened"),
    ("reviewed section grew past its reviewed share", gmut(grow(R_ABOUT, "story.horizontal-scroll", 20000)), "re-review"),
    ("two routes sharing one template with unrelated sections", gmut(lambda sh: sh["routes"]["/book-a-demo"].update(nodes=[n for n in sh["routes"]["/book-a-demo"]["nodes"] if n["section"] != "testimonials.slider"])), "not one page type"),
    ("reviewed-share entry with a short justification", gmut(lambda sh: sh["shareReviewed"][0].__setitem__("justification", "fine")), "justification must be"),
]
GATE_WARNS = [
    ("hero at 2000px only warns", gmut(grow(R_HOME, "hero.home", 2000)), "> 1800px"),
    ("hero at 3500px with a real whitelist entry warns, never errors", gmut(both(grow(R_HOME, "hero.home", 3500), WL(R_HOME, "hero.home", 4000))), "whitelisted by"),
    ("unreviewed section holding over half a page warns", gmut(grow("/events", "events.empty-list", 4000)), "unreviewed"),
]


def gate_cases():
    out = []
    for name, mv, expect in GATE_ERRORS:
        if mv is None:
            mv = copy.deepcopy(MV)
            mv.pop("sectionHeights")
        errs, warns, _ = WG.evaluate(mv, REPO)
        out.append((name, any(expect in e for e in errs), "error " + repr(expect)))
    for name, mv, expect in GATE_WARNS:
        errs, warns, _ = WG.evaluate(mv, REPO)
        out.append((name, any(expect in w for w in warns) and not errs, "warn " + repr(expect)))
    errs, warns, _ = WG.evaluate(copy.deepcopy(MV), REPO)
    out.append(("the real recorded measurements pass with zero errors", not errs, "control"))
    return out


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
    c_res, c_clean = contract_cases()
    c_rej = 0
    for name, ok, rule, errs in c_res:
        c_rej += ok
        print(f"{'REJECTED' if ok else 'NOT REJECTED':12} contract: {name:56} expects {rule}" + ("" if ok else f"  got {[r[1] for r in errs][:4]}"))
        fails += not ok
    c_ok = 0
    for t, res in c_clean:
        ok = not res
        c_ok += ok
        if not ok:
            print(f"CONTRACT FAIL  {t}: {res[:2]}")
        fails += not ok
    print(f"{'CONTROL PASS' if c_ok == len(c_clean) else 'CONTROL FAIL':12} all {len(c_clean)} real section contracts pass the contract layer with zero findings")
    g_res = gate_cases()
    g_ok = 0
    for name, ok, what in g_res:
        g_ok += ok
        print(f"{'CAUGHT' if ok else 'MISSED':12} wrapper gate: {name:58} expects {what}")
        fails += not ok
    gen_edit_controls = []
    for nm, base, fn, _ in GEN_CONTROL_EDITS:
        gd = mut(base, fn)
        gen_edit_controls.append(("generated control: " + nm, gd))
    controls = ([("homepage example (reference mode, real copy)", HOME), ("insights example (reference mode, real copy)", INSIGHTS),
                 ("generated home example (fictional brand)", GHOME), ("generated product-page example", GPROD), ("generated conversation example", GART), ("generated legal example", GLEG)]
                + gen_edit_controls
                + [(f"synthesized control {tid} ({c['route']})", c) for tid, c in sorted(CONTROLS.items())]
                + [(f"synthesized GENERATED control {tid} ({c['route']})", c) for tid, c in sorted(GEN_CONTROLS.items())])
    passed = 0
    for name, doc in controls:
        res = SV.validate_pagespec(doc, REPO)
        ok = not res
        passed += ok
        print(f"{'CONTROL PASS' if ok else 'CONTROL FAIL':12} {name}" + ("" if ok else f"  {res[:3]}"))
        fails += not ok
    covered = {d["template"] for _, d in controls if d["mode"] == "reference"}
    gen_covered = {d["template"] for _, d in controls if d["mode"] == "generated"}
    if set(REPO["templates"]) - gen_covered:
        print("GENERATED CONTROL GAP: templates without a generated control:", sorted(set(REPO["templates"]) - gen_covered))
        fails += 1
    missing = sorted(set(REPO["templates"]) - covered)
    if missing:
        print("CONTROL GAP: templates without a control:", missing)
        fails += 1
    print(f"adversarial: {rejected}/{len(MUTATIONS)} PageSpec mutations rejected, {c_rej}/{len(c_res)} contract mutations rejected, {g_ok}/{len(g_res)} wrapper-gate cases caught, {len(WARN_CASES)} warn-case(s), {len(direct_cases())} direct graph-layer case(s), {passed}/{len(controls)} controls pass with zero findings, {c_ok}/{len(c_clean)} real contracts clean, {len(covered)}/{len(REPO['templates'])} templates covered (reference), {len(gen_covered)}/{len(REPO['templates'])} (generated)")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
