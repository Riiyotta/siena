// Integrations-tile grid variant (specs/company.md A4 investors, P2 partner groups).
// Tiles: bg #F3F0EB, radius 4, padding 72px 0, centered; logos rendered at the measured size.
// Each logo: { src, alt, w, h, mw?, mh? (phone render size), tile? (extra tile class) }
export default function LogoGrid({ logos, className = '' }) {
  return (
    <div className={`co-logo-grid ${className}`}>
      {logos.map((l) => (
        <div key={l.src} className={`co-logo-tile ${l.tile || ''}`}>
          <img
            src={l.src}
            alt={l.alt}
            className="co-logo-img"
            style={{ '--w': `${l.w}px`, '--h': `${l.h}px`, '--mw': `${l.mw ?? l.w}px`, '--mh': `${l.mh ?? l.h}px` }}
          />
        </div>
      ))}
    </div>
  )
}
