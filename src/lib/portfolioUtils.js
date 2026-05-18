import {
  CATEGORIES,
  getCategoryMeta,
  normalizeCategory,
} from './portfolioCategories'

export { CATEGORIES, getCategoryMeta, normalizeCategory }

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

export function normalizeProject(raw) {
  if (!raw || typeof raw !== 'object') return null

  const fromGaleria = (Array.isArray(raw.galeria) ? raw.galeria : [])
    .filter((item) => item && typeof item.mediaUrl === 'string' && item.mediaUrl.length > 0)
    .map((item) => ({
      tipoMedia: item?.tipoMedia === 'Vídeo' ? 'Vídeo' : 'Imagem',
      mediaUrl: item.mediaUrl,
      legenda: typeof item?.legenda === 'string' ? item.legenda.trim() : '',
    }))

  let galeria = fromGaleria

  if (galeria.length === 0 && raw.legacyMediaUrl) {
    galeria = [
      {
        tipoMedia: raw.legacyMediaType === 'Vídeo' ? 'Vídeo' : 'Imagem',
        mediaUrl: raw.legacyMediaUrl,
        legenda: '',
      },
    ]
  }

  const slug = raw.slug ?? null

  return {
    _id: raw._id ?? slug ?? `project-${Math.random().toString(36).slice(2)}`,
    title: raw.title ?? 'Projeto sem título',
    slug,
    category: normalizeCategory(raw.category),
    externalLink: raw.externalLink ?? null,
    galeria,
  }
}

export function getMediaLabel(item, index = 0) {
  const legenda = item?.legenda?.trim()
  if (legenda) return legenda
  return `Mídia ${index + 1}`
}

export function getGallerySummary(galeria) {
  const list = Array.isArray(galeria) ? galeria : []
  const valid = list.filter((item) => item?.mediaUrl)
  const videos = valid.filter((item) => item?.tipoMedia === 'Vídeo').length
  const images = valid.filter((item) => item?.tipoMedia === 'Imagem').length
  const parts = []
  if (videos) parts.push(`${videos} vídeo${videos > 1 ? 's' : ''}`)
  if (images) parts.push(`${images} imagem${images > 1 ? 'ns' : ''}`)
  return { valid, label: parts.length ? parts.join(' · ') : 'Sem mídia' }
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
