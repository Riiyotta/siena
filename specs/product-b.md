Source: https://www.siena.cx/ (routes: /memory, /video, /order-tracking, /products/docs, /ai-lab, /roi-calculator)

# Siena product pages B — Clone Spec

Measured live with headless Chromium (Playwright, Node scripts in `recon/pages-b/`), 1440x900 and 390x844, on 2026-10-22.
Global tokens, fonts, breakpoints and the appear-animation primitive are in `CLONE_SPEC.md` §0. This file only lists what's different.
Full-page reference screenshots: `recon/pages-b/<route>-1440.png`, `recon/pages-b/<route>-390.png` (`products_docs-*` for /products/docs).
Raw data: `recon/pages-b/<route>-<w>.json` (every text node, image and decorated box), `*-deep.json` (motion, tickers, svgs), `*-borders.txt` (Framer `::after` borders), `*-dump.txt` (layout trees), `js/` (downloaded Framer page modules, incl. the ROI calculator source `js/roi-calc-src.txt`).

## 0. Shared notes for all six routes

- **Nav: IDENTICAL to the homepage `Nav`** on all six routes (same announcement bar, same 1168x64 pill, transparent at the top → `#FAF7F1` + shadow once scrolled ≥160px, same mega-menus, same mobile banner and menu). Nothing route-specific: no different color over dark heroes, no hidden announcement bar.
- **Footer: IDENTICAL to the homepage `Footer`** on all six routes (1440: 434 tall; 390: 1091 tall "Phone" variant).
- **Framer borders are drawn on `::after`.** Framer puts borders on a `::after` pseudo-element (`[data-border]`), so they don't appear in a plain `getComputedStyle(el)`. Every border below was read from `getComputedStyle(el,'::after')`. In Tailwind use a normal `border` on the element (same box, since the `::after` is `inset:0`).
- **Scroll-reveal primitive used on these pages** (from the page modules, `__framer__styleAppearEffectEnabled`): `__framer__enter` = `{opacity:0, y:50}` (or `y:80`), animate to `{opacity:1, y:0}` with `{type:"spring", bounce:0.2, duration:1, delay:N}`, `__framer__threshold:0.5` (fires once 50% of the element is in view), `animateOnce:true`. framer-motion equivalent: `initial={{opacity:0,y:50}} whileInView={{opacity:1,y:0}} viewport={{once:true, amount:0.5}} transition={{type:'spring',bounce:0.2,duration:1,delay:N}}`. Measured on /memory: opacity goes 0.06→0.41→0.73→0.91→0.99 at 100ms steps after start, and y overshoots to about −1.1px before settling.
- **Hero load animation** on every route: H1 / subtitle / CTA use the §0 appear primitive (`y:200→0`, `opacity:0.001→1`, 0.7s tween; delays 0.2 / 0.3 / 0.4s). One difference: the **subtitle animates to `opacity:0.82`**, not 1 (`1aji4ln` → `animate.opacity 0.82`). Keep the subtitle at 0.82 opacity at rest.
- **Shared "product" logo ticker** (hero bottom on /memory, /video and /order-tracking). This is a VARIANT of homepage `hero/LogoTicker`:
  - ONE row only (the homepage has two). It moves **LEFT at 30 px/s** (rAF measured −30.0 px/s), linear, infinite, no hover pause.
  - Row box 1440x**100** (390: 45 tall). Logo gap **64px** (390: **40px**). The list is duplicated for the loop.
  - **Edge mask** on the `<section>` (the homepage has none): `mask-image: linear-gradient(to right, transparent 0%, #000 12.5%, #000 87.5%, transparent 100%)`. On 390 the stops are **10% / 90%**.
  - 29 logos, rendered at their natural SVG boxes (same at 390), all black or `#122023`. Local files `public/svg/ticker-logo-01.svg` … `ticker-logo-29.svg`, in this order (WxH): 01 176x32, 02 159x32, 03 209x32 (Madhappy), 04 167x32, 05 119x38, 06 111x40, 07 120x38, 08 91x44, 09 241x24, 10 99x44, 11 161x32, 12 207x38, 13 156x38, 14 71x38, 15 112x38, 16 150x24, 17 152x30, 18 188x40, 19 154x44, 20 126x38, 21 178x30, 22 103x30, 23 189x38, 24 86x44, 25 112x44, 26 144x30, 27 82x44, 28 121x30, 29 107x38. Each logo is vertically centered in the 100px row.
  - The component needs a `rows`/`mask`/`gap` prop or a sibling `ProductLogoTicker` that reuses the existing track CSS.
- **Section-title type** (same as the homepage): eyebrow Instrument Sans 600 16/22.4 ls 1.7 uppercase `#122023`; H2 Feature Deck Web Light (weight 400 on the Light file) 64/64 ls −1.28 `#122023`. Some product pages use a **bold eyebrow variant**: `<strong>` Instrument Sans **700** 16/22.4 ls 1.7 uppercase. On 390: H2 48/48 ls −0.96; eyebrow 14/19.6.
- **Body serif:** Tiempos Text Regular 400 18px/23.4px ls −0.18px (390: 14px/21px ls −0.14px), usually `#2A3639` or `#122023`, often at `opacity:0.8`.
- **Buttons:** "Book a demo" xlg = the existing `cta/BookDemoButton` (157x58, r16, p 18/24, Instrument Sans 600 18/21.6 white, rainbow gradient on hover). Unchanged.

---

## 1. /memory

Document height 1440: **6095** (main 5661 + footer 434). 390: **7130**. Page title "Siena Memory - The Agentic Brand Intelligence Layer".
Section order (1440): Hero 0–900 · Feature 1 900–1728 · Feature 2 1728–2556 · How it works 2556–3288 · Memory in action + testimonial 3288–4970 · CTA 4970–5661 · Footer.

### 1.1 Hero — NEW layout (reuses the product LogoTicker variant)
- Section "Hero": 1440x900 (`min-height:100vh`), flex column, justify and align center, **padding 180px 96px 120px**, overflow hidden, relative.
- Background: full-bleed `<img>` **`/assets/9ffhJgVx9g1qv0nTgqvc7QPif3o.png`** (soft blurred pink/orange photo of a woman with a phone; natural 6592x2881, downloaded at 2048w), absolute inset 0, `object-fit:cover`, center. No overlay, no gradient fade at the bottom.
- Text block "Title": max-width **1062** (x 189–1251), flex column, **left-aligned** (align flex-start), **gap 28px** between the (heading+sub) group and the button; heading → sub gap **18px**. z 1. The block's top is at y=306.
  - H1 "Capture every detail,<br>personalize every moment." (hard `<br>` after the comma). Feature Deck Web Light **300, 80px/80px, ls −0.8px**, `#122023`, left, 1062x160.
  - Sub "Siena Memory is the agentic brand intelligence layer that powers superhuman personalization and delivers insights that transform your business." Instrument Sans **500 20px/28px ls −0.2px**, `#122023`, **max-width 630px** (3 lines, 630x84), opacity **0.82**.
  - Book a demo xlg button at (189, 596).
- Ticker: absolute **top 800px**, left 0, right 0, height 100 (see §0, product ticker).
- Motion: appear H1 0.2s / sub 0.3s (to opacity 0.82) / button 0.4s. The image doesn't animate.
- **390:** section 390x649 starting at y 40 (under the nav), padding ≈ 96px 24px; same image `object-fit:cover`. H1 **56px/56px ls −0.56px** (342x280, 5 lines) at y 136. Sub **16px/22.4px ls −0.16px** (342x90) at y 434. Button at y 552. Ticker at **y 628**, 45 tall, gap 40, mask 10%/90%.

### 1.2 "Feature 1" (text left, chat mock right) — NEW (product "feature row" pattern; see /video and /order-tracking)
- Section: **max-width 1200**, centered (x 120–1320), 828 tall, bg `#FFFFFF`, flex row, **gap 64px**, justify and align center, **padding 80px 96px** (content 1008 wide), overflow hidden.
- Left text column "Title": 416 wide (max 512), flex column, **gap 32px**, justify center; inner (eyebrow+H2) group gap **24px**.
  - Eyebrow (bold variant) "AI AGENT THAT REMEMBERS": `<p><strong>`, Instrument Sans **700** 16/22.4 ls 1.7 uppercase `#122023`.
  - H2 "Turn interactions into personalized experiences": 64/64 ls −1.28, 416x256 (4 lines).
  - Body "Siena Memory remembers key details like preferences or feedback and applies them in future interactions. No repetition, just human-like context that makes every customer feel uniquely known.": Tiempos 18/23.4 ls −0.18 `#2A3639`, 416x117, max-width 564.
- Right "Image - portait": **528x668**, radius **24px**, padding **56px**, flex column center, gap 16. Background `<img>` **`/assets/OS7uIQBhEtXd5l7MXZ0qAcM0Lg.png`** (already in public/assets), `object-fit:cover`, r24.
  - Chat stack (416 wide, flex column, **gap 16px**), 7 rows from top to bottom:
    1. Customer row (flex row, gap 10, align flex-end, justify center): avatar 40x40 circle (r99, overflow hidden, **2px solid #FFFFFF** border) holding `/assets/D3TQ38q4HpOxmxHoD1u1AW40NI.png` (38x57, absolute top −3 left 1 right 1 bottom −14, cover) + bubble bg **`#F3F0EB`**, r16, padding **20px**, max-width 387: "Has my sculpting shorts order shipped yet?"
    2. Siena row (justify flex-end, gap 10): gradient-border bubble. Outer "Border" r16 padding **2px**, `background: linear-gradient(255deg, #F2E59A 0%, #FEC796 14.8649%, #FB5646 32.8829%, #827ACC 52.2523%, #2E79D8 79.7297%, #ABABAB 100%)`. Inner bubble bg **`#EFE5D0`**, r16, padding 20: "Just went out! You'll have it Friday." Then the Siena avatar: 40x40 circle bg `#122023` with the white "S" glyph `public/svg/memory-siena-avatar-glyph.svg` (12x13) centered.
    3. Customer: "Perfect! Hope XL fits, sometimes I need Large."
    4. Divider row (416x22, flex row center): 143x1 line `#F3F0EB`, then a pill (131x22, bg `#F3F0EB`, r50, padding 4px 12px, gap 10, **1px solid #CDBCA0** border) with an FA Sharp Light 12px clock icon (U+F017) `#605C53` and "5 WEEKS LATER" (Geist Mono 400 10/14 ls 0.5 uppercase `#605C53`), then another 143x1 line.
    5. Customer: "Looking for those sculpting shorts in high-waisted."
    6. Siena (gradient border): "We have those! You mentioned being between L and XL before. Which worked better?"
    7. Customer: "XL was loose. L would be perfect!"
  - Bubble text: Tiempos Text Regular 400 **14px/18.2px**, `#122023`. Each bubble hugs its text width (bubble widths 380/352/387/380/287).
- **Motion (exact, from the page module):** each row is a scroll-reveal (`threshold 0.5`, once). Row 1 enters from `{opacity:0, y:80}`; rows 2–7 enter from `{opacity:0, y:50}`. All use spring `bounce 0.2, duration 1`. **Delays: 0.5, 1.0, 1.5, 2.0, 2.0, 2.5, 3.0 s** for rows 1–7 (rows 4 and 5 share 2.0). rAF check: starts measured 0.5s apart; each row reaches 99% in ≈0.42s.
- **390:** section 390x938, flex **column**, gap **32px**, padding **56px 24px**. Order: eyebrow (14/19.6) → H2 48/48 (342x144) → body (Tiempos 14/21) → image card **342x514** (r24; chat stack inset 24px from the card edges; bubbles **≤244 wide**, padding **10px**, text 14/18.2, avatars unchanged).

### 1.3 "Feature 2" (text left, image right) — NEW, same pattern as 1.2
- Same box as Feature 1 (1200 max, 828 tall, padding 80/96, row gap 64).
- Text column gap **48px** between the text group and the button; inside, text group gap 32, eyebrow+H2 gap 24.
  - Eyebrow (bold) "TAP INTO EVERY CONVERSATION".
  - H2 "Unlock high-fidelity insights like never before" (416x256).
  - Body "Memory transforms conversations into precise, actionable insights. See emerging trends, hidden issues, and exactly what customers care about, in seconds." (Tiempos 18/23.4 `#2A3639`).
  - Book a demo xlg.
- Right: 528x668 r24 **image only**: `/assets/d1NEs0VIe4aSoSGCYqjR4UG4QD8.png` (natural 972x1230, cover). The dark laptop photo, Siena "S" logo and 3 insight cards ("Customers most often mention gym trainers as how they found us", "Widget loading errors reported also mention browser version 2.4", "Subscription pauses spike during travel season — offer travel packs") are **baked into the PNG**, not DOM.
- No reveal animation on this section.
- **390:** column, gap 32, padding 56/24, 390x872: eyebrow → H2 (342x144) → image **342x433** → body (14/21). **The button is hidden on mobile** (no "Book a demo" in this section at 390).

### 1.4 "How it works" — VARIANT of homepage `Metrics` shell (same bg-image + cream card), NEW content
- Section "Metrics": 1440x732, flex row center, padding **80px 96px**, overflow hidden. Background `<img>` `/assets/5VTp1YGCJLYo9Grib0Ouvyooeag.webp` (the same file as the homepage Metrics), cover. **No bottom "Blur out" fade** here (homepage has one).
- Card: max-width **1062** (homepage 1328), 1062x572, bg `#F3F0EB`, **r48**, **padding 64px**, flex column, **gap 40px**.
  - Title group (934 wide, flex column, gap 10, left-aligned): eyebrow (600) "HOW IT WORKS" + H2 "The agentic brand<br>intelligence layer" (472x128, 2 lines, hard break).
  - Columns row: flex row, **gap 32px**, 3 columns of **290** (max 416), each flex column, **gap 16px**, **padding-top 32px**, with a **1px top border `rgba(0,0,0,0.2)`**:
    - Icon: Font Awesome 6 Sharp Light **24px**, `#122023`. Codepoints: Capture U+F890, Generate U+F06E (eye), Act U+F6A3. Substitute equivalent SVGs or use the existing FA Sharp Light woff2.
    - H3: Feature Deck Web **Regular 400 32px/38.4px** `#122023`: "Capture" / "Generate" / "Act".
    - Body: Tiempos 18/23.4 ls −0.18 `#122023`, **opacity 0.8**: "Memory captures insights from every conversation. Then builds a complete 360° customer profile and references them in future interactions." / "Then Insights generates actionable reports you can share with your entire team. Get weeks of analysis done in minutes." / "Turn insights into strategic actions that move your business forward. Proactively resolve issues, shape product roadmaps, or tailor marketing campaigns."
- No count-up and no reveal animation.
- **390:** section 390x1127, padding 56px 24px; card 342 wide, **padding 40px 32px**, **r32**, gap 40. H2 48/48 (278x192, 4 lines). Columns stack (column, each padding-top 32, gap 16 inside); H3 **28px/33.6px**; body 14/21.

### 1.5 "Memory in action" carousel + testimonial (one cream section) — NEW carousel; testimonial is a VARIANT of `Testimonials`
- Section: 1440x1682, bg **`#F3F0EB`**, flex column, align center, **gap 72px**, **padding 80px 96px 56px**, overflow hidden, relative.
  - Decorative blob "Certifi-bg": absolute `top:-195px; left:-102px; right:-101px` → 1643x1377, z 0, `<img>` `/assets/vOpdH6bt6rHWgyec84XjbD1Lbgc.webp` (pastel rainbow blur), cover. It sits behind both the cards and the testimonial. The section's `overflow:hidden` clips it at the section edges.
- Title row (1248 wide, flex row, justify center, align flex-end, gap 24, max 1325) → inner column 1062 wide, gap 10, left: eyebrow (600) "BRANDS LOVE CAPTURING" + H2 "Memory in action" (448x64).
- **Carousel (Framer SlideShow, exact props from the page module):** container 1062x330 (x 189–1251) at y 3612 (block gap 52 below the title row, align flex-end).
  - `itemAmount: 4` visible, **gap 24**, `direction: "left"`, `autoPlayControl: true`, **`intervalControl: 1.5`** (one step every 1.5s), `dragControl: true`, `startFrom: 0`, alignment center, infinite loop (slots duplicated), `playOffscreen: false` (pauses when out of view). Transition: **spring `{stiffness:200, damping:40, mass:1}`**. Measured step = 271.5px (one card + gap). Displacement reaches about 50% at 110ms, 90% at 330ms and 99% at 620ms; it settles in about 1s.
  - Arrows: `arrowPosition: "top-right"`, `arrowPaddingTop: -85`, `arrowPaddingRight: 80`, `arrowGap: 10`, `arrowSize: 40`, `arrowFill: transparent`, radius 0. Left `/assets/xZOS9ivaVqrdrylU8tlXkU4nk.png`, right `/assets/tetr5vA8U5aSyL8yw8kUnqB5Mg.png` (50x50 PNGs shown at 40x40). They render at x 1081 / 1131, y 3527 (85px above the cards, 80px in from the right edge). Clicking an arrow advances one card with the same spring. No progress dots, no fade edges, and the cards have no hover effect (`effectsScale 1`, `effectsRotate 0`).
  - Card: **248x330** (= (1062 − 3·24)/4), bg `#FFFFFF`, **r24**, **padding 24px**, flex column, gap 24, justify flex-start.
    - Text block 200 wide (fixed 232 tall), flex column, **gap 12px**, **padding-bottom 24px**, **1px bottom border `rgba(0,0,0,0.2)`**, overflow hidden: FA Sharp Light **20px** icon (opacity 0.8) → H3 Feature Deck Web Regular **24px/33.6px** `#122023` → description Tiempos 18/23.4 ls −0.18 `#122023` opacity 0.8.
    - Logo row below (height 20–24, left-aligned, flex row gap 10): a brand logo, black.
  - 14 cards, in slot order (title — description — icon codepoint — logo file @ rendered size):
    1. Preference — "Capture customers’ explicit or implicit likes, dislikes, style choices, or brand affinities." — U+F004 — `svg/ticker-logo-13.svg` @82x20
    2. Social — "Capture what customers are commenting on social media about our products." — U+F3CE — `ticker-logo-15.svg` @71x24
    3. Coffee choice — "Capture things that customers tell you about their coffee consumption and preferences." — U+F7B6 — `ticker-logo-18.svg` @113x24
    4. Friends&Fam — "Capture things that show our customers are referring Earth Breeze to friends and family, and advocating for us." — U+E300 — `/assets/y27Z3JPTR70wZ1vySbDPnp3REZI.svg` (Earth Breeze) @35x24
    5. Promos — "Capture details that tell you about issues users have understanding their promotion." — U+F02B — `ticker-logo-07.svg` @63x20
    6. Birthday — "Capture the customer’s birthday and their family members’ birthdays." — U+F1FD — `svg/memory-card-logo-birthday.svg` @99x20
    7. Shade — "The customer mentions their favorite colors and shades." — U+F5C3 — `ticker-logo-10.svg` @54x24
    8. Feedback — "Customers’ opinions — positive or negative — about products, services, and experiences." — U+E214 — `ticker-logo-06.svg` @56x20
    9. Hair type — "Capture interest in styling options for straight hair, specifically inquiring about achieving waves." — U+F0C4 — `ticker-logo-11.svg` @101x20
    10. Milestones — "Specific details provided by customers that help Siena personalize interactions like events." — U+F091 — `ticker-logo-08.svg` @50x24
    11. Travelers — "Customers who frequently travel and need on the go options that are portable." — U+F072 — `ticker-logo-20.svg` @66x20
    12. Delight — "Standout customer moments that show exceeded expectations and brand loyalty." — U+E31B — `ticker-logo-01.svg` @110x20
    13. Inventory — "When customers bring up sold-out products, delays, or order changes due to inventory." — U+F672 — `ticker-logo-09.svg` @181x18
    14. Subscription — "Capture customer opinions about the Loftie+ subscription, including reasons." — U+F2F1 — `ticker-logo-22.svg` @69x20
    (Logo SVGs are scaled down from their ticker size, `width:auto; height:20–24px`.) At 1440 the initial view shows cards 9–12 (Hair type, Milestones, Travelers, Delight) at x 189 / 461 / 732 / 1004.
- **Testimonial card** (Testimonials 1248 wide row → "content" box): max-width **1062**, 1062x900, **r24**, **padding 24px 16px**, `background: linear-gradient(180deg, #FFFFFF 0%, #F3F0EB 100%)`. It's 72px below the carousel.
  - Inside: the **same slider component as homepage `Testimonials`** (controls row on top centered, prev/next 40x40 r40 bg **`rgba(244,237,222,0.6)`**, Inter 400 14/16.8 counter "1" + " / 4" (opacity 0.4), chevron svgs `public/svg/slider-prev-chevron.svg` / `slider-next-chevron.svg`; inner padding **16px 32px 48px**; slide row gap 40; slide-change animation identical, no autoplay).
  - Diffs vs homepage: 4 slides; content width 966 → columns **463 + 463**; image **463x463** r32; quote 25.6/33.28 ls −0.512 (same); name Instrument Sans 500 20/28 (same); **role: Instrument Sans 600 12px/16.8px ls 0.6px uppercase `#787368`** (source text is Title Case, e.g. "Associate Director, Customer Strategy & Operations"; CSS uppercases it) (homepage uses 16px ls 1.7 ink). Brand logo 140x64 contain; quote mark `public/svg/memory-quote-mark.svg` 30x24. No "Read full story" button. No play badge.
  - Slides:
    1. "Memory is so cool. We used Siena Memory in a unique way this week for our price increase—flagging all tariff and price-increase inquiries and automatically routing them to a senior associate for precisely worded responses. This kept sensitive conversations on-brand, avoided disruption to the regular queue, and held both CSAT and FRT steady. We also leveraged Memory for specific feedback related to the increase, running it through ChatGPT to compare it with last year's feedback. Really fun stuff!" — Rebecca Blount — ASSOCIATE DIRECTOR, CUSTOMER STRATEGY & OPERATIONS — logo `/assets/ZeJTO989NVjG9cfH69ugd19p4C0.svg` (Coterie, 374x76) — photo `/assets/DkKUcZ5MMlNWr9dt9V653q2eWmI.jpg`
    2. "Our customers are at the heart of everything we do at Earth Breeze. Siena "Memory" has added to our ability to be unlimited in gathering insights and information that allow us to serve our customers at the highest level." — Ginger Lamb — VP OF CUSTOMER DELIGHT — logo `/assets/y27Z3JPTR70wZ1vySbDPnp3REZI.svg` — photo `/assets/nV1IWjY6I2CSokNrD6kB1ifPf5s.jpg`
    3. "Siena Memory is already a gamechanger for our business. With a complex product like ours, customers deeply appreciate when we remember their past interactions—it helps our team and Siena resolve issues more quickly and deliver truly tailored support. What’s equally exciting is how Memory Insights has unlocked a new way to share the voice of the customer. We now give cross-functional teams detailed, nuanced visibility into community experience like never before." — Cate Marques — CXO — logo `/assets/FAmVCc3xLG8QUhmtyJ3WkBGEeU.png` (Terra Kaffe) — photo `/assets/WVZA37Bad6K0ss9JDOjwLhH2aUs.webp`
    4. "I can't wait to utilize Memory categories to pull together product suggestions to share with our product development team!" — Sydney Chestler — DIRECTOR OF CUSTOMER EXPERIENCE — logo `/assets/viVxpvqRgp5ynnq499GrMlfB0Ac.svg` — photo `/assets/vA3hb562f7DMVcRPweuwrDgyxyo.jpg`
- **390:** section padding **56px 0**, gap 40. Title 342 wide (padding 0 24). Carousel 358 wide (x 16–374): **`itemAmount 2`, gap 16, `startFrom 2`**, arrows `arrowPaddingRight 24`, still top −85. Cards **171x330**, H3 **18px/25.2px**, desc Tiempos 14/21. Tablet (810–1199): `itemAmount 3`, gap 16, `startFrom 3`. Testimonial: image first, 320x320; quote **19.2/24.96 ls −0.384**; name **16/22.4**; logo 140x64 and person block side by side (person x 188); same as the homepage mobile slider.

### 1.6 CTA — VARIANT of `MainCta`
- Same structure: 1440x**691**, padding 200px 96px, bg image `/assets/ERYNplIY591uk80wpoa4JGglO8.webp` cover, card max 1062, `#F3F0EB`, r48, p64, inner gap 41.
- Diffs: H2 **"Turn conversations into intelligence"** (1 line, 934x64) → card 1062x291. The top fade is **120px tall**, `linear-gradient(180deg, #F3F0EB 11%, rgba(250,247,241,0) 77%)`, absolute top −1px, z 1 (homepage: 187px `#FAF7F1`→transparent), because the section above is `#F3F0EB`.
- Needs MainCta props: `title`, `fadeFrom` (`#F3F0EB`), `fadeHeight` (120), `fadeStops` (11% / 77%).
- **390:** 390x746, card 342x346 at y 5504 (r32, p32), H2 48/48 278 wide (4 lines), fade 50px tall.

### 1.7 /memory assets
New downloads (`public/assets/`): `9ffhJgVx9g1qv0nTgqvc7QPif3o.png` (hero bg), `d1NEs0VIe4aSoSGCYqjR4UG4QD8.png` (feature 2), `vOpdH6bt6rHWgyec84XjbD1Lbgc.webp` (cream-section blob), `xZOS9ivaVqrdrylU8tlXkU4nk.png` / `tetr5vA8U5aSyL8yw8kUnqB5Mg.png` (carousel arrows), `y27Z3JPTR70wZ1vySbDPnp3REZI.svg` (Earth Breeze logo), `nV1IWjY6I2CSokNrD6kB1ifPf5s.jpg`, `vA3hb562f7DMVcRPweuwrDgyxyo.jpg` (testimonial photos).
Already present and reused: `OS7uIQBhEtXd5l7MXZ0qAcM0Lg.png`, `D3TQ38q4HpOxmxHoD1u1AW40NI.png`, `5VTp1YGCJLYo9Grib0Ouvyooeag.webp`, `ERYNplIY591uk80wpoa4JGglO8.webp`, `DkKUcZ5MMlNWr9dt9V653q2eWmI.jpg`, `ZeJTO989NVjG9cfH69ugd19p4C0.svg`, `FAmVCc3xLG8QUhmtyJ3WkBGEeU.png`, `WVZA37Bad6K0ss9JDOjwLhH2aUs.webp`, `viVxpvqRgp5ynnq499GrMlfB0Ac.svg`.
SVG (`public/svg/`): `ticker-logo-01…29.svg`, `memory-card-logo-birthday.svg`, `memory-siena-avatar-glyph.svg`, `memory-quote-mark.svg`, `slider-prev-chevron.svg`, `slider-next-chevron.svg`, `memory-footer-siena.svg` (same wordmark as the footer; the existing `footer-logo-siena.svg` is fine).
No video, no Lottie.

---

## 2. /video

Document height 1440: **6331**. 390: **9087**. Title "Siena Video …". Section order (1440): Hero 0–1216 (`#F3F0EB`) · Features title + sticky Scroll Area 1216–4126 · How it works 4126–5142 (`#FAF7F1`) · CTA 5142–5897 · Footer.
Shared visual atoms on this page (also used on /order-tracking):
- **Gradient-border bubble ("Review")**: outer `padding:1px` (2px on the "Border" variant), `border-radius:16px`, `background: linear-gradient(255deg, #F2E59A 0%, #FEC796 14.8649%, #FB5646 32.8829%, #827ACC 52.2523%, #2E79D8 79.7297%, #ABABAB 100%)`, `backdrop-filter: blur(6px)`. Inner: bg `#FFFFFF` (Siena replies in the "Border" variant: `#EFE5D0`), r16, padding 10px. Text: Tiempos 18/23.4 ls −0.18 `#2A3639` (390: 14/21 ls −0.14).
- **Video frame ("Card")**: outer 518x296, padding 2px, r16, no bg. Inner "01": bg `#FAF7F1`, **r15**, **padding 8px**. Video box 498x276 (r10, overflow clip), `<video muted loop playsinline autoplay>` `object-fit:cover`. Framer also renders a blurred "glow" copy (inset −13/−18/−9/−18, opacity 0.5, `filter: blur(14px)`) whose source is `framervideos.b-cdn.net/Abstract Landscape Moving Shapes.mp4`. **That URL returns HTML (broken), so the glow renders nothing on the live site. Omit it.**
- **Status chip**: bg `#FAF7F1` (white `#FFFFFF` inside the how-it-works section), r16, padding 12px 16px, Tiempos 18/23.4 `#2A3639`. Chips are separated by a "•" (Feature Deck 400 16/19.2 `#414D4F`), row gap 8.
- **Agent note**: 394x60 (gallery 373x60), bg `#FFFFFF`, r16, padding 12px 12px 12px 20px, flex row space-between, align center. Title `<h6>` Feature Deck Web **Regular 400 24px/33.6px** `#122023` (390: 18/25.2) + a 52x36 dotLottie "…" typing indicator (`/lottie/uznXokyKNrzxLiEzeS9ckfp3Ba4.json`, 60fps, loop, autoplay; three dark `#122023` dots).
- **Four-point star bullet** (24x24) is the same SVG as the homepage ScrollArea bullet (path starts `M14.9848 14.9828…`). Reuse it. Sparkles icon `public/svg/video-sparkles-two-2-c40439.svg` (24x24).

### 2.1 Hero — NEW (centered text + animated video mock + logo ticker)
- Section 1440x**1216**, bg `#F3F0EB`, flex column center, **padding 180px 96px 0**, overflow hidden.
- Title column (max-width 1300, 1248 wide): flex column center, **gap 28px**, **padding-bottom 48px**; heading → sub gap 18.
  - H1 "Introducing Video": Feature Deck Web Light 300 80/80 ls −0.8, **center**, 1 line.
  - Sub "Siena brings the same intelligence to video that transformed how you handle images. Warranty claims, damage assessments, and product guidance are handled automatically.": Instrument Sans 500 20/28 ls −0.2, center, max-width 630, opacity 0.82.
  - Book a demo xlg, centered (y 390).
  - "Visual" (672x430, z −1, y 476; reference crop `recon/pages-b/video-1440-hero-visual.png`):
    - Content stack centered at (336, 202) inside Visual (`left:336; top:202; translate(-50%,-50%)`), flex column, gap 24: video Card 518x296 with `/assets/7DsxIASjdBjpJcPHLI0CK32RvwA.mp4` (1280x720, 5.0s loop; living room with a leather sofa), then an agent note "Analyzing provided video" + lottie dots.
    - Progress bar on the video's bottom edge: 498x5 at `top:271.5px` inside the video box, z 2. Track `#D0D2D3` r48, fill r48 `linear-gradient(92deg, #F2E59A 0%, #FEC796 20.8323%, #FB5646 45.0126%, #827ACC 68.821%, #2E79D8 84.4452%, #294FBA 100%)`. It's already at full width at load and stays full (sampled 0.5–15s), so render it static and full.
    - Play badge 56x55 centered on the video (`top:140; left:308`): the same art as homepage `public/svg/play-badge-circle.svg` + `play-badge-triangle.svg` (white 43x43 circle, coral 15x19 triangle).
    - Left customer bubble (gradient border p1, inner white): "Help me choose a rug that matches my living room style", 209x92, at `left:-51px; top:47px` of Visual (overhangs the video's left edge).
    - Right Siena bubble ("Border" p2, inner `#EFE5D0` r15 p20): "This rug would fit your space perfectly, here is my top pick!", 220x114, at `left:537px; top:183px` (overhangs the right edge). Brand avatar `/assets/97FwNezELUd8Kd9HdHn3le688Ks.png` (244x244 "S" badge, contain) **52x52** at the bubble's top-right corner (`top:-23px; right:-22px`).
  - Logo row at y 954: **max-width 1200** (x 120–1320), 100 tall, product-ticker styling (gap 64, mask 12.5%/87.5%). It **moves LEFT at 30 px/s** like the other product tickers (re-measured after the first scroll: −29.98 px/s). Framer's ticker sits still at a small offset (`translateX(-22px)`) until it initializes after the first scroll or interaction, so it can look static in an untouched page. Just start it on mount. Logos in order: ticker-logo 01, 02, 03, 04, 05, 06, 07, **09, 08**, 10, 11, 12, **12** (twice), 13, 14, 15, 16, 17, 18, 19, 20.
  - Bottom fade "Rectangle 7061": 1672x162 at `left:-116px`, y 1054 (bottom of hero), `linear-gradient(180deg, #F3F0EB 0%, #FFFFFF 100%)`.
- **Load motion** (exact): H1 appear 0.2s / sub 0.3s (→0.82) / button 0.4s (§0 primitive). Video card (`1t8z8cb`): `opacity 0.001→1`, tween **0.4s, delay 0.2s, ease [0.44,0,0.56,1]**, no y. Agent note: from `{opacity:0, y:20}`, spring bounce 0.2 **duration 0.8 delay 0.2**. Lottie (`y5k8nv`): `opacity 0.001→1`, spring bounce 0.2 duration 0.4 **delay 1.0**. Left bubble: from `{opacity:0,y:20}` spring 0.8 **delay 0.1** (on mobile the `{y:50}` / delay 0.6 variant is used). Right bubble: from `{opacity:0,y:50}` spring bounce 0.2 duration 1 **delay 1.0**. All of these are in view at load, so they play immediately.
- **390:** Hero 390x1099 from y 40, padding **96px 24px 0**. H1 56/56 ls −0.56 (342x112), sub 16/22.4 (342x90), button at y 384. Visual: video frame 338x220 (video 322x204), left bubble 154x85 (text 14/21) at x 9 y 461, right bubble 158x87 at x 209 y 674 (inner padding 10), brand avatar 52 at (335, 633), agent note 336x60 (h6 18/25.2) at y 755. Logo row y 916, 45 tall, gap 40, mask 10/90, −30 px/s. Bottom fade 458x162 at y 977.

### 2.2 Features title + sticky Scroll Area — VARIANT of homepage `ScrollArea`
- Wrapper "Features": 1440 wide, flex column center, padding **80px 0 0**. Title (max 1062, flex column center, gap 24): eyebrow "VIDEO UNDERSTANDING FOR CX" (600, centered) + H2 "Customers show, Siena resolves" (64/64, center, 1062x64).
- Scroll Area: **same geometry as the homepage** (1440x2720, flex row, gap 64, padding 0 96, left Content column 512 with 3 blocks of 512x900 and gap 10; right "Sticky" column 512x900, `position:sticky; top:0`, padding 110px 0 40px; inner "Sticky Image" 512x647 r24). The left column is at x 176 and the sticky column at x 752.
- Left block diffs vs the homepage:
  - Heading is an **`<h3>` Feature Deck Web Regular 400 52px/62.4px** `#122023`, left (the homepage uses an H2 in Light 64/64).
  - A paragraph follows the heading: Tiempos Text Regular **20px/28px**, ls normal, **`#000000`**, 512 wide.
  - Text-content stack gap **32px** (heading → paragraph → bullets → button). Bullets: gap 12, row gap 10, star 24 + Tiempos 18/23.4 `#2A3639`.
  - Only block 3 has the Book a demo button.
  - Copy:
    1. "Process warranty claims faster" — "Customers show you damaged products on video. Siena watches, understands, and resolves claims without your team ever pressing play." — • Instant damage assessment • Automated claim decisions • Scale without adding headcount
    2. "See what customers see" — "When customers show instead of tell, Siena gets the full picture. Visual context means faster resolution and happier customers." — • Product defect verification • Visual troubleshooting • Shipping damage evaluation
    3. "Give your team hours back" — "Every video ticket used to mean watching, pausing, screenshotting, and documenting. Siena handles all of it instantly so your team focuses on work that matters." — • Hours saved per agent weekly • Faster ticket resolution • Higher team capacity — [Book a demo]
- Sticky visual diffs: **no background image**, just a transparent 512x647 r24 box. One "Stage" group (518x296) is centered in it (`left:256; top:323.4; translate(-50%,-50%)`). The active stage follows the left block (same IntersectionObserver rule as the homepage: block crosses 50% of the viewport). Stage cross-transition: spring bounce 0.2 **duration 0.4**. Reference crops: `recon/pages-b/video-1440-Sticky-1.png`, `-2.png`, `-3.png`.
  - **Stage 1:** video Card with `/assets/x4A0FFLvT1jKKMmC1BeB2sDrts.mp4` (headphones unboxing). Chip row 463x47 centered **92px above** the card (`top:-92px`): "Order #4521" • "Shipped: Jan 23" • "ETA Jan 29". Customer bubble 209x116 at the card's top-left (`left:-13px; top:16px`): "My headphones came damaged out-of-the-box, is this covered by the warranty?"
  - **Stage 2:** same card and customer bubble. Chips become "Order #4521" • "01/07/2025" • "ETA Jan 29" (row 422 wide). A Siena reply bubble appears at the bottom-right (299x69, at card x+269, y+193, overhanging right): "I can see the damage. Your replacement ships today" + 24px sparkles icon (text container flex row gap 20).
  - **Stage 3:** chips back to "Shipped: Jan 23"; the customer bubble is gone. Product card 278x155 centered over the video (gradient border p1 r16, backdrop blur 6). Inner bg `rgba(255,255,255,0.98)`, r16, padding 14, gap 16, `backdrop-filter: blur(9.6px)`:
    - Row (gap 12.8): thumbnail tile 71x71 (bg `#FFFFFF`, r12.8, padding 6.4) holding `/assets/T0wEls4P32RuHyeqKeEOU1f6SQs.png` 58x58 r8 cover; text column (gap 6.4): "Headphone Set BH2143 Hi-Fi" (Tiempos 18/23.4 `#2A3639`, 2 lines) + "Replacement shipped" (Tiempos 14/18.2 `#122023`).
    - 1px divider `#E1E1E1`.
    - Row space-between: "Arriving:" / "Jan 9" (Instrument Sans 400 14/21 `#74777A`).
    - Blue check badge 57x57 overlapping the bottom center: `public/svg/video-icon-button-916924.svg`.
  - Element entrance inside a stage (scroll-reveal, threshold 0.5, once): Card from `{opacity:0,y:50}` spring **bounce 0.1, duration 1, delay 0.2**. Customer/Siena bubbles from `{opacity:0,y:50}` spring bounce 0.2 duration 1 **delay 0.6**. Chips from `{opacity:0,y:50}` tween ease **[0.44,0,0.05,1]** with durations **0.6 / 1.5 / 2.6 s** (chip 1/2/3, delay 0). This gives a cascading slide-up.
- **390 (no sticky; stacked):** Features padding 56px 0 0; title eyebrow 14/19.6 + H2 48/48 center (342x96). Scroll Area padding **64px 24px**, Content column (342) gap **80px**. Each block is a flex column, **gap 40px**: heading **H2 Feature Deck Web Light 48/48 ls −0.96 left** (342x96) → paragraph Tiempos 20/28 `#000` → bullets (Tiempos 14/21, star 24, rows 33px apart) → the block's own mobile stage visual (340x296; chips row 123px above the card; video 320x276). Block 3 has the button between the bullets and the visual. Stage-2 mobile chips stack in two rows ("Order #4521 • 01/07/2025" then "Within 30 days guarantee"). Stage-3 mobile shows "ETA Jan 31".

### 2.3 How it works — NEW (gallery animation + 3 columns like /memory 1.4)
- Section "Your team of expert agents": 1440x1016, bg **`#FAF7F1`**, flex column center, **gap 72px**, padding **80px 96px**. Fades: top "Blur out" 1440x75 `linear-gradient(180deg, #FFFFFF 0%, #FAF7F1 100%)`; bottom "Blur out" 1440x75 `linear-gradient(180deg, #FAF7F1 40%, #FFFFFF 100%)`.
- Title (center, gap 24): eyebrow "HOW IT WORKS" + H2 "Video intelligence for customer service" (1062x64, 1 line).
- Container (max 1200, flex column, gap 72):
  - "Card/Gallery" 1200x382, padding 32, r24, transparent → "Card grid" 960 wide (x 152–1112), 318 tall, absolute children (reference crop `recon/pages-b/video-1440-Card_grid.png`):
    - Video card 428x245 at (24, −6) in the grid: frame `#FAF7F1` r15 p8, video 408x225 `/assets/4gloqJyU9yH0U5zKatZKkGxpiA.mp4` (espresso machine).
    - Customer bubble 209x116 at (131, 198): "My espresso is coming out watery. Can you see what I'm doing wrong?"
    - Right column 373 wide at (587, −40), flex column center, gap 16:
      - Agent note 373x60 "Analyzing video" + lottie. **The text animates per character:** each glyph from `{filter: blur(10px), opacity: 0.001, y: 10}` to normal, spring bounce 0, duration 0.4, **stagger 0.05s per character**, starts on mount.
      - Three white chips (gap 16, centered, widths 360/337/219): "Recognizing brand, product, and model", "Pulling info from the documentation", "Checking video details".
      - A dashed vertical connector behind the chips (1px wide, about 274 tall, ending in a 14x7 chevron arrow) runs from the note down to the answer bubble.
      - Siena answer bubble 357x92 (gradient p1, inner white p10, text row gap 20 + sparkles 24): "Your grind is too coarse. Try a finer setting and tamp with more pressure."
    - **Timeline (exact; scroll-reveal threshold 0.5):** video card spring bounce 0.1 dur 1 delay 0.2 (y 50→0). Customer bubble spring 0.2 dur 1 **delay 0.6**. Agent note from y 20, spring 0.8 delay 0.2. Chip 1 tween 0.6s **delay 1.0**, chip 2 tween 1.5s **delay 2.0**, chip 3 tween 2.6s **delay 3.0** (all ease [0.44,0,0.05,1], from `{opacity:0,y:50}`). Connector: from `{opacity:0, scale:0.1, y:-130}` to identity, tween **5s delay 2s ease [0.44,0,0,0.99]**; **`animateOnce:false`**, so it replays every time it re-enters view. Answer bubble spring 0.2 dur 1 **delay 4.0**. Measured: chip 2 at 2.6s was op 0.79 / y +10.5; chip 3 at 4.0s op 0.75; everything settled by 8s.
  - Columns row (max 1325, flex row, **gap 32**): 3 columns **379** wide (same column style as /memory 1.4: padding-top 32, 1px top border `rgba(0,0,0,0.2)`, gap 16, FA Sharp Light 24px icon, **`<h5>`** Feature Deck Web Regular 32/38.4, body Tiempos 18/23.4 `#122023` opacity 0.8):
    - Capture (U+F019 download) — "Customers send videos through Live Chat, Helpdesks or integrations like Hark. Siena picks them up automatically, no configuration needed."
    - Understand (U+F002 magnifying glass) — "Siena watches every frame and extracts what matters. Damaged products, missing parts, shipping issues, defects. Context your team would spend minutes gathering."
    - Resolve (U+F00C check) — "Claims processed, tickets updated, customers answered. What used to take manual review now happens instantly, at any volume."
- **390:** section padding **56px 24px**, gap 40, overflow hidden, 390x1744. Title eyebrow 14 + H2 48/48 center (342x144). The gallery stacks: customer bubble (x 102, y 4596) above the video card (video 293x159), then the agent note (h6 18/25.2, per-char animation unchanged), chips (Tiempos 14/21), then the answer bubble. Columns stack (gap ≈ 64 between columns, each padding-top 32): H5 **28/33.6**, body 14/21.

### 2.4 CTA — homepage `MainCta` with no top fade
- 1440x755, the same layout and copy as the homepage: H2 "See how fast-growing brands scale with Siena" (934x128), card 1062x355, padding 200/96, image `ERYNplIY591uk80wpoa4JGglO8.webp`.
- One diff: there's **no top "Blur out" gradient**, because the section above already fades to white. Use `fade={false}`.
- **390 (bug on the live site; replicate only if pixel-perfect is required):** the Main wrapper renders an **empty white 390x1000 "Phone" frame** (padding 64/24/80) before the CTA. The CTA frame then keeps the desktop **padding 200px 96px** (390x986), so the card is only **198 wide** (padding 32, r32) and the H2 (48/48) wraps to 9 lines in 134px. Recommended: reuse the normal `MainCta` mobile layout and note the deviation.

### 2.5 /video assets
New: `public/assets/7DsxIASjdBjpJcPHLI0CK32RvwA.mp4` (hero, 1280x720, 5s), `x4A0FFLvT1jKKMmC1BeB2sDrts.mp4` (sticky stages), `4gloqJyU9yH0U5zKatZKkGxpiA.mp4` (gallery), `T0wEls4P32RuHyeqKeEOU1f6SQs.png` (headphone thumbnail), `97FwNezELUd8Kd9HdHn3le688Ks.png` (Siena "S" brand badge 244x244); `public/lottie/uznXokyKNrzxLiEzeS9ckfp3Ba4.json` (dotLottie typing dots, 6.4 KB, rendered 52x36; the live site uses `<dotlottie-player>`, use `lottie-web`/the existing `LottiePlayer` with loop+autoplay).
SVG: `public/svg/video-icon-button-916924.svg` (57x57 blue check badge), `video-sparkles-two-2-c40439.svg`, `video-star-four-light-1-4345a8.svg` (= homepage bullet star), `video-variant-2-3d84a5.svg` (= play triangle), ticker logos as above.
Not downloaded: `framervideos.b-cdn.net/Abstract Landscape Moving Shapes.mp4` (the URL serves HTML; the glow layers are invisible on the live site).

---

## 3. /order-tracking

Document height 1440: **5950**. 390: **7123**. Section order (1440): Hero 0–1251 (`#F3F0EB`) · logo Ticker 1251–1295 · Features title + sticky Scroll Area (2 blocks) 1295–3375 · "Simplify your stack" 3375–3924 (`#FAF7F1`) · FAQ 3924–4761 · CTA 4761–5516 · Footer.
**Performance note:** this page is CPU-heavy on the live site (a WebGL globe plus four counter-rotating logo orbits). Headless `evaluate` calls took 4–15s each. Keep the clone light: CSS `@keyframes` rotations and one canvas.

### 3.1 Hero — NEW (centered text + rotating carrier orbits + chat)
- Section 1440x**1251**, bg `#F3F0EB`, flex column center, **padding 140px 0 80px**.
- Title column (max 1300), flex column center, **gap 48px** between the text group and the Visual; text group gap 18.
  - H1 "Siena Order Tracking": Light 300 80/80 ls −0.8, center, **max-width 872**.
  - Sub "Siena connects directly to thousands of carriers to track packages in real-time. Answer shipping questions, resolve delivery issues, and provide accurate order updates.": 500 20/28 ls −0.2, center, max-width 630, opacity 0.82.
  - Book a demo xlg (y 370). Load appear 0.2 / 0.3 / 0.4s as usual.
- Visual 672x430 (z −1, y 476). Content group 580x296 centered at (336, 202) (`translate(-290px,-148px)`):
  - Arc frame "01": 662x313 at `left:-41; top:-19`, r15, overflow clip (it only shows the **top half** of the orbits). Inside, the dashed arcs `public/svg/order-tracking-orbit-arcs.svg` (614x307) at `left:24 right:24 top:38`. Arc stroke color: see the file (light coral dashed).
  - **Outer orbit** "Rotating Circles" 521x521, centered horizontally, top 26. Two "Rotating container" layers (610x610, inset −44.5 so they overflow the 521 box), each with 4 carrier chips at the corners (`top/left 4.33px` or `396.67px`, chip 64x64). The two layers are offset by 45°, so 8 carriers are spaced evenly. **The whole orbit rotates clockwise at +18.0°/s (20s per turn, linear, infinite).** Each chip counter-rotates (`-18°/s`) so logos stay upright.
  - **Inner orbit** "Direction - Left" 342x342 at (119, 149) in the Content group: a faint circle 326x326 (r999, opacity 0.15), plus two Rotating containers (375x375) with 4 chips each. **It rotates counter-clockwise at −18.0°/s**; chips counter-rotate.
  - Carrier chip "Content": 80x80 (inset −8 around the 64 slot), bg `rgba(255,255,255,0.8)`, r300, padding 8, `box-shadow: rgba(167,160,146,0.3) 0 3px 8px 0`, `backdrop-filter: blur(3px)`, logo centered.
  - Carrier logos: Japan Post `svg/order-tracking-carrier-japan-post.svg` 51x27; Royal Mail `/assets/Y3DdSWSDlScPBJJuc9qAzSfLPrw.png` 59x43 contain; FedEx-style tile `/assets/O1NsOtNtpqW7pzcUdS2WzUEjDS0.png` 73x71 cover; DPD-style `/assets/YiU6EdafVKNGm5G1IXsorXq3OIQ.png` 42x41; USPS `svg/order-tracking-carrier-usps.svg` 58x58; UPS `svg/order-tracking-carrier-ups.svg` 49x49; DHL `svg/order-tracking-carrier-dhl.svg` 59x19; a wordmark `svg/order-tracking-carrier-group.svg` 68x10.
    - Outer layer A order (BL, BR, TR, TL): Japan Post, Royal Mail, O1Ns, YiU6.
    - Outer layer B: USPS, UPS, DHL, Group.
    - Inner layer A: YiU6, O1Ns, Royal Mail, Japan Post.
    - Inner layer B: DHL, Group, USPS, UPS.
  - Center brand chip 144x144 (same chip style, padding 8) with `/assets/97FwNezELUd8Kd9HdHn3le688Ks.png` 78x78, at the top of the arc (`top:-63px`, centered).
  - Load appear (exact, from `__framer__appearAnimationsContent`): each carrier chip goes from `{opacity:0.001, x:-20, y:-20}` to `{opacity:1, x:0, y:0}` with spring **bounce 0.2, duration 0.6**. Delays are **0.2 / 0.4 / 0.5 / 0.6 s** across the chips (ids `13gsge1` 0.2, `9rpvg3` 0.4, `l4lwy2` 0.5, `oyy4kv` 0.6; the other four reuse these per breakpoint variant). The center brand chip (`18wlx4l`) goes from `{opacity:0.001, y:64}`, tween **1s delay 0.4 ease [0.44,0,0,1]**. The same 64px/1s/0.4s tween is used by `1x6enpw` / `559nr7` (the chips in §3.4).
- Chat row (y 906–1170, z 1):
  - Customer bubble (white, gradient p1) 209x92 at x 457 y 907: "Hi! Can you check what's going on with my order?", avatar `/assets/HmqW7KqMsD32FtjFcSsHNYWM.webp` 56x55 circle at its left (`left:-71px; top:-5px`).
  - Siena bubble ("Border" p2, inner `#EFE5D0` r15 **p20**) 330x161 at x 641 y 1009: "I'm sorry for the delay. Your order has been stuck at the carrier's distribution center for 7 days. I'm sending a replacement with expedited shipping right away." Brand avatar 52x52 at its top-right (`left:344px; top:-1px`).
  - Text Tiempos 18/23.4 `#2A3639`.
- Fades: "Rectangle 7061" 1440x209 at y 790, `linear-gradient(180deg, rgba(244,240,236,0) 0%, #F4F0EC 16.96%, #F4F0EC 100%)` (it hides the bottom of the orbits), and 1440x274 at y 999, `linear-gradient(180deg, #F3F0EB 0%, #FFFFFF 100%)`.
- **390:** H1 56/56 (342x112), sub 16/22.4, button y 414. The orbit visual is scaled to fit 390 (center chip 78→48–78, carrier chips about 30–73). Customer bubble 132 wide text 14/21, avatar 48x47. Siena bubble 232 wide text 14/21. Ticker y 1137.

### 3.2 Logo ticker — VARIANT of the product ticker (§0)
- Separate full-width row **after** the hero: 1440x**44**, flex row, **gap 112px**, **no mask**, moves **left at 30 px/s** (measured −29.96 px/s). Framer shows it at `opacity:0` until it enters the viewport, then fades in and starts moving.
- 32 logos: `ticker-logo-figs.svg` (108x30 in a 38 box), 01, 02, `ticker-logo-02b.svg` (153x32), 03, 04, 05, `ticker-logo-gruns.svg` (101x38), 06–29.
- **390:** gap **48px**, same height.

### 3.3 Features title + sticky Scroll Area — VARIANT of homepage `ScrollArea` (same as /video 2.2, 2 blocks)
- Features wrapper padding **160px 0 0**. Title: eyebrow "ORDER LOGISTICS INTELLIGENCE" + H2 "Your Agent's direct line to carriers" (max-width **926**, center).
- Scroll Area **1440x1810** (2 blocks of 900 + gap 10). Sticky column identical to /video.
- Block text: h3 Feature Deck Web Regular 52/62.4, **max-width 384**; paragraph Tiempos 20/28 `#000` max 384; bullets as /video.
  1. "Instant tracking lookups" — "When customers ask about their order, Siena pulls current tracking data and delivers clear, accurate updates in seconds." — • Direct access to 2,000+ carriers • Real-time status with full delivery context • Eliminate tracking errors
  2. "Proactive delay detection" + a **"Coming soon" badge** absolutely placed after the 2nd line of the heading (at `left:223px; top:77px` of the text block): 186x44, bg `#FAF7F1`, r24, padding 8px 16px, gap 12, FA Sharp Light 20px icon (coral) + "Coming soon" Instrument Sans **500 20/28 ls −0.2 `#F95040`**. Body "When a package gets stuck, Siena knows before your customer complains. The agent flags delays, notifies your team, and reaches out proactively." — • Proactive delivery monitoring • Predictive issue detection • Automated customer outreach. **No button** in either block.
- Sticky visual: Card frame (`#FAF7F1` p8 r15; inner box 498x276 **r8**) containing a **WebGL globe** (Framer "Globe" component, i.e. the [`cobe`](https://github.com/shuding/cobe) library) on a 1104x1104 canvas, offset `left:-249px; top:-160px` inside the clipped 498x276 box, so you only see a zoomed slice. Circular mask `radial-gradient(circle at 50% 50%, #000 60%, transparent 70%)`. Exact cobe props from the page module:
  - Base: `baseColor rgb(244,237,222)`, `glowColor rgba(239,229,208,0.02)`, `markerColor rgb(150,141,122)`, `dark 0`, `diffuse 0`, `mapBrightness 0.89`, `mapSamples 16241`, `scale 1.025`, `theta 0.15`, `phi 0`, `speed 0.3` (phi += speed/200 per frame), `markerSize 0`, markers `[{lat 34.6424, lng 30.4507}]`, `devicePixelRatio 2`, not draggable.
  - **Stage 1** ("Instant tracking lookups") uses variant `ZSdt7HgbK`: marker `[40.4567, -105.0901]`, `markerColor rgb(255,93,78)`, `markerSize 0.08`, `scale 1.0501`, `speed 0.05`.
  - **Stage 2** uses `THE30UAcW`: `glowColor rgba(120,115,104,0)`, marker `[40.4567,-105.0901]` with `markerColor rgba(255,93,78,0)` (hidden), `markerSize 0.08`, `phi 0.2`, `speed 0.02`, `theta 0.05`. Visually it's a zoomed dotted North America with a red glowing dot (reference crop `recon/pages-b/order-tracking-1440-Sticky-2.png`).
  - The globe pixels are canvas-rendered and can't be extracted. Rebuild with `cobe` using these props, or use a static screenshot (`recon/pages-b/order-tracking-1440-Sticky-1.png` / `-2.png`) as a fallback.
  - **Stage 1 overlay:** chips row (454x47, `top:-85px`, above the card) "Order #4521" • "Shipped Jan 15" • "ETA Jan 18". Customer bubble (white) "My order has been stuck in customs for a week" over the card's top-left. Siena bubble ("Border", inner `#EFE5D0` **p16**) 248x130 at the card's top-right (x+304, y+46): "I see it cleared customs this morning and is now with Royal Mail. Updated ETA is Monday."
  - **Stage 2 overlay:** the chips row sits **below the card** (477x47 at card top + 333): "Order #1324" • "Status: Delayed" • "ETA ~~18~~ 22" (the "18" is a `<span>` with `text-decoration: line-through`; chip text color `#122024`). Siena bubble 239x200 (inner p16) at the card's top-left (x−55, y+22): "Your package has been sitting in the same facility for 3 days. I've flagged this with our fulfillment team and will update you within 24 hours". Customer bubble (white, p10) 209x45 at the bottom-right (x+346, y+214): "Ok, thanks!".
  - Note: in Stage 1 the chip row is above the card (`top:-85`), in Stage 2 below (`top:+333.6`). Animate the move with the stage spring (bounce 0.2, 0.4s).
  - Element reveals are the same as /video 2.2 (card spring 0.1/1s delay 0.2; bubbles delay 0.6; chips 0.6/1.5/2.6s tweens).
- **390:** stacked like /video. H2 48/48 left. Mobile stage chips wrap into 2 rows ("Order #4521 • ETA Jan 18" / "Shipped Jan 15"). Bubbles text 14/18.2 `#122023`. Coming-soon badge 16/22.4 text and 20px icon, placed right of the H2 (x 263, y 2567).

### 3.4 "Simplify your stack" — NEW (text + animated pipeline)
- Section "Your team of expert agents" 1440x549, bg `#FAF7F1`, padding 80px 96px. Top fade 75px `#FFFFFF→#FAF7F1`; bottom fade 75px `linear-gradient(0deg, #FFFFFF 0%, #FAF7F1 100%)`.
- Container (max 1200) flex row, **gap 56px**, align center:
  - Text column **411** wide, flex column, gap 32: h3 "Simplify your stack" (Feature Deck Web Regular 52/62.4) → paragraph "Native tracking infrastructure is included in your platform. Handle order inquiries without managing separate tracking subscriptions or maintaining additional integrations." (Tiempos 20/28 `#000`) → bullets: "Works with existing workflows", "Reduce vendor complexity".
  - Visual column 733x384, padding-top 24 (reference crop `recon/pages-b/order-tracking-1440-Your_team_of_expert_agents.png`):
    - Capsule ("Border") 105x182, **r88**, padding 2px, rainbow gradient (the 255deg token). Inner white `#FFFFFF`, r88, padding 20px 20px 108px.
    - Brand chip 125x125 (chip style; logo 70x70 `97FwNe…png`) overlapping the capsule top (`top:-19px`).
    - Agent note 325x44 (white r16, **padding 4px 8px 4px 20px**) across the capsule at y+117: "Fetching tracking # details" (Tiempos **18/23.4 `#2A3639`**, not Feature Deck) + 52x36 lottie dots.
    - Vertical connector `svg/order-tracking-connector-line.svg` (11x140, rotated 180°) from the capsule down to an empty 90x90 white chip (chip style) at the bottom.
    - Pulsing dot on the connector (x 947, y 3659): core 6x6 `#F95040` r48; halo 16x16 `#F8B57F` r48. **Halo loop (rAF):** scale 1.0→1.4 and opacity 1.0→0.1 and back, **period ≈1.47s** (≈0.73s each way, ease-in-out), infinite. The halo also slowly rotates; that's invisible on a circle, so ignore it.
    - The capsule/note reveal: Agent note from `{opacity:0,y:20}` spring (≈0.8s). Lottie loops.
- **390:** column; h3 becomes **H2 Light 48/48** (342x96); paragraph 20/28 (342x168); bullets 14/21; the visual is centered below (brand chip 70 at y 3875; note text 14/21).

### 3.5 FAQ — NEW (accordion)
- Section 1440x837, flex column center, **gap 40px**, **padding 80px 96px 160px**, bg white.
- H2 "FAQ" (Light 64/64, center).
- Card "FAQ": max-width 1062, bg `#F3F0EB`, **r24**, **padding 20px 40px**. List 982 wide.
- Item: overflow hidden, **`border-bottom: 3px solid rgba(0,0,0,0.2)`** (none on the last item).
  - Header row: flex space-between, align center, **padding 24px 0**, cursor pointer. Question Instrument Sans **500 20px / normal** `#122023`. Icon `<img>` 20x20 on the right: `/assets/klSbquSQSmI4vJp5uAthfEBu4A.png` (closed, chevron down) or `/assets/OKFNY3AXFnnV2q6cBUgzTRwNI0.png` (open, chevron up). The swap is instant; there's no rotate.
  - Answer: Instrument Sans 400 16px / normal, `rgba(18,32,35,0.8)`, padding-bottom 24. Closed: height 0 + opacity 0.
  - **Behaviour (rAF-measured):** single-open accordion. Item 1 is open by default. Clicking another item opens it and closes the open one at the same time. Height and opacity animate in about **110ms** (complete by about 205ms after click). Use `transition: height .12s ease, opacity .12s ease` (or a framer-motion `AnimatePresence` height tween 0.12s). Item heights at 1440: closed **99** (72 header + 24 padding-bottom + 3 border), open 159 (2-line answer).
  - Q/A:
    1. "Does tracking work for international shipments with customs delays?" — "Yes. Siena Order Tracking covers international shipments across customs checkpoints, regional carriers, and last-mile delivery. Whether packages move through customs or transfer between international and domestic carriers, Siena maintains visibility throughout the entire journey."
    2. "How does Siena handle tracking numbers that work across multiple carriers?" — "Siena's infrastructure automatically detects which carrier is handling each package based on the tracking number format and shipping details. This eliminates errors from routing tracking queries to the wrong carrier, ensuring accurate results every time."
    3. "Does Siena work with returns or order tracking platforms?" — "Yes. Siena integrates with returns platforms like Loop Returns and order tracking platforms like AfterShip. If you already use these tools, Siena works alongside them."
    4. "Can Siena track packages from regional or specialty carriers?" — "Yes. Native tracking supports over 2000 carriers worldwide, including regional carriers, specialty logistics providers, and local delivery services. Whether you use major carriers like FedEx or regional providers, Siena has coverage."
- **390:** H2 "FAQ" 48/48. Card x 24 (342 wide), padding 20px 24px → text 294 wide; questions wrap to 3–5 lines (20px/normal); the icon stays right-aligned, vertically centered on the question.
- This FAQ is a reusable NEW component (`Faq` with `items`, `defaultOpen=0`); /products/docs uses one too (§4).

### 3.6 CTA — IDENTICAL to homepage `MainCta` except the fade color
- Same copy ("See how fast-growing brands scale with Siena"), same box 1440x755, card 1062x355.
- The top "Blur out" is 187px tall but **`linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)`** (white, because the FAQ above is white; homepage uses `#FAF7F1`). Prop `fadeFrom="#FFFFFF"`.

### 3.7 /order-tracking assets
New: `public/assets/O1NsOtNtpqW7pzcUdS2WzUEjDS0.png`, `Y3DdSWSDlScPBJJuc9qAzSfLPrw.png` (Royal Mail), `YiU6EdafVKNGm5G1IXsorXq3OIQ.png`, `97FwNezELUd8Kd9HdHn3le688Ks.png`, lottie `public/lottie/uznXokyKNrzxLiEzeS9ckfp3Ba4.json`. Already present: `HmqW7KqMsD32FtjFcSsHNYWM.webp`, `OKFNY3AXFnnV2q6cBUgzTRwNI0.png`, `klSbquSQSmI4vJp5uAthfEBu4A.png`, `ERYNplIY591uk80wpoa4JGglO8.webp`.
SVG: `public/svg/order-tracking-orbit-arcs.svg`, `order-tracking-connector-line.svg`, `order-tracking-carrier-{japan-post,usps,ups,dhl,group}.svg`, `order-tracking-bullet-star.svg`, `ticker-logo-figs.svg`, `ticker-logo-02b.svg`, `ticker-logo-gruns.svg`, plus `ticker-logo-01…29`.
Canvas (not extractable): the cobe globe. JS dependency to add: `cobe` (~5 KB).

---

## 4. /products/docs

Document height 1440: **7326** (Main 6891 + footer 434). 390: **9766**. Page links use `../book-a-demo` (relative to `/products/`). Map them to `/book-a-demo`.
Section order (1440): Hero 0–1016 (white) · "One home" Scroll Area 1016–1916 · "Change it once" 1916–2592 (`#FAF7F1`) · "Built for the way…" bento 2592–3677 (`#FAF7F1`) · "Before / With Siena" 3677–4456 (`#FAF7F1`) · Testimonial 4457–5261 · FAQ 5261–6137 · CTA 6137–6891 · Footer.
This page is mostly **DOM-built UI mockups** (tilted doc cards, browser frames, chips). Their every box, font and transform is recorded in **`recon/pages-b/products_docs-1440-dump.txt`** (line ranges below; each line is `tag "framer-name" [x,y,WxH] layout padding bg radius shadow transform` plus TEXT with font). Reference crops are `recon/pages-b/products_docs-1440-sec-*.png`. Build each mockup from that dump. The spec below gives the frame, the shared atoms, and all copy and motion.

Shared mockup atoms:
- **Doc card ("Docs / Item")**: outer padding 2px, **r28**, `box-shadow: rgba(167,160,146,0.3) 0 3px 8px 0`. Inner "User Message" bg `#FFFFFF`, r28, padding `16px 12px 12px`, overflow clip, gap 12. Title Tiempos 18/23.4 ls −0.18 `#2A3639`. Type label Instrument Sans 600 10/14 ls 0.5 uppercase `#787368`. Inner "Content Graphic" r16, padding 8, `backdrop-filter: blur(2px)`; excerpt **Tiempos Text Regular Italic** 14/18.2 `#A0A6A7`. A "Blur out" fade over the bottom: `linear-gradient(180deg, rgba(250,247,241,0) 0%, rgba(254,254,253,0.88) 66%, #FFFFFF 92%)`. Status chip ("Chip/Filter") bg `#FFFFFF`, r50, padding 4px 8px, gap 4, Instrument Sans 400 10/15 `#122023` "Verified" + a 15x15 blue check-circle (data-URI SVG) or "Pending" + an orange circle.
- **Browser frame ("Docs-card")**: bg `rgba(243,240,235,0.5)` (0.6 / 0.3 variants), r24, `backdrop-filter: blur(6px)`, overflow clip, wrapped in a 2px `rgba(255,255,255,0.6)` r28 `blur(7px)` shell. Top bar: three 12px white dots at left 16 (gap 10), 1px white divider at 48px, centered URL chip "help.brand.com" (white r50, Instrument Sans 10/15) + 12px copy icon.
- **Blurred color blob** ("Frame 2087325258"): `/assets/QHZQBNQlSL00uTxYcQKOePAWdT0.webp` (617x582) contain, **opacity 0.36, `filter: blur(39px)`, rotated 54°**, placed low inside a Docs-card for a soft rainbow glow. It doesn't animate.
- New fonts used here: **Tiempos Text Regular Italic** (already declared in §0 as `0H28sSRAjligzhoQMhfSh8CwkA0.woff2`; make sure `@font-face` includes it) and **Feature Deck** (plain family name, used at 16px for "•" separators; it falls back to Feature Deck Web Regular).

### 4.1 Hero — NEW
- Section 1440x1016, bg **`#FFFFFF`**, flex column, align center, **padding 144px 0 200px**.
- "Header Content": max-width 1072, padding 0 56, flex column center, **gap 112px** between the copy block and the visual.
  - Copy (672 wide, gap 40; heading → sub gap 24):
    - H1 "The OS for your brand's knowledge" (Light 300 80/80 ls −0.8, center, 672x160, 2 lines).
    - Hand-drawn rainbow underline `/assets/MJbk4aQblPanJHyFV9X8Yg7JDqI.png` (241x18) under "OS for your" (absolute, `top:70px; left:309px`, translateX(−50%)). It wipes in from the right: from `{opacity:0.001, x:150}` to `{opacity:1, x:0}`, tween **0.4s delay 0.8s ease [0.98,-0.04,0,0.79]**.
    - Sub "Siena Docs is one home for everything your team knows. Every page you have makes your whole operation smarter." Instrument Sans 500 20/28 ls −0.2, center, 672 wide, **opacity 1** (not 0.82 on this page).
    - Book a demo xlg.
  - Load appear: H1 0.2s, sub 0.3s, button 0.4s. A 4th id `gx6vnk` at delay 0.5 (tween 0.7) is the underline wrapper.
- Visual ("Sticky Image" 512x392, dump lines 19–246; crop `products_docs-1440-sec-Hero.png`): a browser frame **626x399** centered (`translate(-50%,-50%)`) showing a 3-column docs app:
  - Left nav (Docs book icon + "Docs" Tiempos 20/26; items Tiempos 12/15.6 `#122023`: Getting Started, Returns and Shipping → sub-items Tiempos 10/13 `#71797B` with 10px file icons: "Shopify refund policy", "Exchange process", "Damaged items"; then Internal Ops, Skills, Agent Persona, Color & Sizing; 1px white row dividers).
  - Middle: "Refund & Returns Policy" Tiempos 18/23.4, italic body (Tiempos Italic 14/18.2 `#A0A6A7`) "Customers can request a refund within 30 days of purchase. Refunds are processed within 3–5 business days of the returned item arriving at our warehouse. Items must be unworn, unwashed, and in original packaging. Final-sale and *personalized items are not eligible.*", footer chip "Verified ✓" + "UPDATED: 2 DAYS AGO" (Instrument Sans 600 10/14 ls 0.5 `#787368`).
  - Right: "Document usage" (Tiempos 18/23.4 `#71797B`), tag "23 Cited" (bg `rgba(250,247,241,0.9)` r20 blur 6), chart image `/assets/nvp2J5Q38ZJKo0wZ875zHFSvrhg.png` (r16, contain), chips "61 Views" / "12 Agents".
  - Six tilted doc cards behind and around it (rotation; position): "Refund & Returns Policy" (POLICY DOCUMENT; +12°; top-left), "Brand Voice Playbook" (INTERNAL PLAYBOOK; +15°; top-center), "Mail" (customer email excerpt "Hi, I ordered the Signature Hoodie last week and the grey looks much darker in person than online. Can I exchange it for the heather, or get a refund?"; −10°; top-right), "Sizing & Fit Guide" (DATA TABLE (SIZE/SKU), "S / M / L / XL — chest 38–46". Heather Grey, Black, Forest. Restock ETA: Aug 14."; −13°), "Customer Conversations" (−23°, bottom-left, mini chat inside with a white customer bubble 7px text and an `#EFE5D0` Siena bubble), "Shopify" (−10°, bottom-right, image `/assets/FAzsjFZlToamfvdG2lqN8QZVkA.webp` 174x140 r16 cover, top-left aligned). The Siena icon in the mini chat is `/assets/14aPLwywC9q4flBvXM0s1rLqA8.png` 34x34.
  - **Motion (exact):** each tilted card is a scroll-reveal (threshold 0.5, once) with spring **bounce 0.2, duration 1, delay 0.6** from an offset: Shopify `{x:70,y:-50}`, Brand Voice `{x:0,y:60}`, Refund `{x:60,y:100}`, Sizing `{x:100,y:50}`, Mail `{x:-100,y:50}`, Customer Conversations `{x:-110,y:-70}` (all from opacity 0). The browser frame (`1fhkyth`/`odeoqy`) fades `opacity 0.001→1`, tween **0.4s delay 0.4 ease [0.94,-0.05,0,1]**. URL chip and chart: from `{opacity:0,y:50}` spring 1s delay 0.6. Customer-conversation Siena bubble: spring delay 1.0.
- **390:** H1 56/56 (342x168, 3 lines), sub 16/22.4, button y 477. The visual scales down (cards about 60%, same composition), y 540–990.

### 4.2 "One home for everything your team knows." — VARIANT of `ScrollArea` (single block, **mirrored**: visual LEFT, text RIGHT)
- Scroll Area 1440x**900** (one block), flex row gap 64, padding 0 96. **Sticky column is first (x 176)**, text column second (x 752). With only one block nothing pins, so render it as a static row.
- Sticky Image 512x647, **bg `#FFFFFF`**, r24, padding 56 (dump lines 247–506; crop `products_docs-1440-sec-Scroll_Area.png`). Browser frame 424x353 (bg `rgba(243,240,235,0.6)`) with the blob, and a **ticker row of doc cards** (12 = 3x["Refunds & Exchanges", "Tone of Voice", "Brand Policies", "Color & Sizing"]) at y+103. Cards 158x162 (atom style, padding 12, title Tiempos 18/23.4, italic excerpt 10px, "Verified"/"Pending" chip). Gap 10. **Moves LEFT at 30 px/s** (rAF −30 px/s), linear, infinite. Left and right edge fades inside the frame: 79px `linear-gradient(90deg, #FAF7F1 0%, rgba(250,247,241,0) 100%)` (mirrored on the right). Bottom footer "● 118 VERIFIED · 7 IN REVIEW" (Geist Mono 10px ls 0.5 uppercase `#605C53`), centered 20px from the bottom.
- Text column (512): eyebrow "KNOWLEDGE FOUNDATION" (600) → H2 "One home for everything your team knows." (64/64, 512x192) → sub "A clean structure for every workflow, playbook, and policy your team runs on. Keep it internal, or publish a branded help center on your own subdomain." (**Instrument Sans 500 20/28** ls −0.2) → bullets (gap 12; star 24 + Tiempos 18/23.4 `#2A3639`): "Internal wiki and public help center in one place", "Every page has an owner and a review cycle", "Native analytics across every page and space". Group gaps: eyebrow/H2/sub 24, then 32 to the bullets.
- **390:** column, text first (eyebrow 14, H2 48/48 342x144, sub 16/22.4), then the visual 342 wide.

### 4.3 "Change it once." — NEW
- Section "Complete Coverage" 1440x676, bg `#FAF7F1`, padding 80px 96px, gap 32. Top fade "Blur out" 1440x153 `linear-gradient(180deg, #FFFFFF 0%, rgba(250,247,241,0) 100%)`, z 3. Background glow "BG": `/assets/MSTluKQSUNZrlxr6ESQPZTnooU.webp` 669x641 at x 728, y −119 (relative), **opacity 0.3**, cover.
- Row (max 1072, gap 32, align flex-start):
  - Title column **396**: eyebrow "YOUR CRITERIA. SCORED ALWAYS IN SYNC" → H2 "Change it once. Your whole operation moves with it." (64/64, 396x256, 4 lines) → body "Tell Siena what changed and every page that mentions it updates together. Your public help center, your internal docs, and what your agent tells customers all stay current from one conversation." (Instrument Sans 500 20/28). Gap 24.
  - Visual "Card/Gallery" 776x516 (it overflows left into the gap; x 480–1256), r24, padding 32, `background: linear-gradient(272deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 76%)`, overflow hidden (dump lines 507–614; crop `products_docs-1440-sec-Complete_Coverage.png`):
    - Person cutout `/assets/ujOHLlJqjEXaFjDhOJLSpAYzU.webp` 506x457 at `left:384px; top:58.8px`, bottom-aligned.
    - Request card 309x171 (2px shell r24 + inner white r24 padding 2, shadow atom) at `left:372px top:88px` (centered with translateX(−50%)): quote "\"We're extending returns from 30 to 60 days for the holidays. Update everywhere.\"" (Tiempos 20px), then a row with a pill "3 docs found" (Instrument Sans 10px, 1px border) + "Diffs proposed:" (Tiempos 14px).
    - Three diff cards (166x162, gap 10) at `left:221px; top:331px`: "Returns Policy", "Returns SOP", "Returns Journey". Each has two mini panes: the old text struck through in grey ("…within 30 days of the original purchase…") and the new text in green ("…within **60 days** of the original purchase…"), then an "Accept ✓" chip (93x23) + an orange ✕ circle.
    - **Motion:** request card from `{opacity:0,y:80}` spring 1s, delay 0.5 (desktop) / 0.4 (mobile). Diff cards from `{opacity:0,y:80}` spring, delays **0.6 / 0.8 / 1.0 s** (Policy / SOP / Journey).
- **390:** stacked; title 342 (H2 48/48 342x192), visual below about 342 wide.

### 4.4 "Built for the way modern brands actually work." bento — NEW
- Section 1440x1085, bg `#FAF7F1`, padding 80px 96px, **gap 72**.
- Title (center, gap 24): eyebrow "WHAT CHANGES" → H2 "Built for the way modern brands actually work." (64/64, **max-width 800**, center) → sub "Traditional knowledge tools were built for humans to read and agents to ignore. Siena Docs serves both, from one living system." (Instrument Sans 500 20/28, center, 620 wide).
- Bento (max 1200, flex column, gap 16; dump lines 615–828; crop `products_docs-1440-sec-Before_With_Siena-0.png`):
  - Row 1 (h 393, gap 16):
    - Card A 572 wide: padding **32px 24px 24px**, r24, bg `#FFFFFF` (gradient white→white), `backdrop-filter: blur(2px)`, flex column center, gap 24. Title `<h4>` **Feature Deck Web Regular 40px/48px `#000000`** center "Ask Siena inside Docs"; desc **Instrument Sans 400 16px/19.2px ls −0.16 `#122023`** center "Draft, edit, and maintain any page agentically, without leaving your knowledge base." (text gap 20). Mockup: a Docs-card 524x207 (bg 0.3) with the blob, three tiny tilted doc cards (Return Policy, Refund Timeline, Exchange Process at 9px titles and 5px italic), and a footer panel 492x91 (bg `rgba(243,240,235,0.7)`, r28, padding 8, blur 10) holding a gradient-border prompt input: 25px Siena icon `svg/docs-siena-icon-black.svg` + "What changed in our return policy this month" (Feature Deck Web Regular 12/14.4), then a row "UPDATING:" (Geist Mono 10/14 `#605C53`) + "3 Docs" (Instrument Sans 12/18 `#605C53`) and the "Approve 3 Updates ✓" chip.
    - Card B 612 wide: padding 32, r24, `linear-gradient(180deg, #FFFFFF 0%, #FAF7F1 100%)`, gap 32. Title "Analytics" (40/48 `#000`), desc "Know exactly which knowledge drives your agent's answers and which goes unused." (max 314). Mockup: "Brand Policies" doc card (157x148) + "•" + "Line chart" card 199x178 ("Document usage", chart `/assets/nvp2J5Q38ZJKo0wZ875zHFSvrhg.png` 175x93 r16, "23 Cited" tag, "61 Views" / "12 Agents" chips).
  - Row 2 (h 190, gap 16, align flex-start):
    - Card C 592: flex row space-between, padding 24, r24, white→`#FAF7F1` gradient. Text (max 314, gap 12): `<h4>` "MCP Connection" (40/48 left) + "Your knowledge base follows your team wherever they work." Right tile 134x142, bg `rgba(243,240,235,0.6)`, r24, padding 32, blur 6, holding the rainbow paperclip `svg/docs-mcp-paperclip.svg` (70x78).
    - Card D 592: same style. Text "Skills" + "The same page your team reads becomes the playbook your agent runs." (400 wide). Right tile 134x142 with three tiny tilted cards ("Return Policy", "Refund Timeline", "Process a Return" with steps "Confirm order is within the 30-day window", "Offer exchange or refund", "Send prepaid label · log reason", "Used 4 times this month", "Verified and live").
  - **Motion:** mini doc cards from `{opacity:0,y:50}` springs with delays **0.4 / 0.8 / 1.2 s** (bounce 0.2, duration 1); Brand Policies card and line chart delay 0.6; prompt bubble delay 1.0. All once, threshold 0.5.
- **390:** H2 48/48 center (342x144); cards stack full width (342; padding 24): h4 **24px/28.8px**; MCP/Skills cards stay row-shaped (text 128–150 wide + tile).

### 4.5 "Your knowledge base, finally built for your agent." Before / With Siena — NEW
- Section 1440x779, bg `#FAF7F1`, padding 80px 96px, gap 72. Bottom fade 1440x153 `linear-gradient(180deg, rgba(250,247,241,0) 0%, #FFFFFF 100%)`, z 3.
- Title: H2 "Your knowledge base, finally built for your agent." (64/64, max 800, center) + the same sub as 4.4 (620 wide). No eyebrow.
- Two cards (max 960, row gap 16), each 472x339, padding 24, r24, `linear-gradient(180deg, #FFFFFF 0%, #FAF7F1 100%)`, overflow hidden. Inner column gap 32: `<h3>` **Feature Deck Web Regular 52/62.4 `#122023` center**, then a list (gap 12). Rows are flex with gap 16 (icon 18–24 wide), Instrument Sans 400 16/19.2 ls −0.16 `#122023`.
  - "Before" — icon FA Sharp Light 24px **U+F00D (xmark)**: "Manual article writing, hours per piece" / "Duplicate articles accumulate over time" / "Agents give inconsistent answers from contradictory sources" / "Internal notes leak into customer-facing content" / "Separate tools for knowledge management and your agent".
  - "With Siena" — icon **U+F890 (sparkles)**: "Any source → structured article in under a minute" / "Every new page checked for duplicates automatically" / "One source of truth, consistent answers every time" / "Internal content stays internal, automatically" / "One system: knowledge base, help center, and agent knowledge source".
- **390:** cards stack (342, padding 24), h3 **36px/43.2px**.

### 4.6 Testimonial — VARIANT of homepage `Testimonials` slide (single, static)
- Section padding 80px 96px. Card "content" max **1200**, bg **`#FAF7F1`**, r24, padding 24px 16px; inner padding 16px 32px 48px → slide 1104 wide.
- **Only one slide** and **no prev/next/counter controls**. Slide row gap 40: left 532 column (quote mark `svg/memory-quote-mark.svg` 30x24; quote Instrument Sans 400 25.6/33.28 ls −0.512: "Since implementing Siena, we've taken back the time we spent on high ticket volume and expanded our team's roles across marketing and product development. It's transformed how we operate."). Below it, a brand/person row with logo `/assets/FAmVCc3xLG8QUhmtyJ3WkBGEeU.png` 140x64 (contain, left), "Cate Marques" (500 20/28) and role "CXO" (600 12/16.8 ls 0.6 uppercase `#787368`). On the right of that row is the **"Read full story"** Secondary/md button (137x48, padding 16, r12, bg `#FFFFFF`, 1px `#A7A092` border, Instrument Sans 500 16/16) → `/customer-stories/terra-kaffe` (siteHref external). Image right `/assets/WVZA37Bad6K0ss9JDOjwLhH2aUs.webp` **532x532** r32 cover.
- **390:** image 320x320 first, quote 19.2/24.96, name 16/22.4 (same as the homepage mobile slide).

### 4.7 FAQ — the §3.5 `Faq` component with different width and items
- Section padding **80px 0**, gap 40; H2 "FAQ". Card **max-width 894** (x 273–1167), padding 20px 40px, list 814 wide. Item 1 is open by default (height 179).
- Q/A:
  1. "How is Siena Docs different from a standard help center tool?" — "A standard help center is built for customers to read. Siena Docs serves your customers, your internal team, and your agent from one system. Creating and maintaining content is fully agentic: Ask Siena imports from any live URL, proposes targeted edits as diffs you accept or reject, and runs as a skill inside any workflow. Every page connects directly to your Siena agent. What your team writes is what your agent knows."
  2. "Can we bring in content from a live website or existing documentation?" — "Yes. Give Ask Siena any live URL and it fetches the page, drafts a full structured article, and proposes it for review. Works for product pages, existing help content, or any public source you want to bring into your knowledge base."
  3. "Why not use Claude Code and GitHub for our knowledge base?" — "Siena Docs is built for the teams and AI that run a consumer brand: support, CX, product, and operations. Your public help center, your internal playbooks, and your agent's behavior all live and update in one place. No technical setup required. And if you already work out of Claude or another AI tool, the Siena MCP connects your entire knowledge base to it so you can search, edit, and publish pages without switching tools."
  4. "Do we still need Notion, Guru, or Google Docs?" — "Most teams that move their knowledge into Siena Docs stop needing the others. Your public help center, your internal wiki, and your agent's knowledge source all live in one place, updated together. The tools you were using before were not talking to each other or to your agent. Siena Docs is the one system that does all three."
  5. "Is Siena Docs included in my Siena plan?" — "Yes. Siena Docs is part of your Siena plan at no extra cost. Every page you write feeds directly into Siena Intelligence, so the more knowledge you put in, the smarter your whole operation gets."

### 4.8 CTA — homepage `MainCta` with a different fade
- Same copy and box (755 tall). Top fade **153px**, `linear-gradient(180deg, #FFFFFF 0%, rgba(250,247,241,0) 100%)`.

### 4.9 /products/docs assets
New: `public/assets/FAzsjFZlToamfvdG2lqN8QZVkA.webp`, `nvp2J5Q38ZJKo0wZ875zHFSvrhg.png` (usage chart), `ujOHLlJqjEXaFjDhOJLSpAYzU.webp` (person cutout). Already present: `MJbk4aQblPanJHyFV9X8Yg7JDqI.png` (underline), `QHZQBNQlSL00uTxYcQKOePAWdT0.webp` (blob), `MSTluKQSUNZrlxr6ESQPZTnooU.webp` (glow), `14aPLwywC9q4flBvXM0s1rLqA8.png`, `FAmVCc3xLG8QUhmtyJ3WkBGEeU.png`, `WVZA37Bad6K0ss9JDOjwLhH2aUs.webp`, FAQ icons.
SVG: `public/svg/docs-mcp-paperclip.svg`, `docs-siena-icon-black.svg`. The small check/pending circles and chip icons are data-URI backgrounds in the dump; copy their `url("data:image/svg+xml,…")` strings verbatim from `products_docs-1440-dump.txt`.

---

## 5. /ai-lab

Document height 1440: **6625**. 390: **7851**. Older visual language: a dark navy hero, white sections, and a grid of 80x112 "pixel" tiles scattered over the page edges.

### 5.0 NAV — DIFFERENT on this page (NEW variant "Dark"; does NOT use the homepage Nav)
- **Desktop (≥810):** fixed full-width bar **1440x72**, bg **`#122023`**, padding **0 64px**, flex row. **No announcement bar, no pill, no rounded corners, no scroll state change** (identical at scrollY 0 and 1200; no shadow).
  - Left: white "siena" wordmark 121x32 at (64, 20) (`public/svg/ai-lab-nav-logo-white.svg`, fill `#FFFFFF`) → `/`.
  - Links group right-aligned in a 662-wide box ending at x 1051, **gap 56px**, each item 72 tall: "Platform ▾", "Customers", "Resources ▾", "Partners ▾", "Company ▾". Instrument Sans 500 16px/16px **`#FFFFFF`**. Dropdown chevrons 14x14 white (12x7 inner); the chevron flips up while open.
  - "Customers" has a hover underline: 1px white line under the label (y+48) that slides in from the left. It sits off-left at rest (`left:-50px`, width 50) and ends at full label width (72 measured on hover). ~0.2s.
  - Right: "Book a demo" md (128x48, padding 16, r12) **bg `#122023`** (invisible against the bar, so it reads as plain white text), Instrument Sans 500 16/16 white. Hover → rainbow gradient `linear-gradient(90deg, #F2E59A 0%, #FEC796 17.56%, …)` (same token gradient as the homepage CTA hover).
  - **Platform dropdown (hover):** panel 332x305 directly below the bar (x 265, y 72), bg `#122023`, **r `0 0 16px 16px`**, **padding 32px 32px 28px**, `box-shadow: rgba(0,0,0,0.05) 0 0 0 1px, rgba(0,0,0,0.05) 0 10px 20px 0`. List rows gap ≈29px; each row = FA Sharp Light 16px icon (24 box) + label Instrument Sans 500 16/16 **`#E4E6E7`** (gap 12): Customer Service Agent (U+F590, `/`), Reviews Agent (U+F005, `/ai-review-management`), Memory (U+F6DA, `/memory`), Shopping Agent (U+F847, no link, dimmed ≈50%) + "🎉 Coming soon!" (FA U+E31B 12px + Instrument Sans 400 12/18 **`#F7DD93`**), Insights (U+F672, dimmed) + "Coming soon!", Integrations (U+E4E2, `/integrations`). Each row has the same slide-in 50x1 `#E4E6E7` hover underline. Reference: `recon/pages-b/ai-lab-1440-nav-platform-hover.png`. The Resources/Partners/Company dropdowns use the same panel style (not individually captured).
- **Mobile (<810):** bar **390x80**, bg **`#F3F0EB`/cream** (light, unlike desktop), dark "siena" logo 122x34 at left 24, menu button **52x52, r12, 1px `rgba(0,0,0,0.2)` border**, 24px hamburger at right 24. No announcement banner. Reference `recon/pages-b/ai-lab-390-nav.png`. The open state wasn't captured (assume the homepage mobile menu panel).
- Recommendation: add a `variant="dark"` prop to `Nav` (desktop: dark bar + white text + simple dropdowns; mobile: cream bar without the banner).

### 5.1 Hero — NEW
- Section 1440x**996**, bg **`#122023`**, flex column, **gap 48px**, **padding 158px 96px 48px**, overflow hidden.
- Header content (max 1248), flex column, **gap 136px** between the title group and the buttons:
  - H1 "– AI Lab" (an en dash plus a space): Feature Deck Web Light 300 **80/80 ls −0.8 `#FFFFFF`**, 268x80.
  - 40px below: H3 "Where Leading Brands Master AI-Powered CX": Feature Deck Web **Regular 400 52px/62.4px `#FFFFFF`**, 624 wide (2 lines).
  - Buttons row (gap 24) at y 539: "Join the Next Lab" xlg **bg `#FFFFFF`, text `#122023`** (193x58) → `#next-lab` (desktop; on 390 it links to `./book-a-demo`). "Learn More" xlg **bg `#2A3639`, text white** (144x58) → `/book-a-demo`. Both r16, padding 18/24, Instrument Sans 600 18/21.6. Hover → rainbow.
- Photo `/assets/chbWKDcCWdz6Laay1dFVDF6T098.webp` (a roundtable audience), **356x332** at (844, 152), cover, no radius.
- Upcoming events row at y 644 (flex row, gap 20, 749 wide). Two "Past Event" cards **364x304**, bg `#FFFFFF`, **no radius**, **1px solid `rgba(0,0,0,0.5)`** border, padding 32, column gap 24:
  - Tags row (space-between): date chip and "IN PERSON" chip (Geist Mono 400 10/14 ls 0.5 uppercase `#605C53`; the chip has r50 and no visible border).
  - Title `<h6>` Feature Deck Web Regular 24/33.6 `#122023`; subtitle Instrument Sans 500 16/19.2 ls −0.16 `rgba(18,32,35,0.8)`; then two info lines (gap 12): FA Sharp Light 20px icon (time line: U+F017 clock, location line: U+F3C5 location-dot) + Instrument Sans 500 16/19.2 `#122023`.
  - Bottom: "Join us" md button 300x48 full width (bg `#122023`, r12, padding 16, Instrument Sans 500 16/16 white).
  - Card 1: "JUN 24, 2026" · "AI Lab in LA🌴" · "Mellow Sleep" · "12 PM - 3 PM PDT" · "LA" → https://luma.com/4zv03kjl
  - Card 2: "JUL 30, 2026" · "AI Lab dinner in London 🇬🇧" · "Private community dinner" · "6pm-8pm UK" · "London" → https://luma.com/qspvr322
- Load appear: H1 0.2s, H3 0.3s, buttons row 0.4s (§0 primitive; the sub isn't dimmed here).
- **390:** H1 56/56 (x 16), H3 **36px/43.2px** (358 wide), buttons at y 326 (side by side), photo 204x190 at (18, 441), event cards side by side 2x (each about 180 wide, padding 20; h6 18/25.2; texts 12/14.4) at y 806.

### 5.2 Pixel tiles (decorative, all sections)
- A loose 80x112 grid (columns at multiples of 80px from x 0, rows at multiples of about 112px) of solid tiles that "glitch" in on scroll:
  - **Peach-gradient** tile: `linear-gradient(149deg, #F8B57F -21%, #F8B57F 21.83%, #FF5D4E 45.06%, #F95040 71.83%, #FDA3AC 100%)`. Variants: yellow start `#F7DD93` (tile at 802,1109) and coral start `#F95040` (1360,1594).
  - **Cut-out** tiles in the section's own background color (`#122023` in the hero at 1120,484 · 1200,595 · 1200,773 · 1120,884; white at 80,1949 · 0,2060) that notch into photos and edges.
  - **Photo** tiles (1 or 2x2 cells, cover): `f9RYAmmoTh5Z8crb9ahkR5DC0JE.webp` 81x112 @1120,773 · `vCYHzSbVQFkiJD63RRjesck1GAk.webp` 79x111 @722,1371 · `8vj9CileH7CuaaiunoniDOrbarI.webp` 232x325 @968,1146 · `i9WHZ8OCRKB0PgtAy4Cj3YlYzYA.webp` 160x224 @352,1591 · `RPgbC6APt6VN8fkzaS6O0p7UuKQ.webp` 160x224 @914,1592 · `M7jG4hn37wxejZA8bixJlPNAU.webp` 160x224 @80,4315 · `rJWsqYiMpnKBomfS1v0G4AcEM.webp` 80x112 @641,4316 · `aBNy1lWXQMzlHMzsv9vKqJrjCos.webp` 160x224 @880,4315 · `czHP5ISDMQX62viczmpPaYhQYpE.webp` 160x224 @401,4539 · `n2cLcUeIHLe1Gj11wKiDu98KQ.webp` 160x224 @1280,4539 · `ulS7iAn3fQc6JurqrwLUSxzo4.webp` 160x224 @720,4651 · `IxP8cFFbplPad8dsD3ScHdKPdIo.webp` 80x112 @321,4763 (absolute page coords at 1440).
  - Gradient tile positions (page coords x,y): 888,884 · 968,772 · 510,1329 · 590,1441 · 802,1331 · 1280,996 · 1360,1108 · 802,1109 (yellow) · 1360,1594 (coral) · 720,2210 · 800,1948 · 880,2060 · 1360,2098 · 1200,2611 · 1280,2873 · 0,3600 · 312,3600 · 1360,3862 · 80,3862 · 561,4277 · 80,4389 · 640,4389 · 1200,4611 · 1360,4723 · 1280,4835 · 1360,5443 · 808,5443 · 728,5555 · 888,5555.
  - Each gradient tile also carries a same-size `<canvas>` grain overlay (Framer grain/noise effect). It can't be extracted; approximate with an SVG `feTurbulence` noise at about 10% opacity, or skip it.
- **Motion (exact, page module):** each tile/photo is a scroll-reveal from `{opacity:0, y:150}`, tween **0.4s ease [0.44,0,0,1]**, delays **0 / 0.2 / 0.3 / 0.5 s** (9 / 5 / 3 / 2 tiles), `__framer__threshold: 0` (fires on the first visible pixel), **`animateOnce: false`** (they hide again when scrolled out and replay on re-entry). Appear-ids `hqln80`, `j0cp68`, `151e5e9` use the same values on load; `17mjajh` ("Next LAB") delay 0.4.

### 5.3 Intro — NEW
- Section 1440x670, white, padding 80px 96px, row gap 100. Text column 624: **2px solid `#122023` rule** (624x2) on top, then **48px** below it an `<h5>` "Intimate gatherings with top executives, operators, and innovators defining the future of ecommerce." **Instrument Sans 400 36px/43.2px `#122023`** (624x130). Tiles and photos fill the right side.
- **390:** h5 **23px/27.6px** (270 wide), padding 16.

### 5.4 "What is AI Lab" — NEW
- Section 1440x506, padding 80px 96px, row. Left (584): 2px `#122023` rule → eyebrow (600) "CURATED SESSIONS" → H2 "What is AI Lab" (64/64). Right (x 784, 560 wide): h5 (Instrument Sans 400 36/43.2) "AI lab brings together founders, executives, and operators from leading brands to talk about what's working in AI. Each session features a brand that's gone beyond the hype—Brooklinen, Mellow Sleep, Coterie—and the people running their operations." (346 tall).
- **390:** stacked; H2 48/48; h5 23/27.6.

### 5.5 "How it works" 3 columns — NEW
- Section "Features" 1440x439, padding 80px 96px, row **gap 48**, 3 columns of **384**: eyebrow → H3 (Feature Deck Web Regular **52/62.4** `#122023`) → body (Instrument Sans **500 20/28** ls −0.2), gap 24.
  - "HOW IT WORKS" / "Curated panels" / "Intimate discussions. Featured brand shares their AI journey, then open conversation with the group."
  - "LUNCHES AND DINNERS" / "Roundtables" / "Smaller gatherings over food and drinks. Longer format. Deeper into specific challenges and solutions."
  - "PUBLISHED INSIGHTS" / "Published insights" / "We record, document, and share key takeaways. Available to the broader community."
  - **Live-site quirk:** the 2nd and 3rd eyebrows are **`#FFFFFF` on white** (invisible). Replicate them white (pixel parity) or use ink (sensible). Default to white.
- **390:** columns stack (gap 64, padding 24), H3 **36/43.2**, body 16/22.4.

### 5.6 "Become an AI practitioner" (dark block) — NEW
- Wrapper 1440x1213, inner bg **`#122023`**, **padding 112px 64px 312px**, column gap 100.
  - Top row (1312): left 656: **2px `#FFFFFF` rule**, eyebrow (600, white) "WHY ATTEND?", H2 "Become an AI practitioner" (64/64 **white**, 584x128). Right (x 798, 564 wide): h5 "AI lab exists because the best insights come from people doing the work, not selling tools." (Instrument Sans 400 36/43.2 white).
  - 4 columns (row gap 32 → **304** each): number eyebrow "01." … "04." (600 16/22.4 ls 1.7 white) → H3 52/62.4 white → body Instrument Sans 500 20/28 white (gap 24):
    - "Real Metrics" — "Move beyond vanity numbers. See how merchants measure AI's impact on conversion, retention, and customer lifetime value. Frameworks you can use immediately."
    - "Your Peers" — "Connect with operators facing the same challenges. Build relationships with people who understand the complexity of scaling AI in live commerce environments."
    - "AI Ecosystem" — "From autonomous support to business intelligence, explore how AI touches every part of the customer journey. Integration strategies that compound over time."
    - "First Access" — "Early exposure to emerging tools and methods. Shape the conversation before trends become common knowledge. Stay ahead of market shifts without the overwhelm."
  - `#next-lab` row: H2 "Next LAB" (64/64 white). The anchor target for "Join the Next Lab". No cards follow it (empty, then 312px bottom padding with gradient tiles at y 3600).
- **390:** padding 16; H2 48/48; h5 23/27.6 (indented to x 80); columns stack.

### 5.7 "From our last LAB" — NEW
- Section 1440x900, padding 80px 64px, column gap 64: 2px `#122023` rule → eyebrow "PREVIOUS EVENTS" → H2 "From our last LAB".
- One event card **433x516** (same Past Event style, **no button**; content top-aligned): "NOV 7, 2025" · "IN PERSON" · "AI Uncensored with Siena & Yotpo" (h6) · subtitle "AI Uncensored with Siena & Yotpo" · "12pm PT" · "San Francisco". Photo tiles around it (see 5.2).

### 5.8 "Who should attend?" — NEW
- Section 1440x942, padding 80px 64px, row. Left 656: 2px rule, eyebrow "YOU'RE IN GOOD COMPANY", H2 "Who should attend?". Right (x 784, 528 wide): three groups. Each is an H3 (Feature Deck Web Regular 52/62.4 `#122023`) + a bulleted list (`<ul>` disc bullets, items Instrument Sans 500 20/28 ls −0.2, text x 811 i.e. 27px indent):
  - "Founders & GMs": Leading a managing the push toward AI-first operations (sic) · Seeking competitive advantage through intelligent automation · Building an organization that embraces AI innovation
  - "CX & Operations Leaders": Scaling support without scaling headcount · Implementing AI that enhances (not replaces) human judgment · Measuring ROI on autonomous customer experience
  - "Marketing & Growth": Using AI for personalization at scale · Improving conversion with AI insights · Testing new acquisition channels · Leveraging AI for content creation
  - Group spacing: about 48px between a list's end and the next H3.

### 5.9 Newsletter CTA — NEW (replaces MainCta on this page)
- Section 1440x524, bg the peach gradient `linear-gradient(149deg, #F8B57F -21%, #F8B57F 21.83%, #FF5D4E 45.06%, #F95040 71.83%, #FDA3AC 100%)` plus a full-size `<canvas>` grain/animated overlay (not extractable; see 5.2). Padding 112px 64px.
- Card 584x300 (x 428), bg `#FFFFFF`, **no radius**, **1px solid `rgba(0,0,0,0.5)`**, padding 32, gap 24: H2 "Be the first to know what's happening" (64/64 center, 520x128).
- Form row (Framer form → POST `https://api.framer.com/forms/v1/forms/2e04eba5-da94-4317-bac6-314bbc9b96fe/submit`, hidden field `FormId=newsletter`):
  - Email input 363x60: bg `#FFFFFF`, **1px solid `#CDBCA0`**, **r16**, padding 20px 16px, placeholder "john.smith@example.com" `#A7A092`, text `#122023`, required.
  - "Sign me up!" button 147x58 (bg `#122023`, r16, padding 18/24, Instrument Sans 600 18/21.6 white).
  - States: pending/success variants. **On success the H2 text changes to "Thank you! Your submission has been received!"**. In the clone, POST to the same endpoint (or no-op) and swap the heading.
- **390:** card full width minus 32, H2 48/48, input and button stack.

### 5.10 Footer: IDENTICAL.

### 5.11 /ai-lab assets
New (`public/assets/`): `chbWKDcCWdz6Laay1dFVDF6T098.webp`, `f9RYAmmoTh5Z8crb9ahkR5DC0JE.webp`, `8vj9CileH7CuaaiunoniDOrbarI.webp`, `i9WHZ8OCRKB0PgtAy4Cj3YlYzYA.webp`, `vCYHzSbVQFkiJD63RRjesck1GAk.webp`, `RPgbC6APt6VN8fkzaS6O0p7UuKQ.webp`, `rJWsqYiMpnKBomfS1v0G4AcEM.webp`, `aBNy1lWXQMzlHMzsv9vKqJrjCos.webp`, `M7jG4hn37wxejZA8bixJlPNAU.webp`, `IxP8cFFbplPad8dsD3ScHdKPdIo.webp`, `n2cLcUeIHLe1Gj11wKiDu98KQ.webp`, `czHP5ISDMQX62viczmpPaYhQYpE.webp`, `ulS7iAn3fQc6JurqrwLUSxzo4.webp`, plus mobile-only crops `VM2ULGfFDII7Vno4OMI0FZLa7Q.png`, `7Q1lCuYCpccc27bzgfHGWA9E8EM.png`. SVG: `public/svg/ai-lab-nav-logo-white.svg`.

---

## 6. /roi-calculator

Document height 1440: **3480**. 390: **4411**. Section order: Hero + calculator 0–1013 (`#F3F0EB`) · Testimonials 1013–2355 · CTA 2355–3046 · Footer. Nav and footer are IDENTICAL to the homepage.
Calculator source (Framer code component, de-minified for reference): `recon/pages-b/roi-calculator-source.js.txt`. Screens: `recon/pages-b/roi-step1.png`, `roi-step1-error.png`, `roi-step2.png`, `roi-step3.png`. The step dumps with exact boxes are in `recon/pages-b/roi-steps.txt`. Steps 2→3 were exercised with the HubSpot/n8n requests **intercepted locally** (nothing was submitted).

### 6.1 Hero — NEW
- Section 1440x1013, bg `#F3F0EB`, flex row center, **padding 160px 96px 120px**, overflow hidden. Inner row max **1062**, **gap 64**, two 499-wide columns, align flex-start.
- Left column (x 189):
  - H1 "See the ROI for yourself" (Light 300 80/80 ls −0.8, left, 499x160).
  - 24px below: sub "Discover exactly how much you'll save with AI agents." (Instrument Sans 500 20/28 ls −0.2), opacity 0.82.
  - 80px below: eyebrow (600) "WHAT TO EXPECT".
  - List (rows ≈47px apart): FA Sharp Light 20px **U+E5D6** icon (18 wide, `#122023`) + Tiempos 18/23.4 ls −0.18 `#2A3639` (text x 217): "Immediate cost reduction", "Higher efficiency, happier teams", "Exceptional CX, proven by a 4.81 avg. CSAT", "New opportunities for revenue growth".
  - Appear: H1 0.2s, sub 0.3s (→0.82), the eyebrow+list group (`ttsu9b`) 0.4s (§0 primitive).
- Right column: the **calculator card** (x 752, 499 wide), with appear `f0nir` from `{opacity:0.001, x:150}` to `{opacity:1, x:0}`, **spring bounce 0.2 duration 0.6 delay 0**.
- Decorative blur image `/assets/kNOuUUIKKOVF7lVsrJ7k9ktjPow.webp` (794x835) at 715x708, `left:725px; top:305px` (page coords), cover, **behind** the card (the blue/red glow at the card's right and bottom edges).

### 6.2 ROI calculator — NEW (exact behaviour)
**Shell:** outer `padding:3px; border-radius:16px; background: linear-gradient(209deg, #294FBA 0%, #2E79D8 15.92%, #827ACC 34.17%, #FB5646 66.13%, #FEC796 90.23%, #F2E59A 100%)`. Inner `.full-card`: bg `#F3F0EB`, **r14**, **padding 40px** (≤800px: 24px).
**Shared atoms:**
- Heading (`W.h5`): font-family **`"Feature Deck"`**, 36px/40px, ls −0.3px, `#122023`, margin-bottom 16. **Note:** no font face named exactly "Feature Deck" is loaded, so the browser falls back to its default serif (Times in Chromium/Safari). The live site shows a Times-like serif. For pixel parity use `font-family: "Feature Deck", "Times New Roman", serif`.
- Text input `V`: wrapper `margin-bottom:16px; flex:1`. Label Instrument Sans **600 14px**, `#000`, display flex, gap 3, margin-bottom 4, plus an optional "(optional)" `<p>` at opacity 0.2. Input: `width:100%; min-height:56px; padding:0 16px; border:1px solid #CDBCA0; border-radius:16px; font-size:15px` (font-family falls to the UA `sans-serif`), color `#122023`, outline none, bg white; placeholder color `#A7A092`. Numeric inputs show **empty** while the value is 0 and untouched; on change `parseFloat(value) || 0`. Text inputs store the raw string. Focus shows no ring (outline none, the border stays `#CDBCA0`).
- Rows `.row`: flex, gap 16, margin-bottom 8 (step 1) / 16 (step 2), wrap. ≤800px: flex-direction column, gap 0, margin-bottom 0.
- Primary button `U`: bg `#122023` (disabled `#A0A0A0` + `cursor:not-allowed`), white, padding 16px 24px, r16, Instrument Sans **600 18px**, margin-top 16, flex align center **gap 7**, no border, optional 17x17 white arrow icon (path in the source; viewBox 0 0 18 17). ≤800px: **all `<button>`s on the page** get `width:100%; justify-content:center`. This global style tag leaks, so scope it in the clone.
- Error box (`W.errorText`): Instrument Sans 14px `rgb(169,68,66)`, bg `rgb(242,222,222)`, `1px solid rgb(235,204,209)`, r8, padding 10px 15px, margin 10px 0 15px, left aligned.
- State is kept in memory only. Nothing persists across reloads.

**Step 1 "Plug in your numbers & forecast your future"** (card 499x733):
- Heading → paragraph "Use our ROI calculator to see how we make magic happen. It's quick, easy, and kinda satisfying!" (Instrument Sans 16px/normal `#122023`, max-width 500, `border-bottom:1px solid #00000030`, padding-bottom 20, margin-bottom 28).
- Inputs (all `type=number`):
  - Row 1: **Annual Tickets Volume** | **Number of Agents**.
  - Row 2: **Annual In-House Customer Service Team Cost**.
  - Row 3: **Annual BPO Team Cost** `(optional)`.
  - Row 4: **Average Order Value** | **Annual Help Desk Cost**.
  - At 1440, half-width inputs are 199x56 and full-width 413x56.
- Right-aligned **"Next →"** button (112x54).
- On Next: if any of ticketsVolume, numberOfAgents, inHouseCost, averageOrderValue, helpDeskCost is falsy (0/empty) → show "Please fill in all required fields." above the button (the card grows to 790). Otherwise go to step 2. BPO cost is optional.

**Step 2 "Your details"** (card 499x555):
- Heading styled with `border-bottom:1px solid #00000030; padding-bottom:20px; margin-bottom:40px`.
- Text inputs: Row **First Name*** (placeholder "John") | **Last Name*** ("Smith"); **Work Email*** ("john.smith@example.com"); **Where did you hear about us?*** ("Write us something...").
- Right-aligned **"View results →"** (175x54).
- On click: if any field is empty → "Please complete all contact fields." (no email-format check). Otherwise the button is disabled while submitting:
  1. `POST https://n8n-siena.up.railway.app/webhook/7aea31fe-a96e-40b8-bafa-43ee84c92bf0`, JSON `{formId:"aba7ea3e-5aaa-47a6-b2ab-6f3dd509821a", ...numbers, ...contact}`.
  2. `POST https://api.hsforms.com/submissions/v3/integration/submit/24278528/aba7ea3e-5aaa-47a6-b2ab-6f3dd509821a` with fields firstname/lastname/email/attribution (objectTypeId "0-1") and context `{hutk: cookie hubspotutk, pageUri, pageName}`.
  3. If HubSpot returns ok → step 3. Else errors: "Form submission failed (Status: N). Message: …", or "Submissions from this email address are not allowed." when HubSpot says the email address is blocked, or on a network error "An error occurred while submitting the form. Please check the console."
  - **Clone recommendation:** don't post to Siena's production HubSpot/n8n. Gate the network calls behind an env flag and go straight to step 3 by default.

**Step 3 "1st Year Projections"** (card 499x861; the heading has the same border-bottom/padding/margin as step 2):
- **Siena Automation Rate** (label Instrument Sans 500 18px `#343A40`, min-width 180, nowrap). Row (gap 10): range slider `min 0 max 100`, default **20**, track 6px r3 `linear-gradient(to right, #000 0%, #000 {v}%, #ccc {v}%, #ccc 100%)`; thumb 26x26 circle `linear-gradient(210deg, #294fba 0%, #2e79d8 15.92%, #827acc 34.17%, #fb5646 66.13%, #fec796 90.23%, #f2e59a 100%)`, `border:4.5px solid #000`, `margin-top:-9px`, `box-shadow:0 0 3px rgba(0,0,0,.5)`. Plus a number box 70x42 (padding 10px 8px, `1px solid #BEBEBE`, r8, Instrument Sans 16 `#343A40`, centered, white) that **clamps to 0–100** (`parseInt`, NaN ignored). Slider and box are two-way bound.
- **Annual Ticket Volume** row (`.value-input-container`: flex, align center, gap 20, margin-bottom 16): label 500 18 `#343A40` + helper "More tickets, lower cost per conversation with Siena" (Instrument Sans 14px `#6A737D`), and a number input 100x42 (same style as the 70px box) bound to the **same** ticketsVolume as step 1 (`parseInt`, NaN ignored). ≤800px: stacks, input full width, left text.
- `<hr>` 1px `rgba(0,0,0,0.25)` (margin 35px 0 25px).
- Result rows `.result-container` (flex space-between, padding 10px 0, Instrument Sans **400 18px**, `#000`; ≤800px column, gap 8): Siena Driven Revenue · Siena Cost per Automated Conversation · Total Savings / Year · Total Yearly ROI After Siena Cost · Average Response Time = "30 seconds" (static) · Average Resolution Time = "5 minutes" (static).
- `<hr>` (margin 25px 0). Then the closing line "Want to see Siena's magic in action? `<br>` Connect with our experts and learn how!" (**Tiempos Text Regular 24px/normal `#122023`**). Then a **"Book a demo"** button (157x54, no icon): navigates to `/book-a-demo` and resets every number to 0 (including the rate).
- **Formula (exact, recomputed on every change while on step 3):**
  ```
  rate = automationRate / 100                       // default 20 → 0.2
  costPerConv = tier(ticketsVolume)                  // see table
  costPerTicket = (inHouseCost + bpoCost + helpDeskCost) / ticketsVolume
  automated = ticketsVolume * rate
  convertedOrders = automated * 0.02
  sienaDrivenRevenue = convertedOrders * averageOrderValue * 0.3
  sienaCost = automated * costPerConv                // computed, not shown
  totalSavings = automated * costPerTicket
  yearlyROI = totalSavings + sienaDrivenRevenue - 24000   // flat $24k; sienaCost is NOT subtracted
  display: "$" + n.toFixed(2)  → e.g. "$126000.00" (no thousands separators); cost per conv "$0.87"
  ```
  `tier()` takes the first band with `min <= v < max`, else falls back to 0.69: [0,10k) **0.99** · [10k,15k) 0.97 · [15k,25k) 0.95 · [25k,30k) 0.93 · [30k,40k) 0.91 · [40k,50k) 0.89 · [50k,60k) **0.87** · [60k,80k) 0.85 · [80k,100k) 0.83 · [100k,150k) **0.81** · [150k,200k) 0.79 · [200k,250k) 0.78 · [250k,300k) 0.76 · [300k,350k) 0.74 · [350k,400k) 0.73 · [400k,500k) 0.71 · [500k,1M) 0.69 · ≥1M → 0.69.
  (`numberOfAgents` is only used for validation. `convertedOrders`/`automated` are computed but not displayed.)
- **Verified live** (inputs tickets 50000, agents 10, in-house 600000, BPO 0, AOV 80, help desk 30000): rate 20 → Revenue **$4800.00**, Cost/conv **$0.87**, Savings **$126000.00**, ROI **$106800.00**. Slider 50 → $12000.00 / $0.87 / $315000.00 / $303000.00. Then tickets 120000 → $28800.00 / **$0.81** / $315000.00 / $319800.00.
- No transitions between steps: the content swaps instantly and the card height jumps (733 → 555 → 861).
- **390:** card 342 wide at y 628 (inner padding 24 → content 288). Every row stacks (inputs 288 wide, gap 0 + the 16px wrapper margin). The Next button is full width (288x54, centered content). The step-1 heading wraps to 3 lines (288x120).

### 6.3 Testimonials "People are talking" — VARIANT of homepage `Testimonials`
- Wrapper padding **80px 0 32px**, gap 10. Title: eyebrow "REAL IMPACT, REAL SAVINGS" + H2 "People are talking" (64/64 center).
- Slider box ("Testimonials", padding 24px 96px) → card "content" **max-width 1200**, `linear-gradient(0deg, #FFFFFF 0%, #F3F0EB 100%)` (beige top → white bottom), r24, padding 24px 16px. **The card is a fixed 1062px tall**: the slide content (about 569) sits at the top and the rest is empty gradient. That's a live-site quirk; keep the height for parity.
- Same **11 slides, order and copy as the homepage** (§3 of CLONE_SPEC; starts with Kylah Field / Spanx; counter "1 / 11"), same controls and slide animation. Diffs: inner width 1104 → quote column **532**, image **532x400** r32 cover (homepage 452x452); role in the memory style (Instrument Sans 600 12/16.8 ls 0.6 uppercase `#787368`). No play badge was observed.
- **390 (live quirk):** the slide stays a ROW at 390, so the quote column and the image are both **143 wide** (image 143x143 at x 215, quote 474 tall). Recommended: use the homepage mobile slide layout instead and note the deviation.

### 6.4 CTA — VARIANT of `MainCta`
- 1440x**691**, card 1062x291 (padding 64, r48), H2 **"Brands that win on CX run on Siena"** (1 line, 934x64), Book a demo. Same background image `ERYNplIY591uk80wpoa4JGglO8.webp`. **No top fade.**

### 6.5 /roi-calculator assets
New: `public/assets/kNOuUUIKKOVF7lVsrJ7k9ktjPow.webp`. Reused: testimonial images/logos from the homepage, `ERYNplIY591uk80wpoa4JGglO8.webp`. SVG: arrow icon path (inline in source), `public/svg/roi-calculator-hero-54b874.svg` (17x17 arrow, same path), slider chevrons `slider-prev-chevron.svg` / `slider-next-chevron.svg`, quote mark `memory-quote-mark.svg`.

---

## 7. Reuse matrix (quick reference)

| Route / section | Status | Existing component | Key diffs |
|---|---|---|---|
| All: Nav | IDENTICAL except /ai-lab | `Nav` | /ai-lab uses the "Dark" variant (§5.0) |
| All: Footer | IDENTICAL | `Footer` | — |
| /memory, /video, /order-tracking: logo ticker | VARIANT | `hero/LogoTicker` | 1 row, left 30px/s, gap 64 (40 mobile) / 112 on order-tracking, edge mask 12.5% (10% mobile; none on order-tracking), new logo set `svg/ticker-logo-*` |
| /memory hero | NEW | — | full-bleed photo, left-aligned copy |
| /memory Feature 1/2 | NEW | (reuses chat-bubble styles from `scroll-area/ChatMock`) | static rows, scroll-reveal bubbles |
| /memory How it works | VARIANT | `Metrics` shell | 3 columns instead of the counter |
| /memory Memory in action carousel | NEW | — | Framer SlideShow, 4-up, autoplay 1.5s, spring 200/40 |
| /memory, /products/docs, /roi-calculator testimonials | VARIANT | `Testimonials` | width, slide count, role style, controls (docs: none) |
| /video, /order-tracking sticky scroll | VARIANT | `ScrollArea` | h3 52/62.4 + 20/28 paragraph, staged video/globe visuals, 3 or 2 blocks |
| /products/docs "One home" | VARIANT | `ScrollArea` | single block, mirrored, doc-card ticker |
| /order-tracking + /products/docs FAQ | NEW (shared) | — | `Faq` accordion |
| CTAs | VARIANT | `MainCta` | title / fade (color, height, or none) / height per route (§1.6, §2.4, §3.6, §4.8, §6.4) |
| /ai-lab newsletter CTA | NEW | — | form + success swap |
| /roi-calculator calculator | NEW | — | §6.2 |

Fonts: every family used on these routes is already declared in `src/index.css` (including Tiempos Text Regular Italic). The one gotcha is the ROI heading's `"Feature Deck"`, which isn't loaded anywhere and falls back to the browser serif (§6.2). No new font files were downloaded.
New JS dependencies: `cobe` (order-tracking globe). The lottie dots can use the existing `features/LottiePlayer`.
