// /topics-explorer — specs/product-a.md §5 (phone order: Alerts -> Comparison -> Ask Siena)
import { useEffect } from 'react'
import { TopicsAlerts, TopicsFeatures, TopicsHero } from '../components/product/topics/TopicsParts.jsx'
import { AskSienaMockup } from '../components/product/qa/QaParts.jsx'
import { BeforeAfter, Faq, LogosBlock, ProductCta, ProductTestimonial } from '../components/product/sections.jsx'
import { EdgeFades } from '../components/product/ui.jsx'
import { ph } from '../components/product/placeholder.js'

// Quote not in testimonials/data.js -> length-matched placeholder (name/role/logo real).
const SLIDE = [{ name: 'Taryn Oubre', role: 'CX Senior Manager', logo: 'ZeJTO989NVjG9cfH69ugd19p4C0.svg', logoAlt: 'Coterie', image: '6m3nbsOefa5MuiJ7cZLEbjcG3Oc.webp', imageAlt: 'Photo of Taryn Oubre', quote: ph(244) }]

const FAQ = [
  ['How is Siena Topics Explorer different from tagging in my help desk?', "Your help desk tags depend on agents. Who's working, how busy they are, how they interpret each ticket. Topics Explorer reads every conversation automatically and applies the same consistent lens every time. No training, no maintenance, no gaps."],
  ['Do I need to build a taxonomy before Siena Topics Explorer can work?', "There's nothing to configure before you can start seeing data. Topics Explorer starts classifying conversations as soon as it's connected. Most teams have a working dashboard within their first day."],
  ['How many conversations does it analyze?', 'Every single one. Not a sample, not a selection. Every conversation that comes through your support operation, across every channel, every day.'],
  ['How is this different from Medallia or Qualtrics?', "Medallia and Qualtrics run on surveys. That means you're hearing from the customers who respond, not all of them. Topics Explorer is built from your actual support conversations, so it covers 100% of your customer interactions with no survey design, no response rate problem, no lag."],
  ['Can our product, marketing, or ops teams use this too?', "It's built for CX teams, but the insights travel well. Product managers, merchandising, and ops leads use it to track which SKUs need attention, where the self-serve experience is breaking down, or what to address before a launch. And because Ask Siena connects directly to Slack, any team can surface answers from your conversation data without ever opening a dashboard or asking the CX team."],
]

export default function TopicsExplorer() {
  useEffect(() => {
    document.title = 'Siena Topics Explorer - VoC Reinvented'
  }, [])
  return (
    <div className="pa-page pa-page--topics">
      <TopicsHero />
      <EdgeFades top={672} mTop={929} mLeft={[158, 114, 7]} mRight={[149, 129, 0]} />
      <LogosBlock />
      <TopicsFeatures />
      <ProductTestimonial variant="topics" slides={SLIDE} />
      <div className="pa-order-3">
        <AskSienaMockup
          variant="topics"
          title="From trends to decisions in one conversation"
          text="The kind of clarity that used to require a whole analytics team. Now it's just a question away."
          cards={[
            ['Revenue opportunity', "What are customers asking for that we haven't built yet?"],
            ['Revenue leak', 'Where are we losing the most money to refunds right now?'],
            ['Sentiment shift', 'What changed in customer feedback after our last update?'],
            ['Competitive threat', 'What do customers say when they mention switching?'],
          ]}
          answer={
            <>
              <p className="pa-tiempos sv-t14 !whitespace-normal">🎨 <strong>More colors across product families.</strong> 120+ conversations reveal customers are buying into sets. When pants launch in Sage Heather, but the matching tunic doesn't follow, they notice.</p>
              <p className="pa-tiempos so-t12">Your most loyal customers are already telling you what to buy next. Start with navy and charcoal. They named the sets they want to complete.</p>
            </>
          }
          prompt="What are customers asking for that we haven't built yet?"
          caret
        />
      </div>
      <div className="pa-order-1">
        <TopicsAlerts />
      </div>
      <div className="pa-order-2">
        <BeforeAfter
          variant="topics"
          spacer
          title="What Topics Explorer replaces"
          text="Every conversation your brand has ever had contains patterns worth acting on. Topics Explorer is the first time you can actually see them."
          before={['Manual agent tagging, inconsistent by design', 'Days of exports and spreadsheets for one answer', 'Keyword searches to find what caused a spike', 'Sentiment requires a separate paid tool', 'VoC tools built on surveys, not support data']}
          after={['Every conversation categorized automatically', 'Instantly surface insights with Ask Siena', 'Click any trend point, see the conversations behind it', 'Sentiment shifts visible across every category', 'Built from every conversation, no surveys needed']}
        />
      </div>
      <div className="pa-order-4">
        <Faq items={FAQ} variant="topics" />
        <ProductCta variant="topics" blur="white" />
      </div>
    </div>
  )
}
