<template>
  <div>
    <div v-if="dateFilterWarning" :class="modal ? 'blur-second-modal' : 'blur'" />
    <v-dialog v-model="dateFilterWarning" max-width="1000" hide-overlay persistent style="z-index: 200">
      <v-card class="py-10 px-10 rounded-xl">
        <v-row>
          <v-col cols="12">
            <p
              v-if="modal"
              :class="$vuetify.breakpoint.lgAndUp ? 'mb-5 mt-8 text-medium-sm text-center' : 'mb-6 mt-8 text-regular-xs'"
            >
              Através de nosso site, você poderá reservar por até 90 dias. Você deseja seguir com sua reserva com checkout até {{ formattedCheckoutDate }} e no valor de {{ parseFloat(getSumPricePerNight()) | currency }} ou falar com nosso time comercial a respeito de contrato de moradia?
            </p>
            <p
              v-else
              :class="$vuetify.breakpoint.lgAndUp ? 'mb-5 mt-8 text-medium-sm text-center' : 'mb-6 mt-8 text-regular-xs'"
            >
              Através de nosso site, você poderá reservar por até 90 dias. Você deseja seguir com sua reserva com checkout até {{ formattedCheckoutDate }} ou falar com nosso time comercial a respeito de contrato de moradia?
            </p>
          </v-col>
          <v-col cols="12" md="6" :align="$vuetify.breakpoint.mdAndUp ? 'right' : 'center'">
            <v-btn
              class="text-unset radius-login-360 search-button text-bold-xs"
              large
              elevation="0"
              color="secondary"
              center
              @click="$emit('search-dates', checkoutDate)"
            >
              Reservar por 90 dias
            </v-btn>
          </v-col>
          <v-col cols="12" md="6" :align="$vuetify.breakpoint.mdAndUp ? '' : 'center'">
            <v-btn
              class="text-unset search-button text-bold-xs"
              elevation="0"
              color="primary"
              large
            >
              <a href="https://wa.me/5511961718008" target="_blank" class="white-link">
                <v-icon size="17">fab fa-whatsapp</v-icon>
                Fale conosco
              </a>
            </v-btn>
          </v-col>
          <v-col cols="12" align="center">
            <v-btn
              text
              color="primary"
              style="text-transform: inherit !important;"
              @click="$emit('cancel')"
            >
              Cancelar
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import { add, format, parseISO } from 'date-fns'
import { currency360 } from '@/shared/currency'

export default {
  name: 'DateFilterWarningDialog',
  mixins: [currency360],
  props: {
    startDate: { type: String, default: '' },
    modal: { type: Boolean, default: true },
    calendar: { type: Array, default: () => [] }
  },

  data () {
    return {
      dateFilterWarning: false,
      checkoutDate: '',
      formattedCheckoutDate: ''
    }
  },
  methods: {
    openDateFilterWarning () {
      const date = parseISO(this.startDate)
      this.checkoutDate = format(add(date, { days: 90 }), 'yyyy-MM-dd')
      this.formattedCheckoutDate = format(parseISO(this.checkoutDate), 'dd/MM/yyyy')
      this.dateFilterWarning = true
    },
    closeDateFilterWarning () {
      this.dateFilterWarning = false
    },
    getPricePerNight () {
      if (!this.calendar?.length) {
        return []
      }
      if (!this.calendar) { return [] }
      const datesArray = this.calendar.map((d) => {
        return d.date
      })
      const start = this.startDate
      const end = this.checkoutDate
      const range = datesArray.slice(datesArray.indexOf(start), datesArray.indexOf(end))
      const result = []
      range.forEach((d) => {
        const [filteredValue] = this.calendar.filter(value => value.date === d)
        const obj = {
          monthlyPrice: filteredValue.monthlyPrice
        }
        result.push(obj)
      })
      return result
    },
    getSumPricePerNight () {
      return this.getPricePerNight().reduce((acc, current) => {
        return acc + current.monthlyPrice
      }, 0)
    }
  }
}
</script>

<style>

</style>
