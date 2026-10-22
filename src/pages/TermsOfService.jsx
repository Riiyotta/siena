import LegalPage, { termsTail } from '../components/content/LegalPage.jsx'
import { TERMS } from '../components/content/legalData.js'

// /terms-of-service — T4 legal template. Body prose is placeholder (structure + word counts only).
// The last 6 recorded nodes are the "Previous terms of services" links (+2 empty paragraphs), rendered as termsTail.
export default function TermsOfService() {
  return <LegalPage title="Terms of Service" updated="September 1st, 2025" nodes={TERMS.slice(0, -6)} tail={termsTail} />
}
