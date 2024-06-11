<template>
  <v-container>
    <title-component v-if="$vuetify.breakpoint.mdAndDown" title-normal="Finalize seu Check-in" :ltr="true" />
    <div v-if="$vuetify.breakpoint.mdAndDown">
      <div class="desc-regular-xxs mt-md-n2">
        <p :class="$vuetify.breakpoint.lgAndUp ? 'mt-n8 ml-6' : ''">
          Preencha o formulário para efetuar o pré check-in da reserva <span class="primary--text">{{ booking.id }}</span>
        </p>
      </div>
    </div>

    <v-row :class="$vuetify.breakpoint.lgAndUp ? 'mb-12 pt-10' : 'mt-6'" no-gutters>
      <v-col cols="12" lg="5" md="4">
        <img
          v-if="$vuetify.breakpoint.mdAndUp"
          :src="booking?.room?.images?.length > 0 ? booking.room.images[0].url : 'https://assets.360suites.com.br/website/no_image.png'"
          alt="360 Suítes Logo"
          class="img-rounded"
          contain
          width="175px"
          height="220px"
        >
      </v-col>
      <v-col cols="12" lg="7" md="8" class="pl-md-4 pt-md-3">
        <h4 class="primary--text" :class="$vuetify.breakpoint.lgAndUp ? 'text-regular-sm' : 'text-regular-xs'">
          {{ booking?.room?.displayName || '' }}
        </h4>
        <p class="mb-0 mt-md-2" :class="$vuetify.breakpoint.lgAndUp ? 'text-regular-xxxs' : 'desc-regular-xxs'">
          {{ booking?.room?.property.name }}
        </p>
        <p :class="$vuetify.breakpoint.lgAndUp ? 'text-regular-xxxs mb-5' : 'desc-regular-xxs'">
          {{ `${booking?.room?.property.address} - São Paulo` }}
        </p>
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
    <v-sheet height="1" width="100%" color="#B6B6B6" :class="$vuetify.breakpoint.lgAndUp ? 'my-2' : 'my-4'" />
    <v-row class="px-md-1" no-gutters>
      <v-col md="6">
        <span :class="$vuetify.breakpoint.mdAndUp ? 'text-medium-xxs' : 'desc-medium-xxs'">Apartamento</span>
      </v-col>
      <v-col md="6" class="text-right">
        <span class="text-regular-xxs">{{ booking?.room?.displayName || '' }}</span>
      </v-col>
    </v-row>
    <v-row class="pb-md-6">
      <v-col>
        <span class="text-medium-xs">Total</span>
      </v-col>
      <v-col class="text-right">
        <span class="text-medium-xs">{{ booking.price || 0 | currency }}</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { format, parseISO } from 'date-fns'
import { currency360, percent360 } from '~/shared/currency'
import { usePaymentStore } from '@/store'
import TitleComponent from '@/components/shared/Title.vue'

export default {
  name: 'BookingDetailsPrecheckin',
  components: {
    TitleComponent
  },
  mixins: [currency360, percent360],
  props: {
    booking: {
      type: Object,
      required: true
    }
  },
  setup () {
    const { peopleForm, currentStep } = usePaymentStore()
    return {
      currentStep,
      peopleForm
    }
  },
  data () {
    return {
      guest: null,
      dates: [],
      startDate: '',
      endDate: ''
    }
  },
  watch: {
    dates (value) {
      const [start, end] = JSON.parse(localStorage.getItem('dates'))
      const parsedStartDate = parseISO(start)
      const parsedEndDate = parseISO(end)
      this.startDate = format(new Date(parsedStartDate), 'dd/MM/yyyy')
      this.endDate = format(new Date(parsedEndDate), 'dd/MM/yyyy')
      localStorage.setItem('dates', JSON.stringify(value))
    }
  },
  beforeMount () {
    this.dates = JSON.parse(localStorage.getItem('dates'))
    this.guest = JSON.parse(localStorage.getItem('guest')) || 1
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
