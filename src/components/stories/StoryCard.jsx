// CLONE_SPEC §6 Story card (+ §11 mobile). Hover/texture rules live in src/styles/stories.css.
export default function StoryCard({ story }) {
  return (
    <a
      href={story.href}
      className="story-card relative flex h-[458px] w-full flex-col items-start justify-between overflow-hidden rounded-[24px] bg-white no-underline"
    >
      <div className="absolute left-0 right-0 top-0 z-0 h-[458px]" aria-hidden={story.textureAlt ? undefined : true}>
        <div className="story-card__texture">
          <img
            src={`/assets/${story.texture}`}
            alt={story.textureAlt || ''}
            className="block h-full w-full object-cover object-center"
            decoding="async"
          />
        </div>
      </div>
      <div className="story-card__content relative flex w-full flex-1 flex-col items-start justify-between">
        <div className="relative h-[64px] w-[140px] flex-none">
          <img
            src={`/assets/${story.logo}`}
            alt={story.logoAlt || ''}
            className="block h-full w-full object-contain object-center"
            decoding="async"
          />
        </div>
        <div className="flex w-full items-end justify-between">
          <h3 className="m-0 flex-1 font-display-regular text-[18px] font-normal leading-[25.2px] text-ink tablet:text-[24px] tablet:leading-[33.6px]">
            {story.title}
          </h3>
        </div>
      </div>
    </a>
  )
}
