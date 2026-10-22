import { INSIGHTS_PAGES, PROMO_ROWS, INTEGRATION_TILES, LOGOS } from './insightsData.js'
import { INSIGHTS_LOGOS } from './insightsLogos.js'
import { useInViewOnce, useMounted, useTitle } from './hooks.js'
import XlgButton from './XlgButton.jsx'
import DemoFormCta from './DemoFormCta.jsx'
import '../../styles/content.css'

// T1 Insights product-landing template (specs/content.md T1 + R1).

const eyebrow = 'm-0 font-sans text-[14px] font-semibold uppercase leading-[19.6px] tracking-[1.7px] text-ink tablet:text-[16px] tablet:leading-[22.4px]'
const h2 = 'm-0 font-display text-[48px] font-normal leading-[48px] tracking-[-0.96px] text-ink tablet:text-[64px] tablet:leading-[64px] tablet:tracking-[-1.28px]'
const bodyText = 'm-0 font-sans text-[16px] font-medium leading-[22.4px] tracking-[-0.16px] tablet:text-[20px] tablet:leading-[28px] tablet:tracking-[-0.2px]'

function Hero({ page }) {
  const mounted = useMounted()
  const subColor = page.ink80 ? 'text-ink/80' : 'text-ink'
  // /insights: appear primitive on H1 / subtitle / buttons. Subpages: mount fade on the H1 only.
  const h1Motion = page.appear ? 'ins-appear-h1' : `ct-mount ${mounted ? 'is-in' : ''}`
  return (
    <section
      className="ins-hero flex w-full flex-col items-center justify-center gap-[100px] bg-hero-bg px-[24px] tablet:flex-row tablet:px-[64px]"
      style={{ '--pt': `${page.heroPtPhone}px`, '--pb': `${page.heroPb.phone}px`, '--pbd': `${page.heroPb.desktop}px` }}
    >
      <div className="flex w-full max-w-[700px] flex-col items-start justify-center gap-[32px] tablet:flex-1">
        <p className={eyebrow}>Siena Insights, formerly Idiomatic</p>
        <h1 className={`m-0 w-full font-display text-[56px] font-light leading-[56px] tracking-[-0.56px] text-ink tablet:text-[80px] tablet:leading-[80px] tablet:tracking-[-0.8px] ${h1Motion}`}>
          {page.h1}
        </h1>
        <p className={`${bodyText} w-full ${subColor} ${page.appear ? 'ins-appear-sub' : ''}`}>{page.sub}</p>
        <div className={`flex flex-row gap-[12px] ${page.appear ? 'ins-appear-cta' : ''}`}>
          <XlgButton href={page.demoHref}>Book a demo</XlgButton>
          {page.login && <XlgButton href="https://idiomatic.io/?login=true" white>Login</XlgButton>}
        </div>
      </div>
      <div className="flex h-[245px] w-full items-center justify-center tablet:h-[434px] tablet:flex-1">
        <img src={`/assets/${page.heroImg}`} alt="" className="block h-full w-full object-contain" />
      </div>
    </section>
  )
}

function Announcement() {
  return (
    <section className="flex w-full flex-row items-center justify-center bg-hero-bg px-[24px] py-[56px] tablet:px-[96px] tablet:py-[80px]">
      <p className="m-0 max-w-[193px] text-center font-sans text-[12px] font-semibold uppercase leading-[16.8px] tracking-[0.6px] text-[#787368] tablet:max-w-none">
        Idiomatic is now Siena Insights, with the same great features plus more innovation and support.
      </p>
    </section>
  )
}

function Logos() {
  return (
    <section className="flex w-full flex-col items-center gap-[40px] bg-white px-[24px] py-[56px] tablet:gap-[60px] tablet:px-[96px] tablet:py-[80px]">
      <div className="flex max-w-full flex-row flex-wrap items-center justify-center gap-x-[56px] gap-y-[40px] tablet:flex-nowrap">
        {LOGOS.map(([file, alt]) => (
          <img key={file} src={`/assets/${file}`} alt={alt} className="block h-[46px] w-[136px] flex-none object-contain" />
        ))}
      </div>
    </section>
  )
}

function FeatureRow({ f, imageLeft, ink80, demoHref }) {
  const heading = Array.isArray(f.h) ? f.h.flatMap((l, i) => (i ? [<br key={i} />, l] : [l])) : f.h
  return (
    <section className="flex w-full justify-center bg-white px-[24px] py-[56px] tablet:px-[96px] tablet:py-[80px]">
      <div className={`flex w-full flex-col items-center justify-center gap-[24px] tablet:gap-[64px] ${imageLeft ? 'tablet:flex-row' : 'tablet:flex-row-reverse'}`}>
        <div className="aspect-square w-full tablet:max-w-[512px] tablet:flex-1">
          <img src={`/assets/${f.img}`} alt="" className="block h-full w-full object-contain" />
        </div>
        <div className="flex w-full flex-col items-start justify-center gap-[32px] tablet:max-w-[512px] tablet:flex-1">
          <div className="flex w-full flex-col items-start gap-[16px] tablet:gap-[24px]">
            <h2 className={h2}>{heading}</h2>
            <div className="flex flex-col gap-[20px]">
              {f.p.map((t, i) => <p key={i} className={`${bodyText} ${ink80 ? 'text-ink/80' : 'text-ink'}`}>{t}</p>)}
            </div>
          </div>
          {f.button && <XlgButton href={demoHref}>Book a demo</XlgButton>}
        </div>
      </div>
    </section>
  )
}

function Integrations({ title }) {
  return (
    <section className="flex w-full flex-col items-center gap-[32px] bg-white px-[24px] py-[56px] tablet:gap-[72px] tablet:px-[96px] tablet:py-[80px]">
      <div className="flex w-full max-w-[1328px] flex-col items-start gap-[16px] tablet:gap-[24px]">
        <p className={eyebrow}>Integrate with your existing platforms</p>
        <h2 className={`${h2} text-left`}>{title}</h2>
      </div>
      <div className="grid w-full max-w-[1328px] grid-cols-2 gap-[4px] tablet:grid-cols-4">
        {INTEGRATION_TILES.map((t) => (
          <div key={t.key} className="flex h-[181px] flex-col items-center justify-center overflow-hidden rounded-[4px] bg-hero-bg p-[14px] tablet:px-0 tablet:py-[72px]">
            <div
              role="img"
              aria-label={t.label}
              className="ins-logo flex-none [&>svg]:block"
              style={{ '--w': `${t.m[0]}px`, '--h': `${t.m[1]}px`, '--wd': `${t.d[0]}px`, '--hd': `${t.d[1]}px` }}
              dangerouslySetInnerHTML={{ __html: INSIGHTS_LOGOS[t.key] }}
            />
          </div>
        ))}
        <div className="flex h-[181px] flex-col items-center justify-center overflow-hidden rounded-[4px] bg-hero-bg p-[14px] tablet:px-0 tablet:py-[72px]">
          <p className="m-0 whitespace-pre font-sans text-[16px] font-bold leading-[22.4px] tracking-[-0.16px] text-ink tablet:text-[20px] tablet:leading-[28px] tablet:tracking-[-0.2px]">
            <strong className="[font-weight:inherit]">...and  many more</strong>
          </p>
        </div>
      </div>
    </section>
  )
}

function Testimonial() {
  return (
    <section className="flex w-full flex-col items-center gap-[40px] bg-white px-[24px] py-[56px] tablet:px-[96px] tablet:py-[80px]">
      <h3 className="m-0 text-center font-display-regular text-[36px] font-normal leading-[43.2px] text-ink tablet:text-[52px] tablet:leading-[62.4px]">
        What our customers say
      </h3>
      <p className={`${bodyText} max-w-[500px] text-center text-ink/80`}>
        “Siena Insights gave us the customer voice insights we needed to improve support operations while eliminating the need for manual reviews.”
      </p>
      <div className="flex flex-row items-center justify-center gap-[15px]">
        <img src="/assets/PGTIAdOBFUHqD4uWC2d28jqi9I.png" alt="" className="block h-[50px] w-[50px] flex-none rounded-full object-cover" />
        <div className="flex flex-col">
          <p className={eyebrow}>Upwork</p>
          <p className="m-0 font-sans text-[14px] font-normal leading-[15.4px] text-ink/80">Customer Support Team</p>
        </div>
      </div>
    </section>
  )
}

function ChatRow({ row }) {
  const [ref, seen] = useInViewOnce()
  return (
    <div ref={ref} className={`ct-reveal w-full ${seen ? 'is-in' : ''}`} style={{ '--ct-y': `${row.y}px` }}>
      {row.from === 'customer' ? (
        <div className="ct-chat-row">
          <div className="ct-avatar"><img src="/assets/D3TQ38q4HpOxmxHoD1u1AW40NI.png" alt="" /></div>
          <div className="ct-bubble"><p className="ct-chat-text">{row.text}</p></div>
        </div>
      ) : (
        <div className="ct-chat-row ct-chat-row--siena">
          <div className="ct-grad"><div className="ct-bubble"><p className="ct-chat-text">{row.text}</p></div></div>
          <div className="ct-avatar ct-avatar--siena">
            <img src="/svg/siena-avatar-glyph.svg" alt="" />
          </div>
        </div>
      )}
    </div>
  )
}

function Promo({ title }) {
  return (
    <section className="flex w-full justify-center bg-white px-[24px] py-[56px] tablet:px-[96px] tablet:py-[80px]">
      <div className="flex w-full flex-col items-center gap-[40px] tablet:flex-row tablet:gap-[64px]">
        <div className="flex w-full flex-col items-start justify-center gap-[40px] tablet:max-w-[640px] tablet:flex-1">
          <div className="flex w-full flex-col items-start gap-[24px]">
            <p className={eyebrow}>Siena AI agent</p>
            <h2 className={h2}>{title}</h2>
            <div className="opacity-[0.82]">
              <p className={`${bodyText} text-ink`}>
                Take the next step with our AI agent that blends empathy and automation to deliver exceptional customer experiences at scale.
              </p>
            </div>
          </div>
          <XlgButton href="../">Learn more</XlgButton>
        </div>
        <div className="relative flex h-[506px] w-full flex-none flex-col items-center justify-center gap-[16px] overflow-hidden rounded-[24px] p-[24px] tablet:h-[810px] tablet:w-[640px] tablet:flex-shrink tablet:p-[56px]">
          <img src="/assets/OS7uIQBhEtXd5l7MXZ0qAcM0Lg.png" alt="" className="absolute inset-0 block h-full w-full rounded-[24px] object-cover" />
          <div className="relative flex w-full max-w-[528px] flex-col items-start gap-[16px]">
            {PROMO_ROWS.map((r, i) => <ChatRow key={i} row={r} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function InsightsPage({ path }) {
  const page = INSIGHTS_PAGES[path]
  useTitle(page.title)
  return (
    <div className="flex w-full flex-col bg-white">
      {/* Phone: live hero starts at y 40 (same 40px offset as the other content templates) */}
      <div className="h-[40px] bg-hero-bg tablet:hidden" aria-hidden="true" />
      <Hero page={page} />
      <Announcement />
      <Logos />
      {page.features.map((f, i) => (
        <FeatureRow key={i} f={f} imageLeft={i % 2 === 0} ink80={page.ink80} demoHref={page.demoHref} />
      ))}
      {page.integrationsTitle && <Integrations title={page.integrationsTitle} />}
      {page.testimonial && <Testimonial />}
      <Promo title={page.promoTitle} />
      <DemoFormCta />
    </div>
  )
}
