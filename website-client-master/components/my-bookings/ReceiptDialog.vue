<template>
  <div>
    <div v-if="receiptDialog" class="blur" />
    <v-dialog
      v-model="receiptDialog"
      max-width="1200"
      min-width="800"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      hide-overlay
      persistent
      class="card-radius"
    >
      <v-card class="card-radius py-4 px-4">
        <v-icon color="primary" class="close-btn" @click="closeDialog">
          fa-solid fa-close
        </v-icon>
        <v-container>
          <v-row>
            <v-col cols="12" class="text-left">
              <h1>Comprovante</h1>
              <p><strong>Código da reserva:</strong> {{ booking?.id }}</p>
              <p><strong>Cliente:</strong> {{ `${booking?.firstName} ${booking?.lastName}` }}</p>
              <p><strong>Endereço de cobrança</strong></p>
              <p>
                {{ `${booking?.precheckin?.address?.fullAddress}, ${booking?.precheckin?.address?.city} - ${booking?.precheckin?.address?.state} - ${booking?.precheckin?.address?.country} - ${booking?.precheckin?.address?.zip}` }}
              </p>
              <v-divider class="mb-4" />
              <p><strong>{{ booking?.nights }} noites:</strong> {{ booking?.formattedPrice }}</p>
              <p><strong>Cupom de Desconto:</strong> {{ booking?.voucher || 'Não utlizado' }}</p>
              <p><strong>Taxa de Limpeza:</strong> {{ booking?.formattedCleaningTax }}</p>
              <v-divider class="mb-4" />
              <p><strong>Total Pago:</strong> {{ booking?.formattedPrice }}</p>
              <p><strong>Data do Pagamento: </strong> {{ booking?.formattedArrival }}</p>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  name: 'ReceiptDialog',
  data () {
    return {
      receiptDialog: false,
      booking: {}
    }
  },
  methods: {
    openDialog (booking) {
      this.booking = booking
      this.receiptDialog = true
    },
    closeDialog () {
      this.receiptDialog = false
    }
  }
}
</script>

<style scoped lang="scss">

.close-btn {
  position: absolute;
  top: 24px;
  right: 24px;
}

.card-radius {
  border-radius: 24px !important;
}

</style>
