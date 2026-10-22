import CompareTemplate from '../components/conversion/CompareTemplate.jsx'
import { KUSTOMER } from '../components/conversion/compareData.js'

// /compare/siena-ai-vs-kustomer-ai — specs/conversion.md §3 + §5
export default function CompareKustomer() {
  return <CompareTemplate data={KUSTOMER} kind="kustomer" />
}
