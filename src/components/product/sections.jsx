// Reusable product-page sections (specs/product-a.md §0, §8).
import { useEffect, useRef, useState } from 'react'
import LogoTicker from '../hero/LogoTicker.jsx'
import { ROW_1, ROW_2 } from '../hero/tickerData.js'
import Slide from '../testimonials/Slide.jsx'
import BookDemoButton from '../cta/BookDemoButton.jsx'
import { siteHref } from '../../routes.js'
import { Appear, EASE_OUT } from './motion.jsx'
import { Eyebrow, Fa, H2 } from './ui.jsx'
import '../../styles/hero.css' // ticker-row / ticker-track rules
import '../../styles/testimonials.css'
import '../../styles/integrations.css'
import '../../styles/product-a.css'

/* ---------- Logos: standalone full-bleed ticker block (§2.2) — rows/speeds IDENTICAL to homepage ---------- */
export function LogosBlock({ className = '', style }) {
  return (
    <div className={`pa-logos ${className}`} style={style}>
      <LogoTicker logos={ROW_1} direction="right" />
      <LogoTicker logos={ROW_2} direction="left" />
    </div>
  )
}

/* ---------- Testimonial panel (§0 "Testimonial card") ---------- */
function Chevron({ points }) {
  return (
    <svg className="t-chevron" viewBox="0 0 24 24" aria-hidden="true">
      <polyline points={points} />
    </svg>
  )
}

// Same Prev/Next horizontal 300ms slide as homepage Testimonials (copied state machine; homepage file untouched).
function useSlider(count) {
  const [state, setState] = useState({ index: 0, prev: null, dir: 1, phase: 'idle' })
  useEffect(() => {
    if (state.phase === 'start') {
      let r2
      const r1 = requestAnimationFrame(() => (r2 = requestAnimationFrame(() => setState((s) => ({ ...s, phase: 'run' })))))
      return () => {
        cancelAnimationFrame(r1)
        cancelAnimationFrame(r2)
      }
    }
    if (state.phase === 'run') {
      const t = setTimeout(() => setState((s) => ({ ...s, prev: null, phase: 'idle' })), 300)
      return () => clearTimeout(t)
    }
  }, [state.phase])
  const go = (dir) =>
    setState((s) => (s.phase !== 'idle' ? s : { index: (s.index + dir + count) % count, prev: s.index, dir, phase: 'start' }))
  return { ...state, go }
}

/**
 * variant: 'shopping' | 'social' | 'reviews' | 'qaA' | 'qaB' | 'topics' | 'ask'  (chrome values per §0 / route sections)
 */
export function ProductTestimonial({ slides, variant, className = '', children }) {
  const count = slides.length
  const { index, prev, dir, phase, go } = useSlider(count)
  const running = phase === 'run'
  const inT = phase === 'start' ? `translateX(${dir * 100}%)` : 'translateX(0)'
  const outT = phase === 'start' ? 'translateX(0)' : `translateX(${-dir * 100}%)`
  return (
    <section className={`pt-section pt--${variant} ${className}`} aria-label="Customer testimonial">
      {children}
      <div className="pt-panel">
        <div className="pt-slider">
          {count > 1 && (
            <div className="t-controls">
              <button type="button" className="t-nav-btn" aria-label="Previous testimonial" onClick={() => go(-1)}>
                <Chevron points="15 18 9 12 15 6" />
              </button>
              <p className="t-counter" aria-live="polite">
                {index + 1}
                <span className="t-counter-total"> / {count}</span>
              </p>
              <button type="button" className="t-nav-btn" aria-label="Next testimonial" onClick={() => go(1)}>
                <Chevron points="9 18 15 12 9 6" />
              </button>
            </div>
          )}
          <div className="t-viewport pt-viewport">
            {prev !== null && (
              <Slide key={`o${prev}`} data={slides[prev]} className={`t-slide--out${running ? ' is-moving' : ''}`} style={{ transform: outT }} aria-hidden="true" />
            )}
            <Slide key={`i${index}`} data={slides[index]} className={running ? 'is-moving' : ''} style={{ transform: inT }} />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- FAQ accordion (§2.5): single-open, first open, ≈100ms height+opacity ---------- */
export function Faq({ items, variant = 'social', title = 'FAQ' }) {
  const [open, setOpen] = useState(0)
  return (
    <section className={`pa-faq pa-faq--${variant}`}>
      <H2 className="text-center">{title}</H2>
      <div className="pa-faq-panel">
        <div className="pa-faq-list">
          {items.map(([q, a], i) => {
            const isOpen = open === i
            return (
              <div key={q} className="pa-faq-item">
                <button type="button" className="pa-faq-q" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span>{q}</span>
                  <img
                    src={isOpen ? '/assets/OKFNY3AXFnnV2q6cBUgzTRwNI0.png' : '/assets/klSbquSQSmI4vJp5uAthfEBu4A.png'}
                    alt=""
                    aria-hidden="true"
                    width="20"
                    height="20"
                  />
                </button>
                <div className={`pa-faq-a ${isOpen ? 'is-open' : ''}`}>
                  <div>
                    <p>{a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------- Main CTA variant (§0 Main CTA): heading prop + top blur-out variant ---------- */
const BLURS = {
  cream: { background: 'linear-gradient(180deg, #FAF7F1 0%, rgba(250,247,241,0) 100%)', height: 187 },
  white: { background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(250,247,241,0) 100%)', height: 187 },
  white153: { background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(250,247,241,0) 100%)', height: 153 },
  dark: { background: 'linear-gradient(180deg, #122023 24%, rgba(18,32,35,0) 100%)', height: 187 },
  dark7: { background: 'linear-gradient(180deg, #122023 7.02%, rgba(18,32,35,0) 100%)', height: 187 },
}
export function ProductCta({ heading = 'See how fast-growing brands scale with Siena', blur, variant = 'default' }) {
  return (
    <section className={`pa-cta pa-cta--${variant}`}>
      <div className="pa-cta-inner">
        <img src="/assets/ERYNplIY591uk80wpoa4JGglO8.webp" alt="" width="1440" height="810" className="absolute inset-0 block h-full w-full object-cover" />
        {blur && <div className="pa-cta-blur" aria-hidden="true" style={BLURS[blur]} />}
        <div className="pa-cta-card">
          <div className="pa-cta-stack">
            <h2 className="pa-h2 pa-cta-h2">{heading}</h2>
            <BookDemoButton />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Integrations variant (§2.6 social, §6.9 ask-siena) ---------- */
export function ProductIntegrations({ variant, eyebrow, title, tiles }) {
  return (
    <section className={`pa-int pa-int--${variant}`}>
      <div className="pa-int-inner">
        <div className="pa-title pa-title--left">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <H2 className="pa-int-h2">{title}</H2>
        </div>
        <div className="integrations-grid pa-int-grid">
          {tiles.map((t, i) => (
            <div key={i} className="pa-int-tile">
              {t.text ? (
                <p className="pa-int-text"><strong>{t.text}</strong></p>
              ) : (
                <img src={t.src} alt={t.alt || ''} className="pa-int-logo" style={{ width: t.w, height: t.h, filter: t.dark ? 'brightness(0)' : undefined }} />
              )}
            </div>
          ))}
        </div>
        <a href={siteHref('/integrations')} className="explore-btn pa-int-btn relative inline-flex flex-none items-center justify-center whitespace-nowrap rounded-[16px] bg-ink px-[24px] py-[18px] hover:bg-rainbow">
          <span className="select-none font-sans text-[18px] font-semibold leading-[21.6px] text-white">Explore all integrations</span>
        </a>
      </div>
    </section>
  )
}

/* ---------- Enterprise (§2.7 / §6.10) ---------- */
export function Enterprise({ variant = 'social', cards, text }) {
  return (
    <section className={`pa-ent pa-ent--${variant}`}>
      <div className="pa-ent-inner">
        <div className="pa-ent-title">
          <h2 className="pa-ent-h2">Enterprise-grade safety</h2>
          <p className="pa-ent-text">{text}</p>
        </div>
        <div className="pa-ent-cards">
          {cards.map(([code, t, d]) => (
            <div key={t} className="pa-ent-card">
              <div className="pa-ent-card-inner">
                <Fa code={code} />
                <h6 className="pa-h6">{t}</h6>
                <p className="pa-ent-card-text">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Before / With Siena (§4.8, §5.7) ---------- */
export function BeforeAfter({ variant = 'qa', title, text, before, after, spacer }) {
  return (
    <section className={`pa-ba pa-ba--${variant}`}>
      <div className="pa-title pa-title--center" style={{ maxWidth: 800 }}>
        {spacer && <div className="pa-ba-spacer" aria-hidden="true" />}
        <H2>{title}</H2>
        <p className="pa-sub" style={{ maxWidth: 620 }}>{text}</p>
      </div>
      <div className="pa-ba-row">
        {[['Before', before, 0xf00d], ['With Siena', after, 0xf890]].map(([h, list, code]) => (
          <Appear key={h} on="view" from={0.001} dur={0.4} delay={0.4} ease="cubic-bezier(0.94,-0.05,0,1)" className="pa-ba-card">
            <div className="pa-ba-card-inner">
              <h3 className="pa-h3 text-center">{h}</h3>
              <ul className="pa-ba-list">
                {list.map((l) => (
                  <li key={l}>
                    <Fa code={code} />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Appear>
        ))}
      </div>
    </section>
  )
}

/* ---------- Section pill nav with sliding highlight (§2.3 / §6.3) ---------- */
export function useSlidingHighlight(active, deps = []) {
  const linkRefs = useRef([])
  const [box, setBox] = useState(null)
  useEffect(() => {
    const el = linkRefs.current[active]
    if (!el) return
    const measure = () => setBox({ left: el.offsetLeft, width: el.offsetWidth, top: el.offsetTop, height: el.offsetHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el.parentElement)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, ...deps])
  return { linkRefs, box }
}

export { EASE_OUT }
