<template>
  <div>
    <div id="booking-payment" class="pt-6 container-360">
      <v-card class="content-wrapper">
        <div v-if="currentStep === 1 && currentStep < 5">
          <h4 class="text-medium-md primary--text">
            Como prefere comprar?
          </h4>
          <v-btn
            color="primary"
            class="radius-login-360 text-regular-xxs login-wrapper--btn mb-4 mt-8"
            height="50px"
            style="text-transform: inherit !important;"
            @click="login"
          >
            Fazer login
          </v-btn>
          <v-btn
            color="primary"
            class="radius-login-360 text-regular-xxs login-wrapper--btn"
            outlined
            height="50px"
            style="text-transform: inherit !important;"
            @click="register"
          >
            Fazer meu cadastro
          </v-btn>
        </div>
        <div v-if="currentStep >= 2 && currentStep < 5" style="width: 100% !important;">
          <v-row
            class="mb-11 pt-5 justify-content-center"
            no-gutters
          >
            <v-col cols="12" align="center">
              <h3 class="primary--text text-medium-xs">
                Apartamento e pessoas
              </h3>
            </v-col>
            <v-col cols="12" md="4" class="pt-md-2" align="center">
              <span class="mt-3">
                <span class="text-regular-xxxs mr-3">
                  <v-icon size="12" color="black" class="mr-2">fas fa-bed</v-icon>
                  1 Apartamento
                </span>
                <span class="text-regular-xxxs">
                  <v-icon size="12" color="black" class="mr-2"> fas fa-user</v-icon>
                  {{ guest }} {{ guest > 1 ? 'Pessoas' : 'Pessoa' }}
                </span>
              </span>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" class="mb-4">
              <v-expansion-panels v-model="guestDataPanel" class="v-expansion-panels">
                <v-expansion-panel class="main-expansion">
                  <v-expansion-panel-header class="v-expansion-panel-header--parent">
                    <p class="mb-0">
                      <span class="desc-regular-xxs white--text">
                        <v-icon size="16" color="white" class="mr-4">fas fa-bed</v-icon>
                        360 {{ room?.displayName || room?.name }}
                      </span>
                    </p>
                  </v-expansion-panel-header>
                  <step-people-content />
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </div>
        <div v-if="currentStep >= 3 && datesAmount <= 27 && currentStep < 5" style="width: 100% !important;">
          <v-row no-gutters class="justify-content-center">
            <v-col cols="12" align="center" class="mt-6 mb-4" style="width: 360px !important;">
              <h3 class="primary--text text-medium-xs">
                Planos de reserva
              </h3>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" class="mb-4">
              <v-expansion-panels v-model="refundPanel" class="v-expansion-panels">
                <v-expansion-panel class="main-expansion">
                  <v-expansion-panel-header class="v-expansion-panel-header--parent">
                    <p class="mb-0">
                      <span class="desc-regular-xxs white--text">
                        <v-icon size="16" color="white" class="mr-4">fa-solid fa-shield-quartered</v-icon>
                        Reserva reembolsável
                      </span>
                    </p>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <step-refund />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </div>
        <div v-if="currentStep >= 4 && currentStep < 5" style="width: 100% !important;">
          <v-row no-gutters class="justify-content-center">
            <v-col cols="12" align="center" class="mt-6 mb-4" style="width: 360px !important;">
              <h3 class="primary--text text-medium-xs">
                Dados de Pagamento
              </h3>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" class="mb-4">
              <v-expansion-panels v-model="paymentPanel" class="v-expansion-panels">
                <v-expansion-panel class="main-expansion">
                  <v-expansion-panel-header class="v-expansion-panel-header--parent">
                    <p class="mb-0">
                      <span class="desc-regular-xxs white--text">
                        <v-icon size="16" color="white" class="mr-4">fa-solid fa-dollar</v-icon>
                        Pagamento
                      </span>
                    </p>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="mt-4">
                    <step-payment />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </div>
        <div v-if="currentStep >= 5" id="reservation-receipt" style="width: 100% !important;">
          <v-row no-gutters class="justify-content-center">
            <v-col cols="12" align="center" class="mt-6 mb-4" style="width: 360px !important;">
              <h3 class="primary--text text-medium-xs">
                <reservation-receipt />
              </h3>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import { ref, toRefs } from 'vue'
import { Auth } from 'aws-amplify'
import StepPeopleContent from '@/components/payment/StepPeopleContent.vue'
import StepRefund from '@/components/payment/StepRefund.vue'
import StepPayment from '@/components/payment/steps/StepPayment.vue'
import ReservationReceipt from '@/components/payment/steps/ReservationReceipt.vue'
import { PAYMENT_STATUS_STARTED, PAYMENT_STATUS_FORM, PAYMENT_STATUS_PURCHASE } from '~/shared/constants'
import { useReservationStore, usePaymentStore } from '@/store'

export default {
  name: 'BookingPayment',
  components: {
    StepPeopleContent,
    StepRefund,
    StepPayment,
    ReservationReceipt
  },
  setup () {
    const currentStep = ref(1)
    const isAuthenticated = ref(false)
    const paymentStore = usePaymentStore()
    const { peopleForm } = usePaymentStore()
    const { getCurrentStep: stepStored } = toRefs(paymentStore)
    const { getGuest: guest } = useReservationStore()

    const setStep = (step) => {
      currentStep.value = step
      paymentStore.setCurrentStep(step)
    }

    Auth.currentAuthenticatedUser()
      .then(() => {
        isAuthenticated.value = true
        switch (stepStored.value) {
          case 0:
          case PAYMENT_STATUS_STARTED:
            setStep(2)
            break
          case PAYMENT_STATUS_FORM:
            setStep(2)
            break
          case PAYMENT_STATUS_PURCHASE:
            setStep(3)
            break
        }
      })
      .catch((err) => {
        isAuthenticated.value = false
        setStep(1)
        // eslint-disable-next-line no-console
        console.error(err)
      })

    return {
      paymentStore,
      currentStep,
      isAuthenticated,
      guest,
      stepStored,
      setStep,
      peopleForm
    }
  },
  data () {
    return {
      room: {
        name: ''
      },
      datesAmount: localStorage.getItem('datesAmount'),
      guestDataPanel: null,
      refundPanel: null,
      paymentPanel: null
    }
  },
  watch: {
    isAuthenticated: {
      handler: function (isAuthenticated) {
        if (isAuthenticated) {
          this.setStep(this.stepStored)
        } else {
          this.setStep(1)
        }
      },
      deep: true
    },
    stepStored: {
      handler: function (newStepValue) {
        this.setStep(newStepValue)
        if (newStepValue === 2) {
          this.guestDataPanel = 0
        } else if (newStepValue === 3) {
          this.refundPanel = 0
          this.guestDataPanel = null
          this.paymentPanel = null
        } else if (newStepValue === 4) {
          this.paymentPanel = 0
          this.refundPanel = null
          this.guestDataPanel = null
        }
      },
      deep: true
    }
  },
  beforeMount () {
    this.room = JSON.parse(localStorage.getItem('room'))
    this.setStep(this.paymentStore.currentStep)
    if (this.stepStored === 2) {
      this.guestDataPanel = 0
    } else if (this.stepStored === 3) {
      this.refundPanel = 0
      this.guestDataPanel = null
      this.paymentPanel = null
    } else if (this.stepStored === 4) {
      this.paymentPanel = 0
      this.refundPanel = null
      this.guestDataPanel = null
    }
  },
  methods: {
    login () {
      const bookId = this.$route?.query?.bookId || this.$route?.query?.bookingId
      localStorage.setItem('redirect', `/pagamento?bookingId=${bookId}`)
      this.$router.push('/entrar')
    },
    register () {
      const bookId = this.$route?.query?.bookId || this.$route?.query?.bookingId
      localStorage.setItem('redirect', `/pagamento?bookingId=${bookId}`)
      this.$router.push('/registrar')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/mixins.scss';

.content-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: none !important;
  padding: 40px 16px;
}

.login-wrapper--btn {
  width: 100%;
  max-width: 400px;
}

</style>
