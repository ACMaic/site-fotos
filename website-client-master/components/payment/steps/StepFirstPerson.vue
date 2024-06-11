<template>
  <v-container fluid class="form-wrapper" :style="$vuetify.breakpoint.lgAndUp ? 'background-color: #F6F6F6;' : ''">
    <v-row v-if="isLoading">
      <v-col
        v-for="col in 4"
        :key="col"
        cols="12"
      >
        <v-skeleton-loader type="heading" />
      </v-col>
    </v-row>
    <v-form
      v-else
      ref="form"
      v-model="valid"
      class="pa-2"
      @submit.prevent="($event) => $event.preventDefault()"
    >
      <v-row no-gutters>
        <v-col cols="12">
          <v-list-item-content>Nome completo*</v-list-item-content>
          <v-text-field
            v-model="form.name"
            dense
            outlined
            background-color="white"
            class="radius-login-360"
            :rules="nameRules"
            placeholder="Nome completo"
            required
            height="45px"
            hide-details="auto"
            :disabled="disableFields"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" md="6" class="pt-4">
          <v-list-item-content>Documento*</v-list-item-content>
          <v-select
            v-model="form.typeDocumentId"
            placeholder="CPF"
            :items="documentIdList"
            dense
            outlined
            background-color="white"
            class="radius-login-360"
            :rules="requiredRules"
            required
            height="45px"
            hide-details="auto"
            :disabled="disableFields"
            @change="clearDocFields"
          >
            <template #selection="{ item }">
              <span style="font-size: 13px;">{{ item }}</span>
            </template>
            <template #item="{ item }">
              {{ item }}
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" md="6" class="pt-4 pl-md-2">
          <v-list-item-content>Nº Documento*</v-list-item-content>
          <v-text-field
            v-if="form.typeDocumentId === 'CPF'"
            key="cpfOrRgField"
            v-model="form.documentId"
            v-mask="documentHelpers.getDocumentIdMaks(form)"
            dense
            outlined
            background-color="white"
            class="radius-login-360"
            :rules="documentHelpers.getDocumentIdRules(form)"
            required
            height="45px"
            hide-details="auto"
            :disabled="disableFields"
          />
          <v-text-field
            v-if="form.typeDocumentId === 'RG'"
            key="rgField"
            v-model="form.documentId"
            v-mask="documentHelpers.getDocumentIdMaks(form)"
            dense
            outlined
            background-color="white"
            class="radius-login-360"
            :rules="documentHelpers.getDocumentIdRules(form)"
            required
            height="45px"
            hide-details="auto"
            :disabled="disableFields"
          />
          <v-text-field
            v-if="form.typeDocumentId === 'Passaporte'"
            key="passportField"
            v-model="form.documentId"
            dense
            outlined
            background-color="white"
            class="radius-login-360"
            :rules="documentHelpers.getDocumentIdRules(form)"
            required
            height="45px"
            hide-details="auto"
            :disabled="disableFields"
          />
        </v-col>
        <v-col cols="12" md="5" class="pt-4">
          <v-list-item-content>Data de Nascimento*</v-list-item-content>
          <v-text-field
            v-model.trim="form.birthdate"
            dense
            outlined
            background-color="white"
            class="radius-login-360"
            :rules="birthdateRules"
            type="date"
            height="45px"
            hide-details="auto"
            max="2023-12-01"
            :disabled="disableFields"
          />
        </v-col>
        <v-col cols="4" md="2" class="pt-4 pl-md-2">
          <v-list-item-content>DDI*</v-list-item-content>
          <v-autocomplete
            v-model="form.ddi"
            :items="country_and_ddi"
            dense
            outlined
            background-color="white"
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
            :disabled="disableFields"
            @change="form.cellPhone = ''"
          >
            <template #selection="{ item }">
              <span>+{{ item.ddi }}</span>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="8" md="5" class="pt-4 pl-2">
          <v-list-item-content>Celular*</v-list-item-content>
          <v-text-field
            v-if="form.ddi === 55"
            key="brPhoneField"
            v-model="form.cellPhone"
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
            :disabled="disableFields"
          />
          <v-text-field
            v-else
            key="foreignPhoneField"
            v-model="form.cellPhone"
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
            :disabled="disableFields"
          />
        </v-col>
      </v-row>
      <p class="text-medium-xxs mt-8">
        Endereço
      </p>
      <v-row no-gutters>
        <v-col cols="12">
          <v-list-item-content>País</v-list-item-content>
          <v-autocomplete
            v-model.trim="form.country"
            :items="country_and_ddi"
            item-text="country"
            item-value="country"
            :rules="requiredRules"
            dense
            outlined
            background-color="white"
            class="radius-login-360"
            height="45px"
            hide-details="auto"
            clearable
            :disabled="disableFields"
            @change="handleChangeCountry"
          />
        </v-col>
      </v-row>
      <div v-if="form.country === 'Brasil'">
        <v-row no-gutters>
          <v-col cols="12" md="3">
            <v-list-item-content>CEP*</v-list-item-content>
            <v-text-field
              v-if="form.country === 'Brasil'"
              key="brCepField"
              v-model.trim="form.postalCode"
              v-mask="'#####-###'"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              :rules="form?.postalCode?.length > 0 ? cepRules : requiredRules"
              height="45px"
              hide-details="auto"
              required
              @blur="searchAddress"
              @input="clearFields"
            />
            <v-text-field
              v-else
              key="foreignCepField"
              v-model.trim="form.postalCode"
              v-mask="'######################'"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              :rules="requiredRules"
              height="45px"
              hide-details="auto"
              required
              @blur="searchAddress"
              @input="clearFields"
            />
          </v-col>
          <v-col cols="12" md="6" class="pl-md-2">
            <v-list-item-content>Rua*</v-list-item-content>
            <v-text-field
              v-model.trim="form.address"
              dense
              outlined
              background-color="white"
              :rules="form?.address?.length > 0 ? noSpecialCharsRules : requiredRules"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
              :disabled="disableFields"
            />
          </v-col>
          <v-col cols="12" md="3" class="pl-md-2">
            <v-list-item-content>Número*</v-list-item-content>
            <v-text-field
              v-model="form.addressNumber"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              :rules="numberRules"
              required
              height="45px"
              hide-details="auto"
              :disabled="disableFields"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="4" class="pt-4">
            <v-list-item-content>Complemento</v-list-item-content>
            <v-text-field
              v-model="form.complement"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              placeholder="Ex. Casa Branca"
              height="45px"
              hide-details="auto"
              :disabled="disableFields"
            />
          </v-col>
          <v-col cols="12" md="8" class="pt-4 pl-md-2">
            <v-list-item-content>Bairro*</v-list-item-content>
            <v-text-field
              v-model.trim="form.county"
              dense
              outlined
              background-color="white"
              :rules="form?.county?.length > 0 ? noSpecialCharsRules : requiredRules"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
              :disabled="disableFields"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="4" class="pt-4">
            <v-list-item-content>Estado*</v-list-item-content>
            <v-autocomplete
              v-if="form.country === 'Brasil'"
              key="autoCompleteStateField"
              v-model.trim="form.state"
              :items="states"
              item-text="nome"
              item-value="sigla"
              :return-object="false"
              dense
              :rules="form?.state?.length > 0 ? noSpecialCharsRules : []"
              outlined
              background-color="white"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
              clearable
              :disabled="disableFields"
              @change="changeState"
            />
            <v-text-field
              v-else
              key="foreignStateField"
              v-model.trim="form.state"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
              :rules="form?.state?.length > 0 ? noSpecialCharsRules : []"
              :disabled="disableFields"
              @change="changeState"
            />
          </v-col>
          <v-col cols="12" md="8" class="pt-4 pl-md-2">
            <v-list-item-content>Cidade*</v-list-item-content>
            <v-autocomplete
              v-if="form.country === 'Brasil'"
              key="autoCompleteCityField"
              v-model.trim="form.city"
              :items="cities"
              item-text="nome"
              item-value="nome"
              :return-object="false"
              dense
              outlined
              background-color="white"
              :disabled="!form.state && form.country === 'Brasil'"
              :rules="form?.city?.length > 0 && form?.country === 'Brasil' ? noSpecialCharsRules : requiredRules"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
              :loading="isLoadingCities"
              clearable
            />
            <v-text-field
              v-else
              key="foreignCityField"
              v-model.trim="form.city"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
              :disabled="!form.state && form.country === 'Brasil'"
              :rules="form?.city?.length > 0 && form?.country === 'Brasil' ? noSpecialCharsRules : requiredRules"
            />
          </v-col>
        </v-row>
      </div>
    </v-form>
  </v-container>
</template>
<script>
import { Auth } from 'aws-amplify'
import { mapActions } from 'pinia'
import documentHelpers from './StepHelpers'
import { usePaymentStore, useSnackbar } from '@/store'
import { openApi as api360, cepApi, ibgeApi, signedApi } from '@/api'
import { nameRules, requiredRules, cpfRules, rgRules, passaporteRules, birthdateRules, phoneRules, foreignPhoneRules, cepRules, noSpecialCharsRules, numberRules } from '@/rules'
export default {
  name: 'StepFirstPersonComponent',
  props: {
    isPreCheckin: {
      type: Boolean,
      default: false
    },
    disableFields: {
      type: Boolean,
      default: false
    },
    myReservations: {
      type: Boolean,
      default: false
    }
  },
  emits: ['first-person-data'],
  setup () {
    const paymentStore = usePaymentStore()
    const { setPeopleForm } = usePaymentStore()
    return { setPeopleForm, paymentStore }
  },
  data () {
    return {
      isLoading: true,
      form: {
        name: '',
        email: '',
        typeDocumentId: 'CPF',
        documentId: '',
        birthdate: null,
        ddi: '',
        cellPhone: '',
        postalCode: null,
        address: null,
        addressNumber: null,
        county: null,
        complement: null,
        country: null,
        city: null,
        state: null
      },
      valid: false,
      nameRules,
      requiredRules,
      cpfRules,
      rgRules,
      passaporteRules,
      birthdateRules,
      phoneRules,
      foreignPhoneRules,
      cepRules,
      noSpecialCharsRules,
      numberRules,
      documentIdList: ['CPF', 'RG', 'Passaporte'],
      country_and_ddi: [],
      states: [],
      isLoadingCities: false,
      documentHelpers,
      booking: {}
    }
  },
  watch: {
    valid: {
      handler: function (isValid) {
        if (isValid) {
          this.setPeopleForm({ firstPersonForm: this.form })
        } else {
          this.setPeopleForm({ firstPersonForm: null })
        }
      },
      deep: true
    },
    form: {
      handler: function (newValue) {
        this.$emit('first-person-data', { ...newValue, valid: this.valid })
      },
      deep: true
    }
  },
  beforeMount () {
    this.getStates()
    this.getCities()
    this.fetchData()
    this.form.typeDocumentId = 'CPF'
  },
  methods: {
    ...mapActions(useSnackbar, ['showSnackbar']),
    clearDocFields () {
      this.form.documentId = ''
    },
    fetchData () {
      Promise.all([
        ibgeApi.get('/estados'),
        api360.get('/website-users')
      ]).then(([{ data: states }, { data: countries }]) => {
        this.states = states
        const [brazil] = countries
        const otherCountries = countries.slice(1).sort((a, b) => a.country.localeCompare(b.country))
        this.country_and_ddi = [brazil, ...otherCountries]
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      })

      if (this.myReservations) {
        this.isLoading = false
        return
      }

      if (this.isPreCheckin) {
        this.fetchPreCheckinData()
        return
      }

      Auth.currentAuthenticatedUser().then((user) => {
        const email = user.attributes.email
        this.isLoading = true
        signedApi.get(`/website-users/user-by-email/${email}`).then(({ data }) => {
          this.form = {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            typeDocumentId: data.cpf ? 'CPF' : data.rg ? 'RG' : 'CPF',
            documentId: data.cpf || data.rg || '',
            birthdate: data.birthdate || null,
            ddi: Number(data.ddi) || '',
            cellPhone: data.cellPhone || '',
            postalCode: data.postalCode || null,
            address: data.address || null,
            addressNumber: data.addressNumber || null,
            county: data.county || null,
            complement: data.complement || null,
            country: data.country || null,
            city: data.city || null,
            state: data.state || null
          }
          this.getStates()
          this.getCities()
        }).catch((error) => {
          this.isLoading = false
          // eslint-disable-next-line no-console
          console.error(error)
        }).finally(() => {
          this.isLoading = false
        })
      })
    },
    fetchPreCheckinData () {
      const bookId = this.$route?.query?.bookId || this.$route?.query?.bookingId
      api360.get(`/check-in-api/${bookId}`).then(({ data }) => {
        const userData = data.firstPerson
        const userAddress = userData.address
        this.form.postalCode = userAddress?.zip || ''
        this.booking = data
        this.searchAddress()
        this.form = {
          name: userData.name,
          email: userData.email,
          typeDocumentId: userData.docType,
          documentId: userData.doc,
          birthdate: userData.birthday || null,
          ddi: Number(userData.ddi) || '',
          cellPhone: userData.phone || '',
          postalCode: userAddress?.zip || '',
          address: userAddress?.fullAddress || '',
          addressNumber: userAddress?.fullAddress.split(',')[1].trim() || null,
          county: userData.county || null,
          complement: userData.complement || null,
          country: userData.country || null,
          city: userData.city || null,
          state: userData.state || null
        }
        this.getStates()
        this.getCities()

        if (!data?.custom9?.length) {
          Auth.currentAuthenticatedUser().then((user) => {
            const email = user.attributes.email
            this.isLoading = true
            signedApi.get(`/website-users/user-by-email/${email}`).then(({ data }) => {
              this.form = {
                name: `${data.firstName} ${data.lastName}`,
                email: data.email,
                typeDocumentId: data.cpf ? 'CPF' : data.rg ? 'RG' : 'CPF',
                documentId: data.cpf || data.rg || '',
                birthdate: data.birthdate || null,
                ddi: Number(data.ddi) || '',
                cellPhone: data.cellPhone || '',
                postalCode: data.postalCode || null,
                address: data.address || null,
                addressNumber: data.addressNumber || null,
                county: data.county || null,
                complement: data.complement || null,
                country: data.country || null,
                city: data.city || null,
                state: data.state || null
              }
              this.blocklistValidation(this.form)
              this.getStates()
              this.getCities()
            }).catch((error) => {
              this.isLoading = false
              // eslint-disable-next-line no-console
              console.error(error)
            }).finally(() => {
              this.isLoading = false
            })
          })
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      }).finally(() => {
        this.isLoading = false
      })
    },
    searchAddress () {
      if (!this.form.postalCode) {
        return
      }
      if (!this.form.postalCode || this.form.postalCode.length < 9) {
        return
      }

      if (this.form.country !== 'Brasil') {
        return
      }
      if (!this.form.postalCode || this.form.postalCode.length < 9) { return }
      cepApi.get(`/${this.form.postalCode}/json`).then(({ data }) => {
        if (data.erro) {
          this.showSnackbar({
            text: 'CEP não encontrado',
            timeout: 8000,
            color: 'error'
          })
          return
        }
        this.form.state = data.uf
        this.form.country = data.country = 'Brasil'
        this.getStates()
        this.getCities()
        this.form.address = data.logradouro.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
        this.form.county = data.bairro
        this.form.city = data.localidade
      }).catch(() => {
        this.showSnackbar({
          text: 'Erro ao buscar CEP',
          timeout: 8000,
          color: 'error'
        })
      })
    },
    changeState () {
      this.cities = []
      this.getCities()
    },
    blocklistValidation (item) {
      api360.post('/blocklist-api/validation', {
        email: item.email,
        cpf: item.documentId,
        phone: item.cellPhone,
        rg: item.documentId,
        passport: item.documentId,
        bookingId: this.$route.query?.bookingId || this.$route.query?.bookId
      }).then(({ data }) => {
        if (data) {
          this.showSnackbar({
            text: 'Falha na tentativa de check-in. Tente novamente mais tarde.',
            timeout: -1,
            color: 'error'
          })
          this.paymentStore.setCurrentStep(1)
          localStorage.setItem('guest', 1)
          localStorage.setItem('hasParking', null)
          localStorage.setItem('dates', [])
          this.$router.replace('/')
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      }).finally(() => {
        this.isLoading = false
      })
    },
    getCities () {
      if (!this.form.state) {
        this.form.city = ''
        this.cities = []
        return
      }
      if (this.form.country !== 'Brasil') {
        return
      }
      this.isLoadingCities = true
      ibgeApi.get(`/estados/${this.form.state}/municipios`).then(({ data }) => {
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
    handleChangeCountry () {
      this.clearFields()
      this.form.postalCode = ''
    },
    clearFields () {
      if (this.form.country !== 'Brasil') {
        this.cities = []
        this.states = []
      }
      const clearedData = {
        address: '',
        addressNumber: '',
        county: '',
        complement: '',
        city: '',
        state: ''
      }
      this.form = { ...this.form, ...clearedData }
    }
  }
}
</script>
<style lang="scss" scoped>
.v-list-item__content {
  font-size: 14px !important;
}
</style>
