import { requiredRules } from './'
import { validateEmail } from '@/shared/utils/email'

const defaultRules = [
  ...requiredRules,
  v => (v && !!v.trim()) || 'Campo obrigatório'
]

export const nameRules = [
  ...defaultRules,
  v => /^[-A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/.test(v) || 'Nome inválido'
]

export const metterRules = [v => !!v || 'Campo obrigatório',
  v => (!!v && v > 0) || 'Metragem inválida']

// eslint-disable-next-line no-control-regex
export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const ownerEmailRules = [
  ...defaultRules,
  v => (v && !!v.trim()) || 'E-mail inválido',
  v => validateEmail(v) || 'E-mail inválido'
]

export const ownerPhoneRules = [
  ...defaultRules,
  v => (!!v && v.length > 13) || 'Telefone inválido'
]
