import { SienaGlyph } from '../scroll-area/parts.jsx'
import { FaIcon } from './ui.jsx'

// Sticky-area card variants that are NEW on the conversion pages (specs/conversion.md §3.5, §6.2, §6.7).
// Desktop geometry is absolute (card-relative px from sticky-*.json); phone overrides in conversion.css.
// Entrance motion (desktop sticky slot only, see conversion.css "Sticky-card entrances"): classes cc-rise / cc-fade,
// per-element delays measured on live relative to the block switch.

function Hatch() {
  return <div className="cc-hatch" aria-hidden="true" />
}

function BigChip({ n, texture, glyph, text }) {
  return (
    <div className={`cc-chip cc-chip--${n}`}>
      <div className="cc-chip-icon">
        <img className="cc-chip-tex" src={`/assets/${texture}`} alt="" />
        <FaIcon code={glyph} className="cc-chip-glyph" />
        <img className="cc-chip-ov" src="/assets/Uuv5OWNLroO51e3GWwN9hGnIU.png" alt="" />
      </div>
      <p className="cc-chip-text">{text}</p>
    </div>
  )
}

// "Compare 2" — reviews mock
export function ReviewsCard() {
  return (
    <div className="cc-card cc-card--reviews">
      <img className="cc-bg" src="/assets/2Jj1BszGAvma1aySjKVmoUyfSI.png" alt="" />
      <Hatch />
      <BigChip n={1} texture="eTyaR6EX4QUmmcYkomodjUhpH6Q.png" glyph={0xf007} text="Generate personalized review responses at scale" />
      <div className="cc-review">
        <div className="cc-review-profile">
          <img className="cc-review-avatar" src="/assets/YJCHh6pHXfigS8Roir7x9YirEI.webp" alt="" />
          <div className="cc-review-who">
            <p className="cc-review-name">Kathy Simpson</p>
            <p className="cc-review-loc">Lynwood, WA</p>
          </div>
        </div>
        <div className="cc-review-stars" aria-label="5 stars">
          {[0, 1, 2, 3, 4].map((i) => (
            <img key={i} src="/svg/ai-review-management-Vector-d70f1.svg" alt="" width="16" height="16" />
          ))}
        </div>
        <img className="cc-review-line" src="/svg/compare-review-line.svg" alt="" />
        <p className="cc-review-text">Great product!</p>
      </div>
      <div className="cc-reply">
        <div className="cc-reply-inner">
          <p>Hey Kathy! So glad you liked it, here is a 10% discount for your next purchase</p>
        </div>
      </div>
      <BigChip n={2} texture="H52yBv0P43yzd8dUlb8CFyENp1s.png" glyph={0xf03e} text="Automatic reviews moderation" />
    </div>
  )
}

// live delays (s) after the switch: rows 1-3 every 0.5s, "5 weeks later" chip + next row together, then 0.5s apart
const MEMORY_DELAYS = [0.5, 1.0, 1.5, 2.0, 2.0, 2.5, 3.0]
const rise = (delay, y80 = false) => ({ className: `cc-rise${y80 ? ' cc-rise--80' : ''}`, style: { animationDelay: `${delay}s` } })

const MEMORY = [
  { from: 'c', text: 'Has my sculpting shorts order shipped yet?' },
  { from: 's', text: "Just went out! You'll have it Friday." },
  { from: 'c', text: 'Perfect! Hope XL fits, sometimes I need Large.' },
  { from: 't', text: '5 weeks later' },
  { from: 'c', text: 'Looking for those sculpting shorts in high-waisted.' },
  { from: 's', text: 'We have those! You mentioned being between L and XL before. Which worked better?' },
  { from: 'c', text: 'XL was loose. L would be perfect!' },
]

// "Compare 1" — memory chat
export function MemoryCard() {
  return (
    <div className="cc-card cc-card--memory">
      <img className="cc-bg" src="/assets/ZKcNeM6djIjPHCNJzlqVwl6Oz0.webp" alt="" />
      {MEMORY.map((m, i) => {
        const r = rise(MEMORY_DELAYS[i], i === 0)
        if (m.from === 't')
          return (
            <div key={i} className={`cc-mem cc-mem--${i} cc-time ${r.className}`} style={r.style}>
              <span className="cc-time-line" aria-hidden="true" />
              <span className="cc-time-chip">
                <FaIcon code={0xf017} className="cc-time-icon" />
                <span className="cc-time-text">{m.text}</span>
              </span>
            </div>
          )
        if (m.from === 'c')
          return (
            <div key={i} className={`cc-mem cc-mem--${i} cc-mem-c ${r.className}`} style={r.style}>
              <span className="cc-mem-avatar">
                <img src="/assets/D3TQ38q4HpOxmxHoD1u1AW40NI.png" alt="" />
              </span>
              <div className="cc-mem-bubble">
                <p>{m.text}</p>
              </div>
            </div>
          )
        return (
          <div key={i} className={`cc-mem cc-mem--${i} cc-mem-s ${r.className}`} style={r.style}>
            <div className="cc-mem-border">
              <div className="cc-mem-sbubble">
                <p>{m.text}</p>
              </div>
            </div>
            <img className="cc-mem-savatar" src="/assets/14aPLwywC9q4flBvXM0s1rLqA8.png" alt="" />
          </div>
        )
      })}
    </div>
  )
}

const SUGGESTIONS = [
  'How does the leak-resistant lid prevent spills?',
  'Can it keep drinks cold for over 24 hours?',
  'How does the handle improve on-the-go usability?',
]

// "Compare 3" — shopping mock
export function ShoppingCard() {
  return (
    <div className="cc-card cc-card--shop">
      <Hatch />
      <img className="cc-shop-photo" src="/assets/BeLmCXReFiYYClGNyhlGNKeAp70.webp" alt="" />
      <div className="cc-product cc-rise" style={{ animationDelay: '0.2s' }}>
        <div className="cc-product-inner">
          <div className="cc-product-row">
            <div className="cc-product-tile">
              <img src="/assets/E41dkaPjzIYO8X5LquyvnNWA5k.png" alt="" />
            </div>
            <div className="cc-product-text">
              <p className="cc-product-name">Voyager Tumbler - Signature</p>
              <p className="cc-product-price">$37.99</p>
            </div>
          </div>
          <div className="cc-cart">
            <img className="cc-cart-tex" src="/assets/1bDMxZj8W2T4NADqgydu75txHrc.webp" alt="" />
            <div className="cc-cart-inner">
              <p>Add to cart</p>
            </div>
          </div>
        </div>
      </div>
      <img className="cc-shop-glow cc-rise" style={{ animationDelay: '0.1s' }} src="/assets/w6eD4Ur8zTRM35rkpRmfdnDQ8Fg.webp" alt="" />
      <div className="cc-sugg cc-rise" style={{ animationDelay: '0.5s' }}>
        {SUGGESTIONS.map((t) => (
          <div key={t} className="cc-sugg-pill">
            <img src="/svg/shopping-agent-sparkles-two-2-f6c5b.svg" alt="" width="20" height="20" />
            <p>{t}</p>
          </div>
        ))}
      </div>
      <div className="cc-prompt">
        <div className="cc-prompt-border">
          <div className="cc-prompt-inner">
            <img src="/svg/shopping-agent-Icon-Black-d8122.svg" alt="" width="25" height="25" />
            <p>What can I help you with?</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// §6.2 card 3 — "Integrations" (desktop) / "Integrations M" (phone). Tiles row-major; 4 = center.
// live fade delays (s) per tile (row-major; center tile static): measured stagger 0 / .1 / .3 / .4 / .5 / .6
const INT_DELAYS = [0.4, 0.1, 0.3, 0, null, 0.3, 0.1, 0.5, 0.6]

const INT_TILES = [
  { svg: 'ai-native-int-0.svg', w: 108, h: 27, alt: 'Gladly' },
  { svg: 'ai-native-int-1.svg', w: 105, h: 29, alt: 'Shopify' },
  { svg: 'ai-native-int-2.svg', w: 102, h: 26, alt: 'Gorgias' },
  { svg: 'ai-native-int-3.svg', w: 95, h: 21, alt: 'Zendesk' },
  { center: true },
  { svg: 'ai-native-int-4.svg', w: 102, h: 17, alt: 'Kustomer' },
  { svg: 'ai-native-int-5.svg', w: 100, h: 23, alt: 'Intercom' },
  { svg: 'ai-native-int-6.svg', w: 107, h: 21, alt: 'Recharge' },
  { text: '… and custom apps' },
]

export function IntegrationsCard() {
  return (
    <div className="cc-card cc-card--int">
      <div className="cc-ring cc-ring--a"><div /></div>
      <div className="cc-ring cc-ring--b"><div /></div>
      <div className="cc-ring cc-ring--c"><div /></div>
      <div className="cc-int-grid">
        {INT_TILES.map((t, i) =>
          t.center ? (
            <div key={i} className="cc-int-tile cc-int-center">
              {/* live DOM order: photo → glow → S; tile clips the glow (the photo file itself is a checkerboard) */}
              <img className="cc-int-photo" src="/assets/fxLqEwB1bxRKD7Xar2jbAEQOkY.png" alt="" />
              <img className="cc-int-glow" src="/assets/48uWBr03dP5XBMwKGnfEYaAr9k0.png" alt="" />
              <img className="cc-int-s" src="/svg/ai-native-int-siena-s-96.svg" alt="Siena" />
            </div>
          ) : t.text ? (
            <div key={i} className="cc-int-tile cc-fade" style={{ animationDelay: `${INT_DELAYS[i]}s` }}>
              <p className="cc-int-text">{t.text}</p>
            </div>
          ) : (
            <div key={i} className="cc-int-tile cc-fade" style={{ animationDelay: `${INT_DELAYS[i]}s` }}>
              <img className="cc-int-logo" src={`/svg/${t.svg}`} alt={t.alt} style={{ '--w': `${t.w}px`, '--h': `${t.h}px` }} />
            </div>
          ),
        )}
      </div>
    </div>
  )
}

// §6.7 add-ons phone block 2 — "Image - portait" card (photo + its own chat copy as measured).
const PORTRAIT = [
  { from: 'c', text: 'Hi! Any tips for getting a stronger espresso shot? Mine’s been tasting a little light lately.' },
  { from: 's', text: 'Totally—try adjusting your grind one notch finer and upping the dose by half a gram. Your TK‑02 can handle the punch :)' },
  { from: 'c', text: 'Amazing, thank you!! I’ll test that tomorrow morning.' },
  {
    from: 's',
    text: (
      <>
        You got it. And just a heads up— <strong>your favorite beans</strong> are low in stock. Want me to reserve a bag for your next delivery?
      </>
    ),
  },
  { from: 'c', text: 'Yes please! You read my mind.' },
]

export function PortraitCard() {
  return (
    <div className="cc-card cc-card--portrait">
      <img className="cc-bg" src="/assets/jLZk9EHNgMDBQm7bbrRSNSias.webp" alt="" />
      <div className="cc-portrait-col">
        {PORTRAIT.map((m, i) =>
          m.from === 'c' ? (
            <div key={i} className="cm-row cm-row--customer">
              <div className="cm-avatar">
                <img className="cm-avatar-face" src="/assets/RmeNSvdDwpHmyiquwjkQ8HlXlI.webp" alt="" />
              </div>
              <div className="cm-bubble cm-bubble--customer cc-portrait-c">
                <p className="cm-text">{m.text}</p>
              </div>
            </div>
          ) : (
            <div key={i} className="cm-row cm-row--siena">
              <div className="cm-grad cm-grad--bubble cc-portrait-s">
                <div className="cm-bubble cm-bubble--siena">
                  <p className="cm-text">{m.text}</p>
                </div>
              </div>
              <div className="cm-avatar cm-avatar--siena">
                <SienaGlyph />
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
