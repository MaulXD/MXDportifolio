import {
  ThLargeIcon,
  PlayIcon,
  DocumentVideoIcon,
  EarthGlobeIcon,
  ImageIcon,
  EditIcon,
  DocumentsIcon,
} from '@sanity/icons'
import { PORTFOLIO_CATEGORIES } from '../src/lib/portfolioCategories.js'

/** Ícones do Studio alinhados às categorias do site. */
export const STUDIO_CATEGORY_ICONS = {
  Todos: ThLargeIcon,
  Motions: PlayIcon,
  Streampacks: DocumentVideoIcon,
  Sites: EarthGlobeIcon,
  Ilustrações: ImageIcon,
  Logotipos: EditIcon,
  'Banners e Folders': DocumentsIcon,
}

export const STUDIO_TABS = ['Todos', ...PORTFOLIO_CATEGORIES]

export function getStudioCategoryIcon(category) {
  return STUDIO_CATEGORY_ICONS[category] ?? DocumentsIcon
}
