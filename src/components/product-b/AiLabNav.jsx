import { useState } from 'react'
import { Link } from 'react-router-dom'
import SienaLogo from '../nav/SienaLogo.jsx'
import { siteHref } from '../../routes.js'
import { Fa } from './shared.jsx'

// §5.0 "Dark" nav for /ai-lab (the global Nav is hidden via NAV_OVERRIDES.hideNav).
// Desktop ≥810: fixed 1440x72 #122023 bar, white links, hover dropdown panels. Phone: cream 390x80 bar.
const PLATFORM = [
  { icon: 0xf590, label: 'Customer Service Agent', href: '/' },
  { icon: 0xf005, label: 'Reviews Agent', href: '/ai-review-management' },
  { icon: 0xf6da, label: 'Memory', href: '/memory' },
  { icon: 0xf847, label: 'Shopping Agent', soon: true },
  { icon: 0xf672, label: 'Insights', soon: true },
  { icon: 0xe4e2, label: 'Integrations', href: '/integrations' },
]
// Resources / Partners / Company panels were not captured individually: same panel style, footer link sets.
const PANELS = {
  Platform: PLATFORM,
  Resources: [
    { icon: 0xf1ea, label: 'Blog', href: '/blog' },
    { icon: 0xf0c0, label: 'Community', href: '/community' },
    { icon: 0xf073, label: 'Events', href: '/events' },
    { icon: 0xf03d, label: 'Webinars', href: '/webinars' },
    { icon: 0xf1ec, label: 'ROI Calculator', href: '/roi-calculator' },
  ],
  Partners: [
    { icon: 0xf2b5, label: 'Partner with Siena', href: '/partner-with-siena' },
    { icon: 0xf06b, label: 'Refer a Friend', href: '/refer-a-friend' },
  ],
  Company: [
    { icon: 0xf1ad, label: 'About Us', href: '/about-us' },
    { icon: 0xf0b1, label: 'Careers', href: '/careers' },
    { icon: 0xf0c0, label: 'Customers', href: '/customers' },
  ],
}
const LINKS = ['Platform', 'Customers', 'Resources', 'Partners', 'Company']

function SmartLink({ href, className, children }) {
  const to = siteHref(href)
  return to.startsWith('http') ? (
    <a href={to} className={className}>{children}</a>
  ) : (
    <Link to={to} className={className}>{children}</Link>
  )
}

function Chevron({ open }) {
  return (
    <svg className={`al-chev ${open ? 'is-open' : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M1 4l6 6 6-6" stroke="#FFFFFF" strokeWidth="1" />
    </svg>
  )
}

function Panel({ items }) {
  return (
    <div className="al-panel">
      <ul className="al-panel-list">
        {items.map((it) => (
          <li key={it.label} className={`al-panel-row ${it.soon ? 'is-soon' : ''}`}>
            <span className="al-panel-icon">
              <Fa code={it.icon} size={16} style={{ color: '#E4E6E7' }} />
            </span>
            {it.soon ? (
              <>
                <span className="al-panel-label">{it.label}</span>
                <span className="al-soon">
                  <Fa code={0xe31b} size={12} style={{ color: '#F7DD93' }} />
                  Coming soon!
                </span>
              </>
            ) : (
              <SmartLink href={it.href} className="al-panel-label al-ul">
                {it.label}
              </SmartLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function AiLabNav() {
  const [open, setOpen] = useState(null)
  const [menu, setMenu] = useState(false)
  return (
    <>
      <header className="al-nav" onMouseLeave={() => setOpen(null)}>
        <Link to="/" className="al-logo" aria-label="Siena home">
          <img src="/svg/ai-lab-nav-logo-white.svg" alt="siena" width="121" height="32" />
        </Link>
        <nav className="al-links">
          {LINKS.map((l) =>
            PANELS[l] ? (
              <div key={l} className="al-item" onMouseEnter={() => setOpen(l)} onFocus={() => setOpen(l)}>
                <button type="button" className="al-link" aria-expanded={open === l}>
                  {l}
                  <Chevron open={open === l} />
                </button>
                {open === l && <Panel items={PANELS[l]} />}
              </div>
            ) : (
              <div key={l} className="al-item" onMouseEnter={() => setOpen(null)}>
                <SmartLink href="/customers" className="al-link al-ul">
                  {l}
                </SmartLink>
              </div>
            ),
          )}
        </nav>
        <SmartLink href="/book-a-demo" className="al-cta">
          Book a demo
        </SmartLink>
      </header>

      {/* Phone: cream bar, dark logo, 52x52 menu button. Open state not captured → simple link panel. */}
      <header className="al-mnav">
        <Link to="/" aria-label="Siena home" className="al-mlogo">
          <SienaLogo />
        </Link>
        <button type="button" className="al-mbtn" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d={menu ? 'M5 5l14 14M19 5L5 19' : 'M3 6h18M3 12h18M3 18h18'} stroke="#122023" strokeWidth="1.5" />
          </svg>
        </button>
        {menu && (
          <div className="al-mpanel">
            {Object.values(PANELS)
              .flat()
              .filter((i) => !i.soon)
              .map((i) => (
                <SmartLink key={i.label + i.href} href={i.href} className="al-mlink">
                  {i.label}
                </SmartLink>
              ))}
            <SmartLink href="/book-a-demo" className="al-mlink">
              Book a demo
            </SmartLink>
          </div>
        )}
      </header>
    </>
  )
}
