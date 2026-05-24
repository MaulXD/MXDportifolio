import { useEffect, useState } from 'react'

export const LIGHT_MOTION_QUERY = '(max-width: 768px), (prefers-reduced-motion: reduce)'

export function getLightMotionSnapshot() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(LIGHT_MOTION_QUERY).matches
}

/** Mobile ou prefers-reduced-motion: menos animação, vídeo e blur. */
export function useLightMotion() {
  const [light, setLight] = useState(getLightMotionSnapshot)

  useEffect(() => {
    const mq = window.matchMedia(LIGHT_MOTION_QUERY)
    const onChange = () => setLight(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return light
}
