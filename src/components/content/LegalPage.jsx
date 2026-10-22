import { lorem } from './placeholder.js'
import { siteHref } from '../../routes.js'
import '../../styles/content.css'

// T4/T5 legal template. Structure (node order, list nesting, heading levels/styles, word counts)
// comes from legalData.js; headings are real, body text is placeholder. No motion.

// Inline stand-in for the FA Pro Regular calendar glyph U+F133 (14x16 box, #122023).
function CalendarIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden="true" className="block flex-none">
      <path
        d="M4 0.75v1.5h6V0.75a.75.75 0 0 1 1.5 0v1.5H12a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4.25a2 2 0 0 1 2-2h.5V0.75a.75.75 0 0 1 1.5 0ZM1.5 6v8c0 .28.22.5.5.5h10a.5.5 0 0 0 .5-.5V6h-11Z"
        fill="#122023"
      />
    </svg>
  )
}

function makeRenderer() {
  let seed = 0
  let sec = 0
  let boldLabels = false
  let firstLabel = null

  const heading = (n, key) => {
    const text = n.text ?? lorem(n.w, ++seed).replace(/\.$/, '')
    const m = /^(\d+)\./.exec(text)
    if (m && n.s !== 'tb') sec = Number(m[1])
    if (n.t === 'h2' || n.s === 'is') boldLabels = /^4\. Legal bases/.test(text)
    if (boldLabels && /^4\. Legal bases/.test(text)) firstLabel = 'Signing up and using the Services:'
    const Tag = n.t
    if (n.s === 'is') return <Tag key={key} className="lg-is"><strong>{text}</strong></Tag>
    if (n.s === 'tb') return <Tag key={key} className="lg-tb"><strong>{text}</strong></Tag>
    return <Tag key={key} className="lg-fd">{text}</Tag>
  }

  const list = (n, key) => {
    if (n.items[0] && n.items[0].h) {
      const start = sec + 1
      sec += n.items.length
      return (
        <ol key={key} className="lg-numbered" start={start}>
          {n.items.map((li, i) => (
            <li key={i} className={li.pl === '44.64px' ? 'lg-wide' : ''}><h2 className="lg-fd">{li.h}</h2></li>
          ))}
        </ol>
      )
    }
    const Tag = n.t
    return (
      <Tag key={key}>
        {n.items.map((li, i) => {
          let text = li.w ? lorem(li.w, ++seed) : null
          // Privacy §4: ol > li > h3 > strong labels in Tiempos 700; only the first label is recorded.
          if (boldLabels && n.t === 'ol' && text) {
            if (firstLabel) { text = firstLabel; firstLabel = null }
            text = <strong>{text}</strong>
          }
          return (
            <li key={i}>
              {text}
              {li.kids && li.kids.map((k, j) => node(k, j))}
            </li>
          )
        })}
      </Tag>
    )
  }

  const node = (n, key) => {
    if (n.t === 'ul' || n.t === 'ol') return list(n, key)
    if (n.text !== undefined || n.s) return heading(n, key)
    if (n.mail) {
      return (
        <p key={key}>
          {lorem(Math.max(n.w - 1, 1), ++seed)} <a className="lg-mail" href="mailto:privacy@siena.cx">privacy@siena.cx</a>
        </p>
      )
    }
    return <p key={key}>{n.w ? lorem(n.w, ++seed) : <br />}</p>
  }
  return node
}

export default function LegalPage({ title, updated, nodes, tail = null, mailAfter = null }) {
  const render = makeRenderer()
  // The first paragraph after the contact heading carries the #0099FF mail link (T4.2).
  const at = mailAfter ? nodes.findIndex((n) => n.text === mailAfter) + 1 : -1
  const out = nodes.map((n, i) => (i === at && n.t === 'p' ? { ...n, mail: true } : n)).map((n, i) => render(n, i))
  return (
    <div className="flex w-full flex-col bg-white">
      <div className="h-[40px] tablet:hidden" aria-hidden="true" />
      <section className="flex w-full flex-col items-center gap-[40px] px-[24px] pb-[80px] pt-[96px] tablet:gap-[32px] tablet:px-[96px] tablet:pt-[160px]">
        <div className="flex w-full max-w-[1120px] flex-col items-start gap-[32px] tablet:gap-[64px]">
          <div className="flex w-full flex-row items-center border-b border-black/20 pb-[32px] tablet:pb-[50px]">
            <h1 className="m-0 font-display text-[48px] font-normal leading-[48px] tracking-[-0.96px] text-ink tablet:text-[64px] tablet:leading-[64px] tablet:tracking-[-1.28px]">
              {title}
            </h1>
          </div>
          <div className="flex flex-row items-center gap-[8px]">
            <CalendarIcon />
            <p className="m-0 font-sans text-[14px] font-semibold leading-[21px] text-ink">Last Updated: {updated}</p>
          </div>
        </div>
        <div className="lg-rt max-w-[1120px]">
          {out}
          {tail}
        </div>
      </section>
    </div>
  )
}

export const termsTail = (
  <>
    <p>Previous terms of services</p>
    <p><a href={siteHref('/terms-of-services/06122025-terms-of-service')}>June 12th, 2025</a></p>
    <p><a href={siteHref('/terms-of-services/02202025-terms-of-service')}>February 20th, 2025</a></p>
    <p><a href={siteHref('/terms-of-services/10042024-terms-of-service')}>October 4th, 2024</a></p>
    <p><br /></p>
    <p><br /></p>
  </>
)
