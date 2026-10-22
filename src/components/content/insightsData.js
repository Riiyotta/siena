import { continueWith } from './placeholder.js'

// Per-route content for the Insights template (specs/content.md §R1).
// Headings, eyebrows, labels and image files are exact. The spec records body paragraphs only as
// "opening words + word count", so body copy = recorded opening + placeholder filler to that count.
// `img` = image on the LEFT at desktop (row 1 starts image-left, then alternates).

const body = (opening, words, seed) => continueWith(opening, words, seed)

export const INSIGHTS_PAGES = {
  '/insights': {
    title: 'Siena Insights, formerly Idiomatic - Customer feedback analysis with AI',
    appear: true, // global appear primitive on hero (T1.1)
    ink80: true, // 80%-ink subtitle + feature body
    heroPb: { desktop: 26, phone: 10 },
    heroPtPhone: 96,
    h1: 'Turn feedback into insights you can trust',
    sub: body('Stay in tune with the voice', 15, 1),
    heroImg: 'VKHdNmxFVDSgMwwUTZNi0WmJ4k.svg',
    login: false,
    demoHref: './',
    features: [
      { h: 'Find what to focus on in seconds', p: [body('Get a clear overview of customer', 23, 2)], img: 'HfktNRmsAoNia3x1j5mJvxcdL0Q.svg' },
      { h: 'Stay in the loop when things change fast', p: [body('Get instant Slack alerts when feedback', 31, 3)], img: 'det6EhIvWp8r7Ya2JlpMeyK5R8.png' },
      { h: 'Your customer data, now in plain English', p: [body("Chat with your data like you're", 24, 4)], img: 'RUoFYDLGaRP5h1vQu2qaSeuBAjw.png', button: true },
      { h: ['Sentiment analysis', 'made simple'], p: [body('Stay on top of customer feelings,', 19, 5)], img: '7c9xveioz1zbxWxFVO2t6p1XhY.png' },
      { h: 'Know what every ticket costs', p: [body('Track the true cost of resolving', 27, 6)], img: 'oRcxQbBbFEDD9rKRlVasJbMjX0.png' },
    ],
    integrationsTitle: 'See your customers across every channel',
    testimonial: true,
    promoTitle: 'Insights is just the beginning',
  },
  '/insights/sentiment-analysis-online': {
    title: 'Online AI sentiment analysis software | Siena Insights, formerly Idiomatic',
    heroPb: { desktop: 34, phone: 35 },
    heroPtPhone: 56,
    h1: 'AI-driven sentiment analysis software',
    sub: body('Understand your customer’s sentiment just like', 26, 7),
    heroImg: 'uaM0A3GiLu0NROIvudKMalml2b4.png',
    login: true,
    demoHref: './sentiment-analysis-online#book-a-demo',
    features: [
      { h: 'Know when your strategy works', p: [body('Monitor customer sentiment and easily see', 24, 8)], img: '7c9xveioz1zbxWxFVO2t6p1XhY.png' },
      { h: 'Effortless sentiment analysis, powered by AI', p: [body('Our AI automatically identifies and categorizes', 37, 9)], img: 'Ch5kap0GfB7vpcnRuTb8jYPV86o.png' },
      { h: 'Stay informed with tailored reports', p: [body('Effortlessly create custom reports to track', 26, 10)], img: 'CZf5b1hc6bqRL4RdIWcY4DwOHmw.png' },
    ],
    integrationsTitle: 'See your sentimant data in your stack', // typo is in the live copy
    testimonial: true,
    promoTitle: 'Insights is just the beginning',
  },
  '/insights/voice-of-customer-software': {
    title: 'AI-driven voice of customer (VoC) software | Siena Insights, formerly Idiomatic',
    heroPb: { desktop: 28, phone: 29 },
    heroPtPhone: 56,
    h1: 'Voice of customer software',
    sub: body('Understand your customer’s sentiment just like', 26, 11),
    heroImg: 'MOanKo50R049QJz0dIR4rVeJzSU.png',
    login: false,
    demoHref: './voice-of-customer-software#book-a-demo',
    features: [
      { h: 'Quickly uncover what needs attention', p: [body('Effortlessly capture the voice of your', 19, 12)], img: 'Qf5PSeGvhhkja3WG3J4iL67YMo.png' },
      { h: 'Your data, now a conversation away', p: [body('Skip the complicated reports. Chat directly', 19, 13)], img: '3p6ErMGR3qwEHMsMXGFXDDzSY.png' },
      { h: 'Triage tickets by listening to your customers', p: [body('Improve support experiences by automatically routing', 22, 14)], img: 'Ch5kap0GfB7vpcnRuTb8jYPV86o.png' },
      { h: 'Never miss a critical customer insight', p: [body('Be the first to know when', 20, 15)], img: 'det6EhIvWp8r7Ya2JlpMeyK5R8.png' },
    ],
    integrationsTitle: 'See your customers across every channel',
    testimonial: true,
    promoTitle: 'Customer thoughts are simply the start',
  },
  '/insights/customer-feedback-analytics-software': {
    title: 'AI customer feedback analytics software | Siena Insights',
    heroPb: { desktop: 16, phone: 6 },
    heroPtPhone: 56,
    h1: 'Customer feedback analytics',
    sub: body('Stop sorting through feedback manually. Our', 22, 16),
    heroImg: 'MOanKo50R049QJz0dIR4rVeJzSU.png',
    login: false,
    demoHref: './customer-feedback-analytics-software#book-a-demo',
    features: [
      {
        h: 'Uncover what drives customer feedback',
        p: [body('Identify pain points, sentiment, and key', 26, 17), body('Eliminate guesswork and time-consuming manual analysis', 17, 18)],
        img: 'lV97h3YK7dQbjW2cbAIBC01A.png',
      },
      { h: 'Smart categorization for clearer customer insights', p: [body('Understand customer issues the way they', 20, 19)], img: 'Qf5PSeGvhhkja3WG3J4iL67YMo.png' },
      { h: 'Summarized ticket trends, zero manual effort', p: [body('Summaries highlight recurring themes across tickets,', 18, 20)], img: 'LUS5wlXrRoHsPbxmRVmkIFCbFEM.png', button: true },
      { h: 'Segment users and discover key issues instantly', p: [body('Use custom filters to track specific', 25, 21)], img: 'Anb0KYlydsovepxrpF5P1UX0.png' },
      { h: 'Uncover sentiment in every customer interaction', p: [body('Quickly identify whether customer sentiment is', 32, 22)], img: 'QRLCkks2NazFmhzOsVjN9JNE.png' },
      { h: 'Let customer words drive ticket prioritization', p: [body('Critical issues surface instantly by analyzing', 21, 23)], img: 'Ch5kap0GfB7vpcnRuTb8jYPV86o.png' },
    ],
    integrationsTitle: null, // no Integrations and no Testimonial on this route
    testimonial: false,
    promoTitle: 'Insights is just the beginning',
  },
}

// T1.7 chat rows (exact copy). Row 1 starts 80px low, the rest 50px.
export const PROMO_ROWS = [
  { from: 'customer', y: 80, text: 'hey! i need help with an order i placed yesterday—i forgot to apply my discount code.' },
  { from: 'siena', y: 50, text: 'no worries! i’ve got your order pulled up. i can apply the code “WELCOME15” and refund the difference—ready to go?' },
  { from: 'customer', y: 50, text: 'yes please! appreciate it.' },
  { from: 'siena', y: 50, text: 'done. also noticed you’ve bought from our skincare line twice—our new serum just dropped and it’s a perfect match. want me to add it to your cart with 10% off?' },
  { from: 'customer', y: 50, text: 'omg yes! that sounds amazing.' },
]

// T1.5 tiles: logo key + rendered box at 1440 / 390.
export const INTEGRATION_TILES = [
  { key: 'salesforce', label: 'Salesforce', d: [107, 107], m: [107, 107] },
  { key: 'zendesk', label: 'Zendesk', d: [171, 37], m: [111, 24] },
  { key: 'qualtrics', label: 'Qualtrics', d: [156, 44], m: [124, 35] },
  { key: 'looker', label: 'Looker', d: [151, 39], m: [131, 34] },
  { key: 'discord', label: 'Discord', d: [161, 31], m: [127, 24] },
  { key: 'tableau', label: 'Tableau', d: [183, 39], m: [133, 28] },
  { key: 'typeform', label: 'Typeform', d: [171, 28], m: [129, 21] },
]

export const LOGOS = [
  ['RcdtrxM5jv83GuYPt3fegafLYE.svg', 'Instacart'],
  ['r2W6as2bHWbtrfk5iuHQjFsp1R8.svg', 'HubSpot'],
  ['qvKxkoZLyMmJdvAE9tNTPqFq5hQ.svg', 'Upwork'],
  ['3DYeO3vzL0aossMXlU9JfDBK8f0.svg', 'SmugMug'],
]
