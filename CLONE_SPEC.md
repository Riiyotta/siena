Source: https://www.siena.cx/

# Siena AI homepage — Clone Spec

Target: React + Vite + Tailwind v3. Measured live with Playwright at 1440px and 390px (Framer site). Saved references: recon/full-1440.png, recon/nav-product-open.png, recon/lottie/*.json.

Companion files: `ASSETS.md` (asset manifest + missing downloads), `recon/svg/*.svg` (inline SVG logos/icons extracted from the live DOM), `recon/lottie/*.json` (feature-card animations), `recon/full-1440.png` (full-page reference), `recon/nav-product-open.png` (mega-menu reference).

---

## 0. Global

- Framer breakpoints (from `__framer__breakpoints`): Desktop `min-width:1200px`; Tablet `810–1199.98px`; Phone `max-width:809.98px`. Nav switches to the mobile variant at `max-width:767.98px` (hash 10nydvr); desktop nav shown `>=768px`.
- Page width at 1440: content is full-bleed sections with **96px horizontal padding** (content width 1248px). Document height at 1440: **11029px** (main 10595 + footer 434).
- body bg `#FFFFFF`. Page root is a flex column, gap 0.
- Section order + measured boxes at 1440 (y, height, bg):
  | Section | y | h | bg | padding | gap |
  |---|---|---|---|---|---|
  | Hero (includes both logo tickers at its bottom) | 0 | 900 | `#F3F0EB` rgb(243,240,235) | 0 96px | 10px (flex col, center/center) |
  | Testimonials slider ("The best CX teams work…") | 900 | 980 | transparent (white) | 80px 96px 40px | 72px (col, ai:center) |
  | Scroll Area (sticky 3 pillars) | 1880 | 2720 | white | 0 96px | 64px (row, jc:center, ai:flex-start) |
  | Metrics (25% / 98% / 90% / +94.7%) | 4600 | 853 | see §5 | | |
  | Customer Stories ("Teams delivering real…") | 5453 | 1076 | `#FAF7F1` rgb(250,247,241) | 80px 96px | 72px |
  | Features ("The agentic commerce platform") | 6529 | 2535 | `#FFFFFF` | 80px 96px | 72px |
  | Integrations | 9064 | 776 | `#FAF7F1` | 80px 96px | 72px |
  | Main CTA | 9840 | 755 | see §9 | 0 | 10px, overflow clip |
  | Footer | 10595 | 434 | see §10 | | |

### Color tokens (measured)
| token | value | used for |
|---|---|---|
| ink | `#122023` rgb(18,32,35) | primary text, buttons, announcement bar |
| ink-2 | `#2A3639` rgb(42,54,57) | secondary text (menu descriptions) |
| ink-3 | `#414D4F` rgb(65,77,79) | menu footer links |
| icon-grey | `#71797B` rgb(113,121,123) | menu icons |
| hero-bg | `#F3F0EB` rgb(243,240,235) | hero, menu tabs |
| cream | `#FAF7F1` rgb(250,247,241) | nav (scrolled), stories, integrations |
| sand | `#F4EDDE` rgb(244,237,222) | mega-menu "Menu Cluster" cards |
| sand-line | `#CDBCA0` rgb(205,188,160) | dividers |
| mono-label | `#605C53` rgb(96,92,83) | Geist Mono tags |
| ann-yellow | `#F2E59A` rgb(242,229,154) | announcement italic |
| ann-cream | `#EFE5D0` rgb(239,229,208) | announcement text |
| coral | `#F95040` rgb(249,80,64) | "Coming soon" |
| rainbow (button hover) | `linear-gradient(90deg, #F2E59A 0%, #FEC796 21.4087%, #FB5646 36.0976%, #827ACC 60.5158%, #2E79D8 89%, #294FBA 100%)` | |

### Fonts actually loaded on the homepage (document.fonts status=loaded)
- **Instrument Sans** 400/500/600/700 (Google; body/UI). woff2 (latin):
  - 400 `https://fonts.gstatic.com/s/instrumentsans/v4/pximypc9vsFDm051Uf6KVwgkfoSxQ0GsQv8ToedPibnr-yp2JGEJOH9npSTF-QfwmS0v3_7Y.woff2`
  - 500 `https://fonts.gstatic.com/s/instrumentsans/v1/pximypc9vsFDm051Uf6KVwgkfoSxQ0GsQv8ToedPibnr-yp2JGEJOH9npST3-QfwmS0v3_7Y.woff2`
  - 600 `https://fonts.gstatic.com/s/instrumentsans/v4/pximypc9vsFDm051Uf6KVwgkfoSxQ0GsQv8ToedPibnr-yp2JGEJOH9npSQb_jfykyw.woff2` (unicode-range U+0000-00FF…)
  - 700 `https://fonts.gstatic.com/s/instrumentsans/v4/pximypc9vsFDm051Uf6KVwgkfoSxQ0GsQv8ToedPibnr-yp2JGEJOH9npSQi_gfwmS0v3_7Y.woff2`
  - Simplest: Google Fonts `family=Instrument+Sans:wght@400;500;600;700`.
- **Feature Deck Web Light** 300 (display headings, h1) `https://framerusercontent.com/assets/PjL3a5FZOHVaFySlL6hHG308.woff2`
- **Feature Deck Web Light Italic** 300 italic `https://framerusercontent.com/assets/uYTN0wEwWxGH9s5Jtju5lojaUAY.woff2`
- **Feature Deck Web Regular** 400 `https://framerusercontent.com/assets/gv5jLP8AEnApvmeI7NNIvwIWRs.woff2`
- **Feature Deck Condensed Web Regular** 400 `https://framerusercontent.com/assets/idgMwx403kMgEkxY7H6X4PmhtCw.woff2`
- **Tiempos Text Regular** 400 (serif titles in menus/cards) `https://framerusercontent.com/assets/ovSMW3kMIp8TWyVM01c6WEwBSk.woff2` (italic: `0H28sSRAjligzhoQMhfSh8CwkA0.woff2`)
- **Geist Mono** 400 (uppercase tags/eyebrows) `https://fonts.gstatic.com/s/geistmono/v6/or3nQ6H-1_WfwkMZI_qYFrcdmg.woff2` (variable file; same URL for 700)
- **Font Awesome 6 Sharp Light** (icon glyphs in menus/cards) `https://framerusercontent.com/assets/hhrqHf9RbUQAYrvhsytTcmYL61I.woff2`; **Font Awesome 6 Brands Regular** `https://framerusercontent.com/assets/PXm4Cf2xmAxAUI2XyqpPI37qg.woff2`. (Icon glyphs are private-use codepoints; easiest to substitute equivalent inline SVG icons, or load the woff2 and use the same codepoints.)
- **Inter** 400/600 (CookieYes banner / minor widgets) `https://framerusercontent.com/assets/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2` (400 latin), `https://framerusercontent.com/assets/yDtI2UI8XcEg1W2je9XPN3Noo.woff2` (600).
- Declared but NOT used on the homepage: Fragment Mono, Lato, Inter Display, Instrument Sans Variable, FA Pro/Sharp Regular.
- Fallback stacks Framer emits: `"Feature Deck Web Light", "Feature Deck Web Light Placeholder", sans-serif`; `"Instrument Sans", "Instrument Sans Placeholder", sans-serif`; `"Tiempos Text Regular", serif`; `"Geist Mono", monospace`.

### Global motion primitive (Framer "appear" / scroll reveal)
From `__framer__appearAnimationsContent` (exact values):
- initial `{opacity: 0.001, y: 200}` → animate `{opacity: 1, y: 0}`, `type: tween`, `duration: 0.7s`.
- Hero H1: delay **0.2s**, ease `cubic-bezier(0, 0.91, 0.14, 0.85)`.
- Hero subtitle: delay **0.3s**, ease `cubic-bezier(0, 0.91, 0.78, 1)`.
- Hero CTA button: delay **0.4s**, ease `cubic-bezier(0, 0.91, 0.78, 1)`.
- Same values at all breakpoints. Respect `prefers-reduced-motion` (Framer skips them).

---

## 1. Announcement bar + Nav (desktop >=768)

Structure: a single `position:fixed; top:0; z-index:8` wrapper, `max-width:1440px`, width 1200px at 1440 viewport, centered (left:50%, translateX(-50%)). Both the announcement bar AND the nav pill are inside it and stay fixed together (the announcement does not scroll away). Inner `<nav>`: flex column, gap **8px**, padding `0 16px` → children 1168px wide (x=136 at 1440).

### Announcement bar (`<a href="https://www.siena.cx/blog/siena-raises-17m-series-a">`)
- Box: 1168 x 43, bg `#122023`, radius `0 0 16px 16px`, padding `12px 32px 12px 72px`, flex row center/center, gap 3px (4px when nav is scrolled — negligible).
- Text 1: "We raised a $17M Series A" — Feature Deck Web Light Italic, 300 italic, 16px / 17.6px, color `#F2E59A`.
- Text 2: "to build The Agent of Record for consumer brands" — Instrument Sans 400, 16px / 19.2px, ls -0.16px, color `#EFE5D0`.
- Mobile: hidden-10nydvr hides this whole desktop nav at <768; see §11 for mobile.

### Nav pill
- Box 1168 x 64, radius 16px, padding `0 8px`, overflow clip. Inner row: flex, space-between, align center, padding `8px 0`.
- Top state (scrollY < ~150): bg `rgba(250,247,241,0)` (transparent), no shadow.
- Scrolled state (switches between scrollY 150–160; measured threshold 160): bg `#FAF7F1` + shadow:
  `rgba(0,0,0,0.22) 0px 0.602px 1.325px -1.583px, rgba(0,0,0,0.19) 0px 2.289px 5.035px -3.167px, rgba(0,0,0,0.01) 0px 10px 22px -4.75px, rgba(0,0,0,0.2) 0px -0.301px 1.024px -1.417px, rgba(0,0,0,0.17) 0px -1.144px 3.891px -2.833px, rgba(0,0,0,0.04) 0px -5px 17px -4.25px`.
  Transition measured by rAF: bg alpha 0 → 0.03 @66ms → 0.24 @116 → 0.86 @166 → 0.98 @215 → 1 @264ms, i.e. **~250ms ease-in-out** (use `transition: background-color .25s ease-in-out, box-shadow .25s ease-in-out`). Reverses when back at top.
- Logo (left): link 130x34, padding-left 8px; logo graphic 122x34 (SVG wordmark "siena", see ASSETS).
- Links group: absolutely centered in the pill (center x = 720), 656px wide, flex row, **gap 56px**, align center. Items: Product ▾, Customers, Resources ▾, Partners ▾, Company ▾. Dropdown items: link 40px tall, padding 5px 0, gap 5px between label and 14x14 chevron icon.
  - Label: Instrument Sans 500, 16px / 16px, color `#122023` (Framer renders some as #000).
- CTA "Book a demo" (nav, size "md"): 128 x 48, padding 16px, radius **12px**, bg `#122023`; label Instrument Sans 500 16px/16px white. Hover → rainbow gradient (see tokens), swap is effectively instant (rAF shows the gradient switching in one frame).

### Mega-menu (hover on Product / Resources / Partners / Company)
Reference screenshot: `recon/nav-product-open.png`.
- On hover, the SAME nav pill grows in height (64 → **491px** for Products) with bg `#FAF7F1` + the shadow above, layout becomes column: header row (64) + Menu Area (padding `16px 8px 0`, flex row, gap 40px) + Menu Footer.
- Timing (rAF): pill height animates 64→491 in ≈70ms (very stiff spring), then panel content fades opacity 0→1 and translateY −172px→0 over ≈120ms (done ~130ms after hover start). Implement: height `transition .2s cubic-bezier(.2,.8,.2,1)`, content `opacity/transform .2s ease-out` with ~40ms delay.
- Products panel: 3 columns of 379px, gap 16px.
  - Column eyebrows ("AI AGENTS", "INTELLIGENCE", "CAPABILITIES"): Instrument Sans 600, 16px / 22.4px, ls 1.7px, uppercase, `#122023`.
  - Menu item card 379x65: 20px FA icon in a box at left (icon col ~56px), title Tiempos Text Regular 400 18px/23.4px ls −0.18px `#122023`; description Instrument Sans 400 14px/15.4px `#122023`. Vertical gap between items 16px.
  - Col 1 items: Customer Service Agent / "Empathic AI for support"; Shopping Agent / "Turn converations into purchases" (sic); Reviews Agent / "Put review management on autopilot". A pill badge "Coming soon" (bg #fff, radius 24px, padding 4px 8px, gap 8px, text Instrument Sans 400 12px/18px `#F95040` + 12px icon) floats over the Shopping/Reviews area.
  - Col 2: QA Agent ("Coming soon" 14px coral) / "Score every conversation automatically"; Quality Assurance / "Score every conversation, automatically"; Topics Explorer / "Your VoC Tool built on real conversations"; Ask Siena / "From insights to a better-built Siena".
  - Col 3 "CAPABILITIES": Menu Cluster card bg `#F4EDDE`, radius 16px, padding 24px, gap 16px; entries: 24px icon slot (16px FA icon `#71797B`) + title Instrument Sans 500 16px/16px `#122023`, description Instrument Sans 400 14px/15.4px `#2A3639`. Entries: Video — "Siena watches, understands, and resolves"; Order Tracking — "Native tracking across 2,000+ carriers" (+ others in the card).
- Menu Footer: padding 24px 16px, gap 24px; 1px divider `#CDBCA0`; row space-between: left "View Integrations" (16px icon + Instrument Sans 500 16px `#414D4F`, gap 4px); right: "Works with" (Instrument Sans 400 14px `#2A3639`) after tags SHOPIFY / ZENDESK / YOTPO / RECHARGE (pill 24px tall, padding 2px 12px, radius 50px, bg `#F3F0EB`, text Geist Mono 400 10px/14px ls 0.5px uppercase `#605C53`), gap 10px, then "+ more" link.
- Resources panel: left column 261px (eyebrow RESOURCES + cluster card with Blog, Community, Events, Webinars, Certification, ROI Calculator; entries gap 29px), right column "LATEST BLOG POSTS" with 3 cards 269x358 (max 320) gap 16px: author line "Written by" 12px/18px rgba(0,0,0,.5) + name 500 12px `#122023`; title Tiempos Text Regular 20px/28px #000. Posts: "Siena Social Agent: The AI Agent for Social Media Management", "Siena Raises $17M Series A to Build the Agent of Record", "Ask Siena. The first AI agent built for brand operators".

---

## 2. Hero (1440: 0–900)

- Section: `height:100vh`-like fixed **900px** at 1440x900 (it is 900 at viewport 900; treat as `min-height: 100vh`, Framer sets 100vh), bg `#F3F0EB`, padding `0 96px`, flex column, justify/align center, gap 10px, `position:relative`, overflow visible.
- Text block (z 2): max-width **1062px**, flex column center, gap **40px** between (heading+sub group) and button. Heading+sub group gap **24px**. Block top at y=281 (vertically centered in 900).
  - H1 "The AI CX operating system for consumer brands" — **Feature Deck Web Light 300, 80px / 80px, letter-spacing −0.8px**, color `#122023`, center. Box 1062x160 → wraps to 2 lines ("The AI CX operating system" / "for consumer brands").
  - Subtitle "One intelligence layer powering agents across every customer surface." — Instrument Sans **500, 20px / 28px, ls −0.2px**, `#122023`, center, max-width **485px** (2 lines, 485x56).
  - CTA "Book a demo" (size "xlg"): 157 x 58, padding **18px 24px**, radius **16px**, bg `#122023`; label Instrument Sans **600 18px / 21.6px** white. Hover → rainbow gradient (instant).
- Decorative images (z 0, absolute, NOT animated on load or scroll — transforms measured `none` at scroll 0 and 400):
  - Right: "Siena 2" `jBdT2KuAbfPtfHNsxcWh0L50xk.webp` (800x984 natural) — box `top:13px; left:810px; right:0; bottom:50px` → 630x837 at 1440, max-width 800px, `object-fit: cover`.
  - Left: "image" `rYyvabwLjN7jv9XBL68Sm664.webp` (800x1025 natural) — box `top:0; left:-382px; width:800px; bottom:53px` → 800x728, `object-fit: contain` (mostly off-canvas left; visible part x 0–418).
  - The left edge positions are in px relative to section; at <1440 keep left `-382px` and right image anchored `right:0` with left = 56.25% (810/1440).
- "Blur out" fade under the hero: absolute `top:852px; left:0; right:0; height:441px`, `background: linear-gradient(0deg, #FFFFFF 0%, #F3F0EB 84%)`, z 0 — it overlaps into the next section, creating the beige→white blend.
- **Logo tickers** (part of hero): container absolute `top:796px; left:0; right:0; height:96px`, flex column, space-between, overflow hidden, z 1. Two rows, each 1440x33, rows at y=796 and y=859. No edge mask (mask-image none).
  - Each row: flex row, align center, **gap 112px** between logos; list duplicated for seamless loop.
  - **Row 1 moves RIGHT (left→right) at 30 px/s; Row 2 moves LEFT at 30 px/s** (rAF-measured: +30.0 and −30.0 px/s). Linear, infinite, no hover pause observed. Logos rendered at 24px height mostly (some 32/33px for square/SVG marks), full color as provided (opacity 1, no filter).
  - Row 1 order (rendered WxH, file): FIGS 108x24 `f15R92EBkjPHx4ABojD1VWldk54.png`; grüns 64x24 `BYD0tOgABiRk8bVwCxbpUE5hDs.png`; Comfrt 99x24 `I79jHrog8xkJyLdp6KBEDj6Ywjk.png`; equip 76x32 inline SVG; (logo) 143x22 inline SVG; (logo) 98x25 SVG data-URI bg; Needed 32x32 inline SVG; Kit.sch 122x24 `AB6e3uLpTQG8MoiIYeswvgR1GA.png`; (logo) 137x32 inline SVG; Coterie 113x24 `NGj7RyixG3yYMakHsu1cO8b6klI.png`; Spanx 128x25 `ipTDxCOrcnVCeET6yx6vSIolM.png`; HULKEN 156x33 inline SVG; HEXCLAD 132x24 `MnVE0BFmVRvV32TDagBO3MssNY.png`; SIMPLE MODERN 67x24 `i2qCrmnuVe4OD7RkXFSbqnY0o.png`; BANDIT 125x24 `rOc0IEQNBGJ76FgKzvRKGjbcbGg.png`; dossier 122x24 `fdkHiF9k6hfvcOWgBULP1tDgg.png`; BPN 75x24 `aBQONPNCeQCU0SqkWRHkXpSoNk.png`; IMAGE 68x24 `01c5Ez5C3s4VcuLV6gPlc8yB5c.png`; TRUE SEAMOSS 61x24 `BF4xUaeD4YUpgGlCeLKENEShs.png`; thrive 54x24 `GrSuxeP4qHZfVZMHtiRVRUQ0.png`; brooklinen 140x24 `WZUVOxO5CPk8xzCiAVuV7qeY4.png`; THUMA 116x24 `xNHZgR86NWvMO4uy5gMz1IaAN2k.png`; madhappy 155x24 `DwE5NbsNDqCLV0O8FiYnNwd5J9Q.png`; Prose 76x24 `tsgaXgk1czp5NS3XVEmeI6TMltY.png`; Create 109x24 `vtOMWVl8Yp4AVppVcHxc4tGpNo.png`; earth breeze 33x24 `zeY8w7ISWrHStJnkXCdAnzIaxJY.png`; (logo) 81x24 `HOcdDOlX0hJ6EU68vfvBF5jCUGE.png`.
  - Row 2 order: (logo) 45x24 `Aq6DzXdXu4MIKIcTeI2owZxxhQ.png`; LSKD 131x32 SVG; Boll & Branch 34x33 SVG; BUTCHERBOX 284x25 `6WBJxjksOnKu3mL0PsTPuQADs.png`; canopy 80x24 `bzS2XUgsscNzELr0gNAayVKekY.png`; thrive cosmetics 68x32 SVG; (logo) 126x32 `mU9foxMbfbNFjX55TF6RML94o5w.png`; bobbie 80x30 SVG; chomps 96x29 SVG; Bombas 151x23 SVG; MUD/WTR 130x24 `b2mO2fGmA8ARZmKgdykvpeAPrg.png`; CORNBREAD 24x25 `G7lpPlrCCK1xV0p0XWoTqux6a8U.png`; Windmill 154x24 `0CkQpG5EAX41ml1wF3tjjPdotQ.png`; Fresh Clean Threads 241x24 `mDzDj68vfBprOTH463ChzCX4ta0.png`; martie 114x24 `AbK666gYUVOE6etVCauHftBiDw.png`; (logo) 153x32 SVG; Swappie 96x24 `hHeTF32MpR3bsAzmupGcNyzumJE.png`; Audien Hearing 112x25 `m5Kqr62Erb3p4vigoPO8AQoO4.png`; mellow 114x25 `WJ2PkYGeJwYvXglVbDo5EJbwA.png`; cuts 71x24 `fjLrxICsMQHzaBjdYLxrrdrM3G4.png`; Terra Kaffe 113x24 `6TcxRVWhKfaQLssEe0VL9Rz3jE.png`; goody 84x24 `509GeCyOIKTykzHVuIYfbXEVRs.png`; Loftie 82x24 `ucZZwgyXL4NtHMRCxf3UVY15Z8.png`; goodprotein 119x25 `q4mMPfBgmsWhR5QXDWppAKW4LQ.png`; Hero 47x24 `3o2qMi9la5gCGIKiRiCV9lmGojc.png`; ANTLER 45x24 `paeH4OeAad02akgwspGrjBHzQ.png`; sheertex 97x24 `uKIlrqsg58S1O0V1EsLphiI5er4.png`; BUTCHERBOX 224x25 `WgL5fhIpF14sixWUViAY9qNxhE.png`.
  - Inline-SVG logos were extracted to `recon/svg/` (see ASSETS.md) — use them as-is.
- Load motion: H1 / subtitle / button use the appear primitive (y 200→0, opacity 0→1, 0.7s; delays 0.2/0.3/0.4s; easings in §0). Images, tickers and nav have no entrance animation.

---

## 3. Testimonials slider (1440: y 900–1880)

- Section: flex column, align center, **gap 72px**, padding **80px 96px 40px**, bg transparent (white page; hero "Blur out" gradient overlaps its top 441px), overflow hidden.
- Title block: max-width 758px, flex column center, gap **24px**.
  - Eyebrow "CUSTOMER STORIES": Instrument Sans **600, 16px / 22.4px, ls 1.7px, uppercase**, `#122023`, center. (This "eyebrow" style is reused site-wide.)
  - H2 "The best CX teams work with Siena": **Feature Deck Web Light, weight 400 (font file is the Light cut), 64px / 64px, ls −1.28px**, `#122023`, center; 758x128 (2 lines). (This H2 style is reused for all section titles.)
- Slider wrapper: 1248 wide, flex column center, gap 40px, overflow hidden → inner component max-width **1008px** (x 216–1224), padding **16px 32px 48px** → content 944px wide.
  - Controls row (top, centered, 40px tall): [Prev btn] gap 12px [counter] gap 12px [Next btn]. Buttons 40x40, radius 40px, bg `rgba(244,237,222,0.6)`, no border; chevron SVG at 45% size (18x18), viewBox 0 0 24 24, `fill:none; stroke:#A7A092; stroke-width:2.5; round caps/joins`; Prev polyline `15 18 9 12 15 6`, Next `9 18 15 12 9 6`.
  - Counter: "1" + " / 11" — Inter 400 14px / 16.8px `#122023`; the " / 11" span opacity 0.4.
  - Gap controls → slide: 24px (slide top at +64 from controls top).
- Slide (944 x 486): flex row, justify center, align flex-start, **gap 40px**:
  - Left column 452 wide (max 600), flex column, justify center, **gap 32px**:
    1. Quote mark glyph 30x24 (SVG, `“`) color ink.
    2. Quote text: Instrument Sans **400, 25.6px / 33.28px, ls −0.512px**, `#122023`.
    3. Brand block (gap 16px): brand logo slot 140x64 (`object-fit: contain`, left aligned); person block (gap 12px): name Instrument Sans **500 20px / 28px ls −0.2px**; role Instrument Sans **600 16px / 22.4px ls 1.7px uppercase** `#122023`.
    4. Optional "Read full story" button (Secondary / md): padding 16px, radius 12px, bg `#FFFFFF`, border 1px solid `#A7A092`; label Instrument Sans 500 16px/16px `#122023`.
  - Right: image 452x452, radius **32px**, `object-fit: cover`. Slide 1 additionally has a centered 56x55 play badge (43x43 circle SVG + 15x19 play triangle) over the image (decorative; no video element found in the DOM).
- Slides (11, in order; logo file, image file):
  1. Kylah Field — VP of Global CX & Insights at Spanx — `L2fbLFnO4rG3Y9WhTn2Zmg90Q.png`, `fNESOQNYixOgXSJEMtuui0Hx9FY.webp` (+play badge). "Siena felt like a girlfriend from day one. It handles 50% of our conversations at 90%+ CSAT, cut handle time in half, and customers ask for it by name. I'm winning budget conversations against marketing because I can tie CX directly to revenue."
  2. Luka K. — CMO — `zy9mRkyxKisAjEUf8L7kCRTiI.png`, `14BhRmpWpVdupNzRDWDyl6HLiXo.jpeg`. "We nailed the marketing engine, but we had a massive gap understanding the customer after the order hit the door. Fifteen minutes with Ask Siena told us what people actually wanted: to try other flavors without committing to a full jar. That became a sampler stick pack. It's now going into Whole Foods, Target, and Sprouts."
  3. Jordan Cyphert — CX Lead, Grüns — `rkQSVnRUYjX0Hlg02GThujHqHA.svg`, `kPr9cRN3VBdtgk6KmaZZRhIY4.png`. "When we launched at Costco, we built a weekly voice-of-customer report for the retail team with Ask Siena. That kept the whole company looped in on what customers were saying in real time, instead of waiting for an NPS survey to come in. AI isn't replacing the team. It's letting them focus on the conversations that actually need them."
  4. Jeremy Thurswell — COO — `ZCj576JNrFiZ427q7v0w8UiiZtg.svg`, `mSwCeM9m9qrwUvrpjLLD0jdLc0.webp` — link ./customer-stories/kitsch. "We found Siena to be the most powerful solution for AI customer support. The nice thing is that we were able to take Siena and all the training we did with it and move it to a more enterprise CX platform that better suited our needs."
  5. Paige Zachs — VP Supply Chain, Operations & Customer — `CzG1z9NEKoxzFuwvHCh0Lfb0.png`, `Z4VsshvZYNbyXEEsuHV3JcIQxjU.webp` — ./customer-stories/siena-ai-customer-service-automation-coterie. "With Siena, we've shifted CX from being a cost center to a revenue driver. That transformation has been a game-changing unlock for our business."
  6. Todd Baxter — COO — `xAzAxHg9uu56tJLbvkJPJvd1e8.svg`, `lV428mPWufYALmrhx8ICYhS9ug.png`. "If you’re apprehensive about AI, just test it out. I have not seen a single person disappointed by it. I know companies using Siena and I’ve not heard one person have a bad experience with it. It will definitely change your customer service department for the better."
  7. Andrew Jobson — Global Head of Customer Support — `DysnuY3oWCVroJab1Mx73kkVg4.svg`, `nNMta3dpfWXvxbQtC7D3o7fNw.webp` — ./customer-stories/hexclad-customer-service-automation. "As Global Head of Customer Support at HexClad, my bar for AI is simple: it must scale without sacrificing experience. During our Q4 volume surge, Siena AI handled high-ticket volume while staying on-brand, helping us maintain quality and protect CSAT when it mattered most. Siena is a true force multiplier for modern support."
  8. Jessica Weiss — CX Lead Product Partner — `66oijjynMEzxJycxZmwXpzxdwfk.png`, `CSFOwfJPv9MTZrAS0E4tQAAy1Y.webp` — ./customer-stories/prose. "The quality of response that Siena comes up with is phenomenal. We've even taken inspiration from her responses and added them to our existing customer-facing communications."
  9. Beatriz Lopes — Head of Customer Experience — `ikIL7p9YfMlpheplknlVvSqmzeI.svg`, `nwyJSyodbx9qhQYvMPKpR7DXyk.webp` — ./customer-stories/everday-dose. "Siena’s unique responses are what people love most. We’ve had customers say her answers inspired them to purchase, because they just felt so comfortable with her. They feel that safety with Siena, which helps them purchase."
  10. Bryan Porter — Co-founder, Chief eCommerce Officer — `pdpeaTrKFMv0hrJBF3RGbQ0ErwM.png`, `L3duexlM5SB9tib8w9MTlnCfdlo.webp` — ./customer-stories/simple-modern. "We chose Siena because it has the best admin UI, offers great control over automations, and is built specifically for eCommerce. It allows our in-house team to focus on complicated tickets while providing 24/7 support."
  11. Cate Marques — CXO — `FAmVCc3xLG8QUhmtyJ3WkBGEeU.png`, `WVZA37Bad6K0ss9JDOjwLhH2aUs.webp` — ./customer-stories/terra-kaffe. "Since implementing Siena, we've taken back the time we spent on high ticket volume and expanded our team's roles across marketing and product development. It's transformed how we operate."
- **Behavior (measured):** NO autoplay (counter static for 20s+). Prev/Next buttons only (loops, 11 → 1). Transition = horizontal slide: outgoing slide translateX 0 → −944px while incoming slides in from +944px → 0, both visible during the move, opacity stays 1; duration **≈300ms**, symmetric ease-in-out (samples: 2% at 10%, 10% at 25%, 50% at ~50%, 97% at 90% of time) → use `transform .3s cubic-bezier(0.45, 0, 0.55, 1)`. Slide viewport clips (overflow hidden on the 1248 wrapper).

---

## 4. Sticky "Scroll Area" — 3 pillars + chat mock (1440: y≈1880, height 2720)

Note: absolute y of this and later sections shifts ±22px depending on which testimonial slide is active (slide height varies). Heights are stable.

### Layout
- Section: flex **row**, justify center, align flex-start, **gap 64px**, padding `0 96px`, height 2720, bg white.
- Left "Content" column: width **512px** (max 512), flex column, gap 10px. Contains 3 blocks, each **512 x 900**, flex column, justify center, align flex-start, **gap 32px**, z 1. Blocks at section offsets 0, 910, 1820.
  - Inside each block: [H2] gap 24px wrapper → H2; [bullets list] (flex column, gap **12px**); [CTA "Book a demo" xlg button 157x58, → ./book-a-demo].
  - H2: Feature Deck Web Light (weight 400 declared), **64px / 64px, ls −1.28px**, `#122023`, **left aligned**, width 512 (2–3 lines: 128 or 192 tall).
  - Bullet row: flex row, align center, gap **10px**; 24x24 four-point star outline icon (SVG below, stroke `#122023` 1.5, round); text Tiempos Text Regular 400 **18px / 23.4px, ls −0.18px**, color `#2A3639`, width 478.
  - Block 1 — "The CX platform built for agents": • AI agents that run support, shopping, social, QA, and VoC • One system to consolidate your full CX stack • Designed for AI from day one. Platform agnostic
  - Block 2 — "Brand intelligence that unlocks growth at scale": • Turn customer interactions into strategic business insights • Activate intelligence across teams to drive revenue and retention • Delight customers by anticipating needs better than anyone else
  - Block 3 — "Your brand voice unified across all channels": • AI Personas built on your tone, voice, and customer language • Channel-specific design that holds together as one brand • Every interaction reinforces what makes your brand yours
  - Star icon SVG: `<svg viewBox="0 0 24 24" fill="none"><path d="M14.9848 14.9828L12.7029 21.2585C12.6496 21.402 12.5537 21.5258 12.428 21.6132C12.3023 21.7006 12.1529 21.7475 11.9998 21.7475C11.8467 21.7475 11.6973 21.7006 11.5716 21.6132C11.4459 21.5258 11.3499 21.402 11.2967 21.2585L9.01854 14.9828L2.74292 12.701C2.59938 12.6477 2.47559 12.5518 2.38818 12.4261C2.30076 12.3004 2.25391 12.1509 2.25391 11.9978C2.25391 11.8447 2.30076 11.6953 2.38818 11.5696C2.47559 11.4439 2.59938 11.348 2.74292 11.2947L9.01854 9.01659L11.3004 2.74096C11.3537 2.59743 11.4496 2.47364 11.5753 2.38623C11.701 2.29881 11.8504 2.25195 12.0035 2.25195C12.1566 2.25195 12.3061 2.29881 12.4318 2.38623C12.5575 2.47364 12.6534 2.59743 12.7067 2.74096L14.9885 9.01659L21.2642 11.2985C21.4077 11.3517 21.5315 11.4477 21.6189 11.5734C21.7063 11.6991 21.7532 11.8485 21.7532 12.0016C21.7532 12.1547 21.7063 12.3041 21.6189 12.4298C21.5315 12.5555 21.4077 12.6514 21.2642 12.7047L14.9848 14.9828Z" stroke="#122023" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
- Right "Sticky" column: **`position: sticky; top: 0`**, width 512 (max 512), height **900** (=100vh), padding **110px 0 40px**, flex row center/center, z 1. It pins from section top until section bottom (pinned for 2720 − 900 = **1820px** of scroll), then scrolls away with the section end.
  - Chat mock card: **512 x 647**, radius **24px**, padding **56px**, flex column center, gap 16px; background is a full-bleed `<img>` (`object-fit: cover`, radius 24px). Card top sits at viewport y=162 while pinned.

### Pillar switching (scroll-driven, discrete)
- The card has 3 variants ("Homepage 1/2/3"). It switches when the next left block's top edge crosses ~**50% of the viewport** (measured: v1→v2 between section-scroll 450–600, block 2 top at 910 ⇒ ≈ viewport y 360–460; v2→v3 between 1350–1500, block 3 top at 1820). Implement with IntersectionObserver on each left block, `rootMargin: '-50% 0px -50% 0px'`, active = last intersecting block. Scrolling back up reverts (variant 1 replays when returning).
- Background image swaps **instantly** (no crossfade measured). Card size doesn't change.
- Message entrance per variant (rAF-measured): each message row animates from `opacity:0; translateY(+50px)` (first row of v1 and all rows of v2 from **+80px**) to `opacity 1; y 0`, spring-like ease-out with ~1px overshoot; visible motion ≈ **450ms**, settled by ~750ms. Use `transition: opacity .5s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.34,1.2,.64,1)` (or framer-motion spring stiffness≈300, damping≈30).
  - **Variant 1** (bg `OS7uIQBhEtXd5l7MXZ0qAcM0Lg.png` 512x647): 5 rows, start delays **0.5s, 1.0s, 1.5s, 2.0s, 2.5s** (stagger 0.5s). Rows (column, gap 16px, width 400):
    1. Customer (left, align end): avatar 40x40 round (`D3TQ38q4HpOxmxHoD1u1AW40NI.png` + overlay `RmeNSvdDwpHmyiquwjkQ8HlXlI.webp` 38x40) + bubble bg `#F3F0EB`, radius 16, padding 20, max-width 380 (350 wide): "Hey! Need help with an order I placed yesterday—I forgot to apply my discount code."
    2. Siena (right, justify end): bubble wrapped in 2px gradient border (`linear-gradient(255deg, #F2E59A 0%, #FEC796 14.8649%, #FB5646 32.8829%, #827ACC 52.2523%, #2E79D8 79.7297%, #ABABAB 100%)`, radius 16, padding 2) with inner bg `#EFE5D0`, radius 15, padding 20 → "No worries! I’ve got your order pulled up. I can apply the code “WELCOME15” and refund the difference—ready to go?" + Siena avatar 40x40 circle bg `#122023` with 12x13 "S" glyph (fill `#F3F0EB`).
    3. Customer: "Yes please! Appreciate it."
    4. Siena: "Done. Also noticed you’ve bought from our skincare line twice—our new serum just dropped and it’s a perfect match. Want me to add it to your cart with 10% off?"
    5. Customer: "Omg yes! That sounds amazing."
    - Bubble text: Tiempos Text Regular 400 **14px / 18.2px** `#122023`. Rows gap 10px between avatar and bubble; rows align flex-end (avatar bottom-aligned).
  - **Variant 2** (bg `9jAbqJZIRcnPqEcOjQ13ZPF0.webp` 875x1060): content width 360, gap 16px. Elements and start delays: customer bubble **0.35s** ("Can you recommend a product based on my latest orders?"), product card **0.55s**, Siena message **0.95s** ("Based on your recent orders, I think you'd love the Grüns Superfood Gummies in Original. Want me to add it to your next order?").
    - Product card: 2px gradient border (same gradient), inner bg `#FFFFFF`, radius 12, padding 12, gap 8, `backdrop-filter: blur(9.6px)`; product image `crEVK41xfvkW8gCYsrdnhKe7sK8.png` 95x91 absolutely at top −32px, right 0 (overflows card top); title "Grüns Superfood Gummies" Tiempos 18px/23.4px ls −0.18px `#2A3639`; "Flavor: Original" Instrument Sans 400 12px/18px `#122023`; 1px divider `#CDBCA0`; row space-between "Order No. #48156" / "Estimated: June 14" Instrument Sans 400 12px/18px `#71797B`.
  - **Variant 3** (bg `HrlKm73yASgQyND1oNoZ1Ub0Kj4.jpg` 512x914): "Personas" widget 400 wide, gap 16px, no staggered entrance measured.
    - Persona chips row (inside gradient-border card, inner bg `#F3F0EB` radius 16 padding 16; row gap 12px, overflow auto): chip = padding `4px 12px 4px 4px`, radius 12px, gap 10px, 36x37 avatar img + name (Tiempos 18px/23.4px bold `<strong>`). Selected chip: bg `#FFFFFF`, opacity 1; others: bg transparent, **opacity 0.4**. Chips are **clickable** (cursor pointer) and switch the persona.
      - Mabel `BilPHEdCbXjLRA68eDP6iIsgBao.webp`, Jessie `k7qGhbcvDgF5iYvCPZyc89zQOKQ.webp`, Yogi `v2nN38JC5smUrR0AjXOvYcJtKzE.webp`, Sami `k7qGhbcvDgF5iYvCPZyc89zQOKQ.webp`.
    - Message card (gradient border, inner `#F3F0EB` radius 15 padding 16 gap 24): trait tags row (gap 4px): pill padding `4px 14px` radius 50px, Geist Mono 400 10px/14px ls 0.5px uppercase; active tag bg `#122023` text `#F4F5F5`; inactive transparent, text `rgba(0,0,0,0.5)`. Body Tiempos 14px/18.2px `#122023`.
      - Mabel (default): tags KNOWLEDGABLE*, CHATTY, PASSIONATE, BARISTA. Body: "Hi Sammy,\n\nMaking our Mushroom Latte is easier than you might think! Just scoop the powder into a cup or dose mug, add enough water to cover the powder ad mix. Then add your preferred milk and stir it all together! Sit back, relax, and savor your newfound elevated feeling.\n\nBest,\nMable at Everyday Dose"
      - Jessie: tags MINDFUL*, INSIGHTFUL, HONEST, EDUCATIONAL. Body (as live site shows): "For hot yoga, I’d recommend pairing your practice with a full yoga mat towel, which is designed to absorb sweat and prevent any pooling of sweat on the mat, making your practice more comfortable.\n\nNamaste,\nYogi, Customer Care at YF"
      - Yogi: tags ADVENTUROUS*, EXPERT, SMART, OPTIMISTIC. Body: "We love the idea of making your Swoverall even more unique to you. We offer custom embroidery or screen printing for bulk orders on a case-by-case basis. Let's create something special together! 🎉👕🎨\n\nCheers,\nJessie at Waves"
      - Sami: tags PLAYFUL*, HAPPY, RESOLUTE, HELPFUL. Body: "Our fresh food contains a variety of nutritious ingredients, such as chicken, pumpkin, kale, and blueberries, which support your dog's overall health and well-being. Plus, it's packed with vitamins and minerals to help your Cavalier King Charles thrive. Would you like to try a sample pack for your pup? 🐶\n\nChat soon,\nSami at Treats"
      (Jessie/Yogi bodies look swapped on the live site; copied as observed.)
- Left blocks themselves have no scroll-reveal (opacity 1 throughout).

---

## 5. Metrics (1440: y≈4600, height 852)

- Section: flex row center/center, gap 64px, padding **80px 96px**, overflow hidden, `position: relative`.
  - Background: full-bleed `<img>` `5VTp1YGCJLYo9Grib0Ouvyooeag.webp` (1440x736 natural) absolutely filling the section, `object-fit: cover`.
  - Bottom fade "Blur out": absolute `left:0; right:0; bottom:0; height:187px` (top 665.4px), `linear-gradient(0deg, #FAF7F1 0%, rgba(255,255,255,0) 100%)`, z 3 — blends into the cream Stories section below.
- Card ("Title"): 1248 x 692, max-width 1328, bg `#F3F0EB`, radius **48px**, padding **64px**, flex column center, **gap 40px**, z 1.
  - Top row (1120 x 390): flex row, align center, **gap 64px**, overflow hidden.
    - Big number group (421 wide): flex row center, gap 14px: animated counter "80" in a 260x390 box + "%" (147x260).
      - Counter: Feature Deck Condensed Web Regular 400, **260px, line-height 1.5em (390px)**, ls 0, `#122023`, `font-variant-numeric: tabular-nums`.
      - "%": Feature Deck Condensed Web Regular 400, **260px / 260px**, `#122023`.
    - Text group (635 wide): flex column center, gap 14px:
      - H2 "Brands using Siena automate up to 80% of customer interactions, achieving faster response times, quicker resolutions, and higher customer satisfaction." — **Feature Deck Web Regular 400, 40px / 48px**, ls normal, color `#000000`, left aligned, 635x240 (5 lines).
      - Hand-drawn underline swash `2qwkMa62FY4R6JZFtpnkwc613e8.svg` (237x13 natural) rendered **241x17**, horizontally centered under the H2, 14px below it.
  - Stats row (1120 x 134): flex row, justify center, **gap 40px**; 3 columns each **347 wide**, flex column, align flex-start, gap **16px**, padding-top **32px**:
    - Value: Feature Deck Condensed Web Regular 400, **64px / 64px**, `#122023` — "98%", "90%", "+94.7%" (static text, no count-up).
    - Label: eyebrow style (Instrument Sans 600 16px/22.4px ls 1.7px uppercase `#122023`) — "FASTER RESPONSE TIME", "FASTER RESOLUTION TIME", "AVERAGE CSAT".
- **Count-up (from the Framer component source, exact props):** `from: 25, to: 80, duration: 1.5s, ease: easeInOut ("smooth"), decimalPlaces: 0, once: true, playOnLoad: false` → starts when the counter enters the viewport (framer-motion `useInView(ref, {once:true})`, default amount = any pixel visible). The counter element also fades `opacity 0 → 1` via `whileInView` (default framer-motion transition, ~0.3s). Only the "80" counts; the three stats are static.

---

## 6. Customer Stories carousel (1440: y≈5453, height 1076)

- Section: bg **`#FAF7F1`**, flex column center, **gap 72px**, padding **80px 96px**, overflow hidden.
- Title block (max-width 758, gap 24px, centered): eyebrow "CUSTOMER STORIES" (eyebrow style); H2 "Teams delivering real results with Siena" (Feature Deck Web Light 64/64 ls −1.28 center, 758x128); an empty subtitle paragraph (Instrument Sans 500 20/28, opacity 0.82, max-width 680, contains only `<br>`) → occupies 28px; keep a 28px spacer to preserve the 226px title height.
- Carousel outer: 1248 wide, gap 40px. Inner "content" panel: **1200 wide (max 1200), bg `rgba(255,255,255,0.5)`, radius 48px, padding 24px 16px**, z 3. Inside: slideshow with padding **16px 32px 48px** → track 1104 wide.
  - Track: flex row, align stretch, **gap 16px**; shows **2 cards per page** (each **544 x 458**). 14 cards → 7 pages.
  - Controls row below the cards (24px gap; row 40px tall, centered): Prev/Next round buttons identical to §3 (40x40, `rgba(244,237,222,0.6)`, chevron stroke `#A7A092` 2.5) with **12px** gap; no counter here.
- Story card (`<a>` to the story URL): 544x458, bg `#FFFFFF`, radius **24px**, overflow hidden, flex column space-between.
  - Texture image (decorative, z 0): absolute `top:-56px; left:226px; right:-138px; bottom:85px` (=456x429), `mix-blend-mode: multiply`, `mask-image: url(https://framerusercontent.com/images/2LuzuVnO2jTdIMVn689MeK0TIFQ.png)`, `mask-size: contain; mask-position: 0 0; mask-repeat: no-repeat` (+ `-webkit-` prefixed). Inner img `object-fit: cover`.
  - Content container: padding **32px** (hover: **56px 32px 32px**), flex column space-between.
    - Brand logo 140x64, `object-fit: contain`, top-left.
    - Title H3 (480 wide, bottom): **Feature Deck Web Regular 400, 24px / 33.6px**, `#122023`.
  - **Hover:** container padding-top 32 → 56px (logo slides down 24px), spring ≈300ms with ~0.3px overshoot (use `transition: padding .3s cubic-bezier(.34,1.3,.64,1)` or translateY(24px) on the logo). Unhover reverses.
- Cards (href, texture image, logo, title):
  1. ./customer-stories/spanx-turned-cx-business-driver-brand-experience — `DPMiuSqRWSzkU0UHR4h91iYq0.webp`, `k1nvbViWWUDVEBy2xaOAlUgRSq0.png` — "How Spanx Turned CX Into a Business Driver and Cut Handle Time in Half"
  2. ./customer-stories/siena-ai-customer-service-automation-coterie — `YOvViFV83b6X5W1yHrZSVkn4SMU.webp`, `CzG1z9NEKoxzFuwvHCh0Lfb0.png` — "Coterie Turns CX into a Revenue Engine with 65% AI Automation"
  3. ./customer-stories/dossier-handled-black-friday-customer-service-zero-panic — `umKHhY4P04DXZNLd8WNXl6Vic.webp`, `LSDtiaYEMw66OjmYASlgwlerh24.svg` — "How Dossier Scaled International Growth with AI Agents and Zero Black Friday Panic"
  4. ./customer-stories/earth-breeze-scaling-customer-service-with-ai — `jpuxJKnTDRXC29dw5WxlTTNnY.webp`, `j9kAeRPVaxAXfulnduynsbiTc.svg` — "From AI Skeptic To Advocate: How Earth Breeze Scaled Customer Support Without Losing The Human Touch"
  5. ./customer-stories/hexclad-customer-service-automation — `kPPvSpmKy1xNFReOFovLp4mV7Ws.webp`, `DysnuY3oWCVroJab1Mx73kkVg4.svg` — "HexClad Boosts CX Efficiency 65% with Customer Service Automation"
  6. ./customer-stories/true-sea-moss-response-time-improvement — `LW7ArPsUXFOKZRJTQF8Z4AhjOlI.webp`, `zy9mRkyxKisAjEUf8L7kCRTiI.png` — "True Sea Moss: Achieving 80% Automation and Unlocking a New Product Line with Siena AI"
  7. ./customer-stories/comfrt-ai-customer-support-siena — `ToW6MW4cp3gBOup2II10yGnrs2U.webp`, `cS9mAOIRGNEPFez1Fy9VQGafsQ.png` — "How Comfrt Achieved 65% Automation During Explosive Growth"
  8. ./customer-stories/ehplabs — `FXI5vfknke03OzDTIzobJYO34.webp`, `NzrOnMRFggp1QzWUKXstLpP2yVI.png` — "How EHPLabs handles 42% more tickets with smarter efficiency and an empowered team"
  9. ./customer-stories/fresh-clean-threads-csat-boost — `Jn5ooLE2tcWjxFHxq3EUR3QO0.webp`, `viVxpvqRgp5ynnq499GrMlfB0Ac.svg` — "Fresh Clean Threads Achieves 91% CSAT While Automating Tier 1 CX with Siena"
  10. ./customer-stories/simple-modern — `mkagirHXo48nXzTisyxzBqq9sxU.webp`, `qpbEcjUraVURA3hGESyeVuyZZN4.svg` — "How Siena helped Simple Modern achieve a 98% customer satisfaction rating"
  11. ./customer-stories/everday-dose — `dRWUJrVDMAjvJ9UD0eDqRLDzQg.webp`, `RQ1zB2lwHhPRGxGNWzIqaXLRRw.png` — "Everyday Dose automates over 70% of shopper inquiries with Siena"
  12. ./customer-stories/kitsch — `ivoud8ABjpSWcfZSnWLHXqkiig.webp`, `NMMaJ8ZBHflI2DXZDaM4Bu6mY4.png` — "How Kitsch automates over 68% of their customer support using Siena"
  13. ./customer-stories/mud-wtr — `ffShSqjcvt10pOiPTuBXqcFRsE.webp`, `xm8gLEJzeS3t0TXpRyH46PEmocg.png` — "How MUD\WTR Brewed Up a 4.8 CSAT Score with Siena AI"
  14. ./customer-stories/momentous-using-ai-customer-service-agent — `23a8N2UMRHFBv7NlsJEzbn0Q.webp`, `laiTWK4LZfsnrVZHxmAiKK22g.svg` — "How Momentous Achieved 100% Customer Satisfaction with Siena"
- **Behavior (measured):** no autoplay (static for 9s+). Next/Prev advance by one page (2 cards). Transition is a **crossfade, not a slide**: track opacity 1 → 0 over ≈**120ms** (ease-in-out), cards swap at the trough, then 0 → 1 over ≈**120ms**; total ≈250ms. Loops at ends.

---

## 7. Features — "The agentic commerce platform" (1440: y≈6529, height 2535)

- Section: bg `#FFFFFF`, flex column center, **gap 72px**, padding **80px 96px**, overflow hidden.
- Title: max-width 1100, H2 "The *agentic* commerce platform" — Feature Deck Web Light 64/64 ls −1.28 `#122023`, centered; the word "agentic" is `<em>` in **Feature Deck Web Light Italic** (same size).
- Grid: wrapper 1248 wide (max 1328), flex column, **gap 32px**; 3 rows, each flex row center, **gap 32px**; each card **608 x 725** (max-width 648), bg **`#F3F0EB`**, radius **24px**, overflow hidden, flex column, justify space-between, align center. No hover state, not links.
  - Two card variants:
    - **withPading**: padding **64px** all sides; text block (480 wide) at top; Lottie box **480 x 370** at the bottom.
    - **withoutPading**: no card padding; text block has padding **64px 64px 0** (480 content); Lottie box **608 x 468** flush to card left/right/bottom edges.
  - Text block: flex column center, **gap 16px**:
    - H3: **Feature Deck Web Regular 400, 32px / 38.4px**, `#122023`, left-aligned, 480 wide (2 lines).
    - Body: Tiempos Text Regular 400 **18px / 23.4px, ls −0.18px**, `#2A3639` (4 lines, 94px).
- Cards (row-major; variant; Lottie file in `recon/lottie/`):
  1. withPading — "Drive sales with generative product recommendations" — "Help customers find the right product, complete their routine, or try something new. Siena knows your customers and makes intelligent, in-the-moment suggestions that drive revenue and retention." — `Yj4sSaxX1lj2BJ0zDHApkOYrAc.json`
  2. withoutPading — "Scale social media engagement and moderation" — "Turn social interactions into revenue. Siena engages shoppers on social channels, answers product questions, captures buying intent, and converts community engagement into tangible ecommerce growth." — `2SUH2iKa4WHmLxFfRKqSoDKPFE.json`
  3. withoutPading — "Automate post-purchase complex workflows" — "From “where’s my order?” to “I want to start my return”, Siena handles it all- updating addresses, generating labels, issuing refunds, and sending replacements in a single flow." — `8x8925f7O1ubkoHd3O0JGjTaJ90.json`
  4. withPading — "Put subscription management on autopilot" — "More loyalty, less churn. Siena makes it easy to skip, pause, or swap- while capturing insights, offering alternatives, and boosting AOV with smart recommendations." — `r7wrKhoWmmfGDRbROSM3mDkucw.json`
  5. withPading — "Enhance human collaboration & agent assist" — "Build or tweak workflows in minutes with AI Assistant. Draft on-brand replies or translations with Copilot. Make follow-ups clear and easy with Collaborative AI Routing that explains every handoff with a note." — `Idu0bhnuv8QhZT2N8wCZas9hDLU.json`
  6. withoutPading — "Enterprise-grade safety and brand control" — "Trusted by some of the fastest ecommerce and retail companies, our agents meet the highest enterprise standards with guardrails and granular controls that keep every interaction on brand and on policy." — `c8ewDRBxrmLafbjmNUdqBKM8otg.json`
- **Lottie playback (from Framer Lottie component source + JSON):** lottie-web 5.7, `renderer: 'svg'`, `autoplay: true`, `loop: true`, `speed: 1`, direction forward, `rendererSettings: { preserveAspectRatio: 'xMidYMid slice' }` (fills box, crops). All six comps are **648x496 @ 60fps**, durations 4.8–5.14s (Yj4s 5.07s, 2SUH 5.07s, 8x89 4.80s, r7wr 5.06s, Idu0 5.08s, c8ew 5.14s). Images are base64-embedded in the JSON (self-contained). Plays continuously regardless of viewport (no in-view gating). Recommended: `lottie-web` (or `lottie-react`) loading the JSON from `/lottie/<file>.json`.

---

## 8. Integrations (1440: y≈9064, height 776)

- Section: bg **`#FAF7F1`**, flex column center, gap 72px, padding **80px 96px**, overflow hidden.
- Inner wrapper: max-width **1200** (x 120–1320), flex column, **align flex-end** (so the CTA button is right-aligned), **gap 64px**, overflow clip.
  - Title (full width, align flex-start): H2 "Integrate with your existing stack" — Feature Deck Web Light 64/64 ls −1.28 `#122023`, **left aligned** (one line, 829 wide).
  - Logo grid: `display:grid; grid-template-columns: repeat(4, 297px)` (i.e. `repeat(4, 1fr)` in 1200), rows **181px**, **gap 4px**, 1200x366.
    - Tile: bg `#F3F0EB`, radius **4px**, padding `72px 0`, flex column center/center, overflow hidden.
    - Tiles in order: [1] inline SVG logo 129x37 (`recon/svg/integration-0-Logos.svg`, Shopify-style mark); [2] Yotpo `S1CA7BjDsQfmui51TcPvAyGtRxA.svg` 113x32, `filter: brightness(0)`; [3] AfterShip `4ivCVwCJknXe4l2YnVNdadGF4.svg` 160x32, `filter: brightness(0)`; [4] ShipBob `tRZ3CBzNJw2sWeG9jlHuvjm3vs.svg` 143x37 (no filter); [5] Loop `lJNzlwA3aybr9aHp0a2x2qsApOs.svg` 101x33, `filter: brightness(0)`; [6] inline SVG "Union" 187x37 (`recon/svg/integration-5-Union.svg`); [7] text "**Helpdesks**"; [8] text "**Custom Apps**" — text tiles: Instrument Sans **700, 20px / 28px, ls −0.2px**, `#122023`.
    - No hover states on tiles.
  - CTA "Explore all integrations" (xlg button, 242x58, padding 18px 24px, radius 16, bg `#122023`, label Instrument Sans 600 18/21.6 white; hover rainbow gradient) → `./integrations`, right-aligned.

---

## 9. Main CTA (1440: y≈9840, height 755)

- Section: overflow clip, flex column center. Inner "Desktop" frame: 1440x755, padding **200px 96px**, flex row center/center, overflow hidden.
  - Background: full-bleed `<img>` `ERYNplIY591uk80wpoa4JGglO8.webp` (1440x810 natural), `object-fit: cover`, absolutely filling.
  - Top fade "Blur out": absolute `top:-2px; left:0; right:0; height:187px`, `linear-gradient(180deg, #FAF7F1 0%, rgba(255,255,255,0) 100%)`, z 3 (blends from the cream Integrations section into the image).
  - Card: max-width **1062** (1062x355), bg **`#F3F0EB`**, radius **48px**, padding **64px**, flex column center, gap 40px, z 1.
    - Inner group (934 wide): flex column center, **gap 41px**: H2 "See how fast-growing brands scale with Siena" (Feature Deck Web Light 64/64 ls −1.28 `#122023`, center, 2 lines, 934x128) → "Book a demo" xlg button (157x58).

---

## 10. Footer (1440: y 10595, height 434)

- Wrapper z 7. Footer frame: bg **`#122023`**, padding **64px 96px**, flex column center, gap 16px.
- Content: max-width **1144** (x 148–1292), flex row, **justify space-between**, align flex-start, height 306.
  - Left column (122 wide), flex column space-between; top group gap **32px**:
    - Siena wordmark SVG 122x32 (light, `recon/svg/footer-logo-siena.svg`), links to `./`.
    - Social buttons row (gap 8px): two 46/48 x 48 buttons, padding 16px, radius 12px, bg `#122023`; icon = Font Awesome 6 Brands 16px, color `#F4F5F5`: LinkedIn (U+F0E1) → https://www.linkedin.com/company/siena-ai, X (U+E61B) → https://x.com/siena_ai. **Hover:** bg `#F4F5F5`, icon color `#122023` (instant).
  - Right group (835 wide), flex row gap 10: link columns block (654 wide, flex row, **gap 48px**) + Partners column (171 wide).
    - Column heading: eyebrow style but **white `#FFFFFF`** (Instrument Sans 600 16/22.4 ls 1.7 uppercase). Heading→links gap **16px**; links gap **12px**.
    - Link: Instrument Sans **500 16px / 16px**, color **`rgba(255,255,255,0.5)`**; **hover color `#97BDFF`** rgb(151,189,255).
    - Col 1 (219 wide, two stacked groups gap 32px): COMPANY — About Us (./about-us), Careers (./careers), Customers (./customers), Security (https://sienaai.trust.site/), Product Updates (./product-updates). Then LEGAL — Terms of Service (./terms-of-service), Privacy Policy (./privacy-policy) + SOC badge image `HB4OWZgksTQCHf8uTWf7S6EYSlE.webp` 64x64 to the right (gap 32px).
    - PLATFORM: Customer Service Agent (./), Shopping Agent (./shopping-agent), Social Agent (./social-agent), Ask Siena (./ask-siena), QA Agent (./qa-agent), Topics Explorer (./topics-explorer), Reviews Agent (./ai-review-management), Memory (./memory), Docs (./products/docs), Integrations (./integrations).
    - RESOURCES: Blog, Community, Events, Conversations, Webinars, ROI Calculator, Pricing, Choose Dedicated AI (./ai-native-customer-service-vs-help-desk-ai-add-ons), AI LAB (./ai-lab).
    - PARTNERS: Partner with Siena (./partner-with-siena), Refer a Friend (./refer-a-friend).

---

## 11. Mobile (measured at 390 x 844; Framer "Phone" breakpoint applies `max-width: 809.98px`, nav mobile `max-width: 767.98px`)

Document height at 390: **13534px**. Section side padding is **24px** (content 342) unless noted. Section titles scale: H2 **48px / 48px, ls −0.96px**; eyebrow **14px / 19.6px** (ls 1.7px). Buttons keep desktop sizes.

| Section | y | h | padding | gap | notes |
|---|---|---|---|---|---|
| Hero | 40* | 662 | 112px 24px 160px | 10 | *starts under fixed nav area |
| Testimonials | 702 | 1194 | 136px 0 56px | 40 | |
| Scroll Area | 1897 | 3140 | 56px 24px 16px | 32 | NOT sticky on mobile |
| Metrics | 5037 | 858 | 56px 24px | 40 | |
| Customer Stories | 5895 | 940 | 56px 0 | 40 | |
| Features | 6835 | 3761 | 56px 24px | 32 | |
| Integrations | 10595 | 1178 | 56px 24px | 40 | |
| Main CTA | 11773 | 682 | 168px 16px (inner) | 10 | |
| Footer | 12455 | 1080 | 64px 32px | 16 | |

### Mobile nav (fixed, full width 390, bg `#F3F0EB`, padding 0 16px)
- Closed height 113: Banner (358x45, bg `#122023`, radius `0 0 16px 16px`, padding 12px 16px): a **rotating 4-point star** (21x21 SVG path below, fill `#FAF7F1`, box 27–30px) + "We raised a $17M Series A" (Feature Deck Web Light Italic 300 16/17.6 `#F2E59A`). Star rotates **clockwise at ~36°/s (10s per turn), linear, infinite** (JS-driven; use CSS `animation: spin 10s linear infinite`).
  - Star path: `M 0 10.5 L 4.436 9.971 C 7.337 9.625 9.625 7.337 9.971 4.436 L 10.5 0 L 11.029 4.436 C 11.375 7.337 13.663 9.625 16.564 9.971 L 21 10.5 L 16.564 11.029 C 13.663 11.375 11.375 13.663 11.029 16.564 L 10.5 21 L 9.971 16.564 C 9.625 13.663 7.337 11.375 4.436 11.029 Z` (viewBox 0 0 21 21).
- Row (358x68, padding 8px 0, space-between): logo 130x34 (as desktop) + menu button 52x52, radius 12, icon = Font Awesome 6 Pro Regular 24px (U+E0AE "bars"; when open shows "-"/close glyph) — substitute a 24px hamburger/close SVG, color `#122023`.
- Opened state (height 587; open/close is **instant**, no animation measured): banner grows to 70 and shows second line "to build the Agent of Record for consumer brands" (Instrument Sans 400 14/15.4). Links panel: padding 16px 0 24px, gap 32px; items (gap 24px) each = row space-between [label Instrument Sans **600 18px / 21.6px** `#122023`] [10x16 FA chevron for dropdowns] + 1px divider `rgba(0,0,0,0.2)` 24px below. Items: Product ▸, Customers (link), Resources ▸, Partners ▸, Company ▸. Then full-width "Book a demo" md button 358x48 (radius 12).

### Hero (mobile)
- **Different H1 copy on mobile: "Empathic AI CX agents designed for commerce"** — Feature Deck Web Light 300 **56px / 56px, ls −0.56px**, center, 342 wide (4 lines, 224 tall). Heading/subtitle gap 24 (inner gap 2).
- Subtitle: Instrument Sans 500 **16px / 22.4px, ls −0.16px**, center, 342 wide.
- Button: same xlg 157x58, centered; group gap 40.
- Only ONE decorative image on mobile: `H7uKKouy1m2eWQvMjbwrSblQx8k.webp`, absolute `top:233px; left:40px; right:-40px; bottom:-32px` (390x461), `object-fit: cover`, behind text. The left desktop image is hidden.
- Tickers: absolute top 641.4px, height 94; rows 33 tall; **gap 72px** between logos; speeds unchanged (**+30 / −30 px/s**).
- "Blur out" gradient: same, top 661.4px, height 441.

### Testimonials slider (mobile)
- Title padding 0 24px, gap 16. Slider component full width 390, padding 16px 32px 48px (content 326).
- Slide = column, align center, **gap 40px**: image **320x320** radius 32 (play badge on slide 1) → text column (gap 16): quote mark 30x24; quote Instrument Sans 400 **19.2px / 24.96px, ls −0.384px**; brand row (flex row, gap 16): logo 140x64 + person column (gap 12): name Instrument Sans 500 **16px / 22.4px ls −0.16px**; role Instrument Sans 600 **12px / 16.8px, ls 0.6px** uppercase.
- Same controls and slide behavior as desktop.

### Scroll Area (mobile, static — no pinning)
- Content column max 512 → 342 wide; blocks stacked with **gap 80px**; each block flex column center, **gap 40px**, order: H2 (48/48 left-aligned) → chat mock card → bullet list → button (centered).
- Bullets: Tiempos 14px / 21px, ls −0.14px, `#2A3639`; 24px star icon; rows gap 12.
- Mock cards (342 wide, radius 24): Block 1 "Feature 1" 342x522, padding 16, bg `OS7uIQBhEtXd5l7MXZ0qAcM0Lg.png`, bubble text **12px / 15.6px**; Block 2 342x580 padding 56, bg `9jAbqJZIRcnPqEcOjQ13ZPF0.webp`, content 304 wide, text 14/18.2; Block 3 "Image - portait" 342x433, padding 16, bg **`ufHpMeiISwDwuS87rNWJ1rkUhY.webp`**, persona widget 310x397 (chip names Tiempos 14/21).

### Metrics (mobile)
- Card: 342 wide, padding **32px**, radius 48, gap 40.
- Top: column center; counter box 120x180 (**120px**, line-height 1.5em) + "%" **120px/120px** (gap 14); H2 Feature Deck Web Regular **24px / 28.8px** (278 wide); underline swash 241x17 (gap 20).
- Stats: column, gap 24; each stat is a **row** (gap 14, padding-top 24): value **32px / 32px** + label Instrument Sans 600 **14px / 19.6px** ls 1.7 uppercase.
- Count-up identical (25 → 80, 1.5s easeInOut, fade-in ~0.3s; verified on mobile by rAF: 25 at 0ms → 80 at ~1450ms).

### Customer Stories (mobile)
- Title padding 0 24, gap 16. Carousel panel full width (no visible white panel padding), slideshow padding 16px 32px 48px → **1 card per page**, card **326 x 458** (radius 24, padding 32). Texture image left:8px (instead of 226). H3 Feature Deck Web Regular **18px / 25.2px** (262 wide).

### Features (mobile)
- Title H2 48/48 centered; grid becomes single column, gap 32 (rows also gap 32).
- Card "Mobile" (padded): 342 wide, padding **32px**, flex column, **gap 40px**, radius 24, bg `#F3F0EB`; Lottie **278x216**. Card "Mobile NoPading": text block padded, Lottie **342x265** flush.
- H3 **28px / 33.6px**; body Tiempos **14px / 21px**, ls −0.14px.
- Heights: 563 / 580 / 542 / 542 / 563 / 525.

### Integrations (mobile)
- H2 48/48 left; title gap 16; grid **2 columns of 169px**, 4 rows of 181px, gap 4px; tiles padding **14px**; text tiles Instrument Sans 500 **16px / 22.4px** ls −0.16 (not bold 20px); button right-aligned (x 124–366).

### Main CTA (mobile)
- Inner "Phone" frame padding **168px 16px**; card 358 wide, padding **32px**, radius **32px**, gap 40; inner gap **32px**; H2 48/48 center (294 wide, 4 lines).

### Footer (mobile)
- Padding **64px 32px**; content column gap **64px**: link groups first (column, gap 40): row [COMPANY | LEGAL] side by side (gap 32), then PLATFORM, RESOURCES, PARTNERS stacked (each gap 16 heading→links); headings **14px / 19.6px**. Logo + social buttons row (space-between) sits at the **bottom** (326 wide).

---

## 12. CookieYes consent banner (third-party; optional to clone)

- Fixed bottom-right: container 440x258 at x=960, y=602 in a 1440x900 viewport (i.e. `right: 40px; bottom: 40px`), radius 6px; appears immediately on load (no animation).
- Bar: bg `#FFFFFF`, border 1px solid `#F4F4F4`, radius 6px, padding **20px 26px**. Font: inherits generic `sans-serif` (the page body font isn't applied).
  - Title "We value your privacy": 700 **18px / 24px** `#212121`.
  - Text (12px gap below title, 14px / 24px `#212121`): "We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking 'Accept All', you consent to our use of cookies. Click 'Customize' to manage your preferences or 'Reject All' to decline non-essential cookies."
  - Buttons row (gap 8px, each 44px tall, padding 8px, radius **16px**, border 2px, font 500 14px/24px): "Customize" (127 wide, transparent bg, border `#6F7273`, text `#122023`); "Reject All" (120, bg `#FFFFFF`, border `#6F7273`, text `#122023`); "Accept All" (123, bg `#122023`, border transparent, text `#FFFFFF`).
- Mobile (390): bottom sheet, full width, radius 6px, fixed at bottom.
- Logos `poweredbtcky.svg`, `close.svg`, `revisit.svg` (already in public/assets) belong to the CookieYes preferences modal / revisit button.

---

## 13. Interaction & motion summary (quick reference)

| Element | Trigger | From → To | Timing |
|---|---|---|---|
| Hero H1 / subtitle / CTA | page load | opacity 0.001, y +200px → 1, 0 | 0.7s tween; delays 0.2 / 0.3 / 0.4s; eases `cubic-bezier(0,.91,.14,.85)` (H1), `cubic-bezier(0,.91,.78,1)` (sub, CTA) |
| Nav pill | scrollY ≥ ~150–160 | transparent → `#FAF7F1` + layered shadow | ~250ms ease-in-out, reversible |
| Nav mega-menu | hover Product/Resources/Partners/Company | pill height 64 → content height; panel opacity 0→1, y −172→0 | very fast spring, ~70ms height, ~120ms content |
| Nav link (Customers etc.) | hover | 1px `#FB5646` underline, 4px below text (top:20px in a 16px-tall label), slides in from left (scaleX/translate), slides out to left on leave | spring ≈350ms, slight overshoot |
| Dark buttons (`#122023`) | hover | bg → rainbow `linear-gradient(90deg,#F2E59A 0%,#FEC796 21.41%,#FB5646 36.1%,#827ACC 60.52%,#2E79D8 89%,#294FBA 100%)` | instant |
| Footer links | hover | `rgba(255,255,255,.5)` → `#97BDFF` | instant/short |
| Footer social buttons | hover | bg `#122023`→`#F4F5F5`, icon white→`#122023` | instant |
| Logo tickers | always | row 1 → right, row 2 → left | 30 px/s linear, infinite, gap 112 (72 mobile) |
| Testimonial slider | Prev/Next click | horizontal slide 944px | ~300ms ease-in-out; no autoplay |
| Sticky chat mock | scroll past each left block's mid-viewport | swap variant; bg instant; bubbles fade+rise | v1: 5 rows, delays 0.5/1.0/1.5/2.0/2.5s; v2: 0.35/0.55/0.95s; each ~0.45–0.75s spring, from y+50/+80 |
| Persona chips (v3) | click | selected chip bg #fff opacity 1, others transparent 0.4; tags + body swap | instant |
| Metric counter | enters viewport (once) | 25 → 80, opacity 0→1 | 1.5s easeInOut; fade ~0.3s |
| Story carousel | Prev/Next click | track opacity 1→0, swap page (2 cards), 0→1 | ~120ms + ~120ms |
| Story card | hover | content padding-top 32 → 56 (logo drops 24px) | spring ~300ms |
| Feature Lotties | always | lottie-web svg, autoplay, loop | 4.8–5.14s loops @60fps |
| Mobile banner star | always | rotate 0→360° clockwise | 10s linear infinite |
| Scroll reveals elsewhere | — | **none** (verified: no elements outside hero/sticky section have initial opacity/transform offsets) | — |

Tablet (810–1199) was not separately measured; Framer interpolates the desktop layout with fluid widths (`max((min(100vw - 80px, 1328px) - 32px) / 2, 1px)` for feature cards per the page module) — use desktop structure with fluid columns down to 810, and the mobile layout below 810.
