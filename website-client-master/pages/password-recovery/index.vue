<template>
  <v-container fluid>
    <v-img src="https://assets.360suites.com.br/logos/logo.svg" alt="360 Suítes" class="mx-auto" width="210" />

    <v-card outlined :class="$vuetify.breakpoint.smAndDown? 'pa-1' : 'pa-4'" class="mx-auto rounded-lg login-360">
      <p :class="$vuetify.breakpoint.smAndDown ? 'text-regular-xxs mt-1' : 'text-regular-xs'" class="py-6 mb-0 text-center primary--text">
        <span class="text-medium-login">Recuperar</span> minha senha
      </p>
      <p class="mb-2 text-center black--text text-medium-xxs font-weight-bold">
        Esqueceu sua senha?
      </p>
      <p class="px-2 text-center black--text text-regular-xxs">
        Não se preocupe. É só nos dizer seu e-mail que enviaremos um link e um código de acesso para você cadastrar uma nova senha.
      </p>
      <v-form ref="form" v-model="valid" class="pa-2" @submit.prevent="($event) => $event.preventDefault()">
        <v-row v-if="!codeSent" no-gutters>
          <v-col cols="12" class="pb-3 px-1">
            <v-text-field
              v-model="email"
              dense
              outlined
              class="radius-login-360"
              :rules="emailRules"
              placeholder="E-mail"
              :disabled="disableEmail || codeSent"
              required
              height="45px"
              hide-details="auto"
              @input="clearErrorMesage"
            />
          </v-col>
        </v-row>
        <v-row v-else no-gutters>
          <v-row no-gutters>
            <v-col cols="12" class="pb-3 px-1">
              <v-text-field
                v-model="code"
                dense
                outlined
                class="radius-login-360"
                :rules="codeRule"
                placeholder="Digite o código que foi enviado para o seu e-mail"
                max-lenght="6"
                required
                type="number"
                height="45px"
                hide-details="auto"
                @input="clearErrorMesage"
              />
            </v-col>
            <v-col cols="12" class="pb-3 px-1">
              <v-text-field
                v-model="emailRecovery"
                dense
                outlined
                class="radius-login-360"
                required
                readonly
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
            <v-col cols="12" class="pb-3 px-1">
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
              :disabled="!valid"
              @click="!codeSent? sendPasswordRecovery() : submitNewPassword()"
            >
              {{ !codeSent? 'Enviar código' : 'Alterar senha' }}
            </v-btn>
          </v-col>
          <div v-if="socialMediaError" class="mt-6 pb-2 d-flex flex-column text-regular-xxs">
            <p class="px-2 text-left error--text">
              {{ socialMediaError }}
            </p>
          </div>
        </v-row>
        <div class="mt-2 pb-2 d-flex flex-column title-medium-xxs">
          <v-row class="mt-1 px-4 d-flex" :class="$vuetify.breakpoint.smAndDown? 'justify-start' : 'justify-end'">
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
import { openApi as api360 } from '@/api'
import PolicyLinks from '@/components/login/PolicyLinks.vue'
import { emailRules, requiredPassword, codeRules } from '@/rules'
import { useSnackbar } from '@/store'
import { getMessageError } from '@/shared/errors'
export default {
  name: 'LoginPage',
  components: {
    PolicyLinks
  },
  layout: 'login',
  data () {
    return {
      codeSent: false,
      valid: false,
      email: '',
      code: '',
      emailRecovery: '',
      password: '',
      checkPassword: '',
      showPassword: false,
      showCheckPassword: false,
      socialMediaError: '',
      errorRuleMesage: '',
      requiredPassword,
      disableEmail: false,
      passwordRules: [
        ...requiredPassword,
        () => this.password === this.checkPassword || 'As senhas não conferem'
      ],
      getMessageError
    }
  },
  computed: {
    emailRules () {
      return [...emailRules, !this.errorRuleMesage || this.errorRuleMesage]
    },
    codeRule () {
      return [...codeRules, !this.errorRuleMesage || this.errorRuleMesage]
    }
  },
  methods: {
    ...mapActions(useSnackbar, ['showSnackbar']),
    goBack () {
      localStorage.setItem('redirect', '/')
      this.$router.push('/')
    },
    sendPasswordRecovery () {
      if (this.valid) {
        this.disableEmail = true
        api360.get(`website-users/is-external-provider/${this.email}`).then((res) => {
          if (!res.data) {
            Auth.forgotPassword(this.email)
              .then(() => {
                this.showSnackbar({
                  text: `Código enviado para o email: ${this.email}`,
                  timeout: 6000,
                  color: 'success'
                })
                this.codeSent = true
                this.emailRecovery = this.email
              })
              .catch((err) => {
                const { errorMesage, errorRuleMesage, socialMediaError } = this.getMessageError(err)
                this.showSnackbar({
                  text: errorMesage,
                  Timeout: -1,
                  color: 'error'
                })
                this.errorRuleMesage = errorRuleMesage
                this.socialMediaError = socialMediaError
              })
          } else {
            const err = {
              code: 'InvalidParameterException'
            }
            const { errorMesage, errorRuleMesage, socialMediaError } = this.getMessageError(err)
            this.showSnackbar({
              text: errorMesage,
              timeout: -1,
              color: 'error'
            })
            this.errorRuleMesage = errorRuleMesage
            this.socialMediaError = socialMediaError
            this.disableEmail = false
          }
        }).catch(() => {
          const err = {
            code: 'UserNotFoundException'
          }
          const { errorMesage, errorRuleMesage, socialMediaError } = this.getMessageError(err)
          this.showSnackbar({
            text: errorMesage,
            timeout: -1,
            color: 'error'
          })
          this.errorRuleMesage = errorRuleMesage
          this.socialMediaError = socialMediaError
          this.disableEmail = false
        })
      }
    },
    submitNewPassword () {
      Auth.forgotPasswordSubmit(this.email, this.code, this.password)
        .then(() => {
          this.showSnackbar({
            text: 'Senha atualizada com sucesso',
            timeout: 5000,
            color: 'success'
          })
          this.login()
        })
        .catch((err) => {
          const { errorMesage, errorRuleMesage } = this.getMessageError(err)
          this.showSnackbar({
            text: errorMesage,
            timeout: -1,
            color: 'error'
          })
          this.errorRuleMesage = errorRuleMesage
        })
    },
    checkPasswordConfirmation () {
      this.passwordRules = [...this.requiredPassword, this.password === this.checkPassword || 'As senhas não conferem']
    },
    login () {
      Auth.signIn(this.email, this.password)
        .then(() => {
          this.$router.push('/')
        })
        .catch((err) => {
          this.showSnackbar({
            text: err.mesage,
            timeout: -1,
            color: 'error'
          })
        })
    },
    clearErrorMesage () {
      this.errorRuleMesage = this.errorRuleMesage ? '' : this.errorRuleMesage
      this.socialMediaError = this.socialMediaError ? '' : this.socialMediaError
    }
  }
}
</script>
