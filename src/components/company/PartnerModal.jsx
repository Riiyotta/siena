import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Field, StaticForm } from './FormField.jsx'
import { XlgButton } from './shared.jsx'

// specs/company.md P5 "Join our partner program" — fixed overlay rgba(0,0,0,.8) (instant), gradient-ring
// panel 600x720 that springs in from x150 (CSS approximation of spring {duration .4, bounce .2});
// closes on backdrop click with a ~150ms panel fade. No close button exists on live.
const PLATFORMS = ['Shopify', 'Shopify Plus', 'Gorgias', 'Zendesk', 'Gladly', 'Intercom', 'Kustomer', 'Recharge', 'Skio', 'Smarttr', 'OrderGroove', 'BigCommerce', 'Magento', 'Salesforce', 'Squarespace', 'Square', 'Other']

function SelectField({ label, name, options }) {
  const [value, setValue] = useState('')
  return (
    <label className="co-field pm-select-field">
      <strong className="co-field-label">{label}</strong>
      <div className="pm-select-wrap">
        <select
          className={`pm-select${value ? '' : ' is-empty'}`}
          name={name}
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          <option value="" disabled>Select one…</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    </label>
  )
}

function PlatformPicker() {
  const [selected, setSelected] = useState([])
  const toggle = (p) => setSelected((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]))
  return (
    <div className="co-field">
      <strong className="co-field-label">Which platform(s) do your clients use?*</strong>
      <div className="pm-pills">
        {PLATFORMS.map((p) => (
          <button key={p} type="button" className={`pm-pill${selected.includes(p) ? ' is-selected' : ''}`} aria-pressed={selected.includes(p)} onClick={() => toggle(p)}>
            {p}
          </button>
        ))}
      </div>
      {/* required comma-joined value, mirrors the live hidden "Buttons" input so native validation applies */}
      <input className="pm-pills-value" name="Buttons" value={selected.join(',')} required tabIndex={-1} aria-hidden="true" onChange={() => {}} />
    </div>
  )
}

export default function PartnerModal({ open, onClose }) {
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (!open) return
    setClosing(false)
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const close = () => {
    setClosing(true)
    window.setTimeout(() => {
      setClosing(false)
      onClose()
    }, 150)
  }

  if (!open) return null
  return createPortal(
    <div className="pm-overlay" onClick={(e) => e.target === e.currentTarget && close()}>
      <div className={`pm-panel${closing ? ' is-closing' : ''}`} role="dialog" aria-modal="true" aria-labelledby="pm-title">
        <div className="pm-inner">
          <StaticForm className="pm-form">
            <h4 id="pm-title" className="co-form-header pm-header">Join our partner program</h4>
            <div className="co-form-row pm-row">
              <Field label="First name*" name="First Name" placeholder="John" required />
              <Field label="Last name*" name="Last Name" placeholder="Smith" required />
            </div>
            <div className="co-form-row pm-row">
              <Field label="Email address*" type="email" name="Email" placeholder="john.smit@example.com" required />
              <Field label="Business website*" name="website" placeholder="www.mywebsite.com" required />
            </div>
            <div className="co-form-row pm-row">
              <Field label="City*" name="City" placeholder="San Francisco" required />
              <Field label="Country*" name="Country" placeholder="United States" required />
            </div>
            <div className="co-form-row pm-row">
              <SelectField label="How big is your team?*" name="Team" options={['1-10', '11-50', '51-100', '101-500', '501+']} />
              <SelectField
                label="Partner type*"
                name="Type"
                options={['Partner (Agency)', 'Partner (BPO)', 'Help Desk Partner', 'Individual Affiliate Partner', 'Tech Partner', 'VC']}
              />
            </div>
            <SelectField label="How many clients do you have at a time?*" name="clients" options={['0-5', '6-15', '16-30', '31+']} />
            <PlatformPicker />
            <label className="co-field">
              <strong className="co-field-label">Drop us a line! Why do you want to join our partner program?*</strong>
              <div className="co-input-wrap pm-textarea-wrap">
                <textarea className="co-input pm-textarea" name="dropLine" placeholder="Write us something..." required />
              </div>
            </label>
            <div className="co-form-submit">
              <XlgButton type="submit" form>Submit</XlgButton>
            </div>
          </StaticForm>
        </div>
      </div>
    </div>,
    document.body,
  )
}
