/** Lista itens da galeria (pastas ou legado) para escolha de capa no Studio. */
export function listGaleriaItensForCapa(galeria) {
  if (!Array.isArray(galeria) || galeria.length === 0) return []

  const first = galeria[0]
  const isFolderShape =
    first?._type === 'galeriaPasta' ||
    (typeof first?.nome === 'string' && Array.isArray(first?.itens))

  if (isFolderShape) {
    return galeria.flatMap((folder) => {
      const pasta = (folder.nome || 'Geral').trim() || 'Geral'
      return (folder.itens || [])
        .map((item) => {
          const ref = item?.asset?.asset?._ref || item?.asset?._ref
          if (!item?._key || !ref) return null
          return {
            key: item._key,
            pasta,
            legenda: (item.legenda || '').trim(),
            tipoMedia: item.tipoMedia || 'Imagem',
            exibirPasta: folder.exibirNoSite !== false,
          }
        })
        .filter(Boolean)
    })
  }

  return galeria
    .map((item) => {
      const ref = item?.asset?.asset?._ref || item?.asset?._ref
      if (!item?._key || !ref) return null
      return {
        key: item._key,
        pasta: 'Geral',
        legenda: (item.legenda || '').trim(),
        tipoMedia: item.tipoMedia || 'Imagem',
        exibirPasta: true,
      }
    })
    .filter(Boolean)
}
