import { XlgButton } from './shared.jsx'

// MainCta variants (specs/company.md A5 / C6 / U4 / P4 / R4).
//   variant 'brands'  : "Brands that win on CX run on Siena", no blur-out (about-us, customers, refer-a-friend)
//   variant 'careers' : 2-line heading, top blur-out starting from white
//   variant 'partner' : Metrics bg image, card max 1328, button opens the partner modal
// phone: 'about' (200px 24px), 'narrow' (200px 96px — measured quirk on /customers + /refer-a-friend),
//        'careers' (120px 32px), 'partner' (80px 24px).
export default function CompanyCta({ variant = 'brands', phone = 'about', heading, buttonLabel = 'Book a demo', href = '/book-a-demo', onClick }) {
  const partner = variant === 'partner'
  return (
    <section className={`co-cta co-cta--${variant} co-cta-phone--${phone}`}>
      <img
        className="co-cta-bg"
        src={partner ? '/assets/5VTp1YGCJLYo9Grib0Ouvyooeag.webp' : '/assets/ERYNplIY591uk80wpoa4JGglO8.webp'}
        alt=""
        aria-hidden="true"
      />
      {variant === 'careers' && <div className="co-cta-blur" aria-hidden="true" />}
      <div className="co-cta-card">
        <div className="co-cta-inner">
          <h2 className="co-h2 co-cta-h2">{heading}</h2>
          {onClick ? (
            <XlgButton onClick={onClick} className="co-cta-btn">{buttonLabel}</XlgButton>
          ) : (
            <XlgButton href={href} className="co-cta-btn">{buttonLabel}</XlgButton>
          )}
        </div>
      </div>
    </section>
  )
}
