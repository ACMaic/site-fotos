<template>
  <div>
    <v-row v-if="$vuetify.breakpoint.lgAndUp" no-gutters>
      <v-col cols="12">
        <span class="primary--text text-medium-xs">Dados de Pagamento</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="opt in paymentOptions" :key="opt.id" cols="6" md="4">
        <div
          class="payment-sheet pointer"
          :class="selectedOption === opt.id ? 'selected-sheet' : 'unselected-sheet'"
          @click="changeOption(opt.id)"
        >
          <v-icon :color="selectedOption === opt.id ? 'white' : 'primaryOwner'">
            {{ opt.icon }}
          </v-icon>
          <br>
          <span
            class="text-services"
            :class="selectedOption === opt.id ? 'white--text' : 'primaryOwner--text'"
          >
            {{ opt.name }}
          </span>
        </div>
      </v-col>
    </v-row>

    <!-- <v-row v-if="$vuetify.breakpoint.lgAndUp && selectedOption === 1" no-gutters>
      <v-btn
        color="secondary"
        depressed
        height="50px"
        class="radius-login-360 text-unset my-4 black--text"
        @click="fillWithGuestData"
      >
        Preencher com dados do hóspede
      </v-btn>
    </v-row> -->

    <v-form ref="form" v-model="valid" @submit.prevent="($event) => $event.preventDefault()">
      <div v-if="selectedOption === 1">
        <v-row no-gutters class="mt-3">
          <v-col cols="12">
            <span class="text-medium-xxs">Pagamento via Cartão de Crédito</span>
          </v-col>
          <v-col cols="12" md="6">
            <v-list-item-content>Parcelas</v-list-item-content>
            <v-select
              v-model="form.card.installment"
              :items="installmentOptions"
              background-color="white"
              placeholder="Selecione o número de parcelas"
              outlined
              required
              :rules="requiredRules"
              item-value="quant"
              item-text="value"
              dense
              height="45px"
              hide-details="auto"
              :loading="loadingInstallments"
              @click="clieckedInstallments"
            >
              <template #item="{ item }">
                <v-list-item-content>
                  <v-row>
                    <v-col cols="8">
                      <span class="text-regular-xxs">
                        {{ item.quant }}x de {{ item.value | currency }}
                      </span>
                    </v-col>
                    <v-col cols="4">
                      <span class="desc-regular-xs primaryOwner--text">
                        {{ totalPrice | currency }}
                      </span>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </template>
              <template #selection="{ item }">
                <span class="text-regular-xxs">{{ item.quant }}x de {{ item.value | currency }}</span>
              </template>
            </v-select>
          </v-col>
        </v-row>
        <!-- <v-row v-if="$vuetify.breakpoint.mdAndDown" no-gutters>
          <v-btn
            color="secondary"
            depressed
            height="50px"
            class="radius-login-360 text-unset mt-3 black--text"
            :width="$vuetify.breakpoint.lgAndUp ? 'auto' : '100%'"
            @click="fillWithGuestData"
          >
            Preencher com dados do hóspede
          </v-btn>
        </v-row> -->
        <v-row class="mt-md-1" no-gutters>
          <v-col cols="12" md="8">
            <v-list-item-content>Nome do titular*</v-list-item-content>
            <v-text-field
              v-model="form.user.name"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              placeholder="Assim como está impresso no cartão"
              height="45px"
              hide-details="auto"
              :rules="nameRules"
            />
          </v-col>
          <v-col cols="12" md="4" class="pl-md-2">
            <v-list-item-content>Número do Cartão</v-list-item-content>
            <v-text-field
              v-model="form.card.number"
              v-mask="'#### #### #### ####'"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
              required
              :rules="cardNumberRules"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-list-item-content>Validade*</v-list-item-content>
            <v-text-field
              v-model="form.card.expirationDate"
              v-mask="'##/##'"
              :rules="expirationDateRules"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              placeholder="mm/aa"
              height="45px"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="2" class="pl-md-2">
            <v-list-item-content>CVV*</v-list-item-content>
            <v-text-field
              v-model="form.card.securityCode"
              v-mask="'###'"
              :rules="securityCodeRules"
              dense
              outlined
              placeholder="***"
              background-color="white"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="4" class="pl-md-2">
            <v-list-item-content>CPF*</v-list-item-content>
            <v-text-field
              key="paymentDocumentFIeld"
              v-model.trim="form.user.documentId"
              v-mask="'###.###.###-##'"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              :rules="cpfRules"
              height="45px"
              hide-details="auto"
              required
            />
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-6">
          <v-col cols="12">
            <span class="text-medium-xxs">Endereço</span>
          </v-col>
          <v-col cols="12" md="6">
            <v-list-item-content>País</v-list-item-content>
            <v-autocomplete
              v-model.trim="form.user.country"
              :items="country_and_ddi"
              :rules="form.user?.country?.length > 0 ? noSpecialCharsRules : []"
              item-text="country"
              item-value="country"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
              clearable
              @change="handleChangeCountry"
            />
          </v-col>
          <v-col cols="12" md="3" class="pl-md-2">
            <v-list-item-content>CEP*</v-list-item-content>
            <v-text-field
              v-if="form.user.country === 'Brasil'"
              key="cepFieldBr"
              v-model.trim="form.user.postalCode"
              v-mask="'#####-###'"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              :rules="form?.user.postalCode?.length > 0 ? cepRules : requiredRules"
              height="45px"
              hide-details="auto"
              required
              @blur="searchAddress"
              @input="clearFields"
            />
            <v-text-field
              v-else
              key="cepFieldForeign"
              v-model.trim="form.user.postalCode"
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
          <v-col cols="12" md="6">
            <v-list-item-content>Logradouro*</v-list-item-content>
            <v-text-field
              v-model.trim="form.user.address"
              dense
              outlined
              background-color="white"
              :rules="form?.address?.length > 0 && form?.user.country === 'Brasil' ? noSpecialCharsRules : requiredRules"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="2" class="pl-md-2">
            <v-list-item-content>Número*</v-list-item-content>
            <v-text-field
              v-model="form.user.addressNumber"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              :rules="numberRules"
              required
              height="45px"
              hide-details="auto"
            />
          </v-col>

          <v-col cols="12" md="4" class="pl-md-2">
            <v-list-item-content>Complemento</v-list-item-content>
            <v-text-field
              v-model="form.user.complement"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              placeholder="Ex. Casa Branca"
              height="45px"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="8" class="pr-md-2">
            <v-list-item-content>Bairro*</v-list-item-content>
            <v-text-field
              v-model.trim="form.user.county"
              dense
              outlined
              background-color="white"
              :rules="form?.county?.length > 0 && form?.user.country === 'Brasil' ? noSpecialCharsRules : requiredRules"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-list-item-content>Estado*</v-list-item-content>
            <v-autocomplete
              v-if="form.user.country === 'Brasil'"
              key="autoCompleteStateField"
              v-model.trim="form.user.state"
              :items="states"
              item-text="nome"
              item-value="sigla"
              dense
              :rules="form?.user?.state?.length > 0 ? noSpecialCharsRules : []"
              outlined
              background-color="white"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
              clearable
              @change="changeState"
            />
            <v-text-field
              v-else
              key="foreignStateField"
              v-model.trim="form.user.state"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
              :rules="form?.user?.state?.length > 0 ? noSpecialCharsRules : []"
            />
          </v-col>
          <v-col cols="12" md="8">
            <v-list-item-content>Cidade*</v-list-item-content>
            <v-autocomplete
              v-if="form.user.country === 'Brasil'"
              key="autoCompleteCityField"
              v-model.trim="form.user.city"
              :items="cities"
              item-text="nome"
              item-value="nome"
              dense
              outlined
              background-color="white"
              :disabled="!form.user.state && form.user.country === 'Brasil'"
              :rules="form?.user.city?.length > 0 && form?.user.country === 'Brasil' ? noSpecialCharsRules : requiredRules"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
              :loading="isLoadingCities"
              clearable
            />
            <v-text-field
              v-else
              key="foreignCityField"
              v-model.trim="form.user.city"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              height="45px"
              hide-details="auto"
              :rules="form?.user.city?.length > 0 && form?.user.country === 'Brasil' ? noSpecialCharsRules : requiredRules"
              :disabled="!form.user.state && form.user.country === 'Brasil'"
            />
          </v-col>
        </v-row>
      </div>

      <div v-else>
        <v-row no-gutters class="mt-4 mb-5">
          <v-col cols="12">
            <span class="text-medium-xxs">Pagamento via Pix</span>
          </v-col>
          <v-col cols="12" class="mt-2">
            <span class="desc-medium-xxs">Pague de forma rápida e segura. A liberação do pagamento é instantânea.</span>
          </v-col>
        </v-row>
        <v-row
          v-for="instruction in pixInstructions"
          :key="instruction.step"
          no-gutters
          class="my-3"
        >
          <v-col cols="2" md="1">
            <v-chip color="secondary">
              <span class="black--text">{{ instruction.step }}</span>
            </v-chip>
          </v-col>
          <v-col cols="10" md="11" class="pt-1">
            <span v-html="instruction.text" />
          </v-col>
        </v-row>
      </div>

      <v-row no-gutters class="mt-6">
        <v-col cols="12">
          <span class="text-medium-xxs">Termos de Uso</span>
        </v-col>
        <v-col cols="12" class="py-4 ma-0">
          <v-checkbox
            v-model="form.termsOfUse.termsAndConditions"
            class="ma-0 pa-0"
            color="primary"
            :rules="termsAndConditionsRules"
            hide-details="auto"
          >
            <template #label>
              <span class="desc-regular-xxs black--text">
                Declaro estar de acordo com os <nuxt-link to="/termos-de-uso" tag="a">termos de uso</nuxt-link>, <nuxt-link to="/politica-de-privacidade" tag="a">política de privacidade</nuxt-link> e <nuxt-link to="/politicas-cancelamento" tag="a">política de
                  cancelamento</nuxt-link>.
              </span>
            </template>
          </v-checkbox>
        </v-col>
        <v-col cols="12" class="pb-4 ma-0">
          <v-checkbox
            v-model="form.termsOfUse.whatsappOffers"
            class="ma-0 pa-0"
            color="primary"
            hide-details="auto"
          >
            <template #label>
              <span class="desc-regular-xxs black--text">
                Aceito receber atualizações da minha reserva por WhatsApp.
              </span>
            </template>
          </v-checkbox>
        </v-col>
        <v-col cols="12" class="pb-4 ma-0">
          <v-checkbox
            v-model="form.termsOfUse.emailOffers"
            class="ma-0 pa-0"
            color="primary"
            hide-details="auto"
          >
            <template #label>
              <span class="desc-regular-xxs black--text">
                Quero receber ofertas, promoções exclusivas, cupons e novidades por e-mail.
              </span>
            </template>
          </v-checkbox>
        </v-col>
      </v-row>
    </v-form>
    <v-row no-gutters class="justify-end">
      <v-btn
        v-scroll-to="$vuetify.breakpoint.mdAndDown && selectedOption === 1 ? '#reservation-receipt' : ''"
        color="secondary"
        depressed
        height="50px"
        class="radius-login-360 text-unset my-4 black--text"
        type="submit"
        :width="$vuetify.breakpoint.lgAndUp ? 'auto' : '100%'"
        :disabled="!valid || isLoadingPayment"
        :loading="isLoadingPayment"
        @click="advanceStep"
      >
        {{ selectedOption === 1 ? 'Confirmar o Pagamento' : 'Gerar código Pix' }}
      </v-btn>
    </v-row>
    <pix-dialog ref="pixDialog" @advance="confirmPixPayment" />
    <!--<payment-error-dialog ref="paymentErrorDialog" @pix="payWithPix" />-->
  </div>
</template>
<script>
import { format, differenceInDays } from 'date-fns'
import { mapActions } from 'pinia'
import { toRefs } from '@nuxtjs/composition-api'
import Crypto from 'crypto-js'
import PixDialog from '../PIXDialog.vue'
// import PaymentErrorDialog from '../PaymentErrorDialog.vue'
import { formatName } from '../../../shared/utils'
import { openApi as api360, cepApi, ibgeApi, sendForm, hubspotForm } from '@/api'
import {
  nameRules,
  requiredRules,
  cpfRules,
  rgRules,
  passaporteRules,
  birthdateRules,
  phoneRules,
  cepRules,
  noSpecialCharsRules,
  numberRules,
  termsAndConditionsRules,
  cardNumberRules,
  securityCodeRules,
  expirationDateRules
} from '@/rules'
import { useReservationStore, usePaymentStore, useSnackbar } from '@/store'
import { currency360 } from '@/shared/currency'
import { pixInstructions, paymentOptions, getInstallments } from '@/shared/constants'
import voucherApplyBus from '@/events/voucherApplyBus'
import voucherBus from '@/events/voucherBus'
import countdownBus from '@/events/countdownBus'

export default {
  name: 'StepPayment',
  components: { PixDialog },
  mixins: [currency360],
  setup () {
    const { getGuest: guest } = useReservationStore()
    const paymentStore = usePaymentStore()
    const { peopleForm, setCurrentStep } = toRefs(paymentStore)
    const setStep = (step) => {
      paymentStore.currentStep = step
      paymentStore.setCurrentStep(step)
    }
    return { peopleForm, guest, setCurrentStep, setStep }
  },
  data () {
    return {
      datesAmount: localStorage.getItem('datesAmount'),
      valid: false,
      nameRules,
      requiredRules,
      cpfRules,
      rgRules,
      passaporteRules,
      birthdateRules,
      phoneRules,
      cepRules,
      noSpecialCharsRules,
      numberRules,
      termsAndConditionsRules,
      cardNumberRules,
      securityCodeRules,
      expirationDateRules,
      country_and_ddi: [],
      states: [],
      cities: [],
      isLoadingCities: false,
      loadingInstallments: false,
      form: {
        user: {
          name: '',
          email: '',
          phone: '',
          documentId: '',
          postalCode: '',
          address: '',
          county: '',
          country: 'Brasil',
          city: '',
          state: '',
          addressNumber: null,
          complement: ''
        },
        card: {
          number: '',
          expirationDate: '',
          securityCode: '',
          installment: null
        },
        termsOfUse: {
          termsAndConditions: false,
          whatsappOffers: false,
          emailOffers: false
        }
      },
      selectedOption: 2,
      pixInstructions,
      paymentOptions,
      getInstallments,
      installmentOptions: [],
      totalPrice: Number(localStorage.getItem('total')),
      nightsPrice: Number(localStorage.getItem('nightsPrice')),
      discountToSubtract: Number(localStorage.getItem('discountToSubtract')),
      secretKey: process.env.NUXT_ENV_SECRET_KEY,
      isLoadingPayment: false
    }
  },
  watch: {
    selectedOption: function (val) {
      if (val === 1) {
        this.form.card = {
          number: '',
          expirationDate: '',
          securityCode: '',
          installment: null
        }
      }
    }
  },
  beforeMount () {
    this.getLoacalDetails()
    this.installmentOptions = this.getInstallments(this.totalPrice)
    this.selectedOption = Number(localStorage.getItem('selectedOption')) || 2
  },
  methods: {
    ...mapActions(useSnackbar, ['showSnackbar']),
    ...mapActions(useSnackbar, ['closeSnackbar']),
    changeOption (option) {
      this.selectedOption = option
      localStorage.setItem('selectedOption', option)
    },
    encryptData (value) {
      return Crypto.AES.encrypt(value, this.secretKey).toString()
    },
    clieckedInstallments () {
      this.loadingInstallments = true
      this.totalPrice = Number(localStorage.getItem('total'))
      this.installmentOptions = this.getInstallments(this.totalPrice)
      this.loadingInstallments = false
    },
    getLoacalDetails () {
      if (!this.form.user.country.length) { this.form.user.country = 'Brasil' }
      Promise.all([ibgeApi.get('/estados'), api360.get('/website-users')])
        .then(([{ data: states }, { data: countries }]) => {
          countries.unshift({ country: 'Selecione', ddi: '', id: null })
          this.states = states
          this.country_and_ddi = countries
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    clearFields () {
      this.form.user.address = ''
      this.form.user.county = ''
      this.form.user.city = ''
      this.form.user.state = ''
      this.form.user.addressNumber = null
      this.form.user.complement = ''
      if (this.form.user.country !== 'Brasil') {
        this.cities = []
        this.states = []
      }
    },
    handleChangeCountry () {
      this.form.user.postalCode = ''
      this.clearFields()
    },
    searchAddress () {
      if (!this.form.user.postalCode) {
        return
      }
      if (!this.form.user.postalCode || this.form.user.postalCode.length < 9) {
        return
      }

      if (this.form.user.country !== 'Brasil') {
        return
      }

      cepApi
        .get(`/${this.form.user.postalCode}/json`)
        .then(({ data }) => {
          if (data.erro) {
            this.showSnackbar({
              text: 'CEP não encontrado',
              timeout: 8000,
              color: 'error'
            })
            return
          }
          this.form.user.state = data.uf
          this.form.user.country = data.country = 'Brasil'
          this.getStates()
          this.getCities()
          this.form.user.address = data.logradouro.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
          this.form.user.county = data.bairro
          this.form.user.city = data.localidade
        })
        .catch(() => {
          this.showSnackbar({
            text: 'Erro ao buscar CEP',
            timeout: 8000,
            color: 'error'
          })
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
    changeState () {
      this.cities = []
      this.form.user.city = ''
      this.getCities()
    },
    getCities () {
      if (!this.form.user.state) {
        this.form.user.city = ''
        this.cities = []
        return
      }
      if (this.form.user.country !== 'Brasil') {
        return
      }
      this.cities = []
      this.form.user.city = ''
      this.isLoadingCities = true
      ibgeApi
        .get(`/estados/${this.form.user.state}/municipios`)
        .then(({ data }) => {
          this.cities = data
        })
        .catch(() => {
          this.showSnackbar({
            text: 'Erro ao buscar cidades',
            timeout: 5000,
            color: 'error'
          })
        })
        .finally(() => {
          this.isLoadingCities = false
        })
    },
    // fillWithGuestData () {
    //   const { firstPersonForm } = this.peopleForm
    //   if (firstPersonForm.typeDocumentId === 'CPF') {
    //     this.form.user = firstPersonForm
    //   } else {
    //     this.form.user = {
    //       ...firstPersonForm,
    //       documentId: ''
    //     }
    //   }

    //   this.searchAddress()
    // },
    advanceStep () {
      this.isLoadingPayment = true
      this.totalPrice = Number(localStorage.getItem('total'))
      const { firstPersonForm, checkInOutForm, otherReservationForm, vehicleForm } = this.peopleForm

      /* TODO Remove only when product confirms that this will not be used anymore
      if (this.selectedOption === 1) {
        if (firstPersonForm.documentId !== this.form.user.documentId && firstPersonForm.typeDocumentId === 'CPF') {
          this.isLoadingPayment = false
          this.$refs.paymentErrorDialog.openPaymentErrorDialog()
          return
        }

        if (formatName(firstPersonForm.name)?.firstName.toLowerCase() !== formatName(this.form.user.name)?.firstName.toLowerCase() || formatName(firstPersonForm.name)?.lastName.toLowerCase() !== formatName(this.form.user.name)?.lastName.toLowerCase()) {
          this.isLoadingPayment = false
          this.$refs.paymentErrorDialog.openPaymentErrorDialog()
          return
        }
      } */
      const room = JSON.parse(localStorage.getItem('room')) || null
      const cleaningFee = Number(room?.cleaningFee || null)
      let voucher = JSON.parse(localStorage.getItem('voucher')) || null
      if (Object.keys(voucher).length === 0) { voucher = null }
      const selectedInterests = vehicleForm?.selectedInterests || []
      delete vehicleForm.selectedInterests
      const [arrivalDate, departureDate] = JSON.parse(localStorage.getItem('dates'))
      const cardData = {
        cardNumber: this.encryptData(this.form.card.number),
        expirationDate: this.form.card.expirationDate,
        securityCode: this.encryptData(this.form.card.securityCode),
        installment: this.form?.card?.installment
      }
      const refundable = JSON.parse(localStorage.getItem('refundable')) || Number(this.datesAmount) > 27 || false
      const refundTax = refundable ? Number(localStorage.getItem('refundTax')) || 0 : null
      const bookingId = this.peopleForm.bookingId || this.$route.query.bookingId
      const payload = {
        bookingId,
        room,
        firstPersonForm: {
          ...firstPersonForm,
          hostingWork: selectedInterests.includes('Trabalhar'),
          hostingPurchases: selectedInterests.includes('Comprar'),
          hostingPrivacy: selectedInterests.includes('Namorar'),
          hostingTourism: selectedInterests.includes('Turistar')
        },
        checkInOutForm: {
          arrivalDate,
          departureDate,
          ...checkInOutForm
        },
        otherReservationForm,
        vehicleForm,
        paymentForm: {
          ...this.form,
          card:
            this.selectedOption === 1
              ? {
                  ...cardData
                }
              : null,
          refundTax: Number(parseFloat(refundTax).toFixed(2)),
          cleaningFee,
          voucher,
          fraudToken: sessionStorage.getItem('clearSaleSession'),
          totalPrice: this.totalPrice,
          calcDiscount: parseFloat(localStorage.getItem('calcDiscount')),
          reservationPrice: this.nightsPrice
        }
      }
      dataLayer.push({
        event: 'add_payment_info',
        ecommerce: {
          currency: 'BRL',
          value: this.totalPrice?.toFixed(2),
          coupon: voucher || '',
          payment_type: this.selectedOption === 1 ? 'Credit' : 'Pix'
        }
      })
      // eslint-disable-next-line no-console
      console.log('add_payment_info', {
        currency: 'BRL',
        value: this.totalPrice?.toFixed(2),
        coupon: voucher || '',
        payment_type: this.selectedOption === 1 ? 'Credit' : 'Pix'
      })

      sendForm(
        [
          {
            name: 'data_da_reserva',
            value: format(new Date(), 'yyyy-MM-dd')
          },
          {
            name: 'check_in',
            value: format(new Date(payload?.checkInOutForm?.arrivalDate), 'yyyy-MM-dd')
          },
          {
            name: 'check_out',
            value: format(new Date(payload?.checkInOutForm?.departureDate), 'yyyy-MM-dd')
          },
          {
            name: 'codigo_da_reserva',
            value: payload.bookingId
          },
          {
            name: 'propriedade',
            value: room?.property?.name
          },
          {
            name: 'categoria',
            value: room?.name
          },
          {
            name: 'noites_vendidas',
            value: differenceInDays(new Date(payload?.checkInOutForm?.departureDate), new Date(payload?.checkInOutForm?.arrivalDate))
          },
          {
            name: 'apartamento',
            value: room?.displayName
          },
          {
            name: 'valor_da_venda',
            value: payload?.paymentForm?.totalPrice
          },
          {
            name: 'name',
            value: payload?.firstPersonForm?.name
          },
          {
            name: 'firstname',
            value: formatName(payload?.firstPersonForm?.name)?.firstName || ''
          },
          {
            name: 'lastname',
            value: formatName(payload?.firstPersonForm?.name)?.lastName || ''
          },
          {
            name: 'email',
            value: payload?.firstPersonForm?.email
          },
          {
            name: 'cpf',
            value: payload?.firstPersonForm?.typeDocumentId === 'CPF' ? payload?.firstPersonForm?.documentId : ''
          },
          {
            name: 'rg',
            value: payload?.firstPersonForm?.typeDocumentId === 'RG' ? payload?.firstPersonForm?.documentId : ''
          },
          {
            name: 'passaporte',
            value: payload?.firstPersonForm?.typeDocumentId === 'Passaporte' ? payload?.firstPersonForm?.documentId : ''
          },
          {
            name: 'data_de_nascimento',
            value: format(new Date(payload?.firstPersonForm?.birthdate), 'yyyy-MM-dd')
          },
          {
            name: 'mobilephone',
            value: `+${payload?.firstPersonForm?.ddi} ${payload?.firstPersonForm?.cellPhone}`
          },
          {
            name: 'zip',
            value: payload?.firstPersonForm?.postalCode || ''
          },
          {
            name: 'address',
            value: payload?.firstPersonForm?.address || ''
          },
          {
            name: 'numero_do_endereco',
            value: payload?.firstPersonForm?.addressNumber || ''
          },
          {
            name: 'complemento_do_endereco',
            value: payload?.firstPersonForm?.complement || ''
          },
          {
            name: 'bairro',
            value: payload?.firstPersonForm?.county || ''
          },
          {
            name: 'city',
            value: payload?.firstPersonForm?.city || ''
          },
          {
            name: 'state',
            value: payload?.firstPersonForm?.state || ''
          },
          {
            name: 'country',
            value: payload?.firstPersonForm?.country || ''
          },
          {
            name: 'quantidade_de_hospedes',
            value: 1 + ((otherReservationForm && otherReservationForm.length) || 0)
          },
          {
            name: 'nome_segundo_hospede',
            value: ''
          },
          {
            name: 'sobrenome_segundo_hospede',
            value: ''
          },
          {
            name: 'documento_segundo_hospede',
            value: ''
          },
          {
            name: 'data_de_nascimento_segundo',
            value: ''
          },
          {
            name: 'celular_segundo_hospede',
            value: ''
          },
          {
            name: 'e_mail_segundo_hospede',
            value: ''
          },
          {
            name: 'nome_terceiro_hospede',
            value: ''
          },
          {
            name: 'sobrenome_terceiro_hospede',
            value: ''
          },
          {
            name: 'documento_terceiro_hospede',
            value: ''
          },
          {
            name: 'data_de_nascimento_terceiro_hospede',
            value: ''
          },
          {
            name: 'celular_terceiro_hospede',
            value: ''
          },
          {
            name: 'e_mail_terceiro_hospede',
            value: ''
          },
          {
            name: 'nome_quarto_hospede',
            value: ''
          },
          {
            name: 'sobrenome_quarto_hospede',
            value: ''
          },
          {
            name: 'documento_quarto_hospede',
            value: ''
          },
          {
            name: 'data_de_nascimento_quarto_hospede',
            value: ''
          },
          {
            name: 'celular_quarto_hospede',
            value: ''
          },
          {
            name: 'e_mail_quarto_hospede',
            value: ''
          },
          {
            name: 'nome_quinto_hospede',
            value: ''
          },
          {
            name: 'sobrenome_quinto_hospede',
            value: ''
          },
          {
            name: 'documento_quinto_hospede',
            value: ''
          },
          {
            name: 'data_de_nascimento_quinto_hospede',
            value: ''
          },
          {
            name: 'celular_quinto_hospede',
            value: ''
          },
          {
            name: 'e_mail_quinto_hospede',
            value: ''
          },
          {
            name: 'horario_de_entrada',
            value: payload?.checkInOutForm?.checkInTime
          },
          {
            name: 'horario_de_saida',
            value: payload?.checkInOutForm?.checkOutTime
          },
          {
            name: 'interesse',
            value: (selectedInterests && selectedInterests.length) ? selectedInterests[0] : ''
          },
          {
            name: 'reserva_reembolsavel',
            value: payload?.paymentForm?.refundTax ? 'Sim' : 'Não'
          },
          {
            name: 'forma_de_pagamento',
            value: this.selectedOption === 1 ? 'Credit' : 'Pix'
          },
          {
            name: 'cupom_de_desconto',
            value: payload?.paymentForm?.voucher || ''
          },
          {
            name: 'voce_teria_interesse_em_uma_newsletter_da_360_',
            value: payload?.paymentForm?.termsOfUse?.emailOffers ? 'Sim' : 'Não'
          },
          {
            name: 'consentimento_whatsapp',
            value: payload?.paymentForm?.termsOfUse?.whatsappOffers
          }, {
            name: 'marca_e_modelo_do_veiculo',
            value: payload?.vehicleForm?.carModel || ''
          },
          {
            name: 'cor_do_veiculo',
            value: payload?.vehicleForm?.color || ''
          },
          {
            name: 'placa_do_veiculo',
            value: payload?.vehicleForm?.licensePlate || ''
          }
        ],
        {
          pageUri: hubspotForm.reservation.pageUri,
          pageName: hubspotForm.reservation.pageName
        },
        hubspotForm.reservation.id
      )

      // eslint-disable-next-line no-unreachable
      if (this.selectedOption === 1) {
        const bookingId = this.peopleForm.bookingId || this.$route.query.bookingId
        api360
          .post('/bookings/credit-payment-auth', payload)
          .then(({ data }) => {
            dataLayer.push({
              event: 'purchase',
              ecommerce: {
                transaction_id: bookingId,
                name: payload?.firstPersonForm?.name,
                email: payload?.firstPersonForm?.email,
                phone: payload?.firstPersonForm?.cellPhone
              }
            })
            // eslint-disable-next-line no-console
            console.log('purchase', {
              event: 'purchase',
              ecommerce: {
                transaction_id: bookingId,
                name: payload?.firstPersonForm?.name,
                email: payload?.firstPersonForm?.email,
                phone: payload?.firstPersonForm?.cellPhone
              }
            })
            voucherApplyBus.$emit('voucher-apply', { showVoucherButtons: false })
            if (!voucher) {
              voucherBus.$emit('show-voucher', { showVoucher: false })
            }
            localStorage.setItem('selectedOption', null)
            this.setStep(5)
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.error(err)
            this.showSnackbar({
              text: 'Pagamento negado, por favor revise os dados de seu cartão e tente novamente.',
              timeout: -1,
              color: 'error'
            })
          })
          .finally(() => {
            this.isLoadingPayment = false
          })
      } else {
        api360
          .post('/bookings/generate-update-pix', payload)
          .then(({ data }) => {
            if (!voucher) {
              voucherBus.$emit('show-voucher', { showVoucher: false })
            }
            dataLayer.push({
              event: 'purchase',
              ecommerce: {
                transaction_id: bookingId,
                name: payload.firstPersonForm?.name,
                email: payload.firstPersonForm?.email,
                phone: payload.firstPersonForm?.cellPhone
              }
            })
            // eslint-disable-next-line no-console
            console.log('purchase', {
              event: 'purchase',
              ecommerce: {
                transaction_id: bookingId,
                name: payload.firstPersonForm?.name,
                email: payload.firstPersonForm?.email,
                phone: payload.firstPersonForm?.cellPhone
              }
            })
            this.$refs.pixDialog.openPixDialog(data)
          })
          .catch((err) => {
          // eslint-disable-next-line no-console
            console.error(err)
            this.showSnackbar({
              text: 'Falha ao gerar código PIX, tente novamente mais tarde.',
              timeout: -1,
              color: 'error'
            })
          })
          .finally(() => {
            this.isLoadingPayment = false
          })
      }
    },
    confirmPixPayment () {
      this.$refs.pixDialog.closePixDialog()

      voucherApplyBus.$emit('voucher-apply', { showVoucherButtons: false })
      countdownBus.$emit('countdown', { showCountdown: false })
      this.setStep(5)
    }
    /* payWithPix () {
      this.$refs.paymentErrorDialog.closePaymentErrorDialog()
      this.changeOption(2)
    } */
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/mixins.scss';

.payment-sheet {
  border-radius: 10px;
  padding: 20px;
  text-align: center;
}

.selected-sheet {
  background-color: var(--v-primary-base);
}

.unselected-sheet {
  background-color: #fff;
  border: 1px solid #888888;
}

.v-list-item__content {
  font-size: 14px !important;
}
</style>
