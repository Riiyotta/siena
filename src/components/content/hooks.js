import { useEffect, useRef, useState } from 'react'

// true two frames after mount, so the hidden start state paints first (mount transitions).
export function useMounted() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    let r2
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setOn(true)) })
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2) }
  }, [])
  return on
}

// whileInView once: true the first time the element intersects the viewport.
export function useInViewOnce() {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect() }
    })
    io.observe(el)
    return () => io.disconnect()
  }, [seen])
  return [ref, seen]
}

export function useTitle(title) {
  useEffect(() => { if (title) document.title = title }, [title])
}
