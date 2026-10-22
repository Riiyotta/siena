# Changelog

## 1.0.0 - initial build

- Built from scratch (design-repo-extraction skill, BUILD-GUIDE order): 298 tokens
  (22 typography roles, 20 motion recipes), 12 primitives,
  24 components, 79 sections, 27 templates covering all 35 routes 1:1,
  27 graph rules, 17 asset roles, 354 citations, 24 verified-quote hashes,
  10 registered live-site quirks.
- Foundation colours/sizes/radii backed by a usage histogram computed from the 42 recon
  computed-style dumps (`extraction/style-histogram.json`); hover/focus/gradient values cite specs.
- Semantic validator cross-references every PageSpec against its declared template's real
  node list keyed on (section, variant); graph rule ids and validator code are asserted equal.
- Adversarial suite: hand-written mutations + one synthesized control per template.
- Drift proof (`extraction/prove_drift.py`) injects allowlist, citation, count, version,
  entry-point, policy, schema, catalog, histogram-claim, pinned-policy, route and
  machine-path defects into a scratch copy and requires each to fail.
- Product A/B templates were authored from specs while those pages were still being built,
  then re-checked against current `src/` (citations re-resolved) before release.
