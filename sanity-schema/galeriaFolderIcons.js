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
  Sparkles: SparklesIcon,
  Film: PlayIcon,
  Shapes: DocumentsIcon,
  Bell: BellIcon,
  FileImage: DocumentIcon,
  Image: ImageIcon,
  Folder: FolderIcon,
  FolderOpen: FolderIcon,
}

export function getStudioPastaIcon(nome) {
  const iconName = getPastaIconName(nome)
  return STUDIO_PASTA_ICONS[iconName] ?? FolderIcon
}
