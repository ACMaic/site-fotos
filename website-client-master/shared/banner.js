
export const images = [
  'https://assets.360suites.com.br/website/home.webp',
  'https://assets.360suites.com.br/website/home3.webp',
  'https://assets.360suites.com.br/website/home7.webp'
]

export function formatDate (date) {
  if (!date) { return null }
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}
