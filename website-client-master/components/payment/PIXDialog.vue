<template>
  <div>
    <div v-if="pixDialog" class="blur" />
    <v-dialog v-model="pixDialog" max-width="840" hide-overlay persistent style="z-index: 200">
      <v-card class="pa-6 rounded-xl">
        <v-row>
          <v-col cols="10">
            <p
              :class="$vuetify.breakpoint.lgAndUp ? 'mb-5 mt-8 text-medium-xxs' : 'mb-6 mt-8 text-regular-xs'"
            >
              Escaneie o código para efetuar o pagamento
            </p>
          </v-col>
        </v-row>
        <v-row no-gutters class="my-3">
          <v-col cols="2" md="1">
            <v-chip color="secondary">
              <span class="black--text">1</span>
            </v-chip>
          </v-col>
          <v-col cols="10" md="11" class="pt-1 ml-n4">
            <span class="desc-regular-xxs">Abra o app do seu banco ou instituição financeira e entre no ambiente Pix.</span>
          </v-col>
        </v-row>
        <v-row no-gutters class="my-3 ">
          <v-col cols="2" md="1">
            <v-chip color="secondary">
              <span class="black--text">2</span>
            </v-chip>
          </v-col>
          <v-col cols="10" md="11" class="pt-1 ml-n4">
            <span class="desc-regular-xxs">Escolha a opção Pagar com QR Code e escaneie o código abaixo:</span>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" align="center">
            <v-img :src="imageBase64" width="260" height="200" />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <span class="desc-regular-xxs">Ou copie o código Pix abaixo e cole no seu aplicativo de pagamentos:</span>
          </v-col>
          <v-col cols="12" :align="$vuetify.breakpoint.smAndDown ? 'center' : 'left'">
            <v-text-field
              ref="pixCodeInput"
              v-model="pixCode"
              outlined
              readonly
              dense
              class="mt-3"
            />
            <v-btn
              class="radius-login-360 text-unset text-bold-xs secondary mt-n2"
              color="secondary"
              height="48px"
              elevation="0"
              @click="copyPixCode"
            >
              <span class="desc-regular-xxs black--text">Copiar Código</span>
            </v-btn>
          </v-col>
        </v-row>
        <!-- TODO: Toggle for non prod
        <v-row no-gutters class="my-4">
          <span class="primary--text text-regular-xs">DEV ONLY: CONFIRM PIX PAYMENT <a :href="onlineDebitUrl" target="_blank">HERE</a></span>
        </v-row>-->
        <v-row :no-gutters="!$vuetify.breakpoint.smAndDown">
          <v-col cols="12" :align="$vuetify.breakpoint.smAndDown ? 'center' : 'right'">
            <v-btn
              class="radius-login-360 text-unset text-bold-xs secondary"
              color="secondary"
              height="50px"
              elevation="0"
              :loading="confirmingPayment"
              :disabled="confirmingPayment"
              @click="confirmPayment"
            >
              <span class="desc-regular-xxs black--text">Confirmar Pagamento</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapActions } from 'pinia'
import { openApi as api360 } from '@/api'
import { useSnackbar, usePaymentStore } from '@/store'
export default {
  name: 'PixDialog',
  emits: ['advance'],
  setup () {
    const { peopleForm } = usePaymentStore()
    return {
      peopleForm
    }
  },
  data () {
    return {
      pixDialog: false,
      pixCode: '',
      imageBase64: '',
      orderId: '',
      onlineDebitUrl: '',
      environment: process.env.NUXT_ENV_NODE,
      confirmingPayment: false
    }
  },
  methods: {
    ...mapActions(useSnackbar, ['showSnackbar']),
    ...mapActions(useSnackbar, ['closeSnackbar']),
    openPixDialog (data) {
      this.pixDialog = true
      this.pixCode = data.pixCode
      this.orderId = data.orderId
      this.onlineDebitUrl = data.onlineDebitUrl
      this.imageBase64 = `data:image/png;base64,${data.imageBase64}`
    },
    closePixDialog () {
      this.pixDialog = false
    },
    copyPixCode () {
      navigator.clipboard.writeText(this.pixCode).then(() => {
        this.showSnackbar({
          text: 'Código PIX copiado com sucesso!',
          timeout: 1000,
          color: 'success'
        })
      })
    },
    confirmPayment () {
      const bookingId = this.peopleForm.bookingId || this.$route.query.bookingId
      this.confirmingPayment = true
      api360.post('/bookings/verify-confirmed-pix', {
        bookingId,
        orderId: this.orderId
      })
        .then(({ data }) => {
          if (data) {
            this.$emit('advance')
            this.$nextTick(() => {
              this.$scrollTo('#reservation-receipt')
            })
          } else {
            this.showSnackbar({
              text: 'Pagamento não identificado. Tente novamente.',
              timeout: 8000,
              color: 'error'
            })
          }
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error(err)
          this.showSnackbar({
            text: 'Pagamento não realizado. Tente novamente.',
            timeout: 8000,
            color: 'error'
          })
        }).finally(() => {
          this.confirmingPayment = false
        })
    }
  }
}
</script>
