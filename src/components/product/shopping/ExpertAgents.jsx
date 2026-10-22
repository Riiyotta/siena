// specs/product-a.md §1.5 — "Your team of expert agents" (2-state card carousel + benefits row).
import { useState } from 'react'
import { Eyebrow, Fa, SectionTitle } from '../ui.jsx'

const CARDS = [
  ['Fashion and Style Expert', 'Understands style preferences, body types, and trends to drive outfit recommendations that convert browsers into buyers', 'njFwLgcYodcgCZLOirenZte8PI.webp'],
  ['Beauty & Skincare Specialist', 'Analyzes skin concerns and ingredient compatibility to match customers with perfect products and increase basket size', 'DSlYA7Ti2px99V57TiG8YWLa0.webp'],
  ['Health & Fitness Coach', 'Crafts personalized workout and nutrition plans that drive repeat orders of gear, supplements, and memberships', 'mjhrS3zQVff4RHuTylI3YOBrans.webp'],
  ['Home & Lifestyle Consultant', 'Interior design and home expert that helps customers create cohesive spaces with furniture, decor, and appliances.', 'r0UwHHAaB0cxyEOmbrrJXqLReOI.webp'],
]
const BENEFITS = [
  [0xf890, 'On-demand expertise', 'Access specialist-level guidance instantly—no recruiting, no ramp-up.'],
  [0xf06e, 'Compund learning', 'Every conversation sharpens the model, and your agent becomes smarter.'],
  [0xf6a3, '24/7 expert availability', 'Always on, always helpful—no shifts, breaks, or out-of-office.'],
  [0xf6a3, 'Consistent quality and brand tone', 'Same high-caliber advice every time, no matter the volume.'],
]

export default function ExpertAgents() {
  const [end, setEnd] = useState(false)
  return (
    <section className="ea-section">
      <img src="/assets/MSTluKQSUNZrlxr6ESQPZTnooU.webp" alt="" aria-hidden="true" className="ea-blob" />
      <div className="ea-fade ea-fade--top" aria-hidden="true" />
      <div className="ea-fade ea-fade--bottom" aria-hidden="true" />
      <SectionTitle
        className="relative z-[1]"
        maxW={1062}
        eyebrow="The complete agentic commerce platform"
        title={<>Your team of <em>expert</em> agents</>}
        sub="With Siena, you can create specialized AI agents for any industry. Train them with your product knowledge, brand voice, and expertise–then deploy skilled product experts that work 24/7 across the top Shopify categories"
        subMax={564}
      />
      <div className="ea-container">
        <div className="ea-panel">
          <div className="ea-head">
            <Eyebrow>Agent expertise across all product categories</Eyebrow>
            <div className="ea-nav">
              <button type="button" aria-label="Previous" className="ea-btn" style={{ opacity: end ? 1 : 0.3 }} onClick={() => setEnd(false)} disabled={!end}>
                <img src="/svg/shopping-agent-caret-left-1-80c65.svg" alt="" />
              </button>
              <button type="button" aria-label="Next" className="ea-btn" style={{ opacity: end ? 0.3 : 1 }} onClick={() => setEnd(true)} disabled={end}>
                <img src="/svg/shopping-agent-caret-right-1-6516a.svg" alt="" />
              </button>
            </div>
          </div>
          <div className="ea-grid">
            <div className="ea-track" style={{ '--shift': end ? '-56px' : '0px' }}>
              {CARDS.map(([t, d, img]) => (
                <div key={t} className="ea-card">
                  <div className="ea-card-img">
                    <img src={`/assets/${img}`} alt="" />
                    <div className="ea-card-fade" />
                  </div>
                  <div className="ea-card-body">
                    <h6 className="pa-h6 ea-card-title">{t}</h6>
                    <p className="ea-card-text">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="ea-benefits">
          {BENEFITS.map(([code, t, d]) => (
            <div key={t} className="ea-benefit">
              <Fa code={code} />
              <h5 className="pa-h5">{t}</h5>
              <p className="pa-tiempos ea-benefit-text">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
