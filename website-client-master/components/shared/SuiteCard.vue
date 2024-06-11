<template>
  <v-card
    :key="room.id"
    class="card-radius pa-0"
    :class="!isProperty ? 'mx-2' : ''"
    elevation="0"
    :width="!isProperty ? 300 : 'unset'"
    @click="buttonFunction"
  >
    <v-card-text class="ma-0 mb-0 pa-0 pb-4">
      <v-carousel
        v-if="room?.images?.length > 1"
        hide-delimiters
        disabled
        touchless
        class="suite-carousel"
        show-arrows-on-hover
        height="200"
        :show-arrows="isProperty"
      >
        <v-carousel-item v-for="(roomImg, index) in room?.images || []" :key="index">
          <v-sheet
            class="fill-height carrossel-with-image"
            align="center"
            justify="center"
            :style="`background-image: url(${roomImg.url})`"
            style="background-size: cover; background-position: center;"
          />
        </v-carousel-item>
      </v-carousel>
      <v-sheet
        v-else
        height="200"
        align="center "
        justify="center"
        class="carrossel-no-image"
      />
      <v-btn
        v-if="isProperty"
        :color="buttonProperties.color"
        elevation="0"
        class="radius-360 mt-n14 capitalize text-unset"
        :class="buttonProperties.colorText"
        @click="buttonFunction"
      >
        {{ buttonProperties.text }}
      </v-btn>
    </v-card-text>

    <v-card-title
      v-if="isProperty"
      class="py-0 mt-n4 primary--text text-regular-xs d-block font-weight-regular text-truncate"
    >
      {{ room?.displayName || room?.name }}
    </v-card-title>
    <v-card-title
      v-else
      class="py-0 mt-n2 primary--text text-regular-xs d-block font-weight-regular text-truncate"
    >
      {{ room?.property.name || ' ' }}
    </v-card-title>
    <v-card-text class="desc-regular-xxs grey--text font-weight-regular pb-0" style="height: 40px">
      {{ room?.property?.address }}
    </v-card-text>
    <v-card-text v-if="!isProperty" class="text-regular-xxs black--text">
      {{ room?.displayName || room?.name }}
    </v-card-text>

    <v-card-text v-if="isProperty" class="black--text">
      <p class="text-regular-xxs">
        Comodidades
      </p>
      <v-row class="px-2 pb-3">
        <v-tooltip v-for="feat in highlightedFeatures" :key="feat.id" bottom open-on-click>
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              rounded
              elevation="0"
              :color="hasHighlightedFeatures(feat.id) ? 'primary' : '#D6D6D6'"
              :class="!hasHighlightedFeatures(feat.id) ? 'crossed' : ''"
              fab
              x-small
              style="width: 28px; height: 28px; margin: 0 2px;"
              v-on="on"
            >
              <v-icon size="14">
                {{ feat.icon }}
              </v-icon>
            </v-btn>
          </template>
          <span>{{ feat.friendlyName || '-' }}</span>
        </v-tooltip>
      </v-row>
    </v-card-text>
    <v-card-text class="ma-0 pt-1 black--text">
      <p v-if="buttonProperties.color !== 'primary'" class="mb-0 desc-regular-xxs font-weight-regular">
        A partir de
      </p>
      <p
        v-if="filters?.dates?.length"
        class="mb-n10 ml-0 font-weight-regular"
        :class="
          $vuetify.breakpoint.xs
            ? 'text-medium-xxs'
            : 'text-regular-xs'
        "
      >
        {{ getSumPricePerNight() | currency }}
      </p>
      <p
        v-else-if="room?.roomInventory"
        class="mb-n10 ml-0 font-weight-regular"
        :class="
          $vuetify.breakpoint.xs
            ? 'text-medium-xxs'
            : 'text-regular-xs'
        "
      >
        {{ parseFloat((room?.roomInventory?.calendar[0].basePrice)) | currency }}<span class="text-regular-xxs">/noite</span>
      </p>
      <p
        v-else
        class="mb-n10 ml-0 font-weight-regular"
        :class="
          $vuetify.breakpoint.xs
            ? 'text-medium-xxs'
            : 'text-regular-xs'
        "
      >
        R$ 0,00
      </p>
    </v-card-text>
    <v-card-text class="black--text d-flex">
      <p class="desc-regular-xxs d-inline-block align-self-end">
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
        </v-tooltip> Taxa limpeza: {{ room.cleaningFee | currency }}
      </p>
      <v-spacer />
      <div class="d-inline-block align-self-end">
        <v-icon class="d-block" color="black" small>
          fa-solid fa-house
        </v-icon>
        <p class="text-center grey--text">
          {{ room?.roomSize || 0 }}m²
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
import { parseISO, format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { currency360 } from '@/shared/currency'
import { useFilters } from '@/shared/composables'

export default {
  name: 'SuiteCard',
  mixins: [currency360],
  props: {
    room: {
      type: Object,
      required: true
    },
    features: {
      type: Array,
      required: true
    },
    isProperty: {
      type: Boolean,
      default: true
    },
    buttonProperties: {
      type: Object,
      default: () => ({
        color: 'secondary',
        text: 'Selecione a data',
        colorText: 'black--text'
      })
    },
    buttonFunction: {
      type: Function,
      default: () => {}
    },
    highlightedFeatures: {
      type: Array,
      default: () => []
    }
  },
  setup () {
    const { filters } = useFilters()
    return {
      filters
    }
  },
  methods: {
    formatCurrency () {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    },
    getPricePerNight () {
      const money = this.formatCurrency()
      const datesArray = this.room?.roomInventory?.calendar?.map((d) => {
        return d.date
      })
      const [start, end] = this.filters.dates ?? []
      const range = datesArray?.slice(datesArray.indexOf(start), datesArray.indexOf(end))
      const result = []
      range.forEach((d) => {
        const [filteredValue] = this.room?.roomInventory?.calendar?.filter(value => value.date === d)
        const day = format(parseISO(filteredValue.date, 'DD/MM/yyyy'), 'dd/MM', { locale: pt })
        const weekDay = format(parseISO(filteredValue.date, 'DD/MM/yyyy'), 'EEEE', { locale: pt })
        const capitalizedWeekDay = weekDay.split('-')?.map(s => s.charAt(0).toUpperCase() + s.slice(1))
        const obj = {
          day,
          weekDay: capitalizedWeekDay.join('-'),
          price: money.format(filteredValue.dailyPrice),
          dailyPrice: filteredValue.dailyPrice,
          basePrice: filteredValue.basePrice,
          monthlyPrice: filteredValue.monthlyPrice
        }
        result.push(obj)
      })
      return result
    },
    getSumPricePerNight () {
      if (this.getPricePerNight().length <= 27) {
        return this.getPricePerNight().reduce((acc, current) => {
          return acc + current.basePrice
        }, 0)
      }
      return this.getPricePerNight().reduce((acc, current) => {
        return acc + current.monthlyPrice
      }, 0)
    },
    hasHighlightedFeatures (id) {
      const allFeatures = this.features.filter(feat => feat.id === id)
      return allFeatures.length > 0
    },
    getCleaningFee () {
      const [fee] = this.room.property?.propertyUpsell?.filter(up => up.type === 6) || []
      return parseFloat(fee?.price || 0)
    },
    getCardMinWidth () {
      return this.$vuetify.breakpoint.xs ? '100%' : '300px'
    }
  }
}
</script>

  <style scoped lang="scss">
    .card-radius {
      border-radius: 24px !important;
    }

    .carrossel-with-image {
      background-size: cover !important;
      border-radius: 24px 24px 0px 0px !important;
    }

    .carrossel-no-image {
      background-image: url('https://assets.360suites.com.br/website/no_image.png') !important;
      background-position: center top;
      background-size: 260px !important;
      border-radius: 24px 24px 0px 0 !important;
    }

    .tooltip {
      max-width: 10px !important;
    }

    .content-height {
      height: 60px;
    }
  </style>
</template>
