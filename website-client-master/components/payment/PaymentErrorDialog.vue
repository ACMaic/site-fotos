<template>
  <div>
    <div v-if="paymentErrorDialog" class="blur" />
    <v-dialog v-model="paymentErrorDialog" max-width="1000" hide-overlay persistent style="z-index: 200">
      <v-card class="py-8 px-8 rounded-xl">
        <v-row>
          <v-col cols="12" class="modal-wrapper">
            <p
              :class="$vuetify.breakpoint.lgAndUp ? 'mb-5 mt-8 text-medium-xl' : 'mb-6 mt-8 text-regular-xs'"
            >
              Ops, não foi possível seguir com seu pagamento.
            </p>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="12" align="center">
            <v-btn
              class="radius-login-360 text-unset text-bold-xs secondary"
              color="secondary"
              height="50px"
              elevation="0"
              @click="$emit('pix')"
            >
              <span class="search-button">Pagar via PIX</span>
            </v-btn>
            <v-btn
              class="radius-login-360 text-unset text-bold-xs ml-4"
              color="black"
              height="50px"
              elevation="0"
              @click="openWhatsAppLink"
            >
              <span class="search-button white--text">Falar com time comercial</span>
            </v-btn>
          </v-col>
        </v-row>
        <v-row
          class="align-sm-center align-self-sm-center align-sm-content-center"
          justify="end"
        >
          <v-btn
            class="radius-login-360 text-unset text-bold-xs"
            color="white"
            height="50px"
            elevation="0"
            :outlined="true"
            @click="closePaymentErrorDialog"
          >
            <span class="search-button primary--text">Cancelar</span>
          </v-btn>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: 'PaymentErrorDialog',
  emits: ['pix'],
  data () {
    return {
      paymentErrorDialog: false
    }
  },
  methods: {
    openPaymentErrorDialog () {
      this.paymentErrorDialog = true
    },
    closePaymentErrorDialog () {
      this.paymentErrorDialog = false
    },
    openWhatsAppLink () {
      this.paymentErrorDialog = false
      window.open('https://wa.me/5511961718008', '_blank')
    }
  }
}
</script>
<style lang="scss" scoped>
.modal-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
