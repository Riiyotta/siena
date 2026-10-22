import CompareTemplate from '../components/conversion/CompareTemplate.jsx'
import { GORGIAS } from '../components/conversion/compareData.js'

// /compare/siena-ai-vs-gorgias-ai — specs/conversion.md §3 + §4
export default function CompareGorgias() {
  return <CompareTemplate data={GORGIAS} kind="gorgias" />
}
