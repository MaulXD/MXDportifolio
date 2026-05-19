import { buildWhatsAppMessage, validateForm, SITE_LABEL, STREAM_PACK_LABEL } from '../src/lib/budgetFormUtils.js'

const base = {
  fullName: 'Maria Silva',
  phone: '(82) 99999-9999',
  personType: 'pf',
  cnpj: '',
  selectedServices: [SITE_LABEL, STREAM_PACK_LABEL],
  siteTypes: ['Landing page para eventos', 'Blog'],
  streamItems: ['Alertas: follow, sub, donate'],
  notes: 'Prazo em 30 dias',
}

const { valid, errors } = validateForm(base)
if (!valid) {
  console.error('validateForm failed:', errors)
  process.exit(1)
}

const message = buildWhatsAppMessage(base)
const expectedSnippets = [
  'Olá Raul! Gostaria de um orçamento.',
  'Nome: Maria Silva',
  '  • Site / Landing page',
  'Tipos de site:',
  '  • Landing page para eventos',
  '  • Blog',
  'Stream pack:',
  '  • Alertas: follow, sub, donate',
  'Observações:',
  'Prazo em 30 dias',
]

for (const snippet of expectedSnippets) {
  if (!message.includes(snippet)) {
    console.error('Missing in message:', snippet)
    console.error('Full message:\n', message)
    process.exit(1)
  }
}

const missingSite = validateForm({ ...base, siteTypes: [] })
if (missingSite.valid || !missingSite.errors.siteTypes) {
  console.error('Expected siteTypes validation error')
  process.exit(1)
}

console.log('OK — budget form message and validation')
console.log('--- sample message ---\n' + message)
