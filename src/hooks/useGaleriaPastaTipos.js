import { useEffect, useState } from 'react'
import { GALERIA_PASTA_TIPOS_QUERY, isSanityConfigured, sanityClient } from '../lib/sanityClient'
import { buildPastaIconMap } from '../lib/galeriaFolderMeta'

export function useGaleriaPastaTipos() {
  const [tipos, setTipos] = useState([])
  const [iconMap, setIconMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        if (!isSanityConfigured || !sanityClient) {
          if (!cancelled) {
            setTipos([])
            setIconMap({})
          }
          return
        }

        const data = await sanityClient.fetch(GALERIA_PASTA_TIPOS_QUERY)
        const list = Array.isArray(data) ? data : []
        if (!cancelled) {
          setTipos(list)
          setIconMap(buildPastaIconMap(list))
        }
      } catch (err) {
        console.warn('[Galeria] Tipos de pasta não carregados:', err)
        if (!cancelled) {
          setTipos([])
          setIconMap({})
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { tipos, iconMap, loading }
}
