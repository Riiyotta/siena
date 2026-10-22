import { useEffect, useRef, useState } from 'react'
import ChatMock from './scroll-area/ChatMock.jsx'
import { BookDemoButton, StarIcon } from './scroll-area/parts.jsx'
import { PILLARS } from './scroll-area/data.js'
import '../styles/scroll-area.css'

function Bullets({ items }) {
  return (
    <ul className="sa-bullets">
      {items.map((b) => (
        <li key={b} className="sa-bullet">
          <StarIcon />
          <span className="sa-bullet-text">{b}</span>
        </li>
      ))}
    </ul>
  )
}

function BlockHeading({ children }) {
  return (
    <div className="sa-h2-wrap">
      <h2 className="sa-h2">{children}</h2>
    </div>
  )
}

export default function ScrollArea() {
  const blockRefs = useRef([])
  const cardRef = useRef(null)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const [switchId, setSwitchId] = useState(0) // bumps on every variant change -> remount -> replay entrance
  const [cardSeen, setCardSeen] = useState(false)

  // CLONE_SPEC §4: switch when a left block crosses 50% of the viewport; active = last intersecting.
  useEffect(() => {
    const blocks = blockRefs.current.filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        let next = null
        entries.forEach((e) => {
          if (e.isIntersecting) next = blocks.indexOf(e.target)
        })
        if (next !== null && next >= 0 && next !== activeRef.current) {
          activeRef.current = next
          setActive(next)
          setSwitchId((n) => n + 1)
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )
    blocks.forEach((b) => io.observe(b))
    return () => io.disconnect()
  }, [])

  // Variant 1's first stagger starts when the card first comes into view.
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setCardSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="sa-section">
      {/* Desktop / tablet (>=810px): pinned chat mock */}
      <div className="sa-desktop">
        <div className="sa-content">
          {PILLARS.map((p, i) => (
            <div key={p.title} className="sa-block" ref={(el) => (blockRefs.current[i] = el)}>
              <BlockHeading>{p.title}</BlockHeading>
              <Bullets items={p.bullets} />
              <BookDemoButton />
            </div>
          ))}
        </div>
        <div className="sa-sticky">
          <div ref={cardRef} className="sa-card-slot">
            <ChatMock key={switchId} variant={active} play={cardSeen} />
          </div>
        </div>
      </div>

      {/* Phone (<810px): static stack, each block has its own card */}
      <div className="sa-mobile">
        {PILLARS.map((p, i) => (
          <div key={p.title} className="sa-block">
            <BlockHeading>{p.title}</BlockHeading>
            <ChatMock variant={i} mobile />
            <Bullets items={p.bullets} />
            <BookDemoButton />
          </div>
        ))}
      </div>
    </section>
  )
}
