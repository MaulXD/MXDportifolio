import { motion } from 'framer-motion'
import { PenTool, Clapperboard, Globe, Box } from 'lucide-react'
import DrawnBorder from './DrawnBorder'
import { useDrawInView } from '../hooks/useDrawInView'

const CATEGORIES = [
  {
    icon: PenTool,
    title: 'Design & Branding',
    iconClass: 'text-neon-pink',
    gradient: 'from-neon-pink/20 to-transparent',
    border: 'hover:shadow-[inset_0_0_0_1px_rgba(255,0,102,0.4)]',
    stroke: 'rgba(255,0,102,0.4)',
    dot: 'bg-neon-pink',
    items: ['Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign', 'CorelDRAW'],
  },
  {
    icon: Clapperboard,
    title: 'Audiovisual & Motion',
    iconClass: 'text-neon-violet',
    gradient: 'from-neon-violet/20 to-transparent',
    border: 'hover:shadow-[inset_0_0_0_1px_rgba(139,92,246,0.4)]',
    stroke: 'rgba(139,92,246,0.45)',
    dot: 'bg-neon-violet',
    items: ['After Effects', 'Adobe Premiere'],
  },
  {
    icon: Globe,
    title: 'Web / Front-End',
    iconClass: 'text-neon-green',
    gradient: 'from-neon-green/20 to-transparent',
    border: 'hover:shadow-[inset_0_0_0_1px_rgba(0,255,157,0.4)]',
    stroke: 'rgba(0,255,157,0.4)',
    dot: 'bg-neon-green',
    items: ['HTML', 'CSS', 'JavaScript', 'React'],
  },
  {
    icon: Box,
    title: '3D / Tech',
    iconClass: 'text-neon-amber',
    gradient: 'from-neon-amber/20 to-transparent',
    border: 'hover:shadow-[inset_0_0_0_1px_rgba(245,158,11,0.4)]',
    stroke: 'rgba(245,158,11,0.45)',
    dot: 'bg-neon-amber',
    items: ['Blender', 'QA Automático'],
  },
]

const HOVER_IN =
  'hover:-translate-y-1.5 hover:[transition:transform_0.2s_ease-out,box-shadow_0.2s_ease-out,opacity_0.2s_ease-out]'
const HOVER_OUT = '[transition:transform_0s,box-shadow_0s,opacity_0s]'

export default function Skills() {
  const { ref, stagger, item, block, lightMotion } = useDrawInView()

  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-neon-green/[0.02] to-transparent" />

      <motion.div ref={ref} {...stagger} className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...item}>
          <span className="section-label">Habilidades</span>
          <h2 className="section-heading">
            Ferramentas & <span className="text-neon">expertise</span>
          </h2>
          <p className="mt-4 max-w-xl text-white/50">
            Domínio técnico em quatro frentes criativas, do branding ao código.
          </p>
        </motion.div>

        <motion.div {...block} className="mt-12 grid gap-5 sm:grid-cols-2">
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.title}
              {...item}
              className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-bg-800/50 p-6 ${HOVER_OUT} ${HOVER_IN} ${cat.border}`}
            >
              {!lightMotion && <DrawnBorder stroke={cat.stroke} className="rounded-2xl opacity-80" />}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 ${HOVER_OUT} group-hover:[transition:opacity_0.2s_ease-out]`}
              />

              <div className="relative z-10">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-bg-700/80">
                    <cat.icon size={20} className={cat.iconClass} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">{cat.title}</h3>
                </div>
                <ul className="grid grid-cols-2 gap-2">
                  {cat.items.map((skillItem) => (
                    <li key={skillItem} className="flex items-center gap-2 text-sm text-white/60">
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${cat.dot}`} />
                      {skillItem}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
