import CountUp from './metrics/CountUp.jsx'
import '../styles/metrics.css'

const STATS = [
  { value: '98%', label: 'Faster response time' },
  { value: '90%', label: 'Faster resolution time' },
  { value: '+94.7%', label: 'Average CSAT' },
]

export default function Metrics() {
  return (
    <section className="m-section">
      <img className="m-bg" src="/assets/5VTp1YGCJLYo9Grib0Ouvyooeag.webp" alt="" aria-hidden="true" />

      <div className="m-card">
        <div className="m-top">
          <div className="m-number">
            <CountUp className="m-counter" from={25} to={80} duration={1.5} />
            <p className="m-percent">%</p>
          </div>
          <div className="m-text">
            <h2 className="m-h2">
              Brands using Siena automate up to 80% of customer interactions, achieving faster response times,
              quicker resolutions, and higher customer satisfaction.
            </h2>
            <img className="m-swash" src="/assets/2qwkMa62FY4R6JZFtpnkwc613e8.svg" alt="" aria-hidden="true" />
          </div>
        </div>

        <div className="m-stats">
          {STATS.map((s) => (
            <div key={s.label} className="m-stat">
              <p className="m-stat-value">{s.value}</p>
              <p className="m-stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="m-blur-out" aria-hidden="true" />
    </section>
  )
}
