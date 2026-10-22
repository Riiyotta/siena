// /ai-review-management — specs/product-a.md §3
import { useEffect } from 'react'
import { ReviewsFeatures, ReviewsHero, ReviewsIntegrations, ReviewsTimer } from '../components/product/reviews/ReviewsParts.jsx'
import { LogosBlock, ProductCta, ProductTestimonial } from '../components/product/sections.jsx'
import { EdgeFades } from '../components/product/ui.jsx'
import { TESTIMONIALS } from '../components/testimonials/data.js'

export default function AiReviewManagement() {
  useEffect(() => {
    document.title = 'Siena Reviews Agent - The Agentic Commerce Intelligence Layer'
  }, [])
  return (
    <div className="pa-page pa-page--reviews">
      <ReviewsHero />
      <LogosBlock />
      <EdgeFades top={1024} mTop={1064} />
      <ReviewsFeatures />
      <ProductTestimonial variant="reviews" slides={TESTIMONIALS}>
        <div className="pt-fade-top" aria-hidden="true" />
      </ProductTestimonial>
      <ReviewsTimer />
      <ReviewsIntegrations />
      <ProductCta variant="reviews" blur="cream" />
    </div>
  )
}
