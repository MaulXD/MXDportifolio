import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Lightbulb,
  Layers,
  Briefcase,
  Sparkles,
  Search,
  PenTool,
  Clapperboard,
  Globe,
  MessageCircle,
  RefreshCw,
} from 'lucide-react'
import { useLightMotion } from '../hooks/useLightMotion'

const DOT_COLORS = {
  'neon-green': '#00FF9D',
  'neon-cyan': '#0EA5E9',
  'neon-violet': '#8B5CF6',
  'neon-amber': '#F59E0B',
}

const PILLARS = [
  {
    id: 'processo',
    icon: Lightbulb,
    title: 'Processo Criativo',
    summary:
      'Cada projeto começa com clareza. Entendo o briefing, defino a direção visual e só então parto para a produção, com revisões até a entrega final.',
    dotColor: DOT_COLORS['neon-green'],
    iconClass: 'text-neon-green',
    border: 'border-neon-green/20',
    bg: 'from-neon-green/10',
    items: [
      { icon: MessageCircle, text: 'Briefing e alinhamento de objetivos com o cliente' },
      { icon: Search, text: 'Pesquisa, referências e definição do conceito' },
      { icon: PenTool, text: 'Produção: layout, motion, assets ou código' },
      { icon: RefreshCw, text: 'Revisão, ajustes e entrega dos arquivos finais' },
    ],
  },
  {
    id: 'areas',
    icon: Layers,
    title: 'Áreas de atuação',
    summary:
      'Atuo em quatro frentes que se complementam. Posso entregar uma peça isolada ou um pacote completo, do logo ao site.',
    dotColor: DOT_COLORS['neon-cyan'],
    iconClass: 'text-neon-cyan',
    border: 'border-neon-cyan/20',
    bg: 'from-neon-cyan/10',
    items: [
      { icon: PenTool, text: 'Branding, logotipos e identidade visual' },
      { icon: Clapperboard, text: 'Motion design, vídeo e peças para redes' },
      { icon: Globe, text: 'Sites, landing pages e interfaces web' },
      { icon: Sparkles, text: 'Stream packs, banners e materiais promocionais' },
    ],
  },
  {
    id: 'experiencia',
    icon: Briefcase,
    title: 'Experiência & rotina',
    summary:
      'Mais de cinco anos unindo design e organização. Hoje combino criação no IDHES com gestão administrativa, o que reforça prazo e comunicação.',
    dotColor: DOT_COLORS['neon-violet'],
    iconClass: 'text-neon-violet',
    border: 'border-neon-violet/20',
    bg: 'from-neon-violet/10',
    items: [
      { text: '5+ anos entre design gráfico, motion e front-end' },
      { text: 'Experiência com marcas, instituições e projetos autorais' },
      { text: 'Hábito de documentar etapas e manter o cliente informado' },
      { text: 'Adaptação a fluxos ágeis, do rascunho ao arquivo final' },
    ],
  },
  {
    id: 'projetos',
    icon: Sparkles,
    title: 'Projetos criativos',
    summary:
      'Trato cada entrega como parte de um portfólio vivo. Busco peças com personalidade, seja uma thumb, uma vinheta ou uma página inteira.',
    dotColor: DOT_COLORS['neon-amber'],
    iconClass: 'text-neon-amber',
    border: 'border-neon-amber/20',
    bg: 'from-neon-amber/10',
    items: [
      { text: 'Portfólio em constante atualização no site' },
      { text: 'Do conceito único ao pacote completo de mídias' },
      { text: 'Abertura a demandas pontuais ou parcerias contínuas' },
      { text: 'Foco em resultado visual e consistência de marca' },
    ],
  },
]

const HOVER_IN =
  'hover:-translate-y-0.5 hover:[transition:transform_0.2s_ease-out,box-shadow_0.2s_ease-out]'
const HOVER_OUT = '[transition:transform_0s,box-shadow_0s]'

export default function CreativeProcess() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const lightMotion = useLightMotion()

  return (
    <section id="como-trabalho" className="relative border-t border-white/5 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neon-green/[0.02] via-transparent to-transparent" />

      <motion.div
        ref={ref}
        initial={lightMotion ? false : { opacity: 0, y: 28 }}
        animate={lightMotion ? { opacity: 1, y: 0 } : inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-2xl px-4 sm:max-w-3xl sm:px-6"
      >
        <span className="section-label">Como trabalho</span>
        <h2 className="section-heading">
          Da ideia à <span className="text-neon">entrega</span>
        </h2>
        <p className="mt-3 max-w-xl text-base text-white/50 sm:text-[17px] sm:leading-relaxed">
          Processo, áreas, experiência e visão de projeto em um panorama direto de como é
          trabalhar comigo.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:gap-4">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon

            return (
              <motion.article
                key={pillar.id}
                initial={lightMotion ? false : { opacity: 0, y: 12 }}
                animate={
                  lightMotion ? { opacity: 1, y: 0 } : inView ? { opacity: 1, y: 0 } : {}
                }
                transition={{
                  duration: lightMotion ? 0.2 : 0.45,
                  delay: lightMotion ? 0 : 0.08 + i * 0.06,
                }}
                className={`relative overflow-hidden rounded-lg border ${pillar.border} bg-bg-800/35 p-4 sm:p-5 ${HOVER_OUT} ${HOVER_IN}`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${pillar.bg} to-transparent opacity-25`}
                />

                <div className="relative">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-bg-700/70 ${pillar.iconClass}`}
                    >
                      <Icon size={17} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-base font-bold leading-snug text-white sm:text-lg">
                        {pillar.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-white/50 sm:text-sm">
                        {pillar.summary}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-3 space-y-1.5 border-t border-white/5 pt-3">
                    {pillar.items.map((item) => {
                      const ItemIcon = item.icon
                      return (
                        <li
                          key={item.text}
                          className="flex items-start gap-2 text-xs leading-relaxed text-white/55 sm:text-sm"
                        >
                          {ItemIcon ? (
                            <ItemIcon
                              size={14}
                              className={`mt-0.5 shrink-0 ${pillar.iconClass}`}
                            />
                          ) : (
                            <span
                              className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                              style={{ backgroundColor: pillar.dotColor }}
                            />
                          )}
                          <span>{item.text}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </motion.article>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
