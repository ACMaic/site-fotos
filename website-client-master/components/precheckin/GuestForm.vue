<template>
  <div>
    <v-expansion-panel-content>
      <v-expansion-panels v-model="personPanel" class="v-expansion-panels">
        <v-expansion-panel>
          <v-expansion-panel-header class="v-expansion-panel-header--child">
            <p class="mb-0">
              <span class="text-medium-xxs">
                <v-icon size="16" color="black" class="mr-4">fas fa-user</v-icon> Primeira Pessoa
              </span>
            </p>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <step-first-person ref="firstPerson" :my-reservations="myReservations" :disable-fields="myReservations" :is-pre-checkin="isPreCheckin" />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-checkbox v-if="showCompanionCheck" v-model="hasCompanion" label="Não tenho acompanhante" class="ml-2" />
      <div v-if="!hasCompanion">
        <v-expansion-panels
          v-for="(guestData, index) in otherGuests"
          :key="index + 1"
          class="v-expansion-panels"
        >
          <v-expansion-panel>
            <v-expansion-panel-header class="v-expansion-panel-header--child">
              <p class="mb-0">
                <span class="text-medium-xxs">
                  <v-icon size="16" color="black" class="mr-4">fas fa-user</v-icon>
                  {{ getExpansionTitle(index + 2) }}
                </span>
              </p>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <step-others :id="index + 2" ref="othersGuestsForm" :is-pre-checkin="true" :guest-data="guestData" :disable-fields="myReservations" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <v-expansion-panels>
        <step-check-in-out ref="checkInOutForm" :disable-fields="myReservations" />
      </v-expansion-panels>
      <v-expansion-panels>
        <step-vehicle ref="vehicleForm" :has-parking="hasParking" :disable-fields="myReservations" />
      </v-expansion-panels>

      <v-expansion-panels v-if="isPreCheckin">
        <step-terms ref="termsForm" />
      </v-expansion-panels>
    </v-expansion-panel-content>
    <v-row v-if="isPreCheckin" no-gutters class="justify-end">
      <v-btn
        :class="{ primary: form.valid, background: checkButton, disabled: checkButton }"
        :disabled="checkButton"
        depressed
        :width="$vuetify.breakpoint.lgAndUp ? '200px' : '100%'"
        height="50px"
        class="radius-login-360 text-unset my-4"
        type="submit"
        :loading="isLoading"
        @click="validatePeopleForm"
      >
        Concluir Pré Check-in
      </v-btn>
    </v-row>
  </div>
</template>
<script>
import { format, differenceInDays } from 'date-fns'
import { mapActions } from 'pinia'
import { toRefs } from '@nuxtjs/composition-api'
import { Auth } from 'aws-amplify'
import { formatName } from '../../shared/utils'
import { openApi as api360, sendForm, hubspotForm, ibgeApi } from '@/api'
import { nameRules } from '@/rules'
import StepFirstPerson from '@/components/payment/steps/StepFirstPerson.vue'
import StepOthers from '@/components/payment/steps/StepOthers.vue'
import StepCheckInOut from '@/components/payment/steps/StepCheckInOut.vue'
import StepVehicle from '@/components/payment/steps/StepVehicle.vue'
import StepTerms from '@/components/payment/steps/StepTerms.vue'
import { usePaymentStore, useSnackbar } from '~/store'
import { useReservationStore } from '@/store'

export default {
  name: 'GuestForm',
  components: {
    StepFirstPerson,
    StepOthers,
    StepCheckInOut,
    StepVehicle,
    StepTerms
  },
  props: {
    myReservations: {
      type: Boolean,
      default: false
    },
    isPreCheckin: {
      type: Boolean,
      default: true
    },
    booking: {
      type: Object,
      default: () => ({})
    }
  },
  setup () {
    const { getGuest: guest } = useReservationStore()
    const paymentStore = usePaymentStore()
    const { peopleForm, setCurrentStep } = toRefs(paymentStore)
    return { peopleForm, guest, setCurrentStep }
  },
  data () {
    return {
      form: {
        valid: false
      },
      formOthersValid: false,
      nameRules,
      isLoading: false,
      peopleNumber: JSON.parse(localStorage.getItem('guest')),
      firstPersonEmail: '',
      hasParking: JSON.parse(localStorage.getItem('hasParking')) || false,
      hasCompanion: false,
      selectedInterests: [],
      showCompanionCheck: false,
      otherGuests: [],
      personPanel: 0,
      hubspotBooking: null
    }
  },
  computed: {
    checkButton () {
      // Check if the form is not valid or if it's loading
      if (!this.form.valid || this.isLoading) {
        return true
      }
      // Check if there are more than or equal to 2 guests and if the otherReservationForm is undefined or not every item is valid
      if (!this.hasCompanion) {
        if (this.guest >= 2 && (!this.peopleForm?.otherReservationForm || !this.peopleForm.otherReservationForm.every(item => item.valid))) {
          return true
        }
      }
      // Check if the firstPersonForm is null
      if (this.peopleForm.firstPersonForm === null) {
        return true
      }

      // Check if terms of use are filled
      if (!this.$refs.termsForm.form.termsAndConditions) {
        return true
      }

      // Check if there are no selected interests
      if (!this.selectedInterests?.length) {
        return true
      }
      // If none of the above conditions are met, the form is not invalid
      return false
    }
  },
  watch: {
    peopleForm: {
      handler: function (newValue) {
        this.form.valid = false
        const { firstPersonForm, otherReservationForm, checkInOutForm, vehicleForm } = this.peopleForm
        this.selectedInterests = vehicleForm?.selectedInterests

        if (firstPersonForm && checkInOutForm) {
          this.form.valid = true
          if (this.guest > 1) {
            if (otherReservationForm) {
              this.form.valid = true
            } else {
              this.form.valid = false
            }
          }
        }

        if (otherReservationForm?.length > 0) {
          this.formOthersValid = otherReservationForm.every(item => item.valid)
        } else {
          this.formOthersValid = true
        }

        if (vehicleForm) {
          this.form.valid = true
        }
      },
      deep: true
    }
  },
  beforeMount () {
    if (this.isPreCheckin) {
      this.firstGuestEmail()
      this.room = JSON.parse(localStorage.getItem('room'))

      const bookId = this.$route?.query?.bookId || this.$route?.query?.bookingId
      api360.get(`/check-in-api/${bookId}`).then(({ data }) => {
        this.hubspotBooking = { ...data }
        this.showCompanionCheck = localStorage.getItem('guest') > 1
        const timings = data.custom5
        const [arrival, departure] = timings.split('|')
        const formattedArrival = arrival?.substring(arrival.indexOf(':') + 1, arrival.length).trim()
        const formattedDeparture = departure?.substring(departure.indexOf(':') + 1, departure.length).trim()
        this.$refs.checkInOutForm.form.checkInTime = formattedArrival
        this.$refs.checkInOutForm.form.checkOutTime = formattedDeparture
        this.$refs.vehicleForm.form.selectedInterests = this.getSelectedInterests(data.firstPerson)
        this.peopleNumber = localStorage.getItem('guest')
        this.otherGuests = data.otherGuests?.length > 0 ? data.otherGuests : this.getGuests(this.peopleNumber)
        this.$refs.termsForm.form.termsAndConditions = data.custom9.length > 0
      }).catch((error) => {
      // eslint-disable-next-line no-console
        console.error(error)
      }).finally(() => {
        this.isLoading = false
      })
    }
  },
  methods: {
    ...mapActions(useSnackbar, ['showSnackbar']),
    ...mapActions(useSnackbar, ['closeSnackbar']),
    getGuests (number) {
      const guests = []
      for (let i = 0; i < this.peopleNumber - 1; i++) {
        guests.push({})
      }
      return guests
    },
    fillGuestForm (bookingObj) {
      if (this.myReservations) {
        const bookingData = this.booking || bookingObj
        const custom9 = JSON.parse(bookingData.custom9)
        this.hasCompanion = custom9?.guests?.length <= 1
        this.$refs.checkInOutForm.form.checkInTime = bookingData.formatedArrivalTime
        this.$refs.checkInOutForm.form.checkOutTime = bookingData.formatedDepartureTime
        this.$refs.vehicleForm.form.selectedInterests = this.getSelectedInterests(custom9)
        this.$refs.firstPerson.form = {
          typeDocumentId: custom9.docType,
          address: custom9.address.fullAddress.split(',')[0].trim(),
          birthdate: custom9.birthday,
          cellPhone: custom9.phone,
          city: custom9.city,
          complement: custom9.complement,
          country: custom9.address.country,
          county: custom9.address.county,
          ddi: custom9.ddi,
          documentId: custom9.doc,
          email: custom9.email,
          name: custom9.name,
          postalCode: custom9.address.zip,
          state: custom9.state
        }
        this.$refs.firstPerson.searchAddress()
        this.$refs.firstPerson.form.addressNumber = custom9.address.fullAddress.split(',')[1].trim()
        this.otherGuests = custom9?.guests?.length > 0 ? custom9.guests : [{}]
      }
    },
    getCities (zip) {
      if (!this.form.state) {
        this.form.city = ''
        this.cities = []
        return
      }
      this.isLoadingCities = true
      ibgeApi.get(`/estados/${this.form.state}/municipios`).then(({ data }) => {
        this.$refs.firstPerson.cities = data
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
    getStates (zip) {
      ibgeApi.get('/estados').then(({ data }) => {
        this.$refs.firstPerson.states = data
      }).catch(() => {
        this.showSnackbar({
          text: 'Erro ao buscar estados',
          timeout: 5000,
          color: 'error'
        })
      })
    },
    getSelectedInterests (firstPerson) {
      const hostingPrivacy = firstPerson?.hostingPrivacy
      const hostingPurchases = firstPerson?.hostingPurchases
      const hostingTourism = firstPerson?.hostingTourism
      const hostingWork = firstPerson?.hostingWork

      const selected = []
      if (hostingPrivacy) {
        selected.push('Namorar')
      }
      if (hostingPurchases) {
        selected.push('Comprar')
      }
      if (hostingTourism) {
        selected.push('Turistar')
      }
      if (hostingWork) {
        selected.push('Trabalhar')
      }
      return selected
    },
    getExpansionTitle (number) {
      const expansionObj = {
        1: 'Primeira Pessoa',
        2: 'Segunda Pessoa',
        3: 'Terceira Pessoa',
        4: 'Quarta Pessoa',
        5: 'Quinta Pessoa'
      }
      return expansionObj[number]
    },
    firstGuestEmail () {
      Auth.currentAuthenticatedUser()
        .then((user) => {
          if (user) {
            this.firstPersonEmail = user.attributes.email
          }
        })
    },
    validatePeopleForm () {
      this.isLoading = true
      const documentType = this.peopleForm.firstPersonForm.typeDocumentId
      const documentValue = this.peopleForm.firstPersonForm.documentId
      const firstPerson = {
        ...this.peopleForm.firstPersonForm,
        email: this.firstPersonEmail,
        ...(documentType === 'CPF' ? { cpf: documentValue } : {}),
        ...(documentType === 'RG' ? { rg: documentValue } : {}),
        ...(documentType === 'Passaporte' ? { passport: documentValue } : {})
      }
      let otherGuests = []
      let form = [{ ...firstPerson }]
      if (this.guest > 1 && !this.hasCompanion) {
        otherGuests = this.peopleForm.otherReservationForm.map((guest) => {
          const documentType = guest.typeDocumentId
          const documentValue = guest.documentId
          return {
            ...guest,
            ...(documentType === 'CPF' ? { cpf: documentValue } : {}),
            ...(documentType === 'RG' ? { rg: documentValue } : {}),
            ...(documentType === 'Passaporte' ? { passport: documentValue } : {})
          }
        })
        form = [{ ...firstPerson }, ...otherGuests]
      }
      // check if any field is equal before send to blocklist
      const isAnyFieldEqual = form.some((item, index) => item.documentId === form[index + 1]?.documentId)
      if (isAnyFieldEqual) {
        this.showSnackbar({
          text: 'Falha na tentativa de reserva. O número do documento dos hóspedes deve ser diferente.',
          timeout: -1,
          color: 'error'
        })
        this.isLoading = false
        return
      }
      this.closeSnackbar()

      const requests = form.map(item =>
        api360.post('/blocklist-api/validation', {
          email: item.email,
          cpf: item.cpf,
          phone: item.cellPhone,
          rg: item.rg,
          passport: item.passport,
          bookingId: this.$route.query?.bookingId || this.$route.query?.bookId
        })
      )
      Promise.all(requests).then((data) => {
        const hasBlockedUser = data.some(res => res.data)
        if (hasBlockedUser) {
          this.showSnackbar({
            text: 'Falha na tentativa de check-in. Tente novamente mais tarde.',
            timeout: -1,
            color: 'error'
          })
          this.$router.replace('/')
        } else {
          const bookId = this.$route?.query?.bookId || this.$route?.query?.bookingId
          this.sendHubspotForm(this.hubspotBooking, {
            firstPersonForm: {
              ...this.peopleForm.firstPersonForm,
              ddi: `${this.peopleForm.firstPersonForm.ddi}`,
              hostingWork: this.peopleForm.vehicleForm.selectedInterests.includes('Trabalhar'),
              hostingPurchases: this.peopleForm.vehicleForm.selectedInterests.includes('Comprar'),
              hostingPrivacy: this.peopleForm.vehicleForm.selectedInterests.includes('Namorar'),
              hostingTourism: this.peopleForm.vehicleForm.selectedInterests.includes('Turistar')
            },
            ...this.peopleForm
          })
          api360.post(`/check-in-api/form/${bookId}`, {
            firstPersonForm: {
              ...this.peopleForm.firstPersonForm,
              ddi: `${this.peopleForm.firstPersonForm.ddi}`,
              hostingWork: this.peopleForm.vehicleForm.selectedInterests.includes('Trabalhar'),
              hostingPurchases: this.peopleForm.vehicleForm.selectedInterests.includes('Comprar'),
              hostingPrivacy: this.peopleForm.vehicleForm.selectedInterests.includes('Namorar'),
              hostingTourism: this.peopleForm.vehicleForm.selectedInterests.includes('Turistar')
            },
            ...this.peopleForm
          }).then(() => {
            this.showSnackbar({
              text: 'Check-in realizado com sucesso!',
              timeout: -1,
              color: 'success'
            })
            this.$router.replace('/minha-conta/reservas')
          }).catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error)
            this.showSnackbar({
              text: 'Algo deu errado, tente novamente mais tarde.',
              timeout: -1,
              color: 'error'
            })
          }).finally(() => {
            this.isLoading = false
          })
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      }).finally(() => {
        this.isLoading = false
      })
    },
    sendHubspotForm (booking, data) {
      sendForm(
        [
          {
            name: 'data_da_reserva',
            value: format(new Date(booking?.bookingTime), 'yyyy-MM-dd')
          },
          {
            name: 'check_in',
            value: format(new Date(booking?.arrival), 'yyyy-MM-dd')
          },
          {
            name: 'check_out',
            value: format(new Date(booking?.departure), 'yyyy-MM-dd')
          },
          {
            name: 'codigo_da_reserva',
            value: booking?.id
          },
          {
            name: 'propriedade',
            value: booking?.room?.property?.name
          },
          {
            name: 'categoria',
            value: booking.room?.name
          },
          {
            name: 'noites_vendidas',
            value: differenceInDays(new Date(booking?.departure), new Date(booking?.arrival))
          },
          {
            name: 'apartamento',
            value: booking.room?.displayName
          },
          {
            name: 'canal_de_origem',
            value: booking?.channel
          },
          {
            name: 'valor_da_venda',
            value: booking?.price
          },
          {
            name: 'firstname',
            value: formatName(data?.firstPersonForm?.name)?.firstName || ''
          },
          {
            name: 'lastname',
            value: formatName(data?.firstPersonForm?.name)?.lastName || ''
          },
          {
            name: 'email',
            value: data?.firstPersonForm?.email || ''
          },
          {
            name: 'documento',
            value: data?.firstPersonForm?.documentId || ''
          },
          {
            name: 'cpf',
            value: data?.firstPersonForm?.typeDocumentId === 'CPF' ? data?.firstPersonForm?.documentId : ''
          },
          {
            name: 'rg',
            value: data?.firstPersonForm?.typeDocumentId === 'RG' ? data?.firstPersonForm?.documentId : ''
          },
          {
            name: 'passaporte',
            value: data?.firstPersonForm?.typeDocumentId === 'Passaporte' ? data?.firstPersonForm?.documentId : ''
          },
          {
            name: 'data_de_nascimento',
            value: format(new Date(data?.firstPersonForm?.birthdate), 'yyyy-MM-dd')
          },
          {
            name: 'mobilephone',
            value: data?.firstPersonForm?.cellPhone || ''
          },
          {
            name: 'zip',
            value: data?.firstPersonForm?.postalCode || ''
          },
          {
            name: 'address',
            value: data?.firstPersonForm?.address || ''
          },
          {
            name: 'numero_do_endereco',
            value: data?.firstPersonForm?.addressNumber || ''
          },
          {
            name: 'complemento_do_endereco',
            value: data?.firstPersonForm?.complement || ''
          },
          {
            name: 'bairro',
            value: data?.firstPersonForm?.county || ''
          },
          {
            name: 'city',
            value: data?.firstPersonForm?.city || ''
          },
          {
            name: 'state',
            value: data?.firstPersonForm?.state || ''
          },
          {
            name: 'country',
            value: data?.firstPersonForm?.country || ''
          },
          {
            name: 'quantidade_de_hospedes',
            value: booking?.numAdult
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
            value: data?.checkInOutForm?.checkInTime || ''
          },
          {
            name: 'horario_de_saida',
            value: data?.checkInOutForm?.checkOutTime || ''
          },
          {
            name: 'interesse',
            value: (data?.vehicleForm?.selectedInterests && data?.vehicleForm?.selectedInterests.length) ? data?.vehicleForm?.selectedInterests[0] : ''
          },
          {
            name: 'reserva_reembolsavel',
            value: booking?.infoItems.find(item => item.code === 'REFUNDABLE' && item.text === 'S') ? 'Sim' : 'Não'
          },
          {
            name: 'forma_de_pagamento',
            value: booking?.invoiceItems.find(item => item.type === 'payment')?.description || ''
          },
          {
            name: 'cupom_de_desconto',
            value: booking?.voucher || ''
          },
          {
            name: 'voce_teria_interesse_em_uma_newsletter_da_360_',
            value: data?.termsForm?.emailOffers ? 'Sim' : 'Não'
          },
          {
            name: 'consentimento_e_mail',
            value: data?.termsForm?.termsAndConditions
          },
          {
            name: 'consentimento_whatsapp',
            value: data?.termsForm?.whatsappOffers
          },
          {
            name: 'marca_e_modelo_do_veiculo',
            value: data?.vehicleForm?.carModel || ''
          },
          {
            name: 'cor_do_veiculo',
            value: data?.vehicleForm?.color || ''
          },
          {
            name: 'placa_do_veiculo',
            value: data?.vehicleForm?.licensePlate || ''
          }
        ],
        {
          pageUri: hubspotForm.digitalCheckin.pageUri,
          pageName: hubspotForm.digitalCheckin.pageName
        },
        hubspotForm.digitalCheckin.id
      )
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/mixins.scss';
.v-list-item__content {
  font-size: 14px !important;
}

</style>
