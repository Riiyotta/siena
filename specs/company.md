Source: https://www.siena.cx/ (routes: /about-us, /careers, /customers, /community, /events, /partner-with-siena, /refer-a-friend)

# Company / Resources / Partner pages — Clone Spec

Measured live 2026-10-22 with headless Chromium (Playwright via Node, own browser) at 1440x900 and 390x844. Raw dumps + screenshots: `/Users/riyaghosh/V3/siena/recon/company/<route>-1440.{json,png}` and `<route>-390.{json,png}`. Extraction scripts in the same folder (`extract.cjs`, `summ.cjs`).

Read `/Users/riyaghosh/V3/siena/CLONE_SPEC.md` §0 first — all tokens (ink `#122023`, hero-bg `#F3F0EB`, cream `#FAF7F1`, sand `#F4EDDE`, ink-2 `#2A3639`, rainbow hover gradient), fonts, breakpoints and the appear primitive apply unchanged. Text-style shorthands used below (all measured, identical across these pages):

| shorthand | desktop (>=810) | phone (<810) |
|---|---|---|
| **H1-hero** | Feature Deck Web Light 300, 80/80, ls −0.8px, `#122023` | 56/56, ls −0.56px |
| **H2-section** | Feature Deck Web Light (file is Light, weight 400), 64/64, ls −1.28px, `#122023` | 48/48, ls −0.96px |
| **Eyebrow** | Instrument Sans 600, 16/22.4, ls 1.7px, uppercase, `#122023` | 14/19.6 |
| **Sub-20** | Instrument Sans 500, 20/28, ls −0.2px, `#122023` | 16/22.4, ls −0.16px |
| **Body-serif** | Tiempos Text Regular 400, 18/23.4, ls −0.18px, `#2A3639` | 14/21, ls −0.14px |
| **H-card32** | Feature Deck Web Regular 400, 32/38.4, `#122023` | 28/33.6 |
| **H4-40** | Feature Deck Web Regular 400, 40/48, `#000000` | 24/28.8 |
| **Btn-xlg** | 58px tall, padding 18px 24px, radius 16, bg `#122023`, label Instrument Sans 600 18/21.6 white; hover = rainbow gradient (instant) | same |
| **Btn-secondary-md (icon)** | 46–48 x 48, padding 16, radius 12, bg `#FFFFFF`, **border 1px solid `#A7A092`** (inner `::after`), icon FA6 Brands 16px `#122023`; **hover bg `#122023`, icon `#F4F5F5`** (measured) | same |

Fonts: **no new font families** on any of these routes. Loaded set = Instrument Sans 400/500/600/700, Feature Deck Web Light / Light Italic / Regular, Tiempos Text Regular, Geist Mono, FA6 Sharp Light, FA6 Brands, Inter 400/600 (+ **Inter 700** on /customers — flag: homepage only loaded Inter 400/600; add 700 to the Google Fonts request if Inter is used). Some component text computes to the bare UA `sans-serif` (careers roles component, cookie banner) — noted where it applies.

Third-party: no iframes/embeds on any route. Scripts present on all: HubSpot tracking (`js.hs-scripts.com/24278528.js`, `hsadspixel`, `hs-banner`) — tracking only, NOT HubSpot forms; GTM `GTM-WXWNZFB`; CookieYes banner (see CLONE_SPEC §12). Forms on /community, /events, /partner-with-siena, /refer-a-friend are **native Framer forms** (`framer-form-*` classes, submit to Framer's form backend) — clone as static look-alike forms.

## Global: Nav / Footer on these routes

- **Footer: IDENTICAL** to `Footer` (CLONE_SPEC §10) on all 7 routes (same columns/links, SOC badge, socials).
- **Nav: IDENTICAL** `Nav` (desktop + mobile) on all routes, same links, with two differences:
  1. **/careers**: the nav CTA label is **"See open roles"** → `./careers#open-roles` (instead of "Book a demo" → `./book-a-demo`). Same md button styling (width grows to fit label). Make the Nav accept `ctaLabel`/`ctaHref` props.
  2. **/about-us**: the desktop nav renders in its **"On Scroll" state from scrollY 0** (pill bg `#FAF7F1` + the 6-layer shadow from §1) — it never shows the transparent top state on this page (the hero is a full-bleed photo). Prop e.g. `forceScrolled`.
  - All other routes: normal behaviour (transparent at top, cream+shadow after scrollY≈160). Mobile nav identical everywhere (bg `#F3F0EB`, 113px tall incl. banner with spinning star).

---

# /about-us

Doc height 1440: **11171** (Main 10737 + Footer 434). 390: **10952** (Main 9832 from y=40 + footer 1080). Screenshots: `recon/company/about-us-1440.png`, `about-us-390.png`, horizontal-scroll states `about-hscroll-0..3.png`, hero `about-hero-1440.png`.
Nav: forced "On Scroll" (cream+shadow) state at top — see Global. Section order: Hero → Horizontal "Scroll Container" → "Feedback" (Our team) → "Integrations" (Backed by great partners) → Main CTA (variant) → Footer.

## A1. Hero — NEW
- Section 1440x**900** (`min-height:100vh`), padding **200px 64px 160px**, flex column center/center, gap 40. Full-bleed background `<img>` `public/assets/mB1JO1ODJougkXIIQ3XCueDz4.png` (3168x1536 source; painterly illustration of a person holding a phone, pink/orange/blue), `object-fit:cover`, center. No bg color.
- Title wrapper max-width 1328 (1312 wide at 1440), H1 **"Our mission is to humanize the internet by turning customer interactions into meaningful relationships."** — H1-hero (Feature Deck Web Light 300 80/80 ls −0.8, `#122023`), **center**, 3 lines, 1312x240, top y=350.
- Motion: appear (id hlbtz5) on the H1 wrapper: opacity 0.001→1, y 200→0, tween 0.7s, delay **0.2s**, ease `cubic-bezier(0,0.91,0.14,0.85)` (= homepage hero H1 primitive).
- 390: section 390x**664**, padding **96px 24px 64px**, gap 24; H1 56/56 ls −0.56, center, 342x504 (9 lines); same image (cover).

## A2. Horizontal scroll story ("Scroll Container") — NEW
Scroll-jacked horizontal track inside a sticky viewport.
- Outer: 1440 x **7500** tall, bg `#F3F0EB`. Child "Sticky": `position:sticky; top:0`, height **100vh (900)**, overflow hidden. Inside "Content": padding **80px 0**, flex row center → track row (bg `#F3F0EB`, flex row, align center, gap 0, height **740**, total width **5321px**).
- **Scroll mapping (measured):** `translateX = -(5321 - 1440) * p` where `p = clamp((scrollY - sectionTop) / (7500 - 900), 0, 1)` → 0 at scrollY 900, −3881 at scrollY 7500 (measured −3896 at end; linear in between: e.g. scroll 4200 → −1971). The value is **smoothed** (Framer useSpring-like): after a 6600px jump the track took ≈**550ms** to settle (−3907 → −598 in 11 frames of 50ms, decelerating). Implement with rAF lerp (factor ≈0.15/frame) or framer-motion `useScroll` + `useTransform` + `useSpring({stiffness:~120, damping:~30})`.
- Panels (x positions relative to the track's left edge at translateX 0; y relative to track top; all `overflow:hidden` except where noted; panels' padding listed T R B L):
  1. **Panel 1** — 1300x740, padding `180 160 160`, flex row, justify center, align flex-start, **gap 100**.
     - Background illustration (absolute, behind text): `q9j2kFCtrxbrzN8czFKBjCoSXE.webp` (977x936; woman with phone, soft gradient), box **x133 y140, 835x800**, `object-fit:cover` (overflows panel bottom; clipped by sticky).
     - Left "Title" (440 wide, max 584, gap 24): eyebrow **"How it all started."** (Eyebrow style, renders uppercase); H2 **"Envisioning a new way of doing customer experience"** (H2-section, left, 440x256, 4 lines).
     - Right paragraph block (440 wide, flex row gap 10): 18x24 icon cell (padding-top 4) with **FA6 Sharp Light U+E5D6** (4-point sparkle outline) 20px/20px `#122023`; text (413 wide, max 564) Sub-20 left: "We spent over a decade as Shopify merchants scaling ecommerce brands. We experienced first-hand how customer support tools often fell short—automation without real solutions, personalization, or insights. That's why we built Siena."
  2. **Connector** — 205 wide, padding `180 0 160`, flex column center: decorative curved arrow SVG **205x87** `public/svg/about-us-flow.svg` (stroke `#302E2A` arrowhead + gradient stroke line).
  3. **Panel 2** — 824 wide, padding `180 120 160`, flex column center, gap 40: image `4D1FYqC4H5M623F6yNo4c5T97E.webp` **326x300** (cover; top at y154) then paragraph row (584 wide; same sparkle icon + Sub-20): "Siena joins your team by integrating seamlessly with your help desk and commerce stack. It provides fully autonomous, end-to-end customer resolutions while staying true to your brand DNA."
  4. **Panel 3** — 824 wide, padding `180 120 160`, gap 40: image `h77L5rBDotNuRWvoKxflPm6HPjA.webp` **584x327** (cover; man on phone at desk, rounded corners are baked in the image) then paragraph (584x168): "At Siena’s core is our agentic brand intelligence layer that captures and understands customer interactions deeply, enabling deep personalization and actionable business insights. Siena continuously learns from your best interactions, knowledge sources, guidance, and team expertise, becoming smarter every day."
  5. **Panel 4** — 1034 wide, padding `180 200 160 250`, NOT overflow-hidden: background blob image `InMGs95DivVaUgENQYUbUNkoac.webp` absolutely at **x−244 (rel. panel) y−15, 1522x755**, cover (soft pink/yellow/blue gradient glow); over it H4 (564 wide, max 564): **"Today, Siena powers hundreds of millions of conversations for brands and handles up to 80% of interactions while maintaining an average CSAT of 4.81."** — H4-40 (Feature Deck Web Regular 40/48, `#000`), left, 5 lines.
  6. **Panel 5** — 1134 wide, padding `180 50 160 500`: image `9pqSQiEhJEHLD5Wei9aJDEo2BgA.webp` absolutely at **x−232 y59, 636x681** (man in dark sweater, overlapping into panel 4), and paragraph (584 wide, at x500 y324): "Our mission is to humanize the internet by turning customer interactions into meaningful relationships. Siena is your partner for commerce growth, exceptional CX, and lasting brand loyalty."
- No other animation inside panels (no fades).
- **390:** container **6000** tall, sticky 100vh (844), Content padding **56px 0**, track height 732, total width **2344** → translateX 0 → −1954 over scrollY 704→5860 (same smoothing). Panels: P1 391 wide (max 809) padding `140 24 330`, flex column, gap 64: eyebrow 14/19.6, H2 48/48 (343x192), paragraph row 343 wide (Sub-20 phone = 16/22.4 ls −0.16); bg illustration 575x551 at x−92 y244. Connector 253 wide padding `0 24`. P2 423 wide padding `0 50`: image 323x297, text 323 wide. P3 429 wide padding `0 40`: image 349x196, text 349. P4 421 wide padding `0 40`: H4 **24/28.8**, 341 wide; blob 909x451 at x−244 y281. P5 427 wide padding `0 40 210`: text 347 wide at top (y205), image 368x394 below/behind (x20 y338).

## A3. "Our team" (Feedback) — NEW
- Section bg `#FFFFFF`, padding **80px 96px**, flex **row** center/center, **gap 120**, overflow hidden; 1440x947.
- Left column 564 wide (max 648), flex column, align start, **gap 48**:
  - Title (gap 24): eyebrow **"Our team"**; H2 **"Creators and doers"** (H2-section, left, 1 line).
  - Paragraph stack (Body-serif 18/23.4 ls −0.18 `#2A3639`; paragraphs separated by ~20px — Framer rich-text paragraph spacing; measured p tops 8696/8786/8900/8990/9080 with heights 70/94/70/70/23 → **20px gap**):
    1. "Hey, we're Siena—a globally distributed team driven by endless curiosity and creativity. We're on a mission to redefine what customer experience means for brands."
    2. "Here, everyone owns their impact. We trust each other to jump into action, solve tough problems, and push ideas forward. We blend speed and craftsmanship, balancing the big picture with the tiny details."
    3. "Relationships mean everything to us, we're honest, open, and direct with each other, building genuine connections that help us do our best work."
    4. "At Siena, you're not just joining a team, you're becoming part of a group of co-creators who celebrate ownership, customer empathy, and care deeply about making an impact."
    5. "We're growing fast. We'd love to meet you."
  - Button Btn-xlg **"We’re hiring"** → `./careers` (150x58), 48px below paragraphs (y 9152).
- Right column 564 wide (max 648), flex column center, gap 24:
  - Portrait `oVfH5UrvznJiBjQEiKKMl1FDx4.png` (1024x1536; the two co-founders) **564x715**, radius **24px**, cover.
  - Row 564x48, space-between: two founder groups (flex row, gap 12): name `<strong>` Instrument Sans **700 20/28 ls −0.2** `#122023` + socials (gap 8) = two Btn-secondary-md (LinkedIn FA U+F0E1 46x48, X FA U+E61B 48x48).
    - "Lisa Popovici" → https://www.linkedin.com/in/lisapopovici/ , https://x.com/lisapopovici
    - "Andrei Negrau" → https://www.linkedin.com/in/negrau , https://x.com/andreinegrau
- Hover: "We’re hiring" → rainbow gradient; social buttons → bg `#122023`, icon `#F4F5F5`.
- **390:** 390x1435, padding **56px 24px**, flex **column** gap 32, and the **image column comes FIRST** (y 6760) then text (y 7361). Portrait 342x433 radius 24; founders stacked vertically (gap 16), each row 342x48 space-between, name 700 **16/22.4 ls −0.16**. Text: eyebrow 14/19.6, H2 48/48, body 14/21 ls −0.14 (paragraph gap 18px), button 150x58.

## A4. "Backed by great partners" (investors grid) — VARIANT of `Integrations`
Diffs vs homepage Integrations (§8):
- Section bg **`#FFFFFF`** (not cream), with a **1px top border `rgba(0,0,0,0.2)`** (Framer `::after`, width 1px 0 0 0), padding 80px 96px, gap **72**, 1440x700.
- Title **centered** (wrapper ai:center, gap 24), H2 "Backed by *great* partners" — `great` is `<em>` in Feature Deck Web Light Italic (same 64/64 ls −1.28); 633x64 one line.
- Grid **1248 wide** (max 1328): `grid-template-columns: repeat(4, 309px)`, rows **200px**, gap **4px** (1248x404). Tiles identical to Integrations tiles (bg `#F3F0EB`, radius 4, padding `72px 0`, flex column center). **No CTA button.**
- Logos (img, `object-fit:cover` at the given render size; no filter):
  | # | name | file | render |
  |---|---|---|---|
  | 1 | York IE | `ZgEKUQgxEWIsoQLgJ2nx9e6leQ.svg` | 184x24 |
  | 2 | Sierra Ventures | `girTZkXE69Eq8siqGKJFsdTtaOA.svg` | 125x33 |
  | 3 | Aglaé Ventures | `oNvYI9NSJlbETUTOH5bQPczJeVQ.svg` | 207x38 |
  | 4 | The Council | `vB2kUPz76loqoi2c3AunCMGNw.svg` | 117x33 |
  | 5 | Joyance | `BCooYvzI7OtNc1Vw5sjVBJkbBvs.svg` | 55x56 |
  | 6 | Village Global | `6BU8x1yoHD2GBBk0h7kePpSYI.svg` | 139x33 |
  | 7 | Spacestation Investments | `HfcivWOr23iKQ6U0lrIrWF4yuOA.svg` | 139x33 |
  | 8 | SuperAngel.Fund | `pndXbr7xMtpLa5GqWdWbQdcG8.svg` | 200x26 |
- **390:** padding 56px 24px, gap 32; title gap 16, H2 48/48 (2 lines, left-aligned text inside centered box 342 wide); grid **2 columns 169px**, rows **196px**, gap 4 (342x795); tiles padding **14px** (York IE & Joyance tiles keep `72px 0`); logos max-width 100% → York 104x14, Sierra 121x32, Aglaé 136x25, Council 113x32, Joyance 51x52, Village 131x31, Spacestation 122x29, SuperAngel 123x16.

## A5. Main CTA — VARIANT of `MainCta`
- Heading **"Brands that win on CX run on Siena"** (1 line at 1440 → card **1062x291**, section height **691** instead of 755). Button "Book a demo" Btn-xlg → `./book-a-demo`. Same bg image `ERYNplIY591uk80wpoa4JGglO8.webp`, padding 200px 96px, card bg `#F3F0EB` radius 48 padding 64, inner gap 41.
- **No "Blur out" top fade** on this page (none measured; previous section is white).
- 390 ("Phone" variant): section 390x**698**, padding **200px 24px**; card 342 wide, **padding 32, radius 32**; inner gap 32; H2 48/48 center 278x144 (3 lines); button 157x58.

---

# /careers

Doc height 1440: **4852** (Main 3663 + Main CTA 755 + Footer 434). 390: **7829** (Main 6027 from y=40, CTA 682, footer 1080). Screenshots `careers-1440.png`, `careers-390.png`, `careers-roles-open.png`.
Nav: CTA reads **"See open roles"** → `./careers#open-roles` (see Global). Section order: Hero → "Creators and doers" (Metrics variant) → "Why people build here" → "How we work" → "Open roles" (Ashby list) → Main CTA (variant) → Footer.

## C1. Hero — NEW (structure like homepage hero minus images/tickers)
- Section 1440x**566**, bg `#F3F0EB`, padding **160px 96px 80px**, flex column, justify flex-start, align center, gap 48, overflow hidden.
- "Header Content" max-width **1200**, flex column center, gap 56 → "Header Copy" flex column center, **gap 40**:
  - H1 (two `<strong>` lines, wrapper gap 5): **"Come and build"** / **"The Agent of Record for CX"** — Feature Deck Web Light **400** 80/80 ls −0.8 `#122023` center (1200x160).
  - Sub **"Join a team of builders defining a category for consumer brands."** Sub-20 center (1 line).
  - Btn-xlg **"See open roles"** → `./careers#open-roles` (172x58).
- Motion: none on hero text (no appear ids on hero).
- **390:** 390x582, padding **128px 24px 80px**; copy gap 24; H1 56/56 ls −0.56 center (4 lines, 342x224); sub 16/22.4 center; button 172x58.

## C2. "Creators and doers" founders letter — VARIANT of `Metrics` (§5) shell
Same shell as homepage Metrics: section padding 80px 96px, full-bleed bg image `5VTp1YGCJLYo9Grib0Ouvyooeag.webp` (cover), card ("Title") bg `#F3F0EB`, radius 48, padding 64, max-width 1328 (1248x707), and bottom "Blur out" (`linear-gradient(0deg, #FAF7F1 0%, rgba(250,247,241,0) 100%)`, 187 tall, at bottom).
Diffs:
- **Extra top "Blur out"**: absolute top −4px, height 187, `linear-gradient(180deg, #F3F0EB 0%, rgba(250,247,241,0) 100%)` (blends from the beige hero).
- Card content: flex row, align start, **gap 64** (1120x579):
  - Left (528 wide), column gap 40: H2 **"Creators and doers"** (H2-section left); then text group (gap 24): three Sub-20 paragraphs (gap 20 between paragraphs):
    1. "Consumer brands run ten or more disconnected tools to manage their customers. We collapse that stack into one agent. Support first, then shopping, then social, then everywhere else a customer turns up."
    2. "Hundreds of brands already run real customer volume on Siena in production. What you build here reaches their customers the same week. The system is live, people depend on it, and it is nowhere near finished."
    3. "We are small, distributed and fast on purpose, and that only holds while everyone here owns a real outcome. If you want a defined lane and a roadmap handed to you, we will frustrate you. If you would rather take a problem nobody has solved yet and carry it all the way to the end, we should talk."
    - Signature **"Lisa and Andrei, co-founders"** — Instrument Sans 400 16/19.2 ls −0.16 `#122023`.
  - Right: photo card 528x480, radius **32**, overflow hidden: `jI4UkRHradpPJjCWsLuzyY5YOo.png` (1448x1086, founders with award) cover.
- Motion: the photo card has appear id 1golsxi: **opacity 0.001→1 only (no translate), tween 0.4s, delay 0, ease `cubic-bezier(0.94,0,0,1)`** — on page load (it's an "appear", fires on load, not on scroll).
- **390:** section padding **56px 24px**, card 342x1048, **padding 32**, radius 48; content stacked column gap 48; H2 48/48; paragraphs 16/22.4 (gap 20); photo 278x224 radius 32. Blur outs same 187px.

## C3. "Why people build here" — NEW
- Section bg **`#FAF7F1`**, padding 80px 96px, gap 72, 1440x812. Inner max-width 1200, flex column, align flex-end, **gap 64**, overflow clip.
- H2 **"Why people build here"** (H2-section, left, full width).
- Grid: `repeat(4, 276px)`, **gap 32px**, 1 row (1200x524). Card = flex column, align start, **gap 16**:
  - Photo 276x**240**, radius **32**, cover.
  - Name H5 — H-card32 (Feature Deck Web Regular 32/38.4 `#122023`).
  - Role + location (wrapper opacity **0.6**): two lines Inter 400 14/21 `#122023`.
  - Quote: Tiempos Text Regular 400 **20/26** ls normal `#122023` (276x156, 6 lines).
  | Name | Role | Location | Photo | Quote |
  |---|---|---|---|---|
  | Lou | Agent Engineer | Hamilton, New Zealand | `o84NVbyg8gAhzNm6NDtMG6x5Q.jpg` (400²) | "I've always been curious about the technicalities of how Siena functions. That, plus helping customers unblock things, brought me to the CX team." |
  | Patricio | Forward Deployed PM | Cordoba, Argentina | `zYwHClH3RO5UitAIAL93OiJ1FaA.jpeg` (800²) | "AI-first at Siena is something you see every day. It shows up in how non-technical teams instinctively reach for AI reasoning before anything else." |
  | Promise | Forward Deployed Engineer | Nairobi, Kenya | `XZGutyEyYkQeF3RlZFORVhgbnKo.png` (800²) | "Siena gave me the opportunity to be a pioneer, an early member of something big. Nowhere else put me on that edge and trusted me to deliver." |
  | Carla | Deployment Manager | Buenos Aires, Argentina | `x7ul8NZAdgrmZhdlSEGqo4TvrsQ.png` (439x449) | "What stands out is how much thought goes into everything, from the product to our customers, all within a genuinely kind and collaborative culture." |
- Bottom "Blur out": absolute at section bottom −19px (y 2226, overlapping next section), 187 tall, `linear-gradient(180deg, #FAF7F1 0%, rgba(250,247,241,0) 100%)` — fades the cream into the white "How we work".
- **390:** padding 56px 24px, gap 40, inner max-width 512 gap 40; H2 48/48 (2 lines); cards stacked column **gap 32**, each 342 wide: photo 342x240 r32 (Carla `object-position: 50% 0%`), name **28/33.6**, role 14/21, quote Tiempos **16/20.8**.

## C4. "How we work" — NEW
- Section bg `#FFFFFF`, padding 80px 96px, gap 72, 1440x706. H2 **"How we work"** (H2-section, left, max-width 1200).
- Grid max-width 1200: `repeat(3, 378.66px)`, **row-gap 64, column-gap 32**, 2 rows of 173. Item: padding-top **32**, flex column, align start, gap 16, max-width 416, **border-top 1px solid rgba(0,0,0,0.2)** (Framer draws it via `[data-border]::after`, width `1px 0 0 0`).
  - Icon 24x24: FA6 Sharp Light 24px/24px `#122023`, center.
  - Title: H-card32 (32/38.4), left.
  - Body: Body-serif 18/23.4 ls −0.18 **`#122023` at opacity 0.8**.
  | icon | title | body |
  |---|---|---|
  | U+F57D (globe) | Truly remote global team | Work from wherever you do your best work. Every timezone counts the same. |
  | U+E1EC (microchip) | AI-fluent by default | Your own stack of agents, on accounts we pay for, plus a quarterly budget for what’s next. |
  | U+F1D8 (paper-plane) | Freedom to act | Everyone has a voice and impact across the whole company. |
  | U+F5D2 (atom) | From first principles | There’s no playbook for what we’re building, so we reason it out from scratch. |
  | U+F024 (flag) | Extreme ownership | You own the outcome, not the task. If it’s yours, you carry it all the way to the end. |
  | U+F0E7 (bolt) | We move fast | What you build reaches customers the same week, not the same quarter. |
- **390:** padding **56px 0** (inner wrappers padding 0 24), gap 40; H2 48/48; items single column gap 32 (342x164 each); title 28/33.6; body 14/21 ls −0.14.

## C5. "Explore our open roles" (id `open-roles`) — NEW, Ashby-backed code component
- **Source:** custom Framer code component that `fetch`es `https://api.ashbyhq.com/posting-api/job-board/siena?includeCompensation=true` (2 attempts). On the live site this request is **blocked by CORS** (console: "[roles] live fetch failed (attempt 1/2)") so every visitor sees the **built-in fallback list** plus the notice below. Clone it as a static list (exact fallback data below). Job links open `https://jobs.ashbyhq.com/siena/<id>` in a new tab.
- Section 1440x712, padding 80px 96px; component max-width 1200, centered, text color `#122023`.
  - Header row: flex, `align-items: baseline`, space-between, gap 12, padding-right 32, margin-bottom 8:
    - H2 **"Explore our open roles"** — **Feature Deck Web Regular 400** (not Light) 64px, line-height 1em, ls −0.02em (−1.28px).
    - Total count pill **"13"**: min-width 26, height 26, padding 0 8, radius 999, bg `#F3F0EB`, color `#71797B`, font-size 13px (font-family falls back to UA sans-serif — use Instrument Sans 13px for a near match), `display:grid; place-items:center`.
  - Status note (`role="status"`), margin-top 16: "We couldn’t reach our job board, so this list may be out of date. " + link "See all current roles on Ashby" → https://jobs.ashbyhq.com/siena (underlined, `#122023`). 14px / 1.5, color `#71797B` (UA sans-serif).
  - List, margin-top **48**. Each department = `div` with `border-top:1px solid rgba(0,0,0,0.2)` (no bottom border after the last one):
    - Toggle `<button aria-expanded>` full width, flex align center, gap 12, padding **20px 4px**, transparent; `transition: background 150ms`; **hover bg `#FAF7F1`** (measured). Label Instrument Sans 500 **20px / 1.2em**, flex 1; count pill (same as above); chevron SVG 16x16 (`<path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>`, color `#71797B`), `transition: transform 200ms`, **rotate(180deg) when open**.
    - Panel: `height 0 → auto` with `overflow:hidden; transition: height 240ms` (measured 190→211 px heights over 2 frames — default ease). **Only one department open at a time** (opening one closes the others). All closed on load.
    - Role row `<a target=_blank>`: flex, `align-items: baseline`, gap 16, padding **14px 4px**, `border-bottom:1px solid rgba(0,0,0,0.2)` (none on the last role in a department), `transition: background 150ms` (no visible hover change measured). Title Instrument Sans **400 16px / 1.2em** flex 1; location 13px `#71797B` (UA sans-serif), right-aligned by flex.
  - Data (department · count → roles):
    - **Engineering · 3**: Engineering Manager, Channels & Platform — Remote - Europe (`d978919a-c34f-4465-96f2-66b8277df894`); Senior Fullstack Engineer — Argentina (`91e5e63a-7b02-4176-8b8f-0747042d756f`); Software Engineer, Platform Experience — Argentina (`9b020e8d-d953-4e52-b13e-f20397cc9199`)
    - **Product · 2**: Product Manager, Agent Platform — London (`aa0c3428-680c-4e89-9bbd-ec6330272c20`); Product Specialist — Remote - Europe (`1216b030-76e0-443e-a7a7-7e826d3b3960`)
    - **GTM · 2**: Head of Product Education & Community — Toronto (`f73532d2-5adf-4e81-8644-4c850ff808df`); Senior Solutions Engineer — Austin (`c5430e14-d8bd-4e9a-b36e-4648306dad54`)
    - **Account Management · 3**: Director, Strategic Accounts — New York (`4c2561b7-4dd6-40ba-8fca-6452df7d5a9a`); Strategic Account Manager — New York (`6335ebaf-54e2-49ae-bc50-4a686de55d9e`); Strategic Account Manager - London — London (`d593e639-c56e-49d8-937d-29da7dc88a2f`)
    - **Operations · 1**: Senior Talent Partner (FTC) — London (`ff35146a-5d1c-4da9-8c3f-b32bdfaa41d2`)
    - **Marketing · 2**: Founding Content Strategist — United Kingdom (`0ac30866-9135-4313-a5b0-54bbc87ccef8`); Founding Creative Director — London (`29c3eb4b-e0cd-4f42-9d17-959c69bebca4`)
  - Measured heights: closed list section 712; dept row 67 (66 button + 1 border); role row 48 (47 for last).
- **390:** section padding **56px 24px**, gap 32; H2 stays **64px** (component isn't responsive) → wraps to 3 lines (268x192) with pill to its right; note wraps to 2 lines; rows 342 wide, same paddings.

## C6. Main CTA — VARIANT of `MainCta`
- Name "Desktop Careers". Heading **"Don't see your role? Tell us what you'd own and why it matters."** (2 lines, 934x128); button Btn-xlg **"Email us"** → `mailto:careers@siena.cx` (118x58). Section 1440x755 (same as homepage).
- Top "Blur out" gradient starts from **white**: `linear-gradient(180deg, #FFFFFF 0%, rgba(250,247,241,0) 100%)`, 187 tall at top (homepage starts from `#FAF7F1`).
- **390 ("Phone Careers"):** 390x**682**, padding **120px 32px**; card 326 wide, padding 32, radius 32; H2 48/48 center (6 lines, 262x288); button 118x58.

---

# /customers

Doc height 1440: **4786** (hero+grid "Content" 3661 incl. wall, Main CTA 691, footer 434). 390: **11494**. Screenshots `customers-1440.png`, `customers-390.png`. Nav: identical (normal transparent→cream behaviour). Page root bg `#FFFFFF`. Order: Hero title → Filter + story grid + Load more → "Love around the world" wall → Main CTA (variant) → Footer.

## U1. Hero title — NEW
- Wrapper "Content": padding-top **180** (390: **96**), flex column center. Title block padding `0 96px` (390: `0 24px`), max-width 1062, flex column center, gap 40.
- H1 **"Discover the *Magic* of Siena"** — H1-hero 80/80 ls −0.8 center; "Magic" is `<em>` Feature Deck Web Light **Italic** 300 (same size). 1 line at 1440 (1062x80); 390: 56/56, 2 lines (342x112).
- Hand-drawn rainbow underline `public/assets/MJbk4aQblPanJHyFV9X8Yg7JDqI.png` (241x18) under "Magic": absolutely positioned, **241x18 at 1440** (390: **119x9**), its left edge at 50% of the title + `translateX(-50%)` → centered at x≈783 (under the word, slightly right of centre; top = H1 top + 92px; 390: top +124, centered x≈195).
- Sub (max-width 564, **opacity 0.82**): "Dive into our customer stories to unveil how Siena has played a pivotal role in reshaping their customer experience." Sub-20 center (2 lines). Gap H1-group → sub 40 (390: 24-ish; measured sub top 288 vs underline 260).
- Motion (appear, on load): H1 wrapper y200→0 / opacity, 0.7s delay **0.2** ease (0,0.91,0.14,0.85); underline ("Vector 77") delay **0.3** ease (0,0.91,0.78,1); sub delay **0.3** ease (0,0.91,0.78,1). Same at all breakpoints.

## U2. Story grid with filter + Load more — NEW (Framer CMS collection; static data in clone)
- Section: padding **80px 96px 120px** (390: `64px 24px 80px`), flex column center, gap 40. "Grid" max-width **1220** (x 110–1330), flex column, gap 40.
- **Filter row** (1220x49): flex row align center gap 16:
  - "Filter by:" — `<strong>` **Inter 700 20/26** `#122023`, wrapper opacity 0.88.
  - Chip bar 1118x49 (flex row): radius 16, **border 1px solid rgba(0,0,0,0.2)** (Framer ::after), overflow hidden. Chips contiguous (no gap), each padding **16px**, height 49, Instrument Sans 400 **14/16.8** center, `cursor:pointer`, `transition: all` (Framer default ~0.2s): **active** bg `#122023` text `#F4F5F5`; **rest** bg `#FFFFFF` text `#122023`; **hover** bg **`#EFE5D0`**. Thin vertical separators between chips are visible in the screenshot but were not measurable as borders (draw `border-right:1px solid rgba(0,0,0,0.2)` on each chip if needed for the look).
  - Chips (widths): All 49, Beauty 77, Fashion 82, Food & Beverage 142, Health & Nutrition 148, Home Goods 116, Lifestyle 86, Electronics 104, Gifting & Consumer Goods 206, Pets 60. Default active = **All**.
  - Filtering (measured counts): Beauty 7, Fashion 6, Food & Beverage 3, Health & Nutrition 9, Home Goods 6, Lifestyle 3, Electronics 1, Gifting & Consumer Goods 1, Pets 1. When a category is active **all its matches show and "Load more" is hidden**; "All" shows the first 20 + Load more. Grid swaps instantly (no animation measured).
  - **390:** chip bar replaced by a native `<select>` (257x40, inside the same 1px rgba(0,0,0,.2) radius-16 frame; select styles: Inter 400 14/19.6, padding `10px 38px 10px 16px`, radius 8, UA bg; custom 12x12 chevron at right 16px). "Filter by:" Inter 700 **16/20.8**. Options = same categories (first = All).
- **Cards grid:** `grid-template-columns: repeat(4, 293px)`, **gap 16**, rows 396 (1220 wide). 390: single column 342 wide, **gap 10**.
  - Card `<a>` 293x**396**: padding **2px**, radius **24**, bg `#F4EDDE` (this 2px ring is the "border"); inner panel bg **`#F3F0EB`**, radius **23**, flex column.
    - Logo area 289x**185**, padding **49**, flex center: logo box **122x102**, radius 8, `object-fit: contain`.
    - Body: padding `0 24px 24px`, flex column, gap 24: 1px divider (241 wide, bg rgba(0,0,0,0.2)); then (gap 16) tag pills row (gap 9) + title.
      - Tag pill: padding **4px 14px**, radius 50, border 1px solid **`#CDBCA0`**, text Geist Mono 400 **10/14** ls 0.5 uppercase `#605C53`.
      - Title (`h2`): Tiempos Text Regular 400 **18/23.4** ls −0.18 `#2A3639`, left.
  - **Hover:** ring bg changes from `#F4EDDE` to a vertical rainbow `linear-gradient(180deg, #F2E59A 0%, #FEC796 11.71%, #FB5646 26.58%, #827ACC 52.25%, #2E79D8 76.58%, #2E79D8 100%)`; Framer interpolates the stops over ≈**150ms** (gradient stops measured moving 15%→11.7% across 3 frames). No transform/scale, logo static.
  - 390 card 342x396 (inner 338 wide), same internals.
- **"Load more"** button (centered, 127x52): padding 18px 24px, radius **10**, bg `#122023`, label Instrument Sans **500 16/16** white. Click → appends the next 16 (20 → **36**, then the button disappears). No hover change measured.
- Cards (order as rendered with "All"; files in `public/assets/`):
  | # | href | logo (natural) | tags | title |
  |---|---|---|---|---|
  | 1 | `./customer-stories/eskiin-social-media-customer-service-response-time` | `yPdio6eYzQ3Z8vtPBceOs019M.png` (379x121) | Beauty | How Eskiin Answers Every Social Comment in Under a Minute and Got Three Days a Week Back |
  | 2 | `./customer-stories/thrive-causemetics-turned-customer-service-into-a-company-wide-intelligence-system` | `RVpmLl4ENxYALH5arYvLOF2hUY.svg` (300x137) | Beauty | How Thrive Causemetics Turned Customer Service Into a Company-Wide Intelligence System |
  | 3 | `./customer-stories/spanx-turned-cx-business-driver-brand-experience` | `k1nvbViWWUDVEBy2xaOAlUgRSq0.png` (122x22) | Fashion/Lifestyle | How Spanx Turned CX Into a Business Driver and Cut Handle Time in Half |
  | 4 | `./customer-stories/siena-ai-customer-service-automation-coterie` | `CzG1z9NEKoxzFuwvHCh0Lfb0.png` (122x25) | Lifestyle | Coterie Turns CX into a Revenue Engine with 65% AI Automation |
  | 5 | `./customer-stories/dossier-handled-black-friday-customer-service-zero-panic` | `LSDtiaYEMw66OjmYASlgwlerh24.svg` (108x22) | Beauty | How Dossier Scaled International Growth with AI Agents and Zero Black Friday Panic |
  | 6 | `./customer-stories/earth-breeze-scaling-customer-service-with-ai` | `j9kAeRPVaxAXfulnduynsbiTc.svg` (151x116) | Home Goods | From AI Skeptic To Advocate: How Earth Breeze Scaled Customer Support Without Losing The Human Touch |
  | 7 | `./customer-stories/hexclad-customer-service-automation` | `DysnuY3oWCVroJab1Mx73kkVg4.svg` (134x24) | Home Goods | HexClad Boosts CX Efficiency 65% with Customer Service Automation |
  | 8 | `./customer-stories/true-sea-moss-response-time-improvement` | `zy9mRkyxKisAjEUf8L7kCRTiI.png` (122x20) | Health & Nutrition | True Sea Moss: Achieving 80% Automation and Unlocking a New Product Line with Siena AI |
  | 9 | `./customer-stories/comfrt-ai-customer-support-siena` | `cS9mAOIRGNEPFez1Fy9VQGafsQ.png` (122x31) | Fashion | How Comfrt Achieved 65% Automation During Explosive Growth |
  | 10 | `./customer-stories/ehplabs` | `NzrOnMRFggp1QzWUKXstLpP2yVI.png` (122x122) | Health & Nutrition | How EHPLabs handles 42% more tickets with smarter efficiency and an empowered team |
  | 11 | `./customer-stories/fresh-clean-threads-csat-boost` | `viVxpvqRgp5ynnq499GrMlfB0Ac.svg` (241x24) | Fashion | Fresh Clean Threads Achieves 91% CSAT While Automating Tier 1 CX with Siena |
  | 12 | `./customer-stories/simple-modern` | `qpbEcjUraVURA3hGESyeVuyZZN4.svg` (112x40) | Home Goods | How Siena helped Simple Modern achieve a 98% customer satisfaction rating |
  | 13 | `./customer-stories/everday-dose` | `RQ1zB2lwHhPRGxGNWzIqaXLRRw.png` (295x145) | Health & Nutrition | Everyday Dose automates over 70% of shopper inquiries with Siena |
  | 14 | `./customer-stories/kitsch` | `NMMaJ8ZBHflI2DXZDaM4Bu6mY4.png` (122x24) | Beauty | How Kitsch automates over 68% of their customer support using Siena |
  | 15 | `./customer-stories/mud-wtr` | `xm8gLEJzeS3t0TXpRyH46PEmocg.png` (122x22) | Health & Nutrition | How MUD\WTR Brewed Up a 4.8 CSAT Score with Siena AI |
  | 16 | `./customer-stories/momentous-using-ai-customer-service-agent` | `laiTWK4LZfsnrVZHxmAiKK22g.svg` (394x209) | Health & Nutrition | How Momentous Achieved 100% Customer Satisfaction with Siena |
  | 17 | `./customer-stories/prose` | `SpxY1h6sqe6POaCpvGhqSGbxc.svg` (315x98) | Beauty | Prose's Perfect Formula: Personalized Beauty Products and AI-Powered Empathic Support |
  | 18 | `./customer-stories/terra-kaffe` | `FAmVCc3xLG8QUhmtyJ3WkBGEeU.png` (122x26) | Home Goods | How Siena helps Terra Kaffe expand CX capacity, improve CX metrics, save over $3,000 per month |
  | 19 | `./customer-stories/goody-faster-customer-service-response` | `vUaEZH5f85oxkdxCFmiAd8P8ZA.svg` (151x44) | Gifting & Consumer Goods | How Goody Handled 3x More Conversations While Improving Quality |
  | 20 | `./customer-stories/canopy` | `0JjqGImv5R5jQ7d8QYGXAnUOVA.png` (122x35) | Home Goods | How Siena helps Canopy match CX capacity to seasonal demand by automating over 36% of support requests |
  | 21 | `./customer-stories/loftie` | `gO3x6192WCKAtB65XMiG41bNJo.png` (122x36) | Electronics | How Loftie uses Siena to automate 60% of tickets and hit a 5-star support rating |
  | 22 | `./customer-stories/equip-foods-scaling-personalized-customer-service` | `wGvfbDAuOljwg1KwnrMA6NSIEMU.png` (122x36) | Health & Nutrition | How Equip Foods Scaled Personalized CX with Siena and Open Late Collective |
  | 23 | `./customer-stories/western-rise-ai-customer-service-response-time` | `83EJKkIYvJ792qe3DYfFh9yVwo.svg` (123x17) | Fashion | 36 Seconds to Success: How Western Rise Used AI to Transform Team Potential |
  | 24 | `./customer-stories/bad-birdie-customer-service-automation` | `yTIExcu9M9XJvL1ACN3rBAIpQeQ.png` (300x84) | Lifestyle | Bad Birdie: Reaching 80% Automation with Siena AI in One Month |
  | 25 | `./customer-stories/aday-scaling-customer-service-with-ai` | `R32uxsvtKZBcoEVJ192BcjdXKz4.png` (122x74) | Fashion | From Skeptic to Advocate: How Aday Embraced AI to Scale Personal Customer Service |
  | 26 | `./customer-stories/fum-scales-support-while-maintaining-human-connection` | `yuv1GyrW4x3RoV3tbjTOrNLxyw.png` (122x76) | Health & Nutrition | Building Connections at Scale: How FÜM Enhanced Customer Support with Siena |
  | 27 | `./customer-stories/fuel-meals` | `QneJbjbwOfyuvvba5LoTd515i0.svg` (148x60) | Health & Nutrition | How Fuel Meals Transformed CX from Cost Center to Revenue Driver |
  | 28 | `./customer-stories/subtl-beauty` | `Pq81mgBAh3wCteDaPlYCPphE0w.svg` (479x115) | Beauty | How Siena helps Subtl Beauty’s CX team save 41 hours per week and level up the impact of each member of the team |
  | 29 | `./customer-stories/verb-energy` | `sOKd7AwFJu2onVcd3HJi7RvS29g.svg` (257x73) | Food & Beverage | How Verb automates 49% of its customer service tickets with Siena |
  | 30 | `./customer-stories/douxds` | `Hb8ztduGX6PNC0SM7a6VOQCbELU.png` (191x43) | Beauty | How Siena helps Douxds save 44 hours per month and redeploy those hours toward growth |
  | 31 | `./customer-stories/yumwoof` | `f2IVv0SD8Ysx9G402DmViClSHgk.png` (122x25) | Pets | How Yumwoof! Automated CX And Grew The Business At The Same Time |
  | 32 | `./customer-stories/andar` | `DeBzNPhBmu4Ga0NBJjKVAxgpEY.png` (122x14) | Fashion | How Siena AI helped Andar give customers a sense of validation and made them feel heard |
  | 33 | `./customer-stories/superfoods-company` | `EA4gwHIcYh9cVLeJ79VplGYrtsM.png` (122x24) | Health & Nutrition | How Superfoods Company cut ticket resolution times by 40% with Siena AI |
  | 34 | `./customer-stories/pluto` | `zVydFIQH7FDANnw6Oym4BKl8164.png` (122x31) | Home Goods | How Pluto saves 290+ hours annually on customer support with Siena |
  | 35 | `./customer-stories/bokksu` | `hTrQ9hmKVXtuojDvJBYgd6fY44.png` (122x33) | Food & Beverage | How Bokksu automates over 60% of customer support queries with Siena |
  | 36 | `./customer-stories/immi` | `ClvYfeeqaARZlaDvAkAsAKlyMKY.png` (252x289) | Food & Beverage | How immi reduced response times from 24+ hours to minutes with Siena |

## U3. "Love around the world" — wall of love (vertical tickers) — NEW
- Section ("Desktop") bg `#FFFFFF`, padding **120px 40px**, **top border 1px rgba(0,0,0,0.2)**, flex column center; 1440x972. Title max-width 1062, gap 40.
- H2 **"Love around the *world*"** — H2-section center, `world` in Feature Deck Web Light Italic.
- Ticker row 1062x**628**, flex row center, **gap 16**, overflow hidden: **3 columns × 320px** (x 224 / 560 / 896). Each column is a `<section>` with `mask-image: linear-gradient(180deg, transparent 0%, #000 27.5%, #000 72.5%, transparent 100%)` and contains a `<ul>` (flex column, gap **16**) with the item list rendered **twice** (each copy 2864 tall; items inside a copy gap **20**).
  - **Speeds (rAF-measured):** col 1 moves **up** at **9.8–10 px/s**, col 2 moves **down** at ~10 px/s, col 3 **up** ~10 px/s; linear, infinite, **no hover pause** (speed unchanged while hovered). Loop distance = one copy + gap (2880px) → ~288s per loop.
  - Card: 320 wide, bg `#FFFFFF`, radius **24**, padding **24**, border 1px solid rgba(0,0,0,0.2) (::after), flex column, gap 16. Quote Instrument Sans **500 20/28 ls −0.2** `#122023`. Author row (flex, gap 7, align center): avatar 32x32 radius 20 cover; name Instrument Sans 400 12/18 `#122023` / handle 12/18 `rgba(0,0,0,0.5)` (column, 210 wide); right: FA6 Brands 18px icon `#122023` (U+F08C = linkedin, U+F198 = slack, U+E61A = x-twitter square).
  - Column item orders: col 1 = [1,2,3,4,5,6,7,8]; col 2 = [8,7,6,4,5,3,2,1]; col 3 = [6,7,8,4,5,3,2,1] (numbers refer to the list below).
  1. "This is such a cool feature and a great executive summary! Super helpful for other features we might want to introduce on site or in the CX experience." — **Yuxi Liu** @yuxiliu — avatar `sGwnNQeTHWr7A1joug53j9mibc.webp` (32x32) — icon U+F198 — card h 268
  2. "Been nothing but a pleasure to work with you all! It’s a serious testament to your talent, skill, and work ethic to accomplish all that you have over the last year! I’d be remiss if I didn’t thank you all for the extraordinary partnership, and collaboration over the last year." — **Tanner Nelson** @tanneranelson — avatar `TLdXrM0Ns5C205YXarfUnZoUuY.webp` (100x100) — icon U+F08C — card h 408
  3. "AI is the game changer for our customer service, and while we love our friends at Gorgias, we use Siena AI for this and have done so for almost 2 years. Highly recommend." — **Rachel Reid** @rachelreid-sb — avatar `41lIr5VsLY7853gfB7CIVgCQAw.webp` (32x30) — icon U+F08C — card h 268
  4. "We signed up with Siena about 3 weeks ago and close to 70% of our tickets are being automated already. And the responses are incredible! It's a slam dunk for any brand that takes customer success seriously." — **Mordechai Hoffman** @mordechaihoff — avatar `MMYBnqDv5MUAT7ixRfBpEQILI.jpg` (400x400) — icon U+E61A — card h 324
  5. "Thank me once you have Siena set up. You won’t believe how good it is and how much time it saves your team. I have some incredible conversations with customers that blew my mind." — **Mordechai Hoffman** @mordechaihoff — avatar `MMYBnqDv5MUAT7ixRfBpEQILI.jpg` (400x400) — icon U+E61A — card h 296
  6. "…but as far as Al Automation for CX there is no better solution than Siena Al from my experience. Integrates seamlessly with Gorgias and can be optimized to handle up to 80% of inbound ticket volume. Highly recommend Siena Al for anyone looking to add automation to their CS program." — **Chris Thompson** @chris-thompson — avatar `5Q9fybvG1Blbexlw8P6VqAvM.webp` (43x43) — icon U+F08C — card h 408
  7. "I love staying on top of emerging trends and tools in the Al space, so we frequently take demos to see what's out there. There are SO many Al tools popping up every day (just got a cold outreach in my inbox this morning from a brand new one), but Siena Al consistently is leaps." — **Cate Marquese** @cminall — avatar `WVZA37Bad6K0ss9JDOjwLhH2aUs.webp` (32x32) — icon U+F198 — card h 380
  8. "This Al response to one of our support tickets is mind blowing." + 2nd paragraph "Al perfectly articulated why our newest tote is at a higher price. I'm not sure l could have crafted a better response. This is why we're such big fans of Siena Al." — **Bryan Porter** @bryanporter — avatar `7kFHraTWYSJ7R2Fi994w9w96VQ.png` (509x509) — icon U+F08C — card h 372
- **390** ("Phone"): padding **64px 24px**, title gap 32; H2 48/48 (2 lines); **one column** 342x628 (same mask), moves **down** at ~10 px/s; cards 342 wide; list copy height 2103 (3 copies rendered).

## U4. Main CTA — VARIANT of `MainCta`
- Identical to the /about-us CTA (A5): heading **"Brands that win on CX run on Siena"**, "Book a demo" → `./book-a-demo`, section 1440x**691**, no top blur-out.
- **390:** section 390x**842** with padding **200px 96px** (yes 96 on phone — the card is only **198** wide, padding 32, radius 32, H2 48/48 center in 134px → 6 lines 134x288). Replicate as measured.

---

# /community

Doc height 1440: **1410** (Hero 976 + Footer 434) — the page is just a hero with a form + logo ticker, **no Main CTA**. 390: **2843** (hero 1723 from y=40 + footer 1080). Screenshots `community-1440.png`, `community-390.png`, form crop `community-form0-1440.png`. Nav identical (normal).

## M1. Hero + "Request an invite" form — NEW
- Hero 1440x**976**, bg `#F3F0EB`, padding **180px 64px 0**, flex column center, **gap 100**, overflow hidden.
- Decorative glow image `public/assets/LhQ0hZskcxCtirPSSxXE4hUU0yo.webp` (1010x1000 pastel rainbow blob) absolutely at **x531 y76, 909x900**, `object-fit:cover`, behind content (z 0). 390: **x−249 y1090 (rel. hero top 40), 639x633**.
- Row (max-width 1200, x120–1320): flex row center, **gap 40**.
  - Left "Title" (577 wide, max 640), flex column, gap **48**:
    - Text group (gap 24): H1 **"Join our private community on Slack"** — H1-hero 80/80 ls −0.8, **left**, 577x240 (3 lines); sub (opacity **0.82**, max 564) Sub-20 left: "Get the juice on our latest developments, chat with fellow users, and join a group of fellow enthusiasts who share your passion for AI and CX."
    - Bullets (flex column, **gap 11**): each row flex, align center, gap 16: icon tile **40x40**, bg `#122023`, radius **12**, padding 4, glyph FA6 Sharp Light **U+E5D6** (sparkle) 16px white; text Tiempos Text Regular 400 **14/18.2** `#122023`:
      "Connect with like-minded individuals" / "Get early access & insights into the future of CX" / "Stay up to date with private events".
  - Right: **form card** 583x596 (max 640): outer = gradient ring, padding **3px**, radius **18**, `background: linear-gradient(45deg, #F2E59A 0%, #FEC796 24.32%, #FB5646 40.09%, #827ACC 59.91%, #2E79D8 77.48%, #294FBA 100%)`; inner panel bg `#F3F0EB`, radius **14**, padding **40**.
    - Framer native `<form>` (POST to Framer forms backend; clone: static, `onSubmit` preventDefault). Flex column, **gap 40** (497 wide).
    - Header: H2 **"Request an invite"** — Feature Deck Web Regular 400 **40/48** `#000`, with padding-bottom **32** and **bottom border 1px rgba(0,0,0,0.2)**.
    - Fields grid: 3 rows (flex column gap **24**), each row 2 columns (flex row gap **16**, each 241 wide). Field = `<label>` flex column gap **6**: label text `<strong>` Instrument Sans **600 14/15.4** `rgba(18,32,35,0.8)` (asterisk is part of the text); input wrapper 60 tall, bg `#FFFFFF`, radius **16**, padding **20px 16px**, border **1px solid `#CDBCA0`** (Framer ::after); input Instrument Sans 400 **16/16** `#122023`; placeholder color **`#A7A092`**; `transition: background, box-shadow` (Framer default ~0.2s).
      | label | type | name | placeholder | required |
      |---|---|---|---|---|
      | Full name* | text | Full name | John Smith | yes |
      | Work email* | email | workEmail | john.smith@example.com | yes |
      | Phone number* | tel | phoneNumber | + 1 555 555 55-55 | yes |
      | Company* | text | company | Acme Corp | yes |
      | Website* | text | website | www.mywebsite.com | yes |
      | Role* | text | role | CEO | yes |
      - The DOM also contains 11 invisible honeypot inputs (website/company/message/subject/title/description/feedback/notes/details/remarks/comments) — **do not render**.
    - Submit row: flex, **justify flex-end**: `<button type=submit>` Btn-xlg **"Apply to join"** (154x58, radius 16, bg `#122023`).
    - **States (measured):** focus → wrapper border color **`#0099FF`** (1px, no shadow, no outline on input); hover on a field → no change; button hover → rainbow `linear-gradient(90deg, #F2E59A 0%, #FEC796 15.77%, #FB5646 30.63%, #827ACC 48.2%, #2E79D8 77.03%, #294FBA 100%)`. **Validation is native HTML5** (`required`, `type=email`): empty submit shows the browser bubble "Please fill out this field." on the first field; bad email → "Please include an '@' in the email address…". No custom error styling. (Success state not exercised — clone can swap the button label to "Thank you" / show nothing.)
    - Motion: the whole form card has an appear (id j8iu4u): **x 150→0, opacity 0.001→1, spring {duration 0.4, bounce 0.2}, delay 0** on load. H1 group: appear delay **0.2** (y200, 0.7s, ease 0,0.91,0.14,0.85); sub: delay **0.3** (ease 0,0.91,0.78,1).
- **Logo ticker** ("Logos"): 1312x**100** at hero bottom (x64), `<section>` with `mask-image: linear-gradient(to right, transparent 0%, #000 12.5%, #000 87.5%, transparent 100%)`; `<ul>` flex row, **gap 96**, list duplicated; moves **left at 30 px/s** (rAF-measured), linear infinite. 28 inline-SVG logos (full colour as provided, vertically centered, heights 24–44), in order: `public/svg/community-logo-00.svg` … `community-logo-28.svg` (00 = Coterie 176x32, 01 = 159x32, 02 = madhappy 209x32, 03 = BANDIT 167x32, 04 = BPN 119x38, 05 = Simple Modern 111x40, then 06–28 at 120x38, 91x44, 241x24, 99x44, 161x32, 207x38, 156x38, 71x38, 112x38, 150x24, 152x30, 188x40, 154x44, 126x38, 178x30, 103x30, 189x38, 86x44, 112x44, 144x30, 82x44, 121x30, 107x38; files are numbered in DOM order).
- **390:** hero padding **96px 24px 64px**, gap 80; stacked column gap **64**; Title gap 32; H1 56/56 left (4 lines); sub 16/22.4; bullets gap **24**, bullet text wraps (286 wide). Form card 342x837: ring padding 3, inner padding **24**, radius 14; form 288 wide, gap 32; H2 **24/28.8**, header padding-bottom 24; fields single column (288 wide, gap 24 everywhere); submit button **full width 288x58**. Ticker 342x45, mask 10%/90%, **gap 40**, same 30px/s leftward.

---

# /events

Doc height 1440: **2120** (title 346 + list 736 + newsletter 604 + footer 434). 390: **2609**. Screenshots `events-1440.png`, `events-390.png`, `events-form0-1440.png`. Nav identical (normal). **No Main CTA** (the newsletter block takes its place).

## E1. Title — VARIANT of the /customers hero title (U1)
- Same structure/styles as U1 with: "Content" padding-top **170** (390: `112px 24px 0`), gap 60. H1 **"Upcoming *Events*"** (Events = Light Italic), 1 line at 1440 (390: 2 lines 56/56). Underline image `MJbk4aQblPanJHyFV9X8Yg7JDqI.png` **241x18** centered under "Events" (center x≈900; top = H1 top + 76; 390: **134x10**, center x≈253, top +122). Sub (opacity 0.82, max 564, Sub-20 center): "Meet the operators at the forefront of AI in customer experience and leave with ideas you can use right away." (390 title gap 32).
- Motion: H1 appear delay 0.2 (ease 0,0.91,0.14,0.85); underline delay 0.3; sub delay 0.3 (ease 0,0.91,0.78,1); all y200→0 / opacity, 0.7s.

## E2. Events list — NEW (CMS list currently EMPTY → empty state)
- Wrapper "Content" max-width 1200, padding **80px 96px 56px** (390: `64px 24px 32px`), gap 60. Inner list column 1008 wide, gap 20.
- Only the **"Empty State"** card renders (no events in CMS today): 1008x**600** (390: 342x600), radius **24**, padding 24px 16px, flex column center, `background: linear-gradient(0deg, #FFFFFF 0%, #F3F0EB 100%)` (beige at top fading to white at bottom). Text H4 **"Check later to discover Siena's latest events"** — H4-40 (Feature Deck Web Regular 40/48 `#000`), center, max-width 680, 2 lines (390: **24/28.8**, 310 wide).
- No event-card design is reachable on the live site (CMS empty) — cannot be measured; build only the empty state.

## E3. Newsletter signup — NEW (shell is a VARIANT of `Metrics`/`MainCta` image-card pattern)
- Section ("Desktop") 1440x**604**, padding **120px 0**, flex row center, overflow hidden. Full-bleed bg `<img>` `5VTp1YGCJLYo9Grib0Ouvyooeag.webp` (the homepage Metrics bg), `object-fit:cover`, **object-position 50.4% 58.2%**. No blur-outs.
- Card: max-width **791** (791x364), bg `#F3F0EB`, radius **48**, padding **64**; native Framer `<form>` inside, flex column, **gap 48** (663 wide):
  - H2 **"Be the first to know what's happening"** — H2-section 64/64, center, 2 lines.
  - Row: flex center, gap **10**: email field (label without visible text) wrapper **506x60**, bg #FFF, radius 16, padding 20px 16px, border 1px `#CDBCA0` (::after), input `type=email name=Email placeholder="john.smith@example.com" required`, Instrument Sans 400 16/16, placeholder `#A7A092`; + submit Btn-xlg **"Sign me up!"** (147x58).
  - Hidden field `FormId=newsletter` (opacity 0) — don't render.
  - States: focus border `#0099FF`; button hover rainbow (same as community); native HTML5 validation ("Please fill out this field." / "Please include an '@'…").
- **390 ("Phone")**: section 390x470, padding **40px 24px**; card 342 wide, padding **40px 16px**, radius **24**, gap 32; H2 48/48 center (3 lines, 310 wide); field 310x60 then button **full-width 310x58** stacked (gap 16).

---

# /partner-with-siena

Doc height 1440: **5091** (Hero 1552, partners 1241, testimonials 1174, CTA 690, footer 434). 390: **6666**. Screenshots `partner-with-siena-1440.png`, `-390.png`, modal `partner-with-siena-modal-1440.png`. Nav identical (normal).

## P1. Hero + "Why partner with Siena?" benefits card — NEW
- Hero 1440x**1552**, bg `#F3F0EB`, padding **160px 96px 120px**, flex column center, **gap 100**, overflow hidden.
- Decorative image `public/assets/HuVP7dKP20oXnfmo7Q6QKQSISFs.webp` (1099x1179; red/blue/orange painterly blob) absolute **x341 y0, 1099x1088**, cover, behind (390: x−70 y313, 494x489).
- Title block (1248, max 1328, column, align start, **gap 40**): H1 **"Partner with Siena"** H1-hero **left** (1 line); sub (opacity 0.82, max 564) Sub-20 left: "Collaborate with us to deliver an agentic solution that grows CSAT, unlocks new revenue streams and generates business intelligence for your clients."; Btn-xlg **"Become a partner"** (199x58) — **no href: opens the partner-form modal (P5)**.
- Motion: H1 appear delay 0.2 (ease 0,0.91,0.14,0.85); sub delay 0.3; button delay **0.4** (ease 0,0.91,0.78,1); y200→0, 0.7s.
- Benefits card: 1248x870, bg **`#FFFFFF`**, radius **24**, padding **80px 64px**, flex column center, **gap 80**:
  - Title (gap 24, centered): eyebrow **"benefits"** (uppercase); H2 **"Why *partner* with Siena?"** (H2-section center, "partner" italic).
  - Grid: 2 rows (flex row, gap 32, 1120 wide), 3 items each **352 wide** (max 416) — same item style as careers "How we work" (padding-top 32, **border-top 1px rgba(0,0,0,0.2)**, gap 16; icon FA6 Sharp Light 24px; title **h3** H-card32; body Body-serif 18/23.4 `#122023` opacity 0.8). Row gap 80 (row tops 832 / 1132).
    | icon | title | body |
    |---|---|---|
    | U+F672 (lightbulb-on) | Competitive advantage | Enhance your service offering with cutting-edge AI technology, providing your clients with the best agentic commerce solution. |
    | U+E528 (money-bill-transfer) | Revenue share | Unlock our revenue-sharing model, earning a competitive share and SPIFFs for each new customer you bring to Siena. |
    | U+F6A3 (chart-user / laptop-arrow) | Lead sharing | Expand your client base by receiving qualified business from our partner ecosystem. Includes co-marketing and networking opportunities. |
    | U+E14F (messages-question) | Dedicated support | Enjoy personalized support from a dedicated partner manager and direct communication channels with our team. |
    | U+E533 (people-group) | Marketing support | Collaborate on co-marketing initiatives, speaking opportunities, sponsorships, and more to boost your agency's visibility and growth. |
    | U+E53D (person-chalkboard) | Training & certification | Gain access to training and certification programs, empowering your team with the knowledge and skills to excel in AI-driven CX. |
- **390:** hero 390x2248, padding **96px 24px 64px**, gap 100; H1 56/56 (2 lines); button 199x58; card x24 w342 with content inset 24px (content 294 wide), title gap 16, eyebrow 14/19.6, H2 48/48 (2 lines); items single column, gap 32, title **28/33.6**, body 14/21.

## P2. "Backed by best-in-class partners" logo grids — VARIANT of `Integrations`
- Section bg `#FFFFFF`, padding 80px 96px, gap 72, 1440x1241. H2 **"Backed by *best-in-class* partners"** centered (H2-section, italic word).
- Two groups (column, gap **32**, align start; groups separated by 72): group label `h3` eyebrow style (Instrument Sans 600 16/22.4 ls 1.7 uppercase) with **padding-bottom 16 + bottom border 1px rgba(0,0,0,0.2)** (border spans only the label width): **"Agency partners"**, **"Technology partners"**.
- Grids: `repeat(4, 309px)`, rows **181**, gap **4** (tiles identical to Integrations tiles: bg `#F3F0EB`, radius 4, padding 72px 0, center). Logos (full colour/black as provided, no filter):
  - Agency (1 row): LTVplus `public/svg/partner-ltvplus.svg` (153x53, was a CSS data-URI bg); horatio `partner-horatio.svg` 145x33; Create CX `public/assets/ArBCWxOfP3vBCKL9ojUO18QcOc.png` (432x61) at **202x29** cover (tile padding 72px 24px); Arctic Grey `partner-arcticgrey.svg` 211x33.
  - Technology (3 rows): gorgias `partner-gorgias.svg` 143x37; zendesk `partner-zendesk.svg` 171x37; kustomer `partner-kustomer.svg` 185x33; Gladly `partner-gladly.svg` 151x37 / klaviyo `partner-klaviyo.svg` 125x37; recharge `partner-recharge.svg` 187x37; shopify `partner-shopify.svg` 129x37; Stay AI `partner-stayai.svg` 135x33 / skio `partner-skio.svg` 81x33; ordergroove `partner-ordergroove.svg` 213x37; Intercom `partner-intercom.svg` 163x37; Prive `partner-prive.svg` 119x33 (data-URI).
- **390:** padding `56px 24px 89px`, gap 40; H2 48/48 (2 lines); group labels 14/19.6; grids **2 cols × 169px**, rows 181, gap 4 (agency 2 rows, tech 6 rows); logos scale to fit (Create CX 131x18).

## P3. Partner testimonials slider — VARIANT of `Testimonials` (homepage §3)
- Section bg `#FFFFFF`, padding **56px 96px**, **bottom border 1px rgba(0,0,0,0.2)**, 1440x1174. **No eyebrow/H2 title.**
- Wrapper card ("content") **1062x1062**, max 1062, radius **24**, padding **24px 16px**, `background: linear-gradient(0deg, #FFFFFF 0%, #F3F0EB 100%)`; the slider (inner padding **16px 32px 48px**, content 966 wide) sits at the top, leaving ~430px of empty gradient below (as on live).
- Controls identical to homepage (40x40 round buttons `rgba(244,237,222,0.6)`, Inter 14 counter "1 / 7", the "/ 7" at opacity 0.4, gap 12) — **counter is centred between the two buttons** (homepage same).
- Slide 966x503: flex row, gap **40**: text column 463 (gap 32: quote mark 30x24 → quote Instrument Sans 400 25.6/33.28 (same as homepage) → Brand block gap 16: logo 140x64 contain; person gap 12: name Instrument Sans **500 20/28**; role Instrument Sans **600 12/16.8 ls 0.6 uppercase `#787368`** (homepage role differs — this is smaller/greyer)). Image **463x400**, radius **32**, cover.
- Behaviour same as homepage slider (manual prev/next, loops; slide transition as §3).
- Slides (7; files in `public/assets/`):
  1. **Abby Harkins Barnes** — DIRECTOR OF CLIENT PARTNERSHIPS — logo `gPbncbWgqh6Z0i3jV11HixvRMQQ.svg` — photo `jgxUA35mrCLRb0iwb8BcsY6dXDg.jpeg` — "At Horatio, we believe in a human-AI partnership. Siena handles routine inquiries instantly, freeing our team to focus on high-touch interactions. This hybrid model scales our reach, preserves each brand’s voice, and inspires our people to grow in their careers."
  2. **Leeor Cohen** — FOUNDER, CEO — logo `ESfai9kjmOoaq7S2R1LYA2ryTo.png` — photo `55BFP7WLWw6osGequVvBvkx46dw.webp` — "When I started Create CX, my goal was to blend digital CX with human ops—Siena was the missing piece. Partnering with Siena lets us deliver scalable, bespoke CX that still feels handcrafted. It’s helped unlock a new level of engagement and made combining our playbook with their platform a no-brainer."
  3. **Jess Cervellon** — HEAD BRAND, CX & RETENTION CLIENT CONSULTANT — logo `gu1zj14SNJwi7rOAEYZn30u07r4.webp` — photo `WPRfXHKYDK2h7CgolOLQBiOUni8.webp` — "We chose to work closely with Siena because they match our obsession with brand fidelity and customer care. Their platform absorbs every nuance of our clients’ tone and playbooks, and the team collaborates with us on persona tuning and rapid iterations. It’s not just a tool—it’s part of how we deliver really dope CX journeys that scale without compromising quality."
  4. **Hudson Lofchie** — CO-FOUNDER, GREY SPACE CONSULTING — logo `Keq3P6ZxODfXyfY0AxZzcEUA.png` — photo `LhW0MBO7jm6pAJD5z0S1BcxEulM.webp` — "With all the vendors out there, Siena feels like one of the very few who’ve actually sat down with clients and developed for their needs. The basic AI features are just table stakes, but Siena goes beyond with the true quality-of-life features that make the products a breeze to use."
  5. **Anthony Spallone** — CO-FOUNDER — logo `UeQwdt8s4GLxHWZsphG3MZH2950.svg` — photo `vfm2qZfHgAX4T4DGqEkII8Ml2Vg.webp` — "As a headless commerce agency, we needed a partner who could move fast and stay aligned. Siena’s APIs and modular setup let us spin up empathic agents in days instead of weeks. Their ongoing innovation keeps us ahead, and working with them feels less like vendor management and more like an extension of our own team."
  6. **Chris Thompson** — CEO, PILLAR3 — logo `(no logo image rendered)` — photo `5Q9fybvG1Blbexlw8P6VqAvM.webp` — "I witnessed a massive transformation when we implemented Siena AI for Fuel Meals. First response time dropped from over 20 hours to under 3 minutes. We hit 45% automation and cut support costs by 50%. That success convinced me to build Pillar3 and help other brands unlock empathic AI-driven CX."
  7. **Mercer Smith** — VP, COMMUNITY + EDUCATION — logo `seFp5JJrihyQheiUbDFhflvJmE.svg` — photo `Kz9bZaq5rYbp21P6TDjfk0VSWIE.webp` — "Siena's autonomous chat platform is incredible at picking up a brand's voice and tone in a way that really sounds accurate and authentic. That's so important for personality-driven brands, and partnering with Siena gives us confidence that we'll always be able to deliver an AI experience for our customers that truly on-brand."
- **390:** section padding `0 0 56px`, card has **no gradient and no padding** (390x880, radius 24); slider padding 16px 32px 48px (326 content); slide stacks **image first 320x320** r32, then text column (gap 32; quote Instrument Sans 400 **19.2/24.96 ls −0.384**, 326 wide), then brand row (flex row, gap 16: logo 140x64 + person block: name **500 16/22.4 ls −0.16**, role 12/16.8).

## P4. CTA — VARIANT of `MainCta`
- Section ("CTA Section") 1440x**690**, padding **200px 96px**, bg image **`5VTp1YGCJLYo9Grib0Ouvyooeag.webp`** (Metrics bg, not the MainCta image) cover, object-position 50.4% 58.2%; no blur-out.
- Card max-width **1328** (1248x290), bg `#F3F0EB`, radius 48, padding 64, gap 40: H2 **"See how partners scale with Siena"** (64/64 center, 1 line) + Btn-xlg **"Become a partner"** (opens modal P5).
- **390:** 390x450, padding **80px 24px**; card 342 wide, padding **32**, radius **48**; H2 48/48 (3 lines); button **full width 278x58**.

## P5. "Join our partner program" modal form — NEW (Framer native form in an overlay)
- Trigger: either "Become a partner" button. Overlay: `position:fixed; inset:0; z-index:10`, bg **rgba(0,0,0,0.8)** (appears instantly). Panel enters with **x 150→0 + opacity 0→1, spring** (measured: x 150 → 44 → −0.8 → −1.7 → −0.3 → 0 over ~300ms, slight overshoot) — use framer-motion `{type:'spring', duration:0.4, bounce:0.2}` (same as community form appear). Close: **click on the backdrop** (no close button exists); exit = panel opacity → 0 over ≈150ms, then overlay removed.
- Panel: **600x720** centred (x420 y90 at 1440x900), gradient ring padding **3px**, radius **16**, `linear-gradient(180deg, #F2E59A 0%, #FEC796 24.32%, #FB5646 40.09%, #827ACC 59.91%, #2E79D8 77.48%, #294FBA 100%)`; inner bg `#F3F0EB`, radius **14**, padding **40**, **overflow-y: auto** (the form is 1213 tall → scrolls inside the 714px panel).
- Form (514 wide, column, **gap 32**):
  - Header: H4 **"Join our partner program"** — Feature Deck Web Regular 40/48 `#000`; padding-bottom 24 + bottom border 1px rgba(0,0,0,0.2).
  - Field styles identical to the /community form (label `<strong>` Instrument Sans 600 14/15.4 rgba(18,32,35,.8), gap 6; wrapper 60 tall white r16 padding 20px 16px border 1px `#CDBCA0`, focus border `#0099FF`; input Instrument Sans 400 16/16; placeholder `#A7A092`). Rows of two 249-wide fields, gap 16; row gap 32.
  | label | control | name | placeholder / options | req |
  |---|---|---|---|---|
  | First name* | text | First Name | John | ✓ |
  | Last name* | text | Last Name | Smith | ✓ |
  | Email address* | email | Email | john.smit@example.com (sic) | ✓ |
  | Business website* | text | website | www.mywebsite.com | ✓ |
  | City* | text | City | San Francisco | ✓ |
  | Country* | text | Country | United States | ✓ |
  | How big is your team?* | select | Team | Select one… / 1-10 / 11-50 / 51-100 / 101-500 / 501+ | ✓ |
  | Partner type* | select | Type | Select one… / Partner (Agency) / Partner (BPO) / Help Desk Partner / Individual Affiliate Partner / Tech Partner / VC | ✓ |
  | How many clients do you have at a time?* (full width, label wraps) | select | clients | Select one… / 0-5 / 6-15 / 16-30 / 31+ | ✓ |
  | Which platform(s) do your clients use?* (full width) | multi-select pill buttons → hidden required text input `Buttons` (comma-joined values, e.g. "Shopify,Gorgias") | Buttons | Shopify, Shopify Plus, Gorgias, Zendesk, Gladly, Intercom, Kustomer, Recharge, Skio, Smarttr, OrderGroove, BigCommerce, Magento, Salesforce, Squarespace, Square, Other | ✓ |
  | Drop us a line! Why do you want to join our partner program?* (full width) | textarea 514x100, padding 20px 16px, resize vertical | dropLine | Write us something... | ✓ |
  - Selects: 56 tall, wrapper radius **15**, `appearance:none`, Instrument Sans 400 16/16, text colour `#A7A092` while on "Select one…", padding 20px 16px; custom up/down chevron 16x16 at right 16px = `public/svg/form-select-chevron.svg` (fill `#414D4F`; on live it's a CSS mask on the wrapper ::before). Label→select gap 10.
  - Platform pills: rows of 4, gap 12 (both axes), each **120x42**, padding 14, radius 16, bg `#FFFFFF`, border 1px `#CDBCA0`, label Instrument Sans 400 14/14 `#122023` center. **Selected:** bg `#122023`, text `#F4F5F5`, border `#122023`. No hover change. Toggle on click (multi-select).
  - Submit row justify flex-end: Btn-xlg **"Submit"** (110x58). Hover rainbow. Native HTML5 validation (required).
  - Hidden honeypot inputs present — don't render.
- **390:** panel 342x720 (x24), inner padding **24**; form 288 wide, gap 24; H4 **24/28.8**; all fields single column (288 wide).

---

# /refer-a-friend

Doc height 1440: **3701** (Hero 863, criteria 539, testimonials 1174, CTA 691, footer 434). 390: **5050**. Screenshots `refer-a-friend-1440.png`, `-390.png`, form crop `refer-a-friend-form0-1440.png`. Nav identical (normal).

## R1. Hero + "Submit a referral" form — NEW (layout sibling of /community M1)
- Hero 1440x**863**, bg `#F3F0EB`, padding **160px 96px 120px**, flex row center, gap 64, overflow hidden.
- Decorative glow `public/assets/QELfTLkuvZHSqcDqDFckc0OdzQ.webp` (965x962) absolute **x571 y3, 869x861**, cover, behind (390: x−84 y789, 474x469).
- Inner row max-width **1062** (x189–1251), flex row center, **gap 64**:
  - Left "Title" (496 wide, max 640), column gap **72** between H1 and steps:
    - H1 **"Refer a *friend* to join Siena. Get $10,000."** — H1-hero 80/80 left, `friend` in Light Italic; 496x240 (3 lines).
    - Steps list (column, gap 0): each step row = flex row align center gap 16: number tile **40x40** bg `#122023` radius **12** padding 4 with digit Tiempos Text Regular 400 **12/15.6** white; text Tiempos Text Regular 400 **18/23.4 ls −0.18 `#2A3639`** (440 wide). Between steps a 40-wide column holding the vertical connector **2x52** (`public/svg/refer-a-friend-step-line.svg`, gradient stroke) centred under the tile.
      1. "Fill out the form with your friend's information"
      2. "We'll contact your friend. They attend a demo, you get $100"
      3. "When your friend becomes a customer, you get up to $10,000"
  - Right: form card **502x583** (max 640): ring padding **3px**, radius **16**, `linear-gradient(42deg, #F2E59A 0%, #FEC796 24.32%, #FB5646 40.09%, #827ACC 59.91%, #2E79D8 77.48%, #294FBA 100%)`; inner `#F3F0EB`, radius 14, padding **40**.
    - Framer native form, column **gap 40** (416 wide). Header H2 **"Submit a referral"** (Feature Deck Web Regular 40/48 `#000`) padding-bottom 32 + bottom border 1px rgba(0,0,0,0.2).
    - Group 1 (gap 16): sub-heading `<strong>` **"YOUR INFORMATIOn"** (sic, rendered uppercase "YOUR INFORMATION") — Instrument Sans **700 16/22.4 ls 1.7 uppercase `#605C53`**; field "Email address*" (`type=email name=Email placeholder=john.smith@example.com`, required) 416x60.
    - Group 2 (gap 16): sub-heading **"REFERRAL INFORMATION"** (same style); row of two 200-wide fields gap 16: "Full name*" (`text`, name `Full name`, placeholder John Smith — **not actually required** in the DOM despite the asterisk) and "Email address*" (`email`, name `ReferralEmail`, placeholder john.smith@example.com, required).
    - Submit row justify flex-end: Btn-xlg **"Submit"** (110x58).
    - Field/label/focus/hover/validation styles identical to /community M1 (label 600 14/15.4 rgba(18,32,35,.8); wrapper white r16 p 20/16 border `#CDBCA0` → focus `#0099FF`; placeholder `#A7A092`; native HTML5 validation messages). Honeypot inputs present — don't render.
- Motion (appear, on load): H1 delay 0.2 (ease 0,0.91,0.14,0.85); step 1 & step 2 rows and step 3 text: delay **0.4** (ease 0,0.91,0.78,1), y200→0 / opacity, 0.7s; form card: **x150→0 spring {duration 0.4, bounce 0.2}**.
- **390:** hero 390x1258, padding **96px 24px 64px**, stacked column gap 64; Title gap 48; H1 56/56 (3 lines, 342x168); steps text Tiempos **14/21 ls −0.14** (same structure; connectors 2x48); form card 342x608 (ring 3px), inner padding 24, form 288 wide gap 32; H2 **24/28.8**; sub-headings **14/19.6**; all fields full width (288) stacked gap 24; Submit **full width 288x58**.

## R2. "How do I know who to refer?" criteria — NEW (same item pattern as careers C4 / partner P1)
- Section bg `#FFFFFF`, padding 80px 96px, gap 72, 1440x539. Title (max 1062, gap 24, centered): eyebrow **"Terms and conditions."**; H2 **"How do I know who to *refer?*"** (H2-section center, `refer?` italic).
- Row: flex row gap 32, three items **395 wide** (max 416): padding-top 32, **border-top 1px rgba(0,0,0,0.2)**, gap 16; icon FA6 Sharp Light 24px; title h3 H-card32; body Body-serif 18/23.4, opacity 0.8 (`#122023`; third item's text is `#2A3639`).
  | icon | title | body |
  |---|---|---|
  | U+F847 (cart-shopping-fast) | Commerce connection | Your referral should be an ecommerce brand using Shopify. |
  | U+E3F1 (user-tie-hair) | Decision-maker | Your referral should be a founder, CX leader, or executive responsible for driving AI implementation. |
  | U+F652 (inbox-full / ticket) | Ticket volume threshold | Ideal referrals handle at least 3,000 customer interactions per month. |
- **390:** padding 56px 24px; title gap 16, H2 48/48 (2 lines); items stacked gap 32, title 28/33.6, body 14/21.

## R3. Testimonials — VARIANT of `Testimonials` (homepage §3)
- **Same 11 slides, same data/order/links as homepage §3** (Kylah Field/Spanx … Cate Marques/Terra Kaffe, incl. "Read full story" on slides 4,5,7,8,9,10,11 and the play badge on slide 1). Reuse the component with these diffs:
  - No eyebrow/H2 title. Section padding **56px 96px**, 1440x1174.
  - Slider wrapped in a "content" card **1200 wide** (max 1200) x1062, radius **24**, padding **24px 16px**, `linear-gradient(0deg, #FFFFFF 0%, #F3F0EB 100%)`; slider padding 16px 32px 48px → content **1104** wide (homepage 944).
  - Slide 1104x532: text column **532** wide, image **532x532** radius 32 (homepage 452/452). Quote 25.6/33.28 (same). Person role here renders Instrument Sans **600 12/16.8 ls 0.6 uppercase `#787368`** (same as the partner slider), name 500 20/28.
  - Counter "1 / 11".
- **390:** section padding **56px 0**; card no gradient/padding (390x880, r24); slide stacks image 320x320 first, then text (gap 40) — same as partner P3 mobile.

## R4. Main CTA — VARIANT (identical to /about-us A5 and /customers U4)
- "Brands that win on CX run on Siena" + "Book a demo" → `./book-a-demo`; 1440x691; MainCta bg image; no blur-out.
- **390:** 390x842, padding **200px 96px** → card 198 wide, padding 32, radius 32, H2 48/48 (134 wide, 6 lines), button 157x58 (same quirk as /customers).

---

# Assets (all local paths under /Users/riyaghosh/V3/siena/public/)

Newly downloaded for these routes (original-resolution files from framerusercontent.com/images/<hash>; filenames unchanged):

| file | route(s) | natural px |
|---|---|---|
| `assets/mB1JO1ODJougkXIIQ3XCueDz4.png` | about-us | 3168x1536 |
| `assets/q9j2kFCtrxbrzN8czFKBjCoSXE.webp` | about-us | 977x936 |
| `assets/h77L5rBDotNuRWvoKxflPm6HPjA.webp` | about-us | 1168x655 |
| `assets/4D1FYqC4H5M623F6yNo4c5T97E.webp` | about-us | 1177x1084 |
| `assets/InMGs95DivVaUgENQYUbUNkoac.webp` | about-us | 1552x770 |
| `assets/9pqSQiEhJEHLD5Wei9aJDEo2BgA.webp` | about-us | 1516x1623 |
| `assets/oVfH5UrvznJiBjQEiKKMl1FDx4.png` | about-us | 1024x1536 |
| `assets/BCooYvzI7OtNc1Vw5sjVBJkbBvs.svg` | about-us | 65.000x66.000 |
| `assets/girTZkXE69Eq8siqGKJFsdTtaOA.svg` | about-us | 125.000x33.000 |
| `assets/6BU8x1yoHD2GBBk0h7kePpSYI.svg` | about-us | 139.000x33.000 |
| `assets/vB2kUPz76loqoi2c3AunCMGNw.svg` | about-us | 117.000x33.000 |
| `assets/oNvYI9NSJlbETUTOH5bQPczJeVQ.svg` | about-us | 207.000x38.000 |
| `assets/ZgEKUQgxEWIsoQLgJ2nx9e6leQ.svg` | about-us | 138.000x18.000 |
| `assets/pndXbr7xMtpLa5GqWdWbQdcG8.svg` | about-us | 253.000x33.000 |
| `assets/HfcivWOr23iKQ6U0lrIrWF4yuOA.svg` | about-us | 139.000x33.000 |
| `assets/jI4UkRHradpPJjCWsLuzyY5YOo.png` | careers | 1448x1086 |
| `assets/zYwHClH3RO5UitAIAL93OiJ1FaA.jpeg` | careers | 800x800 |
| `assets/XZGutyEyYkQeF3RlZFORVhgbnKo.png` | careers | 800x800 |
| `assets/o84NVbyg8gAhzNm6NDtMG6x5Q.jpg` | careers | 400x400 |
| `assets/x7ul8NZAdgrmZhdlSEGqo4TvrsQ.png` | careers | 439x449 |
| `assets/LhQ0hZskcxCtirPSSxXE4hUU0yo.webp` | community | 1004x994 |
| `assets/RVpmLl4ENxYALH5arYvLOF2hUY.svg` | customers | 787.100x359.940 |
| `assets/yPdio6eYzQ3Z8vtPBceOs019M.png` | customers | 379x121 |
| `assets/83EJKkIYvJ792qe3DYfFh9yVwo.svg` | customers | 513.000x73.000 |
| `assets/0JjqGImv5R5jQ7d8QYGXAnUOVA.png` | customers | 1001x293 |
| `assets/wGvfbDAuOljwg1KwnrMA6NSIEMU.png` | customers | 1815x537 |
| `assets/vUaEZH5f85oxkdxCFmiAd8P8ZA.svg` | customers | 631.000x182.000 |
| `assets/yTIExcu9M9XJvL1ACN3rBAIpQeQ.png` | customers | 300x84 |
| `assets/yuv1GyrW4x3RoV3tbjTOrNLxyw.png` | customers | 1876x1173 |
| `assets/gO3x6192WCKAtB65XMiG41bNJo.png` | customers | 1033x305 |
| `assets/Pq81mgBAh3wCteDaPlYCPphE0w.svg` | customers | 479.000x115.000 |
| `assets/QneJbjbwOfyuvvba5LoTd515i0.svg` | customers | 617.000x250.000 |
| `assets/R32uxsvtKZBcoEVJ192BcjdXKz4.png` | customers | 1777x1087 |
| `assets/DeBzNPhBmu4Ga0NBJjKVAxgpEY.png` | customers | 2909x352 |
| `assets/sOKd7AwFJu2onVcd3HJi7RvS29g.svg` | customers | 257.000x73.000 |
| `assets/f2IVv0SD8Ysx9G402DmViClSHgk.png` | customers | 1366x288 |
| `assets/Hb8ztduGX6PNC0SM7a6VOQCbELU.png` | customers | 800x182 |
| `assets/zVydFIQH7FDANnw6Oym4BKl8164.png` | customers | 2300x592 |
| `assets/TLdXrM0Ns5C205YXarfUnZoUuY.webp` | customers | 100x100 |
| `assets/hTrQ9hmKVXtuojDvJBYgd6fY44.png` | customers | 1277x352 |
| `assets/ClvYfeeqaARZlaDvAkAsAKlyMKY.png` | customers | 252x289 |
| `assets/41lIr5VsLY7853gfB7CIVgCQAw.webp` | customers | 700x668 |
| `assets/sGwnNQeTHWr7A1joug53j9mibc.webp` | customers | 652x652 |
| `assets/MMYBnqDv5MUAT7ixRfBpEQILI.jpg` | customers | 400x400 |
| `assets/7kFHraTWYSJ7R2Fi994w9w96VQ.png` | customers | 509x509 |
| `assets/5Q9fybvG1Blbexlw8P6VqAvM.webp` | customers,partner-with-siena | 701x701 |
| `assets/EA4gwHIcYh9cVLeJ79VplGYrtsM.png` | customers | 4639x916 |
| `assets/gPbncbWgqh6Z0i3jV11HixvRMQQ.svg` | partner-with-siena | 145.000x33.000 |
| `assets/HuVP7dKP20oXnfmo7Q6QKQSISFs.webp` | partner-with-siena | 1455x1562 |
| `assets/ESfai9kjmOoaq7S2R1LYA2ryTo.png` | partner-with-siena | 230x220 |
| `assets/55BFP7WLWw6osGequVvBvkx46dw.webp` | partner-with-siena | 700x700 |
| `assets/jgxUA35mrCLRb0iwb8BcsY6dXDg.jpeg` | partner-with-siena | 800x800 |
| `assets/gu1zj14SNJwi7rOAEYZn30u07r4.webp` | partner-with-siena | 696x726 |
| `assets/WPRfXHKYDK2h7CgolOLQBiOUni8.webp` | partner-with-siena | 700x700 |
| `assets/Keq3P6ZxODfXyfY0AxZzcEUA.png` | partner-with-siena | 1317x1920 |
| `assets/UeQwdt8s4GLxHWZsphG3MZH2950.svg` | partner-with-siena | 211.000x33.000 |
| `assets/LhW0MBO7jm6pAJD5z0S1BcxEulM.webp` | partner-with-siena | 700x700 |
| `assets/vfm2qZfHgAX4T4DGqEkII8Ml2Vg.webp` | partner-with-siena | 482x482 |
| `assets/seFp5JJrihyQheiUbDFhflvJmE.svg` | partner-with-siena | 128.000x40.000 |
| `assets/Kz9bZaq5rYbp21P6TDjfk0VSWIE.webp` | partner-with-siena | 700x700 |
| `assets/ArBCWxOfP3vBCKL9ojUO18QcOc.png` | partner-with-siena | 432x61 |
| `assets/CzG1z9NEKoxzFuwvHCh0Lfb0.png` | customers (card logo, already present) | |
| `assets/DysnuY3oWCVroJab1Mx73kkVg4.svg` | customers (card logo, already present) | |
| `assets/FAmVCc3xLG8QUhmtyJ3WkBGEeU.png` | customers (card logo, already present) | |
| `assets/LSDtiaYEMw66OjmYASlgwlerh24.svg` | customers (card logo, already present) | |
| `assets/NMMaJ8ZBHflI2DXZDaM4Bu6mY4.png` | customers (card logo, already present) | |
| `assets/NzrOnMRFggp1QzWUKXstLpP2yVI.png` | customers (card logo, already present) | |
| `assets/RQ1zB2lwHhPRGxGNWzIqaXLRRw.png` | customers (card logo, already present) | |
| `assets/SpxY1h6sqe6POaCpvGhqSGbxc.svg` | customers (card logo, already present) | |
| `assets/cS9mAOIRGNEPFez1Fy9VQGafsQ.png` | customers (card logo, already present) | |
| `assets/j9kAeRPVaxAXfulnduynsbiTc.svg` | customers (card logo, already present) | |
| `assets/k1nvbViWWUDVEBy2xaOAlUgRSq0.png` | customers (card logo, already present) | |
| `assets/laiTWK4LZfsnrVZHxmAiKK22g.svg` | customers (card logo, already present) | |
| `assets/qpbEcjUraVURA3hGESyeVuyZZN4.svg` | customers (card logo, already present) | |
| `assets/viVxpvqRgp5ynnq499GrMlfB0Ac.svg` | customers (card logo, already present) | |
| `assets/xm8gLEJzeS3t0TXpRyH46PEmocg.png` | customers (card logo, already present) | |
| `assets/zy9mRkyxKisAjEUf8L7kCRTiI.png` | customers (card logo, already present) | |
| `assets/abstract-landscape-moving-shapes.mp4` | nav mega-menu hover video (Resources/Company menu thumbnails, 110x61 `<video loop muted>`, plays on hover) — source https://4positiveimpact.b-cdn.net/Abstract%20Landscape%20Moving%20Shapes.mp4, 1.1 MB | mp4 |

Reused (already in public/assets): `MJbk4aQblPanJHyFV9X8Yg7JDqI.png` (title underline), `5VTp1YGCJLYo9Grib0Ouvyooeag.webp` (Metrics bg), `ERYNplIY591uk80wpoa4JGglO8.webp` (MainCta bg), `HB4OWZgksTQCHf8uTWf7S6EYSlE.webp` (SOC badge), homepage testimonial logos/photos, story-card logos.

Inline SVGs extracted (`<use>` sprites resolved, currentColor baked) — also backed up in `recon/company/svg-backup/` because a parallel agent wiped `public/svg` once during this run:

- `svg/about-us-flow.svg` (205x87 connector arrow)
- `svg/community-logo-00.svg` … `svg/community-logo-28.svg` (community ticker, DOM order)
- `svg/partner-ltvplus.svg`, `partner-horatio.svg`, `partner-arcticgrey.svg` (agency); `partner-gorgias.svg`, `partner-zendesk.svg`, `partner-kustomer.svg`, `partner-gladly.svg`, `partner-klaviyo.svg`, `partner-recharge.svg`, `partner-shopify.svg`, `partner-stayai.svg`, `partner-skio.svg`, `partner-ordergroove.svg`, `partner-intercom.svg`, `partner-prive.svg` (technology)
- `svg/refer-a-friend-step-line.svg` (2x52 step connector)
- `svg/form-select-chevron.svg` (16x16 up/down select chevron, fill #414D4F; from framerusercontent assets/PcC3vHrgoBRrBQoYZSOIpsOwp4.svg)
- Careers accordion chevron: inline `<svg width=16 height=16 viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>` (no file needed).
- Quote mark / slider chevrons: reuse existing `svg/quote-mark.svg` and the homepage slider chevrons.

Lottie: none on these routes. Fonts: no new families (see Global; Inter 700 weight used on /customers 'Filter by:').

## Not measurable / caveats
- /careers live job data: Ashby API is CORS-blocked on the live site, so only the component's built-in fallback list is visible (captured above).
- /events: CMS has no events, only the empty state renders; event-card design unknown.
- Form success states were not triggered (submitting would send real data to Siena's Framer forms backend).
- Customers mobile `<select>` option labels assumed equal to the desktop chips (All + 9 categories); not individually dumped.
