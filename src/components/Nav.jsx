import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { NAV_OVERRIDES } from '../routes.js'
import '../styles/nav.css'
import SienaLogo from './nav/SienaLogo.jsx'
import UnderlineLink from './nav/UnderlineLink.jsx'
import { ProductsPanel, ResourcesPanel } from './nav/MegaMenu.jsx'
import { ANNOUNCEMENT_HREF, DEMO_HREF, NAV_LINKS } from './nav/navData.js'

const SCROLL_THRESHOLD = 160 // CLONE_SPEC §1: switches between scrollY 150–160, measured 160
const CLOSED_HEIGHT = 64
const RESOURCES_HEIGHT = 505 // Framer variant height for the Resources panel (saved HTML CSS)

// Per-route nav differences (CTA label/href, forced scrolled state) — see routes.js
function useNavOverrides() {
  return NAV_OVERRIDES[useLocation().pathname] ?? {}
}

function useScrolled(force = false) {
  const [scrolled, setScrolled] = useState(force)
  useEffect(() => {
    const onScroll = () => setScrolled(force || window.scrollY >= SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [force])
  return scrolled
}

function Chevron({ open }) {
  // public/svg/chevron-nav.svg: 12x7 glyph at (1,5) inside a 14x14 box, fill rgba(0,0,0,0.5)
  return (
    <span className="relative block h-[14px] w-[14px] flex-none">
      <svg
        className={`nav-chevron absolute left-[1px] top-[5px] h-[7px] w-[12px] ${open ? 'is-open' : ''}`}
        viewBox="0 0 11.632 6.692"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 5.817 6.691 L 5.379 6.254 L 0.438 1.313 L 0 0.875 L 0.875 0 L 1.313 0.437 L 5.817 4.967 L 10.32 0.464 L 10.757 0.026 L 11.632 0.876 L 11.195 1.313 L 6.254 6.254 L 5.817 6.692 Z"
          fill="rgba(0, 0, 0, 0.5)"
        />
      </svg>
    </span>
  )
}

function Logo() {
  return (
    <a href="/" aria-label="Siena" className="relative z-[6] flex h-[34px] w-[130px] flex-none items-center pl-[8px]">
      <span className="flex h-[34px] w-[122px] items-center justify-center">
        <SienaLogo className="h-[32px] w-[121px]" />
      </span>
    </a>
  )
}

function DemoButton({ className = '' }) {
  const { ctaLabel = 'Book a demo', ctaHref = DEMO_HREF } = useNavOverrides()
  return (
    <a
      href={ctaHref}
      className={`flex h-[48px] items-center justify-center rounded-[12px] bg-ink p-[16px] text-[16px] font-medium leading-[16px] text-white hover:bg-rainbow ${className}`}
    >
      <span className="whitespace-pre">{ctaLabel}</span>
    </a>
  )
}

/* ------------------------------------------------------------------ */
/* Desktop (>=768)                                                     */
/* ------------------------------------------------------------------ */

function DesktopNav() {
  const scrolled = useScrolled(useNavOverrides().forceScrolled)
  const [active, setActive] = useState(null) // 'products' | 'resources' | null
  const [shown, setShown] = useState(null) // last opened panel, kept mounted while closing
  const [contentHeight, setContentHeight] = useState(0)
  const contentRef = useRef(null)

  const open = (panel) => {
    setActive(panel)
    if (panel) setShown(panel)
  }

  useLayoutEffect(() => {
    if (!contentRef.current) return
    const el = contentRef.current
    const measure = () => setContentHeight(el.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [shown])

  let height = CLOSED_HEIGHT
  if (active === 'products') height = CLOSED_HEIGHT + contentHeight
  if (active === 'resources') height = RESOURCES_HEIGHT

  const solid = scrolled || active !== null

  return (
    <div className="fixed left-1/2 top-0 z-[8] hidden w-[1200px] max-w-full -translate-x-1/2 md:block">
      <nav className="flex flex-col items-center gap-[8px] px-[16px]">
        {/* Announcement bar */}
        <a
          href={ANNOUNCEMENT_HREF}
          className={`flex w-full flex-row items-center justify-center rounded-b-[16px] bg-ink pb-[12px] pl-[72px] pr-[32px] pt-[12px] ${scrolled ? 'gap-[4px]' : 'gap-[3px]'}`}
        >
          <span className="whitespace-pre font-display-italic text-[16px] font-light italic leading-[17.6px] text-ann-yellow underline">
            We raised a $17M Series A
          </span>
          <span className="flex flex-row items-center gap-[10px]">
            <span className="whitespace-pre text-[16px] leading-[19.2px] tracking-[-0.16px] text-ann-cream">
              to build The Agent of Record for consumer brands
            </span>
          </span>
        </a>

        {/* Pill */}
        <div
          className={`nav-pill relative flex w-full flex-col overflow-clip rounded-[16px] px-[8px] ${solid ? 'is-solid' : ''}`}
          style={{ height }}
          onMouseLeave={() => open(null)}
        >
          <div className="relative flex w-full flex-none flex-row items-center justify-between py-[8px]">
            <Logo />
            <div className="absolute left-1/2 top-1/2 z-[10] flex -translate-x-1/2 -translate-y-1/2 flex-row items-center gap-[56px]">
              {NAV_LINKS.map((link) =>
                link.href ? (
                  <div key={link.label} className="flex flex-col items-start" onMouseEnter={() => open(null)}>
                    <UnderlineLink href={link.href} labelClassName="text-[16px] font-medium leading-[16px] text-ink">
                      {link.label}
                    </UnderlineLink>
                  </div>
                ) : (
                  <div key={link.label} className="h-[40px]">
                    <button
                      type="button"
                      className="flex h-full cursor-pointer flex-row items-center gap-[5px] py-[5px]"
                      aria-expanded={link.panel ? active === link.panel : undefined}
                      onMouseEnter={() => open(link.panel)}
                      onFocus={() => open(link.panel)}
                    >
                      <span className="whitespace-pre text-[16px] font-medium leading-[16px] text-ink">{link.label}</span>
                      <Chevron open={link.panel !== null && active === link.panel} />
                    </button>
                  </div>
                ),
              )}
            </div>
            <DemoButton className="w-[128px]" />
          </div>

          <div
            ref={contentRef}
            className={`mm-content w-full flex-none ${active ? 'is-open' : ''}`}
            style={shown === 'resources' ? { height: RESOURCES_HEIGHT - CLOSED_HEIGHT } : undefined}
            aria-hidden={!active}
          >
            {shown === 'products' && <ProductsPanel />}
            {shown === 'resources' && <ResourcesPanel />}
          </div>
        </div>
      </nav>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile (<=767.98) — CLONE_SPEC §11 "Mobile nav"                     */
/* ------------------------------------------------------------------ */

function Star() {
  return (
    <span className="flex h-[21px] w-[21px] flex-none items-center justify-center">
      <svg className="nav-star h-[21px] w-[21px]" viewBox="0 0 21 21" aria-hidden="true">
        <path
          d="M 0 10.5 L 4.436 9.971 C 7.337 9.625 9.625 7.337 9.971 4.436 L 10.5 0 L 11.029 4.436 C 11.375 7.337 13.663 9.625 16.564 9.971 L 21 10.5 L 16.564 11.029 C 13.663 11.375 11.375 13.663 11.029 16.564 L 10.5 21 L 9.971 16.564 C 9.625 13.663 7.337 11.375 4.436 11.029 Z"
          fill="#FAF7F1"
        />
      </svg>
    </span>
  )
}

function MenuIcon({ open }) {
  // Spec: FA 6 Pro Regular "bars" 24px, close glyph when open — substituted with SVG per spec.
  return open ? (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 5 L19 19 M19 5 L5 19" stroke="#122023" strokeWidth="2" />
    </svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 5 H21 M3 12 H21 M3 19 H21" stroke="#122023" strokeWidth="2" />
    </svg>
  )
}

function MobileNav() {
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed inset-x-0 top-0 z-[8] bg-hero-bg px-[16px] md:hidden">
      <a
        href={ANNOUNCEMENT_HREF}
        className={`flex w-full flex-col items-center justify-center rounded-b-[16px] bg-ink px-[16px] py-[12px] ${open ? 'h-[70px]' : 'h-[45px]'}`}
      >
        <span className="flex flex-row items-center gap-[8px]">
          <Star />
          <span className="whitespace-pre font-display-italic text-[16px] font-light italic leading-[17.6px] text-ann-yellow">
            We raised a $17M Series A
          </span>
        </span>
        {open && (
          <span className="mt-auto text-center text-[14px] leading-[15.4px] text-ann-cream">
            to build the Agent of Record for consumer brands
          </span>
        )}
      </a>

      <div className="flex h-[68px] w-full flex-row items-center justify-between py-[8px]">
        <Logo />
        <button
          type="button"
          className="flex h-[52px] w-[52px] items-center justify-center rounded-[12px]"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-[32px] pb-[24px] pt-[16px]">
          <ul className="flex flex-col gap-[24px]">
            {NAV_LINKS.map((link) => (
              <li key={link.label} className="flex flex-col gap-[24px]">
                {link.href ? (
                  <a href={link.href} className="flex flex-row items-center justify-between">
                    <span className="text-[18px] font-semibold leading-[21.6px] text-ink">{link.label}</span>
                  </a>
                ) : (
                  <button type="button" className="flex w-full flex-row items-center justify-between text-left">
                    <span className="text-[18px] font-semibold leading-[21.6px] text-ink">{link.label}</span>
                    <span className="font-fa h-[16px] w-[10px] text-[16px] leading-[16px] text-ink">{''}</span>
                  </button>
                )}
                <div className="h-px w-full bg-black/20" />
              </li>
            ))}
          </ul>
          <DemoButton className="w-full" />
        </div>
      )}
    </div>
  )
}

export default function Nav() {
  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  )
}
