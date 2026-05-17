import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ExternalLink, Play, PenLine, Image } from 'lucide-react'

const CATEGORIES = ['Todos', 'Motion', 'Branding', 'Ilustração']

const PROJECTS = [
  {
    id: 1,
    title: 'Streampacks',
    category: 'Motion',
    description: 'Overlays e pacotes visuais para transmissões ao vivo.',
    icon: Play,
    accent: 'neon-violet',
  },
  {
    id: 2,
    title: 'Edições de Vídeo / Motion',
    category: 'Motion',
    description: 'Composições dinâmicas e motion graphics para mídias digitais.',
    icon: Play,
    accent: 'neon-violet',
  },
  {
    id: 3,
    title: 'Logotipos & Identidade Visual',
    category: 'Branding',
    description: 'Marcas completas com manual de identidade e aplicações.',
    icon: PenLine,
    accent: 'neon-pink',
  },
  {
    id: 4,
    title: 'Flyers & Mockups',
    category: 'Branding',
    description: 'Peças gráficas promocionais e apresentações de produto.',
    icon: PenLine,
    accent: 'neon-pink',
  },
  {
    id: 5,
    title: 'Ilustrações Digitais',
    category: 'Ilustração',
    description: 'Arte digital autoral com estilo contemporâneo e vibrante.',
    icon: Image,
    accent: 'neon-cyan',
  },
]

const accentMap = {
  'neon-violet': {
    border: 'group-hover:border-neon-violet/30',
    glow: 'group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]',
    line: 'bg-neon-violet',
    icon: 'text-neon-violet',
    badge: 'bg-neon-violet/10 text-neon-violet border-neon-violet/20',
  },
  'neon-pink': {
    border: 'group-hover:border-neon-pink/30',
    glow: 'group-hover:shadow-[0_0_40px_rgba(255,0,102,0.15)]',
    line: 'bg-neon-pink',
    icon: 'text-neon-pink',
    badge: 'bg-neon-pink/10 text-neon-pink border-neon-pink/20',
  },
  'neon-cyan': {
    border: 'group-hover:border-neon-cyan/30',
    glow: 'group-hover:shadow-[0_0_40px_rgba(14,165,233,0.15)]',
    line: 'bg-neon-cyan',
    icon: 'text-neon-cyan',
    badge: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20',
  },
}

export default function Portfolio() {
  const [filter, setFilter] = useState('Todos')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const filtered =
    filter === 'Todos' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)

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

        <div className="mt-8 flex flex-wrap gap-2">
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
                <span className={`relative z-10 ${isActive ? 'text-neon-green' : 'text-white/50 hover:text-white'}`}>
                  {cat}
                </span>
              </button>
            )
          })}
        </div>

        <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => {
              const styles = accentMap[project.accent]
              return (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -7 }}
                  className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-bg-800/60 transition-all duration-300 ${styles.border} ${styles.glow}`}
                >
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-bg-700/50">
                    <img
                      src="/mxd-logo.png"
                      alt=""
                      className="h-16 w-16 rounded-full object-cover opacity-30 transition-opacity duration-300 group-hover:opacity-50"
                      aria-hidden
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,157,0.08)_0%,transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-bg-950/60 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    >
                      <a
                        href="https://www.raulxd.eu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-xl bg-neon-green px-4 py-2 text-sm font-semibold text-bg-950"
                      >
                        Ver projeto <ExternalLink size={14} />
                      </a>
                    </motion.div>
                  </div>

                  <div className="relative p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <project.icon size={18} className={styles.icon} />
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles.badge}`}>
                        {project.category}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-bold text-white">{project.title}</h3>
                    <p className="mt-2 text-sm text-white/45">{project.description}</p>
                    <motion.div className={`absolute bottom-0 left-0 h-0.5 w-0 ${styles.line} transition-all duration-500 group-hover:w-full`} />
                  </div>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <a
            href="https://www.raulxd.eu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-neon-green transition-colors hover:text-neon-cyan"
          >
            Ver portfólio completo em raulxd.eu
            <ExternalLink size={16} />
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
