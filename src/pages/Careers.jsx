import RolesList from '../components/company/RolesList.jsx'
import CompanyCta from '../components/company/CompanyCta.jsx'
import { XlgButton, FeatureItem } from '../components/company/shared.jsx'
import '../styles/company.css'

// specs/company.md "/careers": Hero → Creators and doers (Metrics shell) → Why people build here →
// How we work → Open roles (#open-roles) → Main CTA. Nav CTA override lives in routes.js.

// Founders letter is long-form prose → length-matched placeholder copy (build instructions).
const LETTER = [
  'Placeholder copy: a sentence about how consumer brands juggle many disconnected customer tools, and how one agent can replace that stack, starting with support and expanding to every other channel.',
  'Placeholder copy: a sentence about brands already running real customer volume in production, how quickly new work reaches their customers, and how much is still left to build.',
  'Placeholder copy: a few sentences about staying small, distributed and fast, why that only works when everyone owns an outcome, and the kind of person who will enjoy carrying an unsolved problem all the way to the end. More placeholder words keep this block close to the original length so the card height matches the measured layout.',
]

const PEOPLE = [
  {
    name: 'Lou',
    role: 'Agent Engineer',
    location: 'Hamilton, New Zealand',
    photo: 'o84NVbyg8gAhzNm6NDtMG6x5Q.jpg',
    quote: 'I’ve always been curious about the technicalities of how Siena functions. That, plus helping customers unblock things, brought me to the CX team.',
  },
  {
    name: 'Patricio',
    role: 'Forward Deployed PM',
    location: 'Cordoba, Argentina',
    photo: 'zYwHClH3RO5UitAIAL93OiJ1FaA.jpeg',
    quote: 'AI-first at Siena is something you see every day. It shows up in how non-technical teams instinctively reach for AI reasoning before anything else.',
  },
  {
    name: 'Promise',
    role: 'Forward Deployed Engineer',
    location: 'Nairobi, Kenya',
    photo: 'XZGutyEyYkQeF3RlZFORVhgbnKo.png',
    quote: 'Siena gave me the opportunity to be a pioneer, an early member of something big. Nowhere else put me on that edge and trusted me to deliver.',
  },
  {
    name: 'Carla',
    role: 'Deployment Manager',
    location: 'Buenos Aires, Argentina',
    photo: 'x7ul8NZAdgrmZhdlSEGqo4TvrsQ.png',
    top: true,
    quote: 'What stands out is how much thought goes into everything, from the product to our customers, all within a genuinely kind and collaborative culture.',
  },
]

const HOW_WE_WORK = [
  { icon: 0xf57d, title: 'Truly remote global team', body: 'Work from wherever you do your best work. Every timezone counts the same.' },
  { icon: 0xe1ec, title: 'AI-fluent by default', body: 'Your own stack of agents, on accounts we pay for, plus a quarterly budget for what’s next.' },
  { icon: 0xf1d8, title: 'Freedom to act', body: 'Everyone has a voice and impact across the whole company.' },
  { icon: 0xf5d2, title: 'From first principles', body: 'There’s no playbook for what we’re building, so we reason it out from scratch.' },
  { icon: 0xf024, title: 'Extreme ownership', body: 'You own the outcome, not the task. If it’s yours, you carry it all the way to the end.' },
  { icon: 0xf0e7, title: 'We move fast', body: 'What you build reaches customers the same week, not the same quarter.' },
]

export default function Careers() {
  return (
    <>
      {/* C1 Hero */}
      <section className="ca-hero mt-[40px] md:mt-0">
        <div className="ca-hero-copy">
          <h1 className="co-h1 ca-hero-h1">
            <strong>Come and build</strong>
            <strong>The Agent of Record for CX</strong>
          </h1>
          <p className="co-sub text-center">Join a team of builders defining a category for consumer brands.</p>
          <XlgButton href="/careers#open-roles">See open roles</XlgButton>
        </div>
      </section>

      {/* C2 Creators and doers (Metrics shell variant) */}
      <section className="ca-letter">
        <img className="ca-letter-bg" src="/assets/5VTp1YGCJLYo9Grib0Ouvyooeag.webp" alt="" aria-hidden="true" />
        <div className="ca-blur ca-blur--top" aria-hidden="true" />
        <div className="ca-letter-card">
          <div className="ca-letter-text">
            <h2 className="co-h2">Creators and doers</h2>
            <div className="ca-letter-group">
              <div className="ca-letter-paras">
                {LETTER.map((p) => (
                  <p key={p} className="co-sub">{p}</p>
                ))}
              </div>
              <p className="ca-signature">Lisa and Andrei, co-founders</p>
            </div>
          </div>
          <div className="ca-letter-photo co-appear-fade">
            <img src="/assets/jI4UkRHradpPJjCWsLuzyY5YOo.png" alt="Siena co-founders with an award" />
          </div>
        </div>
        <div className="ca-blur ca-blur--bottom" aria-hidden="true" />
      </section>

      {/* C3 Why people build here */}
      <section className="ca-why">
        <div className="ca-why-inner">
          <h2 className="co-h2 w-full">Why people build here</h2>
          <div className="ca-why-grid">
            {PEOPLE.map((p) => (
              <div key={p.name} className="ca-person">
                <img className={`ca-person-photo${p.top ? ' ca-person-photo--top' : ''}`} src={`/assets/${p.photo}`} alt={p.name} />
                <h5 className="co-hcard">{p.name}</h5>
                <div className="ca-person-meta">
                  <p>{p.role}</p>
                  <p>{p.location}</p>
                </div>
                <p className="ca-person-quote">{p.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* C4 How we work */}
      <section className="ca-how">
        <h2 className="co-h2 ca-how-h2">How we work</h2>
        <div className="ca-how-grid">
          {HOW_WE_WORK.map((item) => (
            <FeatureItem key={item.title} {...item} />
          ))}
        </div>
      </section>

      {/* C5 Open roles */}
      <section id="open-roles" className="ca-roles">
        <RolesList />
      </section>

      <CompanyCta
        variant="careers"
        phone="careers"
        heading="Don't see your role? Tell us what you'd own and why it matters."
        buttonLabel="Email us"
        href="mailto:careers@siena.cx"
      />
    </>
  )
}
