import { useEffect, useRef, useState } from 'react'
import Slide from '../testimonials/Slide.jsx'
import '../../styles/testimonials.css'

// VARIANT of homepage Testimonials slider (§1.5 /memory, §4.6 /products/docs, §6.3 /roi-calculator).
// Same controls + slide-change animation (transform .3s cubic-bezier(.45,0,.55,1), no autoplay).
// Width / role style / image size differences are applied by the `className` scope in product-b.css.
const DURATION_MS = 300

function Chevron({ points }) {
  return (
    <svg className="t-chevron" viewBox="0 0 24 24" aria-hidden="true">
      <polyline points={points} />
    </svg>
  )
}

export default function TestimonialSlider({ slides, controls = true, className = '' }) {
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
  const inT = phase === 'start' ? `translateX(${dir * 100}%)` : 'translateX(0)'
  const outT = phase === 'start' ? 'translateX(0)' : `translateX(${-dir * 100}%)`

  return (
    <div className={`pb-tm ${className}`}>
      <div className="t-slider pb-tm-slider">
        {controls && (
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
        <div className="t-viewport pb-tm-viewport">
          {prev !== null && (
            <Slide
              key={`out-${prev}`}
              data={slides[prev]}
              className={`t-slide--out${running ? ' is-moving' : ''}`}
              style={{ transform: outT }}
              aria-hidden="true"
            />
          )}
          <Slide key={`in-${index}`} data={slides[index]} className={running ? 'is-moving' : ''} style={{ transform: inT }} />
        </div>
      </div>
    </div>
  )
}
