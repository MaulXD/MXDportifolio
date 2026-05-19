import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Film, Image as ImageIcon } from 'lucide-react'
import { getMediaLabel } from '../lib/portfolioUtils'
import { useLightMotion } from '../hooks/useLightMotion'

export default function ProjectGallery({ items, title, accentClass = 'border-neon-green/30' }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const lightMotion = useLightMotion()
  const current = items[activeIndex] ?? null

  useEffect(() => {
    setActiveIndex(0)
  }, [items])

  if (!items.length) {
    return (
      <div className="flex aspect-[4/3] max-h-72 items-center justify-center rounded-xl border border-white/10 bg-bg-800/60">
        <img src="/mxd-logo.png" alt="" className="h-14 w-14 rounded-full opacity-30" aria-hidden />
      </div>
    )
  }

  const isVideo = current?.tipoMedia === 'Vídeo'
  const currentLabel = getMediaLabel(current, activeIndex)

  const mainMedia = isVideo ? (
    <video
      key={current.mediaUrl}
      src={current.mediaUrl}
      autoPlay
      loop
      muted
      playsInline
      controls
      className="max-h-full max-w-full rounded-lg object-contain"
    />
  ) : (
    <img
      key={current.mediaUrl}
      src={current.mediaUrl}
      alt={title ? `${title} — ${currentLabel}` : currentLabel}
      className="max-h-full max-w-full rounded-lg object-contain"
    />
  )

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-5">
      <div className="order-2 lg:order-1 lg:w-[120px] lg:flex-shrink-0">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/40 lg:sr-only">
          Galeria
        </p>
        <div className="flex gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:pb-0 lg:pr-1 lg:max-h-[min(46vh,400px)]">
          {items.map((item, i) => {
            const active = i === activeIndex
            const thumbVideo = item.tipoMedia === 'Vídeo'
            const thumbLabel = getMediaLabel(item, i)
            return (
              <div key={`${item.mediaUrl}-${i}`} className="flex w-20 flex-shrink-0 flex-col gap-1 sm:w-[88px] lg:w-full">
                <button
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Ver ${thumbLabel}`}
                  aria-current={active ? 'true' : undefined}
                  className={`relative aspect-video overflow-hidden rounded-lg border transition-colors lg:aspect-[4/3] ${
                    active
                      ? 'border-neon-green/60 ring-2 ring-neon-green/25'
                      : 'border-white/10 opacity-75 hover:border-white/30 hover:opacity-100'
                  }`}
                >
                  {thumbVideo ? (
                    <video
                      src={item.mediaUrl}
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.mediaUrl}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <span className="absolute bottom-1 right-1 rounded bg-bg-950/85 p-0.5 text-white/70">
                    {thumbVideo ? <Film size={10} /> : <ImageIcon size={10} />}
                  </span>
                </button>
                <p
                  className={`line-clamp-2 text-center text-[10px] leading-tight lg:text-left ${
                    active ? 'text-neon-green/90' : 'text-white/45'
                  }`}
                  title={thumbLabel}
                >
                  {thumbLabel}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div
        className={`order-1 lg:order-2 relative mx-auto w-full max-w-2xl flex-1 overflow-hidden rounded-xl border bg-bg-800/60 lg:mx-0 ${accentClass}`}
      >
        <div className="relative flex aspect-[4/3] max-h-[min(42vh,360px)] items-center justify-center bg-bg-900/50 sm:max-h-[min(46vh,400px)]">
          {lightMotion ? (
            <div className="absolute inset-0 flex items-center justify-center p-2">{mainMedia}</div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${current.mediaUrl}-${activeIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center p-2"
              >
                {mainMedia}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
        <div className="border-t border-white/5 px-3 py-2.5 text-center">
          <p className="text-sm font-medium text-white/90">{currentLabel}</p>
          <p className="mt-0.5 text-[11px] text-white/40">
            {activeIndex + 1} de {items.length}
            {isVideo ? ' · Vídeo' : ' · Imagem'}
          </p>
        </div>
      </div>
    </div>
  )
}
