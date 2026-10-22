// CLONE_SPEC §8 tile: bg #F3F0EB, radius 4, row 181px, padding 72px 0 (tablet 72px 16px, phone 14px).
export default function IntegrationTile({ children }) {
  return (
    <div className="integration-tile relative flex h-[181px] w-full flex-none flex-col items-center justify-center self-start overflow-hidden rounded-[4px] bg-hero-bg">
      <div className="relative flex w-full flex-none flex-col items-center justify-center tablet:w-auto">{children}</div>
    </div>
  )
}
