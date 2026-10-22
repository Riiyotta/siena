import BookDemoButton from './cta/BookDemoButton.jsx'
import '../styles/cta.css'

// CLONE_SPEC §9 (desktop 1440: 1440x755) + §11 "Main CTA (mobile)" (390: 682 tall).
// Phone layout < 810px (Framer Phone breakpoint), desktop structure >= 810px.
export default function MainCta() {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-[10px] overflow-clip">
      <div className="relative flex w-full flex-row items-center justify-center overflow-hidden px-[16px] py-[168px] tablet:px-[96px] tablet:py-[200px]">
        <img
          src="/assets/ERYNplIY591uk80wpoa4JGglO8.webp"
          alt=""
          width="1440"
          height="810"
          className="absolute inset-0 block h-full w-full object-cover"
        />
        <div className="cta-blur-out" aria-hidden="true" />
        <div className="relative z-[1] flex w-full max-w-[1062px] flex-col items-center justify-center gap-[40px] rounded-[32px] bg-hero-bg p-[32px] tablet:rounded-[48px] tablet:p-[64px]">
          <div className="flex w-full flex-col items-center justify-center gap-[32px] tablet:gap-[41px]">
            <h2 className="m-0 w-full text-center font-display text-[48px] font-light leading-[48px] tracking-[-0.96px] text-ink tablet:text-[64px] tablet:leading-[64px] tablet:tracking-[-1.28px]">
              See how fast-growing brands scale with Siena
            </h2>
            <BookDemoButton />
          </div>
        </div>
      </div>
    </section>
  )
}
