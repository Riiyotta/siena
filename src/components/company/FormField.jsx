// Framer-form field look-alike (specs/company.md M1 "Fields"): label <strong> above a 60px white
// wrapper with a 1px #CDBCA0 ring that turns #0099FF on focus. Native HTML5 validation only.
export function Field({ label, type = 'text', name, placeholder, required = false, className = '' }) {
  return (
    <label className={`co-field ${className}`}>
      <strong className="co-field-label">{label}</strong>
      <div className="co-input-wrap">
        <input className="co-input" type={type} name={name} placeholder={placeholder} required={required} />
      </div>
    </label>
  )
}

// Static form: blocks the submit (no network); the browser still runs native constraint validation first.
export function StaticForm({ className = '', children, ...rest }) {
  return (
    <form className={className} onSubmit={(e) => e.preventDefault()} {...rest}>
      {children}
    </form>
  )
}
