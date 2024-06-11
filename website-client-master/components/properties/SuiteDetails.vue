<template>
  <div>
    <div v-if="dialogSuiteDetails" class="blur" />
    <v-dialog
      v-model="dialogSuiteDetails"
      hide-overlay
      max-width="1264"
      height="478"
      persistent
      :fullscreen="$vuetify.breakpoint.mdAndDown"
    >
      <v-card class="px-4" :class="$vuetify.breakpoint.lgAndUp ? 'card-radius' : ''">
        <v-row no-gutters>
          <v-col cols="12" class="mt-4 pr-4" align="right">
            <v-btn
              v-if="$vuetify.breakpoint.smAndDown"
              rounded
              icon
              width="40px"
              height="40px"
              class="btn-close"
              @click="closeSuiteDetailsDialog(true)"
            >
              x
            </v-btn>
          </v-col>
          <v-col cols="12" md="5" class="px-2">
            <v-btn
              v-if="room?.images?.length > 1 && $vuetify.breakpoint.mdAndUp"
              class="btn-photo white--text"
              :class="$vuetify.breakpoint.smAndDown ? 'btn-photo-mobile' : '' "
              @click="$refs.propGalleryDialog.openGalleryDialog()"
            >
              <span>Todas as fotos</span>
            </v-btn>

            <v-carousel
              v-if="room?.images?.length > 1"
              hide-delimiters
              show-arrows-on-hover
              continuous
              class="my-7"
              hide-delimiter-background
              delimiter-icon="fas fa-minus"
              width="448px"
              :height="$vuetify.breakpoint.smAndDown ? '260px' : '480px'"
              style="border-radius: 10px !important; "
            >
              <v-carousel-item
                v-for="(item, i) in room.images"
                :key="i"
                :src="item.url"
              />
            </v-carousel>

            <v-carousel
              v-else
              hide-delimiters
              continuous
              show-arrows-on-hover
              hide-delimiter-background
              delimiter-icon="fas fa-minus"
              class="my-7"
              width="448px"
              height="480px"
              style="border-radius: 10px !important;"
            >
              <v-carousel-item
                src="https://assets.360suites.com.br/website/no_image.png"
              />
            </v-carousel>
          </v-col>
          <v-col cols="12" md="4" class="px-2">
            <h1
              class="pt-8 primary--text text-regular-xs  mb-2"
            >
              {{ room?.displayName || room?.name }}
            </h1>
            <p class="desc-regular-xxs black--text  pt-5">
              {{ room.property.address }}
            </p>
            <v-btn
              small
              style="text-transform: inherit !important;"
              class="details-btn mt-2"
              outlined
              :width="$vuetify.breakpoint.smAndDown ? '100%' : ''"
              elevation="0"
              @click="$refs.propDetailsDialog.openPropertyDetailsDialog(true)"
            >
              Mostrar Edifício {{ room.property?.name || ' ' }}
            </v-btn>
            <v-divider v-if="$vuetify.breakpoint.smAndDown" class="mt-5" />
            <div class="pt-7">
              <v-menu
                ref="menu"
                v-model="menuRangeDates"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                content-class="elevation-0"
              >
                <template #activator="{ on, attrs }">
                  <div class="rounded-pill py-4 px-4 pl-5 box-details" style="height: 56px; width: 100%; color: #9e9e9e;" v-bind="attrs" v-on="on">
                    <v-row>
                      <v-col cols="1">
                        <v-icon class="mt-n1" :color="dates.length > 1 ? 'primary' : 'black--text'" size="22">
                          fas fa-calendar
                        </v-icon>
                      </v-col>
                      <v-col cols="5">
                        <span class="desc-regular-xxs black--text">
                          {{ dates[0] ? formatDate(dates[0]) : 'Entrada' }}
                        </span>
                      </v-col>
                      <v-divider vertical />
                      <v-col cols="1">
                        <v-icon class="mt-n1" :color="dates.length > 1 ? 'primary' : 'black--text'" size="22">
                          fas fa-calendar
                        </v-icon>
                      </v-col>
                      <v-col cols="4" class="text-left black--text">
                        <span class="desc-regular-xxs">{{ dates[1] ? formatDate(dates[1]) : 'Saída' }}</span>
                      </v-col>
                    </v-row>
                  </div>
                </template>
                <v-date-picker
                  v-model="dates"
                  no-title
                  scrollable
                  range
                  :min="minDate"
                  :max="maxDate"
                  :allowed-dates="allowedDates"
                  color="primary"
                  :width="$vuetify.breakpoint.mdAndUp ? '380px' : '100%'"
                  @input="dates[0] && dates[1] ? menuRangeDates = false : ''"
                >
                  <v-spacer />
                  <v-btn
                    text
                    color="primary"
                    @click="resetDates"
                  >
                    Limpar
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </div>
            <div class="pt-5">
              <v-menu
                open-on-click
                open-on-hover
                :close-on-content-click="false"
                bottom
                nudge-bottom="50"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    :placeholder="`${maxPeople} ${ maxPeople === 1 ? 'Pessoa' : 'Pessoas'}`"
                    outlined
                    class="rounded-pill pt-2 custom-placeholer-color"
                    readonly
                    height="48px"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <template #prepend-inner>
                      <v-icon color="primary" class="mr-2 ml-3" size="22">
                        fas fa-user
                      </v-icon>
                    </template>
                  </v-text-field>
                </template>
                <div class="white py-4 px-8 rounded-xl">
                  <v-row>
                    <v-col cols="4" class="mt-2">
                      <span class="text-regular-xxs black--text">Pessoas</span>
                    </v-col>
                    <v-col cols="8" align="right">
                      <v-btn
                        width="30px"
                        height="30px"
                        class="mx-2 mt-n2"
                        fab
                        dark
                        small
                        :color="`${ maxPeople === 1 ? '#f3d2db' : 'primary'}`"
                        @click="removeGuest"
                      >
                        <v-icon dark>
                          fas fa-minus
                        </v-icon>
                      </v-btn>
                      <span class="text-bold-xs black--text mx-2"> {{ maxPeople }} </span>
                      <v-btn
                        width="30px"
                        height="30px"
                        class="mx-2 mt-n2"
                        fab
                        dark
                        small
                        :color="`${ maxPeople === room.maxPeople ? '#f3d2db' : 'primary'}`"
                        @click="addGuest"
                      >
                        <v-icon dark>
                          fas fa-plus
                        </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </v-menu>
            </div>
            <div v-if="$vuetify.breakpoint.lgAndUp">
              <p class="black--text text-regular-xs">
                Comodidades
              </p>
              <v-row class="pb-3">
                <v-col cols="12">
                  <v-tooltip v-for="feat in highlightedFeatures" :key="feat.id" bottom open-on-click>
                    <template #activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        rounded
                        elevation="2"
                        :color="hasHighlightedFeatures(feat.id) ? 'primary' : '#D6D6D6'"
                        :class="!hasHighlightedFeatures(feat.id) ? 'crossed' : ''"
                        fab
                        small
                        class="mr-2"
                        v-on="on"
                      >
                        <v-icon size="18">
                          {{ feat.icon }}
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>{{ feat.friendlyName || '-' }}</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="12" md="6" align="center" class="mt-md-n4">
                  <v-btn
                    small
                    style="text-transform: inherit !important;"
                    class="details-btn mt-2"
                    outlined
                    :width="$vuetify.breakpoint.smAndDown ? '100%' : ''"
                    elevation="0"
                    @click="$refs.featuresDialog.openFeaturesDialog(true)"
                  >
                    Mostrar todas as comodidades
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col cols="12" md="3" class="pt-md-10 px-2">
            <div class="price-col">
              <p v-if="dates.length > 1" class="text-regular-rating-md black--text">
                Total de Noites<br><br>
                <span class="text-regular-rating-md"><span class="text-regular-sm">{{ parseFloat(getSumPricePerNight()) | currency }}*</span></span>
              </p>
              <p v-else class="text-regular-rating-md black--text">
                A partir de<br><br>
                <span class="text-regular-sm">{{ parseFloat(calculatedPrice) | currency }}*</span>
              </p>
              <p class="black--text text-regular-xxxs">
                * os valores são flutuantes e podem variar diariamente.
              </p>
              <v-menu
                v-if="dates.length > 1"
                v-model="menu"
                :close-on-content-click="false"
                max-height="196"
                location-strategy="static"
                :contained="false"
                content-class="ml-n8"
              >
                <template #activator="{ on, attrs }">
                  <p
                    v-bind="attrs"
                    class="text-decoration-underline text-medium-xxs"
                    v-on="on"
                  >
                    Ver detalhes
                  </p>
                </template>
                <v-card max-height="200" class="rounded-lg" :min-width="$vuetify.breakpoint.mdAndUp ? '340' : getCardWidth($vuetify.breakpoint.width) ">
                  <v-list>
                    <v-list-item>
                      <v-row no-gutters>
                        <v-col cols="10" md="11" class="text-md-center text-sm-left text-center">
                          <span class="text-medium-xxs">
                            Detalhes de Preço por Noite
                          </span>
                        </v-col>
                        <v-col cols="2" md="1">
                          <span
                            class="pointer text-medium-xxs ml-7 ml-md-3 primary--text"
                            @click="menu = false"
                          >
                            x
                          </span>
                        </v-col>
                      </v-row>
                    </v-list-item>
                  </v-list>
                  <v-divider class="mt-n2 mx-2 mx-md-45" />
                  <v-list>
                    <v-row v-for="value in pricePerNight" :key="value.date" class="mx-md-4 mx-2 pa-0" no-gutters :class="$vuetify.breakpoint.mdAndUp ? '': 'desc-regular-xxs'">
                      <v-col cols="8" md="8" sm="8">
                        <span class="primary--text">
                          {{ value.day }}
                        </span>{{ value.weekDay }}
                      </v-col>
                      <v-col cols="4" md="4" sm="4" class="text-right">
                        <span>{{ value.price }}</span>
                      </v-col>
                    </v-row>
                  </v-list>
                </v-card>
              </v-menu>
              <p :class="$vuetify.breakpoint.smAndDown ? 'desc-regular-xxs' : 'text-regular-xxs'" class="pt-2">
                Taxa de limpeza: {{ room.cleaningFee | currency }}

                <v-tooltip right nudge-right max-width="250" open-on-click>
                  <template #activator="{ on, attrs }">
                    <v-icon
                      size="16"
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
              <v-row v-if="dates.length > 1" class="mb-4" no-gutters>
                <div style="height: 40px; position: relative">
                  <div style="left: 36px; top: 0px; position: absolute; color: #333333; font-size: 40px; font-weight: 500; line-height: 40px; word-wrap: break-word">
                    {{ getMoney(getTotalValue() || 0).value }}<span class="text-regular-rating-md">,{{ getMoney(getTotalValue() || 0).cents.slice(0, 2) || '00' }}</span>
                  </div>
                  <div style="left: 8px; top: 19px; position: absolute; color: #333333; font-size: 18px; font-weight: 400; line-height: 18px; word-wrap: break-word">
                    R$
                  </div>

                  <div style="left: 0px; top: 5px; position: absolute; color: #333333; font-size: 10px; font-weight: 400; line-height: 10px; word-wrap: break-word">
                    TOTAL
                  </div>
                </div>
              </v-row>
              <p class="desc-regular-xxs">
                Check-in: A partir das 15h
              </p>
              <p class="desc-regular-xxs">
                Checkout: Até as 11h
              </p>
            </div>
            <div v-if="$vuetify.breakpoint.mdAndDown">
              <p class="black--text text-regular-xs pt-6">
                Comodidades
              </p>
              <v-row class="pb-3">
                <v-col cols="12">
                  <v-tooltip v-for="feat in highlightedFeatures" :key="feat.id" bottom open-on-click>
                    <template #activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        rounded
                        elevation="2"
                        :color="hasHighlightedFeatures(feat.id) ? 'primary' : '#D6D6D6'"
                        fab
                        x-small
                        class="mr-2"
                        v-on="on"
                      >
                        <v-icon size="16">
                          {{ feat.icon }}
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>{{ feat.friendlyName || '-' }}</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="12" md="6" align="center" class="mt-md-n4">
                  <v-btn
                    small
                    style="text-transform: inherit !important;"
                    class="details-btn mt-2"
                    outlined
                    :width="$vuetify.breakpoint.smAndDown ? '100%' : ''"
                    elevation="0"
                    @click="$refs.featuresDialog.openFeaturesDialog(true)"
                  >
                    Mostrar todas as comodidades
                  </v-btn>
                </v-col>
              </v-row>
              <v-divider class="mt-2" />
            </div>
            <div v-if="$vuetify.breakpoint.lgAndUp" :style="dates.length > 1 ? 'margin-top: 10px;' : 'margin-top: 100px;'" style="display: flex; flex-direction: row; margin-left: -10px; " class="align-center align-self-center align-content-center">
              <v-row no-gutters align-content="center">
                <v-col cols="12" md="4" align="center">
                  <v-btn
                    text
                    :class="$vuetify.breakpoint.smAndDown ? 'mt-n16' : ''"
                    class="text-regular-xxs mt-3"
                    style="text-transform: inherit !important;"
                    color="primary"
                    @click="closeSuiteDetailsDialog(true)"
                  >
                    Fechar
                  </v-btn>
                </v-col>
                <v-col cols="12" md="8" align="center">
                  <v-btn
                    elevation="0"
                    min-width="200px"
                    style="text-transform: inherit !important;"
                    class="rounded-lg btn-date black--text"
                    :color="dates?.length > 1 ? 'secondary' : 'greyBackground'"
                    @click="dates?.length > 1 ? handleReservation()
                      : ''"
                  >
                    {{ dates?.length > 1 ? 'Continuar' : 'Selecione a data' }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <div v-else class="align-center align-self-center align-content-center">
              <v-row no-gutters align-content="center" class="mt-6">
                <v-col cols="12" md="8" align="center">
                  <v-btn
                    elevation="0"
                    min-width="200px"
                    style="text-transform: inherit !important;"
                    class="rounded-lg btn-date black--text"
                    :color="dates?.length > 1 ? 'secondary' : 'greyBackground'"
                    @click="dates?.length > 1 ? handleReservation()
                      : ''"
                  >
                    {{ dates?.length > 1 ? 'Continuar' : 'Selecione a data' }}
                  </v-btn>
                </v-col>
                <v-col cols="12" md="4" align="center">
                  <v-btn
                    text
                    class="text-regular-xxs mt-2"
                    style="text-transform: inherit !important;"
                    color="primary"
                    @click="closeSuiteDetailsDialog(true)"
                  >
                    Fechar
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
    <summary-suite ref="summarySuiteSheet" @openSuiteDetails="openSuiteDetailsDialog()" />
    <property-map-dialog ref="propMapDialog" :property-name="room.property.name || room.property.address" />
    <features-dialog ref="featuresDialog" :room-name="room?.displayName || ''" :room-id="room.id" />
    <gallery-dialog ref="propGalleryDialog" :images="room?.images || []" :has-title="false" />
    <property-details-dialog ref="propDetailsDialog" :property-id="room?.property.id" :property-images="room.images" />
    <date-filter-warning-dialog ref="dateFilterWarningDialog" :start-date="dates[0]" :calendar="room.roomInventory.calendar" @search-dates="searchDate" @cancel="cancelReservation" />
  </div>
</template>
<script>
import { isAfter, parseISO, format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { mapActions } from 'pinia'
import FeaturesDialog from '@/components/properties/FeaturesDialog.vue'
import { formatDate } from '@/shared/banner'
import PropertyMapDialog from '@/components/properties/PropertyMapDialog.vue'
import { useFilters } from '@/shared/composables'
import { currency360 } from '@/shared/currency'
import { openApi as api360 } from '@/api'
import SummarySuite from '@/components/properties/SummarySuite.vue'
import { useReservationStore } from '@/store/reservation.store'
import { addOneDayToDate, calculateDateDifference } from '@/shared/utils/date'
import GalleryDialog from '~/components/properties/GalleryDialog.vue'
import PropertyDetailsDialog from '~/components/properties/PropertyDetailsDialog.vue'
import { useSnackbar } from '@/store'
import DateFilterWarningDialog from '@/components/properties/dates/DateFilterWarning.vue'

export default {
  name: 'SuiteDetailsDialog',
  components: {
    PropertyMapDialog,
    FeaturesDialog,
    SummarySuite,
    GalleryDialog,
    PropertyDetailsDialog,
    DateFilterWarningDialog
  },
  mixins: [currency360],
  setup () {
    const { filters } = useFilters()
    const { setSelectedRoom, setSelectedDates, setSelectedGuest, setSelectedCalculatedPrice, setHighlightedFeatures, dates: selectedDates } = useReservationStore()
    return {
      filters,
      selectedDates,
      setSelectedRoom,
      setSelectedDates,
      setSelectedGuest,
      setSelectedCalculatedPrice,
      setHighlightedFeatures
    }
  },
  data () {
    return {
      formatDate,
      menu: false,
      menuRangeDates: false,
      selectedBuildings: [],
      pricePerNight: [],
      suites: 1,
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
      },
      highlightedFeatures: [],
      maxPeople: this.filters.maxPeople || 1,
      dates: this.filters.dates ?? [],
      selectAll: false,
      dialogSuiteDetails: false,
      calculatedPrice: 0,
      datesAvailable: [],
      allDatesAvailable: [],
      isLoadingCalendar: false,
      summaryOpen: false,
      cleaningFee: '',
      maxDate: '',
      minDate: new Date().toISOString().substr(0, 10),
      addOneDayToDate
    }
  },
  watch: {
    maxPeople () {
      this.pricePerNight = this.getPricePerNight()
    },
    dates () {
      if (this.dates.length === 0) {
        this.loadAvailableDates()
        this.minDate = new Date().toISOString().substr(0, 10)
        return
      }

      const [start, end] = this.dates

      if (start.length) {
        const selectedIndex = this.datesAvailable.findIndex(date => date === start)
        let nextNull = this.datesAvailable.findIndex((date, index) => index > selectedIndex && date === null)
        if (nextNull === -1) {
          nextNull = this.datesAvailable.length
        }
        const nextAvailableDate = this.datesAvailable[nextNull - 1]
        this.datesAvailable = this.datesAvailable.splice(0, nextNull + 1)
        this.datesAvailable.push(addOneDayToDate(nextAvailableDate))
        this.maxDate = addOneDayToDate(nextAvailableDate)
        this.minDate = start
      }

      if (start && end) {
        this.loadAvailableDates()
        this.datesAvailable = this.allDatesAvailable
        this.minDate = new Date().toISOString().substr(0, 10)

        if (isAfter(parseISO(start), parseISO(end))) {
          this.dates = [end, start]
        }

        if (start === end) {
          const endNextDay = addOneDayToDate(end)
          this.dates = [start, endNextDay]
        }

        const diffInDays = calculateDateDifference(start, end)
        if (diffInDays > 90) {
          this.openDateFilterWarning()
        }
      }

      if (this.dates.length) {
        this.setSelectedDates(this.dates)
        this.pricePerNight = this.getPricePerNight()
        localStorage.setItem('dates', JSON.stringify(this.dates))
      } else {
        this.setSelectedDates([])
        localStorage.setItem('dates', [])
      }
    }
  },
  methods: {
    cancelReservation () {
      this.resetDates()
      this.$refs.dateFilterWarningDialog.closeDateFilterWarning()
    },
    searchDate (checkoutDate) {
      this.dates = [this.dates[0], checkoutDate]
      this.$refs.dateFilterWarningDialog.closeDateFilterWarning()
    },
    openDateFilterWarning () {
      this.$refs.dateFilterWarningDialog.openDateFilterWarning(true)
    },
    ...mapActions(useSnackbar, ['showSnackbar']),
    ...mapActions(useSnackbar, ['closeSnackbar']),
    getCardWidth (deviceWidth) {
      if (deviceWidth >= 540) { return deviceWidth - 150 }
      return deviceWidth - 92
    },
    getMoney (money) {
      const moneyFormat = this.formatCurrency()
      const formattedMoney = moneyFormat.format(money)
      const [value, cents] = formattedMoney.replace('R$', '').split(',')
      return { value, cents }
    },
    formatCurrency () {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    },
    getTotalValue () {
      if (this.getPricePerNight().length <= 27) {
        return this.getPricePerNight().reduce((acc, current) => {
          return acc + current.basePrice
        }, 0) + this.room.cleaningFee
      }
      return this.getPricePerNight().reduce((acc, current) => {
        return acc + current.monthlyPrice
      }, 0) + this.room.cleaningFee
    },
    getPricePerNight () {
      if (!this.room.roomInventory.calendar?.length) {
        return []
      }
      const money = this.formatCurrency()
      if (!this.room.roomInventory.calendar) { return [] }
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
          dailyPrice: filteredValue.dailyPrice + this.getExtraPersonTax(),
          basePrice: filteredValue.basePrice + this.getExtraPersonTax(),
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
    addGuest () {
      if (this.maxPeople === this.room.maxPeople) { return }
      if (!this.room?.upToPersonValue) {
        this.calculatedPrice = this.room?.roomInventory?.calendar[0].dailyPrice
        this.maxPeople++
        return
      }
      this.maxPeople > this.room.maxPeople - 1 ? this.maxPeople = this.room.maxPeople : this.maxPeople++
      if (this.maxPeople > this.room.upToPersonValue) {
        this.calculatedPrice = this.calculatedPrice + parseFloat(this.room.extraPerson)
      }
      this.setSelectedGuest(this.maxPeople)
    },
    removeGuest () {
      this.maxPeople > 1 ? this.maxPeople-- : this.maxPeople = 1
      if (this.maxPeople >= this.room.upToPersonValue) {
        this.calculatedPrice = this.calculatedPrice - parseFloat(this.room.extraPerson)
      }
      this.setSelectedGuest(this.maxPeople)
    },
    getExtraPersonTax () {
      const extraPersonTax = this.room.extraPerson
      if (this.maxPeople > this.room.upToPersonValue) {
        return extraPersonTax * (this.maxPeople - this.room.upToPersonValue)
      }
      return 0
    },
    openSuiteDetailsDialog (event, room, highlightedFeatures) {
      const localDates = localStorage.getItem('dates')
      dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
      dataLayer.push({
        event: 'view_item',
        ecommerce: {
          items: [{
            item_name: room?.name,
            item_category: room?.displayName,
            item_id: room?.id,
            price: room?.roomInventory?.calendar[0]?.basePrice?.toFixed(2),
            quantity: this.maxPeople
          }]
        }
      })
      // eslint-disable-next-line no-console
      console.log('view_item', {
        items: [{
          item_name: room?.name,
          item_category: room?.displayName,
          item_id: room?.id,
          price: room?.roomInventory?.calendar[0]?.basePrice?.toFixed(2),
          quantity: this.maxPeople
        }]
      })
      this.isLoadingCalendar = true
      let isFromEmit = true
      if (event) {
        event.preventDefault()
        isFromEmit = false
      }

      this.room = room || JSON.parse(localStorage.getItem('room'))
      this.highlightedFeatures = highlightedFeatures || JSON.parse(localStorage.getItem('highlightedFeatures'))

      this.dialogSuiteDetails = true
      this.maxPeople = this.filters?.maxPeople || 1
      this.dates = localDates.length ? JSON.parse(localStorage.getItem('dates')) : []

      if (isFromEmit) {
        this.dates = localDates.length ? JSON.parse(localStorage.getItem('dates')) : []
        this.maxPeople = JSON.parse(localStorage.getItem('guest')) || 1
      } else {
        this.dates = localDates.length ? JSON.parse(localStorage.getItem('dates')) : []
        this.maxPeople = this.filters?.maxPeople || 1
      }

      if (this.maxPeople > this.room.upToPersonValue) {
        const diff = this.maxPeople - this.room.upToPersonValue
        this.calculatedPrice = (this.room?.roomInventory?.calendar[0].basePrice) + parseFloat(this.room.extraPerson * diff)
      } else {
        this.calculatedPrice = this.room?.roomInventory?.calendar[0].basePrice
      }

      this.calculatedPrice = this.room?.roomInventory?.calendar[0].basePrice
      this.setSelectedRoom(this.room)
      this.loadAvailableDates()
      this.setSelectedGuest(this.maxPeople || 1)
    },
    loadAvailableDates () {
      api360.get(`/inventory/calendar/${this.room.id}`).then(({ data }) => {
        this.allDatesAvailable = data
        this.datesAvailable = data
        this.maxDate = data[data.length - 1]
      }).catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err)
      }).finally(() => {
        this.isLoadingCalendar = false
      })
    },
    allowedDates (val) {
      for (const date of this.datesAvailable) {
        if (date === val) {
          return val
        }
      }
    },
    closeSuiteDetailsDialog (clear = false) {
      if (clear) {
        localStorage.setItem('guests', 1)
        localStorage.setItem('dates', [])
      }

      this.dialogSuiteDetails = false
    },
    formatDescription (description) {
      if (!description) { return '-' }
      return description.split('. Check-in').join('.<br /><br /> Check-in')
    },
    hasHighlightedFeatures (id) {
      const allFeatures = this.room.features.filter(feat => feat.id === id)
      return allFeatures.length > 0
    },
    resetDates () {
      this.dates = []
      this.menuRangeDates = false
    },
    checkAvailability (dates, calendar) {
      const [arrival, departure] = dates
      return calendar.filter(cal => new Date(cal.date) >= new Date(arrival) && new Date(cal.date) < new Date(departure)).every(el => el.availableNumber > 0)
    },
    handleReservation () {
      if (!this.checkAvailability(this.dates, this.room.roomInventory.calendar)) {
        this.showSnackbar({
          text: 'Quarto nåo disponível para periodo.',
          timeout: 1000,
          color: 'warning'
        })
        return
      }
      this.$refs.featuresDialog.closeFeaturesDialog()
      this.setSelectedRoom(this.room)
      this.setSelectedDates(this.dates)
      this.setSelectedGuest(this.maxPeople || 1)
      this.setSelectedCalculatedPrice(this.calculatedPrice)
      this.setHighlightedFeatures(this.highlightedFeatures)
      this.summaryOpen = true
      this.$refs.summarySuiteSheet.openSummary()
      this.closeSuiteDetailsDialog()
      dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
          items: [{
            item_name: this.room?.name,
            item_category: this.room?.displayName,
            item_id: this.room?.id,
            price: this.getTotalValue()?.toFixed(2),
            quantity: this.maxPeople
          }]
        }
      })
      // eslint-disable-next-line no-console
      console.log('add_to_cart', {
        items: [{
          item_name: this.room?.name,
          item_category: this.room?.displayName,
          item_id: this.room?.id,
          price: this.getTotalValue()?.toFixed(2),
          quantity: this.maxPeople
        }]
      })
    }
  }
}
</script>

<style scoped lang="scss">
.card-radius {
  border-radius: 40px !important;
}

.box-details {
  border-radius: 40px;
  border: 1px solid #888888;
  background-color: #FFF;
}

.details-btn {
  border-radius: 15px;
  font-weight: 400;
  font-size: 12px;
}

.btn-date {
  font-size: 16px !important;
  padding: 16px 25px !important;
  height: 56px !important;
}

.btn-photo {
  position: absolute;
  z-index: 99;
  margin-top: 28px;
  height: 48px !important;
  padding: 8px 40px !important;
  border-radius: 10px;
  background-color:  #C31C4A !important;
}

.btn-photo-mobile {
  background-color: #333 !important;
  padding: 20px 2px !important;
  margin-left: 5px !important;
  margin-top: 33px !important;
  border-radius: 25px !important;
}

.price-col {
  border-radius: 15px !important;
  padding: 20px 28px;
  align-items: start !important;
  background-color: #F6F6F6;
}

.custom-placeholer-color ::placeholder {
  color: #333 !important;
  opacity: 1;
}

.btn-close {
  background-color: #C31C4A !important;
  color: #fff !important;
}

</style>
