/** Curvas suaves para transições “desenhadas”. */
export const DRAW_EASE = [0.33, 1, 0.45, 1]
export const DRAW_EASE_OUT = [0.22, 1, 0.36, 1]

export const drawPanel = {
  initial: { opacity: 0, clipPath: 'inset(0 100% 0 0 round 20px)' },
  animate: {
    opacity: 1,
    clipPath: 'inset(0 0% 0 0 round 20px)',
    transition: { duration: 0.72, ease: DRAW_EASE },
  },
  exit: {
    opacity: 0,
    clipPath: 'inset(0 0 0 100% round 20px)',
    transition: { duration: 0.55, ease: DRAW_EASE_OUT },
  },
}

export const drawPanelLight = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.28 } },
  exit: { opacity: 0, transition: { duration: 0.22 } },
}

export const drawContent = {
  initial: { opacity: 0, clipPath: 'inset(0 0 100% 0 round 12px)' },
  animate: {
    opacity: 1,
    clipPath: 'inset(0 0 0% 0 round 12px)',
    transition: { duration: 0.55, ease: DRAW_EASE, delay: 0.12 },
  },
}

export const drawMedia = {
  initial: { opacity: 0, clipPath: 'inset(0 100% 0 0 round 12px)' },
  animate: {
    opacity: 1,
    clipPath: 'inset(0 0% 0 0 round 12px)',
    transition: { duration: 0.58, ease: DRAW_EASE },
  },
  exit: {
    opacity: 0,
    clipPath: 'inset(0 0 0 100% round 12px)',
    transition: { duration: 0.48, ease: DRAW_EASE_OUT },
  },
}

export const drawMediaLight = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
}

export const drawItem = {
  initial: { opacity: 0, clipPath: 'inset(0 100% 0 0 round 10px)' },
  animate: {
    opacity: 1,
    clipPath: 'inset(0 0% 0 0 round 10px)',
    transition: { duration: 0.45, ease: DRAW_EASE },
  },
}

export const drawStagger = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.22 },
  },
}

export const drawFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: DRAW_EASE } },
  exit: { opacity: 0, transition: { duration: 0.38, ease: DRAW_EASE_OUT } },
}
