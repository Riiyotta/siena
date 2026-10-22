import { siteHref } from '../../routes.js'

// Shared primitives for the company/resources/partner pages (specs/company.md text-style table).

// Font Awesome 6 Sharp Light / Brands glyph by private-use codepoint.
export function FaIcon({ code, brands = false, className = '' }) {
  return (
    <span className={`${brands ? 'co-fa-brands' : 'co-fa'} ${className}`} aria-hidden="true">
      {String.fromCodePoint(code)}
    </span>
  )
}

// Btn-xlg: 58 tall, padding 18px 24px, radius 16, ink bg, Instrument Sans 600 18/21.6 white.
// hover = rainbow token (instant). `form` uses the form-submit rainbow measured on the Framer forms.
export function XlgButton({ href, onClick, type, form = false, className = '', children, ...rest }) {
  const cls = `co-btn${form ? ' co-btn--form' : ''} ${className}`
  if (href) {
    const external = /^(https?:|mailto:)/.test(href)
    return (
      <a href={external ? href : siteHref(href)} className={cls} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <button type={type || 'button'} onClick={onClick} className={cls} {...rest}>
      {children}
    </button>
  )
}

// Btn-secondary-md with an FA6 Brands icon (founder socials).
export function IconButton({ href, code, label, wide = false }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={`co-icon-btn${wide ? ' co-icon-btn--wide' : ''}`}>
      <FaIcon code={code} brands />
    </a>
  )
}

// "How we work" / partner benefits / referral criteria item.
export function FeatureItem({ icon, title, body, as: Title = 'h3', bodyClassName = '', className = '' }) {
  return (
    <div className={`co-feature ${className}`}>
      <FaIcon code={icon} className="co-feature-icon" />
      <Title className="co-hcard">{title}</Title>
      <p className={`co-feature-body ${bodyClassName}`}>{body}</p>
    </div>
  )
}

export const FOUR_POINT_STAR = 0xe5d6
