import { useLayoutEffect, useRef, useState } from 'react'

const SPEED = 30 // px/s, CLONE_SPEC §2 / §13

// One infinite row. The list is rendered twice; each copy carries a trailing gap (padding-right = gap)
// so one copy's width is exactly one loop period and translating the track by -50% is seamless.
export default function LogoTicker({ logos, direction }) {
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

  const items = (keyPrefix) =>
    logos.map((logo, i) => (
      <li key={`${keyPrefix}-${i}`} className="flex flex-none items-center">
        <img src={logo.src} alt={keyPrefix === 'a' ? logo.name : ''} width={logo.w} height={logo.h} className="block" style={{ width: logo.w, height: logo.h }} draggable="false" />
      </li>
    ))

  return (
    <div className="ticker-row">
      <div
        className={`ticker-track ticker-track--${direction}`}
        style={duration ? { animationDuration: `${duration}s` } : { animationPlayState: 'paused' }}
      >
        <ul ref={listRef} className="ticker-list">{items('a')}</ul>
        <ul className="ticker-list" aria-hidden="true">{items('b')}</ul>
      </div>
    </div>
  )
}
