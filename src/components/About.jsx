import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Languages } from 'lucide-react'

const SOFT_SKILLS = [
  'Criatividade',
  'Atenção ao detalhe',
  'Comunicação visual',
  'Gestão de tempo',
  'Trabalho em equipe',
  'Pensamento crítico',
]

const LANGUAGES = [
  { lang: 'Português', level: 'Nativo' },
  { lang: 'Inglês', level: 'Avançado, conversação e escrita' },
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
        className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
      >
        <span className="section-label">Sobre mim</span>
        <h2 className="section-heading">
          Onde <span className="text-neon">design</span> encontra movimento
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8"
        >
          <p className="text-base leading-relaxed text-white/60 sm:text-lg">
            Sou o <strong className="text-white">Raul Luz</strong>, profissional multidisciplinar que
            atua na interseção entre <strong className="text-neon">design gráfico</strong>,{' '}
            <strong className="text-neon">motion design</strong> e{' '}
            <strong className="text-neon">desenvolvimento front-end</strong>.
          </p>
          <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
            Trabalho com design desde <strong className="text-white">2017</strong>, com mais de nove
            anos em identidades visuais, motion e peças para redes, e com front-end na VF
            Datamining (2019 a 2020). Transformo ideias em experiências visuais memoráveis, do
            conceito ao código final.
          </p>
          <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
            Atualmente atuo como Designer Gráfico no IDHES e Supervisor Administrativo na Sarmento
            Camargo & Sarmento, unindo criatividade e organização em cada projeto.
          </p>

          <div className="mt-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-white/40">
              Soft skills
            </p>
            <div className="flex flex-wrap gap-2">
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
          </div>

          <div className="mt-8">
            <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-white/40">
              <Languages size={14} className="text-neon-cyan" />
              Idiomas
            </p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((item, i) => (
                <motion.span
                  key={item.lang}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.55 + i * 0.08 }}
                  className="rounded-full border border-neon-cyan/25 bg-neon-cyan/5 px-3 py-1.5 text-xs font-medium text-neon-cyan/90"
                >
                  <span className="text-white">{item.lang}</span>
                  <span className="mx-1.5 text-white/25">·</span>
                  {item.level}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
