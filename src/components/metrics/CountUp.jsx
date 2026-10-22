import { useEffect, useRef, useState } from 'react'

// framer-motion "easeInOut" = cubic-bezier(0.42, 0, 0.58, 1). Solve x(t) = p for t, return y(t).
function cubicBezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by
  const sx = (t) => ((ax * t + bx) * t + cx) * t
  const sy = (t) => ((ay * t + by) * t + cy) * t
  const dx = (t) => (3 * ax * t + 2 * bx) * t + cx
  return (p) => {
    let t = p
    for (let i = 0; i < 8; i++) {
      const err = sx(t) - p
      const d = dx(t)
      if (Math.abs(err) < 1e-6 || Math.abs(d) < 1e-6) break
      t -= err / d
    }
    return sy(Math.min(1, Math.max(0, t)))
  }
}
const easeInOut = cubicBezier(0.42, 0, 0.58, 1)

/**
 * CLONE_SPEC §5 count-up: from 25 to 80, 1.5s easeInOut, 0 decimals, once, starts when any
 * pixel of the counter enters the viewport. The counter also fades opacity 0 -> 1 on enter.
 */
export default function CountUp({ from = 25, to = 80, duration = 1.5, className = '' }) {
  const ref = useRef(null)
  const [value, setValue] = useState(from)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to)
      return
    }
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - start) / (duration * 1000))
      setValue(Math.round(from + (to - from) * easeInOut(p)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, from, to, duration])

  return (
    <p ref={ref} className={`${className} ${inView ? 'is-in' : ''}`}>
      {value}
    </p>
  )
}
