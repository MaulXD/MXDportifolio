import { useEffect, useState } from 'react'
import {
  sanityClient,
  PORTFOLIO_QUERY,
  isSanityConfigured,
  getSanityErrorMessage,
} from './sanityClient'
import { normalizeProject } from './portfolioUtils'

export function usePortfolioProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchProjects() {
      try {
        setLoading(true)
        setError(null)

        if (!isSanityConfigured || !sanityClient) {
          if (!cancelled) {
            setProjects([])
            setError(
              'Sanity não configurado. Crie o arquivo .env com VITE_SANITY_PROJECT_ID e VITE_SANITY_DATASET.',
            )
          }
          return
        }

        const data = await sanityClient.fetch(PORTFOLIO_QUERY)
        const normalized = (Array.isArray(data) ? data : [])
          .map((item) => normalizeProject(item))
          .filter(Boolean)

        if (!cancelled) setProjects(normalized)
      } catch (err) {
        console.error('[Portfolio] Erro ao buscar projetos:', err)
        if (!cancelled) {
          setError(getSanityErrorMessage(err))
          setProjects([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProjects()
    return () => {
      cancelled = true
    }
  }, [])

  return { projects, loading, error }
}
