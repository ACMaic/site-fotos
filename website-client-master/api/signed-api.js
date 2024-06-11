import axios from 'axios'
import { Auth } from 'aws-amplify'
const API_URL = process.env.NUXT_ENV_API_360_SUITES

const signedApi = axios.create({
  headers: {
    'Content-Type': 'application/json'

  },
  baseURL: API_URL
})

signedApi.interceptors.request.use(
  async (config) => {
    const token = await Auth.currentSession().then((session) => {
      return session.getIdToken().getJwtToken()
    })
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

signedApi.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      Auth.signOut()
      this.$router.push('/')
      return Promise.reject(error)
    } else {
      return Promise.reject(error)
    }
  }
)

export default signedApi
