import { useLayoutEffect, useRef, useState } from 'react'

// specs/conversion.md §3.1 / §6.1 single-row logo ticker: leftward, linear, infinite, list ×2.
// speed in px/s (compare 45, add-ons 30). Gap comes from CSS (--cv-ticker-gap: 96 desktop / 40 phone);
// each copy carries a trailing gap so translating by −50% is one seamless period.
export default function SingleTicker({ logos, speed }) {
  const listRef = useRef(null)
  const [duration, setDuration] = useState(0)

  useLayoutEffect(() => {
    const el = listRef.current
    if (!el) return
    const measure = () => setDuration(el.getBoundingClientRect().width / speed)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [speed])

  const items = (k) =>
    logos.map((l, i) => (
      <li key={`${k}-${i}`} className="cv-ticker-item" style={{ width: l.w, height: l.h }}>
        <img src={l.src} alt={k === 'a' ? l.name : ''} style={l.inner ? { width: l.inner[0], height: l.inner[1] } : undefined} draggable="false" />
      </li>
    ))

  return (
    <section className="cv-ticker" aria-label="Customer logos">
      <div className="cv-ticker-track" style={duration ? { animationDuration: `${duration}s` } : { animationPlayState: 'paused' }}>
        <ul ref={listRef} className="cv-ticker-list">{items('a')}</ul>
        <ul className="cv-ticker-list" aria-hidden="true">{items('b')}</ul>
      </div>
    </section>
  )
}

const s = (f) => `/svg/${f}`
const n = (i) => `ticker-logo-${String(i).padStart(2, '0')}.svg`
// Rendered sizes, slots 1–28 (§3.1). Slot 2: FIGS 92x32 box, svg 91x26 centered.
const SIZES = [
  [176, 32], [92, 32], [209, 32], [167, 32], [119, 38], [111, 40], [120, 38], [91, 44], [241, 24], [99, 44],
  [161, 32], [207, 38], [156, 38], [71, 38], [112, 38], [150, 24], [152, 30], [188, 40], [154, 44], [126, 38],
  [178, 30], [103, 30], [189, 38], [86, 44], [112, 44], [144, 30], [82, 44], [121, 30],
]

export const COMPARE_LOGOS = SIZES.map(([w, h], i) =>
  i === 1
    ? { name: 'FIGS', src: s('compare-ticker-02-figs.svg'), w, h, inner: [91, 26] }
    : { name: `Logo ${i + 1}`, src: s(n(i + 1)), w, h },
)

// §6.1: 18 logos; slot 2 = ticker-logo-02.svg (159x32).
export const ADDONS_LOGOS = SIZES.slice(0, 18).map(([w, h], i) =>
  i === 1 ? { name: 'Logo 2', src: s(n(2)), w: 159, h: 32 } : { name: `Logo ${i + 1}`, src: s(n(i + 1)), w, h },
)
