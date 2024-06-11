<template>
  <div>
    <booking-payment-desktop v-if="$vuetify.breakpoint.mdAndUp" />
    <booking-payment-mobile v-else />
  </div>
</template>

<script>
import BookingPaymentDesktop from '@/components/payment/BookingPaymentDesktop.vue'
import BookingPaymentMobile from '@/components/payment/BookingPaymentMobile.vue'
import { usePaymentStore } from '@/store'

export default {
  name: 'PaymentPage',
  components: {
    BookingPaymentDesktop,
    BookingPaymentMobile
  },
  beforeRouteLeave (to, from, next) {
    if (this.paymentStore.countdownTime === null) {
      next()
      localStorage.setItem('guest', 1)
      localStorage.setItem('hasParking', null)
      localStorage.setItem('dates', [])
      return
    }
    if (to.name === 'index' || to.name === 'reserva') {
      if (window.confirm('Deseja realmente sair? Os dados inseridos até o momento serão perdidos.')) {
        next()
        localStorage.setItem('guest', 1)
        localStorage.setItem('hasParking', null)
        localStorage.setItem('dates', [])
      }
    } else {
      next(true)
    }
  },
  layout: 'reservation',
  setup () {
    const paymentStore = usePaymentStore()

    return { paymentStore }
  }
}
</script>
