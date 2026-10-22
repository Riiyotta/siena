// specs/product-a.md §6 — /ask-siena sections.
import { useEffect, useRef, useState } from 'react'
import BookDemoButton from '../../cta/BookDemoButton.jsx'
import CarouselButton from '../../stories/CarouselButton.jsx'
import { Appear, EASE_OUT, SPRING, prefersReducedMotion } from '../motion.jsx'
import { useSlidingHighlight } from '../sections.jsx'
import { Eyebrow, Fa, GradBorder, H2, SectionTitle, SienaIcon, StarBullets } from '../ui.jsx'

/* §6.1 hero typewriter: 65ms/char type, ~1.0s hold, 17ms/char delete, ~1.1s pause */
const PHRASES = ['to turn an SOP into a journey', 'what drives loyalty', 'to build a BFCM persona', 'to find new revenue streams', 'about shipping speed by region', 'to build a new QA evaluation', 'for weekly management report']
function Typewriter() {
  const [text, setText] = useState(prefersReducedMotion() ? PHRASES[0] : '')
  useEffect(() => {
    if (prefersReducedMotion()) return
    let i = 0
    let n = 0
    let mode = 'type'
    let t
    const tick = () => {
      const p = PHRASES[i]
      if (mode === 'type') {
        n++
        setText(p.slice(0, n))
        if (n >= p.length) { mode = 'del'; t = setTimeout(tick, 1000); return }
        t = setTimeout(tick, 65)
      } else {
        n--
        setText(p.slice(0, Math.max(n, 0)))
        if (n <= 0) { mode = 'type'; i = (i + 1) % PHRASES.length; t = setTimeout(tick, 1100); return }
        t = setTimeout(tick, 17)
      }
    }
    t = setTimeout(tick, 600)
    return () => clearTimeout(t)
  }, [])
  return (
    <span className="ah-type">
      {text}
      <span className="ah-caret" aria-hidden="true" />
    </span>
  )
}

export function AskHero() {
  return (
    <section className="ph-hero ph--ask">
      <div className="ph-content">
        <div className="ph-copy">
          <h1 className="pa-h1">Meet Ask Siena</h1>
          <p className="pa-sub ph-sub ah-sub">The agent that builds the agent. The intelligence that surfaces what your customers are telling you. Democratizing world-class CX for every brand.</p>
          <BookDemoButton />
        </div>
        <div className="ph-visual ah-visual">
          <div className="ah-video"><video src="/video/abstract-landscape-moving-shapes.mp4" autoPlay muted loop playsInline aria-hidden="true" /></div>
          <img src="/assets/YmGG4WNvnun2O0TtfdX5gdGE.webp" alt="" className="ah-person" />
          <div className="ah-bar">
            <GradBorder r={28} innerClassName="ah-bar-in" innerStyle={{ borderRadius: 26 }}>
              <SienaIcon size={20} />
              <span className="pa-fd ah-bar-text" aria-live="off">Ask Siena <Typewriter /></span>
            </GradBorder>
          </div>
        </div>
      </div>
    </section>
  )
}

/* §6.3 sticky chip nav */
export function ChipNav() {
  const [active, setActive] = useState(0)
  const { linkRefs, box } = useSlidingHighlight(active)
  useEffect(() => {
    const onScroll = () => {
      const m = document.getElementById('cx-insights')
      if (m) setActive(m.getBoundingClientRect().top <= window.innerHeight * 0.48 ? 1 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const go = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' })
  }
  return (
    <div className="an-wrap">
      <nav className="an-pill" aria-label="Sections">
        {box && <span className="an-hl" style={{ transform: `translateX(${box.left - 3}px)`, width: box.width + 6 }} aria-hidden="true" />}
        <a ref={(el) => (linkRefs.current[0] = el)} href="/ask-siena#build" onClick={(e) => go(e, 'build')} className="an-link">Build</a>
        <span className="an-div" />
        <a ref={(el) => (linkRefs.current[1] = el)} href="/ask-siena#cx-intelligence" onClick={(e) => go(e, 'cx-intelligence')} className="an-link">Customer intelligence</a>
      </nav>
    </div>
  )
}

/* §6.4 Features A sticky card */
function UserMsg() {
  return (
    <div className="ak-user">
      <img src="/assets/D3TQ38q4HpOxmxHoD1u1AW40NI.png" alt="" className="so-avatar" />
      <div className="ak-user-b"><p className="pa-tiempos rv-t18">Build a returns journey from this SOP.</p></div>
    </div>
  )
}
/* Journey card entrances — live __framer__appearAnimationsContent, replayed on every sticky variant switch
   (FeaturesA remounts via key={v}; live mounts each variant's subtree on switch, not on in-view).
   Variant 0 has no appear animation on live (static on remount). All appear tweens start at opacity 0.001. */
const AK_LIST = 'cubic-bezier(0.44, 0, 0, 0.94)' // options list: y -150, 1.1s delay, 0.6s
const AK_TAG = 'cubic-bezier(0.98, -0.04, 0, 0.79)' // tag x 150 (0.8s/0.4s); plan rows + Accept y 100
const AK_BARS = 'cubic-bezier(0.44, 0, 0, 0.78)' // plan wrapper y 370, 0.4s delay, 0.4s
const AK_SPRING = 'var(--ak-spring)' // Framer spring {duration 1, bounce 0.2}; linear() + bezier fallback in product-a.css
const PLAN_ROWS = [['Warranty coverage scope policy', 0.5, 0.4], ['Helpdesk routing tag', 0.6, 0.6], ['Warranty portal URL + support email', 0.8, 0.8], ['Loyalty tier check', 1.0, 0.4]]
function AskCard({ variant }) {
  return (
    <div className="ak-card">
      {variant === 0 && (
        <>
          <div className="ak-files">
            {[['Transcript from meeting', 'wave'], ['Returns SOP.pdf', 'pdf'], ['yourbrand.com/bundle', 'link']].map(([l, k]) => (
              <div key={l} className="ak-file">
                <div className="ak-file-tile">
                  {k === 'wave' && <span className="ak-wave">{[6, 14, 22, 10, 18, 8, 16, 6].map((h, i) => <i key={i} style={{ height: h }} />)}</span>}
                  {k === 'pdf' && <span className="ak-pdf"><em>Confirm order is within the 30-day window</em><em>Offer exchange or refund</em><em>Send prepaid label · log reason</em></span>}
                  {k === 'link' && <Fa code={0xf0c1} size={20} />}
                </div>
                <p className="pa-tiempos ak-file-l">{l}</p>
              </div>
            ))}
          </div>
          <UserMsg />
        </>
      )}
      {variant === 1 && (
        <>
          <div className="ak-stack">
            {['BFCM prep call transcript', 'Used 4 times this month', 'Verified and live'].map((l) => <span key={l} className="ak-stack-item pa-tiempos so-t12">{l}</span>)}
          </div>
          <UserMsg />
          {/* live: Siena reply block fades in from opacity 0 / y +80 on the {1, 0.2} spring, ~0.5s after the switch */}
          <Appear from={0} y={80} dur={1} delay={0.5} ease={AK_SPRING} className="ak-siena">
            <p className="ak-meta">Read 4 pages • 1 Question</p>
            <div className="flex items-start gap-[8px]">
              <GradBorder r={16} w={1} className="flex-1" innerClassName="p-[12px]">
                <p className="pa-tiempos rv-t14t">Got it. Step 3 references "priority customers". Should I route orders over $150, or only l…</p>
              </GradBorder>
              <img src="/assets/14aPLwywC9q4flBvXM0s1rLqA8.png" alt="" className="h-[32px] w-[32px] flex-none rounded-full" />
            </div>
            <Appear y={-150} dur={0.6} delay={1.1} ease={AK_LIST} className="ak-options">
              {['Orders over $150', 'Loyalty tier only', 'Something else…'].map((o, i) => (
                <span key={o} className="ak-option">
                  {i < 2 ? <b>{i + 1}</b> : <Appear as="b" x={150} dur={0.4} delay={0.8} ease={AK_TAG}><Fa code={0xf303} size={10} /></Appear>}
                  <span className="pa-tiempos so-t12">{o}</span>
                </span>
              ))}
            </Appear>
          </Appear>
        </>
      )}
      {variant === 2 && (
        <Appear y={370} dur={0.4} delay={0.4} ease={AK_BARS} className="ak-plan">
          <p className="pa-tiempos so-t12">Create the journey?</p>
          <div className="ak-plan-card">
            <p className="ak-meta">in review • warranty</p>
            {PLAN_ROWS.map(([r, d, dur], i) => (
              <Appear key={r} y={100} dur={dur} delay={d} ease={AK_TAG} className="ak-plan-row"><b>{i + 1}</b><span className="pa-tiempos so-t12">{r}</span></Appear>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="pa-tiempos so-t12">Create the journey?</span>
            <Appear as="span" y={100} dur={0.4} delay={1.3} ease={AK_TAG} className="ak-accept">Accept <Fa code={0xf00c} size={10} color="#FFFFFF" /></Appear>
          </div>
        </Appear>
      )}
    </div>
  )
}
const BUILD = [
  ['Describe the work. Ask Siena does it.', "An SOP, a transcript, a URL: whatever you've got. Ask Siena reads it and builds the agent, right in the same conversation.", true],
  ['Work through it together', 'Siena asks what it needs to know, confirms the edge cases, and shapes the plan with you before anything actually gets built.'],
  ['Review and ship', "Review what's ready to go, whether it's a journey, a policy, or a doc, then deploy it right in the same conversation."],
]
export function FeaturesA() {
  const ref = useRef(null)
  const [v, setV] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const y = -el.getBoundingClientRect().top // section-relative offset at viewport top
      // markers [mid] / [end] at section offsets 1103 / 2059 reach the viewport top
      setV(y >= 2059 ? 2 : y >= 1103 ? 1 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <section ref={ref} id="build" className="aa-section">
      <SectionTitle title="Your partner in building agents" h2Max={720} sub="Ask Siena reads the context, knows how to build the agent, and does it so your team skips the learning curve. Bring the idea, it brings the skill." subOpacity={false} subMax={680} />
      <div className="aa-scroll">
        <div className="aa-content">
          {BUILD.map(([t, d, btn], i) => (
            <div key={t} className="aa-block">
              <div className="aa-mobile-card"><AskCard variant={i} /></div>
              <h3 className="pa-h3">{t}</h3>
              <p className="pa-sub">{d}</p>
              {btn && <BookDemoButton />}
            </div>
          ))}
        </div>
        <div className="aa-sticky"><AskCard key={v} variant={v} /></div>
      </div>
      <div className="aa-bento">
        {[[0xe237, 'One agent, every artifact', 'Creates the policy, doc, or whatever the job needs.'], [0xf075, 'Grounded in your data', 'Built from conversations, order history, Shopify, and more.'], [0xf336, 'Tested before it ships', 'Gets stress-tested against real scenarios before it ships.']].map(([c, t, d]) => (
          <div key={t} className="aa-bento-col"><Fa code={c} /><h5 className="pa-h5">{t}</h5><p className="aa-t16">{d}</p></div>
        ))}
      </div>
    </section>
  )
}

/* §6.5 Features B */
function SkillCard({ title, text, tag, active, className = '' }) {
  return (
    <div className={`ab-skill ${className}`}>
      <div className="ab-skill-in">
        <h6 className="pa-tiempos rv-t18">{title}</h6>
        <p className="pa-tiempos so-t12">{text}</p>
        <span className={`ab-tag ${active ? 'is-active' : ''}`}>{tag}{active && <span className="ab-tag-dot" />}</span>
      </div>
    </div>
  )
}
export function FeaturesB() {
  return (
    <section className="ab-section">
      <div className="ea-fade ea-fade--top" aria-hidden="true" />
      <div className="ea-fade ea-fade--bottom" aria-hidden="true" />
      <div className="ab-row">
        <div className="ab-visual ab-visual--skills">
          <Appear on="view" y={100} dur={1} delay={0.14} ease={EASE_OUT} className="ab-navcard">
            <span className="ab-icon"><Fa code={0xf46c} size={20} /></span>
            <span className="pa-tiempos rv-t18">Coaching evidence</span>
            <span className="ml-auto pa-tiempos so-t12">Enable as skill</span>
          </Appear>
          <Appear on="view" x={-60} y={100} dur={1} delay={0.44} ease={EASE_OUT} className="ab-pos ab-pos--l"><SkillCard title="Volume Analyst" text="Breaks down support volume by topic and channel" tag="Built in" /></Appear>
          <Appear on="view" x={60} y={100} dur={1} delay={0.44} ease={EASE_OUT} className="ab-pos ab-pos--r"><SkillCard title="Opportunity Assessment" text="Ranks where to expand coverage and quality" tag="Built in" /></Appear>
          <Appear on="view" y={100} dur={1} delay={0.61} ease={EASE_OUT} className="ab-pos ab-pos--c"><SkillCard title="Journey Builder" text="Turns an SOP into a working journey" tag="Active" active /></Appear>
        </div>
        <div className="ab-text">
          <Eyebrow>Skills library</Eyebrow>
          <h3 className="pa-h3">Each skill is a specialist</h3>
          <p className="pa-sub">Siena ships a library of skills ready on day one, or build your own.</p>
          <StarBullets textColor="#122023" items={['Same job, same result every time', 'Ask Siena reads your question and picks the right skill', 'Turn any recurring process into a skill']} />
        </div>
      </div>
      <div className="ab-row ab-row--2">
        <div className="ab-text">
          <Eyebrow>The admin work, handled</Eyebrow>
          <h3 className="pa-h3">Ask Siena runs your workspace</h3>
          <p className="pa-sub">Every policy, doc, and task usually lives in a different tool. Siena keeps them all current from one conversation.</p>
          <StarBullets items={['Docs created and updated: policies, playbooks, brand guidelines', 'Planner tasks managed without switching tools', 'One conversation updates your entire Siena workspace']} />
        </div>
        <div className="ab-visual ab-visual--ws">
          <span className="ab-dots"><i /><i /><i /></span>
          <img src="/assets/QHZQBNQlSL00uTxYcQKOePAWdT0.webp" alt="" className="ab-illus" />
          <p className="ab-label">Docs</p>
          <Appear on="view" y={100} dur={1} delay={0.44} ease={EASE_OUT} className="ab-list">
            {['Return handling policy', 'Social Media DM & Comments policy'].map((d) => (
              <div key={d} className="ab-doc"><span className="ab-icon"><Fa code={0xf46c} size={20} /></span><span className="pa-tiempos rv-t18">{d}</span></div>
            ))}
          </Appear>
          <p className="ab-label">Planner</p>
          <Appear on="view" y={100} dur={1} delay={0.02} ease={EASE_OUT} className="ab-list">
            <div className="ab-doc"><Fa code={0xf14a} size={20} /><span className="pa-tiempos rv-t18"><s>Set up QA evals for return handling</s></span><span className="ab-who">matthew</span></div>
            <div className="ab-doc"><Fa code={0xf0c8} size={20} /><span className="pa-tiempos rv-t18">Review bundle discount skill coverage</span></div>
          </Appear>
        </div>
      </div>
    </section>
  )
}

/* §6.6 Key capabilities */
export function KeyCapabilities({ children }) {
  return (
    <section id="cx-intelligence" className="ac-section">
      <div className="ac-container">
        <SectionTitle eyebrow="Customer intelligence" title="Your partner in understanding customers" h2Max={680} />
        <span id="cx-insights" className="ac-marker" aria-hidden="true" />
        <div className="ac-row">
          <div className="ac-text">
            <h3 className="pa-h3">From signal to decision</h3>
            <p className="pa-sub">Customer intelligence turns what your customers are already telling you into a decision you can make today.</p>
            <StarBullets items={['Signals surface the same day they emerge, ready to act on', 'Every insight is backed by the real conversations behind it', 'Teams move from noticing to deciding in the same sitting']} />
          </div>
          <div className="ac-visual">
            {["What's trending well this week?", 'What do customers love about our products?', "What's driving repeat orders?"].map((q, i) => (
              <Appear key={q} on="view" y={80} dur={1} delay={[0.31, 0.5, 0.82][i]} ease={SPRING} className="ac-q">
                <p className="pa-tiempos rv-t18">{q}</p>
              </Appear>
            ))}
            <GradBorder r={28} className="ac-ask" innerClassName="ac-ask-in" innerStyle={{ borderRadius: 26 }}>
              <SienaIcon size={24} />
              <span className="pa-fd">Ask Siena</span>
            </GradBorder>
          </div>
        </div>
        <div className="ac-tiles">
          <div className="ac-tile">
            <div className="ac-tile-vis">
              {[['Size-inclusive demand', '↑67%', -8], ['Material quality complaints', '↑34%', 0], ['Shipping delays', '↑18%', 8]].map(([t, n, r]) => (
                <span key={t} className="ac-mini" style={{ transform: `rotate(${r}deg)` }}><span className="pa-tiempos ac-t9">{t}</span><b className="pa-fd">{n}</b></span>
              ))}
            </div>
            <p className="pa-fd ac-cap">Trending topics and demand signals, yours to see directly</p>
          </div>
          <div className="ac-tile">
            <div className="ac-tile-vis">
              <span className="th-chip !static"><span className="th-chip-row"><span className="pa-tiempos so-t12">Packaging complaints</span><img src="/svg/topics-explorer-Vector-img-0456f.svg" alt="" className="h-[24px] w-[24px]" /></span></span>
            </div>
            <p className="pa-fd ac-cap">Product signals and demand patterns, backed by conversations</p>
          </div>
          <div className="ac-tile">
            <div className="ac-tile-vis ac-icons">
              <Fa code={0xf0e0} size={40} color="#71797B" />
              <img src="/svg/qa-agent-slack-logo-54b46.svg" alt="" style={{ filter: 'grayscale(1)', opacity: 0.6 }} />
              <Fa code={0xf0c5} size={40} color="#71797B" />
            </div>
            <p className="pa-fd ac-cap">Share intelligence to Slack or email</p>
          </div>
        </div>
        {children}
      </div>
    </section>
  )
}

/* §6.7 Playbooks — crossfade carousel (opacity 1->0 ≈130ms, swap, 0->1 ≈130ms) */
const PB = [
  [[0xf201, 'Executive Report', "An overview of Siena's month over month performance across key metrics.", 'c'], [0xf0d1, 'Shipping Report', 'Give logistics and CX leadership a data-backed view of which carriers are performing.', 's'], [0xf02b, 'Testimonial Finder', 'Source testimonials and positive product feedback from your conversations and reviews.', 'p']],
  [[0xf4d7, 'Journey Review', 'Optimize your Journeys performance with actionable quality insights.', 'c'], [0xf466, 'Product & Issue Intelligence', 'Fast view of which products are causing the most support issues for any team.', 's'], [0xf201, 'Quality Score', 'Track quality scores across all customer interactions over time.', 'p']],
  [[0xf0e2, 'Returns Driver', 'Evidence-based breakdown of what is driving returns across your product catalog.', 'c'], [0xf073, 'Weekly Evals', 'Actionable weekly report giving stakeholders immediate visibility into CX quality.', 's'], [0xf3ff, 'Support Effort', 'Actionable ranking of products that drive support load, with attention to high-cost items.', 'p']],
  [[0xf004, 'Delight', 'Standout customer moments that show exceeded expectations and brand loyalty.', 'c'], [0xf466, 'Product & Issue Intelligence', 'Fast view of which products are causing the most support issues for any team.', 's'], [0xf013, 'Automation Quality Review', 'Optimize your Siena Automation performance with actionable quality insights.', 'p']],
]
const LOGOS = { c: ['/svg/ask-siena-Logos-12-cbb2f.svg', 82, 'Comfrt'], s: ['/svg/shopping-agent-Logos-5-d4b67.svg', 56, 'Simple Modern'], p: ['/svg/ask-siena-Logos-6-20e5a.svg', 63, 'Prose'] }
export function Playbooks() {
  const [page, setPage] = useState(0)
  const [visible, setVisible] = useState(true)
  const busy = useRef(false)
  const go = (d) => {
    if (busy.current) return
    busy.current = true
    setVisible(false)
    setTimeout(() => {
      setPage((p) => (p + d + PB.length) % PB.length)
      setVisible(true)
      setTimeout(() => (busy.current = false), 130)
    }, 130)
  }
  return (
    <section className="ap-section">
      <img src="/assets/MSTluKQSUNZrlxr6ESQPZTnooU.webp" alt="" aria-hidden="true" className="ap-blob" />
      <div className="ea-fade ea-fade--top" aria-hidden="true" />
      <div className="ap-fade-in" aria-hidden="true" />
      <SectionTitle align="left" maxW={1062} eyebrow="Playbooks" title="From hours of prep to a quick read" sub="Your recurring reports: built, scheduled, and delivered to your inboxes and Slack channels, by Ask Siena." subOpacity={false} subMax={564} className="relative z-[1]" />
      <div className="ap-gallery">
        <div className="ap-cards" style={{ opacity: visible ? 1 : 0 }}>
          {PB[page].map(([c, t, d, l]) => (
            <div key={t + l} className="ap-card">
              <Fa code={c} size={20} />
              <h6 className="pa-h6">{t}</h6>
              <p className="rv-t16">{d}</p>
              <span className="ap-div" />
              <img src={LOGOS[l][0]} alt={LOGOS[l][2]} style={{ width: LOGOS[l][1], height: 20 }} />
            </div>
          ))}
        </div>
        <div className="ap-controls">
          <CarouselButton direction="prev" onClick={() => go(-1)} />
          <p className="ap-counter">{page + 1}<span className="opacity-40"> / {PB.length}</span></p>
          <CarouselButton direction="next" onClick={() => go(1)} />
        </div>
      </div>
    </section>
  )
}

/* §6.8 Slack */
export function SlackSection() {
  return (
    <section className="as-section">
      <img src="/assets/MSTluKQSUNZrlxr6ESQPZTnooU.webp" alt="" aria-hidden="true" className="ea-blob as-blob" />
      <SectionTitle className="relative z-[1]" eyebrow="Where your team already is" title="Ask Siena lives in Slack" sub="Answers, insights, and scheduled briefs: all in Slack, where your team already works." subOpacity={false} subMax={564} />
      <div className="as-mock">
        <div className="as-side">
          {[[0xf015, 'Home'], [0xf086, 'DMs'], [0xf0f3, 'Activity'], [0xf02e, 'Later'], [0xf141, 'Options']].map(([c, l], i) => (
            <span key={l} className={`as-nav ${i === 0 ? 'is-active' : ''}`}><Fa code={c} size={16} color="#FFFFFF" /><span>{l}</span></span>
          ))}
          <span className="as-plus">+</span>
          <img src="/assets/SvwqUnk1l16pFvaL0JTEzDLyBY.webp" alt="" className="as-me" />
        </div>
        <span className="as-slack"><img src="/svg/qa-agent-slack-logo-54b46.svg" alt="Slack" /></span>
        <div className="as-thread">
          <div className="as-user"><img src="/assets/D3TQ38q4HpOxmxHoD1u1AW40NI.png" alt="" className="so-avatar" /><p className="pa-tiempos rv-t14t"><strong>@AskSiena</strong> what were our top escalations last week?</p></div>
          <Appear on="view" y={80} dur={1} delay={0.23} ease={SPRING} className="as-reply">
            <div className="flex items-start justify-between gap-[12px]">
              <p className="pa-tiempos rv-t14t">Top drivers last week across <strong>1,847 conversations:</strong></p>
              <img src="/svg/shopping-agent-Icon-Black-d8122.svg" alt="" className="h-[24px] w-[24px]" />
            </div>
            <Appear on="view" y={80} dur={0.6} ease={EASE_OUT} className="as-table">
              <p className="pa-tiempos so-t12">Customers requests during BFCM peak (Nov 16 - Dec 7, 2025)</p>
              <div className="as-row as-row--h"><span>Category</span><span>Volume</span><span>Momentum</span></div>
              {[['① Shipping delays', '34%', '↑12%'], ['② Return policy confusion', '21%', 'New'], ['③ Out-of-stock', '18%', 'Seasonal']].map((r, i) => (
                <Appear key={r[0]} on="view" from={0.001} y={100} dur={[0.4, 0.6, 0.8][i]} delay={[0.5, 0.6, 0.8][i]} ease="cubic-bezier(0.98,-0.04,0,0.79)" className="as-row">
                  {r.map((c) => <span key={c} className="pa-tiempos so-t12">{c}</span>)}
                </Appear>
              ))}
              <p className="pa-tiempos so-t12">Want me to build a journey that addresses ① and ②?</p>
            </Appear>
          </Appear>
        </div>
      </div>
      <div className="as-caps">
        {['@AskSiena in any channel: answers, quotes, and analysis in minutes.', 'Your team can now instantly access answers on their own.', 'Scheduled playbooks, delivered where your team can act on them.'].map((c) => (
          <p key={c} className="pa-tiempos as-cap">{c}</p>
        ))}
      </div>
      <span className="as-fade" />
    </section>
  )
}

export { H2 }
