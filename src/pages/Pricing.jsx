import { LeadHeader, LegalRow } from '../components/conversion/ui.jsx'
import { LeadHero, HowPricing, Enterprise } from '../components/conversion/LeadSections.jsx'
import ConvTestimonials from '../components/conversion/ConvTestimonials.jsx'
import { TESTIMONIALS } from '../components/testimonials/data.js'
import '../styles/conversion.css'

// /pricing — specs/conversion.md §1. Global Nav/Footer are hidden for this route (routes.js NAV_OVERRIDES).
export default function Pricing() {
  return (
    <div className="cv-lead-page">
      <LeadHeader />
      <LeadHero
        variant="pricing"
        title="Grow with one Agent of Record"
        body="One platform for support, shopping, social and more. Tell us what you need and we’ll send pricing that fits."
        formTitle="Get pricing"
        submitLabel="Get pricing"
      />
      <HowPricing />
      <ConvTestimonials slides={TESTIMONIALS} variant="pricing" />
      <Enterprise />
      <LegalRow />
    </div>
  )
}
