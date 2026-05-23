import {
  Bell,
  FileImage,
  Film,
  Folder,
  FolderOpen,
  Image as ImageIcon,
  LayoutPanel,
  Monitor,
  Shapes,
  Sparkles,
} from 'lucide-react'
import { getPastaIconName } from '../lib/galeriaFolderMeta'

const PASTA_LUCIDE_ICONS = {
  Monitor,
  LayoutPanel,
  Sparkles,
  Film,
  Shapes,
  Bell,
  FileImage,
  Image: ImageIcon,
  Folder,
  FolderOpen,
}

export default function PastaTabIcon({
  nome,
  pastaIcone = null,
  iconMap = null,
  size = 18,
  strokeWidth = 2.25,
  className = '',
}) {
  const iconName = getPastaIconName(nome, iconMap, pastaIcone)
  const Icon = PASTA_LUCIDE_ICONS[iconName] ?? Folder
  return <Icon className={className} size={size} strokeWidth={strokeWidth} aria-hidden />
}
