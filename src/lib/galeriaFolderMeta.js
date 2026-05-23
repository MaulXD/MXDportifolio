/** Pastas da galeria — sugestões e ícones (Lucide) alinhados ao Sanity. */
export const GALERIA_PASTA_SUGESTOES = [
  'Telas',
  'Painéis',
  'Transições',
  'Vídeos',
  'Ícones',
  'Alertas',
  'Flyer animado',
  'Ilustrações',
  'Outros',
]

export const GALERIA_PASTA_PADRAO = 'Telas'

/** Nome da pasta → componente Lucide (string para lookup no site). */
export const GALERIA_PASTA_LUCIDE = {
  Telas: 'Monitor',
  Painéis: 'LayoutPanel',
  Transições: 'Sparkles',
  Vídeos: 'Film',
  Ícones: 'Shapes',
  Alertas: 'Bell',
  'Flyer animado': 'FileImage',
  Ilustrações: 'Image',
  Outros: 'Folder',
  Geral: 'FolderOpen',
}

export function getPastaIconName(nome) {
  if (!nome || typeof nome !== 'string') return 'Folder'
  const trimmed = nome.trim()
  if (GALERIA_PASTA_LUCIDE[trimmed]) return GALERIA_PASTA_LUCIDE[trimmed]
  const lower = trimmed.toLowerCase()
  const found = Object.entries(GALERIA_PASTA_LUCIDE).find(([key]) => key.toLowerCase() === lower)
  return found?.[1] ?? 'Folder'
}

export function mergePastaSugestoes(existingNames = []) {
  const seen = new Set()
  const ordered = []

  for (const nome of GALERIA_PASTA_SUGESTOES) {
    const key = nome.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      ordered.push(nome)
    }
  }

  for (const raw of existingNames) {
    const nome = typeof raw === 'string' ? raw.trim() : ''
    if (!nome) continue
    const key = nome.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      ordered.push(nome)
    }
  }

  return ordered
}
