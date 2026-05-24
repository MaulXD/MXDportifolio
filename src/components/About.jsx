import { motion } from 'framer-motion'
import { Languages } from 'lucide-react'
import { useDrawInView } from '../hooks/useDrawInView'

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
  const { ref, stagger, item, block } = useDrawInView()

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <motion.div ref={ref} {...stagger} className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div {...item}>
          <span className="section-label">Sobre mim</span>
          <h2 className="section-heading">
            Onde <span className="text-neon">design</span> encontra movimento
          </h2>
        </motion.div>

        <motion.div {...block} className="mt-8">
          <p className="text-base leading-relaxed text-white/60 sm:text-lg">
            Sou o <strong className="text-white">Raul Luz</strong>, profissional multidisciplinar que
            atua na interseção entre <strong className="text-neon">design gráfico</strong>,{' '}
            <strong className="text-neon">motion design</strong> e{' '}
            <strong className="text-neon">desenvolvimento front-end</strong>.
          </p>
          <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
            Trabalho com design desde <strong className="text-white">2017</strong> — mais de nove
            anos em identidades visuais, motion e peças para redes — e com front-end na VF
            Datamining (2019–2020). Transformo ideias em experiências visuais memoráveis, do
            conceito ao código final.
          </p>
          <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
            Atualmente atuo como Designer Gráfico no IDHES e Supervisor Administrativo na Sarmento
            Camargo & Sarmento, unindo criatividade e organização em cada projeto.
          </p>

          <motion.div {...stagger} className="mt-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-white/40">
              Soft skills
            </p>
            <div className="flex flex-wrap gap-2">
              {SOFT_SKILLS.map((skill) => (
                <motion.span
                  key={skill}
                  {...item}
                  className="rounded-full border border-neon-green/25 bg-neon-green/5 px-3 py-1.5 text-xs font-medium text-neon-green/90"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div {...stagger} className="mt-8">
            <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-white/40">
              <Languages size={14} className="text-neon-cyan" />
              Idiomas
            </p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((langItem) => (
                <motion.span
                  key={langItem.lang}
                  {...item}
                  className="rounded-full border border-neon-cyan/25 bg-neon-cyan/5 px-3 py-1.5 text-xs font-medium text-neon-cyan/90"
                >
                  <span className="text-white">{langItem.lang}</span>
                  <span className="mx-1.5 text-white/25">·</span>
                  {langItem.level}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
