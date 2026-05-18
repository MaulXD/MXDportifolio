import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ExternalLink, Play, PenLine, Image, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { sanityClient, PORTFOLIO_QUERY, isSanityConfigured } from '../lib/sanityClient'

const CATEGORIES = ['Todos', 'Motion', 'Branding', 'Ilustração']

const CATEGORY_META = {
  Motion: { icon: Play, accent: 'neon-violet' },
  Branding: { icon: PenLine, accent: 'neon-pink' },
  Ilustração: { icon: Image, accent: 'neon-cyan' },
}

const accentMap = {
  'neon-violet': {
    border: 'group-hover:border-neon-violet/30',
    glow: 'group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]',
    line: 'bg-neon-violet',
    icon: 'text-neon-violet',
    badge: 'bg-neon-violet/10 text-neon-violet border-neon-violet/20',
    dot: 'bg-neon-violet',
  },
  'neon-pink': {
    border: 'group-hover:border-neon-pink/30',
    glow: 'group-hover:shadow-[0_0_40px_rgba(255,0,102,0.15)]',
    line: 'bg-neon-pink',
    icon: 'text-neon-pink',
    badge: 'bg-neon-pink/10 text-neon-pink border-neon-pink/20',
    dot: 'bg-neon-pink',
  },
  'neon-cyan': {
    border: 'group-hover:border-neon-cyan/30',
    glow: 'group-hover:shadow-[0_0_40px_rgba(14,165,233,0.15)]',
    line: 'bg-neon-cyan',
    icon: 'text-neon-cyan',
    badge: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20',
    dot: 'bg-neon-cyan',
  },
}

function getCategoryMeta(category) {
  return CATEGORY_META[category] ?? CATEGORY_META.Motion
}

/** Normaliza galeria nova + fallback do campo legado mediaFile/mediaType */
function normalizeProject(raw) {
  if (!raw || typeof raw !== 'object') return null

  const fromGaleria = (Array.isArray(raw.galeria) ? raw.galeria : [])
    .filter((item) => item && typeof item.mediaUrl === 'string' && item.mediaUrl.length > 0)
    .map((item) => ({
      tipoMedia: item?.tipoMedia === 'Vídeo' ? 'Vídeo' : 'Imagem',
      mediaUrl: item.mediaUrl,
    }))

  let galeria = fromGaleria

  if (galeria.length === 0 && raw.legacyMediaUrl) {
    galeria = [
      {
        tipoMedia: raw.mediaType === 'Vídeo' ? 'Vídeo' : 'Imagem',
        mediaUrl: raw.legacyMediaUrl,
      },
    ]
  }

  return {
    _id: raw._id ?? raw.slug ?? `project-${Math.random().toString(36).slice(2)}`,
    title: raw.title ?? 'Projeto sem título',
    slug: raw.slug ?? null,
    category: raw.category ?? 'Motion',
    externalLink: raw.externalLink ?? null,
    galeria,
  }
}

function getGallerySummary(galeria) {
  const list = Array.isArray(galeria) ? galeria : []
  const valid = list.filter((item) => item?.mediaUrl)
  const videos = valid.filter((item) => item?.tipoMedia === 'Vídeo').length
  const images = valid.filter((item) => item?.tipoMedia === 'Imagem').length
  const parts = []
  if (videos) parts.push(`${videos} vídeo${videos > 1 ? 's' : ''}`)
  if (images) parts.push(`${images} imagem${images > 1 ? 'ns' : ''}`)
  return { valid, label: parts.length ? parts.join(' · ') : 'Sem mídia' }
}

function GalleryMedia({ galeria, title, accent }) {
  const { valid } = getGallerySummary(galeria)
  const [index, setIndex] = useState(0)
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
      <div className="flex h-full items-center justify-center">
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

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${current.mediaUrl}-${index}`}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {isVideo ? (
            <video
              src={current.mediaUrl}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={current.mediaUrl}
              alt={title ?? 'Projeto'}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {hasMultiple && (
        <>
          <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-bg-950/80 to-transparent px-3 pb-3 pt-8">
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
                    i === index ? `w-5 ${accent?.dot ?? 'bg-neon-green'}` : 'w-1.5 bg-white/35 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goTo(-1)
            }}
            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg border border-white/10 bg-bg-950/80 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100"
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
            className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg border border-white/10 bg-bg-950/80 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100"
            aria-label="Próxima mídia"
          >
            <ChevronRight size={16} />
          </button>

          <span className="absolute right-2 top-2 z-10 rounded-full border border-white/10 bg-bg-950/80 px-2 py-0.5 text-[10px] font-medium text-white/70 backdrop-blur-md">
            {index + 1}/{valid.length}
          </span>
        </>
      )}
    </>
  )
}

export default function Portfolio() {
  const [filter, setFilter] = useState('Todos')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    let cancelled = false

    async function fetchProjects() {
      try {
        setLoading(true)
        setError(null)

        if (!isSanityConfigured || !sanityClient) {
          if (!cancelled) {
            setProjects([])
            setError(
              'Sanity não configurado. Defina VITE_SANITY_PROJECT_ID e VITE_SANITY_DATASET no arquivo .env',
            )
          }
          return
        }

        const data = await sanityClient.fetch(PORTFOLIO_QUERY)
        const normalized = (Array.isArray(data) ? data : [])
          .map((item) => normalizeProject(item))
          .filter(Boolean)

        if (!cancelled) setProjects(normalized)
      } catch (err) {
        console.error('[Portfolio] Erro ao buscar projetos no Sanity:', err)
        if (!cancelled) {
          setError(
            'Não foi possível carregar os projetos. Verifique CORS no Sanity e se o schema está publicado.',
          )
          setProjects([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProjects()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered =
    filter === 'Todos'
      ? projects
      : projects.filter((p) => p?.category === filter)

  return (
    <section id="portfolio" className="relative py-24 sm:py-32">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <span className="section-label">Portfólio</span>
        <h2 className="section-heading">
          Projetos <span className="text-neon">selecionados</span>
        </h2>

        <motion.div className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = filter === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className="relative rounded-xl px-4 py-2 text-sm font-medium transition-colors"
              >
                {isActive && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-xl border border-neon-green/30 bg-neon-green/10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 ${isActive ? 'text-neon-green' : 'text-white/50 hover:text-white'}`}
                >
                  {cat}
                </span>
              </button>
            )
          })}
        </motion.div>

        {loading && (
          <div className="mt-16 flex flex-col items-center justify-center gap-3 text-white/50">
            <Loader2 size={28} className="animate-spin text-neon-green" />
            <p className="text-sm">Carregando projetos…</p>
          </div>
        )}

        {error && !loading && (
          <p className="mt-10 rounded-xl border border-neon-pink/20 bg-neon-pink/5 px-4 py-3 text-center text-sm text-neon-pink/90">
            {error}
          </p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="mt-10 text-center text-sm text-white/40">
            Nenhum projeto nesta categoria. Publique conteúdo no painel do Sanity.
          </p>
        )}

        {!loading && filtered.length > 0 && (
          <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => {
                if (!project) return null

                const meta = getCategoryMeta(project?.category)
                const styles = accentMap[meta.accent] ?? accentMap['neon-violet']
                const Icon = meta.icon
                const projectLink = project?.externalLink
                const { valid, label } = getGallerySummary(project?.galeria)

                return (
                  <motion.article
                    key={project._id}
                    layout
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -7 }}
                    className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-bg-800/60 transition-all duration-300 ${styles.border} ${styles.glow}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-bg-700/50">
                      <GalleryMedia
                        galeria={project?.galeria}
                        title={project?.title}
                        accent={styles}
                      />

                      <motion.div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,157,0.08)_0%,transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      {projectLink && (
                        <motion.div className="absolute inset-0 flex items-center justify-center bg-bg-950/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                          <a
                            href={projectLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pointer-events-auto flex items-center gap-2 rounded-xl bg-neon-green px-4 py-2 text-sm font-semibold text-bg-950"
                          >
                            Ver projeto <ExternalLink size={14} />
                          </a>
                        </motion.div>
                      )}
                    </div>

                    <div className="relative p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <Icon size={18} className={styles.icon} />
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles.badge}`}
                        >
                          {project?.category ?? '—'}
                        </span>
                      </div>
                      <h3 className="font-display text-base font-bold text-white">
                        {project?.title ?? 'Projeto'}
                      </h3>
                      <p className="mt-2 text-xs text-white/40">
                        {valid.length > 1 ? `${valid.length} mídias · ${label}` : label}
                      </p>
                      <motion.div
                        className={`absolute bottom-0 left-0 h-0.5 w-0 ${styles.line} transition-all duration-500 group-hover:w-full`}
                      />
                    </div>
                  </motion.article>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </motion.div>
    </section>
  )
}
