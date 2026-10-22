import LeadForm from './LeadForm.jsx'
import { FaIcon } from './ui.jsx'

// specs/conversion.md §1.2 hero logo grid (same 6 logos on /pricing and /book-a-demo).
const LOGOS = [
  { file: 'I79jHrog8xkJyLdp6KBEDj6Ywjk.png', alt: 'Comfrt' },
  { file: 'BYD0tOgABiRk8bVwCxbpUE5hDs.png', alt: 'grüns' },
  { file: 'GtydJWMgnwv6wkRfNUoPlww2jh0.svg', alt: 'Bombas' },
  { file: 'f15R92EBkjPHx4ABojD1VWldk54.png', alt: 'FIGS' },
  { file: 'vtOMWVl8Yp4AVppVcHxc4tGpNo.png', alt: 'create' },
  { file: 'ipTDxCOrcnVCeET6yx6vSIolM.png', alt: 'SPANX' },
]

// variant: 'pricing' (§1.2) | 'book' (§2.2)
export function LeadHero({ variant, title, body, formTitle, submitLabel }) {
  return (
    <section className={`cv-lead-hero cv-lead-hero--${variant}`}>
      <div className="cv-lead-hero-bg" aria-hidden="true">
        <img
          src={variant === 'book' ? '/assets/43GZFV0RCkyKlAJWzDPZW1Yls3s.webp' : '/assets/LhQ0hZskcxCtirPSSxXE4hUU0yo.webp'}
          alt=""
        />
      </div>
      <div className="cv-lead-hero-row">
        <div className="cv-lead-title">
          <div className="cv-lead-text">
            <h1>{title}</h1>
            <div className="cv-op82">
              <p>{body}</p>
            </div>
          </div>
          <div className="cv-logo-grid">
            {LOGOS.map((l, i) => (
              <div key={l.file} className="cv-logo-cell">
                <img className={`cv-logo cv-logo--${i + 1}`} src={`/assets/${l.file}`} alt={l.alt} />
              </div>
            ))}
          </div>
        </div>
        <div className={`cv-form-wrap cv-form-wrap--${variant}`}>
          <LeadForm title={formTitle} submitLabel={submitLabel} />
        </div>
      </div>
    </section>
  )
}

const PRICING_COLS = [
  { icon: 0xf847, title: 'Platform fee', body: 'Access Siena’s core AI engine and unlimited sandbox for $750/month—reliable, high-quality automation.' },
  { icon: 0xe3f1, title: 'Automation Pack', body: 'Automate tickets at just $0.90 each—scale effortlessly while keeping costs in check.' },
  { icon: 0xf652, title: 'Support & Implementation', body: 'Expert onboarding plus dedicated Slack support—launch fast, hit goals, maximize ROI.', alt: true },
]

// §1.3
export function HowPricing() {
  return (
    <section className="cv-how">
      <div className="cv-how-title">
        <p className="cv-eyebrow">What to expect</p>
        <h2 className="cv-h2">How does pricing work?</h2>
      </div>
      <div className="cv-how-row">
        {PRICING_COLS.map((c) => (
          <div key={c.title} className="cv-how-col">
            <FaIcon code={c.icon} className="cv-how-icon" />
            <h3>{c.title}</h3>
            <div className="cv-op80">
              <p className={c.alt ? 'is-ink2' : ''}>{c.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const ENTERPRISE = [
  { icon: 0xf132, title: 'AI & brand-safety guardrails', body: 'Brand voice, business rules, and human handoff keep every agent aligned with how you run CX.' },
  { icon: 0xf023, title: 'SSO, roles, audit logs', body: 'SAML SSO, granular permissions, and a full trail of every action your team and the agent take.' },
  { icon: 0xf590, title: 'SOC 2 Type II compliant', body: "Your data and your customers' data handled to enterprise security and privacy standards." },
  { icon: 0xf590, title: 'Dedicated support & SLA', body: 'A named success manager, hands-on onboarding, and priority response with an uptime SLA.' },
]

// §1.5
export function Enterprise() {
  return (
    <section className="cv-ent">
      <div className="cv-ent-stack">
        <div className="cv-ent-title">
          <h2 className="cv-h2">Enterprise-grade safety</h2>
          <p>
            Trusted by some of the fastest-growing ecommerce and retail companies, Siena meets the highest enterprise standards with
            guardrails and granular controls that keep every interaction on brand and on policy.
          </p>
        </div>
        <div className="cv-ent-cards">
          {ENTERPRISE.map((c) => (
            <div key={c.title} className="cv-ent-card">
              <FaIcon code={c.icon} className="cv-ent-icon" />
              <h6>{c.title}</h6>
              <div className="cv-op80">
                <p>{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
