<template>
  <div>
    <v-expansion-panel-content>
      <v-expansion-panels v-model="firstPersonPanel" class="v-expansion-panels">
        <v-expansion-panel>
          <v-expansion-panel-header class="v-expansion-panel-header--child">
            <p class="mb-0">
              <span class="text-medium-xxs">
                <v-icon size="16" color="black" class="mr-4">fas fa-user</v-icon> Primeira Pessoa
              </span>
            </p>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <step-first-person />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <div v-if="!hasCompanion">
        <v-expansion-panels
          v-for="(person, index) in peopleNumber - 1"
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
              <step-others :id="index + 2" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <v-expansion-panels>
        <step-check-in-out ref="checkInOutForm" />
      </v-expansion-panels>
      <v-expansion-panels>
        <step-vehicle ref="vehicleForm" :has-parking="hasParking" />
      </v-expansion-panels>
      <v-row no-gutters class="justify-end">
        <v-btn
          v-scroll-to="$vuetify.breakpoint.mdAndDown ? '#booking-payment' : ''"
          :class="{ primary: form.valid, background: checkButton, disabled: checkButton }"
          :disabled="checkButton"
          depressed
          :width="$vuetify.breakpoint.lgAndUp ? '118px' : '100%'"
          height="50px"
          class="radius-login-360 text-unset my-4"
          type="submit"
          :loading="isLoading"
          @click="validatePeopleForm"
        >
          Avançar
        </v-btn>
      </v-row>
    </v-expansion-panel-content>
  </div>
</template>
<script>
import { mapActions } from 'pinia'
import { toRefs } from '@nuxtjs/composition-api'
import { Auth } from 'aws-amplify'
import { openApi as api360 } from '@/api'
import { nameRules } from '@/rules'
import StepFirstPerson from '@/components/payment/steps/StepFirstPerson.vue'
import StepOthers from '@/components/payment/steps/StepOthers.vue'
import StepCheckInOut from '@/components/payment/steps/StepCheckInOut.vue'
import StepVehicle from '@/components/payment/steps/StepVehicle.vue'
import { usePaymentStore, useSnackbar } from '~/store'
import { useReservationStore } from '@/store'
import { PAYMENT_STATUS_PURCHASE, PAYMENT_STATUS_BLOCKLIST } from '~/shared/constants'

export default {
  name: 'StepPeopleContentComponent',
  components: {
    StepFirstPerson,
    StepOthers,
    StepCheckInOut,
    StepVehicle
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
      firstPersonPanel: 0
    }
  },
  computed: {
    checkButton () {
      // Check if the form is not valid or if it's loading
      if (!this.form.valid || this.isLoading) {
        return true
      }

      // Check if there are more than or equal to 2 guests and if the otherReservationForm is undefined or not every item is valid
      if (this.guest >= 2 && (!this.peopleForm?.otherReservationForm || !this.peopleForm.otherReservationForm.every(item => item.valid))) {
        return true
      }
      // Check if the firstPersonForm is null
      if (!this.peopleForm.firstPersonForm) {
        return true
      }
      // Check if there are no selected interests
      if (!this.selectedInterests?.length) {
        return true
      }

      // Check if the checkInTime or checkOutTime is null
      if (!this.$refs.checkInOutForm.form.checkInTime || !this.$refs.checkInOutForm.form.checkOutTime) {
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
    this.firstGuestEmail()
    this.room = JSON.parse(localStorage.getItem('room'))
  },
  methods: {
    ...mapActions(useSnackbar, ['showSnackbar']),
    ...mapActions(useSnackbar, ['closeSnackbar']),
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
      if (this.guest > 1) {
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
            text: 'Falha na tentativa de reserva. Tente novamente mais tarde.',
            timeout: -1,
            color: 'error'
          })
          this.setCurrentStep(PAYMENT_STATUS_BLOCKLIST)
          this.$router.replace('/')
        } else {
          const datesAmount = localStorage.getItem('datesAmount')
          this.setCurrentStep(datesAmount <= 27 ? PAYMENT_STATUS_PURCHASE : 4)
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      }).finally(() => {
        this.isLoading = false
      })
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
