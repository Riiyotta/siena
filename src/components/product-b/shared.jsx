import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import BookDemoButton from '../cta/BookDemoButton.jsx'
import LottiePlayer from '../features/LottiePlayer.jsx'
import { StarIcon } from '../scroll-area/parts.jsx'
import { Motion } from './motion.jsx'
import '../../styles/hero.css' // .ticker-row / .ticker-track / .ticker-list (reused, not edited)
import '../../styles/product-b.css'

export { BookDemoButton, StarIcon }

// ---------- Logo sets (specs/product-b.md §0 natural WxH) ----------
const SIZES = {
  '01': [176, 32], '02': [159, 32], '03': [209, 32], '04': [167, 32], '05': [119, 38], '06': [111, 40], '07': [120, 38],
  '08': [91, 44], '09': [241, 24], '10': [99, 44], '11': [161, 32], '12': [207, 38], '13': [156, 38], '14': [71, 38],
  '15': [112, 38], '16': [150, 24], '17': [152, 30], '18': [188, 40], '19': [154, 44], '20': [126, 38], '21': [178, 30],
  '22': [103, 30], '23': [189, 38], '24': [86, 44], '25': [112, 44], '26': [144, 30], '27': [82, 44], '28': [121, 30],
  '29': [107, 38], figs: [108, 30], '02b': [153, 32], gruns: [101, 38],
}
export const logo = (id) => ({ src: `/svg/ticker-logo-${id}.svg`, name: '', w: SIZES[id][0], h: SIZES[id][1] })
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => String(a + i).padStart(2, '0'))
export const PRODUCT_LOGOS = range(1, 29).map(logo) // §0: 29 logos
export const VIDEO_LOGOS = ['01', '02', '03', '04', '05', '06', '07', '09', '08', '10', '11', '12', '12', '13', '14', '15', '16', '17', '18', '19', '20'].map(logo) // §2.1
export const OT_LOGOS = ['figs', '01', '02', '02b', '03', '04', '05', 'gruns', ...range(6, 29)].map(logo) // §3.2

const SPEED = 30 // px/s, left

/**
 * Product ticker (§0): one row moving LEFT at 30px/s, list duplicated for the loop.
 * variant: 'mask' (gap 64/40, edge mask 12.5/87.5 → 10/90 on phone, row 100/45) or 'plain' (§3.2: gap 112/48, row 44, no mask).
 */
export function ProductLogoTicker({ logos = PRODUCT_LOGOS, variant = 'mask', className = '', style }) {
  const listRef = useRef(null)
  const [duration, setDuration] = useState(0)
  useLayoutEffect(() => {
    const el = listRef.current
    if (!el) return
    const measure = () => setDuration(el.getBoundingClientRect().width / SPEED)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const items = (k) =>
    logos.map((l, i) => (
      <li key={`${k}-${i}`} className="flex flex-none items-center">
        <img src={l.src} alt="" width={l.w} height={l.h} style={{ width: l.w, height: l.h }} className="block" draggable="false" />
      </li>
    ))
  return (
    <section className={`pb-ticker pb-ticker--${variant} ${className}`} style={style} aria-label="Customer logos">
      <div className="ticker-row pb-ticker-row">
        <div
          className="ticker-track ticker-track--left pb-ticker-track"
          style={duration ? { animationDuration: `${duration}s` } : { animationPlayState: 'paused' }}
        >
          <ul ref={listRef} className="ticker-list">{items('a')}</ul>
          <ul className="ticker-list" aria-hidden="true">{items('b')}</ul>
        </div>
      </div>
    </section>
  )
}

// ---------- Typography helpers ----------
export function Eyebrow({ children, bold, className = '', ...rest }) {
  return (
    <p className={`pb-eyebrow ${className}`} {...rest}>
      {bold ? <strong className="pb-eyebrow-strong">{children}</strong> : children}
    </p>
  )
}

export function H2({ children, className = '', as: Tag = 'h2', ...rest }) {
  return <Tag className={`pb-h2 ${className}`} {...rest}>{children}</Tag>
}

export function Bullets({ items, className = '' }) {
  return (
    <ul className={`pb-bullets ${className}`}>
      {items.map((b) => (
        <li key={b} className="pb-bullet">
          <StarIcon />
          <span className="pb-bullet-text">{b}</span>
        </li>
      ))}
    </ul>
  )
}

// Font Awesome 6 Sharp Light glyph by codepoint (font is declared in src/index.css)
export function Fa({ code, size = 24, className = '', style }) {
  return (
    <span className={`pb-fa ${className}`} style={{ fontSize: size, width: size, height: size, lineHeight: `${size}px`, ...style }} aria-hidden="true">
      {String.fromCodePoint(code)}
    </span>
  )
}

// ---------- Hero appear (§0: H1 .2 / sub .3 → .82 / cta .4) ----------
export { Appear, Reveal, Motion } from './motion.jsx'

// ---------- Main CTA variant (§1.6 / §2.4 / §3.6 / §4.8 / §6.4) ----------
/**
 * fade: false | { height, background, mobileHeight, top }
 */
export function CtaB({ title = 'See how fast-growing brands scale with Siena', fade, className = '', children }) {
  return (
    <section className={`pb-cta ${className}`}>
      <div className="pb-cta-frame">
        <img src="/assets/ERYNplIY591uk80wpoa4JGglO8.webp" alt="" width="1440" height="810" className="pb-cta-bg" />
        {fade && (
          <div
            className="pb-cta-fade"
            aria-hidden="true"
            style={{ '--fade-h': `${fade.height}px`, '--fade-h-m': `${fade.mobileHeight ?? fade.height}px`, top: fade.top ?? -2, background: fade.background }}
          />
        )}
        <div className="pb-cta-card">
          <div className="pb-cta-inner">
            <h2 className="pb-cta-h2">{title}</h2>
            <BookDemoButton />
          </div>
        </div>
      </div>
      {children}
    </section>
  )
}

// ---------- Chat / video atoms shared by /video and /order-tracking (§2 "Shared visual atoms") ----------
/** Gradient-border bubble. kind: 'review' (p1, white inner) | 'border' (p2, #EFE5D0 inner) */
export function GradBubble({ kind = 'review', className = '', innerClass = '', style, children, icon }) {
  return (
    <div className={`pb-grad pb-grad--${kind} ${className}`} style={style}>
      <div className={`pb-grad-inner ${innerClass}`}>
        <p className="pb-grad-text">{children}</p>
        {icon}
      </div>
    </div>
  )
}

export function Sparkles() {
  return <img src="/svg/video-sparkles-two-2-c40439.svg" alt="" width="24" height="24" className="block h-[24px] w-[24px] flex-none" />
}

export function VideoCard({ src, className = '', boxClass = '', children, poster }) {
  return (
    <div className={`pb-vcard ${className}`}>
      <div className="pb-vcard-01">
        <div className={`pb-vcard-box ${boxClass}`}>
          {src && <video className="pb-vcard-video" src={src} poster={poster} muted loop playsInline autoPlay preload="auto" />}
          {children}
        </div>
      </div>
    </div>
  )
}

export function AgentNote({ title, className = '', titleClass = '', children }) {
  return (
    <div className={`pb-note ${className}`}>
      <h6 className={`pb-note-title ${titleClass}`}>{children ?? title}</h6>
      <LottiePlayer file="uznXokyKNrzxLiEzeS9ckfp3Ba4.json" className="pb-note-dots" />
    </div>
  )
}

export function Dots({ className = '' }) {
  return <LottiePlayer file="uznXokyKNrzxLiEzeS9ckfp3Ba4.json" className={`pb-note-dots ${className}`} />
}

/** Chip row with "•" separators; chips cascade in (§2.2: tween [0.44,0,0.05,1], 0.6/1.5/2.6s). */
export function ChipRow({ chips, className = '', chipClass = '', play, trigger = 'manual', durations = [0.6, 1.5, 2.6], delays = [0, 0, 0], style }) {
  const out = []
  chips.forEach((c, i) => {
    if (i) out.push(<span key={`d${i}`} className="pb-chip-dot">•</span>)
    out.push(
      <Motion
        key={`c${i}`}
        trigger={trigger}
        play={play}
        amount={0.5}
        from={{ opacity: 0, y: 50 }}
        transition={{ duration: durations[i] ?? 1, delay: delays[i] ?? 0, ease: [0.44, 0, 0.05, 1] }}
        className={`pb-chip ${chipClass}`}
      >
        {c}
      </Motion>,
    )
  })
  return <div className={`pb-chips ${className}`} style={style}>{out}</div>
}

export const SPRING = (delay = 0, bounce = 0.2, duration = 1) => ({ type: 'spring', bounce, duration, delay })

// Phone breakpoint (<810px, Framer Phone). Used where both trees would otherwise mount heavy media.
const PHONE_Q = '(max-width: 809.98px)'
export function useIsPhone() {
  const [phone, setPhone] = useState(() => typeof window !== 'undefined' && window.matchMedia(PHONE_Q).matches)
  useEffect(() => {
    const mq = window.matchMedia(PHONE_Q)
    const on = () => setPhone(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return phone
}
