// Shared building blocks for product pages A (specs/product-a.md conventions + §8).
import { StarIcon } from '../scroll-area/parts.jsx'
import '../../styles/product-a.css'

export const RAINBOW255 =
  'linear-gradient(255deg, #F2E59A 0%, #FEC796 14.8649%, #FB5646 32.8829%, #827ACC 52.2523%, #2E79D8 79.7297%, #ABABAB 100%)'

export function Eyebrow({ children, as: Tag = 'p', strong, className = '' }) {
  return <Tag className={`pa-eyebrow ${strong ? 'pa-eyebrow--strong' : ''} ${className}`}>{children}</Tag>
}

export function H2({ children, className = '', style }) {
  return <h2 className={`pa-h2 ${className}`} style={style}>{children}</h2>
}

export function Sub({ children, className = '', opacity = true, style }) {
  return (
    <div className={`pa-sub-wrap ${className}`} style={{ opacity: opacity ? 0.82 : 1, ...style }}>
      <p className="pa-sub">{children}</p>
    </div>
  )
}

// eyebrow + H2 + subtitle, gap 24 (16 mobile)
export function SectionTitle({ eyebrow, eyebrowStrong, title, sub, subOpacity = true, align = 'center', maxW, h2Max, subMax, className = '' }) {
  return (
    <div className={`pa-title pa-title--${align} ${className}`} style={{ maxWidth: maxW }}>
      {eyebrow && <Eyebrow strong={eyebrowStrong}>{eyebrow}</Eyebrow>}
      {title && <H2 style={{ maxWidth: h2Max }}>{title}</H2>}
      {sub && <Sub opacity={subOpacity} style={{ maxWidth: subMax }}>{sub}</Sub>}
    </div>
  )
}

// RAINBOW255 "gradient border": outer bg gradient + padding w + radius r; inner radius r - 1.
export function GradBorder({ r = 16, w = 2, angle, inner = '#FFFFFF', className = '', innerClassName = '', style, innerStyle, children }) {
  const bg = angle ? RAINBOW255.replace('255deg', `${angle}deg`) : RAINBOW255
  const ir = typeof r === 'string' ? r : r - 1
  return (
    <div className={className} style={{ background: bg, padding: w, borderRadius: r, ...style }}>
      <div className={innerClassName} style={{ background: inner, borderRadius: ir, ...innerStyle }}>{children}</div>
    </div>
  )
}

// Font Awesome 6 Sharp glyph by codepoint (Light 300 by default; 'regular' = Sharp Regular 400).
export function Fa({ code, size = 24, color = '#122023', weight = 'light', className = '', style }) {
  return (
    <span
      aria-hidden="true"
      className={`pa-fa ${weight === 'regular' ? 'pa-fa--regular' : ''} ${className}`}
      style={{ fontSize: size, lineHeight: `${size}px`, width: size, height: size, color, ...style }}
    >
      {String.fromCodePoint(code)}
    </span>
  )
}

// Same outline four-point star as the homepage scroll-area bullets (24x24, stroke #122023 1.5).
export function Star({ className = '' }) {
  return <span className={`pa-star ${className}`}><StarIcon /></span>
}

export function StarBullets({ items, className = '', textColor }) {
  return (
    <ul className={`pa-bullets ${className}`}>
      {items.map((b, i) => (
        <li key={i} className="pa-bullet">
          <Star />
          <span className="pa-bullet-text" style={textColor ? { color: textColor } : undefined}>{b}</span>
        </li>
      ))}
    </ul>
  )
}

export function SienaIcon({ size = 20, className = '' }) {
  return <img src="/svg/shopping-agent-Icon-Black-d8122.svg" alt="" aria-hidden="true" className={className} style={{ width: size, height: size, display: 'block', flex: 'none' }} />
}

export function Swash({ className = '', style }) {
  return <img src="/assets/MJbk4aQblPanJHyFV9X8Yg7JDqI.png" alt="" aria-hidden="true" className={`pa-swash ${className}`} style={style} />
}

export function Img({ src, className = '', style, fit = 'cover', pos, alt = '' }) {
  return <img src={src.startsWith('/') ? src : `/assets/${src}`} alt={alt} draggable="false" className={`block ${className}`} style={{ objectFit: fit, objectPosition: pos, ...style }} />
}

// Edge fades placed in Main (§3.2 / §4.1 / §5.1 / §6.2): absolute white -> transparent.
export function EdgeFades({ top, left = [233, 218], right = [197, 218], mTop, mLeft, mRight }) {
  return (
    <div className="pa-edge-fades" aria-hidden="true" style={{ '--t': `${top}px`, '--mt': `${mTop ?? top}px` }}>
      <div className="pa-edge pa-edge--l" style={{ '--w': `${left[0]}px`, '--h': `${left[1]}px`, '--mw': `${(mLeft || left)[0]}px`, '--mh': `${(mLeft || left)[1]}px`, '--mto': `${(mLeft || [])[2] ?? 0}px` }} />
      <div className="pa-edge pa-edge--r" style={{ '--w': `${right[0]}px`, '--h': `${right[1]}px`, '--mw': `${(mRight || right)[0]}px`, '--mh': `${(mRight || right)[1]}px`, '--mto': `${(mRight || [])[2] ?? 0}px` }} />
    </div>
  )
}
