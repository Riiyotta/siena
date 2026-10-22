// /qa-agent — specs/product-a.md §4 (phone order: Automated Actions before Siena Intelligence)
import { useEffect } from 'react'
import { ActOnWhatMatters, AskSienaMockup, CompleteCoverage, Leaderboard, QaHero } from '../components/product/qa/QaParts.jsx'
import { BeforeAfter, Faq, LogosBlock, ProductCta, ProductTestimonial } from '../components/product/sections.jsx'
import { EdgeFades } from '../components/product/ui.jsx'
import { ph } from '../components/product/placeholder.js'

// Quotes not in testimonials/data.js -> length-matched placeholders (names/roles/logos real).
const COTERIE = { logo: 'ZeJTO989NVjG9cfH69ugd19p4C0.svg', logoAlt: 'Coterie' }
const A = [{ ...COTERIE, name: 'Rebecca Blount', role: 'Director, Customer Experience & Fulfillment', image: 'DkKUcZ5MMlNWr9dt9V653q2eWmI.jpg', imageAlt: 'Photo of Rebecca Blount', quote: ph(318) }]
const B = [{ ...COTERIE, name: 'Taryn Oubre', role: 'CX Senior Manager', image: '6m3nbsOefa5MuiJ7cZLEbjcG3Oc.webp', imageAlt: 'Photo of Taryn Oubre', quote: ph(372) }]

const FAQ = [
  ['We already review a sample of conversations. Why does 100% coverage matter?', 'Most QA tools cover around 3% of conversations. That means the other 97% are unreviewed, and whatever is happening in them stays invisible until it becomes a real problem. One early Siena QA Agent customer evaluated more conversations in a single week than most CX teams reach in a year.'],
  ['How can I define what Siena QA Agent evaluates?', "Think about what great customer service looks like on your team. Write that as a question, for example 'Did the agent confirm identity before making changes to payment information?' Then choose how to measure it: an average score from 0 to 100, a 1 to 5 scale, a pass/fail with pass rate, or a simple yes/no. Siena QA Agent takes it from there."],
  ["Does Siena QA Agent work for human agents, not just Siena's AI?", "Both. Whether it's an AI agent or a human rep, Siena QA Agent scores them on the same criteria and the same scorecard. That's the only way to get a true picture of your customer service operation. And when you need to compare them directly, that view is just a click away."],
  ['Which channels does Siena QA Agent cover?', 'Every channel Siena supports: email, live chat, social, and more. Every conversation is scored the same way, regardless of where it came from. One scorecard across your entire CX operation, with the ability to break down performance by channel whenever you need it.'],
]

export default function QaAgent() {
  useEffect(() => {
    document.title = 'Siena QA Agent - 100% CX Quality Assurance'
  }, [])
  return (
    <div className="pa-page">
      <QaHero />
      <EdgeFades top={667} left={[233, 125]} right={[197, 114]} mTop={851} mLeft={[111, 74, 0]} mRight={[122, 45, 24]} />
      <LogosBlock />
      <CompleteCoverage />
      <ProductTestimonial variant="qaA" slides={A}>
        <div className="pt-fade-bottom" aria-hidden="true" />
      </ProductTestimonial>
      <Leaderboard />
      <div className="pa-order-2">
        <ActOnWhatMatters />
      </div>
      <div className="pa-order-1">
        <AskSienaMockup
          variant="qa"
          title="Turn your quality data into answers"
          text="Every score flows into Ask Siena. Ask in plain language, get an answer in seconds, backed by the actual conversation."
          cards={[
            ['Product feedback', 'Has there been any change in sentiment to any product?'],
            ['Agent coaching', 'What pattern is driving low scores for my agents?'],
            ['Retention', 'What are the reasons for cancellations from last week?'],
            ['Subscription', 'How many customers are doing skips and for how long?'],
          ]}
          answer={
            <>
              <p className="pa-tiempos sv-t14 !whitespace-normal">Overall CXP score is 98.7% this week – down from 99% last week</p>
              <p className="pa-tiempos so-t12">The return policy page appears to be causing friction across multiple conversations.</p>
            </>
          }
          metrics={['Resolution rate • 91.2%', 'Customer effort • 4.4', 'Compliance • 95%']}
          prompt="How is our QA performance trending this week?"
        />
      </div>
      <div className="pa-order-3 w-full">
        <BeforeAfter
          variant="qa"
          title="Replace four tools with one"
          text="QA software, a VOC tool, a manual grading process, and an analyst to pull it together. Siena handles all of it."
          before={['Separate QA tools, $50-150k/year', '2-5% conversations reviewed', 'Hours spent finding conversations before grading', 'AI and human agents measured separately', 'Static rubrics, no automated response']}
          after={['A fraction of the cost of a dedicated QA tool', '100% conversations scored automatically', 'Smart relevance matching', 'One scorecard for AI and human agents', 'Slack alerts, tags, and notes triggered by scores']}
        />
        <ProductTestimonial variant="qaB" slides={B} />
        <Faq items={FAQ} variant="qa" />
        <ProductCta variant="qa" heading="Make your customer experience AI-native" blur="white153" />
      </div>
    </div>
  )
}
