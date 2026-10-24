#!/usr/bin/env python3
"""Generate schema/pagespec.schema.json (JSON Schema draft-07) from the contracts.

Sources: sections/*.json (content models, variants, allowed motion patterns, generatedOverrides), assets/asset-roles.json
(availability + generationSafeSubstitutes: the generated-mode twin of every content model),
templates/templates.json (closed template enum), tokens/10-semantic/motion.json (motion
recipes and their const-locked reduced-motion fallbacks). The schema is a build output:
extraction/verify_all.py regenerates it in memory and fails if the file on disk differs.
Run: python3 schema/build_schema.py [--check]
"""
import glob
import json
import os
import sys

DR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(DR, "schema", "pagespec.schema.json")
DELAYS_MS = [0, 200, 300, 400, 500, 600, 700, 800, 1000, 1200, 1600, 2200]
MODES = ["reference", "generated"]
# Generated-mode value shapes (mode "generated" = a new page for ANY OTHER brand; see assets/asset-roles.json `modes`)
GEN_REF = "^(placeholder|generated|user-supplied)/[A-Za-z0-9._-]+$"
GEN_HREF = ("^(/[a-z0-9/#-]*|#[a-z0-9-]+|https://[a-z0-9-]+(\\.[a-z0-9-]+)*\\.(example|invalid)(/[^\\s]*)?"
            "|mailto:[a-z.]+@[a-z0-9-]+(\\.[a-z0-9-]+)*\\.(example|invalid))$")
GEN_SPEAKERS = ["customer", "agent"]
GEN_PROVENANCE = ["generated"]


def _load(rel):
    with open(os.path.join(DR, rel), encoding="utf-8") as f:
        return json.load(f)


def sections():
    out = {}
    for f in sorted(glob.glob(os.path.join(DR, "sections", "*.json"))):
        d = json.load(open(f, encoding="utf-8"))
        out[d["typeId"]] = d
    return out


def roles_registry():
    return _load("assets/asset-roles.json")["roles"]


def slot_roles(schema):
    r = schema["properties"]["assetRole"]
    return [r["const"]] if "const" in r else list(r["enum"])


def generation_candidates(roles, reg):
    """Roles a generated page may use in a slot whose reference model allows `roles`: the generation-safe ones
    themselves plus the declared substitutes of every reference-only / blocked-for-generation one."""
    out = set()
    for r in roles:
        spec = reg[r]
        if spec["availability"] == "generation-safe":
            out.add(r)
        else:
            out |= set(spec.get("generationSafeSubstitutes", []))
    return sorted(out)


def _gen(x, reg, where):
    """Rewrite a reference content model into its generated-mode twin (pure function of the contract + registry)."""
    if isinstance(x, list):
        return [_gen(v, reg, where) for v in x]
    if not isinstance(x, dict):
        return x
    props = x.get("properties")
    if isinstance(props, dict) and "assetRole" in props:
        cand = generation_candidates(slot_roles(x), reg)
        if not cand:
            raise ValueError(f"{where}: slot {slot_roles(x)} has no generation-safe substitute; list it in generatedOverrides.removeProperties")
        new = {"assetRole": {"enum": cand}, "assetRef": {"type": "string", "pattern": GEN_REF}}
        if "alt" in props:
            new["alt"] = props["alt"]
        return dict(x, properties=new, required=["assetRole", "assetRef"])
    out = {}
    for k, v in x.items():
        if k == "properties" and isinstance(v, dict):
            pp = {}
            for name, sub in v.items():
                sub = _gen(sub, reg, where)
                if name in ("href", "linkedin", "x") and isinstance(sub, dict) and "pattern" in sub:
                    sub = dict(sub, pattern=GEN_HREF)
                elif name == "speaker" and isinstance(sub, dict) and "enum" in sub:
                    sub = dict(sub, enum=[GEN_SPEAKERS[1] if e == "siena" else e for e in sub["enum"]])
                elif name in ("source", "copySource") and isinstance(sub, dict) and "enum" in sub and ("placeholder" in sub["enum"]):
                    sub = dict(sub, enum=GEN_PROVENANCE)
                pp[name] = sub
            out[k] = pp
        else:
            out[k] = _gen(v, reg, where)
    return out


def generated_model(section, reg=None):
    """The generated-mode content model of one section contract (reference model + `generatedOverrides`)."""
    reg = reg or roles_registry()
    model = json.loads(json.dumps(section["contentModel"]))
    ov = section.get("generatedOverrides", {})
    for name in ov.get("removeProperties", []):
        model["properties"].pop(name)
        model["required"] = [r for r in model.get("required", []) if r != name]
    model = _gen(model, reg, section["typeId"])
    for name, sub in ov.get("addProperties", {}).items():
        model["properties"][name] = sub
    if "required" in ov:
        model["required"] = ov["required"]
    return model


def model_roles(x, out=None):
    out = set() if out is None else out
    if isinstance(x, dict):
        r = x.get("properties", {}).get("assetRole") if isinstance(x.get("properties"), dict) else None
        if r:
            out |= set([r["const"]] if "const" in r else r["enum"])
        for v in x.values():
            model_roles(v, out)
    elif isinstance(x, list):
        for v in x:
            model_roles(v, out)
    return out


def derived_generated_roles(section, reg=None):
    return sorted(model_roles(generated_model(section, reg)))


def build():
    secs = sections()
    reg = roles_registry()
    templates = _load("templates/templates.json")["templates"]
    recipes = _load("tokens/10-semantic/motion.json")["motion"]["recipe"]
    fallbacks = sorted({r["reducedMotionFallback"] for r in recipes.values()})
    branches = []
    for tid in sorted(secs):
        s = secs[tid]
        branches.append({
            "if": {"properties": {"type": {"const": tid}}, "required": ["type"]},
            "then": {"properties": {
                "variant": {"enum": sorted(s["variants"])},
                "content": s["contentModel"],
                "motion": {"properties": {"pattern": {"enum": s["motion"]["allowedPatterns"]}}},
            }},
        })
    gen_branches = []
    for tid in sorted(secs):
        s = secs[tid]
        gen_branches.append({
            "if": {"properties": {"type": {"const": tid}}, "required": ["type"]},
            "then": {"properties": {
                "variant": {"enum": sorted(s["variants"])},
                "content": generated_model(s, reg),
                "motion": {"properties": {"pattern": {"enum": s["motion"]["allowedPatterns"]}}},
            }},
        })
    motion_branches = [{"if": {"properties": {"pattern": {"const": rid}}, "required": ["pattern"]},
                        "then": {"properties": {"reducedMotionFallback": {"const": r["reducedMotionFallback"]}}}} for rid, r in sorted(recipes.items())]
    return {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$id": "pagespec.schema.json",
        "$comment": "GENERATED by schema/build_schema.py from sections/*.json, templates/templates.json and tokens/10-semantic/motion.json. Do not hand-edit. maxWords is a custom keyword enforced by schema/semantic_validate.py.",
        "title": "Siena design-repo PageSpec",
        "type": "object",
        "additionalProperties": False,
        "required": ["id", "mode", "route", "template", "theme", "head", "nodes"],
        "properties": {
            "id": {"type": "string", "pattern": "^page\\.[a-z0-9-]+$"},
            "mode": {"enum": MODES, "description": "reference = a clone / fidelity page for the source brand (every role available); generated = a new page for any OTHER brand (generation-safe roles only, no source identity or content; GENERATED_MODE_* rules in schema/semantic_validate.py)."},
            "route": {"type": "string", "pattern": "^/([a-z0-9-]+(/[a-z0-9-]+)*)?$"},
            "template": {"enum": sorted(templates)},
            "theme": {"enum": ["light"]},
            "head": {"$ref": "#/definitions/head"},
            "nodes": {"type": "array", "minItems": 3},
        },
        "allOf": [
            {"if": {"properties": {"mode": {"const": "reference"}}, "required": ["mode"]}, "then": {"properties": {"nodes": {"items": {"$ref": "#/definitions/node"}}}}},
            {"if": {"properties": {"mode": {"const": "generated"}}, "required": ["mode"]}, "then": {"properties": {"nodes": {"items": {"$ref": "#/definitions/nodeGenerated"}}}}},
        ],
        "definitions": {
            "head": {"type": "object", "additionalProperties": False, "required": ["title"],
                     "properties": {"title": {"type": "string", "maxWords": 16}, "description": {"type": "string", "maxWords": 40}}},
            "motion": {
                "type": "object", "additionalProperties": False, "required": ["pattern", "reducedMotionFallback"],
                "properties": {"pattern": {"enum": sorted(recipes)}, "reducedMotionFallback": {"enum": fallbacks}, "delayMs": {"enum": DELAYS_MS}},
                "allOf": motion_branches,
            },
            "node": {
                "type": "object", "additionalProperties": False, "required": ["id", "type", "variant", "content", "motion"],
                "properties": {
                    "id": {"type": "string", "pattern": "^[a-z0-9-]+$"},
                    "type": {"enum": sorted(secs)},
                    "variant": {"type": "string"},
                    "content": {"type": "object"},
                    "motion": {"$ref": "#/definitions/motion"},
                },
                "allOf": branches,
            },
            "nodeGenerated": {
                "type": "object", "additionalProperties": False, "required": ["id", "type", "variant", "content", "motion"],
                "properties": {
                    "id": {"type": "string", "pattern": "^[a-z0-9-]+$"},
                    "type": {"enum": sorted(secs)},
                    "variant": {"type": "string"},
                    "content": {"type": "object"},
                    "motion": {"$ref": "#/definitions/motion"},
                },
                "allOf": gen_branches,
            },
        },
    }


if __name__ == "__main__":
    text = json.dumps(build(), indent=2, ensure_ascii=False) + "\n"
    if "--check" in sys.argv:
        ok = os.path.exists(OUT) and open(OUT, encoding="utf-8").read() == text
        print("schema up to date" if ok else "schema OUT OF DATE")
        sys.exit(0 if ok else 1)
    open(OUT, "w", encoding="utf-8").write(text)
    print("wrote schema/pagespec.schema.json")
