// specs/product-a.md §2.1 — split hero (social variant). H1/subtitle/button have no entrance on this page.
import BookDemoButton from '../../cta/BookDemoButton.jsx'
import { Appear, EASE_H1, SPRING } from '../motion.jsx'
import { GradBorder, Swash } from '../ui.jsx'

export function PostCard({ className = '', photo = 'eiC7nOCos1WvCqwxBMc1EKmcyC0.webp', photoPos = '0% 100%', caption, comment, reply, children }) {
  return (
    <div className={`so-post ${className}`}>
      <div className="so-post-head">
        <img src="/svg/social-agent-Vector-bg-0bf0d.svg" alt="" className="so-post-mark" />
        <p className="pa-tiempos so-post-name">True Sea Moss</p>
      </div>
      <img src={`/assets/${photo}`} alt="" className="so-post-photo" style={{ objectPosition: photoPos }} />
      <div className="so-post-foot">
        <div className="so-stats">
          <span><img src="/svg/social-agent-Social-Media-Mockup-94262.svg" alt="" style={{ width: 23, height: 20 }} />26k</span>
          <span><img src="/svg/social-agent-Social-Media-Mockup-8e27d.svg" alt="" style={{ width: 20, height: 20 }} />984</span>
          <span><img src="/svg/social-agent-Social-Media-Mockup-6c633.svg" alt="" style={{ width: 20, height: 20 }} />470</span>
          <img src="/svg/social-agent-Social-Media-Mockup-fdf95.svg" alt="" className="so-bookmark" />
        </div>
        <p className="so-caption">{caption}</p>
        <div className="so-comment">
          <img src="/assets/D3TQ38q4HpOxmxHoD1u1AW40NI.png" alt="" className="so-avatar" />
          <p className="so-caption"><strong>maria863</strong> {comment}</p>
        </div>
        <div className="so-comment so-comment--reply">
          <span className="so-avatar so-avatar--brand"><img src="/svg/social-agent-Vector-1b0ea.svg" alt="" /></span>
          {reply}
        </div>
        {children}
      </div>
    </div>
  )
}

export default function SocialHero() {
  return (
    <section className="ph-hero ph--social">
      <div className="ph-content">
        <div className="ph-copy">
          <div className="ph-heading">
            <h1 className="pa-h1">Meet the AI<br />Agent for <em>Social</em></h1>
            <Appear className="ph-swash" y={200} delay={0.6} ease={EASE_H1}>
              <Swash className="!static !h-full !w-full" />
            </Appear>
          </div>
          <p className="pa-sub ph-sub">Siena engages your community, automates your support, and turns every comment, DM, and ad reply into a revenue opportunity.</p>
          <BookDemoButton />
          <div className="so-live">
            <strong>Live on:</strong>
            <span className="so-live-chip"><img src="/svg/social-agent-Avatar-0a99a.svg" alt="Instagram" style={{ width: 22, height: 22 }} /></span>
            <span className="so-live-chip"><img src="/svg/social-agent-Avatar-fe29a.svg" alt="Facebook" style={{ width: 28, height: 28 }} /></span>
          </div>
        </div>
        <div className="ph-visual so-hero-visual">
          <PostCard
            className="so-hero-post"
            caption="New flavors just dropped!"
            comment="I want it!"
            reply={<p className="so-caption"><strong>thetrueseamoss</strong> DMing you!</p>}
          />
          <Appear className="so-dm" y={80} dur={1} delay={0.7} ease={SPRING}>
            <Appear className="so-dm-row" y={52} dur={1} delay={0.4} ease={SPRING}>
              <span className="so-avatar so-avatar--brand"><img src="/svg/social-agent-Vector-1b0ea.svg" alt="" /></span>
              <GradBorder r="16px 2px 16px 16px" className="so-dm-bubble" innerStyle={{ borderRadius: '15px 1px 15px 15px' }} innerClassName="so-dm-bubble-in">
                <p className="pa-tiempos so-t12">Hey Maria! You're about due for a refill. Want me to reorder the pineapple two-pack?</p>
              </GradBorder>
            </Appear>
            <Appear className="so-dm-row so-dm-row--reply" y={80} dur={1} delay={1.2} ease={SPRING}>
              <div className="so-dm-reply"><p className="pa-tiempos so-t12">Yes, please add!! Can't wait 🙌</p></div>
              <img src="/assets/D3TQ38q4HpOxmxHoD1u1AW40NI.png" alt="" className="so-avatar" />
            </Appear>
          </Appear>
        </div>
      </div>
    </section>
  )
}
