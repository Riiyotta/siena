// /ask-siena — specs/product-a.md §6
import { useEffect } from 'react'
import { AskHero, ChipNav, FeaturesA, FeaturesB, KeyCapabilities, Playbooks, SlackSection } from '../components/product/ask/AskParts.jsx'
import { Enterprise, LogosBlock, ProductCta, ProductIntegrations, ProductTestimonial } from '../components/product/sections.jsx'
import { EdgeFades } from '../components/product/ui.jsx'
import { ENTERPRISE_TEXT } from '../components/product/copy.js'
import { ph } from '../components/product/placeholder.js'

// Quotes not in testimonials/data.js (Jessica Weiss's quote here differs) -> length-matched placeholders.
const COTERIE = { logo: 'ZeJTO989NVjG9cfH69ugd19p4C0.svg', logoAlt: 'Coterie' }
const STORY = 'https://www.siena.cx/customer-stories'
const SLIDES = [
  { ...COTERIE, name: 'Rebecca Blount', role: 'Director, Customer Experience & Fulfillment', image: 'DkKUcZ5MMlNWr9dt9V653q2eWmI.jpg', imageAlt: 'Photo of Rebecca Blount', quote: ph(110), href: STORY },
  { name: 'Jessica Weiss', role: 'CX Lead Product Partner', logo: 'SpxY1h6sqe6POaCpvGhqSGbxc.svg', logoAlt: 'Prose', image: 'CSFOwfJPv9MTZrAS0E4tQAAy1Y.webp', imageAlt: 'Photo of Jessica Weiss', quote: ph(200), href: STORY },
  { ...COTERIE, name: 'Taryn Oubre', role: 'CX Senior Manager', image: '6m3nbsOefa5MuiJ7cZLEbjcG3Oc.webp', imageAlt: 'Photo of Taryn Oubre', quote: ph(176), href: STORY },
]
const TILES = [
  { src: '/svg/integration-0-Logos.svg', alt: 'Shopify', w: 129, h: 37 },
  { src: '/assets/S1CA7BjDsQfmui51TcPvAyGtRxA.svg', alt: 'Yotpo', w: 113, h: 32, dark: true },
  { src: '/assets/4ivCVwCJknXe4l2YnVNdadGF4.svg', alt: 'AfterShip', w: 160, h: 32, dark: true },
  { src: '/assets/tRZ3CBzNJw2sWeG9jlHuvjm3vs.svg', alt: 'ShipBob', w: 143, h: 37 },
  { src: '/assets/lJNzlwA3aybr9aHp0a2x2qsApOs.svg', alt: 'Loop', w: 101, h: 33, dark: true },
  { src: '/svg/integration-5-Union.svg', alt: 'recharge', w: 187, h: 37 },
  { text: 'Helpdesks' },
  { text: 'Custom Apps' },
]
const ENTERPRISE = [
  [0xf2f7, 'Compliances', 'Certified against SOC 2, GDPR, CPRA, and HIPAA standards.'],
  [0xf132, 'AI guardrails', 'System-level and configurable boundaries on tone, topics, and actions.'],
  [0xf023, 'SSO, roles, logs', 'SAML SSO, granular permissions, and a full trail of every action.'],
  [0xf590, 'Dedicated support & SLA', 'A named success manager, hands-on onboarding, and an uptime SLA.'],
]

export default function AskSiena() {
  useEffect(() => {
    document.title = 'Ask Siena: AI Agent Builder for CX and Customer Intelligence'
  }, [])
  return (
    <div className="pa-page pa-page--ask">
      <AskHero />
      <EdgeFades top={672} />
      <div className="ask-logos"><LogosBlock /></div>
      <ChipNav />
      <FeaturesA />
      <FeaturesB />
      <KeyCapabilities>
        <ProductTestimonial variant="ask" slides={SLIDES} />
      </KeyCapabilities>
      <Playbooks />
      <SlackSection />
      <ProductIntegrations variant="ask" title="Works with your existing stack" tiles={TILES} />
      <Enterprise variant="ask" cards={ENTERPRISE} text={ENTERPRISE_TEXT} />
      <ProductCta variant="ask" blur="dark7" />
    </div>
  )
}
