import { LeadHeader, LegalRow } from '../components/conversion/ui.jsx'
import { LeadHero } from '../components/conversion/LeadSections.jsx'
import ConvTestimonials from '../components/conversion/ConvTestimonials.jsx'
import { TESTIMONIALS } from '../components/testimonials/data.js'
import '../styles/conversion.css'

// /book-a-demo — specs/conversion.md §2. Global Nav/Footer are hidden for this route (routes.js NAV_OVERRIDES).
export default function BookADemo() {
  return (
    <div className="cv-lead-page">
      <LeadHeader />
      <LeadHero
        variant="book"
        title="See how Siena can transform your brand"
        body="We want to get to know you better! Our team is ready to guide you through how Siena can grow your brand."
        formTitle="Book your demo"
        submitLabel="Book demo"
      />
      <ConvTestimonials
        slides={TESTIMONIALS}
        variant="book"
        eyebrow="real impact. real savings."
        title="People are talking"
      />
      <LegalRow />
    </div>
  )
}
