import Metrics from '../Metrics.jsx'

// specs/conversion.md §3.6 (compare: identical) / §6.3 (add-ons: H2 in Tiempos 29/43.5 #122023).
// Wraps the homepage component; overrides are scoped in conversion.css (.cv-metrics--*).
export default function ConvMetrics({ kind }) {
  return (
    <div className={`cv-metrics cv-metrics--${kind}`}>
      <Metrics />
    </div>
  )
}
