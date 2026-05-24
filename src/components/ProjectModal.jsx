import { useEffect } from 'react'
import { createPortal } from 'react-dom'
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
import ProjectGallery from './ProjectGallery'
import {
  accentMap,
  getCategoryMeta,
  getGallerySummary,
  getVisibleGaleria,
} from '../lib/portfolioUtils'
import { useLightMotion } from '../hooks/useLightMotion'

const ICONS = { Clapperboard, PenTool, Image: ImageIcon, Radio, Globe, Layout }

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

  const panelMotion = lightMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
      }
    : {
        initial: { opacity: 0, y: 28, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 12, scale: 0.99 },
        transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
      }

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        aria-label="Fechar projeto"
        className="absolute inset-0 bg-bg-950/90 sm:backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className={`relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden border-t border-white/10 bg-bg-900 shadow-[0_-8px_48px_rgba(0,0,0,0.6)] sm:max-h-[90vh] sm:max-w-4xl sm:rounded-2xl sm:border ${styles.pageBorder ?? 'sm:border-white/10'}`}
        {...panelMotion}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Icon size={16} className={styles.icon} />
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-medium sm:text-xs ${styles.badge}`}
              >
                {project.category}
              </span>
            </div>
            <h2
              id="project-modal-title"
              className="font-display text-lg font-bold text-white sm:text-2xl"
            >
              {project.title}
            </h2>
            {descricao ? (
              <div
                className={`mt-3 rounded-xl border border-white/15 bg-bg-800/80 px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:px-4 ${styles.badge}`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">
                  Sobre o projeto
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/90 sm:text-[15px]">
                  {descricao}
                </p>
              </div>
            ) : null}
            <p className={`text-xs text-white/40 sm:text-sm ${descricao ? 'mt-2.5' : 'mt-1'}`}>
              {label}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-bg-800 text-white/80 hover:text-white"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
          <div className="mx-auto w-full max-w-2xl px-4 py-3 sm:px-6 sm:py-4">
            {visibleGaleria.length > 0 ? (
              <ProjectGallery
                compact
                items={visibleGaleria}
                title={project.title}
                accentClass={styles.pageBorder ?? 'border-white/10'}
                capaMidiaKey={project.capaMidiaKey}
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
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}
