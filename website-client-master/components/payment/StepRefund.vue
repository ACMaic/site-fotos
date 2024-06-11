<template>
  <div>
    <v-row v-if="$vuetify.breakpoint.lgAndUp" no-gutters>
      <v-col cols="12">
        <span class="primary--text text-medium-xs">Planos de reserva</span>
      </v-col>
    </v-row>
    <v-radio-group
      v-model="refund"
      @change="handleOptionSelected"
    >
      <div class="radio-wrapper" :class="refund ? 'radio-selected' : ''">
        <v-radio :value="true">
          <template #label>
            <v-row no-gutters>
              <v-col cols="8" md="6">
                <v-icon v-if="$vuetify.breakpoint.lgAndUp" :color="refund ? 'primary' : 'gray'" size="16" class="mt-n1">
                  fa-solid fa-shield-quartered
                </v-icon>
                <span class="desc-regular-xs ml-2" :class="refund ? 'black--text' : 'gray--text'">Reserva reembolsável</span>
              </v-col>
              <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="4" class="ma-0 pa-0">
                <v-chip :color="refund ? 'primary' : 'gray'" x-small>
                  RECOMENDADO
                </v-chip>
              </v-col>
              <v-col cols="4" md="2">
                <span class="desc-regular-xs" :class="refund ? 'black--text' : 'gray--text'">{{ refundTax }}</span>
              </v-col>
            </v-row>
          </template>
        </v-radio>
      </div>
      <span class="desc-regular-xxs mt-4 mb-8">Caso precise cancelar sua reserva, você terá direito ao reembolso total do valor pago, desde que respeitadas as condições de nossa <nuxt-link to="/politicas-cancelamento" tag="a" class="info--text"> Política de Cancelamento.</nuxt-link></span>
      <div class="radio-wrapper" :class="!refund ? 'radio-selected' : ''">
        <v-radio :value="false">
          <template #label>
            <v-row no-gutters>
              <v-col cols="8" md="10">
                <span class="desc-regular-xs" :class="!refund ? 'black--text' : 'gray--text'">Reserva não reembolsável</span>
              </v-col>
              <v-col cols="4" md="2">
                <span class="desc-regular-xs" :class="!refund ? 'black--text' : 'gray--text'">R$ 00,00</span>
              </v-col>
            </v-row>
          </template>
        </v-radio>
      </div>
    </v-radio-group>
    <v-row no-gutters class="justify-end">
      <v-btn
        v-scroll-to="$vuetify.breakpoint.mdAndDown ? '#booking-details' : ''"
        color="secondary"
        depressed
        :width="$vuetify.breakpoint.lgAndUp ? '118px' : '100%'"
        height="50px"
        class="radius-login-360 text-unset my-4 black--text"
        type="submit"
        @click="advanceStep"
      >
        Avançar
      </v-btn>
    </v-row>
    <refund-warning-dialog ref="refundDialog" @advance="confirmNext" />
  </div>
</template>
<script>
import RefundWarningDialog from './refund/RefundWarningDialog.vue'
import { usePaymentStore } from '@/store'
import refundBus from '@/events/refundBus'
import voucherBus from '@/events/voucherBus'

export default {
  name: 'StepRefund',
  components: {
    RefundWarningDialog
  },
  setup () {
    const paymentStore = usePaymentStore()
    const setStep = (step) => {
      paymentStore.currentStep = step
      paymentStore.setCurrentStep(step)
    }
    return { setStep, paymentStore }
  },
  data () {
    return {
      refund: false,
      refundTax: localStorage.getItem('refundTax') || 0
    }
  },
  mounted () {
    refundBus.$emit('refundable', { refund: this.refund })
    const money = this.formatCurrency()
    this.refundTax = money.format(localStorage.getItem('refundTax'))
  },
  beforeMount () {
    const money = this.formatCurrency()
    this.refundTax = money.format(localStorage.getItem('refundTax'))
    if (localStorage.getItem('refundable') === 'true') {
      this.refund = true
    }
  },
  methods: {
    formatCurrency () {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    },
    advanceStep () {
      if (!this.refund) {
        this.$refs.refundDialog.openRefundialog()
        return
      }
      this.confirmNext()
    },
    confirmNext () {
      dataLayer.push({
        event: 'add_shipping_info',
        ecommerce: {
          currency: 'BRL',
          coupon: 'REFUND'
        }
      })
      // eslint-disable-next-line no-console
      console.log('add_shipping_info', {
        event: 'add_shipping_info',
        ecommerce: {
          currency: 'BRL',
          coupon: 'REFUND'
        }
      })
      this.setStep(4)
      this.paymentStore.setPeopleForm({
        ...this.paymentStore.peopleForm,
        refundable: this.refund
      })
      voucherBus.$emit('show-voucher', { showVoucher: true })
    },
    handleOptionSelected () {
      this.paymentStore.peopleForm.refundable = this.refund
      refundBus.$emit('refundable', { refund: this.refund })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/mixins.scss';
.radio-wrapper {
  padding: 15px 10px;
  border: 1px solid #B6B6B6;
  border-radius: 5px;
}

.radio-selected {
  border: 1px solid var(--v-primary-base);
}

</style>
