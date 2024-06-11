import { cpfRules, passaporteRules, requiredRules, rgRules } from '@/rules'

const getDocumentIdMaks = (form) => {
  if (form.typeDocumentId) {
    const masksByDocumentsIds = {
      cpf: '###.###.###-##',
      rg: ['##.###.###-#', '#.###.###-#'],
      passaporte: '*'
    }
    return masksByDocumentsIds[String(form.typeDocumentId).toLowerCase()]
  }
  return ''
}

const getDocumentIdRules = (form) => {
  if (form.typeDocumentId) {
    const typeDocumentId = form.typeDocumentId.toLowerCase()
    switch (typeDocumentId) {
      case 'cpf':
        return cpfRules
      case 'rg':
        return rgRules
      case 'passaporte':
        return passaporteRules
    }
  }

  return requiredRules
}

export default {
  getDocumentIdMaks,
  getDocumentIdRules
}
