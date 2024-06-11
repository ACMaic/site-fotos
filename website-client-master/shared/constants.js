export const OWNERS_PAGE = 'proprietarios'

export const PAYMENT_STATUS_STARTED = 1
export const PAYMENT_STATUS_FORM = 2
export const PAYMENT_STATUS_BLOCKLIST = 1
export const PAYMENT_STATUS_PURCHASE = 3

export const pixInstructions = [
  {
    step: 1,
    text: 'Clique em <span class="primary--text">Gerar código Pix</span> para obter o QR Code de pagamento.'
  },
  {
    step: 2,
    text: 'Abra o app do seu banco ou instituição financeira e entre no ambiente Pix.'
  },
  {
    step: 3,
    text: 'Escolha a opção Pagar com QR Code e escaneie o código que irá aparecer na próxima tela.'
  },
  {
    step: 4,
    text: 'Caso esteja finalizando a reserva pelo seu smartphone, ao ser redirecionado para a página de pagamento, copie o código Pix e cole no seu aplicativo de pagamentos.'
  },
  {
    step: 5,
    text: 'Confirme as informações e finalize a compra.'
  }
]

export const paymentOptions = [
  {
    id: 1,
    name: 'Cartão de Crédito',
    icon: 'fa-solid fa-credit-card'
  },
  {
    id: 2,
    name: 'Pix',
    icon: 'fa-brands fa-pix'
  }
]

export const getInstallments = (totalAmount) => {
  const installments = []
  const maxInstallments = totalAmount >= 500 ? 2 : 1
  for (let i = 1; i <= maxInstallments; i++) {
    installments.push({
      quant: i,
      value: totalAmount / i
    })
  }
  return installments
}
