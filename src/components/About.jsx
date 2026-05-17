import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Palette, Layers, Code2, Box } from 'lucide-react'

const STATS = [
  { icon: Palette, value: '5+', label: 'Anos de experiência', color: 'text-neon-green' },
  { icon: Layers, value: '4', label: 'Áreas de atuação', color: 'text-neon-cyan' },
  { icon: Code2, value: '10+', label: 'Ferramentas dominadas', color: 'text-neon-violet' },
  { icon: Box, value: '∞', label: 'Projetos criativos', color: 'text-neon-amber' },
]

const SOFT_SKILLS = [
  'Criatividade',
  'Atenção ao detalhe',
  'Comunicação visual',
  'Gestão de tempo',
  'Trabalho em equipe',
  'Pensamento crítico',
]

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <span className="section-label">Sobre mim</span>
        <h2 className="section-heading">
          Onde <span className="text-neon">design</span> encontra movimento
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16"
        >
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-base leading-relaxed text-white/60 sm:text-lg">
              Sou o <strong className="text-white">Raul Luz</strong>, profissional multidisciplinar
              que atua na interseção entre{' '}
              <strong className="text-neon-green">design gráfico</strong>,{' '}
              <strong className="text-neon-cyan">motion design</strong> e{' '}
              <strong className="text-neon-violet">desenvolvimento front-end</strong>.
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
              Com experiência em identidades visuais, edição audiovisual e interfaces web, transformo
              ideias em experiências visuais memoráveis — do conceito ao código final.
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
              Atualmente atuo como Designer Gráfico no IDHES e Supervisor Administrativo na Sarmento
              Camargo & Sarmento, unindo criatividade e organização em cada projeto.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {SOFT_SKILLS.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  className="rounded-full border border-neon-green/25 bg-neon-green/5 px-3 py-1.5 text-xs font-medium text-neon-green/90"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                whileHover={{ y: -4, borderColor: 'rgba(0,255,157,0.3)' }}
                className="glass-hover group rounded-2xl p-5 sm:p-6"
              >
                <stat.icon
                  size={22}
                  className={`mb-3 ${stat.color} transition-transform group-hover:scale-110`}
                />
                <p className="font-display text-3xl font-bold text-white sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-xs text-white/50 sm:text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
