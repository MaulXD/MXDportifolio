/**
 * Pasta interna da galeria de um projeto (ex.: Telas, Painéis, Transições).
 */
export default {
  name: 'galeriaPasta',
  title: 'Pasta',
  type: 'object',
  fields: [
    {
      name: 'nome',
      title: 'Nome da pasta',
      type: 'string',
      validation: (Rule) => Rule.required().min(1).error('Informe o nome da pasta.'),
    },
    {
      name: 'icone',
      title: 'Ícone',
      type: 'string',
      description: 'Definido automaticamente ao criar a pasta a partir de um modelo.',
      readOnly: true,
    },
    {
      name: 'itens',
      title: 'Arquivos',
      type: 'array',
      of: [{ type: 'galeriaItem' }],
    },
    {
      name: 'exibirNoSite',
      title: 'Exibir no site',
      type: 'boolean',
      description: 'Se desmarcado, esta pasta não aparece na galeria pública do portfólio.',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      nome: 'nome',
      icone: 'icone',
      count: 'itens.length',
    },
    prepare({ nome, icone, count }) {
      return {
        title: nome || 'Pasta',
        subtitle: `${icone ? `${icone} · ` : ''}${count ?? 0} arquivo(s)`,
      }
    },
  },
}
