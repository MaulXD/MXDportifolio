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

/** Pastas entram primeiro; mídia principal e miniaturas depois. */
export const GALLERY_FOLDERS_DELAY = 0.12
export const GALLERY_FOLDER_STAGGER = 0.05
export const GALLERY_FOLDER_ITEM = 0.35
export const GALLERY_MEDIA_DELAY =
  GALLERY_FOLDERS_DELAY + GALLERY_FOLDER_ITEM + GALLERY_FOLDER_STAGGER * 4

export const GALLERY_STAGE_WIPE = 0.72
export const GALLERY_STAGE_FADE = 0.55
/** Fade começa antes do wipe terminar — transição mais suave, sem corte seco. */
export const GALLERY_FADE_OVERLAP = 0.32
export const GALLERY_STAGE_TOTAL =
  GALLERY_MEDIA_DELAY + GALLERY_STAGE_WIPE - GALLERY_FADE_OVERLAP + GALLERY_STAGE_FADE

export const drawMedia = {
  initial: {
    clipPath: 'inset(0 100% 0 0 round 12px)',
    opacity: 0,
  },
  animate: {
    clipPath: 'inset(0 0% 0 0 round 12px)',
    opacity: 1,
    transition: {
      clipPath: {
        duration: GALLERY_STAGE_WIPE,
        ease: DRAW_EASE,
        delay: GALLERY_MEDIA_DELAY,
      },
      opacity: {
        duration: GALLERY_STAGE_FADE,
        ease: DRAW_EASE,
        delay: GALLERY_MEDIA_DELAY + GALLERY_STAGE_WIPE - GALLERY_FADE_OVERLAP,
      },
    },
  },
}

/** Pastas/miniaturas — fade simples, sem clip (evita piscada no fim do wipe). */
export const drawItem = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: DRAW_EASE },
  },
}

export const drawStagger = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.22 },
  },
}

/** Pastas da galeria — entram antes da mídia principal. */
export const drawStaggerFolders = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: GALLERY_FOLDER_STAGGER,
      delayChildren: GALLERY_FOLDERS_DELAY,
    },
  },
}

/** Miniaturas — só depois da mídia principal. */
export const drawStaggerThumbs = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: GALLERY_STAGE_TOTAL,
    },
  },
}

export const drawFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: DRAW_EASE } },
  exit: { opacity: 0, transition: { duration: 0.38, ease: DRAW_EASE_OUT } },
}
