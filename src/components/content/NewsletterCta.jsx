import '../../styles/content.css'

// T2.3 newsletter CTA (all /conversations* routes). At 390 the live site keeps this desktop
// variant (card 390 wide, padding 64, input squeezed to 105px) — replicated as measured. The
// /events page has a proper phone variant (specs/company.md §E3) if parity with the bug isn't wanted.
const stop = (e) => e.preventDefault()

export default function NewsletterCta() {
  return (
    <section className="relative flex w-full flex-row items-center justify-center overflow-hidden py-[120px]">
      <img
        src="/assets/5VTp1YGCJLYo9Grib0Ouvyooeag.webp"
        alt=""
        className="absolute inset-0 block h-full w-full object-cover"
        style={{ objectPosition: '50.4% 58.2%' }}
      />
      <div className="relative w-full max-w-[791px] rounded-[48px] bg-hero-bg p-[64px]">
        <form className="flex w-full flex-col gap-[48px]" onSubmit={stop}>
          <div className="mx-auto flex w-full max-w-[1062px] flex-col gap-[16px]">
            <h2 className="m-0 text-center font-display text-[48px] font-light leading-[48px] tracking-[-0.96px] text-ink tablet:text-[64px] tablet:leading-[64px] tablet:tracking-[-1.28px]">
              Be the first to know what&apos;s happening
            </h2>
          </div>
          <div className="flex w-full flex-row items-center justify-center gap-[10px]">
            <div className="ct-field min-w-0 flex-1">
              <input className="ct-input" type="email" name="Email" placeholder="john.smith@example.com" required />
            </div>
            <button type="submit" className="ct-btn ct-btn--form">Sign me up!</button>
          </div>
        </form>
      </div>
    </section>
  )
}
