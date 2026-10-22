// /shopping-agent — specs/product-a.md §1
import { useEffect } from 'react'
import ShoppingHero from '../components/product/shopping/ShoppingHero.jsx'
import ShoppingScrollArea from '../components/product/shopping/ShoppingScrollArea.jsx'
import ExpertAgents from '../components/product/shopping/ExpertAgents.jsx'
import ContentTimer from '../components/product/shopping/ContentTimer.jsx'
import { ProductCta, ProductTestimonial } from '../components/product/sections.jsx'
import { SectionTitle } from '../components/product/ui.jsx'
import { ph } from '../components/product/placeholder.js'

// Customer quotes not in testimonials/data.js -> length-matched placeholders (names/roles/logos real).
const SLIDES = [
  { name: 'Katie Mitchell', role: 'Customer Experience Manager', logo: 'cWSgPP32JnZ7g664uzOfA2s8kg.svg', logoAlt: 'Simple Modern', image: 'un5gsMUPuAE28uvzojNnQ2Mpw.webp', imageAlt: 'Photo of Katie Mitchell', quote: ph(228) },
  { name: 'Oana Sale', role: 'VP of CX', logo: 'LSDtiaYEMw66OjmYASlgwlerh24.svg', logoAlt: 'Dossier', image: '9fA2lBSmySE9x9KeEK3zvBHdnS8.webp', imageAlt: 'Photo of Oana Sale', quote: ph(130), href: 'https://www.siena.cx/customer-stories/dossier' },
]

export default function ShoppingAgent() {
  useEffect(() => {
    document.title = 'Siena Shopping Agent - Turn conversations into conversions'
  }, [])
  return (
    <div className="pa-page">
      <ShoppingHero />
      <ProductTestimonial variant="shopping" slides={SLIDES} />
      <div className="sa-title-block">
        <SectionTitle
          maxW={1062}
          eyebrow="The complete agentic commerce platform"
          title="AI that learns, sells, and scales"
          sub="See how leading brands turn customer conversations into measurable revenue growth with AI that sells, not just supports."
          subMax={680}
        />
      </div>
      <ShoppingScrollArea />
      <ExpertAgents />
      <ContentTimer />
      <ProductCta variant="shopping" heading="Turn conversations into conversions" />
    </div>
  )
}
