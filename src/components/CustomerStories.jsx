import { useCallback, useEffect, useRef, useState } from 'react'
import StoryCard from './stories/StoryCard.jsx'
import CarouselButton from './stories/CarouselButton.jsx'
import { STORIES } from './stories/storiesData.js'
import '../styles/stories.css'

// CLONE_SPEC §6 (desktop) + §11 "Customer Stories (mobile)".
// Phone breakpoint (§0): max-width 809.98px → 1 card per page; otherwise 2.
const PHONE_QUERY = '(max-width: 809.98px)'
const FADE_MS = 120

function usePerPage() {
  const get = () => (typeof window !== 'undefined' && window.matchMedia(PHONE_QUERY).matches ? 1 : 2)
  const [perPage, setPerPage] = useState(get)
  useEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY)
    const onChange = () => setPerPage(mq.matches ? 1 : 2)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return perPage
}

export default function CustomerStories() {
  const perPage = usePerPage()
  const pageCount = Math.ceil(STORIES.length / perPage)
  // Track the first visible card so switching breakpoints keeps position.
  const [first, setFirst] = useState(0)
  const [visible, setVisible] = useState(true)
  const busy = useRef(false)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const page = Math.floor(first / perPage)
  const cards = STORIES.slice(page * perPage, page * perPage + perPage)

  const go = useCallback(
    (dir) => {
      if (busy.current) return
      busy.current = true
      setVisible(false)
      timers.current.push(
        setTimeout(() => {
          setFirst((f) => {
            const p = Math.floor(f / perPage)
            return (((p + dir) % pageCount) + pageCount) % pageCount * perPage
          })
          setVisible(true)
          timers.current.push(setTimeout(() => { busy.current = false }, FADE_MS))
        }, FADE_MS),
      )
    },
    [perPage, pageCount],
  )

  return (
    <section className="relative flex w-full flex-none flex-col items-center justify-center gap-[40px] overflow-hidden bg-cream py-[56px] tablet:gap-[56px] tablet:px-[40px] tablet:py-[64px] desktop:gap-[72px] desktop:px-[96px] desktop:py-[80px]">
      {/* Title */}
      <div className="relative z-[1] flex w-full max-w-[758px] flex-col items-center justify-center gap-[16px] px-[24px] tablet:pl-[50px] tablet:pr-[40px] desktop:gap-[24px] desktop:px-0">
        <p className="m-0 text-center font-sans text-[14px] font-semibold uppercase leading-[19.6px] tracking-[1.7px] text-ink tablet:text-[16px] tablet:leading-[22.4px]">
          customer stories
        </p>
        <h2 className="m-0 text-center font-display text-[48px] font-normal leading-[48px] tracking-[-0.96px] text-ink tablet:text-[64px] tablet:leading-[64px] tablet:tracking-[-1.28px]">
          Teams delivering real results with Siena
        </h2>
        {/* Empty subtitle paragraph on the live site (only a <br>) — 28px spacer (§6). Phone: 22.4px, derived from §11 section height 940 */}
        <div className="h-[22.4px] max-w-[680px] tablet:h-[28px]" aria-hidden="true" />
      </div>

      {/* Carousel */}
      <div className="relative flex w-full flex-col items-center gap-[40px] overflow-hidden">
        <div className="relative z-[3] flex w-full max-w-[1200px] flex-col items-start gap-[24px] p-0 tablet:rounded-[48px] tablet:bg-[rgba(255,255,255,0.5)] tablet:px-[16px] tablet:py-[24px]">
          {/* Slideshow box is a fixed 570px tall on the live site (saved original CSS); its 16/32/48 padding + 522px content overflow it by 16px */}
          <div className="flex h-[570px] w-full flex-col gap-[24px] px-[32px] pb-[48px] pt-[16px]">
            <div
              className="stories-track flex w-full flex-row items-stretch gap-[16px]"
              style={{ opacity: visible ? 1 : 0 }}
            >
              {cards.map((s) => (
                <div key={s.href} className="min-w-0 flex-1 basis-0">
                  <StoryCard story={s} />
                </div>
              ))}
            </div>
            <div className="flex h-[40px] w-full items-center justify-center gap-[12px]">
              <CarouselButton direction="prev" onClick={() => go(-1)} />
              <CarouselButton direction="next" onClick={() => go(1)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
