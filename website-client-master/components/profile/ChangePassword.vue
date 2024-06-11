<template>
  <div>
    <div v-if="dialogPassword" class="blur" />
    <v-dialog
      v-model="dialogPassword"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      hide-overlay
      max-width="800"
      persistent
    >
      <v-card class="py-4 px-4">
        <v-container>
          <title-component title-normal="Criar nova" title-bold="Senha" />
          <v-form ref="form" v-model.trim="valid" class="mt-sm-n10 mx-4" @submit.prevent="savePassword">
            <v-row>
              <v-col cols="12" class="pb-3 ml-1">
                <v-text-field
                  v-model="oldPassword"
                  dense
                  class="radius-login-360"
                  outlined
                  placeholder="Senha Atual"
                  required
                  :type="showOldPassword ? 'text' : 'password'"
                  :rules="currentPassword"
                  height="45px"
                  hide-details="auto"
                >
                  <template #append>
                    <v-icon small class="pt-2" @click="showOldPassword = !showOldPassword">
                      {{ !showOldPassword ? 'fa-eye-slash' : 'fa-eye' }}
                    </v-icon>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" class="pb-3 ml-1">
                <v-text-field
                  v-model="newPassword"
                  dense
                  outlined
                  class="radius-login-360"
                  placeholder="Nova Senha"
                  required
                  :type="showNewPassword ? 'text' : 'password'"
                  height="45px"
                  :rules="passwordNewRules"
                  hide-details="auto"
                  @input="checkPasswordConfirmation"
                >
                  <template #append>
                    <v-icon small class="pt-2" @click="showNewPassword = !showNewPassword">
                      {{ !showNewPassword ? 'fa-eye-slash' : 'fa-eye' }}
                    </v-icon>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" class="pb-3 ml-1">
                <v-text-field
                  v-model="confirmPassword"
                  dense
                  class="radius-login-360"
                  outlined
                  placeholder="Confirme a nova senha"
                  required
                  :type="showCheckPassword ? 'text' : 'password'"
                  height="45px"
                  :rules="passwordNewConfirm"
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
            <v-row>
              <v-col>
                <p class="primary--text ml-1">
                  Não lembra sua senha? <nuxt-link to="/recuperar-senha">Clique aqui</nuxt-link>
                </p>
              </v-col>
              <v-col cols="12" md="3" class="mt-6">
                <v-btn
                  large
                  height="45px"
                  text
                  style="text-transform: inherit !important;"
                  color="primary"
                  @click="closeDialogPassword"
                >
                  Cancelar
                </v-btn>
              </v-col>
              <v-col cols="12" md="3" class="mt-6">
                <v-btn
                  color="primary"
                  class="text-transform"
                  block
                  elevation="0"
                  type="submit"
                >
                  Trocar Senha
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import { mapActions } from 'pinia'
import { useSnackbar } from '@/store'
import TitleComponent from '@/components/shared/Title.vue'
import { getMessageError } from '@/shared/errors'
import { passwordNew, passwordConfirmation, currentPassword } from '@/rules'

export default {
  name: 'ChangePasswordDialog',
  components: {
    TitleComponent
  },
  data () {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      valid: false,
      dialogPassword: false,
      showOldPassword: false,
      showNewPassword: false,
      showCheckPassword: false,
      currentPassword,
      passwordNewRules: [
        ...passwordNew,
        () => this.newPassword === this.confirmPassword || 'As senhas devem ser iguais'
      ],
      passwordNewConfirm: [
        ...passwordConfirmation,
        () => this.newPassword === this.confirmPassword || 'As senhas devem ser iguais'
      ],
      getMessageError
    }
  },
  methods: {
    ...mapActions(useSnackbar, ['closeSnackbar']),
    openDialogPassword () {
      this.dialogPassword = true
    },
    closeDialogPassword () {
      this.dialogPassword = false
      this.closeSnackbar()
    },
    checkPasswordConfirmation () {
      this.passwordNewRules = [...this.passwordNewRules, () => this.newPassword === this.confirmPassword || 'As senhas devem ser iguais']
      this.passwordNewConfirm = [...this.passwordNewConfirm, () => this.newPassword === this.confirmPassword || 'As senhas devem ser iguais']
    },
    ...mapActions(useSnackbar, ['showSnackbar']),

    savePassword () {
      if (this.oldPassword === this.newPassword) {
        this.showSnackbar({
          text: 'Nova senha não pode ser igual a senha atual',
          timeout: -1,
          color: 'error'
        })
        return
      }
      this.$refs.form.validate()
      if (this.valid) {
        Auth.currentUserPoolUser().then((user) => {
          Auth.changePassword(user, this.oldPassword, this.newPassword)
            .then(() => {
              this.closeDialogPassword()
              this.showSnackbar({
                text: 'Senha atualizada com sucesso',
                timeout: 5000,
                color: 'success'
              })
            })
            .catch((err) => {
              const { errorChangePassword } = this.getMessageError(err)
              this.showSnackbar({
                text: errorChangePassword,
                timeout: -1,
                color: 'error'
              })
              this.errorChangePassword = errorChangePassword
            })
        }).catch(() => {
          this.showSnackbar({
            text: 'Erro buscar usuário',
            timeout: -1,
            color: 'error'
          })
        })
      }
    }
  }

}
</script>
