<template>
  <v-container fluid>
    <v-img src="https://assets.360suites.com.br/logos/logo.svg" alt="360 Suítes" class="mx-auto my-12" width="210" />

    <v-card outlined :class="$vuetify.breakpoint.smAndDown ? 'pa-1' : 'pa-4'" class="mx-auto login-360">
      <p :class="$vuetify.breakpoint.smAndDown ? 'text-regular-xxs mt-1' : 'text-regular-xs'" class="py-6 mb-0 text-center">
        Entrar na <span class="text-medium-login">área de clientes</span> da 360 Suítes
      </p>
      <social-buttons-component />
      <v-form ref="form" v-model="valid" class="pa-2" @submit.prevent="($event) => $event.preventDefault()">
        <v-row no-gutters>
          <v-col cols="12" class="pb-3 px-1">
            <v-text-field
              v-model="email"
              dense
              outlined
              class="radius-login-360"
              :rules="emailRules"
              placeholder="E-mail"
              required
              height="45px"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" class="pb-3 px-1">
            <v-text-field
              v-model="password"
              dense
              outlined
              class="radius-login-360"
              placeholder="Senha"
              required
              :append-icon="showPassword ? 'fa-eye-slash' : 'fa-eye'"
              :type="showPassword ? 'text' : 'password'"
              :rules="passwordRequiredOnly"
              height="45px"
              hide-details="auto"
              @click:append="showPassword = !showPassword"
            >
              <template #append>
                <v-icon small class="pt-2" @click="showPassword = !showPassword">
                  {{ !showPassword ? 'fa-eye-slash' : 'fa-eye' }}
                </v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" class="pt-4 px-1">
            <v-btn
              :class="{ primary: valid, background: !valid, disabled: !valid }"
              depressed
              width="100%"
              height="50px"
              class="radius-login-360 text-unset text-bold-xs"
              type="submit"
              label="Entrar"
              :disabled="!valid"
              @click="login"
            >
              Entrar
            </v-btn>
          </v-col>
        </v-row>
        <div class="mt-8 pb-2 d-flex flex-column title-medium-xxs">
          <nuxt-link to="/recuperar-senha" class="pl-1">Esqueceu sua senha?</nuxt-link>
          <v-row class="mt-1 px-4 d-flex justify-space-between">
            <span>Não possui conta? <nuxt-link tag="a" to="/registrar">Criar agora</nuxt-link></span>
            <v-btn text class="text-unset" @click="goBack">
              <span class="primary-decorated-link">Voltar para o site 360 suítes</span>
            </v-btn>
          </v-row>
        </div>
      </v-form>
    </v-card>
    <policy-links />
  </v-container>
</template>

<script>
import { Auth } from 'aws-amplify'
import { mapActions } from 'pinia'
import { usePaymentStore, useSnackbar } from '@/store'
import SocialButtonsComponent from '@/components/login/SocialButtonsComponent.vue'
import PolicyLinks from '@/components/login/PolicyLinks.vue'
import { emailRules, passwordRequiredOnly } from '@/rules'
import { openApi as api360 } from '@/api'

export default {
  name: 'LoginPage',
  components: {
    SocialButtonsComponent,
    PolicyLinks
  },
  beforeRouteLeave (to, from, next) {
    if (this.isSocial) {
      Auth.currentAuthenticatedUser().then(() => {
        const redirect = localStorage.getItem('redirect')
        this.$router.push(redirect)
      }).catch(() => {
        next()
      })
    } else {
      next()
    }
  },
  layout: 'login',
  setup () {
    const { getCurrentStep: currentStep, setCurrentStep } = usePaymentStore()
    return {
      currentStep,
      setCurrentStep
    }
  },
  data () {
    return {
      valid: false,
      showPassword: false,
      email: '',
      emailRules,
      password: '',
      passwordRequiredOnly,
      isLoading: false,
      prevRoute: this.$nuxt.context.from,
      isSocial: true
    }
  },
  methods: {
    ...mapActions(useSnackbar, ['showSnackbar']),
    goBack () {
      localStorage.setItem('redirect', '/')
      this.$router.push('/')
    },
    login () {
      this.isLoading = true
      this.isSocial = false
      api360.get(`/website-users/is-external-provider/${this.email}`).then(({ data }) => {
        if (!data) {
          Auth.signIn(this.email, this.password)
            .then(() => {
              const redirect = localStorage.getItem('redirect')
              this.$router.push(redirect)
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.log(error)
              this.showSnackbar({
                text: error.code === 'UserNotFoundException' ? 'E-mail não encontrado em nossa plataforma' : error.code === 'NotAuthorizedException' ? 'E-mail ou senha inválidos' : error,
                timeout: -1,
                color: 'error'
              })
            })
            .finally(() => {
              this.isLoading = false
            })
        } else {
          this.showSnackbar({
            text: 'Usuário possui login social (Google)',
            timeout: -1,
            color: 'error'
          })
          this.isLoading = false
        }
      }).catch(() => {
        this.showSnackbar({
          text: 'E-mail não encontrado em nossa plataforma',
          timeout: -1,
          color: 'error'
        })
        this.isLoading = false
      })
    }
  }
}
</script>
