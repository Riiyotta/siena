#!/usr/bin/env python3
"""Verification sweep for the Siena design-repo. Run from anywhere:

    python3 extraction/verify_all.py [--skip-adversarial]

DR (the repo root) is derived from this file's location, never a machine path.
Exit 0 = every check passed (warnings allowed); 1 = at least one error; 2 = not a design-repo.

Checks (numbers match the printed output):
  0 self-containment sentinel           7 asset roles (pinned policies, usedBy, wiring)
  1 JSON parse                          8 templates / routes / graph / overrides / quirks
  2 allowlist <-> contract parity       9 schema freshness, Draft-07, examples
  3 tokens: refs, catalog, policy,     10 citations (range + content), source drift,
    histogram evidence                     histogram + verified-quote rebuild drift
  4 contract references resolve        11 manifest counts, versions, entryPoints, docs, machine paths
  5 raw-value lint                     12 adversarial suite
  6 graph rules <-> validator code
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
}
c7 = len(errors)
for role, spec in assets["roles"].items():
    if spec["policy"] not in assets["policyEnum"]:
        err("asset-role", f"{role}: policy {spec['policy']!r} not in policyEnum")
    if role not in PINNED:
        err("asset-role", f"{role}: no pinned policy in verify_all.PINNED")
    elif spec["policy"] != PINNED[role]:
        err("asset-role", f"{role}: policy {spec['policy']!r} differs from pinned {PINNED[role]!r} (compliance-critical)")
    if not spec.get("guidance"):
        err("asset-role", f"{role}: missing guidance")
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
for role, tids in used.items():
    if role not in assets["roles"]:
        err("asset-role", f"section contracts use unknown assetRole {role!r}")
    elif sorted(tids) != assets["roles"][role]["usedBy"]:
        err("asset-role", f"{role}: usedBy {assets['roles'][role]['usedBy']} != sections that wire it {sorted(tids)}")
for role in assets["roles"]:
    if role not in used:
        err("asset-role", f"role {role} is not wired into any section contract (schema)")
lic = " ".join(assets.get("licensing", []) + assets.get("globalRules", [])).lower()
for must in ("local reference only", "never reproduce", "likeness", "never invent a quote"):
    if must not in lic:
        err("asset-role", f"licensing/globalRules lack the required clause {must!r}")
print(f"7) Asset roles: {len(assets['roles'])} roles pinned, {len(used)} wired into section contracts; {len(errors) - c7} errors")

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
if open(BS.OUT, encoding="utf-8").read() != json.dumps(BS.build(), indent=2, ensure_ascii=False) + "\n":
    err("schema", "pagespec.schema.json is out of date versus sections/templates/motion; run schema/build_schema.py")
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
for pth in ("schema/tests/adversarial_test.py", "extraction/prove_drift.py", "extraction/verify_all.py", "extraction/build_histogram.py", "extraction/build_verified_quotes.py", "schema/build_schema.py", "tokens/build_catalog.py"):
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

# 12 ---------------------------------------------------------------------------------
if "--skip-adversarial" in sys.argv:
    print("12) Adversarial suite: SKIPPED by --skip-adversarial (drift-injection runs only)")
else:
    r = subprocess.run([sys.executable, os.path.join(DR, "schema", "tests", "adversarial_test.py")], capture_output=True, text=True)
    tail = [ln for ln in r.stdout.strip().split("\n") if ln][-1:] or [""]
    if r.returncode != 0:
        err("adversarial", "adversarial suite failed:\n" + r.stdout[-1500:] + r.stderr[-800:])
    print(f"12) Adversarial suite: {'PASS' if r.returncode == 0 else 'FAIL'} ({tail[0]})")

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
