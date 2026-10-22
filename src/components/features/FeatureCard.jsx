import LottiePlayer from './LottiePlayer.jsx'

// CLONE_SPEC §7 card (withPading / withoutPading) + §11 "Features (mobile)" (Mobile / Mobile NoPading).
export default function FeatureCard({ card }) {
  const flush = card.variant === 'flush'
  return (
    <div className={`feature-card ${flush ? 'feature-card--flush' : 'feature-card--pad'}`}>
      <div className="feature-card__text">
        <h3 className="m-0 w-full font-display-regular font-normal text-ink feature-card__title">{card.title}</h3>
        <p className="m-0 w-full font-serif font-normal text-ink-2 feature-card__body">{card.body}</p>
      </div>
      <LottiePlayer file={card.lottie} className="feature-card__lottie" />
    </div>
  )
}
