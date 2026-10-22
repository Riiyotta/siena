import ChatMock from '../scroll-area/ChatMock.jsx'
import { CompareHero } from './ConvHero.jsx'
import ConvTestimonials from './ConvTestimonials.jsx'
import CompareTable from './CompareTable.jsx'
import StickyArea from './StickyArea.jsx'
import ConvMetrics from './ConvMetrics.jsx'
import ConvIntegrations from './ConvIntegrations.jsx'
import Faq from './Faq.jsx'
import ConvCta from './ConvCta.jsx'
import { MemoryCard, ReviewsCard, ShoppingCard } from './CompareCards.jsx'
import { COMPARE_SLIDES } from './compareData.js'
import '../../styles/conversion.css'

// Block → card: 1 = homepage ChatMock v1 ("Compare 4"), 2 = reviews, 3 = memory, 4 = shopping (§3.5).
const CARDS = [
  ({ mobile, play, key }) => <ChatMock key={key} variant={0} mobile={mobile} play={play} />,
  ({ key }) => <ReviewsCard key={key} />,
  ({ key }) => <MemoryCard key={key} />,
  ({ key }) => <ShoppingCard key={key} />,
]

// specs/conversion.md §3 compare template. Nav/Footer come from App.jsx.
// Phone order differs (§3.12): … Metrics → FAQ → CTA → Integrations (CSS `order` on .cv-compare children).
export default function CompareTemplate({ data, kind }) {
  const blocks = data.blocks.map((b, i) => ({ ...b, button: i === 3, card: CARDS[i] }))
  return (
    <div className={`cv-compare cv-compare--${kind}`}>
      <CompareHero {...data.hero} />
      {/* Fade strip follows the hero on Gorgias, the cream testimonials section on Kustomer (§5.2) */}
      {kind !== 'kustomer' && <div className="cv-fade" aria-hidden="true" />}
      <ConvTestimonials slides={COMPARE_SLIDES} variant={data.testimonialsVariant} />
      {kind === 'kustomer' && <div className="cv-fade" aria-hidden="true" />}
      <CompareTable {...data.table} />
      <div className="cv-intel">
        <h2>
          The <em>intelligence</em> layer for commerce
        </h2>
      </div>
      <StickyArea kind="compare" blocks={blocks} />
      <ConvMetrics kind="compare" />
      <ConvIntegrations />
      <Faq items={data.faq} />
      <ConvCta title={data.cta} kind="compare" />
    </div>
  )
}
