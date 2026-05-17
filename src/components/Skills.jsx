import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { PenTool, Clapperboard, Globe, Box } from 'lucide-react'

const CATEGORIES = [
  {
    icon: PenTool,
    title: 'Design & Branding',
    iconClass: 'text-neon-pink',
    gradient: 'from-neon-pink/20 to-transparent',
    border: 'group-hover:shadow-[inset_0_0_0_1px_rgba(255,0,102,0.4)]',
    dot: 'bg-neon-pink',
    items: ['Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign', 'CorelDRAW'],
  },
  {
    icon: Clapperboard,
    title: 'Audiovisual & Motion',
    iconClass: 'text-neon-violet',
    gradient: 'from-neon-violet/20 to-transparent',
    border: 'group-hover:shadow-[inset_0_0_0_1px_rgba(139,92,246,0.4)]',
    dot: 'bg-neon-violet',
    items: ['After Effects', 'Adobe Premiere'],
  },
  {
    icon: Globe,
    title: 'Web / Front-End',
    iconClass: 'text-neon-green',
    gradient: 'from-neon-green/20 to-transparent',
    border: 'group-hover:shadow-[inset_0_0_0_1px_rgba(0,255,157,0.4)]',
    dot: 'bg-neon-green',
    items: ['HTML', 'CSS', 'JavaScript', 'React'],
  },
  {
    icon: Box,
    title: '3D / Tech',
    iconClass: 'text-neon-amber',
    gradient: 'from-neon-amber/20 to-transparent',
    border: 'group-hover:shadow-[inset_0_0_0_1px_rgba(245,158,11,0.4)]',
    dot: 'bg-neon-amber',
    items: ['Blender', 'QA Automático'],
  },
]

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
}

export default function Skills() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-neon-green/[0.02] to-transparent" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <span className="section-label">Habilidades</span>
        <h2 className="section-heading">
          Ferramentas & <span className="text-neon">expertise</span>
        </h2>
        <p className="mt-4 max-w-xl text-white/50">
          Domínio técnico em quatro frentes criativas — do branding ao código.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.title}
              custom={i}
              variants={CARD_VARIANTS}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              whileHover={{ y: -6 }}
              className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-bg-800/50 p-6 transition-all duration-300 ${cat.border}`}
            >
              <motion.div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />

              <motion.div className="relative z-10">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-bg-700/80`}
                  >
                    <cat.icon size={20} className={cat.iconClass} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">{cat.title}</h3>
                </div>

                <ul className="grid grid-cols-2 gap-2">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-white/60">
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${cat.dot}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
