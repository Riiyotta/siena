import { useEffect, useRef, useState } from 'react'
import Slide from '../testimonials/Slide.jsx'
import '../../styles/testimonials.css'

// Variant of homepage Testimonials (same slide component, buttons and 300ms horizontal slide).
// variant: 'pricing' | 'book' | 'gorgias' | 'kustomer' — layout diffs per specs/conversion.md
// §1.4, §2.3, §3.2, §5.2 live in styles/conversion.css (.cvt--*).
const DURATION_MS = 300

function Chevron({ points }) {
  return (
    <svg className="t-chevron" viewBox="0 0 24 24" aria-hidden="true">
      <polyline points={points} />
    </svg>
  )
}

export default function ConvTestimonials({ slides, variant, eyebrow, title }) {
  const count = slides.length
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
    <section className={`cvt cvt--${variant}`} aria-label="Customer testimonials">
      {title && (
        <div className="cvt-title">
          <p className="t-eyebrow cv-eyebrow">{eyebrow}</p>
          <h2 className="cv-h2">{title}</h2>
        </div>
      )}
      <div className="cvt-panel">
        <div className="cvt-slider">
          <div className="t-controls cvt-controls">
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
          {/* Kustomer phone only (live): prev / dots / next row under the slide instead of the counter */}
          <div className="cvt-dots-row">
            <button type="button" className="t-nav-btn" aria-label="Previous testimonial" onClick={() => go(-1)}>
              <Chevron points="15 18 9 12 15 6" />
            </button>
            <div className="cvt-dots" aria-hidden="true">
              {slides.map((_, i) => (
                <span key={i} className={`cvt-dot ${i === index ? 'is-active' : ''}`} />
              ))}
            </div>
            <button type="button" className="t-nav-btn" aria-label="Next testimonial" onClick={() => go(1)}>
              <Chevron points="9 18 15 12 9 6" />
            </button>
          </div>
          <div className="t-viewport cvt-viewport">
            {prev !== null && (
              <Slide
                key={`out-${prev}`}
                data={slides[prev]}
                className={`t-slide--out${running ? ' is-moving' : ''}`}
                style={{ transform: outTransform }}
                aria-hidden="true"
              />
            )}
            <Slide key={`in-${index}`} data={slides[index]} className={running ? 'is-moving' : ''} style={{ transform: inTransform }} />
          </div>
        </div>
      </div>
    </section>
  )
}
