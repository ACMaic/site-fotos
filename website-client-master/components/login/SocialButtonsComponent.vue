<template>
  <v-container fluid>
    <div class="mx-auto d-flex flex-column">
      <!-- <v-btn depressed color="#3b5998" class="radius-login-360 mb-3 d-flex align-center justify-center text-medium-xxs text-unset" height="50px" @click="signInWithFacebook">
        <div class="white--text d-flex align-center justify-center">
          <v-img src="https://assets.360suites.com.br/social-media/facebook-logo.svg" width="10px" class="mr-2" />
          Entrar com o Facebook
        </div>
      </v-btn> -->

      <v-btn outlined height="50px" color="#d9d9d9" class="radius-login-360 mb-3 text-medium-xxs text-unset" @click="signInWithGoogle">
        <div class="black--text txt-hover d-flex align-center justify-center">
          <v-img src="https://assets.360suites.com.br/social-media/google-logo.svg" width="20px" class="mr-2" />
          Entrar com o Google
        </div>
      </v-btn>
    </div>
    <div class="d-flex align-center justify-center">
      <span class="px-2 white desc-regular-xxs black--text position-absolute">ou</span>
      <v-divider class="my-4" />
    </div>
  </v-container>
</template>

<script>
import { Auth } from 'aws-amplify'

export default {
  name: 'SocialButtonsComponent',
  data: () => ({
    Auth
  }),
  methods: {
    // signInWithFacebook () {
    //   Auth.federatedSignIn({ provider: 'Facebook' }).catch((err) => {
    //     // eslint-disable-next-line no-console
    //     console.log(err)
    //   })
    // },
    signInWithGoogle () {
      Auth.federatedSignIn({ provider: 'Google' })
        .catch((err) => {
        // eslint-disable-next-line no-console
          console.log(err)
        })
    }
  }
}

</script>
