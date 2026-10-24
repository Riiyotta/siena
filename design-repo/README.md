# Siena design-repo

AI-ready design contract extracted from the local clone of **siena.cx** (a real, live
company). It tells a generator **what may be used** (tokens, primitives, components,
86 section contracts), **how it may be combined** (27 page templates, a compatibility
graph) and **how it must behave** (motion recipes with reduced-motion fallbacks, per-section
responsive notes), and it proves every rule with a validator and an adversarial suite.

<!-- counts: {"primitives": 12, "components": 24, "sections": 86, "templates": 27, "routes": 35, "tokens": 298, "typographyRoles": 22, "motionRecipes": 20, "assetRoles": 26, "graphRules": 28, "examplePageSpecs": 6, "citations": 356, "verifiedQuotes": 24, "registeredQuirks": 10, "retrievalIneligibleSections": 2, "generatedExamplePageSpecs": 4, "generatedModeRules": 12, "measuredRoutes": 35, "measuredSectionInstances": 364} -->

Status: `design-review-pending`, `productionApproved: false`, **local reference only**.

## Load-bearing constraints (read first)

1. **Real company, real content.** Siena's wordmark, every customer/partner/investor logo,
   every person photo and name, and the Feature Deck / Tiempos fonts (commercially licensed
   to Siena) are not licensed for reuse. `assets/asset-roles.json` pins an AI-generation
   policy per asset role (`must-reuse-exact`, `must-not-fabricate`, `may-generate-new`,
   `external-embed-allowlisted`) and, since 1.2.0, an `availability` per role for generated
   pages (see "Reference and generated modes"). Never AI-generate or redraw a real logo,
   never create a likeness of a real person, never publish this repository or deploy the
   clone publicly.
2. **Placeholder-content policy.** The clone keeps real headings, labels and short marketing
   copy, but renders long prose as length-matched placeholder text: conversation summaries /
   transcripts / FAQ answers, legal body text, the careers founders letter, about-us team
   letter, third-party testimonial quotes outside the verified set, and part of the insights
   paragraphs (real opening words + lorem tail). Contracts mark these with `copySource` /
   quote `source`; the validator (`PLACEHOLDER_MARKED`, `QUOTE_PROVENANCE`) rejects a
   fabricated quote marked `verified`, a placeholder that is not visibly marked, and filler
   passed off as real copy. Verified quotes are checked by SHA-256 against
   `assets/verified-quotes.json` (hashes, not text, of the quotes the clone renders verbatim).
3. **Forms never submit.** Book-a-demo, pricing, partner modal, referral, community,
   newsletters, the insights demo form, the AI Lab newsletter and ROI step 2 are static
   look-alikes (`submitBehavior: "none"`, `FORMS_STATIC`). The YouTube iframe on conversation
   detail pages is the one deliberate external embed (`EMBED_ALLOWLIST`).
4. **Deliberate scope reduction.** Blog, customer stories, integrations, product updates,
   webinars and previous-terms pages are NOT cloned and must not be recreated; links go to
   live `https://www.siena.cx/...` (`OUT_OF_SCOPE_ROUTE`).
5. **Replicated live-site quirks are documented, not normalised** (`extraction/measured-values.json`
   `quirks`, section `knownQuirks`): /conversations phone 2x340 grid overflow, newsletter
   desktop layout kept on phone, add-ons and /video phone 1000px blank blocks
   (`quirk.phone-empty-block`, allowed only on those templates), compare-page phone
   Integrations after the CTA, Kustomer phone headline, narrow phone CTA cards, mis-routed
   mega-menu Resources links, ROI phone slider row, AI Lab white-on-white eyebrows.
6. **Tablet 810-1199.98px was never measured** on any route; everything here is desktop
   (1440) or phone (390). `foundation.breakpoint.tablet-min` is marked not-generation-approved.
7. Route chrome differences come from `src/routes.js` `NAV_OVERRIDES` (mirrored in
   `templates/templates.json` `routing`, cross-checked by `verify_all.py`): /careers nav CTA,
   /about-us + /social-agent forced-scrolled nav, /pricing + /book-a-demo own logo header and
   legal row, /ai-lab own dark nav.

## Reference and generated modes (1.2.0, PageSpec `pageSpecVersion` 2.0.0)

Every PageSpec carries a required, closed `mode`: `reference` or `generated`. Before 1.2.0 a generator could
reuse the source's own brand: `brand.siena-wordmark`, customer logos, real people's photos, the commissioned
artwork, the source's screenshots and video, the real YouTube id and the footer's SOC 2 badge were all legal roles, and a
generated page for another brand had no way to say "not Siena" and no check that it was not.

- **`reference`**: a clone or fidelity page for Siena itself. Every role, URL and quote is available exactly as before
  (the two real examples are `mode: reference`).
- **`generated`**: a new page for ANY OTHER brand. The schema swaps in a generated-mode twin of every section's content
  model (`schema/build_schema.py` `generated_model()`): only generation-safe roles, `assetRef` under `placeholder/`,
  `generated/` or `user-supplied/`, hrefs only internal or reserved `.example`/`.invalid` hosts, quotes and copy of
  `generated` provenance. `shell.navbar`, `shell.footer` and `shell.lab-nav` carry no brand slot in reference mode (the
  wordmark, link set and mega menu are implicit chrome), so `generatedOverrides` add a required `brand` (placeholder or
  user-supplied mark + name) and `linkSet: placeholder`, and the footer drops the compliance badge.

`assets/asset-roles.json` gives every role a closed `availability`:

| availability | roles | meaning in a generated page |
|---|---|---|
| `reference-only` (10) | `brand.siena-wordmark`, `brand.siena-glyph`, `embed.youtube`, `animation.lottie`, `illustration.editorial`, `illustration.swash`, `image.card-background`, `photo.editorial-scene`, `product.ui-mock-image`, `video.decorative-loop` | the source's own brand, artwork, screenshots, media: not allowed; use a listed `generationSafeSubstitutes` role |
| `blocked-for-generation` (6) | `logo.customer`, `logo.integration`, `logo.partner-investor`, `photo.person-real`, `badge.compliance`, `icon.glyph` | third-party identity or licensed material: never in any form; fictional/user-supplied substitute or, for `badge.compliance` (a certification mark), omit |
| `generation-safe` (10) | `illustration.abstract-glow` + nine new roles: `logo.placeholder`, `logo.user-supplied`, `avatar.placeholder`, `photo.user-supplied`, `illustration.generated`, `product.ui-generated`, `animation.generated`, `video.user-supplied`, `icon.generated` | allowed, in the sections whose contract lists them in `generatedAssetRoles` (derived from the reference slots via the substitutes and checked against the derivation) |

The availability of every role is **pinned in `extraction/verify_all.py` (`PINNED_AVAILABILITY`), independent of the registry**,
so flipping `logo.customer` to generation-safe fails check 7 even though the registry would still be self-consistent.

`sourceBrand` (in `assets/asset-roles.json`, with hashes in `assets/source-copy-hashes.json`) is generated by
`extraction/build_source_brand.py` from the clone's own files, never typed in: the brand token (`siena`), source hosts and
social handles, customer / partner / investor names (hero tickers, logo arrays, `logoAlt`, testimonial role lines, case-study
slugs), people (testimonial authors, conversation guests, founders, team, partner testimonial subjects), third-party
platforms (warn only), SHA-256 prefixes of every 5-word run of the source's marketing copy (10,109 shingles from 1,776
strings of `src/`, `CLONE_SPEC.md`, `specs/`), and the file stems of 1,130 media files of `public/`, `recon/` and the mirrored
page folder. Copy and file names are stored as hashes so this repository is not a second copy of the source.
`schema/semantic_validate.py` raises, for `mode: generated` only: `GENERATED_MODE_REFERENCE_ASSET`, `_ROLE`, `_ASSET_REF`,
`_SOURCE_BRAND`, `_SOURCE_URL`, `_EXTERNAL_URL`, `_SOURCE_PERSON`, `_SOURCE_CUSTOMER`, `_SOURCE_COPY`, `_QUOTE`,
`_PLACEHOLDER_COPY` and (warning) `_THIRD_PARTY`. A generated page may sit at any non-brand route (it inherits the
template's first route's constraints); its testimonial set, nav CTA text and link targets are not tied to Siena's.

Four fictional-brand examples ("Brightloop", invented people and customers, placeholder assets, `.example` links) validate with
zero findings: `schema/examples/generated.template.{home,product,conversation-detail,legal}.pagespec.json`.

Limits, stated plainly:

- **No human has reviewed the pinned patterns.** They are heuristics over the clone's data, pinned by probes in `verify_all.py`
  and re-derived by it from `src/` (and `/usr/share/dict/words`, which classifies single-word customer names that are English
  words: rare ones match only in the source's capitalisation, ones the source's own copy also uses in lower case, such as Hero,
  Create, True, Thrive, Fresh, Simple, Bad, Immi and the lower-case styled brands, are not matched in text; they are still blocked
  as logos and asset files).
- Copy under 5 words (labels, "Book a demo", short headings) is not checked: too generic to attribute. Paraphrase is not detected.
- Template ids, section ids, variant names and a few enum/key names still contain `siena` (`template.ask-siena`, `mockup.ask-siena`,
  `comparison.table` rows' `siena` key, `brand.siena-*` role ids): contract vocabulary, exempt from the text scan; a generated
  `speaker` value is `agent`, not `siena`. A renderer must not print them.
- `stats.metrics` keeps `counterTo: 80` (a measured layout constant of the source's figure).
- A PageSpec carries roles and refs, not files: a renderer is still responsible for what it draws for a role.
- Real third-party platforms the source names (Shopify, Zendesk, Gorgias, Kustomer ...) only warn; the check cannot tell a
  legitimate integration mention from copying.

## Layout

```
tokens/00-foundation  colour (histogram-backed), gradient, typography, radius, spacing, breakpoint, elevation, motion
tokens/10-semantic    colour roles, 22 typography roles, 20 motion recipes, shape
tokens/20-component   component tokens          tokens/30-layout  containers, section padding
tokens/themes         light (only theme)        tokens/llm        token-catalog, token-policy, component-allowlist
primitives/ components/ sections/   contracts (content models with maxWords, variants, motion, responsive, constraints, citations;
                                    sections also carry semantic{}, source{} and retrievalEligible)
templates/templates.json            27 page shapes, nodes keyed on (section, variants), routing + overrides; long-form pages decomposed at real content boundaries
compatibility/graph.json            adjacency (derived) + 28 rules with severity
assets/asset-roles.json             closed asset-role vocabulary + licensing + per-role availability for generated mode + sourceBrand registry;
                                    assets/source-copy-hashes.json (hashes of source copy and media stems); assets/verified-quotes.json
schema/                             pagespec.schema.json (generated, Draft-07), section-contract.schema.json + section-classification.json (hand-authored),
                                    semantic_validate.py, examples, tests/adversarial_test.py
extraction/                         measured-values.json (citations, snapshot, quirks, sectionHeights), height-probes.json, measure_heights.mjs,
                                    wrapper_gate.py, style-histogram.json, verify_all.py, prove_drift.py, builders
```

## Page decomposition and the whole-page-wrapper gate (1.1.0)

A "section" must never be a whole page or article wrapped in one box. The real rendered
height of every template node was measured on the built clone at 1440px
(`extraction/measure_heights.mjs` + `extraction/height-probes.json` write
`measured-values.json` `sectionHeights`: 35 routes, 364 section instances, `unattributedPx` per page)
and `extraction/wrapper_gate.py` (verify_all check 13) enforces, with the thresholds pinned in code:

- a `hero.*` section over 1800px warns; over 3000px fails unless it has a reviewed `heroWhitelist` entry
  (`reviewedBy`, justification of at least 30 characters, `maxHeightPx` above the measurement). Measured: 29 heroes,
  346px (`/events`) to 1552px (`/partner-with-siena`); none over 1800px, so the whitelist is empty;
- one section holding more than half of a page's in-flow height warns; the four that do are listed with a
  justification in `shareReviewed` (the pinned 7500px `story.horizontal-scroll`, the `/social-agent`
  `feature.pill-nav-blocks`, the single-hero `/community`, and the tiny `/book-a-demo` lead page) and fail if they grow;
- exactly one visible H1 per page, inside the `hero.*` node, or inside a `content.*-header` on the three hero-less
  templates; a missing measurement for any route or node is an error, never a skip;
- routes that share a template must share at least 60% of their section types (no unrelated page types behind one
  template); each IA template must lie inside one design-repo template.

The three long-form suspects were decomposed at content boundaries that exist in the render, not guessed:

| was one section | now | boundary evidence (1440px) |
|---|---|---|
| `content.conversation-article` (7455-10259px transcript inside an 10-14k page) | `content.article-header`, `media.video-embed`, `content.article-summary`, `content.article-chapter-index`, one `content.transcript-chapter` per chapter H2 (the anchor target of the chapter index), `content.article-faq` | sibling blocks of one `<article>`; chapters cut at `h2.ct-rt-ch`; largest part is 1825px (17% of its page) |
| `content.legal-document` (15706px body = 94% of `/terms-of-service`) | `content.legal-header` + one `content.legal-section` per heading-bounded part (23 for terms, 16 for privacy, preamble included) | cut at each `h2`, the privacy `p.lg-is` heading and the DPA appendix headings; largest part is 2765px (17%) |
| `content.conversation-index` | `content.index-header` + `content.conversation-grid` | two sibling blocks (395px header, 836px grid) |

`CHAPTER_PARITY` (graph rule 28) requires the chapter index to list exactly the transcript chapters on the page.
Nothing long-form remains a single prose block. `feature.agent-promo` was a conversion row classed as a feature and is
now `cta.agent-promo` (category conversion).

Template coherence was checked with measurements, not names: `lead-gen` (pricing + book-a-demo, Jaccard 0.67 on
section types), `insights-landing` (one `InsightsPage` component, 0.8 to 1.0), `compare`, `conversation-detail` and
`legal` all clear the 0.6 bar; the check is repeated on every run.

## Retrieval eligibility, provenance vs taxonomy, classification

- `retrievalEligible` (closed boolean, explicit on every section contract) is `false` for the utility/runtime
  sections `overlay.partner-modal` and `quirk.phone-empty-block`, each with a required `retrievalIneligibleReason`
  (30+ characters); a retrieval index must skip them, a template may still require them. It is pinned five ways:
  the contract, `schema/section-contract.schema.json`, `tokens/llm/component-allowlist.json`
  (`retrievalIneligibleSections`), `semantic_validate.RETRIEVAL_INELIGIBLE` and a second literal in `verify_all.py`;
  any id with a cookie/consent/dialog/modal/popup/toast/overlay/utility segment must also be ineligible.
- `source` (provenance: `{id, tag, citation, file, lines}`, resolved against the evidence ledger and re-read from the
  real file lines) and `semantic` (taxonomy: `{id, category}`, a closed 16-category enum) are different closed objects with
  different id namespaces; `semantic.category` must equal `category`.
- `schema/section-classification.json` pins: `hero.*` is the only hero; `cta.*`/`overlay.*` is the only conversion;
  editorial/news/proof prefixes (`stories`, `content`, `banner`, `lab`, ...) are never `feature`; a CTA-like field
  (`cta`, `button`, `form`) in a non-conversion/hero/shell section needs a reviewed `inlineCtaReviewed` entry.

## Not measured

The visual-parity gate (clone vs the live siena.cx render) could not be measured: there was no live-site capture in
this environment, so no parity number is claimed anywhere in this repo. Tablet 810-1199.98px is still unmeasured.

## Templates (27 for 35 routes)

| template | routes | evidence | source at extraction | routes |
|---|---|---|---|---|
| `template.about` | 1 | measured | built | `/about-us` |
| `template.ai-lab` | 1 | spec-measured | in-flight | `/ai-lab` |
| `template.ai-native-vs-addons` | 1 | measured | built | `/ai-native-customer-service-vs-help-desk-ai-add-ons` |
| `template.ask-siena` | 1 | spec-measured | in-flight | `/ask-siena` |
| `template.careers` | 1 | measured | built | `/careers` |
| `template.community` | 1 | measured | built | `/community` |
| `template.compare` | 2 | measured | built | `/compare/siena-ai-vs-gorgias-ai`, `/compare/siena-ai-vs-kustomer-ai` |
| `template.conversation-detail` | 3 | measured | built | `/conversations/thrive-causemetics-ai-customer-service-automation`, `/conversations/prose-ai-customer-service-automation`, `/conversations/spanx-kylah-field-real-work-ai-customer-experience` |
| `template.conversations-index` | 1 | measured | built | `/conversations` |
| `template.customers` | 1 | measured | built | `/customers` |
| `template.docs` | 1 | spec-measured | in-flight | `/products/docs` |
| `template.events` | 1 | measured | built | `/events` |
| `template.home` | 1 | measured | built | `/` |
| `template.insights-landing` | 4 | measured | built | `/insights`, `/insights/sentiment-analysis-online`, `/insights/voice-of-customer-software`, `/insights/customer-feedback-analytics-software` |
| `template.lead-gen` | 2 | measured | built | `/pricing`, `/book-a-demo` |
| `template.legal` | 2 | measured | built | `/terms-of-service`, `/privacy-policy` |
| `template.memory` | 1 | spec-measured | in-flight | `/memory` |
| `template.order-tracking` | 1 | spec-measured | in-flight | `/order-tracking` |
| `template.partner` | 1 | measured | built | `/partner-with-siena` |
| `template.qa-agent` | 1 | spec-measured | in-flight | `/qa-agent` |
| `template.refer` | 1 | measured | built | `/refer-a-friend` |
| `template.reviews-agent` | 1 | spec-measured | in-flight | `/ai-review-management` |
| `template.roi-calculator` | 1 | spec-measured | in-flight | `/roi-calculator` |
| `template.shopping-agent` | 1 | spec-measured | in-flight | `/shopping-agent` |
| `template.social-agent` | 1 | spec-measured | in-flight | `/social-agent` |
| `template.topics-explorer` | 1 | spec-measured | in-flight | `/topics-explorer` |
| `template.video` | 1 | spec-measured | in-flight | `/video` |

`spec-measured` = the template is grounded in the Playwright-measured product specs; the
product pages were being built concurrently by other agents during extraction and were
re-checked against the current `src/` before release.

## Running the checks

```
python3 -m pip install jsonschema
python3 extraction/verify_all.py          # 17 numbered checks (0-16) incl. wrapper gate, IA parity, generated mode, adversarial suite
python3 extraction/wrapper_gate.py        # the whole-page-wrapper gate on its own
python3 schema/tests/adversarial_test.py  # mutations rejected, controls pass
python3 extraction/prove_drift.py         # proves the drift checks fail on injected defects
python3 schema/semantic_validate.py schema/example.pagespec.json schema/examples/generated.template.home.pagespec.json
```

All scripts derive their root from their own location. With the clone's `src/`, `specs/`
and `recon/` beside `design-repo/`, citations are verified for range AND content; in a
standalone copy those checks are skipped with a warning (never a failure).

## Rebuilding generated files

`python3 tokens/build_catalog.py`, `python3 schema/build_schema.py`,
`python3 extraction/build_histogram.py` (needs `recon/`), `python3 extraction/build_verified_quotes.py`
(needs `src/`), `python3 extraction/build_source_brand.py` (needs `src/`, `specs/`, `public/`, `recon/`; `--check` to compare). `verify_all.py` fails if the catalog or schema is stale and warns if the
histogram or quote registry drifted from the source.

## Packaging

Package with the CLI: `zip -r -X design-repo.zip design-repo -x '*.DS_Store' '*__MACOSX*' '*__pycache__*'`
from the project root, regenerated last after every change. The zip is a build artifact
(`.gitignore`d); never commit it next to the live folder.
