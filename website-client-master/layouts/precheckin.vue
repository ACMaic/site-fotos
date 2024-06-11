<template>
  <v-app light class="background-360">
    <header-component v-if="render" :user-name="userName" />
    <v-main v-if="render && !isLoading" class="pt-lg-16 ma-0 pa-0 background-360">
      <v-container fluid class="ma-0 pa-0 ">
        <v-row v-if="isAuthenticated" no-gutters class="container-360">
          <v-col cols="12" lg="4">
            <booking-details-pre-checkin :booking="booking" />
          </v-col>
          <v-divider v-if="$vuetify.breakpoint.mdAndUp" vertical class="my-4 mx-4" />
          <v-col cols="12" lg="7">
            <nuxt />
          </v-col>
        </v-row>
        <v-row v-if="!isAuthenticated" no-gutters class="container-360">
          <div
            class="login-holder"
          >
            <v-card class="login-wrapper rounded-md-xl rounded-md-bs-0 my-8">
              <h4 class=" primary--text" :class="$vuetify.breakpoint.mdAndUp ? 'text-medium-md' : 'text-medium-xs '">
                Como deseja prosseguir?
              </h4>
              <v-btn
                color="primary"
                class="radius-login-360 text-regular-xxs login-wrapper--btn mb-4"
                :class="$vuetify.breakpoint.lgAndUp ? 'mt-10' : 'mt-8'"
                height="50px"
                style="text-transform: inherit !important;"
                elevation="0"
                @click="login"
              >
                Faça login e acelere seu check-in
              </v-btn>
              <v-btn
                color="primary"
                class="radius-login-360 text-regular-xxs login-wrapper--btn"
                outlined
                height="50px"
                style="text-transform: inherit !important;"
                @click="register"
              >
                Fazer meu cadastro
              </v-btn>
            </v-card>
          </div>
        </v-row>
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
      </v-container>
    </v-main>
    <v-main v-if="render && isLoading" class="pt-lg-16 ma-0 pa-0 background-360">
      <v-row style="height: 95%;">
        <v-col cols="12" lg="4">
          <v-skeleton-loader boilerplate type="card-avatar, article" class="mx-8 ml-12 border mt-8" />
        </v-col>
        <v-divider v-if="$vuetify.breakpoint.mdAndUp" vertical class="my-4 mx-4" />
        <v-col cols="12" lg="7">
          <v-skeleton-loader
            class="mx-auto border mt-8"
            type="card, image, article"
          />
        </v-col>
      </v-row>
    </v-main>
    <footer-component v-if="render" />
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { Auth } from 'aws-amplify'
import HeaderComponent from '@/components/Header'
import FooterComponent from '@/components/Footer'
import { useSnackbar } from '@/store'
import { useCheckUser } from '@/shared/composables/checkUser'
import { openApi as api360 } from '@/api'
import BookingDetailsPreCheckin from '@/components/precheckin/BookingDetailsPreCheckin.vue'

export default {
  name: 'PrecheckinLayout',
  components: {
    HeaderComponent,
    FooterComponent,
    BookingDetailsPreCheckin
  },
  setup (context) {
    const { userName, checkUser, useRouteWatcher } = useCheckUser(context)
    checkUser()
    useRouteWatcher()
    return {
      userName
    }
  },
  data () {
    return {
      render: false,
      isLoading: true,
      isAuthenticated: false,
      email: '',
      bookId: '',
      booking: {}
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
  mounted () {
    this.render = true
  },
  beforeMount () {
    this.bookId = this.$route?.query?.bookId || this.$route?.query?.bookingId
    Auth.currentAuthenticatedUser().then((user) => {
      this.email = user.attributes.email
      this.isAuthenticated = true
      api360.get(`/check-in-api/${this.bookId}`).then(({ data }) => {
        this.booking = data
        if (this.booking?.firstPerson && this.booking?.firstPerson?.email && this.booking?.firstPerson?.email !== this.email) {
          localStorage.setItem('redirect', '/')
          this.showSnackbar({
            text: 'Este check-in não está vinculado ao seu e-mail.',
            color: 'error',
            timeout: -1
          })

          this.$router.replace('/')
          return
        }
        if (this.booking?.custom9.length > 0) {
          this.showSnackbar({
            text: 'Este check-in já foi realizado.',
            color: 'error',
            timeout: -1
          })
          this.$router.replace('/minha-conta/reservas')
          return
        }
        const hasParking = data.room.features.some(f => f.friendlyName.toLowerCase().trim() === 'estacionamento')
        Promise.all([
          localStorage.setItem('room', JSON.stringify(data.room)),
          localStorage.setItem('guest', data.numAdult + data.numChild),
          localStorage.setItem('dates', JSON.stringify([data.arrival, data.departure])),
          localStorage.setItem('hasParking', hasParking)
        ]).finally(() => {
          this.isLoading = false
        })
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
        this.showSnackbar({
          text: 'Falha ao processar check-in. Tente novamente mais tarde.',
          color: 'error',
          timeout: -1
        })
        this.$router.replace('/')
      }).finally(() => {
        this.isLoading = false
      })
    }).catch(() => {
      this.isAuthenticated = false
      this.isLoading = false
    })
  },
  methods: {
    ...mapActions(useSnackbar, ['showSnackbar']),
    ...mapActions(useSnackbar, ['closeSnackbar']),
    login () {
      const bookId = this.$route?.query?.bookId || this.$route?.query?.bookingId
      localStorage.setItem('redirect', `/checkin?bookId=${bookId}`)
      this.$router.push('/entrar')
    },
    register () {
      const bookId = this.$route?.query?.bookId || this.$route?.query?.bookingId
      localStorage.setItem('redirect', `/checkin?bookId=${bookId}`)
      this.$router.push('/registrar')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/mixins.scss';

.container-360 {
  @include desktop-up() {
    margin: 0 auto;
    max-width: 1264px !important;
  }
}

.login-holder {
  align-items: center;
  justify-content: center;
  width: 100%;
  justify-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.login-wrapper {
  width: 650px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: none !important;
  padding: 40px 56px;
  border-radius: 15px;
}

</style>
