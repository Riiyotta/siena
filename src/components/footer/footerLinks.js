// Footer link data — text + hrefs from the saved siena.cx HTML (CLONE_SPEC §10).
import { siteHref } from '../../routes.js'

export const company = [
  { label: 'About Us', href: siteHref('/about-us') },
  { label: 'Careers', href: siteHref('/careers') },
  { label: 'Customers', href: siteHref('/customers') },
  { label: 'Security', href: 'https://sienaai.trust.site/' },
  { label: 'Product Updates', href: siteHref('/product-updates') },
]

export const legal = [
  { label: 'Terms of Service', href: siteHref('/terms-of-service') },
  { label: 'Privacy Policy', href: siteHref('/privacy-policy') },
]

export const platform = [
  { label: 'Customer Service Agent', href: siteHref('/') },
  { label: 'Shopping Agent', href: siteHref('/shopping-agent') },
  { label: 'Social Agent', href: siteHref('/social-agent') },
  { label: 'Ask Siena', href: siteHref('/ask-siena') },
  { label: 'QA Agent', href: siteHref('/qa-agent') },
  { label: 'Topics Explorer', href: siteHref('/topics-explorer') },
  { label: 'Reviews Agent', href: siteHref('/ai-review-management') },
  { label: 'Memory', href: siteHref('/memory') },
  { label: 'Docs', href: siteHref('/products/docs') },
  { label: 'Integrations', href: siteHref('/integrations') },
]

// `phoneOrder` = Framer phone-variant grid order (2-column grid < 810px).
export const resources = [
  { label: 'Blog', href: siteHref('/blog'), phoneOrder: 0 },
  { label: 'Community', href: siteHref('/community'), phoneOrder: 1 },
  { label: 'Events', href: siteHref('/events'), phoneOrder: 2 },
  { label: 'Conversations', href: siteHref('/conversations'), phoneOrder: 7 },
  { label: 'Webinars', href: siteHref('/webinars'), phoneOrder: 3 },
  { label: 'ROI Calculator', href: siteHref('/roi-calculator'), phoneOrder: 4 },
  { label: 'Pricing', href: siteHref('/pricing'), phoneOrder: 8 },
  { label: 'Choose Dedicated AI', href: siteHref('/ai-native-customer-service-vs-help-desk-ai-add-ons'), phoneOrder: 5 },
  { label: 'AI LAB', href: siteHref('/ai-lab'), phoneOrder: 6 },
]

export const partners = [
  { label: 'Partner with Siena', href: siteHref('/partner-with-siena') },
  { label: 'Refer a Friend', href: siteHref('/refer-a-friend') },
]

export const social = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/siena-ai', glyph: '' },
  { label: 'X', href: 'https://x.com/siena_ai', glyph: '' },
]
