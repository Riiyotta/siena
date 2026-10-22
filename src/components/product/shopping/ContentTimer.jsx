// specs/product-a.md §1.6 — two reveal cards + scroll-linked gradient progress line.
import { useEffect, useRef, useState } from 'react'
import { SectionTitle } from '../ui.jsx'

const CARDS = [
  ['ON0dnmCt7UQBt5qAvV5CyAqaN0o.webp', 'Intelligent assistance from browse to buy. Siena answers questions, resolves hesitations, and guides customers to purchase—with complete context of their journey.'],
  ['5JtROZuq0lzTDVwGqPMsEIVlmg.webp', 'Post-purchase help that knows the full story. Siena maintains context across orders, preferences, and conversations—delivering support that feels genuinely personal.'],
]

export default function ContentTimer() {
  const ref = useRef(null)
  const [state, setState] = useState({ shown: [false, false], w: 0, mobile: false })

  useEffect(() => {
    let raf = 0
    const update = () => {
      const el = ref.current
      if (!el) return
      const top = el.getBoundingClientRect().top // section top relative to viewport
      const vh = window.innerHeight
      const mobile = window.innerWidth < 810
      let w
      if (mobile) {
        // markers [start] / [end] at section-relative -726 / +258 (390 tree); bar 478 tall
        w = Math.max(0, ((-top + 726) / 984) * 478)
      } else {
        // [start] marker 1547px above the section, [end] 397px below its top; bar 1470 wide (0.759 px per px at 1440)
        w = Math.max(0, ((-top + 1547) / 1944) * 1470)
      }
      // card 1: section top <= viewport bottom + 446; card 2: section top <= viewport bottom
      setState({ shown: [top <= vh + 446, top <= vh], w, mobile })
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section ref={ref} className="ct-section">
      <SectionTitle
        className="relative z-[1]"
        maxW={1062}
        eyebrow="This is the future of shopping"
        title="A unified intelligence layer for every customer journey"
        sub="Whether a customer is browsing your site, stuck at checkout, or reaching out post-purchase, Siena handles it all with complete context."
        subMax={564}
      />
      <div className="ct-divider" aria-hidden="true" />
      <div className="ct-row">
        {CARDS.map(([img, text], i) => (
          <div key={img} className={`ct-card ct-card--${i} ${state.shown[i] || state.mobile ? 'is-final' : ''}`}>
            <div className="ct-img">
              <img src={`/assets/${img}`} alt="" />
            </div>
            <div className="ct-text">
              <p className="pa-sub">{text}</p>
            </div>
          </div>
        ))}
        <div className="ct-progress" aria-hidden="true">
          <div className="ct-line" style={{ '--len': `${state.w}px` }}>
            <div className="ct-head" />
          </div>
        </div>
      </div>
    </section>
  )
}
