import { createElement, useEffect, useRef, useState } from 'react'

// Framer appear / reveal primitive for product pages A (specs/product-a.md §0 "Appear primitive").
// Tween eases from the spec; springs ({bounce:0.2, duration:1}) approximated with a light-overshoot bezier.
export const EASE_H1 = 'cubic-bezier(0, 0.91, 0.14, 0.85)'
export const EASE_SUB = 'cubic-bezier(0, 0.91, 0.78, 1)'
export const SPRING = 'cubic-bezier(0.3, 1.15, 0.55, 1)' // ≈ spring bounce 0.2 (t50 ≈ 185ms of 1s, ~1px overshoot)
export const EASE_OUT = 'cubic-bezier(0.2, 0.8, 0.2, 1)'

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

// once: stays true after first intersection; otherwise mirrors visibility.
export function useInView(ref, { once = true, rootMargin = '0px', threshold = 0 } = {}) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) setInView(false)
      },
      { rootMargin, threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [once, rootMargin, threshold])
  return inView
}

// Two frames after mount -> true (so the initial state paints before the transition runs).
export function useMounted() {
  const [m, setM] = useState(false)
  useEffect(() => {
    let r2
    const r1 = requestAnimationFrame(() => (r2 = requestAnimationFrame(() => setM(true))))
    return () => {
      cancelAnimationFrame(r1)
      cancelAnimationFrame(r2)
    }
  }, [])
  return m
}

/**
 * <Appear> — initial {opacity:0.001, x, y, rotate} -> {opacity:to, 0}.
 * on: 'load' (mount) | 'view' (IntersectionObserver) | boolean (controlled)
 */
export function Appear({
  as = 'div', on = 'load', once = true, x = 0, y = 0, rotate = 0, scale = 1, from = 0.001, to = 1,
  delay = 0, dur = 0.7, ease = EASE_SUB, blur = 0, className = '', style, children, ...rest
}) {
  const ref = useRef(null)
  const mounted = useMounted()
  const seen = useInView(ref, { once })
  const reduced = prefersReducedMotion()
  const shown = reduced || (on === 'load' ? mounted : on === 'view' ? seen && mounted : !!on)
  const initT = `translate(${x}px, ${y}px)${rotate ? ` rotate(${rotate}deg)` : ''}${scale !== 1 ? ` scale(${scale})` : ''}`
  const s = {
    ...style,
    opacity: shown ? to : from,
    transform: shown ? style?.transform || 'none' : `${initT}${style?.transform ? ' ' + style.transform : ''}`,
    filter: blur ? (shown ? 'blur(0px)' : `blur(${blur}px)`) : style?.filter,
    transition: reduced
      ? 'none'
      : `opacity ${dur}s ${ease} ${delay}s, transform ${dur}s ${ease} ${delay}s${blur ? `, filter ${dur}s ${ease} ${delay}s` : ''}`,
  }
  return createElement(as, { ref, className, style: s, ...rest }, children)
}

/** Per-letter blur-in typing (spec §1.4): letters 50ms apart, each 0.4s ease-out, y 10 -> 0, blur 10 -> 0. */
export function TypeIn({ text, play = true, stagger = 0.05, dur = 0.4, className = '', style }) {
  const reduced = prefersReducedMotion()
  const mounted = useMounted()
  const on = reduced || (play && mounted)
  let n = 0
  const words = text.split(' ')
  return (
    <span className={className} style={style} aria-label={text}>
      {words.map((w, wi) => [
        wi > 0 && ' ',
        <span key={wi} aria-hidden="true" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {[...w].map((ch, ci) => {
            const i = n++
            return (
              <span
                key={ci}
                style={{
                  display: 'inline-block',
                  opacity: on ? 1 : 0.001,
                  transform: on ? 'none' : 'translateY(10px)',
                  filter: on ? 'blur(0px)' : 'blur(10px)',
                  transition: reduced ? 'none' : `opacity ${dur}s ease-out ${i * stagger}s, transform ${dur}s ease-out ${i * stagger}s, filter ${dur}s ease-out ${i * stagger}s`,
                }}
              >
                {ch}
              </span>
            )
          })}
        </span>,
      ])}
    </span>
  )
}
