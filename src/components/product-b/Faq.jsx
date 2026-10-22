import { useLayoutEffect, useRef, useState } from 'react'

// §3.5 FAQ accordion (shared with /products/docs §4.7). Single-open, item `defaultOpen` open on load.
// Height + opacity animate 0.12s (rAF-measured ≈110ms); the chevron image swaps instantly.
function Item({ q, a, open, onToggle, last }) {
  const ref = useRef(null)
  const [h, setH] = useState(open ? 'auto' : 0)
  const first = useRef(true)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (first.current) {
      first.current = false
      return
    }
    const full = el.scrollHeight
    if (open) {
      setH(full)
      const t = setTimeout(() => setH('auto'), 130)
      return () => clearTimeout(t)
    }
    setH(full)
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setH(0)))
    return () => cancelAnimationFrame(r)
  }, [open])

  return (
    <div className={`pb-faq-item ${last ? 'is-last' : ''}`}>
      <button type="button" className="pb-faq-q" aria-expanded={open} onClick={onToggle}>
        <span className="pb-faq-q-text">{q}</span>
        <img
          src={open ? '/assets/OKFNY3AXFnnV2q6cBUgzTRwNI0.png' : '/assets/klSbquSQSmI4vJp5uAthfEBu4A.png'}
          alt=""
          width="20"
          height="20"
          className="pb-faq-icon"
        />
      </button>
      <div ref={ref} className="pb-faq-a-wrap" style={{ height: h, opacity: open ? 1 : 0 }} aria-hidden={!open}>
        <p className="pb-faq-a">{a}</p>
      </div>
    </div>
  )
}

export default function Faq({ items, defaultOpen = 0, className = '' }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className={`pb-faq ${className}`}>
      <h2 className="pb-h2 pb-faq-h2">FAQ</h2>
      <div className="pb-faq-card">
        <div className="pb-faq-list">
          {items.map(([q, a], i) => (
            <Item key={q} q={q} a={a} open={open === i} last={i === items.length - 1} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  )
}
