import {
  GALERIA_PASTA_SUGESTOES,
  getPastaIconName,
  mergePastaSugestoes,
} from '../src/lib/galeriaFolderMeta.js'

const TIPOS_QUERY = `*[_type == "galeriaPastaTipo"]{ _id, nome }`
const PORTFOLIO_PASTAS_QUERY = `array::unique(*[_type == "portfolio"].galeria[].nome)`

/** Cria modelos de pasta no Sanity a partir do portfólio + lista padrão (só se ainda não existir). */
export async function ensureGaleriaPastaTipos(client) {
  const existing = await client.fetch(TIPOS_QUERY)
  if (Array.isArray(existing) && existing.length > 0) return existing.length

  const portfolioPastas = await client.fetch(PORTFOLIO_PASTAS_QUERY)
  const names = mergePastaSugestoes([
    ...GALERIA_PASTA_SUGESTOES,
    ...(Array.isArray(portfolioPastas) ? portfolioPastas : []),
  ])

  const tx = client.transaction()
  names.forEach((nome, index) => {
    tx.create({
      _type: 'galeriaPastaTipo',
      nome,
      icone: getPastaIconName(nome),
      ordem: index,
    })
  })

  await tx.commit({ visibility: 'async' })
  return names.length
}
