<template>
  <v-container class="ma-0 pa-0">
    <v-skeleton-loader
      v-if="isLoading"
      v-bind="attrs"
      max-width="360"
      type="list-item-two-line, list-item-two-line, list-item-two-line"
    />
    <div v-else>
      <v-sheet
        v-if="$vuetify.breakpoint.mdAndDown"
        color="background-360"
        class="mt-2 d-flex flex-column align-center justify-center black--text"
      >
        <v-icon size="72" color="black" class="pb-5 mr-2">
          fa-solid fa-circle-user
        </v-icon>
        <span class="text-regular-xs mb-4">
          Olá, {{ userName }}
        </span>
      </v-sheet>
      <v-divider v-if="$vuetify.breakpoint.mdAndDown" class="my-8 mx-2" />
      <title-component class="py-4 ml-md-4 ml-2" title-normal="Informações" title-bold="Pessoais" />
      <v-row>
        <v-col>
          <p class="text-medium-xxs mt-n6 ml-md-4 ml-2">
            Queremos saber mais sobre você.
          </p>
        </v-col>
      </v-row>
      <v-form ref="form" v-model.trim="valid" class="pa-sm-2" @submit.prevent="($event) => $event.preventDefault()">
        <v-row class="px-2">
          <v-col cols="12" md="6">
            <span class="mb-1 text-regular-xxs">
              Nome *
            </span>
            <v-text-field
              v-model.trim="user.firstName"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              :rules="firstnameRules"
              height="45px"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="6" sm="12" class="pb-4">
            <p class="mb-1 text-regular-xxs">
              Sobrenome *
            </p>
            <v-text-field
              v-model.trim="user.lastName"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              :rules="lastnameRules"
              height="45px"
              hide-details="auto"
            />
          </v-col>

          <v-col cols="12" md="6" sm="12" class="pb-4">
            <p class="mb-1 text-regular-xxs">
              Data de nascimento
            </p>
            <v-text-field
              v-model.trim="user.birthdate"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              :rules="birthdateRules"
              type="date"
              height="45px"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="6" sm="12" class="pb-4">
            <p class="mb-1 text-regular-xxs">
              Gênero
            </p>
            <v-radio-group
              v-model.trim="user.genre"
              row
              :rules="genderRules"
            >
              <v-radio
                label="Feminino"
                class="pr-md-6"
                value="female"
              />
              <v-radio
                label="Masculino"
                class="pr-md-6"
                value="male"
              />
              <v-radio
                label="Outro"
                class="pr-md-6"
                value="other"
              />
            </v-radio-group>
          </v-col>

          <v-col cols="12" md="3" sm="12" class="pb-4">
            <p class="mb-1 text-regular-xxs">
              CPF
            </p>
            <v-text-field
              v-model.trim="user.cpf"
              v-mask="'###.###.###-##'"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              :rules="user?.cpf?.length > 0 ? cpfRules : []"
              height="45px"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="3" sm="12" class="pb-4">
            <p class="mb-1 text-regular-xxs">
              RG
            </p>
            <v-text-field
              v-model.trim="user.rg"
              :rules="user.rg?.length > 0 ? noSpecialCharsRules : []"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="3" sm="12" class="pb-4">
            <p class="mb-1 text-regular-xxs">
              Passaporte
            </p>
            <v-text-field
              v-model.trim="user.passport"
              :rules="user.passport?.length > 0 ? noSpecialCharsRules : []"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="6" sm="12" class="pb-4">
            <p class="mb-1 text-regular-xxs">
              País
            </p>
            <v-autocomplete
              v-model.trim="user.country"
              :items="country_and_ddi"
              :rules="user?.country?.length > 0 ? noSpecialCharsRules : []"
              item-text="country"
              item-value="country"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
              @change="handleChangeCountry"
            />
          </v-col>
          <v-col cols="12" md="6" sm="12" class="pb-4">
            <p class="mb-1 text-regular-xxs">
              CEP
            </p>
            <v-text-field
              v-if="user.country === 'Brasil'"
              key="brPostalCodeField"
              v-model.trim="user.postalCode"
              v-mask="'#####-###'"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              height="45px"
              :rules="user?.postalCode?.length > 0 ? cepRules : []"
              hide-details="auto"
              required
              @blur="searchAddress"
              @input="clearFields"
            />
            <v-text-field
              v-else
              key="foreignPostalCodeField"
              v-model.trim="user.postalCode"
              v-mask="'######################'"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="6" sm="12" class="pb-4">
            <p class="mb-1 text-regular-xxs">
              Endereço
            </p>
            <v-text-field
              v-model.trim="user.address"
              dense
              outlined
              background-color="white"
              :rules="user?.address?.length > 0 ? noSpecialCharsRules : []"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="6" sm="12" class="pb-4">
            <p class="mb-1 text-regular-xxs">
              Número
            </p>
            <v-currency-field
              v-model="user.addressNumber"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              type="number"
              height="45px"
              hide-details="auto"
              v-bind="{
                decimalLength: 0,
                autoDecimalMode: false,
                min: 1,
                max: 999999,
                locale: 'pt-BR',
                defaultValue: null
              }
              "
              :rules="user?.addressNumber?.length > 0 ? [v => v > 0 || 'Campo inválido'] : []"
            />
          </v-col>
          <v-col cols="12" md="6" sm="12" class="pb-4">
            <p class="mb-1 text-regular-xxs">
              Complemento
            </p>
            <v-text-field
              v-model.trim="user.complement"
              dense
              outlined
              background-color="white"
              :rules="user?.complement?.length > 0 ? noSpecialCharsRules : []"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="6" sm="12" class="pb-4">
            <p class="mb-1 text-regular-xxs">
              Bairro
            </p>
            <v-text-field
              v-model.trim="user.county"
              dense
              outlined
              background-color="white"
              :rules="user?.county?.length > 0 ? noSpecialCharsRules : []"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="6" sm="12" class="pb-4">
            <p class="mb-1 text-regular-xxs">
              Estado
            </p>
            <v-autocomplete
              v-if="user.country === 'Brasil'"
              key="autoCompleteStateField"
              v-model.trim="user.state"
              :items="states"
              item-text="nome"
              item-value="sigla"
              :return-object="false"
              dense
              :rules="user?.state?.length > 0 ? noSpecialCharsRules : []"
              outlined
              background-color="white"
              class="radius-login-360"
              height="45px"
              hide-no-data
              hide-details="auto"
              clearable
              @change="changeState"
            />
            <v-text-field
              v-else
              key="foreignStateField"
              v-model.trim="user.state"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
              :rules="user?.state?.length > 0 ? noSpecialCharsRules : []"
              @change="changeState"
            />
          </v-col>
          <v-col cols="12" md="6" sm="12" class="pb-4">
            <p class="mb-1 text-regular-xxs">
              Cidade
            </p>
            <v-autocomplete
              v-if="user.country === 'Brasil'"
              key="autoCompleteCityField"
              v-model.trim="user.city"
              :items="cities"
              dense
              outlined
              hide-no-data
              item-text="nome"
              item-value="nome"
              :return-object="false"
              background-color="white"
              :rules="user?.city?.length > 0 ? noSpecialCharsRules : []"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
              :loading="isLoadingCities"
              :disabled="user.country === 'Brasil' && !user.state"
              clearable
              @change="handleChangeCity"
            />
            <v-text-field
              v-else
              key="foreignCityField"
              v-model.trim="user.city"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
              :rules="user?.state?.length > 0 ? noSpecialCharsRules : []"
            />
          </v-col>
        </v-row>
        <v-divider class="my-8 mx-2" />
        <v-row class="px-2">
          <v-col cols="12" class="py-4 pb-4">
            <p class="mb-1 text-medium-xs">
              Contato
            </p>
            <p class="mb-4 text-regular-xxs">
              Mantenha seus contatos atualizados para receber informações das suas reservas e ofertas exclusivas.
            </p>
          </v-col>
        </v-row>
        <v-row class="px-2">
          <v-col cols="12" class="pb-4 px-4">
            <p class="mb-1 text-regular-xxs">
              Email *
            </p>
            <v-text-field
              v-model.trim="email"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              disabled
              height="45px"
              hide-details="auto"
            />
          </v-col>

          <v-col cols="12" md="6" class="pb-4 pl-md-4">
            <p class="mb-1 text-regular-xxs">
              Telefone fixo
            </p>
            <v-row>
              <v-col cols="4">
                <v-autocomplete
                  v-model.trim="user.ddiPhone"
                  :items="country_and_ddi"
                  dense
                  outlined
                  background-color="white"
                  class="radius-login-360"
                  full-width
                  placeholder="DDI"
                  :item-text="item => `+${item.ddi} - (${item.country})`"
                  :item-value="item => `${item.ddi}`"
                  height="45px"
                  hide-details="auto"
                  @change="user.phone = ''"
                >
                  <template #selection="{ item }">
                    <span>+{{ item.ddi }} </span>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-if="user.ddiPhone === '55'"
                  key="brHomePhoneField"
                  v-model="user.phone"
                  v-mask="['(##) ####-####']"
                  dense
                  outlined
                  background-color="white"
                  class="radius-login-360"
                  placeholder="Telefone fixo"
                  :rules="user?.phone?.length > 0 ? homePhoneRules : []"
                  required
                  height="45px"
                  hide-details="auto"
                />
                <v-text-field
                  v-else
                  key="foreignHomePhoneField"
                  v-model="user.phone"
                  v-mask="['#################']"
                  dense
                  outlined
                  background-color="white"
                  class="radius-login-360"
                  placeholder="Telefone fixo"
                  :rules="user?.phone?.length > 0 ? foreignHomePhoneRules : []"
                  required
                  height="45px"
                  hide-details="auto"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" class="pb-4">
            <p class="mb-1 text-regular-xxs">
              Celular *
            </p>
            <v-row>
              <v-col cols="4">
                <v-autocomplete
                  v-model.trim="user.ddi"
                  :items="country_and_ddi"
                  dense
                  outlined
                  background-color="white"
                  class="radius-login-360"
                  full-width
                  placeholder="DDI"
                  :item-text="item => `+${item.ddi} - (${item.country})`"
                  :item-value="item => `${item.ddi}`"
                  height="45px"
                  hide-details="auto"
                  :rules="ddiRules"
                  @change="user.cellPhone = ''"
                >
                  <template #selection="{ item }">
                    <span>+{{ item.ddi }} </span>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-if="user.ddi === '55'"
                  key="brPhoneField"
                  v-model="user.cellPhone"
                  v-mask="['(##) #####-####']"
                  dense
                  outlined
                  background-color="white"
                  class="radius-login-360"
                  placeholder="Celular"
                  :rules="phoneRules"
                  required
                  height="45px"
                  hide-details="auto"
                />
                <v-text-field
                  v-else
                  key="foreignPhoneField"
                  v-model="user.cellPhone"
                  v-mask="['#################']"
                  dense
                  outlined
                  background-color="white"
                  class="radius-login-360"
                  placeholder="Celular"
                  :rules="foreignPhoneRules"
                  required
                  height="45px"
                  hide-details="auto"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-divider class="my-8 mx-2" />
        <v-row class="px-2">
          <v-col cols="12" class="py-4 pb-4">
            <p class="mb-1 text-medium-xs">
              Privacidade
            </p>
          </v-col>
        </v-row>
        <v-row class="px-2" no-gutters>
          <v-col cols="12">
            <v-checkbox
              v-model.trim="user.termsAndConditions"
              color="primary"
              hide-details="auto"
              :readonly="user.termsAndConditions !== null"
              :value="true"
            >
              <template #label>
                <span class="desc-regular-xxs">Declaro estar de acordo com os termos de uso e política de privacidade.</span>
              </template>
            </v-checkbox>
          </v-col>
          <v-col cols="12">
            <v-checkbox
              v-model.trim="user.emailOffers"
              color="primary"
              hide-details="auto"
            >
              <template #label>
                <span class="desc-regular-xxs">Quero receber ofertas, promoções exclusivas, cupons e novidades por e-mail.</span>
              </template>
            </v-checkbox>
          </v-col>
          <v-col cols="12">
            <v-checkbox
              v-model.trim="user.whatsappOffers"
              color="primary"
              hide-details="auto"
            >
              <template #label>
                <span class="desc-regular-xxs">Quero receber atualizações dos meus pedidos por WhatsApp.</span>
              </template>
            </v-checkbox>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="my-4 px-6">
            <p class="text-regular-xxs">
              Deseja alterar sua senha? <span class="primary--text pointer" @click="showModal">Clique aqui</span>
            </p>
            <p class="text-regular-xxs">
              Quer excluir a sua conta 360 Suítes? <span class="primary--text">Excluir conta</span>
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="2" class="my-4 px-6 offset-md-10" align="right">
            <v-btn
              color="primary"
              class="radius-login-360 text-transform"
              height="45px"
              block
              elevation="0"
              :loading="loadingForm"
              @click="saveProfile"
            >
              Salvar
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>
    <change-password ref="changePasswordDialog" />
    <forbidden ref="forbiddenDialog" :provider="provider" />
  </v-container>
</template>

<script>
import { Auth } from 'aws-amplify'
import { mapActions } from 'pinia'
import { useSnackbar } from '@/store'
import { useCheckUser } from '@/shared/composables/checkUser'
import TitleComponent from '@/components/shared/Title.vue'
import ChangePassword from '@/components/profile/ChangePassword.vue'
import Forbidden from '@/components/profile/Forbidden.vue'
import { openApi as api360, signedApi, cepApi, ibgeApi, sendForm, hubspotForm } from '@/api'
import {
  firstnameRules,
  lastnameRules,
  emailRules,
  genderRules,
  cepRules,
  phoneRules,
  foreignPhoneRules,
  ddiRules,
  homePhoneRules,
  foreignHomePhoneRules,
  birthdateRules,
  cpfRules,
  noSpecialCharsRules
} from '@/rules'

export default {
  name: 'ProfilePage',
  components: {
    TitleComponent,
    ChangePassword,
    Forbidden
  },
  layout: 'profile',
  setup (context) {
    const { userName, checkUser, email, useRouteWatcher } = useCheckUser(context)
    checkUser()
    useRouteWatcher()
    return {
      userName,
      email
    }
  },
  data () {
    return {
      provider: '',
      user: {
        firstName: '',
        lastName: '',
        email: '',
        ddi: '',
        ddiPhone: '',
        cellPhone: '',
        country: '',
        facebookId: '',
        googleId: '',
        whatsappOffers: false,
        emailOffers: false,
        termsAndConditions: true,
        firstActivation: false,
        status: true,
        birthdate: null,
        genre: null,
        rg: null,
        cpf: null,
        passport: null,
        postalCode: null,
        address: null,
        complement: null,
        county: null,
        city: null,
        state: null,
        phone: null
      },
      isLoading: true,
      isLoadingCities: false,
      loadingForm: false,
      states: [],
      cities: [],
      country_and_ddi: [],
      valid: false,
      firstnameRules,
      lastnameRules,
      genderRules,
      cepRules,
      birthdateRules,
      emailRules,
      phoneRules,
      foreignPhoneRules,
      ddiRules,
      homePhoneRules,
      foreignHomePhoneRules,
      cpfRules,
      noSpecialCharsRules,
      attrs: {
        boilerplate: true,
        elevation: 0
      }
    }
  },
  watch: {
    user: {
      handler () {
        if (this.user.country === 'Brasil') {
          this.getStates()
        }
        if (this.user.uf?.length === 9) {
          this.getStates()
          this.getCities()
        }
      },
      deep: true
    }
  },
  beforeMount () {
    this.fetchData()
    this.user.addressNumber = null
    this.searchAddress()
  },
  methods: {
    ...mapActions(useSnackbar, ['showSnackbar']),
    searchAddress () {
      this.clearFields()
      if (!this.user.postalCode) {
        return
      }
      if (!this.user.postalCode || this.user.postalCode.length < 9) { return }
      cepApi.get(`/${this.user.postalCode}/json`).then(({ data }) => {
        if (data.erro) {
          this.showSnackbar({
            text: 'CEP não encontrado',
            timeout: 8000,
            color: 'error'
          })
          return
        }
        this.user.state = data.uf
        this.user.country = data.country = 'Brasil'
        this.getStates()
        this.getCities()
        this.user.address = data.logradouro.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
        this.user.county = data.bairro
        this.user.city = data.localidade
      }).catch(() => {
        this.showSnackbar({
          text: 'Erro ao buscar CEP',
          timeout: 8000,
          color: 'error'
        })
      })
    },
    handleChangeCity () {
      if (typeof this.user.city === 'object') {
        this.user.city = this.user.city.nome
      }
    },
    clearFields () {
      if (this.user.country !== 'Brasil') {
        this.states = []
        this.cities = []
      }
      this.user.address = ''
      this.user.county = ''
      this.user.city = ''
      this.user.state = ''
      this.user.addressNumber = null
      this.user.complement = ''
    },
    handleChangeCountry () {
      this.user.postalCode = ''
      this.clearFields()
    },
    fetchData () {
      Auth.currentAuthenticatedUser()
        .then((user) => {
          const email = user.attributes.email
          Promise.all([
            ibgeApi.get('/estados'),
            api360.get('/website-users'),
            signedApi.get(`/website-users/user-by-email/${email}`)
          ]).then(([{ data: states }, { data: countries }, { data: userData }]) => {
            this.states = states
            this.country_and_ddi = countries
            this.user = userData
            if (!userData.country) {
              this.user.country = 'Brasil'
            }
            if (!userData.ddi) {
              this.user.ddi = '55'
            }
            if (!userData.ddiPhone) {
              this.user.ddiPhone = '55'
            }
            this.provider = this.user?.googleId?.length ? 'Google' : this.user?.facebookId?.length ? 'Facebook' : ''
            this.getStates()
            this.getCities()
          }).catch((error) => {
            Auth.signOut({ global: true })
            this.$router.push('/entrar')
            this.showSnackbar({
              text: error,
              timeout: 5000,
              color: 'error'
            })
          }).finally(() => {
            this.isLoading = false
          })
        })
        .catch((err) => {
          Auth.signOut({ global: true })
          this.$router.push('/entrar')
          // eslint-disable-next-line no-console
          console.error(err)
        })
    },
    changeState () {
      this.cities = []
      this.getCities()
    },
    getCities () {
      if (!this.user.state) {
        this.user.city = ''
        this.cities = []
        return
      }
      if (typeof this.user.state === 'object') {
        this.user.state = this.user.state.sigla
      }
      if (this.user.country !== 'Brasil') { return }
      this.isLoadingCities = true
      ibgeApi.get(`/estados/${this.user.state}/municipios`).then(({ data }) => {
        this.cities = data
      }).catch(() => {
        this.showSnackbar({
          text: 'Erro ao buscar cidades',
          timeout: 5000,
          color: 'error'
        })
      }).finally(() => {
        this.isLoadingCities = false
      })
    },
    getStates () {
      if (this.user.country !== 'Brasil') { return }
      ibgeApi.get('/estados').then(({ data }) => {
        this.states = data
      }).catch(() => {
        this.showSnackbar({
          text: 'Erro ao buscar estados',
          timeout: 5000,
          color: 'error'
        })
      })
    },
    saveProfile () {
      this.$refs.form.validate()
      if (this.valid) {
        this.loadingForm = true
        sendForm([
          {
            name: 'firstname',
            value: this.user?.firstName
          },
          {
            name: 'lastname',
            value: this.user?.lastName
          },
          {
            name: 'data_de_nascimento',
            value: this.user?.birthdate
          },
          {
            name: 'cpf',
            value: this.user?.cpf
          },
          {
            name: 'rg',
            value: this.user?.rg
          },
          {
            name: 'passaporte',
            value: this.user?.passport || 0
          },
          {
            name: 'genero',
            value: this.getGenre(this.user?.genre)
          },
          {
            name: 'zip',
            value: this.user?.postalCode
          },
          {
            name: 'country',
            value: this.user?.country
          },
          {
            name: 'numero_do_endereco',
            value: this.user?.addressNumber
          },
          {
            name: 'address',
            value: this.user?.address
          },
          {
            name: 'complemento_do_endereco',
            value: this.user?.complement
          },
          {
            name: 'bairro',
            value: this.user?.county
          },
          {
            name: 'state',
            value: this.user?.state
          },
          {
            name: 'city',
            value: this.user?.city
          },
          {
            name: 'email',
            value: this.user?.email
          },
          {
            name: 'phone',
            value: `${this.user?.ddiPhone} ${this.user?.phone}`
          },
          {
            name: 'mobilephone',
            value: `${this.user?.ddi} ${this.user?.cellPhone}`
          },
          {
            name: 'voce_teria_interesse_em_uma_newsletter_da_360_',
            value: this.user?.emailOffers ? 'Sim' : 'Não'
          },
          {
            name: 'consentimento_whatsapp',
            value: this.user?.whatsappOffers
          }
        ], {
          pageUri: hubspotForm.profile.pageUri,
          pageName: hubspotForm.profile.pageName
        }, hubspotForm.profile.id)
        signedApi.put(`/website-users/update-user/${this.user.id}`, this.user).then(() => {
          this.showSnackbar({
            text: 'Perfil atualizado com sucesso!',
            timeout: 5000,
            color: 'success'
          })
        }).catch((error) => {
          this.showSnackbar({
            text: error,
            timeout: 5000,
            color: 'error'
          })
        }).finally(() => {
          this.loadingForm = false
        })
      }
    },
    getGenre (genre) {
      switch (genre) {
        case 'male':
          return 'Masculino'
        case 'female':
          return 'Feminino'
        default:
          return 'Outros'
      }
    },
    showModal () {
      if (this.provider.length) {
        this.$refs.forbiddenDialog.openForbidden()
      } else {
        this.$refs.changePasswordDialog.openDialogPassword()
      }
    }
  }
}
</script>
