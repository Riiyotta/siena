#!/usr/bin/env python3
"""Verification sweep for the Siena design-repo. Run from anywhere:

    python3 extraction/verify_all.py [--skip-adversarial]

DR (the repo root) is derived from this file's location, never a machine path.
Exit 0 = every check passed (warnings allowed); 1 = at least one error; 2 = not a design-repo.

Checks (numbers match the printed output):
  0 self-containment sentinel           8 templates / routes / graph / overrides / quirks
  1 JSON parse                          9 schema freshness, Draft-07, examples
  2 allowlist <-> contract parity      10 citations (range + content), source drift,
  3 tokens: refs, catalog, policy,        histogram + verified-quote rebuild drift
    histogram evidence                 11 manifest counts, versions, entryPoints, docs, machine paths
  4 contract references resolve        12 section contracts: meta schema, pinned retrievalEligible,
  5 raw-value lint                        source vs semantic, classification policy, source lines
  6 graph rules <-> validator code     13 whole-page-wrapper gate (extraction/wrapper_gate.py)
  7 asset roles (pinned policies +      14 IA parity (ia.json / IA.md / matrix.csv beside the repo)
    pinned availability, usedBy,       15 generated mode (pinned source-identity probes, registry re-derived
    substitutes, wiring)                  from src/, canary mutations, examples)
                                       16 adversarial suite
When the clone's source tree (src/, specs/, recon/) is not beside design-repo/ (a standalone
copy), every check that needs it is SKIPPED with a warning; nothing fails because of it.
"""
import glob
import hashlib
import json
import os
import re
import subprocess
import sys

DR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT = os.path.dirname(DR)
sys.path.insert(0, os.path.join(DR, "tokens"))
sys.path.insert(0, os.path.join(DR, "schema"))
sys.path.insert(0, os.path.join(DR, "extraction"))
errors, warnings = [], []


def err(tag, msg):
    errors.append(f"[{tag}] {msg}")


def warn(tag, msg):
    warnings.append(f"[{tag}] {msg}")


def jload(rel):
    with open(os.path.join(DR, rel), encoding="utf-8") as f:
        return json.load(f)


# 0 ---------------------------------------------------------------------------
sentinels = ["registry.manifest.json", "schema/pagespec.schema.json", "sections", "primitives", "components", "tokens", "templates/templates.json", "extraction/measured-values.json"]
missing = [s for s in sentinels if not os.path.exists(os.path.join(DR, s))]
if missing:
    print(f"FATAL: {DR} lacks {missing}; refusing a false clean pass.")
    sys.exit(2)
HAVE_SRC = all(os.path.isdir(os.path.join(PROJECT, d)) for d in ("src", "specs")) and os.path.exists(os.path.join(PROJECT, "CLONE_SPEC.md"))
print(f"0) Self-containment sentinel: ok (sibling source tree {'present' if HAVE_SRC else 'ABSENT - standalone mode'})")

# 1 ---------------------------------------------------------------------------
files = sorted(glob.glob(os.path.join(DR, "**", "*.json"), recursive=True))
parsed = {}
for f in files:
    try:
        parsed[os.path.relpath(f, DR)] = json.load(open(f, encoding="utf-8"))
    except Exception as e:  # noqa: BLE001
        err("parse", f"{os.path.relpath(f, DR)}: {e}")
print(f"1) JSON parse: {len(files)} files, {sum(e.startswith('[parse]') for e in errors)} failed")


def reg(d):
    out = {}
    for f in sorted(glob.glob(os.path.join(DR, d, "*.json"))):
        j = json.load(open(f, encoding="utf-8"))
        out[j["registryId"]] = (os.path.relpath(f, DR), j)
    return out


prims, comps, secs = reg("primitives"), reg("components"), reg("sections")
sec_by_type = {j["typeId"]: j for _, j in secs.values()}
tdoc = jload("templates/templates.json")
templates = tdoc["templates"]
allow = jload("tokens/llm/component-allowlist.json")
sch = jload("schema/pagespec.schema.json")
assets = jload("assets/asset-roles.json")
recipes = jload("tokens/10-semantic/motion.json")["motion"]["recipe"]


# 2 ---------------------------------------------------------------------------
def parity(name, real, listed):
    for m in sorted(set(real) - set(listed)):
        err("allowlist-parity", f"{name} '{m}' has a contract but is NOT in the allowlist")
    for p in sorted(set(listed) - set(real)):
        err("allowlist-parity", f"{name} '{p}' is in the allowlist but has NO contract file")
    return len(set(real) - set(listed)), len(set(listed) - set(real))


r2 = [parity("primitive", prims, allow["primitives"]), parity("component", comps, allow["components"]), parity("section", secs, allow["sections"]), parity("template", templates, allow["templates"])]
for key, real in (("settableNodeProperties", sch["definitions"]["node"]["properties"]), ("settablePageProperties", sch["properties"]),
                  ("settableMotionFields", sch["definitions"]["motion"]["properties"]), ("settableHeadFields", sch["definitions"]["head"]["properties"])):
    if sorted(allow[key]) != sorted(real):
        err("allowlist-parity", f"{key} {sorted(allow[key])} != schema {sorted(real)}")
if sorted(allow["assetRoles"]) != sorted(assets["roles"]):
    err("allowlist-parity", "allowlist assetRoles differ from assets/asset-roles.json")
if sorted(allow["motionPatterns"]) != sorted(recipes):
    err("allowlist-parity", "allowlist motionPatterns differ from tokens/10-semantic/motion.json recipes")
print(f"2) Allowlist parity (missing, phantom): primitives {r2[0]}, components {r2[1]}, sections {r2[2]}, templates {r2[3]}")

# 3 tokens ----------------------------------------------------------------------
import tokens_lib as TL  # noqa: E402
import build_catalog as BC  # noqa: E402

c3 = len(errors)
tree, _ = TL.load_tree()
for path, nd in TL.walk_tokens(tree):
    try:
        TL.resolve_value(tree, nd)
        for ref in TL.refs_in(nd["$value"]):
            TL.lookup(tree, ref)
    except (KeyError, ValueError) as e:
        err("token-ref", f"{path}: {e}")
for layer in ("10-semantic", "20-component", "30-layout"):
    for f in glob.glob(os.path.join(DR, "tokens", layer, "*.json")):
        for ref in TL.refs_in(json.load(open(f, encoding="utf-8"))):
            try:
                TL.lookup(tree, ref)
            except KeyError:
                err("token-ref", f"{os.path.relpath(f, DR)}: unresolved {{{ref}}}")
for theme_file in glob.glob(os.path.join(DR, "tokens", "themes", "*.json")):
    for slot, ref in json.load(open(theme_file, encoding="utf-8"))["slots"].items():
        for rf in TL.refs_in(ref):
            try:
                TL.lookup(tree, rf)
            except KeyError:
                err("token-ref", f"{os.path.relpath(theme_file, DR)} slot {slot}: unresolved {{{rf}}}")
catalog_text = json.dumps(BC.build(), indent=1, ensure_ascii=False) + "\n"
if open(BC.OUT, encoding="utf-8").read() != catalog_text:
    err("catalog", "tokens/llm/token-catalog.json is out of date; run tokens/build_catalog.py")
cat = json.loads(catalog_text)
policy = jload("tokens/llm/token-policy.json")
for c in policy["rules"]["rawValueRestrictions"]:
    if c not in cat["counts"]["byCategory"]:
        err("token-policy", f"rawValueRestrictions category {c!r} is not a real catalog category {sorted(cat['counts']['byCategory'])}")
for pat in policy["notGenerationApproved"]:
    pre = pat.rstrip("*").rstrip(".")
    if not any(p == pre or p.startswith(pre + ".") for p in cat["tokens"]):
        err("token-policy", f"notGenerationApproved pattern {pat!r} matches no token")
# histogram evidence: every $extensions.histogram claim must match style-histogram.json exactly
hist = jload("extraction/style-histogram.json")["histogram"]
n_hist = 0
for path, nd in TL.walk_tokens(tree):
    claim = nd.get("$extensions", {}).get("histogram")
    if not claim:
        continue
    for part in claim.split(";"):
        prop, _, rest = part.strip().partition(":")
        val, _, cnt = rest.rpartition("=")
        n_hist += 1
        if hist.get(prop, {}).get(val) != int(cnt):
            err("token-evidence", f"{path}: histogram claim {part.strip()!r} does not match extraction/style-histogram.json ({hist.get(prop, {}).get(val)})")
for path, nd in TL.walk_tokens(tree):
    if path.startswith("foundation.color") and not (nd.get("$extensions", {}).get("cite") or nd.get("$extensions", {}).get("histogram")):
        err("token-evidence", f"{path}: foundation colour without histogram or citation evidence")
print(f"3) Tokens: {cat['counts']['tokens']} leaf tokens + {cat['counts']['typographyRoles']} type roles + {cat['counts']['motionRecipes']} motion recipes; {n_hist} histogram claims checked; {len(errors) - c3} errors")

# 4 ---------------------------------------------------------------------------
CONTRACT_DIRS = ["primitives", "components", "sections"]
contract_files = {rel: j for rel, j in parsed.items() if rel.split("/")[0] in CONTRACT_DIRS + ["templates", "compatibility"]}
c4 = len(errors)
n_refs = 0
NOT_REFS = {"pattern", "description", "$description"}  # regex quantifiers like {4} and prose are not token refs


def contract_refs(x):
    if isinstance(x, str):
        yield from TL.REF.findall(x)
    elif isinstance(x, dict):
        for k, v in x.items():
            if k not in NOT_REFS:
                yield from contract_refs(v)
    elif isinstance(x, list):
        for v in x:
            yield from contract_refs(v)


for rel, j in contract_files.items():
    for ref in contract_refs(j):
        n_refs += 1
        try:
            TL.lookup(tree, ref)
        except KeyError:
            err("contract-ref", f"{rel}: unresolved token reference {{{ref}}}")
for reg_ in (comps, secs):
    for rid, (rel, j) in reg_.items():
        for cid in j.get("composes", []):
            if cid not in prims and cid not in comps:
                err("contract-ref", f"{rel}: composes unknown {cid!r}")
for rid, (rel, j) in secs.items():
    for p in j["motion"]["allowedPatterns"]:
        if p not in recipes:
            err("contract-ref", f"{rel}: motion pattern {p!r} is not a recipe in tokens/10-semantic/motion.json")
print(f"4) Contract references: {n_refs} token refs checked, composes + motion patterns resolved, {len(errors) - c4} errors")

# 5 raw-value lint ------------------------------------------------------------------
EXEMPT = set(policy["rawLintExemptKeys"])
RAW = [(re.compile(r"#[0-9a-fA-F]{3,8}\b"), "hex colour"), (re.compile(r"\brgba?\("), "rgb()/rgba()"),
       (re.compile(r"cubic-bezier"), "cubic-bezier"), (re.compile(r"(?<![\w.{])\d+(\.\d+)?(px|rem|em|ms)\b"), "raw length/duration")]
c5 = len(errors)


def lint(rel, path, x, exempt):
    if isinstance(x, dict):
        for k, v in x.items():
            lint(rel, f"{path}.{k}", v, exempt or k in EXEMPT)
    elif isinstance(x, list):
        for i, v in enumerate(x):
            lint(rel, f"{path}[{i}]", v, exempt)
    elif isinstance(x, str) and not exempt:
        s = TL.REF.sub("", x)
        for rx, what in RAW:
            m = rx.search(s)
            if m:
                err("raw-value", f"{rel}{path}: {what} {m.group(0)!r} should be a token (in {x[:70]!r})")


for rel, j in contract_files.items():
    if rel.split("/")[0] in CONTRACT_DIRS + ["templates"]:
        lint(rel, "", j, False)
print(f"5) Raw-value lint (primitives, components, sections, templates): {len(errors) - c5} violations")

# 6 ---------------------------------------------------------------------------
import semantic_validate as SV  # noqa: E402

graph = jload("compatibility/graph.json")
graph_ids = {r["id"] for r in graph["rules"]}
c6 = len(errors)
if graph_ids != SV.IMPLEMENTED_RULES:
    err("graph-vs-validator", f"rule ids differ: only in graph {sorted(graph_ids - SV.IMPLEMENTED_RULES)}, only in validator {sorted(SV.IMPLEMENTED_RULES - graph_ids)}")
code = open(os.path.join(DR, "schema", "semantic_validate.py"), encoding="utf-8").read().split("def check_graph_rules")[1]
for rid in graph_ids:
    if f'"{rid}"' not in code:
        err("graph-vs-validator", f"rule {rid} is declared but never raised in check_* code")
for r_ in graph["rules"]:
    if r_.get("severity") not in ("error", "warn"):
        err("graph", f"rule {r_['id']} lacks severity error|warn")
# the graph's prose for named exceptions must agree with the validator's real exception sets
for rid, names in (("ONE_HERO", SV.NO_HERO_TEMPLATES), ("NO_ADJACENT_SAME_SECTION", SV.ADJACENT_OK)):
    text = next((r["text"] for r in graph["rules"] if r["id"] == rid), "")
    for n_ in names:
        if n_ not in text:
            err("graph-vs-validator", f"{rid}: validator exception {n_} is not named in the graph rule text")
print(f"6) Graph rules vs validator code: {len(graph_ids)} rules, {len(errors) - c6} disagreements")

# 7 assets ------------------------------------------------------------------------
PINNED = {
    "brand.siena-wordmark": "must-reuse-exact", "brand.siena-glyph": "must-reuse-exact", "logo.customer": "must-reuse-exact", "logo.partner-investor": "must-reuse-exact",
    "logo.integration": "must-reuse-exact", "photo.person-real": "must-not-fabricate", "photo.editorial-scene": "must-reuse-exact", "illustration.editorial": "must-reuse-exact",
    "illustration.abstract-glow": "may-generate-new", "illustration.swash": "must-reuse-exact", "image.card-background": "must-reuse-exact", "product.ui-mock-image": "must-not-fabricate",
    "animation.lottie": "must-reuse-exact", "video.decorative-loop": "must-reuse-exact", "embed.youtube": "external-embed-allowlisted", "badge.compliance": "must-not-fabricate", "icon.glyph": "must-reuse-exact",
    "logo.placeholder": "may-generate-new", "logo.user-supplied": "must-reuse-exact", "avatar.placeholder": "may-generate-new", "photo.user-supplied": "must-reuse-exact",
    "illustration.generated": "may-generate-new", "product.ui-generated": "may-generate-new", "animation.generated": "may-generate-new", "video.user-supplied": "must-reuse-exact",
    "icon.generated": "may-generate-new",
}
# Availability in PageSpec mode "generated", pinned HERE, independent of assets/asset-roles.json (flipping a role to generation-safe in the registry fails check 7):
# the source's own brand / artwork / media / live endpoints are reference-only; third-party identity and licensed material is blocked-for-generation.
PINNED_AVAILABILITY = {
    "brand.siena-wordmark": "reference-only", "brand.siena-glyph": "reference-only", "embed.youtube": "reference-only", "animation.lottie": "reference-only",
    "illustration.editorial": "reference-only", "illustration.swash": "reference-only", "image.card-background": "reference-only", "photo.editorial-scene": "reference-only",
    "product.ui-mock-image": "reference-only", "video.decorative-loop": "reference-only",
    "logo.customer": "blocked-for-generation", "logo.integration": "blocked-for-generation", "logo.partner-investor": "blocked-for-generation", "photo.person-real": "blocked-for-generation",
    "badge.compliance": "blocked-for-generation", "icon.glyph": "blocked-for-generation",
    "illustration.abstract-glow": "generation-safe", "logo.placeholder": "generation-safe", "logo.user-supplied": "generation-safe", "avatar.placeholder": "generation-safe",
    "photo.user-supplied": "generation-safe", "illustration.generated": "generation-safe", "product.ui-generated": "generation-safe", "animation.generated": "generation-safe",
    "video.user-supplied": "generation-safe", "icon.generated": "generation-safe",
}
c7 = len(errors)
if set(PINNED_AVAILABILITY) != set(PINNED):
    err("asset-role", "PINNED_AVAILABILITY and PINNED name different roles")
for role, spec in assets["roles"].items():
    if spec["policy"] not in assets["policyEnum"]:
        err("asset-role", f"{role}: policy {spec['policy']!r} not in policyEnum")
    if role not in PINNED:
        err("asset-role", f"{role}: no pinned policy in verify_all.PINNED")
    elif spec["policy"] != PINNED[role]:
        err("asset-role", f"{role}: policy {spec['policy']!r} differs from pinned {PINNED[role]!r} (compliance-critical)")
    if not spec.get("guidance"):
        err("asset-role", f"{role}: missing guidance")
    av = spec.get("availability")
    if av not in assets.get("availabilityValues", []):
        err("asset-role", f"{role}: availability {av!r} is not in the closed availabilityValues {assets.get('availabilityValues')}")
    if role in PINNED_AVAILABILITY and av != PINNED_AVAILABILITY[role]:
        err("asset-availability", f"{role}: availability {av!r} differs from pinned {PINNED_AVAILABILITY[role]!r} (generated-mode compliance: a different-but-valid value is a failure)")
    if not spec.get("generatedModeGuidance"):
        err("asset-role", f"{role}: missing generatedModeGuidance")
    subs = spec.get("generationSafeSubstitutes")
    if av == "generation-safe":
        if subs is not None:
            err("asset-role", f"{role}: a generation-safe role has no substitutes (found {subs})")
    else:
        if subs is None:
            err("asset-role", f"{role}: {av} role must name generationSafeSubstitutes (an empty list = omit the slot)")
        for sr in subs or []:
            if sr not in assets["roles"] or assets["roles"][sr].get("availability") != "generation-safe":
                err("asset-role", f"{role}: substitute {sr!r} is not a generation-safe role")
        if not subs and role != "badge.compliance":
            err("asset-role", f"{role}: only badge.compliance (a certification mark) may have no substitute; the others need one")
for role in PINNED:
    if role not in assets["roles"]:
        err("asset-role", f"pinned role {role} missing from asset-roles.json")
used = {}


def collect_roles(tid, x):
    if isinstance(x, dict):
        r = x.get("properties", {}).get("assetRole") if "properties" in x else None
        if r:
            for v in ([r["const"]] if "const" in r else r.get("enum", [])):
                used.setdefault(v, set()).add(tid)
        for v in x.values():
            collect_roles(tid, v)
    elif isinstance(x, list):
        for v in x:
            collect_roles(tid, v)


for tid, j in sec_by_type.items():
    collect_roles(tid, j["contentModel"])
import build_schema as BS_  # noqa: E402

gen_used = {}
for tid, j in sec_by_type.items():
    try:
        derived_ = BS_.derived_generated_roles(j, assets["roles"])
    except (ValueError, KeyError) as e_:
        err("asset-role", f"{tid}: the generated content model cannot be derived: {e_}")
        continue
    for r_ in derived_:
        gen_used.setdefault(r_, set()).add(tid)
    if sorted(j.get("generatedAssetRoles", [])) != derived_:
        err("asset-role", f"{tid}: generatedAssetRoles {j.get('generatedAssetRoles')} != derived {derived_}")
for role, tids in used.items():
    if role not in assets["roles"]:
        err("asset-role", f"section contracts use unknown assetRole {role!r}")
    elif sorted(tids) != assets["roles"][role]["usedBy"]:
        err("asset-role", f"{role}: usedBy {assets['roles'][role]['usedBy']} != sections that wire it {sorted(tids)}")
for role in assets["roles"]:
    if role not in used:
        # a generation-safe-only role is wired through generatedAssetRoles; its usedBy is exactly those sections
        if assets["roles"][role]["availability"] != "generation-safe" or role not in gen_used:
            err("asset-role", f"role {role} is not wired into any section contract (schema)")
        elif sorted(gen_used[role]) != assets["roles"][role]["usedBy"]:
            err("asset-role", f"{role}: usedBy {assets['roles'][role]['usedBy']} != sections whose generatedAssetRoles list it {sorted(gen_used[role])}")
lic = " ".join(assets.get("licensing", []) + assets.get("globalRules", [])).lower()
for must in ("local reference only", "never reproduce", "likeness", "never invent a quote"):
    if must not in lic:
        err("asset-role", f"licensing/globalRules lack the required clause {must!r}")
n_av = {k: sum(1 for v in assets["roles"].values() if v.get("availability") == k) for k in assets.get("availabilityValues", [])}
print(f"7) Asset roles: {len(assets['roles'])} roles pinned (policy + availability {n_av}), {len(used)} wired into reference content models, {len(gen_used)} into generated ones; {len(errors) - c7} errors")

# 8 templates / routes / graph -----------------------------------------------------------
c8 = len(errors)
adj, route_owner = {}, {}
for tid, t in templates.items():
    seq = [n["section"] for n in t["nodes"]]
    for nd in t["nodes"]:
        if set(nd) != {"section", "variants", "required", "repeatable"}:
            err("template", f"{tid}: node {nd} must be exactly section/variants/required/repeatable")
        if nd["section"] not in sec_by_type:
            err("phantom-ref", f"{tid} references phantom section {nd['section']}")
            continue
        for v in nd["variants"]:
            if v not in sec_by_type[nd["section"]]["variants"]:
                err("phantom-ref", f"{tid}: variant {v!r} is not defined by {nd['section']}")
    for a, b in zip(seq, seq[1:]):
        adj.setdefault(a, set()).add(b)
    for rt in t["routes"]:
        if rt in route_owner:
            err("route-coverage", f"route {rt} claimed by both {route_owner[rt]} and {tid}")
        route_owner[rt] = tid
    for s_, var in [(s_, v) for m in t["constraints"].get("routeVariants", {}).values() for s_, v in m.items()]:
        if not any(n["section"] == s_ and var in n["variants"] for n in t["nodes"]):
            err("template", f"{tid}: routeVariants binds {s_}={var} which the node list does not allow")
    for q in t.get("quirks", []):
        if q not in jload("extraction/measured-values.json")["quirks"]:
            err("template", f"{tid}: quirk {q} is not registered in extraction/measured-values.json")
real_adj = {a: sorted(b) for a, b in adj.items()}
graph_adj = {a: sorted(r["canPrecede"]) for a, r in graph["adjacency"].items()}
if real_adj != graph_adj:
    err("graph", "compatibility/graph.json adjacency differs from consecutive pairs in templates.json")
for tid in sec_by_type:
    if not any(tid == n["section"] for t in templates.values() for n in t["nodes"]):
        err("template", f"section {tid} is used by no template")
for tid, j in sec_by_type.items():
    used_vars = {v for t in templates.values() for n in t["nodes"] if n["section"] == tid for v in n["variants"]}
    for v in set(j["variants"]) - used_vars:
        warn("template", f"{tid} defines variant {v!r} that no template uses")
mv = jload("extraction/measured-values.json")
inv = mv["routeInventory"]
if set(inv) != set(route_owner):
    err("route-coverage", f"templates cover {len(route_owner)} routes, inventory lists {len(inv)}; only in templates {sorted(set(route_owner) - set(inv))}, only in inventory {sorted(set(inv) - set(route_owner))}")
oos = tdoc["routing"]["outOfScopePrefixes"]
for rt in route_owner:
    if any(rt == p or rt.startswith(p + "/") for p in oos):
        err("route-coverage", f"route {rt} is in an out-of-scope section")
if HAVE_SRC:
    rsrc = open(os.path.join(PROJECT, "src", "routes.js"), encoding="utf-8").read()
    live = {"/"} | set(re.findall(r"\['(/[^']*)', '[A-Za-z]+'\]", rsrc))
    if live != set(route_owner):
        err("route-coverage", f"src/routes.js routes differ from templates: only in src {sorted(live - set(route_owner))}, only in templates {sorted(set(route_owner) - live)}")
    block = rsrc.split("export const NAV_OVERRIDES = {", 1)[1].split("\n}", 1)[0]
    src_ovr = {}
    for path, body in re.findall(r"'(/[^']*)': \{([^}]*)\}", block):
        d = {}
        for k, v in re.findall(r"(\w+): ('[^']*'|true|false)", body):
            d[k] = v.strip("'") if v.startswith("'") else v == "true"
        src_ovr[path] = d
    if src_ovr != tdoc["routing"]["navOverrides"]:
        err("nav-overrides", f"templates.json routing.navOverrides {tdoc['routing']['navOverrides']} != src/routes.js NAV_OVERRIDES {src_ovr}")
    print(f"8) Templates/routes/graph: {len(templates)} templates, {len(route_owner)} routes (1:1 with src/routes.js + '/'), overrides match; {len(errors) - c8} errors")
else:
    warn("route-coverage", "src/routes.js not present: route + NAV_OVERRIDES cross-check against the live source SKIPPED (inventory check still ran)")
    print(f"8) Templates/routes/graph: {len(templates)} templates, {len(route_owner)} routes vs bundled inventory; src cross-check SKIPPED; {len(errors) - c8} errors")

# 9 schema ------------------------------------------------------------------------
import jsonschema  # noqa: E402
import build_schema as BS  # noqa: E402

c9 = len(errors)
try:
    jsonschema.Draft7Validator.check_schema(sch)
except jsonschema.SchemaError as e:
    err("schema", f"not valid Draft-07: {e.message}")
try:
    if open(BS.OUT, encoding="utf-8").read() != json.dumps(BS.build(), indent=2, ensure_ascii=False) + "\n":
        err("schema", "pagespec.schema.json is out of date versus sections/templates/motion/asset roles; run schema/build_schema.py")
except (ValueError, KeyError) as e_:
    err("schema", f"the schema cannot be rebuilt from the contracts: {e_}")
repo = SV.load_repo()
ex_files = ["schema/example.pagespec.json"] + sorted(os.path.relpath(f, DR) for f in glob.glob(os.path.join(DR, "schema", "examples", "*.json")))
for rel in ex_files:
    for sev, rule, msg in SV.validate_pagespec(jload(rel), repo):
        (err if sev == "error" else warn)("example", f"{rel}: {rule}: {msg}")
print(f"9) Schema: Draft-07 valid, up to date, {len(ex_files)} real example PageSpecs validated; {len(errors) - c9} errors")

# 10 citations -----------------------------------------------------------------------
cites = mv["citations"]
used_ids = set()


def gather(x, rel):
    if isinstance(x, dict):
        for k, v in x.items():
            if k in ("cite", "measuredFrom"):
                for s_ in ([v] if isinstance(v, str) else v if isinstance(v, list) else []):
                    if isinstance(s_, str):
                        used_ids.add((s_, rel))
            gather(v, rel)
    elif isinstance(x, list):
        for v in x:
            gather(v, rel)


for rel, j in parsed.items():
    if rel != "extraction/measured-values.json" and not rel.startswith("schema/pagespec") and rel != "tokens/llm/token-catalog.json":
        gather(j, rel)
gather({k: v for k, v in mv.items() if k != "citations"}, "extraction/measured-values.json")
c10 = len(errors)
for cid, rel in sorted(used_ids):
    if cid not in cites:
        err("citation", f"{rel}: cite id {cid!r} not defined in extraction/measured-values.json")
if HAVE_SRC:
    nchk = 0
    for cid, c in cites.items():
        p = os.path.join(PROJECT, c["file"])
        if not os.path.exists(p):
            err("citation", f"{cid}: {c['file']} does not exist")
            continue
        lines = open(p, encoding="utf-8", errors="replace").read().split("\n")
        a, _, b = c["lines"].partition("-")
        a, b = int(a), int(b) if b else int(a)
        if a < 1 or b > len(lines) or a > b:
            err("citation", f"{cid}: range {c['lines']} outside {c['file']} ({len(lines)} lines)")
            continue
        seg = "\n".join(lines[a - 1:b])
        for q in c["mustContain"]:
            if q not in seg:
                err("citation", f"{cid}: {c['file']}:{c['lines']} does not contain {q!r} (in-range but wrong)")
        nchk += 1
    drift = [fn for fn, h in mv["sourceSnapshot"]["files"].items()
             if os.path.exists(os.path.join(PROJECT, fn)) and hashlib.sha256(open(os.path.join(PROJECT, fn), "rb").read()).hexdigest()[:16] != h]
    if drift:
        warn("source-drift", f"{len(drift)} cited source file(s) changed since the snapshot (citations re-verified above): {', '.join(drift[:8])}{' ...' if len(drift) > 8 else ''}")
    import build_histogram as BH  # noqa: E402
    import build_verified_quotes as BQ  # noqa: E402
    if os.path.isdir(BH.RECON) and json.dumps(BH.build(), indent=1) + "\n" != open(BH.OUT, encoding="utf-8").read():
        warn("source-drift", "extraction/style-histogram.json no longer matches recon/ (rebuild with extraction/build_histogram.py)")
    if json.dumps(BQ.build(), indent=1, ensure_ascii=False) + "\n" != open(BQ.OUT, encoding="utf-8").read():
        warn("source-drift", "assets/verified-quotes.json no longer matches src/ quote literals (rebuild with extraction/build_verified_quotes.py)")
    print(f"10) Citations: {len(cites)} defined, {nchk} range+content verified against the real files, {len(used_ids)} references; {len(errors) - c10} errors")
else:
    warn("citation", "source project not beside design-repo/: citation range/content checks SKIPPED (standalone copy)")
    print(f"10) Citations: {len(cites)} defined, {len(used_ids)} references resolve to ids; range/content checks SKIPPED (no sibling source); {len(errors) - c10} errors")
unused = sorted(set(cites) - {c for c, _ in used_ids})
if unused:
    warn("citation", f"{len(unused)} citation ids defined but not referenced: {unused[:6]}")

# 11 manifest / docs / machine paths ----------------------------------------------------
man = jload("registry.manifest.json")
c11 = len(errors)
counts = {
    "primitives": len(prims), "components": len(comps), "sections": len(secs), "templates": len(templates), "routes": len(route_owner),
    "tokens": cat["counts"]["tokens"], "typographyRoles": cat["counts"]["typographyRoles"], "motionRecipes": cat["counts"]["motionRecipes"],
    "assetRoles": len(assets["roles"]), "graphRules": len(graph["rules"]), "examplePageSpecs": len(ex_files), "citations": len(cites),
    "verifiedQuotes": len(jload("assets/verified-quotes.json")["quotes"]), "registeredQuirks": len(mv["quirks"]),
    "retrievalIneligibleSections": len(allow.get("retrievalIneligibleSections", [])),
    "generatedExamplePageSpecs": sum(1 for r_ in ex_files if parsed[r_].get("mode") == "generated"), "generatedModeRules": len(SV.GENERATED_MODE_RULES),
    "measuredRoutes": len(mv.get("sectionHeights", {}).get("routes", {})), "measuredSectionInstances": sum(len(r.get("nodes", [])) for r in mv.get("sectionHeights", {}).get("routes", {}).values()),
}
if man.get("counts") != counts:
    err("manifest-counts", f"counts block {man.get('counts')} != recomputed {counts}")
if man["allowlistVersion"] != allow["version"]:
    err("version-parity", f"manifest allowlistVersion {man['allowlistVersion']} != allowlist version {allow['version']}")
if man["tokenCatalogVersion"] != cat["version"]:
    err("version-parity", "manifest tokenCatalogVersion != catalog version")
if man["tokenPolicyVersion"] != policy["version"]:
    err("version-parity", "manifest tokenPolicyVersion != token-policy version")
if man["assetRegistryVersion"] != assets["version"]:
    err("version-parity", "manifest assetRegistryVersion != asset-roles version")
for grp, lst in man["entryPoints"].items():
    for ep in ([lst] if isinstance(lst, str) else lst):
        if ep.startswith("..") or os.path.isabs(ep):
            err("entrypoint", f"{grp}: {ep} points outside design-repo/")
        elif not os.path.exists(os.path.join(DR, ep)):
            err("entrypoint", f"{grp}: {ep} does not exist")
for need in ("repositoryId", "defaultTheme", "pageSpecVersion", "schemaValidatedThemes", "versionFieldNote", "status", "productionApproved", "sourceStack"):
    if need not in man:
        err("manifest", f"missing {need}")
if man.get("productionApproved") is not False or man.get("status") != "design-review-pending":
    err("manifest", "status must be design-review-pending and productionApproved false")
readme = open(os.path.join(DR, "README.md"), encoding="utf-8").read()
m = re.search(r"<!-- counts: (\{.*?\}) -->", readme)
if not m:
    err("readme-counts", "README.md lacks the <!-- counts: {...} --> marker")
elif json.loads(m.group(1)) != counts:
    err("readme-counts", f"README counts marker {m.group(1)} != recomputed {counts}")
for pth in ("schema/tests/adversarial_test.py", "extraction/prove_drift.py", "extraction/verify_all.py", "extraction/wrapper_gate.py", "extraction/measure_heights.mjs", "extraction/height-probes.json", "schema/section-contract.schema.json", "schema/section-classification.json", "extraction/build_histogram.py", "extraction/build_verified_quotes.py", "extraction/build_source_brand.py", "assets/source-copy-hashes.json", "schema/build_schema.py", "tokens/build_catalog.py"):
    if not os.path.exists(os.path.join(DR, pth)):
        err("docs", f"{pth} is referenced by the docs but does not exist")
MACHINE = ["/Us" + "ers/", "/ho" + "me/", "C:" + "\\\\Us" + "ers", "C:" + "\\Us" + "ers"]
for root, dirs, fs in os.walk(DR):
    dirs[:] = [d for d in dirs if d != "__pycache__"]
    for fn in fs:
        if fn.endswith(".pyc") or fn in (".DS_Store",):
            continue
        p = os.path.join(root, fn)
        try:
            txt = open(p, encoding="utf-8", errors="ignore").read()
        except OSError:
            continue
        for mp in MACHINE:
            if mp in txt:
                err("abs-path", f"{os.path.relpath(p, DR)} contains a machine path ({mp!r})")
                break
print(f"11) Manifest: counts recomputed, versions matched, entryPoints inside repo, docs scripts exist, no machine paths; {len(errors) - c11} errors")

# 12 section contracts: meta schema, retrieval eligibility, provenance vs taxonomy -----------------
import jsonschema as _js  # noqa: E402

# Second, independent literal of the retrieval-ineligible utility/runtime sections. The validator
# (semantic_validate.RETRIEVAL_INELIGIBLE), the contracts, the allowlist and this literal must all agree.
PINNED_RETRIEVAL_INELIGIBLE = {"overlay.partner-modal", "quirk.phone-empty-block"}
c12 = len(errors)
repo_sv = SV.load_repo()
TAGS = {"overlay": "retrieval", "RETRIEVAL_PINNED": "retrieval", "CLASS_POLICY": "class-policy"}
try:
    _js.Draft7Validator.check_schema(repo_sv["contractSchema"])
except _js.SchemaError as e:
    err("section-contract", f"schema/section-contract.schema.json is not valid Draft-07: {e.message}")
n_src = 0
for rid, (rel, j) in sorted(secs.items()):
    for sev, rule, msg in SV.validate_section_contract(j, repo_sv):
        err(TAGS.get(rule, "section-contract"), f"{rel}: {rule}: {msg}")
    src = j.get("source", {})
    if HAVE_SRC and src.get("file"):
        fp = os.path.join(PROJECT, src["file"])
        if not os.path.exists(fp):
            err("section-contract", f"{rel}: source file {src['file']} does not exist")
        else:
            lines_ = open(fp, encoding="utf-8", errors="replace").read().split("\n")
            a_, _, b_ = src["lines"].partition("-")
            a_, b_ = int(a_), int(b_ or a_)
            if a_ < 1 or b_ > len(lines_) or a_ > b_:
                err("section-contract", f"{rel}: source lines {src['lines']} fall outside {src['file']} ({len(lines_)} lines)")
            else:
                seg_ = "\n".join(lines_[a_ - 1:b_])
                miss_ = [q for q in cites.get(src["citation"], {}).get("mustContain", []) if q not in seg_]
                if miss_:
                    err("section-contract", f"{rel}: source {src['file']}:{src['lines']} does not contain {miss_} (in-range but wrong)")
                n_src += 1
flagged = {j["typeId"] for _, j in secs.values() if j.get("retrievalEligible") is False}
if SV.RETRIEVAL_INELIGIBLE != PINNED_RETRIEVAL_INELIGIBLE:
    err("retrieval", f"semantic_validate.RETRIEVAL_INELIGIBLE {sorted(SV.RETRIEVAL_INELIGIBLE)} != verify_all pin {sorted(PINNED_RETRIEVAL_INELIGIBLE)}")
if flagged != PINNED_RETRIEVAL_INELIGIBLE:
    err("retrieval", f"contracts with retrievalEligible false {sorted(flagged)} != pinned {sorted(PINNED_RETRIEVAL_INELIGIBLE)}")
if sorted(allow.get("retrievalIneligibleSections", [])) != sorted("section." + t for t in PINNED_RETRIEVAL_INELIGIBLE):
    err("retrieval", f"allowlist retrievalIneligibleSections {allow.get('retrievalIneligibleSections')} != pinned section ids")
pol12 = repo_sv["classification"]
cats_used = {j["category"] for _, j in secs.values()}
if sorted(allow.get("semanticCategories", [])) != sorted(pol12["semanticCategories"]) or sorted(pol12["semanticCategories"]) != sorted(repo_sv["contractSchema"]["properties"]["category"]["enum"]):
    err("class-policy", "semanticCategories differ between the allowlist, schema/section-classification.json and schema/section-contract.schema.json")
if cats_used != set(pol12["semanticCategories"]):
    err("class-policy", f"categories used {sorted(cats_used)} != closed taxonomy {sorted(pol12['semanticCategories'])}")
for tid_ in pol12["inlineCtaReviewed"]:
    if tid_ not in sec_by_type:
        err("class-policy", f"inlineCtaReviewed names {tid_}, which is not a section")
    else:
        nm_ = set()
        SV._names(sec_by_type[tid_]["contentModel"], nm_)
        if not nm_ & set(pol12["ctaPropertyNames"]):
            err("class-policy", f"inlineCtaReviewed entry {tid_} no longer carries a CTA-like field (stale review)")
print(f"12) Section contracts: {len(secs)} validated (meta schema, retrievalEligible pinned to {sorted(PINNED_RETRIEVAL_INELIGIBLE)} in contracts + allowlist + validator + this check, source vs semantic, class policy); "
      + (f"{n_src} source ranges re-read from the real files; " if HAVE_SRC else "source range re-read SKIPPED (no sibling source); ") + f"{len(errors) - c12} errors")

# 13 whole-page-wrapper gate -------------------------------------------------------------------
import wrapper_gate as WG  # noqa: E402

c13 = len(errors)
g_err, g_warn, g_info = WG.evaluate(mv, repo_sv)
errors.extend(g_err)
warnings.extend(g_warn)
hm = next(i for i in g_info if i and i[0] == "hero-max")[1]
n_meas = sum(len(r.get("nodes", [])) for r in mv.get("sectionHeights", {}).get("routes", {}).values())
print(f"13) Wrapper gate: {len(mv.get('sectionHeights', {}).get('routes', {}))} routes / {n_meas} measured section instances at 1440px; tallest hero {hm[0]}px (warn >{WG.HERO_WARN_PX}, fail >{WG.HERO_FAIL_PX}); {len(g_warn)} warning(s); {len(errors) - c13} errors")

# 14 IA parity -----------------------------------------------------------------------------------
IA_SECTION_MAP = {
    "content.index-header": "content.conversations-header", "content.conversation-grid": "content.conversations-grid",
    "content.article-header": "content.article-header", "media.video-embed": "content.article-video",
    "content.article-summary": "content.article-summary", "content.article-chapter-index": "content.article-chapters",
    "content.transcript-chapter": "content.article-transcript-chapter", "content.article-faq": "content.article-faq",
    "content.legal-header": "content.legal-header", "content.legal-section": "content.legal-section",
    "cta.agent-promo": "convert.insights-agent-promo",
}
IA_TEMPLATE_MAP = {"template.conversations-index": ["template.conversations-index"], "template.conversation-detail": ["template.conversation-detail"],
                   "template.legal": ["template.legal"], "template.insights-landing": ["template.insights-landing", "template.insights-landing-short"]}
IA_GONE = {"content.conversations-index", "content.conversation-article", "content.legal-document", "product.insights-agent-promo"}
c14 = len(errors)
ia_path = os.path.join(PROJECT, "ia.json")
if os.path.exists(ia_path):
    import csv  # noqa: E402

    ia = json.load(open(ia_path, encoding="utf-8"))
    ia_routes = {r for t in ia["templates"] for r in t["routes"]}
    if ia_routes != set(route_owner):
        err("ia-parity", f"ia.json routes differ from templates: only in ia {sorted(ia_routes - set(route_owner))}, only in templates {sorted(set(route_owner) - ia_routes)}")
    if ia["meta"]["totalRoutes"] != len(route_owner) or sum(t["routeCount"] for t in ia["templates"]) != len(route_owner):
        err("ia-parity", f"ia.json meta.totalRoutes {ia['meta']['totalRoutes']} / routeCount sum {sum(t['routeCount'] for t in ia['templates'])} != {len(route_owner)} routes")
    if ia["meta"]["totalTemplates"] != len(ia["templates"]):
        err("ia-parity", "ia.json meta.totalTemplates != number of IA templates")
    for t in ia["templates"]:
        owners = {route_owner.get(r) for r in t["routes"]}
        if len(owners) != 1:
            err("ia-parity", f"IA template {t['id']} spans design-repo templates {sorted(map(str, owners))}: unrelated page types sharing one template")
        if t["routeCount"] != len(t["routes"]):
            err("ia-parity", f"IA template {t['id']} routeCount {t['routeCount']} != {len(t['routes'])} routes")
    for g in sorted(IA_GONE & set(ia["sections"])):
        err("ia-parity", f"ia.json still defines the superseded section {g}")
    ia_tpl = {t["id"]: t for t in ia["templates"]}
    ded = lambda xs: [x for i, x in enumerate(xs) if i == 0 or x != xs[i - 1]]  # noqa: E731
    mapped_ids = set(IA_SECTION_MAP.values())
    for dsec, isec in IA_SECTION_MAP.items():
        if isec not in ia["sections"]:
            err("ia-parity", f"design section {dsec} maps to IA section {isec}, which ia.json does not define")
        elif dsec not in sec_by_type:
            err("ia-parity", f"IA_SECTION_MAP names {dsec}, which is not a design-repo section")
        else:
            want_cat = {"conversion": "CONVERT", "content": "CONTENT"}.get(sec_by_type[dsec]["category"], "?" + sec_by_type[dsec]["category"])
            if ia["sections"][isec]["category"] != want_cat:
                err("ia-parity", f"IA section {isec} is {ia['sections'][isec]['category']} but design section {dsec} is {sec_by_type[dsec]['category']} (expected {want_cat})")
    for dt, its in IA_TEMPLATE_MAP.items():
        dmap = [IA_SECTION_MAP[n["section"]] for n in templates[dt]["nodes"] if n["section"] in IA_SECTION_MAP]
        for it in its:
            got = [x for x in ia_tpl[it]["sections"] if x in mapped_ids]
            if ded(got) != ded(dmap):
                err("ia-parity", f"{it} sections {ded(got)} != the design-repo {dt} nodes mapped to IA ids {ded(dmap)}")
            if set(ia_tpl[it]["routes"]) - set(templates[dt]["routes"]):
                err("ia-parity", f"{it} routes are not all routes of {dt}")
    mpath, hpath = os.path.join(PROJECT, "matrix.csv"), os.path.join(PROJECT, "IA.md")
    if os.path.exists(mpath):
        rows = list(csv.reader(open(mpath, encoding="utf-8")))
        head, body = rows[0], rows[1:]
        tot = [r for r in body if r[0] == "ROUTE COUNT"]
        body = [r for r in body if r[0] != "ROUTE COUNT"]
        if not tot or [int(x) for x in tot[0][4:]] != [t["routeCount"] for t in ia["templates"]]:
            err("ia-parity", "matrix.csv ROUTE COUNT row disagrees with ia.json routeCount per template (stale; run node build.mjs)")
        if {r[0] for r in body} != set(ia["sections"]):
            err("ia-parity", f"matrix.csv sections differ from ia.json (stale; run node build.mjs): only csv {sorted({r[0] for r in body} - set(ia['sections']))[:4]}, only ia {sorted(set(ia['sections']) - {r[0] for r in body})[:4]}")
        if head[4:] != [t["name"] for t in ia["templates"]]:
            err("ia-parity", "matrix.csv template columns differ from ia.json templates (stale; run node build.mjs)")
        else:
            for r in body:
                uses = [t for t in ia["templates"] if r[0] in t["sections"]]
                if r[0] in ia["sections"] and (int(r[2]) != len(uses) or int(r[3]) != sum(t["routeCount"] for t in uses) or r[4:].count("x") != len(uses)):
                    err("ia-parity", f"matrix.csv row {r[0]} templates/routes/x-marks disagree with ia.json (stale; run node build.mjs)")
    if os.path.exists(hpath):
        md = open(hpath, encoding="utf-8").read()
        want_line = f"{ia['meta']['totalRoutes']} routes · {ia['meta']['totalTemplates']} templates · {len(ia['sections'])} unique sections"
        if want_line not in md:
            err("ia-parity", f"IA.md does not state {want_line!r} (stale; run node build.mjs)")
        for sid in ia["sections"]:
            if f"`{sid}`" not in md:
                err("ia-parity", f"IA.md does not mention section {sid} (stale; run node build.mjs)")
        for g in IA_GONE:
            if f"`{g}`" in md:
                err("ia-parity", f"IA.md still mentions the superseded section {g} (stale; run node build.mjs)")
    print(f"14) IA parity: ia.json ({len(ia['templates'])} templates, {len(ia['sections'])} sections) vs design-repo: routes 1:1, no IA template spans two design templates, {len(IA_SECTION_MAP)} split/renamed sections mapped in order, matrix.csv + IA.md current; {len(errors) - c14} errors")
else:
    warn("ia-parity", "ia.json not beside design-repo/: IA parity SKIPPED (standalone copy)")
    print("14) IA parity: SKIPPED (no sibling ia.json; standalone copy)")

# 15 generated mode -------------------------------------------------------------------------------
# PageSpec mode "generated" = a new page for ANY OTHER brand. Everything below is pinned HERE as literals, independent of
# assets/asset-roles.json sourceBrand, so emptying or weakening the registry (or the validator) fails this check.
PROBES = {
    "GENERATED_MODE_SOURCE_BRAND": ["Siena", "siena.cx", "Ask Siena", "SienaLogo", "/ask-siena", "page.siena-home"],
    "GENERATED_MODE_SOURCE_URL": ["https://www.siena.cx/pricing", "see sienaai.trust.site for security", "x.com/lisapopovici", "https://www.linkedin.com/in/negrau", "https://luma.com/qspvr322"],
    "GENERATED_MODE_SOURCE_PERSON": ["Lisa Popovici", "Andrei Negrau", "Kylah Field", "Jeremy Thurswell", "Paige Zachs", "Hudson Lofchie"],
    "GENERATED_MODE_SOURCE_CUSTOMER": ["Spanx", "Thrive Causemetics", "Terra Kaffe", "Grüns", "Sierra Ventures", "Simple Modern", "Everyday Dose"],
}
COPY_PROBES = ["Brands that win on CX run on Siena", "Our mission is to humanize the internet by turning customer interactions into meaningful relationships", "Backed by great partners"]
ASSET_PROBES = ["jBdT2KuAbfPtfHNsxcWh0L50xk", "rYyvabwLjN7jv9XBL68Sm664", "L2fbLFnO4rG3Y9WhTn2Zmg90Q"]  # hero image, hero image, a customer logo (file stems in the clone's public/assets)
c15 = len(errors)
sb15 = assets.get("sourceBrand")
if not sb15:
    err("generated-mode", "assets/asset-roles.json has no sourceBrand registry")
else:
    res15 = SV._brand_res(repo)
    for rule_, probes_ in PROBES.items():
        for pr in probes_:
            txt_ = re.sub(r"[-_/.]+", " ", pr) + " " + pr if re.fullmatch(r"[a-z0-9/#._:-]+", pr) else pr
            if not (res15[rule_] and res15[rule_].search(txt_)):
                err("generated-mode", f"{rule_}: the source-brand registry no longer matches the pinned probe {pr!r}")
    hashes15 = repo["sourceHashes"]
    for pr in COPY_PROBES:
        w_ = SV._norm_words(pr)
        if len(w_) >= sb15["copy"]["shingleWords"] and not any(SV._h16(" ".join(w_[i:i + sb15["copy"]["shingleWords"]])) in hashes15["copyShingles"] for i in range(len(w_) - sb15["copy"]["shingleWords"] + 1)):
            err("generated-mode", f"GENERATED_MODE_SOURCE_COPY: assets/source-copy-hashes.json no longer contains the pinned source phrase {pr!r}")
    for st in ASSET_PROBES:
        if SV._h16(st.lower()) not in hashes15["assetStems"]:
            err("generated-mode", f"GENERATED_MODE_ASSET_REF: assets/source-copy-hashes.json no longer lists the source asset stem {st!r}")
    if sb15["counts"]["copyShingles"] != len(hashes15["copyShingles"]) or sb15["counts"]["assetStems"] != len(hashes15["assetStems"]):
        err("generated-mode", "sourceBrand.counts disagree with assets/source-copy-hashes.json")
    if set(sb15["assets"]["allowedRefPrefixes"]) != {"placeholder", "generated", "user-supplied"}:
        err("generated-mode", f"allowedRefPrefixes {sb15['assets']['allowedRefPrefixes']} != the pinned placeholder/generated/user-supplied")
    if set(assets.get("availabilityValues", [])) != {"reference-only", "generation-safe", "blocked-for-generation"}:
        err("generated-mode", f"availabilityValues {assets.get('availabilityValues')} is not the pinned closed set")
    # the schema's closed mode enum and the generated-ref / generated-href shapes
    if sch["properties"]["mode"]["enum"] != ["reference", "generated"] or "mode" not in sch["required"]:
        err("generated-mode", "pagespec.schema.json must require a closed mode enum [reference, generated]")
    if BS_.GEN_REF != "^(placeholder|generated|user-supplied)/[A-Za-z0-9._-]+$":
        err("generated-mode", "build_schema.GEN_REF drifted from the pinned placeholder/generated/user-supplied prefixes")
    PINNED_GEN_HREF = ("^(/[a-z0-9/#-]*|#[a-z0-9-]+|https://[a-z0-9-]+(\\.[a-z0-9-]+)*\\.(example|invalid)(/[^\\s]*)?"
                       "|mailto:[a-z.]+@[a-z0-9-]+(\\.[a-z0-9-]+)*\\.(example|invalid))$")
    if BS_.GEN_HREF != PINNED_GEN_HREF:
        err("generated-mode", "build_schema.GEN_HREF drifted from the pinned shape: internal paths and reserved .example/.invalid hosts only")
    # registry re-derived from the clone's own files (when the sibling source tree is present)
    if HAVE_SRC:
        import build_source_brand as BSB  # noqa: E402

        if not os.path.exists(BSB.DICT):
            warn("generated-mode", "system word list absent: source-brand re-derivation SKIPPED")
        else:
            reg_, hs_ = BSB.build()
            if reg_ != sb15 or BSB.dump(hs_) != open(BSB.HASHES, encoding="utf-8").read():
                err("generated-mode", "assets/asset-roles.json sourceBrand / assets/source-copy-hashes.json differ from what extraction/build_source_brand.py derives from src/ (re-run it)")
    else:
        warn("generated-mode", "src/ not beside design-repo/: source-brand re-derivation SKIPPED (the pinned probes above still ran)")
# examples: closed mode per example, generated ones cover the required page types
gen_ex = {r_: parsed[r_] for r_ in ex_files if parsed[r_].get("mode") == "generated"}
for r_ in ex_files:
    if parsed[r_].get("mode") not in ("reference", "generated"):
        err("generated-mode", f"{r_}: example PageSpec lacks a closed mode")
need_tpl = {"template.home", "template.conversation-detail", "template.legal"}
if not need_tpl <= {d_["template"] for d_ in gen_ex.values()} or not any(d_["template"] in ("template.shopping-agent", "template.social-agent", "template.reviews-agent", "template.qa-agent", "template.topics-explorer", "template.ask-siena", "template.memory", "template.order-tracking", "template.video", "template.docs") for d_ in gen_ex.values()):
    err("generated-mode", f"generated examples must cover home, a product page, the conversation article and legal; have {sorted(d_['template'] for d_ in gen_ex.values())}")
# canary: the validator must still reject a leaking generated page and a mode mix-up (a validator that stops enforcing generated mode fails here)
if any(d_["template"] == "template.home" for d_ in gen_ex.values()):
    base_ = gen_ex[sorted(gen_ex)[0]]
    nav_ = lambda d_: next(n_ for n_ in d_["nodes"] if n_["type"] == "shell.navbar")  # noqa: E731
    hero_ = lambda d_: next(n_ for n_ in d_["nodes"] if n_["type"] == "hero.home")  # noqa: E731
    homeg = next((d_ for d_ in gen_ex.values() if d_["template"] == "template.home"), base_)
    import copy as _cp  # noqa: E402

    def leak(fn):
        d_ = _cp.deepcopy(homeg)
        fn(d_)
        return [f"{r_[1]}" for r_ in SV.validate_pagespec(d_, repo) if r_[0] == "error"]

    canaries = [
        ("source brand in a heading", lambda d_: hero_(d_)["content"].__setitem__("headline", "Why teams choose Siena"), "GENERATED_MODE_SOURCE_BRAND"),
        ("source URL in an href", lambda d_: nav_(d_)["content"]["cta"].__setitem__("href", "https://www.siena.cx/book-a-demo"), {"SCHEMA"}),
        ("source person as a testimonial author", lambda d_: next(n_ for n_ in d_["nodes"] if n_["type"] == "testimonials.slider")["content"]["slides"][0].__setitem__("name", "Kylah Field"), "GENERATED_MODE_SOURCE_PERSON"),
        ("source customer in a role line", lambda d_: next(n_ for n_ in d_["nodes"] if n_["type"] == "testimonials.slider")["content"]["slides"][0].__setitem__("role", "VP at Spanx"), "GENERATED_MODE_SOURCE_CUSTOMER"),
        ("source marketing copy", lambda d_: hero_(d_)["content"].__setitem__("subtitle", "Brands that win on CX run on Siena"), "GENERATED_MODE_SOURCE_COPY"),
        ("source asset file", lambda d_: hero_(d_)["content"]["images"][0].__setitem__("assetRef", "generated/jBdT2KuAbfPtfHNsxcWh0L50xk.webp"), "GENERATED_MODE_ASSET_REF"),
        ("blocked role in a generated page", lambda d_: hero_(d_)["content"]["tickerRows"][0][0].__setitem__("assetRole", "logo.customer"), {"SCHEMA"}),
        ("a reference page flipped to generated", lambda d_: d_.update(mode="reference"), {"SCHEMA"}),
    ]
    for nm_, fn_, want_ in canaries:
        try:
            got_ = leak(fn_)
        except Exception as e_:  # noqa: BLE001
            err("generated-mode", f"canary '{nm_}' crashed: {e_!r}")
            continue
        want_s = want_ if isinstance(want_, set) else {want_}
        if not (set(got_) & want_s):
            err("generated-mode", f"canary '{nm_}' was not rejected with {sorted(want_s)} (got {sorted(set(got_)) or 'no errors'}): the validator stopped enforcing generated mode")
    # and the reverse: flipping a reference example to generated must fail
    refx = parsed["schema/example.pagespec.json"]
    flip = _cp.deepcopy(refx)
    flip["mode"] = "generated"
    if not any(r_[0] == "error" for r_ in SV.validate_pagespec(flip, repo)):
        err("generated-mode", "canary 'reference example flipped to generated' passed validation")
    if any(r_[0] == "error" for r_ in SV.validate_pagespec(refx, repo)):
        err("generated-mode", "the reference example no longer validates in mode reference")
# every GENERATED_MODE_* rule id is implemented in code and exercised by the adversarial suite
code15 = open(os.path.join(DR, "schema", "semantic_validate.py"), encoding="utf-8").read().split("def check_generated")[1].split("# ----", 1)[0]
adv15 = open(os.path.join(DR, "schema", "tests", "adversarial_test.py"), encoding="utf-8").read()
for rid_ in sorted(SV.GENERATED_MODE_RULES):
    if f'"{rid_}"' not in code15:
        err("generated-mode", f"{rid_} is declared in GENERATED_MODE_RULES but never raised in check_generated()")
    if f'"{rid_}"' not in adv15:
        err("generated-mode", f"{rid_} has no adversarial test")
print(f"15) Generated mode: {len(gen_ex)} generated + {len(ex_files) - len(gen_ex)} reference example PageSpecs, {len(SV.GENERATED_MODE_RULES)} GENERATED_MODE_* rules implemented and tested, "
      f"{sum(len(v) for v in PROBES.values()) + len(COPY_PROBES) + len(ASSET_PROBES)} pinned source-identity probes, 8 canary mutations rejected, registry {'re-derived from src/' if HAVE_SRC else 'derivation skipped (no src)'}; {len(errors) - c15} errors")

# 16 ---------------------------------------------------------------------------------
if "--skip-adversarial" in sys.argv:
    print("16) Adversarial suite: SKIPPED by --skip-adversarial (drift-injection runs only)")
else:
    r = subprocess.run([sys.executable, os.path.join(DR, "schema", "tests", "adversarial_test.py")], capture_output=True, text=True)
    tail = [ln for ln in r.stdout.strip().split("\n") if ln][-1:] or [""]
    if r.returncode != 0:
        err("adversarial", "adversarial suite failed:\n" + r.stdout[-1500:] + r.stderr[-800:])
    print(f"16) Adversarial suite: {'PASS' if r.returncode == 0 else 'FAIL'} ({tail[0]})")

print("\n" + "=" * 72)
for w in warnings:
    print("WARN ", w)
if errors:
    print(f"{len(errors)} ERROR(S):")
    for e in errors:
        print(" -", e)
    print("VERIFICATION: FAIL")
    sys.exit(1)
print("VERIFICATION: ALL CHECKS PASS")
