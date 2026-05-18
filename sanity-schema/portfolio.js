import { PORTFOLIO_CATEGORY_OPTIONS } from '../src/lib/portfolioCategories.js'

/**
 * Schema do documento "portfolio" para o Sanity Studio.
 */
export default {  name: 'portfolio',
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
        'Mesmas categorias do formulário de orçamento (Motion, Stream pack, Site, etc.).',
      options: {
        list: PORTFOLIO_CATEGORY_OPTIONS,
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'galeria',
      title: 'Galeria do Projeto',
      type: 'array',
      description: 'Adicione várias mídias (.webm, .png, .webp). A primeira aparece como capa no grid.',
      of: [
        {
          type: 'object',
          name: 'galeriaItem',
          title: 'Mídia',
          fields: [
            {
              name: 'legenda',
              title: 'Legenda',
              type: 'string',
              description:
                'Nome exibido no site para esta mídia (ex.: Capa, Versão final, Thumbnail 02). Deixe em branco para usar o número da mídia.',
            },
            {
              name: 'tipoMedia',
              title: 'Tipo de Mídia',
              type: 'string',
              options: {
                list: [
                  { title: 'Imagem', value: 'Imagem' },
                  { title: 'Vídeo', value: 'Vídeo' },
                ],
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'asset',
              title: 'Arquivo',
              type: 'file',
              description: 'Formatos aceitos: .webm (vídeo), .png e .webp (imagem).',
              options: {
                accept: 'video/webm,.webm,image/png,.png,image/webp,.webp',
              },
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              legenda: 'legenda',
              tipoMedia: 'tipoMedia',
              filename: 'asset.asset.originalFilename',
            },
            prepare({ legenda, tipoMedia, filename }) {
              return {
                title: legenda?.trim() || tipoMedia || 'Mídia',
                subtitle: [tipoMedia, filename].filter(Boolean).join(' · ') || 'Sem arquivo',
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).error('Adicione pelo menos uma mídia à galeria.'),
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
      count: 'galeria.length',
    },
    prepare({ title, subtitle, count }) {
      return {
        title,
        subtitle: `${subtitle} · ${count ?? 0} mídia(s)`,
      }
    },
  },
}
