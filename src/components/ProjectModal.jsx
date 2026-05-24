import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  X,
  ExternalLink,
  Clapperboard,
  PenTool,
  Image as ImageIcon,
  Radio,
  Globe,
  Layout,
} from 'lucide-react'
import DrawnBorder from './DrawnBorder'
import ProjectGallery from './ProjectGallery'
import {
  accentMap,
  getCategoryMeta,
  getGallerySummary,
  getVisibleGaleria,
} from '../lib/portfolioUtils'
import {
  DRAW_EASE,
  drawContent,
  drawFade,
  drawItem,
  drawPanel,
  drawPanelLight,
  drawStagger,
} from '../lib/drawMotion'
import { useLightMotion } from '../hooks/useLightMotion'

const ICONS = { Clapperboard, PenTool, Image: ImageIcon, Radio, Globe, Layout }

const STROKE_BY_ACCENT = {
  'neon-green': 'rgba(0,255,157,0.5)',
  'neon-cyan': 'rgba(14,165,233,0.5)',
  'neon-violet': 'rgba(139,92,246,0.5)',
  'neon-pink': 'rgba(255,0,102,0.45)',
  'neon-amber': 'rgba(245,158,11,0.5)',
}

export default function ProjectModal({ project, onClose }) {
  const lightMotion = useLightMotion()

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const meta = getCategoryMeta(project.category)
  const styles = accentMap[meta.accent] ?? accentMap['neon-violet']
  const Icon = ICONS[meta.iconName] ?? Clapperboard
  const visibleGaleria = getVisibleGaleria(project.galeria)
  const { label } = getGallerySummary(project.galeria)
  const descricao = project.descricao?.trim()
  const borderStroke = STROKE_BY_ACCENT[meta.accent] ?? STROKE_BY_ACCENT['neon-violet']

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-4"
      {...drawFade}
    >
      <motion.button
        type="button"
        aria-label="Fechar projeto"
        className="absolute inset-0 bg-bg-950/90 sm:backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: DRAW_EASE }}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className={`relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden bg-bg-900 shadow-[0_-8px_48px_rgba(0,0,0,0.6)] sm:max-h-[90vh] sm:max-w-5xl sm:rounded-2xl sm:border sm:border-white/10 ${styles.pageBorder ?? ''}`}
        {...(lightMotion ? drawPanelLight : drawPanel)}
        onClick={(e) => e.stopPropagation()}
      >
        {!lightMotion && <DrawnBorder stroke={borderStroke} className="hidden sm:block" />}

        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-6">
          <motion.div className="min-w-0 flex-1" variants={drawStagger} initial="initial" animate="animate">
            <motion.div variants={drawItem} className="mb-2 flex items-center gap-2">
              <Icon size={16} className={styles.icon} />
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-medium sm:text-xs ${styles.badge}`}
              >
                {project.category}
              </span>
            </motion.div>
            <motion.h2
              id="project-modal-title"
              variants={drawItem}
              className="font-display text-lg font-bold text-white sm:text-2xl"
            >
              {project.title}
            </motion.h2>
            {descricao ? (
              <motion.div
                variants={drawItem}
                className={`mt-3 rounded-xl border border-white/15 bg-bg-800/80 px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:px-4 ${styles.badge}`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">
                  Sobre o projeto
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/90 sm:text-[15px]">
                  {descricao}
                </p>
              </motion.div>
            ) : null}
            <motion.p
              variants={drawItem}
              className={`text-xs text-white/40 sm:text-sm ${descricao ? 'mt-2.5' : 'mt-1'}`}
            >
              {label}
            </motion.p>
          </motion.div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-bg-800 text-white/80 hover:text-white"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <motion.div
          className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
          {...(lightMotion ? { initial: { opacity: 0 }, animate: { opacity: 1 } } : drawContent)}
        >
          <div className="mx-auto w-full max-w-4xl px-4 py-3 sm:px-6 sm:py-4">
            {visibleGaleria.length > 0 ? (
              <ProjectGallery
                compact
                items={visibleGaleria}
                title={project.title}
                accentClass={styles.pageBorder ?? 'border-white/10'}
              />
            ) : null}
          </div>

          {project.externalLink && (
            <div className="shrink-0 border-t border-white/10 px-4 py-4 sm:px-6">
              <a
                href={project.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-neon-green py-3 text-sm font-semibold text-bg-950 transition-opacity hover:opacity-90"
              >
                Ver publicado <ExternalLink size={14} />
              </a>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
