import axios from 'axios'

const IBGE_URL = process.env.NUXT_ENV_API_IBGE
const VIA_CEP_URL = process.env.NUXT_ENV_API_VIA_CEP

const cepApi = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  baseURL: VIA_CEP_URL
})

const ibgeApi = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  baseURL: IBGE_URL
})

export { cepApi, ibgeApi }
