import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Sparkles } from 'lucide-react'

const CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.35 } },
}

const ITEM = {
  hidden: { opacity: 0, y: 32, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
}

const ORBS = [
  { color: 'bg-neon-green', size: 'w-72 h-72', pos: 'top-1/4 -left-32', delay: 0 },
  { color: 'bg-neon-cyan', size: 'w-96 h-96', pos: 'top-1/3 right-0', delay: 2 },
  { color: 'bg-neon-violet', size: 'w-64 h-64', pos: 'bottom-1/4 left-1/3', delay: 4 },
]

export default function Hero() {
  const [logoError, setLogoError] = useState(false)

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24"
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

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div variants={CONTAINER} initial="hidden" animate="show" className="text-center">
          <motion.div variants={ITEM} className="mb-8 flex justify-center">
            {!logoError ? (
              <img
                src="/mxd-logo.png"
                alt="Logo Raul Luz"
                className="h-28 w-28 rounded-full object-cover drop-shadow-[0_0_24px_rgba(0,255,157,0.35)] sm:h-32 sm:w-32"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-neon-green/30 bg-bg-800 font-display text-3xl font-bold text-neon-green sm:h-28 sm:w-28">
                RL
              </div>
            )}
          </motion.div>

          <motion.div variants={ITEM} className="mb-4 flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-neon-green" />
            <span className="section-label">Disponível para projetos</span>
            <Sparkles size={16} className="text-neon-green" />
          </motion.div>

          <motion.h1
            variants={ITEM}
            className="font-hero text-3xl font-normal uppercase leading-[1.15] tracking-wide sm:text-5xl lg:text-6xl"
          >
            Raul <span className="text-neon">Luz</span>
          </motion.h1>

          <motion.p
            variants={ITEM}
            className="mx-auto mt-4 max-w-2xl text-lg text-white/60 sm:text-xl"
          >
            Designer Gráfico · Motion Designer · Front-End Developer
          </motion.p>

          <motion.p
            variants={ITEM}
            className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/45 sm:text-base"
          >
            Crio experiências visuais que unem design, movimento e código — da identidade de marca
            ao pixel perfeito na tela.
          </motion.p>

          <motion.div variants={ITEM} className="mt-10 flex flex-wrap items-center justify-center gap-4">
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
              href="#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="glass-hover rounded-xl px-8 py-3.5 text-sm font-medium text-white"
            >
              Fale Comigo
            </motion.a>
          </motion.div>

          <motion.div
            variants={ITEM}
            className="mt-16 flex flex-wrap justify-center gap-3 text-xs text-white/40"
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
      </div>

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
