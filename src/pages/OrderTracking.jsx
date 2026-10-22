import { useEffect } from 'react'
import {
  Appear, BookDemoButton, Bullets, ChipRow, CtaB, Dots, Eyebrow, Fa, GradBubble, H2, Motion, OT_LOGOS,
  ProductLogoTicker, Reveal, SPRING, VideoCard,
} from '../components/product-b/shared.jsx'
import StickyScroll from '../components/product-b/StickyScroll.jsx'
import Globe from '../components/product-b/Globe.jsx'
import Faq from '../components/product-b/Faq.jsx'
import { springEasing, reducedMotion } from '../components/product-b/motion.jsx'

// specs/product-b.md §3 /order-tracking

const LOGO = {
  jp: ['/svg/order-tracking-carrier-japan-post.svg', 51, 27, 'contain'],
  rm: ['/assets/Y3DdSWSDlScPBJJuc9qAzSfLPrw.png', 59, 43, 'contain'],
  o1: ['/assets/O1NsOtNtpqW7pzcUdS2WzUEjDS0.png', 73, 71, 'cover'],
  yi: ['/assets/YiU6EdafVKNGm5G1IXsorXq3OIQ.png', 42, 41, 'contain'],
  usps: ['/svg/order-tracking-carrier-usps.svg', 58, 58, 'contain'],
  ups: ['/svg/order-tracking-carrier-ups.svg', 49, 49, 'contain'],
  dhl: ['/svg/order-tracking-carrier-dhl.svg', 59, 19, 'contain'],
  grp: ['/svg/order-tracking-carrier-group.svg', 68, 10, 'contain'],
}
// corner order: BL, BR, TR, TL
const OUTER = [['jp', 'rm', 'o1', 'yi'], ['usps', 'ups', 'dhl', 'grp']]
const INNER = [['yi', 'o1', 'rm', 'jp'], ['dhl', 'grp', 'usps', 'ups']]
const DELAYS = [0.2, 0.4, 0.5, 0.6]

function Chip({ id, delay }) {
  const [src, w, h, fit] = LOGO[id]
  return (
    <Motion trigger="load" from={{ opacity: 0.001, x: -20, y: -20 }} transition={SPRING(delay, 0.2, 0.6)} className="oh-chip">
      <img src={src} alt="" style={{ width: w, height: h, objectFit: fit }} />
    </Motion>
  )
}

// One orbit: two 45°-offset layers of 4 corner chips; the orbit spins, chips counter-spin to stay upright.
function Orbit({ layers, dir, className, slot }) {
  return (
    <div className={`oh-orbit ${className} oh-spin--${dir}`}>
      {layers.map((ids, li) => (
        <div key={li} className="oh-layer" style={{ transform: `rotate(${li * 45}deg)` }}>
          {ids.map((id, ci) => (
            <div key={id} className={`oh-slot oh-slot--${['bl', 'br', 'tr', 'tl'][ci]}`} style={slot}>
              <div style={{ transform: `rotate(${-li * 45}deg)` }}>
                <div className={`oh-spin--${dir === 'cw' ? 'ccw' : 'cw'}`}>
                  <Chip id={id} delay={DELAYS[ci]} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function HeroVisual() {
  return (
    <div className="oh-visual">
      <div className="oh-content">
        <div className="oh-frame">
          <img className="oh-arcs" src="/svg/order-tracking-orbit-arcs.svg" alt="" />
          <Orbit layers={OUTER} dir="cw" className="oh-outer" />
          <div className="oh-inner-box">
            <div className="oh-inner-circle" />
            <Orbit layers={INNER} dir="ccw" className="oh-inner" />
          </div>
        </div>
        <Motion trigger="load" from={{ opacity: 0.001, y: 64 }} transition={{ duration: 1, delay: 0.4, ease: [0.44, 0, 0, 1] }} className="oh-center">
          <img src="/assets/97FwNezELUd8Kd9HdHn3le688Ks.png" alt="" />
        </Motion>
      </div>
    </div>
  )
}

const BLOCKS = [
  {
    title: 'Instant tracking lookups',
    body: 'When customers ask about their order, Siena pulls current tracking data and delivers clear, accurate updates in seconds.',
    bullets: ['Direct access to 2,000+ carriers', 'Real-time status with full delivery context', 'Eliminate tracking errors'],
  },
  {
    title: 'Proactive delay detection',
    badge: (
      <span className="ot-soon">
        <Fa code={0xf890} size={20} className="ot-soon-icon" />
        Coming soon
      </span>
    ),
    body: 'When a package gets stuck, Siena knows before your customer complains. The agent flags delays, notifies your team, and reaches out proactively.',
    bullets: ['Proactive delivery monitoring', 'Predictive issue detection', 'Automated customer outreach'],
  },
]
const ETA_STRUCK = (
  <>
    ETA Jan <span className="line-through">18</span> 22
  </>
)
const STAGE_SPRING = springEasing({ bounce: 0.2, duration: 0.4 })
const fade = (on) => ({
  opacity: on ? 1 : 0,
  transition: reducedMotion() ? 'none' : `opacity ${STAGE_SPRING.ms}ms ${STAGE_SPRING.easing}`,
  pointerEvents: on ? 'auto' : 'none',
})

function GlobeCard({ stage }) {
  return (
    <VideoCard className="os-card" boxClass="os-box">
      <div className={`os-globe-wrap os-globe-wrap--${stage}`}>
        <Globe stage={stage} className="os-globe" />
      </div>
      {/* stage-2 capture shows a red glowing dot over the zoomed map; the cobe marker is hidden in that variant */}
      <span className="os-glow" style={fade(stage === 1)} aria-hidden="true" />
    </VideoCard>
  )
}

function StageVisual({ active, seen }) {
  return (
    <div className="vs-stage os-stage">
      <div
        className="os-chips-slot"
        style={{
          transform: `translateY(${active === 1 ? 333.6 + 85 : 0}px)`,
          transition: reducedMotion() ? 'none' : `transform ${STAGE_SPRING.ms}ms ${STAGE_SPRING.easing}`,
        }}
      >
        <div className="vs-chips-layer" style={fade(active === 0)}>
          <ChipRow chips={['Order #4521', 'Shipped Jan 15', 'ETA Jan 18']} play={seen} />
        </div>
        <div className="vs-chips-layer" style={fade(active === 1)}>
          <ChipRow chips={['Order #1324', 'Status: Delayed', ETA_STRUCK]} chipClass="os-chip2" play={seen} />
        </div>
      </div>
      <Motion trigger="manual" play={seen} from={{ opacity: 0, y: 50 }} transition={SPRING(0.2, 0.1, 1)}>
        <GlobeCard stage={active} />
      </Motion>
      <Motion trigger="manual" play={seen} from={{ opacity: 0, y: 50 }} transition={SPRING(0.6)} className="os-layer">
        <div className="os-s1-customer" style={fade(active === 0)}>
          <GradBubble>My order has been stuck in customs for a week</GradBubble>
        </div>
        <div className="os-s1-siena" style={fade(active === 0)}>
          <GradBubble kind="border" innerClass="os-p16">I see it cleared customs this morning and is now with Royal Mail. Updated ETA is Monday.</GradBubble>
        </div>
        <div className="os-s2-siena" style={fade(active === 1)}>
          <GradBubble kind="border" innerClass="os-p16">
            Your package has been sitting in the same facility for 3 days. I&apos;ve flagged this with our fulfillment team and will update you within 24 hours
          </GradBubble>
        </div>
        <div className="os-s2-customer" style={fade(active === 1)}>
          <GradBubble>Ok, thanks!</GradBubble>
        </div>
      </Motion>
    </div>
  )
}

function MobileStage({ i }) {
  return (
    <div className="vm-stage">
      {i === 0 && (
        <div className="vm-chips">
          <ChipRow chips={['Order #4521', 'ETA Jan 18']} trigger="view" />
          <ChipRow chips={['Shipped Jan 15']} trigger="view" durations={[2.6]} />
        </div>
      )}
      <div className="vm-card-wrap">
        <Reveal bounce={0.1} delay={0.2}>
          <GlobeCard stage={i} />
        </Reveal>
        <Reveal delay={0.6} className={i === 0 ? 'om-customer' : 'om-siena2'}>
          {i === 0 ? (
            <GradBubble>My order has been stuck in customs for a week</GradBubble>
          ) : (
            <GradBubble kind="border" innerClass="os-p16">
              Your package has been sitting in the same facility for 3 days. I&apos;ve flagged this with our fulfillment team and will update you within 24 hours
            </GradBubble>
          )}
        </Reveal>
        <Reveal delay={0.6} className={i === 0 ? 'om-siena' : 'om-customer2'}>
          {i === 0 ? (
            <GradBubble kind="border" innerClass="os-p16">I see it cleared customs this morning and is now with Royal Mail. Updated ETA is Monday.</GradBubble>
          ) : (
            <GradBubble>Ok, thanks!</GradBubble>
          )}
        </Reveal>
      </div>
      {i === 1 && (
        <div className="vm-chips">
          <ChipRow chips={['Order #1324', 'Status: Delayed']} trigger="view" chipClass="os-chip2" />
          <ChipRow chips={[ETA_STRUCK]} trigger="view" durations={[2.6]} chipClass="os-chip2" />
        </div>
      )}
    </div>
  )
}

const FAQ = [
  ['Does tracking work for international shipments with customs delays?', 'Yes. Siena Order Tracking covers international shipments across customs checkpoints, regional carriers, and last-mile delivery. Whether packages move through customs or transfer between international and domestic carriers, Siena maintains visibility throughout the entire journey.'],
  ['How does Siena handle tracking numbers that work across multiple carriers?', "Siena's infrastructure automatically detects which carrier is handling each package based on the tracking number format and shipping details. This eliminates errors from routing tracking queries to the wrong carrier, ensuring accurate results every time."],
  ['Does Siena work with returns or order tracking platforms?', 'Yes. Siena integrates with returns platforms like Loop Returns and order tracking platforms like AfterShip. If you already use these tools, Siena works alongside them.'],
  ['Can Siena track packages from regional or specialty carriers?', 'Yes. Native tracking supports over 2000 carriers worldwide, including regional carriers, specialty logistics providers, and local delivery services. Whether you use major carriers like FedEx or regional providers, Siena has coverage.'],
]

export default function OrderTracking() {
  useEffect(() => {
    document.title = 'Siena Order Tracking | Siena AI'
  }, [])
  return (
    <div className="pb-page pb-ot">
      {/* §3.1 Hero */}
      <section className="oh-hero">
        <div className="oh-title">
          <div className="oh-text">
            <Appear as="h1" delay={0.2} className="pb-h1 oh-h1">Siena Order Tracking</Appear>
            <Appear as="p" delay={0.3} opacity={0.82} className="pb-hero-sub oh-sub">
              Siena connects directly to thousands of carriers to track packages in real-time. Answer shipping questions, resolve delivery issues, and provide accurate order updates.
            </Appear>
          </div>
          <Appear delay={0.4}>
            <BookDemoButton />
          </Appear>
          <HeroVisual />
        </div>
        <div className="oh-fade oh-fade--a" aria-hidden="true" />
        <div className="oh-fade oh-fade--b" aria-hidden="true" />
        <div className="oh-chat">
          <div className="oh-customer">
            <img className="oh-avatar" src="/assets/HmqW7KqMsD32FtjFcSsHNYWM.webp" alt="" />
            <GradBubble>Hi! Can you check what&apos;s going on with my order?</GradBubble>
          </div>
          <div className="oh-siena">
            <GradBubble kind="border">
              I&apos;m sorry for the delay. Your order has been stuck at the carrier&apos;s distribution center for 7 days. I&apos;m sending a replacement with expedited shipping right away.
            </GradBubble>
            <img className="oh-brand" src="/assets/97FwNezELUd8Kd9HdHn3le688Ks.png" alt="" />
          </div>
        </div>
      </section>

      {/* §3.2 ticker: fades in when it enters the viewport */}
      <Motion from={{ opacity: 0 }} transition={{ duration: 0.6 }} amount={0}>
        <ProductLogoTicker logos={OT_LOGOS} variant="plain" />
      </Motion>

      {/* §3.3 Features + sticky */}
      <div className="vf-wrap ot-features">
        <div className="vf-title ot-ftitle">
          <Eyebrow className="text-center">Order logistics intelligence</Eyebrow>
          <H2 className="text-center">Your Agent&apos;s direct line to carriers</H2>
        </div>
        <StickyScroll
          className="ot-ss"
          blocks={BLOCKS}
          renderVisual={(active, seen) => <StageVisual active={active} seen={seen} />}
          renderMobileVisual={(i) => <MobileStage i={i} />}
        />
      </div>

      {/* §3.4 Simplify your stack */}
      <section className="op-section">
        <div className="vw-fade vw-fade--top" aria-hidden="true" />
        <div className="vw-fade op-fade--bottom" aria-hidden="true" />
        <div className="op-container">
          <div className="op-text">
            <h3 className="pb-h3r op-h3">Simplify your stack</h3>
            <p className="pb-p20">
              Native tracking infrastructure is included in your platform. Handle order inquiries without managing separate tracking subscriptions or maintaining additional integrations.
            </p>
            <Bullets items={['Works with existing workflows', 'Reduce vendor complexity']} />
          </div>
          <div className="op-visual">
            <div className="op-pipe">
              <div className="op-capsule">
                <div className="op-capsule-inner" />
              </div>
              <Motion trigger="load" from={{ opacity: 0.001, y: 64 }} transition={{ duration: 1, delay: 0.4, ease: [0.44, 0, 0, 1] }} className="op-brand oh-chipstyle">
                <img src="/assets/97FwNezELUd8Kd9HdHn3le688Ks.png" alt="" />
              </Motion>
              <Reveal y={20} duration={0.8} className="op-note">
                <span className="op-note-text">Fetching tracking # details</span>
                <Dots />
              </Reveal>
              <img className="op-connector" src="/svg/order-tracking-connector-line.svg" alt="" />
              <span className="op-pulse" aria-hidden="true">
                <span className="op-pulse-halo" />
                <span className="op-pulse-core" />
              </span>
              <Motion trigger="load" from={{ opacity: 0.001, y: 64 }} transition={{ duration: 1, delay: 0.4, ease: [0.44, 0, 0, 1] }} className="op-empty oh-chipstyle" />
            </div>
          </div>
        </div>
      </section>

      {/* §3.5 FAQ */}
      <Faq items={FAQ} className="ot-faq" />

      {/* §3.6 CTA — white top fade */}
      <CtaB fade={{ height: 187, background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)' }} />
    </div>
  )
}
