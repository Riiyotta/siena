// "xlg" dark button — CLONE_SPEC §2/§9: 157x58, padding 18px 24px, radius 16px, bg #122023,
// label Instrument Sans 600 18px/21.6px white. Hover → rainbow gradient (instant, §13).
export default function BookDemoButton() {
  return (
    <a
      href="https://www.siena.cx/book-a-demo"
      className="inline-flex items-center justify-center whitespace-nowrap rounded-[16px] bg-ink px-[24px] py-[18px] font-sans text-[18px] font-semibold leading-[21.6px] text-white hover:bg-rainbow focus-visible:bg-rainbow"
    >
      Book a demo
    </a>
  )
}
