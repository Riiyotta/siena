import IntegrationTile from '../integrations/IntegrationTile.jsx'
import '../../styles/integrations.css'
import { DarkButton } from './ui.jsx'

// specs/conversion.md §3.7 — homepage Integrations variant: white bg, padding 0 96px 80px, partner tiles.
// Phone: see §3.12 mobile quirk (title clipped above the section, last row clipped) in conversion.css.
const TILES = [
  // w/h desktop (§3.7), mw/mh phone (gorgias-390.json svgs)
  { src: 'integration-0-Logos.svg', w: 129, h: 37, mw: 121, mh: 35, alt: 'Shopify' },
  { src: 'partner-kustomer.svg', w: 185, h: 33, mw: 127, mh: 23, alt: 'Kustomer' },
  { src: 'partner-gladly.svg', w: 151, h: 37, mw: 114, mh: 28, alt: 'Gladly' },
  { src: 'partner-gorgias.svg', w: 143, h: 37, mw: 108, mh: 28, alt: 'Gorgias' },
  { src: 'partner-zendesk.svg', w: 171, h: 37, mw: 111, mh: 24, alt: 'Zendesk' },
  { src: 'integration-5-Union.svg', w: 187, h: 37, mw: 142, mh: 28, alt: 'Recharge' },
  { src: 'partner-intercom.svg', w: 163, h: 37, mw: 123, mh: 28, alt: 'Intercom' },
]

export default function ConvIntegrations() {
  return (
    <section className="cv-int">
      <div className="cv-int-inner">
        <h2 className="cv-h2 cv-int-h2">Integrate with your existing stack</h2>
        <div className="integrations-grid cv-int-grid relative grid w-full gap-[4px]">
          {TILES.map((t) => (
            <IntegrationTile key={t.src}>
              <img src={`/svg/${t.src}`} alt={t.alt} className="cv-int-logo" style={{ '--w': `${t.w}px`, '--h': `${t.h}px`, '--mw': `${t.mw}px`, '--mh': `${t.mh}px` }} />
            </IntegrationTile>
          ))}
          <IntegrationTile>
            <p className="cv-int-text">
              <strong>Custom Apps</strong>
            </p>
          </IntegrationTile>
        </div>
        <DarkButton href="/integrations">Explore all integrations</DarkButton>
      </div>
    </section>
  )
}
