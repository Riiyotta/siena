// specs/company.md U1 (/customers) and E1 (/events): centred H1 with an italic word, the hand-drawn
// rainbow underline (MJbk4aQblPanJHyFV9X8Yg7JDqI.png) under that word, and an 0.82-opacity sub.
// `variant` selects the measured underline offsets in company.css (.ut--customers / .ut--events).
export default function UnderlineTitle({ variant, children, sub, className = '' }) {
  return (
    <div className={`ut ut--${variant} ${className}`}>
      <div className="ut-block">
        <div className="ut-h1-wrap">
          <h1 className="co-h1 ut-h1 co-appear-h1">{children}</h1>
          <img className="ut-underline co-appear-d3" src="/assets/MJbk4aQblPanJHyFV9X8Yg7JDqI.png" alt="" aria-hidden="true" />
        </div>
        <p className="co-sub ut-sub co-appear-d3">{sub}</p>
      </div>
    </div>
  )
}
