import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getGallerySummary, getProjectCoverMedia } from '../lib/portfolioUtils'
import { useLightMotion } from '../hooks/useLightMotion'

export default function GalleryMedia({
  galeria,
  title,
  accent,
  className = '',
  coverItem = null,
  logoUrl = null,
  cardPreview = false,
}) {
  const { valid } = getGallerySummary(galeria)
  const previewItems = cardPreview ? (coverItem ? [coverItem] : []) : valid

  const [index, setIndex] = useState(0)
  const lightMotion = useLightMotion()
  const hasMultiple = !cardPreview && previewItems.length > 1
  const current = previewItems[index] ?? null

  const goTo = useCallback(
    (next) => {
      if (!hasMultiple) return
      setIndex((i) => (i + next + previewItems.length) % previewItems.length)
    },
    [hasMultiple, previewItems.length],
  )

  useEffect(() => {
    setIndex(0)
  }, [galeria, coverItem, cardPreview])

  if (!current?.mediaUrl) {
    return (
      <div className={`flex h-full items-center justify-center ${className}`}>
        <img
          src="/mxd-logo.png"
          alt=""
          className="h-16 w-16 rounded-full object-cover opacity-30"
          aria-hidden
        />
      </div>
    )
  }

  const isVideo = current?.tipoMedia === 'Vídeo'
  const mediaClass = cardPreview
    ? 'h-full w-full object-contain object-center'
    : 'max-h-full max-w-full object-contain object-center drop-shadow-sm'

  const mediaEl = isVideo ? (
    <video
      key={current.mediaUrl}
      src={current.mediaUrl}
      autoPlay
      loop
      muted
      playsInline
      className={mediaClass}
    />
  ) : (
    <img
      key={current.mediaUrl}
      src={current.mediaUrl}
      alt={title ?? 'Projeto'}
      className={mediaClass}
      loading="lazy"
    />
  )

  const logoOverlay =
    logoUrl && cardPreview ? (
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-6 sm:p-8">
        <img
          src={logoUrl}
          alt=""
          className="max-h-[42%] max-w-[72%] object-contain drop-shadow-[0_8px_32px_rgba(0,0,0,0.55)]"
          loading="lazy"
        />
      </div>
    ) : null

  const mediaFrame = cardPreview ? (
    <div className="absolute inset-0 overflow-hidden rounded-t-2xl bg-bg-900/60">
      <div className="flex h-full w-full items-center justify-center p-3 sm:p-4">
        <div className="relative h-full w-full overflow-hidden rounded-2xl ring-1 ring-white/[0.06]">
          {mediaEl}
        </div>
      </div>
      {logoOverlay}
    </div>
  ) : (
    <div className="flex h-full w-full items-center justify-center p-4 sm:p-5">
      <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/[0.06]">{mediaEl}</div>
    </div>
  )

  return (
    <div
      className={`relative h-full w-full bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.04)_0%,_transparent_72%)] ${className}`}
    >
      {lightMotion ? (
        <div className="absolute inset-0">{mediaFrame}</div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${current.mediaUrl}-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            {mediaFrame}
          </motion.div>
        </AnimatePresence>
      )}

      {hasMultiple && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-bg-950/80 to-transparent px-3 pb-3 pt-8">
            <div className="flex justify-center gap-1.5">
              {previewItems.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIndex(i)
                  }}
                  aria-label={`Mídia ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? `w-5 ${accent?.dot ?? 'bg-neon-green'}` : 'w-1.5 bg-white/35'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goTo(-1)
            }}
            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg border border-white/10 bg-bg-950/80 text-white sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Mídia anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goTo(1)
            }}
            className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg border border-white/10 bg-bg-950/80 text-white sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Próxima mídia"
          >
            <ChevronRight size={16} />
          </button>

          <span className="absolute right-2 top-2 z-10 rounded-full border border-white/10 bg-bg-950/80 px-2 py-0.5 text-[10px] font-medium text-white/70">
            {index + 1}/{previewItems.length}
          </span>
        </>
      )}
    </div>
  )
}

/** Atalho para cards do portfólio. */
export function PortfolioCardMedia({ project, title, accent, className = '' }) {
  return (
    <GalleryMedia
      galeria={project.galeria}
      title={title}
      accent={accent}
      className={`absolute inset-0 ${className}`.trim()}
      coverItem={getProjectCoverMedia(project)}
      logoUrl={project.logoCapaUrl}
      cardPreview
    />
  )
}
