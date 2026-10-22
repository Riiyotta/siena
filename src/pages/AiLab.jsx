import { useEffect, useState } from 'react'
import AiLabNav from '../components/product-b/AiLabNav.jsx'
import { Appear, Eyebrow, Fa, H2, Motion } from '../components/product-b/shared.jsx'
import { siteHref } from '../routes.js'

// specs/product-b.md §5 /ai-lab

// §5.2 pixel tiles (absolute page coords at 1440). kinds: g = peach gradient, gy = yellow-start, gc = coral-start,
// d = hero cut-out, w = white cut-out, p = photo [file, w, h]
const TILES = [
  ['d', 1120, 484], ['d', 1200, 595], ['d', 1200, 773], ['d', 1120, 884],
  ['w', 80, 1949], ['w', 0, 2060],
  ['p', 1120, 773, 'f9RYAmmoTh5Z8crb9ahkR5DC0JE.webp', 81, 112], ['p', 722, 1371, 'vCYHzSbVQFkiJD63RRjesck1GAk.webp', 79, 111],
  ['p', 968, 1146, '8vj9CileH7CuaaiunoniDOrbarI.webp', 232, 325], ['p', 352, 1591, 'i9WHZ8OCRKB0PgtAy4Cj3YlYzYA.webp', 160, 224],
  ['p', 914, 1592, 'RPgbC6APt6VN8fkzaS6O0p7UuKQ.webp', 160, 224], ['p', 80, 4315, 'M7jG4hn37wxejZA8bixJlPNAU.webp', 160, 224],
  ['p', 641, 4316, 'rJWsqYiMpnKBomfS1v0G4AcEM.webp', 80, 112], ['p', 880, 4315, 'aBNy1lWXQMzlHMzsv9vKqJrjCos.webp', 160, 224],
  ['p', 401, 4539, 'czHP5ISDMQX62viczmpPaYhQYpE.webp', 160, 224], ['p', 1280, 4539, 'n2cLcUeIHLe1Gj11wKiDu98KQ.webp', 160, 224],
  ['p', 720, 4651, 'ulS7iAn3fQc6JurqrwLUSxzo4.webp', 160, 224], ['p', 321, 4763, 'IxP8cFFbplPad8dsD3ScHdKPdIo.webp', 80, 112],
  ...[
    [888, 884], [968, 772], [510, 1329], [590, 1441], [802, 1331], [1280, 996], [1360, 1108], [720, 2210], [800, 1948],
    [880, 2060], [1360, 2098], [1200, 2611], [1280, 2873], [0, 3600], [312, 3600], [1360, 3862], [80, 3862], [561, 4277],
    [80, 4389], [640, 4389], [1200, 4611], [1360, 4723], [1280, 4835], [1360, 5443], [808, 5443], [728, 5555], [888, 5555],
  ].map(([x, y]) => ['g', x, y]),
  ['gy', 802, 1109], ['gc', 1360, 1594],
]
// delays 0 / .2 / .3 / .5 s (9 / 5 / 3 / 2 tiles), cycled across the set
const DELAY_SEQ = [0, 0.2, 0, 0.3, 0, 0.2, 0, 0.5, 0, 0.2, 0, 0.3, 0, 0.2, 0, 0.5, 0.2, 0.3, 0]

function Tiles() {
  return (
    <div className="al-tiles" aria-hidden="true">
      {TILES.map(([k, x, y, file, w = 80, h = 112], i) => (
        <Motion
          key={i}
          className={`al-tile al-tile--${k}`}
          style={{ left: x, top: y, width: w, height: h }}
          from={{ opacity: 0, y: 150 }}
          transition={{ duration: 0.4, delay: DELAY_SEQ[i % DELAY_SEQ.length], ease: [0.44, 0, 0, 1] }}
          amount={0}
          once={false}
        >
          {k === 'p' && <img src={`/assets/${file}`} alt="" />}
        </Motion>
      ))}
    </div>
  )
}

function EventCard({ date, title, sub, time, place, href, className = '' }) {
  return (
    <div className={`al-event ${className}`}>
      <div className="al-event-tags">
        <span className="al-tag">{date}</span>
        <span className="al-tag">In person</span>
      </div>
      <div className="al-event-body">
        <h6 className="al-event-title">{title}</h6>
        <p className="al-event-sub">{sub}</p>
        <div className="al-event-info">
          <p>
            <Fa code={0xf017} size={20} />
            {time}
          </p>
          <p>
            <Fa code={0xf3c5} size={20} />
            {place}
          </p>
        </div>
      </div>
      {href && (
        <a className="al-join" href={href} target="_blank" rel="noreferrer">
          Join us
        </a>
      )}
    </div>
  )
}

const HOW = [
  ['How it works', 'Curated panels', 'Intimate discussions. Featured brand shares their AI journey, then open conversation with the group.'],
  ['Lunches and dinners', 'Roundtables', 'Smaller gatherings over food and drinks. Longer format. Deeper into specific challenges and solutions.'],
  ['Published insights', 'Published insights', 'We record, document, and share key takeaways. Available to the broader community.'],
]
const WHY = [
  ['01.', 'Real Metrics', "Move beyond vanity numbers. See how merchants measure AI's impact on conversion, retention, and customer lifetime value. Frameworks you can use immediately."],
  ['02.', 'Your Peers', 'Connect with operators facing the same challenges. Build relationships with people who understand the complexity of scaling AI in live commerce environments.'],
  ['03.', 'AI Ecosystem', 'From autonomous support to business intelligence, explore how AI touches every part of the customer journey. Integration strategies that compound over time.'],
  ['04.', 'First Access', 'Early exposure to emerging tools and methods. Shape the conversation before trends become common knowledge. Stay ahead of market shifts without the overwhelm.'],
]
const WHO = [
  ['Founders & GMs', ['Leading a managing the push toward AI-first operations', 'Seeking competitive advantage through intelligent automation', 'Building an organization that embraces AI innovation']],
  ['CX & Operations Leaders', ['Scaling support without scaling headcount', 'Implementing AI that enhances (not replaces) human judgment', 'Measuring ROI on autonomous customer experience']],
  ['Marketing & Growth', ['Using AI for personalization at scale', 'Improving conversion with AI insights', 'Testing new acquisition channels', 'Leveraging AI for content creation']],
]

function Newsletter() {
  const [state, setState] = useState('idle') // idle | success
  // Static look-alike: never posts to Siena's Framer form endpoint, just shows the live success copy
  const submit = (e) => {
    e.preventDefault()
    setState('success')
  }
  return (
    <section className="al-cta-section">
      {/* canvas grain/animated overlay on the live site → approximated with a CSS noise layer */}
      <div className="al-grain" aria-hidden="true" />
      <div className="al-cta-card">
        <H2 className="text-center">{state === 'success' ? 'Thank you! Your submission has been received!' : "Be the first to know what's happening"}</H2>
        <form className="al-form" onSubmit={submit}>
          <input type="hidden" name="FormId" value="newsletter" />
          <input className="al-input" type="email" name="email" required placeholder="john.smith@example.com" aria-label="Email" />
          <button className="al-submit" type="submit">
            Sign me up!
          </button>
        </form>
      </div>
    </section>
  )
}

function Rule({ white }) {
  return <div className={`al-rule ${white ? 'al-rule--white' : ''}`} />
}

export default function AiLab() {
  useEffect(() => {
    document.title = 'AI Lab | Siena AI'
  }, [])
  return (
    <div className="pb-page pb-ailab">
      <AiLabNav />
      <Tiles />

      {/* §5.1 Hero */}
      <section className="al-hero" id="top">
        <div className="al-header">
          <div className="al-titles">
            <Appear as="h1" delay={0.2} className="pb-h1 al-h1">
              – AI Lab
            </Appear>
            <Appear as="h3" delay={0.3} className="pb-h3r al-h3">
              Where Leading Brands Master AI-Powered CX
            </Appear>
          </div>
          <Appear delay={0.4} className="al-buttons">
            <a className="al-btn al-btn--white al-desktop-only" href="#next-lab">
              Join the Next Lab
            </a>
            <a className="al-btn al-btn--white al-phone-only" href={siteHref('/book-a-demo')}>
              Join the Next Lab
            </a>
            <a className="al-btn al-btn--dark" href={siteHref('/book-a-demo')}>
              Learn More
            </a>
          </Appear>
        </div>
        <img className="al-photo" src="/assets/chbWKDcCWdz6Laay1dFVDF6T098.webp" alt="AI Lab roundtable audience" />
        <div className="al-events">
          <EventCard date="Jun 24, 2026" title="AI Lab in LA🌴" sub="Mellow Sleep" time="12 PM - 3 PM PDT" place="LA" href="https://luma.com/4zv03kjl" />
          <EventCard date="Jul 30, 2026" title="AI Lab dinner in London 🇬🇧" sub="Private community dinner" time="6pm-8pm UK" place="London" href="https://luma.com/qspvr322" />
        </div>
      </section>

      {/* §5.3 Intro */}
      <section className="al-intro">
        <div className="al-col624">
          <Rule />
          <h5 className="al-h5">Intimate gatherings with top executives, operators, and innovators defining the future of ecommerce.</h5>
        </div>
      </section>

      {/* §5.4 What is AI Lab */}
      <section className="al-what">
        <div className="al-what-left">
          <Rule />
          <Eyebrow>Curated sessions</Eyebrow>
          <H2>What is AI Lab</H2>
        </div>
        <h5 className="al-h5 al-what-right">
          AI lab brings together founders, executives, and operators from leading brands to talk about what&apos;s working in AI. Each session features a brand that&apos;s gone beyond the hype—Brooklinen, Mellow Sleep, Coterie—and the people running their operations.
        </h5>
      </section>

      {/* §5.5 How it works */}
      <section className="al-how">
        {HOW.map(([eb, h, body], i) => (
          <div key={h} className="al-how-col">
            {/* LIVE-SITE QUIRK (§5.5): the 2nd/3rd eyebrows are #FFFFFF on white (invisible) — replicated */}
            <Eyebrow className={i ? 'al-eyebrow-white' : ''}>{eb}</Eyebrow>
            <h3 className="pb-h3r">{h}</h3>
            <p className="pb-sans20">{body}</p>
          </div>
        ))}
      </section>

      {/* §5.6 Become an AI practitioner */}
      <section className="al-dark">
        <div className="al-dark-top">
          <div className="al-dark-left">
            <Rule white />
            <Eyebrow className="text-white">Why attend?</Eyebrow>
            <H2 className="text-white al-dark-h2">Become an AI practitioner</H2>
          </div>
          <h5 className="al-h5 text-white al-dark-right">AI lab exists because the best insights come from people doing the work, not selling tools.</h5>
        </div>
        <div className="al-why">
          {WHY.map(([n, h, b]) => (
            <div key={n} className="al-why-col">
              <p className="pb-eyebrow text-white">{n}</p>
              <h3 className="pb-h3r text-white">{h}</h3>
              <p className="pb-sans20 text-white">{b}</p>
            </div>
          ))}
        </div>
        <div id="next-lab" className="al-next">
          <H2 className="text-white">Next LAB</H2>
        </div>
      </section>

      {/* §5.7 From our last LAB */}
      <section className="al-last">
        <div className="al-col656">
          <Rule />
        </div>
        <div className="al-last-title">
          <Eyebrow>Previous events</Eyebrow>
          <H2>From our last LAB</H2>
        </div>
        <EventCard className="al-event--past" date="Nov 7, 2025" title="AI Uncensored with Siena & Yotpo" sub="AI Uncensored with Siena & Yotpo" time="12pm PT" place="San Francisco" />
      </section>

      {/* §5.8 Who should attend */}
      <section className="al-who">
        <div className="al-who-left">
          <Rule />
          <Eyebrow>You&apos;re in good company</Eyebrow>
          <H2>Who should attend?</H2>
        </div>
        <div className="al-who-right">
          {WHO.map(([h, items]) => (
            <div key={h} className="al-who-group">
              <h3 className="pb-h3r">{h}</h3>
              <ul className="al-who-list">
                {items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* §5.9 Newsletter CTA */}
      <Newsletter />
    </div>
  )
}
