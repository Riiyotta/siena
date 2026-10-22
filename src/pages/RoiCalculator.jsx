import { useEffect } from 'react'
import { Appear, CtaB, Eyebrow, Fa, H2, Motion } from '../components/product-b/shared.jsx'
import Calculator from '../components/product-b/RoiCalculator.jsx'
import TestimonialSlider from '../components/product-b/TestimonialSlider.jsx'
import { TESTIMONIALS } from '../components/testimonials/data.js'

// specs/product-b.md §6 /roi-calculator
const EXPECT = ['Immediate cost reduction', 'Higher efficiency, happier teams', 'Exceptional CX, proven by a 4.81 avg. CSAT', 'New opportunities for revenue growth']

export default function RoiCalculator() {
  useEffect(() => {
    document.title = 'ROI Calculator | Siena AI'
  }, [])
  return (
    <div className="pb-page pb-roi">
      {/* §6.1 Hero */}
      <section className="rh-hero">
        <img className="rh-blur" src="/assets/kNOuUUIKKOVF7lVsrJ7k9ktjPow.webp" alt="" />
        <div className="rh-row">
          <div className="rh-left">
            <Appear as="h1" delay={0.2} className="pb-h1">See the ROI for yourself</Appear>
            <Appear as="p" delay={0.3} opacity={0.82} className="pb-hero-sub rh-sub">
              Discover exactly how much you&apos;ll save with AI agents.
            </Appear>
            <Appear delay={0.4} className="rh-expect">
              <Eyebrow>What to expect</Eyebrow>
              <ul className="rh-list">
                {EXPECT.map((t) => (
                  <li key={t}>
                    <Fa code={0xe5d6} size={20} className="rh-icon" />
                    <span className="pb-serif">{t}</span>
                  </li>
                ))}
              </ul>
            </Appear>
          </div>
          <Motion trigger="load" className="rh-right" from={{ opacity: 0.001, x: 150 }} transition={{ type: 'spring', bounce: 0.2, duration: 0.6, delay: 0 }}>
            <Calculator />
          </Motion>
        </div>
      </section>

      {/* §6.3 Testimonials — homepage 11 slides */}
      <section className="rt-section">
        <div className="rt-title">
          <Eyebrow className="text-center">Real impact, real savings</Eyebrow>
          <H2 className="text-center">People are talking</H2>
        </div>
        <div className="rt-box">
          <TestimonialSlider slides={TESTIMONIALS} className="pb-tm--roi" />
        </div>
      </section>

      {/* §6.4 CTA — no top fade */}
      <CtaB title="Brands that win on CX run on Siena" fade={false} />
    </div>
  )
}
