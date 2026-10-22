import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Appear, BookDemoButton, Bullets, CtaB, Eyebrow, Fa, H2, Motion, Reveal, SPRING } from '../components/product-b/shared.jsx'
import { BrowserFrame, DocCard, StatusChip, StatusIcon, UsageChart } from '../components/product-b/DocsAtoms.jsx'
import TestimonialSlider from '../components/product-b/TestimonialSlider.jsx'
import Faq from '../components/product-b/Faq.jsx'
import { TESTIMONIALS } from '../components/testimonials/data.js'
import { siteHref } from '../routes.js'

// specs/product-b.md §4 /products/docs (mockups built from recon/pages-b/products_docs-1440-dump.txt)

// §4.1 tilted cards: [props, left, top, rotate, from offset]
const HERO_CARDS = [
  [{ title: 'Refund & Returns Policy', label: 'Policy Document', excerpt: 'Refunds are processed within 3–5 business days. Requests must be made within 30 days of purchase.' }, -128, -16, 12, { x: 60, y: 100 }],
  [{ title: 'Brand Voice Playbook', label: 'internal playbook', excerpt: 'Lead with the solution. Offer the refund and the exchange together in one reply.' }, 176, 8, 15, { x: 0, y: 60 }],
  [{ title: 'Mail', icon: 0xf0e0, pending: true, excerpt: 'Hi, I ordered the Signature Hoodie last week and the grey looks much darker in person than online. Can I exchange it for the heather, or get a refund?' }, 440, 8, -10, { x: -100, y: 50 }],
  [{ title: 'Sizing & Fit Guide', label: 'data table (size/SKU)', excerpt: 'S / M / L / XL — chest 38–46". Heather Grey, Black, Forest. Restock ETA: Aug 14.' }, 16, 85, -13, { x: 100, y: 50 }],
  [{ title: 'Customer Conversations', pending: true, chat: true }, -143, 249, -23, { x: -110, y: -70 }],
  [{ title: 'Shopify', image: true }, 439, 255, -10, { x: 70, y: -50 }],
]

function MiniChat() {
  return (
    <div className="dh-chat">
      <div className="pb-grad dh-chat-customer">
        <div className="dh-chat-customer-in">The color of this hoodie is not what I expected, am I eligible for a refund?</div>
      </div>
      <Reveal delay={1.0} className="dh-chat-siena-wrap">
        <div className="pb-grad dh-chat-siena">
          <div className="dh-chat-siena-in">
            Hi there! Since your order shipped 12 days ago, you&apos;re within our 30-day window. I can refund you now, or send a free label to swap for a different color.
          </div>
        </div>
        <img className="dh-chat-brand" src="/assets/14aPLwywC9q4flBvXM0s1rLqA8.png" alt="" />
      </Reveal>
    </div>
  )
}

const NAV_ITEMS = ['Internal Ops', 'Skills', 'Agent Persona', 'Color & Sizing']

function HeroFrame() {
  return (
    <BrowserFrame url="help.brand.com" className="dh-frame">
      <div className="dh-vdiv" style={{ left: 193 }} />
      <div className="dh-vdiv" style={{ left: 442 }} />
      <div className="dh-nav">
        <div className="dh-nav-head">
          <Fa code={0xf518} size={12} />
          <span className="dh-nav-docs">Docs</span>
        </div>
        <p className="dh-nav-item">Getting Started</p>
        <i className="dh-nav-line" />
        <p className="dh-nav-item">Returns and Shipping</p>
        {['Shopify refund policy', 'Exchange process', 'Damaged items'].map((t) => (
          <p key={t} className="dh-nav-sub">
            <Fa code={0xf15b} size={10} className="dh-nav-sub-icon" />
            {t}
          </p>
        ))}
        {NAV_ITEMS.map((t) => (
          <div key={t} className="contents">
            <i className="dh-nav-line" />
            <p className="dh-nav-item">{t}</p>
          </div>
        ))}
      </div>
      <div className="dh-doc">
        <p className="dc-title">Refund &amp; Returns Policy</p>
        <div className="dh-doc-body">
          <p>Customers can request a refund within 30 days of purchase. Refunds are processed within 3–5 business days of the returned item arriving at our warehouse.</p>
          <p>Items must be unworn, unwashed, and in original packaging. Final-sale and</p>
          <p>
            <em>personalized items are not eligible.</em>
          </p>
        </div>
        <div className="dh-doc-foot">
          <StatusChip className="dc-chip--plain" />
          <span className="dc-label">Updated: 2 days ago</span>
        </div>
      </div>
      <Reveal delay={0.6} className="dh-usage">
        <UsageChart />
      </Reveal>
    </BrowserFrame>
  )
}

function HeroVisual() {
  return (
    <div className="dh-visual">
      <div className="dh-docs">
        {HERO_CARDS.map(([p, left, top, rot, off]) => (
          <Motion
            key={p.title}
            className="dh-card-pos"
            style={{ left, top }}
            from={{ opacity: 0, ...off }}
            base={`rotate(${rot}deg)`}
            transition={SPRING(0.6)}
          >
            <DocCard title={p.title} label={p.label} excerpt={p.excerpt} pending={p.pending} icon={p.icon}>
              {p.image ? <img className="dh-shopify" src="/assets/FAzsjFZlToamfvdG2lqN8QZVkA.webp" alt="" /> : p.chat ? <MiniChat /> : undefined}
            </DocCard>
          </Motion>
        ))}
        <Motion trigger="load" className="dh-frame-pos" from={{ opacity: 0.001 }} transition={{ duration: 0.4, delay: 0.4, ease: [0.94, -0.05, 0, 1] }}>
          <HeroFrame />
        </Motion>
      </div>
    </div>
  )
}

// §4.2 doc-card ticker (moves LEFT 30px/s)
const TICKER = [
  ['Refunds & Exchanges', 'Send a prepaid label for color swaps. Do not charge restocking for an exchange.', false],
  ['Tone of Voice', 'Warm, direct and human. Never blame the customer, always offer the next step.', false],
  ['Brand Policies', 'Refunds are processed within 3–5 business days. Requests must be made within 30 days of purchase.', false],
  ['Color & Sizing', 'Heather tones may appear lighter in product photos. Free color exchanges within the return window.', true],
]
function DocTicker() {
  const listRef = useRef(null)
  const [dur, setDur] = useState(0)
  useLayoutEffect(() => {
    const el = listRef.current
    const m = () => setDur(el.getBoundingClientRect().width / 30)
    m()
    const ro = new ResizeObserver(m)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const items = (k) =>
    [...TICKER, ...TICKER, ...TICKER].map(([t, e, p], i) => (
      <div key={`${k}${i}`} className="dt-card">
        <div className="dt-inner">
          <p className="dc-title">{t}</p>
          <div className="dt-graphic">
            <p className="dc-excerpt dt-excerpt">{e}</p>
          </div>
          <StatusChip pending={p} className="dt-chip" />
        </div>
      </div>
    ))
  return (
    <div className="dt-row">
      <div className="ticker-track ticker-track--left pb-ticker-track dt-track" style={dur ? { animationDuration: `${dur}s` } : { animationPlayState: 'paused' }}>
        <div ref={listRef} className="dt-list">{items('a')}</div>
        <div className="dt-list" aria-hidden="true">{items('b')}</div>
      </div>
      <span className="dt-fade dt-fade--l" />
      <span className="dt-fade dt-fade--r" />
    </div>
  )
}

function DiffCard({ title, delay }) {
  return (
    <Reveal y={80} delay={delay} className="dd-card">
      <div className="dd-inner">
        <p className="dc-title">{title}</p>
        <div className="dd-panes">
          <p className="dd-pane dd-old">…within 30 days of the original purchase…</p>
          <p className="dd-pane dd-new">
            …within <strong>60 days</strong> of the original purchase…
          </p>
        </div>
        <div className="dd-actions">
          <span className="dc-chip dd-accept">
            Accept <StatusIcon />
          </span>
          <span className="dd-reject">✕</span>
        </div>
      </div>
    </Reveal>
  )
}

const MINI = [
  ['Return Policy', 0.4, -8],
  ['Refund Timeline', 0.8, -3],
  ['Exchange Process', 1.2, 14],
]

const FAQ = [
  ['How is Siena Docs different from a standard help center tool?', 'A standard help center is built for customers to read. Siena Docs serves your customers, your internal team, and your agent from one system. Creating and maintaining content is fully agentic: Ask Siena imports from any live URL, proposes targeted edits as diffs you accept or reject, and runs as a skill inside any workflow. Every page connects directly to your Siena agent. What your team writes is what your agent knows.'],
  ['Can we bring in content from a live website or existing documentation?', 'Yes. Give Ask Siena any live URL and it fetches the page, drafts a full structured article, and proposes it for review. Works for product pages, existing help content, or any public source you want to bring into your knowledge base.'],
  ['Why not use Claude Code and GitHub for our knowledge base?', "Siena Docs is built for the teams and AI that run a consumer brand: support, CX, product, and operations. Your public help center, your internal playbooks, and your agent's behavior all live and update in one place. No technical setup required. And if you already work out of Claude or another AI tool, the Siena MCP connects your entire knowledge base to it so you can search, edit, and publish pages without switching tools."],
  ['Do we still need Notion, Guru, or Google Docs?', "Most teams that move their knowledge into Siena Docs stop needing the others. Your public help center, your internal wiki, and your agent's knowledge source all live in one place, updated together. The tools you were using before were not talking to each other or to your agent. Siena Docs is the one system that does all three."],
  ['Is Siena Docs included in my Siena plan?', 'Yes. Siena Docs is part of your Siena plan at no extra cost. Every page you write feeds directly into Siena Intelligence, so the more knowledge you put in, the smarter your whole operation gets.'],
]

const BEFORE = ['Manual article writing, hours per piece', 'Duplicate articles accumulate over time', 'Agents give inconsistent answers from contradictory sources', 'Internal notes leak into customer-facing content', 'Separate tools for knowledge management and your agent']
const WITH = ['Any source → structured article in under a minute', 'Every new page checked for duplicates automatically', 'One source of truth, consistent answers every time', 'Internal content stays internal, automatically', 'One system: knowledge base, help center, and agent knowledge source']

// §4.6 single static slide: Cate Marques quote is already in testimonials/data.js
const CATE = TESTIMONIALS.find((t) => t.name === 'Cate Marques')
const DOCS_SLIDE = [{ ...CATE, href: siteHref('/customer-stories/terra-kaffe') }]

const SUB = 'Traditional knowledge tools were built for humans to read and agents to ignore. Siena Docs serves both, from one living system.'

export default function Docs() {
  useEffect(() => {
    document.title = 'Siena Docs | Siena AI'
  }, [])
  return (
    <div className="pb-page pb-docs">
      {/* §4.1 Hero */}
      <section className="dh-hero">
        <div className="dh-header">
          <div className="dh-copy">
            <div className="dh-copy-text">
              <div className="dh-h1-wrap">
                <Appear as="h1" delay={0.2} className="pb-h1 text-center">The OS for your brand&apos;s knowledge</Appear>
                <Appear delay={0.5} className="dh-underline-wrap">
                  <Motion trigger="load" from={{ opacity: 0.001, x: 150 }} transition={{ duration: 0.4, delay: 0.8, ease: [0.98, -0.04, 0, 0.79] }} className="dh-underline">
                    <img src="/assets/MJbk4aQblPanJHyFV9X8Yg7JDqI.png" alt="" />
                  </Motion>
                </Appear>
              </div>
              <Appear as="p" delay={0.3} className="pb-hero-sub text-center">
                Siena Docs is one home for everything your team knows. Every page you have makes your whole operation smarter.
              </Appear>
            </div>
            <Appear delay={0.4}>
              <BookDemoButton />
            </Appear>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* §4.2 One home — mirrored static ScrollArea row */}
      <section className="do-section">
        <div className="do-visual">
          <BrowserFrame bg={0.6} className="do-frame" blob>
            <DocTicker />
            <p className="do-footer">● 118 verified · 7 in review</p>
          </BrowserFrame>
        </div>
        <div className="do-text">
          <div className="do-head">
            <Eyebrow>Knowledge foundation</Eyebrow>
            <H2>One home for everything your team knows.</H2>
            <p className="pb-sans20">
              A clean structure for every workflow, playbook, and policy your team runs on. Keep it internal, or publish a branded help center on your own subdomain.
            </p>
          </div>
          <Bullets items={['Internal wiki and public help center in one place', 'Every page has an owner and a review cycle', 'Native analytics across every page and space']} />
        </div>
      </section>

      {/* §4.3 Change it once */}
      <section className="dcc-section">
        <div className="dcc-fade" aria-hidden="true" />
        <img className="dcc-bg" src="/assets/MSTluKQSUNZrlxr6ESQPZTnooU.webp" alt="" />
        <div className="dcc-row">
          <div className="dcc-title">
            <Eyebrow>Your criteria. Scored always in sync</Eyebrow>
            <H2>Change it once. Your whole operation moves with it.</H2>
            <p className="pb-sans20">
              Tell Siena what changed and every page that mentions it updates together. Your public help center, your internal docs, and what your agent tells customers all stay current from one conversation.
            </p>
          </div>
          <div className="dcc-gallery">
            <img className="dcc-person" src="/assets/ujOHLlJqjEXaFjDhOJLSpAYzU.webp" alt="" />
            <Reveal y={80} delay={0.5} className="dcc-request-pos">
              <div className="dcc-request">
                <div className="dcc-request-in">
                  <p className="dcc-quote">&quot;We&apos;re extending returns from 30 to 60 days for the holidays. Update everywhere.&quot;</p>
                  <div className="dcc-request-row">
                    <span className="dcc-pill">3 docs found</span>
                    <span className="dcc-diffs">Diffs proposed:</span>
                  </div>
                </div>
              </div>
            </Reveal>
            <div className="dcc-diff-row">
              <DiffCard title="Returns Policy" delay={0.6} />
              <DiffCard title="Returns SOP" delay={0.8} />
              <DiffCard title="Returns Journey" delay={1.0} />
            </div>
          </div>
        </div>
      </section>

      {/* §4.4 Bento */}
      <section className="db-section">
        <div className="db-title">
          <Eyebrow className="text-center">What changes</Eyebrow>
          <H2 className="text-center db-h2">Built for the way modern brands actually work.</H2>
          <p className="pb-sans20 db-sub">{SUB}</p>
        </div>
        <div className="db-bento">
          <div className="db-row db-row--1">
            <div className="db-card db-card--a">
              <div className="db-text">
                <h4 className="db-h4">Ask Siena inside Docs</h4>
                <p className="db-desc">Draft, edit, and maintain any page agentically, without leaving your knowledge base.</p>
              </div>
              <BrowserFrame bg={0.3} className="db-ask" blob>
                <div className="db-minis">
                  {MINI.map(([t, d, r]) => (
                    <Reveal key={t} delay={d} base={`rotate(${r}deg)`} className="db-mini">
                      <p className="db-mini-title">{t}</p>
                      <p className="db-mini-ex">Customers can request a refund within 30 days.</p>
                    </Reveal>
                  ))}
                </div>
                <div className="db-prompt-panel">
                  <Reveal delay={1.0} className="pb-grad db-prompt">
                    <div className="db-prompt-in">
                      <img src="/svg/docs-siena-icon-black.svg" alt="" width="25" height="25" />
                      <span>What changed in our return policy this month</span>
                    </div>
                  </Reveal>
                  <div className="db-prompt-row">
                    <span>
                      <span className="db-updating">Updating:</span> <span className="db-count">3 Docs</span>
                    </span>
                    <span className="dc-chip">
                      Approve 3 Updates <StatusIcon />
                    </span>
                  </div>
                </div>
              </BrowserFrame>
            </div>
            <div className="db-card db-card--b">
              <div className="db-text">
                <h4 className="db-h4">Analytics</h4>
                <p className="db-desc db-desc--narrow">Know exactly which knowledge drives your agent&apos;s answers and which goes unused.</p>
              </div>
              <div className="db-analytics">
                <Reveal delay={0.6}>
                  <DocCard title="Brand Policies" excerpt="Refunds are processed within 3–5 business days. Requests must be made within 30 days of purchase." className="db-policies" />
                </Reveal>
                <span className="db-dot">•</span>
                <Reveal delay={0.6}>
                  <UsageChart className="db-chart" />
                </Reveal>
              </div>
            </div>
          </div>
          <div className="db-row db-row--2">
            <div className="db-card db-card--c">
              <div className="db-text db-text--left">
                <h4 className="db-h4">MCP Connection</h4>
                <p className="db-desc">Your knowledge base follows your team wherever they work.</p>
              </div>
              <div className="db-tile">
                <img src="/svg/docs-mcp-paperclip.svg" alt="" width="70" height="78" />
              </div>
            </div>
            <div className="db-card db-card--c">
              <div className="db-text db-text--left db-text--skills">
                <h4 className="db-h4">Skills</h4>
                <p className="db-desc">The same page your team reads becomes the playbook your agent runs.</p>
              </div>
              <div className="db-tile db-tile--skills">
                {['Return Policy', 'Refund Timeline'].map((t, i) => (
                  <div key={t} className="db-skill-mini" style={{ transform: `rotate(${i ? 8 : -8}deg)` }}>
                    {t}
                  </div>
                ))}
                <div className="db-skill-main">
                  <p className="db-skill-title">Process a Return</p>
                  <ol>
                    <li>Confirm order is within the 30-day window</li>
                    <li>Offer exchange or refund</li>
                    <li>Send prepaid label · log reason</li>
                  </ol>
                  <p>Used 4 times this month</p>
                  <p>Verified and live</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* §4.5 Before / With Siena */}
      <section className="dbw-section">
        <div className="dbw-fade" aria-hidden="true" />
        <div className="db-title">
          <H2 className="text-center db-h2">Your knowledge base, finally built for your agent.</H2>
          <p className="pb-sans20 db-sub">{SUB}</p>
        </div>
        <div className="dbw-cards">
          {[
            ['Before', 0xf00d, BEFORE],
            ['With Siena', 0xf890, WITH],
          ].map(([h, icon, rows]) => (
            <div key={h} className="dbw-card">
              <h3 className="dbw-h3">{h}</h3>
              <ul className="dbw-list">
                {rows.map((r) => (
                  <li key={r} className="dbw-row">
                    <Fa code={icon} size={24} />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* §4.6 Testimonial (single, static, no controls) */}
      <section className="dtm-section">
        <TestimonialSlider slides={DOCS_SLIDE} controls={false} className="pb-tm--docs" />
      </section>

      {/* §4.7 FAQ */}
      <Faq items={FAQ} className="docs-faq" />

      {/* §4.8 CTA */}
      <CtaB fade={{ height: 153, background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(250,247,241,0) 100%)' }} />
    </div>
  )
}
