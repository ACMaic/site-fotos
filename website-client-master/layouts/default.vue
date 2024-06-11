<template>
  <v-app light class="background-360">
    <div>
      <template v-if="render">
        <header-component :user-name="userName" />
      </template>
      <v-main v-if="render">
        <nuxt />
        <v-snackbar
          :value="snackbar.show"
          :timeout="snackbar.timeout"
          :color="snackbar.color"
          @input="closeSnackbar"
        >
          {{ snackbar.text }}
          <template #action="{ attrs }">
            <v-btn text v-bind="attrs" @click="closeSnackbar">
              Fechar
            </v-btn>
          </template>
        </v-snackbar>
      </v-main>
      <footer-component v-if="render" :contact-options="contactOptions" />
    </div>
  </v-app>
</template>
<script>

import { mapState, mapActions } from 'pinia'
import { Auth } from 'aws-amplify'
import HeaderComponent from '@/components/Header'
import FooterComponent from '@/components/Footer'
import { useSnackbar } from '@/store'
import { contactOptions } from '@/shared/footer'

export default {
  components: {
    HeaderComponent,
    FooterComponent
  },
  data () {
    return {
      render: false,
      userName: '',
      contactOptions
    }
  },
  head () {
    return {
      htmlAttrs: {
        lang: 'pt-BR'
      }
    }
  },
  computed: {
    ...mapState(useSnackbar, ['snackbar'])
  },
  watch: {
    $route (from, to) {
      this.checkUser()
      this.closeSnackbar()
    }
  },
  mounted () {
    this.render = true
    this.checkUser()
  },
  methods: {
    ...mapActions(useSnackbar, ['closeSnackbar']),
    checkUser () {
      Auth.currentAuthenticatedUser()
        .then((user) => {
          this.userName = user.attributes.given_name
        })
        .catch((err) => {
          Auth.signOut({ global: true })
          this.userName = ''
          // eslint-disable-next-line no-console
          console.error(err)
        })
    }
  }
}
</script>
