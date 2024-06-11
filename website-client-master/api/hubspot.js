import { hubspotCookie } from '../shared/utils'
import { openApi as api } from '@/api'

export const sendForm = (values, context, key) => {
  const data = {
    fields: [...values],
    context: {
      hutk: hubspotCookie(),
      ...context
    }
  }
  api.post(`/hubspot/${key}`, data)
}

export const hubspotForm = {
  websiteSignup: {
    id: '9ee648c4-7ea4-4910-b293-90aab4599cb7',
    pageUri: 'https://360suites.com.br/registrar',
    pageName: 'Autenticação - Cadastro Site'
  },
  googleSignup: {
    id: 'cc9d3796-65dc-4b19-bc6a-4f4d5fdd4e85',
    pageUri: 'https://360suites.com.br/registrar',
    pageName: 'Autenticação - Cadastro Google'
  },
  profile: {
    id: '3c85caad-5d1b-42a9-b7b7-7c69f0b976c0',
    pageUri: 'https://360suites.com.br/perfil',
    pageName: 'Infos Pessoais - Área do Cliente'
  },
  reservationSelect: {
    id: '3371b761-7866-4740-90c2-b0acc50f2f54',
    pageUri: 'https://360suites.com.br/reserva',
    pageName: 'Modal - Pré Reserva'
  },
  reservation: {
    id: 'a0406279-d052-4a30-9bfc-b6720adeb24e',
    pageUri: 'https://360suites.com.br/pagamento',
    pageName: 'Reserva Site'
  },
  digitalCheckin: {
    id: '04719e5f-a5c2-4c69-b489-31719edf1027',
    pageUri: 'https://360suites.com.br/checkin',
    pageName: 'Check-in Digital'
  },
  digitalCheckinUpdate: {
    id: '5b159786-da7b-4eaa-a775-f2cb3b7918e4',
    pageUri: 'https://360suites.com.br/minha-conta/minha-conta/reservas',
    pageName: 'Atualização - Check-in Digital'
  },
  digitalCheckinVehicleUpdate: {
    id: '5fb94086-5702-46a3-bb89-400748f5b74e',
    pageUri: 'https://360suites.com.br/minha-conta/minha-conta/reservas',
    pageName: 'Veículo'
  },
  checkout: {
    id: 'b0e26171-8043-4a64-80a2-ae1b3ec6c863',
    pageUri: 'https://360suites.com.br',
    pageName: 'Realização Check-out'
  },
  rate: {
    id: 'd0e79f7c-fb96-4869-ad21-f74c0e5612c6',
    pageUri: 'https://360suites.com.br/avaliacao',
    pageName: 'Check-out - Avaliações'
  },
  owners: {
    id: 'f05238fe-3619-4527-b9c5-90a36d9e489f',
    pageUri: 'https://proprietarios.360suites.com.br',
    pageName: 'Forms - Proprietários'
  }

}
