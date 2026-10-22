import { CONVERSATIONS } from '../components/content/conversationsData.js'
import NewsletterCta from '../components/content/NewsletterCta.jsx'
import { siteHref } from '../routes.js'
import '../styles/content.css'

// /conversations — T2 index (specs/content.md T2). No motion, no card hover.
// At 390 the card grid replicates the live 2 x 340px overflow bug; one-line fix in content.css (.ct-conv-grid).
export default function Conversations() {
  return (
    <div className="flex w-full flex-col overflow-x-clip bg-white">
      <div className="h-[40px] tablet:hidden" aria-hidden="true" />
      <section className="flex w-full max-w-full flex-col items-center px-[20px] pb-[80px] pt-[100px] tablet:px-[96px] tablet:pb-[100px] tablet:pt-[170px]">
        <div className="flex w-full max-w-[1062px] flex-col items-start gap-[24px]">
          <p className="m-0 font-serif text-[14px] leading-[18.2px] text-ink">Conversations</p>
          <h1 className="m-0 font-display text-[48px] font-normal leading-[48px] tracking-[-0.96px] text-ink tablet:text-[64px] tablet:leading-[64px] tablet:tracking-[-1.28px]">
            CX leaders on AI, in their own words
          </h1>
          <p className="m-0 max-w-[720px] font-serif text-[14px] leading-[21px] tracking-[-0.14px] text-ink tablet:text-[18px] tablet:leading-[23.4px] tablet:tracking-[-0.18px]">
            Full interviews and transcripts with the people running customer experience at consumer brands: how they adopted AI, the metrics they track, and what they learned along the way.
          </p>
          <div className="h-px w-full bg-black/20" />
        </div>
        <div className="ct-conv-grid grid w-full max-w-[1062px] gap-[24px]">
          {CONVERSATIONS.map((c) => (
            <a key={c.path} href={siteHref(c.path)} className="ct-card relative flex flex-col overflow-clip rounded-[16px] bg-white">
              <img src={`/assets/${c.img}`} alt={c.alt} className="block h-[205px] w-full object-cover" />
              <div className="flex flex-col gap-[10px] px-[20px] pb-[24px] pt-[20px]">
                <div className="flex flex-row items-center gap-[6px] font-sans text-[12px] leading-[13.2px] text-ink">
                  <span className="font-medium">{c.name}</span>
                  <span className="font-normal">· {c.brand}</span>
                </div>
                <p className="ct-clamp4 m-0 font-serif text-[20px] leading-[28px] text-black">{c.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
      <NewsletterCta />
    </div>
  )
}
