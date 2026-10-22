import { useEffect, useState } from 'react'
import { SienaGlyph } from './parts.jsx'
import { CARD_BG, PERSONAS, V1_ROWS, V2 } from './data.js'

// Returns true two frames after `play` turns on, so the hidden start state is painted first.
function useShown(play) {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (!play) return
    let r2
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setShown(true))
    })
    return () => {
      cancelAnimationFrame(r1)
      cancelAnimationFrame(r2)
    }
  }, [play])
  return shown
}

// Entrance wrapper: opacity 0 / translateY(+y) -> 1 / 0 after `delay` seconds (CLONE_SPEC §4).
// animate=false renders the settled state with no motion (mobile static mocks).
function Enter({ animate, shown, delay, y, className = '', children }) {
  if (!animate) return <div className={className}>{children}</div>
  return (
    <div
      className={`cm-enter ${shown ? 'is-in' : ''} ${className}`}
      style={{ '--cm-delay': `${delay}s`, '--cm-y': `${y}px` }}
    >
      {children}
    </div>
  )
}

function CustomerAvatar({ full }) {
  return (
    <div className="cm-avatar">
      {full && <img className="cm-avatar-base" src="/assets/D3TQ38q4HpOxmxHoD1u1AW40NI.png" alt="" />}
      <img className="cm-avatar-face" src="/assets/RmeNSvdDwpHmyiquwjkQ8HlXlI.webp" alt="Portrait image of a happy person" />
    </div>
  )
}

function SienaAvatar() {
  return (
    <div className="cm-avatar cm-avatar--siena">
      <SienaGlyph />
    </div>
  )
}

function CustomerRow({ text, fullAvatar, fill }) {
  return (
    <div className="cm-row cm-row--customer">
      <CustomerAvatar full={fullAvatar} />
      <div className={`cm-bubble cm-bubble--customer ${fill ? 'cm-fill' : ''}`}>
        <p className="cm-text">{text}</p>
      </div>
    </div>
  )
}

function SienaRow({ text }) {
  return (
    <div className="cm-row cm-row--siena">
      <div className="cm-grad cm-grad--bubble cm-fill">
        <div className="cm-bubble cm-bubble--siena">
          <p className="cm-text">{text}</p>
        </div>
      </div>
      <SienaAvatar />
    </div>
  )
}

function Variant1({ animate, play }) {
  const shown = useShown(play)
  return (
    <div className="cm-content cm-content--v1">
      {V1_ROWS.map((row, i) => (
        <Enter key={i} animate={animate} shown={shown} delay={row.delay} y={row.y} className="cm-enter-row">
          {row.from === 'customer' ? (
            <CustomerRow text={row.text} fullAvatar={row.fullAvatar} fill={row.fill} />
          ) : (
            <SienaRow text={row.text} />
          )}
        </Enter>
      ))}
    </div>
  )
}

function ProductCard() {
  return (
    <div className="cm-grad cm-grad--product">
      <div className="cm-product">
        <p className="cm-product-title">Grüns Superfood Gummies</p>
        <p className="cm-product-meta">Flavor: Original</p>
        <div className="cm-product-divider" />
        <div className="cm-product-row">
          <span>Order No. #48156</span>
          <span>Estimated: June 14</span>
        </div>
      </div>
      <img className="cm-product-img" src="/assets/crEVK41xfvkW8gCYsrdnhKe7sK8.png" alt="" />
    </div>
  )
}

function Variant2({ animate, play }) {
  const shown = useShown(play)
  return (
    <div className="cm-content cm-content--v2">
      <Enter animate={animate} shown={shown} delay={V2.customer.delay} y={V2.customer.y} className="cm-enter-row">
        <CustomerRow text={V2.customer.text} />
      </Enter>
      <Enter animate={animate} shown={shown} delay={V2.product.delay} y={V2.product.y} className="cm-enter-row">
        <ProductCard />
      </Enter>
      <Enter animate={animate} shown={shown} delay={V2.siena.delay} y={V2.siena.y} className="cm-enter-row">
        <SienaRow text={V2.siena.text} />
      </Enter>
    </div>
  )
}

function Variant3() {
  const [active, setActive] = useState(0)
  const persona = PERSONAS[active]
  return (
    <div className="cm-content cm-content--v3">
      <div className="cm-grad cm-grad--card">
        <div className="cm-chips-card">
          <div className="cm-chips" role="tablist" aria-label="Personas">
            {PERSONAS.map((p, i) => (
              <button
                key={p.name}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`cm-chip ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <img className="cm-chip-avatar" src={`/assets/${p.avatar}`} alt="" />
                <strong className="cm-chip-name">{p.name}</strong>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="cm-grad cm-grad--msg">
        <div className="cm-msg-card" role="tabpanel">
          <div className="cm-tags">
            {persona.tags.map((t, i) => (
              <span key={t} className={`cm-tag ${i === 0 ? 'is-active' : ''}`}>
                {t}
              </span>
            ))}
          </div>
          <p className="cm-text cm-msg-body">{persona.body}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Chat mock card (CLONE_SPEC §4 desktop 512x647 / §11 mobile per-block cards).
 * - variant: 0 | 1 | 2
 * - mobile: use mobile size/background, render static (no entrance motion)
 * - play: start the entrance stagger (desktop). Remount (change `key`) to replay.
 */
export default function ChatMock({ variant, mobile = false, play = true }) {
  const bg = CARD_BG[variant]
  const animate = !mobile
  return (
    <div className={`cm-card cm-card--v${variant + 1} ${mobile ? 'cm-card--mobile' : ''}`}>
      <img className="cm-card-bg" src={`/assets/${mobile ? bg.mobile : bg.desktop}`} alt={bg.alt} />
      {variant === 0 && <Variant1 animate={animate} play={play} />}
      {variant === 1 && <Variant2 animate={animate} play={play} />}
      {variant === 2 && <Variant3 />}
    </div>
  )
}
