<template>
  <div>
    <h4 class="text-medium-xs primary--text">
      Olá, {{ userName }}
    </h4>
    <v-row no-gutters class="justify-center">
      <v-col cols="12" align="center">
        <span class="desc-regular-xxs">Código da reserva </span>
      </v-col>
    </v-row>
    <v-row no-gutters class="justify-center">
      <v-col cols="12" align="center">
        <span class="text-medium-xs">{{ bookingId || paymentStore.peopleForm.bookingId }}</span>
      </v-col>
    </v-row>
    <v-row no-gutters class="justify-center">
      <v-col cols="12" align="center">
        <span class="desc-regular-xxs">Status</span>
      </v-col>
    </v-row>
    <v-row no-gutters class="justify-center">
      <v-col cols="12" align="center">
        <span class="text-medium-xs success--text">Pagamento Confirmado</span>
      </v-col>
    </v-row>
    <v-row no-gutters class="mt-3">
      <v-col cols="12" align="center">
        <span class="desc-regular-xxs">Após a validação do pagamento, a confirmação de reserva e as instruções de check-in serão enviadas para o e-mail <b>{{ userEmail }}</b></span>
      </v-col>
    </v-row>
    <v-row no-gutters class="mt-4">
      <v-col cols="12" align="center">
        <span class="desc-regular-xxs"><span class="pointer primary--text underline" @click="$router.push('/minha-conta/reservas')">Clique aqui</span> para conferir mais detalhes sobre a sua reserva</span>
      </v-col>
    </v-row>
    <v-row no-gutters class="mt-4" style="display: none;">
      <v-col cols="12" align="center">
        <span class="pointer primary--text underline desc-regular-xxs" @click="$refs.reservationPrint.openPrintDialog()">Imprimir reserva</span>
      </v-col>
    </v-row>
    <v-divider class="mt-6" />
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header @click="checkRefundable">
          <span class="text-regular-xxs">
            Política de Cancelamento
          </span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="mx-8 mb-8">
            <span class="mb-6 text-regular-xxs">Você optou por <span class="text-medium-xxs primary--text">{{ refundable ? 'a) Reserva Reembolsável' : 'b) Reserva Não Reembolsável' }}</span></span>
          </div>
          <div class="mx-8 text-regular-xxs">
            <cancellation-policy-text />
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <reservation-print ref="reservationPrint" />
  </div>
</template>
<script>
import { Auth } from 'aws-amplify'
import { usePaymentStore } from '@/store'
import CancellationPolicyText from '@/components/CancellationPolicyText.vue'
import ReservationPrint from '@/components/payment/print/ReservationPrint.vue'

export default {
  name: 'ReservationReceipt',
  components: {
    CancellationPolicyText,
    ReservationPrint
  },
  scrollToTop: true,
  setup () {
    const paymentStore = usePaymentStore()
    const setStep = (step) => {
      paymentStore.currentStep = step
      paymentStore.setCurrentStep(step)
    }
    const { peopleForm } = usePaymentStore()
    return { setStep, paymentStore, peopleForm }
  },
  data () {
    return {
      userName: '',
      userEmail: '',
      bookingId: '',
      refundable: Boolean(localStorage.getItem('refundable'))
    }
  },
  mounted () {
    this.updateBookingId()
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
  updated () {
    this.updateBookingId()
  },
  methods: {
    updateBookingId () {
      const bookingId = this.peopleForm.bookingId || this.$route.query.bookingId
      if (bookingId) {
        this.bookingId = bookingId
      }
    },
    checkRefundable () {
      this.refundable = localStorage.getItem('refundable') === 'true'
    }
  }
}
</script>

<style lang="scss" scoped>

.v-divider {
  border-width: 1px !important;
}

</style>
