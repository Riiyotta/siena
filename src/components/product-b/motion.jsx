import { createElement, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

// Motion primitives for specs/product-b.md (Framer appear / scroll-reveal values are exact).
// Framer-motion is not a dependency, so springs are solved here with framer-motion's own
// `findSpring` (duration + bounce -> stiffness/damping), integrated, and sampled into a CSS
// `linear()` easing that WAAPI plays. Tweens map to `cubic-bezier()`.

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const springCache = new Map()

// framer-motion findSpring (duration in s, bounce 0..1) -> { stiffness, damping }
function findSpring(duration, bounce) {
  const safeMin = 0.001
  const ratio = Math.min(1, Math.max(0.05, 1 - bounce))
  const d = Math.min(10, Math.max(0.01, duration))
  const angular = (f, r) => f * Math.sqrt(1 - r * r)
  let envelope, derivative
  if (ratio < 1) {
    envelope = (f) => {
      const decay = f * ratio
      return safeMin - (decay / angular(f, ratio)) * Math.exp(-decay * d)
    }
    derivative = (f) => {
      const decay = f * ratio
      const delta = decay * d
      const e = ratio * ratio * f * f * d
      const g = angular(f * f, ratio)
      const factor = -envelope(f) + safeMin > 0 ? -1 : 1
      return (factor * (-e * Math.exp(-delta))) / g
    }
  } else {
    envelope = (f) => -safeMin + Math.exp(-f * d) * ((f - 0) * d + 1)
    derivative = (f) => Math.exp(-f * d) * (d * d * -f)
  }
  let f = 5 / d
  for (let i = 1; i < 12; i++) f = f - envelope(f) / derivative(f)
  if (!Number.isFinite(f)) return { stiffness: 100, damping: 10 }
  const stiffness = f * f
  return { stiffness, damping: ratio * 2 * Math.sqrt(stiffness) }
}

// Integrate a 0 -> 1 spring and return { easing: 'linear(...)', ms }
export function springEasing({ duration, bounce, stiffness, damping, mass = 1 }) {
  const key = `${duration}|${bounce}|${stiffness}|${damping}|${mass}`
  if (springCache.has(key)) return springCache.get(key)
  const p = stiffness ? { stiffness, damping } : findSpring(duration ?? 0.8, bounce ?? 0.25)
  const dt = 1 / 1000
  let x = 0
  let v = 0
  const pts = [0]
  let t = 0
  let still = 0
  // run until at rest (|1-x| < 0.0005 and |v| < 0.01 for 50ms), cap 4s
  while (t < 4) {
    for (let i = 0; i < 10; i++) {
      const a = (-p.stiffness * (x - 1) - p.damping * v) / mass
      v += a * dt
      x += v * dt
      t += dt
    }
    pts.push(x)
    if (Math.abs(1 - x) < 0.0005 && Math.abs(v) < 0.01) {
      still += 10
      if (still >= 50) break
    } else still = 0
  }
  pts[pts.length - 1] = 1
  const res = { easing: `linear(${pts.map((n) => +n.toFixed(4)).join(',')})`, ms: pts.length * 10 - 10 }
  springCache.set(key, res)
  return res
}

const bez = (e) => (Array.isArray(e) ? `cubic-bezier(${e.join(',')})` : e || 'ease')

// transition -> WAAPI timing
export function timing(tr = {}) {
  const delay = (tr.delay ?? 0) * 1000
  if (tr.type === 'spring') {
    const s = springEasing(tr)
    return { duration: s.ms, easing: s.easing, delay }
  }
  return { duration: (tr.duration ?? 0.3) * 1000, easing: bez(tr.ease), delay }
}

const tf = (s = {}) => {
  const parts = []
  if (s.x || s.y) parts.push(`translate(${s.x || 0}px, ${s.y || 0}px)`)
  if (s.scale != null && s.scale !== 1) parts.push(`scale(${s.scale})`)
  if (s.rotate) parts.push(`rotate(${s.rotate}deg)`)
  return parts.length ? parts.join(' ') : 'none'
}

export function frameOf(s = {}, base = '') {
  const f = { transform: `${base} ${tf(s)}`.replace(' none', '').trim() || 'none' }
  if (s.opacity != null) f.opacity = s.opacity
  if (s.filter != null) f.filter = s.filter
  return f
}

export function initialStyle(from, base) {
  if (!from || reducedMotion()) return base ? { transform: base } : undefined
  const f = frameOf(from, base)
  return f
}

/**
 * <Motion from={{opacity:0,y:50}} to={{opacity:1}} transition={{type:'spring',bounce:.2,duration:1,delay:.5}}
 *         trigger="view"|"load"|"manual" amount={0.5} once />
 * `base` = a static transform that must be kept (e.g. "rotate(12deg)") — motion transform is appended.
 */
export const Motion = forwardRef(function Motion(
  { as = 'div', from, to = {}, transition, trigger = 'view', amount = 0.5, once = true, base = '', style, play, children, ...rest },
  ref,
) {
  const el = useRef(null)
  const anim = useRef(null)
  useImperativeHandle(ref, () => el.current)

  useEffect(() => {
    const node = el.current
    if (!node || !from) return
    if (reducedMotion()) {
      Object.assign(node.style, frameOf({ opacity: to.opacity ?? 1 }, base))
      return
    }
    const target = { x: 0, y: 0, scale: 1, rotate: 0, filter: from.filter != null ? 'none' : undefined, opacity: to.opacity ?? 1, ...to }
    const run = () => {
      anim.current?.cancel()
      anim.current = node.animate([frameOf(from, base), frameOf(target, base)], { ...timing(transition), fill: 'both' })
    }
    const reset = () => {
      anim.current?.cancel()
      anim.current = null
      Object.assign(node.style, frameOf(from, base))
    }
    if (trigger === 'load') {
      run()
      return () => anim.current?.cancel()
    }
    if (trigger === 'manual') {
      if (play) run()
      else reset()
      return undefined
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          run()
          if (once) io.disconnect()
        } else if (!once && anim.current) reset()
      },
      { threshold: amount },
    )
    io.observe(node)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, play])

  return createElement(as, { ref: el, style: { ...initialStyle(from, base), ...style }, ...rest }, children)
})

// §0 hero appear primitive: y 200 -> 0, opacity .001 -> 1 (subtitle -> .82), 0.7s tween
const HERO_EASE = { 0.2: [0, 0.91, 0.14, 0.85], 0.3: [0, 0.91, 0.78, 1], 0.4: [0, 0.91, 0.78, 1] }
export function Appear({ delay = 0.2, opacity = 1, ease, ...rest }) {
  return (
    <Motion
      trigger="load"
      from={{ opacity: 0.001, y: 200 }}
      to={{ opacity }}
      transition={{ duration: 0.7, delay, ease: ease || HERO_EASE[delay] || [0, 0.91, 0.78, 1] }}
      {...rest}
    />
  )
}

// §0 scroll reveal: {opacity:0,y:50} -> spring bounce .2 dur 1, threshold .5, once
export function Reveal({ y = 50, delay = 0, bounce = 0.2, duration = 1, ...rest }) {
  return <Motion from={{ opacity: 0, y }} transition={{ type: 'spring', bounce, duration, delay }} {...rest} />
}

// Hook: true once the element is ≥amount in view (or each time, if once=false)
export function useInView(ref, { amount = 0, once = true, rootMargin } = {}, setter) {
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setter(true)
          if (once) io.disconnect()
        } else if (!once) setter(false)
      },
      { threshold: amount, rootMargin },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [ref, amount, once, rootMargin, setter])
}
