import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Clapperboard,
  PenTool,
  Image as ImageIcon,
  Radio,
  Globe,
  Layout,
  LayoutGrid,
  Loader2,
} from 'lucide-react'
import { PortfolioCardMedia } from './GalleryMedia'
import ProjectModal from './ProjectModal'
import { usePortfolioProjects } from '../lib/usePortfolioProjects'
import { useLightMotion } from '../hooks/useLightMotion'
import {
  CATEGORIES,
  accentMap,
  filterProjectsForView,
  getCategoryMeta,
  getGallerySummary,
} from '../lib/portfolioUtils'

const CATEGORY_ICONS = {
  Clapperboard,
  PenTool,
  Image: ImageIcon,
  Radio,
  Globe,
  Layout,
}

function getFilterIcon(cat) {
  if (cat === 'Todos') return LayoutGrid
  const { iconName } = getCategoryMeta(cat)
  return CATEGORY_ICONS[iconName] ?? Clapperboard
}

export default function Portfolio() {
  const [filter, setFilter] = useState('Todos')
  const [selectedProject, setSelectedProject] = useState(null)
  const { projects, loading, error } = usePortfolioProjects()
  const lightMotion = useLightMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const filtered = filterProjectsForView(projects, filter)

  const openProject = (project) => {
    setSelectedProject(project)
  }

  const closeProject = () => {
    setSelectedProject(null)
  }

  return (
    <section id="portfolio" className="relative py-24 sm:py-32">
      <div
        ref={ref}
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
        style={
          lightMotion
            ? undefined
            : { opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(28px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }
        }
      >
        <span className="section-label">Portfólio</span>
        <h2 className="section-heading">
          Projetos <span className="text-neon">selecionados</span>
        </h2>

        <div className="mt-8 flex flex-wrap gap-2 sm:gap-2.5">
          {CATEGORIES.map((cat) => {
            const isActive = filter === cat
            const Icon = getFilterIcon(cat)
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`relative inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors sm:gap-2 sm:px-4 sm:text-sm ${
                  lightMotion && isActive
                    ? 'border border-neon-green/30 bg-neon-green/10 text-neon-green'
                    : isActive
                      ? 'text-neon-green'
                      : 'text-white/50 hover:text-white'
                }`}
              >
                {!lightMotion && isActive && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-xl border border-neon-green/30 bg-neon-green/10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 inline-flex items-center gap-1.5 sm:gap-2 ${
                    isActive ? 'text-neon-green' : ''
                  }`}
                >
                  <Icon
                    size={15}
                    className={`shrink-0 sm:h-4 sm:w-4 ${isActive ? 'text-neon-green' : 'opacity-80'}`}
                    aria-hidden
                  />
                  {cat}
                </span>
              </button>
            )
          })}
        </div>

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

        {!loading && filtered.length > 0 && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => {
              if (!project) return null

              const meta = getCategoryMeta(project.category)
              const styles = accentMap[meta.accent] ?? accentMap['neon-violet']
              const Icon = CATEGORY_ICONS[meta.iconName] ?? Clapperboard
              const { valid, label } = getGallerySummary(project.galeria)

              return (
                <article
                  key={project._id}
                  className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-bg-800/60 transition-all duration-300 ${styles.border} ${lightMotion ? '' : styles.glow} ${lightMotion ? 'active:scale-[0.98]' : 'hover:-translate-y-1.5'}`}
                >
                  <button
                    type="button"
                    onClick={() => openProject(project)}
                    className="block w-full text-left"
                    aria-label={`Abrir projeto ${project.title}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-bg-900/60">
                      <PortfolioCardMedia
                        project={project}
                        title={project.title}
                        accent={styles}
                      />

                      <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,rgba(0,255,157,0.08)_0%,transparent_70%)] opacity-0 transition-opacity duration-300 group-active:opacity-100 sm:group-hover:opacity-100" />

                      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-bg-950/60 opacity-0 transition-opacity duration-200 group-active:opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                        <span className="rounded-xl bg-neon-green px-4 py-2 text-sm font-semibold text-bg-950">
                          Ver projeto
                        </span>
                      </div>
                    </div>

                    <div className="relative p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <Icon size={18} className={styles.icon} />
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles.badge}`}
                        >
                          {project.category ?? 'Outros'}
                        </span>
                      </div>
                      <h3 className="font-display text-base font-bold text-white">
                        {project.title ?? 'Projeto'}
                      </h3>
                      {label ? (
                        <p className="mt-2 text-xs text-white/40">
                          {valid.length > 1 ? `${valid.length} mídias · ${label}` : label}
                        </p>
                      ) : null}
                      <div
                        className={`absolute bottom-0 left-0 h-0.5 w-0 ${styles.line} transition-all duration-500 group-hover:w-full group-active:w-full`}
                      />
                    </div>
                  </button>
                </article>
              )
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            key={selectedProject._id}
            project={selectedProject}
            onClose={closeProject}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
