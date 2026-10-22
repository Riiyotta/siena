import { useEffect, useRef, useState } from 'react'
import '../../styles/testimonials.css'

// Testimonials slider VARIANT (specs/company.md P3 partner, R3 refer-a-friend): no title, slider sits in a
// gradient "content" card. Same controls + slide transition as homepage §3 (transform .3s, loops).
// renderSlide(item, { className, style, 'aria-hidden' }) renders one slide using the homepage t-* classes.
const DURATION_MS = 300

function Chevron({ points }) {
  return (
    <svg className="t-chevron" viewBox="0 0 24 24" aria-hidden="true">
      <polyline points={points} />
    </svg>
  )
}

export default function CompanySlider({ items, renderSlide, variant }) {
  const count = items.length
  const [state, setState] = useState({ index: 0, prev: null, dir: 1, phase: 'idle' })
  const timer = useRef(0)

  const go = (dir) =>
    setState((s) => (s.phase !== 'idle' ? s : { index: (s.index + dir + count) % count, prev: s.index, dir, phase: 'start' }))

  useEffect(() => {
    if (state.phase === 'start') {
      let r2
      const r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setState((s) => ({ ...s, phase: 'run' })))
      })
      return () => {
        cancelAnimationFrame(r1)
        cancelAnimationFrame(r2)
      }
    }
    if (state.phase === 'run') {
      timer.current = window.setTimeout(() => setState((s) => ({ ...s, prev: null, phase: 'idle' })), DURATION_MS)
      return () => window.clearTimeout(timer.current)
    }
  }, [state.phase])

  const { index, prev, dir, phase } = state
  const running = phase === 'run'
  const inTransform = phase === 'start' ? `translateX(${dir * 100}%)` : 'translateX(0)'
  const outTransform = phase === 'start' ? 'translateX(0)' : `translateX(${-dir * 100}%)`

  return (
    <section className={`cs cs--${variant}`} aria-label="Testimonials">
      <div className="cs-card">
        <div className="t-slider cs-slider">
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
          <div className="t-viewport cs-viewport">
            {prev !== null &&
              renderSlide(items[prev], {
                key: `out-${prev}`,
                className: `t-slide--out${running ? ' is-moving' : ''}`,
                style: { transform: outTransform },
                'aria-hidden': 'true',
              })}
            {renderSlide(items[index], {
              key: `in-${index}`,
              className: running ? 'is-moving' : '',
              style: { transform: inTransform },
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

// Partner slide (P3): homepage slide structure, optional logo (slide 6 has none on live).
export function PartnerSlide({ data, className = '', style, ...rest }) {
  return (
    <div className={`t-slide ${className}`} style={style} {...rest}>
      <div className="t-slide-text">
        <svg className="t-quote-mark" viewBox="0 0 30 24" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M7.2 23.427c-4.128 0-7.2-3.264-7.2-7.775C0 7.492 4.896 1.635 12.96.771v1.823C8.832 3.46 4.224 7.3 3.936 12.58c5.184-2.112 9.024 1.248 9.024 4.8 0 3.456-2.496 6.048-5.76 6.048Zm9.696-7.775c0-8.16 4.896-14.017 12.96-14.88v1.823c-4.128.864-8.736 4.704-9.024 9.984 5.184-2.112 9.024 1.248 9.024 4.8 0 3.456-2.496 6.048-5.76 6.048-4.128 0-7.2-3.264-7.2-7.775Z"
            fill="#122023"
          />
        </svg>
        <p className="t-quote">{data.quote}</p>
        <div className="t-brand">
          <div className="t-logo">{data.logo && <img src={`/assets/${data.logo}`} alt="" />}</div>
          <div className="t-person">
            <p className="t-name">{data.name}</p>
            <p className="t-role">{data.role}</p>
          </div>
        </div>
      </div>
      <div className="t-slide-media">
        <img src={`/assets/${data.photo}`} alt={`Photo of ${data.name}`} />
      </div>
    </div>
  )
}
