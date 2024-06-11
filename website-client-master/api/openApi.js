import axios from 'axios'

const API_URL = process.env.NUXT_ENV_API_360_SUITES

const openApi = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  baseURL: API_URL
})

export default openApi
