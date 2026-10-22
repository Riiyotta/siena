import { useEffect, useRef, useState } from 'react'
import Slide from './testimonials/Slide.jsx'
import { TESTIMONIALS } from './testimonials/data.js'
import '../styles/testimonials.css'

const COUNT = TESTIMONIALS.length // 11
const DURATION_MS = 300 // CLONE_SPEC §3: transform .3s cubic-bezier(0.45, 0, 0.55, 1)

function Chevron({ points }) {
  return (
    <svg className="t-chevron" viewBox="0 0 24 24" aria-hidden="true">
      <polyline points={points} />
    </svg>
  )
}

export default function Testimonials() {
  // phase: 'idle' | 'start' (slides placed at their start offsets) | 'run' (transitioning)
  const [state, setState] = useState({ index: 0, prev: null, dir: 1, phase: 'idle' })
  const timer = useRef(0)

  const go = (dir) => {
    setState((s) => {
      if (s.phase !== 'idle') return s
      return { index: (s.index + dir + COUNT) % COUNT, prev: s.index, dir, phase: 'start' }
    })
  }

  useEffect(() => {
    if (state.phase === 'start') {
      // Two frames so the start offsets are painted before the transition is applied.
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
      timer.current = window.setTimeout(
        () => setState((s) => ({ ...s, prev: null, phase: 'idle' })),
        DURATION_MS,
      )
      return () => window.clearTimeout(timer.current)
    }
  }, [state.phase])

  const { index, prev, dir, phase } = state
  const running = phase === 'run'
  const inTransform = phase === 'start' ? `translateX(${dir * 100}%)` : 'translateX(0)'
  const outTransform = phase === 'start' ? 'translateX(0)' : `translateX(${-dir * 100}%)`

  return (
    <section className="t-section" aria-label="Customer testimonials">
      <div className="t-title">
        <p className="t-eyebrow">customer stories</p>
        <h2 className="t-h2">The best CX teams work with Siena</h2>
      </div>

      <div className="t-slider-wrap">
        <div className="t-slider">
          <div className="t-controls">
            <button type="button" className="t-nav-btn" aria-label="Previous testimonial" onClick={() => go(-1)}>
              <Chevron points="15 18 9 12 15 6" />
            </button>
            <p className="t-counter" aria-live="polite">
              {index + 1}
              <span className="t-counter-total"> / {COUNT}</span>
            </p>
            <button type="button" className="t-nav-btn" aria-label="Next testimonial" onClick={() => go(1)}>
              <Chevron points="9 18 15 12 9 6" />
            </button>
          </div>

          <div className="t-viewport">
            {prev !== null && (
              <Slide
                key={`out-${prev}`}
                data={TESTIMONIALS[prev]}
                className={`t-slide--out${running ? ' is-moving' : ''}`}
                style={{ transform: outTransform }}
                aria-hidden="true"
              />
            )}
            <Slide
              key={`in-${index}`}
              data={TESTIMONIALS[index]}
              className={running ? 'is-moving' : ''}
              style={{ transform: inTransform }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
