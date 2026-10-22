import { useLayoutEffect, useRef, useState } from 'react'
import { FaIcon } from './shared.jsx'

// specs/company.md U3 — one masked column; list rendered twice, linear infinite at ~10px/s.
// Each copy carries a trailing 16px (the <ul> gap) so translating by -50% is one seamless loop.
const SPEED = 10 // px/s

function LoveCard({ item }) {
  return (
    <div className="wl-card">
      {item.quote.map((q) => (
        <p key={q} className="wl-quote">{q}</p>
      ))}
      <div className="wl-author">
        <img className="wl-avatar" src={`/assets/${item.avatar}`} alt="" loading="lazy" />
        <div className="wl-who">
          <p className="wl-name">{item.name}</p>
          <p className="wl-handle">{item.handle}</p>
        </div>
        <FaIcon code={item.icon} brands className="wl-icon" />
      </div>
    </div>
  )
}

export default function VerticalTicker({ items, direction = 'up', className = '' }) {
  const copyRef = useRef(null)
  const [duration, setDuration] = useState(0)

  useLayoutEffect(() => {
    const el = copyRef.current
    if (!el) return
    const measure = () => setDuration(el.getBoundingClientRect().height / SPEED)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const copy = (key, ref) => (
    <li key={key} ref={ref} className="wl-copy" aria-hidden={key === 'b' || undefined}>
      {items.map((item, i) => (
        <LoveCard key={i} item={item} />
      ))}
    </li>
  )

  return (
    <section className={`wl-col ${className}`}>
      <ul
        className={`wl-track wl-track--${direction}`}
        style={duration ? { animationDuration: `${duration}s` } : { animationPlayState: 'paused' }}
      >
        {copy('a', copyRef)}
        {copy('b')}
      </ul>
    </section>
  )
}
