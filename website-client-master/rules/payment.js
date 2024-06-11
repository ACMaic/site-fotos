export const rgRules = [v => !!v || 'RG é obrigatório',
  v => /(^\d{1,2}).?(\d{3}).?(\d{3})-?(\d{1}|X|x$)/.test(v) || 'RG inválido']

export const passaporteRules = [v => !!v || 'Passaporte é obrigatório']

export const numberRules = [v => !!v || 'Número é obrigatório',
  v => /^[0-9]{0,6}$/.test(v) || 'Número inválido']

export const checkboxInterestsRules = [v => !!v || 'Motivo hospedagem é obrigatório',
  v => (!!v && v.length > 0) || 'Motivo hospedagem é obrigatório']
