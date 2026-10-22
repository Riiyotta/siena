# Siena AI (siena.cx) local clone

Source: Siena AI (siena.cx) local clone · https://www.siena.cx/ (originally Framer), rebuilt in React 18 + Vite + Tailwind v3 + react-router-dom v6, local clone
Status: **measured-from-codebase** · production approved: **false**
35 routes · 29 templates · 129 unique sections

> Generated from `ia.json` by `build.mjs`. Edit the JSON, not this file.

## Shape of the site

The largest 3 templates (Insights landing, Conversation detail, Competitor compare) account for 8 of 35 routes (23%). The remaining 27 routes span 26 templates.

| template | routes | share |
|---|---:|---:|
| Insights landing | 3 | 9% |
| Conversation detail | 3 | 9% |
| Competitor compare | 2 | 6% |
| Legal document | 2 | 6% |
| Homepage | 1 | 3% |
| Shopping Agent | 1 | 3% |
| Social Agent | 1 | 3% |
| AI Review Management | 1 | 3% |
| QA Agent | 1 | 3% |
| Topics Explorer | 1 | 3% |
| Ask Siena | 1 | 3% |
| Memory | 1 | 3% |
| Video | 1 | 3% |
| Order Tracking | 1 | 3% |
| Docs | 1 | 3% |
| AI Lab | 1 | 3% |
| ROI Calculator | 1 | 3% |
| About Us | 1 | 3% |
| Careers | 1 | 3% |
| Customers | 1 | 3% |
| Community | 1 | 3% |
| Events | 1 | 3% |
| Partner with Siena | 1 | 3% |
| Refer a Friend | 1 | 3% |
| Pricing (lead form) | 1 | 3% |
| Book a demo (lead form) | 1 | 3% |
| AI-native vs add-ons | 1 | 3% |
| Insights landing (no integrations/testimonial) | 1 | 3% |
| Conversations index | 1 | 3% |

## Page chrome

**29 routes carry chrome = `full`** — Homepage, Shopping Agent, AI Review Management, QA Agent, Topics Explorer, Ask Siena, Memory, Video, Order Tracking, Docs, ROI Calculator, Customers, Community, Events, Partner with Siena, Refer a Friend, Competitor compare, AI-native vs add-ons, Insights landing, Insights landing (no integrations/testimonial), Conversations index, Conversation detail, Legal document.

**2 routes carry chrome = `full-solid-nav`** — Social Agent, About Us.

**1 routes carry chrome = `own-nav`** — AI Lab.

**1 routes carry chrome = `full-alt-cta`** — Careers.

**2 routes carry chrome = `none`** — Pricing (lead form), Book a demo (lead form).

## Sections by reuse

How widely a section is shared determines whether it belongs in a shared
component library or stays local to its page.

| section | category | templates | routes | implementation | scope |
|---|---|---:|---:|---|---|
| `chrome.site-footer` | CHROME | 27 | 33 | `Footer.jsx` | Rendered by App.jsx's Chrome wrapper on 33 routes: every route except the two hideChrome lead-form pages. |
| `chrome.site-nav` | CHROME | 26 | 32 | `Nav.jsx` | Rendered by App.jsx's Chrome wrapper on 32 routes: every route except /ai-lab, /pricing and /book-a-demo. |
| `convert.product-cta` | CONVERT | 6 | 6 | `product/sections.jsx > ProductCta` | All six product-A agent pages. |
| `proof.product-logos` | PROOF | 5 | 5 | `product/sections.jsx > LogosBlock` | Social Agent, AI Review Management, QA Agent, Topics Explorer and Ask Siena pages. |
| `proof.product-testimonial` | PROOF | 5 | 5 | `product/sections.jsx > ProductTestimonial` | Shopping Agent, AI Review Management, QA Agent, Topics Explorer and Ask Siena pages. |
| `convert.product-b-cta` | CONVERT | 5 | 5 | `product-b/shared.jsx > CtaB` | Memory, Video, Order Tracking, Docs and ROI Calculator pages. |
| `convert.company-cta` | CONVERT | 5 | 5 | `company/CompanyCta.jsx` | About Us, Careers, Customers, Partner with Siena and Refer a Friend pages. |
| `proof.metrics` | PROOF | 3 | 4 | `Metrics.jsx (wrapped by conversion/ConvMetrics.jsx on conversion pages)` | Homepage, both compare pages and the add-ons page. |
| `proof.conv-testimonials` | PROOF | 3 | 4 | `conversion/ConvTestimonials.jsx` | Pricing, book-a-demo and both compare pages. |
| `hero.insights` | HERO | 2 | 4 | `content/InsightsPage.jsx > Hero` | All four insights routes. |
| `proof.insights-logos` | PROOF | 2 | 4 | `content/InsightsPage.jsx > Logos` | All four insights routes. |
| `product.insights-feature-rows` | PRODUCT | 2 | 4 | `content/InsightsPage.jsx > FeatureRow` | All four insights routes. |
| `convert.insights-agent-promo` | CONVERT | 2 | 4 | `content/InsightsPage.jsx > Promo` | All four insights routes. |
| `content.insights-announcement` | CONTENT | 2 | 4 | `content/InsightsPage.jsx > Announcement` | All four insights routes. |
| `convert.demo-form-cta` | CONVERT | 2 | 4 | `content/DemoFormCta.jsx` | All four insights routes. |
| `convert.newsletter-cta` | CONVERT | 2 | 4 | `content/NewsletterCta.jsx` | The conversations index and the three conversation detail pages. |
| `proof.product-logo-ticker` | PROOF | 3 | 3 | `product-b/shared.jsx > ProductLogoTicker` | Memory, Video and Order Tracking pages. |
| `proof.product-b-testimonial` | PROOF | 3 | 3 | `product-b/TestimonialSlider.jsx` | Memory, Docs and ROI Calculator pages. |
| `faq.product-faq` | FAQ | 3 | 3 | `product/sections.jsx > Faq` | Social Agent, QA Agent and Topics Explorer pages. |
| `product.conv-sticky-area` | PRODUCT | 2 | 3 | `conversion/StickyArea.jsx` | Both compare pages and the add-ons page. |
| `convert.conv-cta` | CONVERT | 2 | 3 | `conversion/ConvCta.jsx` | Both compare pages and the add-ons page. |
| `proof.insights-testimonial` | PROOF | 1 | 3 | `content/InsightsPage.jsx > Testimonial` | The insights hub and the sentiment-analysis and voice-of-customer subpages. |
| `stack.insights-integrations` | STACK | 1 | 3 | `content/InsightsPage.jsx > Integrations` | The insights hub and the sentiment-analysis and voice-of-customer subpages. |
| `content.article-header` | CONTENT | 1 | 3 | `content/ConversationArticle.jsx > header` | The three conversation detail pages. |
| `content.article-video` | CONTENT | 1 | 3 | `content/ConversationArticle.jsx > video` | The three conversation detail pages. |
| `content.article-summary` | CONTENT | 1 | 3 | `content/ConversationArticle.jsx > Block (summary, takeaways)` | The three conversation detail pages. |
| `content.article-chapters` | CONTENT | 1 | 3 | `content/ConversationArticle.jsx > Block (chapters)` | The three conversation detail pages. |
| `content.article-transcript-chapter` | CONTENT | 1 | 3 | `content/ConversationArticle.jsx > Transcript` | The three conversation detail pages. |
| `content.article-faq` | CONTENT | 1 | 3 | `content/ConversationArticle.jsx > Block (faq)` | The three conversation detail pages. |
| `chrome.lead-header` | CHROME | 2 | 2 | `conversion/ui.jsx > LeadHeader` | The pricing and book-a-demo pages (NAV_OVERRIDES hideChrome). |
| `chrome.legal-row` | CHROME | 2 | 2 | `conversion/ui.jsx > LegalRow` | The pricing and book-a-demo pages (NAV_OVERRIDES hideChrome). |
| `hero.underline-title` | HERO | 2 | 2 | `company/UnderlineTitle.jsx` | The customers and events pages. |
| `hero.lead-form` | HERO | 2 | 2 | `conversion/LeadSections.jsx > LeadHero` | The pricing and book-a-demo pages. |
| `proof.company-slider` | PROOF | 2 | 2 | `company/CompanySlider.jsx` | Partner with Siena and Refer a Friend pages. |
| `product.ask-siena-mockup` | PRODUCT | 2 | 2 | `product/qa/QaParts.jsx > AskSienaMockup` | QA Agent and Topics Explorer pages. |
| `product.product-b-sticky-scroll` | PRODUCT | 2 | 2 | `product-b/StickyScroll.jsx` | Video and Order Tracking pages. |
| `stack.product-integrations` | STACK | 2 | 2 | `product/sections.jsx > ProductIntegrations` | Social Agent and Ask Siena pages. |
| `stack.product-enterprise` | STACK | 2 | 2 | `product/sections.jsx > Enterprise` | Social Agent and Ask Siena pages. |
| `evaluate.before-after` | EVALUATE | 2 | 2 | `product/sections.jsx > BeforeAfter` | QA Agent and Topics Explorer pages. |
| `faq.product-b-faq` | FAQ | 2 | 2 | `product-b/Faq.jsx` | Order Tracking and Docs pages. |
| `hero.compare` | HERO | 1 | 2 | `conversion/ConvHero.jsx > CompareHero` | Both compare pages. |
| `stack.conv-integrations` | STACK | 1 | 2 | `conversion/ConvIntegrations.jsx` | Both compare pages. |
| `evaluate.compare-table` | EVALUATE | 1 | 2 | `conversion/CompareTable.jsx` | Both compare pages. |
| `faq.conv-faq` | FAQ | 1 | 2 | `conversion/Faq.jsx` | Both compare pages. |
| `content.legal-header` | CONTENT | 1 | 2 | `content/LegalPage.jsx > header` | Terms of service and privacy policy pages. |
| `content.legal-section` | CONTENT | 1 | 2 | `content/LegalPage.jsx > lg-rt` | Terms of service and privacy policy pages. |
| `chrome.ai-lab-nav` | CHROME | 1 | 1 | `product-b/AiLabNav.jsx` | Only the AI Lab page (NAV_OVERRIDES hideNav). |
| `hero.home` | HERO | 1 | 1 | `Hero.jsx` | Homepage only. |
| `hero.shopping-agent` | HERO | 1 | 1 | `product/shopping/ShoppingHero.jsx` | Shopping Agent page only. |
| `hero.social-agent` | HERO | 1 | 1 | `product/social/SocialHero.jsx` | Social Agent page only. |
| `hero.reviews-agent` | HERO | 1 | 1 | `product/reviews/ReviewsParts.jsx > ReviewsHero` | AI Review Management page only. |
| `hero.qa-agent` | HERO | 1 | 1 | `product/qa/QaParts.jsx > QaHero` | QA Agent page only. |
| `hero.topics-explorer` | HERO | 1 | 1 | `product/topics/TopicsParts.jsx > TopicsHero` | Topics Explorer page only. |
| `hero.ask-siena` | HERO | 1 | 1 | `product/ask/AskParts.jsx > AskHero` | Ask Siena page only. |
| `hero.memory` | HERO | 1 | 1 | `pages/Memory.jsx > mh-hero` | Memory page only. |
| `hero.video` | HERO | 1 | 1 | `pages/Video.jsx > vh-hero` | Video page only. |
| `hero.order-tracking` | HERO | 1 | 1 | `pages/OrderTracking.jsx > oh-hero` | Order Tracking page only. |
| `hero.docs` | HERO | 1 | 1 | `pages/Docs.jsx > dh-hero` | Docs page only. |
| `hero.ai-lab` | HERO | 1 | 1 | `pages/AiLab.jsx > al-hero` | AI Lab page only. |
| `hero.roi-calculator` | HERO | 1 | 1 | `product-b/RoiCalculator.jsx (inside pages/RoiCalculator.jsx > rh-hero)` | ROI Calculator page only. |
| `hero.about-us` | HERO | 1 | 1 | `pages/AboutUs.jsx > ab-hero` | About Us page only. |
| `hero.careers` | HERO | 1 | 1 | `pages/Careers.jsx > ca-hero` | Careers page only. |
| `hero.community-invite` | HERO | 1 | 1 | `pages/Community.jsx > cm-hero` | Community page only. |
| `hero.partner` | HERO | 1 | 1 | `pages/PartnerWithSiena.jsx > pw-hero` | Partner with Siena page only. |
| `hero.refer-a-friend` | HERO | 1 | 1 | `pages/ReferAFriend.jsx > rf-hero` | Refer a Friend page only. |
| `hero.addons` | HERO | 1 | 1 | `conversion/ConvHero.jsx > AddonsHero` | AI-native vs add-ons page only. |
| `proof.home-testimonials` | PROOF | 1 | 1 | `Testimonials.jsx` | Homepage only. |
| `proof.customer-stories` | PROOF | 1 | 1 | `CustomerStories.jsx` | Homepage only. |
| `proof.investors-grid` | PROOF | 1 | 1 | `pages/AboutUs.jsx > ab-investors (company/LogoGrid.jsx)` | About Us page only. |
| `proof.wall-of-love` | PROOF | 1 | 1 | `pages/Customers.jsx > wl-section (company/VerticalTicker.jsx)` | Customers page only. |
| `proof.community-logo-ticker` | PROOF | 1 | 1 | `company/HTicker.jsx` | Community page only. |
| `proof.partner-logo-grids` | PROOF | 1 | 1 | `pages/PartnerWithSiena.jsx > pw-partners (company/LogoGrid.jsx)` | Partner with Siena page only. |
| `product.home-scroll-area` | PRODUCT | 1 | 1 | `ScrollArea.jsx` | Homepage only. |
| `product.home-features` | PRODUCT | 1 | 1 | `Features.jsx` | Homepage only. |
| `product.shopping-platform-title` | PRODUCT | 1 | 1 | `product/ui.jsx > SectionTitle` | Shopping Agent page only. |
| `product.shopping-scroll-area` | PRODUCT | 1 | 1 | `product/shopping/ShoppingScrollArea.jsx` | Shopping Agent page only. |
| `product.expert-agents` | PRODUCT | 1 | 1 | `product/shopping/ExpertAgents.jsx` | Shopping Agent page only. |
| `product.shopping-content-timer` | PRODUCT | 1 | 1 | `product/shopping/ContentTimer.jsx` | Shopping Agent page only. |
| `product.social-features` | PRODUCT | 1 | 1 | `product/social/SocialFeatures.jsx` | Social Agent page only. |
| `product.more-in-the-box` | PRODUCT | 1 | 1 | `product/social/MoreInTheBox.jsx` | Social Agent page only. |
| `product.reviews-features` | PRODUCT | 1 | 1 | `product/reviews/ReviewsParts.jsx > ReviewsFeatures` | AI Review Management page only. |
| `product.reviews-timer` | PRODUCT | 1 | 1 | `product/reviews/ReviewsParts.jsx > ReviewsTimer` | AI Review Management page only. |
| `product.qa-complete-coverage` | PRODUCT | 1 | 1 | `product/qa/QaParts.jsx > CompleteCoverage` | QA Agent page only. |
| `product.qa-leaderboard` | PRODUCT | 1 | 1 | `product/qa/QaParts.jsx > Leaderboard` | QA Agent page only. |
| `product.qa-act-on-what-matters` | PRODUCT | 1 | 1 | `product/qa/QaParts.jsx > ActOnWhatMatters` | QA Agent page only. |
| `product.topics-features` | PRODUCT | 1 | 1 | `product/topics/TopicsParts.jsx > TopicsFeatures` | Topics Explorer page only. |
| `product.topics-alerts` | PRODUCT | 1 | 1 | `product/topics/TopicsParts.jsx > TopicsAlerts` | Topics Explorer page only. |
| `product.ask-chip-nav` | PRODUCT | 1 | 1 | `product/ask/AskParts.jsx > ChipNav` | Ask Siena page only. |
| `product.ask-features-a` | PRODUCT | 1 | 1 | `product/ask/AskParts.jsx > FeaturesA` | Ask Siena page only. |
| `product.ask-features-b` | PRODUCT | 1 | 1 | `product/ask/AskParts.jsx > FeaturesB` | Ask Siena page only. |
| `product.ask-key-capabilities` | PRODUCT | 1 | 1 | `product/ask/AskParts.jsx > KeyCapabilities` | Ask Siena page only. |
| `product.ask-playbooks` | PRODUCT | 1 | 1 | `product/ask/AskParts.jsx > Playbooks` | Ask Siena page only. |
| `product.ask-slack` | PRODUCT | 1 | 1 | `product/ask/AskParts.jsx > SlackSection` | Ask Siena page only. |
| `product.memory-feature-remembers` | PRODUCT | 1 | 1 | `pages/Memory.jsx > mf-section` | Memory page only. |
| `product.memory-feature-insights` | PRODUCT | 1 | 1 | `pages/Memory.jsx > mf-section--2` | Memory page only. |
| `product.memory-how-it-works` | PRODUCT | 1 | 1 | `pages/Memory.jsx > mw-section` | Memory page only. |
| `product.memory-in-action` | PRODUCT | 1 | 1 | `product-b/MemoryCarousel.jsx` | Memory page only. |
| `product.video-how-it-works` | PRODUCT | 1 | 1 | `pages/Video.jsx > vw-section` | Video page only. |
| `product.order-tracking-simplify` | PRODUCT | 1 | 1 | `pages/OrderTracking.jsx > op-section` | Order Tracking page only. |
| `product.docs-one-home` | PRODUCT | 1 | 1 | `pages/Docs.jsx > do-section` | Docs page only. |
| `product.docs-change-once` | PRODUCT | 1 | 1 | `pages/Docs.jsx > dcc-section` | Docs page only. |
| `product.docs-bento` | PRODUCT | 1 | 1 | `pages/Docs.jsx > db-section` | Docs page only. |
| `product.conv-features` | PRODUCT | 1 | 1 | `conversion/ConvFeatures.jsx` | AI-native vs add-ons page only. |
| `stack.home-integrations` | STACK | 1 | 1 | `Integrations.jsx` | Homepage only. |
| `stack.reviews-integrations` | STACK | 1 | 1 | `product/reviews/ReviewsParts.jsx > ReviewsIntegrations` | AI Review Management page only. |
| `stack.lead-enterprise` | STACK | 1 | 1 | `conversion/LeadSections.jsx > Enterprise` | Pricing page only. |
| `evaluate.how-pricing-works` | EVALUATE | 1 | 1 | `conversion/LeadSections.jsx > HowPricing` | Pricing page only. |
| `evaluate.docs-before-with` | EVALUATE | 1 | 1 | `pages/Docs.jsx > dbw-section` | Docs page only. |
| `company.about-story-scroll` | COMPANY | 1 | 1 | `company/HScrollStory.jsx` | About Us page only. |
| `company.our-team` | COMPANY | 1 | 1 | `company/OurTeam.jsx` | About Us page only. |
| `company.careers-letter` | COMPANY | 1 | 1 | `pages/Careers.jsx > ca-letter` | Careers page only. |
| `company.careers-why` | COMPANY | 1 | 1 | `pages/Careers.jsx > ca-why` | Careers page only. |
| `company.careers-how` | COMPANY | 1 | 1 | `pages/Careers.jsx > ca-how` | Careers page only. |
| `company.open-roles` | COMPANY | 1 | 1 | `company/RolesList.jsx` | Careers page only. |
| `company.refer-criteria` | COMPANY | 1 | 1 | `pages/ReferAFriend.jsx > rf-criteria` | Refer a Friend page only. |
| `company.ai-lab-intro` | COMPANY | 1 | 1 | `pages/AiLab.jsx > al-intro` | AI Lab page only. |
| `company.ai-lab-what` | COMPANY | 1 | 1 | `pages/AiLab.jsx > al-what` | AI Lab page only. |
| `company.ai-lab-how` | COMPANY | 1 | 1 | `pages/AiLab.jsx > al-how` | AI Lab page only. |
| `company.ai-lab-practitioner` | COMPANY | 1 | 1 | `pages/AiLab.jsx > al-dark` | AI Lab page only. |
| `company.ai-lab-last` | COMPANY | 1 | 1 | `pages/AiLab.jsx > al-last` | AI Lab page only. |
| `company.ai-lab-who` | COMPANY | 1 | 1 | `pages/AiLab.jsx > al-who` | AI Lab page only. |
| `content.customer-story-grid` | CONTENT | 1 | 1 | `company/StoryGrid.jsx` | Customers page only. |
| `content.events-list` | CONTENT | 1 | 1 | `pages/Events.jsx > ev-list` | Events page only. |
| `content.conversations-header` | CONTENT | 1 | 1 | `pages/Conversations.jsx > header` | Conversations index page only. |
| `content.conversations-grid` | CONTENT | 1 | 1 | `pages/Conversations.jsx > ct-conv-grid` | Conversations index page only. |
| `convert.main-cta` | CONVERT | 1 | 1 | `MainCta.jsx` | Homepage only. |
| `convert.events-newsletter` | CONVERT | 1 | 1 | `pages/Events.jsx > ev-news` | Events page only. |
| `convert.ai-lab-newsletter` | CONVERT | 1 | 1 | `pages/AiLab.jsx > Newsletter` | AI Lab page only. |
| `convert.partner-modal` | CONVERT | 1 | 1 | `company/PartnerModal.jsx` | Partner with Siena page only. |

**32 shared sections** appear in more than one template and belong in a component library.

**97 single-use sections** appear in exactly one template. Building these
as "reusable" components up front would be speculative — keep them page-local
until a second caller actually appears.

## Templates

### Homepage — `template.home`

1 route · `/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.home` | page-local |
| 3 | PROOF | `proof.home-testimonials` | page-local |
| 4 | PRODUCT | `product.home-scroll-area` | page-local |
| 5 | PROOF | `proof.metrics` | shared ×3 |
| 6 | PROOF | `proof.customer-stories` | page-local |
| 7 | PRODUCT | `product.home-features` | page-local |
| 8 | STACK | `stack.home-integrations` | page-local |
| 9 | CONVERT | `convert.main-cta` | page-local |
| 10 | CHROME | `chrome.site-footer` | shared ×27 |

### Shopping Agent — `template.shopping-agent`

1 route · `/shopping-agent` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.shopping-agent` | page-local |
| 3 | PROOF | `proof.product-testimonial` | shared ×5 |
| 4 | PRODUCT | `product.shopping-platform-title` | page-local |
| 5 | PRODUCT | `product.shopping-scroll-area` | page-local |
| 6 | PRODUCT | `product.expert-agents` | page-local |
| 7 | PRODUCT | `product.shopping-content-timer` | page-local |
| 8 | CONVERT | `convert.product-cta` | shared ×6 |
| 9 | CHROME | `chrome.site-footer` | shared ×27 |

### Social Agent — `template.social-agent`

1 route · `/social-agent` · chrome: **full-solid-nav**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.social-agent` | page-local |
| 3 | PROOF | `proof.product-logos` | shared ×5 |
| 4 | PRODUCT | `product.social-features` | page-local |
| 5 | PRODUCT | `product.more-in-the-box` | page-local |
| 6 | FAQ | `faq.product-faq` | shared ×3 |
| 7 | STACK | `stack.product-integrations` | shared ×2 |
| 8 | STACK | `stack.product-enterprise` | shared ×2 |
| 9 | CONVERT | `convert.product-cta` | shared ×6 |
| 10 | CHROME | `chrome.site-footer` | shared ×27 |

### AI Review Management — `template.ai-review-management`

1 route · `/ai-review-management` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.reviews-agent` | page-local |
| 3 | PROOF | `proof.product-logos` | shared ×5 |
| 4 | PRODUCT | `product.reviews-features` | page-local |
| 5 | PROOF | `proof.product-testimonial` | shared ×5 |
| 6 | PRODUCT | `product.reviews-timer` | page-local |
| 7 | STACK | `stack.reviews-integrations` | page-local |
| 8 | CONVERT | `convert.product-cta` | shared ×6 |
| 9 | CHROME | `chrome.site-footer` | shared ×27 |

### QA Agent — `template.qa-agent`

1 route · `/qa-agent` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.qa-agent` | page-local |
| 3 | PROOF | `proof.product-logos` | shared ×5 |
| 4 | PRODUCT | `product.qa-complete-coverage` | page-local |
| 5 | PROOF | `proof.product-testimonial` | shared ×5 |
| 6 | PRODUCT | `product.qa-leaderboard` | page-local |
| 7 | PRODUCT | `product.qa-act-on-what-matters` | page-local |
| 8 | PRODUCT | `product.ask-siena-mockup` | shared ×2 |
| 9 | EVALUATE | `evaluate.before-after` | shared ×2 |
| 10 | FAQ | `faq.product-faq` | shared ×3 |
| 11 | CONVERT | `convert.product-cta` | shared ×6 |
| 12 | CHROME | `chrome.site-footer` | shared ×27 |

### Topics Explorer — `template.topics-explorer`

1 route · `/topics-explorer` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.topics-explorer` | page-local |
| 3 | PROOF | `proof.product-logos` | shared ×5 |
| 4 | PRODUCT | `product.topics-features` | page-local |
| 5 | PROOF | `proof.product-testimonial` | shared ×5 |
| 6 | PRODUCT | `product.ask-siena-mockup` | shared ×2 |
| 7 | PRODUCT | `product.topics-alerts` | page-local |
| 8 | EVALUATE | `evaluate.before-after` | shared ×2 |
| 9 | FAQ | `faq.product-faq` | shared ×3 |
| 10 | CONVERT | `convert.product-cta` | shared ×6 |
| 11 | CHROME | `chrome.site-footer` | shared ×27 |

### Ask Siena — `template.ask-siena`

1 route · `/ask-siena` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.ask-siena` | page-local |
| 3 | PROOF | `proof.product-logos` | shared ×5 |
| 4 | PRODUCT | `product.ask-chip-nav` | page-local |
| 5 | PRODUCT | `product.ask-features-a` | page-local |
| 6 | PRODUCT | `product.ask-features-b` | page-local |
| 7 | PRODUCT | `product.ask-key-capabilities` | page-local |
| 8 | PROOF | `proof.product-testimonial` | shared ×5 |
| 9 | PRODUCT | `product.ask-playbooks` | page-local |
| 10 | PRODUCT | `product.ask-slack` | page-local |
| 11 | STACK | `stack.product-integrations` | shared ×2 |
| 12 | STACK | `stack.product-enterprise` | shared ×2 |
| 13 | CONVERT | `convert.product-cta` | shared ×6 |
| 14 | CHROME | `chrome.site-footer` | shared ×27 |

### Memory — `template.memory`

1 route · `/memory` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.memory` | page-local |
| 3 | PROOF | `proof.product-logo-ticker` | shared ×3 |
| 4 | PRODUCT | `product.memory-feature-remembers` | page-local |
| 5 | PRODUCT | `product.memory-feature-insights` | page-local |
| 6 | PRODUCT | `product.memory-how-it-works` | page-local |
| 7 | PRODUCT | `product.memory-in-action` | page-local |
| 8 | PROOF | `proof.product-b-testimonial` | shared ×3 |
| 9 | CONVERT | `convert.product-b-cta` | shared ×5 |
| 10 | CHROME | `chrome.site-footer` | shared ×27 |

### Video — `template.video`

1 route · `/video` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.video` | page-local |
| 3 | PROOF | `proof.product-logo-ticker` | shared ×3 |
| 4 | PRODUCT | `product.product-b-sticky-scroll` | shared ×2 |
| 5 | PRODUCT | `product.video-how-it-works` | page-local |
| 6 | CONVERT | `convert.product-b-cta` | shared ×5 |
| 7 | CHROME | `chrome.site-footer` | shared ×27 |

### Order Tracking — `template.order-tracking`

1 route · `/order-tracking` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.order-tracking` | page-local |
| 3 | PROOF | `proof.product-logo-ticker` | shared ×3 |
| 4 | PRODUCT | `product.product-b-sticky-scroll` | shared ×2 |
| 5 | PRODUCT | `product.order-tracking-simplify` | page-local |
| 6 | FAQ | `faq.product-b-faq` | shared ×2 |
| 7 | CONVERT | `convert.product-b-cta` | shared ×5 |
| 8 | CHROME | `chrome.site-footer` | shared ×27 |

### Docs — `template.docs`

1 route · `/products/docs` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.docs` | page-local |
| 3 | PRODUCT | `product.docs-one-home` | page-local |
| 4 | PRODUCT | `product.docs-change-once` | page-local |
| 5 | PRODUCT | `product.docs-bento` | page-local |
| 6 | EVALUATE | `evaluate.docs-before-with` | page-local |
| 7 | PROOF | `proof.product-b-testimonial` | shared ×3 |
| 8 | FAQ | `faq.product-b-faq` | shared ×2 |
| 9 | CONVERT | `convert.product-b-cta` | shared ×5 |
| 10 | CHROME | `chrome.site-footer` | shared ×27 |

### AI Lab — `template.ai-lab`

1 route · `/ai-lab` · chrome: **own-nav**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.ai-lab-nav` | page-local |
| 2 | HERO | `hero.ai-lab` | page-local |
| 3 | COMPANY | `company.ai-lab-intro` | page-local |
| 4 | COMPANY | `company.ai-lab-what` | page-local |
| 5 | COMPANY | `company.ai-lab-how` | page-local |
| 6 | COMPANY | `company.ai-lab-practitioner` | page-local |
| 7 | COMPANY | `company.ai-lab-last` | page-local |
| 8 | COMPANY | `company.ai-lab-who` | page-local |
| 9 | CONVERT | `convert.ai-lab-newsletter` | page-local |
| 10 | CHROME | `chrome.site-footer` | shared ×27 |

### ROI Calculator — `template.roi-calculator`

1 route · `/roi-calculator` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.roi-calculator` | page-local |
| 3 | PROOF | `proof.product-b-testimonial` | shared ×3 |
| 4 | CONVERT | `convert.product-b-cta` | shared ×5 |
| 5 | CHROME | `chrome.site-footer` | shared ×27 |

### About Us — `template.about-us`

1 route · `/about-us` · chrome: **full-solid-nav**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.about-us` | page-local |
| 3 | COMPANY | `company.about-story-scroll` | page-local |
| 4 | COMPANY | `company.our-team` | page-local |
| 5 | PROOF | `proof.investors-grid` | page-local |
| 6 | CONVERT | `convert.company-cta` | shared ×5 |
| 7 | CHROME | `chrome.site-footer` | shared ×27 |

### Careers — `template.careers`

1 route · `/careers` · chrome: **full-alt-cta**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.careers` | page-local |
| 3 | COMPANY | `company.careers-letter` | page-local |
| 4 | COMPANY | `company.careers-why` | page-local |
| 5 | COMPANY | `company.careers-how` | page-local |
| 6 | COMPANY | `company.open-roles` | page-local |
| 7 | CONVERT | `convert.company-cta` | shared ×5 |
| 8 | CHROME | `chrome.site-footer` | shared ×27 |

### Customers — `template.customers`

1 route · `/customers` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.underline-title` | shared ×2 |
| 3 | CONTENT | `content.customer-story-grid` | page-local |
| 4 | PROOF | `proof.wall-of-love` | page-local |
| 5 | CONVERT | `convert.company-cta` | shared ×5 |
| 6 | CHROME | `chrome.site-footer` | shared ×27 |

### Community — `template.community`

1 route · `/community` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.community-invite` | page-local |
| 3 | PROOF | `proof.community-logo-ticker` | page-local |
| 4 | CHROME | `chrome.site-footer` | shared ×27 |

### Events — `template.events`

1 route · `/events` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.underline-title` | shared ×2 |
| 3 | CONTENT | `content.events-list` | page-local |
| 4 | CONVERT | `convert.events-newsletter` | page-local |
| 5 | CHROME | `chrome.site-footer` | shared ×27 |

### Partner with Siena — `template.partner-with-siena`

1 route · `/partner-with-siena` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.partner` | page-local |
| 3 | PROOF | `proof.partner-logo-grids` | page-local |
| 4 | PROOF | `proof.company-slider` | shared ×2 |
| 5 | CONVERT | `convert.company-cta` | shared ×5 |
| 6 | CONVERT | `convert.partner-modal` | page-local |
| 7 | CHROME | `chrome.site-footer` | shared ×27 |

### Refer a Friend — `template.refer-a-friend`

1 route · `/refer-a-friend` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.refer-a-friend` | page-local |
| 3 | COMPANY | `company.refer-criteria` | page-local |
| 4 | PROOF | `proof.company-slider` | shared ×2 |
| 5 | CONVERT | `convert.company-cta` | shared ×5 |
| 6 | CHROME | `chrome.site-footer` | shared ×27 |

### Pricing (lead form) — `template.pricing`

1 route · `/pricing` · chrome: **none**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.lead-header` | shared ×2 |
| 2 | HERO | `hero.lead-form` | shared ×2 |
| 3 | EVALUATE | `evaluate.how-pricing-works` | page-local |
| 4 | PROOF | `proof.conv-testimonials` | shared ×3 |
| 5 | STACK | `stack.lead-enterprise` | page-local |
| 6 | CHROME | `chrome.legal-row` | shared ×2 |

### Book a demo (lead form) — `template.book-a-demo`

1 route · `/book-a-demo` · chrome: **none**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.lead-header` | shared ×2 |
| 2 | HERO | `hero.lead-form` | shared ×2 |
| 3 | PROOF | `proof.conv-testimonials` | shared ×3 |
| 4 | CHROME | `chrome.legal-row` | shared ×2 |

### Competitor compare — `template.compare`

2 routes · `/compare/siena-ai-vs-gorgias-ai`, `/compare/siena-ai-vs-kustomer-ai` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.compare` | page-local |
| 3 | PROOF | `proof.conv-testimonials` | shared ×3 |
| 4 | EVALUATE | `evaluate.compare-table` | page-local |
| 5 | PRODUCT | `product.conv-sticky-area` | shared ×2 |
| 6 | PROOF | `proof.metrics` | shared ×3 |
| 7 | STACK | `stack.conv-integrations` | page-local |
| 8 | FAQ | `faq.conv-faq` | page-local |
| 9 | CONVERT | `convert.conv-cta` | shared ×2 |
| 10 | CHROME | `chrome.site-footer` | shared ×27 |

### AI-native vs add-ons — `template.addons`

1 route · `/ai-native-customer-service-vs-help-desk-ai-add-ons` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.addons` | page-local |
| 3 | PRODUCT | `product.conv-sticky-area` | shared ×2 |
| 4 | PROOF | `proof.metrics` | shared ×3 |
| 5 | PRODUCT | `product.conv-features` | page-local |
| 6 | CONVERT | `convert.conv-cta` | shared ×2 |
| 7 | CHROME | `chrome.site-footer` | shared ×27 |

### Insights landing — `template.insights-landing`

3 routes · `/insights`, `/insights/sentiment-analysis-online`, `/insights/voice-of-customer-software` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.insights` | shared ×2 |
| 3 | CONTENT | `content.insights-announcement` | shared ×2 |
| 4 | PROOF | `proof.insights-logos` | shared ×2 |
| 5 | PRODUCT | `product.insights-feature-rows` | shared ×2 |
| 6 | STACK | `stack.insights-integrations` | page-local |
| 7 | PROOF | `proof.insights-testimonial` | page-local |
| 8 | CONVERT | `convert.insights-agent-promo` | shared ×2 |
| 9 | CONVERT | `convert.demo-form-cta` | shared ×2 |
| 10 | CHROME | `chrome.site-footer` | shared ×27 |

### Insights landing (no integrations/testimonial) — `template.insights-landing-short`

1 route · `/insights/customer-feedback-analytics-software` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | HERO | `hero.insights` | shared ×2 |
| 3 | CONTENT | `content.insights-announcement` | shared ×2 |
| 4 | PROOF | `proof.insights-logos` | shared ×2 |
| 5 | PRODUCT | `product.insights-feature-rows` | shared ×2 |
| 6 | CONVERT | `convert.insights-agent-promo` | shared ×2 |
| 7 | CONVERT | `convert.demo-form-cta` | shared ×2 |
| 8 | CHROME | `chrome.site-footer` | shared ×27 |

### Conversations index — `template.conversations-index`

1 route · `/conversations` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | CONTENT | `content.conversations-header` | page-local |
| 3 | CONTENT | `content.conversations-grid` | page-local |
| 4 | CONVERT | `convert.newsletter-cta` | shared ×2 |
| 5 | CHROME | `chrome.site-footer` | shared ×27 |

### Conversation detail — `template.conversation-detail`

3 routes · `/conversations/thrive-causemetics-ai-customer-service-automation`, `/conversations/prose-ai-customer-service-automation`, `/conversations/spanx-kylah-field-real-work-ai-customer-experience` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | CONTENT | `content.article-header` | page-local |
| 3 | CONTENT | `content.article-video` | page-local |
| 4 | CONTENT | `content.article-summary` | page-local |
| 5 | CONTENT | `content.article-chapters` | page-local |
| 6 | CONTENT | `content.article-transcript-chapter` | page-local |
| 7 | CONTENT | `content.article-faq` | page-local |
| 8 | CONVERT | `convert.newsletter-cta` | shared ×2 |
| 9 | CHROME | `chrome.site-footer` | shared ×27 |

### Legal document — `template.legal`

2 routes · `/terms-of-service`, `/privacy-policy` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.site-nav` | shared ×26 |
| 2 | CONTENT | `content.legal-header` | page-local |
| 3 | CONTENT | `content.legal-section` | page-local |
| 4 | CHROME | `chrome.site-footer` | shared ×27 |

## Section reference

### CHROME

_Page frame outside the content flow: the site nav and footer from App.jsx's Chrome wrapper, and the per-page replacements for them._

**`chrome.site-nav`** — Global announcement bar + floating nav pill with Product/Resources/Partners/Company mega-menus and a Book a demo CTA (mobile: full-width bar + drawer). Per-route behaviour (CTA swap, forced scrolled state) comes from NAV_OVERRIDES, not separate components.

· Rendered by App.jsx's Chrome wrapper on 32 routes: every route except /ai-lab, /pricing and /book-a-demo. · appears on 32 routes · implemented by `Nav.jsx`

**`chrome.site-footer`** — Global footer: link columns, SOC badge, socials and the large Siena wordmark.

· Rendered by App.jsx's Chrome wrapper on 33 routes: every route except the two hideChrome lead-form pages. · appears on 33 routes · implemented by `Footer.jsx`

**`chrome.ai-lab-nav`** — Dark AI Lab-only nav (Siena logo, in-page anchors, event CTA) that replaces the site nav on the AI Lab page; the page's decorative pixel tiles sit behind it.

· Only the AI Lab page (NAV_OVERRIDES hideNav). · appears on 1 routes · implemented by `product-b/AiLabNav.jsx`

**`chrome.lead-header`** — Minimal non-fixed header with just the Siena wordmark, replacing the site nav on the lead-form pages.

· The pricing and book-a-demo pages (NAV_OVERRIDES hideChrome). · appears on 2 routes · implemented by `conversion/ui.jsx > LeadHeader`

**`chrome.legal-row`** — Single-row page footer with copyright and legal links, replacing the site footer on the lead-form pages.

· The pricing and book-a-demo pages (NAV_OVERRIDES hideChrome). · appears on 2 routes · implemented by `conversion/ui.jsx > LegalRow`

### HERO

_The page-opening block (H1, sub copy, primary CTA, and any visual or form that shares the first viewport)._

**`hero.home`** — Homepage hero: headline, sub copy, Book a demo button, product imagery and the brand LogoTicker strip.

· Homepage only. · appears on 1 routes · implemented by `Hero.jsx`

**`hero.shopping-agent`** — Two-column Shopping Agent hero with copy + CTA on the left and an animated shopping chat visual, plus logo tickers.

· Shopping Agent page only. · appears on 1 routes · implemented by `product/shopping/ShoppingHero.jsx`

**`hero.social-agent`** — Split hero for the Social Agent (copy + CTA left, social-comment visuals right).

· Social Agent page only. · appears on 1 routes · implemented by `product/social/SocialHero.jsx`

**`hero.reviews-agent`** — Split hero for AI Review Management (copy + CTA, review-card visuals).

· AI Review Management page only. · appears on 1 routes · implemented by `product/reviews/ReviewsParts.jsx > ReviewsHero`

**`hero.qa-agent`** — Split hero for the QA Agent (copy + CTA, QA scorecard visual).

· QA Agent page only. · appears on 1 routes · implemented by `product/qa/QaParts.jsx > QaHero`

**`hero.topics-explorer`** — Split hero for Topics Explorer (copy + CTA, topic-trend visual).

· Topics Explorer page only. · appears on 1 routes · implemented by `product/topics/TopicsParts.jsx > TopicsHero`

**`hero.ask-siena`** — Ask Siena hero (copy + CTA, Ask Siena chat visual).

· Ask Siena page only. · appears on 1 routes · implemented by `product/ask/AskParts.jsx > AskHero`

**`hero.memory`** — Memory hero: H1, sub copy and Book a demo button over a blurred background (the logo ticker below it is a separate section).

· Memory page only. · appears on 1 routes · implemented by `pages/Memory.jsx > mh-hero`

**`hero.video`** — Centered 'Introducing Video' hero with Book a demo button and an animated video-message mock.

· Video page only. · appears on 1 routes · implemented by `pages/Video.jsx > vh-hero`

**`hero.order-tracking`** — Centered Order Tracking hero with rotating carrier-logo orbits and gradient chat bubbles.

· Order Tracking page only. · appears on 1 routes · implemented by `pages/OrderTracking.jsx > oh-hero`

**`hero.docs`** — Docs hero: 'The OS for your brand's knowledge' with animated underline, CTA and a browser-frame docs mock with mini chat.

· Docs page only. · appears on 1 routes · implemented by `pages/Docs.jsx > dh-hero`

**`hero.ai-lab`** — AI Lab hero: H1/H3, CTA buttons and upcoming event cards (Luma links).

· AI Lab page only. · appears on 1 routes · implemented by `pages/AiLab.jsx > al-hero`

**`hero.roi-calculator`** — ROI hero: 'See the ROI for yourself' copy + 'What to expect' list on the left, the interactive ROI calculator (inputs, computed savings, result step) sliding in on the right.

· ROI Calculator page only. · appears on 1 routes · implemented by `product-b/RoiCalculator.jsx (inside pages/RoiCalculator.jsx > rh-hero)`

**`hero.about-us`** — Mission-statement hero: single large H1 over a background image, no CTA.

· About Us page only. · appears on 1 routes · implemented by `pages/AboutUs.jsx > ab-hero`

**`hero.careers`** — Careers hero: H1 + 'See open roles' button anchored to the roles list.

· Careers page only. · appears on 1 routes · implemented by `pages/Careers.jsx > ca-hero`

**`hero.underline-title`** — Centered page title with an underlined italic emphasis word and a short subline; copy and spacing come from a variant prop.

· The customers and events pages. · appears on 2 routes · implemented by `company/UnderlineTitle.jsx`

**`hero.community-invite`** — Two-column Slack-community hero: H1, sub copy and star bullets on the left, 'Request an invite' static form in a ring card on the right.

· Community page only. · appears on 1 routes · implemented by `pages/Community.jsx > cm-hero`

**`hero.partner`** — Partner hero: H1, sub copy and 'Become a partner' button (opens the modal), followed in the same section by the 'Why partner with Siena?' benefits grid.

· Partner with Siena page only. · appears on 1 routes · implemented by `pages/PartnerWithSiena.jsx > pw-hero`

**`hero.refer-a-friend`** — Referral hero: '$10,000' H1 with numbered steps on the left, 'Submit a referral' static form on the right.

· Refer a Friend page only. · appears on 1 routes · implemented by `pages/ReferAFriend.jsx > rf-hero`

**`hero.lead-form`** — Lead-capture hero: title, body and customer logo grid on the left, two-page qualification form (LeadForm) on the right; title, form heading and submit label come from props.

· The pricing and book-a-demo pages. · appears on 2 routes · implemented by `conversion/LeadSections.jsx > LeadHero`

**`hero.compare`** — Competitor-comparison hero: eyebrow, 'Siena AI vs X' title, subtitle, CTA and a single-row logo ticker.

· Both compare pages. · appears on 2 routes · implemented by `conversion/ConvHero.jsx > CompareHero`

**`hero.addons`** — 'AI-native vs help-desk add-ons' hero with CTA and single-row logo ticker.

· AI-native vs add-ons page only. · appears on 1 routes · implemented by `conversion/ConvHero.jsx > AddonsHero`

**`hero.insights`** — Insights landing hero on cream: H1, sub copy, CTA and product image; copy comes from insightsData per route.

· All four insights routes. · appears on 4 routes · implemented by `content/InsightsPage.jsx > Hero`

### PROOF

_Social proof: logo tickers and grids, testimonial sliders, metrics, customer stories, walls of love._

**`proof.home-testimonials`** — Homepage testimonials slider (eleven slides, prev/next buttons) built on testimonials/Slide.jsx.

· Homepage only. · appears on 1 routes · implemented by `Testimonials.jsx`

**`proof.metrics`** — Homepage Metrics block (count-up stats on an image-backed cream card). Conversion pages mount the same component through a thin wrapper that only adds scoped CSS overrides (the add-ons page swaps the H2 typeface).

· Homepage, both compare pages and the add-ons page. · appears on 4 routes · implemented by `Metrics.jsx (wrapped by conversion/ConvMetrics.jsx on conversion pages)`

**`proof.customer-stories`** — Homepage customer-stories carousel with crossfading story cards.

· Homepage only. · appears on 1 routes · implemented by `CustomerStories.jsx`

**`proof.product-logos`** — Product-page logo block: the homepage LogoTicker content in a standalone fixed-height container.

· Social Agent, AI Review Management, QA Agent, Topics Explorer and Ask Siena pages. · appears on 5 routes · implemented by `product/sections.jsx > LogosBlock`

**`proof.product-testimonial`** — Product-page testimonial panel (Slide-based slider or single static slide; slides, panel colour and controls chosen by variant). QA Agent renders it twice (multi-slide panel after Complete Coverage, single static slide before the FAQ); it is listed once in that template.

· Shopping Agent, AI Review Management, QA Agent, Topics Explorer and Ask Siena pages. · appears on 5 routes · implemented by `product/sections.jsx > ProductTestimonial`

**`proof.product-logo-ticker`** — Product-B continuous logo ticker (masked or plain variant, per-route logo list).

· Memory, Video and Order Tracking pages. · appears on 3 routes · implemented by `product-b/shared.jsx > ProductLogoTicker`

**`proof.product-b-testimonial`** — Product-B testimonial slider built on testimonials/Slide.jsx; slide set, controls and wrapper differ per route (Docs: one static slide, no controls).

· Memory, Docs and ROI Calculator pages. · appears on 3 routes · implemented by `product-b/TestimonialSlider.jsx`

**`proof.investors-grid`** — 'Backed by great partners' investor logo grid.

· About Us page only. · appears on 1 routes · implemented by `pages/AboutUs.jsx > ab-investors (company/LogoGrid.jsx)`

**`proof.wall-of-love`** — 'Love around the world' wall of love: columns of vertically scrolling quote tickers (single column on phone).

· Customers page only. · appears on 1 routes · implemented by `pages/Customers.jsx > wl-section (company/VerticalTicker.jsx)`

**`proof.community-logo-ticker`** — Horizontal logo ticker of community member brands at the bottom of the community hero.

· Community page only. · appears on 1 routes · implemented by `company/HTicker.jsx`

**`proof.partner-logo-grids`** — 'Backed by best-in-class partners' section with separate Agency partners and Technology partners logo grids.

· Partner with Siena page only. · appears on 1 routes · implemented by `pages/PartnerWithSiena.jsx > pw-partners (company/LogoGrid.jsx)`

**`proof.company-slider`** — Company-page testimonial slider; slide renderer is injected (partner case-study slides or homepage testimonial slides).

· Partner with Siena and Refer a Friend pages. · appears on 2 routes · implemented by `company/CompanySlider.jsx`

**`proof.conv-testimonials`** — Conversion-page testimonials slider (homepage Slide data, variant controls background and spacing).

· Pricing, book-a-demo and both compare pages. · appears on 4 routes · implemented by `conversion/ConvTestimonials.jsx`

**`proof.insights-logos`** — Static (non-scrolling) customer logo row on the insights landing pages.

· All four insights routes. · appears on 4 routes · implemented by `content/InsightsPage.jsx > Logos`

**`proof.insights-testimonial`** — Single static quote block on insights pages.

· The insights hub and the sentiment-analysis and voice-of-customer subpages. · appears on 3 routes · implemented by `content/InsightsPage.jsx > Testimonial`

### PRODUCT

_Explanations of what a Siena product does: scroll areas, feature rows, bentos, how-it-works blocks, product mockups._

**`product.home-scroll-area`** — Homepage sticky scroll area: three pillars on the left switching a pinned chat mock on the right.

· Homepage only. · appears on 1 routes · implemented by `ScrollArea.jsx`

**`product.home-features`** — 'The agentic commerce platform' feature-card grid with Lottie animations.

· Homepage only. · appears on 1 routes · implemented by `Features.jsx`

**`product.shopping-platform-title`** — Standalone centered eyebrow + H2 + sub ('AI that learns, sells, and scales') introducing the Shopping scroll area.

· Shopping Agent page only. · appears on 1 routes · implemented by `product/ui.jsx > SectionTitle`

**`product.shopping-scroll-area`** — Shopping Agent three-step sticky scroll area with its own visuals.

· Shopping Agent page only. · appears on 1 routes · implemented by `product/shopping/ShoppingScrollArea.jsx`

**`product.expert-agents`** — 'Your team of expert agents' block on a cream background with a centered blob visual.

· Shopping Agent page only. · appears on 1 routes · implemented by `product/shopping/ExpertAgents.jsx`

**`product.shopping-content-timer`** — Two image cards with a scroll-linked progress line.

· Shopping Agent page only. · appears on 1 routes · implemented by `product/shopping/ContentTimer.jsx`

**`product.social-features`** — Social Agent features: title, sticky pill nav and stacked feature blocks.

· Social Agent page only. · appears on 1 routes · implemented by `product/social/SocialFeatures.jsx`

**`product.more-in-the-box`** — 'More in the box' bento grid.

· Social Agent page only. · appears on 1 routes · implemented by `product/social/MoreInTheBox.jsx`

**`product.reviews-features`** — Reviews features title + sticky scroll area.

· AI Review Management page only. · appears on 1 routes · implemented by `product/reviews/ReviewsParts.jsx > ReviewsFeatures`

**`product.reviews-timer`** — Auto-advancing feature list with progress bars beside a visual.

· AI Review Management page only. · appears on 1 routes · implemented by `product/reviews/ReviewsParts.jsx > ReviewsTimer`

**`product.qa-complete-coverage`** — 'Complete coverage' QA scoring explainer.

· QA Agent page only. · appears on 1 routes · implemented by `product/qa/QaParts.jsx > CompleteCoverage`

**`product.qa-leaderboard`** — Static agent leaderboard mockup (tabs are visual only).

· QA Agent page only. · appears on 1 routes · implemented by `product/qa/QaParts.jsx > Leaderboard`

**`product.qa-act-on-what-matters`** — 'Act on what matters' three hover cards.

· QA Agent page only. · appears on 1 routes · implemented by `product/qa/QaParts.jsx > ActOnWhatMatters`

**`product.ask-siena-mockup`** — Ask Siena prompt/answer mockup with example question cards; title, cards, answer and prompt are props.

· QA Agent and Topics Explorer pages. · appears on 2 routes · implemented by `product/qa/QaParts.jsx > AskSienaMockup`

**`product.topics-features`** — Two alternating text/visual rows (not sticky).

· Topics Explorer page only. · appears on 1 routes · implemented by `product/topics/TopicsParts.jsx > TopicsFeatures`

**`product.topics-alerts`** — Alerts cards block (QA card styling).

· Topics Explorer page only. · appears on 1 routes · implemented by `product/topics/TopicsParts.jsx > TopicsAlerts`

**`product.ask-chip-nav`** — Sticky chip nav jumping between Ask Siena feature sections.

· Ask Siena page only. · appears on 1 routes · implemented by `product/ask/AskParts.jsx > ChipNav`

**`product.ask-features-a`** — 'Your partner in building agents' pinned scroll features.

· Ask Siena page only. · appears on 1 routes · implemented by `product/ask/AskParts.jsx > FeaturesA`

**`product.ask-features-b`** — Skills library + workspace feature block.

· Ask Siena page only. · appears on 1 routes · implemented by `product/ask/AskParts.jsx > FeaturesB`

**`product.ask-key-capabilities`** — 'Your partner in understanding customers' key capabilities grid (wraps the product testimonial that follows it).

· Ask Siena page only. · appears on 1 routes · implemented by `product/ask/AskParts.jsx > KeyCapabilities`

**`product.ask-playbooks`** — Playbooks crossfade carousel.

· Ask Siena page only. · appears on 1 routes · implemented by `product/ask/AskParts.jsx > Playbooks`

**`product.ask-slack`** — 'Ask Siena lives in Slack' block on a cream background with a centered blob.

· Ask Siena page only. · appears on 1 routes · implemented by `product/ask/AskParts.jsx > SlackSection`

**`product.memory-feature-remembers`** — 'AI agent that remembers' feature row: text left, revealing chat mock right.

· Memory page only. · appears on 1 routes · implemented by `pages/Memory.jsx > mf-section`

**`product.memory-feature-insights`** — 'Tap into every conversation' feature row: text + CTA left, image right.

· Memory page only. · appears on 1 routes · implemented by `pages/Memory.jsx > mf-section--2`

**`product.memory-how-it-works`** — Memory 'How it works' icon columns on an image-backed cream card.

· Memory page only. · appears on 1 routes · implemented by `pages/Memory.jsx > mw-section`

**`product.memory-in-action`** — 'Memory in action' carousel of memory examples (the testimonial slider that shares its cream section is a separate section).

· Memory page only. · appears on 1 routes · implemented by `product-b/MemoryCarousel.jsx`

**`product.product-b-sticky-scroll`** — Centered eyebrow + H2 followed by a sticky scroll area whose blocks switch a pinned stage visual (stacked static on phone); blocks and stage are page props.

· Video and Order Tracking pages. · appears on 2 routes · implemented by `product-b/StickyScroll.jsx`

**`product.video-how-it-works`** — Video 'How it works' animated gallery plus icon columns.

· Video page only. · appears on 1 routes · implemented by `pages/Video.jsx > vw-section`

**`product.order-tracking-simplify`** — 'Simplify your stack' text + bullets with an animated carrier-to-brand pipeline.

· Order Tracking page only. · appears on 1 routes · implemented by `pages/OrderTracking.jsx > op-section`

**`product.docs-one-home`** — 'One home for everything your team knows' mirrored row: browser-frame doc ticker left, text + bullets right.

· Docs page only. · appears on 1 routes · implemented by `pages/Docs.jsx > do-section`

**`product.docs-change-once`** — 'Change it once' block with cascading policy/SOP/journey diff cards.

· Docs page only. · appears on 1 routes · implemented by `pages/Docs.jsx > dcc-section`

**`product.docs-bento`** — 'Built for the way modern brands actually work' bento: Ask frame, brand-policies doc card, usage chart.

· Docs page only. · appears on 1 routes · implemented by `pages/Docs.jsx > db-section`

**`product.conv-sticky-area`** — Conversion-page sticky scroll area (homepage ScrollArea mechanics, page-specific blocks and cards). The compare pages precede it with an inline 'The intelligence layer for commerce' H2.

· Both compare pages and the add-ons page. · appears on 3 routes · implemented by `conversion/StickyArea.jsx`

**`product.conv-features`** — Add-ons features grid built from the homepage FeatureCard.

· AI-native vs add-ons page only. · appears on 1 routes · implemented by `conversion/ConvFeatures.jsx`

**`product.insights-feature-rows`** — Repeating alternating image/text feature rows (count and copy per route from insightsData).

· All four insights routes. · appears on 4 routes · implemented by `content/InsightsPage.jsx > FeatureRow`

### STACK

_How Siena fits a brand's existing tools and risk requirements: integrations grids and enterprise-grade safety blocks._

**`stack.home-integrations`** — Homepage integrations tile grid with Explore button.

· Homepage only. · appears on 1 routes · implemented by `Integrations.jsx`

**`stack.product-integrations`** — Product-A integrations block (eyebrow, title and tile list are props).

· Social Agent and Ask Siena pages. · appears on 2 routes · implemented by `product/sections.jsx > ProductIntegrations`

**`stack.reviews-integrations`** — Reviews integrations header plus bento.

· AI Review Management page only. · appears on 1 routes · implemented by `product/reviews/ReviewsParts.jsx > ReviewsIntegrations`

**`stack.product-enterprise`** — Product-A 'Enterprise-grade' cards + text block.

· Social Agent and Ask Siena pages. · appears on 2 routes · implemented by `product/sections.jsx > Enterprise`

**`stack.lead-enterprise`** — Pricing-page 'Enterprise-grade safety' icon list (a different component from the product-page Enterprise block).

· Pricing page only. · appears on 1 routes · implemented by `conversion/LeadSections.jsx > Enterprise`

**`stack.conv-integrations`** — Compare-page integrations grid using the homepage IntegrationTile with a dark CTA.

· Both compare pages. · appears on 2 routes · implemented by `conversion/ConvIntegrations.jsx`

**`stack.insights-integrations`** — Insights integrations grid (variant of homepage Integrations; title per route).

· The insights hub and the sentiment-analysis and voice-of-customer subpages. · appears on 3 routes · implemented by `content/InsightsPage.jsx > Integrations`

### EVALUATE

_Buyer-evaluation blocks: pricing explanation, competitor comparison tables, before-vs-with-Siena lists._

**`evaluate.how-pricing-works`** — 'How does pricing work?' explainer.

· Pricing page only. · appears on 1 routes · implemented by `conversion/LeadSections.jsx > HowPricing`

**`evaluate.compare-table`** — Siena vs competitor feature comparison (desktop table, phone stacked cards).

· Both compare pages. · appears on 2 routes · implemented by `conversion/CompareTable.jsx`

**`evaluate.before-after`** — Product-A 'Before / With Siena' two-column replacement list with title and text props.

· QA Agent and Topics Explorer pages. · appears on 2 routes · implemented by `product/sections.jsx > BeforeAfter`

**`evaluate.docs-before-with`** — Docs 'Your knowledge base, finally built for your agent' Before / With Siena columns.

· Docs page only. · appears on 1 routes · implemented by `pages/Docs.jsx > dbw-section`

### FAQ

_Accordion question/answer blocks._

**`faq.product-faq`** — Product-A FAQ accordion (panel width/radius by variant).

· Social Agent, QA Agent and Topics Explorer pages. · appears on 3 routes · implemented by `product/sections.jsx > Faq`

**`faq.product-b-faq`** — Product-B FAQ accordion.

· Order Tracking and Docs pages. · appears on 2 routes · implemented by `product-b/Faq.jsx`

**`faq.conv-faq`** — Compare-page FAQ accordion.

· Both compare pages. · appears on 2 routes · implemented by `conversion/Faq.jsx`

### COMPANY

_Company, culture and programme narrative: mission story, team, careers, partner and referral programmes, AI Lab sessions._

**`company.about-story-scroll`** — Horizontal scroll-container company story.

· About Us page only. · appears on 1 routes · implemented by `company/HScrollStory.jsx`

**`company.our-team`** — 'Our team' block with team imagery and buttons.

· About Us page only. · appears on 1 routes · implemented by `company/OurTeam.jsx`

**`company.careers-letter`** — 'Creators and doers' founders letter on a Metrics-style image-backed card.

· Careers page only. · appears on 1 routes · implemented by `pages/Careers.jsx > ca-letter`

**`company.careers-why`** — 'Why people build here' block.

· Careers page only. · appears on 1 routes · implemented by `pages/Careers.jsx > ca-why`

**`company.careers-how`** — 'How we work' FeatureItem grid.

· Careers page only. · appears on 1 routes · implemented by `pages/Careers.jsx > ca-how`

**`company.open-roles`** — 'Explore our open roles' list (id open-roles; static stand-in for the Ashby-backed component).

· Careers page only. · appears on 1 routes · implemented by `company/RolesList.jsx`

**`company.refer-criteria`** — 'How do I know who to refer?' criteria FeatureItem row.

· Refer a Friend page only. · appears on 1 routes · implemented by `pages/ReferAFriend.jsx > rf-criteria`

**`company.ai-lab-intro`** — AI Lab intro paragraph under a rule.

· AI Lab page only. · appears on 1 routes · implemented by `pages/AiLab.jsx > al-intro`

**`company.ai-lab-what`** — 'What is AI Lab' curated-sessions block.

· AI Lab page only. · appears on 1 routes · implemented by `pages/AiLab.jsx > al-what`

**`company.ai-lab-how`** — AI Lab 'How it works' three columns.

· AI Lab page only. · appears on 1 routes · implemented by `pages/AiLab.jsx > al-how`

**`company.ai-lab-practitioner`** — Dark 'Become an AI practitioner' block with why-attend list and 'Next LAB' event.

· AI Lab page only. · appears on 1 routes · implemented by `pages/AiLab.jsx > al-dark`

**`company.ai-lab-last`** — 'From our last LAB' past-event card.

· AI Lab page only. · appears on 1 routes · implemented by `pages/AiLab.jsx > al-last`

**`company.ai-lab-who`** — 'Who should attend?' audience list.

· AI Lab page only. · appears on 1 routes · implemented by `pages/AiLab.jsx > al-who`

### CONTENT

_Editorial or CMS-style body content: article bodies, legal text, index grids, event and story lists._

**`content.customer-story-grid`** — Filterable customer-story card grid with Load more (static data standing in for the Framer CMS collection).

· Customers page only. · appears on 1 routes · implemented by `company/StoryGrid.jsx`

**`content.events-list`** — Events list, currently the empty state ('Check later...') because the live CMS list is empty.

· Events page only. · appears on 1 routes · implemented by `pages/Events.jsx > ev-list`

**`content.insights-announcement`** — Small cream announcement strip below the insights hero.

· All four insights routes. · appears on 4 routes · implemented by `content/InsightsPage.jsx > Announcement`

**`content.conversations-header`** — Conversations index page header: kicker, H1, serif intro and hairline (a content header, not a hero).

· Conversations index page only. · appears on 1 routes · implemented by `pages/Conversations.jsx > header`

**`content.conversations-grid`** — Two-column grid of interview cards (photo, guest, brand, excerpt; cards link via siteHref).

· Conversations index page only. · appears on 1 routes · implemented by `pages/Conversations.jsx > ct-conv-grid`

**`content.article-header`** — Interview article header: kicker link and date, H1, guest line and hairline.

· The three conversation detail pages. · appears on 3 routes · implemented by `content/ConversationArticle.jsx > header`

**`content.article-video`** — Interview video: the one YouTube embed in the clone.

· The three conversation detail pages. · appears on 3 routes · implemented by `content/ConversationArticle.jsx > video`

**`content.article-summary`** — Interview summary block and Key takeaways list.

· The three conversation detail pages. · appears on 3 routes · implemented by `content/ConversationArticle.jsx > Block (summary, takeaways)`

**`content.article-chapters`** — Chapters index: one time-stamped anchor link per transcript chapter.

· The three conversation detail pages. · appears on 3 routes · implemented by `content/ConversationArticle.jsx > Block (chapters)`

**`content.article-transcript-chapter`** — One transcript chapter: chapter H2 and its speaker turns; repeated once per chapter.

· The three conversation detail pages. · appears on 3 routes · implemented by `content/ConversationArticle.jsx > Transcript`

**`content.article-faq`** — Frequently asked questions: H3 questions with plain paragraph answers (not an accordion).

· The three conversation detail pages. · appears on 3 routes · implemented by `content/ConversationArticle.jsx > Block (faq)`

**`content.legal-header`** — Legal document header: H1 with hairline and the last-updated row (a content header, not a hero).

· Terms of service and privacy policy pages. · appears on 2 routes · implemented by `content/LegalPage.jsx > header`

**`content.legal-section`** — One heading-bounded part of a legal document (optional heading plus rich-text blocks); repeated once per top-level heading. Terms adds a previous-versions tail to the last part.

· Terms of service and privacy policy pages. · appears on 2 routes · implemented by `content/LegalPage.jsx > lg-rt`

### CONVERT

_Conversion endings and capture: closing CTAs, demo/newsletter forms, application modals._

**`convert.insights-agent-promo`** — Cross-sell conversion row: eyebrow, H2, body and a Learn more button next to a chat mock (variant of homepage ScrollArea block one). Classed as a conversion block, not a feature.

· All four insights routes. · appears on 4 routes · implemented by `content/InsightsPage.jsx > Promo`

**`convert.main-cta`** — Homepage closing CTA: image-backed card with H2 and Book a demo.

· Homepage only. · appears on 1 routes · implemented by `MainCta.jsx`

**`convert.product-cta`** — Product-A closing CTA (MainCta variant; heading, top blur colour and variant are props).

· All six product-A agent pages. · appears on 6 routes · implemented by `product/sections.jsx > ProductCta`

**`convert.product-b-cta`** — Product-B closing CTA (MainCta variant; title and top fade are props).

· Memory, Video, Order Tracking, Docs and ROI Calculator pages. · appears on 5 routes · implemented by `product-b/shared.jsx > CtaB`

**`convert.company-cta`** — Company-page closing CTA with phone mock (MainCta variant; heading, button and phone layout are props).

· About Us, Careers, Customers, Partner with Siena and Refer a Friend pages. · appears on 5 routes · implemented by `company/CompanyCta.jsx`

**`convert.conv-cta`** — Conversion-page closing CTA without the top fade.

· Both compare pages and the add-ons page. · appears on 3 routes · implemented by `conversion/ConvCta.jsx`

**`convert.demo-form-cta`** — Image-backed demo-request form card (anchor #book-a-demo; static, submit prevented).

· All four insights routes. · appears on 4 routes · implemented by `content/DemoFormCta.jsx`

**`convert.newsletter-cta`** — Image-backed newsletter email signup card used on conversations routes (keeps the live desktop layout at phone width).

· The conversations index and the three conversation detail pages. · appears on 4 routes · implemented by `content/NewsletterCta.jsx`

**`convert.events-newsletter`** — Events 'Be the first to know what's happening' email signup card (inline markup with its own phone layout; same live pattern as the conversations newsletter but a separate implementation).

· Events page only. · appears on 1 routes · implemented by `pages/Events.jsx > ev-news`

**`convert.ai-lab-newsletter`** — AI Lab newsletter signup that replaces the closing CTA.

· AI Lab page only. · appears on 1 routes · implemented by `pages/AiLab.jsx > Newsletter`

**`convert.partner-modal`** — 'Join our partner program' portal modal form opened by the hero and CTA buttons.

· Partner with Siena page only. · appears on 1 routes · implemented by `company/PartnerModal.jsx`
