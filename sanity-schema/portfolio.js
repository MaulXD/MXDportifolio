import { PORTFOLIO_CATEGORY_OPTIONS } from '../src/lib/portfolioCategories.js'
import GaleriaInput from './components/GaleriaInput.jsx'

/**
 * Schema do documento "portfolio" para o Sanity Studio.
 */
export default {
  name: 'portfolio',
  title: 'Portfólio',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL da página (slug)',
      type: 'slug',
      description:
        'Nome do endereço no site. Ex.: motion-snow → raulluz.com/projeto/motion-snow. Clique em "Generate" a partir do título ou edite o campo manualmente.',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 96),
      },
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          const value = slug?.current
          if (!value) return 'Defina a URL da página.'
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
            return 'Use apenas letras minúsculas, números e hífens (ex.: meu-projeto-2024).'
          }
          return true
        }),
    },
    {
      name: 'category',
      title: 'Tipo de projeto',
      type: 'string',
      description:
        'Categoria do projeto: Motions, Streampacks, Sites, Ilustrações, Logotipos ou Banners e Folders.',
      options: {
        list: PORTFOLIO_CATEGORY_OPTIONS,
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'descricao',
      title: 'Descrição do projeto',
      type: 'text',
      rows: 4,
      description:
        'Texto geral sobre o projeto (contexto, cliente, objetivo). Aparece no modal ao abrir o projeto no site.',
    },
    {
      name: 'galeria',
      title: 'Galeria do Projeto',
      type: 'array',
      description:
        'Organize em pastas (Telas, Painéis, Transições…). Arraste arquivos na pasta desejada. A primeira mídia da primeira pasta vira capa no site.',
      of: [{ type: 'galeriaPasta' }],
      components: {
        input: GaleriaInput,
      },
      validation: (Rule) =>
        Rule.custom((pastas) => {
          if (!Array.isArray(pastas) || pastas.length === 0) {
            return 'Crie pelo menos uma pasta com mídia.'
          }
          const total = pastas.reduce((n, pasta) => n + (pasta?.itens?.length ?? 0), 0)
          if (total < 1) return 'Adicione pelo menos uma mídia em alguma pasta.'
          const missing = pastas.some((pasta) =>
            (pasta?.itens ?? []).some(
              (item) => !item?.asset?.asset?._ref && !item?.asset?._ref,
            ),
          )
          if (missing) return 'Cada arquivo precisa estar enviado.'
          return true
        }),
    },
    {
      name: 'externalLink',
      title: 'Link Externo',
      type: 'url',
      description: 'URL opcional do projeto publicado (Behance, site, etc.).',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      pastas: 'galeria',
    },
    prepare({ title, subtitle, pastas }) {
      const count = Array.isArray(pastas)
        ? pastas.reduce((n, p) => n + (p?.itens?.length ?? 0), 0)
        : 0
      const folderCount = Array.isArray(pastas) ? pastas.length : 0
      return {
        title,
        subtitle: `${subtitle} · ${count} mídia(s) em ${folderCount} pasta(s)`,
      }
    },
  },
}
