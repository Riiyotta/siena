// CLONE_SPEC §3/§6 round Prev/Next button: 40x40, rgba(244,237,222,0.6), chevron stroke #A7A092 2.5 at 45%.
export default function CarouselButton({ direction, onClick }) {
  const isPrev = direction === 'prev'
  return (
    <button
      type="button"
      aria-label={isPrev ? 'Previous' : 'Next'}
      onClick={onClick}
      className="relative z-10 flex h-[40px] w-[40px] min-w-[40px] flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[40px] border-none bg-[rgba(244,237,222,0.6)] p-0"
    >
      <svg width="45%" height="45%" viewBox="0 0 24 24" fill="none" stroke="#A7A092" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points={isPrev ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
      </svg>
    </button>
  )
}
