<template>
  <v-container id="booking-details">
    <title-component v-if="$vuetify.breakpoint.mdAndDown" title-normal="Pagamento da reserva" :ltr="true" />
    <div v-if="$vuetify.breakpoint.mdAndDown && showCountdown">
      <booking-countdown v-if="currentStep < 5" />
    </div>

    <v-row :class="$vuetify.breakpoint.lgAndUp ? 'mb-12 pt-10' : 'mt-6'" no-gutters>
      <v-col cols="12" lg="5" md="4">
        <img
          v-if="$vuetify.breakpoint.mdAndUp"
          :src="room?.images?.length > 1 ? room.images[0].url : 'https://assets.360suites.com.br/website/no_image.png'"
          alt="360 Suítes Logo"
          class="img-rounded"
          contain
          width="175px"
          height="220px"
        >
      </v-col>
      <v-col cols="12" lg="7" md="8" class="pl-md-4 pt-md-3">
        <h4 class="primary--text" :class="$vuetify.breakpoint.lgAndUp ? 'text-regular-sm' : 'text-regular-xs'">
          {{ room?.displayName || '' }}
        </h4>
        <p class="mb-0 mt-md-2" :class="$vuetify.breakpoint.lgAndUp ? 'text-regular-xxxs' : 'desc-regular-xxs'">
          {{ room?.property.name }}
        </p>
        <p :class="$vuetify.breakpoint.lgAndUp ? 'text-regular-xxxs mb-5' : 'desc-regular-xxs'">
          {{ `${room?.property.address} - São Paulo` }}
        </p>
        <v-btn class="rounded-pill radius-360-outline--white desc-regular-xxs text-capitalize mt-md-12" @click="$refs.featuresDialog.openFeaturesDialog(false)">
          Comodidades
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="px-md-1">
      <v-col cols="2">
        <span :class="$vuetify.breakpoint.mdAndUp ? 'text-medium-xxs' : 'desc-medium-xxs'">Entrada</span>
        <p :class="$vuetify.breakpoint.mdAndUp ? 'text-medium-xxs' : 'desc-medium-xxs'">
          Saída
        </p>
      </v-col>
      <v-col cols="10" class="text-right">
        <p class="mb-n1">
          <span :class="$vuetify.breakpoint.mdAndUp ? 'text-medium-xxs' : 'desc-medium-xxs'">{{ startDate }}</span>
          <span :class="$vuetify.breakpoint.mdAndUp ? 'text-regular-xxs' : 'desc-regular-xxs'">a partir das</span>
          <span class="success--text" :class="$vuetify.breakpoint.mdAndUp ? 'text-medium-xxs' : 'desc-medium-xxs'">15:00hrs</span>
        </p>
        <p>
          <span :class="$vuetify.breakpoint.mdAndUp ? 'text-medium-xxs' : 'desc-medium-xxs'">{{ endDate }}</span>
          <span :class="$vuetify.breakpoint.mdAndUp ? 'text-regular-xxs' : 'desc-regular-xxs'">até</span>
          <span class="primary--text" :class="$vuetify.breakpoint.mdAndUp ? 'text-medium-xxs' : 'desc-medium-xxs'">11:00hrs</span>
        </p>
      </v-col>
    </v-row>
    <v-sheet height="1" width="100%" color="#B6B6B6" :class="$vuetify.breakpoint.lgAndUp ? 'my-2' : 'my-4'" />
    <v-row class="px-md-1" no-gutters>
      <v-col md="6">
        <span :class="$vuetify.breakpoint.mdAndUp ? 'text-medium-xxs' : 'desc-medium-xxs'">Pessoas</span>
      </v-col>
      <v-col md="6" class="text-right">
        <span class="text-regular-xxs">{{ guest }}</span>
      </v-col>
    </v-row>
    <v-sheet height="1" width="100%" color="#B6B6B6" :class="$vuetify.breakpoint.lgAndUp ? 'my-7 mt-2' : 'my-4'" />
    <v-row class="px-md-1 mt-md-n6">
      <v-col cols="1">
        <span :class="$vuetify.breakpoint.mdAndUp ? 'text-medium-xxs' : 'desc-medium-xxs'">Apartamento</span>
        <p :class="$vuetify.breakpoint.mdAndUp ? 'text-medium-xxs' : 'desc-medium-xxs'">
          Noites
        </p>
      </v-col>
      <v-col cols="11" class="text-right ">
        <span :class="$vuetify.breakpoint.mdAndUp ? 'text-regular-xxs' : 'desc-regular-xxs'"><span :class="$vuetify.breakpoint.mdAndUp ? 'text-regular-xxs' : 'desc-regular-xxs'" class="primary--text">{{ room?.displayName }}</span></span>
        <p class="mb-0">
          <span class="text-regular-xxs">{{ getTotalValue() }} </span>
          <a class="primary--text underline" :class="$vuetify.breakpoint.mdAndUp ? 'text-regula-xxs' : 'desc-regula-xxs'" @click="showNightsCard = true">({{ getNights() }})</a>
        </p>
      </v-col>
    </v-row>
    <v-row :class="$vuetify.breakpoint.lgAndUp ? 'my-8 mt-n5' : 'mb-12' " no-gutters>
      <v-card v-if="showNightsCard" class="rounded-lg" width="100%" elevation="0">
        <v-list>
          <v-list-item>
            <v-row class="ma-0">
              <v-col cols="11" class="text-md-center text-sm-left">
                <span :class="$vuetify.breakpoint.mdAndUp ? 'text-medium-xxs' : 'desc-medium-xxs'">
                  Detalhes de Preço por Noite
                </span>
              </v-col>
              <v-col cols="1">
                <span
                  class="pointer text-medium-xxs primary--text "
                  @click="showNightsCard = false"
                >
                  x
                </span>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
        <v-divider class="mt-n2 mx-4" />
        <v-list>
          <v-row v-for="value in pricePerNight" :key="value.date" class="mx-4 pa-0" no-gutters>
            <v-col cols="8">
              <span class="primary--text">
                {{ value.day }}
              </span>{{ value.weekDay }}
            </v-col>
            <v-col cols="4" class="text-right">
              <span>{{ value.price }}</span>
            </v-col>
          </v-row>
        </v-list>
      </v-card>
    </v-row>
    <v-row v-if="showVoucher" :class="$vuetify.breakpoint.lgAndUp ? 'my-8 mt-n4' : 'mt-n8'" no-gutters>
      <v-col cols="12" class="pb-0">
        <v-text-field
          v-model="code"
          :error="error"
          dense
          outlined
          class="radius-login-360"
          placeholder="Insira um cupom de desconto"
          type="text"
          height="45px"
          :disabled="voucherFound?.discount > 0"
          @keyup="uppercase"
          @blur="voucherChange"
          @change="voucherChange"
        />
        <small class="primary--text text-regular-xxxs" :class="clickable ? 'underline pointer' : ''" style="position: absolute; margin-top: -22px;" @click="clickable ? showErrorCard = true : showErrorCard = false">{{ errorMessages }}</small>
        <v-card v-if="showErrorCard" class="rounded-lg pt-5 mb-10" width="100%" elevation="0">
          <v-row>
            <v-col cols="10">
              <span class="text-medium-xxs primary--text ml-4">
                Regras do Cupom
              </span>
            </v-col>
            <v-col cols="2">
              <span
                class="pointer text-medium-xxs black--text "
                @click="showErrorCard = false"
              >
                x
              </span>
            </v-col>
            <v-col cols="11" class="ml-4">
              <span class="desc-medium-xxs primary--text">
                {{ errorDescription }}
              </span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="12">
        <v-btn
          v-if="Object.keys(voucherFound).length === 0 && showVoucherButtons"
          :class="{ primary: code, background: !code, disabled: !code }"
          :disabled="!code"
          color="secondary"
          class="radius-login-360 text-regular-xxs black--text"
          block
          :loading="isLoading"
          height="45px"
          @click="applyVoucher"
        >
          Aplicar
        </v-btn>
        <v-btn
          v-if="Object.keys(voucherFound).length > 0 && showVoucherButtons"
          :class="{ primary: code, background: !code, disabled: !code }"
          :disabled="!code"
          color="greyBackground"
          class="radius-login-360 text-regular-xxs black--text"
          block
          :loading="isLoading"
          height="45px"
          @click="removeVoucher"
        >
          Remover
        </v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters :class="$vuetify.breakpoint.mdAndDown ? 'pt-6' : ''">
      <v-col md="5">
        <p v-if="codeShow" class="text-medium-xxs">
          Cupom de Desconto
        </p>
        <p v-if="codeShow" class="text-medium-xxs">
          Sub Total
        </p>
        <p class="text-medium-xxs">
          Taxa de Limpeza
          <v-tooltip right nudge-left max-width="250" open-on-click>
            <template #activator="{ on, attrs }">
              <v-icon
                size="13"
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
              >
                fas fa-info-circle
              </v-icon>
            </template>
            <span class="tooltip">Taxa cobrada referente ao serviço de limpeza realizado após o check-out</span>
          </v-tooltip>
        </p>
      </v-col>
      <v-col md="7" class="text-right mt-1">
        <p class="primary--text text-regular-xxs">
          {{ discountValue() }}
        </p>
        <p class="black--text mt-2">
          {{ codeShow ? subTotalValue () : '' }}
        </p>
        <p class="text-regular-xxs " :class="codeShow ? 'mt-6': 'mt-n3'">
          {{ room.cleaningFee || 0 | currency }}
        </p>
      </v-col>
    </v-row>
    <v-row
      v-if="refund"
      no-gutters
      :class="$vuetify.breakpoint.mdAndDown ? 'pt-6' : ''"
      align="center"
    >
      <v-col md="6">
        <p class="mr-1" :class="$vuetify.breakpoint.mdAndUp ? 'text-medium-xxs' : 'desc-medium-xxs'">
          Taxa de Reembolso
        </p>
      </v-col>
      <v-col md="6" class="text-right">
        <p class="text-regular-xxs">
          {{ refundTax || 0 | currency }}
        </p>
      </v-col>
    </v-row>
    <v-sheet
      height="1"
      width="100%"
      color="#B6B6B6"
      class="mt-7"
      :class="$vuetify.breakpoint.lgAndUp ? 'mb-6' : 'mb-4'"
    />
    <v-row class="pb-md-6">
      <v-col>
        <span class="text-medium-xs">Total</span>
      </v-col>
      <v-col class="text-right">
        <span class="text-medium-xs">{{ totalPrice() || 0 }}</span>
      </v-col>
    </v-row>

    <features-dialog ref="featuresDialog" :room-name="room.displayName || ''" :room-id="room.id" />
    <property-map-dialog ref="propMapDialog" :property-name="room.property.name || room.property.address" />
  </v-container>
</template>

<script>
import { format, parseISO, getDate, differenceInDays, isAfter, isBefore, isEqual } from 'date-fns'
import { pt } from 'date-fns/locale'
import countdownBus from '@/events/countdownBus'
import { openApi as api360 } from '@/api'
import { today, getParsedDate, formatToFrontend } from '@/shared/utils/date'
import BookingCountdown from '@/components/payment/BookingCountdown.vue'
import { currency360, percent360 } from '~/shared/currency'
import { useReservationStore, usePaymentStore } from '@/store'
import FeaturesDialog from '@/components/properties/FeaturesDialog.vue'
import PropertyMapDialog from '@/components/properties/PropertyMapDialog.vue'
import TitleComponent from '@/components/shared/Title.vue'
import refundBus from '@/events/refundBus'
import voucherBus from '@/events/voucherBus'
import voucherApplyBus from '@/events/voucherApplyBus'

export default {
  name: 'BookingDetails',
  components: {
    BookingCountdown,
    FeaturesDialog,
    PropertyMapDialog,
    TitleComponent
  },
  mixins: [currency360, percent360],
  setup () {
    const { getDates: dates, getCalculatedPrice: calculatedPrice } = useReservationStore()
    const { peopleForm, currentStep } = usePaymentStore()
    const [startDate, endDate] = dates || JSON.parse(localStorage.getItem('dates'))
    const parsedStartDate = parseISO(startDate)
    const parsedEndDate = parseISO(endDate)
    return {
      currentStep,
      peopleForm,
      startDate: format(new Date(parsedStartDate), 'dd/MM/yyyy'),
      endDate: format(new Date(parsedEndDate), 'dd/MM/yyyy'),
      calculatedPrice
    }
  },
  data () {
    return {
      isLoading: false,
      pricePerNight: [],
      showNightsCard: false,
      voucher: '',
      showCountdown: true,
      refund: false,
      showVoucher: false,
      codeShow: false,
      code: '',
      voucherFound: {},
      error: false,
      errorMessages: '',
      showErrorCard: false,
      refundTax: null,
      guest: null,
      errorDescription: '',
      clickable: true,
      showVoucherButtons: true,
      room: {
        id: null,
        propertyId: null,
        name: '',
        maxPeople: null,
        roomDescription: '',
        images: [],
        features: [],
        roomInventory: [],
        property: {
          id: null,
          address: ''
        }
      }
    }
  },
  watch: {
    refundTax (value) {
      localStorage.setItem('refundTax', value)
    },
    discountToSubtract () {
      localStorage.setItem('discountToSubtract', this.discountToSubtract)
      localStorage.setItem('calcDiscount', this.discountToSubtract)
      localStorage.setItem('voucher', JSON.stringify(this.voucherFound))
    }
  },
  mounted () {
    refundBus.$on('refundable', (data) => {
      localStorage.setItem('refundable', data.refund)
      this.refund = data.refund
      this.calculateRefundTax()
    })

    voucherBus.$on('show-voucher', (data) => {
      this.showVoucher = data.showVoucher
    })

    voucherApplyBus.$on('voucher-apply', (data) => {
      this.showVoucherButtons = data.showVoucherButtons
    })

    countdownBus.$on('countdown', (data) => {
      this.showCountdown = data.showCountdown
    })
  },
  beforeDestroy () {
    refundBus.$off('refundable')
    voucherBus.$off('show-voucher')
    voucherApplyBus.$off('voucher-apply')
    countdownBus.$off('countdown')
  },
  beforeMount () {
    this.dates = this.dates || JSON.parse(localStorage.getItem('dates'))
    this.room = JSON.parse(localStorage.getItem('room'))
    this.guest = Number(localStorage.getItem('guest')) || 1
    this.pricePerNight = this.getPricePerNight()
    this.calculateRefundTax()
  },
  methods: {
    uppercase () {
      this.code = this.code.toUpperCase().trim()
    },
    getExtraPersonTax () {
      const extraPersonTax = this.room.extraPerson
      if (this.guest > this.room.upToPersonValue) {
        return extraPersonTax * (this.guest - this.room.upToPersonValue)
      }
      return 0
    },
    calculateRefundTax () {
      const datesAmount = this.pricePerNight.length
      localStorage.setItem('datesAmount', datesAmount)
      if (datesAmount <= 6) {
        this.refundTax = this.pricePerNight.reduce((acc, current) => {
          return acc + current.refundableDailyTax
        }, 0)
        localStorage.setItem('refundTax', this.refundTax)
        return
      }

      if (datesAmount >= 7 && datesAmount <= 27) {
        this.refundTax = this.pricePerNight.reduce((acc, current) => {
          return acc + current.refundableWeeklyTax
        }, 0)
        localStorage.setItem('refundTax', this.refundTax)
        return
      }

      if (datesAmount >= 28) {
        this.refundTax = null
        localStorage.setItem('refundTax', this.refundTax)
        this.refund = false
      }
    },
    voucherChange () {
      this.voucherFound = {}
      this.error = false
      this.errorMessages = ''
      this.showErrorCard = false
    },
    applyVoucher () {
      this.isLoading = true
      this.clickable = true
      this.voucherFound = {}
      api360
        .get(`/voucher-api/by-code/${this.code}`)
        .then(({ data }) => {
          if (data) {
            this.description = data.description
            this.voucherFound = data
            this.codeShow = true
            this.error = false
            this.errorMessages = ''
            const startDateFormatted = getParsedDate(formatToFrontend(data?.startDate))
            const endDateFormatted = data.endDate !== null ? getParsedDate(formatToFrontend(data.endDate)) : null
            if (!isAfter(today, startDateFormatted)) {
              if (isEqual(today, startDateFormatted)) {
                return
              }
              this.error = true
              this.errorMessages = 'Cupom inválido'
              this.voucherFound = {}
              this.codeShow = false
              this.errorDescription = 'Este cupom não está mais disponível.'
            }
            if (endDateFormatted !== null && !isBefore(today, endDateFormatted)) {
              if (isEqual(today, endDateFormatted)) {
                return
              }
              this.error = true
              this.errorMessages = 'Cupom inválido'
              this.voucherFound = {}
              this.codeShow = false
              this.errorDescription = 'Este cupom não está mais disponível.'
            }
            localStorage.setItem('voucher', JSON.stringify(data))
          } else {
            this.clickable = false
            this.error = true
            this.errorMessages = 'Cupom inexistente'
          }
        }).catch((err) => {
          const errors = {
            '047': 'Cupom expirado',
            '048': 'Cupom inválido'
          }
          const errorDescription = {
            '047': 'Este cupom não está mais disponível.',
            '048': 'Este cupom não está mais ativo.'
          }
          const code = err?.response?.data?.code
          this.error = true
          this.errorDescription = errorDescription[code]
          this.errorMessages = errors[code] || 'Cupom inexistente'
          if (code === '047' || code === '048') {
            this.showErrorCard = false
            this.clickable = true
            return
          }
          this.clickable = false
          this.showErrorCard = false
        }).finally(() => {
          this.isLoading = false
        })
    },
    calculatePercent (nights, discount) {
      const total = nights.reduce(
        (accumulator, currentValue) => accumulator + currentValue.basePrice,
        0
      )
      const percent = discount / 100
      this.discountToSubtract = total * (percent)
      return `${this.$options.filters.currency(total * (percent) * -1)} (${this.$options.filters.percent(percent)})`
    },
    discountValue () {
      if (this.voucherFound?.type === 1) {
        localStorage.setItem('discountToSubtract', this.calculatePercent(this.pricePerNight, this.voucherFound.discount))
        return this.calculatePercent(this.pricePerNight, this.voucherFound.discount)
      }
      if (this.voucherFound?.type === 2) {
        this.discountToSubtract = this.voucherFound.discount
        localStorage.setItem('discountToSubtract', this.voucherFound.discount)
        return `${this.$options.filters.currency(this.voucherFound.discount * -1)}`
      }
      if (this.voucherFound?.type === 3) {
        this.discountToSubtract = this.voucherFound.discount * this.pricePerNight.length
        localStorage.setItem('discountToSubtract', this.voucherFound.discount)
        return `${this.$options.filters.currency(this.voucherFound.discount * this.pricePerNight.length * -1)} (${this.$options.filters.currency(this.voucherFound.discount)} x ${this.pricePerNight.length}) `
      }
    },
    removeVoucher () {
      this.voucherFound = {}
      this.code = ''
      this.discount = ''
      this.codeShow = false
      this.discountToSubtract = 0
      this.error = false
      this.errorMessages = ''
      this.showErrorCard = false
    },
    getNights () {
      const [start, end] = this.dates
      const diff = differenceInDays(new Date(end), new Date(start))
      return `${diff} ${diff > 1 ? 'Noites' : 'Noite'}`
    },
    getTotalValue () {
      const money = this.formatCurrency()
      if (this.getPricePerNight().length <= 27) {
        return money.format(this.getPricePerNight().reduce((acc, current) => {
          return acc + current.basePrice
        }, 0))
      }
      return money.format(this.getPricePerNight().reduce((acc, current) => {
        return acc + current.monthlyPrice
      }, 0))
    },
    subTotalValue () {
      const money = this.formatCurrency()
      const total = this.getPricePerNight().reduce((acc, current) => {
        return acc + current.basePrice
      }, 0)
      if (total - this.discountToSubtract < 0) {
        return money.format(0)
      }
      return money.format(total - this.discountToSubtract)
    },
    totalPrice () {
      const taxes = this.refund ? this.room.cleaningFee + this.refundTax : this.room.cleaningFee
      const money = this.formatCurrency()
      const total = this.getPricePerNight().reduce((acc, current) => {
        return acc + (this.getPricePerNight().length <= 27 ? current.basePrice : current.monthlyPrice)
      }, 0)
      if (total - this.discountToSubtract < 0) {
        localStorage.setItem('total', taxes)
        return money.format(taxes)
      }
      const discount = !this.discountToSubtract ? 0 : this.discountToSubtract
      localStorage.setItem('calcDiscount', discount)
      localStorage.setItem('voucher', JSON.stringify(this.voucherFound))
      localStorage.setItem('nightsPrice', total)
      localStorage.setItem('total', total - (discount) + taxes)
      return money.format(total - (discount) + taxes)
    },
    getDatesinfo () {
      const [start, end] = this.dates
      const startDay = parseISO(start, 'DD/MM/yyyy')
      const endDay = parseISO(end, 'DD/MM/yyyy')
      return {
        start: {
          day: getDate(startDay),
          dayOfWeek: format(startDay, 'eee', { locale: pt }),
          month: format(startDay, 'MMM', { locale: pt })
        },
        end: {
          day: getDate(endDay),
          dayOfWeek: format(endDay, 'eee', { locale: pt }),
          month: format(endDay, 'MMM', { locale: pt })
        }
      }
    },
    payment () {
      this.$router.push(`/pagamento?bookingId=${this.peopleForm.bookingId}`)
    },
    formatCurrency () {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    },
    getPricePerNight () {
      const money = this.formatCurrency()
      const datesArray = this.room.roomInventory.calendar.map((d) => {
        return d.date
      })
      const [start, end] = this.dates
      const range = datesArray.slice(datesArray.indexOf(start), datesArray.indexOf(end))
      const result = []
      range.forEach((d) => {
        const [filteredValue] = this.room.roomInventory.calendar.filter(value => value.date === d)
        const day = format(parseISO(filteredValue.date, 'DD/MM/yyyy'), 'dd/MM', { locale: pt })
        const weekDay = format(parseISO(filteredValue.date, 'DD/MM/yyyy'), 'EEEE', { locale: pt })
        const capitalizedWeekDay = weekDay.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1))
        const obj = {
          day,
          weekDay: capitalizedWeekDay.join('-'),
          price: money.format(range.length <= 27 ? filteredValue.basePrice + this.getExtraPersonTax() : filteredValue.monthlyPrice),
          basePrice: filteredValue.basePrice + this.getExtraPersonTax(),
          dailyPrice: filteredValue.dailyPrice + this.getExtraPersonTax(),
          monthlyPrice: filteredValue.monthlyPrice,
          refundableDailyTax: filteredValue.refundableDailyTax,
          refundableWeeklyTax: filteredValue.refundableWeeklyTax
        }
        result.push(obj)
      })
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
  .img-rounded {
    border-radius: 15px;
    object-fit: cover;
  }

  .v-list-item__content {
    font-size: 14px !important;
  }
</style>
