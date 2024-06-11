import { validate as validateCPF } from 'gerador-validador-cpf'
import { differenceInYears, differenceInMonths, isValid, parseISO, isAfter, isBefore, parse } from 'date-fns'

export const today = new Date().setHours(0, 0, 0, 0)

export const validDate = new Date(1900, 0, 1)

export const getParsedDate = (dateToParse) => {
  return parse(dateToParse, 'dd/MM/yyyy', today)
}

const noSpecialChars = (value) => {
  const regex = /^[a-zA-Z0-9À-ú\s]+$/
  if (!regex.test(value)) {
    return false
  }
  return true
}

export const noSpecialCharsRules = [
  v => noSpecialChars(v) || 'Caracteres especiais não são permitidos'
]

export function isUserOlderThan18 (dob) {
  const yearsDiff = differenceInYears(new Date(), new Date(dob))
  const monthsDiff = differenceInMonths(new Date(), new Date(dob))

  return yearsDiff > 18 || (yearsDiff === 18 && monthsDiff >= 0)
}

export const genderRules = [
  v => !!v || 'Gênero é obrigatório'
]

export const cpfRules = [
  v => (!!v && validateCPF(v)) || 'CPF é inválido'
]

export const cepRules = [
  v => (!!v && v.length >= 9) || 'CEP deve ter no miní­mo 8 caracteres'
]

export const birthdateRules = [
  v => !!v || 'Data de nascimento é obrigatória',
  v => (!!v && v.length === 10) || 'Data inválida',
  v => isValid(parseISO(v)) || 'Data inválida',
  v => isAfter(parseISO(v), validDate) || 'Data inválida',
  v => isBefore(parseISO(v), today) || 'Data inválida',
  v => (!!v && isUserOlderThan18(v)) ||
  'Idade mínima 18 anos'
]

export const minorBirthdateRules = [
  v => !!v || 'Data de nascimento é obrigatória',
  v => (!!v && v.length === 10) || 'Data inválida',
  v => isValid(parseISO(v)) || 'Data inválida',
  v => isAfter(parseISO(v), validDate) || 'Data inválida',
  v => isBefore(parseISO(v), today) || 'Data inválida'
]

export const homePhoneRules = [
  v => (!!v && v.length >= 14) || 'Telefone inválido'
]

export const ddiRules = [
  v => !!v || 'DDI do celular é obrigatório'
]
