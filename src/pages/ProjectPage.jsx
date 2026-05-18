import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ExternalLink,
  Clapperboard,
  Film,
  PenTool,
  Image as ImageIcon,
  Radio,
  Globe,
  Layers,
  HelpCircle,
  Loader2,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import ProjectGallery from '../components/ProjectGallery'
import {
  sanityClient,
  PROJECT_BY_SLUG_QUERY,
  PROJECT_BY_ID_QUERY,
  isSanityConfigured,
  getSanityErrorMessage,
} from '../lib/sanityClient'
import {
  accentMap,
  getCategoryMeta,
  getGallerySummary,
  normalizeProject,
} from '../lib/portfolioUtils'

const CATEGORY_ICONS = {
  Clapperboard,
  Film,
  PenTool,
  Image: ImageIcon,
  Radio,
  Globe,
  Layers,
  HelpCircle,
}
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default function ProjectPage() {
  const { slug: routeKey } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [routeKey])

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!routeKey) return

      try {
        setLoading(true)
        setError(null)

        if (!isSanityConfigured || !sanityClient) {
          if (!cancelled) setError('Sanity não configurado (.env).')
          return
        }

        const decoded = decodeURIComponent(routeKey)
        const isId = UUID_RE.test(decoded)

        const raw = await sanityClient.fetch(
          isId ? PROJECT_BY_ID_QUERY : PROJECT_BY_SLUG_QUERY,
          isId ? { id: decoded } : { slug: decoded },
        )

        const normalized = normalizeProject(raw)
        if (!cancelled) {
          if (!normalized) setError('Projeto não encontrado.')
          else setProject(normalized)
        }
      } catch (err) {
        console.error('[ProjectPage]', err)
        if (!cancelled) setError(getSanityErrorMessage(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [routeKey])

  const meta = project ? getCategoryMeta(project.category) : getCategoryMeta('Motion Design')
  const styles = accentMap[meta.accent] ?? accentMap['neon-violet']
  const Icon = CATEGORY_ICONS[meta.iconName] ?? Clapperboard
  const { valid, label } = getGallerySummary(project?.galeria)

  return (
    <>
      <Navbar />

      <main className="relative mx-auto max-w-4xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <Link
          to="/#portfolio"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-neon-green"
        >
          <ArrowLeft size={16} />
          Voltar ao portfólio
        </Link>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-white/50">
            <Loader2 size={28} className="animate-spin text-neon-green" />
            <p className="text-sm">Carregando projeto…</p>
          </div>
        )}

        {error && !loading && (
          <p className="rounded-xl border border-neon-pink/20 bg-neon-pink/5 px-4 py-3 text-center text-sm text-neon-pink/90">
            {error}
          </p>
        )}

        {project && !loading && !error && (
          <article>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Icon size={18} className={styles.icon} />
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles.badge}`}
                  >
                    {project.category}
                  </span>
                </div>
                <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
                  {project.title}
                </h1>
                <p className="mt-2 text-sm text-white/45">{label}</p>
              </div>

              {project.externalLink && (
                <a
                  href={project.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-neon-green px-4 py-2.5 text-sm font-semibold text-bg-950 transition-shadow hover:shadow-[0_0_20px_rgba(0,255,157,0.35)]"
                >
                  Ver publicado <ExternalLink size={14} />
                </a>
              )}
            </div>

            {valid.length > 0 && (
              <section aria-label="Galeria do projeto">
                <ProjectGallery
                  items={valid}
                  title={project.title}
                  accentClass={styles.pageBorder ?? 'border-white/10'}
                />
              </section>
            )}
          </article>
        )}
      </main>
    </>
  )
}
