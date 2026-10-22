// specs/product-a.md §2.3 feature-block mock visuals (positions from social-agent-1440.tree.txt).
import { Appear, EASE_OUT, SPRING, TypeIn, useInView } from '../motion.jsx'
import { GradBorder, SienaIcon } from '../ui.jsx'
import { PostCard } from './SocialHero.jsx'
import { useRef } from 'react'

const BrandAvatar = () => (
  <span className="so-avatar so-avatar--brand"><img src="/svg/social-agent-Vector-1b0ea.svg" alt="" /></span>
)
const Avatar = ({ src, className = '' }) => <img src={`/assets/${src}`} alt="" className={`so-avatar ${className}`} />

function Donut({ className = '', style, children, innerClassName = '' }) {
  return (
    <div className={`sv-donut ${className}`} style={style}>
      <div className={`sv-metric ${innerClassName}`}>{children}</div>
    </div>
  )
}

/* 1. Engage */
export function EngageVisual() {
  const Panel = ({ title, icon, iconSize, who, whoImg, q, reply, cls }) => (
    <Donut className={cls}>
      <div className="sv-head">
        <span className="sv-head-avatar"><img src={icon} alt="" style={{ width: iconSize, height: iconSize }} /></span>
        <h6 className="pa-h6">{title}</h6>
      </div>
      <div className="sv-social">
        <div className="sv-social-top">
          <Avatar src={whoImg} />
          <p className="pa-tiempos sv-t18">{who}</p>
        </div>
        <div className="sv-social-body">{q}{reply}</div>
      </div>
    </Donut>
  )
  return (
    <div className="sv-card sv-card--engage">
      <div className="sv-clip"><img src="/assets/wVlAjVzRd4gIeCBmbHQla0wyI.webp" alt="" className="sv-engage-bg" /></div>
      <Panel
        cls="sv-engage-ig"
        title="Instagram" icon="/svg/social-agent-Avatar-0a99a.svg" iconSize={22} who="Bea" whoImg="Tfrso7q4pqJoHA4O5xhbikPQw0.png"
        q={<Appear on="view" y={80} dur={1} delay={0.5} ease={SPRING} className="sv-bubble sv-ig-q"><p className="pa-tiempos sv-t18">omg do you ship to canada??? 🥺</p></Appear>}
        reply={
          <Appear on="view" y={80} dur={1} delay={0.8} ease={SPRING} className="sv-ig-r">
            <GradBorder r={16} innerClassName="p-[12px]"><p className="pa-tiempos sv-t18">Yes! We ship everywhere across Canada, the US, and the EU 🌎</p></GradBorder>
          </Appear>
        }
      />
      <Panel
        cls="sv-engage-fb"
        title="Facebook ads" icon="/svg/social-agent-Avatar-fe29a.svg" iconSize={28} who="Sam" whoImg="3ehhDGuTFIBawZROIuwj6v0WkU.webp"
        q={<Appear on="view" y={80} dur={1} delay={0.5} ease={SPRING} className="sv-bubble sv-bubble--r16 sv-fb-q"><p className="pa-tiempos sv-t18">I need it in every flavour</p></Appear>}
        reply={
          <Appear on="view" y={80} dur={1} delay={0.8} ease={SPRING} className="sv-fb-r">
            <GradBorder r={16} innerClassName="sv-fb-r-in" innerStyle={{ borderRadius: 14 }}>
              <BrandAvatar />
              <div className="sv-fb-r-text">
                <p className="pa-tiempos sv-t18"><strong>True Sea Moss</strong></p>
                <p className="pa-tiempos sv-t18">Yessss, you’re going to love mango 🫶</p>
              </div>
            </GradBorder>
          </Appear>
        }
      />
    </div>
  )
}

/* 2. Moderate */
const MOD = [
  ['overpriced for what it is 😬', 168, '↳Keyword "overpriced"', 'Hidden by Siena', '#F8B57F', 39, 44, 150, 90],
  ['Ugly  🤮', 56, '↳Harmful', 'Deleted by Siena', '#FF5D4E', 136.6, 140.4, 111, 150],
  ['$$$ bUY fOlloWers', 128, '↳Spam', 'Deleted by Siena', '#FF5D4E', 237.2, 240.8, 90, 150],
]
export function ModerateVisual() {
  const ref = useRef(null)
  const seen = useInView(ref)
  return (
    <div ref={ref} className="sv-card sv-card--moderate">
      {MOD.map(([text, strike, cap, tag, dot, top, labelTop, y, sx], i) => (
        <div key={tag + i}>
          <Appear on={seen} y={y} dur={0.4} delay={0.2 + i * 0.3} ease={EASE_OUT} className="sv-donut sv-mod-card" style={{ top }}>
            <div className="sv-mod-in">
              <div className="sv-mod-row">
                <Avatar src="iCVj9o5X7OyMnsoPTP5rHyEiWr0.png" />
                <div className="sv-mod-col">
                  <p className="so-caption"><strong>@itssam.orders</strong></p>
                  <p className="so-caption sv-nowrap">{text}</p>
                </div>
              </div>
              <span className="sv-strike" style={{ width: strike }}>
                <Appear on={seen} x={-sx} from={1} dur={0.4} delay={0.5 + i * 0.3} ease={EASE_OUT} className="sv-strike-line" />
              </span>
            </div>
          </Appear>
          <div className="sv-mod-label" style={{ top: labelTop }}>
            <p className="pa-tiempos sv-cap"><TypeIn text={cap} play={seen} /></p>
            <Appear on={seen} y={150} dur={0.4} delay={0.3 + i * 0.3} ease={EASE_OUT} className="sv-tag">
              <span className="sv-dot" style={{ background: dot }} />
              <p className="pa-tiempos sv-t14">{tag}</p>
            </Appear>
          </div>
        </div>
      ))}
    </div>
  )
}

/* 3. Automate / inbox */
const Badge = ({ fa }) => (
  <span className="sv-badge" aria-hidden="true">
    {fa ? <span className="pa-fa" style={{ fontSize: 12, lineHeight: '12px', opacity: 0.8 }}>{String.fromCodePoint(0xf0e0)}</span> : <img src="/svg/social-agent-Avatar-0a99a.svg" alt="" />}
  </span>
)
const INBOX = [
  ['@sarah.m', 'Is this vegetarian?', '⤶ Responded by Siena', <Avatar src="iCVj9o5X7OyMnsoPTP5rHyEiWr0.png" />],
  ['Aisha Patel', 'Hii! Are you accepting influencer applications? Would love to partner!', '⤴︎ Routed to the CX team', <Avatar src="zFIsk8jathqNii9MqXST7kzQ.webp" />],
  ['T. Anderson', 'My order number is #1126508.', '⤶ Responded by Siena', <span className="so-avatar" style={{ background: 'linear-gradient(#FF5D4E, #ABABAB)' }} />, true],
]
export function InboxVisual() {
  return (
    <div className="sv-card sv-card--inbox">
      <div className="sv-donut sv-inbox-wrap">
        <div className="sv-docs">
          <div className="sv-inbox-left">
            <div className="sv-inbox-head">
              <div className="flex items-center gap-[10px]">
                <img src="/svg/social-agent-Icon-Black-19603.svg" alt="" style={{ width: 25, height: 25 }} />
                <p className="pa-tiempos sv-t20">Inbox</p>
              </div>
              <span className="sv-count">21</span>
            </div>
            <div className="sv-hr" />
            <div className="sv-filters">
              <span className="sv-filter"><span className="sv-dot" style={{ background: '#2E79D8' }} />Assigned to me</span>
              <span className="sv-filter">all chanels</span>
            </div>
            <div className="sv-inbox-list">
              {INBOX.map(([n, b, st, av, mail]) => (
                <div key={n}>
                  <div className="sv-inbox-row">
                    <span className="relative flex-none">{av}<Badge fa={mail} /></span>
                    <div className="sv-inbox-col">
                      <p className="sv-name">{n}</p>
                      <p className="sv-body sv-ellipsis">{b}</p>
                      <p className="sv-status">{st}</p>
                    </div>
                  </div>
                  <div className="sv-hr" />
                </div>
              ))}
            </div>
          </div>
          <div className="sv-inbox-right">
            <Appear on="view" y={40} dur={0.5} delay={0.3} ease={EASE_OUT} className="sv-thread">
              <span className="relative flex-none"><Avatar src="iCVj9o5X7OyMnsoPTP5rHyEiWr0.png" /><Badge /></span>
              <div className="sv-thread-col">
                <p className="sv-name">@sarah.m</p>
                <div className="sv-thread-card">
                  <p className="sv-body">commented on this post</p>
                  <div className="flex items-center gap-[4px]">
                    <img src="/assets/eiC7nOCos1WvCqwxBMc1EKmcyC0.webp" alt="" className="sv-thumb44" />
                    <p className="sv-body">Is this vegetarian?</p>
                  </div>
                  <p className="sv-status">↩︎ Siena replied</p>
                  <div className="flex items-start gap-[8px]">
                    <span className="relative flex-none"><BrandAvatar /><Badge /></span>
                    <div className="flex min-w-0 flex-col gap-[6px]">
                      <p className="sv-name">@thetrueseamoss / Siena Agent</p>
                      <p className="sv-body sv-ellipsis">Hi Sarah! Yes, all of our products are 100% vegetarian (and vegan) friendly. 💜 Here's a link with the full ingredient list: www.trueseamoss.com/ingredients</p>
                    </div>
                  </div>
                </div>
              </div>
            </Appear>
            <Appear on="view" y={18} dur={0.5} delay={0.3} ease={EASE_OUT} className="sv-thread">
              <span className="relative flex-none"><Avatar src="iCVj9o5X7OyMnsoPTP5rHyEiWr0.png" /><Badge fa /></span>
              <div className="sv-thread-col">
                <p className="sv-name">smitchel@gmail.com</p>
                <div className="sv-thread-card">
                  <p className="sv-body sv-ellipsis">Clarifying the status of my order…</p>
                  <p className="sv-status">↩︎ Siena replied</p>
                </div>
              </div>
            </Appear>
          </div>
        </div>
      </div>
    </div>
  )
}

/* 4. Partner / influencer */
export function PartnerVisual() {
  return (
    <div className="sv-card sv-card--partner">
      <Appear on="view" y={150} dur={0.4} delay={0.05} ease={EASE_OUT} className="sv-donut sv-center sv-gaby">
        <div className="sv-mod-in sv-gaby-in">
          <div className="flex gap-[4px]">
            <Avatar src="QXVdJrspyMIrzetlaF8nBLHgJqc.webp" />
            <div className="flex flex-col gap-[4px] pt-[4px]">
              <p className="so-caption"><strong className="!font-bold">Gaby</strong></p>
              <p className="so-caption">Hi I’ve been loving your brand lately, are you currently accepting new influencers?</p>
            </div>
          </div>
          <div className="sv-meta">
            <span><span className="pa-fa" style={{ fontSize: 12 }}>{String.fromCodePoint(0xf16d)}</span> Instagram</span>
            <span>@gaby</span>
          </div>
          <div className="sv-meta">
            <span><b>124K</b> followers</span>
            <span><b>847</b> posts</span>
          </div>
        </div>
      </Appear>
      <img src="/svg/social-agent-Sticky-Image-d5f20.svg" alt="" className="sv-connector" />
      <span className="sv-node"><span className="sv-node-glow" /><span className="sv-node-dot" /></span>
      <Appear on="view" y={150} dur={0.4} delay={0.05} ease={EASE_OUT} className="sv-center sv-detected">
        <GradBorder r={16} style={{ boxShadow: '0 3px 8px rgba(167,160,146,0.3)' }} innerClassName="p-[12px]">
          <p className="so-caption"><strong className="!font-bold">Influencer detected</strong></p>
        </GradBorder>
      </Appear>
      <Appear on="view" y={150} dur={0.4} delay={0.45} ease={EASE_OUT} className="sv-tag sv-center sv-flagged">
        <span className="sv-dot" style={{ background: '#FF5D4E' }} />
        <p className="pa-tiempos sv-t14">Flagged for human review</p>
      </Appear>
      <Appear on="view" y={70} dur={0.4} delay={0.65} ease={EASE_OUT} className="sv-donut sv-center sv-thomas">
        <div className="sv-mod-in sv-gaby-in">
          <div className="flex gap-[4px]">
            <span className="relative flex-none"><Avatar src="3ehhDGuTFIBawZROIuwj6v0WkU.webp" /><span className="sv-badge sv-badge--siena"><SienaIcon size={12} /></span></span>
            <div className="flex flex-col gap-[4px] pt-[4px]">
              <p className="so-caption"><strong className="!font-bold">Thomas</strong></p>
              <p className="so-caption">Hi Gaby, Thomas here. Let's talk!</p>
            </div>
          </div>
        </div>
      </Appear>
    </div>
  )
}

/* 5. Understand / Ask Siena */
export function UnderstandVisual() {
  return (
    <div className="sv-card sv-card--understand">
      <div className="sv-clip">
        <img src="/assets/14qqqYRz84JYwi1FSGVb5aEW6k.webp" alt="" className="sv-photo" style={{ top: 295, left: 200, width: 132, height: 132, transform: 'rotate(10deg)' }} />
        <img src="/assets/iAPB6Yf4dNM4vi0V9jq2RIoo6AQ.webp" alt="" className="sv-photo" style={{ top: 303, left: 304, width: 146, height: 146, transform: 'rotate(-20deg)' }} />
        <img src="/assets/eiC7nOCos1WvCqwxBMc1EKmcyC0.webp" alt="" className="sv-photo" style={{ top: 303, left: 400, width: 146, height: 146, transform: 'rotate(20deg)' }} />
        <Appear on="view" y={80} dur={1} delay={0.73} ease={SPRING} className="sv-answer">
          <div className="sv-answer-in">
            <div className="flex items-center gap-[8px]">
              <img src="/svg/social-agent-sparkles-two-2-6aa85.svg" alt="" style={{ width: 16, height: 16 }} />
              <p className="pa-tiempos sv-t14">Based on the data these are the most talked about products:</p>
            </div>
            <div className="flex gap-[3px]">
              {[['Mango Jelly', '456'], ['Gummies', '421'], ['Berries Jelly', '332']].map(([a, n]) => (
                <span key={a} className="sv-chip">{a}<span>•</span>{n} mentions</span>
              ))}
            </div>
            <p className="pa-tiempos so-t12">*Across Instagram, Facebook, Email, CX data</p>
          </div>
        </Appear>
        <Appear on="view" y={80} dur={1} delay={0.33} ease={SPRING} className="sv-prompt">
          <GradBorder r={28} style={{ boxShadow: '0 3px 8px rgba(167,160,146,0.3)' }} innerClassName="sv-prompt-in" innerStyle={{ borderRadius: 26 }}>
            <SienaIcon size={20} />
            <span className="pa-fd sv-prompt-text">What's trending well this week?</span>
          </GradBorder>
        </Appear>
      </div>
    </div>
  )
}

/* 6. Convert */
export function ConvertVisual() {
  return (
    <div className="sv-card sv-card--convert">
      <PostCard
        className="sv-convert-post"
        photo="iAPB6Yf4dNM4vi0V9jq2RIoo6AQ.webp"
        photoPos="50% 0%"
        caption="New flavors out now!"
        comment="Where do I buy?"
        reply={
          <div className="flex flex-col gap-[4px]">
            <p className="so-caption"><strong>thetrueseamoss</strong></p>
            <p className="so-caption">Most local supermarkets and our website, sending a link! 🙌🏼</p>
          </div>
        }
      />
      <Appear on="view" y={80} dur={1} delay={1.6} ease={SPRING} className="sv-convert-dm">
        <div className="sv-convert-dm-head">
          <Avatar src="D3TQ38q4HpOxmxHoD1u1AW40NI.png" />
          <p className="pa-tiempos sv-t18">Maria</p>
        </div>
        <div className="sv-convert-dm-body">
          <Appear on="view" y={80} dur={1} delay={1.9} ease={SPRING} className="sv-convert-msg">
            <p className="pa-tiempos so-t12">Hiii here's the link to buy our <u>Multifruit Gummies</u> directly from our website!</p>
          </Appear>
          <Appear on="view" y={50} dur={1} delay={2.2} ease={SPRING}>
            <GradBorder r={16} inner="#FAF7F1" innerClassName="sv-convert-prod">
              <span className="sv-convert-thumb"><img src="/assets/iAPB6Yf4dNM4vi0V9jq2RIoo6AQ.webp" alt="" /></span>
              <div className="flex flex-col gap-[8px]">
                <p className="pa-tiempos so-t12">Voyager Tumbler - Signature</p>
                <p className="pa-tiempos so-t12"><s>$39.99</s>&nbsp;&nbsp;&nbsp;$27.99</p>
              </div>
            </GradBorder>
          </Appear>
        </div>
      </Appear>
    </div>
  )
}
