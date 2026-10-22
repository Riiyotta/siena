// Nav / mega-menu content — text, hrefs and Font Awesome 6 Sharp Light codepoints
// copied from the saved original HTML (CLONE_SPEC §1).

export const ANNOUNCEMENT_HREF = 'https://www.siena.cx/blog/siena-raises-17m-series-a'
export const DEMO_HREF = '/book-a-demo'

export const NAV_LINKS = [
  { label: 'Product', panel: 'products' },
  { label: 'Customers', href: '/customers' },
  { label: 'Resources', panel: 'resources' },
  // Partners / Company mega-menu content is not present in the saved HTML or the spec — see handoff.
  { label: 'Partners', panel: null, dropdown: true },
  { label: 'Company', panel: null, dropdown: true },
]

export const PRODUCT_COLUMNS = [
  {
    title: 'AI agents',
    comingSoon: true,
    items: [
      { title: 'Customer Service Agent', desc: 'Empathic AI for support', icon: '', href: '/ai-native-customer-service-vs-help-desk-ai-add-ons' },
      { title: 'Shopping Agent', desc: 'Turn converations into purchases', icon: '', href: '/shopping-agent' },
      { title: 'Reviews Agent', desc: 'Put review management on autopilot', icon: '', href: '/ai-review-management' },
    ],
  },
  {
    title: 'intelligence',
    titleComingSoon: true,
    items: [
      { title: 'QA Agent', desc: 'Score every conversation automatically', icon: '', href: '/qa-agent' },
      { title: 'Quality Assurance', desc: 'Score every conversation, automatically', icon: '', href: '/qa-agent' },
      { title: 'Topics Explorer', desc: 'Your VoC Tool built on real conversations', icon: '', href: '/topics-explorer' },
      { title: 'Ask Siena', desc: 'From insights to a better-built Siena', icon: '', href: '/ask-siena' },
    ],
  },
]

// First entry: saved HTML renders "Video / Siena watches…" twice (CMS duplicate) but the element is
// named/aria-labelled "Memory" with href /memory; label + description taken from recon/nav-product-open.png.
export const CAPABILITIES = [
  { title: 'Memory', desc: 'Personalized experiences that remember', icon: '', href: '/memory' },
  { title: 'Video', desc: 'Siena watches, understands, and resolves', icon: '', href: '/video' },
  { title: 'Order Tracking', desc: 'Native tracking across 2,000+ carriers', icon: '', href: '/order-tracking' },
]

// hrefs copied verbatim from the saved HTML (several point at unrelated pages on the live site).
export const RESOURCE_LINKS = [
  { title: 'Blog', icon: '', href: '/ai-review-management' },
  { title: 'Community', icon: '', href: '/memory' },
  { title: 'Events', icon: '', href: '/memory' },
  { title: 'Webinars', icon: '', href: '/memory' },
  { title: 'Certification', icon: '', href: '/memory' },
  { title: 'ROI Calculator', icon: '', href: '/memory' },
]

const AUTHOR = '/assets/JGnGkyrUgWm5fpSCETDcdK3Ko.webp'
export const BLOG_POSTS = [
  { title: 'Siena Social Agent: The AI Agent for Social Media Management', image: '/assets/pAbTqaaTXfz9RVYyy244qfh4E.webp', avatars: [AUTHOR], href: 'https://www.siena.cx/blog/siena-social-agent-social-media-management' },
  { title: 'Siena Raises $17M Series A to Build the Agent of Record', image: '/assets/6gPxJokSkZLoVr3dFT3bg46GvU.png', avatars: [AUTHOR, '/assets/JsXaXuQMFTUxg1b4aImxuHSlrU.jpeg'], href: 'https://www.siena.cx/blog/siena-raises-17m-series-a' },
  { title: 'Ask Siena. The first AI agent built for brand operators', image: '/assets/DQAhfGGzvnqQC9HpTOLVLoH1NQ.webp', avatars: [AUTHOR], href: 'https://www.siena.cx/blog/ask-siena-agent-builder-customer-intelligence' },
]

export const WORKS_WITH = ['Shopify', 'zendesk', 'yotpo', 'Recharge']
export const INTEGRATIONS_HREF = 'https://www.siena.cx/integrations'
export const VIEW_INTEGRATIONS_ICON = ''
export const COMING_SOON_ICON = ''
