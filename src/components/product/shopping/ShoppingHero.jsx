// specs/product-a.md §1.1 — beige two-column hero with in-hero tickers.
import BookDemoButton from '../../cta/BookDemoButton.jsx'
import { Appear, EASE_H1, EASE_SUB } from '../motion.jsx'
import { Fa, GradBorder, Img, Swash } from '../ui.jsx'
import { LogosBlock } from '../sections.jsx'

const QUESTIONS = [
  'How does the leak-resistant lid prevent spills?',
  'Can it keep drinks cold for over 24 hours?',
  'How does the handle improve on-the-go usability?',
]

export default function ShoppingHero() {
  return (
    <section className="sh-hero">
      <div className="sh-row">
        <div className="sh-copy">
          <div className="sh-text">
            <div className="sh-heading">
              <Appear className="sh-swash-wrap" y={200} delay={0.2} ease={EASE_H1}>
                <Swash className="sh-swash" />
              </Appear>
              <Appear y={200} delay={0.2} ease={EASE_H1} className="relative z-[1]">
                <h1 className="pa-h1">Meet your<br />Shopping<br />Agent</h1>
              </Appear>
            </div>
            <Appear y={200} delay={0.3} ease={EASE_SUB} to={0.82} className="sh-sub">
              <p className="pa-sub">
                Transform every customer touchpoint into revenue opportunities. Siena understands context, remembers preferences, and guides customers toward purchase with human-like intelligence.
              </p>
            </Appear>
          </div>
          <Appear y={200} delay={0.4} ease={EASE_SUB}>
            <BookDemoButton />
          </Appear>
        </div>

        <div className="sh-visual-wrap">
          <div className="sh-visual">
            <div className="sh-texture"><Img src="7ZZpyAWbb7tu6eaWiuxBDOBokOE.webp" fit="contain" className="h-full w-full" /></div>
            <div className="sh-tile">
              <Img src="EvW4Cm4cXRAMnF0Al3rzYElY0.webp" className="h-full w-full rounded-[12px]" />
              <div className="sh-tile-chip"><img src="/svg/shopping-agent-Logos-5-d4b67.svg" alt="Simple Modern" className="sh-tile-logo" /></div>
            </div>
            <GradBorder className="sh-card" r={16} angle={289} inner="#FAF7F1" innerClassName="sh-card-inner">
              <div className="sh-card-thumb"><Img src="E41dkaPjzIYO8X5LquyvnNWA5k.png" className="h-full w-full" /></div>
              <div className="sh-card-col">
                <p className="pa-tiempos sh-card-title">Voyager Tumbler - Signature</p>
                <p className="pa-tiempos sh-card-price">$37.99</p>
                <div className="sh-pill">
                  <Img src="1bDMxZj8W2T4NADqgydu75txHrc.webp" className="sh-pill-bg" />
                  <div className="sh-pill-glass"><h6 className="pa-fd sh-pill-label">Add to cart</h6></div>
                </div>
              </div>
            </GradBorder>
            <div className="sh-person"><Img src="w6eD4Ur8zTRM35rkpRmfdnDQ8Fg.webp" className="h-full w-full" /></div>
            <div className="sh-list">
              {QUESTIONS.map((q) => (
                <div key={q} className="sh-chip">
                  <Fa code={0xf890} size={24} className="sh-chip-icon" />
                  <p className="pa-tiempos sh-chip-text">{q}</p>
                </div>
              ))}
            </div>
            <div className="sh-prompt">
              <Img src="P2z8QZxCKrgmbnpcOvGB6CRRlEs.webp" className="absolute inset-[0_-1px_-1px_-1px] h-[calc(100%+1px)] w-[calc(100%+2px)]" />
              <GradBorder r={40} className="sh-prompt-border" innerClassName="sh-prompt-inner" innerStyle={{ borderRadius: 32 }}>
                <div className="sh-prompt-row">
                  <img src="/svg/shopping-agent-Icon-Black-d8122.svg" alt="" className="sh-prompt-icon" />
                  <h6 className="pa-fd sh-prompt-text">What can I help you with?</h6>
                </div>
              </GradBorder>
            </div>
          </div>
        </div>
      </div>
      <LogosBlock className="sh-logos" />
      <div className="sh-fade" aria-hidden="true" />
    </section>
  )
}
