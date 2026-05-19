import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import galeriaItem from './sanity-schema/galeriaItem.js'
import galeriaPasta from './sanity-schema/galeriaPasta.js'
import portfolio from './sanity-schema/portfolio.js'
import { structure } from './sanity-schema/structure.js'

export default defineConfig({
  name: 'default',
  title: 'Portfólio · Raul Luz',
  projectId: 'isd92ph6',
  dataset: 'production',
  plugins: [structureTool({ structure })],
  schema: {
    types: [galeriaItem, galeriaPasta, portfolio],
  },
})
