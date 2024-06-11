<template>
  <div>
    <v-bottom-sheet v-model="summarySheetModal" persistent :fullscreen="$vuetify.breakpoint.smAndDown" scrollable>
      <v-card v-if="summarySheetModal" color="primary" :style="$vuetify.breakpoint.mdAndUp ? 'height: 250px;' : ''">
        <v-card-text style="margin: 0 !important; padding: 0 !important;">
          <v-row class="text-center py-4 px-8 px-md-15" no-gutters>
            <v-col v-if="$vuetify.breakpoint.smAndDown" cols="2" md="1" class="pt-4 offset-10">
              <v-btn
                medium
                text
                class="white--text"
                @click="closeSummary"
              >
                x
              </v-btn>
            </v-col>
            <v-col cols="12" md="3" class="col-content text-left">
              <div>
                <h2 class="text-medium-xl pt-md-5 pt-sm-12 white--text pb-md-5 mb-2">
                  Sua reserva
                </h2>
                <span class="text-regular-xl secondary--text">
                  {{ room?.displayName || '' }}
                </span>
                <br>
                <span class="text-regular-xs white--text">
                  {{ room?.property.name }}
                </span><br>
                <span class="text-regular-xxs white--text">
                  {{ room?.property.address }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="1">
              <v-divider v-if="$vuetify.breakpoint.mdAndUp" vertical thickness color="#B6B6B6" class="my-16 mt-n1" />
              <v-divider v-else thickness color="#B6B6B6" class="my-6" />
            </v-col>
            <v-col cols="12" md="3" class="text-left pt-md-5">
              <div class="d-flex">
                <v-icon class="white--text pr-2 pb-1">
                  fa fa-calendar
                </v-icon>
                <span class="white--text title-medium-lg ml-2">{{ getDatesinfo().start.day }}</span>
                <div class="white--text desc-regular-xxs datesummary ml-2 text-uppercase">
                  <p class="mb-0">
                    {{ getDatesinfo().start.dayOfWeek }}
                  </p>
                  <p class="mb-0">
                    {{ getDatesinfo().start.month }}
                  </p>
                </div>
                <v-icon class="white--text ml-4 pb-1">
                  fa-solid fa-caret-right
                </v-icon>
                <span class="white--text title-medium-lg ml-4">{{ getDatesinfo().end.day }}</span>
                <div class="white--text desc-regular-xxs datesummary ml-2 text-uppercase">
                  <p class="mb-0">
                    {{ getDatesinfo().end.dayOfWeek }}
                  </p>
                  <p class="mb-0">
                    {{ getDatesinfo().end.month }}
                  </p>
                </div>
              </div>
              <div class="mt-2">
                <p class="text-regular-xxs white--text mb-1">
                  1 Apartamento
                </p>
                <p class="text-regular-xxs white--text mb-1">
                  {{ getNights() }}
                </p>
                <p class="text-regular-xxs white--text">
                  {{ `${guest} ${guest > 1 ? 'Pessoas' : 'Pessoa'}` }}
                </p>
              </div>
              <div>
                <span
                  class="white--text pointer text-decoration-underline mr-4"
                  @click="closeSummary"
                >
                  Editar
                </span>
                <span
                  class="white--text pointer text-decoration-underline"
                  @click="handleOpenFeatures"
                >
                  Conferir comodidades
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="2" class="col-content col-mobile pl-md-10 ">
              <div class="">
                <p class="pt-md-6 pt-sm-5 white--text text-summary mb-0">
                  TOTAL DE NOITES
                </p>
                <span class="white--text text-regular-rating-md"> {{ getSumPricePerNight() }} </span><br>
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  location="top-center"
                  max-height="196"
                >
                  <template #activator="{ on, attrs }">
                    <p
                      v-bind="attrs"
                      class="white--text text-decoration-underline text-summary "
                      v-on="on"
                    >
                      Ver detalhes
                    </p>
                  </template>
                  <v-card max-height="200" class="rounded-sm" :min-width="$vuetify.breakpoint.mdAndUp ? '340' : getCardWidth($vuetify.breakpoint.width) ">
                    <v-list>
                      <v-list-item>
                        <v-row no-gutters>
                          <v-col cols="10" md="11" class="text-md-center text-sm-left text-center">
                            <span class="text-medium-xxs">
                              Detalhes de Preço
                            </span>
                          </v-col>
                          <v-col cols="2" md="1">
                            <span
                              class="pointer text-medium-xxs ml-7 ml-md-3"
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

                      <v-row class="mt-1 mx-md-4 mx-2" no-gutters>
                        <v-col cols="7" md="6" sm="7">
                          <span class="ml-sm-2" :class="$vuetify.breakpoint.mdAndUp ? 'text-medium-xxs': 'desc-medium-xxs'">
                            Total de Noites
                          </span>
                        </v-col>
                        <v-col cols="5" md="6" sm="5">
                          <span class="ml-md-12 ml-sm-15 ml-3" :class="$vuetify.breakpoint.mdAndUp ? 'text-medium-xxs': 'desc-medium-xxs'">{{ getSumPricePerNight() }}</span>
                        </v-col>
                      </v-row>
                    </v-list>
                  </v-card>
                </v-menu>

                <p class="pt-md-2 white--text text-summary mb-0">
                  TAXA DE LIMPEZA
                  <v-tooltip right nudge-right max-width="250" open-on-click>
                    <template #activator="{ on, attrs }">
                      <v-icon
                        size="10"
                        color="white"
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
                <span class="white--text text-regular-rating-md"> {{ room.cleaningFee || 0 | currency }} </span><br>
                <p class="pt-md-2 white--text text-summary mb-0 pt-3">
                  TOTAL
                </p>
                <p class="white--text text-regular-rating-md ml-2 pb-0">
                  <span class="white--text title-price">
                    <span class="white--text text-regular-rating-md"> R$ </span>
                    {{ getMoney(getTotalValue() || 0).value }}</span>,<span class="white--text text-regular-rating-md">{{ getMoney(getTotalValue() || 0).cents.slice(0, 2) || '00' }} </span>
                </p>
              </div>
            </v-col>
            <v-col cols="12" md="2" class="pt-15 btn-col">
              <v-btn
                large
                style="text-transform: inherit !important;"
                color="secondary"
                height="48"
                max-width="278"
                class="mt-md-8 text-regular-xxs black--text"
                elevation="0"
                :loading="isLoading"
                :disabled="isLoading"
                @click="payment"
              >
                Confirmar Reserva
              </v-btn>
            </v-col>
            <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="12" md="1" class="pt-3 btn-close">
              <v-btn
                medium
                text
                class="mb-10 ml-10 white--text"
                @click="closeSummary"
              >
                x
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
    <features-dialog ref="featuresDialog" :room-name="room.displayName || ''" :room-id="room.id" />
    <property-map-dialog ref="propMapDialog" :property-name="room.property.name || room.property.address" />
  </div>
</template>

<script>
import { mapActions } from 'pinia'
import { parseISO, format, getDate, differenceInDays } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Auth } from 'aws-amplify'
import FeaturesDialog from '@/components/properties/FeaturesDialog.vue'
import PropertyMapDialog from '@/components/properties/PropertyMapDialog.vue'
import { useReservationStore, usePaymentStore, useSnackbar } from '@/store'
import { currency360 } from '@/shared/currency'
import { openApi as api360, sendForm, hubspotForm, signedApi } from '@/api'

export default {
  name: 'SummarySuite',
  components: {
    FeaturesDialog,
    PropertyMapDialog
  },
  mixins: [currency360],
  emits: ['openSuiteDetails'],
  setup () {
    const { getCalculatedPrice: calculatedPrice } = useReservationStore()
    const paymentStore = usePaymentStore()
    return {
      calculatedPrice,
      paymentStore
    }
  },
  data () {
    return {
      isLoading: false,
      summarySheetModal: false,
      dates: [],
      pricePerNight: [],
      menu: false,
      guest: 2,
      user: {},
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
  methods: {
    ...mapActions(useSnackbar, ['showSnackbar']),
    ...mapActions(useSnackbar, ['closeSnackbar']),
    createBooking () {
      this.isLoading = true
      const [arrivalDate, departureDate] = this.dates
      api360.post('/bookings/create', {
        roomId: this.room.id,
        arrivalDate,
        departureDate
      }).then(({ data }) => {
        if (data) {
          this.paymentStore.setPeopleForm({
            ...this.paymentStore.peopleForm,
            bookingId: data
          })
          localStorage.setItem('bookingId', data)
          this.$router.push(`/pagamento?bookingId=${data}`)
          return
        }
        this.showSnackbar({
          text: 'Falha ao iniciar reserva. Tente novamente mais tarde.',
          timeout: -1,
          color: 'error'
        })
      }).catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err)
        this.showSnackbar({
          text: 'Falha ao iniciar reserva. Tente novamente mais tarde.',
          timeout: -1,
          color: 'error'
        })
      }).finally(() => {
        this.isLoading = false
      })
    },
    getExtraPersonTax () {
      const extraPersonTax = this.room.extraPerson
      if (this.guest > this.room.upToPersonValue) {
        return extraPersonTax * (this.guest - this.room.upToPersonValue)
      }
      return 0
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
    getNights () {
      const [start, end] = this.dates
      const diff = differenceInDays(new Date(end), new Date(start))
      return `${diff} ${diff > 1 ? 'Noites' : 'Noite'}`
    },
    openSummary () {
      this.dates = JSON.parse(localStorage.getItem('dates'))
      this.guest = JSON.parse(localStorage.getItem('guest')) || 1
      this.room = JSON.parse(localStorage.getItem('room'))
      this.summarySheetModal = true
      this.pricePerNight = this.getPricePerNight()

      Auth.currentAuthenticatedUser().then((response) => {
        signedApi.get(`/website-users/user-by-email/${response.attributes.email}`).then(({ data }) => {
          this.user = data
        }).catch((error) => {
          this.isLoading = false
          // eslint-disable-next-line no-console
          console.error(error)
        }).finally(() => {
          this.isLoading = false
        })
      })
    },
    closeSummary () {
      this.$refs.featuresDialog.closeFeaturesDialog()
      this.$emit('openSuiteDetails')
      this.summarySheetModal = false
    },
    getMoney (money) {
      const moneyFormat = this.formatCurrency()
      const formattedMoney = moneyFormat.format(money)
      const [value, cents] = formattedMoney.replace('R$', '').split(',')
      return { value, cents }
    },
    payment () {
      const hasParking = this.room.features.some(f => f.friendlyName.toLowerCase().trim() === 'estacionamento')
      Auth.currentAuthenticatedUser().then((response) => {
        sendForm([
          {
            name: 'email',
            value: response?.attributes?.email || ''
          },
          {
            name: 'propriedade_modal',
            value: this.room?.property?.name || ''
          },
          {
            name: 'categoria_modal',
            value: this.room?.name || ''
          },
          {
            name: 'apartamento_modal',
            value: this.room?.displayName || ''
          },
          {
            name: 'check_in_modal',
            value: (this.dates && this.dates.length > 0) ? this.date[0] : ''
          },
          {
            name: 'check_out_modal',
            value: (this.dates && this.dates.length > 1) ? this.date[1] : ''
          },
          {
            name: 'noites_vendidas_modal',
            value: this.getNights()?.split(' ') || ''
          },
          {
            name: 'quantidade_de_hospedes_modal',
            value: this.room?.maxPeople || ''
          },
          {
            name: 'quantidade_de_apartamentos_modal',
            value: 1
          },
          {
            name: 'valor_da_venda_modal',
            value: this.getTotalValue()
          }
        ], {
          pageUri: hubspotForm.reservationSelect.pageUri,
          pageName: hubspotForm.reservationSelect.pageName
        }, hubspotForm.reservationSelect.id)
      })
      localStorage.setItem('dates', JSON.stringify(this.dates))
      localStorage.setItem('hasParking', hasParking)
      dataLayer.push({
        event: 'begin_checkout',
        ecommerce: {
          items: [{
            item_category: this.room?.displayName,
            item_name: this.room?.name,
            item_id: this.room?.id,
            price: this.getTotalValue()?.toFixed(2),
            quantity: this.room?.maxPeople
          }],
          name: this.user?.firstName ? `${this.user?.firstName} ${this.user?.lastName}` : '',
          email: this.user?.email || '',
          phone: this.user?.cellPhone || ''
        }
      })
      // eslint-disable-next-line no-console
      console.log('begin_checkout', {
        event: 'begin_checkout',
        ecommerce: {
          items: [{
            item_category: this.room?.displayName,
            item_name: this.room?.name,
            item_id: this.room?.id,
            price: this.getTotalValue()?.toFixed(2),
            quantity: this.room?.maxPeople
          }],
          name: this.user?.firstName ? `${this.user?.firstName} ${this.user?.lastName}` : '',
          email: this.user?.email || '',
          phone: this.user?.cellPhone || ''
        }
      })
      this.createBooking()
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
          price: money.format(range.length <= 27 ? filteredValue.basePrice + this.getExtraPersonTax() : filteredValue.monthlyPrice + this.getExtraPersonTax()),
          basePrice: filteredValue.basePrice + this.getExtraPersonTax(),
          dailyPrice: filteredValue.dailyPrice + this.getExtraPersonTax(),
          monthlyPrice: filteredValue.monthlyPrice
        }
        result.push(obj)
      })
      return result
    },
    handleOpenFeatures () {
      this.$refs.featuresDialog.openFeaturesDialog()
    },
    getSumPricePerNight () {
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
    getCardWidth (deviceWidth) {
      if (deviceWidth >= 540) { return deviceWidth - 150 }
      return deviceWidth - 92
    }
  }

}
</script>

<style lang="scss" scoped>
@import '~/assets/mixins.scss';

.col-content{
  display: flex;
  flex-direction: column;
  text-align: left !important;
  @include phone-only() {
    padding-top: 7px;
  }
}

.datesummary{
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.col-mobile {
  @include phone-only() {
    margin-top: 20px;
    align-items: flex-start;
  }
}

.btn-col{
  @include phone-only() {
    padding-top: 10px !important;
  }
}

.btn-close{
  @include phone-only() {
    // position: absolute;
    right: 17.72%;
    top: 2%;
    left: 35%;
  }
}

.v-menu__content::-webkit-scrollbar {
  width: 10px !important;
}

.v-menu__content::-webkit-scrollbar-track {
  background-color: #e4e4e4 !important;
  border-radius: 100px !important;
}

.v-menu__content::-webkit-scrollbar-thumb {
  background-color: #888 !important;
  border-radius: 100px !important;
}

</style>
