import SingleTicker, { ADDONS_LOGOS, COMPARE_LOGOS } from './SingleTicker.jsx'
import { DarkButton } from './ui.jsx'

// specs/conversion.md §3.1 — compare hero (eyebrow + 3-line H1, own decorative images, single ticker 45px/s).
export function CompareHero({ eyebrow, title, mobileTitle, subtitle }) {
  return (
    <section className="cv-hero cv-hero--compare">
      <img className="cv-hero-img cv-hero-img--cl" src="/assets/qnJ39G2jMJsaeN5ykV5ZIyZ9Fw.webp" alt="" aria-hidden="true" />
      <img className="cv-hero-img cv-hero-img--cr" src="/assets/OJVl4cBpDuZoUt7B55UQZA7rfQ.webp" alt="" aria-hidden="true" />
      <div className="cv-hero-text">
        <div className="cv-hero-group">
          <p className="cv-eyebrow cv-hero-eyebrow">{eyebrow}</p>
          <h1 className="cv-hero-h1 cv-appear cv-appear--h1">
            {mobileTitle ? (
              <>
                <span className="cv-hide-phone">{title}</span>
                <span className="cv-show-phone">{mobileTitle}</span>
              </>
            ) : (
              title
            )}
          </h1>
          <p className="cv-hero-sub cv-appear cv-appear--sub">{subtitle}</p>
        </div>
        <div className="cv-appear cv-appear--cta">
          <DarkButton />
        </div>
      </div>
      <SingleTicker logos={COMPARE_LOGOS} speed={45} />
    </section>
  )
}

// §6.1 — add-ons hero (homepage images repositioned, 2 paragraphs, 18-logo ticker 30px/s, no eyebrow).
// Live appear map: H1 + the P1/P2 wrapper 0.3s; CTA + hero images 0.4s (ease 0,.91,.78,1).
export function AddonsHero() {
  return (
    <section className="cv-hero cv-hero--addons">
      <img className="cv-hero-img cv-hero-img--ar cv-appear cv-appear--a4" src="/assets/jBdT2KuAbfPtfHNsxcWh0L50xk.webp" alt="" aria-hidden="true" />
      <img className="cv-hero-img cv-hero-img--al cv-appear cv-appear--a4" src="/assets/rYyvabwLjN7jv9XBL68Sm664.webp" alt="" aria-hidden="true" />
      <img className="cv-hero-img cv-hero-img--am cv-appear cv-appear--a4" src="/assets/H7uKKouy1m2eWQvMjbwrSblQx8k.webp" alt="" aria-hidden="true" />
      <div className="cv-hero-text">
        <div className="cv-hero-group">
          <h1 className="cv-hero-h1 cv-hero-h1--addons cv-appear cv-appear--a3">
            AI-Native Customer Service.
            <br />
            Not an Add-on.
          </h1>
          <div className="cv-hero-ps cv-appear cv-appear--a3">
            <p className="cv-hero-sub">
              Stop settling for unpredictable help desk AI add-ons. Siena is a purpose-built AI agent designed entirely for exceptional
              customer support that's stable, reliable, and consistently on-brand.
            </p>
            <p className="cv-hero-sub">Switch easily from add-ons</p>
          </div>
        </div>
        <div className="cv-appear cv-appear--a4">
          <DarkButton />
        </div>
      </div>
      <SingleTicker logos={ADDONS_LOGOS} speed={30} />
    </section>
  )
}
