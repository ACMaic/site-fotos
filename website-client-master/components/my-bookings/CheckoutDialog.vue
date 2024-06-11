<template>
  <div>
    <div v-if="checkoutDialog" class="blur" />
    <v-dialog
      v-model="checkoutDialog"
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
            <v-col cols="12" class="text-center">
              <h1>Checkout</h1>
              <p v-if="booking?.hasParking" class="primary--text">
                *Caso tenha recebido cartão para acesso ao estacionamento, o mesmo deve ser devolvido quando estiver deixando o edifício, sob pena de multa.
              </p>
              <p>
                Ao realizar o Checkout entendemos que você está deixando o apartamento. <br>
                Confirma que está saindo?
              </p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="text-center">
              <v-btn
                elevation="0"
                class="primary--text mx-2"
                color="grey lighten-4"
                width="200"
                @click="closeDialog"
              >
                Não
              </v-btn>

              <v-btn
                class="black--text mx-2"
                elevation="0"
                color="secondary"
                @click="checkout"
              >
                Sim, fazer Checkout
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import { openApi as api360, sendForm, hubspotForm } from '@/api'

export default {
  name: 'CheckoutDialog',
  data () {
    return {
      checkoutDialog: false,
      booking: null,
      isLoading: false
    }
  },
  methods: {
    openDialog (booking) {
      this.booking = booking
      this.checkoutDialog = true
    },
    closeDialog () {
      this.checkoutDialog = false
    },
    checkout () {
      this.isLoading = true

      api360.post(`/bookings/checkout/${this.booking.id}`).then((res) => {
        sendForm([
          {
            name: 'email',
            value: this.booking.email
          },
          {
            name: 'codigo_da_reserva',
            value: this.booking.id || 0
          },
          {
            name: 'realizacao_check_out',
            value: 'Sim'
          }
        ], {
          pageUri: hubspotForm.checkout.pageUri,
          pageName: hubspotForm.checkout.pageName
        }, hubspotForm.checkout.id)
        this.$router.push(`/avaliacao/${this.booking.id}`)
      }).finally(() => {
        this.isLoading = false
      })
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
