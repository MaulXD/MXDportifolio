import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { useLightMotion } from './useLightMotion'
import { drawContent, drawItem, drawStagger } from '../lib/drawMotion'

/** Scroll-reveal com animação “desenho”; respeita prefers-reduced-motion / mobile. */
export function useDrawInView(margin = '-80px') {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin })
  const lightMotion = useLightMotion()
  const show = lightMotion || inView

  return {
    ref,
    lightMotion,
    inView,
    show,
    stagger: lightMotion
      ? {}
      : {
          variants: drawStagger,
          initial: 'initial',
          animate: show ? 'animate' : 'initial',
        },
    item: lightMotion
      ? {
          initial: { opacity: 0, y: 14 },
          animate: show ? { opacity: 1, y: 0 } : {},
          transition: { duration: 0.38 },
        }
      : { variants: drawItem },
    block: lightMotion
      ? {
          initial: { opacity: 0, y: 22 },
          animate: show ? { opacity: 1, y: 0 } : {},
          transition: { duration: 0.48 },
        }
      : {
          variants: drawContent,
          initial: 'initial',
          animate: show ? 'animate' : 'initial',
        },
  }
}
