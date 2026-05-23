import { PASTA_ICONE_OPTIONS } from '../src/lib/galeriaFolderMeta.js'

/** Modelo reutilizável de pasta da galeria (nome + ícone). */
export default {
  name: 'galeriaPastaTipo',
  title: 'Pasta da galeria',
  type: 'document',
  fields: [
    {
      name: 'nome',
      title: 'Nome da pasta',
      type: 'string',
      description: 'Ex.: Telas, Painéis, Transições, Alertas.',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'icone',
      title: 'Ícone',
      type: 'string',
      options: {
        list: PASTA_ICONE_OPTIONS,
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'ordem',
      title: 'Ordem',
      type: 'number',
      description: 'Ordem nas sugestões ao criar pastas em novos projetos.',
      initialValue: 0,
    },
  ],
  orderings: [
    {
      title: 'Ordem',
      name: 'ordemAsc',
      by: [
        { field: 'ordem', direction: 'asc' },
        { field: 'nome', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'nome', icone: 'icone' },
    prepare({ title, icone }) {
      return {
        title: title || 'Pasta',
        subtitle: icone ? `Ícone: ${icone}` : 'Sem ícone',
      }
    },
  },
}
