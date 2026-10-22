import FooterLogo from './footer/FooterLogo.jsx'
import { company, legal, platform, resources, partners, social } from './footer/footerLinks.js'
import '../styles/footer.css'

// CLONE_SPEC §10 (desktop >= 1200), §11 "Footer (mobile)" (< 810).
// Tablet (810–1199) + exact phone flex/grid values follow the Framer footer variant CSS in the
// saved HTML (variants 1si1rht = 810 tablet, gb8yh = 390 phone).

// Column heading: eyebrow style in white; 16/22.4 desktop, 14/19.6 below 1200.
const heading =
  'm-0 font-sans font-semibold uppercase text-white text-[14px] leading-[19.6px] tracking-[1.7px] desktop:text-[16px] desktop:leading-[22.4px]'
// Phone: Company/Platform/Resources/Partners headings are 112px wide, wrapping (Framer gb8yh).
const headingPhoneWrap = 'w-[112px] whitespace-pre-wrap break-words tablet:w-auto tablet:whitespace-pre'

// Static class names so Tailwind can see them (phone-only grid order for Resources).
const phoneOrder = [
  'order-0', 'order-1', 'order-2', 'order-3', 'order-4', 'order-5', 'order-6', 'order-7', 'order-8',
]

function Link({ href, children, className = '' }) {
  return (
    <a href={href} className={`footer-link ${className}`}>
      {children}
    </a>
  )
}

export default function Footer() {
  return (
    <div className="relative z-[7] w-full">
      <footer className="flex w-full flex-col items-center justify-start gap-[16px] bg-ink px-[32px] py-[64px] tablet:px-[96px]">
        {/* Footer Content */}
        <div className="flex w-full flex-col justify-start gap-[64px] tablet:max-w-[740px] desktop:max-w-[1144px] desktop:flex-row desktop:items-start desktop:justify-between desktop:gap-0">
          {/* Left Column: logo + social (bottom row below 1200) */}
          <div className="order-1 flex w-full flex-col justify-center gap-[80px] tablet:justify-between tablet:gap-0 desktop:order-none desktop:w-min desktop:items-start desktop:self-stretch">
            <div className="flex w-full flex-row flex-wrap items-center justify-between tablet:flex-nowrap desktop:w-min desktop:flex-col desktop:items-start desktop:justify-start desktop:gap-[32px]">
              <a href="/" aria-label="Siena home" className="relative block h-[32px] w-[122px] flex-none overflow-hidden">
                <FooterLogo />
              </a>
              <div className="flex w-min flex-row items-center justify-center gap-[8px] overflow-hidden">
                {social.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="footer-social">
                    <span aria-hidden="true">{s.glyph}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right group: links block + Partners */}
          <div className="order-0 flex w-full flex-col gap-[40px] tablet:gap-[48px] desktop:order-none desktop:w-min desktop:flex-row desktop:items-start desktop:gap-[10px]">
            {/* Links block: Company/Legal, Platform, Resources */}
            <div className="flex w-full flex-col gap-[40px] tablet:flex-row tablet:items-start tablet:justify-start tablet:gap-[32px] desktop:w-min desktop:gap-[48px]">
              {/* Company + Legal */}
              <div className="flex w-full flex-row items-start gap-[32px] tablet:w-px tablet:flex-[1_0_0] tablet:flex-col tablet:gap-[48px] desktop:w-min desktop:flex-none desktop:gap-[32px]">
                <div className="flex w-px flex-[1_0_0] flex-col items-start gap-[16px] tablet:w-[192px] tablet:flex-none desktop:w-auto desktop:self-stretch">
                  <p className={`${heading} ${headingPhoneWrap}`}>Company</p>
                  <div className="flex w-full flex-col items-start gap-[10px] tablet:gap-[12px] desktop:w-[171px]">
                    {company.map((l) => (
                      <Link key={l.label} href={l.href}>{l.label}</Link>
                    ))}
                  </div>
                </div>
                <div className="flex w-px flex-[1_0_0] flex-col items-start gap-[32px] tablet:w-full tablet:flex-none tablet:gap-[16px] desktop:w-min desktop:flex-row desktop:items-center desktop:gap-[32px]">
                  <div className="flex w-min flex-col items-start gap-[16px] pl-[10px] tablet:pl-0">
                    <p className={`${heading} whitespace-pre`}>Legal</p>
                    <div className="flex flex-col items-start gap-[10px] self-stretch">
                      {legal.map((l) => (
                        <Link key={l.label} href={l.href}>{l.label}</Link>
                      ))}
                    </div>
                  </div>
                  <div className="relative aspect-[1.0056] w-[64px] flex-none">
                    <img
                      src="/assets/HB4OWZgksTQCHf8uTWf7S6EYSlE.webp"
                      alt="AICPA SOC 2 compliance badge"
                      width="80"
                      height="80"
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 block h-full w-full object-cover object-center"
                    />
                  </div>
                </div>
              </div>

              {/* Platform */}
              <div className="flex w-full flex-col items-start gap-[16px] tablet:w-[192px] desktop:w-min">
                <p className={`${heading} ${headingPhoneWrap}`}>Platform</p>
                <div className="flex w-full flex-col items-start gap-[12px]">
                  {platform.map((l) => (
                    <Link key={l.label} href={l.href}>{l.label}</Link>
                  ))}
                </div>
              </div>

              {/* Resources (2-col grid on phone) */}
              <div className="flex w-full flex-col items-start gap-[16px] tablet:w-[192px] desktop:w-min">
                <p className={`${heading} ${headingPhoneWrap}`}>Resources</p>
                <div className="grid w-full auto-rows-[minmax(0,1fr)] grid-cols-[repeat(2,minmax(50px,1fr))] grid-rows-[repeat(2,minmax(0,1fr))] gap-x-[32px] gap-y-[12px] tablet:flex tablet:w-min tablet:flex-col tablet:items-start tablet:gap-[12px]">
                  {resources.map((l) => (
                    <div
                      key={l.label}
                      className={`${phoneOrder[l.phoneOrder]} ${l.label === 'Conversations' ? 'w-fit' : 'w-full'} flex self-start justify-self-start tablet:order-none tablet:w-auto`}
                    >
                      <Link href={l.href}>{l.label}</Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Partners */}
            <div className="flex w-full flex-col gap-[40px] tablet:flex-row tablet:justify-start tablet:gap-[32px] desktop:w-min desktop:gap-[48px]">
              <div className="flex w-full flex-col items-start gap-[16px] tablet:w-[192px] desktop:w-[171px]">
                <p className={`${heading} ${headingPhoneWrap}`}>Partners</p>
                <div className="flex w-full flex-col items-start gap-[12px]">
                  {partners.map((l) => (
                    <Link key={l.label} href={l.href}>{l.label}</Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
