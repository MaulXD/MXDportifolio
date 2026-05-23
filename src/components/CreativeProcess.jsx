import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Lightbulb, Layers, Briefcase, Sparkles } from 'lucide-react'
import { useLightMotion } from '../hooks/useLightMotion'

const DOT_COLORS = {
  'neon-green': '#00FF9D',
  'neon-cyan': '#0EA5E9',
  'neon-violet': '#8B5CF6',
  'neon-amber': '#F59E0B',
}

/** Resumo curto por card — sem listas longas para leitura rápida no mobile */
const PILLARS = [
  {
    id: 'processo',
    icon: Lightbulb,
    title: 'Processo',
    summary: 'Briefing → conceito → produção → revisão e entrega.',
    dotColor: DOT_COLORS['neon-green'],
    iconClass: 'text-neon-green',
    hoverBorder: 'hover:shadow-[inset_0_0_0_1px_rgba(0,255,157,0.4)]',
    bg: 'from-neon-green/10',
  },
  {
    id: 'areas',
    icon: Layers,
    title: 'Áreas',
    summary: 'Branding, motion, web e stream — peça avulsa ou pacote completo.',
    dotColor: DOT_COLORS['neon-cyan'],
    iconClass: 'text-neon-cyan',
    hoverBorder: 'hover:shadow-[inset_0_0_0_1px_rgba(14,165,233,0.4)]',
    bg: 'from-neon-cyan/10',
  },
  {
    id: 'experiencia',
    icon: Briefcase,
    title: 'Experiência',
    summary:
      '9+ anos em design (desde 2017) · front-end VF 2019–20 · gestão desde 2021 · IDHES hoje.',
    dotColor: DOT_COLORS['neon-violet'],
    iconClass: 'text-neon-violet',
    hoverBorder: 'hover:shadow-[inset_0_0_0_1px_rgba(139,92,246,0.4)]',
    bg: 'from-neon-violet/10',
  },
  {
    id: 'projetos',
    icon: Sparkles,
    title: 'Projetos',
    summary: 'Do thumb à página inteira — peças com personalidade e consistência de marca.',
    dotColor: DOT_COLORS['neon-amber'],
    iconClass: 'text-neon-amber',
    hoverBorder: 'hover:shadow-[inset_0_0_0_1px_rgba(245,158,11,0.4)]',
    bg: 'from-neon-amber/10',
  },
]

const HOVER_IN =
  'hover:-translate-y-1.5 hover:[transition:transform_0.2s_ease-out,box-shadow_0.2s_ease-out,opacity_0.2s_ease-out]'
const HOVER_OUT = '[transition:transform_0s,box-shadow_0s,opacity_0s]'

export default function CreativeProcess() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const lightMotion = useLightMotion()

  return (
    <section id="como-trabalho" className="section-padding relative border-t border-white/5">
      <motion.div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neon-green/[0.02] via-transparent to-transparent" aria-hidden />

      <motion.div
        ref={ref}
        initial={lightMotion ? false : { opacity: 0, y: 28 }}
        animate={lightMotion ? { opacity: 1, y: 0 } : inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-2xl px-4 sm:max-w-3xl sm:px-6"
      >
        <span className="section-label">Como trabalho</span>
        <h2 className="section-heading">
          No <span className="text-neon">detalhe</span>
        </h2>

        <motion.div className="mt-6 flex flex-col gap-2.5 sm:gap-3 lg:mt-4">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon

            return (
              <motion.article
                key={pillar.id}
                initial={lightMotion ? false : { opacity: 0, y: 12 }}
                animate={
                  lightMotion ? { opacity: 1, y: 0 } : inView ? { opacity: 1, y: 0 } : {}
                }
                transition={{
                  duration: lightMotion ? 0.2 : 0.45,
                  delay: lightMotion ? 0 : 0.08 + i * 0.06,
                }}
                className={`group relative overflow-hidden rounded-lg border border-white/5 bg-bg-800/50 p-3.5 sm:p-4 ${HOVER_OUT} ${HOVER_IN} ${pillar.hoverBorder}`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${pillar.bg} to-transparent opacity-0 group-hover:opacity-100 ${HOVER_OUT} group-hover:[transition:opacity_0.2s_ease-out]`}
                />

                <div className="relative z-10 flex items-start gap-3">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-bg-700/80 ${pillar.iconClass}`}
                  >
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-sm font-bold text-white sm:text-base">
                      {pillar.title}
                    </h3>
                    <p className="mt-0.5 text-[11px] leading-snug text-white/50 sm:text-xs">
                      {pillar.summary}
                    </p>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </motion.div>
    </section>
  )
}
