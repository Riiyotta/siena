# Siena clone: information architecture

**`ia.json` is the only hand-edited file.** `IA.md` and `matrix.csv` are generated from it by
`build.mjs`. Don't edit them by hand, because the next build overwrites them. `validate.mjs`
checks `ia.json` against its own claims. Both scripts are copied unchanged from the `ia-builder` skill.

```bash
node validate.mjs   # exits non-zero on any hard inconsistency
node build.mjs      # regenerates IA.md + matrix.csv
```

After adding or changing routes in `src/routes.js` or sections in `src/pages/*.jsx`, edit `ia.json` and then run both commands.

## What is (and isn't) counted

- **35 routes in 29 templates.** This is `/` plus the 34 entries of `ROUTES` in `src/routes.js`. It is the set of routes cloned locally.
- **Not cloned, on purpose.** The live sitemap has 171 URLs. These collections stay on the live site: 51 `/blog`, 37 `/customer-stories`, 29 `/integrations`, 11 `/product-updates`, 7 `/webinar` + `/webinars`. `siteHref()` in `src/routes.js` points every link to them at `https://www.siena.cx`. They are not part of `meta.totalRoutes`.
- **The `chrome` axis comes from `NAV_OVERRIDES` and the `Chrome` wrapper in `src/App.jsx`:**
  - `full`: site Nav + Footer.
  - `full-solid-nav`: `forceScrolled` (/about-us, /social-agent).
  - `full-alt-cta`: the nav CTA is swapped to "See open roles" (/careers).
  - `own-nav`: `hideNav`. /ai-lab renders `AiLabNav` and keeps the site Footer.
  - `none`: `hideChrome`. /pricing and /book-a-demo render their own logo header and legal row.
- **`implementedBy` paths** are relative to `src/components/`. The exception is paths starting with `pages/`, which are relative to `src/`. Those point at inline page markup, named by its CSS class.
- **What counts as a section.** Sections are ordered by desktop DOM order. Two pages change the order on phone with CSS `order` (`styles/product-a.css`): /qa-agent and /topics-explorer. Decorative layers are not modelled as sections: EdgeFades, `cv-fade` strips, the AI Lab pixel tiles and the phone-only empty spacer on the add-ons page.

## Findings (from `validate.mjs` / `build.mjs` output)

- **Almost every template serves one route.** 4 templates serve more than one route: Insights landing (3), Conversation detail (3), Competitor compare (2) and Legal document (2). Together they cover 10 of 35 routes. The other 25 routes each have their own template. So the build effort is spread across one-off pages rather than sitting in a few repeated templates.
- **Most sections are page-local.** Of 122 sections, 32 appear in more than one template and 90 appear in only one. Of the 32, two are the site nav and site footer. Another six are shared only because the insights pages are split into two templates (see the first judgment call below). That leaves about 24 sections genuinely reused across different page types. Examples: `proof.metrics` (homepage, compare and add-ons, through the `ConvMetrics` wrapper) and the family-level CTA, testimonial, logo and FAQ components.
- **Each page family has its own copy of the closing CTA.** There are five MainCta variants as separate components: `main-cta`, `product-cta`, `product-b-cta`, `company-cta` and `conv-cta`. There are also four separate demo/newsletter capture blocks. There are three FAQ accordions (`product/sections.jsx`, `product-b/Faq.jsx`, `conversion/Faq.jsx`) and two different "Enterprise" blocks. These are the obvious candidates for merging if the clone is ever refactored.

## Judgment calls worth knowing

- **Insights is split into two templates, though all four routes use the same `InsightsPage` component.** `/insights/customer-feedback-analytics-software` has `integrationsTitle: null` and `testimonial: false` in `insightsData.js`, so it skips two sections. One template for all four would have over-counted those sections by one route.
- **/pricing and /book-a-demo are separate templates.** They are separate page files that share LeadHeader, LeadHero, ConvTestimonials and LegalRow. Pricing also has HowPricing and Enterprise.
- **The two newsletter signups are different sections.** `specs/content.md` says the Events newsletter is "the same component" as the conversations `NewsletterCta`. In the code, `Events.jsx` renders its own inline markup, so the IA treats them as two sections.
- **The add-ons page counts as using `proof.metrics`.** It mounts the unchanged homepage `Metrics` with only a scoped CSS override. The spec calls this a VARIANT.
- **`proof.product-testimonial` is listed once on /qa-agent.** The page renders it twice, but listing it twice would make the reuse counts wrong.
