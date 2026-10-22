// Standalone siena.cx routes cloned locally (blog, customer stories, integrations,
// product updates and webinars are out of scope and stay linked to siena.cx).
export const ROUTES = [
  ['/shopping-agent', 'ShoppingAgent'],
  ['/social-agent', 'SocialAgent'],
  ['/ai-review-management', 'AiReviewManagement'],
  ['/qa-agent', 'QaAgent'],
  ['/topics-explorer', 'TopicsExplorer'],
  ['/ask-siena', 'AskSiena'],
  ['/memory', 'Memory'],
  ['/video', 'Video'],
  ['/order-tracking', 'OrderTracking'],
  ['/products/docs', 'Docs'],
  ['/ai-lab', 'AiLab'],
  ['/roi-calculator', 'RoiCalculator'],
  ['/about-us', 'AboutUs'],
  ['/careers', 'Careers'],
  ['/customers', 'Customers'],
  ['/community', 'Community'],
  ['/events', 'Events'],
  ['/partner-with-siena', 'PartnerWithSiena'],
  ['/refer-a-friend', 'ReferAFriend'],
  ['/pricing', 'Pricing'],
  ['/book-a-demo', 'BookADemo'],
  ['/compare/siena-ai-vs-gorgias-ai', 'CompareGorgias'],
  ['/compare/siena-ai-vs-kustomer-ai', 'CompareKustomer'],
  ['/ai-native-customer-service-vs-help-desk-ai-add-ons', 'AiNativeVsAddOns'],
  ['/insights', 'Insights'],
  ['/insights/sentiment-analysis-online', 'InsightSentimentAnalysis'],
  ['/insights/voice-of-customer-software', 'InsightVoiceOfCustomer'],
  ['/insights/customer-feedback-analytics-software', 'InsightFeedbackAnalytics'],
  ['/conversations', 'Conversations'],
  ['/conversations/thrive-causemetics-ai-customer-service-automation', 'ConversationThrive'],
  ['/conversations/prose-ai-customer-service-automation', 'ConversationProse'],
  ['/conversations/spanx-kylah-field-real-work-ai-customer-experience', 'ConversationSpanx'],
  ['/terms-of-service', 'TermsOfService'],
  ['/privacy-policy', 'PrivacyPolicy'],
]

const LOCAL = new Set(['/', ...ROUTES.map(([path]) => path)])

// Local path for cloned routes, live siena.cx URL for everything else.
export const siteHref = (path) => (LOCAL.has(path) ? path : `https://www.siena.cx${path}`)

// Routes whose nav differs from the homepage (specs/company.md "Global: Nav / Footer").
export const NAV_OVERRIDES = {
  '/careers': { ctaLabel: 'See open roles', ctaHref: '/careers#open-roles' },
  '/about-us': { forceScrolled: true },
  '/social-agent': { forceScrolled: true }, // specs/product-a.md §0
  '/ai-lab': { hideNav: true }, // specs/product-b.md §5.0 — page renders its own dark nav
  // specs/conversion.md: lead-form pages render their own logo header + legal row
  '/pricing': { hideChrome: true },
  '/book-a-demo': { hideChrome: true },
}
