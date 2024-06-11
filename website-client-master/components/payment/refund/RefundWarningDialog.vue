<template>
  <div>
    <div v-if="refundDialog" class="blur" />
    <v-dialog v-model="refundDialog" max-width="1000" hide-overlay persistent style="z-index: 200">
      <v-card class="py-8 px-8 rounded-xl">
        <v-row>
          <v-col cols="12" class="modal-wrapper">
            <p
              :class="$vuetify.breakpoint.lgAndUp ? 'mb-5 mt-8 text-medium-xl' : 'mb-6 mt-8 text-regular-xs'"
            >
              Atenção!
            </p>
            <p
              class="mb-10 text-center"
              :class="$vuetify.breakpoint.lgAndUp ? 'text-regular-rating' : 'text-regular-xxs'"
            >
              Em caso de cancelamento, você <b>não terá direito a reembolso</b> parcial ou integral dessa reserva.<br>
              Realmente deseja seguir assim?
            </p>
            <v-btn
              class="radius-login-360 text-unset text-bold-xs secondary"
              color="secondary"
              height="50px"
              elevation="0"
              @click="advanceWithoutRefund"
            >
              <span class="search-button">Sim, desejo seguir sem reembolso</span>
            </v-btn>
            <v-btn
              class="radius-login-360 text-unset text-bold-xs mt-4"
              color="white"
              height="50px"
              elevation="0"
              :outlined="true"
              @click="closeRefundDialog"
            >
              <span class="search-button">Não, desejo revisar</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: 'RefundWarningDialog',
  emits: ['advance'],
  data () {
    return {
      refundDialog: false
    }
  },
  methods: {
    openRefundialog () {
      this.refundDialog = true
    },
    closeRefundDialog () {
      this.refundDialog = false
    },
    advanceWithoutRefund () {
      this.$emit('advance')
      this.refundDialog = false
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
