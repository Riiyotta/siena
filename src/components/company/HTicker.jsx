import { useLayoutEffect, useRef, useState } from 'react'

// specs/company.md M1 "Logos" — masked horizontal ticker, list rendered twice, moves left at 30px/s.
// Each copy carries a trailing gap (padding-right = gap) so translateX(-50%) is exactly one loop.
const SPEED = 30

export default function HTicker({ logos, className = '' }) {
  const listRef = useRef(null)
  const [duration, setDuration] = useState(0)

  useLayoutEffect(() => {
    const el = listRef.current
    if (!el) return
    const measure = () => setDuration(el.getBoundingClientRect().width / SPEED)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const list = (key, ref) => (
    <ul ref={ref} className="ht-list" aria-hidden={key === 'b' || undefined}>
      {logos.map((l, i) => (
        <li key={i} className="ht-item">
          <img src={l.src} alt={key === 'a' ? l.alt || '' : ''} style={{ width: l.w, height: l.h }} draggable="false" />
        </li>
      ))}
    </ul>
  )

  return (
    <section className={`ht ${className}`}>
      <div className="ht-track" style={duration ? { animationDuration: `${duration}s` } : { animationPlayState: 'paused' }}>
        {list('a', listRef)}
        {list('b')}
      </div>
    </section>
  )
}
