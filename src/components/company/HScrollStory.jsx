import { useEffect, useRef } from 'react'
import { FaIcon, FOUR_POINT_STAR } from './shared.jsx'

// specs/company.md A2 — sticky 100vh viewport inside a tall section (1440: 7500, 390: 6000);
// translateX = -(trackWidth - viewportWidth) * p, p = clamp((scrollY - sectionTop) / (sectionH - vh), 0, 1),
// smoothed with a per-frame lerp (0.15) so a large jump settles in ~550ms like the live useSpring.
const LERP = 0.15

function Para({ children, className = '' }) {
  return (
    <div className={`hs-para ${className}`}>
      <div className="hs-para-icon">
        <FaIcon code={FOUR_POINT_STAR} />
      </div>
      <p className="co-sub hs-para-text">{children}</p>
    </div>
  )
}

export default function HScrollStory() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let current = null
    let raf = 0

    const target = () => {
      const rect = section.getBoundingClientRect()
      const range = section.offsetHeight - window.innerHeight
      const p = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0
      const distance = Math.max(0, track.scrollWidth - window.innerWidth)
      return -distance * p
    }

    const tick = () => {
      const t = target()
      if (current === null || reduced) current = t
      else current += (t - current) * LERP
      if (Math.abs(t - current) < 0.1) current = t
      track.style.transform = `translate3d(${current.toFixed(2)}px, 0, 0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section ref={sectionRef} className="hs-section">
      <div className="hs-sticky">
        <div className="hs-content">
          <div ref={trackRef} className="hs-track">
            {/* Panel 1 */}
            <div className="hs-panel hs-p1">
              <img className="hs-p1-bg" src="/assets/q9j2kFCtrxbrzN8czFKBjCoSXE.webp" alt="" aria-hidden="true" />
              <div className="hs-p1-title">
                <p className="co-eyebrow">How it all started.</p>
                <h2 className="co-h2">Envisioning a new way of doing customer experience</h2>
              </div>
              <Para className="hs-p1-para">
                We spent over a decade as Shopify merchants scaling ecommerce brands. We experienced first-hand how
                customer support tools often fell short—automation without real solutions, personalization, or
                insights. That's why we built Siena.
              </Para>
            </div>

            {/* Connector */}
            <div className="hs-panel hs-connector">
              <img src="/svg/about-us-flow.svg" alt="" aria-hidden="true" width="205" height="87" />
            </div>

            {/* Panel 2 */}
            <div className="hs-panel hs-p2">
              <img className="hs-p2-img" src="/assets/4D1FYqC4H5M623F6yNo4c5T97E.webp" alt="" aria-hidden="true" />
              <Para className="hs-wide-para">
                Siena joins your team by integrating seamlessly with your help desk and commerce stack. It provides
                fully autonomous, end-to-end customer resolutions while staying true to your brand DNA.
              </Para>
            </div>

            {/* Panel 3 */}
            <div className="hs-panel hs-p3">
              <img className="hs-p3-img" src="/assets/h77L5rBDotNuRWvoKxflPm6HPjA.webp" alt="" aria-hidden="true" />
              <Para className="hs-wide-para">
                At Siena’s core is our agentic brand intelligence layer that captures and understands customer
                interactions deeply, enabling deep personalization and actionable business insights. Siena
                continuously learns from your best interactions, knowledge sources, guidance, and team expertise,
                becoming smarter every day.
              </Para>
            </div>

            {/* Panel 4 */}
            <div className="hs-panel hs-p4">
              <img className="hs-p4-bg" src="/assets/InMGs95DivVaUgENQYUbUNkoac.webp" alt="" aria-hidden="true" />
              <h4 className="co-h4 hs-p4-h4">
                Today, Siena powers hundreds of millions of conversations for brands and handles up to 80% of
                interactions while maintaining an average CSAT of 4.81.
              </h4>
            </div>

            {/* Panel 5 */}
            <div className="hs-panel hs-p5">
              <img className="hs-p5-img" src="/assets/9pqSQiEhJEHLD5Wei9aJDEo2BgA.webp" alt="" aria-hidden="true" />
              <Para className="hs-wide-para hs-p5-para">
                Our mission is to humanize the internet by turning customer interactions into meaningful
                relationships. Siena is your partner for commerce growth, exceptional CX, and lasting brand loyalty.
              </Para>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
