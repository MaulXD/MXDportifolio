import { createClient } from '@sanity/client'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'isd92ph6'
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'

const isValidProjectId = /^[a-z0-9-]+$/.test(projectId)

export const isSanityConfigured = isValidProjectId && Boolean(projectId)

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-05-17',
      // CDN retorna 404 neste projeto; API direta funciona e é pública para leitura
      useCdn: false,
    })
  : null

const PORTFOLIO_FIELDS = `{
  _id,
  title,
  "slug": slug.current,
  category,
  descricao,
  "legacyMediaUrl": coalesce(mediaFile.asset->url, null),
  "legacyMediaType": coalesce(mediaType, "Imagem"),
  "galeriaEntries": galeria[]{
    _type,
    nome,
    exibirNoSite,
    itens[]{
      "legenda": coalesce(legenda, ""),
      "tipoMedia": coalesce(
        tipoMedia,
        select(
          coalesce(asset.asset->mimeType, asset->mimeType, "") match "video/*" => "Vídeo",
          "Imagem"
        )
      ),
      "mediaUrl": coalesce(asset.asset->url, asset->url),
      "filename": coalesce(asset.asset.originalFilename, asset->originalFilename),
      "mimeType": coalesce(asset.asset.mimeType, asset->mimeType)
    },
    "legenda": coalesce(legenda, ""),
    "tipoMedia": coalesce(
      tipoMedia,
      select(
        coalesce(asset.asset->mimeType, asset->mimeType, "") match "video/*" => "Vídeo",
        "Imagem"
      )
    ),
    "mediaUrl": coalesce(asset.asset->url, asset->url),
    "filename": coalesce(asset.asset.originalFilename, asset->originalFilename),
    "mimeType": coalesce(asset.asset.mimeType, asset->mimeType)
  },
  externalLink
}`

export const PORTFOLIO_QUERY = `*[_type == "portfolio"] | order(_createdAt desc) ${PORTFOLIO_FIELDS}`

export const PROJECT_BY_SLUG_QUERY = `*[_type == "portfolio" && slug.current == $slug][0] ${PORTFOLIO_FIELDS}`

export const PROJECT_BY_ID_QUERY = `*[_type == "portfolio" && _id == $id][0] ${PORTFOLIO_FIELDS}`

/** Mensagem amigável conforme o tipo de falha */
export function getSanityErrorMessage(err) {
  const msg = err?.message ?? String(err)
  if (/cors|blocked|fetch failed/i.test(msg)) {
    return 'CORS bloqueou a API do Sanity. Em sanity.io/manage → API → CORS, adicione http://localhost:5173 e o domínio do site publicado.'
  }
  if (/404|not found/i.test(msg)) {
    return 'Projeto ou dataset do Sanity não encontrado. Confira VITE_SANITY_PROJECT_ID e VITE_SANITY_DATASET no .env.'
  }
  return `Erro ao carregar projetos: ${msg}`
}
