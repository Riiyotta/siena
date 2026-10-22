import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Fa } from './shared.jsx'
import { reducedMotion, springEasing } from './motion.jsx'

// §1.5 Framer SlideShow: itemAmount 4 / gap 24 (phone 2 / 16, tablet 3 / 16), autoplay every 1.5s,
// direction left, infinite loop, drag, spring {stiffness 200, damping 40, mass 1}, pauses off-screen.
const CARDS = [
  ['Preference', 'Capture customers’ explicit or implicit likes, dislikes, style choices, or brand affinities.', 0xf004, '/svg/ticker-logo-13.svg', 82, 20],
  ['Social', 'Capture what customers are commenting on social media about our products.', 0xf3ce, '/svg/ticker-logo-15.svg', 71, 24],
  ['Coffee choice', 'Capture things that customers tell you about their coffee consumption and preferences.', 0xf7b6, '/svg/ticker-logo-18.svg', 113, 24],
  ['Friends&Fam', 'Capture things that show our customers are referring Earth Breeze to friends and family, and advocating for us.', 0xe300, '/assets/y27Z3JPTR70wZ1vySbDPnp3REZI.svg', 35, 24],
  ['Promos', 'Capture details that tell you about issues users have understanding their promotion.', 0xf02b, '/svg/ticker-logo-07.svg', 63, 20],
  ['Birthday', 'Capture the customer’s birthday and their family members’ birthdays.', 0xf1fd, '/svg/memory-card-logo-birthday.svg', 99, 20],
  ['Shade', 'The customer mentions their favorite colors and shades.', 0xf5c3, '/svg/ticker-logo-10.svg', 54, 24],
  ['Feedback', 'Customers’ opinions — positive or negative — about products, services, and experiences.', 0xe214, '/svg/ticker-logo-06.svg', 56, 20],
  ['Hair type', 'Capture interest in styling options for straight hair, specifically inquiring about achieving waves.', 0xf0c4, '/svg/ticker-logo-11.svg', 101, 20],
  ['Milestones', 'Specific details provided by customers that help Siena personalize interactions like events.', 0xf091, '/svg/ticker-logo-08.svg', 50, 24],
  ['Travelers', 'Customers who frequently travel and need on the go options that are portable.', 0xf072, '/svg/ticker-logo-20.svg', 66, 20],
  ['Delight', 'Standout customer moments that show exceeded expectations and brand loyalty.', 0xe31b, '/svg/ticker-logo-01.svg', 110, 20],
  ['Inventory', 'When customers bring up sold-out products, delays, or order changes due to inventory.', 0xf672, '/svg/ticker-logo-09.svg', 181, 18],
  ['Subscription', 'Capture customer opinions about the Loftie+ subscription, including reasons.', 0xf2f1, '/svg/ticker-logo-22.svg', 69, 20],
]
const N = CARDS.length
const SPRING = springEasing({ stiffness: 200, damping: 40, mass: 1 })

// Layout per breakpoint. Initial index chosen so the first view matches the live captures
// (1440: Hair type…Delight = index 8; 390: Friends&Fam, Promos = index 3; tablet startFrom 3).
function layoutFor(w) {
  if (w < 810) return { amount: 2, gap: 16, start: 3 }
  if (w < 1200) return { amount: 3, gap: 16, start: 3 }
  return { amount: 4, gap: 24, start: 8 }
}

function Card({ c }) {
  const [title, desc, icon, src, w, h] = c
  return (
    <div className="mc-card">
      <div className="mc-text">
        <Fa code={icon} size={20} className="mc-icon" />
        <h3 className="mc-h3">{title}</h3>
        <p className="mc-desc">{desc}</p>
      </div>
      <div className="mc-logo">
        <img src={src} alt="" style={{ width: w, height: h }} draggable="false" />
      </div>
    </div>
  )
}

export default function MemoryCarousel() {
  const wrap = useRef(null)
  const track = useRef(null)
  const [vw, setVw] = useState(() => (typeof window === 'undefined' ? 1440 : window.innerWidth))
  const [width, setWidth] = useState(1062)
  const { amount, gap, start } = layoutFor(vw)
  const pos = useRef(N + start) // index into the tripled list
  const [visible, setVisible] = useState(false)
  const cardW = (width - (amount - 1) * gap) / amount
  const step = cardW + gap

  useLayoutEffect(() => {
    const el = wrap.current
    const measure = () => {
      setWidth(el.getBoundingClientRect().width)
      setVw(window.innerWidth)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useLayoutEffect(() => {
    pos.current = N + start
    if (track.current) track.current.style.transform = `translateX(${-pos.current * step}px)`
  }, [start, step])

  const move = useCallback(
    (dir) => {
      const el = track.current
      if (!el) return
      const fromX = -pos.current * step
      pos.current += dir
      const toX = -pos.current * step
      el.getAnimations().forEach((a) => a.cancel())
      el.style.transform = `translateX(${toX}px)`
      if (!reducedMotion()) {
        el.animate([{ transform: `translateX(${fromX}px)` }, { transform: `translateX(${toX}px)` }], { duration: SPRING.ms, easing: SPRING.easing })
      }
      // keep the position inside the middle copy (silent wrap)
      if (pos.current >= 2 * N || pos.current < N) {
        const t = setTimeout(() => {
          el.getAnimations().forEach((a) => a.finish())
          pos.current = ((pos.current % N) + N) % N + N
          el.style.transform = `translateX(${-pos.current * step}px)`
        }, reducedMotion() ? 0 : SPRING.ms)
        return () => clearTimeout(t)
      }
    },
    [step],
  )

  // playOffscreen:false
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 })
    io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  const dragging = useRef(null)
  useEffect(() => {
    if (!visible || reducedMotion()) return
    const id = setInterval(() => {
      if (!dragging.current) move(1)
    }, 1500)
    return () => clearInterval(id)
  }, [visible, move])

  const onPointerDown = (e) => {
    dragging.current = { x: e.clientX, base: -pos.current * step }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    const d = dragging.current
    if (!d) return
    track.current.style.transform = `translateX(${d.base + e.clientX - d.x}px)`
  }
  const onPointerUp = (e) => {
    const d = dragging.current
    if (!d) return
    dragging.current = null
    const dx = e.clientX - d.x
    track.current.style.transform = `translateX(${d.base}px)`
    if (Math.abs(dx) > 30) move(dx < 0 ? 1 : -1)
  }

  const list = [...CARDS, ...CARDS, ...CARDS]
  return (
    <div className="mc-wrap" ref={wrap}>
      <div className="mc-arrows">
        <button type="button" className="mc-arrow" aria-label="Previous" onClick={() => move(-1)}>
          <img src="/assets/xZOS9ivaVqrdrylU8tlXkU4nk.png" alt="" width="40" height="40" />
        </button>
        <button type="button" className="mc-arrow" aria-label="Next" onClick={() => move(1)}>
          <img src="/assets/tetr5vA8U5aSyL8yw8kUnqB5Mg.png" alt="" width="40" height="40" />
        </button>
      </div>
      <div className="mc-viewport" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        <div className="mc-track" ref={track} style={{ gap }}>
          {list.map((c, i) => (
            <div key={i} className="mc-slot" style={{ width: cardW }} aria-hidden={i < N || i >= 2 * N ? true : undefined}>
              <Card c={c} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
