import { useEffect, useRef } from 'react'
import createGlobe from 'cobe'
import { reducedMotion } from './motion.jsx'

// §3.3 Framer "Globe" (cobe). Base props from the page module; per-stage variants override via onRender.
const rgb = (r, g, b) => [r / 255, g / 255, b / 255]
const BASE = {
  baseColor: rgb(244, 237, 222),
  glowColor: rgb(239, 229, 208), // rgba(239,229,208,0.02): cobe has no glow alpha
  markerColor: rgb(150, 141, 122),
  dark: 0,
  diffuse: 0,
  mapBrightness: 0.89,
  mapSamples: 16241,
  scale: 1.025,
  theta: 0.15,
  phi: 0,
  speed: 0.3,
  markers: [{ location: [34.6424, 30.4507], size: 0 }],
}
export const GLOBE_STAGES = [
  // ZSdt7HgbK — "Instant tracking lookups"
  { ...BASE, markers: [{ location: [40.4567, -105.0901], size: 0.08 }], markerColor: rgb(255, 93, 78), scale: 1.0501, speed: 0.05 },
  // THE30UAcW — marker rgba(255,93,78,0) i.e. hidden; glow rgba(120,115,104,0)
  { ...BASE, glowColor: rgb(244, 237, 222), markers: [{ location: [40.4567, -105.0901], size: 0 }], markerColor: rgb(255, 93, 78), phi: 0.2, speed: 0.02, theta: 0.05 },
]

export default function Globe({ stage = 0, size = 1104, className = '' }) {
  const canvas = useRef(null)
  const cfg = useRef(GLOBE_STAGES[stage])
  const phi = useRef(GLOBE_STAGES[stage].phi)
  cfg.current = GLOBE_STAGES[stage]

  useEffect(() => {
    const el = canvas.current
    let globe = null
    const start = () => {
      if (globe) return
      const c = cfg.current
      globe = createGlobe(el, {
        devicePixelRatio: 2,
        width: size * 2,
        height: size * 2,
        phi: phi.current,
        theta: c.theta,
        dark: c.dark,
        diffuse: c.diffuse,
        mapSamples: c.mapSamples,
        mapBrightness: c.mapBrightness,
        baseColor: c.baseColor,
        markerColor: c.markerColor,
        glowColor: c.glowColor,
        markers: c.markers,
        scale: c.scale,
        onRender: (state) => {
          const k = cfg.current
          if (!reducedMotion()) phi.current += k.speed / 200 // phi += speed/200 per frame
          state.phi = phi.current
          state.theta = k.theta
          state.scale = k.scale
          state.markers = k.markers
          state.markerColor = k.markerColor
          state.glowColor = k.glowColor
        },
      })
    }
    const stop = () => {
      globe?.destroy()
      globe = null
    }
    // only one live WebGL loop while in view (keeps the page light, §3 performance note)
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 })
    io.observe(el)
    return () => {
      io.disconnect()
      stop()
    }
  }, [size])

  return <canvas ref={canvas} className={className} style={{ width: size, height: size }} aria-hidden="true" />
}
