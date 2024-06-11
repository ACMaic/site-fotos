import { validateEmail } from '@/shared/utils/email'

export const requiredRules = [v => !!v || 'Campo obrigatório']

export const firstnameRules = [v => !!v || 'Nome é obrigatório',
  v => (v && !!v.trim()) || 'Nome é obrigatório',
  v => /^[-A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/.test(v) || 'Nome inválido']

export const lastnameRules = [v => !!v || 'Sobrenome é obrigatório',
  v => (v && !!v.trim()) || 'Sobrenome é obrigatório',
  v => /^[-A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/.test(v) || 'Sobrenome inválido']

export const emailRules = [
  v => !!v || 'E-mail é obrigatório',
  v => validateEmail(v) || 'E-mail inválido'
]
export const phoneRules = [v => !!v || 'Celular é obrigatório',
  v => (!!v && v.length > 13) || 'Número de celular inválido']

export const foreignPhoneRules = [v => !!v || 'Celular é obrigatório']

export const foreignHomePhoneRules = [v => !!v || 'Telefone é obrigatório']

export const emailOtherRules = [v => validateEmail(v) || 'E-mail inválido']

export const phoneOtherRules = [v => (!!v && v.length > 13) || 'Número de celular inválido']

const passwordLength = [
  v => v.length >= 6 || 'Senha deve ter no minímo 6 caracteres'
]

export const passwordNew = [
  v => (v && !!v.trim()) || 'Nova senha é obrigatória',
  ...passwordLength
]

export const passwordConfirmation = [
  v => (v && !!v.trim()) || 'Confirmação de senha é obrigatória',
  ...passwordLength
]

export const currentPassword = [
  v => (v && !!v.trim()) || 'Senha atual é obrigatória',
  v => v.length >= 6 || 'Senha deve ter no minímo 6 caracteres'
]

export const requiredPassword = [
  v => (v && !!v.trim()) || 'Senha é obrigatória',
  v => v.length >= 6 || 'Senha deve ter no minímo 6 caracteres'
]

export const passwordRequiredOnly = [
  v => (v && !!v.trim()) || 'Senha é obrigatória'
]

export const codeRules = [
  v => !!v || 'Digite o código',
  v => v.length === 6 || 'Código inválido'
]

export const termsAndConditionsRules = [v => !!v || 'Confirme que está de acordo com nossos termos e políticas']
