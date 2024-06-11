<template>
  <v-container fluid>
    <v-img src="https://assets.360suites.com.br/logos/logo.svg" alt="360 Suítes" class="mx-auto my-12" width="210" />

    <v-card outlined :class="$vuetify.breakpoint.smAndDown ? 'pa-1' : 'pa-4'" class="mx-auto login-360">
      <p :class="$vuetify.breakpoint.smAndDown ? 'text-regular-xxs mt-1' : 'text-regular-xs'" class="py-6 mb-0 text-center">
        <span class="text-medium-login">Crie</span> sua conta na na <span class="primary--text text-medium-login">360 Suítes</span>
      </p>

      <social-buttons-component />

      <v-form ref="form" v-model="valid" class="pa-2" @submit.prevent="($event) => $event.preventDefault()">
        <v-row no-gutters>
          <v-col cols="12" md="6" sm="12" class="pb-3 px-1">
            <v-text-field
              v-model.trim="newUser.firstName"
              dense
              outlined
              class="radius-login-360"
              placeholder="Nome"
              :rules="firstnameRules"
              required
              height="45px"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="6" sm="12" class="pb-3 px-1">
            <v-text-field
              v-model.trim="newUser.lastName"
              dense
              outlined
              class="radius-login-360"
              placeholder="Sobrenome"
              :rules="lastnameRules"
              required
              height="45px"
              hide-details="auto"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col :cols="$vuetify.breakpoint.smAndDown ? '4' : '6'" md="2" class="pb-3 px-1">
            <v-autocomplete
              v-model="newUser.ddi"
              :items="country_and_ddi"
              dense
              outlined
              class="radius-login-360"
              full-width
              placeholder="DDI"
              :item-text="item =>`+${item.ddi} - (${item.country})`"
              item-value="ddi"
              append-icon=""
              :rules="requiredRules"
              required
              height="45px"
              hide-details="auto"
              :menu-props="{rounded: 'sm'}"
            >
              <template #selection="{ item }">
                <span>+{{ item.ddi }}</span>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col :cols="$vuetify.breakpoint.smAndDown ? '8' : '6'" md="4" class="pb-3 px-1">
            <v-text-field
              v-model="newUser.cellPhone"
              v-mask="['(##) #####-####']"
              dense
              outlined
              class="radius-login-360"
              placeholder="Celular"
              :rules="phoneRules"
              required
              height="45px"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="6" class="pb-3 px-1">
            <v-text-field
              v-model="newUser.email"
              dense
              outlined
              class="radius-login-360"
              placeholder="E-mail"
              :rules="emailRules"
              required
              height="45px"
              hide-details="auto"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="6" class="pb-3 px-1">
            <v-text-field
              v-model="newUser.password"
              dense
              outlined
              class="radius-login-360"
              placeholder="Senha"
              required
              :type="showPassword ? 'text' : 'password'"
              :rules="passwordRules"
              height="45px"
              hide-details="auto"
              @input="checkPasswordConfirmation"
            >
              <template #append>
                <v-icon small class="pt-2" @click="showPassword = !showPassword">
                  {{ !showPassword ? 'fa-eye-slash' : 'fa-eye' }}
                </v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="pb-3 px-1">
            <v-text-field
              v-model="checkPassword"
              dense
              outlined
              class="radius-login-360"
              placeholder="Confirmar Senha"
              required
              :type="showCheckPassword ? 'text' : 'password'"
              :rules="passwordRules"
              height="45px"
              hide-details="auto"
              @input="checkPasswordConfirmation"
            >
              <template #append>
                <v-icon small class="pt-2" @click="showCheckPassword = !showCheckPassword">
                  {{ !showCheckPassword ? 'fa-eye-slash' : 'fa-eye' }}
                </v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" class="pb-4 px-1">
            <v-autocomplete
              v-model="newUser.country"
              :items="country_and_ddi"
              dense
              outlined
              class="radius-login-360"
              item-text="country"
              item-value="country"
              placeholder="Selecione o país"
              height="45px"
              hide-details="auto"
              :menu-props="{rounded: 'sm'}"
            />
          </v-col>
          <v-col cols="12" class="px-1 py-4 ma-0">
            <v-checkbox
              v-model="newUser.termsAndConditions"
              class="ma-0 pa-0"
              color="primary"
              :rules="termsAndConditionsRules"
              hide-details="auto"
            >
              <template #label>
                <span
                  class="desc-regular-xxs black--text"
                >
                  Declaro estar de acordo com os termos de uso e política de privacidade.
                </span>
              </template>
            </v-checkbox>
          </v-col>
          <v-col cols="12" class="px-1 pb-4 ma-0">
            <v-checkbox
              v-model="newUser.emailOffers"
              class="ma-0 pa-0"
              color="primary"
              hide-details="auto"
            >
              <template #label>
                <span
                  class="desc-regular-xxs black--text"
                >
                  Quero receber ofertas, promoções exclusivas, cupons e novidades por e-mail.
                </span>
              </template>
            </v-checkbox>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-btn
            :class="{ primary: valid, background: !valid, disabled: !valid }"
            :disabled="!valid"
            depressed
            width="100%"
            height="50px"
            class="radius-login-360 text-unset text-bold-xs my-4"
            type="submit"
            :loading="isLoading"
            @click="createNewAccount"
          >
            Criar conta
          </v-btn>
        </v-row>
        <div class="mt-3 pb-2 d-flex flex-column title-medium-xxs">
          <v-row class="mt-1 px-4 d-flex justify-space-between">
            <span>Já tem uma conta? <nuxt-link tag="a" to="/entrar">Entrar</nuxt-link></span>
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
import { mapActions } from 'pinia'
import { Auth } from 'aws-amplify'
import Crypto from 'crypto-js'
import SocialButtonsComponent from '@/components/login/SocialButtonsComponent.vue'
import PolicyLinks from '@/components/login/PolicyLinks.vue'
import { usePaymentStore, useSnackbar } from '@/store'
import { openApi as api360, sendForm, hubspotForm } from '@/api'

import {
  requiredRules,
  firstnameRules,
  lastnameRules,
  emailRules,
  phoneRules,
  requiredPassword,
  termsAndConditionsRules
} from '@/rules'

export default {
  name: 'RegisterPage',
  components: {
    SocialButtonsComponent,
    PolicyLinks
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
      isLoading: false,
      valid: false,
      showPassword: false,
      showCheckPassword: false,
      newUser: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        ddi: '',
        cellPhone: '',
        country: 'Brasil',
        facebookId: '',
        googleId: '',
        whatsappOffers: false,
        emailOffers: false,
        termsAndConditions: false,
        status: true
      },
      country_and_ddi: [],
      checkPassword: '',
      requiredRules,
      firstnameRules,
      lastnameRules,
      emailRules,
      phoneRules,
      requiredPassword,
      passwordRules: [
        ...requiredPassword,
        () => this.newUser.password === this.checkPassword || 'As senhas não conferem'
      ],
      termsAndConditionsRules,
      secretKey: process.env.NUXT_ENV_SECRET_KEY,
      prevRoute: this.$nuxt.context.from
    }
  },
  watch: {
    $route (from, to) {
      this.closeSnackbar()
    }
  },
  beforeMount () {
    this.getDdiAndCountry()
  },
  methods: {
    checkPasswordConfirmation () {
      this.passwordRules = [...this.passwordRules, () => this.newUser.password === this.checkPassword || 'As senhas não conferem']
    },
    ...mapActions(useSnackbar, ['showSnackbar']),
    goBack () {
      localStorage.setItem('redirect', '/')
      this.$router.push('/')
    },
    createNewAccount () {
      const encryptPassword = (password) => {
        return Crypto.AES.encrypt(password, this.secretKey).toString()
      }

      this.isLoading = true
      const payload = {
        ...this.newUser,
        password: encryptPassword(this.newUser.password)
      }

      if (this.valid) {
        sendForm([
          {
            name: 'firstname',
            value: this.newUser?.firstName
          },
          {
            name: 'lastname',
            value: this.newUser?.lastName
          },
          {
            name: 'email',
            value: this.newUser?.email
          },
          {
            name: 'mobilephone',
            value: `${this.newUser?.ddi} ${this.newUser?.cellPhone}`
          },
          {
            name: 'country',
            value: this.newUser?.country
          },
          {
            name: 'voce_teria_interesse_em_uma_newsletter_da_360_',
            value: this.newUser?.emailOffers ? 'Sim' : 'Não'
          }
        ], {
          pageUri: hubspotForm.websiteSignup.pageUri,
          pageName: hubspotForm.websiteSignup.pageName
        }, hubspotForm.websiteSignup.id)
        api360.post('/website-users', payload)
          .then(() => {
            this.showSnackbar({
              text: 'Conta criada com sucesso.',
              timeout: 5000,
              color: 'success'
            })
            Auth.signIn(this.newUser.email, this.newUser.password)
              .then(() => {
                const redirect = localStorage.getItem('redirect')
                this.$router.push(redirect)
              })
              .catch((err) => {
                this.showSnackbar({
                  text: err.mesage,
                  timeout: 0,
                  color: 'error'
                })
              })
          })
          .catch((err) => {
            const code = err.response.data.code
            this.showSnackbar({
              text: code === '003' ? 'E-mail já usado na plataforma. Verifique se o e-mail foi digitado corretamente ou clique em entrar' : 'Erro ao criar o usuário',
              timeout: -1,
              color: 'error'
            })
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    },
    getDdiAndCountry () {
      api360.get('/website-users').then(({ data }) => {
        this.country_and_ddi = data
      }).catch((error) => {
        this.showSnackbar({
          text: error,
          timeout: -1,
          color: 'error'
        })
      })
    }
  }
}
</script>
