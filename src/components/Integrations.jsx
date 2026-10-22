import IntegrationTile from './integrations/IntegrationTile.jsx'
import ExploreButton from './integrations/ExploreButton.jsx'
import '../styles/integrations.css'

// CLONE_SPEC §8 Integrations + §11 "Integrations (mobile)".
const textTile = 'm-0 whitespace-pre font-sans text-[16px] font-medium leading-[22.4px] tracking-[-0.16px] text-ink tablet:text-[20px] tablet:font-bold tablet:leading-[28px] tablet:tracking-[-0.2px]'

export default function Integrations() {
  return (
    <section className="relative flex w-full flex-none flex-col items-center justify-center gap-[40px] overflow-hidden bg-cream px-[24px] py-[56px] tablet:gap-[56px] tablet:px-[40px] tablet:py-[64px] desktop:gap-[72px] desktop:px-[96px] desktop:py-[80px]">
      <div className="integrations-inner relative flex w-full max-w-[1200px] flex-col items-end justify-end gap-[64px]">
        <div className="relative z-[1] flex w-full flex-col items-start justify-center gap-[16px] tablet:gap-[24px]">
          <h2 className="m-0 w-full text-left font-display text-[48px] font-normal leading-[48px] tracking-[-0.96px] text-ink tablet:w-auto tablet:whitespace-pre tablet:text-[64px] tablet:leading-[64px] tablet:tracking-[-1.28px]">
            Integrate with your existing stack
          </h2>
        </div>

        <div className="integrations-grid relative grid w-full gap-[4px]">
          <IntegrationTile>
            <img src="/svg/integration-0-Logos.svg" alt="" aria-hidden="true" className="integration-logo-0 block h-auto max-w-none" />
          </IntegrationTile>
          <IntegrationTile>
            <img src="/assets/S1CA7BjDsQfmui51TcPvAyGtRxA.svg" alt="Yotpo" className="block h-[32px] w-[113px] max-w-none object-cover brightness-0" />
          </IntegrationTile>
          <IntegrationTile>
            <img src="/assets/4ivCVwCJknXe4l2YnVNdadGF4.svg" alt="AfterShip" className="block h-[32px] w-[160px] max-w-none object-cover brightness-0" />
          </IntegrationTile>
          <IntegrationTile>
            <img src="/assets/tRZ3CBzNJw2sWeG9jlHuvjm3vs.svg" alt="ShipBob" className="block h-[37px] w-[143px] max-w-none object-cover" />
          </IntegrationTile>
          <IntegrationTile>
            <img src="/assets/lJNzlwA3aybr9aHp0a2x2qsApOs.svg" alt="Loop" className="block h-[33px] w-[101px] max-w-none object-cover brightness-0" />
          </IntegrationTile>
          <IntegrationTile>
            <img src="/svg/integration-5-Union.svg" alt="" aria-hidden="true" className="integration-logo-5 block max-w-none" />
          </IntegrationTile>
          <IntegrationTile>
            <p className={textTile}><strong className="[font-weight:inherit]">Helpdesks</strong></p>
          </IntegrationTile>
          <IntegrationTile>
            <p className={textTile}><strong className="[font-weight:inherit]">Custom Apps</strong></p>
          </IntegrationTile>
        </div>

        <ExploreButton />
      </div>
    </section>
  )
}
