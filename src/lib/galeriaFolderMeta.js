/** Pastas da galeria — ícones, sugestões e helpers compartilhados (site + Sanity). */
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

export const PASTA_ICONE_OPTIONS = [
  { title: 'Telas (monitor)', value: 'Monitor' },
  { title: 'Painéis', value: 'LayoutPanel' },
  { title: 'Transições', value: 'Sparkles' },
  { title: 'Vídeos', value: 'Film' },
  { title: 'Ícones / shapes', value: 'Shapes' },
  { title: 'Alertas (sino)', value: 'Bell' },
  { title: 'Flyer / documento', value: 'FileImage' },
  { title: 'Ilustrações', value: 'Image' },
  { title: 'Pasta genérica', value: 'Folder' },
  { title: 'Pasta aberta', value: 'FolderOpen' },
]

/** Nome da pasta → ícone Lucide (fallback quando não há Sanity). */
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

export function buildPastaIconMap(tipos = []) {
  const map = {}
  for (const tipo of tipos) {
    const nome = typeof tipo?.nome === 'string' ? tipo.nome.trim() : ''
    const icone = typeof tipo?.icone === 'string' ? tipo.icone.trim() : ''
    if (nome && icone) map[nome] = icone
  }
  return map
}

export function getPastaIconName(nome, iconMap = null, pastaIcone = null) {
  if (typeof pastaIcone === 'string' && pastaIcone.trim()) return pastaIcone.trim()

  if (!nome || typeof nome !== 'string') return 'Folder'
  const trimmed = nome.trim()

  if (iconMap && iconMap[trimmed]) return iconMap[trimmed]

  if (GALERIA_PASTA_LUCIDE[trimmed]) return GALERIA_PASTA_LUCIDE[trimmed]

  const lower = trimmed.toLowerCase()
  if (iconMap) {
    const fromMap = Object.entries(iconMap).find(([key]) => key.toLowerCase() === lower)
    if (fromMap) return fromMap[1]
  }

  const found = Object.entries(GALERIA_PASTA_LUCIDE).find(([key]) => key.toLowerCase() === lower)
  return found?.[1] ?? 'Folder'
}

export function mergePastaSugestoes(existingNames = [], tipos = []) {
  const seen = new Set()
  const ordered = []

  const push = (nome) => {
    const label = typeof nome === 'string' ? nome.trim() : ''
    if (!label) return
    const key = label.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    ordered.push(label)
  }

  for (const tipo of tipos) {
    push(tipo?.nome)
  }

  for (const nome of GALERIA_PASTA_SUGESTOES) {
    push(nome)
  }

  for (const raw of existingNames) {
    push(raw)
  }

  return ordered
}

export function sortPastasByTipos(pastaNames, tipos = []) {
  const orderMap = new Map()
  tipos.forEach((tipo, index) => {
    const nome = typeof tipo?.nome === 'string' ? tipo.nome.trim() : ''
    if (nome) orderMap.set(nome.toLowerCase(), typeof tipo.ordem === 'number' ? tipo.ordem : index)
  })

  return [...pastaNames].sort((a, b) => {
    const oa = orderMap.get(a.toLowerCase())
    const ob = orderMap.get(b.toLowerCase())
    if (typeof oa === 'number' && typeof ob === 'number' && oa !== ob) return oa - ob
    if (typeof oa === 'number' && typeof ob !== 'number') return -1
    if (typeof oa !== 'number' && typeof ob === 'number') return 1
    return a.localeCompare(b, 'pt')
  })
}
