const MEDIA_ACCEPT = 'video/webm,.webm,image/png,.png,image/webp,.webp'

/** Item da galeria (arquivo + nome exibido no site). */
export default {
  name: 'galeriaItem',
  title: 'Mídia',
  type: 'object',
  fields: [
    {
      name: 'legenda',
      title: 'Nome no site',
      type: 'string',
      description: 'Texto exibido na galeria do portfólio. Se vazio, usa o nome do arquivo.',
    },
    {
      name: 'asset',
      title: 'Arquivo',
      type: 'file',
      options: {
        accept: MEDIA_ACCEPT,
        storeOriginalFilename: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'tipoMedia',
      title: 'Tipo de mídia',
      type: 'string',
      options: {
        list: [
          { title: 'Imagem', value: 'Imagem' },
          { title: 'Vídeo', value: 'Vídeo' },
        ],
      },
      hidden: true,
    },
  ],
  preview: {
    select: {
      legenda: 'legenda',
      filename: 'asset.asset.originalFilename',
    },
    prepare({ legenda, filename }) {
      return {
        title: legenda?.trim() || filename || 'Mídia',
        subtitle: filename || '',
      }
    },
  },
}
