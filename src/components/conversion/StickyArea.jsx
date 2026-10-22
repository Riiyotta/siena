import { useEffect, useRef, useState } from 'react'
import { StarIcon } from '../scroll-area/parts.jsx'
import '../../styles/scroll-area.css'
import { DarkButton } from './ui.jsx'

// Variant of homepage ScrollArea (same pinning + IntersectionObserver switch rule: active = block crossing
// 50% of the viewport). specs/conversion.md §3.5 (compare, 4 blocks) / §6.2 (add-ons, 3 blocks).
// blocks: [{ title, desc?, bullets: [string | [lead, rest]], button: bool, card: (opts) => node }]
// card opts: { mobile, play, key }. kind: 'compare' | 'addons' (typography + paddings in conversion.css).
function Bullets({ items }) {
  return (
    <ul className="sa-bullets">
      {items.map((b) => {
        const [lead, rest] = Array.isArray(b) ? b : [null, b]
        return (
          <li key={lead || rest} className="sa-bullet">
            <StarIcon />
            <span className="sa-bullet-text">
              {lead && <strong className="cv-sa-lead">{lead}</strong>}
              {lead ? ' ' : ''}
              {rest}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function Heading({ kind, children }) {
  const Tag = kind === 'compare' ? 'h3' : 'h2'
  return <Tag className={`cv-sa-h cv-sa-h--${kind}`}>{children}</Tag>
}

export default function StickyArea({ kind, blocks }) {
  const blockRefs = useRef([])
  const cardRef = useRef(null)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const [switchId, setSwitchId] = useState(0)
  const [cardSeen, setCardSeen] = useState(false)

  useEffect(() => {
    const els = blockRefs.current.filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        let next = null
        entries.forEach((e) => {
          if (e.isIntersecting) next = els.indexOf(e.target)
        })
        if (next !== null && next >= 0 && next !== activeRef.current) {
          activeRef.current = next
          setActive(next)
          setSwitchId((n) => n + 1)
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )
    els.forEach((b) => io.observe(b))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setCardSeen(true)
        io.disconnect()
      }
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className={`sa-section cv-sa cv-sa--${kind}`}>
      <div className="sa-desktop">
        <div className="sa-content">
          {blocks.map((b, i) => (
            <div key={b.title} className="sa-block" ref={(el) => (blockRefs.current[i] = el)}>
              <Heading kind={kind}>{b.title}</Heading>
              {b.desc && <p className={`cv-sa-desc cv-sa-desc--${kind}`}>{b.desc}</p>}
              <Bullets items={b.bullets} />
              {b.button && <DarkButton />}
            </div>
          ))}
        </div>
        <div className="sa-sticky">
          <div ref={cardRef} className="sa-card-slot">
            {blocks[active].card({ mobile: false, play: cardSeen, key: switchId })}
          </div>
        </div>
      </div>

      <div className="sa-mobile">
        {blocks.map((b) => (
          <div key={b.title} className="sa-block">
            {/* mobileDescFirst (add-ons blocks 2–3, live): H2 → desc (16px) → card; otherwise H2 → card → desc */}
            {b.mobileDescFirst ? (
              <div className="cv-sa-headgroup">
                <Heading kind={kind}>{b.title}</Heading>
                <p className={`cv-sa-desc cv-sa-desc--${kind}`}>{b.desc}</p>
              </div>
            ) : (
              <Heading kind={kind}>{b.title}</Heading>
            )}
            <div className="cv-sa-mcard">{b.card({ mobile: true, play: false, key: 'm' })}</div>
            {b.desc && !b.mobileDescFirst && <p className={`cv-sa-desc cv-sa-desc--${kind}`}>{b.desc}</p>}
            <Bullets items={b.bullets} />
            {b.button && <DarkButton />}
          </div>
        ))}
      </div>
    </section>
  )
}
