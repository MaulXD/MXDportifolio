import { useEffect, useState } from 'react'

/** Mobile ou preferência do sistema — animações mais leves (menos flicker) */
export function useLightMotion() {
  const [light, setLight] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)')
    const onChange = () => setLight(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return light
}
