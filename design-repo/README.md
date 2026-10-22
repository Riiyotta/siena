# Siena design-repo

AI-ready design contract extracted from the local clone of **siena.cx** (a real, live
company). It tells a generator **what may be used** (tokens, primitives, components,
86 section contracts), **how it may be combined** (27 page templates, a compatibility
graph) and **how it must behave** (motion recipes with reduced-motion fallbacks, per-section
responsive notes), and it proves every rule with a validator and an adversarial suite.

<!-- counts: {"primitives": 12, "components": 24, "sections": 86, "templates": 27, "routes": 35, "tokens": 298, "typographyRoles": 22, "motionRecipes": 20, "assetRoles": 17, "graphRules": 28, "examplePageSpecs": 2, "citations": 356, "verifiedQuotes": 24, "registeredQuirks": 10, "retrievalIneligibleSections": 2, "measuredRoutes": 35, "measuredSectionInstances": 364} -->

Status: `design-review-pending`, `productionApproved: false`, **local reference only**.

## Load-bearing constraints (read first)

1. **Real company, real content.** Siena's wordmark, every customer/partner/investor logo,
   every person photo and name, and the Feature Deck / Tiempos fonts (commercially licensed
   to Siena) are not licensed for reuse. `assets/asset-roles.json` pins an AI-generation
   policy per asset role (`must-reuse-exact`, `must-not-fabricate`, `may-generate-new`,
   `external-embed-allowlisted`); only abstract glows/gradients may be generated new. Never
   AI-generate or redraw a real logo, never create a likeness of a real person, never
   publish this repository or deploy the clone publicly.
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
assets/asset-roles.json             closed asset-role vocabulary + licensing; assets/verified-quotes.json
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
python3 extraction/verify_all.py          # 16 numbered checks (0-15) incl. wrapper gate, IA parity, adversarial suite
python3 extraction/wrapper_gate.py        # the whole-page-wrapper gate on its own
python3 schema/tests/adversarial_test.py  # mutations rejected, controls pass
python3 extraction/prove_drift.py         # proves the drift checks fail on injected defects
python3 schema/semantic_validate.py schema/example.pagespec.json
```

All scripts derive their root from their own location. With the clone's `src/`, `specs/`
and `recon/` beside `design-repo/`, citations are verified for range AND content; in a
standalone copy those checks are skipped with a warning (never a failure).

## Rebuilding generated files

`python3 tokens/build_catalog.py`, `python3 schema/build_schema.py`,
`python3 extraction/build_histogram.py` (needs `recon/`), `python3 extraction/build_verified_quotes.py`
(needs `src/`). `verify_all.py` fails if the catalog or schema is stale and warns if the
histogram or quote registry drifted from the source.

## Packaging

Package with the CLI: `zip -r -X design-repo.zip design-repo -x '*.DS_Store' '*__MACOSX*' '*__pycache__*'`
from the project root, regenerated last after every change. The zip is a build artifact
(`.gitignore`d); never commit it next to the live folder.
