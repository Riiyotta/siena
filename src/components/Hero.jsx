import '../styles/hero.css'
import LogoTicker from './hero/LogoTicker.jsx'
import { ROW_1, ROW_2 } from './hero/tickerData.js'

// CLONE_SPEC §2 (desktop/tablet >= 810) and §11 "Hero (mobile)" (<= 809.98).
// Tablet type sizes (not measured in the spec) come from the original Framer presets in the saved HTML:
// H1 72px at 810–1199; subtitle stays 16px/22.4 until 1000px.
export default function Hero() {
  return (
    <section className="relative mt-[40px] flex flex-col items-center justify-center gap-[10px] overflow-x-clip bg-hero-bg px-[24px] pb-[160px] pt-[112px] md:mt-0 tablet:min-h-screen tablet:px-[96px] tablet:py-0">
      {/* Decorative images (z 0, not animated) */}
      <div className="absolute bottom-[-32px] left-[40px] right-[-40px] top-[233px] z-0 tablet:hidden">
        <img src="/assets/H7uKKouy1m2eWQvMjbwrSblQx8k.webp" alt="" className="block h-full w-full object-cover" />
      </div>
      <div className="absolute bottom-[50px] left-[56.25%] right-0 top-[13px] z-0 hidden max-w-[800px] tablet:block">
        <img src="/assets/jBdT2KuAbfPtfHNsxcWh0L50xk.webp" alt="" className="block h-full w-full object-cover" />
      </div>
      <div className="absolute bottom-[53px] left-[-382px] top-0 z-0 hidden w-[800px] tablet:block">
        <img src="/assets/rYyvabwLjN7jv9XBL68Sm664.webp" alt="" className="block h-full w-full object-contain" />
      </div>

      {/* Text block */}
      <div className="relative z-[2] flex w-full max-w-[1062px] flex-col items-center gap-[40px]">
        <div className="flex w-full flex-col items-center gap-[24px]">
          <h1 className="hero-appear-h1 appear w-full text-center font-display text-[56px] font-light leading-[56px] tracking-[-0.56px] text-ink tablet:text-[72px] tablet:leading-[72px] tablet:tracking-[-0.72px] desktop:text-[80px] desktop:leading-[80px] desktop:tracking-[-0.8px]">
            <span className="tablet:hidden">Empathic AI CX agents designed for commerce</span>
            <span className="hidden tablet:inline">The AI CX operating system for consumer brands</span>
          </h1>
          <p className="hero-appear-sub appear w-full text-center text-[16px] font-medium leading-[22.4px] tracking-[-0.16px] text-ink tablet:max-w-[485px] min-[1000px]:text-[20px] min-[1000px]:leading-[28px] min-[1000px]:tracking-[-0.2px]">
            One intelligence layer powering agents across every customer surface.
          </p>
        </div>
        <a
          href="/book-a-demo"
          className="hero-appear-cta appear flex h-[58px] items-center justify-center rounded-[16px] bg-ink px-[24px] py-[18px] text-[18px] font-semibold leading-[21.6px] text-white hover:bg-rainbow"
        >
          <span className="whitespace-pre">Book a demo</span>
        </a>
      </div>

      {/* Logo tickers: row 1 -> right, row 2 -> left, 30px/s */}
      <div className="hero-tickers absolute left-0 right-0 top-[641.4px] z-[1] flex h-[94px] flex-col justify-between overflow-hidden tablet:top-[796px] tablet:h-[96px]">
        <LogoTicker logos={ROW_1} direction="right" />
        <LogoTicker logos={ROW_2} direction="left" />
      </div>

      {/* "Blur out" — z -1 (spec says z 0) so the following section's non-positioned content paints above it;
          visually identical because the hero's own bg is the same #F3F0EB as the gradient's top. */}
      <div className="hero-blur-out pointer-events-none absolute left-0 right-0 top-[661.4px] z-[-1] h-[441px] tablet:top-[852px]" />
    </section>
  )
}
