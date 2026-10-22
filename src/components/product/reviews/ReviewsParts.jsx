// specs/product-a.md §3 — /ai-review-management hero visual, sticky card variants, timer list, integrations bento.
import { useEffect, useRef, useState } from 'react'
import BookDemoButton from '../../cta/BookDemoButton.jsx'
import { Appear, EASE_H1, EASE_SUB, SPRING, prefersReducedMotion, useInView } from '../motion.jsx'
import { Eyebrow, Fa, GradBorder, H2, SectionTitle, StarBullets, Swash } from '../ui.jsx'

export function Stars({ n = 5, size = 12, gap = 2 }) {
  return (
    <span className="rv-stars" style={{ gap }} aria-label={`${n} stars`}>
      {Array.from({ length: n }, (_, i) => (
        <img key={i} src="/svg/ai-review-management-Vector-d70f1.svg" alt="" style={{ width: size, height: size }} />
      ))}
    </span>
  )
}

/* §3.1 Hero */
export function ReviewsHero() {
  return (
    <section className="ph-hero ph--reviews">
      <img src="/assets/Xhz1QysnqTj6mnDf7ElHTJ5Kkxc.png" alt="" aria-hidden="true" className="rv-bg2" />
      <img src="/assets/Xhz1QysnqTj6mnDf7ElHTJ5Kkxc.png" alt="" aria-hidden="true" className="rv-bg1" />
      <div className="ph-content">
        <div className="ph-copy">
          <div className="ph-heading">
            <Appear className="ph-swash" y={200} delay={0.2} ease={EASE_H1}><Swash className="!static !h-full !w-full" /></Appear>
            <Appear y={200} delay={0.2} ease={EASE_H1} className="relative z-[1]">
              <h1 className="pa-h1">Meet your<br /><em>Reviews</em><br className="hidden tablet:inline" /> Agent</h1>
            </Appear>
          </div>
          <Appear y={200} delay={0.3} ease={EASE_SUB}>
            <p className="pa-sub ph-sub">Your teams are manually reviewing, approving, and responding to reviews—or sometimes not responding at all. With Siena Reviews Agent, you put review management on autopilot.</p>
          </Appear>
          <Appear y={200} delay={0.4} ease={EASE_SUB}><BookDemoButton /></Appear>
        </div>
        <div className="ph-visual rv-hero-visual">
          <div className="rv-hv">
            <div className="rv-hv-card">
              <GradBorder r={16} w={1} className="rv-hv-review" innerClassName="rv-hv-review-in">
                <span className="rv-label"><Stars /></span>
                <img src="/svg/ai-review-management-Line-38-7d528.svg" alt="" className="block h-[3px] w-full" />
                <p className="rv-t14">Amazing oversized fit! Love how relaxed and comfortable it feels while still looking put-together.</p>
              </GradBorder>
              <Appear className="rv-hv-human" y={50} dur={1} delay={0.4} ease={SPRING}>
                <img src="/assets/ibqKcHjw0oDUyAiwhqZx1vqxh8.png" alt="" />
              </Appear>
              <div className="rv-hv-reply">
                <GradBorder r={16} inner="#EFE5D0" className="rv-hv-reply-b" innerClassName="p-[20px]">
                  <p className="pa-tiempos rv-t14t">Appreciate the love! The relaxed cut keeps it laid‑back yet neat. Our crewneck in the same silhouette might be your next favorite.</p>
                </GradBorder>
                <img src="/assets/14aPLwywC9q4flBvXM0s1rLqA8.png" alt="" className="rv-hv-brand" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* §3.3 Sticky card variants */
function BigChip({ grad, code, children, className = '' }) {
  return (
    <div className={`rv-bigchip ${className}`}>
      <span className="rv-icon-tile">
        <img src={`/assets/${grad}`} alt="" className="rv-grad" />
        <img src="/assets/Uuv5OWNLroO51e3GWwN9hGnIU.png" alt="" className="rv-grain" />
        <Fa code={code} color="#FFFFFF" className="relative" />
      </span>
      <p className="pa-tiempos rv-t20">{children}</p>
    </div>
  )
}
function Profile({ name, place, img, children, className = '' }) {
  return (
    <div className={`rv-profile ${className}`}>
      <div className="flex items-center gap-[12px]">
        <img src={`/assets/${img}`} alt="" className="h-[39px] w-[39px] rounded-[8px] object-cover" />
        <div>
          <p className="pa-tiempos rv-t18">{name}</p>
          <p className="pa-tiempos rv-t12">{place}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
const TILE_TEXT = 'This product really helped me with  exactly the way I needed.. Excellent chouce!'
export function ReviewsCard({ variant }) {
  const bg = ['9QXYcN8HRV6pLrj7RqzmWgXhuE.webp', 'glo9e1d72RyTANRqrtJjGBiB8.webp', 'YpBq2eslOPryB0RS06zq5aJxVQ.webp'][variant]
  const E = ({ d = 0, y = 40, className = '', style, children }) => (
    <Appear y={y} dur={0.6} delay={d} ease={SPRING} className={className} style={style}>{children}</Appear>
  )
  return (
    <div className="rv-card">
      <div className="rv-card-bg"><img src={`/assets/${bg}`} alt="" /></div>
      {variant === 0 && (
        <>
          {[[193.98, 15, '/svg/ai-review-management-Icon-Button-01472.svg', 48, TILE_TEXT], [240, -15, '/svg/ai-review-management-Icon-Button-96c02.svg', 39, 'yewr89chnr48whf83fgxr078fb43oq67rg320xcrg328'], [288, 15, '/svg/ai-review-management-Icon-Button-01472.svg', 48, TILE_TEXT]].map(([l, r, icon, s, t], i) => (
            <E key={i} d={0.1 * i} className="rv-tile" style={{ left: l, transform: `rotate(${r}deg)` }}>
              <p className={`rv-tile-text ${i === 1 ? 'rv-tile-text--code' : ''}`}>{t}</p>
              <img src={icon} alt="" className="rv-tile-badge" style={{ width: s, height: s }} />
            </E>
          ))}
          <E d={0.2} className="rv-abs" style={{ top: 278.8, left: 47 }}>
            <BigChip grad="H52yBv0P43yzd8dUlb8CFyENp1s.png" code={0xf03e}>Automatic reviews moderation</BigChip>
          </E>
          <E d={0.35} className="rv-abs" style={{ top: 346, left: 207, width: 273 }}>
            <GradBorder r={16} w={1} innerClassName="rv-feature">
              <span className="rv-feature-icon"><img src="/assets/6qhwFBE0v99iPQ7iYE1v9vxzCKg.png" alt="" /></span>
              <div className="flex flex-col gap-[4px]">
                <p className="pa-tiempos rv-t18">NSFW content detection</p>
                <p className="rv-t16">Advanced  text filtering blocks inappropriate content</p>
              </div>
            </GradBorder>
          </E>
        </>
      )}
      {variant === 1 && (
        <>
          <E d={0} className="rv-abs" style={{ top: 204, left: 124, width: 233 }}>
            <Profile name="Kathy Simpson" place="Lynwood, WA" img="YJCHh6pHXfigS8Roir7x9YirEI.webp">
              <Stars size={16} />
              <div className="rv-hr" />
              <p className="rv-t14">Great product!</p>
            </Profile>
          </E>
          <E d={0.2} className="rv-abs" style={{ top: 277, left: 248, width: 241 }}>
            <GradBorder r={16} w={1} innerClassName="p-[12px]">
              <p className="pa-tiempos rv-t18">Hey Kathy! So glad you liked it, here is a 10% discount for your next purchase</p>
            </GradBorder>
          </E>
          <E d={0.35} className="rv-abs" style={{ top: 383, left: 47 }}>
            <BigChip grad="eTyaR6EX4QUmmcYkomodjUhpH6Q.png" code={0xf007}>Generate personalized review responses at scale</BigChip>
          </E>
        </>
      )}
      {variant === 2 && (
        <>
          <E d={0} className="rv-abs rv-pref" style={{ top: 215, left: 188 }}>
            <img src="/svg/ai-review-management-Icon-Button-ec0de.svg" alt="" style={{ width: 32, height: 32 }} />
            <div>
              <p className="rv-t12s">Preference saved:</p>
              <p className="rv-t12s"><em>Prefers premium materials</em></p>
            </div>
          </E>
          <E d={0.15} className="rv-abs" style={{ top: 270, left: 46 }}>
            <BigChip grad="5k3UrT78mJSW5dExLUeigDKMjB0.png" code={0xe473}>Transform reviews into customer intelligence</BigChip>
          </E>
          <E d={0.3} className="rv-abs" style={{ top: 363, left: 124, width: 233 }}>
            <Profile name="Sol Lewitz" place="Richmond, VA" img="xZEsCHjDe8hRy1j3dZyyhlBT0.png">
              <div className="rv-hr" />
              <p className="rv-t12 flex justify-between"><span>Purchases:</span><span>3</span></p>
              <p className="rv-t12 flex justify-between"><span>Amount spent:÷</span><span>$5,465.54</span></p>
            </Profile>
          </E>
          <E d={0.45} className="rv-abs" style={{ top: 340, left: 326, width: 177 }}>
            <GradBorder r={16} w={1} innerClassName="rv-recent">
              <p className="pa-tiempos rv-t18">Recent reviews:</p>
              <Stars size={16} />
              <div className="rv-hr" />
              <p className="pa-tiempos rv-t18">Love the quality!</p>
            </GradBorder>
          </E>
        </>
      )}
    </div>
  )
}

const BLOCKS = [
  ['Agentic reviews moderation', 'Put content moderation on autopilot. Siena analyzes every review against your guidelines and automatically approves or flags content.', ['Brand guideline enforcement', '24/7 consistent protection', 'Complete control and flexibility']],
  ['Human-like review replies', 'Engage every customer with contextual, personalized responses. Boost GEO rankings while maintaining authentic brand voice.', ['Customer data integration', 'Enhanced search visibility', 'Selective engagement controls']],
  ["Reviews intelligence", "Reviews become part of each customer's profile, enabling context-aware interactions. Siena remembers preferences, concerns, and satisfaction levels across all touchpoints.", ['Comprehensive customer profiles', 'Cross-chanel personalization', 'Intelligent recommendations']],
]

/* §3.3 Features + sticky Scroll Area (homepage pinning: active block = the one crossing 50% viewport) */
export function ReviewsFeatures() {
  const refs = useRef([])
  const [active, setActive] = useState(0)
  const [switchId, setSwitchId] = useState(0)
  useEffect(() => {
    const blocks = refs.current.filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = blocks.indexOf(e.target)
            setActive((a) => {
              if (a !== i) setSwitchId((n) => n + 1)
              return i
            })
          }
        })
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    blocks.forEach((b) => io.observe(b))
    return () => io.disconnect()
  }, [])
  return (
    <section className="rf-section">
      <SectionTitle
        maxW={756}
        eyebrow="Turn your reviews into revenue"
        title="From segmented reviews to business intelligence"
        sub="Siena is the first AI Agent that moderates content, engages customers, and builds intelligence."
        subMax={680}
      />
      <div className="rf-scroll">
        <div className="rf-content">
          {BLOCKS.map(([t, d, bl], i) => (
            <div key={t} className="rf-block" ref={(el) => (refs.current[i] = el)}>
              <div className="rf-mobile-card"><ReviewsCard variant={i} /></div>
              <h3 className="pa-h3">{t}</h3>
              <p className="pa-tiempos rf-body">{d}</p>
              <StarBullets items={bl} />
              {i === 2 && <BookDemoButton />}
            </div>
          ))}
        </div>
        <div className="rf-sticky">
          <ReviewsCard key={switchId} variant={active} />
        </div>
      </div>
    </section>
  )
}

/* §3.5 Timer feature list (≈9s per item, loops) */
const ITEMS = [
  [0xf847, 'Context-aware personalization', 'When a customer contacts support, Siena knows their review history. Left a negative review about sizing? It will  proactively address fit concerns and  suggest better options'],
  [0xe3f1, 'Intelligent product recommendations', "Reviews reveal preferences and pain points. Siena uses this intelligence to recommend products customers will love and avoid suggesting items they've criticized."],
  [0xf652, 'Complete customer understanding', 'Reviews data integrates with order history, support tickets, and preferences to create the most comprehensive customer profile possible.'],
]
const DURATION = 9000

function RecentReviews({ fadeIn }) {
  const rows = [[5, 'Love the quality, and sizing is perfect!'], [4, 'Love the quality!'], [5, 'This product is perfect for me']]
  return (
    <div className="rt-recent">
      <p className="pa-tiempos rv-t12">Recent reviews:</p>
      {rows.map(([n, t], i) => (
        <Appear key={t} on={fadeIn ? 'load' : true} dur={0.33} delay={fadeIn ? i * 0.5 : 0} from={0}>
          <GradBorder r={16} w={1} innerClassName="rt-rev">
            <Stars n={n} size={16} />
            <p className="rv-t14">{t}</p>
          </GradBorder>
        </Appear>
      ))}
    </div>
  )
}

function TimerVisual({ item }) {
  if (item === 0)
    return (
      <div className="rt-vis rt-vis--0">
        <div className="rt-col">
          <Profile name="Sol Lewitz" place="Richmond, VA" img="xZEsCHjDe8hRy1j3dZyyhlBT0.png" className="rt-profile" />
          <Appear y={40} dur={0.6} ease={SPRING} className="rt-msg rt-msg--cust"><p className="pa-tiempos rv-t18">I'm interested in this jacket</p></Appear>
          <Appear y={40} dur={0.6} delay={0.3} ease={SPRING} className="rt-siena-row">
            <GradBorder r={16} inner="#EFE5D0" innerClassName="p-[12px]">
              <p className="pa-tiempos rv-t14t">Perfect! Based on your reviews, I'd recommend a size S for this jacket. Your preference for fitted styles suggests this will be ideal.</p>
            </GradBorder>
            <img src="/assets/14aPLwywC9q4flBvXM0s1rLqA8.png" alt="" className="h-[40px] w-[40px] flex-none rounded-full" />
          </Appear>
        </div>
        <RecentReviews fadeIn />
      </div>
    )
  if (item === 1)
    return (
      <div className="rt-vis rt-vis--1">
        <div className="rt-product">
          <div className="flex gap-[12px]">
            <img src="/assets/1cOYHA6JkAOVroe5BzPxPfldA.webp" alt="" className="rt-product-img" />
            <div className="flex flex-col gap-[6px]">
              <p className="rt-fd-missing rt-t20">Black coat</p>
              <p className="rt-fd-missing rt-t14">$900.00</p>
              <Stars size={16} />
              <p className="rt-fd-missing rt-t10">April, 2025</p>
            </div>
          </div>
          <p className="rv-t14">Love the quality! It's perfect to complete a business attire.</p>
        </div>
        <div className="rt-fan">
          {['40z3VQUjTKI2iJKzIZakfFbNA.webp', 'DUJeXKPoOpdEykKQVdBFf9sxxjI.webp', '8vrwqt65KuDBvO08wgngjXRls.webp', '1cOYHA6JkAOVroe5BzPxPfldA.webp'].map((s, i) => (
            <GradBorder key={s} r={16} w={2} className="rt-fan-item" style={{ transform: `rotate(${(i - 1.5) * 8}deg)` }} innerStyle={{ overflow: 'hidden', height: '100%' }}>
              <img src={`/assets/${s}`} alt="" className="h-full w-full object-cover" />
            </GradBorder>
          ))}
        </div>
        <div className="rt-composer">
          <GradBorder r={24} innerClassName="rt-composer-in" innerStyle={{ borderRadius: 22 }}>
            <span className="rt-fd-missing rt-t16">Complete this business casual look</span>
          </GradBorder>
          <div className="ss-powered"><span className="pa-inter">Powered by</span><img src="/svg/shopping-agent-Logo-c6c43.svg" alt="Siena" /></div>
        </div>
      </div>
    )
  return (
    <div className="rt-vis rt-vis--2">
      <div className="rt-col">
        <div className="rt-ross">
          <img src="/assets/zsoY3aCkihx7ovTTTTgLbwVUcIo.webp" alt="" className="h-[79px] w-[79px] rounded-[8px] object-cover" />
          <div className="flex flex-col gap-[12px]">
            <p className="rt-tt rt-name">Rosslind Simpson</p>
            <p className="rt-tt rt-place">Richmond, VA</p>
          </div>
        </div>
        <div className="rt-attrs">
          {['Quality-focused', 'seasonal', 'Chatty', 'Active reviewer', 'executive'].map((a) => (
            <span key={a} className="rt-attr">{a}</span>
          ))}
        </div>
        <div className="rt-stats">
          <p>CLV: $5,465 (2.1x average)</p>
          <p>Purchase frequency: Every 3 months</p>
          <p>Average review rating: 4.2 stars</p>
        </div>
      </div>
      <RecentReviews fadeIn />
    </div>
  )
}

export function ReviewsTimer() {
  const [active, setActive] = useState(0)
  const [p, setP] = useState(0)
  const start = useRef(0)
  useEffect(() => {
    if (prefersReducedMotion()) return
    start.current = performance.now()
    const id = setInterval(() => {
      const t = performance.now() - start.current
      if (t >= DURATION) {
        start.current = performance.now()
        setActive((a) => (a + 1) % 3)
        setP(0)
      } else setP(t / DURATION)
    }, 90)
    return () => clearInterval(id)
  }, [])
  return (
    <section className="rt-section">
      <SectionTitle
        maxW={756}
        eyebrow="Siena's intelligent layer"
        title={<>From reviews to customer <em>intelligence</em></>}
        sub="Every review enriches Siena's understanding of your customers. This intelligence powers personalized interactions across all channels"
        subMax={564}
      />
      <div className="rt-row">
        <div className="rt-visual">
          <div className="rt-glass" />
          <TimerVisual key={active} item={active} />
        </div>
        <div className="rt-list">
          {ITEMS.map(([code, t, d], i) => (
            <button key={t} type="button" className={`rt-item ${i === active ? 'is-active' : ''}`} onClick={() => { start.current = performance.now(); setActive(i); setP(0) }}>
              <span className="rt-track"><span className="rt-fill" style={{ width: i === active ? `${p * 100}%` : 0 }} /></span>
              <span className="rt-item-body">
                <Fa code={code} />
                <h5 className="pa-h5">{t}</h5>
                <span className="rt-desc"><span><p className="pa-tiempos">{d}</p></span></span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

/* §3.6 Integrations + bento */
export function ReviewsIntegrations() {
  return (
    <section className="ri-section">
      <div className="ri-head">
        <div className="pa-title pa-title--left ri-head-text">
          <Eyebrow>Integrations</Eyebrow>
          <H2>Integrate Siena with your reviews platforms</H2>
        </div>
        <Appear dur={0.4} ease={SPRING} className="ri-lockup">
          <div className="ri-tile ri-tile--big"><img src="/svg/ai-review-management-siena-a3950.svg" alt="Siena" style={{ width: 122, height: 32 }} /></div>
          <span className="ri-x">X</span>
          <div className="ri-col">
            <div className="ri-tile"><img src="/svg/ai-review-management-Vector-04990.svg" alt="Yotpo" style={{ width: 114, height: 32 }} /></div>
            <div className="ri-tile"><img src="/assets/Hfffu8O7eVi0qTHu7dUD58SVQ00.png" alt="Okendo" style={{ width: 162, height: 35, objectFit: 'contain' }} /></div>
          </div>
        </Appear>
      </div>
      <div className="ri-bento">
        <div className="ri-row">
          <div className="ri-card-100">
            <img src="/assets/U7vEsbEodiJTfyaMk6fxx1JzSOE.png" alt="100%" className="ri-100" />
            <h3 className="pa-h3 text-center">Autonomous reviews management</h3>
          </div>
          <div className="ri-photo">
            <img src="/assets/BEKytDQGmk9M2on9YkKhq2plrU.webp" alt="" className="ri-photo-img" />
            <div className="ri-pref">
              <div>
                <h6 className="pa-h6">Preference saved:</h6>
                <p className="rv-t14s">Prefers oversized  fit</p>
              </div>
              <img src="/svg/ai-review-management-Icon-Button-ec0de.svg" alt="" style={{ width: 32, height: 32 }} />
            </div>
            <GradBorder r={16} w={1} className="ri-review" innerClassName="rt-rev">
              <Stars size={16} />
              <p className="rv-t14">Love the quality, and sizing is perfect!</p>
            </GradBorder>
            <img src="/assets/14aPLwywC9q4flBvXM0s1rLqA8.png" alt="" className="ri-brand" />
            <div className="ri-msg"><p className="pa-tiempos so-t12">Welcome back, Lena! We have new oversized pieces from the new collection you might wanna check out...</p></div>
          </div>
        </div>
        <div className="ri-tiles">
          {[[0xf4fd, '24/7 Support coverage'], [0xf245, '1-Click install'], [0xf6a3, 'Scalable insights']].map(([c, t]) => (
            <div key={t} className="ri-small"><Fa code={c} /><h5 className="pa-h5">{t}</h5></div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { useInView }
