// specs/product-a.md §2.3 — title + sticky pill nav + 6 feature blocks + 1 testimonial.
import { useEffect, useRef, useState } from 'react'
import { ProductTestimonial } from '../sections.jsx'
import { Eyebrow, H2, StarBullets } from '../ui.jsx'
import { ph } from '../placeholder.js'
import PillNav from './PillNav.jsx'
import { ConvertVisual, EngageVisual, InboxVisual, ModerateVisual, PartnerVisual, UnderstandVisual } from './SocialVisuals.jsx'

const LINKS = [['engage', 'Engage'], ['moderate', 'Moderate'], ['automate', 'Automate'], ['partner', 'Partner'], ['understand', 'Understand'], ['convert', 'Convert']]
const b = (s, rest) => <><strong>{s}</strong>{rest}</>
const BLOCKS = [
  ['engage', 'Reply to everything that needs a response', 'Siena reads every comment and DM across organic and paid, classifies each one, and replies in your brand voice.', <EngageVisual />, [b('Classifies and acts', ' on every message'), b('Fresh brand-voice replies', ', with customizable personas'), b('Carries sensitive comments', ' into DMs')]],
  ['moderate', 'Protect your brand, and your ad spend', 'Siena moderates comments on arrival, hiding spam and negativity so every impression works as hard as your budget.', <ModerateVisual />, [b('24/7 moderation', ' across organic and paid'), b('Clean comment sections', ' under every post'), b('Auto-hide', ', delete, or flag')]],
  ['automate', 'One inbox for every conversation', 'Social and CX conversations land in one place, with saved views and auto-assigning surfacing the messages that matter.', <InboxVisual />, [b('One unified inbox for comments, DMs, & support tickets', ''), b('Context-aware assignment,', ' so tickets route correctly'), b('Customer profiles', ' across the lifecycle of a purchase')]],
  ['partner', 'Influencer partnerships, with a human touch', 'The moment a high-profile influencer engages, Siena hands it to your team, so relationships get the attention they deserve.', <PartnerVisual />, [b('Follower thresholds', ' set by your team'), b('Custom workflows', ' to handle micro-influencer requests'), b('Build relationships', ' that matter, with the time saved')]],
  ['understand', 'Questions answered. Ask Siena knows your customers.', 'Ask about your data in plain language to get answers across every social and CX conversation at once, and take action.', <UnderstandVisual />, [b('Unified intelligence', ' across every agent'), b('Ask anything', ' to build an instant report'), b('One unified agent', ' of record')]],
  ['convert', 'Turns conversations into checkouts', 'Siena carries a comment into a DM, answers the question, and drops the link, reaching customers ready to spend.', <ConvertVisual />, [b('Comment-to-DM', ' that closes the sale'), b('Answers product questions', ', in-thread'), b('Increase ROAS', ' through proactive engagement')]],
]

// Quote not in testimonials/data.js -> length-matched placeholder (name/role/logo real).
const SLIDE = [{ name: 'Cher General', role: 'Social Media & Affiliate Moderator', logo: 'fBcRNp3kFGpZ4Nwi8ikeOykouiI.png', logoAlt: 'eskiin', image: '5wyOmLf6STI1tDB4PFNMiGxcgQ.jpeg', imageAlt: 'Photo of Cher General', quote: ph(190) }]

function Block({ id, title, text, visual, bullets, blockRef }) {
  return (
    <div id={id} ref={blockRef} className="sf-block">
      <div className="sf-heading">
        <h3 className="pa-h3 text-center">{title}</h3>
        <p className="pa-sub text-center" style={{ maxWidth: 564 }}>{text}</p>
      </div>
      <div className="sf-visual-col">
        <div className={`sf-vwrap sf-vwrap--${id}`}>{visual}</div>
        <StarBullets items={bullets} className="sf-bullets" />
      </div>
    </div>
  )
}

export default function SocialFeatures() {
  const refs = useRef([])
  const [active, setActive] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      let a = 0
      refs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= 315) a = i
      })
      setActive(a)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const pick = (id) => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 300, behavior: 'smooth' })
  }
  const blocks = BLOCKS.map(([id, t, x, v, bl], i) => <Block key={id} id={id} title={t} text={x} visual={v} bullets={bl} blockRef={(el) => (refs.current[i] = el)} />)
  return (
    <section className="sf-section">
      <div className="pa-title pa-title--center" style={{ maxWidth: 1062 }}>
        <Eyebrow strong>Your social, covered</Eyebrow>
        <H2 style={{ maxWidth: 800 }}>Your Agent of Record for every conversation on Social</H2>
      </div>
      <PillNav links={LINKS} active={active} onPick={pick} />
      <div className="sf-scroll">
        <div className="sf-content">
          {blocks[0]}
          <ProductTestimonial variant="social" slides={SLIDE} />
          {blocks.slice(1)}
        </div>
      </div>
    </section>
  )
}
