import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, MessageCircle, Phone, Globe, Send } from 'lucide-react'

const CHANNELS = [
  {
    icon: Mail,
    label: 'E-mail principal',
    value: 'contato@raulxd.eu',
    href: 'mailto:contato@raulxd.eu',
    glow: 'group-hover:shadow-[0_0_16px_rgba(0,255,157,0.4)]',
    iconColor: 'text-neon-green',
  },
  {
    icon: Mail,
    label: 'E-mail alternativo',
    value: 'raulmacaluz@live.com',
    href: 'mailto:raulmacaluz@live.com',
    glow: 'group-hover:shadow-[0_0_16px_rgba(14,165,233,0.4)]',
    iconColor: 'text-neon-cyan',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '(82) 99355-4322',
    href: 'https://wa.me/5582993554322',
    glow: 'group-hover:shadow-[0_0_16px_rgba(0,255,157,0.4)]',
    iconColor: 'text-neon-green',
  },
  {
    icon: Phone,
    label: 'Telefone',
    value: '(82) 99355-4322',
    href: 'tel:+5582993554322',
    glow: 'group-hover:shadow-[0_0_16px_rgba(245,158,11,0.4)]',
    iconColor: 'text-neon-amber',
  },
  {
    icon: Globe,
    label: 'Site',
    value: 'raulxd.eu',
    href: 'https://www.raulxd.eu',
    glow: 'group-hover:shadow-[0_0_16px_rgba(139,92,246,0.4)]',
    iconColor: 'text-neon-violet',
  },
]

const LANGUAGES = [
  { lang: 'Português', level: 'Nativo' },
  { lang: 'Inglês', level: 'Avançado' },
]

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neon-green/[0.03] to-transparent" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <span className="section-label">Contato</span>
        <h2 className="section-heading">
          Vamos <span className="text-neon">criar juntos</span>
        </h2>
        <p className="mt-4 max-w-xl text-white/50">
          Tem um projeto em mente? Entre em contato — respondo o mais rápido possível.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHANNELS.map((channel, i) => (
            <motion.a
              key={channel.label}
              href={channel.href}
              target={channel.href.startsWith('http') ? '_blank' : undefined}
              rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass-hover group flex items-start gap-4 rounded-2xl p-5"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-bg-700/80 transition-shadow ${channel.glow}`}
              >
                <channel.icon size={20} className={channel.iconColor} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-white/40">{channel.label}</p>
                <p className="mt-0.5 truncate text-sm font-medium text-white group-hover:text-neon-green transition-colors">
                  {channel.value}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <motion.a
            href="https://wa.me/5582993554322"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03, boxShadow: '0 0 32px rgba(0,255,157,0.35)' }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-xl bg-neon-green px-6 py-3.5 text-sm font-semibold text-bg-950"
          >
            <MessageCircle size={18} />
            WhatsApp
          </motion.a>
          <motion.a
            href="mailto:contato@raulxd.eu"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="glass-hover flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium text-white"
          >
            <Send size={18} />
            Enviar E-mail
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.65 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          {LANGUAGES.map((l) => (
            <span
              key={l.lang}
              className="rounded-full border border-white/10 bg-bg-800/60 px-4 py-2 text-sm text-white/60"
            >
              <span className="font-medium text-white">{l.lang}</span>
              <span className="mx-2 text-white/20">·</span>
              {l.level}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <footer className="mt-20 border-t border-white/5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src="/favicon-mxd.png" alt="Raul Luz" className="h-8 w-8 rounded-full object-cover opacity-90" />
            <p className="text-sm text-white/40">
              © 2026 Raul Luz — Designer Gráfico & Motion Designer
            </p>
          </div>
          <a
            href="https://www.raulxd.eu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-neon-green/70 transition-colors hover:text-neon-green"
          >
            raulxd.eu
          </a>
        </div>
      </footer>
    </section>
  )
}
