import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getGallerySummary } from '../lib/portfolioUtils'
import { useLightMotion } from '../hooks/useLightMotion'

export default function GalleryMedia({ galeria, title, accent, className = '' }) {
  const { valid } = getGallerySummary(galeria)
  const [index, setIndex] = useState(0)
  const lightMotion = useLightMotion()
  const hasMultiple = valid.length > 1
  const current = valid[index] ?? null

  const goTo = useCallback(
    (next) => {
      if (!hasMultiple) return
      setIndex((i) => (i + next + valid.length) % valid.length)
    },
    [hasMultiple, valid.length],
  )

  useEffect(() => {
    setIndex(0)
  }, [galeria])

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

  const mediaEl = isVideo ? (
    <video
      key={current.mediaUrl}
      src={current.mediaUrl}
      autoPlay
      loop
      muted
      playsInline
      className="h-full w-full object-cover"
    />
  ) : (
    <img
      key={current.mediaUrl}
      src={current.mediaUrl}
      alt={title ?? 'Projeto'}
      className="h-full w-full object-cover"
      loading="lazy"
    />
  )

  return (
    <div className={`relative h-full w-full ${className}`}>
      {lightMotion ? (
        <div className="absolute inset-0">{mediaEl}</div>
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
            {mediaEl}
          </motion.div>
        </AnimatePresence>
      )}

      {hasMultiple && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-bg-950/80 to-transparent px-3 pb-3 pt-8">
            <div className="flex justify-center gap-1.5">
              {valid.map((_, i) => (
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
            {index + 1}/{valid.length}
          </span>
        </>
      )}
    </div>
  )
}
