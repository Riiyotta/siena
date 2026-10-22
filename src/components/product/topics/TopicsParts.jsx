// specs/product-a.md §5 — /topics-explorer sections.
import { useEffect, useRef, useState } from 'react'
import BookDemoButton from '../../cta/BookDemoButton.jsx'
import { Appear, SPRING, prefersReducedMotion, useInView } from '../motion.jsx'
import { Eyebrow, Fa, H2, SectionTitle, StarBullets } from '../ui.jsx'
import { SlackVideoCard } from '../qa/QaParts.jsx'

/* §5.1 hero canvas — APPROXIMATION of the live WebGL bubbles (internals unmeasurable, §9):
   grainy blue->pink gradient circles drifting slowly; they ease away from the cursor. */
const BUBBLES = [
  // x, y (fraction of canvas), radius px, phase
  [0.62, 0.2, 85, 0], [0.28, 0.42, 120, 1.3], [0.55, 0.52, 130, 2.1], [0.82, 0.55, 60, 3.2], [0.5, 0.86, 70, 4.4], [0.86, 0.3, 45, 5.1],
]
function BubbleCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    const ctx = c.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const W = 686
    const H = 599
    c.width = W * dpr
    c.height = H * dpr
    ctx.scale(dpr, dpr)
    // grain tile
    const g = document.createElement('canvas')
    g.width = g.height = 128
    const gx = g.getContext('2d')
    const img = gx.createImageData(128, 128)
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v
      img.data[i + 3] = 38
    }
    gx.putImageData(img, 0, 0)
    const grain = ctx.createPattern(g, 'repeat')
    const mouse = { x: -9999, y: -9999 }
    const offs = BUBBLES.map(() => ({ x: 0, y: 0 }))
    const onMove = (e) => {
      const r = c.getBoundingClientRect()
      mouse.x = ((e.clientX - r.left) / r.width) * W
      mouse.y = ((e.clientY - r.top) / r.height) * H
    }
    const onLeave = () => {
      mouse.x = mouse.y = -9999
    }
    c.addEventListener('pointermove', onMove)
    c.addEventListener('pointerleave', onLeave)
    const reduced = prefersReducedMotion()
    let raf = 0
    const draw = (t) => {
      ctx.clearRect(0, 0, W, H)
      BUBBLES.forEach(([fx, fy, r, ph], i) => {
        const s = reduced ? 0 : t / 1000
        let x = fx * W + Math.sin(s * 0.35 + ph) * 14
        let y = fy * H + Math.cos(s * 0.3 + ph) * 12
        const dx = x - mouse.x
        const dy = y - mouse.y
        const d = Math.hypot(dx, dy)
        const push = d < r + 120 ? ((r + 120 - d) / (r + 120)) * 40 : 0
        const o = offs[i]
        o.x += ((d ? (dx / d) * push : 0) - o.x) * 0.08
        o.y += ((d ? (dy / d) * push : 0) - o.y) * 0.08
        x += o.x
        y += o.y
        const rr = r * (1 + (reduced ? 0 : Math.sin(s * 0.5 + ph) * 0.04))
        const grad = ctx.createLinearGradient(x - rr, y - rr, x + rr, y + rr)
        grad.addColorStop(0, 'rgba(175,195,240,0.85)')
        grad.addColorStop(0.55, 'rgba(226,200,226,0.7)')
        grad.addColorStop(1, 'rgba(246,169,160,0.85)')
        ctx.beginPath()
        ctx.arc(x, y, rr, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
        ctx.fillStyle = grain
        ctx.fill()
      })
      if (!reduced) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      c.removeEventListener('pointermove', onMove)
      c.removeEventListener('pointerleave', onLeave)
    }
  }, [])
  return <canvas ref={ref} className="th-canvas" aria-hidden="true" />
}

function TopicChip({ title, conv, trend, left, deployed, className = '', style }) {
  return (
    <div className={`th-chip ${deployed ? 'is-deployed' : ''} ${className}`} style={style}>
      <div className={`th-chip-row ${left ? 'flex-row-reverse justify-end' : ''}`}>
        <p className="pa-tiempos so-t12">{title}</p>
        <img src="/svg/topics-explorer-Vector-img-0456f.svg" alt="" className="h-[24px] w-[24px] flex-none" />
      </div>
      {deployed && (
        <>
          <p className="pa-tiempos th-t10">{conv}</p>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-[4px]"><Fa code={0xe09f} size={16} color="#F95040" /><span className="pa-tiempos so-t12 !text-[#F95040]">{trend}</span></span>
            <span className="pa-tiempos th-t10">This week</span>
          </div>
        </>
      )}
    </div>
  )
}

export function TopicsHero() {
  return (
    <section className="ph-hero ph--topics">
      <div className="ph-content">
        <div className="ph-copy">
          <h1 className="pa-h1">Meet Topics<br className="hidden tablet:inline" /> Explorer</h1>
          <p className="pa-sub ph-sub">See every topic your customers bring up before it becomes a trend you missed.</p>
          <BookDemoButton />
        </div>
        <div className="ph-visual th-visual">
          <div className="th-canvas-wrap"><BubbleCanvas /></div>
          <div className="th-glass" />
          <Appear className="th-human" y={50} dur={1} delay={0.4} ease={SPRING}>
            <img src="/assets/EKA5qqkzN9z86qNi052bzgvYlXA.webp" alt="" />
          </Appear>
          <div className="th-chips">
            <div className="th-masked" style={{ WebkitMaskImage: 'url(/assets/RnI2nWdys2uqWp7NCcB0wEoBY.png)', maskImage: 'url(/assets/RnI2nWdys2uqWp7NCcB0wEoBY.png)' }}>
              <img src="/assets/ETA2fSnLgCiwMUrfr6bhOzKES4.webp" alt="" />
            </div>
            <TopicChip title="Shipping delays" style={{ top: 41, left: 103 }} />
            <TopicChip title="Sizing questions" left style={{ top: 81, left: 311 }} />
            <TopicChip title="Returns, Refunds and Exchanges" deployed conv="7,496 Conversations • 99% CXP Score" trend="+17%" style={{ top: 187.2, left: 111 }} />
            <TopicChip title="Feature requests" left style={{ top: 297, left: 319 }} />
            <TopicChip title="Billing" left style={{ top: 369, left: 176.9 }} />
          </div>
        </div>
      </div>
    </section>
  )
}

/* §5.3 Features */
const TOPICS = [
  ['Payment and Billing', '7,412', '99%'],
  ['Delivery Issues', '6,135', '97%', true],
  ['Trial, Sample, and Gifts', '1,301', '98%'],
  ['Product complaints', '1,135', '91%'],
]
const CONVS = [
  ['#4819 · 1 hour ago', "My tracking hasn't updated in 4 days. Is my package lost?"],
  ['#5041', "I paid for express shipping and it's been 6 days."],
  ['5038', 'My package says out for delivery but it never arrived.'],
]
function TopicTable() {
  const ref = useRef(null)
  const open = useInView(ref, { once: false })
  return (
    <div ref={ref} className="tf-visual tf-visual--table">
      <div className="tf-table">
        <div className="tf-head"><span /><span>Volume</span><span>CXP Score</span></div>
        {TOPICS.map(([n, v, s, expandable]) => (
          <div key={n} className={`tf-topic ${expandable && open ? 'is-open' : ''}`}>
            <div className="tf-topic-row">
              <span className="tf-name"><span className="tf-dot" />{n}</span>
              <span className="tf-vol">↘ {v}</span>
              <span className="tf-score">↗ {s}</span>
            </div>
            {expandable && (
              <div className="tf-expand">
                <div>
                  <div className="tf-convs">
                    <p className="tf-count">6,135 conversations</p>
                    {CONVS.map(([m, t]) => (
                      <div key={m} className="tf-conv">
                        <p className="pa-tiempos so-t12 !text-[#605C53]">{m}</p>
                        <p className="pa-tiempos sv-t14 !whitespace-normal">{t}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <span className="tf-fade" />
    </div>
  )
}
const DOTS = [
  ['b112f', 101, 30, 40], ['a339a', 64, 180, 110], ['d8cc4', 40, 300, 60], ['b15d0', 28, 380, 150], ['1d373', 19, 120, 300],
  ['ba3f2', 52, 260, 260], ['a339a', 34, 420, 330], ['b112f', 72, 60, 360], ['d8cc4', 24, 210, 400], ['b15d0', 46, 380, 400],
]
function TopicCloud() {
  const ref = useRef(null)
  const on = useInView(ref, { once: false })
  return (
    <div ref={ref} className="tf-visual tf-visual--cloud">
      <div className="tf-cloud">
        {[90, 170, 250, 330, 410].map((y) => <img key={y} src="/svg/topics-explorer-Sticky-Image-ccff5.svg" alt="" className="tf-line" style={{ top: y }} />)}
        {DOTS.map(([h, s, x, y], i) => (
          <img key={i} src={h === 'ba3f2' ? '/svg/topics-explorer-Topic-bg-ba3f2.svg' : `/svg/topics-explorer-Sticky-Image-bg-${h}.svg`} alt="" className="tf-bubble" style={{ width: s, height: s, left: x, top: y, opacity: on ? 1 : 0, transitionDelay: `${i * 0.04}s` }} />
        ))}
      </div>
      <div className="tf-pchip" style={{ transform: `translate(-50%, ${on ? -51 : -21.6}px)` }}>
        <div className="flex items-center justify-between gap-[12px]">
          <p className="pa-tiempos so-t12">Packaging complaints</p>
          <img src="/svg/topics-explorer-Vector-img-0456f.svg" alt="" className="h-[24px] w-[24px]" />
        </div>
        <p className="pa-tiempos th-t10">1,206 Conversations • 99% CXP Score</p>
        <span className="flex items-center gap-[4px]"><Fa code={0xe09f} size={16} color="#F95040" /><span className="pa-tiempos so-t12 !text-[#F95040]">11%</span></span>
      </div>
    </div>
  )
}
export function TopicsFeatures() {
  return (
    <section className="tf-section">
      <SectionTitle
        maxW={1072}
        eyebrow="Intelligence, visualized"
        eyebrowStrong
        title="Always know what customers are talking about"
        h2Max={800}
        sub="One tool that reads every conversation, replaces quarterly surveys, analyst hours, and the guesswork in between."
        subMax={680}
      />
      <div className="tf-scroll">
        <div className="tf-row tf-row--1">
          <div className="tf-text">
            <h3 className="pa-h3">Catch issues long before they rise</h3>
            <StarBullets items={['Volume and score in one view, always current', 'Trend direction visible at a glance, per topic', 'Sort by growth, score, or volume']} />
          </div>
          <TopicTable />
        </div>
        <div className="tf-row tf-row--2">
          <TopicCloud />
          <div className="tf-text">
            <h3 className="pa-h3">Watch what matters, let Siena do the tagging</h3>
            <StarBullets items={['Topics come from what customers actually say', 'Taxonomy stays current as conversations evolve', 'Every topic links directly to its source conversations']} />
          </div>
        </div>
      </div>
    </section>
  )
}

/* §5.6 Alerts */
function BriefsCard() {
  const [hover, setHover] = useState(false)
  return (
    <div className={`qa-card ta-card ${hover ? 'is-hover' : ''}`} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <h5 className="pa-h5 text-center">Recurring briefs</h5>
      <p className="rv-t16 text-center">Pick any question and set a cadence. Ask Siena tracks it and delivers a full brief with trend shifts, volume changes, and source conversations.</p>
      <div className="ta-brief">
        <img src="/svg/topics-explorer-Visual-c952e.svg" alt="" className="ta-connector" />
        <div className={`th-chip ta-brief-chip ${hover ? 'is-deployed' : ''}`}>
          <div className="th-chip-row"><p className="pa-tiempos so-t12">Packaging complaints</p><img src="/svg/topics-explorer-Vector-img-0456f.svg" alt="" className="h-[24px] w-[24px]" /></div>
          <div className="ta-brief-more">
            <div>
              <p className="pa-tiempos th-t10">1,206 Conversations • 99% CXP Score</p>
              <span className="flex items-center gap-[4px]"><Fa code={0xe09f} size={16} color="#F95040" /><span className="pa-tiempos so-t12 !text-[#F95040]">11%</span></span>
            </div>
          </div>
        </div>
        <div className="ta-ask"><img src="/svg/shopping-agent-Icon-Black-d8122.svg" alt="" className="h-[20px] w-[20px]" /><span className="pa-fd">Ask me anything</span></div>
      </div>
    </div>
  )
}
function TopicBlobCard() {
  return (
    <Appear on="view" dur={0.4} delay={0.2} ease="cubic-bezier(0.94,-0.05,0,1)" className="qa-card ta-card">
      <Appear on="view" dur={0.4} ease={SPRING} className="ta-blob" style={{ WebkitMaskImage: 'url(/assets/3DDwu6JiBQxZUakevLif2PuC5TM.png)', maskImage: 'url(/assets/3DDwu6JiBQxZUakevLif2PuC5TM.png)' }}>
        <img src="/assets/ETA2fSnLgCiwMUrfr6bhOzKES4.webp" alt="" />
      </Appear>
      <Appear on="view" y={150} dur={0.2} delay={0.3} ease="cubic-bezier(0.44,0,0,1.13)" className="ta-block">
        <div className="flex items-start justify-between gap-[12px]">
          <p className="pa-tiempos sv-t18">Order shipping issues</p>
          <img src="/svg/topics-explorer-Vector-img-0456f.svg" alt="" className="h-[24px] w-[24px]" />
        </div>
        <div className="flex items-center justify-between">
          <span className="pa-tiempos so-t12">127 mentions</span>
          <span className="flex items-center gap-[4px]"><Fa code={0xe09f} size={16} color="#FB5646" /><span className="pa-tiempos so-t12 !text-[#FB5646]">68%</span></span>
        </div>
      </Appear>
    </Appear>
  )
}
export function TopicsAlerts() {
  return (
    <section className="ta-section">
      <div className="pa-title pa-title--center" style={{ maxWidth: 1062 }}>
        <Eyebrow as="div"><code className="font-[inherit]">Stay ahead</code></Eyebrow>
        <H2 style={{ maxWidth: 800 }}>Intelligence on your schedule, wherever your team works</H2>
      </div>
      <div className="ta-row">
        <BriefsCard />
        <TopicBlobCard />
        <SlackVideoCard className="ta-card" title="Delivered where it matters" text="The right people get the right context, without ever opening a report. Send it to Slack, email, or both." />
      </div>
      <span className="ta-fade" />
    </section>
  )
}
