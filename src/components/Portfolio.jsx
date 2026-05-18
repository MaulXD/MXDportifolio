import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Clapperboard,
  Film,
  PenTool,
  Image as ImageIcon,
  Radio,
  Globe,
  Layers,
  HelpCircle,
  Loader2,
} from 'lucide-react'
import GalleryMedia from './GalleryMedia'
import { usePortfolioProjects } from '../lib/usePortfolioProjects'
import {
  CATEGORIES,
  accentMap,
  getCategoryMeta,
  getGallerySummary,
  getProjectPath,
} from '../lib/portfolioUtils'

const CATEGORY_ICONS = {
  Clapperboard,
  Film,
  PenTool,
  Image: ImageIcon,
  Radio,
  Globe,
  Layers,
  HelpCircle,
}

export default function Portfolio() {
  const [filter, setFilter] = useState('Todos')
  const { projects, loading, error } = usePortfolioProjects()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const filtered =
    filter === 'Todos' ? projects : projects.filter((p) => p?.category === filter)

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

        <motion.div className="mt-8 flex flex-wrap gap-2 sm:gap-2.5">
          {CATEGORIES.map((cat) => {
            const isActive = filter === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className="relative rounded-xl px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm"
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

                const meta = getCategoryMeta(project.category)
                const styles = accentMap[meta.accent] ?? accentMap['neon-violet']
                const Icon = CATEGORY_ICONS[meta.iconName] ?? Clapperboard
                const projectPath = getProjectPath(project)
                const { valid, label } = getGallerySummary(project.galeria)

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
                    <Link to={projectPath} className="block">
                      <div className="relative aspect-[4/3] overflow-hidden bg-bg-700/50">
                        <GalleryMedia
                          galeria={project.galeria}
                          title={project.title}
                          accent={styles}
                        />

                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,157,0.08)_0%,transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        <motion.div className="absolute inset-0 flex items-center justify-center bg-bg-950/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                          <span className="rounded-xl bg-neon-green px-4 py-2 text-sm font-semibold text-bg-950">
                            Ver projeto
                          </span>
                        </motion.div>
                      </div>

                      <div className="relative p-5">
                        <div className="mb-3 flex items-center justify-between">
                          <Icon size={18} className={styles.icon} />
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles.badge}`}
                          >
                            {project.category ?? '—'}
                          </span>
                        </div>
                        <h3 className="font-display text-base font-bold text-white">
                          {project.title ?? 'Projeto'}
                        </h3>
                        <p className="mt-2 text-xs text-white/40">
                          {valid.length > 1 ? `${valid.length} mídias · ${label}` : label}
                        </p>
                        <div
                          className={`absolute bottom-0 left-0 h-0.5 w-0 ${styles.line} transition-all duration-500 group-hover:w-full`}
                        />
                      </div>
                    </Link>
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
