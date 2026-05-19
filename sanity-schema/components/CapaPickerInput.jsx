import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Button, Card, Flex, Grid, Spinner, Stack, Text } from '@sanity/ui'
import { ImageIcon, StarFilledIcon, StarIcon } from '@sanity/icons'
import { PatchEvent, set, unset, useClient, useFormValue } from 'sanity'
import { listGaleriaItensForCapa } from '../capaUtils.js'

const PREVIEW_BOX = {
  aspectRatio: '16/10',
  overflow: 'hidden',
  borderRadius: 6,
  background: 'var(--card-muted-bg-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const PREVIEW_MEDIA = {
  maxWidth: '100%',
  maxHeight: '100%',
  width: 'auto',
  height: 'auto',
  objectFit: 'contain',
}

function useItemPreviewUrls(entries, client) {
  const [urls, setUrls] = useState({})

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!entries?.length) {
        if (!cancelled) setUrls({})
        return
      }

      const pairs = await Promise.all(
        entries.map(async (entry) => {
          if (!entry.ref) return [entry.key, null]
          try {
            const doc = await client.getDocument(entry.ref)
            return [entry.key, doc?.url || null]
          } catch {
            return [entry.key, null]
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
  }, [entries, client])

  return urls
}

export default function CapaPickerInput(props) {
  const { value: capaMidiaKey, onChange, readOnly } = props
  const client = useClient({ apiVersion: '2024-05-17' })
  const galeria = useFormValue(['galeria'])

  const entries = useMemo(() => {
    const listed = listGaleriaItensForCapa(galeria)
    return listed.map((entry) => {
      const folder = Array.isArray(galeria)
        ? galeria.find((f) =>
            (f.itens || []).some((it) => it._key === entry.key),
          )
        : null
      const item = folder?.itens?.find((it) => it._key === entry.key)
      const ref = item?.asset?.asset?._ref || item?.asset?._ref
      return { ...entry, ref }
    })
  }, [galeria])

  const assetUrls = useItemPreviewUrls(entries, client)

  const setCapa = useCallback(
    (key) => {
      if (readOnly) return
      onChange(PatchEvent.from(key ? set(key) : unset()))
    },
    [onChange, readOnly],
  )

  const selectedKey =
    capaMidiaKey && entries.some((e) => e.key === capaMidiaKey) ? capaMidiaKey : null

  if (!entries.length) {
    return (
      <Card padding={4} radius={2} border tone="transparent">
        <Text size={1} muted>
          Envie arquivos na galeria acima para escolher a capa do card no site.
        </Text>
      </Card>
    )
  }

  return (
    <Stack space={4}>
      <Stack space={2}>
        <Text size={1} weight="semibold">
          Capa do card no site
        </Text>
        <Text size={1} muted>
          Escolha qual foto ou vídeo aparece na miniatura do portfólio. Se nenhuma estiver
          selecionada, usamos a primeira mídia visível da galeria.
        </Text>
      </Stack>

      <Flex gap={2} wrap="wrap">
        <Button
          text="Automático (primeira mídia visível)"
          mode={selectedKey ? 'ghost' : 'default'}
          tone={selectedKey ? 'default' : 'positive'}
          icon={StarIcon}
          disabled={readOnly}
          onClick={() => setCapa(null)}
        />
      </Flex>

      <Grid columns={[1, 2, 3]} gap={3}>
        {entries.map((entry) => {
          const url = assetUrls[entry.key]
          const selected = entry.key === selectedKey
          const isVideo = entry.tipoMedia === 'Vídeo'

          return (
            <Card
              key={entry.key}
              padding={3}
              radius={2}
              border
              tone={selected ? 'positive' : 'default'}
              style={{
                outline: selected ? '2px solid var(--card-focus-ring-color)' : undefined,
              }}
            >
              <Stack space={3}>
                <Flex align="center" justify="space-between" gap={2}>
                  <Text size={0} weight="medium">
                    {entry.legenda || 'Sem nome'}
                  </Text>
                  {selected ? (
                    <StarFilledIcon style={{ color: 'var(--card-focus-ring-color)' }} />
                  ) : null}
                </Flex>

                <Box style={PREVIEW_BOX}>
                  {url && isVideo ? (
                    <video src={url} muted playsInline loop style={PREVIEW_MEDIA} />
                  ) : url ? (
                    <img src={url} alt="" style={PREVIEW_MEDIA} />
                  ) : (
                    <Spinner muted />
                  )}
                </Box>

                <Text size={0} muted>
                  {entry.pasta}
                  {!entry.exibirPasta ? ' · oculta no site' : ''}
                  {' · '}
                  {isVideo ? 'Vídeo' : 'Imagem'}
                </Text>

                <Button
                  text={selected ? 'Capa selecionada' : 'Usar como capa'}
                  tone={selected ? 'positive' : 'primary'}
                  mode={selected ? 'default' : 'ghost'}
                  icon={selected ? StarFilledIcon : ImageIcon}
                  disabled={readOnly || selected}
                  onClick={() => setCapa(entry.key)}
                />
              </Stack>
            </Card>
          )
        })}
      </Grid>
    </Stack>
  )
}
