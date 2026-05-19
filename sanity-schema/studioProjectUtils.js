import { normalizeCategory } from '../src/lib/portfolioCategories.js'

function inferTipo(item) {
  if (item?.tipoMedia === 'Vídeo' || item?.tipoMedia === 'Imagem') return item.tipoMedia
  const mime = item?.mimeType || ''
  if (mime.startsWith('video/')) return 'Vídeo'
  return 'Imagem'
}

function flattenGaleria(galeria) {
  if (!Array.isArray(galeria) || galeria.length === 0) return []

  const first = galeria[0]
  const isFolder =
    first?._type === 'galeriaPasta' ||
    (typeof first?.nome === 'string' && Array.isArray(first?.itens))

  if (isFolder) {
    return galeria.flatMap((folder) =>
      (folder.itens || [])
        .filter((item) => item?.mediaUrl)
        .map((item) => ({
          _key: item._key,
          mediaUrl: item.mediaUrl,
          tipoMedia: inferTipo(item),
          exibirPasta: folder.exibirNoSite !== false,
        })),
    )
  }

  return galeria
    .filter((item) => item?.mediaUrl)
    .map((item) => ({
      _key: item._key,
      mediaUrl: item.mediaUrl,
      tipoMedia: inferTipo(item),
      exibirPasta: true,
    }))
}

export function getCoverFromStudioDoc(doc) {
  const galeria = flattenGaleria(doc?.galeria)
  const visible = galeria.filter((i) => i.exibirPasta !== false)

  if (doc?.capaMidiaKey) {
    const picked = galeria.find((i) => i._key === doc.capaMidiaKey)
    if (picked) return picked
  }

  return visible[0] ?? galeria[0] ?? null
}

export function normalizeStudioProject(raw) {
  if (!raw?._id) return null
  return {
    _id: raw._id,
    title: raw.title || 'Sem título',
    category: normalizeCategory(raw.category),
    exibirEmTodos: raw.exibirEmTodos !== false,
    exibirNaCategoria: raw.exibirNaCategoria !== false,
    ordemGeral: typeof raw.ordemGeral === 'number' ? raw.ordemGeral : null,
    ordemCategoria: typeof raw.ordemCategoria === 'number' ? raw.ordemCategoria : null,
    capaMidiaKey: raw.capaMidiaKey || null,
    galeria: raw.galeria,
    cover: getCoverFromStudioDoc(raw),
  }
}

export function sortByOrdem(list, mode) {
  const key = mode === 'Todos' ? 'ordemGeral' : 'ordemCategoria'
  return [...list].sort((a, b) => {
    const oa = a[key]
    const ob = b[key]
    if (typeof oa === 'number' && typeof ob === 'number' && oa !== ob) return oa - ob
    if (typeof oa === 'number' && typeof ob !== 'number') return -1
    if (typeof oa !== 'number' && typeof ob === 'number') return 1
    return (a.title || '').localeCompare(b.title || '', 'pt')
  })
}

export function projectsForTab(projects, tab) {
  if (tab === 'Todos') return sortByOrdem(projects, 'Todos')
  return sortByOrdem(
    projects.filter((p) => p.category === tab),
    tab,
  )
}
