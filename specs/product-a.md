Source: https://www.siena.cx/

# Product pages A — Clone Spec (shopping-agent, social-agent, ai-review-management, qa-agent, topics-explorer, ask-siena)

Measured live 2026-10-22 with headless Playwright (own Chromium, 1440x900 and 390x844). Read together with `/Users/riyaghosh/V3/siena/CLONE_SPEC.md` §0 (tokens, fonts, breakpoints, appear primitive). Everything below is computed-style / bounding-rect data, not eyeballed.

Scratch data (all reproducible): `/Users/riyaghosh/V3/siena/recon/pages-a/`
- `<route>-1440.png`, `<route>-390.png` full-page screenshots (cookie banner visible in some; scroll-driven/sticky content appears blank in full-page captures — use `states/*.jpg` viewport captures for those).
- `<route>-<w>.tree.txt` full computed-style DOM tree (one line per element: `#index <tag> [framer-name] x,y WxH styles T"text" [font]`). `<route>-<w>.g.txt` = condensed version (nav/footer/ticker stripped).
- `states/<route>-1440-<scrollY>.jpg` + `states/<route>-1440.states.txt` viewport screenshots + visible text at specific scroll positions.
- Scripts: `recon.cjs` (tree), `dumpsec.cjs` (dump one section at a scroll position), `probe.cjs`/`tprobe.cjs` (scroll- and time-sampled measurements), `svgx.cjs` (inline SVG extraction).

Conventions: `FI/<hash>` = `https://framerusercontent.com/images/<hash>`; all such files are downloaded to `public/assets/<hash>` (same filename). "RAINBOW255" = `linear-gradient(255deg, #F2E59A 0%, #FEC796 14.8649%, #FB5646 32.8829%, #827ACC 52.2523%, #2E79D8 79.7297%, #ABABAB 100%)` (used as a 2px "gradient border": outer div bg = gradient + padding 2px + radius R, inner div radius R-1). "eyebrow" = Instrument Sans 600 16px/22.4px ls 1.7px uppercase `#122023` (mobile 14px/19.6px). "H2 section" = Feature Deck Web Light 400 64px/64px ls −1.28px `#122023` (mobile 48/48 ls −0.96). "subtitle" = Instrument Sans 500 20px/28px ls −0.2px `#122023` with wrapper opacity 0.82 (mobile 16px/22.4px ls −0.16).

---

## 0. Cross-page notes (apply to all 6 routes)

### Nav
- **Identical to homepage Nav component** (`src/components/Nav.jsx`): same announcement bar, pill, links, mega-menu, mobile nav (mobile nav bg `#F3F0EB`, 390x113 closed, on every route).
- Scroll behaviour: on shopping-agent, ai-review-management, qa-agent, topics-explorer, ask-siena the pill is transparent at the top and switches to the "On Scroll" variant (bg `#FAF7F1` + layered shadow) between scrollY 150 and 160 — **same as homepage**.
- **social-agent is different:** the nav is in the "On Scroll" variant already at scrollY 0 (bg `#FAF7F1` + shadow, never transparent). Give Nav a prop like `alwaysSolid` for this route.
- Hero backgrounds: shopping-agent hero is `#F3F0EB` (like homepage). The other five heroes are **white `#FFFFFF`**; the transparent nav sits over white.

### Logo tickers
- Same two rows, same logo order/files/sizes as homepage `Hero` tickers (`src/components/hero/LogoTicker.jsx` + `tickerData.js`): row 1 moves right **+30 px/s**, row 2 left **−30 px/s** (measured 30.0–30.2 px/s on every page), gap 112px (72px mobile), no mask, 27 / 28 items. **IDENTICAL content/animation**; only the container differs per page (see each route): on shopping-agent it is inside the hero, constrained to 1248px (x 96–1344); on social/reviews/qa/topics it is a standalone full-bleed 1440x96 `[Logos]` block directly under the hero, with white side fades (see §2.2).

### Main CTA
- Uses the homepage `MainCta` structure (§9 of CLONE_SPEC: bg image `ERYNplIY591uk80wpoa4JGglO8.webp`, card `#F3F0EB` radius 48 padding 64 max-width 1062, xlg "Book a demo"). **VARIANT: heading text differs per route** (and the section height follows the line count). Make the heading a prop. Per-route text listed in each section. On shopping-agent the top "Blur out" gradient overlay is absent (see §1.7).

### Footer
- **IDENTICAL** to homepage `Footer` on all 6 routes (desktop 1440x434 at the page bottom; mobile 390x1080).

### Testimonial card ("Testimonials" sections on product pages)
- Every product-page testimonial is a **VARIANT** of the homepage testimonial slide (`src/components/testimonials/Slide.jsx`): same quote-mark SVG (30x24), quote typography (Instrument Sans 400 25.6px/33.28px ls −0.512px `#122023`), logo slot 140x64 (`object-fit: contain`, object-position 0% 50%), name (Instrument Sans 500 20px/28px ls −0.2px), and — when there are several slides — the identical Prev/Next round buttons, counter and 300ms horizontal slide. Common diffs (exact per-page values in each route section):
  - No section title block. The slideshow sits inside a **panel** (padding 24px 16px, slideshow padding 16px 32px 48px). Panel background/radius/max-width vary: shopping `linear-gradient(0deg,#FFFFFF,#F3F0EB)` r24 1200 · social `#FAF7F1` r48 1184 · reviews `linear-gradient(180deg,#FFFFFF,#FAF7F1)` r24 1072 · qa A `rgba(255,255,255,0.5)` r24 1200 · qa B / topics `#FAF7F1` r24 1200 · ask-siena: no panel.
  - Image size: 532x532 (shopping, qa, topics), 524x524 (social), 468x468 (reviews), 480x552 r24 (ask-siena); homepage 452.
  - Role line: Instrument Sans **600 12px / 16.8px, ls 0.6px, uppercase, `#787368`** on all except ask-siena (which keeps the homepage 16/22.4 ls 1.7 `#122023`).
  - Single static testimonial (no controls/counter) on social, qa (x2), topics. Sliders: shopping (2), reviews (the homepage 11, identical content), ask-siena (3).
  - Mobile 390: panel full width (radius 24); image first (320x320 r32), quote 19.2px/24.96px ls −0.384px (social: 16/19.2), name 16px/22.4px ls −0.16px, role unchanged.

### Fonts — FLAG
All pages use the fonts already declared in `src/index.css`, **plus** these not yet declared (woff2 downloaded to `public/fonts/`):
- **Tiempos Text Regular Italic** 400 italic — `public/fonts/0H28sSRAjligzhoQMhfSh8CwkA0.woff2` (src `https://framerusercontent.com/assets/0H28sSRAjligzhoQMhfSh8CwkA0.woff2`). Used on ai-review-management, qa-agent, ask-siena (`<em>` inside Tiempos text).
- **Inter 500** — `public/fonts/UjlFhCnUjxhNfep4oYBPqnEssyo.woff2` (unicode-range U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2070,U+2074-207E,U+2080-208E,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD). Used for "Powered by" 10px labels (shopping-agent, ai-review-management).
- **Font Awesome 6 Sharp Regular** 400 — `public/fonts/hJSj523CSkjvSFCg8AbaWzZ0mEY.woff2` (ask-siena icons).
- **Lato 700** — `public/fonts/lato-700-S6u9w4BMUTPHh6UVSwiPGQ.woff2` (from `https://fonts.gstatic.com/s/lato/v25/S6u9w4BMUTPHh6UVSwiPGQ.woff2`, ask-siena only).
- Note: some Framer text uses `font-family: "Feature Deck"` (e.g. "Add to cart" buttons in the shopping chat mock). That family is never loaded, so the browser renders the **fallback sans-serif** (Chromium default = Helvetica/Arial-like). Reproduce with `font-family: "Feature Deck", sans-serif` (i.e. just a generic sans).

### Appear primitive on these pages
Same Framer appear mechanism as homepage (initial `opacity:0.001` + offset → animate on load). Exact per-element values are listed per route (they differ: several pages use spring transitions `{type:"spring", bounce:0.2, duration:1}` and smaller offsets).

### Video
- `public/video/abstract-landscape-moving-shapes.mp4` (1,148,946 bytes, from `https://4positiveimpact.b-cdn.net/Abstract%20Landscape%20Moving%20Shapes.mp4`). Some elements reference the same filename on `framervideos.b-cdn.net`, which returns 403 — it is the same clip; use the local file. Used as a decorative muted/loop/autoplay `<video>` (`object-fit: cover`) on several pages, and in the nav mega-menu (already handled by Nav).

---

## 1. /shopping-agent

Page title: "Siena Shopping Agent - Turn conversations into conversions". Document height 9150 @1440, 9871 @390 (varies ±50 with variant states).
Screens: `recon/pages-a/shopping-agent-1440.png`, `-390.png`; scroll states `recon/pages-a/states/shopping-agent-1440-{2084,2400,2700,3000,3300,3600,3784,5949,...}.jpg`.

Section order @1440 (y / h): Hero 0/1026 · Testimonial 1026/868 · Title block 1894/190 · Scroll Area 2084/2600 · "Your team of expert agents" 4684/1265 · "Content display (Timer)" 5949/2076 · Main CTA 8025/691 · Footer 8716/434.
All inside `[Main]` (flex column, align center, gap 0). Nav: homepage behaviour (transparent → solid at scrollY 150–160).

### 1.1 Hero — NEW (two-column; tickers = homepage ticker, IDENTICAL content)
- Section: 1440x1026, bg `#F3F0EB`, padding **120px 96px 0**, flex column center, gap 0, overflow hidden.
- Row `[Title]`: max-width **1110** (x 165–1275), flex row, justify/align center, **gap 40px**, padding-bottom 48, height 648.
  - Left `[Header Copy]` 546 wide, flex column, align flex-start, justify center, **gap 40px** (text group → button).
    - Text group gap **18px**: heading group (gap 24) + subtitle.
    - H1 "Meet your Shopping Agent" — Feature Deck Web Light 300, **80px/80px, ls −0.8px**, `#122023`, left, 546x240 (3 lines: "Meet your" / "Shopping" / "Agent").
    - Underline swash `[Vector 77]` image `public/assets/MJbk4aQblPanJHyFV9X8Yg7JDqI.png` (241x18 natural), absolute in the heading group at `top:238px; left:-6px` → 241x18, i.e. under the word "Agent" (it overlaps the bottom of line 3). z 1.
    - Subtitle (wrapper opacity **0.82**, max-width 630): "Transform every customer touchpoint into revenue opportunities. Siena understands context, remembers preferences, and guides customers toward purchase with human-like intelligence." — Instrument Sans 500 20px/28px ls −0.2px `#122023`, left, 546x112 (4 lines).
    - CTA: homepage xlg "Book a demo" button (157x58, `BookDemoButton`) — IDENTICAL, left aligned. href `./book-a-demo`.
  - Right `[Visual wrap]` 524x390 (x 751, y 225). Contains `[Visual]` absolutely positioned `top:-55px; left:-74px; right:-74px; bottom:-55px` (= 672x500 box) with **`transform: scale(0.78)`** (origin center) and z −1. All coordinates below are in the unscaled 672x500 box (multiply by 0.78 for screen size):
    1. Texture background: absolute `top:-77px; left:-7px; right:-8px; bottom:-30px` → img `public/assets/7ZZpyAWbb7tu6eaWiuxBDOBokOE.webp` (1444x1201) `object-fit: contain`.
    2. Product tile "Icon Button": absolute `top:270px; left:35px` 164x164 (screen 128x128), `transform: translateY(-82px)` (static), bg `#FFFFFF`, radius 16, padding 4 → img `public/assets/EvW4Cm4cXRAMnF0Al3rzYElY0.webp` radius 12 cover. A white logo chip (radius 8, padding 8, bg #fff) at `top:-29px; left:58px` holding the Simple Modern logo SVG `public/svg/shopping-agent-Logos-5-d4b67.svg` (111x40 viewBox, rendered 87x31 on screen).
    3. Product card `[Card]` absolute `top:3px; left:185px; right:73px` (screen 323x106): 2px gradient border `linear-gradient(289deg, #F2E59A 0%, #FEC796 14.8649%, #FB5646 32.8829%, #827ACC 52.2523%, #2E79D8 79.7297%, #ABABAB 100%)` radius 16 → inner bg `#FAF7F1` radius 15 padding 8. Row gap 8: thumb box 83x83 (bg #fff radius 16 padding 4, img `public/assets/E41dkaPjzIYO8X5LquyvnNWA5k.png` cover) + column (gap 8): "Voyager Tumbler - Signature" and "$37.99" (both Tiempos Text Regular 400 20px/26px `#122023`), then pill button 218x37 (bg `#EFE5D0`, radius 24, padding 4, overflow hidden; background texture img `public/assets/1bDMxZj8W2T4NADqgydu75txHrc.webp` absolute `top:-57px; left:-11px; right:-33px; bottom:-78px` cover) with inner glass pill (bg `rgba(255,255,255,0.5)`, `backdrop-filter: blur(6px)`, radius 24, padding 6px 8px) label "Add to cart" Feature Deck Web Regular 400 20px/28px `#122023`.
    4. Person cut-out: absolute `top:26px; left:-4px; right:-101px; bottom:29px` → img `public/assets/w6eD4Ur8zTRM35rkpRmfdnDQ8Fg.webp` (842x482) cover.
    5. Suggestion list `[List]` absolute `top:225px; left:392px; right:0` (218 wide), flex column gap 10, three chips: bg `rgba(255,255,255,0.6)`, `backdrop-filter: blur(6px)`, radius 24, padding `8px 16px 8px 8px`, gap 12; icon FA6 Sharp Light U+F890 (sparkles) 24px `#122023`; text Tiempos Text Regular 400 **12px/15.6px** `#122023`: "How does the leak-resistant lid prevent spills?", "Can it keep drinks cold for over 24 hours?", "How does the handle improve on-the-go usability?".
    6. Prompt pill `[Footer]` absolute bottom 0, centered (`left:336px; translateX(-50%)`), 346x71 (screen), bg #fff radius 48 padding 16, background texture img `public/assets/P2z8QZxCKrgmbnpcOvGB6CRRlEs.webp` cover; inside a RAINBOW255 2px border pill (radius 40) → white inner (radius 32, padding 4) → row (padding 4px 12px, gap 8): 20x20 Siena glyph `public/svg/shopping-agent-Icon-Black-d8122.svg` + "What can I help you with?" Feature Deck Web Regular 400 **32px/38.4px** `#122023`.
  - No hover/loop animation on the visual (time-sampled 6s: static).
- Tickers `[Logos]`: 1248x96 at y 768 (inside the 96px padding, so they are clipped to x 96–1344, NOT full-bleed), flex column space-between, overflow hidden, z 1. Content and speeds = homepage tickers (IDENTICAL, ±30px/s, gap 112).
- Bottom fade `[Rectangle 7061]`: in-flow block 1672x162 at y 864 (x −116, i.e. wider than the viewport, centered), `background: linear-gradient(180deg, #F3F0EB 0%, #FFFFFF 100%)`. Hero ends at 1026.
- Load motion (Framer appear, exact): H1 wrapper & swash `{opacity:0.001, y:200} → {opacity:1, y:0}`, tween 0.7s, delay **0.2s**, ease `[0, 0.91, 0.14, 0.85]`; subtitle → opacity **0.82**, delay **0.3s**, ease `[0, 0.91, 0.78, 1]`; button delay **0.4s**, ease `[0, 0.91, 0.78, 1]`. Same at tablet/phone. Visual and tickers: no entrance.
- **Mobile 390:** hero 390x1243 (y 40–1283), padding 96px 0 0. Title column: padding 0 24px 72px, gap 40, centered. H1 Feature Deck Web Light 300 **56px/56px ls −0.56px, centered**, 342x168; swash 161x12 centered under it (x 114, y 300). Subtitle 16px/22.4px ls −0.16 **centered** (342x112). Button centered. Visual wrap 342x383 below (in flow, not scaled): texture img 357x315 at top 137; product tile 120x120 at (11,58) radius 16 with logo chip 97x40; card 166x106 at right (x 201) with 56x56 thumb, title Tiempos **10px/13px**, price 12px/15.6px, "Add to cart" Feature Deck Web Regular **12px/16.8px** `#000`; person cut-out 547x313 at `top:188px; left:-70px` translateY(−157px); list 187 wide at (158,168), chips padding 6px 16px 6px 8px gap 8, icon 16px, text Tiempos 10px/13px, list gap 6; prompt pill 288x70 with text Feature Deck Web Regular **18px/25.2px**. Tickers 390x94 at y 1027. Gradient rectangle 523x162.

### 1.2 Testimonial — VARIANT of homepage Testimonials (see §0 "Testimonial card")
- Section `[Testimonials]` 1440x868, flex row center, padding **24px 96px 136px**, overflow clip, NO title.
- Panel: 1200x708, bg `linear-gradient(0deg, #FFFFFF 0%, #F3F0EB 100%)`, radius 24, padding 24px 16px. Slideshow padding 16px 32px 48px; controls row (40 tall) on top, slide 24px below.
- 2 slides (counter "1 / 2"), Prev/Next loop, horizontal slide like homepage (same buttons, 18x18 chevrons `public/svg/shopping-agent-content-73425.svg` prev / `-02043.svg` next):
  1. Logo `public/assets/cWSgPP32JnZ7g664uzOfA2s8kg.svg` (Simple Modern, 100x40 natural, rendered in 140x64 contain, left) — "We’ve been blown away by how powerful Shopping Agent is. It delivers friendly recommendations, links, and even ‘add to cart’ buttons in live chat, and the revenue dashboard shows the direct impact of these conversations on sales!" — **Katie Mitchell** — CUSTOMER EXPERIENCE MANAGER — image `public/assets/un5gsMUPuAE28uvzojNnQ2Mpw.webp` 532x532 radius 32 cover.
  2. Logo `public/assets/LSDtiaYEMw66OjmYASlgwlerh24.svg` (Dossier) — "The Shopping Agent is like a concierge. Customers can ask for recommendations and advice, and it's like really talking to a human." — **Oana Sale** — VP OF CX — "Read full story" secondary button (homepage style) — image `public/assets/9fA2lBSmySE9x9KeEK3zvBHdnS8.webp` 532x532.
- Slide text column: 532 wide, gap 32 (quote mark → quote block → brand row). Brand row: logo (140x64) above person (gap 16); person gap 12. Role: Instrument Sans 600 12px/16.8px ls 0.6px uppercase `#787368`.
- **Mobile:** section padding 56px 0; panel 390 wide (no bg visible difference; same gradient) padding 0; image 320x320 first, then quote (Instrument Sans 400 19.2px/24.96px, 326 wide), brand row: logo 140x64 + person side by side (name 16px/22.4px).

### 1.3 Section title block — NEW (simple, reusable "SectionTitle")
- Standalone `[Title]` 1062 max-width, flex column center, gap **24px**, y 1894 (directly after the testimonial section, no section padding of its own).
  - Eyebrow "THE COMPLETE AGENTIC COMMERCE PLATFORM" (eyebrow style, center, wrapper max-width 564).
  - H2 "AI that learns, sells, and scales" (H2 section style, center, 1062x64).
  - Subtitle (opacity 0.82, max-width 680): "See how leading brands turn customer conversations into measurable revenue growth with AI that sells, not just supports." (20/28 center, 680x56).
- **Mobile:** padding 56px 24px 0, gap 16; eyebrow 14/19.6; H2 48/48 (342x96); subtitle 16/22.4 (342x67).

### 1.4 Scroll Area (sticky, 3 steps) — NEW (structurally similar to homepage ScrollArea pinning, but different content; build as its own component)
- Section `[Scroll Area]` 1440x**2600**, bg #fff, flex row, justify center, align flex-start, **gap 64px**, padding 0 96px.
- Two sticky columns, both `position: sticky; top: 0; height: 900px` (pinned for 2600−900 = 1700px of scroll):
  - Left `[Sticky]` 273 wide (max 512) at x 296 — flex column center, gap 10. Inner block 273x900 (column, justify center, gap 32) holds `[Descriptive N]` 273x655 (radius 24, overflow hidden, no bg) containing an absolutely centred `[Container]` (248 wide; `top:327.5px; left:136.5px; transform: translate(-124px, -50%)`), flex column gap 10:
    - `[Labels]` column, **gap 6px**, labels accumulate top→bottom in order 1, 2, 3 (step 1 shows label 1; step 2 shows 1+2; step 3 shows 1+2+3): each label = pill 215x40 (185x40 for the 3rd), bg `#EFE5D0`, radius 24, padding 4, overflow hidden → inner glass pill bg `rgba(255,255,255,0.5)`, `backdrop-filter: blur(2px)`, radius 24, padding 6px 12px → `<li>`-style numbered text (decimal marker inside, padding-left 14.4px) Geist Mono 400 **12px/20px ls 0.48px uppercase `#000`**: "1. CONVERSATION STARTERS", "2. ADD TO CART FROM CHAT", "3. SMART DISCOUNTING".
    - Description card: RAINBOW255 2px border, radius 16 → inner bg `#FAF7F1` radius 15 padding 16 → H6 Feature Deck Web Regular 400 **24px/33.6px** `rgba(18,32,35,0.8)`, 212 wide: step 1 "Proactively engage visitors with intent-driven nudges."; step 2 "Reduce friction and shorten the purchase journey."; step 3 "Trigger personalized offers to convert hesitant buyers."
    - Because the container is centred vertically (translateY −50%), adding a label shifts the stack up by 23px (measured translateY −93.4 → −116.4 → −139.4).
    - Below (absolute `top:822px; left:271px`, opacity **0.4**): co-brand lockup row (gap 10, centered, 308x62): Siena wordmark 121x32 (`public/svg/shopping-agent-Variant-1-4a4b3.svg`) · "x" (Feature Deck Web Light 300 80px/80px ls −0.8, bottom aligned) · white chip (radius 8, padding 8) with Simple Modern logo 111x40 (`public/svg/shopping-agent-Logos-5-d4b67.svg`).
  - Right `[Sticky]` 512 wide at x 633, padding **110px 0 40px**, flex row center. Chat card `[Chat N]` 512x655, radius 24, overflow hidden → `[Chat UI]` 512 wide, bg `rgba(243,240,235,0.3)`, `backdrop-filter: blur(8px)`, radius 12, padding 24, flex column gap 12 (height grows with content: 517 / 599 / 529).
    - Message bubbles: customer = RAINBOW255 border radius 16 → inner `#FFFFFF` radius 15 padding 16; Siena = same border → inner `#EFE5D0` radius 15 padding 16, right-aligned row (justify flex-end, gap 10) with a 52x52 white round "Brand" avatar (radius 90) showing the SM logo (data-URI SVG 37x18, extracted as `public/svg/shopping-agent-Logos-5-d4b67.svg` is the large version; the 37x18 avatar mark is the same Simple Modern "SM!" mark). Bubble text Tiempos Text Regular 400 **18px/23.4px ls −0.18px `#2A3639`**.
    - Composer `[Footer]` (bottom): bg #fff radius 28 padding 12px 6px 8px, column gap 8, align center → RAINBOW255 border radius 24 → white inner radius 22 padding 4, row space-between → text area (padding 4px 12px) + 32x32 send button SVG `public/svg/shopping-agent-CTA-send-90871.svg`; under it "Powered by" (Inter 500 10px/14px `#122023`) + Siena logo 40x14 `public/svg/shopping-agent-Logo-c6c43.svg` (gap 4).
    - **Typing effect in the composer:** the prompt text is split into per-letter spans (Feature Deck Web Regular 400 **24px/33.6px** `#122023`); each letter animates `opacity 0.001 → 1, translateY 10px → 0, filter blur(10px) → blur(0)`; letters start **50ms apart** (measured: 44 letters revealed over ~2.2s), each letter's own transition ≈ 0.4s ease-out. It starts when the step becomes active (also on first view) and replays on every step change.
    - Step 1 content (top→bottom): Siena bubble (row with avatar, 402-wide bubble) "Hi! I'm Maddie, here to help with tracking orders, troubleshooting, product details, or anything else you need."; then suggestion list (column gap 10, 464 wide): three white chips (radius 24, padding 16, gap 12, `backdrop-filter: blur(6px)`; first chip has the RAINBOW255 border) each with a 20x20 sparkle icon `public/svg/shopping-agent-sparkles-two-2-f6c5b.svg` + Tiempos 18px/23.4px `#2A3639`: "How durables are the materials?" (sic), "Is the bottle and lid dishwasher safe for easy cleaning?", "Will it fit in most car cup holders?"; composer typing "What's the best cup for a 13-year-old girl?". The suggestion list enters with `opacity 0 → 1, translateY 50px → 0` spring (≈0.8s, ~0.75px overshoot) ~0.33s after the step activates.
    - Step 2: customer bubble (full width 464) "What's the best cup for a 13-year-old girl?"; Siena bubble (285 wide) "Here are some fun, in-stock options that would make a great gift for your daughter:"; two product rows (441x123/119, radius 24, padding 8px 16px, gap 12, `backdrop-filter: blur(10px)`; first bg `#FAF7F1`, second `rgba(243,240,235,0.7)`): 88x88 thumb (bg `rgba(255,255,255,0.3)` radius 24; imgs `public/assets/QXF1WWOFYMg43MV5R6ha4B4Mqqs.webp` (Smurf Checkmate) and `public/assets/pWyCmypuaJFrdmSKIUqWdXwuTw.webp` (Sage Florals), 512x512) + column gap 8: name + price (Tiempos 18/23.4 `#2A3639`) + pill button 309 wide (bg `#EFE5D0` radius 24 padding 4 → glass pill `rgba(255,255,255,0.5)` blur(2px) radius 24 padding 6px 8px, gap 12) — "Trek Kids Tumbler: Smurf Checkmate" / "$32.99" / "Added to cart" + 24x24 blue check icon `public/svg/shopping-agent-blue-checkmark.svg` (circle fill `#3158D1`, white check); "Trek Kids Tumbler: Sage Florals" / "$36.99" / "Add to cart". Button label font `"Feature Deck"` (not loaded → generic sans) 16px/20px `#0A0A0A`. Composer types "Do you offer a discount for teachers?".
    - Step 3: product row "Smurf Checkmate / $32.99 / Added to cart ✓" (the check has its own appear: fades in); customer bubble (371 wide) "Great! Do you offer a discount for teachers?"; Siena bubble "Yes, teachers can get 15% off with us. Just verify your status through ID.me at checkout and the discount will be applied."; composer types "Sounds great, thanks!".
    - Step changes animate with Framer layout animation (rows slide/scale into new positions; measured row translateY 183 → 0 with scaleY 3.43 → 1 in ≈300ms, no opacity change). Approximation: animate each row from its previous position with `transform .3s cubic-bezier(.2,.8,.2,1)` (FLIP), new rows fade/slide in.
  - **Step triggers (measured, step 25px):** step 1 → 2 when scrollY passes 2650–2675 (section-relative 566–591); step 2 → 3 at 3200–3225 (section-relative 1116–1141). Three invisible trigger boxes (370x141) sit at section offsets **216, 1019, 1579**; the step switches when a box's top crosses ≈ viewport y 450 (50%). Implement with IntersectionObserver `rootMargin: '-50% 0px -50% 0px'` on those offsets (same approach as homepage ScrollArea). Reverts when scrolling up.
- **Mobile 390:** section 390x2600, flex **column**, align center, gap 40, padding 56px 24px, overflow clip. Co-brand lockup moves to the top (294x56, opacity 0.4, "x" 56px). Left block becomes `position: sticky; top: 80px` (342x128: labels + description; description H6 Feature Deck Web Regular **18px/25.2px**; a background image `public/assets/Uuv5OWNLroO51e3GWwN9hGnIU.png` 336x189 `object-fit: fill` sits behind the labels). Chat card becomes `position: sticky; top: 320px; z 2` (342x359 "Chat 1 Sm"; bubble text Tiempos **14px/21px ls −0.14px**; composer text 18px/25.2px). Trigger boxes at x 10, page y 3128 / 3523 / 4083.

### 1.5 "Your team of expert agents" — NEW
- Section 1440x1265, bg `#FAF7F1`, flex column center, **gap 72px**, padding **80px 96px**, position relative.
  - Decorative BG: absolute, centred (`left:50%; top:607px; transform: translate(-50%,-50%)`), 930x891, img `public/assets/MSTluKQSUNZrlxr6ESQPZTnooU.webp` (1242x1190) cover, z 0 (soft colour blob behind the card).
  - Top fade: absolute top 0, full width, height 75, `linear-gradient(180deg, #FFFFFF 0%, #FAF7F1 100%)`. Bottom fade: absolute bottom 0, height 75, `linear-gradient(180deg, #FAF7F1 40%, #FFFFFF 100%)`.
  - Title (max 1062, gap 24, center): eyebrow "THE COMPLETE AGENTIC COMMERCE PLATFORM"; H2 "Your team of *expert* agents" — "expert" is `<em>` Feature Deck Web Light Italic (same 64/64 ls −1.28); subtitle (opacity 0.82, max 564, 564x112): "With Siena, you can create specialized AI agents for any industry. Train them with your product knowledge, brand voice, and expertise–then deploy skilled product experts that work 24/7 across the top Shopify categories".
  - Container (max 1200, column center, **gap 32px**, overflow clip):
    - Panel `[Neutral]` 1200x513, bg `rgba(255,255,255,0.6)`, `backdrop-filter: blur(6px)`, radius 24, padding 32, column gap 24, overflow hidden.
      - Header row (1136x50, space-between, align center): eyebrow "AGENT EXPERTISE ACROSS ALL PRODUCT CATEGORIES" (left) + nav (gap 12): two 50x50 buttons bg `#F3F0EB` radius 12, 24x24 caret icons `public/svg/shopping-agent-caret-left-1-80c65.svg` / `-caret-right-1-6516a.svg`. Disabled button opacity **0.3**.
      - Card row `[Card grid]`: flex row gap **24px**, overflow hidden (track 1264 wide > 1136 visible). 4 cards **280x375**, bg #fff, radius 24, overflow hidden, column:
        - Image 280x124 `object-fit: cover; object-position: 50% 0%` + white fade bar over its bottom (280x45, `linear-gradient(270deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)` rotated 90° → fades image into white).
        - Body padding 32, column center gap 24: H6 Feature Deck Web Regular 400 **24px/33.6px** `#122023`; text Instrument Sans 500 **16px/19.2px ls −0.16px `rgba(18,32,35,0.8)`**.
        - Cards: (1) "Fashion and Style Expert" — "Understands style preferences, body types, and trends to drive outfit recommendations that convert browsers into buyers" — `public/assets/njFwLgcYodcgCZLOirenZte8PI.webp`; (2) "Beauty & Skincare Specialist" — "Analyzes skin concerns and ingredient compatibility to match customers with perfect products and increase basket size" — `DSlYA7Ti2px99V57TiG8YWLa0.webp`; (3) "Health & Fitness Coach" — "Crafts personalized workout and nutrition plans that drive repeat orders of gear, supplements, and memberships" — `mjhrS3zQVff4RHuTylI3YOBrans.webp`; (4) "Home & Lifestyle Consultant" — "Interior design and home expert that helps customers create cohesive spaces with furniture, decor, and appliances." — `r0UwHHAaB0cxyEOmbrrJXqLReOI.webp`.
        - **Carousel = 2 states only**: start (card 1 at x 152, left arrow 0.3 / right 1) ↔ end (track shifted **−56px**, card 1 at x 96, left 1 / right 0.3). Click → spring, settles in ≈400ms (x 152→96; arrow opacities cross-fade over the same time). Clicking the dimmed arrow does nothing. No hover state on cards.
    - Benefits row (max 1062, flex row, justify center, align flex-start, **gap 32px**): 4 columns 242 wide (max 416), column gap 16: FA6 Sharp Light 24px icon `#122023` (U+F890 sparkles, U+F06E eye, U+F6A3, U+F6A3) → H5 Feature Deck Web Regular 400 **32px/38.4px** `#122023` → text (opacity 0.8) Tiempos Text Regular 400 18px/23.4px ls −0.18 `#122023`:
      "On-demand expertise" — "Access specialist-level guidance instantly—no recruiting, no ramp-up."; "Compund learning" (sic) — "Every conversation sharpens the model, and your agent becomes smarter."; "24/7 expert availability" — "Always on, always helpful—no shifts, breaks, or out-of-office."; "Consistent quality and brand tone" — "Same high-caliber advice every time, no matter the volume."
  - No scroll reveals in this section.
- **Mobile:** 390x1644, padding 56px 24px, gap 40, overflow hidden; BG blob 787x790 **rotated ≈ −49°** (`matrix(0.656,-0.755,0.755,0.656)`); panel 342 wide, eyebrow 14/19.6 centered (2 lines), arrows hidden; cards **248x?** (image 248x124), gap 24, horizontally scrollable track (cards at x 40, 312, 584, 856); H6 18px/25.2px; text Instrument Sans 500 **12px/14.4px ls −0.12**. Benefits stack vertically (gap 32), H5 **28px/33.6px**, text Tiempos **14px/21px** ls −0.14.

### 1.6 "Content display (Timer)" — NEW (two image cards + scroll-linked progress line)
- Section 1440x2076, flex column, align center, **gap 72px**, padding **80px 96px**, bg white.
  - Title (gap 24): eyebrow "THIS IS THE FUTURE OF SHOPPING"; H2 "A unified intelligence layer for every customer journey" (2 lines, 1062x128); subtitle (opacity 0.82, max 564) "Whether a customer is browsing your site, stuck at checkout, or reaching out post-purchase, Siena handles it all with complete context."
  - Cards row: 1248x454, flex row center, **gap 56px**, **`position: sticky; top: 240px`**, z 1 (stays pinned for the rest of the 2076 section — ~1100px of scroll).
    - Two cards 416x454, each flex column center, **gap 72px**, overflow clip:
      - Image (radius 32): `public/assets/ON0dnmCt7UQBt5qAvV5CyAqaN0o.webp` (shopping bags) and `public/assets/5JtROZuq0lzTDVwGqPMsEIVlmg.webp` (support agent), 1440x810 natural, 416x270 cover.
      - Text (opacity 0.82, max 564) Instrument Sans 500 20px/28px ls −0.2 center, 416x112: "Intelligent assistance from browse to buy. Siena answers questions, resolves hesitations, and guides customers to purchase—with complete context of their journey." / "Post-purchase help that knows the full story. Siena maintains context across orders, preferences, and conversations—delivering support that feels genuinely personal."
    - **Reveal (variant Initial → Final):** Initial: image absolute `top:-120px`, height **1px**, opacity 0; text absolute `top:446px`, opacity 0. Final: image in flow 270 tall opacity 1 at top 0; text at 342 (after 72 gap) opacity 0.82. Transition ≈ **200ms** ease-out (rAF: height 47→270 and opacity 0.17→1 within ~180ms; text rises ~86px). Card 1 triggers at scrollY 4604 (marker `[shopping]`), card 2 at scrollY 5050 (marker `[support]`, = when the section top reaches the viewport bottom). Reverts to Initial when scrolled back above the markers. Implement: reveal card 1 when section top ≤ viewport bottom + 446px, card 2 when section top ≤ viewport bottom.
    - **Progress line `[Progress Bar]`**: absolute inside the sticky row at `top:301px; left:-111px; right:-111px` → 1470x2, overflow clip, z 4 (spans the full viewport width between images and text). Child `[Line]` (height 2, left-anchored) has `background: linear-gradient(270deg, rgba(247,221,147,0) 0.644%, #F7DD93 10.2442%, #F8B57F 25.3941%, #FF5D4E 43.7852%, #F95040 67.1717%, #FDA3AC 83.0307%, rgba(253,163,172,0) 98.2492%)` and **`transition: width 0.5s ease-in-out`**; its width is scroll-linked: **width ≈ 0.759 × (scrollY − 4419) px** at 1440 (measured 830 @5500, 1170 @5949, 1511 @6400, 1813 @6800, 2150 @7250, 2566 @7800) — i.e. 0 at the `[start]` marker (page y 4402) and 100% of the bar (1470) at the `[end]` marker (page y 6346), continuing to grow (clipped) after. A glow `[Head]` sits on the line: absolute `top:-17px; left:-14px; right:-26px; bottom:-17px` (36px tall), `radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 100%)`, radius 50%, `filter: blur(15px)`.
- **Mobile:** 390x1506, padding 56px 24px, gap 40, overflow hidden; title gap 16 (H2 48/48, 4 lines); cards column becomes `position: sticky; top: 40px`, flex **column gap 72**, cards 342x454 "Inverted"/"Final" variant (text first then image 342x332 radius 32 for card 1; card 2 image first) ; a 196x1 divider `#EFE5D0` under the title; progress bar rotated 90° (vertical 2x478 line at x 198 between the cards).

### 1.7 Main CTA — VARIANT of homepage MainCta
- Heading "Turn conversations into conversions" (1 line, 934x64) → section 1440x**691** (padding 200px 96px; card 1062x291). No top "Blur out" overlay element on this page (the preceding section is white).
- Mobile: 390x538, padding 96px 24px (not 168/16), card 342 wide padding 32 radius 32, H2 48/48 (4 lines, 278 wide).

### 1.8 Footer — IDENTICAL.

---

## 2. /social-agent

Page title: "Siena Social Agent - The AI-native platform for Social". Height 14079 @1440 (Main 13645 + footer 434), 16545 @390.
Screens: `recon/pages-a/social-agent-1440.png`, `-390.png`. Exact mockup internals (every element's box/typography) are in `recon/pages-a/social-agent-1440.tree.txt` / `-390.tree.txt` — the `#index` numbers quoted below point into those files.

**Nav: always in the solid "On Scroll" state (bg `#FAF7F1` + shadow) from scrollY 0** — the only route where the pill is never transparent.

Section order @1440 (y/h): Hero 0/752 · Logos 752/96 · Features 848/8291 (title + sticky pill nav + 6 feature blocks + 1 testimonial) · "More in the box" bento 9139/1318 · FAQ 10457/915 · Integrations 11372/758 · Enterprise 12130/760 · Main CTA 12890/755 · Footer 13645/434.

### 2.1 Hero — NEW ("ProductHeroSplit" — same skeleton reused by ai-review-management, qa-agent, topics-explorer)
- Section 1440x752, bg **#FFFFFF**, padding **120px 0 0**, flex column, align center, gap 10.
- `[Header Content]` max-width 1110 (x 165), flex row center, **gap 40px**, padding **0 64px 32px**, z 3, height 632.
  - `[Header Copy]` 496 wide, flex column, align flex-start, justify center, **gap 40px**:
    - H1 "Meet the AI Agent for *Social*" — Feature Deck Web Light 300 80px/80px ls −0.8px `#122023`, left, 520x160 (2 lines: "Meet the AI" / "Agent for Social"); "Social" is `<em>` Feature Deck Web Light Italic 300. Swash `public/assets/MJbk4aQblPanJHyFV9X8Yg7JDqI.png` 241x18 absolute at `top:225px; left:282px` (under "Social").
    - Subtitle (no opacity wrapper) "Siena engages your community, automates your support, and turns every comment, DM, and ad reply into a revenue opportunity." Instrument Sans 500 20px/28px ls −0.2 `#122023`, 496x84.
    - xlg "Book a demo" (BookDemoButton, IDENTICAL).
    - "LIVE ON:" row (flex row, gap 8, height 48): label `<strong>` Instrument Sans **700** 16px/22.4px ls 1.7px uppercase `#122023`; then two 48x48 round chips (bg `#F4EDDE`, radius 99) with Instagram glyph 22x22 (`public/svg/social-agent-Avatar-0a99a.svg`) and Facebook glyph 28x28 (`public/svg/social-agent-Avatar-fe29a.svg`).
  - `[Visual]` 446x571 (x 765, y 135), position relative:
    - Post card `[Social Media Mockup]` absolute `top:51px; left:16px; right:94px` → 336x448, bg `rgba(243,240,235,0.5)`, radius 24, `box-shadow: 0 3px 8px rgba(167,160,146,0.3)`, `backdrop-filter: blur(6px)`, flex column:
      - Header 336x58 bg `#FAF7F1` radius 24 24 0 0 padding 16: 24x24 brand mark (data-URI SVG → `public/svg/social-agent-Vector-bg-0bf0d.svg`) + "True Sea Moss" Tiempos Text Regular 20px/26px, gap 12.
      - Photo 336x216 `public/assets/eiC7nOCos1WvCqwxBMc1EKmcyC0.webp` cover, object-position 0% 100%.
      - Footer bg `#FAF7F1` radius 0 0 24 24 padding 20px 16px 19px, column gap 12: stats row (heart 23x20 `social-agent-Social-Media-Mockup-94262.svg` "26k", comment 20x20 `-8e27d.svg` "984", send 20x20 `-6c633.svg` "470"; bookmark 15x20 `-fdf95.svg` at right) — numbers Instrument Sans 600 14px/15.4px `rgba(18,32,35,0.8)`; caption "New flavors just dropped!" Instrument Sans 400 14px/15.4px; comment rows (gap 4, avatar 32 round): "maria863" (600) "I want it!" (400) with avatar img `public/assets/D3TQ38q4HpOxmxHoD1u1AW40NI.png`; indented (padding-left 16) "thetrueseamoss" "DMing you!" with brand avatar (`public/svg/social-agent-Vector-1b0ea.svg`).
    - DM overlay card absolute `top:104px; left:202px; right:-52px` (296x171), bg `rgba(243,240,235,0.5)`, radius 24, blur(6px): Siena DM bubble (RAINBOW255 border, radius **16px 2px 16px 16px**, inner #fff padding 12, blur(10px)) "Hey Maria! You're about due for a refill. Want me to reorder the pineapple two-pack?" Tiempos 12px/15.6px; reply bubble (#fff, radius **2px 16px 16px**, padding 12) "Yes, please add!! Can't wait 🙌" + Maria avatar 32.
  - Load motion (exact, Framer appear): swash `{opacity:.001,y:200}→{1,0}` tween 0.7s delay **0.6s** ease `[0,0.91,0.14,0.85]`; DM overlay card `{opacity:.001, y:80}→` **spring bounce 0.2, duration 1s, delay 0.7s**; Siena bubble y:52 spring (0.2,1s) delay **0.4s**; reply row y:80 spring delay **1.2s**. H1/subtitle/button have **no** entrance animation on this page.
- **Mobile:** hero 390x1153, padding 80px 24px; column, gap 40; header copy padding-top 56, centered; H1 56/56 ls −0.56 centered (342x168); swash 199x15; subtitle 16/22.4 centered; LIVE ON label 14px/19.6px; visual 342x396 (post card 336x448 at left, DM card 280x171 overlapping at x 99).

### 2.2 Logos (tickers) — IDENTICAL ticker content; VARIANT container
- Standalone `[Logos]` block 1440x96 (y 752), flex column space-between, overflow hidden, z 1 — full-bleed (not inside a hero padding). Rows 1440x33. Speeds ±30 px/s, gap 112 (72 mobile, block 390x94).
- (On ai-review, qa, topics, ask-siena the same block also has two white side fades — see §3.2.) On social-agent there are no fades.

### 2.3 Features — NEW (title + sticky section pill-nav + 6 stacked feature blocks)
- Section `[Features]` 1440x8291, flex column center, **gap 72px**, padding **80px 0**.
- Title (max 1062, gap 24): eyebrow "YOUR SOCIAL, COVERED" (rendered as `<strong>` → Instrument Sans **700** 16/22.4 ls 1.7 uppercase); H2 "Your Agent of Record for every conversation on Social" (64/64, max-width 800, 2 lines, 800x128).
- **Sticky pill nav** wrapper: `position: sticky; top: 128px; z 5`, max-width 800, centered.
  - Resting (before it sticks, scrollY < ~1000): `[Resting -Resting]` 748x49, flex row center, **gap 32px**, padding **16px 32px**, bg `rgba(250,247,241,0.2)`, `backdrop-filter: blur(6px)`, radius 50. Six links (anchors `./social-agent#engage`, `#moderate`, `#automate`, `#partner`, `#understand`, `#convert`) labelled ENGAGE · MODERATE · AUTOMATE · PARTNER · UNDERSTAND · CONVERT — Geist Mono 400 **12px/16.8px ls 0.6px uppercase `#605C53`**; between links 1x17 dividers `#CDBCA0`. Highlight shape (103x41 pill, `public/svg/social-agent-Resting-Resting-9f1f7.svg`, fill `#F7DD93`) sits behind link 1 at **opacity 0**.
  - Stuck (variants "Scroll - Engage/Moderate/Automate/Partner/Understand/Convert"): pill shrinks to **512x38**, gap **16px**, padding **12px 24px**, same bg/blur/radius; labels Geist Mono **10px/14px ls 0.5px**, colour `#414D4F`; dividers 1x14. Active link gets a highlight rect (78x32-ish, radius 2, fill `#F7DD93`, `public/svg/social-agent-pill-highlight-active.svg`, stretched to the link width + 12px each side: measured widths 73/78/78/72/92/80 at x 467/547/632/717/795/893) absolutely at top 3. Highlight slides between links in **≈230ms ease-out** (tiny overshoot). Resting→stuck width change is animated (Framer layout).
  - Active link by scrollY (1440): Engage ≥1100 · Moderate ≥3200 · Automate ≥4400 · Partner ≥5450 · Understand ≥6650 · Convert ≥7700 (i.e. when each block's top passes ≈ 300px below the viewport top). Clicking a link scrolls to the block anchor.
  - **Mobile:** sticky top 128, `[Mobile - Resting]` 280x144 **2-column grid** (140px cols, 48px rows), radius 24, labels 10px/14px `#414D4F`.
- `[Scroll Area]` 1440x7764, bg white, padding **120px 64px 0**; `[Content]` 1312 wide, flex column center, **gap 228px**. Each feature block `[1]` = 1312x~900, flex column center, **gap 32px**:
  - Heading group (max 680, gap 24): H3 Feature Deck Web Regular 400 **52px/62.4px** `#122023` center (680x125, 2 lines) + text (max 564) Instrument Sans 500 20/28 ls −0.2 center (no opacity).
  - Visual card `[Sticky Image]` (not actually sticky): **576x488** (block 1) / 512x351 (block 2) / 591x358 (block 3, no bg) / **600x488** (blocks 4–6); bg `linear-gradient(180deg, #FFFFFF 0%, #F3F0EB 100%)`, radius 24, overflow clip; content = absolutely positioned mock cards (see below).
  - Bullet list (max 512, column gap 12): rows (gap 10, centered) = 24x24 four-point star icon (`public/svg/social-agent-star-four-light-1-e3ce8.svg`, same as homepage scroll-area star) + Tiempos Text Regular 18px/23.4px ls −0.18 `#2A3639` with a leading `<strong>` (Tiempos 700).
  - Shared mock-card styles: "Donut" card = padding 2 radius 28 shadow `0 3px 8px rgba(167,160,146,0.3)` wrapping `[Metric]` (bg `rgba(255,255,255,0.7)`, radius 28, padding 12, `box-shadow: 0 8px 12px rgba(0,0,0,0.06)`, blur(9px), column gap 16); "User Message" tag = bg `rgba(247,221,147,0.3)` radius 16 padding 12 blur(5px) with 8x8 dot + Tiempos 14px/18.2px; avatars 32x32 round.
  1. **Engage** (#843) — H3 "Reply to everything that needs a response"; text "Siena reads every comment and DM across organic and paid, classifies each one, and replies in your brand voice." Visual 576x488: background img `public/assets/wVlAjVzRd4gIeCBmbHQla0wyI.webp` (981x443 at `top:345px; left:-153px`); two Donut cards: "Instagram" (418x351 at `top:29px; left:-130px`, header avatar 48 bg `#F4EDDE` + H6 Feature Deck Web Regular 24/33.6 "Instagram"; inner post panel 390x259 with header bg `#F4EDDE` "Bea" (avatar `public/assets/Tfrso7q4pqJoHA4O5xhbikPQw0.png`, Tiempos 18/23.4 `#2A3639`); customer bubble (#fff radius 2px 16px 16px padding 12) "omg do you ship to canada??? 🥺"; Siena reply (RAINBOW255 border, radius 16) "Yes! We ship everywhere across Canada, the US, and the EU 🌎"); "Facebook ads" (398x363 at `top:259px; left:518px`; header "Sam" avatar `public/assets/3ehhDGuTFIBawZROIuwj6v0WkU.webp`; bubble "I need it in every flavour"; reply card with brand avatar + **True Sea Moss** (Tiempos 700) "Yessss, you’re going to love mango 🫶"). Bullets: **Classifies and acts** on every message · **Fresh brand-voice replies**, with customizable personas · **Carries sensitive comments** into DMs.
     - Reveal on enter-viewport (once): customer bubbles `opacity 0, y +80 → 1, 0` delay **0.5s**; Siena replies delay **0.8s**; spring (bounce 0.2, duration 1s; t50 ≈ 185ms, settles ≈ 980ms, ~1px overshoot).
  2. **Testimonial** (between blocks 1 and 2, `[Testimonials]` 1312x876, padding 120px 64px) — VARIANT of §0 testimonial card: single static slide (no controls); panel **bg `#FAF7F1` (flat, not gradient), radius 48**, padding 24px 16px, max-width 1200 (1184 wide); text column 524, image 524x524 radius 32. Quote "Whenever I see a response, it feels like I’m the one who answered it. It sounds like me. It captured the voice, the brand message, even the way we want to make our customers feel." — logo `public/assets/fBcRNp3kFGpZ4Nwi8ikeOykouiI.png` (eskiin) — **Cher General** — SOCIAL MEDIA & AFFILIATE MODERATOR — image `public/assets/5wyOmLf6STI1tDB4PFNMiGxcgQ.jpeg`. Mobile: quote Instrument Sans 400 **16px/19.2px** ls −0.16.
  3. **Moderate** (#995) — H3 "Protect your brand, and your ad spend"; text "Siena moderates comments on arrival, hiding spam and negativity so every impression works as hard as your budget." Visual 512x351: three comment cards 228x78 stacked at left (x 529–531, tops 39/176/237 px; inner #fff radius 0 0 24 24 padding 20px 12px 19px; avatar `public/assets/iCVj9o5X7OyMnsoPTP5rHyEiWr0.png`; `@itssam.orders` 600 14/15.4 + comment 400 14/15.4: "overpriced for what it is 😬", "Ugly  🤮", "$$$ bUY fOlloWers") each with a 1px `#2A3639` **strike-through line** across the comment text; at right three label stacks (149x70): typed caption Tiempos-like spans "↳Keyword "overpriced"", "↳Harmful", "↳Spam" (letter-by-letter blur-in like §1.4, 12px) above tags "Hidden by Siena" (dot `#F8B57F`), "Deleted by Siena" (dot `#FF5D4E`), "Deleted by Siena" (dot `#FF5D4E`). Bullets: **24/7 moderation** across organic and paid · **Clean comment sections** under every post · **Auto-hide**, delete, or flag.
     - Reveal: cards slide up `opacity 0,y +150 / +111 / +90 → 1,0` with delays **0.2 / 0.5 / 0.8s**, duration ≈ **0.4s** ease-out (no overshoot); strike lines `translateX(-150px|-90px), opacity 0 → 0` after their card; tags `y +150 → 0` delays 0.3/0.6/0.9s, 0.4s; caption letters type in (50ms stagger).
  4. **Automate / One inbox** (#1145) — H3 "One inbox for every conversation"; text "Social and CX conversations land in one place, with saved views and auto-assigning surfacing the messages that matter." Visual = inbox mock 591x358 (`[Docs-card]` bg `rgba(243,240,235,0.5)` radius 24 blur(6px) inside a 2px/28px shadow wrapper), two columns of 294:
     - Left: header "Inbox" (Tiempos 20/26) with 25x25 Siena icon `public/svg/social-agent-Icon-Black-19603.svg` + count chip "21" (#fff radius 50 Instrument Sans 10/15); divider `#EFE5D0`; filter chips (bg `#F4EDDE` radius 50 padding 4px 8px, Geist Mono 10/14 ls 0.5 uppercase): "● ASSIGNED TO ME" (dot `#2E79D8`), "ALL CHANELS" (sic); 3 rows (padding 8px 0 8px 8px, gap 8, dividers `#EFE5D0`): **@sarah.m** "Is this vegetarian?" "⤶ Responded by Siena" · **Aisha Patel** "Hii! Are you accepting influencer applications? Would love to partner!" "⤴︎ Routed to the CX team" · **T. Anderson** "My order number is #1126508." "⤶ Responded by Siena" — names Instrument Sans **900** 14/15.4 `rgba(18,32,35,.8)`, body 400 12/18 `#122023`, status 400 12/18 **`#FB5646`**; 20x20 channel badges (#fff round) on avatars; avatar imgs `iCVj9o5X7OyMnsoPTP5rHyEiWr0.png`, `zFIsk8jathqNii9MqXST7kzQ.webp`, gradient `linear-gradient(#FF5D4E,#ABABAB)`.
     - Right: thread cards for @sarah.m ("commented on this post", 59x59 post thumb `eiC7nOC…webp`, "Is this vegetarian?", "↩︎ Siena replied", reply from **@thetrueseamoss / Siena Agent** "Hi Sarah! Yes, all of our products are 100% vegetarian (and vegan) friendly. 💜 Here's a link with the full ingredient list: www.trueseamoss.com/ingredients") and **smitchel@gmail.com** "Clarifying the status of my order…" "↩︎ Siena replied" (email glyph FA U+F0E0 12px).
     - Reveal: right-column cards `y +40 / +18 → 0`, opacity 0→1, delay 0.3s, ≈0.5s.
     - Bullets: **One unified inbox for comments, DMs, & support tickets** · **Context-aware assignment,** so tickets route correctly · **Customer profiles** across the lifecycle of a purchase.
  5. **Partner / Influencer** (#1331) — H3 "Influencer partnerships, with a human touch"; text "The moment a high-profile influencer engages, Siena hands it to your team, so relationships get the attention they deserve." Visual 600x488, centered column of: Gaby card (269x158; avatar `public/assets/QXVdJrspyMIrzetlaF8nBLHgJqc.webp`; **Gaby** 700 14/15.4; "Hi I’ve been loving your brand lately, are you currently accepting new influencers?"; meta "Instagram" "@gaby" 12/18 `#A7A092`; "**124K** followers **847** posts" (numbers 700 `#48453E`)); vertical connector line SVG 11x160 (`public/svg/social-agent-Sticky-Image-d5f20.svg`, `#F4EDDE` 3px with animated dash) + 12x12 dot; "Influencer detected" pill (RAINBOW255 border radius 16, 700 14/15.4); "Flagged for human review" tag; Thomas reply card (270x71, avatar `3ehhDGuTF…webp`, "Hi Gaby, Thomas here. Let's talk!").
     - Reveal: Gaby card & "Influencer detected" `y +150 → 0` (pill +128→−22) delay ~0.05s, ≈0.4s; "Flagged…" delay 0.45s; Thomas card `y +70` delay 0.65s.
     - Bullets: **Follower thresholds** set by your team · **Custom workflows** to handle micro-influencer requests · **Build relationships** that matter, with the time saved.
  6. **Understand / Ask Siena** (#1449) — H3 "Questions answered. Ask Siena knows your customers."; text "Ask about your data in plain language to get answers across every social and CX conversation at once, and take action." Visual 600x488: prompt pill (455x52, RAINBOW255 radius 28, inner Siena icon + "What's trending well this week?" Feature Deck Web Regular 14px/16.8px ls −0.14); answer card (455x101, bg `#FAF7F1` radius 28 shadow) "Based on the data these are the most talked about products:" (Tiempos 14/18.2) with chips "Mango Jelly • 456 mentions", "Gummies • 421 mentions", "Berries Jelly • 332 mentions" (Instrument Sans 10/15) and footnote "*Across Instagram, Facebook, Email, CX data" (Tiempos 12/15.6); three rotated product photos (radius 16; 132x132 rotate(10°) `public/assets/14qqqYRz84JYwi1FSGVb5aEW6k.webp`; 146x146 rotate(−20°) `iAPB6Yf4dNM4vi0V9jq2RIoo6AQ.webp`; 146x146 rotate(20°) `eiC7nOCos1WvCqwxBMc1EKmcyC0.webp`).
     - Reveal: prompt `y +80` spring delay 0.33s; answer card `y +80` (to −50 translate) spring delay 0.73s.
     - Bullets: **Unified intelligence** across every agent · **Ask anything** to build an instant report · **One unified agent** of record.
  7. **Convert** (#1543) — H3 "Turns conversations into checkouts"; text "Siena carries a comment into a DM, answers the question, and drops the link, reaching customers ready to spend." Visual 600x488: post card (336x448, photo `iAPB6Yf4dNM4vi0V9jq2RIoo6AQ.webp` object-position 50% 0%, caption "New flavors out now!", "maria863 Where do I buy?", brand reply "thetrueseamoss — Most local supermarkets and our website, sending a link! 🙌🏼"); DM card (296x253 at right, header "Maria"): message "Hiii here's the link to buy our <u>Multifruit Gummies</u> directly from our website!" + product card (RAINBOW255 border; 44x44 thumb; "Voyager Tumbler - Signature" "~~$39.99~~ $27.99" Tiempos 12/15.6).
     - Reveal: DM card `y +80` spring delay ≈1.6s; message bubble delay ≈1.9s; product card `y +50` delay ≈2.2s (measured from viewport entry).
     - Bullets: **Comment-to-DM** that closes the sale · **Answers product questions**, in-thread · **Increase ROAS** through proactive engagement.
- **Mobile:** Features 390x7733, padding 56px 0, gap 40; Scroll Area padding 0 16px, content gap **120px**; blocks gap 40; H3 Feature Deck Web Regular **36px/43.2px**; mock bubbles Tiempos 14px/21px; visuals scale to 358 wide.

### 2.4 "More in the box" bento — NEW
- Section 1440x1318, bg `#FAF7F1`, flex column center, gap 72, padding 80px 96px.
- Title (max 1062, left aligned, gap 24): eyebrow "MORE IN THE BOX"; H2 "Everything else that rounds it out" (64/64, left).
- Bento (max 1062, column gap 16):
  - Row 1 (465 tall, gap 16): card A 544x465 (bg #fff, radius 24, padding 32px 24px, blur(2px), column space-between): H3 "Unlimited pages & brands" (Feature Deck Web Regular 52/62.4) · mini diagram: "Response Settings" card (180x141, #fff radius 28 shadow; rows "Auto-reply / Active" (toggle dot), "Response rate / 80%", "Tone / Brand voice" — Tiempos 12/15.6 + Instrument Sans 10/15) connected by three curved connector SVGs (`public/svg/social-agent-1-53c56.svg`, `-1-1a3c1.svg`, `-1-e1ce2.svg`) with 20x20 dots to three chips ("True Sea Moss - US", "True Sea Moss - EU", "Other Supplements"; #fff radius 10 padding 8, shadow `0 5px 10px rgba(156,156,156,.1), 0 19px 19px rgba(156,156,156,.09)`, Tiempos 12/15.6) · text "Every account, brand, and region. Configure per page, or copy across all at once." (Instrument Sans 500 20/28). Card B 502x465 radius 16 overflow hidden: photo `public/assets/BEKytDQGmk9M2on9YkKhq2plrU.webp` (1028x566 positioned `top:-2px; left:-303px`) + persona card (RAINBOW255 1px border radius 16 → #fff padding 12) "Per-channel personas" (H6 24/33.6) "A distinct voice per channel, organic or paid." (Instrument Sans 400 16/19.2) + glass reply chip (bg `rgba(255,255,255,.7)` blur(8px) radius 16): **TSM** "Daily ritual unlocked, we gotchu bestie ☀️".
  - Grid: 3 cols x 2 rows (343.33px cols, 239px rows, gap 16). Tile: bg #fff, radius 24, padding 32px 24px, column gap 24: FA6 Sharp Light 300 24px icon → H5 Feature Deck Web Regular 32/38.4 + text Instrument Sans 400 16/19.2 ls −0.16 (gap 12). Tiles: (U+E533) "Unlimited seats" — "Your whole team in one inbox, no per-seat cost."; (U+F4D7) "Custom automations" — "Multi-step automations that run natively on social, from first reply to resolution."; (U+F1E6) "Run alongside your tools" — "Connects directly to Meta."; (U+F1C2) "Custom keyword moderation" — "Auto-hide, delete, or flag comments containing terms you define."; (U+F070) "Hide comments after responding" — "Automatically hide negative comments once they've been handled."; (U+F002) "Ask Siena in Slack" — "Query your data in plain language without leaving Slack."
  - Reveal: "Response Settings" card `y +50` spring (bounce .2, 1s) delay 0.6s.
- **Mobile:** 390x2491, padding 56px 24px, gap 40; bento column gap 12; card A 342x401 padding 24; card B 342x481; grid 1 column, rows 205.6, tiles padding 24px 20px, centered, H5 28/33.6.

### 2.5 FAQ — NEW (reusable "Faq" accordion)
- Section 1440x915, flex column center, gap 40, padding 80px 0. H2 "FAQ" (64/64 center).
- Panel max-width 894, bg `#F3F0EB`, radius **48**, padding **20px 40px**; list 814 wide. Item: border-bottom **3px solid `#D0D2D3`** (none on the last), overflow hidden. Question row: flex space-between, padding 24px 0, cursor pointer, text Instrument Sans 500 20px/normal `#122023`; 20x20 icon img — open: `public/assets/OKFNY3AXFnnV2q6cBUgzTRwNI0.png` (chevron up), closed: `public/assets/klSbquSQSmI4vJp5uAthfEBu4A.png` (chevron down). Answer: padding 0 0 24px, Instrument Sans 400 16px/normal `rgba(18,32,35,0.8)`.
- Behaviour: single-open accordion, first item open by default. Click: icon swaps instantly; closing item's answer fades/collapses and opening item's expands simultaneously, **≈100ms** (height + opacity, ease-in-out).
- Items: 1 "Do we have to switch off our current tool?" — "No. Connect your Meta accounts and run Siena alongside your current setup. Watch the difference side by side." · 2 "Which channels does it support?" — "Instagram and Facebook today, organic and paid. TikTok soon." · 3 "How do we stay in control as it ramps up?" — "Start in Draft Mode: Siena drafts, your team sends. Switch to auto-send once you trust it. You set the guardrails (follower thresholds, sensitive topics, keyword rules); Siena flags anything that crosses them." · 4 "How does it handle influencers and creators?" — "Set a follower threshold. Anyone above it gets drafted and flagged for a human, so your team handles creators and press personally." · 5 "What makes it different from a social-only tool?" — "Siena shares one brain across Support, Shopping, Reviews, and Social, so it knows who a customer is across every channel. Most social-only tools never have that context." · 6 "Will it actually sound like our brand?" — "You write the voice rules in plain language. Siena learns from your guidelines and every post you approve. Refine in Draft Mode until it sounds like you."
- **Mobile:** padding 56px 24px; panel 342 wide, radius 24, padding 24 (list 294).

### 2.6 Integrations — VARIANT of homepage Integrations
- Diffs: section bg **#FFFFFF** (homepage `#FAF7F1`), height 758; inner wrapper align **flex-start** with gap **32px**; title block gets eyebrow "INTEGRATIONS" + H2 "Connects with your entire stack" (left aligned, gap 24); button "Explore all integrations" **left-aligned below the grid**.
- Tiles (same 4x2 grid of 297x181, gap 4, bg `#F3F0EB`, radius 4, padding 72px 0): facebook 128x26 (`public/svg/social-agent-Vector-80b9e.svg`) · Instagram 138x39 (`public/svg/social-agent-Vector-3e1a2.svg`) · Shopify 129x37 (existing `public/svg/integration-0-Logos.svg`) · Yotpo `public/assets/S1CA7BjDsQfmui51TcPvAyGtRxA.svg` 113x32 brightness(0) · klaviyo img `public/assets/KTiCJGm9tWo8Kt409KAYdr3T5FE.png` 132x74 · recharge 187x37 (`public/svg/social-agent-Union-f4ce1.svg`) · AfterShip `public/assets/4ivCVwCJknXe4l2YnVNdadGF4.svg` 160x32 brightness(0) · text tile "Helpdesks" (`<strong>` Instrument Sans 700 20/28 ls −0.2).
- Mobile: 2 cols of 169, tile padding 14, button left.

### 2.7 Enterprise — NEW (reused on ask-siena; see §6)
- Section 1440x760, bg **`#122023`**, flex row center, gap 100, padding **96px**, overflow hidden.
- Inner max 1070, column, align flex-start, **gap 64**: Title (gap 24): H2 "Enterprise-grade safety" Feature Deck Web Light **300** 64/64 ls −1.28 **#FFFFFF** left; text (max 584) "Trusted by some of the fastest-growing ecommerce and retail companies, Siena meets the highest enterprise standards with guardrails and granular controls that keep every interaction on brand and on policy." Instrument Sans 500 20px/28px ls −0.2px `#FFFFFF` (no opacity), left.
- Cards row (gap 24): 4 cards 250x304, bg #fff, radius 24, padding 24, column; inner (gap 12, padding-bottom 24): FA6 Sharp Light 300 24px icon `#122023` → H6 Feature Deck Web Regular 24/33.6 → text (opacity 0.8) Tiempos 18/23.4 ls −0.18 `#2A3639`:
  (U+F132 shield) "AI & brand-safety guardrails" — "Follower thresholds, sensitive-topic rules, and approval gates keep every reply on-policy."; (U+F023 lock) "SSO, roles, audit logs" — "SAML SSO, granular permissions, and a full trail of every action your team and the agent take."; (U+F590) "SOC 2 Type II compliant" — "Your data and your customers' data handled to enterprise security and privacy standards."; (U+F590) "Dedicated support & SLA" — "A named success manager, hands-on onboarding, and priority response with an uptime SLA."
- **Mobile:** padding 56px 24px; H2 stays 64/64; cards 2x2 grid (163x288, gap 16, padding 14).

### 2.8 Main CTA — VARIANT of homepage MainCta
- Same heading as homepage ("See how fast-growing brands scale with Siena", 755 tall). Diffs: inner padding **200px 64px**; top "Blur out" overlay gradient is **dark**: `linear-gradient(180deg, #122023 24%, rgba(18,32,35,0) 100%)`, height 187, z 3 (blends out of the dark Enterprise section).
- Mobile: 390x706, padding **240px 32px 120px**, card 326 wide padding 32 radius 32; dark blur-out 187.

### 2.9 Footer — IDENTICAL.

---

## 3. /ai-review-management (Reviews Agent)

Page title: "Siena Reviews Agent - The Agentic Commerce Intelligence Layer". Height 8118 @1440 (Main 7683 + footer 434); 10121 @390.
Screens: `recon/pages-a/ai-review-management-1440.png`, `-390.png`; scroll states `states/ai-review-management-1440-{1300,1800,2300,2800,3200}.jpg`; timer states `states/ai-review-management-1440-y4900-t{2000,10000,18500,27000}.jpg`. Tree indices → `ai-review-management-1440.tree.txt`.

Nav: homepage behaviour (transparent over the white hero, solid after scrollY 150–160).

Section order @1440: Hero 0/752 · Logos 752/96 · Features (title + sticky Scroll Area) 848/3134 · Testimonials 3982/756 · "Content display (Timer)" 4738/1114 · Integrations + bento 5852/1076 · Main CTA 6929/755 · Footer 7683/434.

### 3.1 Hero — VARIANT of the split hero (§2.1 structure)
- Section 1440x752, bg #fff, padding 120px 0 0, overflow hidden. Header Content max 1110, row gap 40, padding 0 64px 32px, z 2.
- Copy column 369 wide (gap 40): H1 `Meet your <em>Reviews</em> Agent` — Feature Deck Web Light 300 80/80 ls −0.8 `#122023`, 369x240, 3 lines ("Meet your" / "*Reviews*" / "Agent"); em = Light Italic. Swash `MJbk4aQblPanJHyFV9X8Yg7JDqI.png` 241x18 at `top:156px; left:-6px` (under line 2).
  - Subtitle (no opacity) "Your teams are manually reviewing, approving, and responding to reviews—or sometimes not responding at all. With Siena Reviews Agent, you put review management on autopilot." Instrument Sans 500 20/28 ls −0.2, 369x140 (5 lines).
  - xlg Book a demo (IDENTICAL).
- Visual wrap 573x306; `[Visual]` absolute `top:-48px; left:-90px; right:-91px; bottom:-49px` with **scale(0.76)**:
  - `[Topics-card]` glass panel (397x268 screen; `top:49px; left:116px; right:116px; bottom:1px`), bg `rgba(243,240,235,0.6)`, radius 24, blur(6px).
  - Review card (screen 186x88) absolute `top:71px; left:-75px`: 1px RAINBOW255 border radius 16 → #fff padding 12; 5 green stars 12x12 (`public/svg/ai-review-management-Vector-d70f1.svg`, gap 2, inside a 73x18 label), divider `public/svg/ai-review-management-Line-38-7d528.svg` (166x3), text "Amazing oversized fit! Love how relaxed and comfortable it feels while still looking put-together." Instrument Sans 400 14px/18px `rgba(18,32,35,0.8)`.
  - Person photo `[HumanBG]` `public/assets/ibqKcHjw0oDUyAiwhqZx1vqxh8.png` (938x535 nat) 713x407 screen, centered (translateX −469px).
  - Reply bubble (185x103, RAINBOW255 2px radius 16 → inner `#EFE5D0` radius 15 padding 20) "Appreciate the love! The relaxed cut keeps it laid‑back yet neat. Our crewneck in the same silhouette might be your next favorite." Tiempos 14px/18.2px + 40x40 brand avatar img `public/assets/14aPLwywC9q4flBvXM0s1rLqA8.png` at its top-right (`top:-12px; left:221px`).
  - Decorative gradient blobs behind everything (z 0): `[BG2]` `public/assets/Xhz1QysnqTj6mnDf7ElHTJ5Kkxc.png` 1339x1108 at `top:85.5px; left:989px` rotated **20°** (`matrix(0.94,0.342,-0.342,0.94)`), object-fit cover, object-position 50% 0%; `[BG1]` same image 1200x1170 at `left:-519px` rotated **−30°** + translateY(−413px), object-fit contain.
- Load motion: H1 tween 0.7s delay **0.2s** `[0,0.91,0.14,0.85]` (y 200); subtitle delay **0.3s**; button delay **0.4s** (ease `[0,0.91,0.78,1]`); person photo `[HumanBG]` `{opacity:.001, y:50}` spring bounce 0.2 duration 1s delay **0.4s**.
- Mobile: Main has padding-top 72 (hero at y 112); hero 390x903, padding 96px 24px 0; copy centered (H1 56/56, subtitle 16/22.4 centered); visual 342x396 below; BG blobs 737x667 / 659x643 (same rotations).

### 3.2 Logos — IDENTICAL tickers; standalone block 1440x96 at y 752 (as §2.2)
- Plus two white edge fades positioned in `[Main]` (absolute, **top 1024px**, height 218): left `[Blur out]` 233 wide `linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)`; right 197 wide (left 1243) `linear-gradient(270deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)`, z 2. (They sit below the tickers at 1440 — replicate the exact top; on mobile they are at top 1064, 233/197 wide.)

### 3.3 Features + sticky Scroll Area — VARIANT of homepage ScrollArea (§4 of CLONE_SPEC)
- Section `[Features]` 1440x3134, flex column center, gap 0, padding **160px 0 0**.
- Title (max 756, gap 24): eyebrow "TURN YOUR REVIEWS INTO REVENUE"; H2 "From segmented reviews to business intelligence" (64/64, 756x128, 2 lines); subtitle (opacity 0.82, max 680) "Siena is the first AI Agent that moderates content, engages customers, and builds intelligence."
- `[Scroll Area]` 1440x**2720**, row, gap 64, padding 0 96px, bg #fff — **same pinning mechanics as homepage**: left Content column 512 (3 blocks 512x900, gap 10) + right `[Sticky]` 512 wide `position: sticky; top:0; height 900; padding 110px 0 40px` with a 512x647 card (radius 24, overflow hidden). Card variant switches at scrollY **1725** (section-relative 463) and **2650** (1388) — same "next block crosses 50% viewport" rule as homepage.
- Diffs vs homepage block content: H3 (not H2) Feature Deck Web **Regular 400 52px/62.4px** `#122023` left (512 wide); body paragraph **Tiempos Text Regular 400 20px/28px `#000`** (homepage has none); bullets identical style (24px star + Tiempos 18/23.4 `#2A3639`, gap 12); only block 3 has the xlg "Book a demo" button.
  - Block 1 "Agentic reviews moderation" — "Put content moderation on autopilot. Siena analyzes every review against your guidelines and automatically approves or flags content." — • Brand guideline enforcement • 24/7 consistent protection • Complete control and flexibility.
  - Block 2 "Human-like review replies" — "Engage every customer with contextual, personalized responses. Boost GEO rankings while maintaining authentic brand voice." — • Customer data integration • Enhanced search visibility • Selective engagement controls.
  - Block 3 "Reviews intelligence" — "Reviews become part of each customer's profile, enabling context-aware interactions. Siena remembers preferences, concerns, and satisfaction levels across all touchpoints." — • Comprehensive customer profiles • Cross-chanel personalization (sic) • Intelligent recommendations — + Book a demo.
- Sticky card variants (see `states/ai-review-management-1440-1300.jpg`, `-2300.jpg`, `-3200.jpg`): background = blurred photo 517x647 (`filter: blur(8px)`, img cover, inset `0 -3px 0 -2px`): v1 `public/assets/9QXYcN8HRV6pLrj7RqzmWgXhuE.webp`, v2 `glo9e1d72RyTANRqrtJjGBiB8.webp`, v3 `YpBq2eslOPryB0RS06zq5aJxVQ.webp`. Icon-tile gradient images: v1 `H52yBv0P43yzd8dUlb8CFyENp1s.png`, v2 `eTyaR6EX4QUmmcYkomodjUhpH6Q.png`, v3 `5k3UrT78mJSW5dExLUeigDKMjB0.png` (all `object-fit: fill` inside the 64x65 radius-16 tile, plus a 32x18 grain overlay `Uuv5OWNLroO51e3GWwN9hGnIU.png`). Avatars: Kathy `YJCHh6pHXfigS8Roir7x9YirEI.webp`, Sol `xZEsCHjDe8hRy1j3dZyyhlBT0.png` (39x39). Over the photo:
  - v1 "Reviews 1": three tilted (±15°) 98x98 glass review tiles (bg `rgba(255,255,255,0.6)` radius 16 blur(2px)) with tiny review text (Tiempos Text Regular **Italic** 10px/10px) and status badges 48/39px (`public/svg/ai-review-management-Icon-Button-01472.svg` check, `-Icon-Button-96c02.svg` cross); "Big chip" (314x81, bg `#F4EDDE` radius 24 padding 8 gap 16, blur(14px)): 64x65 icon tile (radius 16, gradient image `public/assets/H52yBv0P43yzd8dUlb8CFyENp1s.png` fill + FA U+F03E 24px white) + "Automatic reviews moderation" Tiempos 20px/26px; feature card (RAINBOW255 1px, #fff padding 12): 24x24 shield img `public/assets/6qhwFBE0v99iPQ7iYE1v9vxzCKg.png` + "NSFW content detection" (Tiempos 18/23.4 `#2A3639`) "Advanced  text filtering blocks inappropriate content" (Instrument Sans 400 16/19.2).
  - v2 "Reviews 2": review card **Kathy Simpson** / "Lynwood, WA" / 5 stars / "Great product!" + Siena reply bubble "Hey Kathy! So glad you liked it, here is a 10% discount for your next purchase" + big chip "Generate personalized review responses at scale" (blue icon tile).
  - v3 "Reviews 3": "Preference saved: / *Prefers premium materials*" pill with blue check; big chip "Transform reviews into customer intelligence" (orange chart icon); profile card **Sol Lewitz** / "Richmond, VA" / "Purchases: 3" / "Amount spent:÷ $5,465.54"; "Recent reviews:" card with stars + "Love the quality!".
  - Variant change = instant swap with element entrances (same pattern as homepage ScrollArea).
- Mobile: Features padding 112px 0 0; Scroll Area becomes a static column (no sticky), padding 64px 24px, gap 32; blocks gap 80; H3 **36px/43.2px**; bullets Tiempos 14/21; card visuals 342 wide inline.

### 3.4 Testimonials — homepage Testimonials **slider content IDENTICAL** (same 11 slides, same order/text/logos/images as homepage §3, counter "1 / 11"), VARIANT chrome
- Section `[Testimonials]` 1440x756, bg **`#FAF7F1`**, padding **56px 96px**, no title. Top fade: absolute top 0, height 75, `linear-gradient(180deg, #FFFFFF 0%, #FAF7F1 100%)`.
- Panel `[content]` max-width **1072**, bg `linear-gradient(180deg, #FFFFFF 0%, #FAF7F1 100%)`, radius 24, padding 24px 16px; slideshow padding 16px 32px 48px (976 content); slide: text column **468** + image **468x468** radius 32, gap 40; controls row on top (counter "1 / 11"). Role style = §0 (12/16.8 `#787368`). Same Prev/Next horizontal slide (300ms) as homepage.
- Mobile: 390x867, padding 0 0 32px, panel full width, padding 24px 0.

### 3.5 "Content display (Timer)" — NEW (auto-advancing 3-item feature list with progress bars)
- Section 1440x1114, bg `#FAF7F1`, flex column center, gap 72, padding 80px 96px.
- Title (max 756, gap 24): eyebrow "SIENA'S INTELLIGENT LAYER"; H2 "From reviews to customer *intelligence*" ("intelligence" in Light Italic); subtitle (opacity 0.82, max 564) "Every review enriches Siena's understanding of your customers. This intelligence powers personalized interactions across all channels".
- Row (1248 wide, max 1328): flex row center, **gap 40px**, height 600:
  - Left visual 560x600 (`[Topics-card]`), swaps per active item (see `states/ai-review-management-1440-y4900-t*.jpg`), backed by a glass card (bg `rgba(255,255,255,0.6)`, radius 24, padding 32, blur(6px), `top:130px; left:-20px; right:11px; bottom:146px`):
    - Item 1 "Context-aware personalization": profile **Sol Lewitz** "Richmond, VA" + customer bubble "I'm interested in this jacket" + Siena reply (`#EFE5D0` bubble) "Perfect! Based on your reviews, I'd recommend a size S for this jacket. Your preference for fitted styles suggests this will be ideal." + Siena "S" avatar; plus the "Recent reviews:" column.
    - Item 2 "Intelligent product recommendations": product card "Black coat" / "$900.00" / 5 stars / "April, 2025" / "Love the quality! It's perfect to complete a business attire." + 4 fanned product thumbnails + prompt pill "Complete this business casual look" + "Powered by siena".
    - Item 3 "Complete customer understanding": profile card **Rosslind Simpson** "Richmond, VA" (79x79 photo `public/assets/zsoY3aCkihx7ovTTTTgLbwVUcIo.webp` radius 8; name `"Tiempos Text"` 24px/32px ls −0.5); attribute chips (Geist Mono 12/20 ls 0.48 uppercase, opacity 0.7): QUALITY-FOCUSED · SEASONAL · CHATTY · ACTIVE REVIEWER · EXECUTIVE; stats card (bg `rgba(255,255,255,0.6)` radius 16 blur(14px) padding 8): "CLV: $5,465 (2.1x average)", "Purchase frequency: Every 3 months", "Average review rating: 4.2 stars" (Instrument Sans 400 16px/24px); "Recent reviews:" column (162 wide) of three RAINBOW255 1px review cards (stars + "Love the quality, and sizing is perfect!", "Love the quality!", "This product is perfect for me"; Instrument Sans 14/18 `rgba(18,32,35,.8)`) that fade in one after another (opacity 0→1 over ≈330ms, ≈500ms apart).
  - Right list 406 wide, flex column gap 32: three items, each = 1px track (`rgba(0,0,0,0.12)`) with a progress fill (`#FF5D4E`, `transition: width 0.09s linear`) on top → content (column gap 16, padding-top 32): FA6 Sharp Light 24px icon (U+F847, U+E3F1, U+F652) → H5 Feature Deck Web Regular 32/38.4 → description (opacity 0.8, only on the active item) Tiempos 18/23.4 ls −0.18:
    1. "Context-aware personalization" — "When a customer contacts support, Siena knows their review history. Left a negative review about sizing? It will  proactively address fit concerns and  suggest better options"
    2. "Intelligent product recommendations" — "Reviews reveal preferences and pain points. Siena uses this intelligence to recommend products customers will love and avoid suggesting items they've criticized."
    3. "Complete customer understanding" — "Reviews data integrates with order history, support tickets, and preferences to create the most comprehensive customer profile possible."
  - **Timer:** the active item's progress bar grows linearly 0 → 406px over **≈9s** (measured 45.5 px/s), then the next item becomes active (1→2→3→1, loops forever, runs regardless of scroll). Inactive items: opacity **0.3**, description collapsed; switching cross-fades opacity over **≈190ms** and the item heights animate (150 ↔ 236–259). The left visual swaps with the active item.
- Mobile: 390x1349, padding 56px 24px 0, gap 40; H2 48/48; layout column (visual above list), 342 wide.

### 3.6 Integrations + bento — VARIANT of homepage Integrations (header) + NEW bento (same component family as §2.4)
- Section 1440x1076, bg `#FAF7F1`, flex column center, gap 72, padding 80px 96px.
- Header row (max 1062, flex row, align flex-end, gap 24): left text (587 wide, gap 24): eyebrow "INTEGRATIONS" + H2 "Integrate Siena with your reviews platforms" (64/64 left, 2 lines). Right logo lockup (451x174, row gap 12): tile 220x174 (bg `#F3F0EB`, blur(8px)) with Siena wordmark 122x32 (`public/svg/ai-review-management-siena-a3950.svg`); centered "x" (Feature Deck Web Light 300 80/80 `#596365`) overlapping between tiles; right column of two 220x82 tiles: Yotpo-style wordmark 114x32 (`public/svg/ai-review-management-Vector-04990.svg`) and `public/assets/Hfffu8O7eVi0qTHu7dUD58SVQ00.png` (162x35, contain). Tiles fade in on load (`opacity .001 → 1`, spring 0.4s, delay 0).
- Bento (max 1062, gap 16): row 1 (465 tall): white card 587x465 (padding 64, radius 24) with image `public/assets/U7vEsbEodiJTfyaMk6fxx1JzSOE.png` (464x193 contain, "100%" graphic) above H3 "Autonomous reviews management" (52/62.4 center); photo card 459x465 radius 16 (`public/assets/BEKytDQGmk9M2on9YkKhq2plrU.webp` cover, offset `top:-34px; left:-287px`) with overlays: "Preference saved:" glass chip (bg `rgba(243,240,235,0.6)` radius 24 padding 8px 16px 8px 8px; H6 24/33.6 + "Prefers oversized  fit" Instrument Sans 14/15.4 `#2A3639` + 32px check `public/svg/ai-review-management-Icon-Button-ec0de.svg`), review card ("Love the quality, and sizing is perfect!"), 40x40 brand avatar, Siena message card "Welcome back, Lena! We have new oversized pieces from the new collection you might wanna check out..." (Tiempos 12/15.6). Row 2: three white tiles 343x189 (padding 32px 24px, radius 24, gap 24): FA icon (U+F4FD, U+F245, U+F6A3) + H5 32/38.4: "24/7 Support coverage", "1-Click install", "Scalable insights".
- Mobile: 390x1842, padding 80px 24px 56px; header stacks; lockup tiles 342x144 + 166x144 pair ("X" 56px); bento column.

### 3.7 Main CTA — VARIANT: heading homepage text ("See how fast-growing brands scale with Siena"); top "Blur out" `linear-gradient(180deg, #FAF7F1 0%, rgba(250,247,241,0) 100%)` (same as homepage). Effectively **IDENTICAL to homepage MainCta** at desktop. Mobile: 390x586, padding **120px 32px** (homepage 168px 16px).

### 3.8 Footer — IDENTICAL.

---

## 4. /qa-agent

Page title: "Siena QA Agent - 100% CX Quality Assurance". Height 8400 @1440 (Main 7965 + footer 434); 11410 @390. Screens `recon/pages-a/qa-agent-1440.png`, `-390.png`; tree `qa-agent-1440.tree.txt`.

Nav: homepage behaviour (transparent at top → solid at 150–160).

Section order @1440 (y/h): Hero 0/744 · Logos 744/96 · Complete Coverage 840/864 · Testimonial A 1704/804 · Leaderboard 2508/951 · "Siena Intelligence" (Act on what matters) 3459/758 · "Automated Actions" (Ask Siena) 4218/746 · Before/With Siena 4963/686 · Testimonial B 5650/804 · FAQ 6454/757 · Main CTA 7211/755 · Footer 7965/434.
**Mobile order differs:** the "Automated Actions" (Ask Siena, y 4222) block comes **before** "Siena Intelligence" (Act on what matters, y 5416) at 390. Render order with CSS `order` or two DOM positions.

### 4.1 Hero — VARIANT of split hero (§2.1)
- Section 1440x744, bg #fff, padding 120px 0 0. Header Content: **max-width 1200**, padding **0 96px 24px**, row gap 40, z 2.
- Copy (464 wide, gap 40): H1 "Meet your QA Agent" (Feature Deck Web Light 300 80/80 ls −0.8, 2 lines "Meet your QA" / "Agent"); swash 241x18 centered at `top:150px` (translateX(−120.5px), left 50%) under "Agent"; subtitle (no opacity) "The first agent to evaluate 100% of your conversations, AI and humans, against criteria you write in plain language." (20/28, 464x84); xlg Book a demo.
- Visual 504x403 (x 720, y 219): glass card 504x353 (`top:49px`, bg `rgba(243,240,235,0.6)`, radius 24, blur(6px)); conversation thumbnail card (`[Prompt]` 193x156 at `top:27px; left:-11px`, padding 2 radius 28 shadow `0 3px 8px rgba(167,160,146,.3)` → bg `rgba(255,255,255,0.9)` radius 28 padding 16 blur(10px)) containing an illustration `public/assets/QHZQBNQlSL00uTxYcQKOePAWdT0.webp` with micro text (Tiempos 9px/9.9px "Can you just give me a full refund? I don't want a replacement." / red `#A62216` "Absolutely, I've processed a full refund including the original shipping cost.") and two side white fades (`linear-gradient(270deg,#fff 26%,rgba(255,255,255,0) 100%)` 32x150 and 90deg 32x94); person photo `[HumanBG]` `public/assets/VRgeV87pQvsZYofKNSBCVhWsSuw.webp` 365x459 (contain) at `top:-106px; left:72px`; evaluation card `[Bars]` 221x155 (`top:186px; left:246px`, padding 2 radius 28 shadow → `[Line chart]` bg `rgba(255,255,255,0.7)` radius 26 padding 8px 12px blur(9px) `box-shadow: 0 8px 12px rgba(0,0,0,0.06)`): "#4821" (Tiempos 14/18.2) + "Flagged" chip (Instrument Sans 10/15 + FA U+F024 flag 12px `#F95040`), "Unauthorized refund issued" (Tiempos 18/23.4 `#2A3639`), "Policy adherence" (Tiempos 12/15.6), "Reasoning" (Tiempos 14/18.2), "Refund exceeded authorized limit. No escalation initiated." (Tiempos 12/15.6).
- Load motion: H1 delay 0.2 (ease `[0,0.91,0.14,0.85]`), swash & subtitle delay 0.3, button 0.4 (ease `[0,0.91,0.78,1]`), all `{opacity:.001,y:200}` tween 0.7s; person photo `{opacity:.001,y:50}` spring (bounce 0.2, 1s) delay 0.4.
- Edge fades in `[Main]`: top 667, left 233x125 (`90deg #fff→transparent`), right 197x114 at left 1243, z 2.
- Mobile: hero 390x873 padding 96px 24px 0; centered copy (H1 56/56); fades at top 851/875 (111x74, 122x45).

### 4.2 Logos — IDENTICAL tickers (standalone 1440x96 at y 744).

### 4.3 Complete Coverage — NEW
- Section 1440x864, bg `#FAF7F1`, flex column center, gap 26, padding **184px 0 80px**, z 1. Decorations: BG blob `public/assets/MSTluKQSUNZrlxr6ESQPZTnooU.webp` 669x641 at `top:171px; left:699px`, **opacity 0.3**; top fade 75px `linear-gradient(180deg,#FFFFFF 0%,#FAF7F1 100%)`; side fades 79x409 (`#FAF7F1` → transparent) at both edges of the gallery.
- Title block absolutely positioned (left-aligned at x 216, top 160, width 1008, gap 24): eyebrow "YOUR CRITERIA. SCORED AUTOMATICALLY"; H2 "Know exactly where quality breaks down" (max 624, 64/64 left, 2 lines); subtitle (opacity 0.82, max 624) "QA Agent scores every conversation against your criteria: brand voice, resolution rate, policy adherence, whatever matters to you. See every agent's performance at a glance."
- Right card `[Card/Gallery]` 504x470 (x 720, y 1154), bg `linear-gradient(180deg, rgba(250,247,241,0.8) 0%, #FFFFFF 100%)`, radius 24, padding 16px 16px 0, containing person photo `public/assets/blmLIryOHXIs0aAOxtgTnOTNS3k.webp` 251x454 (cover) — appear `{opacity:.001,y:50}` spring 0.2/1s delay 0.4.
- **Criteria gallery ticker:** a row (1104 wide, at card-relative `top:228px; left:-600px`, overflow clip) of 5 cards (duplicated for loop), gap 16, moving **left at 35 px/s** linear infinite. Card `[Description N]` 280x194: outer padding 2, radius 0 0 16 16, bg `linear-gradient(180deg, rgba(255,255,255,0) 9.8%, rgba(247,221,147,0.3) 90.3%)`, blur(5px) → inner `[Prompt]` 276x146 bg `rgba(255,255,255,0.8)` radius 28 padding 16px 16px 24px shadow `0 3px 8px rgba(167,160,146,.3)` blur(10px): title Tiempos 20/26; scale chip (Geist Mono 10/14 ls 0.5 uppercase `#605C53`, pill); "Average score" Instrument Sans 400 16/19.2; big value Feature Deck Web Regular 40/48 `#000` + "/" 32/38.4 + max 24/33.6 `#A7A092`; question text below the prompt (Tiempos 14/18.2). Cards: "Conversation Quality" 0-100 · Average score 96/100 · "How clear and warm was the agent's communication?"; "Customer Effort" 1-5 · 4.4/5 · "How easy was it for the customer to get resolved?"; "Compliance" PASS/FAIL · Pass rate 94/100 · "Did the agent get the right consent before modifying payment?"; "Upsell execution" YES/NO · Succes rate (sic) 91/100 · "Was the agent's upsell offer a good fit for this customer?"; "SOP Adherence" 1-5 · 4.6/5 · "Were all required steps followed and recorded correctly?"
- Mobile: 390x945, padding 112px 24px 56px, gap 40; title in flow (centered column), card below.

### 4.4 Testimonial A — VARIANT (§0): section bg `#FAF7F1`, padding 80px 96px; panel **bg `rgba(255,255,255,0.5)`**, radius 24, max 1200; single static slide (no controls). Quote "Before Siena, QA lived in a completely separate tool. I was constantly chasing people for updates. With Siena, QA finally feels like a closed loop. But the bigger shift is the intelligence layer. It makes it very obvious where we are falling short. That level of visibility I simply did not have before." — logo `public/assets/ZeJTO989NVjG9cfH69ugd19p4C0.svg` (Coterie, 374x76) — **Rebecca Blount** — DIRECTOR, CUSTOMER EXPERIENCE & FULFILLMENT — image `public/assets/DkKUcZ5MMlNWr9dt9V653q2eWmI.jpg` 532x532. Bottom fade 187px `linear-gradient(0deg, #FFFFFF 0%, #FAF7F1 84%)` (into the white Leaderboard).

### 4.5 Leaderboard — NEW (static; no hover/click behaviour measured — tabs don't switch)
- Section 1440x951, flex column center, gap 72, padding 80px 96px, bg white.
- Title (centered, gap 24): eyebrow "FULL VISIBILITY, EVERY AGENT"; H2 "Turn every score into a world-class agent" (max 800, 2 lines); text (no opacity) "Every agent, AI and human, in one view. Click any score to see the full evaluation and reasoning." (620 wide).
- Row (max 960, gap 32): left card 448x465 (bg #fff, radius 24, padding 24px 0, column gap 40): eyebrow "AGENT PERFORMANCE"; header labels (Instrument Sans 600 12/16.8 ls 0.6 uppercase `#787368`): EVALUATIONS · RESOLUTION · EMPATHY; 4 rows 448x72 (radius 20, padding 16, shadow `0 5px 10px rgba(156,156,156,.1), 0 19px 19px rgba(156,156,156,.09), …`; active row bg `#FAF7F1`, others #fff), avatar 40x40 + name (Tiempos 18/23.4 `#2A3639`) + values (Instrument Sans 500 16/19.2 ls −0.16 `#605C53`, centered in 90px cols): Siena (`public/assets/14aPLwywC9q4flBvXM0s1rLqA8.png`) 1,385 · 92.98% · 4.8; **Alex M.** (`wgzGbJhOWJqIG4hNffwQdhzQEA.png`, active) 312 · 89.84% · 4.5; Karen A. (`9DG2BP5UXrlDUwjo8TPG7ZyPxF8.png`) 289 · 87.85% · 3.2; Bronte W. (`UM7BiWdfr9CURmczCXjNnvZLmA.png`) 201 · 91.34% · 4.1.
  - Right panel 480x465 (bg `#FAF7F1`, radius 16, padding 24, gap 24): header (chip with 24px avatar + "Alex M." Tiempos 18) · eyebrow "RECENT CONVERSATIONS"; 3 conversation cards (padding 2 radius 28 shadow → white): "#4819 · Smooth exchange resolution · Resolution" + PASS (Instrument Sans 600 12/16.8 ls 0.6 uppercase `#294FBA`) + blue check circle; "#4821 [Flagged] · Wrong return policy applied · Policy adherence" + FAIL (`#F95040`) + red x circle, with expanded transcript bubbles (Instrument Sans 10/15: "I need to cancel my subscription, it's just too expensive right now." / "I'm sorry to hear that. I've submitted a replacement order and you'll receive tracking within 24 hours."); "#4819 [Flagged] · Customer issue not fully resolved · Resolution" FAIL (faded by a bottom fade 480x101 `linear-gradient(0deg,#FAF7F1 0%,rgba(250,247,241,0) 100%)`).
- Mobile: 390x1386, padding 56px 24px, stacked.

### 4.6 "Act on what matters" (`[Siena Intelligence]`) — NEW (3 hover cards)
- Section 1440x758, padding 80px 96px, gap 72. Title: eyebrow "AUTOMATED ACTIONS"; H2 "Act on what matters"; text "Set a threshold on any criterion. Siena sends a Slack alert, tags the ticket, and attaches the full reasoning."
- Row (max 1008, gap 16): three cards 325x336, bg `linear-gradient(180deg, #FFFFFF 0%, #FAF7F1 100%)`, radius 24, padding 32px 24px (0 bottom), overflow clip, blur(2px), column gap 16: title (Feature Deck Web Regular 32/38.4 center) + text (Instrument Sans 400 16/19.2 center) + graphic; bottom: grey outlined giant word as a masked shape (`[Union]` bg `#D0D2D3` masked by an SVG text outline, opacity 0.7 for Slack) + fade `linear-gradient(0deg, #FAF7F1|#FFFFFF 0%, transparent 86%)` 88px.
  1. "Slack notifications" — "Low compliance score? Your team gets alerted right away." — 96x96 Slack logo SVG `public/svg/qa-agent-slack-logo-54b46.svg`. **Hover:** a muted autoplay looping `<video>` (`public/video/abstract-landscape-moving-shapes.mp4`, 277x96 radius 16, cover) masked to the Slack-logo shape (`mask-image: url(public/assets/FR5NmxuDqZxhiYmyAJSkFYag0eE.png)`) fades 0→1 in **≈200ms** ease-out; footer word opacity 0.7→1 in the same time. Reverses on leave.
  2. "Help desk tasks" — "Flagged conversations appear in your team's queue automatically." — tag-network illustration (`[Visual]` opacity **0.3**: central 104x104 round tag icon FA U+F02C 56px in a white circle (bg `rgba(255,255,255,0.8)` radius 300) + 4 corner chat icons FA U+F4B6 32px rotating on a ring). **Hover:** visual opacity 0.3→1 (≈300ms), ring container rotates continuously ≈ **18°/s** clockwise while hovered (icons counter-rotate to stay upright); on leave returns to 45° rest state. Corner-icon appear: `{opacity:.001, x:-20, y:-20} → {rotate:-45}` spring (0.2, 0.6s) delay 0.6.
  3. "Internal notes" — "Score and reasoning on every ticket. No digging required." — notes icon SVG 96x97 `public/svg/qa-agent-Notes-ed4f2.svg`. **Hover:** masked video (mask `public/assets/WArgludzIusNBVikcHh3Rnh5bro.png`) fades in ≈200ms.
- Mobile: cards stacked (342 wide).

### 4.7 "Turn your quality data into answers" (`[Automated Actions]`) — NEW
- Section 1440x746, padding 80px 96px. Mockup card 1062x586 (bg #fff, radius 32, padding-bottom 24, overflow hidden) with `[Command Bar]` background `linear-gradient(180deg, rgba(255,255,255,0) 9.8%, rgba(247,221,147,0.3) 90.3%)` radius 0 0 16 16, padding 32px 24px 40px.
  - Title inside the card (gap 16): eyebrow "ASK SIENA ANYTHING"; H2 **Feature Deck Web Regular 400 40px/48px `#000`** "Turn your quality data into answers"; text "Every score flows into Ask Siena. Ask in plain language, get an answer in seconds, backed by the actual conversation."
  - 4 question cards 238 wide (bg `rgba(255,255,255,0.6)` radius 16 padding 16 blur(2px), gap 10, padding-top 48 row): eyebrow 12/16.8 ls 0.6 uppercase + question Instrument Sans 16/19.2 center: PRODUCT FEEDBACK "Has there been any change in sentiment to any product?"; AGENT COACHING "What pattern is driving low scores for my agents?"; RETENTION "What are the reasons for cancellations from last week?"; SUBSCRIPTION "How many customers are doing skips and for how long?"
  - Answer composer `[Footer]` 531x177 (bg `rgba(243,240,235,0.7)` radius 35 padding 8 blur(10px)): answer card (#FAF7F1 → white radius 28 padding 8): "Overall CXP score is 98.7% this week – down from 99% last week" (Tiempos 14/18.2) + "The return policy page appears to be causing friction across multiple conversations." (Tiempos 12/15.6) + metric chips grid (3x153px): "Resolution rate • 91.2%", "Customer effort • 4.4", "Compliance • 95%" (Instrument Sans 10/15); prompt pill (RAINBOW255 radius 28 → white radius 26 padding 12) "How is our QA performance trending this week?" (Feature Deck Web Regular 14/16.8 ls −0.14) with sparkle icon `public/svg/social-agent-sparkles-two-2-6aa85.svg` + Siena icon.
  - Load/scroll: the command-bar answer `[Content]` circle element has appear `{opacity:.001,y:64}` tween 1s ease `[0.44,0,0,1]` delay 0.4.

### 4.8 Before / With Siena — NEW (reused on topics-explorer as "Comparison")
- Section 1440x686, padding 80px 96px, gap 72. Title: H2 "Replace four tools with one"; text "QA software, a VOC tool, a manual grading process, and an analyst to pull it together. Siena handles all of it."
- Two cards 523x310 (gap 16, max 1062), bg `linear-gradient(180deg,#FFFFFF 0%,#FAF7F1 100%)`, radius 16, padding 24; inner column gap 32: H3 Feature Deck Web Regular 52/62.4 center ("Before" / "With Siena"); list (gap 12) of rows: FA6 Sharp Light 24px icon (Before: U+F00D ✕; With: U+F890 sparkles) + Instrument Sans 400 16/19.2 ls −0.16 left.
  - Before: "Separate QA tools, $50-150k/year" · "2-5% conversations reviewed" · "Hours spent finding conversations before grading" · "AI and human agents measured separately" · "Static rubrics, no automated response".
  - With Siena: "A fraction of the cost of a dedicated QA tool" · "100% conversations scored automatically" · "Smart relevance matching" · "One scorecard for AI and human agents" · "Slack alerts, tags, and notes triggered by scores".
  - Appear on view: `{opacity:.001} → 1` tween 0.4s ease `[0.94,-0.05,0,1]` delay 0.4 (both cards).

### 4.9 Testimonial B — VARIANT (§0): section white, panel bg `#FAF7F1` radius 24; single static slide: "QA Agent has quickly become a standout in our service operations, replacing our previous QA workflow within weeks. The level of detail has been impressive. It noticed that the overnight team had more friction in agent hand-offs, causing customers to repeat themselves. It has significantly reduced operational burden while strengthening how we deliver service excellence." — Coterie logo (`ZeJTO989NVjG9cfH69ugd19p4C0.svg`) — **Taryn Oubre** — CX SENIOR MANAGER — image `public/assets/6m3nbsOefa5MuiJ7cZLEbjcG3Oc.webp`.

### 4.10 FAQ — VARIANT of §2.5 Faq: panel **max-width 1062, radius 24** (social: 894/48), list 982 wide. Items: 1 (open by default) "We already review a sample of conversations. Why does 100% coverage matter?" — "Most QA tools cover around 3% of conversations. That means the other 97% are unreviewed, and whatever is happening in them stays invisible until it becomes a real problem. One early Siena QA Agent customer evaluated more conversations in a single week than most CX teams reach in a year." · 2 "How can I define what Siena QA Agent evaluates?" — "Think about what great customer service looks like on your team. Write that as a question, for example 'Did the agent confirm identity before making changes to payment information?' Then choose how to measure it: an average score from 0 to 100, a 1 to 5 scale, a pass/fail with pass rate, or a simple yes/no. Siena QA Agent takes it from there." · 3 "Does Siena QA Agent work for human agents, not just Siena's AI?" — "Both. Whether it's an AI agent or a human rep, Siena QA Agent scores them on the same criteria and the same scorecard. That's the only way to get a true picture of your customer service operation. And when you need to compare them directly, that view is just a click away." · 4 "Which channels does Siena QA Agent cover?" — "Every channel Siena supports: email, live chat, social, and more. Every conversation is scored the same way, regardless of where it came from. One scorecard across your entire CX operation, with the ability to break down performance by channel whenever you need it.".

### 4.11 Main CTA — VARIANT: heading **"Make your customer experience AI-native"** (2 lines, 755 tall); top Blur out 153px `linear-gradient(180deg, #FFFFFF 0%, rgba(250,247,241,0) 100%)`. Mobile 390x586, padding 120px 32px.

### 4.12 Footer — IDENTICAL.

---

## 5. /topics-explorer

Page title: "Siena Topics Explorer - VoC Reinvented". Height 8163 @1440 (Main 7728 + footer 434); 10328 @390. Screens `recon/pages-a/topics-explorer-1440.png`, `-390.png`; states `states/topics-explorer-1440-{1250,2150,4600}.jpg`, hero canvas `states/topics-hero-a.png`.

Nav: homepage behaviour (transparent → solid at 150–160).

Section order @1440 (y/h): Hero 0/760 · Logos 760/96 · Features 856/2158 · Testimonial 3014/804 · Ask Siena 3818/763 · Alerts 4581/746 · Comparison 5327/790 · FAQ 6118/856 · Main CTA 6974/755 · Footer 7728/434.
**Mobile order differs:** Alerts (y 3846) → Comparison (5253) → Ask Siena (6445). (Desktop: Ask Siena → Alerts → Comparison.)

### 5.1 Hero — VARIANT of split hero (§2.1)
- Section 1440x760, bg #fff, padding 120px 0 0. Header Content max 1200, padding **0 96px 40px**, gap 40, z 3.
- Copy 464 wide: H1 "Meet Topics Explorer" (80/80 Light, left, 2 lines; **no swash, no appear animation** on H1/subtitle/button); subtitle "See every topic your customers bring up before it becomes a trend you missed." (20/28, 464x56); xlg Book a demo.
- Visual 504x403 (x 720, y 219):
  - **WebGL canvas** (686x599 at `top:-73px; left:14px`, z 0, `cursor: crosshair`): animated grainy gradient bubbles (circles filled with noisy blue→pink gradients, slowly drifting/morphing, cursor-reactive). **Canvas-rendered — internals not measurable.** Recreate with ~6 absolutely positioned circles (diameters ≈ 90–260px) using `radial-gradient` blends of `#AFC3F0`-ish blue and `#F6A9A0`-ish pink with an SVG `feTurbulence` grain overlay and slow CSS drift (see `states/topics-hero-a.png`), or a static capture.
  - Glass card 504x353 (`top:49px`, bg `rgba(243,240,235,0.5)`, radius 24, blur(6px)); person `public/assets/EKA5qqkzN9z86qNi052bzgvYlXA.webp` 251x454 at `top:-101px; left:8px` (appear `{opacity:.001,y:50}` spring 0.2/1s delay 0.4).
  - Masked photo bubble: 204x249 img `public/assets/ETA2fSnLgCiwMUrfr6bhOzKES4.webp` clipped by `mask-image: url(public/assets/RnI2nWdys2uqWp7NCcB0wEoBY.png)`.
  - Topic chips (white, radius 12, padding 2): "Compressed" chip 163x36 = title (Tiempos 12/15.6) + 24x24 coral target icon `public/svg/topics-explorer-Vector-img-0456f.svg`; "Deployed" chip 192x96 adds "7,496 Conversations • 99% CXP Score" (Tiempos 10/13), trend "↗ +17%" (FA U+E09F 16px + Tiempos 12/15.6 `#F95040`) and "This week" (10/13). Chips: **Returns, Refunds and Exchanges** (deployed, center), Shipping delays (+12%, 401 conv, 92%), Sizing questions (+12%), Feature requests (+04%, 123 conv), Billing (+04%).
- Edge fades in Main: top 672, left 233x218 / right 197x218 (white→transparent), z 2. Mobile: hero 390x978, padding 128px 24px 80px; fades 158x114 / 149x129 at top 936/929.

### 5.2 Logos — IDENTICAL tickers (standalone 1440x96 at y 760).

### 5.3 Features — NEW (2 alternating text/visual rows; same family as reviews' scroll-area typography, but NOT sticky)
- Section 1440x2158, padding 160px 0 0. Title (max 1072, gap 24): eyebrow `<strong>` "INTELLIGENCE, VISUALIZED" (Instrument Sans 700); H2 "Always know what customers are talking about" (max 800); subtitle (opacity 0.82, max 680) "One tool that reads every conversation, replaces quarterly surveys, analyst hours, and the guesswork in between."
- `[Scroll Area]` padding 64px 96px 0, content column gap **80px**; rows 1072x800 (max 1072), flex row center:
  1. Row 1 (gap 32): text 528 (gap 24): H3 "Catch issues long before they rise" (52/62.4 left) + bullets (star icon + Tiempos 18/23.4 `#2A3639`): "Volume and score in one view, always current" · "Trend direction visible at a glance, per topic" · "Sort by growth, score, or volume". Visual `[Compressed]` 512x488 bg `#FAF7F1` radius 24: topic table (388 wide, centered): header labels VOLUME · CXP SCORE (Instrument Sans 600 12/16.8 ls 0.6 uppercase `#787368`); rows (pill, Tiempos Text 16/20 `#0A0A0A` name + volume Tiempos 14/18.2 **`#FB5646`** with ↘ + score **`#0E893B`** with ↗): Payment and Billing 7,412 / 99% · **Delivery Issues** 6,135 / 97% (expanded: "6,135 CONVERSATIONS" + conversation cards "#4819 · 1 hour ago · My tracking hasn't updated in 4 days. Is my package lost?", "#5041 · I paid for express shipping and it's been 6 days.", "5038 · My package says out for delivery but it never arrived." (Tiempos 12/15.6 + 14/18.2, white radius 12)) · Trial, Sample, and Gifts 1,301 / 98% · Product complaints 1,135 / 91%; bottom fade 101px `#FAF7F1`.
     - In-view behaviour: when the row enters the viewport the Delivery Issues row expands (bg → `#FAF7F1`, list slides from translateY(−112px) to 0); collapses again when it leaves (replays each time).
  2. Row 2 (gap 56, visual left): visual 508x488 (`#FAF7F1`, radius 24): topic bubble cloud — coral gradient dots of various sizes (SVG/data-URI circles 19–101px, `public/svg/topics-explorer-Sticky-Image-bg-*.svg`, `-Topic-bg-ba3f2.svg`) along faint horizontal yellow lines (`public/svg/topics-explorer-Sticky-Image-ccff5.svg`), masked by `radial-gradient(50% 75%, #000 5.7%, transparent 100%)`, with a "Packaging complaints" chip (1,206 Conversations • 99% CXP Score, ↗ 11%). Bubbles fade in (opacity 0→1) when the row enters view and fade out when it leaves; chip translates −21.6 → −51px. Text 508: H3 "Watch what matters, let Siena do the tagging" + bullets "Topics come from what customers actually say" · "Taxonomy stays current as conversations evolve" · "Every topic links directly to its source conversations".
- Mobile: padding 56px 0 0; rows stack (visual below text), 342 wide; H3 36/43.2.

### 5.4 Testimonial — VARIANT (§0, same as qa §4.9 chrome: white section, panel `#FAF7F1` radius 24, single static slide): "Topics Explorer has given us a clear view into how our processes and messaging are actually landing with customers. This has created an opportunity for us to make small but meaningful improvements, especially in how we communicate." — Coterie logo `ZeJTO989NVjG9cfH69ugd19p4C0.svg` — **Taryn Oubre** — CX SENIOR MANAGER — `public/assets/6m3nbsOefa5MuiJ7cZLEbjcG3Oc.webp`.

### 5.5 Ask Siena — VARIANT of qa §4.7 (same mockup component)
- Section 1440x763; mockup 1062x603. Diffs: H2 (Feature Deck Web Regular 40/48 `#000`) "From trends to decisions in one conversation"; text "The kind of clarity that used to require a whole analytics team. Now it's just a question away."; question cards bg **#FFFFFF** (qa: rgba 0.6), headings rendered as `<h3>` 12/16.8 uppercase: REVENUE OPPORTUNITY "What are customers asking for that we haven't built yet?" · REVENUE LEAK "Where are we losing the most money to refunds right now?" · SENTIMENT SHIFT "What changed in customer feedback after our last update?" · COMPETITIVE THREAT "What do customers say when they mention switching?"; answer card (515x118): "🎨 **More colors across product families.** 120+ conversations reveal customers are buying into sets. When pants launch in Sage Heather, but the matching tunic doesn't follow, they notice." (Tiempos 14/18.2, bold lead) + "Your most loyal customers are already telling you what to buy next. Start with navy and charcoal. They named the sets they want to complete." (12/15.6); prompt "What are customers asking for that we haven't built yet?" with a **blinking caret** (opacity toggles 0↔1 irregularly, ~1–2s).
- Answer composer & answer card reveal on view: `opacity 0, y +80 → 1, 0` (~0.4s ease-out, answer slightly after composer).

### 5.6 Alerts — NEW (reuses qa §4.6 card style)
- Section 1440x746, bg `#FAF7F1`, padding 80px 96px, gap 72; bottom fade 187 (`#FAF7F1`→transparent) overlapping the next section.
- Title: eyebrow (`<code>`-wrapped, still Instrument Sans 600 16/22.4) "STAY AHEAD"; H2 "Intelligence on your schedule, wherever your team works" (64/64, 2 lines).
- Row (max 1200, gap 16): three cards 389x340 (bg `linear-gradient(180deg,#FFFFFF 0%,#FAF7F1 100%)`, radius 24/16, padding 32px 24px):
  1. "Recurring briefs" — "Pick any question and set a cadence. Ask Siena tracks it and delivers a full brief with trend shifts, volume changes, and source conversations." — visual: "Ask me anything" prompt pill (Feature Deck Web Regular 24/33.6, light `#F1F5F9` bg) at opacity **0.4** + "Packaging complaints" chip at opacity **0.5**, flowing dashed connector SVG (`public/svg/topics-explorer-Visual-c952e.svg`, dash opacity animates continuously). **Hover (variant "Ask Siena - Hover"):** prompt → opacity 1, chip → opacity 1 and expands to the deployed chip (conversations/score/trend), ≈400ms spring.
  2. Topics card — masked gradient blob (`public/assets/ETA2fSnLgCiwMUrfr6bhOzKES4.webp` via mask `public/assets/3DDwu6JiBQxZUakevLif2PuC5TM.png`, radial mask) + block card (white radius 12 shadow `0 8px 12px rgba(0,0,0,.06)`): "Order shipping issues" (Tiempos 18/23.4) "127 mentions" "↗ 68%" (`#FB5646`). Appear: card `opacity .001→1` tween 0.4s ease `[0.94,-0.05,0,1]` delay 0.2; blob spring 0.4s; block `{opacity:.001, y:150}` tween 0.2s ease `[0.44,0,0,1.13]` delay 0.3.
  3. "Delivered where it matters" — "The right people get the right context, without ever opening a report. Send it to Slack, email, or both." — Slack logo + masked video hover exactly as qa §4.6 card 1 (video 341x96).

### 5.7 Comparison — VARIANT of qa §4.8 Before/With Siena
- Diffs: H2 "What Topics Explorer replaces" (an empty first `<h2>` 800x64 sits above it — keep a 64px spacer + 40px gap, total title 168 tall); text "Every conversation your brand has ever had contains patterns worth acting on. Topics Explorer is the first time you can actually see them."; cards **472x310** (max 960).
  - Before: "Manual agent tagging, inconsistent by design" · "Days of exports and spreadsheets for one answer" · "Keyword searches to find what caused a spike" · "Sentiment requires a separate paid tool" · "VoC tools built on surveys, not support data".
  - With Siena: "Every conversation categorized automatically" · "Instantly surface insights with Ask Siena" · "Click any trend point, see the conversations behind it" · "Sentiment shifts visible across every category" · "Built from every conversation, no surveys needed".

### 5.8 FAQ — VARIANT of §2.5 (panel max 1062, radius 24, padding **40px 40px 20px**). Items: 1 (open by default) "How is Siena Topics Explorer different from tagging in my help desk?" — "Your help desk tags depend on agents. Who's working, how busy they are, how they interpret each ticket. Topics Explorer reads every conversation automatically and applies the same consistent lens every time. No training, no maintenance, no gaps." · 2 "Do I need to build a taxonomy before Siena Topics Explorer can work?" — "There's nothing to configure before you can start seeing data. Topics Explorer starts classifying conversations as soon as it's connected. Most teams have a working dashboard within their first day." · 3 "How many conversations does it analyze?" — "Every single one. Not a sample, not a selection. Every conversation that comes through your support operation, across every channel, every day." · 4 "How is this different from Medallia or Qualtrics?" — "Medallia and Qualtrics run on surveys. That means you're hearing from the customers who respond, not all of them. Topics Explorer is built from your actual support conversations, so it covers 100% of your customer interactions with no survey design, no response rate problem, no lag." · 5 "Can our product, marketing, or ops teams use this too?" — "It's built for CX teams, but the insights travel well. Product managers, merchandising, and ops leads use it to track which SKUs need attention, where the self-serve experience is breaking down, or what to address before a launch. And because Ask Siena connects directly to Slack, any team can surface answers from your conversation data without ever opening a dashboard or asking the CX team.".

### 5.9 Main CTA — homepage heading ("See how fast-growing brands scale with Siena"); top Blur out `linear-gradient(180deg, #FFFFFF 0%, rgba(250,247,241,0) 100%)` 187px. Mobile 390x586 padding 120px 32px.

### 5.10 Footer — IDENTICAL.

---

## 6. /ask-siena

Page title: "Ask Siena: AI Agent Builder for CX and Customer Intelligence". Height 12472 @1440 (Main 12038 + footer 434); 15274 @390. Screens `recon/pages-a/ask-siena-1440.png`, `-390.png`; states `states/ask-siena-1440-{1300,2300,3300}.jpg`, hero prompt `states/ask-hero-*.png`. Tree `ask-siena-1440.tree.txt` (index numbers below).

Nav: homepage behaviour (transparent → solid at 150–160).

Section order @1440 (y/h): Hero 0/800 · Logos block 800/176 · sticky chip-nav (176 tall slot, sticky top 88) · Features A (build) 1006/3251 · Features B (skills / workspace) 4257/1480 · Key Capabilities (customer intelligence + testimonial slider) 5737/1963 · Playbooks 7701/841 · Slack ("Ask Siena lives in Slack") 8541/1258 · Integrations 9800/744 · Enterprise 10543/740 · Main CTA 11283/755 · Footer 12038/434.

### 6.1 Hero — NEW variant of split hero
- Section 1440x800, bg #fff, padding **120px 0 80px**. Header Content max **1280**, padding 0 96px, row gap **24**.
- Copy (560 wide, gap 40): H1 "Meet Ask Siena" (80/80 Light, 1 line, 495x80); subtitle "The agent that builds the agent. The intelligence that surfaces what your customers are telling you. Democratizing world-class CX for every brand." (20/28, 438 wide, 4 lines); xlg Book a demo. **No load animations** on this hero.
- Visual 504x452: background `<video>` (`public/video/abstract-landscape-moving-shapes.mp4`, autoplay muted loop, cover) in a 797x666 box at `top:12px; left:-93px; right:-93px; bottom:-65px`, **rotated 165°** (`matrix(-0.966,0.259,-0.259,-0.966)`), `filter: blur(24px)`, `mask-image: radial-gradient(45% 41% at 54.2% 50.5%, #000 44.9%, rgba(0,0,0,0.376) …, transparent)` → soft colour glow; person cut-out `public/assets/YmGG4WNvnun2O0TtfdX5gdGE.webp` 248x432 (contain) centered; prompt bar at the bottom (504x90, centered): glass background (bg `rgba(243,240,235,0.5)`, radius 48, blur(10px)) + RAINBOW255 border (radius 28) → white (radius 26, padding 8px 12px 12px): Siena icon + "Ask Siena" (Feature Deck Web Regular 24/33.6) followed by a **typewriter phrase**.
  - Typewriter (measured): types **≈65ms/char**, holds the full phrase ≈1.0s, deletes **≈17ms/char**, pauses ≈1.1s with only "Ask Siena" + blinking caret, then the next phrase; loops. Caret fades in/out with ~1s period. Phrases in order: "to turn an SOP into a journey" · "what drives loyalty" · "to build a BFCM persona" · "to find new revenue streams" · "about shipping speed by region" · "to build a new QA evaluation" · "for weekly management report".
- Mobile: hero 390x906, padding 120px 16px 96px; centered copy; visual below.

### 6.2 Logos — IDENTICAL tickers inside a wrapper block 1440x176 (padding-bottom 80, overflow clip). Edge fades in Main at top 672 (233x218 / 197x218).

### 6.3 Sticky chip nav — NEW (small variant of §2.3 pill nav)
- `position: sticky; top: 88px; z 4`, centered, 218x30: pill bg `rgba(250,247,241,0.2)`, blur(5px), radius 50, padding 8px 16px, gap 8: links "BUILD" (`./ask-siena#build`) | divider 1x14 `#CDBCA0` | "CUSTOMER INTELLIGENCE" (`./ask-siena#cx-intelligence`) — Geist Mono 400 10px/14px ls 0.5px uppercase `#2A3639`. Active highlight pill behind the active link (`public/svg/ask-siena-1-7d6a5.svg`, 52x24 for BUILD at x+3; 154 wide for CUSTOMER INTELLIGENCE), fill `#F7DD93`; slides like §2.3 (≈230ms).
- Active: BUILD until scrollY **6950**, then CUSTOMER INTELLIGENCE (marker `[cx-insights]` at page y 7384 crossing ≈ mid-viewport).

### 6.4 Features A ("Your partner in building agents") — VARIANT of homepage ScrollArea pinning
- Section 1440x3251 (padding 0 0 80px). Title (padding-top 40, gap 24): H2 "Your partner in building agents" (max 720, 2 lines); subtitle (no opacity) "Ask Siena reads the context, knows how to build the agent, and does it so your team skips the learning curve. Bring the idea, it brings the skill."
- Scroll Area 1248x2720 row gap 64: left content 512 (blocks 900 tall, gap 10) + right sticky 512 (`top:0; height 900; padding 110px 0 40px`). Blocks (H3 52/62.4 left; body Instrument Sans 500 20/28 ls −0.2):
  1. "Describe the work. Ask Siena does it." — "An SOP, a transcript, a URL: whatever you've got. Ask Siena reads it and builds the agent, right in the same conversation." + xlg Book a demo.
  2. "Work through it together" — "Siena asks what it needs to know, confirms the edge cases, and shapes the plan with you before anything actually gets built."
  3. "Review and ship" — "Review what's ready to go, whether it's a journey, a policy, or a doc, then deploy it right in the same conversation."
- Sticky card `[AskSiena]` 512x647: bg `rgba(243,240,235,0.4)`, radius 28, blur(10px), padding 12px 16px 16px 12px, column justify flex-end gap 8 (chat stacks from the bottom):
  - v1: three file chips (64px tiles: "Transcript from meeting" waveform, "Returns SOP.pdf" with mini italic checklist "Confirm order is within the 30-day window / Offer exchange or refund / Send prepaid label · log reason" (Tiempos Italic 7px), "yourbrand.com/bundle" link icon FA U+F0C1) — labels Tiempos 9px/11.7px; user message bubble "Build a returns journey from this SOP." (Tiempos 18/23.4 `#2A3639`) with avatar `public/assets/D3TQ38q4HpOxmxHoD1u1AW40NI.png`.
  - v2: files collapse into a stack ("BFCM prep call transcript", "Used 4 times this month", "Verified and live"), Siena reply meta "Read 4 pages • 1 Question", message "Got it. Step 3 references "priority customers". Should I route orders over $150, or only l…" + option chips "Orders over $150" / "Loyalty tier only" / "Something else…".
  - v3: plan card "in review • warranty": rows "Warranty coverage scope policy", "Helpdesk routing tag", "Warranty portal URL + support email", "Loyalty tier check"; confirm row "Create the journey?" + "Accept" button.
  - **Variant triggers:** v2 at scrollY 2100–2125, v3 at 3050–3075 = when the scroll markers `[mid]` (page y 2109) / `[end]` (3065) reach the **viewport top** (not 50%).
- Bottom bento (max 1008, gap 64): 3 columns 293 wide, padding-top 32, gap 16: FA icon 24 (U+E237, U+F075, U+F336) → title Feature Deck Web Regular 32/38.4 → text (opacity 0.8) Instrument Sans 400 16/19.2 `#2A3639`: "One agent, every artifact" — "Creates the policy, doc, or whatever the job needs."; "Grounded in your data" — "Built from conversations, order history, Shopify, and more."; "Tested before it ships" — "Gets stress-tested against real scenarios before it ships."
- Mobile: static column, content padding 0 24px 56px.

### 6.5 Features B (skills library + workspace) — NEW
- Section 1440x1480, bg `#FAF7F1`, padding 0 96px 80px; top fade 75 (`#FFFFFF→#FAF7F1`), bottom fade 75 (`#FAF7F1 40% → #FFFFFF`).
- Row 1 (1072x700, gap 56): visual 512x488 (padding 32, bg `linear-gradient(148deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 10%, #FFFFFF 100%)`): three tilted skill cards (2px/28px shadow wrapper → white radius 28 padding 16px 12px): "Volume Analyst" (rotate −12°) "Breaks down support volume by topic and channel" + "Built in" chip; "Journey Builder" (center, z above) "Turns an SOP into a working journey" + "Active"; "Opportunity Assessment" (rotate +8°) "Ranks where to expand coverage and quality" + "Built in"; plus a nav card "Coaching evidence · Enable as skill" (400x62, bg `#FAF7F1` radius 15, icon tile 44 `#F4EDDE` with FA U+F46C 20px). Reveal on enter: side cards `{opacity 0, x ∓60, y +100} → 0` delay ≈0.44s, center card delay ≈0.61s, nav card `y +100` delay ≈0.14s; ease-out ≈1s (no overshoot).
  - Text (504): eyebrow "SKILLS LIBRARY"; H3 "Each skill is a specialist"; text "Siena ships a library of skills ready on day one, or build your own."; bullets (star 24 + Tiempos 18/23.4 `#122023`): "Same job, same result every time" · "Ask Siena reads your question and picks the right skill" · "Turn any recurring process into a skill".
- Row 2 (gap 32): text 528: eyebrow "THE ADMIN WORK, HANDLED"; H3 "Ask Siena runs your workspace"; text "Every policy, doc, and task usually lives in a different tool. Siena keeps them all current from one conversation."; bullets (`#2A3639`): "Docs created and updated: policies, playbooks, brand guidelines" · "Planner tasks managed without switching tools" · "One conversation updates your entire Siena workspace". Visual 512x488 (radius 24, blur(9px), window chrome dots): "DOCS" list cards (448x62, bg `#FAF7F1`) "Return handling policy", "Social Media DM & Comments policy" (FA U+F46C icon tiles); "PLANNER" tasks "~~Set up QA evals for return handling~~" (done, `matthew` Geist Mono tag) and "Review bundle discount skill coverage"; illustration `public/assets/QHZQBNQlSL00uTxYcQKOePAWdT0.webp`. Reveal: list cards `y +100 → 0` delay 0.44s (docs) / 0.02s (tasks), ≈1s ease-out.

### 6.6 Key Capabilities ("Your partner in understanding customers") + testimonial slider — NEW
- Section 1440x1963, bg #fff, padding 80px 0. Container max 1200 padding 0 96px gap 40.
- Title: eyebrow "CUSTOMER INTELLIGENCE"; H2 "Your partner in understanding customers" (max 680, 2 lines).
- Row (1008, gap 56): text 440: H3 "From signal to decision"; text "Customer intelligence turns what your customers are already telling you into a decision you can make today."; bullets: "Signals surface the same day they emerge, ready to act on" · "Every insight is backed by the real conversations behind it" · "Teams move from noticing to deciding in the same sitting". Visual 512x488 (`#FAF7F1` radius 24): three question bubbles (white, radius 16, Tiempos 18/23.4 `#2A3639`) "What's trending well this week?", "What do customers love about our products?", "What's driving repeat orders?" + "Ask Siena" button pill (RAINBOW255 border, Feature Deck Web Regular 32/38.4 + Siena icon). Reveal: bubbles `y +80` spring (0.2, 1s) delays 0.31 / 0.50 / 0.82s.
- Three feature tiles (1008 row, gap 16, height 288): visuals + caption Feature Deck Web Regular 20px/28px center: "Trending topics and demand signals, yours to see directly" (tilted cards "Size-inclusive demand ↑67%", "Material quality complaints ↑34%", "Shipping delays ↑18%", images `public/assets/m8yWmZuVfUz4EBQv8rDedWtAD0.png`, `16yGgtMBetaKJ2v9SrTb9bZ0A.png`); "Product signals and demand patterns, backed by conversations" (topic chip "Packaging complaints"); "Share intelligence to Slack or email" (mail / Slack / docs icons `public/svg/ask-siena-Prompt-*.svg`).
- **Testimonial slider** (1133 wide, padding-top 120) — VARIANT of homepage Testimonials: 3 slides, counter "1 / 3", horizontal slide ≈300ms ease-in-out (same as homepage, travel ≈1063px); slide = text column 549 + image **480x552, radius 24**; quote Instrument Sans 400 25.6/33.28; logo 123x56; name 500 20/28; **role uses the homepage style** (600 16/22.4 ls 1.7 uppercase `#122023`); "Read full story" secondary button on every slide.
  1. "Siena has been a huge win for our team. What used to take several hours now takes 10 minutes with Ask Siena." — Coterie `public/assets/ZeJTO989NVjG9cfH69ugd19p4C0.svg` — Rebecca Blount — Director, Customer Experience & Fulfillment — `public/assets/DkKUcZ5MMlNWr9dt9V653q2eWmI.jpg`.
  2. "I’ve wanted a tool like Ask Siena for many years now. It’s like a true CX analyst. It takes something that would have taken weeks and boils it down into something that can happen immediately." — `public/assets/SpxY1h6sqe6POaCpvGhqSGbxc.svg` (Prose) — Jessica Weiss — CX Lead Product Partner — `public/assets/CSFOwfJPv9MTZrAS0E4tQAAy1Y.webp`.
  3. "We went from sinking hours of leadership time into the rabbit hole of extracting data. Now our team leads use their time to actually apply insights and coaching to the team." — Coterie — Taryn Oubre — CX Senior Manager — `public/assets/6m3nbsOefa5MuiJ7cZLEbjcG3Oc.webp`.
- Bottom fade into Playbooks: 187px `linear-gradient(179deg, #FAF7F1 0%, rgba(250,247,241,0) 100%)` placed at `top:-163px` of the next section.

### 6.7 Playbooks — NEW carousel (crossfade like homepage Customer Stories)
- Section 1440x841, bg `#FAF7F1`, padding 80px 96px, gap 40; BG blob `MSTluKQSUNZrlxr6ESQPZTnooU.webp` 824x789 opacity 0.5 centered at top 108; top fade 75 (`#FFFFFF→#FAF7F1`).
- Title (max 1062, left, gap 24): eyebrow "PLAYBOOKS"; H2 "From hours of prep to a quick read" (1 line, 869 wide); text (max 564) "Your recurring reports: built, scheduled, and delivered to your inboxes and Slack channels, by Ask Siena."
- Gallery 1072x450 (blur(9px)): 3 cards per page, each 325x322 (bg #fff, radius 24, padding 24, gap 24): FA icon 20px → title Feature Deck Web Regular 24/33.6 → text Instrument Sans 400 16/19.2 → divider → brand logo (82x20 / 56x20 / 63x20 SVGs: `public/svg/ask-siena-Logos-12-cbb2f.svg` Comfrt, `public/svg/shopping-agent-Logos-5-d4b67.svg` Simple Modern, `public/svg/ask-siena-Logos-6-20e5a.svg` Prose). Controls below (homepage round buttons + counter "1 / 4" in **Instrument Sans 400 16px/19.2px**).
- Pages (Prev/Next loop; transition = opacity 1→0 ≈130ms, swap, 0→1 ≈130ms):
  1. Executive Report — "An overview of Siena's month over month performance across key metrics." · Shipping Report — "Give logistics and CX leadership a data-backed view of which carriers are performing." · Testimonial Finder — "Source testimonials and positive product feedback from your conversations and reviews."
  2. Journey Review — "Optimize your Journeys performance with actionable quality insights." · Product & Issue Intelligence — "Fast view of which products are causing the most support issues for any team." · Quality Score — "Track quality scores across all customer interactions over time."
  3. Returns Driver — "Evidence-based breakdown of what is driving returns across your product catalog." · Weekly Evals — "Actionable weekly report giving stakeholders immediate visibility into CX quality." · Support Effort — "Actionable ranking of products that drive support load, with attention to high-cost items."
  4. Delight — "Standout customer moments that show exceeded expectations and brand loyalty." · Product & Issue Intelligence — (as above) · Automation Quality Review — "Optimize your Siena Automation performance with actionable quality insights."

### 6.8 "Ask Siena lives in Slack" — NEW (uses the §1.5 "expert agents" section shell: `#FAF7F1` bg, centered BG blob 930x891, padding 80px 96px, gap 72)
- Title: eyebrow "WHERE YOUR TEAM ALREADY IS"; H2 "Ask Siena lives in Slack"; text "Answers, insights, and scheduled briefs: all in Slack, where your team already works."
- Slack mock `[Card/Gallery]` 1062x686, bg `rgba(255,255,255,0.6)`, radius 24: purple sidebar (Home / DMs / Activity / Later / Options + avatar `public/assets/SvwqUnk1l16pFvaL0JTEzDLyBY.webp`); floating Slack logo tile 98x98 (bg `rgba(255,255,255,0.8)` radius 28 shadow) at top-right; thread: user bubble "**@AskSiena** what were our top escalations last week?"; Siena reply "Top drivers last week across **1,847 conversations:**" + table card "Customers requests during BFCM peak (Nov 16 - Dec 7, 2025)" with columns CATEGORY / VOLUME / MOMENTUM (Instrument Sans 600 10/14 ls 0.5 `#787368`) rows "① Shipping delays 34% ↑12%", "② Return policy confusion 21% New", "③ Out-of-stock 18% Seasonal" (Tiempos 12/15.6) and footer "Want me to build a journey that addresses ① and ②?". Reveal: reply `y +80` spring delay 0.23s; table card `y +80` ease-out; table rows `{opacity:.001, y:100}` tween ease `[0.98,-0.04,0,0.79]` delays 0.5 / 0.6 / 0.8s (durations 0.4 / 0.6 / 0.8s).
- Three captions below (gap 32, each 333 wide, padding-top 32 with a top divider): Tiempos Text Regular 20px/26px: "@AskSiena in any channel: answers, quotes, and analysis in minutes." · "Your team can now instantly access answers on their own." · "Scheduled playbooks, delivered where your team can act on them."
- Bottom fade 55px (`#FAF7F1` → transparent, multi-stop).

### 6.9 Integrations — VARIANT of homepage Integrations
- Diffs: section bg **#FFFFFF**; title "Works with your existing stack" (left, 1 line); **tile bg `#FAF7F1`** (homepage `#F3F0EB`); gap 48 between grid and button (button right-aligned like homepage). Tiles: Shopify (`public/svg/integration-0-Logos.svg`), Yotpo `S1CA7BjDsQfmui51TcPvAyGtRxA.svg`, AfterShip `4ivCVwCJknXe4l2YnVNdadGF4.svg`, ShipBob `tRZ3CBzNJw2sWeG9jlHuvjm3vs.svg` 143x37, Loop `lJNzlwA3aybr9aHp0a2x2qsApOs.svg`, recharge (`public/svg/integration-5-Union.svg`), text tiles "Helpdesks" and "Custom Apps" in **Feature Deck Web Regular 700 24px/33.6px** (`<strong>`).

### 6.10 Enterprise — VARIANT of §2.7
- Height 740. Title block max 584 (H2 "Enterprise-grade safety" Feature Deck Web Light **400** 64/64 white, 2 lines in 535 width) + paragraph (as social). Cards 250x**220**, inner text **Tiempos 12px/15.6px `#122023`**, titles Feature Deck Web Regular 24/33.6: (U+F2F7) "Compliances" — "Certified against SOC 2, GDPR, CPRA, and HIPAA standards."; (U+F132) "AI guardrails" — "System-level and configurable boundaries on tone, topics, and actions."; (U+F023) "SSO, roles, logs" — "SAML SSO, granular permissions, and a full trail of every action."; (U+F590) "Dedicated support & SLA" — "A named success manager, hands-on onboarding, and an uptime SLA."

### 6.11 Main CTA — VARIANT: homepage heading; dark top Blur out `linear-gradient(180deg, #122023 7.02%, rgba(18,32,35,0) 100%)` 187px (out of Enterprise). Mobile 390x586.

### 6.12 Footer — IDENTICAL.

---

## 7. Mobile (390x844) section boxes — measured

Framer breakpoints identical to homepage (Phone ≤ 809.98, Tablet 810–1199.98, Desktop ≥ 1200; mobile nav ≤ 767.98). All mobile sections use side padding 24px (content 342) unless shown; H2 48/48 ls −0.96, eyebrow 14/19.6, H3 36/43.2 (feature blocks), subtitle 16/22.4. Main CTA on product pages: 390x586 with padding 120px 32px (shopping: 538, padding 96px 24px; social/ask: dark blur-out). Footer = homepage mobile footer (390x1080).

**/shopping-agent @390** (document height 9871px)

| section | y | h | padding | gap | bg |
|---|---|---|---|---|---|
| Hero | 40 | 1243 | 96px 0px 0px | 0px | rgb(243, 240, 235) |
| Testimonials | 1283 | 931 | 56px 0px | 10px | - |
| Section title | 2213 | 290 | 56px 24px 0px | 16px | - |
| Scroll Area | 2504 | 2600 | 56px 24px | 40px | rgb(255, 255, 255) |
| Your team of expert agents | 5104 | 1644 | 56px 24px | 40px | rgb(250, 247, 241) |
| Content display (Timer) | 6747 | 1506 | 56px 24px | 40px | - |
| Main CTA | 8254 | 538 | 0 | - | - |
| Footer | 8791 | 1080 | 64px 32px | 16px | rgb(18, 32, 35) |

**/social-agent @390** (document height 16545px)

| section | y | h | padding | gap | bg |
|---|---|---|---|---|---|
| Hero | 40 | 1153 | 80px 24px | 10px | rgb(255, 255, 255) |
| Logos | 1193 | 94 | 0 | normal | - |
| Features | 1287 | 7733 | 56px 0px | 40px | - |
| Integrations | 9020 | 2491 | 56px 24px | 40px | rgb(250, 247, 241) |
| FAQ | 11511 | 1043 | 56px 24px | 40px | - |
| Integrations | 12554 | 1101 | 56px 24px | 40px | rgb(255, 255, 255) |
| Enterprise | 13655 | 1104 | 56px 24px | 100px | rgb(18, 32, 35) |
| Main CTA | 14759 | 706 | 0 | 10px | - |
| Footer | 15465 | 1080 | 64px 32px | 16px | rgb(18, 32, 35) |

**/ai-review-management @390** (document height 10121px)

| section | y | h | padding | gap | bg |
|---|---|---|---|---|---|
| Hero | 112 | 903 | 96px 24px 0px | 10px | rgb(255, 255, 255) |
| Logos | 1015 | 94 | 0 | normal | - |
| Features | 1109 | 3289 | 112px 0px 0px | 0px | - |
| Testimonials | 4399 | 867 | 0px 0px 32px | 40px | rgb(250, 247, 241) |
| Content display (Timer) | 5265 | 1349 | 56px 24px 0px | 40px | rgb(250, 247, 241) |
| Integrations | 6614 | 1842 | 80px 24px 56px | 40px | rgb(250, 247, 241) |
| Main CTA | 8456 | 586 | 0 | 10px | - |
| Footer | 9041 | 1080 | 64px 32px | 16px | rgb(18, 32, 35) |

**/qa-agent @390** (document height 11410px)

| section | y | h | padding | gap | bg |
|---|---|---|---|---|---|
| Hero | 40 | 873 | 96px 24px 0px | 10px | rgb(255, 255, 255) |
| Logos | 913 | 94 | 0 | normal | - |
| Complete Coverage | 1007 | 945 | 112px 24px 56px | 40px | rgb(250, 247, 241) |
| Testimonials | 1952 | 884 | 0 | 40px | rgb(250, 247, 241) |
| Leaderboard | 2836 | 1386 | 56px 24px | 40px | - |
| Siena Intelligence | 5416 | 1423 | 56px 24px | 40px | - |
| Automated Actions | 4222 | 1194 | 56px 24px | 40px | - |
| Before/With Siena | 6838 | 1038 | 56px 24px | 40px | - |
| Testimonials | 7877 | 930 | 0 | 40px | - |
| FAQ | 8807 | 937 | 56px 24px | 32px | - |
| Main CTA | 9744 | 586 | 0 | 10px | - |
| Footer | 10330 | 1080 | 64px 32px | 16px | rgb(18, 32, 35) |

**/topics-explorer @390** (document height 10328px)

| section | y | h | padding | gap | bg |
|---|---|---|---|---|---|
| Hero | 40 | 978 | 128px 24px 80px | 10px | rgb(255, 255, 255) |
| Logos | 1018 | 94 | 0 | normal | - |
| Features | 1112 | 1895 | 56px 0px 0px | 0px | - |
| Testimonials | 3007 | 839 | 0 | 40px | - |
| Ask Siena | 6445 | 1177 | 56px 24px | 40px | - |
| Alerts | 3846 | 1408 | 56px 24px | 40px | rgb(250, 247, 241) |
| Comparison | 5253 | 1192 | 56px 24px | 40px | - |
| FAQ | 7622 | 1040 | 56px 24px | 32px | - |
| Main CTA | 8662 | 586 | 0 | 10px | - |
| Footer | 9248 | 1080 | 64px 32px | 16px | rgb(18, 32, 35) |

**/ask-siena @390** (document height 15274px)

| section | y | h | padding | gap | bg |
|---|---|---|---|---|---|
| Hero | 40 | 906 | 120px 16px 96px | 10px | rgb(255, 255, 255) |
| Logos wrapper | 946 | 150 | 0 0 56px | 10px | - |
| Sticky chip nav (sticky top 88) | 1096 | 30 | 8px 16px | 8px | rgba(250,247,241,0.2) |
| Features A | 1126 | 3356 | 0 24px 56px | 0 | #fff |
| Features B | 4483 | 1898 | 56px 24px | 40px | rgb(250, 247, 241) |
| Key Capabilities | 6381 | 3131 | 56px 24px | 40px | rgb(255, 255, 255) |
| Playbooks | 9511 | 865 | 56px 24px | 40px | rgb(250, 247, 241) |
| Slack section | 10376 | 1294 | 56px 24px | 40px | rgb(250, 247, 241) |
| Integrations | 11670 | 1098 | 56px 24px | 40px | rgb(255, 255, 255) |
| Enterprise | 12768 | 840 | 56px 24px | 100px | rgb(18, 32, 35) |
| Main CTA | 13608 | 586 | — | 10px | dark blur-out 187px |
| Footer | 14194 | 1080 | 64px 32px | 16px | rgb(18, 32, 35) |

(On ask-siena mobile, the Slack/Integrations/Enterprise/CTA sections sit outside `[Main]` in the DOM; boxes above are measured.)

---

## 8. New reusable components introduced by these pages (build once, reuse)

| Component | Used on | Notes |
|---|---|---|
| ProductHeroSplit (copy left, visual right, white bg, padding 120 0 0) | social, reviews, qa, topics, ask-siena (shopping uses a beige variant with in-hero tickers) | max-width 1110/1200/1280 per page; H1 80/80 left; optional swash `MJbk4aQblPanJHyFV9X8Yg7JDqI.png` |
| LogosBlock (standalone full-bleed tickers + optional edge fades) | social, reviews, qa, topics, ask-siena | wraps existing `LogoTicker` (IDENTICAL rows/speeds) |
| SectionTitle (eyebrow + H2 + subtitle) | all | eyebrow sometimes `<strong>` 700 |
| StickyScrollShowcase (left blocks + sticky 512 card) | shopping (2 sticky columns), reviews, ask-siena | generalise homepage `ScrollArea`; trigger rule differs: homepage/reviews/shopping = 50% viewport, ask-siena = marker at viewport top |
| SectionPillNav (sticky anchor pill with sliding highlight) | social (6 links, resting→stuck variant), ask-siena (2 links) | highlight fill `#F7DD93`, ≈230ms |
| FeatureBlockCentered (H3 52/62.4 + text + visual card + star bullets) | social ×6 | reveals on enter |
| TimerFeatureList (3 items, 1px progress bars, ~9s auto-advance) | reviews | |
| ImageRevealPair + scroll-linked progress line | shopping §1.6 | |
| Bento grid (big cards + 3-col tiles) | social §2.4, reviews §3.6 | |
| Faq accordion | social, qa, topics | 100ms height/opacity; icons OKFNY/klSbqu PNGs |
| BeforeAfterCards | qa §4.8, topics §5.7 | |
| AskSienaMockup (question cards + answer composer) | qa §4.7, topics §5.5 | |
| HoverMediaCards (masked video / rotating icons on hover) | qa §4.6, topics §5.6 | |
| EnterpriseSafety (dark section + 4 white cards) | social §2.7, ask-siena §6.10 | |
| Carousel3Up crossfade | ask-siena playbooks §6.7 | same transition as homepage CustomerStories |

## 9. Things Playwright could not measure exactly (explicit)
- topics-explorer hero: WebGL `<canvas>` bubble animation (686x599, cursor-reactive) — internals not readable; approximate (see §5.1).
- Spring curves: Framer springs are reported as `{type:'spring', bounce, duration}` (exact config); CSS approximations are given where needed. rAF timings are measured with ±17ms frame resolution.
- `"Feature Deck"` and `"Tiempos Text"` (without "Regular"/"Web") font-family names are used in a few mock elements but never loaded → they render in the browser fallback; replicate by naming the same missing families (or plain `sans-serif` / `serif`).
- Hover states were measured only where listed (qa/topics cards, nav); no other hover changes were detected on cards/tiles of these pages.
