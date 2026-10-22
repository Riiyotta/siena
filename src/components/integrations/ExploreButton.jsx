// CLONE_SPEC §8 CTA (xlg): 242x58, padding 18px 24px, radius 16, bg ink; label Instrument Sans 600 18/21.6 white.
// §13: hover → rainbow gradient, instant.
export default function ExploreButton() {
  return (
    <a
      href="./integrations"
      className="explore-btn relative inline-flex flex-none items-center justify-center whitespace-nowrap rounded-[16px] bg-ink hover:bg-rainbow px-[24px] py-[18px] no-underline"
    >
      <span className="select-none font-sans text-[18px] font-semibold leading-[21.6px] text-white">Explore all integrations</span>
    </a>
  )
}
