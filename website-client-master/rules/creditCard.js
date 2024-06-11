export const cardNumberRules = [
  v => !!v || 'Número do cartão é obrigatório',
  v => v.length === 19 || 'Número inválido'
]

export const securityCodeRules = [
  v => !!v || 'Código de segurança é obrigatório',
  v => v.length === 3 || 'CVV inválido'
]

export const expirationDateRules = [
  v => !!v || 'Data de validade é obrigatória',
  v => v.length === 5 || 'Data inválida'
]
