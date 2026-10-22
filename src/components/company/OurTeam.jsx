import { XlgButton, IconButton } from './shared.jsx'

// specs/company.md A3 "Our team" (Feedback).
// The five-paragraph team letter is long-form prose: rendered as length-matched placeholder copy
// (per build instructions); the closing line, headings, labels and names are exact.
const PARAGRAPHS = [
  'Placeholder copy: a short introduction to a distributed team, what drives it day to day, and the broader goal it is working toward for the brands it serves every day.',
  'Placeholder copy: a few sentences about ownership and trust, how people step in to solve hard problems, and how the team balances moving quickly with sweating the small details, from the big picture down to the finish.',
  'Placeholder copy: a note on how candid, open working relationships help everyone do their best work together across the whole company, every single day.',
  'Placeholder copy: what it means to join as a co-creator, with an emphasis on ownership, empathy for customers, and caring about real impact.',
  'We’re growing fast. We’d love to meet you.',
]

const FOUNDERS = [
  { name: 'Lisa Popovici', linkedin: 'https://www.linkedin.com/in/lisapopovici/', x: 'https://x.com/lisapopovici' },
  { name: 'Andrei Negrau', linkedin: 'https://www.linkedin.com/in/negrau', x: 'https://x.com/andreinegrau' },
]

export default function OurTeam() {
  return (
    <section className="ab-team">
      <div className="ab-team-text">
        <div className="ab-team-title">
          <p className="co-eyebrow">Our team</p>
          <h2 className="co-h2">Creators and doers</h2>
        </div>
        <div className="ab-team-paras">
          {PARAGRAPHS.map((p) => (
            <p key={p} className="co-body">{p}</p>
          ))}
        </div>
        <XlgButton href="/careers">We’re hiring</XlgButton>
      </div>

      <div className="ab-team-media">
        <img className="ab-team-portrait" src="/assets/oVfH5UrvznJiBjQEiKKMl1FDx4.png" alt="Siena co-founders Lisa Popovici and Andrei Negrau" />
        <div className="ab-founders">
          {FOUNDERS.map((f) => (
            <div key={f.name} className="ab-founder">
              <strong className="ab-founder-name">{f.name}</strong>
              <div className="ab-founder-socials">
                <IconButton href={f.linkedin} code={0xf0e1} label={`${f.name} on LinkedIn`} />
                <IconButton href={f.x} code={0xe61b} label={`${f.name} on X`} wide />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
