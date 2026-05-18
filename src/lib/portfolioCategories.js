/** Categorias do portfólio — mesmas opções do formulário de orçamento */
export const PORTFOLIO_CATEGORIES = [
  'Motion Design',
  'Editor de vídeo',
  'Branding',
  'Ilustração',
  'Stream pack',
  'Site / Landing page',
  'Posts & redes sociais',
  'Outro',
]

export const PORTFOLIO_CATEGORY_OPTIONS = PORTFOLIO_CATEGORIES.map((value) => ({
  title: value,
  value,
}))

/** Filtros na home (inclui "Todos") */
export const CATEGORIES = ['Todos', ...PORTFOLIO_CATEGORIES]

/** Valores antigos no Sanity → categoria atual */
export const LEGACY_CATEGORY_MAP = {
  Motion: 'Motion Design',
  Branding: 'Branding',
  Ilustração: 'Ilustração',
}

export const CATEGORY_META = {
  'Motion Design': { iconName: 'Clapperboard', accent: 'neon-violet' },
  'Editor de vídeo': { iconName: 'Film', accent: 'neon-pink' },
  Branding: { iconName: 'PenTool', accent: 'neon-cyan' },
  Ilustração: { iconName: 'Image', accent: 'neon-green' },
  'Stream pack': { iconName: 'Radio', accent: 'neon-amber' },
  'Site / Landing page': { iconName: 'Globe', accent: 'neon-cyan' },
  'Posts & redes sociais': { iconName: 'Layers', accent: 'neon-pink' },
  Outro: { iconName: 'HelpCircle', accent: 'neon-violet' },
}

export function normalizeCategory(category) {
  if (!category || typeof category !== 'string') return 'Motion Design'
  const trimmed = category.trim()
  if (LEGACY_CATEGORY_MAP[trimmed]) return LEGACY_CATEGORY_MAP[trimmed]
  if (PORTFOLIO_CATEGORIES.includes(trimmed)) return trimmed
  return 'Outro'
}

export function getCategoryMeta(category) {
  const normalized = normalizeCategory(category)
  return CATEGORY_META[normalized] ?? CATEGORY_META['Motion Design']
}
