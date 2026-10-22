import FeatureCard from './features/FeatureCard.jsx'
import { FEATURE_ROWS } from './features/featuresData.js'
import '../styles/features.css'

// CLONE_SPEC §7 Features + §11 "Features (mobile)".
export default function Features() {
  return (
    <section className="relative flex w-full flex-none flex-col items-center justify-center gap-[32px] overflow-hidden bg-white px-[24px] py-[56px] tablet:gap-[56px] tablet:px-[40px] tablet:py-[64px] desktop:gap-[72px] desktop:px-[96px] desktop:py-[80px]">
      <div className="relative z-[1] flex w-full max-w-[1100px] flex-col items-start justify-center gap-[24px]">
        <h2 className="m-0 w-full text-center font-display text-[48px] font-normal leading-[48px] tracking-[-0.96px] text-ink tablet:text-[64px] tablet:leading-[64px] tablet:tracking-[-1.28px]">
          The <em className="font-display-italic font-normal italic">agentic</em> commerce platform
        </h2>
      </div>
      <div className="relative flex w-full max-w-[1328px] flex-col items-center justify-center gap-[32px] overflow-hidden">
        {FEATURE_ROWS.map((row, i) => (
          <div key={i} className="features-row">
            {row.map((card) => (
              <FeatureCard key={card.lottie} card={card} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
