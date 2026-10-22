import HScrollStory from '../components/company/HScrollStory.jsx'
import OurTeam from '../components/company/OurTeam.jsx'
import LogoGrid from '../components/company/LogoGrid.jsx'
import CompanyCta from '../components/company/CompanyCta.jsx'
import '../styles/company.css'

// specs/company.md "/about-us": Hero → Horizontal scroll story → Our team → Backed by great partners → Main CTA.
// Nav forced into its scrolled state via NAV_OVERRIDES in routes.js.
const INVESTORS = [
  { alt: 'York IE', src: '/assets/ZgEKUQgxEWIsoQLgJ2nx9e6leQ.svg', w: 184, h: 24, mw: 104, mh: 14, tile: 'co-logo-tile--keep' },
  { alt: 'Sierra Ventures', src: '/assets/girTZkXE69Eq8siqGKJFsdTtaOA.svg', w: 125, h: 33, mw: 121, mh: 32 },
  { alt: 'Aglaé Ventures', src: '/assets/oNvYI9NSJlbETUTOH5bQPczJeVQ.svg', w: 207, h: 38, mw: 136, mh: 25 },
  { alt: 'The Council', src: '/assets/vB2kUPz76loqoi2c3AunCMGNw.svg', w: 117, h: 33, mw: 113, mh: 32 },
  { alt: 'Joyance', src: '/assets/BCooYvzI7OtNc1Vw5sjVBJkbBvs.svg', w: 55, h: 56, mw: 51, mh: 52, tile: 'co-logo-tile--keep' },
  { alt: 'Village Global', src: '/assets/6BU8x1yoHD2GBBk0h7kePpSYI.svg', w: 139, h: 33, mw: 131, mh: 31 },
  { alt: 'Spacestation Investments', src: '/assets/HfcivWOr23iKQ6U0lrIrWF4yuOA.svg', w: 139, h: 33, mw: 122, mh: 29 },
  { alt: 'SuperAngel.Fund', src: '/assets/pndXbr7xMtpLa5GqWdWbQdcG8.svg', w: 200, h: 26, mw: 123, mh: 16 },
]

export default function AboutUs() {
  return (
    <>
      <section className="ab-hero mt-[40px] md:mt-0">
        <img className="ab-hero-bg" src="/assets/mB1JO1ODJougkXIIQ3XCueDz4.png" alt="" aria-hidden="true" />
        <div className="ab-hero-title">
          <h1 className="co-h1 co-appear-h1">
            Our mission is to humanize the internet by turning customer interactions into meaningful relationships.
          </h1>
        </div>
      </section>

      <HScrollStory />

      <OurTeam />

      <section className="ab-investors">
        <div className="ab-investors-title">
          <h2 className="co-h2">
            Backed by <em>great</em> partners
          </h2>
        </div>
        <LogoGrid logos={INVESTORS} className="ab-investors-grid" />
      </section>

      <CompanyCta variant="brands" phone="about" heading="Brands that win on CX run on Siena" />
    </>
  )
}
