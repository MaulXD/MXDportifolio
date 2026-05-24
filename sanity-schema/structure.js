import { FolderIcon, ThListIcon } from '@sanity/icons'
import PortfolioManager from './components/PortfolioManager.jsx'

/** Estrutura do Studio: grade visual + lista de documentos. */
export const structure = (S) =>
  S.list()
    .title('Conteúdo')
    .items([
      S.listItem()
        .title('Organizar portfólio (grade)')
        .icon(ThListIcon)
        .child(S.component(PortfolioManager).title('Organizar portfólio')),
      S.divider(),
      S.listItem()
        .title('Pastas da galeria (modelos)')
        .icon(FolderIcon)
        .schemaType('galeriaPastaTipo')
        .child(S.documentTypeList('galeriaPastaTipo').title('Pastas da galeria')),
      S.listItem()
        .title('Projetos: editar detalhes')
        .schemaType('portfolio')
        .child(S.documentTypeList('portfolio').title('Projetos')),
    ])
