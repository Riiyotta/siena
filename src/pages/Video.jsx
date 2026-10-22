import { useEffect } from 'react'
import {
  AgentNote, Appear, BookDemoButton, ChipRow, CtaB, Dots, Eyebrow, Fa, GradBubble, H2, Motion, ProductLogoTicker,
  Reveal, Sparkles, SPRING, VIDEO_LOGOS, VideoCard,
} from '../components/product-b/shared.jsx'
import StickyScroll from '../components/product-b/StickyScroll.jsx'
import { springEasing, reducedMotion } from '../components/product-b/motion.jsx'

// specs/product-b.md §2 /video
const HERO_MP4 = '/assets/7DsxIASjdBjpJcPHLI0CK32RvwA.mp4'
const STAGE_MP4 = '/assets/x4A0FFLvT1jKKMmC1BeB2sDrts.mp4'
const GALLERY_MP4 = '/assets/4gloqJyU9yH0U5zKatZKkGxpiA.mp4'

function PlayBadge() {
  return (
    <div className="vh-play" aria-hidden="true">
      <img src="/svg/play-badge-circle.svg" alt="" className="vh-play-circle" />
      <img src="/svg/play-badge-triangle.svg" alt="" className="vh-play-tri" />
    </div>
  )
}

// §2.1 hero visual (672x430). Load motion is exact; everything is in view on load.
function HeroVisual() {
  return (
    <div className="vh-visual">
      <div className="vh-content">
        <Motion trigger="load" from={{ opacity: 0.001 }} transition={{ duration: 0.4, delay: 0.2, ease: [0.44, 0, 0.56, 1] }}>
          <VideoCard src={HERO_MP4} className="vh-card">
            <div className="vh-progress">
              <span className="vh-progress-track" />
              <span className="vh-progress-fill" />
            </div>
          </VideoCard>
        </Motion>
        <Motion trigger="load" from={{ opacity: 0, y: 20 }} transition={SPRING(0.2, 0.2, 0.8)}>
          <div className="pb-note vh-note">
            <h6 className="pb-note-title">Analyzing provided video</h6>
            <Motion trigger="load" from={{ opacity: 0.001 }} transition={SPRING(1.0, 0.2, 0.4)}>
              <Dots />
            </Motion>
          </div>
        </Motion>
      </div>
      <PlayBadge />
      <Motion trigger="load" from={{ opacity: 0, y: 20 }} transition={SPRING(0.1, 0.2, 0.8)} className="vh-left">
        <GradBubble>Help me choose a rug that matches my living room style</GradBubble>
      </Motion>
      <Motion trigger="load" from={{ opacity: 0, y: 50 }} transition={SPRING(1.0)} className="vh-right">
        <GradBubble kind="border">This rug would fit your space perfectly, here is my top pick!</GradBubble>
        <img className="vh-brand" src="/assets/97FwNezELUd8Kd9HdHn3le688Ks.png" alt="" />
      </Motion>
    </div>
  )
}

// ---------- §2.2 sticky stages ----------
const BLOCKS = [
  {
    title: 'Process warranty claims faster',
    body: 'Customers show you damaged products on video. Siena watches, understands, and resolves claims without your team ever pressing play.',
    bullets: ['Instant damage assessment', 'Automated claim decisions', 'Scale without adding headcount'],
  },
  {
    title: 'See what customers see',
    body: 'When customers show instead of tell, Siena gets the full picture. Visual context means faster resolution and happier customers.',
    bullets: ['Product defect verification', 'Visual troubleshooting', 'Shipping damage evaluation'],
  },
  {
    title: 'Give your team hours back',
    body: 'Every video ticket used to mean watching, pausing, screenshotting, and documenting. Siena handles all of it instantly so your team focuses on work that matters.',
    bullets: ['Hours saved per agent weekly', 'Faster ticket resolution', 'Higher team capacity'],
    button: true,
  },
]
const CHIPS = [
  ['Order #4521', 'Shipped: Jan 23', 'ETA Jan 29'],
  ['Order #4521', '01/07/2025', 'ETA Jan 29'],
  ['Order #4521', 'Shipped: Jan 23', 'ETA Jan 29'],
]
const STAGE_SPRING = springEasing({ bounce: 0.2, duration: 0.4 })
const stageStyle = (on) => ({
  opacity: on ? 1 : 0,
  transition: reducedMotion() ? 'none' : `opacity ${STAGE_SPRING.ms}ms ${STAGE_SPRING.easing}`,
  pointerEvents: on ? 'auto' : 'none',
})

const CUSTOMER_Q = 'My headphones came damaged out-of-the-box, is this covered by the warranty?'

function ProductCard({ eta = 'Jan 9' }) {
  return (
    <div className="pb-grad pb-grad--review vs-product">
      <div className="vs-product-inner">
        <div className="vs-product-row">
          <div className="vs-thumb">
            <img src="/assets/T0wEls4P32RuHyeqKeEOU1f6SQs.png" alt="" />
          </div>
          <div className="vs-product-text">
            <p className="pb-grad-text vs-product-title">Headphone Set BH2143 Hi-Fi</p>
            <p className="vs-product-sub">Replacement shipped</p>
          </div>
        </div>
        <div className="vs-divider" />
        <div className="vs-arrive">
          <span>Arriving:</span>
          <span>{eta}</span>
        </div>
      </div>
      <img className="vs-check" src="/svg/video-icon-button-916924.svg" alt="" width="57" height="57" />
    </div>
  )
}

// Desktop: one persistent stage group; per-stage layers cross-fade with the stage spring (bounce .2, .4s).
function StageVisual({ active, seen }) {
  return (
    <div className="vs-stage">
      <div className="vs-chips-slot">
        {CHIPS.map((c, i) => (
          <div key={i} className="vs-chips-layer" style={stageStyle(active === i)}>
            <ChipRow chips={c} play={seen} />
          </div>
        ))}
      </div>
      <Motion trigger="manual" play={seen} from={{ opacity: 0, y: 50 }} transition={SPRING(0.2, 0.1, 1)}>
        <VideoCard src={STAGE_MP4} />
      </Motion>
      <div className="vs-customer" style={stageStyle(active !== 2)}>
        <Motion trigger="manual" play={seen} from={{ opacity: 0, y: 50 }} transition={SPRING(0.6)}>
          <GradBubble>{CUSTOMER_Q}</GradBubble>
        </Motion>
      </div>
      <div className="vs-reply" style={stageStyle(active === 1)}>
        <GradBubble icon={<Sparkles />}>I can see the damage. Your replacement ships today</GradBubble>
      </div>
      <div className="vs-product-slot" style={stageStyle(active === 2)}>
        <ProductCard />
      </div>
    </div>
  )
}

// Phone: each block has its own static-composition stage that reveals on scroll.
function MobileStage({ i }) {
  const chips =
    i === 1 ? (
      <div className="vm-chips">
        <ChipRow chips={['Order #4521', '01/07/2025']} trigger="view" />
        <ChipRow chips={['Within 30 days guarantee']} trigger="view" durations={[2.6]} />
      </div>
    ) : (
      <div className="vm-chips">
        <ChipRow chips={['Order #4521', 'Shipped: Jan 23']} trigger="view" />
        <ChipRow chips={[i === 2 ? 'ETA Jan 31' : 'ETA Jan 29']} trigger="view" durations={[2.6]} />
      </div>
    )
  return (
    <div className="vm-stage">
      {chips}
      <div className="vm-card-wrap">
        <Reveal bounce={0.1} delay={0.2}>
          <VideoCard src={STAGE_MP4} className="vm-card" />
        </Reveal>
        {i < 2 && (
          <Reveal delay={0.6} className="vm-customer">
            <GradBubble>{CUSTOMER_Q}</GradBubble>
          </Reveal>
        )}
        {i === 1 && (
          <Reveal delay={0.6} className="vm-reply">
            <GradBubble icon={<Sparkles />}>I can see the damage. Your replacement ships today</GradBubble>
          </Reveal>
        )}
        {i === 2 && (
          <div className="vm-product">
            <ProductCard />
          </div>
        )}
      </div>
    </div>
  )
}

// §2.3 per-character text: from {blur 10, opacity .001, y 10}, spring bounce 0 dur .4, stagger .05s, on mount
function SplitText({ text }) {
  let n = 0
  return text.split(' ').map((word, wi) => (
    <span key={wi} className="inline-block whitespace-nowrap">
      {[...word].map((ch) => (
        <Motion
          key={n}
          as="span"
          trigger="load"
          className="inline-block"
          from={{ opacity: 0.001, y: 10, filter: 'blur(10px)' }}
          to={{ filter: 'blur(0px)' }}
          transition={{ type: 'spring', bounce: 0, duration: 0.4, delay: 0.05 * n++ }}
        >
          {ch}
        </Motion>
      ))}
      {wi < text.split(' ').length - 1 && <span className="inline-block">&nbsp;</span>}
    </span>
  ))
}

const GCHIPS = ['Recognizing brand, product, and model', 'Pulling info from the documentation', 'Checking video details']
const GCHIP_T = [
  [0.6, 1.0],
  [1.5, 2.0],
  [2.6, 3.0],
]
const chipTween = (d, delay) => ({ duration: d, delay, ease: [0.44, 0, 0.05, 1] })

function Gallery() {
  return (
    <div className="vg-card">
      <div className="vg-grid">
        <Reveal bounce={0.1} delay={0.2} className="vg-video">
          <VideoCard src={GALLERY_MP4} boxClass="vg-video-box" />
        </Reveal>
        <Reveal delay={0.6} className="vg-customer">
          <GradBubble>My espresso is coming out watery. Can you see what I&apos;m doing wrong?</GradBubble>
        </Reveal>
        <div className="vg-col">
          {/* connector: animateOnce false → replays on every re-entry */}
          <Motion
            className="vg-connector"
            once={false}
            from={{ opacity: 0, scale: 0.1, y: -130 }}
            transition={{ duration: 5, delay: 2, ease: [0.44, 0, 0, 0.99] }}
            aria-hidden="true"
          >
            <span className="vg-connector-line" />
            <svg className="vg-connector-arrow" viewBox="0 0 14 7" fill="none">
              <path d="M1 1l6 5 6-5" stroke="#122023" strokeWidth="1" />
            </svg>
          </Motion>
          <Reveal y={20} duration={0.8} delay={0.2} className="vg-note-wrap">
            <AgentNote className="vg-note">
              <SplitText text="Analyzing video" />
            </AgentNote>
          </Reveal>
          <div className="vg-chips">
            {GCHIPS.map((c, i) => (
              <Motion key={c} from={{ opacity: 0, y: 50 }} transition={chipTween(...GCHIP_T[i])} className="pb-chip vg-chip">
                {c}
              </Motion>
            ))}
          </div>
        </div>
        <Reveal delay={4.0} className="vg-answer">
          <GradBubble icon={<Sparkles />}>Your grind is too coarse. Try a finer setting and tamp with more pressure.</GradBubble>
        </Reveal>
      </div>
    </div>
  )
}

const COLS = [
  [0xf019, 'Capture', 'Customers send videos through Live Chat, Helpdesks or integrations like Hark. Siena picks them up automatically, no configuration needed.'],
  [0xf002, 'Understand', 'Siena watches every frame and extracts what matters. Damaged products, missing parts, shipping issues, defects. Context your team would spend minutes gathering.'],
  [0xf00c, 'Resolve', 'Claims processed, tickets updated, customers answered. What used to take manual review now happens instantly, at any volume.'],
]

export default function Video() {
  useEffect(() => {
    document.title = 'Siena Video | Siena AI'
  }, [])
  return (
    <div className="pb-page pb-video">
      {/* §2.1 Hero */}
      <section className="vh-hero">
        <div className="vh-title">
          <div className="vh-text">
            <Appear as="h1" delay={0.2} className="pb-h1 text-center">Introducing Video</Appear>
            <Appear as="p" delay={0.3} opacity={0.82} className="pb-hero-sub vh-sub">
              Siena brings the same intelligence to video that transformed how you handle images. Warranty claims, damage assessments, and product guidance are handled automatically.
            </Appear>
          </div>
          <Appear delay={0.4}>
            <BookDemoButton />
          </Appear>
          <HeroVisual />
        </div>
        <div className="vh-logos">
          <ProductLogoTicker logos={VIDEO_LOGOS} />
        </div>
        <div className="vh-fade" aria-hidden="true" />
      </section>

      {/* §2.2 Features + sticky */}
      <div className="vf-wrap">
        <div className="vf-title">
          <Eyebrow className="text-center">Video understanding for CX</Eyebrow>
          <H2 className="text-center">Customers show, Siena resolves</H2>
        </div>
        <StickyScroll
          blocks={BLOCKS}
          renderVisual={(active, seen) => <StageVisual active={active} seen={seen} />}
          renderMobileVisual={(i) => <MobileStage i={i} />}
        />
      </div>

      {/* §2.3 How it works */}
      <section className="vw-section">
        <div className="vw-fade vw-fade--top" aria-hidden="true" />
        <div className="vw-fade vw-fade--bottom" aria-hidden="true" />
        <div className="vw-title">
          <Eyebrow className="text-center">How it works</Eyebrow>
          <H2 className="text-center">Video intelligence for customer service</H2>
        </div>
        <div className="vw-container">
          <Gallery />
          <div className="vw-cols">
            {COLS.map(([icon, h, body]) => (
              <div key={h} className="mw-col vw-col">
                <Fa code={icon} size={24} />
                <h5 className="mw-h3 vw-h5">{h}</h5>
                <p className="mw-body">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* §2.4 CTA — no top fade. Phone live-site bug replicated via .pb-video scope (see product-b.css). */}
      <div className="vc-phone-blank" aria-hidden="true" />
      <CtaB fade={false} className="vc-cta" />
    </div>
  )
}
