import { useEffect, useRef } from 'react'
import lottie from 'lottie-web/build/player/lottie_svg'

// CLONE_SPEC §7 "Lottie playback": svg renderer, autoplay, loop, speed 1,
// preserveAspectRatio 'xMidYMid slice'. Plays continuously (no in-view gating).
export default function LottiePlayer({ file, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: ref.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: `/lottie/${file}`,
      rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
    })
    anim.setSpeed(1)
    return () => anim.destroy()
  }, [file])
  return <div ref={ref} className={className} aria-hidden="true" />
}
