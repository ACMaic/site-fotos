import { Amplify } from 'aws-amplify'

let domain = ''
if (typeof window !== 'undefined') {
  domain = process.env.NUXT_ENV_NODE === 'DEV' ? 'http://localhost:3000/' : window.location.origin
}

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    userPoolId: process.env.NUXT_ENV_POOL_ID,
    userPoolWebClientId: process.env.NUXT_ENV_COGNITO_CLIENT_ID,
    mandatorySignIn: false,
    federated: {
      google_client_id: process.env.NUXT_ENV_GOOGLE_APP_ID,
      facebook_app_id: process.env.NUXT_ENV_FACEBOOK_APP_ID
    },
    oauth: {
      domain: process.env.NUXT_ENV_DOMAIN,
      redirectSignIn: domain,
      redirectSignOut: process.env.NUXT_ENV_NODE === 'DEV' ? `${domain}entrar` : `${domain}/entrar`,
      clientId: process.env.NUXT_ENV_COGNITO_CLIENT_ID,
      responseType: 'token'
    }
  },
  Analytics: {
    disabled: true
  }
})
