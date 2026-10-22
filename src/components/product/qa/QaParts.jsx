// specs/product-a.md §4 — /qa-agent sections (+ hover cards / Ask Siena mockup reused by /topics-explorer).
import { useRef, useState } from 'react'
import BookDemoButton from '../../cta/BookDemoButton.jsx'
import { Appear, EASE_H1, EASE_SUB, SPRING, prefersReducedMotion } from '../motion.jsx'
import { Eyebrow, Fa, GradBorder, H2, SectionTitle, SienaIcon, Swash } from '../ui.jsx'

/* §4.1 Hero */
export function QaHero() {
  return (
    <section className="ph-hero ph--qa">
      <div className="ph-content">
        <div className="ph-copy">
          <div className="ph-heading">
            <Appear className="ph-swash" y={200} delay={0.3} ease={EASE_SUB}><Swash className="!static !h-full !w-full" /></Appear>
            <Appear y={200} delay={0.2} ease={EASE_H1} className="relative z-[1]">
              <h1 className="pa-h1">Meet your QA<br className="hidden tablet:inline" /> Agent</h1>
            </Appear>
          </div>
          <Appear y={200} delay={0.3} ease={EASE_SUB}>
            <p className="pa-sub ph-sub">The first agent to evaluate 100% of your conversations, AI and humans, against criteria you write in plain language.</p>
          </Appear>
          <Appear y={200} delay={0.4} ease={EASE_SUB}><BookDemoButton /></Appear>
        </div>
        <div className="ph-visual qh-visual">
          <div className="qh-glass" />
          <div className="qh-prompt">
            <div className="qh-prompt-in">
              <img src="/assets/QHZQBNQlSL00uTxYcQKOePAWdT0.webp" alt="" className="qh-illus" />
              <p className="pa-tiempos qh-micro qh-micro--q">Can you just give me a full refund? I don't want a replacement.</p>
              <p className="pa-tiempos qh-micro qh-micro--a">Absolutely, I've processed a full refund including the original shipping cost.</p>
              <span className="qh-fade qh-fade--r" />
              <span className="qh-fade qh-fade--l" />
            </div>
          </div>
          <Appear className="qh-human" y={50} dur={1} delay={0.4} ease={SPRING}>
            <img src="/assets/VRgeV87pQvsZYofKNSBCVhWsSuw.webp" alt="" />
          </Appear>
          <div className="qh-bars">
            <div className="qh-chart">
              <div className="qh-msg">
                <div className="flex items-center justify-between">
                  <p className="pa-tiempos sv-t14">#4821</p>
                  <span className="qh-flag">Flagged <Fa code={0xf024} size={12} color="#F95040" /></span>
                </div>
                <p className="pa-tiempos sv-t18">Unauthorized refund issued</p>
                <p className="pa-tiempos so-t12">Policy adherence</p>
              </div>
              <div className="qh-reason">
                <p className="pa-tiempos sv-t14">Reasoning</p>
                <p className="pa-tiempos so-t12">Refund exceeded authorized limit. No escalation initiated.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* §4.3 Complete Coverage — criteria gallery ticker (35px/s) */
const CRITERIA = [
  ['Conversation Quality', '0-100', 'Average score', '96', '100', "How clear and warm was the agent's communication?"],
  ['Customer Effort', '1-5', 'Average score', '4.4', '5', 'How easy was it for the customer to get resolved?'],
  ['Compliance', 'Pass/Fail', 'Pass rate', '94', '100', 'Did the agent get the right consent before modifying payment?'],
  ['Upsell execution', 'Yes/No', 'Succes rate', '91', '100', "Was the agent's upsell offer a good fit for this customer?"],
  ['SOP Adherence', '1-5', 'Average score', '4.6', '5', 'Were all required steps followed and recorded correctly?'],
]
function Criterion({ c }) {
  const [t, scale, label, v, max, q] = c
  return (
    <div className="qc-card">
      <div className="qc-prompt">
        <p className="pa-tiempos sv-t20">{t}</p>
        <span className="qc-scale">{scale}</span>
        <div className="qc-score">
          <span className="rv-t16">{label}</span>
          <span className="qc-val"><b>{v}</b><i>/</i><em>{max}</em></span>
        </div>
      </div>
      <p className="pa-tiempos sv-t14 qc-q">{q}</p>
    </div>
  )
}
export function CompleteCoverage() {
  return (
    <section className="qc-section">
      <img src="/assets/MSTluKQSUNZrlxr6ESQPZTnooU.webp" alt="" aria-hidden="true" className="qc-blob" />
      <div className="ea-fade ea-fade--top" aria-hidden="true" />
      <div className="qc-inner">
        <div className="qc-title">
          <SectionTitle
            align="left"
            eyebrow="Your criteria. Scored automatically"
            title="Know exactly where quality breaks down"
            h2Max={624}
            sub="QA Agent scores every conversation against your criteria: brand voice, resolution rate, policy adherence, whatever matters to you. See every agent's performance at a glance."
            subMax={624}
          />
        </div>
        <div className="qc-gallery-card">
          <div className="qc-ticker">
            <div className="qc-track pa-ticker35">
              {[...CRITERIA, ...CRITERIA].map((c, i) => <Criterion key={i} c={c} />)}
            </div>
            <span className="qc-side qc-side--l" />
            <span className="qc-side qc-side--r" />
          </div>
          <Appear on="view" y={50} dur={1} delay={0.4} ease={SPRING} className="qc-person">
            <img src="/assets/blmLIryOHXIs0aAOxtgTnOTNS3k.webp" alt="" />
          </Appear>
        </div>
      </div>
    </section>
  )
}

/* §4.5 Leaderboard (static) */
const AGENTS = [
  ['Siena', '14aPLwywC9q4flBvXM0s1rLqA8.png', '1,385', '92.98%', '4.8'],
  ['Alex M.', 'wgzGbJhOWJqIG4hNffwQdhzQEA.png', '312', '89.84%', '4.5', true],
  ['Karen A.', '9DG2BP5UXrlDUwjo8TPG7ZyPxF8.png', '289', '87.85%', '3.2'],
  ['Bronte W.', 'UM7BiWdfr9CURmczCXjNnvZLmA.png', '201', '91.34%', '4.1'],
]
function Conv({ id, flagged, title, crit, pass, children, faded }) {
  return (
    <div className={`ql-conv ${faded ? 'opacity-60' : ''}`}>
      <div className="ql-conv-in">
        <div className="flex items-start justify-between gap-[12px]">
          <div className="flex min-w-0 flex-col gap-[2px]">
            <p className="flex items-center gap-[6px]"><span className="pa-tiempos so-t12">{id}</span>{flagged && <span className="ql-flagged">Flagged</span>}</p>
            <p className="pa-tiempos sv-t14 !whitespace-normal">{title}</p>
            <p className="pa-tiempos ql-crit">{crit}</p>
          </div>
          <span className="flex flex-none items-center gap-[8px]">
            <span className={`ql-pf ${pass ? 'is-pass' : ''}`}>{pass ? 'Pass' : 'Fail'}</span>
            <img src={pass ? '/svg/qa-agent-Icon-Button-bg-6aadf.svg' : '/svg/qa-agent-Icon-Button-bg-0c4ee.svg'} alt="" className="h-[32px] w-[32px]" />
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}
export function Leaderboard() {
  return (
    <section className="ql-section">
      <div className="pa-title pa-title--center" style={{ maxWidth: 800 }}>
        <Eyebrow>Full visibility, every agent</Eyebrow>
        <H2>Turn every score into a world-class agent</H2>
        <p className="pa-sub" style={{ maxWidth: 620 }}>Every agent, AI and human, in one view. Click any score to see the full evaluation and reasoning.</p>
      </div>
      <div className="ql-row">
        <div className="ql-left">
          <Eyebrow className="text-center">Agent performance</Eyebrow>
          <div className="ql-table">
            <div className="ql-head"><span /><span>Evaluations</span><span>Resolution</span><span>Empathy</span></div>
            {AGENTS.map(([n, img, a, b, c, active]) => (
              <div key={n} className={`ql-agent ${active ? 'is-active' : ''}`}>
                <span className="flex items-center gap-[12px]"><img src={`/assets/${img}`} alt="" className="h-[40px] w-[40px] rounded-full" /><span className="pa-tiempos sv-t18">{n}</span></span>
                <span>{a}</span><span>{b}</span><span>{c}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ql-right">
          <div className="flex items-center justify-between">
            <span className="ql-chip"><img src="/assets/wgzGbJhOWJqIG4hNffwQdhzQEA.png" alt="" className="h-[24px] w-[24px] rounded-full" /><span className="pa-tiempos sv-t18">Alex M.</span></span>
            <Eyebrow>Recent conversations</Eyebrow>
          </div>
          <Conv id="#4819" title="Smooth exchange resolution" crit="Resolution" pass />
          <Conv id="#4821" flagged title="Wrong return policy applied" crit="Policy adherence">
            <div className="ql-transcript">
              <p>I need to cancel my subscription, it's just too expensive right now.</p>
              <p>I'm sorry to hear that. I've submitted a replacement order and you'll receive tracking within 24 hours.</p>
            </div>
          </Conv>
          <Conv id="#4819" flagged title="Customer issue not fully resolved" crit="Resolution" />
          <span className="ql-fade" />
        </div>
      </div>
    </section>
  )
}

/* §4.6 hover cards (masked video / rotating ring) — also used by topics §5.6 */
export function SlackVideoCard({ title, text, mask = 'FR5NmxuDqZxhiYmyAJSkFYag0eE.png', logo = '/svg/qa-agent-slack-logo-54b46.svg', word = 'slack', wordOpacity = 0.7, fade = '#FAF7F1', className = '' }) {
  const vref = useRef(null)
  const [hover, setHover] = useState(false)
  const enter = () => {
    setHover(true)
    if (!prefersReducedMotion()) vref.current?.play().catch(() => {})
  }
  const leave = () => setHover(false)
  return (
    <div className={`qa-card ${hover ? 'is-hover' : ''} ${className}`} onMouseEnter={enter} onMouseLeave={leave}>
      <h5 className="pa-h5 text-center">{title}</h5>
      <p className="rv-t16 text-center">{text}</p>
      <div className="qa-card-graphic">
        <img src={logo} alt="" className="qa-logo" />
        <div className="qa-video" style={{ WebkitMaskImage: `url(/assets/${mask})`, maskImage: `url(/assets/${mask})` }}>
          <video ref={vref} src="/video/abstract-landscape-moving-shapes.mp4" muted loop playsInline preload="metadata" />
        </div>
      </div>
      <span className="qa-word" style={{ '--wo': wordOpacity }}>{word}</span>
      <span className="qa-card-fade" style={{ background: `linear-gradient(0deg, ${fade} 0%, rgba(250,247,241,0) 86%)` }} />
    </div>
  )
}
function TagsCard() {
  const [hover, setHover] = useState(false)
  return (
    <div className={`qa-card ${hover ? 'is-hover' : ''}`} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <h5 className="pa-h5 text-center">Help desk tasks</h5>
      <p className="rv-t16 text-center">Flagged conversations appear in your team's queue automatically.</p>
      <div className="qa-tags">
        <div className={`qa-ring ${hover ? 'is-spinning' : ''}`}>
          {[0, 1, 2, 3].map((i) => (
            <Appear key={i} on="view" x={-20} y={-20} dur={0.6} delay={0.6} ease={SPRING} className={`qa-ring-icon qa-ring-icon--${i}`}>
              <Fa code={0xf4b6} size={32} />
            </Appear>
          ))}
        </div>
        <span className="qa-tag-center"><Fa code={0xf02c} size={56} /></span>
      </div>
      <span className="qa-card-fade" style={{ background: 'linear-gradient(0deg, #FAF7F1 0%, rgba(250,247,241,0) 86%)' }} />
    </div>
  )
}
export function ActOnWhatMatters() {
  return (
    <section className="qa-act">
      <SectionTitle eyebrow="Automated actions" title="Act on what matters" sub="Set a threshold on any criterion. Siena sends a Slack alert, tags the ticket, and attaches the full reasoning." subOpacity={false} subMax={620} />
      <div className="qa-act-row">
        <SlackVideoCard title="Slack notifications" text="Low compliance score? Your team gets alerted right away." />
        <TagsCard />
        <SlackVideoCard title="Internal notes" text="Score and reasoning on every ticket. No digging required." mask="WArgludzIusNBVikcHh3Rnh5bro.png" logo="/svg/qa-agent-Notes-ed4f2.svg" word="Notes" wordOpacity={1} />
      </div>
    </section>
  )
}

/* §4.7 / §5.5 Ask Siena mockup */
export function AskSienaMockup({ variant = 'qa', title, text, cards, answer, prompt, metrics, caret }) {
  return (
    <section className={`qm-section qm--${variant}`}>
      <div className="qm-card">
        <div className="qm-bar">
          <div className="qm-title">
            <Eyebrow>Ask Siena anything</Eyebrow>
            <h2 className="qm-h2">{title}</h2>
            <p className="rv-t16 text-center" style={{ maxWidth: 560 }}>{text}</p>
          </div>
          <div className="qm-questions">
            {cards.map(([h, q]) => (
              <div key={h} className="qm-q">
                <h3 className="qm-q-h">{h}</h3>
                <p className="rv-t16 text-center">{q}</p>
              </div>
            ))}
          </div>
          <Appear on="view" y={64} dur={1} delay={0.4} ease="cubic-bezier(0.44,0,0,1)" className="qm-footer">
            <Appear on="view" y={80} dur={0.4} delay={0.15} ease="ease-out" className="qm-answer">
              <div className="qm-answer-in">
                {answer}
                {metrics && (
                  <div className="qm-metrics">
                    {metrics.map((m) => <span key={m} className="sv-chip justify-center">{m}</span>)}
                  </div>
                )}
              </div>
            </Appear>
            <GradBorder r={28} innerClassName="qm-prompt" innerStyle={{ borderRadius: 26 }}>
              <SienaIcon size={20} />
              <span className="pa-fd sv-prompt-text">{prompt}{caret && <span className="qm-caret" aria-hidden="true" />}</span>
              {!caret && <img src="/svg/social-agent-sparkles-two-2-6aa85.svg" alt="" className="ml-auto h-[16px] w-[16px]" />}
            </GradBorder>
          </Appear>
        </div>
      </div>
    </section>
  )
}
