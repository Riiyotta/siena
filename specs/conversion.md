Source: https://www.siena.cx/

# Siena conversion pages — Clone Spec (pricing, book-a-demo, compare x2, AI-native vs add-ons)

Measured live 2026-10-22 with headless Chromium (Playwright via Node scripts, not the shared MCP browser) at **1440x900** and **390x844**. Global tokens, fonts, breakpoints and the appear-animation primitive are in `/CLONE_SPEC.md §0` and are **not repeated** here. Component names refer to the existing homepage build (`src/components/*`).

Reference material (all under `recon/conversion/`):
- Full-page screenshots: `pricing-1440.png`, `pricing-390.png`, `book-a-demo-1440.png`, `book-a-demo-390.png`, `gorgias-1440.png`, `gorgias-390.png`, `kustomer-1440.png`, `kustomer-390.png`, `addons-1440.png`, `addons-390.png` (CookieYes banner is visible in these; ignore it). Chunked crops in `crops/`.
- **Full-page screenshots do NOT show the sticky scroll-area cards correctly** (Framer swaps them on scroll). Use the per-block viewport shots instead: `gorgias-sticky-1440-{1..4}.png`, `kustomer-sticky-1440-{1..4}.png`, `addons-sticky-1440-{1..3}.png`.
- Form state shots: `pricing-select-open.png`, `pricing-form-page2.png`, `pricing-form-page2-social.png`, `pricing-form-empty-next.png`, `pricing-p1-dd1.png`, `pricing-p2-dd{1,2}.png`, `book-a-demo-*` equivalents. FAQ: `gorgias-faq-1440.png`.
- Raw measurement JSON: `<slug>-<w>.json` (every text node + styled box), `ex-*.json` (Framer `::after` borders, icon codepoints, image positioning), `sticky-*.json`, `faq-*.json`, `cmp-*.json` (compare table HTML/CSS, ticker), `slides-*.json`, `probe-*.json`.

## Conventions / cross-page findings

- **Framer borders are drawn with `::after` on `[data-border="true"]`** (not on the element itself). Values below come from the pseudo-element. Implement as a real `border` or an inset `::after` — visually identical.
- Dark button sizes: `md` = padding 16px, radius 12px, label Instrument Sans 500 16/16 white (e.g. nav "Book a demo" 128x48); `xlg` = padding 18px 24px, radius 16px, label Instrument Sans 600 18/21.6 white (157x58 "Book a demo"). Hover → rainbow gradient, instant (same as homepage `BookDemoButton`).
- `Secondary / md` button: padding 16px, radius 12px, bg `#FFFFFF`, border 1px solid `#A7A092` (rgb 167,160,146) — same as homepage "Read full story".
- Body paragraphs marked "opacity .8"/".82" are wrapped in a container with that opacity (text color itself `#122023`).
- Font Awesome glyphs: given as codepoints; fonts already in `public/fonts/` (`hhrqHf9RbUQAYrvhsytTcmYL61I.woff2` = FA6 Sharp Light, `PXm4Cf2xmAxAUI2XyqpPI37qg.woff2` = FA6 Brands).
- **No new fonts needed.** All fonts requested on these pages already exist in `public/fonts/`, except Google `Inter` `fonts.gstatic.com/s/inter/v20/UcCo3FwrK3iLTcviYwYZ8UA3.woff2` (Inter 400, used ONLY by the testimonial counter "1 / 11" — homepage already uses Inter 400 for the same counter; not downloaded, flag only). One text in a compare mock ("Add to cart") requests `"Feature Deck"` (not loaded on the live site, renders in the fallback) — use Feature Deck Web Regular.
- Scroll reveals: none on any of these pages beyond the hero appear primitive and the sticky chat-mock bubble entrances (verified: no other elements start with opacity < 1 or a transform offset).

---
## 1. /pricing  (https://www.siena.cx/pricing)

**Template:** "Lead-gen landing" — shared with /book-a-demo (§2). Document height 1440: **2925px**; 390: **4048px**. Page root bg `#FFFFFF`, flex column, overflow clip.

**Nav: DIFFERENT from homepage.** No announcement bar, no nav pill, no links, no CTA, no mobile menu. Only a logo link. **Footer: DIFFERENT** — no dark footer; a minimal legal row (§1.6). No load animations at all on this page (appear config is empty; nothing animates on scroll).

Section stack (1440): Header logo (overlay) · Hero 0–708 · "How does pricing work?" 708–1247 · Testimonials 1247–2067 · Enterprise 2067–2827 · Legal row 2827–2925.

### 1.1 Header logo — NEW (tiny)
- `<a href="/">` absolutely positioned `top:0; left:0; right:0` (1440x82), z 5, flex row center, padding **24px 40px** (390: padding 24px). Inner row max-width **1062px** (x 189–1251 at 1440), justify flex-start.
- Logo = the same Siena wordmark as the homepage nav (`public/svg/nav-logo-siena.svg`, IDENTICAL paths) rendered **122x34** (svg 121x32 at top 1px). Not fixed — scrolls away with the page.

### 1.2 Hero — NEW
- Section "Hero": 1440x708, bg `#F3F0EB`, padding **152px 96px 40px**, flex column center, gap 100px, overflow hidden, position relative.
- Decorative bg image (z 0): `public/assets/LhQ0hZskcxCtirPSSxXE4hUU0yo.webp` (1004x994 file), absolute **top:-191.6px; left:530.95px; right:0; bottom:0** → 909x900, `object-fit: cover`. Not animated. 390: `top:476.4px; left:-249.4px; right:0; bottom:0` → 639x633.
- Content row: max-width **1062px** (x 189), flex **row**, justify center, align flex-start, **gap 64px**, z 1.
  - Left "Title" column: width 496 (max 640), flex column, align flex-start, **gap 48px**, overflow hidden.
    - Text group (gap **24px**):
      - H1 "Grow with one Agent of Record" — Feature Deck Web Light 300, **80px/80px, ls −0.8px**, `#122023`, left; 496x240 (3 lines: "Grow with one / Agent of / Record").
      - P "One platform for support, shopping, social and more. Tell us what you need and we’ll send pricing that fits." — Instrument Sans 500 **20px/28px ls −0.2px**, `#122023`, wrapper opacity **0.82**; 496x56.
    - Logo grid: `display:grid; grid-template-columns: repeat(3, 152px); gap: 80px 20px;` 496x147, rows 38/29. Each cell flex column center. Logos (`object-fit: contain`, rendered size):
      1. Comfrt `I79jHrog8xkJyLdp6KBEDj6Ywjk.png` 126x31 · 2. grüns `BYD0tOgABiRk8bVwCxbpUE5hDs.png` 101x38 · 3. Bombas `GtydJWMgnwv6wkRfNUoPlww2jh0.svg` 132x20 (object-fit cover)
      4. FIGS `f15R92EBkjPHx4ABojD1VWldk54.png` 132x29 · 5. create `vtOMWVl8Yp4AVppVcHxc4tGpNo.png` 132x28 · 6. SPANX `ipTDxCOrcnVCeET6yx6vSIolM.png` 132x26
  - Right: **Form card** (§1.2a), width 502 (max 640), z 1.

#### 1.2a Form card + form (static look-alike; must not submit)
- **Live embed:** native **Framer Form** (`FramerForms`, multi-step "Pages") whose submit is intercepted by **Chili Piper Concierge** (`siena.chilipiper.com/concierge-router/updated-dec2025-inbound_pricing_form?trigger=ThirdPartyForm`) — after a valid submit Chili Piper opens its scheduler in an iframe modal. HubSpot scripts on the page (`hs-banner`, `hsadspixel`) are tracking only, not the form. Hidden inputs: `FormId`, `currentURL`, and honeypots (`website, company, message, subject, title, description, feedback, notes, details, remarks, comments`, tabindex −1) — the clone needs none of these.
- Gradient frame: 502x516, padding **3px**, radius **18px**, overflow hidden, `background: linear-gradient(45deg, #F2E59A 0%, #FEC796 24.3243%, #FB5646 40.0901%, #827ACC 59.9099%, #2E79D8 77.4775%, #294FBA 100%)`.
  - Inner panel: 496x510, bg `#F3F0EB`, radius **14px**, padding **32px 40px**, flex column center, gap 32px.
  - `<form>` 416 wide, flex column, gap **6px**:
    - H2 "Get pricing" — **Feature Deck Web Regular 400, 52px/62.4px**, `#122023`; sits in a 416x94 box (has a transparent 1px bottom border; height includes 32px space) → first field top is **100px** below the H2 top.
    - "Pages" stack (gap 40px) → "Page 1" flex column, gap **12px** between fields (fields at y 293/361/429/497 → 56 tall + 12 gap), then **32px** to the button row.
- **Text field** (Full name / Work email / Brand website):
  - Wrapper 416x56, bg `#FFFFFF`, radius **16px**, border drawn as `box-shadow: inset 0 0 0 1px #CDBCA0`.
  - `<input>` absolutely fills it; padding **26px 16px 8px**; Instrument Sans 400 **16px/20px**, color `#122023`, caret `#122023`, transparent bg, no outline.
  - **Floating label** (span, left 16px): default `transform: translateY(18px)` (vertically centered), font-size **16px**, line-height 20px, color **`#57524A`**; the trailing `*` is part of the same text ("Full name*"). On **focus OR filled**: `translateY(9px)`, font-size **12px**, color **`#465153`**. `transition: transform .2s cubic-bezier(.4,0,.2,1), font-size .2s cubic-bezier(.4,0,.2,1), color .2s cubic-bezier(.4,0,.2,1)`.
  - **Focus ring:** wrapper shadow becomes `inset 0 0 0 1px #0099FF` (instant, no transition). Blur → back to `#CDBCA0` (label stays floated if filled). Hover: no change.
  - Types/autocomplete: fullName `text`/`name`; workEmail `email`/`email`; companyWebsite `text`/`url`. All required.
- **Multi-select dropdown** "What is your primary goal with Siena?*" (`<button type=button>`):
  - 416x56, bg `#FFFFFF`, radius 16, `inset 0 0 0 1px #CDBCA0`, padding **26px 44px 8px 16px**. Label behaves like the text-field label (16px centered → 12px floated). When open/floated a placeholder line "Select one or more…" (Instrument Sans 400 16/20, `#5A554B`) shows on the value line; when closed+empty the placeholder has opacity 0. Long label truncates with ellipsis on mobile ("What is your primary goal wit…").
  - Chevron: `public/svg/pricing-select-chevron.svg` 12x8 (`path M1 1.5 6 6.5l5-5`, stroke `#122023` 1.6, round), right 16px, vertically centered; when open the chevron points **up** (rotated 180°).
  - Open state: button ring `inset 0 0 0 1px #0099FF`. **Panel**: `position: fixed`, directly under the field (8px gap: field bottom 553 → panel top 559), width 416, bg `#FFFFFF`, radius **16px**, padding **8px**, flex column gap **2px**, `box-shadow: rgba(18,32,35,.15) 0 10px 30px 0, rgba(18,32,35,.08) 0 0 0 1px`, max-height = content (184px here), overflow auto, z 2147483000. Opens/closes **instantly** (no transition measured).
  - Option row (`<label>`): 400x40, flex row, gap **10px**, padding **11px 12px**, radius **10px**, Instrument Sans 400 **15px/18px** `#122023`; native checkbox 15x15, `accent-color: #122023`. Hover bg **`#F3F0EB`**.
  - Options: "Make my customer service more efficient" · "Drive more sales and increase conversion rates" · "Get insights from my conversations" · "Scale my social engagement and moderation".
  - Selected value line shows the selected option text(s) comma-joined (e.g. "Make my customer service more efficient").
- **Next step** button: `md` dark button 103x48 right-aligned in the form (x 1105), label "Next step". Hover rainbow (instant).
- **Validation (empty Next):** native browser validation bubble ("Please fill out this field." / for website "Please enter a valid website (e.g. example.com)"), focus jumps to the first invalid field (shows the blue focus ring). No custom inline error styling exists.
- **Page 2** (after Next; swap is **instant**, no slide/fade):
  - "Monthly average tickets*" single-select (same dropdown styling, radio-like single choice, value placeholder "Select one…"): `<3,000` · `3,000-10,000` · `10,000-20,000` · `20,000-30,000` · `Over 30,000`.
  - "Help desk*" single-select: Gorgias · Zendesk · Kustomer · Gladly · Intercom · Salesforce · Other.
  - Conditional (only if goal includes "Scale my social engagement and moderation"): "What do you use for social today?" multi-select, placeholder "Select any that apply…": Sprout Social · Hootsuite · Dash Social · Emplifi · Our helpdesk · The social platforms directly · Other.
  - "Where did you hear about us?*" `<textarea name="attribution">` 416x104, padding **30px 16px 10px**, `resize: none`, same wrapper styling/label behavior (label at top-left, not vertically centered).
  - Button row (right-aligned, gap ~17px): **Previous** (`Secondary / md`, 96x48, bg **`#F3F0EB`**, 1px `#A7A092` border, radius 12, label Instrument Sans 500 16/16 `#122023`; hover → bg `#122023`, label white) and **Get pricing** submit (122x46, padding **15px 20px**, radius **10px**, bg `#122023`, label Instrument Sans 500 16/16 **`#F4F5F5`**; hover → `linear-gradient(90deg, #F7DD93 0%, #FEC796 14.8649%, #FB5646 31.982%, #827ACC 53.6036%, #2E79D8 75.6757%, #294FBA 100%)`). Clone: `preventDefault` on submit.

### 1.3 "How does pricing work?" — NEW
- Section 1440x539, bg `#F3F0EB`, padding **80px 96px**, flex column center, **gap 72px**.
- Title (max-width 1062, gap 24, centered): eyebrow "What to expect" (eyebrow style, uppercase); H2 "How does pricing work?" (Feature Deck Web Light 64/64 ls −1.28, center, 606x64).
- Row: 1248 wide (max 1328), flex row, **gap 32px**; 3 columns each **395 wide (max 416)**, flex column, gap **16px**, padding-top **32px**, top border **1px solid rgba(0,0,0,0.2)** (Framer `::after`).
  - Icon: FA6 Sharp Light 24px/24px `#122023` — col 1 **U+F847**, col 2 **U+E3F1**, col 3 **U+F652**.
  - H3: **Feature Deck Web Regular 400 32px/38.4px** `#122023`.
  - Body: Tiempos Text Regular **18px/23.4px ls −0.18px**, wrapper opacity **0.8** (cols 1–2 color `#122023`, col 3 `#2A3639`).
  - Copy: "Platform fee" / "Access Siena’s core AI engine and unlimited sandbox for $750/month—reliable, high-quality automation." · "Automation Pack" / "Automate tickets at just $0.90 each—scale effortlessly while keeping costs in check." · "Support & Implementation" / "Expert onboarding plus dedicated Slack support—launch fast, hit goals, maximize ROI."
- **No pricing tiers, no monthly/annual toggle, no plan comparison table, no FAQ accordion exist on /pricing** (verified; pricing is gated behind the form).

### 1.4 Testimonials — VARIANT of homepage `Testimonials` (same 11 slides, same order/data as homepage §3, same slide transition & buttons)
Diffs:
- Section bg **`#F3F0EB`**, padding **56px 96px**, gap 40; **no title block** (no eyebrow/H2).
- Slider panel ("content"): max-width **1200**, padding **24px 16px**, gap 24, radius **24px**, `background: linear-gradient(180deg, #FFFFFF 0%, #FAF7F1 100%)`.
- Controls (prev / "1 / 11" / next) sit at the **top**, centered, 40px below panel top (as homepage).
- Slide row width **1104**, gap 40: text column **532**, image **532x532** radius 32 (homepage: 452). Quote/brand/name typography identical to homepage; role line color **`#787368`**, Instrument Sans 600 **12px/16.8px ls 0.6px** uppercase.
- Slide data = homepage `testimonials/data.js` exactly (11 slides; "Read full story" buttons on slides 4,5,7,8,9,10,11 with the same links; slide 1 has the play badge).

### 1.5 Enterprise-grade safety — NEW
- Section "Enterprise": 1440x760, bg **`#122023`**, padding **96px**, flex row center, overflow hidden.
- Stack (1070 wide, x 185), flex column, align flex-start, **gap 48px**:
  - Title (gap 24): H2 "Enterprise-grade safety" — Feature Deck Web Light **300** 64/64 ls −1.28 **`#FFFFFF`** left; P "Trusted by some of the fastest-growing ecommerce and retail companies, Siena meets the highest enterprise standards with guardrails and granular controls that keep every interaction on brand and on policy." — Instrument Sans 500 20/28 ls −0.2 `#FFFFFF`, max 584 wide (4 lines).
  - Cards row: flex row, **gap 24px**, 4 cards **250x304**, bg `#FFFFFF`, radius **24px**, padding **24px**; inner column gap **12px**, padding-bottom 24:
    - Icon FA6 Sharp Light **300** 24px `#122023`; H6 **Feature Deck Web Regular 24px/33.6px** `#122023`; body Tiempos 18/23.4 ls −0.18 `#2A3639`, wrapper opacity 0.8.
    - (U+F132) "AI & brand-safety guardrails" — "Brand voice, business rules, and human handoff keep every agent aligned with how you run CX."
    - (U+F023) "SSO, roles, audit logs" — "SAML SSO, granular permissions, and a full trail of every action your team and the agent take."
    - (U+F590) "SOC 2 Type II compliant" — "Your data and your customers' data handled to enterprise security and privacy standards."
    - (U+F590) "Dedicated support & SLA" — "A named success manager, hands-on onboarding, and priority response with an uptime SLA."
  - No hover states.

### 1.6 Legal row (page footer) — NEW
- 1440x97, bg `#F3F0EB`, padding **0 40px 40px**, flex row center; inner row max 1062 (x 189), links gap **20px**: "Privacy Policy" (`/privacy-policy`), "Terms of Service" (`/terms-of-service`) — Instrument Sans 400 **14px/15.4px**, color **rgba(18,32,35,0.8)**, no underline. Links sit 19px below the row top.

### 1.7 Mobile (390)
| Section | y | h | padding | gap |
|---|---|---|---|---|
| Hero | 0 | 1109 | 130px 24px 64px | 80 (column) |
| How pricing works | 1109 | 838 | 56px 24px | 40 |
| Testimonials | 1948 | 899 | 56px 0 | 32 |
| Enterprise | 2846 | 1104 | 56px 24px | — |
| Legal row | 3950 | 97 | 0 24px 40px | — |
- Header logo padding 24px; logo at x 24.
- Hero stacks: Title column 342 (gap 48) → form card. H1 **56px/56px ls −0.56px** (3 lines, 168 tall); P Instrument Sans 500 **16px/22.4px ls −0.16px**. Logo grid `repeat(3, 103.33px)`, **gap 24px 16px**, logos scaled (Comfrt 73x18, grüns 59x22, Bombas 83x13, FIGS 76x17, create 78x17, Spanx 82x16).
- Form card: frame 342 wide (padding 3, radius 18), inner padding **24px**, form 288 wide; H2 "Get pricing" **36px/43.2px**. Fields 288x56, same styles. Next step right-aligned.
- How-pricing columns stack (each 342 wide, padding-top 32, top border); H3 **28px/33.6px**; body Tiempos **14px/21px ls −0.14px**; title eyebrow 14/19.6, H2 48/48 ls −0.96 (2 lines).
- Testimonials: panel full-bleed 390 (no padding/gradient visible), homepage-mobile slide layout (image 320x320 → quote 19.2/24.96 → brand row).
- Enterprise: H2 stays **64px/64px** (2 lines), P 20/28 (6 lines); cards become `grid-template-columns: 163px 163px; gap: 16px`, each 163x288, padding **14px**, H6 24/33.6, body Tiempos **14px/21px ls −0.14**.

---

## 2. /book-a-demo  (https://www.siena.cx/book-a-demo)

**Template:** same "Lead-gen landing" as §1 — header logo, hero+form, testimonials, legal row. **No "How pricing works", no Enterprise section.** Document height 1440: **1751px**; 390: **2240px**. No load or scroll animations. Nav/footer: same as §1 (logo only + legal row; NOT the homepage Nav/Footer).

Live embed: Framer Form + **Chili Piper Concierge** router `updated-dec2025--inbound_router_demo-request` (`trigger=ThirdPartyForm`). Static clone.

### 2.1 Header logo — IDENTICAL to §1.1.

### 2.2 Hero — VARIANT of §1.2
- Section: same size/padding (1440x708, padding 152px 96px 40px, bg `#F3F0EB`) but the section itself is the flex **row** (gap 64, align flex-start) — layout result identical (Title x 189 w 496; form frame x 749 w 502).
- H1 "See how Siena can transform your brand" (80/80, 3 lines "See how Siena / can transform / your brand").
- P "We want to get to know you better! Our team is ready to guide you through how Siena can grow your brand." (opacity 0.82).
- Logo grid IDENTICAL (same 6 logos/sizes).
- Bg image: `public/assets/43GZFV0RCkyKlAJWzDPZW1Yls3s.webp` (1460x1214 file) — box `top:-118px; left:796.97px; right:-223px; bottom:-31px` (866x857), **`transform: rotate(-15deg)`** (matrix .9659,−.2588), `object-fit: contain`, z 0. 390: `top:-141px; left:-26px; right:-221px` (637x631), same −15° rotation.
- Form frame gradient angle **34deg** (pricing: 45deg), same stops.
- Form H2 **"Book your demo"** (52/62.4). Fields, dropdowns, options, validation, page 2 — IDENTICAL to §1.2a, except the page-2 submit label is **"Book demo"** (124x46).

### 2.3 Testimonials — VARIANT of homepage `Testimonials`
- Section "Testimonials": bg `#F3F0EB`, padding **80px 96px 67px**, gap **48px**.
- Title block (max 1062, gap 24, centered): eyebrow **"real impact. real savings."** (rendered uppercase "REAL IMPACT. REAL SAVINGS.", eyebrow style); H2 **"People are talking"** (Feature Deck Web Light 64/64 ls −1.28, center, 447 wide, 1 line).
- Panel: max-width **1062**, padding 24px 16px, radius 24, `linear-gradient(180deg, #FFFFFF 0%, #F3F0EB 100%)`. Controls at top. Slide row **966** wide: text column 463, image **463x463** radius 32.
- Same 11 slides as homepage.

### 2.4 Legal row — IDENTICAL to §1.6 (at y 1654).

### 2.5 Mobile (390)
- Hero 0–1109 (padding 130px 24px 64px, column, **gap 64px**), H1 56/56 (3 lines), P 16/22.4; logo grid as §1.7; form frame 342 (inner padding 24), H2 "Book your demo" 36/43.2.
- Testimonials 1109–2142: padding **56px 24px 67px**, gap 40; eyebrow 14/19.6; H2 48/48 (1 line); panel 342 wide; slide column 278 wide (image 278-ish square, then quote, then brand row: logo 140x64 + name/role column at x 212).
- Legal row at 2143 (padding 0 24px 40px).

---
## 3. Compare template — /compare/siena-ai-vs-gorgias-ai and /compare/siena-ai-vs-kustomer-ai

Both pages use one template; §3.1–3.12 spec it (measured on Gorgias unless noted), §4/§5 give per-page content and the few layout diffs. Document height 1440: Gorgias **11438**, Kustomer **11685**; 390: Gorgias **14039**, Kustomer **14889**.

**Nav: IDENTICAL to homepage `Nav`** (announcement bar + pill + mega-menus + mobile nav, same scroll-state behavior). Links resolve relative (`../book-a-demo` etc.). **Footer: IDENTICAL to homepage `Footer`.**

Section stack (Gorgias 1440): Hero 0–900 · fade strip 900–1011 · Testimonials 1011–1915 · Comparison table 1915–3498 · "intelligence" title 3498–3738 · Sticky scroll area 3738–7444 · Metrics 7444–8296 · Integrations 8296–9096 · FAQ 9096–10249 · Main CTA 10249–11004 · Footer 11004–11438.

### 3.1 Hero — VARIANT of homepage `Hero`
Same section box (1440x900, bg `#F3F0EB`, flex column center, gap 10, overflow hidden), same text block (max 1062, gap 40 between text group and button; text group gap 24), same appear animation (H1 delay 0.2s ease `cubic-bezier(0,.91,.14,.85)`; subtitle 0.3s and CTA 0.4s ease `cubic-bezier(0,.91,.78,1)`; all 0.7s, from opacity 0.001 / y +200). Diffs:
- **Eyebrow added** above the H1: e.g. "Siena vs Gorgias" — eyebrow style (Instrument Sans 600 16/22.4 ls 1.7 uppercase `#122023`, center), part of the text group (gap 24 to H1). Eyebrow is not in the appear config (static).
- H1 80/80 ls −0.8, **810px wide, 3 lines** (e.g. "Save months before / hitting Gorgias AI / automation walls"). Text block top y 212.
- Subtitle Instrument Sans 500 20/28 ls −0.2, max 485, **3 lines** (84 tall).
- **Decorative images differ:**
  - Left "Siena 2": `public/assets/qnJ39G2jMJsaeN5ykV5ZIyZ9Fw.webp` (1253x800 natural) — `top:228px; left:-425px; width:800px; height:862px` (max-width 800), `object-fit: contain`.
  - Right "image": `public/assets/OJVl4cBpDuZoUt7B55UQZA7rfQ.webp` (800x507) — `top:153px; left:1008px; width:800px; height:728px`, `object-fit: contain` (overflows right edge; clipped).
- **Single logo ticker** (NOT the homepage two-row ticker): `<section>` absolute `top:800px; left:0; right:0; height:100px`, z 1, overflow hidden, `mask-image: linear-gradient(to right, transparent 0%, #000 12.5%, #000 87.5%, transparent 100%)`. `<ul>` flex row, align center, **gap 96px**, list duplicated ×2 for the loop. Moves **left at 45 px/s** (rAF: −44.9 px/s), linear, infinite, no hover pause.
  - 28 logos, in order (file in `public/svg/`, rendered WxH): 01 `ticker-logo-01.svg` 176x32 · 02 `compare-ticker-02-figs.svg` 92x32 (box; svg 91x26 centered — it's a CSS bg image `background-size:100% 100%`) · 03 `ticker-logo-03.svg` 209x32 (madhappy; CSS bg on live) · 04 167x32 · 05 119x38 · 06 111x40 · 07 120x38 · 08 91x44 · 09 241x24 · 10 99x44 · 11 161x32 · 12 207x38 · 13 156x38 · 14 71x38 · 15 112x38 · 16 150x24 · 17 152x30 · 18 188x40 · 19 154x44 · 20 126x38 · 21 178x30 · 22 103x30 · 23 189x38 · 24 86x44 · 25 112x44 · 26 144x30 · 27 82x44 · 28 121x30 (files `public/svg/ticker-logo-04.svg` … `ticker-logo-28.svg`; these shared files match the live compare-ticker logos by path fingerprint). All full color as provided, opacity 1.
- No homepage "Blur out" 441px gradient. Instead a separate **fade strip** follows the hero: 1440x111 block, `background: linear-gradient(180deg, #F3F0EB 0%, #FFFFFF 100%)` (in normal flow, y 900–1011).

### 3.2 Testimonials — VARIANT of homepage `Testimonials` (Gorgias version)
- Section: padding **80px 96px 24px**, transparent (white), flex row center, overflow clip. **No title block.**
- Panel ("content"): max-width **1200**, padding 24px 16px, gap 24, bg **rgba(255,255,255,0.5)**, radius **48px** (looks plain white).
- Slide row 1104 wide, gap 40: text column 532 (quote 25.6/33.28 ls −0.512), image **532x532** radius 32. Brand row: logo 140x64 left, "Read full story" `Secondary / md` (137x48) right-aligned in the 532 column (space-between), name 20/28, role 12/16.8 ls 0.6 `#787368`.
- **Controls are BELOW the quote column**, horizontally centered on the page (prev at x 653, next at x 747, 40x40, counter "1 / 5"), top at **464px below the slide top** (they overlap the slide area, not a separate row above). Same buttons/transition as homepage (horizontal slide, ~300ms).
- **Only 5 slides** (data differs from homepage):
  1. Jeremy Thurswell — COO — logo `ZCj576JNrFiZ427q7v0w8UiiZtg.svg`, image `mSwCeM9m9qrwUvrpjLLD0jdLc0.webp` — "Read full story" → `/customer-stories/kitsch` — "We found Siena to be the most powerful solution for AI customer support. The nice thing is that we were able to take Siena and all the training we did with it and move it to a more enterprise CX platform that better suited our needs."
  2. Rachel Reid — CEO — `2taW7AxLIcRYvsOfkwnA3MitHgM.svg`, `41lIr5VsLY7853gfB7CIVgCQAw.webp` — → `/customer-stories/subtl-beauty` — "AI is the game changer for our customer service, and while we love our friends at Gorgias, we use Siena AI for this and have done so for almost 2 years. Highly recommend."
  3. Cate Marquese — CXO — `k1HObzFN6BRQikpKHeWt53mr6U.svg`, `WVZA37Bad6K0ss9JDOjwLhH2aUs.webp` — → `/customer-stories/terra-kaffe` — "There are so many Al tools popping up every day, but Siena Al consistently is leaps." (sic: "Al")
  4. Bryan Porter — CO-FOUNDER, CHIEF ECOMMERCE OFFICER — `pdpeaTrKFMv0hrJBF3RGbQ0ErwM.png`, `L3duexlM5SB9tib8w9MTlnCfdlo.webp` — → `/customer-stories/simple-modern` — "We chose Siena over the competition because it has real control over automations, the best admin UI, and it’s built for ecommerce. Our team now focuses on complex tickets while Siena covers 24/7 support."
  5. Mitch Ancellotti — HEAD OF OPERATIONS — `TyjyLvurtRA6Q8m1znnnQyPTA.svg`, `ZNCvlLUA3s36QW3WntCP03sYPfE.jpeg` — no button — "When I compared all the AI solutions, I asked: who can provide the ultimate customer experience that I can fine-tune for any scenario? The only logical choice was Siena."
  - Slides have no play badge.

### 3.3 Comparison table — NEW (desktop = real `<table>`, mobile = stacked cards)
- Section "Features": bg `#FFFFFF`, padding **0 96px 80px**, flex column center, **gap 72px**.
- Title: max-width 1100, H2 "How is Siena different from Gorgias?" — Feature Deck Web Light 64/64 ls −1.28 `#122023`, center (1 line).
- Table wrapper 1062 wide (x 189). Exact inline CSS from the live embed:
  - `table { width:100%; table-layout:fixed; border-collapse:collapse; background:#FAF7F1; border:1px solid #EEEEEE; border-radius:24px; overflow:hidden; }` → 3 equal columns ≈ 354px.
  - `th { padding:40px; text-align:center; font: 700 16px/1em "Instrument Sans"; letter-spacing:0.06em (0.96px); color:#555555; border-bottom:1px solid #EEEEEE; }` — middle `th` bg `#FFFFFF`, others transparent. First `th` empty. Header row 97px tall.
  - Row label `td` (col 1): `padding:40px; font: 400 24px/1.2em "Instrument Sans"; color:#333333; vertical-align:top; border-bottom:1px solid #EEEEEE; text-align:left`.
  - Siena `td` (col 2): `padding:40px; font: 400 20px/1em "Tiempos Text Regular"; color:#333333; vertical-align:top; background:#FFFFFF; border-bottom:1px solid #EEEEEE`. Content = `div{display:flex;align-items:flex-start;gap:8px}` → check `img` **20x20, margin-top 3px, flex-shrink 0** (`public/assets/a5SDd3EboOJuKxw06cfwFqcDs.png`, 40x40 retina red/blue gradient check badge) + `span` text.
  - Competitor `td` (col 3): same as col 2 but transparent bg, no icon.
  - Last row also has the 1px bottom border. No hover, no sticky header, no zebra.
- Row heights (1440, Gorgias): header 97; rows 161/141/121/141/141/141/121/161/141 (driven by text wrap: 20px lines in a 274px text width (col 2: 246px after icon)).
- Rows: see §4.2 / §5.2.

**Mobile (390):** the table is replaced by a card list (no horizontal scroll):
- Wrapper 342 wide: bg `#FAF7F1`, border 1px solid `#EEEEEE`, radius 24, overflow hidden.
- Each row block: padding **32px**, border-bottom 1px solid `#EEEEEE` (last: none), bg transparent. Inside, three groups:
  1. Row label: Instrument Sans 400 **24px/1.2em** `#333333` left; margin-bottom **32px**. (An empty 12px label span sits above it.)
  2. Siena group: bg `#FFFFFF`, padding **16px**, radius **12px**, **margin 0 −16px 32px** (bleeds 16px each side → 308 wide). Label "SIENA AI": Instrument Sans 700 **12px/1em** ls 0.06em `#555555` **opacity 0.8**, centered, margin-bottom 4px; then check row (20x20 icon, gap 8) + Tiempos 400 **20px/1em** `#333333`.
  3. Competitor group: label "GORGIAS AI SUITE" (same label style), then Tiempos 20px/1em text; margin-bottom 0.
- Section on mobile: padding **0 24px 56px**, gap 32; H2 48/48 ls −0.96 (3 lines).

### 3.4 "The *intelligence* layer for commerce" title — VARIANT of homepage Features title
- Block "Title": max-width **1200**, padding **80px 96px 0**, centered. H2 "The *intelligence* layer for commerce" — Feature Deck Web Light **300, 80px/80px, ls −0.8px**, center, 2 lines ("The intelligence layer for" / "commerce"); "intelligence" is `<em>` in **Feature Deck Web Light Italic** 80px. Followed directly by the scroll area.
- 390: H2 **56px/56px ls −0.56**, padding 56px 24px 0.

### 3.5 Sticky scroll area — VARIANT of homepage `ScrollArea` (4 blocks instead of 3)
- Section "Scroll Area": 1440x3706, bg white, flex row center, align flex-start, **gap 64px**, padding **36px 96px 40px** (homepage: 0 96px).
- Left "Content" column 512, gap 10; **4 blocks** each 512x900 (block tops at section +36, +946, +1856, +2766), flex column, justify center, align flex-start, **gap 32px**.
  - **H3 differs from homepage:** **Feature Deck Web Regular 400, 52px/62.4px**, ls normal, `#122023`, left (2 lines, 125 tall). (Homepage uses Light 64/64.)
  - Blocks 2–4 have a **description paragraph** after the H3: Tiempos Text Regular **20px/28px**, ls normal, color **`#000000`**, 512 wide.
  - Bullets: identical to homepage (24px four-point star homepage star (inline SVG in CLONE_SPEC §4; same as `public/svg/social-agent-star-four-light-1-e3ce8.svg`); Tiempos 18/23.4 ls −0.18 `#2A3639`; row gap 10, list gap 12).
  - **Only the last block (4) has the "Book a demo" xlg button** (→ /book-a-demo). Blocks 1–3 have no button.
- Right "Sticky" column: IDENTICAL mechanics to homepage (512 wide, `position: sticky; top:0`, height 900, padding 110px 0 40px, card 512x647 radius 24 centered, card top at viewport y 162). Variant switching: same IntersectionObserver rule (block crossing 50% viewport), background swaps instantly, bubbles animate in exactly like the homepage (initial `opacity:0; translateY(+50px)`, first bubble `+80px`).
- **Card variants per block** (reference shots `gorgias-sticky-1440-{1..4}.png`):
  1. Block 1 → **"Compare 4" = IDENTICAL to homepage ChatMock variant 1** ("Homepage 1": bg `OS7uIQBhEtXd5l7MXZ0qAcM0Lg.png`, same 5 bubbles/text/avatars/timing).
  2. Block 2 → **"Compare 2" — NEW** (reviews mock), card 512x647 radius 24, bg image `public/assets/2Jj1BszGAvma1aySjKVmoUyfSI.png` cover (blurred person photo), plus a full-card overlay of diagonal hatch pattern `public/svg/compare-hatch-pattern.svg` (CSS bg, `background-size: 64px auto`, repeat; box 517x647 at x −2). Elements (x,y relative to card top-left; card top = sticky y 162 → subtract 162):
     - "Big chip" 1 at (78,119) 356x81: bg `#F4EDDE`, radius 24, padding 8, flex row gap 16, align center. Icon tile 64x65 radius 16, bg `#EFE5D0` with texture image `eTyaR6EX4QUmmcYkomodjUhpH6Q.png` (blue gradient, rendered 496x279, clipped) + white FA Sharp Light 24px glyph **U+F007** (user) centered + small overlay `Uuv5OWNLroO51e3GWwN9hGnIU.png` 32x18. Text "Generate personalized review responses at scale" — Tiempos 20px/26px `#122023`, 260 wide (2 lines).
     - Review card "Topics-card" at (124,204) 233x148: bg `#F3F0EB`, radius 16, padding 16, column gap 8: profile row (gap 12): avatar `YJCHh6pHXfigS8Roir7x9YirEI.webp` 39x39 contain; name "Kathy Simpson" Tiempos 20/26; "Lynwood, WA" Tiempos 12/15.6. Stars row: 5 × `public/svg/ai-review-management-Vector-d70f1.svg` 16x16 (fill `#0D893B`), gap 2. Divider `public/svg/compare-review-line.svg` 212x4. "Great product!" Instrument Sans 400 14/18 rgba(18,32,35,0.8).
     - Reply bubble at (270,300) 217x73: 1px rainbow border (`linear-gradient(255deg, #F2E59A 0%, #FEC796 14.8649%, #FB5646 32.8829%, #827ACC 52.2523%, #2E79D8 79.7297%, #ABABAB 100%)`, radius 16, padding 1) → inner bg `#FFFFFF`, radius 16, padding 12: "Hey Kathy! So glad you liked it, here is a 10% discount for your next purchase" Tiempos 12/15.6 `#122023`.
     - "Big chip" 2 at (75,413) 314x81: same chip style; icon tile texture `H52yBv0P43yzd8dUlb8CFyENp1s.png` (red), glyph **U+F03E** (image); text "Automatic reviews moderation" Tiempos 20/26 (2 lines).
     - (Each icon tile also contains a hidden "chart-simple" FA Pro ligature text that renders invisibly — ignore.)
  3. Block 3 → **"Compare 1" — NEW** (memory chat), bg image `public/assets/ZKcNeM6djIjPHCNJzlqVwl6Oz0.webp` cover, radius 24. Chat column (positions relative to card):
     - Customer rows: avatar `D3TQ38q4HpOxmxHoD1u1AW40NI.png` rendered **38x57 cover** at x 47; bubble bg `#F3F0EB`, radius 16, **padding 12px**, text Tiempos 14/18.2 `#122023`, bubble x 96.
     - Siena rows: 2px rainbow border (same gradient, radius 16) → inner `#EFE5D0` radius 16 padding 12, bubble x 33 (width 384), avatar `14aPLwywC9q4flBvXM0s1rLqA8.png` 40x40 at x 427.
     - Sequence (y): 124 customer "Has my sculpting shorts order shipped yet?" (380 wide) · 182 Siena "Just went out! You'll have it Friday." · 245 customer "Perfect! Hope XL fits, sometimes I need Large." · 303 time chip "5 weeks later" (131x22, bg `#F3F0EB`, radius 50, padding 4px 12px, gap 10: FA Sharp Light 12px **U+F017** `#605C53` + Geist Mono 400 10/14 ls 0.5 uppercase `#605C53`, centered at x 191) · 340 customer "Looking for those sculpting shorts in high-waisted." · 399 Siena "We have those! You mentioned being between L and XL before. Which worked better?" (2 lines) · 479 customer "XL was loose. L would be perfect!".
     - Entrance animation: same bubble rise/fade as homepage (rows stagger in on activation).
  4. Block 4 → **"Compare 3" — NEW** (shopping mock), card bg transparent `rgba(255,255,255,0)` radius 24, hatch overlay (same svg), then photo `BeLmCXReFiYYClGNyhlGNKeAp70.webp` (1022x903 cover at (−254,−130), i.e. overflowing; card clips) and a soft rainbow blur `w6eD4Ur8zTRM35rkpRmfdnDQ8Fg.webp` (790x452 at (−91,78)).
     - Product card at (18,119) 235x152: 2px rainbow border radius 16 → inner `#FAF7F1` radius 15 padding 8, column gap 8: row (gap 8): white tile 76x76 radius 16 padding 4 with product image `E41dkaPjzIYO8X5LquyvnNWA5k.png` 68x68 cover; text column (gap 8): "Voyager Tumbler - Signature" Tiempos 12/15.6, "$37.99" Tiempos 20/26. Below: "Icon" pill 215x48 bg `#EFE5D0` radius 24 padding 4 with texture `1bDMxZj8W2T4NADqgydu75txHrc.webp` (259x146 cover) and inner "Container" 207x40 bg rgba(255,255,255,0.5) radius 24 padding 6px 8px → "Add to cart" Feature Deck Web Regular 20/28 `#122023` centered.
     - Suggestion list at (271,237) 235 wide, column gap 10: three pills 235x47, bg rgba(255,255,255,0.9), radius 24, padding 8px 16px 8px 8px, row gap 12: sparkle `public/svg/shopping-agent-sparkles-two-2-f6c5b.svg` 20x20 + Tiempos 12/15.6 `#122023`: "How does the leak-resistant lid prevent spills?" · "Can it keep drinks cold for over 24 hours?" · "How does the handle improve on-the-go usability?".
     - Prompt bar "Footer" at (93,475) 326x54: bg `#FFFFFF` radius 48 → 2px rainbow border radius 24 → white inner radius 32 padding 4 → content padding 4px 12px gap 8: Siena "S" icon `public/svg/shopping-agent-Icon-Black-d8122.svg` 25x25 + "What can I help you with?" Feature Deck Web Regular **24px/33.6px** `#122023`.
- Mobile (390): NOT sticky. Section padding **56px 24px 16px**, gap 32; Content column 342, **blocks gap 80px**, each block flex column center **gap 40px**, order H3 → card → description → bullets → (button on last). H3 **Feature Deck Web Regular 36px/43.2px**; description Tiempos 20/28 `#000` (unchanged); bullets Tiempos **14px/21px ls −0.14** `#2A3639`; card variants shrink to 342 wide (block heights 724 / 876 / 862 / 1002); chat bubble text 12/15.6 (block 1), chip text 16/20.8 (block 2), prompt text 18/25.2 (block 4).

### 3.6 Metrics — IDENTICAL to homepage `Metrics`
Same image `5VTp1YGCJLYo9Grib0Ouvyooeag.webp`, card, "80" count-up (25→80, 1.5s easeInOut, once), H2 Feature Deck Web Regular 40/48 `#000`, swash, stats 98% / 90% / +94.7% with top border 1px rgba(0,0,0,0.2) (`::after`) and labels. Height 852. Mobile identical to homepage mobile.

### 3.7 Integrations — VARIANT of homepage `Integrations`
- Section bg **`#FFFFFF`** (homepage `#FAF7F1`), padding **0 96px 80px** (homepage 80px 96px), height 800. Title, grid (4 x 297, rows 181, gap 4, tiles `#F3F0EB` radius 4 padding 72px 0) and right-aligned "Explore all integrations" xlg button → /integrations — identical.
- **Tiles differ** (inline SVG logos, no filters):
  1. Shopify — `public/svg/integration-0-Logos.svg` (IDENTICAL to homepage tile 1) 129x37
  2. Kustomer — `public/svg/partner-kustomer.svg` 185x33
  3. Gladly — `public/svg/partner-gladly.svg` 151x37
  4. Gorgias — `public/svg/partner-gorgias.svg` 143x37
  5. Zendesk — `public/svg/partner-zendesk.svg` 171x37
  6. Recharge — `public/svg/integration-5-Union.svg` (IDENTICAL to homepage tile 6) 187x37
  7. Intercom — `public/svg/partner-intercom.svg` 163x37
  8. text "**Custom Apps**" — Instrument Sans 700 20px/28px ls −0.2 `#122023`
- Mobile: grid `169px 169px`, gap 4, tiles 169x181 padding 14; "Custom Apps" 700 16/22.4 ls −0.16; button right-aligned. **On mobile the section order changes** (see §3.12).

### 3.8 FAQ — NEW (accordion)
- Wrapper: padding **80px 0** (FAQ title top = Integrations bottom + 80), flex column center, gap **40px**.
- Title: max 1062; H2 "FAQ" Feature Deck Web Light 64/64 ls −1.28 center.
- Panel "FAQ": max-width **1062** (x 189), bg `#F3F0EB`, radius **24px**, padding **20px 40px** → list 982 wide. Code component with inline styles:
  - Item: `overflow:hidden; border-bottom: 3px solid rgba(0,0,0,0.2)` (the live CSS sets an invalid width list so it computes to `medium` = **3px**); **last item has no border**.
  - Header (button row): `display:flex; align-items:center; justify-content:space-between; padding:24px 0; cursor:pointer; background:transparent;` question text Instrument Sans **500 20px / normal** (≈24px) `#122023`; header height 72.
  - Icon: 20x20 PNG at the right, **swapped (not rotated)**: open = `public/assets/OKFNY3AXFnnV2q6cBUgzTRwNI0.png` (chevron up), closed = `public/assets/klSbquSQSmI4vJp5uAthfEBu4A.png` (chevron down). Swap is instant on click.
  - Answer: `display:flex; flex-direction:column; align-items:start; padding:0 0 24px; overflow:hidden;` Instrument Sans **400 16px / normal** (≈19.5px lines), color **rgba(18,32,35,0.8)**. Closed: `height:0; opacity:0` (the 24px bottom padding still shows → closed item = 72 + 24 + 3 border = 99px).
  - **Behavior:** single-open accordion; **item 1 open by default**. Clicking another item opens it and closes the open one simultaneously. Clicking the open item closes it.
  - **Animation (rAF-measured):** starts ~0–20ms after click; height and opacity animate together **linearly over ≈100ms** (e.g. opening answer 24→64px & opacity 0→1 from t=147ms to t=247ms; closing answer 84→24 & 1→0 over the same frames). Implement: `transition: height 100ms linear, opacity 100ms linear` (measure content height, or framer-motion `animate={{height:'auto',opacity:1}}` with `duration:.1, ease:'linear'`). No hover effect (bg stays transparent; cursor pointer).
- Mobile: panel 342 wide, padding **24px**; questions wrap (e.g. 2–3 lines at 20px), icon stays 20x20 right; H2 "FAQ" 48/48.

### 3.9 Main CTA — VARIANT of homepage `MainCta`
- Same "Desktop" frame (1440x755, padding 200px 96px, bg image `ERYNplIY591uk80wpoa4JGglO8.webp` cover) and card (max 1062, bg `#F3F0EB`, radius 48, padding 64, inner gap 41, H2 Feature Deck Web Light 64/64 ls −1.28 center 934 wide, xlg "Book a demo").
- **Diff:** no top "Blur out" cream fade (section follows the white FAQ area). H2 text per page (§4/§5).
- Mobile: frame "Phone" padding **200px 96px** (NOT the homepage 168px 16px) → card only **198px wide** (padding 32, radius 32) and the H2 (48/48) wraps to ~10 narrow lines ("Join / brands / who / switch / ed / from / AI / Add- / ons to / Siena") — this is how the live site renders; reproduce (frame height 1034 on Gorgias).

### 3.10 Footer — IDENTICAL to homepage `Footer`.

### 3.11 Testimonial/hero/table details at 390
- Hero (390): section y 40–652 (nav overlays), padding **120px 24px 160px**; eyebrow 14/19.6; H1 rendered as H2 tag at **48px/48px ls −0.96** (4 lines); subtitle 16/22.4 ls −0.16 (3 lines); xlg button centered. Right image `OJVl4…webp` `top:153px; left:144.1px` 614x559 contain; left image `qnJ39…webp` `top:289px; left:-209px` 390x411 contain. Ticker: top 575 (section-relative 535), height **45**, **gap 40px**, mask `transparent 0% → #000 10% → #000 90% → transparent 100%`, same 45 px/s leftward.
- Fade strip 111px same.
- Testimonials (390): padding 0 0 24px; panel full width, rad 48 (invisible); slide column 326: image **320x320** radius 32 → quote mark → quote 19.2/24.96 → brand row (logo 140x64 + name 16/22.4 / role 12/16.8) → "Read full story" button below (left). Controls centered at y ≈ +464 inside the slide (overlapping, same as desktop logic).

### 3.12 Mobile section order (390) — differs from desktop
Hero → fade strip → Testimonials → Comparison cards → "intelligence" title → Scroll area (static) → Metrics → **FAQ → Main CTA → Integrations** → Footer. (Desktop order is Metrics → Integrations → FAQ → CTA.) On mobile the Integrations H2 "Integrate with your existing stack" (48/48) is positioned 132px above the Integrations grid and overlaps the bottom of the CTA image (it is effectively hidden behind/inside the CTA area in the live render — see `crops/gorgias-390-4.png`); grid + button are visible. Gorgias 390 y-positions: comparison 1587–4790, title 4790, scroll area 5070–8847, metrics 8847–9705, FAQ 9705–11070, CTA 11126–12160, integrations grid 12235–12971, button 13035, footer 12959–14039 (footer bg `#122023` starts at 12959; integrations button overlaps its top edge in the live render).

---

## 4. /compare/siena-ai-vs-gorgias-ai — content

### 4.1 Hero
- Eyebrow "Siena vs Gorgias"; H1 "Save months before hitting Gorgias AI automation walls"; subtitle "Siena is what brands switch to when add-ons fall short. Specialized agents for support, sales and insights that work like magic."; CTA "Book a demo" → /book-a-demo.

### 4.2 Comparison table (exact cells; every Siena cell has the check icon)
| (blank) | SIENA AI | GORGIAS AI SUITE |
|---|---|---|
| Remembers every customer | Each interaction builds memory, deepening relationships and surfacing insights | Customers repeat themselves, no business insights |
| Tailor tone and style | Multiple agent personas per channel with rich tone and style | Single agent persona with limited tone presets |
| AI-Native or Add-on? | AI-Native platform built from the ground up | Add-on to legacy ticketing system |
| Knowledge & Sources | Domain-level crawl, Google Docs & Sheets, unlimited sources | Manual sub-page entry only, capped at 10 URLs |
| Pre-launch testing | Inline playground with step-by-step reasoning for confident deployments | Basic test view with minimal reasoning trace |
| Configurable response time | Set custom delays per channel for natural conversation flow | Instant responses only |
| Flexible AI disclosure | Full control over AI disclosure | AI disclosure required, no flexibility |
| QA coverage | Evaluate 100% of your conversations against criteria you write in plain language | Lacks an integrated QA automation layer |
| Review management | Fully automates review moderation and responses | No moderation and responses, no automation |
H2: "How is Siena different from Gorgias?"

### 4.3 Scroll-area blocks
1. H3 "The commerce agent CX teams prefer" (no description) · bullets: "Frees your team from ticket firefighting to focus on strategic work" / "Handles complex customer needs in your brand's authentic voice" / "Absorbs growing customer volume with your existing team" → card Compare 4 (= homepage chat v1).
2. H3 "Review management on autopilot" · desc "Moderate reviews, respond at scale with your brand voice, and extract insights that inform product decisions." · bullets: "Catches and moderates inappropriate reviews automatically" / "Boosts SEO and GEO with fresh, on-brand review responses" / "Frees your team to focus on critical recovery cases" → Compare 2.
3. H3 "Memory that makes CX magical" · desc "Connect every customer touchpoint into one continuous thread. Deliver personalized experience and extract insights that improve your operations." · bullets: "Persistent context across all channels" / "Personalization based on full customer history" / "Surfaces customer feedback in real time so you can fix issues immediately" → Compare 1.
4. H3 "Shopping Agent that closes sales" · desc "Guide customers from product discovery to checkout with intelligent recommendations based on purchase history, conversation context, and real-time catalog data." · bullets: "Provides expert product guidance and recommendations in real time" / "Works across on-site widgets, email, SMS, chat, and social media" / "Tracks revenue attribution from initial conversation through purchase" · button "Book a demo" → Compare 3.

### 4.4 FAQ (item 1 open by default)
1. **Can Siena work across multiple channels?** — Absolutely. Siena works across email, SMS, chat, WhatsApp, social media (Instagram, Facebook, TikTok), voice, and more—all from a unified AI that maintains context across channels. Your customers get the same experience whether they reach out on Instagram or email.
2. **Does Siena handle pre-purchase and post-purchase interactions?** — Yes. Siena's Shopping Agent handles product discovery, recommendations, and conversions, while the Customer Service Agent manages post-purchase support like returns, exchanges, and tracking.
3. **Why does Siena include implementation support instead of self-service setup?** — Because high-quality automation requires expertise most brands don't have yet. Our implementation team manages setup from day one: connecting systems, structuring your knowledge base, and configuring automations that mirror your business. We apply proven frameworks from hundreds of implementations to get your workflows performing at production quality before launch. Other platforms rely on self-service because their automation is limited to basic deflection. Siena powers complex workflows like returns, exchanges, and subscription management. You reach reliable automation faster than trial and error.
4. **What's the difference between Siena's pricing and Gorgias's pricing model?** — Siena uses transparent per-conversation pricing. You know exactly what you're paying for—no hidden formulas, no debates over what counts as "resolved." Gorgias uses outcome-based pricing, which sounds appealing but creates disputes over resolution definitions and unpredictable costs. With Siena, cost = conversations × rate. Simple.
5. **Does Siena require me to use a specific helpdesk?** — No. Siena sits on top of your existing helpdesk—whether that's Zendesk, Kustomer, Gorgias, Dixa, or others. You can switch helpdesks anytime without losing Siena. Gorgias AI only works with the Gorgias helpdesk, locking you into their ecosystem. If you ever want to change your helpdesk, you lose your AI investment with Gorgias.
6. **What if I want to switch from Gorgias to another helpdesk in the future?** — With Siena, switching is seamless. Siena integrates with major helpdesks like Zendesk, Kustomer, Dixa, Gladly, and Intercom, so you can move platforms while keeping all your AI automations, workflows, and training intact. Gorgias AI is dependent on the Gorgias helpdesk. If you leave Gorgias, you start over.
7. **Why do brands choose Siena over Gorgias AI?** — Brands choose Siena because it's built AI-native from the ground up, not bolted onto an existing helpdesk. Siena delivers 80% automation rates that remain stable and improve over time. Siena works on top of your existing helpdesk (Zendesk, Kustomer, Gorgias, etc.), so you're never locked in. If you want to switch helpdesks, Siena moves with you (no trailing period on the live site)
8. **Is Siena suitable for enterprise brands?** — Yes. Siena is trusted by enterprise brands and is SOC 2, GDPR, CPRA, and HIPAA compliant. Our reasoning architecture provides the visibility, control, and explainability enterprise teams need. We offer dedicated onboarding, Slack support, and custom integrations for complex tech stacks.
FAQ panel height (1440): 889px (item 1 open).

### 4.5 CTA H2: "Join brands who switched from AI Add-ons to Siena" (2 lines).

---

## 5. /compare/siena-ai-vs-kustomer-ai — content + diffs vs §3

### 5.1 Hero
- Eyebrow "Siena vs Kustomer AI"; H1 "Move from answering questions to making customers happy"; subtitle "Siena is what ecommerce brands choose instead of generic support. Specialized agents for support, sales and insights that work like magic."; same images/ticker.

### 5.2 Testimonials — layout DIFF (same 5 slides as §3.2)
- Section bg **`#F3F0EB`**, padding **80px 96px 0**, height 888 (900–1788); fade strip moves to 1788–1899.
- Panel max-width **1062**, padding 24px 16px, radius **24**, `linear-gradient(180deg, #FFFFFF 0%, #F3F0EB 100%)` (same as book-a-demo panel).
- Slide 966 wide: quote column **420** (quote 25.6/33.28 → 7 lines, 233 tall; x 290), image **400x400** (max-width 400) radius 32 at x 750; controls centered at y **480px below slide top**.

### 5.3 Comparison table (11 rows; column header "KUSTOMER AI SUITE")
| (blank) | SIENA AI | KUSTOMER AI SUITE |
|---|---|---|
| Remembers every customer | Each interaction builds memory, deepening relationships and surfacing insights | Customers repeat themselves with no business insights |
| Tailor tone and style | Multiple agent personas per channel with rich tone and style | Single tone across all channels, no customization |
| AI-Native or Add-on? | AI-Native platform built from the ground up | Bolt-on to legacy helpdesk, constrained by old architecture |
| Knowledge & Sources | Domain-level crawl, Google Docs & Sheets, unlimited sources | Only websites and help center articles |
| Pre-launch testing | Inline playground with step-by-step reasoning for confident deployments | Basic testing only, limited pre-launch QA |
| Configurable response time | Set custom delays per channel for natural conversation flow | Instant responses only, no pacing control |
| Flexible AI disclosure | Full control over AI disclosure | AI disclosure required, no flexibility |
| Channels | Chat, Email, SMS, WhatsApp, Instagram, Facebook, TikTok, Klaviyo, Yotpo, Okendo | Limited social channels, no marketing or reviews |
| Understands customer videos | Automatically understands video attachments showing product issues or questions | No automated video processing, agents must watch and document manually |
| Review management | Fully automates review moderation and responses | Manual moderation and responses, no automation |
| QA coverage | Evaluate 100% of your conversations against criteria you write in plain language | Lacks an integrated QA automation layer |
H2: "How is Siena different from Kustomer AI?" (Features section 1899–3844).

### 5.4 "intelligence" title — same text; block at 3844 is max-width **1062** (x 189) instead of 1200, H2 1062 wide, still 2 lines.

### 5.5 Scroll-area blocks (same cards/order as §4.3)
1. "The ecommerce agent CX teams choose" · bullets: "Shifts your team from reactive escalations to proactive strategy" / "Resolves complex ecommerce workflows in your brand's genuine voice" / "Manages increasing volume without expanding headcount".
2. "Review management that runs itself" · desc "Filter reviews, reply at scale in your brand voice, and surface insights that guide product strategy." · bullets: "Identifies and moderates reviews without manual review" / "Improves search visibility with consistent, on-brand responses" / "Enables your team to prioritize urgent reputation issues".
3. "Memory that transforms customer experience" · desc "Thread every customer interaction into one cohesive story. Enable personalized experiences and uncover insights that strengthen your operations." · bullets: "Maintains conversation continuity across every touchpoint" / "Tailors responses using complete purchase and interaction history" / "Reveals customer insights instantly for immediate action".
4. "Shopping Agent that seals the deal" · desc "Move customers from discovery to completion with tailored recommendations driven by past purchases, dialogue history, and up-to-date catalog." · bullets: "Delivers intelligent product recommendations during every interaction" / "Functions seamlessly across web, email, SMS, messaging, and social" / "Measures revenue impact from first engagement to final transaction" · button.
Scroll area 4084–7790, Metrics 7790, Integrations 8642, FAQ title 9522, FAQ panel 9626 (790 tall), CTA 10496, Footer 11251.

### 5.6 FAQ (7 items, item 1 open by default)
1. **Why do brands choose Siena over Kustomer AI?** — Ecommerce brands select Siena for its purpose-built AI architecture, not retrofitted helpdesk features. We consistently achieve 80% automation rates that strengthen with use. Siena integrates with your current helpdesk platform (Zendesk, Kustomer, Gorgias, and others), eliminating vendor lock-in. When you migrate helpdesks, Siena seamlessly transitions with you.
2. **Does Siena require me to use a specific helpdesk?** — No. Siena sits on top of your existing helpdesk—whether that's Zendesk, Kustomer, Gorgias, Dixa, or others. You can switch helpdesks anytime without losing Siena. Kustomer AI only works with the Kustomer helpdesk, locking you into their ecosystem. If you ever want to change your helpdesk, you lose your AI investment with Kustomer AI.
3. **What if I want to switch from Kustomer AI to another helpdesk in the future?** — With Siena, switching is seamless. Siena integrates with major helpdesks like Zendesk, Kustomer, Dixa, Gladly, and Intercom, so you can move platforms while keeping all your AI automations, workflows, and training intact. Kustomer AI is dependent on the Kustomer helpdesk. If you leave Kustomer AI, you start over.
4. **Can Siena work across multiple channels?** — (same answer as §4.4 #1)
5. **Does Siena handle pre-purchase and post-purchase interactions?** — (same as §4.4 #2)
6. **Why does Siena include implementation support instead of self-service setup?** — (same as §4.4 #3)
7. **Is Siena suitable for enterprise brands?** — (same as §4.4 #8)

### 5.7 CTA H2: "Join ecommerce brands who made the switch".

---
## 6. /ai-native-customer-service-vs-help-desk-ai-add-ons  (https://www.siena.cx/ai-native-customer-service-vs-help-desk-ai-add-ons)

**Not a long-form article.** The live page is a short landing page (hero + 3 sticky blocks + metrics + features + CTA); there is no long prose. All copy is short, so exact text is given (word counts noted for the paragraphs). Document height 1440: **8292**; 390: **11984**.

**Nav: IDENTICAL to homepage `Nav`. Footer: IDENTICAL to homepage `Footer`.** Links are root-relative (`./book-a-demo`).

Section stack (1440): Hero 0–900 · Scroll area 900–3700 · Metrics 3700–4552 · Features 4552–7103 · Main CTA 7103–7858 · Footer 7858–8292.

### 6.1 Hero — VARIANT of homepage `Hero`
- Same section (1440x900, bg `#F3F0EB`, padding 0 96px, flex column center) and same homepage decorative images, but repositioned:
  - Right "Siena 2" `jBdT2KuAbfPtfHNsxcWh0L50xk.webp`: `top:38px; left:640px; right:0; bottom:0` → **800x862**, `object-fit: cover` (homepage: top 13, left 810, 630x837).
  - Left "image" `rYyvabwLjN7jv9XBL68Sm664.webp`: `top:1px; left:-384px; width:800px; bottom:52px` → 800x728, `object-fit: contain`.
- Text block (max 1062 → H1 is 1244 wide, overflowing the 1062 max via its own width; centered at x 98–1342), gap 40 between text group and button:
  - H1 "AI-Native Customer Service.<br>Not an Add-on." — Feature Deck Web Light 300 **80/80 ls −0.8**, center, 2 lines (forced break after "Service.").
  - P1 "Stop settling for unpredictable help desk AI add-ons. Siena is a purpose-built AI agent designed entirely for exceptional customer support that's stable, reliable, and consistently on-brand." (27 words) — Instrument Sans 500 20/28 ls −0.2, center, 485 wide, 4 lines.
  - P2 "Switch easily from add-ons" — same style, 20px below P1 (1 line).
  - xlg "Book a demo" → /book-a-demo (y 613).
- Appear animation: same primitive (0.7s, opacity 0.001→1, y 200→0); H1 and P1 **delay 0.3s** ease `cubic-bezier(0,.91,.78,1)`, P2 and CTA **delay 0.4s** (same ease). (The live config lists two 0.3s and four 0.4s entries across breakpoints; mapping of entries to nodes inferred from order.)
- **No eyebrow.** No "Blur out" gradient and no fade strip (the scroll area starts directly at y 900 on white).
- **Single ticker**, same component as compare §3.1 (absolute top 800, height 100, mask 12.5%/87.5%, **gap 96px**) but **18 logos** and **speed 30 px/s leftward** (rAF −30.4 px/s): logos 01, **02 = `public/svg/ticker-logo-02.svg` (159x32, CSS bg on live)**, 03 (madhappy), 04–18 — i.e. compare list items 1, ai-native-02, 3–18 (`ticker-logo-01.svg` … `ticker-logo-18.svg`; ticker-logo-02 is this page's slot-2 logo, whereas the compare pages use `compare-ticker-02-figs.svg` in slot 2). List duplicated for the loop.

### 6.2 Sticky scroll area — VARIANT of homepage `ScrollArea`
- Section 1440x2800, padding **80px 96px 0**, gap 64. Content 512; **3 blocks** of 512x900 at section +80, +990, +1900, each flex column, justify center, gap 32.
- H2: homepage style (**Feature Deck Web Light 64/64 ls −1.28**, left).
- **Description paragraph** after H2: Tiempos Text Regular **18px/23.4px ls −0.18** `#2A3639`, 512 wide.
- Bullets: homepage star icon + Tiempos 18/23.4 `#2A3639`, **each starting with a bold lead** (`<strong>` Tiempos weight 700, same size/color), rest regular.
- **Every block has the xlg "Book a demo" button** (→ /book-a-demo).
- Sticky card variants (shots `addons-sticky-1440-{1..3}.png`):
  1. "Homepage 1" — IDENTICAL to homepage ChatMock variant 1.
  2. "Homepage 2" — IDENTICAL to homepage ChatMock variant 2 (Grüns product card).
  3. **"Integrations" — NEW** (512x647, bg `#FAF7F1`, radius 24, overflow hidden):
     - Three concentric rainbow rings (positions relative to card): ring A box (−54,−11) 620x616, ring B (7,72) 495x497, ring C (88,155) 335x336 — each = a 2px-padded `linear-gradient(255deg, #F2E59A 0%, #FEC796 14.8649%, #FB5646 32.8829%, #827ACC 52.2523%, #2E79D8 79.7297%, #ABABAB 100%)` (ring B uses stops −3% … 105%), radius 336px, **opacity 0.65**, with an inner fill `#FAF7F1` radius 336 → reads as thin rainbow circles.
     - 3x3 grid of 138x138 tiles (no gap: columns x 38 / 186 / 334, rows y 106 / 254 / 402; top-left tile at (38,106)), tile bg **rgba(250,247,241,0.7)**, centered logo SVG:
       - row 1: (38,106) `ai-native-int-0.svg` 108x27 · (186,106) `ai-native-int-1.svg` 105x29 · (334,106) `ai-native-int-2.svg` 102x26
       - row 2: (38,254) `ai-native-int-3.svg` 95x21 · center (186,254): image `fxLqEwB1bxRKD7Xar2jbAEQOkY.png` 138x138 cover radius 4 + glow `48uWBr03dP5XBMwKGnfEYaAr9k0.png` 256x141 cover centered behind + Siena "S" mark `ai-native-int-siena-s-96.svg` 96x96 centered · (334,254) `ai-native-int-4.svg` 102x17
       - row 3: (38,402) `ai-native-int-5.svg` 100x23 · (186,402) `ai-native-int-6.svg` 107x21 · (334,402) text "… and custom apps" Instrument Sans 500 **20px/28px ls −0.2** `#122023` (138 wide, 2 lines, centered vertically)
     - No entrance animation measured for this variant.
- Copy:
  1. H2 "Purpose-built AI vs. Help Desk AI add-ons" (3 lines) · desc "Siena isn’t an afterthought—it’s built from the ground up to offer stable, scalable AI customer support. Unlike AI add-ons that were built to support other core features (like a help desk), Siena delivers:" (33 words) · bullets: **"Reliable Stability:"** Built specifically to handle customer conversations with unmatched consistency. / **"Focused Expertise:"** Trained exclusively on e-commerce support scenarios, not diluted by unrelated tasks. / **"Easy Implementation:"** Integrates smoothly with your existing tools, ensuring a frictionless transition from add-ons.
  2. H2 "Predictable AI You Can Actually Trust" (2 lines) · desc "When AI is an add-on to help desk software, performance can fluctuate wildly. Tickets get mishandled, interactions go off-script, and brand reputation suffers. Siena’s dedicated AI delivers instead." (29 words) · bullets: **"Consistent, On-Brand Responses:"** No "rogue" behavior—just steady, policy-aligned interactions. / **"Stable Performance at Scale:"** Handle thousands of interactions reliably without unexpected breakdowns. / **"Clear, Transparent Control:"** You always know how Siena's AI is working, why it's responding, and how to adjust it.
  3. H2 "Switching from an Help Desk AI Add-on? Easy!" (sic, 3 lines) · desc "Making the leap to dedicated AI shouldn’t disrupt your operations. Siena connects seamlessly to your current help desk, and our onboarding experts handle migration painlessly, swiftly transferring your existing setup and content." (33 words) · bullets: **"Plug-and-play integration"** with existing tools / **"Minimal setup time"** to get Siena fully operational / **"Dedicated onboarding"** team to ensure smooth transition.

### 6.3 Metrics — VARIANT of homepage `Metrics`
- Identical except the H2 typography: **Tiempos Text Regular 400, 29px/43.5px, ls −0.29px, color `#122023`** (homepage: Feature Deck Web Regular 40/48 `#000`); text box 635x174 (4 lines). Same copy, count-up, swash, stats.

### 6.4 Features — VARIANT of homepage `Features`
- Same grid, card variants (withPading / withoutPading), sizes (608x725), Lotties (same six JSONs, same order as homepage: `Yj4s…`, `2SUH…`, `8x89…`, `r7wr…`, `Idu0…`, `c8ew…` — visually confirmed against `crops/addons-1440-2.png`).
- **Title differs:** "The *agentic* commerce platform" at **Feature Deck Web Light 300, 80px/80px, ls −0.8px** (homepage 64/64); `<em>` italic 80px.
- **Card copy differs:**
  1. "Drive growth with smart product suggestions" — "Help shoppers discover what fits, what completes their routine, or what they didn’t know they needed. Siena offers thoughtful, timely recommendations that increase sales and keep customers coming back."
  2. "Expand impact with social engagement and moderation" — "Turn social conversations into outcomes. Siena joins the dialogue on your social channels, answers product questions, captures buying intent, and helps convert community activity into ecommerce growth."
  3. "Streamline complex post-purchase requests" — "From “Where’s my order?” to “I need to make a return,” Siena handles it seamlessly—updating addresses, creating return labels, issuing refunds, and sending replacements all in one smooth process."
  4. "Simplify how customers manage subscriptions" — "More retention, fewer cancellations. Siena makes it effortless to skip, pause, or swap—while surfacing insights, suggesting alternatives, and increasing order value with thoughtful recommendations."
  5. "Strengthen teamwork with smart collaboration tools" — "Easily build or adjust workflows using the Assistant. Use Copilot to draft polished replies or translate messages. With Collaborative Routing, every handoff includes a clear note so agents can jump in smoothly."
  6. "Built-in trust, brand protection, and control" — "Chosen by leading ecommerce and retail brands, Siena meets strict enterprise standards. Guardrails and detailed controls ensure every response stays true to your brand and aligned with your policies."
  - Card text: H3 Feature Deck Web Regular 32/38.4, body Tiempos 18/23.4 ls −0.18 `#2A3639` (= homepage).

### 6.5 Main CTA — VARIANT (same as compare §3.9: no top fade). H2 "Join brands who replaced AI add-ons with Siena" (2 lines).

### 6.6 Footer — IDENTICAL.

### 6.7 Mobile (390)
| Section | y | h | padding | gap |
|---|---|---|---|---|
| Hero | 40 | 796 | 80px 24px 160px | 10 |
| Scroll area | 836 | 3803 | 56px 24px 16px | 32 |
| Metrics | 4639 | 768 | 56px 24px | 40 |
| **Empty white block** | 5408 | 1000 | 64px 24px 80px | 32 |
| Features | 6408 | 3751 | 56px 24px | 32 |
| Main CTA ("Phone") | 10159 | 746 | 200px 24px | 10 |
| Footer | 10904 | 1080 | 64px 32px | 16 |
- Hero: H1 56/56 ls −0.56 (342 wide); P 16/22.4; only image `H7uKKouy1m2eWQvMjbwrSblQx8k.webp` at `top:201px; left:0; right:0; bottom:0` (390x595 cover). Ticker as §3.11 (45 tall, gap 40) but 30 px/s.
- Scroll area: blocks gap 80, each column center gap 40: H2 **48/48 ls −0.96** → card → description Tiempos **14/21 ls −0.14** → bullets (bold leads 700 14/21) → button. Cards: block 1 homepage-mobile "Feature 1" (342x522, bg OS7u…, bubbles 12/15.6); **block 2 = "Image - portait"** card 342x586 radius 24 with photo `public/assets/jLZk9EHNgMDBQm7bbrRSNSias.webp` (648x820 file, cover) and the chat bubbles overlaid (avatars at x 48); block 3 = "Integrations M" 342x598 (bg `#FAF7F1` radius 24, ring/tiles scaled: center tile 105x105, glow 195x108; "… and custom apps" Instrument Sans 400 14/15.4 rgba(18,32,35,.8)).
- Metrics mobile = homepage mobile, except H2 keeps Tiempos (scaled).
- **Empty white block (5408–6408):** a 1000px tall white section with no visible content on the live site (a component that renders nothing at the phone breakpoint). Reproduce as an empty `div` (h 1000, bg #FFF) for pixel parity, or drop it deliberately.
- Features mobile = homepage features mobile with this page's copy; title 56/56 ls −0.56 ("agentic" italic); H3 28/33.6.
- CTA mobile: frame padding **200px 24px**, card 342 wide (padding 32, radius 32), H2 48/48.

---
## 7. Assets

### 7.1 Raster/SVG images downloaded this run → `public/assets/` (original framerusercontent filenames)
| File | Natural | Used on | Role |
|---|---|---|---|
| `GtydJWMgnwv6wkRfNUoPlww2jh0.svg` | 151x23 | pricing, book-a-demo | Bombas logo in hero logo grid |
| `43GZFV0RCkyKlAJWzDPZW1Yls3s.webp` | 1460x1214 | book-a-demo | hero bg blob (rotated −15°) |
| `qnJ39G2jMJsaeN5ykV5ZIyZ9Fw.webp` | 1253x800 | compare x2 | hero left decorative |
| `OJVl4cBpDuZoUt7B55UQZA7rfQ.webp` | 800x507 | compare x2 | hero right decorative |
| `2taW7AxLIcRYvsOfkwnA3MitHgM.svg` | — | compare x2 | testimonial 2 logo (Subtl Beauty) |
| `k1HObzFN6BRQikpKHeWt53mr6U.svg` | — | compare x2 | testimonial 3 logo (Terra Kaffe) |
| `TyjyLvurtRA6Q8m1znnnQyPTA.svg` | — | compare x2 | testimonial 5 logo |
| `ZNCvlLUA3s36QW3WntCP03sYPfE.jpeg` | — | compare x2 | testimonial 5 photo (Mitch Ancellotti) |
| `a5SDd3EboOJuKxw06cfwFqcDs.png` | 40x40 | compare x2 | table check badge (rendered 20x20) |
| `2Jj1BszGAvma1aySjKVmoUyfSI.png` | — | compare x2 | sticky "Compare 2" bg |
| `ZKcNeM6djIjPHCNJzlqVwl6Oz0.webp` | — | compare x2 | sticky "Compare 1" bg |
| `BeLmCXReFiYYClGNyhlGNKeAp70.webp` | — | compare x2 | sticky "Compare 3" photo |
| `fxLqEwB1bxRKD7Xar2jbAEQOkY.png` | 256x256 | ai-native | Integrations card center tile |
| `48uWBr03dP5XBMwKGnfEYaAr9k0.png` | — | ai-native | Integrations card center glow |
| `jLZk9EHNgMDBQm7bbrRSNSias.webp` | 648x820 | ai-native (mobile only) | block 2 portrait photo card |

Already present in `public/assets/` and used here (no download needed): `LhQ0hZskcxCtirPSSxXE4hUU0yo.webp` (pricing hero bg, 1004x994), `vtOMWVl8Yp4AVppVcHxc4tGpNo.png` (create logo), `I79jHrog…`, `BYD0tOg…`, `f15R92E…`, `ipTDxCO…` (logo grid), `41lIr5VsLY7853gfB7CIVgCQAw.webp` (testimonial 2 photo), `YJCHh6pHXfigS8Roir7x9YirEI.webp` (Kathy avatar), `eTyaR6EX4QUmmcYkomodjUhpH6Q.png` / `H52yBv0P43yzd8dUlb8CFyENp1s.png` / `Uuv5OWNLroO51e3GWwN9hGnIU.png` (Compare 2 icon textures), `14aPLwywC9q4flBvXM0s1rLqA8.png` (Siena avatar 160x160), `E41dkaPjzIYO8X5LquyvnNWA5k.png` (tumbler), `1bDMxZj8W2T4NADqgydu75txHrc.webp` (Add-to-cart texture), `w6eD4Ur8zTRM35rkpRmfdnDQ8Fg.webp` (Compare 3 glow), `OKFNY3AXFnnV2q6cBUgzTRwNI0.png` / `klSbquSQSmI4vJp5uAthfEBu4A.png` (FAQ chevrons up/down 20x20), `glo9e1d72RyTANRqrtJjGBiB8.webp` (compare, mobile mock), `crEVK41…png`, `9jAbqJZ…webp`, `OS7uIQB…png`, `D3TQ38q…png`, `RmeNSvd…webp`, `5VTp1YG…webp`, `ERYNplI…webp`, `2qwkMa6…svg`, `HB4OWZg…webp`, `jBdT2Ku…webp`, `rYyvabw…webp`, `H7uKKou…webp`, all homepage testimonial logos/photos.

Lottie: the ai-native Features cards use the same six JSONs already in `public/lottie/` — nothing new. Video: only the nav mega-menu video (already handled by `Nav`). Fonts: nothing new (see Conventions).

### 7.2 Inline / data-URI SVGs → `public/svg/`
New files written by this run:
- `compare-ticker-02-figs.svg` — compare ticker slot 2 (FIGS, live = CSS data-URI bg, 91x26 in a 92x32 box)
- `compare-hatch-pattern.svg` — diagonal hatch tile (126x126 path; live CSS bg `background-size: 64px auto; repeat`) over Compare 2/3 cards
- `compare-review-line.svg` — 212x4 divider in the review card
- `ai-native-int-0.svg` … `ai-native-int-6.svg`, `ai-native-int-siena-s-96.svg` — ai-native "Integrations" sticky card logos (positions §6.2)
- `pricing-select-chevron.svg` — 12x8 form dropdown chevron (pricing + book-a-demo)

Reused existing shared files (byte-equivalent paths verified by fingerprint; NOTE: while this run was in progress another agent re-organized `public/svg/` and removed my earlier `compare-*` copies in favour of these shared names):
- Ticker: `ticker-logo-01.svg` … `ticker-logo-28.svg` (compare: slots 1, 3–28; ai-native: slots 1–18 incl. `ticker-logo-02.svg`).
- Compare integration tiles: `integration-0-Logos.svg` (Shopify), `partner-kustomer.svg`, `partner-gladly.svg`, `partner-gorgias.svg`, `partner-zendesk.svg`, `integration-5-Union.svg` (Recharge), `partner-intercom.svg`.
- Review star `ai-review-management-Vector-d70f1.svg` (16x16, fill #0D893B); sparkle `shopping-agent-sparkles-two-2-f6c5b.svg`; Siena "S" `shopping-agent-Icon-Black-d8122.svg`; four-point star `social-agent-star-four-light-1-e3ce8.svg`; Siena avatar glyph `siena-avatar-glyph.svg`; logo `nav-logo-siena.svg`; footer logo `footer-logo-siena.svg`; testimonial chevrons + quote mark as homepage.
- Raw extraction dump (every inline SVG per page, `<use>` references resolved): `recon/conversion/svgdump/` + index `recon/conversion/svgx-<route>-1440.json`.

---

## 8. Motion & interaction summary (these pages)

| Element | Page(s) | Trigger | Behavior | Timing |
|---|---|---|---|---|
| Hero H1 / subtitle / CTA | compare | load | appear primitive (opacity .001→1, y 200→0) | 0.7s tween; delays .2 / .3 / .4s; eases as homepage |
| Hero H1+P1 / P2+CTA | ai-native | load | same primitive | delays .3 / .4s, ease `cubic-bezier(0,.91,.78,1)` |
| Hero (pricing, book-a-demo) | — | — | **no load animation** | — |
| Logo ticker (single row) | compare | always | translateX leftward, linear, infinite, 2× list | **45 px/s**, gap 96 (mobile 40) |
| Logo ticker | ai-native | always | same | **30 px/s** |
| Form floating label | pricing, book | focus / has value | translateY 18→9px, 16→12px, color #57524A→#465153 | 0.2s `cubic-bezier(.4,0,.2,1)` |
| Form focus ring | pricing, book | focus / dropdown open | inset 1px #CDBCA0 → #0099FF | instant |
| Form dropdown panel | pricing, book | click | fixed panel under field, shadow; option hover bg #F3F0EB; chevron flips | instant open/close |
| Form step 1→2 / Previous | pricing, book | Next / Previous | page swap | instant |
| Dark / submit buttons | all | hover | → rainbow gradient | instant |
| Previous button | pricing, book | hover | bg #F3F0EB → #122023, label → white | instant |
| Testimonial slider | all | prev/next | horizontal slide (homepage behavior) | ~300ms ease-in-out, no autoplay |
| Sticky card variants | compare (4), ai-native (3) | block crosses 50% viewport | swap bg instantly; bubbles fade+rise | as homepage (v1 delays .5–2.5s; v2 .35/.55/.95s) |
| Metrics count-up | compare, ai-native | in view (once) | 25→80 | 1.5s easeInOut |
| Feature Lotties | ai-native | always | loop | as homepage |
| FAQ accordion | compare | click header | single-open; height + opacity, icon image swap | **100ms linear**; icon instant |
| Nav / mega-menu / footer hovers | compare, ai-native | — | identical to homepage | — |
