import { useLayoutEffect, useRef, useState } from 'react'

// specs/conversion.md §3.8 — single-open accordion, item 1 open by default.
// Height + opacity animate together, 100ms linear (measured); chevron image swaps instantly.
function Item({ q, a, open, onToggle, last }) {
  const innerRef = useRef(null)
  const [h, setH] = useState(open ? 'auto' : 0)

  useLayoutEffect(() => {
    const el = innerRef.current
    if (!el) return
    const full = el.scrollHeight
    if (open) {
      setH(full)
      const t = setTimeout(() => setH('auto'), 100)
      return () => clearTimeout(t)
    }
    // from auto → px first so the closing transition has a start value
    setH(full)
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setH(0)))
    return () => cancelAnimationFrame(r)
  }, [open])

  return (
    <div className={`cv-faq-item ${last ? 'is-last' : ''}`}>
      <button type="button" className="cv-faq-q" aria-expanded={open} onClick={onToggle}>
        <span>{q}</span>
        <img
          src={open ? '/assets/OKFNY3AXFnnV2q6cBUgzTRwNI0.png' : '/assets/klSbquSQSmI4vJp5uAthfEBu4A.png'}
          alt=""
          width="20"
          height="20"
        />
      </button>
      <div className="cv-faq-a" style={{ height: h, opacity: open ? 1 : 0 }} aria-hidden={!open}>
        <div ref={innerRef} className="cv-faq-a-inner">
          <p>{a}</p>
        </div>
      </div>
      <div className="cv-faq-pad" />
    </div>
  )
}

export default function Faq({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <section className="cv-faq">
      <div className="cv-faq-title">
        <h2 className="cv-h2">FAQ</h2>
      </div>
      <div className="cv-faq-panel">
        {items.map(([q, a], i) => (
          <Item key={q} q={q} a={a} open={open === i} last={i === items.length - 1} onToggle={() => setOpen((o) => (o === i ? -1 : i))} />
        ))}
      </div>
    </section>
  )
}
