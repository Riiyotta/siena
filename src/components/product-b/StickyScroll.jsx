import { useEffect, useRef, useState } from 'react'
import { BookDemoButton, Bullets, useIsPhone } from './shared.jsx'

// VARIANT of homepage ScrollArea (§2.2 /video, §3.3 /order-tracking): left text blocks 512x900 (gap 10),
// right sticky 512x900 column (padding 110/0/40) holding a 512x647 transparent "Sticky Image".
// Active stage = last block crossing 50% of the viewport (same rule as the homepage).
// Phone (<810): no sticky; each block stacks heading → paragraph → bullets → [button] → its own visual.
export default function StickyScroll({ blocks, renderVisual, renderMobileVisual, className = '' }) {
  const refs = useRef([])
  const [active, setActive] = useState(0)
  const [seen, setSeen] = useState(false)
  const stickyRef = useRef(null)
  const phone = useIsPhone()

  useEffect(() => {
    const els = refs.current.filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(els.indexOf(e.target))
        })
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [phone])

  // scroll-reveal threshold 0.5 on the stage group (≈ the 296px card inside the 900px sticky)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.5 })
    if (stickyRef.current) io.observe(stickyRef.current)
    return () => io.disconnect()
  }, [phone])

  return (
    <section className={`ss-section ${className}`}>
      {!phone && (
      <div className="ss-desktop">
        <div className="ss-content">
          {blocks.map((b, i) => (
            <div key={b.title} className="ss-block" ref={(el) => (refs.current[i] = el)}>
              <div className="ss-text">
                <div className="ss-h-wrap">
                  <h3 className="pb-h3r ss-h3">{b.title}</h3>
                  {b.badge}
                </div>
                <p className="pb-p20 ss-p">{b.body}</p>
                <Bullets items={b.bullets} />
                {b.button && <BookDemoButton />}
              </div>
            </div>
          ))}
        </div>
        <div className="ss-sticky">
          <div className="ss-image" ref={stickyRef}>
            {renderVisual(active, seen)}
          </div>
        </div>
      </div>
      )}

      {phone && (
      <div className="ss-mobile">
        {blocks.map((b, i) => (
          <div key={b.title} className="ss-mblock">
            <div className="ss-h-wrap">
              <h2 className="pb-h2 ss-mh2">{b.title}</h2>
              {b.badge}
            </div>
            <p className="pb-p20 ss-p">{b.body}</p>
            <Bullets items={b.bullets} />
            {b.button && <BookDemoButton />}
            {renderMobileVisual(i)}
          </div>
        ))}
      </div>
      )}
    </section>
  )
}
