// specs/product-a.md §2.3 sticky section pill nav (resting 748x49 -> stuck 512x38) with sliding highlight ≈230ms.
import { useEffect, useRef, useState } from 'react'
import { useSlidingHighlight } from '../sections.jsx'

export default function PillNav({ links, active, onPick }) {
  const wrapRef = useRef(null)
  const [stuck, setStuck] = useState(false)
  const { linkRefs, box } = useSlidingHighlight(active, [stuck])

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current
      if (el) setStuck(el.getBoundingClientRect().top <= 128.5 && window.scrollY > 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={wrapRef} className="pn-wrap">
      <nav className={`pn-pill ${stuck ? 'is-stuck' : ''}`} aria-label="Sections">
        {box && (
          <span
            className="pn-highlight"
            aria-hidden="true"
            style={{ '--x': `${box.left - 12}px`, '--y': `${box.top}px`, '--hw': `${box.width + 24}px`, '--hh': `${box.height}px`, opacity: stuck ? 1 : 0 }}
          />
        )}
        {links.map(([id, label], i) => (
          <span key={id} className="pn-item">
            {i > 0 && <span className="pn-div" aria-hidden="true" />}
            <a
              ref={(el) => (linkRefs.current[i] = el)}
              href={`/social-agent#${id}`}
              className={`pn-link ${active === i ? 'is-active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                onPick(id)
              }}
            >
              {label}
            </a>
          </span>
        ))}
      </nav>
    </div>
  )
}
