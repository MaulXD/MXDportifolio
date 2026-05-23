import {
  CATEGORIES,
  getCategoriesForProjects,
  getCategoryMeta,
  normalizeCategory,
} from './portfolioCategories'

export { CATEGORIES, getCategoriesForProjects, getCategoryMeta, normalizeCategory }

export const accentMap = {
  'neon-violet': {
    pageBorder: 'border-neon-violet/30',
    border: 'group-hover:border-neon-violet/30',
    glow: 'group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]',
    line: 'bg-neon-violet',
    icon: 'text-neon-violet',
    badge: 'bg-neon-violet/10 text-neon-violet border-neon-violet/20',
    dot: 'bg-neon-violet',
  },
  'neon-pink': {
    pageBorder: 'border-neon-pink/30',
    border: 'group-hover:border-neon-pink/30',
    glow: 'group-hover:shadow-[0_0_40px_rgba(255,0,102,0.15)]',
    line: 'bg-neon-pink',
    icon: 'text-neon-pink',
    badge: 'bg-neon-pink/10 text-neon-pink border-neon-pink/20',
    dot: 'bg-neon-pink',
  },
  'neon-cyan': {
    pageBorder: 'border-neon-cyan/30',
    border: 'group-hover:border-neon-cyan/30',
    glow: 'group-hover:shadow-[0_0_40px_rgba(14,165,233,0.15)]',
    line: 'bg-neon-cyan',
    icon: 'text-neon-cyan',
    badge: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20',
    dot: 'bg-neon-cyan',
  },
  'neon-green': {
    pageBorder: 'border-neon-green/30',
    border: 'group-hover:border-neon-green/30',
    glow: 'group-hover:shadow-[0_0_40px_rgba(0,255,157,0.15)]',
    line: 'bg-neon-green',
    icon: 'text-neon-green',
    badge: 'bg-neon-green/10 text-neon-green border-neon-green/20',
    dot: 'bg-neon-green',
  },
  'neon-amber': {
    pageBorder: 'border-neon-amber/30',
    border: 'group-hover:border-neon-amber/30',
    glow: 'group-hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]',
    line: 'bg-neon-amber',
    icon: 'text-neon-amber',
    badge: 'bg-neon-amber/10 text-neon-amber border-neon-amber/20',
    dot: 'bg-neon-amber',
  },
}

function inferTipoMedia(item) {
  if (item?.tipoMedia === 'Vídeo' || item?.tipoMedia === 'Imagem') return item.tipoMedia
  const mime = item?.mimeType || ''
  const url = item?.mediaUrl || ''
  const name = item?.filename || ''
  if (mime.startsWith('video/') || /\.webm$/i.test(url) || /\.webm$/i.test(name)) return 'Vídeo'
  return 'Imagem'
}

function inferLegenda(item) {
  const manual = typeof item?.legenda === 'string' ? item.legenda.trim() : ''
  if (manual) return manual
  const name = item?.filename || ''
  if (!name) return ''
  return name
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim()
}

function mapGaleriaItem(item, pasta = 'Geral', exibirPasta = true) {
  if (!item || typeof item.mediaUrl !== 'string' || !item.mediaUrl.length) return null
  return {
    _key: item._key || null,
    pasta: pasta.trim() || 'Geral',
    exibirPasta: exibirPasta !== false,
    tipoMedia: inferTipoMedia(item),
    mediaUrl: item.mediaUrl,
    legenda: inferLegenda(item),
  }
}

/** Pastas (novo) ou lista plana legada vindas do Sanity. */
export function flattenGaleriaEntries(entries) {
  if (!Array.isArray(entries) || entries.length === 0) return []

  const first = entries[0]
  const isFolderShape =
    first?._type === 'galeriaPasta' ||
    (typeof first?.nome === 'string' && Array.isArray(first?.itens))

  if (isFolderShape) {
    return entries.flatMap((folder) => {
      const pasta = (folder.nome || 'Geral').trim() || 'Geral'
      const exibirPasta = folder.exibirNoSite !== false
      return (folder.itens || [])
        .map((item) => mapGaleriaItem(item, pasta, exibirPasta))
        .filter(Boolean)
    })
  }

  return entries
    .map((item) => mapGaleriaItem(item, item.pasta || 'Geral', item.exibirPasta !== false))
    .filter(Boolean)
}

/** Mídias de pastas marcadas para exibição no site. */
export function getVisibleGaleria(galeria) {
  return (Array.isArray(galeria) ? galeria : []).filter(
    (item) => item?.mediaUrl && item.exibirPasta !== false,
  )
}

export function getGaleriaPastas(galeria) {
  const list = getVisibleGaleria(galeria)
  const seen = new Set()
  const pastas = []
  for (const item of list) {
    const pasta = item?.pasta?.trim() || 'Geral'
    if (!seen.has(pasta)) {
      seen.add(pasta)
      pastas.push(pasta)
    }
  }
  return pastas
}

export function normalizeProject(raw) {
  if (!raw || typeof raw !== 'object') return null

  const entries = raw.galeriaEntries ?? raw.galeria ?? []
  let galeria = flattenGaleriaEntries(entries)

  if (galeria.length === 0 && raw.legacyMediaUrl) {
    galeria = [
      {
        _key: null,
        pasta: 'Geral',
        exibirPasta: true,
        tipoMedia: raw.legacyMediaType === 'Vídeo' ? 'Vídeo' : 'Imagem',
        mediaUrl: raw.legacyMediaUrl,
        legenda: '',
      },
    ]
  }

  const slug = raw.slug ?? null
  const capaMidiaKey =
    typeof raw.capaMidiaKey === 'string' && raw.capaMidiaKey.trim()
      ? raw.capaMidiaKey.trim()
      : null

  return {
    _id: raw._id ?? slug ?? `project-${Math.random().toString(36).slice(2)}`,
    title: raw.title ?? 'Projeto sem título',
    slug,
    category: normalizeCategory(raw.category),
    externalLink: raw.externalLink ?? null,
    descricao: typeof raw.descricao === 'string' ? raw.descricao.trim() : '',
    capaMidiaKey,
    logoCapaUrl:
      typeof raw.logoCapaUrl === 'string' && raw.logoCapaUrl.trim()
        ? raw.logoCapaUrl.trim()
        : null,
    exibirEmTodos: raw.exibirEmTodos !== false,
    exibirNaCategoria: raw.exibirNaCategoria !== false,
    ordemGeral: typeof raw.ordemGeral === 'number' ? raw.ordemGeral : null,
    ordemCategoria: typeof raw.ordemCategoria === 'number' ? raw.ordemCategoria : null,
    galeria,
  }
}

function compareOrder(a, b, key) {
  const oa = a[key]
  const ob = b[key]
  if (typeof oa === 'number' && typeof ob === 'number' && oa !== ob) return oa - ob
  if (typeof oa === 'number' && typeof ob !== 'number') return -1
  if (typeof oa !== 'number' && typeof ob === 'number') return 1
  return 0
}

/** Filtra e ordena projetos conforme o filtro ativo no site. */
export function filterProjectsForView(projects, filter) {
  const list = Array.isArray(projects) ? projects.filter(Boolean) : []

  if (filter === 'Todos') {
    return list
      .filter((p) => p.exibirEmTodos !== false)
      .sort((a, b) => compareOrder(a, b, 'ordemGeral'))
  }

  return list
    .filter((p) => p.category === filter && p.exibirNaCategoria !== false)
    .sort((a, b) => compareOrder(a, b, 'ordemCategoria'))
}

/** Mídia usada na miniatura do card (capa escolhida ou primeira visível). */
export function getProjectCoverMedia(project) {
  const list = Array.isArray(project?.galeria) ? project.galeria : []
  const visible = getVisibleGaleria(list)

  if (project?.capaMidiaKey) {
    const picked = list.find((item) => item?._key === project.capaMidiaKey && item?.mediaUrl)
    if (picked) return picked
  }

  return visible[0] ?? list[0] ?? null
}

export function getMediaLabel(item, index = 0) {
  const legenda = item?.legenda?.trim()
  if (legenda) return legenda
  return `Mídia ${index + 1}`
}

export function getGallerySummary(galeria) {
  const list = Array.isArray(galeria) ? galeria : []
  const valid = getVisibleGaleria(list)
  const pastas = getGaleriaPastas(list)
  const videos = valid.filter((item) => item?.tipoMedia === 'Vídeo').length
  const images = valid.filter((item) => item?.tipoMedia === 'Imagem').length
  const parts = []
  if (pastas.length > 1) parts.push(`${pastas.length} pastas`)
  if (videos) parts.push(`${videos} vídeo${videos > 1 ? 's' : ''}`)
  if (images) parts.push(`${images} ${images > 1 ? 'imagens' : 'imagem'}`)
  return { valid, pastas, label: parts.length ? parts.join(' · ') : '' }
}

export function getProjectPath(project) {
  const slug = project?.slug?.trim?.() ?? project?.slug
  if (slug && typeof slug === 'string') {
    return `/projeto/${encodeURIComponent(slug)}`
  }
  if (project?._id) {
    return `/projeto/${encodeURIComponent(project._id)}`
  }
  return '/#portfolio'
}
