import { Fa } from './shared.jsx'

// §4 shared mockup atoms. The chip status icons are data-URI SVGs on the live site; the dump truncates
// those strings, so these are drawn equivalents (15x15 blue check-circle / orange circle).
export function StatusIcon({ pending, size = 15 }) {
  return pending ? (
    <svg width={size} height={size} viewBox="0 0 15 15" aria-hidden="true" className="flex-none">
      <circle cx="7.5" cy="7.5" r="7" fill="#E9933B" />
      <path d="M5 7.6l1.7 1.7L10 6" stroke="#FFF" strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 15 15" aria-hidden="true" className="flex-none">
      <circle cx="7.5" cy="7.5" r="7" fill="#2E55D0" />
      <path d="M4.8 7.6l1.8 1.8L10.3 5.8" stroke="#FFF" strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function StatusChip({ pending, label, className = '' }) {
  return (
    <span className={`dc-chip ${className}`}>
      <span>{label ?? (pending ? 'Pending' : 'Verified')}</span>
      <StatusIcon pending={pending} />
    </span>
  )
}

/** Tilted doc card ("Docs / Item"): 183x213 outer (padding 2, r28, chip shadow). */
export function DocCard({ title, label, excerpt, pending, icon, className = '', style, children }) {
  return (
    <div className={`dc-card ${className}`} style={style}>
      <div className="dc-inner">
        <div className="dc-title-row">
          {icon && (
            <span className="dc-title-icon">
              <Fa code={icon} size={12} />
            </span>
          )}
          <p className="dc-title">{title}</p>
        </div>
        <div className="dc-graphic">
          {children ?? (
            <>
              {label && <p className="dc-label">{label}</p>}
              {excerpt && <p className="dc-excerpt">{excerpt}</p>}
            </>
          )}
        </div>
        <div className="dc-blur" />
        <div className="dc-foot">
          <StatusChip pending={pending} />
        </div>
      </div>
    </div>
  )
}

/** Browser frame ("Docs-card") with 2px glass shell, dots, divider and optional URL chip. */
export function BrowserFrame({ url, className = '', bg = 0.5, children, blob }) {
  return (
    <div className={`bf-shell ${className}`}>
      <div className="bf-card" style={{ background: `rgba(243,240,235,${bg})` }}>
        {blob && <img className="bf-blob" src="/assets/QHZQBNQlSL00uTxYcQKOePAWdT0.webp" alt="" />}
        <div className="bf-bar">
          <span className="bf-dots">
            <i />
            <i />
            <i />
          </span>
          {url && (
            <span className="dc-chip bf-url">
              <span>{url}</span>
              <Fa code={0xf0c5} size={12} />
            </span>
          )}
        </div>
        <div className="bf-divider" />
        {children}
      </div>
    </div>
  )
}

export function UsageChart({ className = '' }) {
  return (
    <div className={`uc-card ${className}`}>
      <div className="uc-inner">
        <p className="uc-title">Document usage</p>
        <div className="uc-chart">
          <img src="/assets/nvp2J5Q38ZJKo0wZ875zHFSvrhg.png" alt="" />
          <span className="uc-tag">23 Cited</span>
        </div>
      </div>
      <div className="uc-chips">
        <span className="dc-chip">61 Views</span>
        <span className="dc-chip">12 Agents</span>
      </div>
    </div>
  )
}
