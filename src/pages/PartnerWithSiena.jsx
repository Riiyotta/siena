import { useState } from 'react'
import LogoGrid from '../components/company/LogoGrid.jsx'
import CompanySlider, { PartnerSlide } from '../components/company/CompanySlider.jsx'
import CompanyCta from '../components/company/CompanyCta.jsx'
import PartnerModal from '../components/company/PartnerModal.jsx'
import { XlgButton, FeatureItem } from '../components/company/shared.jsx'
import { filler } from '../components/company/filler.js'
import '../styles/company.css'

// specs/company.md "/partner-with-siena": Hero + benefits card → partner logo grids → partner slider →
// CTA → modal form (opened by both "Become a partner" buttons).
const BENEFITS = [
  { icon: 0xf672, title: 'Competitive advantage', body: 'Enhance your service offering with cutting-edge AI technology, providing your clients with the best agentic commerce solution.' },
  { icon: 0xe528, title: 'Revenue share', body: 'Unlock our revenue-sharing model, earning a competitive share and SPIFFs for each new customer you bring to Siena.' },
  { icon: 0xf6a3, title: 'Lead sharing', body: 'Expand your client base by receiving qualified business from our partner ecosystem. Includes co-marketing and networking opportunities.' },
  { icon: 0xe14f, title: 'Dedicated support', body: 'Enjoy personalized support from a dedicated partner manager and direct communication channels with our team.' },
  { icon: 0xe533, title: 'Marketing support', body: 'Collaborate on co-marketing initiatives, speaking opportunities, sponsorships, and more to boost your agency’s visibility and growth.' },
  { icon: 0xe53d, title: 'Training & certification', body: 'Gain access to training and certification programs, empowering your team with the knowledge and skills to excel in AI-driven CX.' },
]

const AGENCY = [
  { alt: 'LTVplus', src: '/svg/partner-ltvplus.svg', w: 153, h: 53 },
  { alt: 'horatio', src: '/svg/partner-horatio.svg', w: 145, h: 33 },
  { alt: 'Create CX', src: '/assets/ArBCWxOfP3vBCKL9ojUO18QcOc.png', w: 202, h: 29, mw: 131, mh: 18, tile: 'pw-tile-createcx' },
  { alt: 'Arctic Grey', src: '/svg/partner-arcticgrey.svg', w: 211, h: 33 },
]
const TECH = [
  ['gorgias', 143, 37], ['zendesk', 171, 37], ['kustomer', 185, 33], ['gladly', 151, 37],
  ['klaviyo', 125, 37], ['recharge', 187, 37], ['shopify', 129, 37], ['stayai', 135, 33],
  ['skio', 81, 33], ['ordergroove', 213, 37], ['intercom', 163, 37], ['prive', 119, 33],
].map(([n, w, h]) => ({ alt: n, src: `/svg/partner-${n}.svg`, w, h }))

// Quotes are third-party testimonials → length-matched placeholders (filler.js); names/roles exact.
const SLIDES = [
  { name: 'Abby Harkins Barnes', role: 'Director of Client Partnerships', logo: 'gPbncbWgqh6Z0i3jV11HixvRMQQ.svg', photo: 'jgxUA35mrCLRb0iwb8BcsY6dXDg.jpeg', quote: filler(262, 0) },
  { name: 'Leeor Cohen', role: 'Founder, CEO', logo: 'ESfai9kjmOoaq7S2R1LYA2ryTo.png', photo: '55BFP7WLWw6osGequVvBvkx46dw.webp', quote: filler(300, 1) },
  { name: 'Jess Cervellon', role: 'Head Brand, CX & Retention Client Consultant', logo: 'gu1zj14SNJwi7rOAEYZn30u07r4.webp', photo: 'WPRfXHKYDK2h7CgolOLQBiOUni8.webp', quote: filler(365, 2) },
  { name: 'Hudson Lofchie', role: 'Co-Founder, Grey Space Consulting', logo: 'Keq3P6ZxODfXyfY0AxZzcEUA.png', photo: 'LhW0MBO7jm6pAJD5z0S1BcxEulM.webp', quote: filler(290, 3) },
  { name: 'Anthony Spallone', role: 'Co-Founder', logo: 'UeQwdt8s4GLxHWZsphG3MZH2950.svg', photo: 'vfm2qZfHgAX4T4DGqEkII8Ml2Vg.webp', quote: filler(320, 4) },
  { name: 'Chris Thompson', role: 'CEO, Pillar3', logo: null, photo: '5Q9fybvG1Blbexlw8P6VqAvM.webp', quote: filler(300, 5) },
  { name: 'Mercer Smith', role: 'VP, Community + Education', logo: 'seFp5JJrihyQheiUbDFhflvJmE.svg', photo: 'Kz9bZaq5rYbp21P6TDjfk0VSWIE.webp', quote: filler(335, 6) },
]

export default function PartnerWithSiena() {
  const [modalOpen, setModalOpen] = useState(false)
  const openModal = () => setModalOpen(true)

  return (
    <>
      <section className="pw-hero mt-[40px] md:mt-0">
        <img className="pw-hero-bg" src="/assets/HuVP7dKP20oXnfmo7Q6QKQSISFs.webp" alt="" aria-hidden="true" />
        <div className="pw-title">
          <h1 className="co-h1 co-appear-h1">Partner with Siena</h1>
          <p className="co-sub pw-sub co-appear-d3">
            Collaborate with us to deliver an agentic solution that grows CSAT, unlocks new revenue streams and
            generates business intelligence for your clients.
          </p>
          <XlgButton onClick={openModal} className="co-appear-d4">Become a partner</XlgButton>
        </div>

        <div className="pw-benefits">
          <div className="pw-benefits-title">
            <p className="co-eyebrow">benefits</p>
            <h2 className="co-h2 text-center">
              Why <em>partner</em> with Siena?
            </h2>
          </div>
          <div className="pw-benefits-grid">
            {BENEFITS.map((b) => (
              <FeatureItem key={b.title} {...b} />
            ))}
          </div>
        </div>
      </section>

      <section className="pw-partners">
        <h2 className="co-h2 text-center">
          Backed by <em>best-in-class</em> partners
        </h2>
        <div className="pw-groups">
          <div className="pw-group">
            <h3 className="co-eyebrow pw-group-label">Agency partners</h3>
            <LogoGrid logos={AGENCY} />
          </div>
          <div className="pw-group">
            <h3 className="co-eyebrow pw-group-label">Technology partners</h3>
            <LogoGrid logos={TECH} />
          </div>
        </div>
      </section>

      <CompanySlider
        variant="partner"
        items={SLIDES}
        renderSlide={(item, { key, ...props }) => <PartnerSlide key={key} data={item} {...props} />}
      />

      <CompanyCta variant="partner" phone="partner" heading="See how partners scale with Siena" buttonLabel="Become a partner" onClick={openModal} />

      <PartnerModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
