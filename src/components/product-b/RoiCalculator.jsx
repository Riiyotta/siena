import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// §6.2 ROI calculator: 3 steps, in-memory state only, instant step swaps (no transitions).
// Step 2 does NOT post to n8n/HubSpot in the clone — it validates and advances locally.

// 17-band cost-per-conversation table: first band with min <= v < max, else 0.69
const BANDS = [
  [0, 10000, 0.99], [10000, 15000, 0.97], [15000, 25000, 0.95], [25000, 30000, 0.93], [30000, 40000, 0.91],
  [40000, 50000, 0.89], [50000, 60000, 0.87], [60000, 80000, 0.85], [80000, 100000, 0.83], [100000, 150000, 0.81],
  [150000, 200000, 0.79], [200000, 250000, 0.78], [250000, 300000, 0.76], [300000, 350000, 0.74], [350000, 400000, 0.73],
  [400000, 500000, 0.71], [500000, 1000000, 0.69],
]
export const tier = (v) => (BANDS.find(([min, max]) => min <= v && v < max) ?? [0, 0, 0.69])[2]
export const money = (n) => `$${n.toFixed(2)}`

export function compute({ ticketsVolume, inHouseCost, bpoCost, helpDeskCost, averageOrderValue, automationRate }) {
  const rate = automationRate / 100
  const costPerConv = tier(ticketsVolume)
  const costPerTicket = (inHouseCost + bpoCost + helpDeskCost) / ticketsVolume
  const automated = ticketsVolume * rate
  const convertedOrders = automated * 0.02
  const sienaDrivenRevenue = convertedOrders * averageOrderValue * 0.3
  const totalSavings = automated * costPerTicket
  const yearlyROI = totalSavings + sienaDrivenRevenue - 24000 // flat $24k; siena cost not subtracted
  return { sienaDrivenRevenue, costPerConv, totalSavings, yearlyROI }
}

const ZERO = { ticketsVolume: 0, numberOfAgents: 0, inHouseCost: 0, bpoCost: 0, averageOrderValue: 0, helpDeskCost: 0, automationRate: 20 }

function Arrow() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 17" fill="none" aria-hidden="true">
      <path d="M10 1.5L17 8.5L10 15.5M17 8.5H1" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Field({ label, optional, value, onChange, type = 'number', placeholder, touched }) {
  // numeric inputs render empty while 0 and untouched
  const shown = type === 'number' ? (value === 0 && !touched ? '' : touched ?? value) : value
  return (
    <label className="roi-field">
      <span className="roi-label">
        {label}
        {optional && <span className="roi-optional">(optional)</span>}
      </span>
      <input className="roi-input" type={type} value={shown} placeholder={placeholder} onChange={onChange} />
    </label>
  )
}

export default function RoiCalculator() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [n, setN] = useState(ZERO)
  const [raw, setRaw] = useState({}) // raw strings typed into numeric inputs (keeps "" vs 0 distinction)
  const [contact, setContact] = useState({ firstName: '', lastName: '', email: '', attribution: '' })
  const [error, setError] = useState('')

  const num = (key) => ({
    value: n[key],
    touched: raw[key],
    onChange: (e) => {
      const v = e.target.value
      setRaw((r) => ({ ...r, [key]: v }))
      setN((s) => ({ ...s, [key]: parseFloat(v) || 0 }))
    },
  })
  const txt = (key) => ({ type: 'text', value: contact[key], onChange: (e) => setContact((c) => ({ ...c, [key]: e.target.value })) })

  const next = () => {
    const { ticketsVolume, numberOfAgents, inHouseCost, averageOrderValue, helpDeskCost } = n
    if (!ticketsVolume || !numberOfAgents || !inHouseCost || !averageOrderValue || !helpDeskCost) {
      setError('Please fill in all required fields.')
      return
    }
    setError('')
    setStep(2)
  }
  const viewResults = () => {
    if (!contact.firstName || !contact.lastName || !contact.email || !contact.attribution) {
      setError('Please complete all contact fields.')
      return
    }
    setError('')
    setStep(3) // production posts to n8n + HubSpot here; intentionally skipped in the clone
  }
  const setInt = (key, max) => (e) => {
    const v = parseInt(e.target.value, 10)
    if (Number.isNaN(v)) return
    setN((s) => ({ ...s, [key]: max ? Math.min(max, Math.max(0, v)) : v }))
    if (key === 'ticketsVolume') setRaw((r) => ({ ...r, ticketsVolume: String(v) }))
  }
  const bookDemo = () => {
    setN(ZERO)
    setRaw({})
    navigate('/book-a-demo')
  }

  const r = step === 3 ? compute(n) : null
  const pct = n.automationRate

  return (
    <div className="roi-shell">
      <div className="full-card roi-card">
        {step === 1 && (
          <>
            <h5 className="roi-h5">Plug in your numbers &amp; forecast your future</h5>
            <p className="roi-intro">Use our ROI calculator to see how we make magic happen. It&apos;s quick, easy, and kinda satisfying!</p>
            <div className="roi-row roi-row--s1">
              <Field label="Annual Tickets Volume" {...num('ticketsVolume')} />
              <Field label="Number of Agents" {...num('numberOfAgents')} />
            </div>
            <div className="roi-row roi-row--s1">
              <Field label="Annual In-House Customer Service Team Cost" {...num('inHouseCost')} />
            </div>
            <div className="roi-row roi-row--s1">
              <Field label="Annual BPO Team Cost" optional {...num('bpoCost')} />
            </div>
            <div className="roi-row roi-row--s1">
              <Field label="Average Order Value" {...num('averageOrderValue')} />
              <Field label="Annual Help Desk Cost" {...num('helpDeskCost')} />
            </div>
            {error && <div className="roi-error">{error}</div>}
            <div className="roi-actions">
              <button type="button" className="roi-btn" onClick={next}>
                Next <Arrow />
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h5 className="roi-h5 roi-h5--ruled">Your details</h5>
            <div className="roi-row roi-row--s2">
              <Field label="First Name*" placeholder="John" {...txt('firstName')} />
              <Field label="Last Name*" placeholder="Smith" {...txt('lastName')} />
            </div>
            <div className="roi-row roi-row--s2">
              <Field label="Work Email*" placeholder="john.smith@example.com" {...txt('email')} />
            </div>
            <div className="roi-row roi-row--s2">
              <Field label="Where did you hear about us?*" placeholder="Write us something..." {...txt('attribution')} />
            </div>
            {error && <div className="roi-error">{error}</div>}
            <div className="roi-actions roi-actions--s2">
              <button type="button" className="roi-btn" onClick={viewResults}>
                View results <Arrow />
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h5 className="roi-h5 roi-h5--ruled">1st Year Projections</h5>
            <div className="roi-rate">
              <span className="roi-vlabel">Siena Automation Rate</span>
              <div className="roi-rate-row">
                <input
                  className="roi-range"
                  type="range"
                  min="0"
                  max="100"
                  value={pct}
                  onChange={(e) => setN((s) => ({ ...s, automationRate: parseInt(e.target.value, 10) }))}
                  style={{ background: `linear-gradient(to right, #000 0%, #000 ${pct}%, #ccc ${pct}%, #ccc 100%)` }}
                  aria-label="Siena Automation Rate"
                />
                <input className="roi-box roi-box--rate" type="number" min="0" max="100" value={pct} onChange={setInt('automationRate', 100)} aria-label="Automation rate percent" />
              </div>
            </div>
            <div className="value-input-container">
              <div>
                <span className="roi-vlabel">Annual Ticket Volume</span>
                <p className="roi-help">More tickets, lower cost per conversation with Siena</p>
              </div>
              <input className="roi-box roi-box--tickets" type="number" value={n.ticketsVolume} onChange={setInt('ticketsVolume')} aria-label="Annual Ticket Volume" />
            </div>
            <hr className="roi-hr roi-hr--1" />
            {[
              ['Siena Driven Revenue', money(r.sienaDrivenRevenue)],
              ['Siena Cost per Automated Conversation', money(r.costPerConv)],
              ['Total Savings / Year', money(r.totalSavings)],
              ['Total Yearly ROI After Siena Cost', money(r.yearlyROI)],
              ['Average Response Time', '30 seconds'],
              ['Average Resolution Time', '5 minutes'],
            ].map(([k, v]) => (
              <div key={k} className="result-container">
                <span>{k}</span>
                <span data-testid={k}>{v}</span>
              </div>
            ))}
            <hr className="roi-hr roi-hr--2" />
            <p className="roi-close">
              Want to see Siena&apos;s magic in action? <br />
              Connect with our experts and learn how!
            </p>
            <button type="button" className="roi-btn" onClick={bookDemo}>
              Book a demo
            </button>
          </>
        )}
      </div>
    </div>
  )
}
