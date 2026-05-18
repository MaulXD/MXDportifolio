import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import portfolio from './sanity-schema/portfolio.js'

export default defineConfig({
  name: 'default',
  title: 'Portfólio — Raul Luz',
  projectId: 'isd92ph6',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {
    types: [portfolio],
  },
})
