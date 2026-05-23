/** Categorias exibidas no portfólio e no Sanity Studio */
export const PORTFOLIO_CATEGORIES = [
  'Motions',
  'Streampacks',
  'Sites',
  'Ilustrações',
  'Logotipos',
  'Banners e Folders',
]

export const PORTFOLIO_CATEGORY_OPTIONS = PORTFOLIO_CATEGORIES.map((value) => ({
  title: value,
  value,
}))

export const CATEGORIES = ['Todos', ...PORTFOLIO_CATEGORIES]

/** Valores antigos no Sanity → categoria atual */
export const LEGACY_CATEGORY_MAP = {
  Motion: 'Motions',
  'Motion Design': 'Motions',
  'Editor de vídeo': 'Motions',
  Motions: 'Motions',
  Streampacks: 'Streampacks',
  'Stream pack': 'Streampacks',
  Sites: 'Sites',
  'Site / Landing page': 'Sites',
  Ilustrações: 'Ilustrações',
  Ilustração: 'Ilustrações',
  Logotipos: 'Logotipos',
  Branding: 'Logotipos',
  'Banners e Folders': 'Banners e Folders',
  'Posts & redes sociais': 'Banners e Folders',
  Outro: 'Motions',
}

export const CATEGORY_META = {
  Motions: { iconName: 'Clapperboard', accent: 'neon-violet' },
  Streampacks: { iconName: 'Radio', accent: 'neon-amber' },
  Sites: { iconName: 'Globe', accent: 'neon-cyan' },
  Ilustrações: { iconName: 'Image', accent: 'neon-green' },
  Logotipos: { iconName: 'PenTool', accent: 'neon-pink' },
  'Banners e Folders': { iconName: 'Layout', accent: 'neon-cyan' },
}

export function normalizeCategory(category) {
  if (!category || typeof category !== 'string') return 'Motions'
  const trimmed = category.trim()
  if (LEGACY_CATEGORY_MAP[trimmed]) return LEGACY_CATEGORY_MAP[trimmed]
  return trimmed
}

export function getStudioTabs(uniqueCategories = []) {
  const extras = new Set()

  for (const raw of uniqueCategories) {
    const cat = normalizeCategory(raw)
    if (cat && !PORTFOLIO_CATEGORIES.includes(cat)) extras.add(cat)
  }

  const extraList = [...extras].sort((a, b) => a.localeCompare(b, 'pt'))
  return ['Todos', ...PORTFOLIO_CATEGORIES, ...extraList]
}

export function getCategoriesForProjects(projects) {
  const extras = new Set()

  for (const project of projects ?? []) {
    const cat = normalizeCategory(project?.category)
    if (cat && !PORTFOLIO_CATEGORIES.includes(cat)) extras.add(cat)
  }

  const extraList = [...extras].sort((a, b) => a.localeCompare(b, 'pt'))
  return ['Todos', ...PORTFOLIO_CATEGORIES, ...extraList]
}

export function getCategoryMeta(category) {
  const normalized = normalizeCategory(category)
  return (
    CATEGORY_META[normalized] ?? {
      iconName: 'LayoutGrid',
      accent: 'neon-violet',
    }
  )
}
