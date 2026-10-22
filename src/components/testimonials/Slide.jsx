// CLONE_SPEC §3 slide (944 x ~486 desktop) / §11 mobile column layout.
function QuoteMark() {
  // public/svg/quote-mark.svg (30x24)
  return (
    <svg className="t-quote-mark" viewBox="0 0 30 24" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M7.2 23.427c-4.128 0-7.2-3.264-7.2-7.775C0 7.492 4.896 1.635 12.96.771v1.823C8.832 3.46 4.224 7.3 3.936 12.58c5.184-2.112 9.024 1.248 9.024 4.8 0 3.456-2.496 6.048-5.76 6.048Zm9.696-7.775c0-8.16 4.896-14.017 12.96-14.88v1.823c-4.128.864-8.736 4.704-9.024 9.984 5.184-2.112 9.024 1.248 9.024 4.8 0 3.456-2.496 6.048-5.76 6.048-4.128 0-7.2-3.264-7.2-7.775Z"
        fill="#122023"
      />
    </svg>
  )
}

function PlayBadge() {
  // public/svg/play-badge-circle.svg + play-badge-triangle.svg (decorative, no video in DOM)
  return (
    <div className="t-play-badge" aria-hidden="true">
      <svg className="t-play-circle" viewBox="0 0 55 55">
        <path
          d="M 27.5 55 C 12.312 55 0 42.688 0 27.5 L 0 27.5 C 0 12.312 12.312 0 27.5 0 L 27.5 0 C 42.688 0 55 12.312 55 27.5 L 55 27.5 C 55 42.688 42.688 55 27.5 55 Z"
          fill="rgba(255, 255, 255, 0.9)"
        />
      </svg>
      <svg className="t-play-triangle" viewBox="0 0 15.031 19.089" preserveAspectRatio="none">
        <defs>
          <linearGradient id="t-play-grad" x1="-0.23" x2="1" y1="-0.15778085456642127" y2="0.950534831894809">
            <stop offset="0" stopColor="rgb(247, 221, 147)" />
            <stop offset="0.24025132289145654" stopColor="rgb(248, 181, 127)" />
            <stop offset="0.5096240182546076" stopColor="rgb(255, 93, 78)" />
            <stop offset="0.7353146549102207" stopColor="rgb(249, 80, 64)" />
            <stop offset="1" stopColor="rgb(253, 163, 172)" />
          </linearGradient>
        </defs>
        <path d="M 0 19.089 L 0 0 L 15.031 9.545 Z" fill="url(#t-play-grad)" />
      </svg>
    </div>
  )
}

export default function Slide({ data, className = '', style, ...rest }) {
  return (
    <div className={`t-slide ${className}`} style={style} {...rest}>
      <div className="t-slide-text">
        <QuoteMark />
        <p className="t-quote">{data.quote}</p>
        <div className="t-brand">
          <div className="t-logo">
            <img src={`/assets/${data.logo}`} alt={data.logoAlt} />
          </div>
          <div className="t-person">
            <p className="t-name">{data.name}</p>
            <p className="t-role">{data.role}</p>
          </div>
        </div>
        {data.href && (
          <a className="t-read-btn" href={data.href}>
            Read full story
          </a>
        )}
      </div>
      <div className="t-slide-media">
        <img src={`/assets/${data.image}`} alt={data.imageAlt} />
        {data.playBadge && <PlayBadge />}
      </div>
    </div>
  )
}
