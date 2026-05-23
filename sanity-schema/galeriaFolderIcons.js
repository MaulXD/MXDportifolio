import {
  BellIcon,
  DesktopIcon,
  DocumentIcon,
  DocumentsIcon,
  FolderIcon,
  ImageIcon,
  PlayIcon,
  SparklesIcon,
  ThLargeIcon,
} from '@sanity/icons'
import { getPastaIconName } from '../src/lib/galeriaFolderMeta.js'

const STUDIO_PASTA_ICONS = {
  Monitor: DesktopIcon,
  LayoutPanel: ThLargeIcon,
  PanelsTopLeft: ThLargeIcon,
  Sparkles: SparklesIcon,
  Film: PlayIcon,
  Shapes: DocumentsIcon,
  Bell: BellIcon,
  FileImage: DocumentIcon,
  Image: ImageIcon,
  Folder: FolderIcon,
  FolderOpen: FolderIcon,
}

export function getStudioPastaIconByKey(iconKey) {
  if (!iconKey) return FolderIcon
  return STUDIO_PASTA_ICONS[iconKey] ?? FolderIcon
}

export function getStudioPastaIcon(nome, iconMap = null, pastaIcone = null) {
  const iconName = getPastaIconName(nome, iconMap, pastaIcone)
  return getStudioPastaIconByKey(iconName)
}
