import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  Grid,
  Label,
  Spinner,
  Stack,
  Text,
} from '@sanity/ui'
import { DragHandleIcon, EditIcon, RefreshIcon } from '@sanity/icons'
import { useClient } from 'sanity'
import { IntentLink } from 'sanity/router'
import { getStudioCategoryIcon } from '../portfolioIcons.js'
import { getStudioTabs, normalizeCategory } from '../../src/lib/portfolioCategories.js'
import {
  normalizeStudioProject,
  projectsForTab,
  sortByOrdem,
} from '../studioProjectUtils.js'
const MANAGER_QUERY = `*[_type == "portfolio"] {
  _id,
  title,
  category,
  exibirEmTodos,
  exibirNaCategoria,
  ordemGeral,
  ordemCategoria,
  capaMidiaKey,
  galeria[]{
    nome,
    exibirNoSite,
    itens[]{
      _key,
      tipoMedia,
      "mediaUrl": coalesce(asset.asset->url, asset->url),
      "mimeType": coalesce(asset.asset->mimeType, asset->mimeType)
    }
  }
}`

const THUMB_STYLE = {
  aspectRatio: '4/3',
  borderRadius: 6,
  overflow: 'hidden',
  background: 'var(--card-muted-bg-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const MEDIA_STYLE = {
  maxWidth: '100%',
  maxHeight: '100%',
  width: 'auto',
  height: 'auto',
  objectFit: 'contain',
}

async function ensureOrderFields(client, projects) {
  const tx = client.transaction()
  let changed = false

  const needGeral = projects.some((p) => typeof p.ordemGeral !== 'number')
  if (needGeral) {
    const sorted = sortByOrdem(projects, 'Todos')
    sorted.forEach((p, index) => {
      if (typeof p.ordemGeral !== 'number') {
        tx.patch(p._id, { set: { ordemGeral: index } })
        changed = true
      }
    })
  }

  const categoriesInUse = [
    ...new Set(
      projects.map((p) => normalizeCategory(p.category)).filter(Boolean),
    ),
  ]

  for (const cat of categoriesInUse) {
    const inCat = projects.filter((p) => normalizeCategory(p.category) === cat)
    if (!inCat.some((p) => typeof p.ordemCategoria !== 'number')) continue
    const sorted = sortByOrdem(inCat, cat)
    sorted.forEach((p, index) => {
      if (typeof p.ordemCategoria !== 'number') {
        tx.patch(p._id, { set: { ordemCategoria: index } })
        changed = true
      }
    })
  }

  if (changed) await tx.commit({ visibility: 'async' })
}

function SortableProjectCard({ project, tab, onToggle, disabled }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project._id,
    disabled,
  })

  const CategoryIcon = getStudioCategoryIcon(project.category)
  const cover = project.cover
  const isVideo = cover?.tipoMedia === 'Vídeo'
  const hiddenOnTab =
    tab === 'Todos' ? !project.exibirEmTodos : !project.exibirNaCategoria

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.65 : hiddenOnTab ? 0.45 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      padding={3}
      radius={2}
      border
      tone={hiddenOnTab ? 'transparent' : 'default'}
    >
      <Stack space={3}>
        <Flex align="center" justify="space-between" gap={2}>
          <Button
            icon={DragHandleIcon}
            mode="bleed"
            padding={2}
            disabled={disabled}
            style={{ cursor: disabled ? 'default' : 'grab' }}
            {...attributes}
            {...listeners}
            title="Arrastar para reordenar"
          />
          <Flex align="center" gap={1} style={{ minWidth: 0, flex: 1 }}>
            <CategoryIcon />
            <Text size={1} weight="semibold" textOverflow="ellipsis">
              {project.title}
            </Text>
          </Flex>
          <IntentLink intent="edit" params={{ id: project._id, type: 'portfolio' }}>
            <Button icon={EditIcon} mode="bleed" padding={2} title="Editar projeto" />
          </IntentLink>
        </Flex>

        <Box style={THUMB_STYLE}>
          {cover?.mediaUrl && isVideo ? (
            <video src={cover.mediaUrl} muted playsInline loop style={MEDIA_STYLE} />
          ) : cover?.mediaUrl ? (
            <img src={cover.mediaUrl} alt="" style={MEDIA_STYLE} />
          ) : (
            <Text size={0} muted>
              Sem capa
            </Text>
          )}
        </Box>

        <Text size={0} muted>
          {project.category}
        </Text>

        <Stack space={2}>
          <Flex align="center" gap={2}>
            <Checkbox
              checked={project.exibirEmTodos}
              disabled={disabled}
              onChange={() => onToggle(project._id, 'exibirEmTodos', !project.exibirEmTodos)}
            />
            <Label style={{ flex: 1 }}>Exibir em Todos (geral)</Label>
          </Flex>
          <Flex align="center" gap={2}>
            <Checkbox
              checked={project.exibirNaCategoria}
              disabled={disabled}
              onChange={() =>
                onToggle(project._id, 'exibirNaCategoria', !project.exibirNaCategoria)
              }
            />
            <Label style={{ flex: 1 }}>
              Exibir no filtro {project.category}
            </Label>
          </Flex>
        </Stack>
      </Stack>
    </Card>
  )
}

export default function PortfolioManager() {
  const client = useClient({ apiVersion: '2024-05-17' })
  const [tab, setTab] = useState('Todos')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await client.fetch(MANAGER_QUERY)
      const normalized = (Array.isArray(data) ? data : [])
        .map(normalizeStudioProject)
        .filter(Boolean)
      await ensureOrderFields(client, normalized)
      const refreshed = await client.fetch(MANAGER_QUERY)
      setProjects(
        (Array.isArray(refreshed) ? refreshed : []).map(normalizeStudioProject).filter(Boolean),
      )
    } catch (err) {
      setError(err?.message || 'Não foi possível carregar os projetos.')
    } finally {
      setLoading(false)
    }
  }, [client])

  useEffect(() => {
    load()
  }, [load])

  const studioTabs = useMemo(
    () => getStudioTabs(projects.map((p) => p.category).filter(Boolean)),
    [projects],
  )

  const tabProjects = useMemo(() => projectsForTab(projects, tab), [projects, tab])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const persistOrder = useCallback(
    async (ordered, activeTab) => {
      const field = activeTab === 'Todos' ? 'ordemGeral' : 'ordemCategoria'
      const tx = client.transaction()
      ordered.forEach((p, index) => {
        tx.patch(p._id, { set: { [field]: index } })
      })
      setSaving(true)
      try {
        await tx.commit({ visibility: 'async' })
        setProjects((prev) =>
          prev.map((p) => {
            const idx = ordered.findIndex((o) => o._id === p._id)
            if (idx === -1) return p
            return { ...p, [field]: idx }
          }),
        )
      } finally {
        setSaving(false)
      }
    },
    [client],
  )

  const onDragEnd = useCallback(
    async (event) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const oldIndex = tabProjects.findIndex((p) => p._id === active.id)
      const newIndex = tabProjects.findIndex((p) => p._id === over.id)
      if (oldIndex < 0 || newIndex < 0) return

      const reordered = arrayMove(tabProjects, oldIndex, newIndex)
      await persistOrder(reordered, tab)
    },
    [tabProjects, tab, persistOrder],
  )

  const onToggle = useCallback(
    async (id, field, value) => {
      setSaving(true)
      try {
        await client.patch(id).set({ [field]: value }).commit({ visibility: 'async' })
        setProjects((prev) => prev.map((p) => (p._id === id ? { ...p, [field]: value } : p)))
      } finally {
        setSaving(false)
      }
    },
    [client],
  )

  const visibleCount = tabProjects.filter((p) =>
    tab === 'Todos' ? p.exibirEmTodos : p.exibirNaCategoria,
  ).length

  return (
    <Box padding={4} sizing="border">
      <Stack space={4}>
        <Flex align="flex-start" justify="space-between" gap={3} wrap="wrap">
          <Stack space={2} style={{ maxWidth: 560 }}>
            <Text size={2} weight="semibold">
              Organizar portfólio no site
            </Text>
            <Text size={1} muted>
              Arraste os cards para definir a ordem. Use as caixas para escolher o que aparece em{' '}
              <strong>Todos (geral)</strong> e o que aparece só no filtro da categoria. As miniaturas
              usam a capa definida em cada projeto.
            </Text>
          </Stack>
          <Button
            icon={RefreshIcon}
            text="Recarregar"
            mode="ghost"
            onClick={load}
            disabled={loading || saving}
          />
        </Flex>

        {error && (
          <Card padding={3} radius={2} tone="critical" border>
            <Text size={1}>{error}</Text>
          </Card>
        )}

        <Flex gap={2} wrap="wrap">
          {studioTabs.map((name) => {
            const Icon = getStudioCategoryIcon(name)
            const active = tab === name
            const count =
              name === 'Todos'
                ? projects.length
                : projects.filter((p) => normalizeCategory(p.category) === name).length
            return (
              <Button
                key={name}
                icon={Icon}
                text={`${name} (${count})`}
                mode={active ? 'default' : 'ghost'}
                tone={active ? 'positive' : 'default'}
                onClick={() => setTab(name)}
              />
            )
          })}
        </Flex>

        <Text size={0} muted>
          {tab === 'Todos'
            ? `${visibleCount} de ${tabProjects.length} visíveis em Todos · ordem do geral`
            : `${visibleCount} de ${tabProjects.length} visíveis em ${tab} · ordem da categoria`}
          {saving ? ' · salvando…' : ''}
        </Text>

        {loading ? (
          <Flex align="center" justify="center" padding={5}>
            <Spinner muted />
          </Flex>
        ) : tabProjects.length === 0 ? (
          <Card padding={4} radius={2} border>
            <Text size={1} muted align="center">
              {tab === 'Todos'
                ? 'Nenhum projeto cadastrado. Crie um em Projetos (editar detalhes).'
                : `Nenhum projeto na categoria ${tab}.`}
            </Text>
          </Card>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={tabProjects.map((p) => p._id)} strategy={rectSortingStrategy}>
              <Grid columns={[1, 2, 3, 4]} gap={3}>
                {tabProjects.map((project) => (
                  <SortableProjectCard
                    key={project._id}
                    project={project}
                    tab={tab}
                    onToggle={onToggle}
                    disabled={saving}
                  />
                ))}
              </Grid>
            </SortableContext>
          </DndContext>
        )}
      </Stack>
    </Box>
  )
}
