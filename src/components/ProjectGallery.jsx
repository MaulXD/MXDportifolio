import { useState, useEffect, useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Film, Image as ImageIcon } from 'lucide-react'
import { getGaleriaPastas, getMediaLabel } from '../lib/portfolioUtils'
import { useLightMotion } from '../hooks/useLightMotion'
import LoopVideo from './LoopVideo'

function ThumbButton({ item, index, active, onSelect }) {
  const isVideo = item.tipoMedia === 'Vídeo'
  const label = getMediaLabel(item, index)

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Ver ${label}`}
      aria-current={active ? 'true' : undefined}
      title={label}
      className={`group relative flex-shrink-0 overflow-hidden rounded-xl border transition-all ${
        active
          ? 'border-neon-green/70 ring-2 ring-neon-green/30'
          : 'border-white/10 opacity-70 hover:border-white/25 hover:opacity-100'
      }`}
      style={{ width: 88, height: 56 }}
    >
      <div className="flex h-full w-full items-center justify-center p-1.5 sm:p-2">
        {isVideo ? (
          <LoopVideo
            src={item.mediaUrl}
            className="h-auto w-auto max-h-full max-w-full object-contain rounded-lg"
          />
        ) : (
          <img
            src={item.mediaUrl}
            alt=""
            loading="lazy"
            className="h-auto w-auto max-h-full max-w-full object-contain rounded-lg"
          />
        )}
      </div>
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg-950/95 to-transparent px-1.5 pb-1 pt-4 text-left text-[9px] font-medium leading-tight text-white/90 line-clamp-1">
        {label}
      </span>
      <span className="absolute right-1 top-1 rounded bg-bg-950/90 p-0.5 text-white/70">
        {isVideo ? <Film size={10} /> : <ImageIcon size={10} />}
      </span>
    </button>
  )
}

export default function ProjectGallery({
  items,
  title,
  accentClass = 'border-neon-green/30',
  compact = false,
}) {
  const pastas = useMemo(() => getGaleriaPastas(items), [items])
  const showPastas = pastas.length > 1
  const [activePasta, setActivePasta] = useState(pastas[0] ?? 'Geral')
  const [activeIndex, setActiveIndex] = useState(0)
  const lightMotion = useLightMotion()
  const stripRef = useRef(null)

  const filteredItems = showPastas
    ? items.filter((item) => (item.pasta || 'Geral') === activePasta)
    : items

  const current = filteredItems[activeIndex] ?? null
  const count = filteredItems.length

  useEffect(() => {
    setActivePasta(pastas[0] ?? 'Geral')
    setActiveIndex(0)
  }, [items, pastas])

  useEffect(() => {
    setActiveIndex(0)
  }, [activePasta])

  const goPrev = () => setActiveIndex((i) => (i <= 0 ? count - 1 : i - 1))
  const goNext = () => setActiveIndex((i) => (i >= count - 1 ? 0 : i + 1))

  if (!count || !current) {
    return (
      <div className="flex min-h-[200px] w-full items-center justify-center rounded-xl border border-white/10 bg-bg-800/40">
        <img src="/mxd-logo.png" alt="" className="h-14 w-14 rounded-full opacity-30" aria-hidden />
      </div>
    )
  }

  const isVideo = current.tipoMedia === 'Vídeo'
  const currentLabel = getMediaLabel(current, activeIndex)

  const mainMediaClass = `block h-auto w-auto max-h-full max-w-full object-contain object-center rounded-2xl ring-1 ring-white/[0.06] ${
    compact ? 'max-h-[min(32vh,280px)]' : 'max-h-[min(50vh,420px)]'
  }`

  const mainMedia = isVideo ? (
    <LoopVideo key={current.mediaUrl} src={current.mediaUrl} className={mainMediaClass} />
  ) : (
    <img
      key={current.mediaUrl}
      src={current.mediaUrl}
      alt={title ? `${title}: ${currentLabel}` : currentLabel}
      className={mainMediaClass}
    />
  )

  return (
    <div className={`flex w-full flex-col ${compact ? 'gap-3' : 'gap-4'}`}>
      {showPastas && (
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Pastas da galeria"
        >
          {pastas.map((pasta) => {
            const pastaCount = items.filter((it) => (it.pasta || 'Geral') === pasta).length
            const selected = pasta === activePasta
            return (
              <button
                key={pasta}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActivePasta(pasta)}
                className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors ${
                  selected
                    ? 'border-neon-green/40 bg-neon-green/10 text-white'
                    : 'border-white/10 bg-bg-800/50 text-white/55 hover:border-white/20 hover:text-white/80'
                }`}
              >
                <span className="text-xs font-semibold sm:text-sm">{pasta}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                    selected ? 'bg-neon-green/20 text-neon-green' : 'bg-white/5 text-white/40'
                  }`}
                >
                  {pastaCount}
                </span>
              </button>
            )
          })}
        </div>
      )}

      <div
        className={`relative overflow-hidden rounded-2xl border bg-bg-950/80 ${accentClass}`}
      >
        <div
          className={`relative flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.04)_0%,_transparent_70%)] ${
            compact
              ? 'min-h-[140px] px-4 py-5 sm:px-6 sm:py-6'
              : 'min-h-[200px] px-5 py-7 sm:px-8 sm:py-9'
          }`}
        >
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-bg-900/90 text-white/80 backdrop-blur-sm transition-colors hover:border-white/25 hover:text-white sm:left-3"
                aria-label="Mídia anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-bg-900/90 text-white/80 backdrop-blur-sm transition-colors hover:border-white/25 hover:text-white sm:right-3"
                aria-label="Próxima mídia"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {lightMotion ? (
            <div className="flex items-center justify-center">{mainMedia}</div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${current.mediaUrl}-${activeIndex}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                {mainMedia}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div
          className={`flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-bg-900/60 ${
            compact ? 'px-3 py-2' : 'px-4 py-3'
          }`}
        >
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-white">{currentLabel}</p>
          <p className="shrink-0 text-xs text-white/45">
            {activeIndex + 1} / {count}
            {showPastas && <span className="text-white/25"> · </span>}
            {showPastas && <span>{activePasta}</span>}
            <span className="text-white/25"> · </span>
            {isVideo ? 'Vídeo' : 'Imagem'}
          </p>
        </div>
      </div>

      {count > 1 && (
        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-white/35">
            Todas nesta pasta
          </p>
          <div
            ref={stripRef}
            className="flex gap-2 overflow-x-auto pb-1"
          >
            {filteredItems.map((item, i) => (
              <ThumbButton
                key={`${item.mediaUrl}-${i}`}
                item={item}
                index={i}
                active={i === activeIndex}
                onSelect={() => setActiveIndex(i)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
