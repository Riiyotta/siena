import ChatMock from '../components/scroll-area/ChatMock.jsx'
import { AddonsHero } from '../components/conversion/ConvHero.jsx'
import StickyArea from '../components/conversion/StickyArea.jsx'
import ConvMetrics from '../components/conversion/ConvMetrics.jsx'
import ConvFeatures from '../components/conversion/ConvFeatures.jsx'
import ConvCta from '../components/conversion/ConvCta.jsx'
import { IntegrationsCard, PortraitCard } from '../components/conversion/CompareCards.jsx'
import '../styles/conversion.css'

// /ai-native-customer-service-vs-help-desk-ai-add-ons — specs/conversion.md §6. Nav/Footer from App.jsx.
const BLOCKS = [
  {
    title: 'Purpose-built AI vs. Help Desk AI add-ons',
    desc: 'Siena isn’t an afterthought—it’s built from the ground up to offer stable, scalable AI customer support. Unlike AI add-ons that were built to support other core features (like a help desk), Siena delivers:',
    bullets: [
      ['Reliable Stability:', 'Built specifically to handle customer conversations with unmatched consistency.'],
      ['Focused Expertise:', 'Trained exclusively on e-commerce support scenarios, not diluted by unrelated tasks.'],
      ['Easy Implementation:', 'Integrates smoothly with your existing tools, ensuring a frictionless transition from add-ons.'],
    ],
    card: ({ mobile, play, key }) => <ChatMock key={key} variant={0} mobile={mobile} play={play} />,
  },
  {
    title: 'Predictable AI You Can Actually Trust',
    desc: 'When AI is an add-on to help desk software, performance can fluctuate wildly. Tickets get mishandled, interactions go off-script, and brand reputation suffers. Siena’s dedicated AI delivers instead.',
    bullets: [
      ['Consistent, On-Brand Responses:', 'No "rogue" behavior—just steady, policy-aligned interactions.'],
      ['Stable Performance at Scale:', 'Handle thousands of interactions reliably without unexpected breakdowns.'],
      ['Clear, Transparent Control:', "You always know how Siena's AI is working, why it's responding, and how to adjust it."],
    ],
    // Desktop = homepage ChatMock v2; phone = "Image - portait" card (§6.7)
    card: ({ mobile, play, key }) => (mobile ? <PortraitCard key={key} /> : <ChatMock key={key} variant={1} play={play} />),
  },
  {
    title: 'Switching from an Help Desk AI Add-on? Easy!', // sic (live)
    desc: 'Making the leap to dedicated AI shouldn’t disrupt your operations. Siena connects seamlessly to your current help desk, and our onboarding experts handle migration painlessly, swiftly transferring your existing setup and content.',
    bullets: [
      ['Plug-and-play integration', 'with existing tools'],
      ['Minimal setup time', 'to get Siena fully operational'],
      ['Dedicated onboarding', 'team to ensure smooth transition.'],
    ],
    card: ({ key }) => <IntegrationsCard key={key} />,
  },
].map((b, i) => ({ ...b, button: true, mobileDescFirst: i > 0 }))

export default function AiNativeVsAddOns() {
  return (
    <div className="cv-addons">
      <AddonsHero />
      <StickyArea kind="addons" blocks={BLOCKS} />
      <ConvMetrics kind="addons" />
      {/* EXACT REPLICA of a live phone quirk (§6.7): a 1000px empty white section between Metrics and
          Features (a Framer component that renders nothing at the phone breakpoint). Phone only. */}
      <div className="cv-addons-empty" aria-hidden="true" />
      <ConvFeatures />
      <ConvCta title="Join brands who replaced AI add-ons with Siena" kind="addons" />
    </div>
  )
}
