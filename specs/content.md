Source: https://www.siena.cx/

# Content pages — Clone Spec (insights, conversations, legal)

Routes covered: `/insights`, `/insights/sentiment-analysis-online`, `/insights/voice-of-customer-software`, `/insights/customer-feedback-analytics-software`, `/conversations`, `/conversations/thrive-causemetics-ai-customer-service-automation`, `/conversations/prose-ai-customer-service-automation`, `/conversations/spanx-kylah-field-real-work-ai-customer-experience`, `/terms-of-service`, `/privacy-policy`.

Measured live with Playwright (Chromium) at **1440x900** and **390x844**; all are Framer pages (`generator: Framer 244f320`). Tokens, fonts, breakpoints and the "appear" primitive are as in `CLONE_SPEC.md` §0. No new font *families* are needed except **Font Awesome 6 Pro Regular** (`/fonts/p7AhwSewV29YUCb3gfGr5xbw8wM.woff2` is already in `public/fonts/` but has **no `@font-face` in `src/index.css`**; used for one glyph on the legal pages, see T5; substitute an SVG if you prefer).

Reference screenshots (full page, cookies accepted unless noted): `recon/content/<route>-1440.png` and `-390.png`, where `<route>` is the path with `/` → `__` (e.g. `recon/content/conversations__thrive-causemetics-ai-customer-service-automation-1440.png`). Raw measurement JSON: `recon/content/out/*.json`.

## Important findings up front

1. **There is no "insights index / insight article" split.** `/insights` and the three `/insights/*` pages are the *same* product-landing template ("Siena Insights, formerly Idiomatic"): hero → announcement strip → logo row → alternating feature rows → integrations grid → testimonial → AI-agent promo → demo-request form → footer. They are not blog/article pages. Treat it as **one template (T1)** with per-route content.
2. **Conversations** is a true index (T2) + detail/transcript template (T3). **Legal** pages are T4/T5 (one template).
3. **Nav and Footer are IDENTICAL to the existing `Nav` and `Footer`** on every route (desktop nav ≥768, mobile nav <768, desktop footer 434 tall / phone footer 1080 tall). Nav starts transparent at top; on T1 it sits over the `#F3F0EB` hero, on T2–T5 over white. Same 160px scroll threshold → cream + shadow.
4. **No sticky TOC, no reading-progress bar, no scroll listeners** on any of these pages. The only position:fixed element is the nav. The conversation "Chapters" list is a plain list of in-page anchor links (`#chapter-N-<slug>`); target h2s have `scroll-margin-top: 120px` and the jump is the browser default (no smooth scroll measured).
5. **Live-site bug on `/conversations` at 390**: the card grid keeps 2 columns of 340px (704px total) inside a 350px container, so cards overflow both sides and are clipped (see T2 mobile). The newsletter CTA on `/conversations*` at 390 also stays in its desktop variant. Recommendation: replicate as measured only if pixel parity with the bug is wanted; otherwise use 1 column (cards 350 wide) and the `/events` phone variant from `specs/company.md` §E3. Flagged so Build can choose.
6. Buttons everywhere = existing xlg button (157x58 "Book a demo", radius 16, padding 18px 24px, Instrument Sans 600 18/21.6 white, bg `#122023`; hover → rainbow gradient instantly). Form submit buttons use a slightly different rainbow (stops 0 / 15.7658 / 30.6306 / 48.1982 / 77.027 / 100%) — see T1.9.

---

## T1. Insights product-landing template (`/insights` + 3 subpages)

Page root: white, flex column. Section order and boxes (1440, `/insights`; other routes in §R1):

| # | Section (Framer name) | 1440 y / h | 1440 bg / padding / layout | 390 h / padding / layout | Component verdict |
|---|---|---|---|---|---|
| 1 | Hero | 0 / 658 | `#F3F0EB`; `160px 64px 26px`; row center/center, gap 100 | 859; `96px 24px 10px` (subpages `56px 24px …`); column, gap 100 | **NEW** (`InsightsHero`) |
| 2 | announcement | 658 / 177 | `#F3F0EB`; `80px 96px`; row center | 179; `56px 24px` | **NEW** (tiny) |
| 3 | Logos | 835 / 206 | `#FFF`; `80px 96px`; column center, gap 60 | 244; `56px 24px`; gap 40 | **NEW** (static row, not the hero ticker) |
| 4 | Feature 1 (×3–6) | 1041 / 672 each | `#FFF`; `80px 96px`; row center/center, gap 64 | 680–837; `56px 24px`; column center, gap 24 | **NEW** (`FeatureRow`) |
| 5 | Integrations | 4401 / 708 | `#FFF`; `80px 96px`; column center, gap 72 | 1079; `56px 24px`; gap 32 | **VARIANT of `Integrations`** |
| 6 | Testimonials 2 | 5109 / 436 | `#FFF`; `80px 96px`; column center, gap 40 | 375; `56px 24px`; gap 40 | **NEW** (single static quote) |
| 7 | Feature 1 (AI-agent promo) | 5546 / 970 | `#FFF`; `80px 96px`; row center, gap 64 | 987; `56px 24px`; column, gap 40 | **VARIANT of `ScrollArea` block 1 / `ChatMock` v1** |
| 8 | CTA (demo form) | 6515 / 991 | full-bleed image; `120px 0`; row center | 1004; `40px 24px` | **VARIANT of `MainCta`** (+ NEW form) |
| 9 | Footer | 7507 / 434 | — | 1080 | **IDENTICAL `Footer`** |

`/insights/customer-feedback-analytics-software` has **no Integrations and no Testimonial section** (goes features → promo → CTA).

### T1.1 Hero
- Row: left text column + right media, `align-items:center`, gap **100**; at 1440 both columns are **606 wide** (x 64–670 and 770–1376).
- Left column: max-width 700, flex column, `justify-content:center`, align flex-start, **gap 32**:
  - Eyebrow "Siena Insights, formerly Idiomatic": Instrument Sans **600 16px/22.4px, ls 1.7px, uppercase**, `#122023`, left. 390: **14px/19.6px**.
  - H1: Feature Deck Web Light **300, 80px/80px, ls −0.8px**, `#122023`, left (3 lines at 606 wide → 240 tall). 390: **56px/56px, ls −0.56px**.
  - Subtitle: Instrument Sans **500 20px/28px, ls −0.2px**, color **`rgba(18,32,35,0.8)`** on `/insights`, **`#122023` (100%)** on the three subpages. 390: **16px/22.4px, ls −0.16px**.
  - Button row: flex row, **gap 12**: xlg "Book a demo" (157x58); `/insights/sentiment-analysis-online` adds a white xlg **"Login"** (96x58, bg `#FFFFFF`, label 600 18/21.6 **`#000`**, href `https://idiomatic.io/?login=true`).
- Right media: single `<img>` box **606x434**, `object-fit: contain`, no radius (product UI illustration with its own rounded dark panels). Vertical position = centered in the row (y 179 on `/insights`, 160–193 on subpages).
- 390: column, gap 100 → image box **342x245** (contain) under the button row.
- Motion: on `/insights` the H1 / subtitle / button use the global appear primitive exactly (y 200→0, opacity 0.001→1, 0.7s tween, delays 0.2 / 0.3 / 0.4, eases `[0,0.91,0.14,0.85]` / `[0,0.91,0.78,1]` / `[0,0.91,0.78,1]`), at both widths. On the three subpages there is **no SSR appear config**; the H1 wrapper starts at `opacity:0; translateY(20px)` and settles to `opacity 1, y 0` ≈0.55s after hydration with a small overshoot (y −0.26px) — implement as `opacity .5s ease-out, transform .6s cubic-bezier(.34,1.2,.64,1)` from y 20, triggered on mount. Media image: no animation.

### T1.2 Announcement strip
- One line, centered: "Idiomatic is now Siena Insights, with the same great features plus more innovation and support." — Instrument Sans **600 12px/16.8px, ls 0.6px, uppercase**, color **`#787368`** rgb(120,115,104), center. 1440 box 705x17. 390: box 193 wide → wraps to 4 lines (67 tall).

### T1.3 Logos row
- Inner row: max-width 100% (1248), flex row center, **gap 56** (390: wraps to 2x2, row-gap 40 / column-gap 56). Four `<img>` boxes **136x46**, `object-fit: contain`, in order: Instacart `RcdtrxM5jv83GuYPt3fegafLYE.svg` (150x24), HubSpot `r2W6as2bHWbtrfk5iuHQjFsp1R8.svg` (106x31), Upwork `qvKxkoZLyMmJdvAE9tNTPqFq5hQ.svg` (108x32), SmugMug `3DYeO3vzL0aossMXlU9JfDBK8f0.svg` (128x32). Static; no ticker, no hover.

### T1.4 Feature row ("Feature 1")
- Row of **image box 512x512** + **text column max-width 512**, gap 64 → 1088 total, centered (x 176–1264). Sides alternate starting with **image LEFT** on row 1 (per-route order in §R1). Section height constant **672** at 1440 (80 + 512 + 80).
- Image: `<img>` 512x512, `object-fit: contain`, no radius/shadow (the PNGs carry their own dark-panel artwork on transparent bg).
- Text column ("Title"): flex column, `justify-content:center`, align flex-start, **gap 24** (rows that contain a button: inner text group gap 24, then **gap 32** to the button):
  - H2: Feature Deck Web Light **64px/64px, ls −1.28px, weight 400 (computed)**, `#122023`, left. Some headings contain a forced `<br>` (e.g. "Sentiment analysis⏎made simple").
  - Body: Instrument Sans 500 20/28 ls −0.2, `rgba(18,32,35,0.8)` on `/insights`, `#122023` on subpages. Some rows have **2 paragraphs** (gap = paragraph spacing 20px; see §R1).
  - Optional xlg "Book a demo" (→ `#book-a-demo` anchor on the same page; on `/insights` href is `./`).
- 390: column, gap 24, **image first** (342x342 box, contain), then text (H2 **48/48 ls −0.96**, body 16/22.4 ls −0.16, Title gap **16**). Button left-aligned.
- Motion: none measured (no will-change/opacity on these rows).

### T1.5 Integrations (VARIANT of homepage `Integrations`)
- Title block (max-width 1328, column, gap 24 (390: 16), align flex-start): eyebrow "Integrate with your existing platforms" (600 16/22.4 ls 1.7 uppercase; 390 14/19.6), H2 64/64 ls −1.28 left (390 48/48).
- Grid: max-width 1328 → `repeat(4, 309px)` at 1440 (1248 wide), rows **181**, **gap 4px** (390: `repeat(2, 169px)`, 4 rows). Tile: bg `#F3F0EB`, radius **4**, padding **72px 0** (390: **14px**), flex column center/center, overflow hidden.
- Tiles (inline SVGs, black fill; exported to `public/svg/insights-integration-*.svg`) and rendered sizes 1440 / 390:
  1. Salesforce `insights-integration-salesforce.svg` 107x107 / 107x107
  2. Zendesk `insights-integration-zendesk.svg` 171x37 / 111x24
  3. Qualtrics `insights-integration-qualtrics.svg` 156x44 / 124x35
  4. Looker `insights-integration-looker.svg` 151x39 / 131x34
  5. Discord `insights-integration-discord.svg` 161x31 / 127x24
  6. Tableau `insights-integration-tableau.svg` 183x39 / 133x28
  7. Typeform `insights-integration-typeform.svg` 171x28 / 129x21
  8. Text "...and  many more" (two spaces in source) — Instrument Sans **700 20px/28px ls −0.2** `#122023` (390: 700 16/22.4 ls −0.16).
- Diffs vs homepage: white section bg (not cream), max 1328 not 1200, title has an eyebrow, 8th tile text, **no "Explore all integrations" button**.

### T1.6 Testimonial ("Testimonials 2")
- Column center, gap 40: H3 "What our customers say" — Feature Deck **Web Regular 400 52px/62.4px**, `#122023`, center (390: **36px/43.2px**). Quote (max-width 500): Instrument Sans 500 20/28 ls −0.2 `rgba(18,32,35,0.8)` center (390 16/22.4): "“Siena Insights gave us the customer voice insights we needed to improve support operations while eliminating the need for manual reviews.”" Person row: flex row center, **gap 15**: avatar **50x50 circle** `PGTIAdOBFUHqD4uWC2d28jqi9I.png` (green Upwork badge) + column: "Upwork" (600 16/22.4 ls 1.7 uppercase; 390 14/19.6) and "Customer Support Team" (Instrument Sans 400 14/15.4 `rgba(18,32,35,0.8)`).
- Static, no slider/controls, no motion.

### T1.7 AI-agent promo (VARIANT of homepage ScrollArea block 1 + `ChatMock` v1)
- Row center, gap 64: text column (max 640 → **544 wide** at x96) + image card ("Image - portait") **640x810** at x704.
- Text column: column, `justify-content:center`, **gap 40** between text group and button; text group column gap **24**: eyebrow "Siena AI agent" (600 16/22.4 ls 1.7 uppercase), H2 64/64 (2 lines), body Instrument Sans 500 20/28 ls −0.2 `#122023` with the wrapper at **opacity 0.82** (static, both widths): "Take the next step with our AI agent that blends empathy and automation to deliver exceptional customer experiences at scale." Then xlg **"Learn more"** (144x58) → `../` (homepage).
- Card: radius **24**, padding **56** (390: **24**), flex column center, gap 16; bg `<img>` `OS7uIQBhEtXd5l7MXZ0qAcM0Lg.png` cover, radius 24 (already in `public/assets`). Chat column 528 wide (390: 294), flex column, align flex-start, **gap 16**; 5 rows, alternating customer (left) / Siena (right):
  1. customer: "hey! i need help with an order i placed yesterday—i forgot to apply my discount code."
  2. Siena: "no worries! i’ve got your order pulled up. i can apply the code “WELCOME15” and refund the difference—ready to go?"
  3. customer: "yes please! appreciate it."
  4. Siena: "done. also noticed you’ve bought from our skincare line twice—our new serum just dropped and it’s a perfect match. want me to add it to your cart with 10% off?"
  5. customer: "omg yes! that sounds amazing."
  - Customer row: flex row, align flex-end, gap 10: avatar 40x40 radius 99 (`D3TQ38q4HpOxmxHoD1u1AW40NI.png` drawn 38x57 cover inside) + bubble bg `#F3F0EB`, radius 16, padding **20** (390: **16**), max-width 380.
  - Siena row: justify flex-end, gap 10: 2px gradient border wrapper (`linear-gradient(255deg, #F2E59A 0%, #FEC796 14.8649%, …)` — same as homepage ChatMock v1), radius 16, padding 2 → inner bg `#EFE5D0` radius 16 padding 20 (390: 16), width 380 (390: 240) + Siena avatar 40x40 bg `#122023` with 12x13 "S" glyph (`public/svg/siena-avatar-glyph.svg`).
  - Bubble text: **Tiempos Text Regular 400 12px/15.6px** `#122023` (homepage uses 14/18.2 — diff).
- Motion (scroll, per row, whileInView once): each row starts `opacity:0; translateY(50px)` (**row 1: 80px**) and animates to `opacity 1; y 0` when that row enters the viewport — rows reveal individually as you scroll (measured: rows 1–2 settled within ~0.7s of entering; rows below the fold stayed hidden until scrolled to). Easing as homepage ChatMock (`opacity .5s cubic-bezier(.22,1,.36,1)`, `transform .6s cubic-bezier(.34,1.2,.64,1)`). Reuse `ChatMock`'s `Enter` wrapper but trigger with an IntersectionObserver per row instead of the variant timeline.
- 390: column, gap 40: text first, then card **342x506**.

### T1.8 Demo-request CTA (VARIANT of `MainCta` shell + NEW form), anchor id `book-a-demo`
- Section 1440: 1440x**991**, padding **120px 0**, row center, overflow hidden. Full-bleed bg `<img>` `5VTp1YGCJLYo9Grib0Ouvyooeag.webp`, `object-fit:cover`, **object-position 50.4% 58.2%** (not the homepage `ERYN…` image; no top blur-out).
- Card ("Title"): max-width **790** (790x751), bg `#F3F0EB`, radius **48**, padding **64**, column center, gap 40.
- `<form>` 662 wide, column, align flex-start, **gap 24**:
  - Header row: padding-bottom **32**, bottom border **1px `rgba(0,0,0,0.2)`** (Framer `::after`): H4 "Book a personalized demo now" — Feature Deck **Web Regular 40px/48px `#000`** (390: **24px/28.8px**, 2 lines).
  - Rows (flex row, gap **16**; 390: stacked column, gap 24): [Full name* | Work email*], [Company website* | Help desk*], [Monthly average tickets*] (full), [Where did you hear about us?*] (full).
  - Label: column, gap **6** (select labels gap **10**); label text `<strong>` Instrument Sans **600 14px/15.4px** `rgba(18,32,35,0.8)`.
  - Text input wrapper: **323x60** (full-width rows 662), bg `#FFF`, radius **16**, padding **20px 16px**, border **1px `#CDBCA0`** (inset `::after`, radius 16). Input: Instrument Sans 400 16px/16px `#122023`, transparent, no border; placeholder `#A7A092` rgb(167,160,146). Fields: `fullName` "John Smith"; `workEmail` (type email) "john.smith@business.com"; `business_website` "www.mywebsite.com"; all `required`.
  - Select wrapper: **56 tall**, radius **15**, bg #FFF, border 1px `#CDBCA0`, `padding-right:16`; `<select>` padding 20px 16px, `appearance:none`, Instrument Sans 400 16/16, shown in placeholder color `#A7A092` while the disabled "Select one…" option is selected (`:required:invalid`). Icon: 16px up/down chevron at right (`::before` mask, color `rgb(153,153,153)` → use `public/svg/insights-select-chevron.svg`, fill `#414D4F` in file). Options — `helpDesk`: Select one…, Gorgias, Zendesk, Kustomer, Gladly, Intercom, Salesforce, Other. `ticketVolume`: Select one…, <5,000, 5,000-10,000, 10,000-20,000, 20,000-30,000, Over 30,000.
  - Textarea `attribution`: 662x**100**, padding 20px 16px, radius 16, same border, placeholder "Write us something...", vertical resize handle visible.
  - Submit row: flex row, `justify-content:flex-end`: `<button>` "Submit" 110x58 (xlg styles). 390: full width 310x58.
- 390: section padding **40px 24px**; card **342** wide, padding **40px 16px**, radius **24**, gap 32; form 310 wide.
- No visible focus styling defined (Framer default; no focused-box-shadow vars set). Native HTML5 validation.

### T1.9 Hover states (measured)
- xlg buttons (`a`): bg `#122023` → `linear-gradient(90deg, #F2E59A 0%, #FEC796 21.4087%, #FB5646 36.0976%, #827ACC 60.5158%, #2E79D8 89%, #294FBA 100%)`, instant.
- Form `<button>` (Submit / Sign me up!): → `linear-gradient(90deg, #F2E59A 0%, #FEC796 15.7658%, #FB5646 30.6306%, #827ACC 48.1982%, #2E79D8 77.027%, #294FBA 100%)`, instant.
- Feature images, logos, tiles: no hover.

---

## T2. Conversations index (`/conversations`)

| Section | 1440 y / h | Layout | Verdict |
|---|---|---|---|
| Nav | fixed | — | IDENTICAL `Nav` |
| Main | 0 / 1232 | padding **170px 96px 100px**, column, align center, max-width 100% (390: **100px 20px 80px**, starts y 40) | NEW (`ConversationsIndex`) |
| Newsletter CTA | 1232 / 604 | see T2.3 | VARIANT of `MainCta` shell — same component as `specs/company.md` §E3 (Events newsletter) |
| Footer | 1836 / 434 | — | IDENTICAL `Footer` |

Document height: 1440 = 2270, 390 = 2984.

### T2.1 Header (max-width 1062, x 189–1251; column, align flex-start, **gap 24**)
- Kicker "Conversations": **Tiempos Text Regular 400 14px/18.2px** `#122023` (plain text, not a link).
- H1 "CX leaders on AI, in their own words": Feature Deck Web Light, **computed weight 400**, **64px/64px ls −1.28px** `#122023`, left, 1 line. 390: **48px/48px ls −0.96**, 2 lines.
- Subtitle (max-width 720): Tiempos Text Regular **18px/23.4px ls −0.18px** `#122023`, 3 lines at 1440 (390: **14px/21px ls −0.14**, 4 lines): "Full interviews and transcripts with the people running customer experience at consumer brands: how they adopted AI, the metrics they track, and what they learned along the way."
- Divider: 1px `rgba(0,0,0,0.2)`, full 1062 width (last header child). The grid starts **immediately below the divider (0 gap)**.

### T2.2 Card grid ("Conversation Grid")
- `display:grid; grid-template-columns: repeat(2, 519px); gap: 24px;` max-width 1062. Row 1 at y 395, row 2 at y 776 (card 356 + 24 gap). 3 cards → 2nd row has one card on the left.
- Card (`<a>`): **519x356**, bg `#FFFFFF`, radius **16**, overflow clip, border **1px `rgba(0,0,0,0.2)`** (inset `::after`, radius 16), flex column, no gap.
  - Image: full-width **519x205**, `object-fit: cover`, no radius of its own (clipped by card).
  - Card Body: padding **20px 20px 24px**, column, **gap 10**:
    - Byline row (flex, align center, **gap 6**): name Instrument Sans **500 12px/13.2px** `#122023` + "· Brand" Instrument Sans **400 12px/13.2px** `#122023`.
    - Excerpt: **Tiempos Text Regular 400 20px/28px `#000`**, `-webkit-line-clamp: 4` (3 lines at 1440, clamps with ellipsis at 390).
- Hover: **none** (no transform/shadow/color change measured on card or image).
- Card order and data (exact):
  1. → `/conversations/spanx-kylah-field-real-work-ai-customer-experience`; image `uXunsm8tlCYJ75EHjJsuPKBi8Ec.jpg` (1280x720), alt "Kylah Field, VP of Global Customer Experience at Spanx, in conversation with Siena's Lisa Popovici"; byline "Kylah Field" "· Spanx"; excerpt "Choosing an AI vendor by brand voice, the real work behind 50% automation, and why AI raised the bar for her human team too."
  2. → `/conversations/thrive-causemetics-ai-customer-service-automation`; image `TdidUtYfcNyYSLLThuETu1itgJI.jpg` (640x360), alt ""; "Brendan Gardner-Young" "· Thrive Causemetics"; "Automating half of support volume with Siena, the metrics that actually matter, and why adopting AI is a lot like learning to paint."
  3. → `/conversations/prose-ai-customer-service-automation`; image `kWqyVruHOxgHlNpA8KWxTfUyFo.jpg` (640x360), alt ""; "Jessica Weiss" "· Prose"; "Why personalized beauty makes support harder, the custom integration that made AI viable, and turning Ask Siena into a true CX analyst."
- **390 (live bug, see finding 5)**: grid stays `repeat(2, 340px)` gap 24 inside a 350px container → columns at x −157 and 207; cards 340x384 (image 340x205, body padding unchanged, excerpt 4 lines clamped). Recommended fix: `grid-template-columns: 1fr` (cards 350 wide).
- Motion: none.

### T2.3 Newsletter CTA ("Be the first to know what's happening")
- Section **1440x604**, padding **120px 0**, row center, overflow hidden; bg `<img>` `5VTp1YGCJLYo9Grib0Ouvyooeag.webp` cover, object-position 50.4% 58.2%.
- Card: max-width **791** (791x364), bg `#F3F0EB`, radius **48**, padding **64**; `<form>` 663 wide, column, **gap 48**:
  - H2 "Be the first to know what's happening": Feature Deck Web Light 64/64 ls −1.28 `#122023`, **center**, 2 lines (title wrapper gap 16, max 1062).
  - Row (flex center, **gap 10**): email field wrapper **506x60** (bg #FFF, radius 16, padding 20px 16px, 1px `#CDBCA0` border via `::after`), input `type=email name=Email placeholder="john.smith@example.com" required`, Instrument Sans 400 16/16, placeholder `#A7A092`; submit `<button>` **"Sign me up!"** 147x58 (xlg styles; form-button rainbow on hover).
  - Hidden `FormId` field (opacity 0) — do not render.
- 390 on `/conversations*` (measured, desktop variant kept): section 390x620 padding 120px 0; card **390 wide**, padding 64, radius 48; H2 48/48 (3 lines, 262 wide); row: input wrapper **105x60** + button 147x58. (The `/events` page uses a proper phone variant — `specs/company.md` §E3.)
- Identical on all three conversation detail pages.

---

## T3. Conversation detail / transcript template (`/conversations/<slug>`)

Sections: Nav (IDENTICAL) → **Main** (NEW `ConversationArticle`) → Newsletter CTA (T2.3, identical) → Footer (IDENTICAL).

### T3.1 Main column
- Main: padding **170px 24px 100px** (390: **100px 20px 80px**, starts y 40), flex column, align center, **gap 48** between blocks. Every block is **max-width 800** (x 320–1120 at 1440; 350 wide at 390). No sidebar, no sticky elements, no progress indicator.
- Block order (all routes): Header → Video → Summary → Key takeaways → Chapters → Full transcript → Frequently asked questions. A JSON-LD `<script>` sits first inside Main (no visual).

### T3.2 Header (column, align flex-start, **gap 24**)
- Kicker row (flex, align center, **gap 8**): `<a>` "Conversations" → `/conversations` (Tiempos Text Regular 14px/18.2px `#122023`, **underline**) + `<time>` date (Tiempos 14/18.2 `#122023`, e.g. "Jul 8, 2026").
- H1: Feature Deck Web Light, computed weight 400, **64px/64px ls −1.28px** `#122023`, left (2–4 lines). 390: **48px/48px ls −0.96**.
- Guest row (flex, align center, **gap 6**): name Instrument Sans **500 16px/19.2px ls −0.16** `rgba(18,32,35,0.8)` (390: **500 12px/14.4px ls −0.12**), then "· Role" and "· Brand" Instrument Sans **400 16px/19.2px ls −0.16** `#122023` (16px also at 390; the row overflows to the right at 390 on long roles — no wrap).
- Divider 1px `rgba(0,0,0,0.2)` (800 wide).

### T3.3 Video embed
- Wrapper "Video": **800x450** (16:9), radius **16**, overflow clip, max-width 800 (390: 350x200, inner 350x197). Inner div `aspect-ratio: 1.7778/1; border-radius: 10px; overflow: hidden`.
- `<iframe src="https://www.youtube.com/embed/<ID>?autoplay=0&mute=1&controls=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" title="<H1 text>">`, width/height 100%, no border. YouTube renders its own thumbnail/title bar/play button (see `recon/content/detail-video-1440.png` and the 1440 screenshots).
- CookieYes blocks the iframe until consent: before "Accept All" the wrapper shows a placeholder (bg `linear-gradient(rgba(76,72,72,.7), rgba(76,72,72,.7)), url(https://img.youtube.com/vi/<ID>/maxresdefault.jpg)`, centered black pill "Please accept cookies to access this content", 12px sans-serif white, padding 10px 16px, radius 2). The clone can render the iframe directly.

### T3.4 Rich-text blocks — typography (all blocks share one rich-text style)
| Role | Font | 1440 | 390 | Color | Spacing |
|---|---|---|---|---|---|
| Block H2 ("Key takeaways", "Chapters", "Full transcript", "Frequently asked questions") | Feature Deck **Web Regular** 400 | **40px/48px** | **24px/28.8px** | `#000` | block column gap **20** to content |
| Transcript chapter H2 | Feature Deck **Condensed Web Regular** 400 | **36px/36px** | **24px/24px** | `#122023` | `margin-top 40px` (first one 0) |
| FAQ question H3 | Feature Deck Condensed Web Regular 400 | **28px/33.6px** | **20px/24px** | `#122023` | `margin-top 40px` (first 0) |
| Paragraph | Instrument Sans 400 | **16px/19.2px, ls −0.16px** | same | `#122023` | `p` following anything: `margin-top 20px` |
| Speaker label | Instrument Sans **700** (`<strong>`) | 16/19.2 | same | `#122023` | inline at paragraph start, followed by timestamp link |
| Links (body, chapters, timestamps, guest LinkedIn) | inherit | 16/19.2 | same | `#122023` | `text-decoration: underline`; **no hover change** |
| List item | Instrument Sans 400 16/19.2 | | | `#122023` | `ul` padding 0, margin 0; `li` `padding-left: 21.312px` (1.332em), `margin 0` (no gap between items); bullet = `li::before { content:"•"; position:absolute; left:0; top:0 }` same font |

- Transcript paragraph pattern: a speaker turn starts with `<strong>Name</strong>` + space + `<a href="https://www.youtube.com/watch?v=<ID>&t=<seconds>s">(m:ss)</a>` + text; continuation paragraphs of the same speaker have no label.
- Summary first paragraph begins with the guest name as an underlined link to their LinkedIn.
- Chapters: `ul` of `li > p > a` items; link text `m:ss · Chapter title` (middle dot with spaces), href `#chapter-<n>-<slug>` where slug = chapter title lowercased, non-alphanumerics → `-`, truncated to 60 chars (e.g. `#chapter-1-we-answered-every-ticket-ourselves-the-mission-beh`). Each transcript H2 carries the matching `id`, with `scroll-margin-top: 120px`.

### T3.5 Motion
- None on the article (no appear config, no scroll-linked elements). Only the global nav behaviour.

---

## T4/T5. Legal template (`/terms-of-service`, `/privacy-policy`)

Sections: Nav (IDENTICAL) → **Main** (NEW `LegalPage`) → Footer (IDENTICAL). No CTA section.

### T4.1 Layout
- Main: padding **160px 96px 80px** (390: **96px 24px 80px**, starts y 40), flex column center, **gap 32** (390: 40). Inner wrapper max-width **1120** (x 160–1280), column, align flex-start, **gap 64** (390: **32**) between the title block and the "Last updated" row; then the Content block (gap 32 below).
- Title block ("Title"): flex row, align center, padding-bottom **50px** (390: **32px**), **bottom border 1px `rgba(0,0,0,0.2)`** (full 1120 width). H1 Feature Deck Web Light, computed weight 400, **64px/64px ls −1.28px** `#122023` (390: **48/48 ls −0.96**): "Terms of Service" / "Privacy Policy".
- Last-updated row (flex, align center, **gap 8**; inner text gap 4): calendar icon = Font Awesome 6 Pro Regular glyph **U+F133** 16px `#122023` (14x16 box) + text Instrument Sans **600 14px/21px** `#122023`: "Last Updated: September 1st, 2025" (terms) / "Last Updated: February 20th, 2025" (privacy).
- Content: single rich-text block, max-width 1120 (390: 342).

### T4.2 Legal typography
| Role | 1440 | 390 | Color | Spacing |
|---|---|---|---|---|
| Body `p` | Tiempos Text Regular 400 **18px/23.4px ls −0.18px** | **14px/21px ls −0.14px** | **`#2A3639`** | `margin-top 20px` (390: **18px**) |
| Inline bold (`strong`, incl. bold "headings" inside h2/h3/h4/p like "Data Processing Agreement", "Whereas:", "SUBJECT MATTER OF DPA") | Tiempos 700 18/23.4 | 700 14/21 | `#2A3639` | — |
| Terms section heading H2 ("3. FEES" …) | Feature Deck Web Regular 400 **24px/33.6px** | **18px/25.2px** | `#122023` | `margin-top 40px` |
| Terms numbered heading via `ol > li > h2` (sections 1, 2, 10–19: "THE PLATFORM", "AI GOVERNANCE…", "CONFIDENTIALITY", …) | same as H2; number from `li::before { content: counter(list-item) "." }` absolute left 0 in the heading font; `li` padding-left **29.76px** (1.24em; 390 **22.32px**) | | `#122023` | `ol` margin-top **40px**; `ol` uses `start` attr (2, 10, 11, …) to continue numbering |
| Privacy H2 ("1. Scope of this policy" …) | **Instrument Sans 700 36px/43.2px** (bold via `<strong>`) | **Instrument Sans 700 23px/27.6px** | `#122023` | `margin-top 40px` |
| Privacy H3 ("Who we are and whose data we process:", "ANALYTICS" …) | Feature Deck Web Regular 400 24px/33.6px | 18px/25.2px | `#122023` | `margin-top 40px` |
| Lists `ul`/`ol` | items Tiempos 18/23.4 (390 14/21) `#2A3639` | | | list `margin-top 20px` (390 18), padding 0; `li` padding-left **22.86px** (1.27em; 390 **17.78px**), margin 0; ul bullet `li::before "•"` abs left 0; ol `counter(list-item) "."`; nested lists margin-top 0 |
| Links | Tiempos 18/23.4 underline; terms `#122023`; privacy email links **`#0099FF`** (e.g. "privacy@siena.cx") | | | no hover change |

- No TOC, no anchors, no sticky elements, no motion.
- Terms ends with: p "Previous terms of services" + three separate link paragraphs: "June 12th, 2025" → `./terms-of-services/06122025-terms-of-service`, "February 20th, 2025" → `./terms-of-services/02202025-terms-of-service`, "October 4th, 2024" → `./terms-of-services/10042024-terms-of-service` (not cloned; keep as `siteHref` links to siena.cx).

---

## R1. Per-route content — Insights (T1)

Notation: sections in DOM order; `p (body, N words)` = placeholder copy of that length (exact copy given only for headings/labels). Image boxes are the 1440 render box; files are in `public/assets/`. Hero media and feature images: `object-fit: contain`.

### /insights

- Title tag: "Siena Insights, formerly Idiomatic - Customer feedback analysis with AI"; document height 1440 = 7941px, 390 = 9519px
- **Hero** (y 0, h 658 @1440; h 859 @390) 
  - p: "Siena Insights, formerly Idiomatic"
  - h1: "Turn feedback into insights you can trust"
  - p (body, 15 words): starts "Stay in tune with the voice…"
  - p: "Book a demo"
  - img `VKHdNmxFVDSgMwwUTZNi0WmJ4k.svg` box 606x434 at x770, object-fit contain
- **announcement** (y 658, h 177 @1440; h 179 @390) 
  - p: "Idiomatic is now Siena Insights, with the same great features plus more innovation and support."
- **Logos** (y 835, h 206 @1440; h 244 @390) 
  - img `RcdtrxM5jv83GuYPt3fegafLYE.svg` box 136x46 at x364, object-fit contain
  - img `r2W6as2bHWbtrfk5iuHQjFsp1R8.svg` box 136x46 at x556, object-fit contain
  - img `qvKxkoZLyMmJdvAE9tNTPqFq5hQ.svg` box 136x46 at x748, object-fit contain
  - img `3DYeO3vzL0aossMXlU9JfDBK8f0.svg` box 136x46 at x940, object-fit contain
- **Feature 1** (y 1041, h 672 @1440; h 705 @390) image LEFT / text right
  - h2: "Find what to focus on in seconds"
  - p (body, 23 words): starts "Get a clear overview of customer…"
  - img `HfktNRmsAoNia3x1j5mJvxcdL0Q.svg` box 512x512 at x176, object-fit contain
- **Feature 1** (y 1713, h 672 @1440; h 772 @390) text LEFT / image right
  - h2: "Stay in the loop when things change fast"
  - p (body, 31 words): starts "Get instant Slack alerts when feedback…"
  - img `det6EhIvWp8r7Ya2JlpMeyK5R8.png` box 512x512 at x752, object-fit contain
- **Feature 1** (y 2385, h 672 @1440; h 809 @390) image LEFT / text right
  - h2: "Your customer data, now in plain English"
  - p (body, 24 words): starts "Chat with your data like you're…"
  - p: "Book a demo"
  - img `RUoFYDLGaRP5h1vQu2qaSeuBAjw.png` box 512x512 at x176, object-fit contain
- **Feature 1** (y 3057, h 672 @1440; h 705 @390) text LEFT / image right
  - h2: "Sentiment analysismade simple"
  - p (body, 19 words): starts "Stay on top of customer feelings,…"
  - img `7c9xveioz1zbxWxFVO2t6p1XhY.png` box 512x512 at x752, object-fit contain
- **Feature 1** (y 3729, h 672 @1440; h 680 @390) image LEFT / text right
  - h2: "Know what every ticket costs"
  - p (body, 27 words): starts "Track the true cost of resolving…"
  - img `oRcxQbBbFEDD9rKRlVasJbMjX0.png` box 512x512 at x176, object-fit contain
- **Integrations** (y 4401, h 708 @1440; h 1079 @390) 
  - p: "Integrate with your existing platforms"
  - h2: "See your customers across every channel"
  - strong: "...and  many more"
- **Testimonials 2** (y 5109, h 436 @1440; h 375 @390) 
  - h3: "What our customers say"
  - p (body, 21 words): starts "“Siena Insights gave us the customer…"
  - p: "Upwork"
  - p: "Customer Support Team"
  - img `PGTIAdOBFUHqD4uWC2d28jqi9I.png` box 50x50 at x608, object-fit cover
- **Feature 1** (y 5546, h 970 @1440; h 987 @390) text LEFT / image right
  - p: "Siena AI agent"
  - h2: "Insights is just the beginning"
  - p (body, 20 words): starts "Take the next step with our…"
  - p: "Learn more"
  - img `OS7uIQBhEtXd5l7MXZ0qAcM0Lg.png` box 640x810 at x704, object-fit cover
- **CTA** (y 6515, h 991 @1440; h 1004 @390) 
  - h4: "Book a personalized demo now"
  - p: "Submit"
  - Buttons (xlg): "Book a demo" @y574 bg rgb(18, 32, 35); "Book a demo" @y2826 bg rgb(18, 32, 35); "Learn more" @y6163 bg rgb(18, 32, 35)
  - Button hrefs: "Book a demo" → ./; "Book a demo" → ./; "Learn more" → ./

### /insights/sentiment-analysis-online

- Title tag: "Online AI sentiment analysis software | Siena Insights, formerly Idiomatic"; document height 1440 = 6633px, 390 = 8213px
- **Hero** (y 0, h 694 @1440; h 945 @390) 
  - p: "Siena Insights, formerly Idiomatic"
  - h1: "AI-driven sentiment analysis software"
  - p (body, 26 words): starts "Understand your customer’s sentiment just like…"
  - p: "Book a demo"
  - p: "Login"
  - img `uaM0A3GiLu0NROIvudKMalml2b4.png` box 606x434 at x770, object-fit contain
- **announcement** (y 694, h 177 @1440; h 179 @390) 
  - p: "Idiomatic is now Siena Insights, with the same great features plus more innovation and support."
- **Logos** (y 871, h 206 @1440; h 244 @390) 
  - img `RcdtrxM5jv83GuYPt3fegafLYE.svg` box 136x46 at x364, object-fit contain
  - img `r2W6as2bHWbtrfk5iuHQjFsp1R8.svg` box 136x46 at x556, object-fit contain
  - img `qvKxkoZLyMmJdvAE9tNTPqFq5hQ.svg` box 136x46 at x748, object-fit contain
  - img `3DYeO3vzL0aossMXlU9JfDBK8f0.svg` box 136x46 at x940, object-fit contain
- **Feature 1** (y 1077, h 672 @1440; h 702 @390) image LEFT / text right
  - h2: "Know when your strategy works"
  - p (body, 24 words): starts "Monitor customer sentiment and easily see…"
  - img `7c9xveioz1zbxWxFVO2t6p1XhY.png` box 512x512 at x176, object-fit contain
- **Feature 1** (y 1749, h 672 @1440; h 820 @390) text LEFT / image right
  - h2: "Effortless sentiment analysis, powered by AI"
  - p (body, 37 words): starts "Our AI automatically identifies and categorizes…"
  - img `Ch5kap0GfB7vpcnRuTb8jYPV86o.png` box 512x512 at x752, object-fit contain
- **Feature 1** (y 2421, h 672 @1440; h 758 @390) image LEFT / text right
  - h2: "Stay informed with tailored reports"
  - p (body, 26 words): starts "Effortlessly create custom reports to track…"
  - img `CZf5b1hc6bqRL4RdIWcY4DwOHmw.png` box 512x512 at x176, object-fit contain
- **Integrations** (y 3093, h 708 @1440; h 1079 @390) 
  - p: "Integrate with your existing platforms"
  - h2: "See your sentimant data in your stack"
  - strong: "...and  many more"
- **Testimonials 2** (y 3801, h 436 @1440; h 375 @390) 
  - h3: "What our customers say"
  - p (body, 21 words): starts "“Siena Insights gave us the customer…"
  - p: "Upwork"
  - p: "Customer Support Team"
  - img `PGTIAdOBFUHqD4uWC2d28jqi9I.png` box 50x50 at x608, object-fit cover
- **Feature 1** (y 4238, h 970 @1440; h 987 @390) text LEFT / image right
  - p: "Siena AI agent"
  - h2: "Insights is just the beginning"
  - p (body, 20 words): starts "Take the next step with our…"
  - p: "Learn more"
  - img `OS7uIQBhEtXd5l7MXZ0qAcM0Lg.png` box 640x810 at x704, object-fit cover
- **CTA** (y 5207, h 991 @1440; h 1004 @390) 
  - h4: "Book a personalized demo now"
  - p: "Submit"
  - Buttons (xlg): "Book a demo" @y602 bg rgb(18, 32, 35); "Login" @y602 bg rgb(255, 255, 255); "Learn more" @y4855 bg rgb(18, 32, 35)
  - Button hrefs: "Book a demo" → ./sentiment-analysis-online#book-a-demo; "Login" → https://idiomatic.io/?login=true; "Learn more" → ../

### /insights/voice-of-customer-software

- Title tag: "AI-driven voice of customer (VoC) software | Siena Insights, formerly Idiomatic"; document height 1440 = 7233px, 390 = 8792px
- **Hero** (y 0, h 622 @1440; h 883 @390) 
  - p: "Siena Insights, formerly Idiomatic"
  - h1: "Voice of customer software"
  - p (body, 26 words): starts "Understand your customer’s sentiment just like…"
  - p: "Book a demo"
  - img `MOanKo50R049QJz0dIR4rVeJzSU.png` box 606x434 at x770, object-fit contain
- **announcement** (y 622, h 177 @1440; h 179 @390) 
  - p: "Idiomatic is now Siena Insights, with the same great features plus more innovation and support."
- **Logos** (y 799, h 206 @1440; h 244 @390) 
  - img `RcdtrxM5jv83GuYPt3fegafLYE.svg` box 136x46 at x364, object-fit contain
  - img `r2W6as2bHWbtrfk5iuHQjFsp1R8.svg` box 136x46 at x556, object-fit contain
  - img `qvKxkoZLyMmJdvAE9tNTPqFq5hQ.svg` box 136x46 at x748, object-fit contain
  - img `3DYeO3vzL0aossMXlU9JfDBK8f0.svg` box 136x46 at x940, object-fit contain
- **Feature 1** (y 1005, h 672 @1440; h 728 @390) image LEFT / text right
  - h2: "Quickly uncover what needs attention"
  - p (body, 19 words): starts "Effortlessly capture the voice of your…"
  - img `Qf5PSeGvhhkja3WG3J4iL67YMo.png` box 512x512 at x176, object-fit contain
- **Feature 1** (y 1677, h 672 @1440; h 705 @390) text LEFT / image right
  - h2: "Your data, now a conversation away"
  - p (body, 19 words): starts "Skip the complicated reports. Chat directly…"
  - img `3p6ErMGR3qwEHMsMXGFXDDzSY.png` box 512x512 at x752, object-fit contain
- **Feature 1** (y 2349, h 672 @1440; h 736 @390) image LEFT / text right
  - h2: "Triage tickets by listening to your customers"
  - p (body, 22 words): starts "Improve support experiences by automatically routing…"
  - img `Ch5kap0GfB7vpcnRuTb8jYPV86o.png` box 512x512 at x176, object-fit contain
- **Feature 1** (y 3021, h 672 @1440; h 705 @390) text LEFT / image right
  - h2: "Never miss a critical customer insight"
  - p (body, 20 words): starts "Be the first to know when…"
  - img `det6EhIvWp8r7Ya2JlpMeyK5R8.png` box 512x512 at x752, object-fit contain
- **Integrations** (y 3693, h 708 @1440; h 1079 @390) 
  - p: "Integrate with your existing platforms"
  - h2: "See your customers across every channel"
  - strong: "...and  many more"
- **Testimonials 2** (y 4401, h 436 @1440; h 375 @390) 
  - h3: "What our customers say"
  - p (body, 21 words): starts "“Siena Insights gave us the customer…"
  - p: "Upwork"
  - p: "Customer Support Team"
  - img `PGTIAdOBFUHqD4uWC2d28jqi9I.png` box 50x50 at x608, object-fit cover
- **Feature 1** (y 4838, h 970 @1440; h 1035 @390) text LEFT / image right
  - p: "Siena AI agent"
  - h2: "Customer thoughts are simply the start"
  - p (body, 20 words): starts "Take the next step with our…"
  - p: "Learn more"
  - img `OS7uIQBhEtXd5l7MXZ0qAcM0Lg.png` box 640x810 at x704, object-fit cover
- **CTA** (y 5808, h 991 @1440; h 1004 @390) 
  - h4: "Book a personalized demo now"
  - p: "Submit"
  - Buttons (xlg): "Book a demo" @y529 bg rgb(18, 32, 35); "Learn more" @y5455 bg rgb(18, 32, 35)
  - Button hrefs: "Book a demo" → ./voice-of-customer-software#book-a-demo; "Learn more" → ../

### /insights/customer-feedback-analytics-software

- Title tag: "AI customer feedback analytics software | Siena Insights"; document height 1440 = 7420px, 390 = 9032px
- **Hero** (y 0, h 610 @1440; h 838 @390) 
  - p: "Siena Insights, formerly Idiomatic"
  - h1: "Customer feedback analytics"
  - p (body, 22 words): starts "Stop sorting through feedback manually. Our…"
  - p: "Book a demo"
  - img `MOanKo50R049QJz0dIR4rVeJzSU.png` box 606x434 at x770, object-fit contain
- **announcement** (y 610, h 177 @1440; h 179 @390) 
  - p: "Idiomatic is now Siena Insights, with the same great features plus more innovation and support."
- **Logos** (y 787, h 206 @1440; h 244 @390) 
  - img `RcdtrxM5jv83GuYPt3fegafLYE.svg` box 136x46 at x364, object-fit contain
  - img `r2W6as2bHWbtrfk5iuHQjFsp1R8.svg` box 136x46 at x556, object-fit contain
  - img `qvKxkoZLyMmJdvAE9tNTPqFq5hQ.svg` box 136x46 at x748, object-fit contain
  - img `3DYeO3vzL0aossMXlU9JfDBK8f0.svg` box 136x46 at x940, object-fit contain
- **Feature 1** (y 993, h 672 @1440; h 837 @390) image LEFT / text right
  - h2: "Uncover what drives customer feedback"
  - p (body, 26 words): starts "Identify pain points, sentiment, and key…"
  - p (body, 17 words): starts "Eliminate guesswork and time-consuming manual analysis…"
  - img `lV97h3YK7dQbjW2cbAIBC01A.png` box 512x512 at x176, object-fit contain
- **Feature 1** (y 1665, h 672 @1440; h 776 @390) text LEFT / image right
  - h2: "Smart categorization for clearer customer insights"
  - p (body, 20 words): starts "Understand customer issues the way they…"
  - img `Qf5PSeGvhhkja3WG3J4iL67YMo.png` box 512x512 at x752, object-fit contain
- **Feature 1** (y 2337, h 672 @1440; h 795 @390) image LEFT / text right
  - h2: "Summarized ticket trends, zero manual effort"
  - p (body, 18 words): starts "Summaries highlight recurring themes across tickets,…"
  - p: "Book a demo"
  - img `LUS5wlXrRoHsPbxmRVmkIFCbFEM.png` box 512x512 at x176, object-fit contain
- **Feature 1** (y 3009, h 672 @1440; h 728 @390) text LEFT / image right
  - h2: "Segment users and discover key issues instantly"
  - p (body, 25 words): starts "Use custom filters to track specific…"
  - img `Anb0KYlydsovepxrpF5P1UX0.png` box 512x512 at x752, object-fit contain
- **Feature 1** (y 3681, h 672 @1440; h 798 @390) image LEFT / text right
  - h2: "Uncover sentiment in every customer interaction"
  - p (body, 32 words): starts "Quickly identify whether customer sentiment is…"
  - img `QRLCkks2NazFmhzOsVjN9JNE.png` box 512x512 at x176, object-fit contain
- **Feature 1** (y 4353, h 672 @1440; h 728 @390) text LEFT / image right
  - h2: "Let customer words drive ticket prioritization"
  - p (body, 21 words): starts "Critical issues surface instantly by analyzing…"
  - img `Ch5kap0GfB7vpcnRuTb8jYPV86o.png` box 512x512 at x752, object-fit contain
- **Feature 1** (y 5025, h 970 @1440; h 987 @390) text LEFT / image right
  - p: "Siena AI agent"
  - h2: "Insights is just the beginning"
  - p (body, 20 words): starts "Take the next step with our…"
  - p: "Learn more"
  - img `OS7uIQBhEtXd5l7MXZ0qAcM0Lg.png` box 640x810 at x704, object-fit cover
- **CTA** (y 5995, h 991 @1440; h 1004 @390) 
  - h4: "Book a personalized demo now"
  - p: "Submit"
  - Buttons (xlg): "Book a demo" @y529 bg rgb(18, 32, 35); "Book a demo" @y2814 bg rgb(18, 32, 35); "Learn more" @y5642 bg rgb(18, 32, 35)
  - Button hrefs: "Book a demo" → ./customer-feedback-analytics-software#book-a-demo; "Book a demo" → ./customer-feedback-analytics-software#book-a-demo; "Learn more" → ../

## R2. Per-route content — Conversation details (T3)

Document heights at 390: Thrive 22122, Prose 17992, Spanx 16131. Legal at 390: terms 31675, privacy 22409.

Body prose is NOT reproduced: use placeholder paragraphs of the listed word counts. Headings, chapter labels, FAQ questions, dates and names are exact.

### /conversations/thrive-causemetics-ai-customer-service-automation

- Document height: 1440 = 13224px
- Kicker: link "Conversations" (→ /conversations) + `<time>` "Jul 8, 2026"
- H1 (4 lines @1440): "Brendan Gardner-Young of Thrive Causemetics on AI, empathy, and automating half of support"
- Guest line: "Brendan Gardner-Young · COO & CTO · Thrive Causemetics" (first span = name, 500 weight, 80% ink; rest 400)
- Video: YouTube `https://www.youtube.com/embed/8SEXP6zopwo` (embed params `?autoplay=0&mute=1&controls=1&rel=0`), 800x450 at y=584
- Summary: 3 paragraphs, words [61, 74, 64]; links: "Brendan Gardner-Young" → https://www.linkedin.com/in/brendangy/
- Key takeaways: 6 bullets, words [21, 20, 28, 25, 23, 25]
- Chapters (11 links, each `<a>` to `#chapter-N-<slug>` of the transcript h2):
  - 0:00 · “We answered every ticket ourselves”: the mission behind Thrive’s CX
  - 1:21 · Partners, not vendors: how Thrive picks its technology
  - 5:30 · The problem before Siena: the same answer, every time, at volume
  - 6:48 · Two criteria and the moment it clicked
  - 9:04 · Using AI vs. being changed by AI
  - 11:39 · Siena Intelligence as an early-warning system
  - 14:04 · AI-native partners and the real cost of a fragmented stack
  - 17:56 · Should CTOs own CX?
  - 19:20 · Learning AI is like learning to paint
  - 23:58 · The metrics behind 50% automation
  - 26:34 · AI-native or add-on: advice for brands on the fence
- Full transcript: 11 chapter h2s, 84 paragraphs, 6111 words total. Per chapter (paragraphs / speaker turns / words):
  - "“We answered every ticket ourselves”: the mission behind Thrive’s CX" — 5 p / 3 turns / 293 w
  - "Partners, not vendors: how Thrive picks its technology" — 12 p / 8 turns / 904 w
  - "The problem before Siena: the same answer, every time, at volume" — 4 p / 2 turns / 303 w
  - "Two criteria and the moment it clicked" — 6 p / 4 turns / 496 w
  - "Using AI vs. being changed by AI" — 7 p / 4 turns / 526 w
  - "Siena Intelligence as an early-warning system" — 8 p / 6 turns / 522 w
  - "AI-native partners and the real cost of a fragmented stack" — 11 p / 6 turns / 882 w
  - "Should CTOs own CX?" — 4 p / 4 turns / 246 w
  - "Learning AI is like learning to paint" — 15 p / 8 turns / 1137 w
  - "The metrics behind 50% automation" — 7 p / 4 turns / 541 w
  - "AI-native or add-on: advice for brands on the fence" — 5 p / 4 turns / 261 w
  - Speakers (bold label + timestamp link): Brendan, Lisa
- FAQ: 5 Q&As:
  - "Why did Thrive Causemetics move from Zendesk macros to an AI agent?" — answer 37 words
  - "What metrics does Thrive use to evaluate its AI agents?" — answer 24 words
  - "What does Thrive look for when choosing AI vendors?" — answer 43 words
  - "What is Siena Intelligence used for at Thrive Causemetics?" — answer 42 words
  - "How much of its customer support does Thrive Causemetics automate with AI?" — answer 35 words

### /conversations/prose-ai-customer-service-automation

- Document height: 1440 = 10833px
- Kicker: link "Conversations" (→ /conversations) + `<time>` "Jul 6, 2026"
- H1 (2 lines @1440): "Prose's CX Manager on Turning AI into a CX Analyst"
- Guest line: "Jessica Weiss · CX Manager · Prose" (first span = name, 500 weight, 80% ink; rest 400)
- Video: YouTube `https://www.youtube.com/embed/BgO6VVwRznA` (embed params `?autoplay=0&mute=1&controls=1&rel=0`), 800x450 at y=456
- Summary: 3 paragraphs, words [58, 79, 81]; links: "Jessica" → https://www.linkedin.com/in/jessica-weiss-2500a6161/, "AI-native platform over a help-desk add-" → ../blog/dedicated-ai-vs-help-desk-ai-add-ons
- Key takeaways: 6 bullets, words [29, 34, 29, 21, 26, 33]
- Chapters (12 links, each `<a>` to `#chapter-N-<slug>` of the transcript h2):
  - 0:00 · Why personalized beauty makes CX harder
  - 1:42 · What support looked like before Siena
  - 2:44 · Reducing noise, and why the custom integration was non-negotiable
  - 4:43 · Does emotional, identity-driven beauty raise the bar for AI?
  - 5:50 · Tiering AI: simple questions to Siena, nuance and troubleshooting to agents
  - 7:24 · What the beauty industry gets wrong about CX and AI
  - 8:32 · How buying hair care online will change
  - 9:26 · Surfacing insights in minutes, and catching problems before they surface
  - 12:14 · Turning CX into a proactive, insight-driven function
  - 13:34 · Is CX still treated as a cost center?
  - 14:10 · How the team reacted to adopting AI, and the skills that matter now
  - 17:43 · The roadmap ahead, and advice for brands choosing AI-native vs. add-on
- Full transcript: 12 chapter h2s, 46 paragraphs, 4414 words total. Per chapter (paragraphs / speaker turns / words):
  - "Why personalized beauty makes CX harder" — 4 p / 4 turns / 314 w
  - "What support looked like before Siena" — 1 p / 1 turns / 217 w
  - "Reducing noise, and why the custom integration was non-negotiable" — 4 p / 4 turns / 407 w
  - "Does emotional, identity-driven beauty raise the bar for AI?" — 2 p / 2 turns / 235 w
  - "Tiering AI: simple questions to Siena, nuance and troubleshooting to agents" — 4 p / 4 turns / 308 w
  - "What the beauty industry gets wrong about CX and AI" — 2 p / 2 turns / 243 w
  - "How buying hair care online will change" — 2 p / 2 turns / 203 w
  - "Surfacing insights in minutes, and catching problems before they surface" — 5 p / 5 turns / 556 w
  - "Turning CX into a proactive, insight-driven function" — 4 p / 4 turns / 277 w
  - "Is CX still treated as a cost center?" — 2 p / 2 turns / 163 w
  - "How the team reacted to adopting AI, and the skills that matter now" — 8 p / 8 turns / 759 w
  - "The roadmap ahead, and advice for brands choosing AI-native vs. add-on" — 8 p / 8 turns / 732 w
  - Speakers (bold label + timestamp link): Jessica, Lisa
- FAQ: 5 Q&As:
  - "What’s Prose’s advice for brands choosing between an AI-native platform and a help-desk AI add-on?" — answer 32 words
  - "Why did Prose need a custom AI integration instead of an off-the-shelf tool?" — answer 52 words
  - "How does Prose split work between Siena and human agents?" — answer 34 words
  - "What happened when Prose had a subscription-cancellation bug?" — answer 35 words
  - "How does Prose use Ask Siena beyond ticket automation?" — answer 47 words

### /conversations/spanx-kylah-field-real-work-ai-customer-experience

- Document height: 1440 = 9694px
- Kicker: link "Conversations" (→ /conversations) + `<time>` "Aug 13, 2026"
- H1 (3 lines @1440): "Kylah Field on AI Customer Experience: Why It Takes Real Work, Not a Quick Fix"
- Guest line: "Kylah Field · VP of Global Customer Experience and Consumer Insights · Spanx" (first span = name, 500 weight, 80% ink; rest 400)
- Video: YouTube `https://www.youtube.com/embed/2aXY6SKJQvA` (embed params `?autoplay=0&mute=1&controls=1&rel=0`), 800x450 at y=520
- Summary: 3 paragraphs, words [54, 88, 110]; links: "Kylah Field" → https://www.linkedin.com/in/kylah-field-210540a2/
- Key takeaways: 6 bullets, words [30, 34, 31, 23, 21, 17]
- Chapters (8 links, each `<a>` to `#chapter-N-<slug>` of the transcript h2):
  - 0:02 · Meet Kylah Field: From Cost Center to Business Driver
  - 2:15 · Why Every AI Agent Needs a Dedicated Owner
  - 3:33 · The Business Case: Personalization at Scale Without Tripling the Team
  - 5:27 · Choosing a Vendor: Why Brand Voice Won
  - 7:10 · The Surprise: AI Raised the Bar for Human Agents
  - 8:58 · When Customers Ask for Their AI Agent by Name
  - 12:11 · From Inbox to Insights: How AI Freed the Team
  - 15:13 · Proving Revenue Impact and Advice for Getting Started
- Full transcript: 8 chapter h2s, 49 paragraphs, 3797 words total. Per chapter (paragraphs / speaker turns / words):
  - "Meet Kylah Field: From Cost Center to Business Driver" — 6 p / 3 turns / 362 w
  - "Why Every AI Agent Needs a Dedicated Owner" — 3 p / 2 turns / 230 w
  - "The Business Case: Personalization at Scale Without Tripling the Team" — 4 p / 4 turns / 355 w
  - "Choosing a Vendor: Why Brand Voice Won" — 4 p / 2 turns / 314 w
  - "The Surprise: AI Raised the Bar for Human Agents" — 3 p / 2 turns / 303 w
  - "When Customers Ask for Their AI Agent by Name" — 8 p / 8 turns / 527 w
  - "From Inbox to Insights: How AI Freed the Team" — 6 p / 4 turns / 566 w
  - "Proving Revenue Impact and Advice for Getting Started" — 15 p / 11 turns / 1140 w
  - Speakers (bold label + timestamp link): Kylah, Lisa
- FAQ: 5 Q&As:
  - "Why did Spanx choose an AI vendor based on brand voice instead of technology?" — answer 48 words
  - "Does AI customer experience replace human agents?" — answer 44 words
  - "What’s the biggest mistake companies make when adopting AI for customer experience?" — answer 43 words
  - "How do customers react to AI customer service agents?" — answer 50 words
  - "How much of Spanx’s customer service does Siena automate?" — answer 45 words

## R3. Per-route content — Legal (T4/T5)

Section outline in DOM order: [heading tag] "exact heading text" — paragraph count, total words (incl. nested list paragraphs), lists with item counts. Use placeholder legal text of matching length; numbering prefixes (e.g. "3.1.") start each numbered paragraph in the source.

### /terms-of-service

- Document height 1440 = 17630px; content rich-text block 1120x16725 at y=391
  - [intro] "(intro)" — 5 p, 402 w
  - [ol>li>h2 (auto-numbered)] "THE PLATFORM" — 1 p, 40 w
  - [ol>li>h2 (auto-numbered)] "AI GOVERNANCE AND USAGE OF THE PLATFORM" — 6 p, 450 w
  - [h2] "3. FEES" — 7 p, 487 w
  - [h2] "4. ORDER FORMS" — 4 p, 176 w
  - [h2] "5. INTELLECTUAL PROPERTY RIGHTS" — 3 p, 226 w; lists ul(6) (110 w in items)
  - [h2] "6. USER CONTENT" — 5 p, 514 w; lists ul(6) (128 w in items)
  - [h2] "7. USER CONDUCT" — 2 p, 117 w; lists ul(12) (295 w in items)
  - [h2] "8. INDEMNIFICATION" — 5 p, 463 w
  - [h2] "9. DISCLAIMER" — 1 p, 96 w
  - [ol>li>h2 (auto-numbered)] "CONFIDENTIALITY" — 5 p, 293 w
  - [ol>li>h2 (auto-numbered)] "WARRANTY" — 2 p, 259 w
  - [ol>li>h2 (auto-numbered)] "LIMITATION OF LIABILITY" — 3 p, 273 w
  - [ol>li>h2 (auto-numbered)] "EXTERNAL SITES" — 1 p, 92 w
  - [ol>li>h2 (auto-numbered)] "SUSPENSION OR TERMINATION" — 1 p, 160 w
  - [ol>li>h2 (auto-numbered)] "ASSIGNMENT" — 1 p, 67 w
  - [ol>li>h2 (auto-numbered)] "PERSONAL DATA" — 2 p, 108 w
  - [ol>li>h2 (auto-numbered)] "SEVERABILITY AND ENFORCEMENT" — 2 p, 76 w
  - [ol>li>h2 (auto-numbered)] "GOVERNING LAW AND JURISDICTION" — 4 p, 253 w
  - [h2] "Data Processing Agreement" — 2 p, 83 w
  - [h3] "Whereas:" — 0 p, 0 w; lists ol(3) (61 w in items)
  - [h3] "The parties have agreed as follows:" — 0 p, 253 w; lists ol(6) (1880 w in items)
  - [h3] "APPENDIX 2" — 2 p, 51 w
  - [h4] "1. General organizational measures" — 0 p, 0 w; lists ol(2) (81 w in items)
  - [h4] "2. Training and awareness" — 0 p, 0 w; lists ol(1) (39 w in items)
  - [h4] "3. Physical and environmental security" — 0 p, 0 w; lists ol(3) (82 w in items)
  - [h4] "4. Access control" — 0 p, 0 w; lists ol(4) (320 w in items)
  - [h4] "5. Asset and operations management" — 0 p, 0 w; lists ol(3) (135 w in items)
  - [h4] "6. Incident management" — 0 p, 0 w; lists ol(3) (165 w in items)
  - [h3] "APPENDIX 4" — 0 p, 0 w
  - [h3] "US Data Protection Laws Addendum" — 8 p, 87 w; lists ol(9) ol(4) (1074 w in items)

### /privacy-policy

- Document height 1440 = 13958px; content rich-text block 1120x13044 at y=399
  - [intro] "(intro)" — 2 p, 116 w
  - [h2] "1. Scope of this policy" — 1 p, 5 w; lists ul(6) (165 w in items)
  - [h3] "Who we are and whose data we process:" — 5 p, 237 w; lists ol(7) (62 w in items)
  - [h2] "2. The information we collect" — 16 p, 989 w; lists ol(1) ul(6) ul(5) ul(3) ol(1) ol(1) ol(1) ol(1) (234 w in items)
  - [h2] "3. How we use your information" — 2 p, 79 w; lists ul(8) (127 w in items)
  - [h3] "Aggregate/De-identified information:" — 5 p, 180 w; lists ol(1) ul(7) ol(1) ul(1) ol(1) ul(1) ol(2) ul(3) ol(1) ul(3) (441 w in items)
  - [h2] "5. Online analytics and advertising" — 0 p, 0 w
  - [h3] "ANALYTICS" — 2 p, 118 w
  - [h3] "ONLINE ADVERTISING" — 2 p, 228 w
  - [h3] "DO NOT TRACK ("DNT")" — 1 p, 60 w
  - [h2] "6. Disclosure of Information" — 1 p, 9 w
  - [h3] "Vendors and service providers" — 1 p, 47 w
  - [h3] "Affiliates and subsidiaries" — 1 p, 20 w
  - [h3] "Your company" — 1 p, 42 w
  - [h3] "Protection of Siena and others" — 1 p, 99 w
  - [h3] "Business transactions" — 1 p, 76 w
  - [h3] "With your consent or at your direction" — 4 p, 131 w
  - [h2] "7. Retention of your information" — 2 p, 38 w; lists ol(1) ul(3) ol(1) ul(1) ol(1) ul(3) ol(1) ul(2) ol(1) ul(2) (417 w in items)
  - [h2] "8. Your rights and your choices" — 1 p, 25 w
  - [h3] "Your legal rights" — 9 p, 532 w; lists ul(1) ul(1) ul(1) ul(1) ul(1) ul(1) (50 w in items)
  - [h3] "Marketing communications" — 2 p, 143 w
  - [h2] "9. Third party links and features" — 1 p, 67 w
  - [h2] "10. International users" — 1 p, 83 w
  - [h2] "11. How we protect your information" — 1 p, 52 w
  - [h2] "12. Privacy information for California users" — 0 p, 0 w
  - [h3] "Additional information for California residents" — 1 p, 121 w
  - [h3] "Do not sell rights." — 1 p, 49 w
  - [h3] "Your California privacy rights" — 13 p, 545 w; lists ul(2) ul(4) (59 w in items)
  - [h2] "13. Changes to our policy" — 1 p, 76 w
  - [h2] "14. Contact information" — 2 p, 44 w
  - [h2] "15. EU representative and DPO" — 2 p, 62 w
  - (terms, after the last section) p "Previous terms of services" + 3 link paragraphs (see T4.2).

Privacy note: section "4. Legal bases for use of your information" is a bold `<p><strong>` styled like H2 (Instrument Sans 700 36/43.2) rather than an `<h2>`, so it is folded into the preceding section above; it is followed by `ol > li > h3 > strong` labels ("Signing up and using the Services:" etc.) in Tiempos 700.

### R1 notes (measured per-route deltas)
- Hero padding (1440 / 390): `/insights` `160px 64px 26px` / `96px 24px 10px`; `sentiment-analysis-online` `160px 64px 34px` / `56px 24px 35px`; `voice-of-customer-software` `160px 64px 28px` / `56px 24px 29px`; `customer-feedback-analytics-software` `160px 64px 16px` / `56px 24px 6px`. Hero heights 658 / 694 / 622 / 610 (1440) and 859 / 945 / 883 / 838 (390). Simplest faithful build: per-route `pb` prop.
- `/insights` uses 80%-ink (`rgba(18,32,35,0.8)`) hero subtitle + feature body copy; the three subpages use 100% ink `#122023` for the same roles.
- `/insights` H2 "Sentiment analysis made simple" has a hard line break after "analysis".
- "See your sentimant data in your stack" — the typo "sentimant" is in the live copy.
- Hero/feature button hrefs: `/insights` → `./` (homepage); subpages → `#book-a-demo` on the same page (the demo CTA section). "Learn more" → `../` (homepage) on all.
- 390 feature rows: image (342x342) always first, then text; promo row: text first, then 342x506 card.

---

## A. Assets (downloaded for these routes)

All framerusercontent originals (no query params), saved with their hash filenames in `/Users/riyaghosh/V3/siena/public/assets/` (served as `/assets/<file>`):

| File | Natural | Used on | Role |
|---|---|---|---|
| `VKHdNmxFVDSgMwwUTZNi0WmJ4k.svg` | 606x432 (vector) | /insights | hero illustration (606x434 contain) |
| `uaM0A3GiLu0NROIvudKMalml2b4.png` | 1360x878 | /insights/sentiment-analysis-online | hero illustration |
| `MOanKo50R049QJz0dIR4rVeJzSU.png` | 1600x1062 | voice-of-customer-software, customer-feedback-analytics-software | hero illustration |
| `RcdtrxM5jv83GuYPt3fegafLYE.svg` | 150x24 | all insights | logo row: Instacart |
| `r2W6as2bHWbtrfk5iuHQjFsp1R8.svg` | 106x31 | all insights | logo row: HubSpot |
| `qvKxkoZLyMmJdvAE9tNTPqFq5hQ.svg` | 108x32 | all insights | logo row: Upwork |
| `3DYeO3vzL0aossMXlU9JfDBK8f0.svg` | 128x32 | all insights | logo row: SmugMug |
| `HfktNRmsAoNia3x1j5mJvxcdL0Q.svg` | 800x357 (vector) | /insights | feature row 1 |
| `det6EhIvWp8r7Ya2JlpMeyK5R8.png` | 1600x958 | /insights, voice-of-customer | feature (Slack alert) |
| `RUoFYDLGaRP5h1vQu2qaSeuBAjw.png` | 1015x670 | /insights | feature (chat with data) |
| `7c9xveioz1zbxWxFVO2t6p1XhY.png` | 1600x984 | /insights, sentiment | feature (sentiment breakdown) |
| `oRcxQbBbFEDD9rKRlVasJbMjX0.png` | 1600x880 | /insights | feature (ticket cost) |
| `Ch5kap0GfB7vpcnRuTb8jYPV86o.png` | 1600x984 | sentiment, voice-of-customer, feedback-analytics | feature (flow diagram) |
| `CZf5b1hc6bqRL4RdIWcY4DwOHmw.png` | 1600x878 | sentiment | feature (weekly digest) |
| `Qf5PSeGvhhkja3WG3J4iL67YMo.png` | 1600x714 | voice-of-customer, feedback-analytics | feature (categories) |
| `3p6ErMGR3qwEHMsMXGFXDDzSY.png` | 982x670 | voice-of-customer | feature (chat) |
| `lV97h3YK7dQbjW2cbAIBC01A.png` | 1600x984 | feedback-analytics | feature (AI analytics flow) |
| `LUS5wlXrRoHsPbxmRVmkIFCbFEM.png` | 1600x816 | feedback-analytics | feature (summaries) |
| `Anb0KYlydsovepxrpF5P1UX0.png` | 1600x916 | feedback-analytics | feature (segments) |
| `QRLCkks2NazFmhzOsVjN9JNE.png` | 1600x984 | feedback-analytics | feature (sentiment) |
| `PGTIAdOBFUHqD4uWC2d28jqi9I.png` | 800x800 | insights (3 pages) | testimonial avatar (Upwork badge, 50x50 circle) |
| `uXunsm8tlCYJ75EHjJsuPKBi8Ec.jpg` | 1280x720 | /conversations | card 1 (Spanx) |
| `TdidUtYfcNyYSLLThuETu1itgJI.jpg` | 640x360 | /conversations | card 2 (Thrive) |
| `kWqyVruHOxgHlNpA8KWxTfUyFo.jpg` | 640x360 | /conversations | card 3 (Prose) |

Already present in `public/assets/` and reused: `OS7uIQBhEtXd5l7MXZ0qAcM0Lg.png` (promo card bg), `D3TQ38q4HpOxmxHoD1u1AW40NI.png` (customer avatar), `5VTp1YGCJLYo9Grib0Ouvyooeag.webp` (demo-form + newsletter CTA bg), `HB4OWZgksTQCHf8uTWf7S6EYSlE.webp` (footer SOC badge), nav mega-menu images.

Inline SVGs exported to `/Users/riyaghosh/V3/siena/public/svg/`:
- `insights-integration-salesforce.svg`, `insights-integration-zendesk.svg`, `insights-integration-qualtrics.svg`, `insights-integration-looker.svg`, `insights-integration-discord.svg`, `insights-integration-tableau.svg`, `insights-integration-typeform.svg` — `<use>` references resolved; each root has `style="width:100%;height:100%"` + `preserveAspectRatio="none"`, so size the wrapper to the measured box (T1.5).
- `insights-select-chevron.svg` (16x16, from `framerusercontent.com/assets/PcC3vHrgoBRrBQoYZSOIpsOwp4.svg`) — select up/down icon.
- Reused: `siena-avatar-glyph.svg` (Siena "S" 12x13), nav/footer SVGs.

Videos: none self-hosted. Conversation pages embed YouTube: Thrive `8SEXP6zopwo`, Prose `BgO6VVwRznA`, Spanx `2aXY6SKJQvA`. (The nav mega-menu also lazy-loads `https://4positiveimpact.b-cdn.net/Abstract%20Landscape%20Moving%20Shapes.mp4` — existing Nav, unchanged.)

Fonts: all already in `public/fonts/`; add `@font-face { font-family: 'Font Awesome 6 Pro Regular'; src: url('/fonts/p7AhwSewV29YUCb3gfGr5xbw8wM.woff2') format('woff2'); }` if using the legal calendar glyph U+F133 (or use an inline 14x16 calendar SVG).

## Not measurable / caveats
- YouTube player chrome is third-party (inside the cross-origin iframe) and not styled by the site.
- Conversation page dates (Jul 8 / Jul 6 / Aug 13, 2026) come from the CMS as rendered today.
- Tablet breakpoint (810–1199) was not measured for these routes.
