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
      useCdn: true,
    })
  : null

export const PORTFOLIO_QUERY = `*[_type == "portfolio"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  mediaType,
  "legacyMediaUrl": coalesce(mediaFile.asset->url, null),
  "galeria": coalesce(
    galeria[]{
      "tipoMedia": coalesce(tipoMedia, "Imagem"),
      "mediaUrl": coalesce(asset.asset->url, asset->url, null)
    },
    []
  ),
  externalLink
}`
