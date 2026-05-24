import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Sparkles } from 'lucide-react'
import { drawItem, drawStagger } from '../lib/drawMotion'
import { useLightMotion } from '../hooks/useLightMotion'

const HERO_STAGGER = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.28 } },
}

const ORBS = [
  { color: 'bg-neon-green', size: 'w-72 h-72', pos: 'top-1/4 -left-32', delay: 0 },
  { color: 'bg-neon-cyan', size: 'w-96 h-96', pos: 'top-1/3 right-0', delay: 2 },
  { color: 'bg-neon-violet', size: 'w-64 h-64', pos: 'bottom-1/4 left-1/3', delay: 4 },
]

export default function Hero() {
  const [logoError, setLogoError] = useState(false)
  const lightMotion = useLightMotion()
  const heroStagger = lightMotion ? {} : HERO_STAGGER
  const heroItem = lightMotion
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45 },
      }
    : { variants: drawItem }

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20"
    >
      <motion.div
        className="bg-grid pointer-events-none absolute inset-0 opacity-60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.2 }}
      />

      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className={`pointer-events-none absolute rounded-full ${orb.size} ${orb.color} ${orb.pos} blur-[120px]`}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <motion.div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <motion.div
          {...heroStagger}
          initial={lightMotion ? false : 'initial'}
          animate={lightMotion ? false : 'animate'}
          className="text-center"
        >
          <motion.div {...heroItem} className="mb-6 flex justify-center">
            {!logoError ? (
              <img
                src="/mxd-logo.png"
                alt="Logo Raul Luz"
                className="h-36 w-36 rounded-full object-cover drop-shadow-[0_0_28px_rgba(0,255,157,0.4)] sm:h-44 sm:w-44"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="flex h-36 w-36 items-center justify-center rounded-3xl border border-neon-green/30 bg-bg-800 font-display text-4xl font-bold text-neon-green sm:h-44 sm:w-44">
                RL
              </div>
            )}
          </motion.div>

          <motion.div {...heroItem} className="mb-4 flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-neon-green" />
            <span className="section-label">Disponível para projetos</span>
            <Sparkles size={16} className="text-neon-green" />
          </motion.div>

          <motion.h1
            {...heroItem}
            className="font-hero text-3xl font-normal uppercase leading-[1.15] tracking-wide sm:text-5xl lg:text-6xl"
          >
            Raul <span className="text-neon">Luz</span>
          </motion.h1>

          <motion.p
            {...heroItem}
            className="mx-auto mt-4 max-w-2xl text-lg text-white/60 sm:text-xl"
          >
            Designer Gráfico · Motion Designer · Front-End Developer
          </motion.p>

          <motion.p
            {...heroItem}
            className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/45 sm:text-base"
          >
            Crio experiências visuais que unem design, movimento e código, da identidade de marca
            ao pixel perfeito na tela.
          </motion.p>

          <motion.div {...heroItem} className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <motion.a
              href="#portfolio"
              whileHover={{ scale: 1.04, boxShadow: '0 0 32px rgba(0,255,157,0.35)' }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="rounded-xl bg-neon-green px-8 py-3.5 text-sm font-semibold text-bg-950 transition-shadow"
            >
              Ver Portfólio
            </motion.a>
            <motion.a
              href="#orcamento"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#orcamento')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="glass-hover rounded-xl px-8 py-3.5 text-sm font-medium text-white"
            >
              Faça um orçamento
            </motion.a>
          </motion.div>

          <motion.div
            {...heroItem}
            className="mt-12 flex flex-wrap justify-center gap-3 text-xs text-white/40"
          >
            {['Motion Design', 'Branding', 'React', 'After Effects'].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-bg-800/50 px-3 py-1.5 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={(e) => {
          e.preventDefault()
          document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 transition-colors hover:text-neon-green"
        aria-label="Rolar para baixo"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ArrowDown size={24} />
        </motion.div>
      </motion.a>
    </section>
  )
}

