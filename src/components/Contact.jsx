import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Check } from 'lucide-react'
import WhatsAppIcon from './icons/WhatsAppIcon'
import { useDrawInView } from '../hooks/useDrawInView'

const WHATSAPP_URL = 'https://wa.me/5582993554322'
const PHONE_ID = 'phone'
const PHONE_DISPLAY = '(82) 99355-4322'

const EMAIL_CHANNELS = [
  {
    id: 'email-main',
    label: 'E-mail principal',
    value: 'contato@raulxd.eu',
    glow: 'group-hover:shadow-[0_0_16px_rgba(0,255,157,0.4)]',
    iconColor: 'text-neon-green',
  },
  {
    id: 'email-alt',
    label: 'E-mail alternativo',
    value: 'raulmacaluz@live.com',
    glow: 'group-hover:shadow-[0_0_16px_rgba(14,165,233,0.4)]',
    iconColor: 'text-neon-cyan',
  },
]

export default function Contact() {
  const { ref, stagger, item, block } = useDrawInView()
  const [copiedId, setCopiedId] = useState(null)

  const copyText = useCallback(async (id, text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 2200)
    } catch {
      /* clipboard bloqueado */
    }
  }, [])

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neon-green/[0.03] to-transparent" aria-hidden />

      <motion.div ref={ref} {...stagger} className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...item}>
          <span className="section-label">Contato</span>
          <h2 className="section-heading">
            Vamos <span className="text-neon">criar juntos</span>
          </h2>
          <p className="mt-4 max-w-xl text-white/50">
            Tem um projeto em mente? Entre em contato. Respondo o mais rápido possível.
          </p>
        </motion.div>

        <motion.div {...block} className="mt-8 flex w-full max-w-[17.5rem] flex-col gap-2 sm:max-w-[18.5rem]">
          {EMAIL_CHANNELS.map((channel) => {
            const copied = copiedId === channel.id
            return (
              <motion.button
                key={channel.id}
                type="button"
                onClick={() => copyText(channel.id, channel.value)}
                {...item}
                whileHover={{ y: -4 }}
                className="glass-hover group flex w-full items-center gap-3 rounded-xl px-5 py-3.5 text-left sm:px-6"
                aria-label={`Copiar ${channel.label}: ${channel.value}`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-bg-700/80 transition-shadow ${channel.glow}`}
                >
                  {copied ? (
                    <Check size={20} className="text-neon-green" />
                  ) : (
                    <Mail size={20} className={channel.iconColor} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-white/40">{channel.label}</p>
                  <p className="mt-0.5 truncate text-sm font-medium text-white transition-colors group-hover:text-neon-green">
                    {channel.value}
                  </p>
                  {copied && (
                    <p className="mt-1.5 text-xs font-medium text-neon-green">E-mail copiado!</p>
                  )}
                </div>
              </motion.button>
            )
          })}

          <motion.div {...item} className="glass-hover group flex w-full items-center gap-2 rounded-xl px-5 py-3.5 sm:gap-3 sm:px-6">
            <button
              type="button"
              onClick={() => copyText(PHONE_ID, PHONE_DISPLAY)}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
              aria-label={`Copiar telefone ${PHONE_DISPLAY}`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-bg-700/80 transition-shadow group-hover:shadow-[0_0_16px_rgba(245,158,11,0.4)]">
                {copiedId === PHONE_ID ? (
                  <Check size={20} className="text-neon-green" />
                ) : (
                  <Phone size={18} className="text-neon-amber" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-white/40">Telefone / WhatsApp</p>
                <p className="mt-0.5 text-sm font-medium text-white transition-colors group-hover:text-neon-green">
                  {PHONE_DISPLAY}
                </p>
                {copiedId === PHONE_ID && (
                  <p className="mt-1.5 text-xs font-medium text-neon-green">Telefone copiado!</p>
                )}
              </div>
            </button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] transition-all hover:border-[#25D366]/50 hover:bg-[#25D366]/20 hover:shadow-[0_0_16px_rgba(37,211,102,0.35)]"
              aria-label="Abrir WhatsApp"
            >
              <WhatsAppIcon size={20} />
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      <footer className="mt-20 border-t border-white/5 py-8">
        <p className="text-center text-sm text-white/40">© 2026 Raul Luz</p>
      </footer>
    </section>
  )
}
