// specs/conversion.md §3.2 (5 compare slides, shared by both compare pages), §4 (Gorgias), §5 (Kustomer).
import { siteHref } from '../../routes.js'

export const COMPARE_SLIDES = [
  {
    name: 'Jeremy Thurswell', role: 'COO', logo: 'ZCj576JNrFiZ427q7v0w8UiiZtg.svg', logoAlt: 'Kitsch logo',
    image: 'mSwCeM9m9qrwUvrpjLLD0jdLc0.webp', imageAlt: 'Photo of Jeremy Thurswell', href: siteHref('/customer-stories/kitsch'),
    quote: 'We found Siena to be the most powerful solution for AI customer support. The nice thing is that we were able to take Siena and all the training we did with it and move it to a more enterprise CX platform that better suited our needs.',
  },
  {
    name: 'Rachel Reid', role: 'CEO', logo: '2taW7AxLIcRYvsOfkwnA3MitHgM.svg', logoAlt: 'Subtl Beauty logo',
    image: '41lIr5VsLY7853gfB7CIVgCQAw.webp', imageAlt: 'Photo of Rachel Reid', href: siteHref('/customer-stories/subtl-beauty'),
    quote: 'AI is the game changer for our customer service, and while we love our friends at Gorgias, we use Siena AI for this and have done so for almost 2 years. Highly recommend.',
  },
  {
    name: 'Cate Marquese', role: 'CXO', logo: 'k1HObzFN6BRQikpKHeWt53mr6U.svg', logoAlt: 'Terra Kaffe logo',
    image: 'WVZA37Bad6K0ss9JDOjwLhH2aUs.webp', imageAlt: 'Photo of Cate Marquese', href: siteHref('/customer-stories/terra-kaffe'),
    quote: 'There are so many Al tools popping up every day, but Siena Al consistently is leaps.', // sic "Al" (live)
  },
  {
    name: 'Bryan Porter', role: 'CO-FOUNDER, CHIEF ECOMMERCE OFFICER', logo: 'pdpeaTrKFMv0hrJBF3RGbQ0ErwM.png', logoAlt: 'Simple Modern logo',
    image: 'L3duexlM5SB9tib8w9MTlnCfdlo.webp', imageAlt: 'Photo of Bryan Porter', href: siteHref('/customer-stories/simple-modern'),
    quote: 'We chose Siena over the competition because it has real control over automations, the best admin UI, and it’s built for ecommerce. Our team now focuses on complex tickets while Siena covers 24/7 support.',
  },
  {
    name: 'Mitch Ancellotti', role: 'HEAD OF OPERATIONS', logo: 'TyjyLvurtRA6Q8m1znnnQyPTA.svg', logoAlt: 'Brand logo',
    image: 'ZNCvlLUA3s36QW3WntCP03sYPfE.jpeg', imageAlt: 'Photo of Mitch Ancellotti',
    quote: 'When I compared all the AI solutions, I asked: who can provide the ultimate customer experience that I can fine-tune for any scenario? The only logical choice was Siena.',
  },
]

const FAQ_CHANNELS = ['Can Siena work across multiple channels?', 'Absolutely. Siena works across email, SMS, chat, WhatsApp, social media (Instagram, Facebook, TikTok), voice, and more—all from a unified AI that maintains context across channels. Your customers get the same experience whether they reach out on Instagram or email.']
const FAQ_PREPOST = ['Does Siena handle pre-purchase and post-purchase interactions?', "Yes. Siena's Shopping Agent handles product discovery, recommendations, and conversions, while the Customer Service Agent manages post-purchase support like returns, exchanges, and tracking."]
const FAQ_IMPL = ['Why does Siena include implementation support instead of self-service setup?', "Because high-quality automation requires expertise most brands don't have yet. Our implementation team manages setup from day one: connecting systems, structuring your knowledge base, and configuring automations that mirror your business. We apply proven frameworks from hundreds of implementations to get your workflows performing at production quality before launch. Other platforms rely on self-service because their automation is limited to basic deflection. Siena powers complex workflows like returns, exchanges, and subscription management. You reach reliable automation faster than trial and error."]
const FAQ_ENTERPRISE = ['Is Siena suitable for enterprise brands?', 'Yes. Siena is trusted by enterprise brands and is SOC 2, GDPR, CPRA, and HIPAA compliant. Our reasoning architecture provides the visibility, control, and explainability enterprise teams need. We offer dedicated onboarding, Slack support, and custom integrations for complex tech stacks.']

const ROW_MEMORY = ['Remembers every customer', 'Each interaction builds memory, deepening relationships and surfacing insights']
const ROW_TONE = ['Tailor tone and style', 'Multiple agent personas per channel with rich tone and style']
const ROW_NATIVE = ['AI-Native or Add-on?', 'AI-Native platform built from the ground up']
const ROW_KNOW = ['Knowledge & Sources', 'Domain-level crawl, Google Docs & Sheets, unlimited sources']
const ROW_TEST = ['Pre-launch testing', 'Inline playground with step-by-step reasoning for confident deployments']
const ROW_DELAY = ['Configurable response time', 'Set custom delays per channel for natural conversation flow']
const ROW_DISC = ['Flexible AI disclosure', 'Full control over AI disclosure']
const ROW_QA = ['QA coverage', 'Evaluate 100% of your conversations against criteria you write in plain language']
const ROW_REVIEW = ['Review management', 'Fully automates review moderation and responses']

export const GORGIAS = {
  hero: {
    eyebrow: 'Siena vs Gorgias',
    title: 'Save months before hitting Gorgias AI automation walls',
    subtitle: 'Siena is what brands switch to when add-ons fall short. Specialized agents for support, sales and insights that work like magic.',
  },
  testimonialsVariant: 'gorgias',
  table: {
    title: 'How is Siena different from Gorgias?',
    competitor: 'GORGIAS AI SUITE',
    rows: [
      [...ROW_MEMORY, 'Customers repeat themselves, no business insights'],
      [...ROW_TONE, 'Single agent persona with limited tone presets'],
      [...ROW_NATIVE, 'Add-on to legacy ticketing system'],
      [...ROW_KNOW, 'Manual sub-page entry only, capped at 10 URLs'],
      [...ROW_TEST, 'Basic test view with minimal reasoning trace'],
      [...ROW_DELAY, 'Instant responses only'],
      [...ROW_DISC, 'AI disclosure required, no flexibility'],
      [...ROW_QA, 'Lacks an integrated QA automation layer'],
      [...ROW_REVIEW, 'No moderation and responses, no automation'],
    ],
  },
  blocks: [
    {
      title: 'The commerce agent CX teams prefer',
      bullets: ['Frees your team from ticket firefighting to focus on strategic work', "Handles complex customer needs in your brand's authentic voice", 'Absorbs growing customer volume with your existing team'],
    },
    {
      title: 'Review management on autopilot',
      desc: 'Moderate reviews, respond at scale with your brand voice, and extract insights that inform product decisions.',
      bullets: ['Catches and moderates inappropriate reviews automatically', 'Boosts SEO and GEO with fresh, on-brand review responses', 'Frees your team to focus on critical recovery cases'],
    },
    {
      title: 'Memory that makes CX magical',
      desc: 'Connect every customer touchpoint into one continuous thread. Deliver personalized experience and extract insights that improve your operations.',
      bullets: ['Persistent context across all channels', 'Personalization based on full customer history', 'Surfaces customer feedback in real time so you can fix issues immediately'],
    },
    {
      title: 'Shopping Agent that closes sales',
      desc: 'Guide customers from product discovery to checkout with intelligent recommendations based on purchase history, conversation context, and real-time catalog data.',
      bullets: ['Provides expert product guidance and recommendations in real time', 'Works across on-site widgets, email, SMS, chat, and social media', 'Tracks revenue attribution from initial conversation through purchase'],
    },
  ],
  faq: [
    FAQ_CHANNELS,
    FAQ_PREPOST,
    FAQ_IMPL,
    ["What's the difference between Siena's pricing and Gorgias's pricing model?", 'Siena uses transparent per-conversation pricing. You know exactly what you\'re paying for—no hidden formulas, no debates over what counts as "resolved." Gorgias uses outcome-based pricing, which sounds appealing but creates disputes over resolution definitions and unpredictable costs. With Siena, cost = conversations × rate. Simple.'],
    ['Does Siena require me to use a specific helpdesk?', "No. Siena sits on top of your existing helpdesk—whether that's Zendesk, Kustomer, Gorgias, Dixa, or others. You can switch helpdesks anytime without losing Siena. Gorgias AI only works with the Gorgias helpdesk, locking you into their ecosystem. If you ever want to change your helpdesk, you lose your AI investment with Gorgias."],
    ['What if I want to switch from Gorgias to another helpdesk in the future?', 'With Siena, switching is seamless. Siena integrates with major helpdesks like Zendesk, Kustomer, Dixa, Gladly, and Intercom, so you can move platforms while keeping all your AI automations, workflows, and training intact. Gorgias AI is dependent on the Gorgias helpdesk. If you leave Gorgias, you start over.'],
    ['Why do brands choose Siena over Gorgias AI?', "Brands choose Siena because it's built AI-native from the ground up, not bolted onto an existing helpdesk. Siena delivers 80% automation rates that remain stable and improve over time. Siena works on top of your existing helpdesk (Zendesk, Kustomer, Gorgias, etc.), so you're never locked in. If you want to switch helpdesks, Siena moves with you"], // no trailing period on live
    FAQ_ENTERPRISE,
  ],
  cta: 'Join brands who switched from AI Add-ons to Siena',
}

export const KUSTOMER = {
  hero: {
    eyebrow: 'Siena vs Kustomer AI',
    title: 'Move from answering questions to making customers happy',
    // Live phone quirk (kustomer-390.json): the phone H1 renders the homepage phone headline instead.
    mobileTitle: 'Empathic AI CX agents designed for commerce',
    subtitle: 'Siena is what ecommerce brands choose instead of generic support. Specialized agents for support, sales and insights that work like magic.',
  },
  testimonialsVariant: 'kustomer',
  table: {
    title: 'How is Siena different from Kustomer AI?',
    competitor: 'KUSTOMER AI SUITE',
    rows: [
      [...ROW_MEMORY, 'Customers repeat themselves with no business insights'],
      [...ROW_TONE, 'Single tone across all channels, no customization'],
      [...ROW_NATIVE, 'Bolt-on to legacy helpdesk, constrained by old architecture'],
      [...ROW_KNOW, 'Only websites and help center articles'],
      [...ROW_TEST, 'Basic testing only, limited pre-launch QA'],
      [...ROW_DELAY, 'Instant responses only, no pacing control'],
      [...ROW_DISC, 'AI disclosure required, no flexibility'],
      ['Channels', 'Chat, Email, SMS, WhatsApp, Instagram, Facebook, TikTok, Klaviyo, Yotpo, Okendo', 'Limited social channels, no marketing or reviews'],
      ['Understands customer videos', 'Automatically understands video attachments showing product issues or questions', 'No automated video processing, agents must watch and document manually'],
      [...ROW_REVIEW, 'Manual moderation and responses, no automation'],
      [...ROW_QA, 'Lacks an integrated QA automation layer'],
    ],
  },
  blocks: [
    {
      title: 'The ecommerce agent CX teams choose',
      bullets: ['Shifts your team from reactive escalations to proactive strategy', "Resolves complex ecommerce workflows in your brand's genuine voice", 'Manages increasing volume without expanding headcount'],
    },
    {
      title: 'Review management that runs itself',
      desc: 'Filter reviews, reply at scale in your brand voice, and surface insights that guide product strategy.',
      bullets: ['Identifies and moderates reviews without manual review', 'Improves search visibility with consistent, on-brand responses', 'Enables your team to prioritize urgent reputation issues'],
    },
    {
      title: 'Memory that transforms customer experience',
      desc: 'Thread every customer interaction into one cohesive story. Enable personalized experiences and uncover insights that strengthen your operations.',
      bullets: ['Maintains conversation continuity across every touchpoint', 'Tailors responses using complete purchase and interaction history', 'Reveals customer insights instantly for immediate action'],
    },
    {
      title: 'Shopping Agent that seals the deal',
      desc: 'Move customers from discovery to completion with tailored recommendations driven by past purchases, dialogue history, and up-to-date catalog.',
      bullets: ['Delivers intelligent product recommendations during every interaction', 'Functions seamlessly across web, email, SMS, messaging, and social', 'Measures revenue impact from first engagement to final transaction'],
    },
  ],
  faq: [
    ['Why do brands choose Siena over Kustomer AI?', 'Ecommerce brands select Siena for its purpose-built AI architecture, not retrofitted helpdesk features. We consistently achieve 80% automation rates that strengthen with use. Siena integrates with your current helpdesk platform (Zendesk, Kustomer, Gorgias, and others), eliminating vendor lock-in. When you migrate helpdesks, Siena seamlessly transitions with you.'],
    ['Does Siena require me to use a specific helpdesk?', "No. Siena sits on top of your existing helpdesk—whether that's Zendesk, Kustomer, Gorgias, Dixa, or others. You can switch helpdesks anytime without losing Siena. Kustomer AI only works with the Kustomer helpdesk, locking you into their ecosystem. If you ever want to change your helpdesk, you lose your AI investment with Kustomer AI."],
    ['What if I want to switch from Kustomer AI to another helpdesk in the future?', 'With Siena, switching is seamless. Siena integrates with major helpdesks like Zendesk, Kustomer, Dixa, Gladly, and Intercom, so you can move platforms while keeping all your AI automations, workflows, and training intact. Kustomer AI is dependent on the Kustomer helpdesk. If you leave Kustomer AI, you start over.'],
    FAQ_CHANNELS,
    FAQ_PREPOST,
    FAQ_IMPL,
    FAQ_ENTERPRISE,
  ],
  cta: 'Join ecommerce brands who made the switch',
}
