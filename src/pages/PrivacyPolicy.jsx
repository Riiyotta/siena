import LegalPage from '../components/content/LegalPage.jsx'
import { PRIVACY } from '../components/content/legalData.js'

// /privacy-policy — T5 legal template. Body prose is placeholder (structure + word counts only).
export default function PrivacyPolicy() {
  return <LegalPage title="Privacy Policy" updated="February 20th, 2025" nodes={PRIVACY} mailAfter="14. Contact information" />
}
