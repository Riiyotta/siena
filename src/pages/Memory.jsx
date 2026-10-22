import { useEffect } from 'react'
import { Appear, BookDemoButton, CtaB, Eyebrow, Fa, H2, ProductLogoTicker, Reveal } from '../components/product-b/shared.jsx'
import MemoryCarousel from '../components/product-b/MemoryCarousel.jsx'
import TestimonialSlider from '../components/product-b/TestimonialSlider.jsx'

// specs/product-b.md §1 /memory

// §1.5 testimonial slides. Names / roles / logos / photos are real; the quotes are not in
// src/components/testimonials/data.js, so they are length-matched placeholder copy.
const SLIDES = [
  {
    name: 'Rebecca Blount',
    role: 'Associate Director, Customer Strategy & Operations',
    logo: 'ZeJTO989NVjG9cfH69ugd19p4C0.svg',
    logoAlt: 'Coterie logo',
    image: 'DkKUcZ5MMlNWr9dt9V653q2eWmI.jpg',
    imageAlt: 'Photo of Rebecca Blount',
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde.',
  },
  {
    name: 'Ginger Lamb',
    role: 'VP of Customer Delight',
    logo: 'y27Z3JPTR70wZ1vySbDPnp3REZI.svg',
    logoAlt: 'Earth Breeze logo',
    image: 'nV1IWjY6I2CSokNrD6kB1ifPf5s.jpg',
    imageAlt: 'Photo of Ginger Lamb',
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
  },
  {
    name: 'Cate Marques',
    role: 'CXO',
    logo: 'FAmVCc3xLG8QUhmtyJ3WkBGEeU.png',
    logoAlt: 'Terra Kaffe logo',
    image: 'WVZA37Bad6K0ss9JDOjwLhH2aUs.webp',
    imageAlt: 'Photo of Cate Marques',
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum..',
  },
  {
    name: 'Sydney Chestler',
    role: 'Director of Customer Experience',
    logo: 'viVxpvqRgp5ynnq499GrMlfB0Ac.svg',
    logoAlt: 'Brand logo',
    image: 'vA3hb562f7DMVcRPweuwrDgyxyo.jpg',
    imageAlt: 'Photo of Sydney Chestler',
    quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
  },
]

const SIENA_AVATAR = (
  <div className="mf-avatar mf-avatar--siena">
    <img src="/svg/memory-siena-avatar-glyph.svg" alt="" width="12" height="13" />
  </div>
)

function Customer({ text, w }) {
  return (
    <div className="mf-row mf-row--customer">
      <div className="mf-avatar">
        <img className="mf-avatar-img" src="/assets/D3TQ38q4HpOxmxHoD1u1AW40NI.png" alt="" />
      </div>
      <div className="mf-bubble" style={{ "--w": `${w}px` }}>
        <p className="mf-text">{text}</p>
      </div>
    </div>
  )
}

function Siena({ text }) {
  return (
    <div className="mf-row mf-row--siena">
      <div className="mf-grad">
        <div className="mf-bubble mf-bubble--siena">
          <p className="mf-text">{text}</p>
        </div>
      </div>
      {SIENA_AVATAR}
    </div>
  )
}

// §1.2 motion: row 1 from y 80, rows 2–7 from y 50; spring .2/1; delays .5 1 1.5 2 2 2.5 3
const ROWS = [
  [<Customer key="1" text="Has my sculpting shorts order shipped yet?" w={380} />, 80, 0.5],
  [<Siena key="2" text="Just went out! You'll have it Friday." />, 50, 1.0],
  [<Customer key="3" text="Perfect! Hope XL fits, sometimes I need Large." w={352} />, 50, 1.5],
  [
    <div key="4" className="mf-divider">
      <span className="mf-line" />
      <span className="mf-pill">
        <Fa code={0xf017} size={12} className="mf-pill-icon" />
        <span className="mf-pill-text">5 weeks later</span>
      </span>
      <span className="mf-line" />
    </div>,
    50,
    2.0,
  ],
  [<Customer key="5" text="Looking for those sculpting shorts in high-waisted." w={387} />, 50, 2.0],
  [<Siena key="6" text="We have those! You mentioned being between L and XL before. Which worked better?" />, 50, 2.5],
  [<Customer key="7" text="XL was loose. L would be perfect!" w={287} />, 50, 3.0],
]

const COLUMNS = [
  [0xf890, 'Capture', 'Memory captures insights from every conversation. Then builds a complete 360° customer profile and references them in future interactions.'],
  [0xf06e, 'Generate', 'Then Insights generates actionable reports you can share with your entire team. Get weeks of analysis done in minutes.'],
  [0xf6a3, 'Act', 'Turn insights into strategic actions that move your business forward. Proactively resolve issues, shape product roadmaps, or tailor marketing campaigns.'],
]

export default function Memory() {
  useEffect(() => {
    document.title = 'Siena Memory - The Agentic Brand Intelligence Layer'
  }, [])

  return (
    <div className="pb-page pb-memory">
      {/* §1.1 Hero */}
      <section className="mh-hero">
        <img className="mh-bg" src="/assets/9ffhJgVx9g1qv0nTgqvc7QPif3o.png" alt="" />
        <div className="mh-title">
          <div className="mh-text">
            <Appear as="h1" delay={0.2} className="pb-h1 mh-h1">
              Capture every detail,
              <br />
              personalize every moment.
            </Appear>
            <Appear as="p" delay={0.3} opacity={0.82} className="pb-hero-sub mh-sub">
              Siena Memory is the agentic brand intelligence layer that powers superhuman personalization and delivers insights that transform your business.
            </Appear>
          </div>
          <Appear delay={0.4}>
            <BookDemoButton />
          </Appear>
        </div>
        <ProductLogoTicker className="mh-ticker" />
      </section>

      {/* §1.2 Feature 1 */}
      <section className="mf-section">
        <div className="mf-title">
          <div className="mf-head">
            <Eyebrow bold>AI agent that remembers</Eyebrow>
            <H2>Turn interactions into personalized experiences</H2>
          </div>
          <p className="pb-serif mf-body">
            Siena Memory remembers key details like preferences or feedback and applies them in future interactions. No repetition, just human-like context that makes every customer feel uniquely known.
          </p>
        </div>
        <div className="mf-image">
          <img className="mf-image-bg" src="/assets/OS7uIQBhEtXd5l7MXZ0qAcM0Lg.png" alt="" />
          <div className="mf-stack">
            {ROWS.map(([node, y, delay], i) => (
              <Reveal key={i} y={y} delay={delay} className="mf-reveal">
                {node}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* §1.3 Feature 2 */}
      <section className="mf-section mf-section--2">
        <div className="mf-title mf-title--2">
          <div className="mf-group">
            <div className="mf-head">
              <Eyebrow bold>Tap into every conversation</Eyebrow>
              <H2>Unlock high-fidelity insights like never before</H2>
            </div>
            <p className="pb-serif mf-body">
              Memory transforms conversations into precise, actionable insights. See emerging trends, hidden issues, and exactly what customers care about, in seconds.
            </p>
          </div>
          <div className="mf-btn">
            <BookDemoButton />
          </div>
        </div>
        <div className="mf-image mf-image--photo">
          <img
            className="mf-image-bg"
            src="/assets/d1NEs0VIe4aSoSGCYqjR4UG4QD8.png"
            alt="Siena Memory insights: customers most often mention gym trainers as how they found us; widget loading errors reported also mention browser version 2.4; subscription pauses spike during travel season — offer travel packs"
          />
        </div>
      </section>

      {/* §1.4 How it works */}
      <section className="mw-section">
        <img className="mw-bg" src="/assets/5VTp1YGCJLYo9Grib0Ouvyooeag.webp" alt="" />
        <div className="mw-card">
          <div className="mw-title">
            <Eyebrow>How it works</Eyebrow>
            <H2>
              The agentic brand
              <br />
              intelligence layer
            </H2>
          </div>
          <div className="mw-cols">
            {COLUMNS.map(([icon, h, body]) => (
              <div key={h} className="mw-col">
                <Fa code={icon} size={24} />
                <h3 className="mw-h3">{h}</h3>
                <p className="mw-body">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* §1.5 Memory in action + testimonial */}
      <section className="ma-section">
        <img className="ma-blob" src="/assets/vOpdH6bt6rHWgyec84XjbD1Lbgc.webp" alt="" />
        <div className="ma-block">
          <div className="ma-title-row">
            <div className="ma-title">
              <Eyebrow>Brands love capturing</Eyebrow>
              <H2>Memory in action</H2>
            </div>
          </div>
          <MemoryCarousel />
        </div>
        <div className="ma-tm-row">
          <TestimonialSlider slides={SLIDES} className="pb-tm--memory" />
        </div>
      </section>

      {/* §1.6 CTA */}
      <CtaB
        title="Turn conversations into intelligence"
        className="pb-cta--compact"
        fade={{ height: 120, mobileHeight: 50, top: -1, background: 'linear-gradient(180deg, #F3F0EB 11%, rgba(250,247,241,0) 77%)' }}
      />
    </div>
  )
}
