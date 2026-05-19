import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Briefcase, GraduationCap } from 'lucide-react'

const EXPERIENCES = [
  {
    role: 'Designer Gráfico',
    company: 'IDHES, Instituto de Desenvolvimento de Habilidades Educacionais e Sociais',
    period: 'Set. 2025 até o presente',
    status: 'Atual',
    active: true,
  },
  {
    role: 'Supervisor Administrativo',
    company: 'Sarmento Camargo & Sarmento, Advocacia e Consultoria',
    period: 'Mar. 2021 até o presente',
    status: 'Atual',
    active: true,
  },
  {
    role: 'Programador Front-End',
    company: 'VF Datamining',
    period: 'Ago. 2019 a Dez. 2020',
    status: 'Concluído',
    active: false,
  },
  {
    role: 'Design gráfico & motion',
    company: 'Projetos autorais, freelances e clientes',
    period: 'Desde 2017',
    status: 'Base criativa',
    active: false,
    foundational: true,
  },
]

const COURSES = [
  { title: 'Marketing Pessoal', institution: 'Nube (Núcleo Brasileiro de Estágios LTDA)' },
  { title: 'Fundamentos de Gestão de TI', institution: 'FGV (Fundação Getúlio Vargas)' },
  { title: 'Introdução à Ciência de Dados', institution: 'FGV (Fundação Getúlio Vargas)' },
  { title: 'Software Testing: Context and Basics', institution: 'Udemy' },
  { title: 'End-to-End Tests com Cucumber & Selenium', institution: 'Udemy' },
]

export default function Experience() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="experience" className="relative py-24 sm:py-32">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <span className="section-label">Experiência</span>
        <h2 className="section-heading">
          Trajetória <span className="text-neon">profissional</span>
        </h2>
        <p className="mt-4 max-w-2xl text-white/50">
          Mais de <strong className="text-white/80">9 anos em design</strong> desde 2017, somando
          projetos autorais, freelances e atuação em empresas.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="relative mt-12"
        >
          <div className="absolute bottom-0 left-[11px] top-0 w-px overflow-hidden sm:left-[15px]">
            <motion.div
              className="h-full w-full origin-top bg-gradient-to-b from-neon-green via-neon-cyan to-transparent"
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              style={{ originY: 0 }}
            />
          </div>

          <div className="space-y-10">
            {EXPERIENCES.map((exp, i) => (
              <motion.div
                key={exp.role + exp.company}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
                className="relative flex gap-6 pl-10 sm:pl-12"
              >
                <div
                  className={`absolute left-0 top-1.5 h-[22px] w-[22px] rounded-full border-2 sm:h-[30px] sm:w-[30px] ${
                    exp.active
                      ? 'border-neon-green bg-bg-900 shadow-[0_0_12px_rgba(0,255,157,0.6)]'
                      : exp.foundational
                        ? 'border-neon-violet/50 bg-bg-900'
                        : 'border-neon-cyan/50 bg-bg-900'
                  } ${exp.active ? 'animate-pulse-neon' : ''}`}
                >
                  <div
                    className={`absolute inset-1 rounded-full ${
                      exp.active
                        ? 'bg-neon-green'
                        : exp.foundational
                          ? 'bg-neon-violet/60'
                          : 'bg-neon-cyan/60'
                    }`}
                  />
                </div>

                <div className="glass-hover flex-1 rounded-2xl p-5 sm:p-6">
                  <motion.div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <Briefcase size={18} className="mt-0.5 shrink-0 text-neon-cyan" />
                      <motion.div>
                        <h3 className="font-display text-lg font-bold text-white">{exp.role}</h3>
                        <p className="mt-1 text-sm text-neon-cyan/80">{exp.company}</p>
                      </motion.div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                        exp.active
                          ? 'border border-neon-green/30 bg-neon-green/10 text-neon-green'
                          : 'border border-white/10 bg-white/5 text-white/50'
                      }`}
                    >
                      {exp.status}
                    </span>
                  </motion.div>
                  <p className="mt-3 text-sm text-white/40">{exp.period}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <div className="mb-6 flex items-center gap-2">
            <GraduationCap size={20} className="text-neon-violet" />
            <h3 className="font-display text-xl font-bold text-white">Cursos & Formação</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {COURSES.map((course, i) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9 + i * 0.08 }}
                whileHover={{ x: 4 }}
                className="glass rounded-xl p-4 transition-colors hover:border-neon-violet/20"
              >
                <p className="text-sm font-medium text-white">{course.title}</p>
                <p className="mt-1 text-xs text-white/40">{course.institution}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
