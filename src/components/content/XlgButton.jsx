import '../../styles/content.css'

// xlg button (CLONE_SPEC §2, content spec T1.9): 58 tall, padding 18px 24px, radius 16,
// Instrument Sans 600 18/21.6. Dark variant bg #122023 / white label; `white` variant bg #FFF /
// label #000 (Insights "Login"). Hover -> rainbow gradient, instant.
export default function XlgButton({ href, children, white = false, className = '' }) {
  return (
    <a href={href} className={`ct-btn ${white ? 'ct-btn--white' : ''} ${className}`}>
      {children}
    </a>
  )
}
