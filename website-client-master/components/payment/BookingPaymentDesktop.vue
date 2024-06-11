<template>
  <div>
    <div id="booking-payment" class="pt-6">
      <title-component v-if="$vuetify.breakpoint.lgAndUp" title-normal="Pagamento da reserva" />

      <div v-if="$vuetify.breakpoint.lgAndUp && currentStep < 5">
        <booking-countdown />
      </div>

      <v-stepper-icon v-model="currentStep">
        <v-stepper-header v-if="$vuetify.breakpoint.lgAndUp && (currentStep && currentStep < 5)">
          <v-stepper-step-icon :complete="currentStep > 1" step="1" icon="fas fa-sign-in-alt" :color="currentStep >= 1 ? 'primary' : ''" />
          <v-divider />
          <v-stepper-step-icon
            :complete="currentStep > 2"
            step="2"
            icon="fas fa-user-friends"
            :color="currentStep >= 2 ? 'primary' : ''"
            :class="currentStep >= 2 ? 'pointer' : ''"
            @click="currentStep >= 2 ? handleStepClick(2) : null"
          />
          <v-divider />
          <v-stepper-step-icon
            v-if="datesAmount <= 27"
            :complete="currentStep > 3"
            step="3"
            icon="fas fa-shield"
            :color="currentStep >= 3 ? 'primary' : ''"
            :class="currentStep >= 3 ? 'pointer' : ''"
            @click="currentStep >= 3 ? handleStepClick(3) : null"
          />
          <v-divider v-if="datesAmount <= 27" />
          <v-stepper-step-icon
            :complete="currentStep > 4"
            step="4"
            icon="fas fa-dollar-sign"
            :color="currentStep >= 4 ? 'primary' : ''"
            :class="currentStep >= 4 ? 'pointer' : ''"
            @click="currentStep >= 4 ? handleStepClick(4) : null"
          />
          <v-divider />
          <v-stepper-step-icon
            :complete="currentStep > 5"
            step="5"
            icon="fas fa-check"
            :color="currentStep >= 5 ? 'primary' : ''"
            :class="currentStep >= 5 ? 'pointer' : ''"
            @click="currentStep >= 5 ? handleStepClick(5) : null"
          />
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1" style="margin: 0; padding: 0;">
            <v-card class="login-wrapper rounded-md-xl rounded-md-bs-0">
              <h4 class="text-medium-md primary--text">
                Como prefere comprar?
              </h4>
              <v-btn
                color="primary"
                class="radius-login-360 text-regular-xxs login-wrapper--btn mb-4"
                :class="$vuetify.breakpoint.lgAndUp ? 'mt-10' : 'mt-8'"
                height="50px"
                style="text-transform: inherit !important;"
                elevation="0"
                @click="login"
              >
                Faça login e acelere sua compra
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
            </v-card>
          </v-stepper-content>
          <v-stepper-content step="2" class="px-0">
            <v-card class="step-card-wrapper rounded-xl rounded-bs-0 ml-md-5">
              <v-row
                class="mb-11 pt-5"
                :class="$vuetify.breakpoint.lgAndUp ? 'justify-space-between' : 'justify-content-center'"
                :style="$vuetify.breakpoint.lgAndUp && 'width: 100%'"
                no-gutters
              >
                <v-col cols="12" md="7">
                  <h3
                    class="primary--text text-medium-xs"
                  >
                    Apartamento e pessoas
                  </h3>
                </v-col>
                <v-col cols="12" md="4" class="pt-md-2">
                  <p class="d-flex align-center mb-0">
                    <v-icon size="12" color="black" class="mr-2">
                      fas fa-bed
                    </v-icon>
                    <span class="text-regular-xxxs mr-6">
                      1 Apartamento
                    </span>
                    <v-icon size="12" color="black" class="mr-2">
                      fas fa-user
                    </v-icon>
                    <span class="text-regular-xxxs">
                      {{ guest }} {{ guest > 1 ? 'Pessoas' : 'Pessoa' }}
                    </span>
                  </p>
                </v-col>
              </v-row>
              <v-expansion-panels v-model="guestPanel" class="v-expansion-panels">
                <v-expansion-panel class="main-expansion">
                  <v-expansion-panel-header class="v-expansion-panel-header--parent">
                    <p class="mb-0">
                      <span class="desc-regular-xxs white--text">
                        <v-icon size="16" color="white" class="mr-4">fas fa-bed</v-icon>
                        Apartamento 360 {{ room?.displayName || room?.name }}
                      </span>
                    </p>
                  </v-expansion-panel-header>
                  <step-people-content />
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card>
          </v-stepper-content>
          <v-stepper-content v-if="datesAmount <= 27" step="3" class="px-0">
            <v-card class="common-card-wrapper rounded-xl rounded-bs-0">
              <step-refund />
            </v-card>
          </v-stepper-content>
          <v-stepper-content step="4" class="px-0">
            <v-card class="common-card-wrapper rounded-xl rounded-bs-0">
              <step-payment />
            </v-card>
          </v-stepper-content>
          <v-stepper-content step="5" class="px-0">
            <v-card class="common-card-wrapper rounded-xl rounded-bs-0">
              <reservation-receipt />
            </v-card>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper-icon>
    </div>
  </div>
</template>

<script>
import { ref, toRefs } from 'vue'
import { Auth } from 'aws-amplify'
import TitleComponent from '@/components/shared/Title.vue'
import VStepperIcon from '@/components/shared/VStepperIcon.vue'
import VStepperStepIcon from '@/components/shared/VStepperStepIcon.vue'
import BookingCountdown from '@/components/payment/BookingCountdown.vue'
import StepPeopleContent from '@/components/payment/StepPeopleContent.vue'
import StepRefund from '@/components/payment/StepRefund.vue'
import StepPayment from '@/components/payment/steps/StepPayment.vue'
import { PAYMENT_STATUS_STARTED, PAYMENT_STATUS_FORM, PAYMENT_STATUS_PURCHASE } from '~/shared/constants'
import { useReservationStore, usePaymentStore } from '@/store'
import voucherBus from '@/events/voucherBus'
import ReservationReceipt from '@/components/payment/steps/ReservationReceipt.vue'

export default {
  name: 'BookingPayment',
  components: {
    TitleComponent,
    VStepperIcon,
    VStepperStepIcon,
    BookingCountdown,
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
      .then((data) => {
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
      datesAmount: localStorage.getItem('datesAmount'),
      room: {
        name: ''
      },
      guestPanel: 0
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
      },
      deep: true
    }
  },
  beforeMount () {
    this.room = JSON.parse(localStorage.getItem('room'))
    this.setStep(this.paymentStore.currentStep)
    Auth.currentAuthenticatedUser()
      .then((data) => {
        this.userName = data.attributes.given_name
        this.userEmail = data.attributes.email
      })
      .catch((err) => {
        this.setStep(1)
        // eslint-disable-next-line no-console
        console.error(err)
      })
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
    },
    handleStepClick (step) {
      this.setStep(step)
      voucherBus.$emit('show-voucher', { showVoucher: step >= 4 })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/mixins.scss';

.v-card > *:last-child:not(.v-btn):not(.v-chip):not(.v-avatar) {
  border-radius: 5px;
}

.common-card-wrapper {
  padding: 25px 32px;
  box-shadow: none !important;
}

.step-card-wrapper {
  padding: 25px 32px;
}

.login-wrapper, .step-card-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: none !important;
}

.login-wrapper {
  padding: 40px 56px;
  border-radius: 15px;
}

.login-wrapper--btn {
  width: 100%;
  max-width: 400px;
}

.v-expansion-panels {
  border-radius: 5px;
}

.v-list-item__content {
  font-size: 14px !important;
}
</style>
