export const STREAM_PACK_LABEL = 'Stream pack'
export const SITE_LABEL = 'Site / Landing page'

export function buildWhatsAppMessage(data) {
  const {
    fullName,
    phone,
    personType,
    cnpj,
    selectedServices,
    siteTypes,
    streamItems,
    notes,
  } = data

  const lines = [
    'Olá Raul! Gostaria de um orçamento.',
    '',
    `Nome: ${fullName.trim()}`,
    `Telefone: ${phone.trim()}`,
    `Tipo: ${personType === 'pj' ? 'Pessoa Jurídica' : 'Pessoa Física'}`,
  ]

  if (personType === 'pj') {
    lines.push(`CNPJ: ${cnpj.trim()}`)
  }

  lines.push('', 'O que você precisa:')
  selectedServices.forEach((item) => lines.push(`  • ${item}`))

  if (selectedServices.includes(STREAM_PACK_LABEL)) {
    lines.push('', 'Stream pack:')
    streamItems.forEach((item) => lines.push(`  • ${item}`))
  }

  if (selectedServices.includes(SITE_LABEL) && siteTypes.length > 0) {
    lines.push('', 'Tipos de site:')
    siteTypes.forEach((item) => lines.push(`  • ${item}`))
  }

  if (notes.trim()) {
    lines.push('', 'Observações:', notes.trim())
  }

  return lines.join('\n')
}

export function validateForm(data) {
  const next = {}
  const hasStream = data.selectedServices.includes(STREAM_PACK_LABEL)
  const hasSite = data.selectedServices.includes(SITE_LABEL)

  if (!data.personType) next.personType = 'Selecione Pessoa Física ou Jurídica.'
  if (data.personType === 'pj' && !data.cnpj.trim()) next.cnpj = 'Informe o CNPJ.'
  if (!data.fullName.trim()) next.fullName = 'Informe seu nome completo.'
  if (!data.phone.trim()) next.phone = 'Informe seu telefone.'
  if (data.selectedServices.length === 0) {
    next.selectedServices = 'Marque pelo menos um serviço.'
  }
  if (hasStream && data.streamItems.length === 0) {
    next.streamItems = 'Selecione ao menos um item do stream pack.'
  }
  if (hasSite && data.siteTypes.length === 0) {
    next.siteTypes = 'Selecione ao menos um tipo de site.'
  }

  return { valid: Object.keys(next).length === 0, errors: next }
}
