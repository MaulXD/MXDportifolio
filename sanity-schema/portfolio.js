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
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          { title: 'Motion', value: 'Motion' },
          { title: 'Branding', value: 'Branding' },
          { title: 'Ilustração', value: 'Ilustração' },
        ],
        layout: 'radio',
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
              tipoMedia: 'tipoMedia',
              filename: 'asset.asset.originalFilename',
            },
            prepare({ tipoMedia, filename }) {
              return {
                title: tipoMedia || 'Mídia',
                subtitle: filename || 'Sem arquivo',
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
