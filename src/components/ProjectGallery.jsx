import { useState, useEffect, useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Film, Image as ImageIcon } from 'lucide-react'
import { sortPastasByTipos } from '../lib/galeriaFolderMeta'
import { getGaleriaPastas, getGalleryDefaultSelection, getMediaLabel } from '../lib/portfolioUtils'
import { useGaleriaPastaTipos } from '../hooks/useGaleriaPastaTipos'
import { useLightMotion } from '../hooks/useLightMotion'
import { drawItem, drawMedia, drawMediaSwitch, drawStaggerFolders, drawStaggerThumbs } from '../lib/drawMotion'
import DrawnBorder from './DrawnBorder'
import PastaTabIcon from './PastaTabIcon'
import LoopVideo from './LoopVideo'

const COMPACT_STAGE = 'h-[280px] sm:h-[320px]'
const FULL_STAGE = 'h-[min(50vh,420px)] min-h-[320px]'
const THUMB_ROW = 'h-[72px]'

function ThumbButton({ item, index, active, onSelect, lightMotion }) {
  const isVideo = item.tipoMedia === 'Vídeo'
  const label = getMediaLabel(item, index)

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Ver ${label}`}
      aria-current={active ? 'true' : undefined}
      title={label}
      className={`group relative h-14 w-[5.5rem] shrink-0 overflow-hidden rounded-xl border transition-all ${
        active
          ? 'border-neon-green/70 ring-2 ring-neon-green/30'
          : 'border-white/10 opacity-70 hover:border-white/25 hover:opacity-100'
      }`}
    >
      <div className="flex h-full w-full items-center justify-center p-1.5">
        {isVideo ? (
          <div className="relative flex h-full w-full items-center justify-center">
            <LoopVideo
              src={item.mediaUrl}
              autoPlay={false}
              preload="metadata"
              className="max-h-full max-w-full object-contain rounded-lg opacity-80"
            />
            <Film
              size={lightMotion ? 14 : 12}
              className="pointer-events-none absolute text-white/55"
              aria-hidden
            />
          </div>
        ) : (
          <img
            src={item.mediaUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full object-contain rounded-lg"
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

function PastaFolderButton({ pastaMeta, pastaCount, selected, iconMap, onSelect, sidebar = false }) {
  const pasta = pastaMeta.nome

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onSelect}
      className={`flex text-left transition-all ${
        sidebar
          ? `w-full items-center gap-2.5 rounded-xl border px-2.5 py-2.5 ${
              selected
                ? 'border-neon-green/50 bg-neon-green/10 text-white shadow-[0_0_20px_rgba(0,255,157,0.12)]'
                : 'border-white/10 bg-bg-800/50 text-white/55 hover:border-white/25 hover:text-white/85'
            }`
          : `shrink-0 items-center gap-2.5 rounded-xl border px-3 py-2.5 ${
              selected
                ? 'border-neon-green/50 bg-neon-green/10 text-white shadow-[0_0_20px_rgba(0,255,157,0.12)]'
                : 'border-white/10 bg-bg-800/50 text-white/55 hover:border-white/25 hover:text-white/85'
            }`
      }`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-lg border ${
          sidebar ? 'h-8 w-8' : 'h-9 w-9'
        } ${
          selected
            ? 'border-neon-green/40 bg-neon-green/20 text-neon-green'
            : 'border-white/10 bg-bg-950/90 text-white/60'
        }`}
      >
        <PastaTabIcon
          nome={pasta}
          pastaIcone={pastaMeta.icone}
          iconMap={iconMap}
          size={sidebar ? 18 : 20}
          strokeWidth={2.25}
        />
      </span>
      <span className={`min-w-0 flex-1 text-xs font-semibold sm:text-sm ${sidebar ? 'leading-tight' : ''}`}>
        {pasta}
      </span>
      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums ${
          selected ? 'bg-neon-green/25 text-neon-green' : 'bg-white/5 text-white/40'
        }`}
      >
        {pastaCount}
      </span>
    </button>
  )
}

function StageMedia({ current, title, currentLabel, isVideo, lightMotion }) {
  const mediaClass =
    'max-h-full max-w-full object-contain object-center rounded-xl ring-1 ring-white/[0.06]'

  if (isVideo) {
    return (
      <LoopVideo
        key={current.mediaUrl}
        src={current.mediaUrl}
        className={mediaClass}
        preload={lightMotion ? 'metadata' : 'auto'}
      />
    )
  }

  return (
    <img
      key={current.mediaUrl}
      src={current.mediaUrl}
      alt={title ? `${title}: ${currentLabel}` : currentLabel}
      className={mediaClass}
      decoding="async"
    />
  )
}

export default function ProjectGallery({
  items,
  title,
  accentClass = 'border-neon-green/30',
  compact = false,
  capaMidiaKey = null,
}) {
  const { tipos, iconMap } = useGaleriaPastaTipos()
  const pastasRaw = useMemo(() => getGaleriaPastas(items), [items])
  const pastas = useMemo(() => {
    const orderedNames = sortPastasByTipos(
      pastasRaw.map((p) => p.nome),
      tipos,
    )
    return orderedNames.map(
      (nome) => pastasRaw.find((p) => p.nome === nome) ?? { nome, icone: null },
    )
  }, [pastasRaw, tipos])
  const showPastas = pastas.length > 1
  const sidebarPastas = compact && showPastas
  const stageHeight = compact ? COMPACT_STAGE : FULL_STAGE
  const defaultSelection = useMemo(
    () => getGalleryDefaultSelection(items, pastas, capaMidiaKey),
    [items, pastas, capaMidiaKey],
  )
  const [activePasta, setActivePasta] = useState(defaultSelection.pasta)
  const [activeIndex, setActiveIndex] = useState(defaultSelection.index)
  const lightMotion = useLightMotion()
  const stripRef = useRef(null)

  const activePastaMeta = pastas.find((p) => p.nome === activePasta) ?? pastas[0]

  const filteredItems = showPastas
    ? items.filter((item) => (item.pasta || 'Geral') === activePasta)
    : items

  const current = filteredItems[activeIndex] ?? null
  const count = filteredItems.length
  const mediaKey = `${activePasta}-${current?.mediaUrl ?? 'empty'}-${activeIndex}`
  const navBtnClass =
    'absolute top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-bg-900/95 text-white/80 transition-colors hover:border-white/25 hover:text-white'
  const galleryKey = useMemo(
    () => items.map((item) => item.mediaUrl).join('|'),
    [items],
  )

  useEffect(() => {
    const next = getGalleryDefaultSelection(items, pastas, capaMidiaKey)
    setActivePasta(next.pasta)
    setActiveIndex(next.index)
  }, [galleryKey])

  useEffect(() => {
    setActiveIndex(0)
  }, [activePasta])

  const goPrev = () => setActiveIndex((i) => (i <= 0 ? count - 1 : i - 1))
  const goNext = () => setActiveIndex((i) => (i >= count - 1 ? 0 : i + 1))

  if (!count || !current) {
    return (
      <motion.div
        className={`flex w-full items-center justify-center rounded-xl border border-white/10 bg-bg-800/40 ${stageHeight}`}
      >
        <img src="/mxd-logo.png" alt="" className="h-14 w-14 rounded-full opacity-30" aria-hidden />
      </motion.div>
    )
  }

  const isVideo = current.tipoMedia === 'Vídeo'
  const currentLabel = getMediaLabel(current, activeIndex)

  const folderList = showPastas ? (
    lightMotion ? (
      <div
        className={
          sidebarPastas
            ? `flex shrink-0 flex-col gap-1.5 sm:w-44 sm:overflow-y-auto sm:pr-1 ${stageHeight}`
            : 'flex gap-2 overflow-x-auto pb-1'
        }
        role="tablist"
        aria-label="Pastas da galeria"
      >
        {sidebarPastas && (
          <p className="mb-0.5 hidden shrink-0 px-1 text-[10px] font-medium uppercase tracking-widest text-white/35 sm:block">
            Pastas
          </p>
        )}
        {pastas.map((pastaMeta) => {
          const pasta = pastaMeta.nome
          const pastaCount = items.filter((it) => (it.pasta || 'Geral') === pasta).length
          return (
            <div key={pasta}>
              <PastaFolderButton
                pastaMeta={pastaMeta}
                pastaCount={pastaCount}
                selected={pasta === activePasta}
                iconMap={iconMap}
                sidebar={sidebarPastas}
                onSelect={() => setActivePasta(pasta)}
              />
            </div>
          )
        })}
      </div>
    ) : (
    <motion.div
      className={
        sidebarPastas
          ? `flex shrink-0 flex-col gap-1.5 sm:w-44 sm:overflow-y-auto sm:pr-1 ${stageHeight}`
          : 'flex gap-2 overflow-x-auto pb-1'
      }
      role="tablist"
      aria-label="Pastas da galeria"
      variants={lightMotion ? undefined : drawStaggerFolders}
      initial={lightMotion ? false : 'initial'}
      animate={lightMotion ? false : 'animate'}
    >
      {sidebarPastas && (
        <p className="mb-0.5 hidden shrink-0 px-1 text-[10px] font-medium uppercase tracking-widest text-white/35 sm:block">
          Pastas
        </p>
      )}
      {pastas.map((pastaMeta) => {
        const pasta = pastaMeta.nome
        const pastaCount = items.filter((it) => (it.pasta || 'Geral') === pasta).length
        const selected = pasta === activePasta

        const button = (
          <PastaFolderButton
            pastaMeta={pastaMeta}
            pastaCount={pastaCount}
            selected={selected}
            iconMap={iconMap}
            sidebar={sidebarPastas}
            onSelect={() => setActivePasta(pasta)}
          />
        )

        if (lightMotion) {
          return <div key={pasta}>{button}</div>
        }

        return (
          <motion.div key={pasta} variants={drawItem}>
            {button}
          </motion.div>
        )
      })}
    </motion.div>
    )
  ) : null

  return (
    <div
      className={`flex w-full ${sidebarPastas ? 'flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4' : 'flex-col'} ${compact ? 'gap-3' : 'gap-4'}`}
    >
      {folderList}

      <div className={`flex min-w-0 flex-1 flex-col ${compact ? 'gap-3' : 'gap-4'}`}>
        <div
          className={`relative overflow-hidden rounded-2xl border bg-bg-950/80 ${accentClass}`}
        >
          {!lightMotion && (
            <DrawnBorder stroke="rgba(0,255,157,0.35)" className="rounded-2xl" />
          )}
          {lightMotion ? (
            <div
              key={galleryKey}
              className={`relative w-full overflow-hidden bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.04)_0%,_transparent_70%)] ${stageHeight}`}
            >
              {count > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className={`left-2 sm:left-3 ${navBtnClass}`}
                    aria-label="Mídia anterior"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className={`right-2 sm:right-3 ${navBtnClass}`}
                    aria-label="Próxima mídia"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
              <div
                key={mediaKey}
                className="absolute inset-0 flex items-center justify-center px-4 py-4 sm:px-6 sm:py-5"
              >
                <StageMedia
                  current={current}
                  title={title}
                  currentLabel={currentLabel}
                  isVideo={isVideo}
                  lightMotion={lightMotion}
                />
              </div>
            </div>
          ) : (
            <motion.div
              key={galleryKey}
              className={`relative w-full overflow-hidden bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.04)_0%,_transparent_70%)] ${stageHeight}`}
              initial={drawMedia.initial}
              animate={drawMedia.animate}
            >
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className={`left-2 sm:left-3 ${navBtnClass}`}
                  aria-label="Mídia anterior"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className={`right-2 sm:right-3 ${navBtnClass}`}
                  aria-label="Próxima mídia"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mediaKey}
                className="absolute inset-0 flex items-center justify-center px-4 py-4 sm:px-6 sm:py-5"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={drawMediaSwitch}
              >
                <StageMedia
                  current={current}
                  title={title}
                  currentLabel={currentLabel}
                  isVideo={isVideo}
                  lightMotion={lightMotion}
                />
              </motion.div>
            </AnimatePresence>
            </motion.div>
          )}

          <div
            className={`flex h-12 shrink-0 items-center justify-between gap-2 border-t border-white/10 bg-bg-900/60 ${
              compact ? 'px-3' : 'px-4'
            }`}
          >
            <p className="flex min-w-0 flex-1 items-center gap-2 truncate text-sm font-medium text-white">
              {showPastas && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-bg-950/80 text-neon-green">
                  <PastaTabIcon
                    nome={activePasta}
                    pastaIcone={activePastaMeta?.icone}
                    iconMap={iconMap}
                    size={14}
                    strokeWidth={2.25}
                  />
                </span>
              )}
              <span className="truncate">{currentLabel}</span>
            </p>
            <p className="shrink-0 text-xs text-white/45">
              {activeIndex + 1} / {count}
              {showPastas && <span className="text-white/25"> · </span>}
              {showPastas && <span>{activePasta}</span>}
              <span className="text-white/25"> · </span>
              {isVideo ? 'Vídeo' : 'Imagem'}
            </p>
          </div>
        </div>

        <div className={compact ? 'min-h-[96px]' : THUMB_ROW}>
          {count > 1 ? (
            <motion.div
              key={activePasta}
              variants={lightMotion ? undefined : drawStaggerThumbs}
              initial={lightMotion ? false : 'initial'}
              animate={lightMotion ? false : 'animate'}
            >
              <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-white/35">
                Todas nesta pasta
              </p>
              <div ref={stripRef} className={`flex gap-2 overflow-x-auto pb-1 ${THUMB_ROW}`}>
                {filteredItems.map((item, i) => {
                  const thumb = (
                    <ThumbButton
                      item={item}
                      index={i}
                      active={i === activeIndex}
                      onSelect={() => setActiveIndex(i)}
                      lightMotion={lightMotion}
                    />
                  )
                  if (lightMotion) {
                    return <span key={`${item.mediaUrl}-${i}`} className="contents">{thumb}</span>
                  }
                  return (
                    <motion.div key={`${item.mediaUrl}-${i}`} variants={drawItem}>
                      {thumb}
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ) : (
            <div className={compact ? 'h-[96px]' : THUMB_ROW} aria-hidden />
          )}
        </div>
      </div>
    </div>
  )
}
