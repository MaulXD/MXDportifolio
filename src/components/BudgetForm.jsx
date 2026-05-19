import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Send,
  User,
  Building2,
  Clapperboard,
  Film,
  PenTool,
  Image,
  Radio,
  Globe,
  Layers,
  MessageSquareText,
  HelpCircle,
} from 'lucide-react'
import WhatsAppIcon from './icons/WhatsAppIcon'
import NeonSelectButton from './NeonSelectButton'
import {
  buildWhatsAppMessage,
  validateForm,
  STREAM_PACK_LABEL,
  SITE_LABEL,
} from '../lib/budgetFormUtils'

/** Altere aqui: DDI + DDD + número, só dígitos (ex: 5582993554322) */
const WHATSAPP_NUMBER = '5582993554322'

const PERSON_TYPES = [
  { id: 'pf', label: 'Pessoa Física', icon: User },
  { id: 'pj', label: 'Pessoa Jurídica', icon: Building2 },
]

const SERVICE_OPTIONS = [
  { id: 'motion', label: 'Motion Design', icon: Clapperboard },
  { id: 'video', label: 'Editor de vídeo', icon: Film },
  { id: 'branding', label: 'Branding', icon: PenTool },
  { id: 'ilustracao', label: 'Ilustração', icon: Image },
  { id: 'stream', label: 'Stream pack', icon: Radio },
  { id: 'site', label: 'Site / Landing page', icon: Globe },
  { id: 'social', label: 'Posts & redes sociais', icon: Layers },
  { id: 'outro', label: 'Outro', icon: HelpCircle },
]

/** Subitens de Stream pack, comuns em briefings de streamers (Twitch/YouTube) */
const STREAM_PACK_ITEMS = [
  'Overlay animado (gameplay + webcam)',
  'Telas: início, pausa e “volto já”',
  'Alertas: follow, sub, donate',
  'Painéis de canal (sobre, regras, PC)',
  'Banner offline / capa',
  'Pacote completo para stream',
  'Outro',
]

const SITE_TYPE_OPTIONS = [
  'Catálogo de loja',
  'Funil de vendas',
  'Landing page para eventos',
  'Blog',
  'Perfil pessoal / Portfólio',
  'Outros',
]

const FIELD_CLASS =
  'w-full rounded-xl border border-white/10 bg-bg-800/60 px-4 py-3 text-sm text-white placeholder:text-white/35 backdrop-blur-sm transition-all duration-300 focus:border-neon-cyan/50 focus:outline-none focus:ring-0 focus:shadow-[0_0_15px_rgba(14,165,233,0.25)]'

const LABEL_CLASS = 'mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50'

function PersonTypeSelector({ value, onChange, error }) {
  return (
    <div>
      <p className={LABEL_CLASS}>
        Tipo de contratação <span className="text-neon-green">*</span>
      </p>
      <div className="grid grid-cols-2 gap-3">
        {PERSON_TYPES.map(({ id, label, icon: Icon }) => {
          const active = value === id
          return (
            <NeonSelectButton
              key={id}
              active={active}
              accent="green"
              layout="col"
              onClick={() => onChange(id)}
              className={error && !active ? 'opacity-90' : ''}
            >
              <Icon size={22} className={active ? 'text-neon-green' : 'text-white/50'} />
              <span
                className={`text-xs font-medium sm:text-sm ${
                  active ? 'text-neon-green' : 'text-white/70'
                }`}
              >
                {label}
              </span>
            </NeonSelectButton>
          )
        })}
      </div>
      {error && <p className="mt-2 text-xs text-neon-pink">{error}</p>}
    </div>
  )
}

function MultiSelectChips({ items, selected, onToggle, error, hint, className = '', accent = 'cyan' }) {
  const iconClass =
    accent === 'violet'
      ? { on: 'text-neon-violet', off: 'text-white/40' }
      : { on: 'text-neon-cyan', off: 'text-white/40' }

  return (
    <div className={className}>
      {hint && <p className="mb-3 text-xs text-white/45">{hint}</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => {
          const label = typeof item === 'string' ? item : item.label
          const id = typeof item === 'string' ? item : item.id
          const Icon = typeof item === 'string' ? null : item.icon
          const checked = selected.includes(label)

          return (
            <NeonSelectButton
              key={id}
              active={checked}
              accent={accent}
              onClick={() => onToggle(label)}
            >
              {Icon && <Icon size={16} className={checked ? iconClass.on : iconClass.off} />}
              <span className="leading-snug">{label}</span>
            </NeonSelectButton>
          )
        })}
      </div>
      {error && <p className="mt-2 text-xs text-neon-pink">{error}</p>}
    </div>
  )
}

export default function BudgetForm() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const [personType, setPersonType] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedServices, setSelectedServices] = useState([])
  const [siteTypes, setSiteTypes] = useState([])
  const [streamItems, setStreamItems] = useState([])
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState({})
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const isPJ = personType === 'pj'
  const includesStream = selectedServices.includes(STREAM_PACK_LABEL)
  const includesSite = selectedServices.includes(SITE_LABEL)

  const toggleStreamItem = (label) => {
    setStreamItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label],
    )
  }

  const toggleSiteType = (label) => {
    setSiteTypes((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label],
    )
  }

  const toggleService = (label) => {
    setSelectedServices((prev) => {
      const isRemoving = prev.includes(label)
      const next = isRemoving ? prev.filter((i) => i !== label) : [...prev, label]
      if (isRemoving) {
        if (label === STREAM_PACK_LABEL) setStreamItems([])
        if (label === SITE_LABEL) setSiteTypes([])
      }
      return next
    })
    setErrors((p) => ({
      ...p,
      selectedServices: undefined,
      streamItems: undefined,
      siteTypes: undefined,
    }))
  }

  const getFormData = () => ({
    personType,
    cnpj,
    fullName,
    phone,
    selectedServices: [...selectedServices],
    siteTypes,
    streamItems: [...streamItems],
    notes,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitAttempted(true)

    const data = getFormData()
    const { valid, errors: nextErrors } = validateForm(data)
    setErrors(nextErrors)
    if (!valid) return

    const message = buildWhatsAppMessage(data)
    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`

    const opened = window.open(url, '_blank', 'noopener,noreferrer')
    if (!opened) {
      window.location.href = url
    }
  }

  const errorClass = (field) =>
    submitAttempted && errors[field]
      ? 'border-neon-pink/50 shadow-[0_0_12px_rgba(255,0,102,0.2)]'
      : ''

  return (
    <section id="orcamento" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neon-cyan/[0.03] via-transparent to-transparent" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8"
      >
        <span className="section-label">Orçamento</span>
        <h2 className="section-heading">
          Solicite um <span className="text-neon">orçamento</span>
        </h2>
        <p className="mt-4 text-white/50">
          Preencha seus dados, escolha o que você precisa e clique em enviar. Vamos abrir o WhatsApp
          com sua mensagem pronta. É só conferir e mandar.
        </p>

        <motion.form
          onSubmit={handleSubmit}
          noValidate
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 rounded-2xl border border-white/10 bg-bg-950/85 p-6 backdrop-blur-md sm:p-8"
        >
          <div className="space-y-5">
            <PersonTypeSelector
              value={personType}
              onChange={(id) => {
                setPersonType(id)
                if (id !== 'pj') {
                  setCnpj('')
                  setErrors((p) => ({ ...p, cnpj: undefined }))
                }
                if (errors.personType) setErrors((p) => ({ ...p, personType: undefined }))
              }}
              error={submitAttempted ? errors.personType : ''}
            />

            <AnimatePresence>
              {isPJ && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div>
                    <label htmlFor="cnpj" className={LABEL_CLASS}>
                      CNPJ <span className="text-neon-green">*</span>
                    </label>
                    <input
                      id="cnpj"
                      type="text"
                      value={cnpj}
                      onChange={(e) => {
                        setCnpj(e.target.value)
                        if (errors.cnpj) setErrors((p) => ({ ...p, cnpj: undefined }))
                      }}
                      placeholder="00.000.000/0000-00"
                      className={`${FIELD_CLASS} ${errorClass('cnpj')}`}
                    />
                    {submitAttempted && errors.cnpj && (
                      <p className="mt-1.5 text-xs text-neon-pink">{errors.cnpj}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label htmlFor="fullName" className={LABEL_CLASS}>
                Nome completo <span className="text-neon-green">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value)
                  if (errors.fullName) setErrors((p) => ({ ...p, fullName: undefined }))
                }}
                placeholder="Seu nome"
                className={`${FIELD_CLASS} ${errorClass('fullName')}`}
                autoComplete="name"
              />
              {submitAttempted && errors.fullName && (
                <p className="mt-1.5 text-xs text-neon-pink">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className={LABEL_CLASS}>
                Telefone <span className="text-neon-green">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }))
                }}
                placeholder="(00) 00000-0000"
                className={`${FIELD_CLASS} ${errorClass('phone')}`}
                autoComplete="tel"
              />
              {submitAttempted && errors.phone && (
                <p className="mt-1.5 text-xs text-neon-pink">{errors.phone}</p>
              )}
            </div>

            <div
              className={`rounded-xl border p-4 transition-colors ${
                submitAttempted && errors.selectedServices
                  ? 'border-neon-pink/40 bg-neon-pink/5'
                  : 'border-neon-green/20 bg-neon-green/5'
              }`}
            >
              <p className={`${LABEL_CLASS} mb-0`}>
                O que você precisa? <span className="text-neon-green">*</span>
              </p>
              <MultiSelectChips
                items={SERVICE_OPTIONS}
                selected={selectedServices}
                onToggle={toggleService}
                error={submitAttempted ? errors.selectedServices : ''}
                hint="Marque um ou mais serviços e combine motion, stream, site e redes no mesmo orçamento."
                className="mt-3"
              />
            </div>

            <AnimatePresence mode="wait">
              {includesSite && (
                <motion.div
                  key="site"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-xl border border-neon-cyan/20 bg-neon-cyan/5 p-4"
                >
                  <p className={`${LABEL_CLASS} mb-0 flex items-center gap-2`}>
                    <Globe size={14} className="text-neon-cyan" />
                    Tipos de site desejados <span className="text-neon-green">*</span>
                  </p>
                  <MultiSelectChips
                    items={SITE_TYPE_OPTIONS}
                    selected={siteTypes}
                    accent="cyan"
                    onToggle={(label) => {
                      toggleSiteType(label)
                      if (errors.siteTypes) setErrors((p) => ({ ...p, siteTypes: undefined }))
                    }}
                    error={submitAttempted ? errors.siteTypes : ''}
                    hint="Marque um ou mais tipos — por exemplo, landing + blog no mesmo briefing."
                    className="mt-3"
                  />
                </motion.div>
              )}

              {includesStream && (
                <motion.div
                  key="stream"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-xl border border-neon-violet/20 bg-neon-violet/5 p-4"
                >
                  <p className={`${LABEL_CLASS} mb-0 flex items-center gap-2`}>
                    <Radio size={14} className="text-neon-violet" />
                    Monte seu Stream pack <span className="text-neon-green">*</span>
                  </p>
                  <MultiSelectChips
                    items={STREAM_PACK_ITEMS}
                    selected={streamItems}
                    accent="violet"
                    onToggle={(label) => {
                      toggleStreamItem(label)
                      if (errors.streamItems) setErrors((p) => ({ ...p, streamItems: undefined }))
                    }}
                    error={submitAttempted ? errors.streamItems : ''}
                    hint="Marque tudo que precisa: overlay, telas, alertas e painéis no mesmo briefing."
                    className="mt-3"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label htmlFor="notes" className={`${LABEL_CLASS} flex items-center gap-2`}>
                <MessageSquareText size={14} className="text-neon-cyan" />
                Observações <span className="normal-case text-white/30">(opcional)</span>
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Prazo, referências, links, detalhes do projeto..."
                className={`${FIELD_CLASS} resize-none`}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, boxShadow: '0 0 32px rgba(0,255,157,0.35)' }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-neon-green py-3.5 text-sm font-semibold text-bg-950 transition-shadow"
          >
            <WhatsAppIcon size={20} className="text-bg-950" />
            Enviar para o WhatsApp
            <Send size={16} className="opacity-70" />
          </motion.button>
        </motion.form>
      </motion.div>
    </section>
  )
}
