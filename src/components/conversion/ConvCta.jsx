import { DarkButton } from './ui.jsx'

// specs/conversion.md §3.9 / §6.5 — homepage MainCta variant without the top cream "Blur out".
// kind 'compare': phone frame keeps padding 200px 96px (card 198 wide, H2 wraps narrow — live quirk).
// kind 'addons': phone frame padding 200px 24px.
export default function ConvCta({ title, kind }) {
  return (
    <section className={`cv-cta cv-cta--${kind}`}>
      <div className="cv-cta-frame">
        <img className="cv-cta-bg" src="/assets/ERYNplIY591uk80wpoa4JGglO8.webp" alt="" width="1440" height="810" />
        <div className="cv-cta-card">
          <div className="cv-cta-inner">
            <h2 className="cv-h2">{title}</h2>
            <DarkButton />
          </div>
        </div>
      </div>
    </section>
  )
}
