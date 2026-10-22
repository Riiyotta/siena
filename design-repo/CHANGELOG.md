# Changelog

## 1.1.0 - page decomposition, wrapper gate, retrieval eligibility

- Measured the real rendered height of every template node at 1440px on the built clone (35 routes, 364 section
  instances; `extraction/measure_heights.mjs`, `extraction/height-probes.json`, `measured-values.json` `sectionHeights`).
  Tallest hero 1552px (`/partner-with-siena`); no hero over 1800px.
- New `extraction/wrapper_gate.py` (verify_all check 13): hero >1800px warns, >3000px fails unless reviewed-whitelisted
  (reviewedBy, justification >= 30 chars, maxHeightPx above the measurement); a section holding >50% of a page warns
  (4 reviewed in `shareReviewed`); one H1 per page inside the hero (or a content header on hero-less templates);
  missing measurement is an error; template route coherence (Jaccard >= 0.6); proven by 25 adversarial gate cases and
  6 drift cases.
- Decomposed `content.conversation-article` into 6 sections (header, video embed, summary, chapter index, one
  transcript chapter per chapter, FAQ), `content.legal-document` into `content.legal-header` + `content.legal-section`
  (one per heading-bounded part) and `content.conversation-index` into `content.index-header` +
  `content.conversation-grid`. 79 -> 86 sections. New graph rule `CHAPTER_PARITY` (27 -> 28 rules). Templates
  `conversations-index`, `conversation-detail`, `legal` and `insights-landing`, graph adjacency, allowlist, asset-role
  `usedBy`, quirks, example PageSpecs, `EMBED_ALLOWLIST` (now `media.video-embed`), IA files and README updated together.
- `feature.agent-promo` renamed `cta.agent-promo` and reclassified as conversion (CTA copy no longer sits in a feature).
- Every section contract now carries `retrievalEligible` (closed boolean; `false` + `retrievalIneligibleReason` for
  `overlay.partner-modal` and `quirk.phone-empty-block`), a closed `semantic {id, category}` and a closed
  `source {id, tag, citation, file, lines}`. New `schema/section-contract.schema.json` and
  `schema/section-classification.json`; `semantic_validate.validate_section_contract` and verify_all check 12 enforce
  them (retrieval flag pinned in five places, source lines re-read from the real files, class policy).
- verify_all gains check 12 (section contracts), 13 (wrapper gate) and 14 (IA parity against `ia.json` / `IA.md` /
  `matrix.csv` when beside the repo); adversarial suite 74 -> 84 PageSpec mutations plus 28 contract mutations and 25
  gate cases; drift proof 27 -> 48 injected defects.
- Manifest/allowlist/section registry/pageSpec versions 1.0.0 -> 1.1.0; counts gain `retrievalIneligibleSections`,
  `measuredRoutes`, `measuredSectionInstances`.
- Not measured: the visual-parity gate (no live-site capture available); tablet widths.

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
