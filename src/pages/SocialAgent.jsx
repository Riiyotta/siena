// /social-agent — specs/product-a.md §2 (nav forced solid via NAV_OVERRIDES)
import { useEffect } from 'react'
import SocialHero from '../components/product/social/SocialHero.jsx'
import SocialFeatures from '../components/product/social/SocialFeatures.jsx'
import MoreInTheBox from '../components/product/social/MoreInTheBox.jsx'
import { ENTERPRISE_TEXT } from '../components/product/copy.js'
import { Enterprise, Faq, LogosBlock, ProductCta, ProductIntegrations } from '../components/product/sections.jsx'

const FAQ = [
  ['Do we have to switch off our current tool?', 'No. Connect your Meta accounts and run Siena alongside your current setup. Watch the difference side by side.'],
  ['Which channels does it support?', 'Instagram and Facebook today, organic and paid. TikTok soon.'],
  ['How do we stay in control as it ramps up?', 'Start in Draft Mode: Siena drafts, your team sends. Switch to auto-send once you trust it. You set the guardrails (follower thresholds, sensitive topics, keyword rules); Siena flags anything that crosses them.'],
  ['How does it handle influencers and creators?', 'Set a follower threshold. Anyone above it gets drafted and flagged for a human, so your team handles creators and press personally.'],
  ['What makes it different from a social-only tool?', 'Siena shares one brain across Support, Shopping, Reviews, and Social, so it knows who a customer is across every channel. Most social-only tools never have that context.'],
  ['Will it actually sound like our brand?', 'You write the voice rules in plain language. Siena learns from your guidelines and every post you approve. Refine in Draft Mode until it sounds like you.'],
]
const TILES = [
  { src: '/svg/social-agent-Vector-80b9e.svg', alt: 'facebook', w: 128, h: 26 },
  { src: '/svg/social-agent-Vector-3e1a2.svg', alt: 'Instagram', w: 138, h: 39 },
  { src: '/svg/integration-0-Logos.svg', alt: 'Shopify', w: 129, h: 37 },
  { src: '/assets/S1CA7BjDsQfmui51TcPvAyGtRxA.svg', alt: 'Yotpo', w: 113, h: 32, dark: true },
  { src: '/assets/KTiCJGm9tWo8Kt409KAYdr3T5FE.png', alt: 'klaviyo', w: 132, h: 74 },
  { src: '/svg/social-agent-Union-f4ce1.svg', alt: 'recharge', w: 187, h: 37 },
  { src: '/assets/4ivCVwCJknXe4l2YnVNdadGF4.svg', alt: 'AfterShip', w: 160, h: 32, dark: true },
  { text: 'Helpdesks' },
]
const ENTERPRISE = [
  [0xf132, 'AI & brand-safety guardrails', 'Follower thresholds, sensitive-topic rules, and approval gates keep every reply on-policy.'],
  [0xf023, 'SSO, roles, audit logs', 'SAML SSO, granular permissions, and a full trail of every action your team and the agent take.'],
  [0xf590, 'SOC 2 Type II compliant', "Your data and your customers' data handled to enterprise security and privacy standards."],
  [0xf590, 'Dedicated support & SLA', 'A named success manager, hands-on onboarding, and priority response with an uptime SLA.'],
]

export default function SocialAgent() {
  useEffect(() => {
    document.title = 'Siena Social Agent - The AI-native platform for Social'
  }, [])
  return (
    <div className="pa-page">
      <SocialHero />
      <LogosBlock />
      <SocialFeatures />
      <MoreInTheBox />
      <Faq items={FAQ} variant="social" />
      <ProductIntegrations variant="social" eyebrow="Integrations" title="Connects with your entire stack" tiles={TILES} />
      <Enterprise variant="social" cards={ENTERPRISE} text={ENTERPRISE_TEXT} />
      <ProductCta variant="social" blur="dark" />
    </div>
  )
}
