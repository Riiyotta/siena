// specs/product-a.md §1.4 — two sticky columns, 3 steps switched by trigger boxes crossing 50% viewport.
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Appear, SPRING, TypeIn, prefersReducedMotion, useInView } from '../motion.jsx'
import { GradBorder } from '../ui.jsx'

const LABELS = ['Conversation Starters', 'Add to cart from chat', 'Smart Discounting']
const DESCRIPTIONS = [
  'Proactively engage visitors with intent-driven nudges.',
  'Reduce friction and shorten the purchase journey.',
  'Trigger personalized offers to convert hesitant buyers.',
]
const PROMPTS = ["What's the best cup for a 13-year-old girl?", 'Do you offer a discount for teachers?', 'Sounds great, thanks!']
const SUGGESTIONS = ['How durables are the materials?', 'Is the bottle and lid dishwasher safe for easy cleaning?', 'Will it fit in most car cup holders?']
const TRIGGERS = [216, 1019, 1579] // section offsets of the invisible trigger boxes (desktop)

function Lockup({ className }) {
  return (
    <div className={`ss-lockup ${className}`} aria-label="Siena x Simple Modern">
      <img src="/svg/shopping-agent-Variant-1-4a4b3.svg" alt="" className="ss-lockup-siena" />
      <div className="ss-lockup-x"><span>x</span></div>
      <div className="ss-lockup-chip"><img src="/svg/shopping-agent-Logos-5-d4b67.svg" alt="" /></div>
    </div>
  )
}

function Brand() {
  return (
    <div className="ss-brand" aria-hidden="true">
      <img src="/svg/shopping-agent-Logos-5-bg-96b11.svg" alt="" />
    </div>
  )
}

function SienaMsg({ children, w }) {
  return (
    <div className="ss-row ss-row--siena">
      <GradBorder r={16} inner="#EFE5D0" className="ss-bubble" style={{ '--w': w }} innerClassName="ss-bubble-in">
        <p className="ss-text">{children}</p>
      </GradBorder>
      <Brand />
    </div>
  )
}

function CustomerMsg({ children, w }) {
  return (
    <GradBorder r={16} className="ss-bubble ss-bubble--cust" style={{ '--w': w }} innerClassName="ss-bubble-in">
      <p className="ss-text">{children}</p>
    </GradBorder>
  )
}

function Product({ img, name, price, added, alt, checkAppear }) {
  return (
    <div className={`ss-product ${alt ? 'ss-product--alt' : ''}`}>
      <div className="ss-product-thumb">
        <img src={`/assets/${img}`} alt="" />
      </div>
      <div className="ss-product-col">
        <p className="ss-text">{name}</p>
        <p className="ss-text">{price}</p>
        <div className="ss-cart">
          <div className="ss-cart-glass">
            <span className="pa-fd-missing ss-cart-label">{added ? 'Added to cart' : 'Add to cart'}</span>
            {added && (
              <Appear on={checkAppear ? 'load' : true} dur={0.3} className="ss-check">
                <img src="/svg/shopping-agent-blue-checkmark.svg" alt="" />
              </Appear>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const SMURF = { img: 'QXF1WWOFYMg43MV5R6ha4B4Mqqs.webp', name: 'Trek Kids Tumbler: Smurf Checkmate', price: '$32.99', added: true }
const SAGE = { img: 'pWyCmypuaJFrdmSKIUqWdXwuTw.webp', name: 'Trek Kids Tumbler: Sage Florals', price: '$36.99', alt: true }

// Rows per step, keyed so shared rows (e.g. the Smurf product) slide between positions (FLIP).
function rowsFor(step) {
  if (step === 0)
    return [
      ['hi', <SienaMsg w="402px">Hi! I'm Maddie, here to help with tracking orders, troubleshooting, product details, or anything else you need.</SienaMsg>],
      [
        'sugg',
        <Appear y={50} dur={0.8} delay={0.33} ease={SPRING} className="ss-sugg">
          {SUGGESTIONS.map((s, i) => {
            const chip = (
              <div className="ss-sugg-chip">
                <img src="/svg/shopping-agent-sparkles-two-2-f6c5b.svg" alt="" className="ss-sparkle" />
                <p className="ss-text">{s}</p>
              </div>
            )
            return i === 0 ? (
              <GradBorder key={s} r={24} className="w-full" innerStyle={{ background: 'transparent' }}>{chip}</GradBorder>
            ) : (
              <div key={s} className="w-full">{chip}</div>
            )
          })}
        </Appear>,
      ],
    ]
  if (step === 1)
    return [
      ['q1', <CustomerMsg w="100%">What's the best cup for a 13-year-old girl?</CustomerMsg>],
      ['gift', <SienaMsg w="285px">Here are some fun, in-stock options that would make a great gift for your daughter:</SienaMsg>],
      ['smurf', <Product {...SMURF} />],
      ['sage', <Product {...SAGE} />],
    ]
  return [
    ['smurf', <Product {...SMURF} checkAppear />],
    ['q2', <CustomerMsg w="371px">Great! Do you offer a discount for teachers?</CustomerMsg>],
    ['disc', <SienaMsg w="285px">Yes, teachers can get 15% off with us. Just verify your status through ID.me at checkout and the discount will be applied.</SienaMsg>],
  ]
}

// FLIP: rows present in both steps animate from their previous position (≈300ms); new rows fade/slide in.
function useFlip(containerRef, step) {
  const prev = useRef(new Map())
  useLayoutEffect(() => {
    const root = containerRef.current
    if (!root) return
    const reduced = prefersReducedMotion()
    const base = root.getBoundingClientRect()
    const next = new Map()
    root.querySelectorAll(':scope > [data-flip]').forEach((el) => {
      const r = el.getBoundingClientRect()
      const key = el.dataset.flip
      next.set(key, { y: r.top - base.top, h: r.height })
      const old = prev.current.get(key)
      if (reduced || prev.current.size === 0) return
      el.style.transition = 'none'
      if (old) {
        el.style.transform = `translateY(${old.y - (r.top - base.top)}px)`
      } else {
        el.style.opacity = '0'
        el.style.transform = 'translateY(24px)'
      }
      requestAnimationFrame(() => {
        el.style.transition = 'transform .3s cubic-bezier(.2,.8,.2,1), opacity .3s ease-out'
        el.style.transform = ''
        el.style.opacity = ''
      })
    })
    prev.current = next
  }, [step, containerRef])
}

export default function ShoppingScrollArea() {
  const sectionRef = useRef(null)
  const chatRef = useRef(null)
  const listRef = useRef(null)
  const [step, setStep] = useState(0)
  const seen = useInView(chatRef)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current
        if (!el) return
        // trigger box top crossing 50% of the viewport
        const line = window.innerHeight * 0.5 - el.getBoundingClientRect().top
        setStep(line >= TRIGGERS[2] ? 2 : line >= TRIGGERS[1] ? 1 : 0)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useFlip(listRef, step)
  const rows = rowsFor(step)

  return (
    <section ref={sectionRef} className="ss-section">
      <Lockup className="ss-lockup--m" />

      <div className="ss-left">
        <div className="ss-left-inner">
          <div className="ss-desc">
            <div className="ss-container">
              <ol className="ss-labels">
                {LABELS.slice(0, step + 1).map((l, i) => (
                  <li key={l} className="ss-label" style={{ width: i === 2 ? 185 : 215 }}>
                    <img src="/assets/Uuv5OWNLroO51e3GWwN9hGnIU.png" alt="" className="ss-label-pattern" />
                    <div className="ss-label-glass">
                      <span className="pa-mono ss-label-text">{`${i + 1}. ${l}`}</span>
                    </div>
                  </li>
                ))}
              </ol>
              <GradBorder r={16} inner="#FAF7F1" innerClassName="ss-desc-card">
                <h6 className="pa-fd ss-desc-text">{DESCRIPTIONS[step]}</h6>
              </GradBorder>
            </div>
          </div>
          <Lockup className="ss-lockup--d" />
        </div>
      </div>

      <div className="ss-right">
        <div ref={chatRef} className="ss-chat">
          <div className="ss-chat-ui">
            <div ref={listRef} className="ss-rows">
              {rows.map(([k, node]) => (
                <div key={k} data-flip={k} className="ss-flip">{node}</div>
              ))}
            </div>
            <div className="ss-composer">
              <GradBorder r={24} className="w-full" innerClassName="ss-composer-in" innerStyle={{ borderRadius: 22 }}>
                <div className="ss-composer-text">
                  <TypeIn key={step} text={PROMPTS[step]} play={seen} className="pa-fd ss-type" />
                </div>
                <img src="/svg/shopping-agent-CTA-send-90871.svg" alt="" className="ss-send" />
              </GradBorder>
              <div className="ss-powered">
                <span className="pa-inter">Powered by</span>
                <img src="/svg/shopping-agent-Logo-c6c43.svg" alt="Siena" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
