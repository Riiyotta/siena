import { siteHref } from '../../routes.js'
import SienaLogo from '../nav/SienaLogo.jsx'

// specs/conversion.md "Conventions": dark `xlg` (padding 18px 24px, radius 16, 600 18/21.6) and
// `md` (padding 16px, radius 12, 500 16/16). Hover → rainbow, instant.
export function DarkButton({ href = '/book-a-demo', size = 'xlg', children = 'Book a demo', className = '' }) {
  return (
    <a href={siteHref(href)} className={`cv-btn cv-btn--${size} ${className}`}>
      {children}
    </a>
  )
}

// Font Awesome 6 Sharp Light glyph by codepoint (fonts already loaded in index.css).
export function FaIcon({ code, className = '' }) {
  return (
    <span className={`cv-fa ${className}`} aria-hidden="true">
      {String.fromCodePoint(code)}
    </span>
  )
}

// §1.1 header logo (pricing / book-a-demo only) — absolute, scrolls away with the page.
export function LeadHeader() {
  return (
    <a href="/" className="cv-lead-header" aria-label="Siena home">
      <div className="cv-lead-header-row">
        <span className="cv-lead-logo">
          <SienaLogo className="cv-lead-logo-svg" />
        </span>
      </div>
    </a>
  )
}

// §1.6 legal row (pricing / book-a-demo footer).
export function LegalRow() {
  return (
    <footer className="cv-legal">
      <div className="cv-legal-row">
        <a href={siteHref('/privacy-policy')}>Privacy Policy</a>
        <a href={siteHref('/terms-of-service')}>Terms of Service</a>
      </div>
    </footer>
  )
}
