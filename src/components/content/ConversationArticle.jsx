import { ARTICLES } from './conversationsData.js'
import { lorem } from './placeholder.js'
import NewsletterCta from './NewsletterCta.jsx'
import { siteHref } from '../../routes.js'
import '../../styles/content.css'

// T3 conversation detail / transcript template. No motion (T3.5).

const toSec = (t) => t.split(':').reduce((a, b) => a * 60 + Number(b), 0)
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
// href `#chapter-<n>-<slug>`: lowercased, non-alphanumerics -> '-', whole id truncated to 60 chars
const chapterId = (n, title) =>
  `chapter-${n}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`.slice(0, 60)

const blockH2 = 'm-0 font-display-regular text-[24px] font-normal leading-[28.8px] text-black tablet:text-[40px] tablet:leading-[48px]'

function Block({ title, children }) {
  return (
    <div className="flex w-full max-w-[800px] flex-col gap-[20px]">
      {title && <h2 className={blockH2}>{title}</h2>}
      {children}
    </div>
  )
}

// Placeholder paragraph with an optional real link at its start.
function SummaryP({ words, link, seed }) {
  if (!link) return <p>{lorem(words, seed)}</p>
  const href = link.blog ? siteHref(link.blog) : link.href
  const rest = lorem(Math.max(words - link.text.split(' ').length, 1), seed)
  return (
    <p>
      <a href={href}>{link.text}</a> {rest.charAt(0).toLowerCase() + rest.slice(1)}
    </p>
  )
}

function Transcript({ a }) {
  let seed = 100
  let speaker = 1 // alternate speakers across the transcript, host (index 1) first — order not recorded
  const nodes = []
  a.chapters.forEach(([ts, title, paras, turns, words], ci) => {
    const n = ci + 1
    nodes.push(<h2 key={`h${n}`} id={chapterId(n, title)} className="ct-rt-ch">{title}</h2>)
    const start = toSec(ts)
    const end = a.chapters[ci + 1] ? toSec(a.chapters[ci + 1][0]) : start + 180
    const starts = new Set(Array.from({ length: turns }, (_, k) => Math.floor((k * paras) / turns)))
    const per = Math.round(words / paras)
    let k = 0
    for (let i = 0; i < paras; i++) {
      seed += 1
      if (starts.has(i)) {
        const t = Math.round(start + ((end - start) * k) / turns)
        const name = a.speakers[speaker]
        speaker = 1 - speaker
        k += 1
        nodes.push(
          <p key={`p${n}-${i}`}>
            <strong>{name}</strong>{' '}
            <a href={`https://www.youtube.com/watch?v=${a.video}&t=${t}s`}>({fmt(t)})</a> {lorem(per, seed)}
          </p>,
        )
      } else {
        nodes.push(<p key={`p${n}-${i}`}>{lorem(per, seed)}</p>)
      }
    }
  })
  return <div className="ct-rt">{nodes}</div>
}

export default function ConversationArticle({ slug }) {
  const a = ARTICLES[slug]
  return (
    <div className="flex w-full flex-col overflow-x-clip bg-white">
      <div className="h-[40px] tablet:hidden" aria-hidden="true" />
      <article className="flex w-full flex-col items-center gap-[48px] px-[20px] pb-[80px] pt-[100px] tablet:px-[24px] tablet:pb-[100px] tablet:pt-[170px]">
        {/* Header */}
        <header className="flex w-full max-w-[800px] flex-col items-start gap-[24px]">
          <div className="flex flex-row items-center gap-[8px] font-serif text-[14px] leading-[18.2px] text-ink">
            <a href={siteHref('/conversations')} className="underline">Conversations</a>
            <time dateTime={a.dateTime}>{a.date}</time>
          </div>
          <h1 className="m-0 w-full font-display text-[48px] font-normal leading-[48px] tracking-[-0.96px] text-ink tablet:text-[64px] tablet:leading-[64px] tablet:tracking-[-1.28px]">
            {a.title}
          </h1>
          <div className="flex flex-row items-center gap-[6px] whitespace-nowrap font-sans text-[16px] leading-[19.2px] tracking-[-0.16px] text-ink">
            <span className="text-[12px] font-medium leading-[14.4px] tracking-[-0.12px] text-ink/80 tablet:text-[16px] tablet:leading-[19.2px] tablet:tracking-[-0.16px]">{a.guest[0]}</span>
            <span className="font-normal">· {a.guest[1]}</span>
            <span className="font-normal">· {a.guest[2]}</span>
          </div>
          <div className="h-px w-full bg-black/20" />
        </header>

        {/* Video */}
        <div className="h-[200px] w-full max-w-[800px] overflow-clip rounded-[16px] tablet:h-auto tablet:aspect-[16/9]">
          <div className="w-full overflow-hidden rounded-[10px]" style={{ aspectRatio: '1.7778 / 1' }}>
            <iframe
              src={`https://www.youtube.com/embed/${a.video}?autoplay=0&mute=1&controls=1&rel=0`}
              title={a.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="block h-full w-full border-0"
            />
          </div>
        </div>

        {/* Summary (body placeholder; guest name links are real) */}
        <Block>
          <div className="ct-rt">
            {a.summary.map((w, i) => (
              <SummaryP key={i} words={w} seed={i * 3} link={a.summaryLinks.find((l) => l.p === i)} />
            ))}
          </div>
        </Block>

        <Block title="Key takeaways">
          <div className="ct-rt">
            <ul>{a.takeaways.map((w, i) => <li key={i}>{lorem(w, 40 + i)}</li>)}</ul>
          </div>
        </Block>

        <Block title="Chapters">
          <div className="ct-rt">
            <ul>
              {a.chapters.map(([ts, title], i) => (
                <li key={i}><p><a href={`#${chapterId(i + 1, title)}`}>{ts} · {title}</a></p></li>
              ))}
            </ul>
          </div>
        </Block>

        <Block title="Full transcript">
          <Transcript a={a} />
        </Block>

        <Block title="Frequently asked questions">
          <div className="ct-rt">
            {a.faq.flatMap(([q, w], i) => [
              <h3 key={`q${i}`} className="ct-rt-q">{q}</h3>,
              <p key={`a${i}`}>{lorem(w, 70 + i)}</p>,
            ])}
          </div>
        </Block>
      </article>
      <NewsletterCta />
    </div>
  )
}
