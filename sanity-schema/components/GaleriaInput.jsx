import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Checkbox,
  Label,
  Spinner,
  Stack,
  Text,
  TextInput,
} from '@sanity/ui'
import {
  UploadIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  AddIcon,
} from '@sanity/icons'
import { PatchEvent, set, useClient, useFormValue } from 'sanity'
import { GALERIA_PASTA_PADRAO, mergePastaSugestoes } from '../galeriaFolders.js'
import { getStudioPastaIcon } from '../galeriaFolderIcons.js'

const ACCEPT = 'video/webm,image/png,image/webp,.webm,.png,.webp'
const ACCEPT_LABEL = '.webm · .png · .webp'

const PREVIEW_BOX_STYLE = {
  aspectRatio: '16/10',
  overflow: 'hidden',
  borderRadius: 6,
  background: 'var(--card-muted-bg-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const PREVIEW_MEDIA_STYLE = {
  maxWidth: '100%',
  maxHeight: '100%',
  width: 'auto',
  height: 'auto',
  objectFit: 'contain',
}

function newKey() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

function legendaFromFilename(name = '') {
  return name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim()
}

function inferTipoMedia(mime = '', filename = '') {
  if (mime.startsWith('video/') || /\.webm$/i.test(filename)) return 'Vídeo'
  return 'Imagem'
}

function normalizeItem(item) {
  if (!item || typeof item !== 'object') return null

  if (item._type === 'galeriaItem') {
    return {
      ...item,
      _key: item._key || newKey(),
      _type: 'galeriaItem',
    }
  }

  if (item._type === 'file' && item.asset?._ref) {
    const filename = item.originalFilename || ''
    return {
      _type: 'galeriaItem',
      _key: item._key || newKey(),
      legenda: legendaFromFilename(filename),
      tipoMedia: inferTipoMedia(item.mimeType, filename),
      asset: {
        _type: 'file',
        asset: { _type: 'reference', _ref: item.asset._ref },
      },
    }
  }

  if (item.asset?.asset?._ref || item.asset?._ref) {
    return {
      _type: 'galeriaItem',
      _key: item._key || newKey(),
      legenda: item.legenda || '',
      tipoMedia: item.tipoMedia || 'Imagem',
      asset: item.asset,
    }
  }

  return null
}

function normalizeFolder(entry) {
  if (!entry || typeof entry !== 'object') return null
  const itens = Array.isArray(entry.itens)
    ? entry.itens.map(normalizeItem).filter(Boolean)
    : []
  const nome = (entry.nome || '').trim() || GALERIA_PASTA_PADRAO
  return {
    _type: 'galeriaPasta',
    _key: entry._key || newKey(),
    nome,
    itens,
    exibirNoSite: entry.exibirNoSite !== false,
  }
}

/** Aceita pastas novas ou lista plana legada de galeriaItem. */
function normalizeFolders(value) {
  if (!Array.isArray(value) || value.length === 0) return []

  const first = value[0]
  const isFolderShape =
    first?._type === 'galeriaPasta' ||
    (typeof first?.nome === 'string' && Array.isArray(first?.itens))

  if (isFolderShape) {
    return value.map(normalizeFolder).filter(Boolean)
  }

  const items = value.map(normalizeItem).filter(Boolean)
  if (items.length === 0) return []
  return [
    {
      _type: 'galeriaPasta',
      _key: newKey(),
      nome: 'Geral',
      itens: items,
      exibirNoSite: true,
    },
  ]
}

function buildItem(uploaded, file) {
  return {
    _type: 'galeriaItem',
    _key: newKey(),
    legenda: legendaFromFilename(file.name),
    tipoMedia: inferTipoMedia(file.type, file.name),
    asset: {
      _type: 'file',
      asset: {
        _type: 'reference',
        _ref: uploaded._id,
      },
    },
  }
}

function flattenItems(folders) {
  return folders.flatMap((folder) =>
    (folder.itens || []).map((item) => ({ folderKey: folder._key, item })),
  )
}

function useAssetPreviewUrls(flatItems, client) {
  const [urls, setUrls] = useState({})

  useEffect(() => {
    let cancelled = false

    async function load() {
      const entries = flatItems
        .map(({ item }) => {
          const ref = item?.asset?.asset?._ref
          const key = item?._key
          return ref && key ? { key, ref } : null
        })
        .filter(Boolean)

      if (entries.length === 0) {
        if (!cancelled) setUrls({})
        return
      }

      const pairs = await Promise.all(
        entries.map(async ({ key, ref }) => {
          try {
            const doc = await client.getDocument(ref)
            return [key, doc?.url || null]
          } catch {
            return [key, null]
          }
        }),
      )

      if (!cancelled) {
        const next = {}
        for (const [key, url] of pairs) {
          if (url) next[key] = url
        }
        setUrls(next)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [flatItems, client])

  return urls
}

function MediaCard({
  item,
  url,
  isCover,
  readOnly,
  onLegenda,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}) {
  const isVideo = item.tipoMedia === 'Vídeo'

  return (
    <Card padding={3} radius={2} border>
      <Stack space={3}>
        <Flex align="center" justify="space-between" gap={2}>
          <Text size={0} muted>
            {isCover ? 'Capa do site' : 'Arquivo'}
          </Text>
          {!readOnly && (
            <Flex gap={1}>
              <Button
                icon={ChevronUpIcon}
                mode="bleed"
                padding={2}
                disabled={!canMoveUp}
                onClick={onMoveUp}
                title="Subir"
              />
              <Button
                icon={ChevronDownIcon}
                mode="bleed"
                padding={2}
                disabled={!canMoveDown}
                onClick={onMoveDown}
                title="Descer"
              />
              <Button
                icon={TrashIcon}
                mode="bleed"
                tone="critical"
                padding={2}
                onClick={onRemove}
                title="Remover"
              />
            </Flex>
          )}
        </Flex>

        <Box style={PREVIEW_BOX_STYLE}>
          {url && isVideo ? (
            <video src={url} muted playsInline loop style={PREVIEW_MEDIA_STYLE} />
          ) : url ? (
            <img src={url} alt="" style={PREVIEW_MEDIA_STYLE} />
          ) : (
            <Flex align="center" justify="center" style={{ height: '100%' }}>
              <Spinner muted />
            </Flex>
          )}
        </Box>

        <Stack space={2}>
          <Text size={0} weight="medium">
            Nome no site
          </Text>
          {readOnly ? (
            <Text size={1}>{item.legenda || 'Sem nome'}</Text>
          ) : (
            <TextInput
              value={item.legenda || ''}
              placeholder="Ex.: Tela inicial"
              onChange={(e) => onLegenda(e.currentTarget.value)}
            />
          )}
        </Stack>
      </Stack>
    </Card>
  )
}

export default function GaleriaInput(props) {
  const { value, onChange, readOnly, schemaType } = props
  const client = useClient({ apiVersion: '2024-05-17' })
  const fileInputRef = useRef(null)
  const uploadTargetRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState(null)
  const [novaPastaNome, setNovaPastaNome] = useState('')
  const [remotePastas, setRemotePastas] = useState([])
  const migratedRef = useRef(false)

  const capaMidiaKey = useFormValue(['capaMidiaKey'])
  const folders = useMemo(() => normalizeFolders(value), [value])
  const flatItems = useMemo(() => flattenItems(folders), [folders])
  const assetUrls = useAssetPreviewUrls(flatItems, client)

  const emit = useCallback(
    (next) => {
      onChange(PatchEvent.from(set(next)))
    },
    [onChange],
  )

  useEffect(() => {
    let cancelled = false
    client
      .fetch('array::unique(*[_type == "portfolio"].galeria[].nome)')
      .then((names) => {
        if (!cancelled && Array.isArray(names)) setRemotePastas(names.filter(Boolean))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [client])

  useEffect(() => {
    if (migratedRef.current || readOnly || !Array.isArray(value) || value.length === 0) return
    const needsMigration = value.some(
      (entry) =>
        entry &&
        entry._type !== 'galeriaPasta' &&
        !(typeof entry.nome === 'string' && Array.isArray(entry.itens)),
    )
    if (!needsMigration) return
    const normalized = normalizeFolders(value)
    if (normalized.length > 0) {
      migratedRef.current = true
      emit(normalized)
    }
  }, [value, readOnly, emit])

  const updateFolders = useCallback(
    (updater) => {
      emit(updater(folders))
    },
    [emit, folders],
  )

  const addFolder = useCallback(
    (nome) => {
      const trimmed = (nome || '').trim()
      if (!trimmed) return
      if (folders.some((f) => f.nome.toLowerCase() === trimmed.toLowerCase())) {
        setError(`A pasta "${trimmed}" já existe.`)
        return
      }
      setError(null)
      updateFolders((prev) => [
        ...prev,
        { _type: 'galeriaPasta', _key: newKey(), nome: trimmed, itens: [], exibirNoSite: true },
      ])
      setNovaPastaNome('')
    },
    [folders, updateFolders],
  )

  const removeFolder = useCallback(
    (folderKey) => {
      updateFolders((prev) => prev.filter((f) => f._key !== folderKey))
    },
    [updateFolders],
  )

  const renameFolder = useCallback(
    (folderKey, nome) => {
      updateFolders((prev) =>
        prev.map((f) => (f._key === folderKey ? { ...f, nome } : f)),
      )
    },
    [updateFolders],
  )

  const toggleExibirNoSite = useCallback(
    (folderKey, exibirNoSite) => {
      updateFolders((prev) =>
        prev.map((f) => (f._key === folderKey ? { ...f, exibirNoSite } : f)),
      )
    },
    [updateFolders],
  )

  const updateLegenda = useCallback(
    (folderKey, itemKey, legenda) => {
      updateFolders((prev) =>
        prev.map((folder) =>
          folder._key !== folderKey
            ? folder
            : {
                ...folder,
                itens: folder.itens.map((item) =>
                  item._key === itemKey ? { ...item, legenda } : item,
                ),
              },
        ),
      )
    },
    [updateFolders],
  )

  const removeItem = useCallback(
    (folderKey, itemKey) => {
      updateFolders((prev) =>
        prev.map((folder) =>
          folder._key !== folderKey
            ? folder
            : { ...folder, itens: folder.itens.filter((item) => item._key !== itemKey) },
        ),
      )
    },
    [updateFolders],
  )

  const moveItem = useCallback(
    (folderKey, itemKey, direction) => {
      updateFolders((prev) =>
        prev.map((folder) => {
          if (folder._key !== folderKey) return folder
          const index = folder.itens.findIndex((item) => item._key === itemKey)
          const target = index + direction
          if (index < 0 || target < 0 || target >= folder.itens.length) return folder
          const itens = [...folder.itens]
          const [removed] = itens.splice(index, 1)
          itens.splice(target, 0, removed)
          return { ...folder, itens }
        }),
      )
    },
    [updateFolders],
  )

  const uploadFiles = useCallback(
    async (fileList, folderKey) => {
      if (readOnly || !fileList?.length || !folderKey) return

      setError(null)
      setUploading(true)

      const files = Array.from(fileList).filter((f) => {
        const name = f.name.toLowerCase()
        return (
          f.type.startsWith('image/') ||
          f.type.startsWith('video/') ||
          /\.(webm|png|webp)$/i.test(name)
        )
      })

      if (files.length === 0) {
        setError(`Use apenas ${ACCEPT_LABEL}`)
        setUploading(false)
        return
      }

      const uploadedItems = []

      try {
        for (const file of files) {
          const asset = await client.assets.upload('file', file, {
            filename: file.name,
            contentType: file.type || undefined,
          })
          uploadedItems.push(buildItem(asset, file))
        }

        updateFolders((prev) =>
          prev.map((folder) =>
            folder._key !== folderKey
              ? folder
              : { ...folder, itens: [...folder.itens, ...uploadedItems] },
          ),
        )
      } catch (err) {
        setError(err?.message || 'Falha no upload. Verifique permissões no Sanity.')
      } finally {
        setUploading(false)
        setDragOver(false)
        uploadTargetRef.current = null
      }
    },
    [client, readOnly, updateFolders],
  )

  const openFilePicker = (folderKey) => {
    uploadTargetRef.current = folderKey
    fileInputRef.current?.click()
  }

  const onDrop = (event, folderKey) => {
    event.preventDefault()
    setDragOver(false)
    if (readOnly) return
    uploadFiles(event.dataTransfer?.files, folderKey)
  }

  const firstVisibleFolder = folders.find((f) => f.exibirNoSite !== false)
  const firstItemKey = firstVisibleFolder?.itens?.[0]?._key
  const title = schemaType?.title || 'Galeria do Projeto'

  const isCapaItem = (itemKey, folder) => {
    if (capaMidiaKey) return itemKey === capaMidiaKey
    return folder._key === firstVisibleFolder?._key && itemKey === firstItemKey
  }

  const sugestoesDisponiveis = useMemo(() => {
    const existing = folders.map((f) => f.nome)
    return mergePastaSugestoes([...existing, ...remotePastas]).filter(
      (nome) => !folders.some((f) => f.nome.toLowerCase() === nome.toLowerCase()),
    )
  }, [folders, remotePastas])

  if (readOnly) {
    return (
      <Stack space={4}>
        <Text size={1} weight="semibold">
          {title}
        </Text>
        <Card padding={4} radius={2} tone="caution" border>
          <Text size={1}>
            Este campo está somente leitura. Confira permissões de Editor/Admin no Sanity.
          </Text>
        </Card>
        {folders.map((folder) => {
          const PastaIcon = getStudioPastaIcon(folder.nome)
          return (
          <Card key={folder._key} padding={3} radius={2} border>
            <Stack space={3}>
              <Flex align="center" gap={2}>
                <PastaIcon />
                <Text size={1} weight="semibold">
                  {folder.nome}
                </Text>
              </Flex>
              <Grid columns={[1, 2, 3]} gap={3}>
                {folder.itens.map((item) => (
                  <MediaCard
                    key={item._key}
                    item={item}
                    url={assetUrls[item._key]}
                    readOnly
                  />
                ))}
              </Grid>
            </Stack>
          </Card>
          )
        })}
      </Stack>
    )
  }

  return (
    <Stack space={4}>
      <Stack space={2}>
        <Text size={1} weight="semibold">
          {title}
        </Text>
        <Text size={1} muted>
          Crie pastas (Telas, Painéis, Transições…) e envie arquivos em cada uma. Defina a capa do
          card na seção &quot;Capa do card&quot; abaixo da galeria.
        </Text>
      </Stack>

      <Card padding={3} radius={2} border>
        <Stack space={3}>
          <Label size={1}>Nova pasta</Label>
          <Flex gap={2} wrap="wrap">
            <Box flex={1} style={{ minWidth: 160 }}>
              <TextInput
                value={novaPastaNome}
                placeholder="Nome da pasta"
                onChange={(e) => setNovaPastaNome(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addFolder(novaPastaNome)
                  }
                }}
              />
            </Box>
            <Button
              icon={AddIcon}
              text="Criar pasta"
              tone="primary"
              onClick={() => addFolder(novaPastaNome)}
              disabled={!novaPastaNome.trim()}
            />
          </Flex>
          {sugestoesDisponiveis.length > 0 && (
            <Flex gap={2} wrap="wrap">
              <Text size={0} muted>
                Sugestões:
              </Text>
              {sugestoesDisponiveis.map((nome) => (
                <Button
                  key={nome}
                  text={nome}
                  mode="ghost"
                  fontSize={1}
                  padding={2}
                  onClick={() => addFolder(nome)}
                />
              ))}
            </Flex>
          )}
        </Stack>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT}
        multiple
        hidden
        onChange={(e) => {
          const key = uploadTargetRef.current
          if (key) uploadFiles(e.target.files, key)
          e.target.value = ''
        }}
      />

      {error && (
        <Card padding={3} radius={2} tone="critical" border>
          <Text size={1}>{error}</Text>
        </Card>
      )}

      {folders.length === 0 && (
        <Card padding={4} radius={2} border tone="transparent">
          <Text size={1} muted align="center">
            Crie uma pasta acima para começar a enviar arquivos.
          </Text>
        </Card>
      )}

      {folders.map((folder) => {
        const PastaIcon = getStudioPastaIcon(folder.nome)
        return (
        <Card key={folder._key} padding={4} radius={2} border>
          <Stack space={4}>
            <Flex align="center" justify="space-between" gap={2} wrap="wrap">
              <Flex align="center" gap={2} flex={1} style={{ minWidth: 200 }}>
                <Box style={{ flexShrink: 0, display: 'flex' }}>
                  <PastaIcon />
                </Box>
                <TextInput
                  value={folder.nome}
                  onChange={(e) => renameFolder(folder._key, e.currentTarget.value)}
                />
              </Flex>
              <Flex align="center" gap={2}>
                <Checkbox
                  checked={folder.exibirNoSite !== false}
                  onChange={(e) =>
                    toggleExibirNoSite(folder._key, e.currentTarget.checked)
                  }
                />
                <Text size={1}>Exibir no site</Text>
              </Flex>
              <Button
                icon={TrashIcon}
                mode="bleed"
                tone="critical"
                text="Excluir pasta"
                disabled={folder.itens.length > 0}
                title={
                  folder.itens.length > 0
                    ? 'Remova os arquivos antes de excluir a pasta'
                    : 'Excluir pasta vazia'
                }
                onClick={() => removeFolder(folder._key)}
              />
            </Flex>

            <Card
              padding={4}
              radius={2}
              border
              tone={dragOver ? 'primary' : 'default'}
              style={{
                borderStyle: 'dashed',
                cursor: uploading ? 'wait' : 'pointer',
                opacity: uploading ? 0.85 : 1,
              }}
              onDragEnter={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => onDrop(e, folder._key)}
              onClick={() => !uploading && openFilePicker(folder._key)}
            >
              <Flex align="center" justify="center" direction="column" gap={2}>
                {uploading ? <Spinner muted /> : <UploadIcon style={{ fontSize: 24 }} />}
                <Text align="center" size={1}>
                  Arrastar arquivos para &quot;{folder.nome}&quot; ou clicar
                </Text>
                <Text align="center" size={0} muted>
                  {ACCEPT_LABEL}
                </Text>
              </Flex>
            </Card>

            {folder.itens.length > 0 && (
              <Grid columns={[1, 2, 3]} gap={3}>
                {folder.itens.map((item, itemIndex) => {
                  const isCover = isCapaItem(item._key, folder)

                  return (
                    <MediaCard
                      key={item._key}
                      item={item}
                      url={assetUrls[item._key]}
                      isCover={isCover}
                      canMoveUp={itemIndex > 0}
                      canMoveDown={itemIndex < folder.itens.length - 1}
                      onLegenda={(legenda) => updateLegenda(folder._key, item._key, legenda)}
                      onRemove={() => removeItem(folder._key, item._key)}
                      onMoveUp={() => moveItem(folder._key, item._key, -1)}
                      onMoveDown={() => moveItem(folder._key, item._key, 1)}
                    />
                  )
                })}
              </Grid>
            )}
          </Stack>
        </Card>
        )
      })}
    </Stack>
  )
}
