import UnderlineTitle from '../components/company/UnderlineTitle.jsx'
import StoryGrid from '../components/company/StoryGrid.jsx'
import VerticalTicker from '../components/company/VerticalTicker.jsx'
import CompanyCta from '../components/company/CompanyCta.jsx'
import { LOVE, LOVE_COLUMNS } from '../components/company/customersData.js'
import '../styles/company.css'

// specs/company.md "/customers": Hero title → filter + story grid + Load more → Love around the world → Main CTA.
export default function Customers() {
  return (
    <>
      <div className="cu-page mt-[40px] md:mt-0">
        <UnderlineTitle
          variant="customers"
          sub="Dive into our customer stories to unveil how Siena has played a pivotal role in reshaping their customer experience."
        >
          Discover the <em>Magic</em> of Siena
        </UnderlineTitle>
        <StoryGrid />
      </div>

      <section className="wl-section">
        <div className="wl-title">
          <h2 className="co-h2 text-center">
            Love around the <em>world</em>
          </h2>
        </div>
        <div className="wl-row wl-row--desktop">
          {LOVE_COLUMNS.map((col, i) => (
            <VerticalTicker key={i} items={col.order.map((n) => LOVE[n])} direction={col.dir} />
          ))}
        </div>
        <div className="wl-row wl-row--phone">
          <VerticalTicker items={LOVE_COLUMNS[0].order.map((n) => LOVE[n])} direction="down" />
        </div>
      </section>

      <CompanyCta variant="brands" phone="narrow" heading="Brands that win on CX run on Siena" />
    </>
  )
}
