export const currency360 = {
  filters: {
    currency (value = '') {
      return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    }
  }
}

export const percent360 = {
  filters: {
    percent (value = '') {
      return value.toLocaleString('pt-br', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }
  }
}
