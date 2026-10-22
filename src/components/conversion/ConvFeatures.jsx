import FeatureCard from '../features/FeatureCard.jsx'
import { FEATURE_ROWS } from '../features/featuresData.js'
import '../../styles/features.css'

// specs/conversion.md §6.4 — homepage Features with an 80px title and this page's card copy
// (same grid, card variants and Lottie files in the same order).
const COPY = [
  ['Drive growth with smart product suggestions', 'Help shoppers discover what fits, what completes their routine, or what they didn’t know they needed. Siena offers thoughtful, timely recommendations that increase sales and keep customers coming back.'],
  ['Expand impact with social engagement and moderation', 'Turn social conversations into outcomes. Siena joins the dialogue on your social channels, answers product questions, captures buying intent, and helps convert community activity into ecommerce growth.'],
  ['Streamline complex post-purchase requests', 'From “Where’s my order?” to “I need to make a return,” Siena handles it seamlessly—updating addresses, creating return labels, issuing refunds, and sending replacements all in one smooth process.'],
  ['Simplify how customers manage subscriptions', 'More retention, fewer cancellations. Siena makes it effortless to skip, pause, or swap—while surfacing insights, suggesting alternatives, and increasing order value with thoughtful recommendations.'],
  ['Strengthen teamwork with smart collaboration tools', 'Easily build or adjust workflows using the Assistant. Use Copilot to draft polished replies or translate messages. With Collaborative Routing, every handoff includes a clear note so agents can jump in smoothly.'],
  ['Built-in trust, brand protection, and control', 'Chosen by leading ecommerce and retail brands, Siena meets strict enterprise standards. Guardrails and detailed controls ensure every response stays true to your brand and aligned with your policies.'],
]

let k = 0
const ROWS = FEATURE_ROWS.map((row) => row.map((card) => {
  const [title, body] = COPY[k++]
  return { ...card, title, body }
}))

export default function ConvFeatures() {
  return (
    <section className="cv-features relative flex w-full flex-none flex-col items-center justify-center gap-[32px] overflow-hidden bg-white px-[24px] py-[56px] tablet:gap-[56px] tablet:px-[40px] tablet:py-[64px] desktop:gap-[72px] desktop:px-[96px] desktop:py-[80px]">
      <div className="relative z-[1] flex w-full max-w-[1100px] flex-col items-start justify-center gap-[24px]">
        <h2 className="cv-features-h2">
          The <em>agentic</em> commerce platform
        </h2>
      </div>
      <div className="relative flex w-full max-w-[1328px] flex-col items-center justify-center gap-[32px] overflow-hidden">
        {ROWS.map((row, i) => (
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
