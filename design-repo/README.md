# Siena design-repo

AI-ready design contract extracted from the local clone of **siena.cx** (a real, live
company). It tells a generator **what may be used** (tokens, primitives, components,
79 section contracts), **how it may be combined** (27 page templates, a compatibility
graph) and **how it must behave** (motion recipes with reduced-motion fallbacks, per-section
responsive notes), and it proves every rule with a validator and an adversarial suite.

<!-- counts: {"primitives": 12, "components": 24, "sections": 79, "templates": 27, "routes": 35, "tokens": 298, "typographyRoles": 22, "motionRecipes": 20, "assetRoles": 17, "graphRules": 27, "examplePageSpecs": 2, "citations": 354, "verifiedQuotes": 24, "registeredQuirks": 10} -->

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
primitives/ components/ sections/   contracts (content models with maxWords, variants, motion, responsive, constraints, citations)
templates/templates.json            27 page shapes, nodes keyed on (section, variants), routing + overrides
compatibility/graph.json            adjacency (derived) + 27 rules with severity
assets/asset-roles.json             closed asset-role vocabulary + licensing; assets/verified-quotes.json
schema/                             pagespec.schema.json (generated, Draft-07), semantic_validate.py, examples, tests/adversarial_test.py
extraction/                         measured-values.json (citations, snapshot, quirks), style-histogram.json, verify_all.py, prove_drift.py, builders
```

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
python3 extraction/verify_all.py          # 13 numbered checks incl. the adversarial suite
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
