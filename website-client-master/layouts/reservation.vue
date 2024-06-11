<template>
  <v-app light class="background-360">
    <header-component v-if="render" :user-name="userName" />
    <v-main v-if="render" class="pt-lg-16 ma-0 pa-0 background-360">
      <v-container fluid class="ma-0 pa-0 ">
        <v-row no-gutters class="container-360">
          <v-col cols="12" lg="4">
            <booking-details />
          </v-col>
          <v-divider v-if="$vuetify.breakpoint.mdAndUp" vertical class="my-4 mx-4" />
          <v-col cols="12" lg="7">
            <nuxt />
          </v-col>
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
import BookingDetails from '@/components/payment/BookingDetails.vue'
import { openApi as api360, signedApi } from '@/api'

export default {
  name: 'ReservationLayout',
  components: {
    HeaderComponent,
    FooterComponent,
    BookingDetails
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
      render: false
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
    localStorage.setItem('redirect', '/')
    Auth.currentAuthenticatedUser()
      .then((user) => {
        if (user) {
          const email = user.attributes.email
          signedApi.get(`/website-users/user-by-email/${email}`).then(({ data }) => {
            if (data) {
              api360.post('/blocklist-api/validation', {
                email: data.email,
                name: data.name,
                phone: data.cellPhone,
                cpf: data.cpf,
                rg: data.rg,
                passport: data.passport,
                bookingId: this.$route.query?.bookingId || this.$route.query?.bookId
              })
                .then(({ data }) => {
                  if (data) {
                    this.showSnackbar({
                      text: 'Falha na tentativa de reserva. Tente novamente mais tarde.',
                      timeout: -1,
                      color: 'error'
                    })
                    this.$router.replace('/')
                  }
                })
                .catch((error) => {
                // eslint-disable-next-line no-console
                  console.log(error)
                })
            }
          })
        }
      })
  },
  methods: {
    ...mapActions(useSnackbar, ['showSnackbar']),
    ...mapActions(useSnackbar, ['closeSnackbar'])
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

</style>
