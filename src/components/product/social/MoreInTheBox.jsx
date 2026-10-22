// specs/product-a.md §2.4 — "More in the box" bento.
import { Appear, SPRING } from '../motion.jsx'
import { Fa, GradBorder, SectionTitle } from '../ui.jsx'

const TILES = [
  [0xe533, 'Unlimited seats', 'Your whole team in one inbox, no per-seat cost.'],
  [0xf4d7, 'Custom automations', 'Multi-step automations that run natively on social, from first reply to resolution.'],
  [0xf1e6, 'Run alongside your tools', 'Connects directly to Meta.'],
  [0xf1c2, 'Custom keyword moderation', 'Auto-hide, delete, or flag comments containing terms you define.'],
  [0xf070, 'Hide comments after responding', "Automatically hide negative comments once they've been handled."],
  [0xf002, 'Ask Siena in Slack', 'Query your data in plain language without leaving Slack.'],
]

export default function MoreInTheBox() {
  return (
    <section className="mb-section">
      <SectionTitle align="left" maxW={1062} eyebrow="More in the box" title="Everything else that rounds it out" />
      <div className="mb-bento">
        <div className="mb-row">
          <div className="mb-card-a">
            <h3 className="pa-h3">Unlimited pages &amp; brands</h3>
            <div className="mb-diagram">
              <Appear on="view" y={50} dur={1} delay={0.6} ease={SPRING} className="mb-settings">
                <p className="pa-tiempos mb-settings-title">Response Settings</p>
                {[['Auto-reply', <span className="mb-toggle">Active<span className="mb-toggle-dot" /></span>], ['Response rate', '80%'], ['Tone', 'Brand voice']].map(([k, v]) => (
                  <div key={k} className="mb-settings-row">
                    <span className="pa-tiempos so-t12">{k}</span>
                    <span className="mb-val">{v}</span>
                  </div>
                ))}
              </Appear>
              <img src="/svg/social-agent-1-53c56.svg" alt="" className="mb-conn mb-conn--1" />
              <img src="/svg/social-agent-1-1a3c1.svg" alt="" className="mb-conn mb-conn--2" />
              <img src="/svg/social-agent-1-e1ce2.svg" alt="" className="mb-conn mb-conn--3" />
              {['True Sea Moss - US', 'True Sea Moss - EU', 'Other Supplements'].map((c, i) => (
                <div key={c} className={`mb-chip mb-chip--${i}`}>
                  <span className="mb-dot" />
                  <span className="mb-chip-box pa-tiempos so-t12">{c}</span>
                </div>
              ))}
            </div>
            <p className="pa-sub">Every account, brand, and region. Configure per page, or copy across all at once.</p>
          </div>
          <div className="mb-card-b">
            <img src="/assets/BEKytDQGmk9M2on9YkKhq2plrU.webp" alt="" className="mb-photo" />
            <GradBorder r={16} w={1} className="mb-persona" innerClassName="p-[12px]">
              <h6 className="pa-h6">Per-channel personas</h6>
              <p className="mb-t16">A distinct voice per channel, organic or paid.</p>
            </GradBorder>
            <div className="mb-reply">
              <span className="so-avatar so-avatar--brand bg-white"><img src="/svg/social-agent-Vector-1b0ea.svg" alt="" /></span>
              <div>
                <p className="so-caption"><strong>TSM</strong></p>
                <p className="so-caption">Daily ritual unlocked, we gotchu bestie ☀️</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-grid">
          {TILES.map(([code, t, d]) => (
            <div key={t} className="mb-tile">
              <Fa code={code} />
              <div className="flex flex-col gap-[12px]">
                <h5 className="pa-h5">{t}</h5>
                <p className="mb-t16">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
