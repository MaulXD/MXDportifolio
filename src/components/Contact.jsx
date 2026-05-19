import { useRef, useState, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Phone, Check } from 'lucide-react'
import WhatsAppIcon from './icons/WhatsAppIcon'
import NeonSelectButton from './NeonSelectButton'

const WHATSAPP_URL = 'https://wa.me/5582993554322'
const WHATSAPP_ID = 'whatsapp'
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
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [copiedId, setCopiedId] = useState(null)
  const [selectedContact, setSelectedContact] = useState(null)

  const copyText = useCallback(async (id, text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 2200)
    } catch {
      /* clipboard bloqueado */
    }
  }, [])

  const handlePhone = () => {
    setSelectedContact(PHONE_ID)
    copyText(PHONE_ID, PHONE_DISPLAY)
  }

  const handleWhatsApp = () => {
    setSelectedContact(WHATSAPP_ID)
    window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neon-green/[0.03] to-transparent"
        aria-hidden
      />

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
          Tem um projeto em mente? Entre em contato. Respondo o mais rápido possível.
        </p>

        <div className="mt-8 flex w-full max-w-[17.5rem] flex-col gap-2 sm:max-w-[18.5rem]">
          {EMAIL_CHANNELS.map((channel, i) => {
            const copied = copiedId === channel.id
            return (
              <motion.button
                key={channel.id}
                type="button"
                onClick={() => copyText(channel.id, channel.value)}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.08 }}
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 + EMAIL_CHANNELS.length * 0.08 }}
            className="flex w-full gap-2"
          >
            <NeonSelectButton
              accent="amber"
              active={selectedContact === PHONE_ID}
              animateStroke
              onClick={handlePhone}
              className="min-w-0 flex-1"
              aria-label={`Copiar telefone ${PHONE_DISPLAY}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-bg-700/80">
                {copiedId === PHONE_ID ? (
                  <Check size={20} className="text-neon-green" />
                ) : (
                  <Phone size={18} className="text-neon-amber" />
                )}
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block text-xs text-white/40">Telefone</span>
                <span className="mt-0.5 block text-sm font-medium text-white">{PHONE_DISPLAY}</span>
                {copiedId === PHONE_ID && (
                  <span className="mt-1 block text-xs font-medium text-neon-green">
                    Telefone copiado!
                  </span>
                )}
              </span>
            </NeonSelectButton>

            <NeonSelectButton
              accent="whatsapp"
              active={selectedContact === WHATSAPP_ID}
              animateStroke
              layout="col"
              onClick={handleWhatsApp}
              className="w-[3.25rem] shrink-0"
              aria-label="Abrir WhatsApp"
            >
              <span className="flex h-10 w-10 items-center justify-center text-[#25D366]">
                <WhatsAppIcon size={22} />
              </span>
            </NeonSelectButton>
          </motion.div>
        </div>
      </motion.div>

      <footer className="mt-20 border-t border-white/5 py-8">
        <p className="text-center text-sm text-white/40">© 2026 Raul Luz</p>
      </footer>
    </section>
  )
}
