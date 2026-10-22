import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

// specs/conversion.md §1.2a — static look-alike of the Framer multi-step form.
// Native validation only; the final submit is preventDefault'd (no Chili Piper / network call).

const GOALS = [
  'Make my customer service more efficient',
  'Drive more sales and increase conversion rates',
  'Get insights from my conversations',
  'Scale my social engagement and moderation',
]
const SOCIAL_GOAL = GOALS[3]
const TICKETS = ['<3,000', '3,000-10,000', '10,000-20,000', '20,000-30,000', 'Over 30,000']
const HELPDESKS = ['Gorgias', 'Zendesk', 'Kustomer', 'Gladly', 'Intercom', 'Salesforce', 'Other']
const SOCIAL = ['Sprout Social', 'Hootsuite', 'Dash Social', 'Emplifi', 'Our helpdesk', 'The social platforms directly', 'Other']

const WEBSITE_RE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i
const WEBSITE_MSG = 'Please enter a valid website (e.g. example.com)'

function TextField({ name, label, type = 'text', autoComplete, value, onChange, validate }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!validate || !ref.current) return
    ref.current.setCustomValidity(value && !validate(value) ? WEBSITE_MSG : '')
  }, [value, validate])
  return (
    <label className={`cv-field ${value ? 'is-filled' : ''}`}>
      <input
        ref={ref}
        className="cv-input"
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="cv-label">{label}</span>
    </label>
  )
}

function TextArea({ name, label, value, onChange }) {
  return (
    <label className={`cv-field cv-field--area ${value ? 'is-filled' : ''}`}>
      <textarea className="cv-input cv-textarea" name={name} required value={value} onChange={(e) => onChange(e.target.value)} />
      <span className="cv-label">{label}</span>
    </label>
  )
}

// Dropdown: button + fixed panel 8px under the field. multi = checkboxes, otherwise radios (closes on pick).
function Select({ name, label, placeholder, options, multi = false, required = true, value, onChange }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState(null)
  const wrapRef = useRef(null)
  const panelRef = useRef(null)
  const btnRef = useRef(null)
  const selected = multi ? value : value ? [value] : []
  const text = selected.join(', ')

  const place = useCallback(() => {
    const r = wrapRef.current?.getBoundingClientRect()
    if (r) setPos({ top: r.bottom + 6, left: r.left, width: r.width })
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    place()
    const onDoc = (e) => {
      if (!wrapRef.current?.contains(e.target) && !panelRef.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
    }
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, place])

  const pick = (opt) => {
    if (multi) onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt])
    else {
      onChange(opt)
      setOpen(false)
      btnRef.current?.focus()
    }
  }

  return (
    <div ref={wrapRef} className={`cv-field cv-select ${open ? 'is-open' : ''} ${open || text ? 'is-filled' : ''}`}>
      <button
        ref={btnRef}
        type="button"
        className="cv-select-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="cv-label">{label}</span>
        <span className={`cv-select-value ${text ? 'has-value' : ''}`}>{text || placeholder}</span>
        <img className="cv-select-chevron" src="/svg/pricing-select-chevron.svg" alt="" width="12" height="8" />
      </button>
      {/* Carries the value for native required-validation; focusing it shows the field's blue ring. */}
      <input
        className="cv-select-proxy"
        name={name}
        tabIndex={-1}
        aria-hidden="true"
        required={required}
        value={text}
        onChange={() => {}}
        onFocus={() => btnRef.current?.focus()}
      />
      {open && pos && (
        <div
          ref={panelRef}
          className="cv-select-panel"
          role="listbox"
          aria-multiselectable={multi || undefined}
          style={{ top: pos.top, left: pos.left, width: pos.width }}
        >
          {options.map((opt) => (
            <label key={opt} className="cv-option">
              <input
                type={multi ? 'checkbox' : 'radio'}
                name={`${name}-opt`}
                checked={selected.includes(opt)}
                onChange={() => pick(opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default function LeadForm({ title, submitLabel }) {
  const [page, setPage] = useState(1)
  const [v, setV] = useState({ fullName: '', workEmail: '', companyWebsite: '', goals: [], tickets: '', helpdesk: '', social: [], attribution: '' })
  const set = (k) => (val) => setV((s) => ({ ...s, [k]: val }))
  const showSocial = v.goals.includes(SOCIAL_GOAL)

  const onSubmit = (e) => {
    e.preventDefault()
    if (page === 1) setPage(2) // instant page swap (§1.2a)
    // page 2: static clone — no Chili Piper / network submit.
  }

  return (
    <div className="cv-form-frame">
      <div className="cv-form-panel">
        <form className="cv-form" onSubmit={onSubmit}>
          <div className="cv-form-title">
            <h2>{title}</h2>
          </div>
          {/* keyed pages: distinct DOM buttons per page, otherwise "Previous" is reused as the submit
              button mid-click and the form re-submits straight back to page 2 */}
          {page === 1 ? (
            <div key="p1" className="cv-form-page">
              <TextField name="fullName" label="Full name*" autoComplete="name" value={v.fullName} onChange={set('fullName')} />
              <TextField name="workEmail" label="Work email*" type="email" autoComplete="email" value={v.workEmail} onChange={set('workEmail')} />
              <TextField
                name="companyWebsite"
                label="Brand website*"
                autoComplete="url"
                value={v.companyWebsite}
                onChange={set('companyWebsite')}
                validate={(s) => WEBSITE_RE.test(s.trim())}
              />
              <Select name="goals" label="What is your primary goal with Siena?*" placeholder="Select one or more…" options={GOALS} multi value={v.goals} onChange={set('goals')} />
              <div className="cv-form-actions">
                <button type="submit" className="cv-btn cv-btn--md">Next step</button>
              </div>
            </div>
          ) : (
            <div key="p2" className="cv-form-page">
              <Select name="tickets" label="Monthly average tickets*" placeholder="Select one…" options={TICKETS} value={v.tickets} onChange={set('tickets')} />
              <Select name="helpdesk" label="Help desk*" placeholder="Select one…" options={HELPDESKS} value={v.helpdesk} onChange={set('helpdesk')} />
              {showSocial && (
                <Select name="social" label="What do you use for social today?" placeholder="Select any that apply…" options={SOCIAL} multi required={false} value={v.social} onChange={set('social')} />
              )}
              <TextArea name="attribution" label="Where did you hear about us?*" value={v.attribution} onChange={set('attribution')} />
              <div className="cv-form-actions cv-form-actions--p2">
                <button type="button" className="cv-prev-btn" onClick={() => setPage(1)}>Previous</button>
                <button type="submit" className="cv-submit-btn">{submitLabel}</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
