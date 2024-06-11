<template>
  <div class="ma-0 pa-0 mb-4">
    <title-component title-normal="Minhas reservas" />
    <v-row :class="$vuetify.breakpoint.smAndDown ? 'mx-1 mt-4' : ''">
      <v-col cols="12">
        <v-text-field
          v-model.trim="search"
          label="Busca por reserva"
          dense
          outlined
          placeholder="Pesquisar por número de reserva"
          background-color="white"
          class="radius-login-360"
          height="45px"
          hide-details="auto"
          append-icon="fa-solid fa-search"
        />
      </v-col>
    </v-row>
    <v-row :class="$vuetify.breakpoint.smAndDown ? 'mx-1' : ''">
      <v-col cols="12">
        <strong>Filtros</strong>
      </v-col>
      <v-col cols="12">
        <v-chip-group v-model="filters" multiple column>
          <v-chip class="mr-2" color="grey" :outlined="!filters.includes('ongoing')" label value="ongoing">
            <v-icon left>
              fa-solid fa-hourglass-half
            </v-icon>
            Em andamento
          </v-chip>

          <v-chip class="mr-2" color="success" :outlined="!filters.includes('confirmed')" label value="confirmed">
            <v-icon left>
              fa-solid fa-calendar
            </v-icon>
            Confirmadas
          </v-chip>

          <v-chip class="mr-2" color="cyan" :outlined="!filters.includes('past')" label value="past">
            <v-icon left>
              fa-solid fa-check
            </v-icon>
            Concluídas
          </v-chip>

          <v-chip class="mr-2" color="error" :outlined="!filters.includes('cancelled')" label value="cancelled">
            <v-icon left>
              fa-solid fa-xmark
            </v-icon>
            Canceladas
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
    <v-row v-if="isLoading" justify="center">
      <v-progress-circular
        :size="200"
        color="primary"
        indeterminate
      />
    </v-row>
    <v-row v-if="!$vuetify.breakpoint.smAndDown && !isLoading">
      <v-col v-for="(booking, i) in filteredBookings" :key="i" cols="12">
        <v-card color="white" flat class="border-360-1 my-4">
          <v-row :id="`card-${i}`" class="pa-4">
            <v-col cols="3">
              <v-avatar :id="`img-${i}`" height="192" width="100%" tile>
                <v-img :src="booking.displayPicture" class="border-360-1" />
              </v-avatar>
            </v-col>

            <v-col :id="`side-${i}`" cols="9">
              <v-row :id="`side-top-${i}`">
                <v-col cols="9">
                  <h3 class="text-h5 primary--text">
                    {{ booking.room?.property?.name }}
                  </h3>

                  <p>{{ booking.formattedPropertyAddress }}</p>

                  <div class="d-flex">
                    <div class="d-inline mr-10">
                      <span class="caption" style="height: 16px; vertical-align: top;">Entrada</span>
                      <span>
                        <strong class="body-1 font-weight-medium">
                          {{ booking.formattedArrival }}
                        </strong>
                        <span class="caption" style="height: 16px; vertical-align: top;">{{ '15:00' }}h</span>
                      </span>
                    </div>

                    <div class="d-inline">
                      <span class="caption" style="height: 16px; vertical-align: top;">Saída</span>
                      <span>
                        <strong class="body-1 font-weight-medium">
                          {{ booking.formattedDeparture }}
                        </strong>
                        <span class="caption" style="height: 16px; vertical-align: top;">{{ '11:00' }}h</span>
                      </span>
                    </div>
                  </div>
                </v-col>

                <v-col cols="3">
                  <div class="d-flex justify-space-between flex-wrap">
                    <v-btn class="d-flex" block elevation="0" :color="getStatusColor(booking.bookingStatus)">
                      {{ booking.bookingStatus | getStatusText }}
                    </v-btn>

                    <v-menu offset-y>
                      <template #activator="{ on, attrs }">
                        <v-btn
                          class="d-flex mt-6"
                          block
                          elevation="0"
                          v-bind="attrs"
                          color="grey lighten-2"
                          v-on="on"
                        >
                          Ações
                          <v-icon right dark>
                            fas fa-chevron-down
                          </v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          v-if="(booking.bookingStatus == 'confirmed' || booking.bookingStatus == 'ongoing') && booking.hasParking"
                          link
                          @click="$refs.vehicleFormDialog.openDialog(booking)"
                        >
                          <v-list-item-icon>
                            <v-icon color="black">
                              fa-solid fa-car
                            </v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Dados do Veículo</v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="$refs.precheckinFormDialog.openDialog(booking)">
                          <v-list-item-icon>
                            <v-icon color="black">
                              fa-solid fa-users
                            </v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Dados Cadastrados</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          v-if="booking.bookingStatus == 'confirmed' || booking.bookingStatus == 'ongoing'"
                          link
                          @click="booking.refererEditable == 'site360suites' || booking.precheckin ? $refs.checkinDialog.openDialog(booking) : redirectDigitalCheckin(booking)"
                        >
                          <v-list-item-icon>
                            <v-icon color="black">
                              fa-solid fa-bell-concierge
                            </v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Instruções de Check-in</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          v-if="booking.bookingStatus == 'ongoing' || booking.bookingStatus == 'past'"
                          link
                          @click="$refs.checkoutDialog.openDialog(booking)"
                        >
                          <v-list-item-icon>
                            <v-icon color="black">
                              fa-solid fa-arrow-right-from-bracket
                            </v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Realizar Checkout</v-list-item-title>
                        </v-list-item>
                        <!-- TODO Liberar mediante integração com dados de pagamento
                          <v-list-item link @click="$refs.receiptDialog.openDialog(booking)">
                          <v-list-item-icon>
                            <v-icon color="black">
                              fa-solid fa-receipt
                            </v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Comprovante</v-list-item-title>
                        </v-list-item>-->
                        <v-list-item
                          v-if="booking.bookingStatus === 'confirmed' && booking.isRefundable"
                          link
                          :href="`https://app.pipefy.com/public/form/w7Zixuit?email=${booking.email}&c_digo_da_reserva=${booking.id}`"
                          target="_blank"
                        >
                          <v-list-item-icon>
                            <v-icon color="black">
                              fa-solid fa-close
                            </v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Cancelar Reserva</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          link
                          tag="a"
                          target="_blank"
                          :href="`https://wa.me/5511961718008?text=Gostaria%20de%20ajuda%20com%20a%20reserva%20${booking.id}`"
                        >
                          <v-list-item-icon>
                            <v-icon color="black">
                              fa-solid fa-circle-question
                            </v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Ajuda com esta Reserva</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </v-col>
              </v-row>
              <v-col class="ma-0 px-0">
                <v-divider />
              </v-col>
              <v-col :id="`side-bottom-${i}`" class="pa-0">
                <div class="d-flex justify-space-between flex-wrap">
                  <div class="d-inline-block">
                    <span class="d-block caption">Número da Reserva</span>
                    <span class="d-block primary--text subtitle-1 font-weight-medium">{{ booking.id }}</span>
                  </div>

                  <div class="d-inline-block">
                    <span class="d-block caption">Noites</span>
                    <span class="d-block subtitle-1 font-weight-medium">{{ booking.nights }}</span>
                  </div>

                  <div class="d-inline-block">
                    <span class="d-block caption">Pessoas</span>
                    <span class="d-block subtitle-1 font-weight-medium">{{ booking.numAdult }}</span>
                  </div>

                  <div class="d-inline-block">
                    <span class="d-block caption">Valor da Reserva</span>
                    <span class="d-block subtitle-1 font-weight-medium">{{ booking.formattedPrice }}</span>
                  </div>
                  <div v-if="!booking.isFromOTA" class="d-inline-block" style="max-width: 164px;">
                    <a
                      href="/politicas-cancelamento"
                      target="_blank"
                      class="d-block caption text-decoration-underline grey--text"
                    >Política de Cancelamento</a>
                    <span v-if="booking.isRefundable" class="d-block subtitle-1 font-weight-medium">Reserva
                      Reembolsável</span>
                    <span v-else class="d-block subtitle-1 font-weight-medium">Reserva não Reembolsável</span>
                  </div>
                </div>
              </v-col>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="$vuetify.breakpoint.smAndDown && !isLoading">
      <v-col v-for="(booking, i) in filteredBookings" :key="i" cols="12">
        <v-card color="white" flat class="border-360-1 my-4">
          <v-row :id="`card-${i}`" class="pa-4">
            <v-col :id="`side-${i}`" cols="12">
              <v-row :id="`side-top-${i}`">
                <v-col cols="12" class="text-center">
                  <h3 class="text-h5 primary--text">
                    {{ booking.room?.property?.name }}
                  </h3>

                  <p class="mb-0">
                    {{ booking.formattedPropertyAddress }}
                  </p>
                </v-col>
                <v-col>
                  <v-row>
                    <v-col class="d-flex justify-center">
                      <div class="d-inline-block" style="width: 112px;">
                        <div class="caption" style="height: 16px; vertical-align: top;">
                          Entrada
                        </div>
                        <div>
                          <strong class="body-1 font-weight-medium">
                            {{ booking.formattedArrival }}
                          </strong>
                          <div class="caption" style="height: 16px; vertical-align: top;">
                            {{ '15:00' }}h
                          </div>
                        </div>
                      </div>
                    </v-col>

                    <v-col class="d-flex justify-start">
                      <div class="d-inline-block">
                        <div class="caption" style="height: 16px; vertical-align: top;">
                          Saída
                        </div>
                        <div>
                          <strong class="body-1 font-weight-medium">
                            {{ booking.formattedDeparture }}
                          </strong>
                          <div class="caption" style="height: 16px; vertical-align: top;">
                            {{ '11:00' }}h
                          </div>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-col :id="`side-bottom-${i}`" class="pa-0">
                <v-row>
                  <v-col class="d-flex justify-center">
                    <div class="d-inline-block" style="width: 112px;">
                      <span class="d-block caption">Número da Reserva</span>
                      <span class="d-block primary--text subtitle-1 font-weight-medium">{{ booking.id }}</span>
                    </div>
                  </v-col>
                  <v-col>
                    <v-row no-gutters>
                      <v-col class="d-flex justify-start">
                        <div class="d-inline-block">
                          <span class="d-block caption">Noites</span>
                          <span class="d-block subtitle-1 font-weight-medium">{{ booking.nights }}</span>
                        </div>
                        <span class="mx-5" />
                        <div class="d-inline-block">
                          <span class="d-block caption">Pessoas</span>
                          <span class="d-block subtitle-1 font-weight-medium">{{ booking.numAdult }}</span>
                        </div>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row class="mt-0">
                  <v-col class="d-flex justify-center">
                    <div class="d-inline-block" style="width: 112px;">
                      <span class="d-block caption">Valor da Reserva</span>
                      <span class="d-block subtitle-1 font-weight-medium">{{ booking.formattedPrice }}</span>
                    </div>
                  </v-col>
                  <v-col v-if="!booking.isFromOTA" class="d-flex justify-start">
                    <div class="d-inline-block" style="max-width: 164px;">
                      <a
                        href="/politicas-cancelamento"
                        target="_blank"
                        class="d-block caption text-decoration-underline grey--text"
                      >Política de Cancelamento</a>
                      <span v-if="booking.isRefundable" class="d-block subtitle-1 font-weight-medium">Reserva
                        Reembolsável</span>
                      <span v-else class="d-block subtitle-1 font-weight-medium">Reserva não Reembolsável</span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
            <v-col cols="12">
              <div class="d-flex justify-space-between flex-wrap">
                <v-btn class="d-flex" block elevation="0" :color="getStatusColor(booking.bookingStatus)">
                  {{ booking.bookingStatus | getStatusText }}
                </v-btn>

                <v-menu offset-y top>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      class="d-flex mt-6"
                      block
                      elevation="0"
                      v-bind="attrs"
                      color="grey lighten-2"
                      v-on="on"
                    >
                      Ações
                      <v-icon right dark>
                        fas fa-chevron-down
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-if="(booking.bookingStatus == 'confirmed' || booking.bookingStatus == 'ongoing') && booking.hasParking"
                      link
                      @click="$refs.vehicleFormDialog.openDialog(booking)"
                    >
                      <v-list-item-icon>
                        <v-icon color="black">
                          fa-solid fa-car
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Dados do Veículo</v-list-item-title>
                    </v-list-item>
                    <v-list-item link @click="$refs.precheckinFormDialog.openDialog(booking)">
                      <v-list-item-icon>
                        <v-icon color="black">
                          fa-solid fa-users
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Dados Cadastrados</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-if="booking.bookingStatus == 'confirmed' || booking.bookingStatus == 'ongoing'"
                      link
                      @click="booking.refererEditable == 'site360suites' || booking.precheckin ? $refs.checkinDialog.openDialog(booking) : redirectDigitalCheckin(booking)"
                    >
                      <v-list-item-icon>
                        <v-icon color="black">
                          fa-solid fa-bell-concierge
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Instruções de Check-in</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-if="booking.bookingStatus == 'ongoing' || booking.bookingStatus == 'past'"
                      link
                      @click="$refs.checkoutDialog.openDialog(booking)"
                    >
                      <v-list-item-icon>
                        <v-icon color="black">
                          fa-solid fa-arrow-right-from-bracket
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Realizar Checkout</v-list-item-title>
                    </v-list-item>
                    <!-- TODO Liberar mediante integração com dados de pagamento
                    <v-list-item link @click="$refs.receiptDialog.openDialog(booking)">
                      <v-list-item-icon>
                        <v-icon color="black">
                          fa-solid fa-receipt
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Comprovante</v-list-item-title>
                    </v-list-item>-->
                    <v-list-item
                      v-if="booking.bookingStatus === 'confirmed' && booking.isRefundable"
                      link
                      :href="`https://app.pipefy.com/public/form/w7Zixuit?email=${booking.email}&c_digo_da_reserva=${booking.id}`"
                      target="_blank"
                    >
                      <v-list-item-icon>
                        <v-icon color="black">
                          fa-solid fa-close
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Cancelar Reserva</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      link
                      tag="a"
                      target="_blank"
                      :href="`https://wa.me/5511961718008?text=Gostaria%20de%20ajuda%20com%20a%20reserva%20${booking.id}`"
                    >
                      <v-list-item-icon>
                        <v-icon color="black">
                          fa-solid fa-circle-question
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Ajuda com esta Reserva</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <checkout-dialog ref="checkoutDialog" />
    <checkin-dialog ref="checkinDialog" />
    <receipt-dialog ref="receiptDialog" />
    <vehicle-form-dialog ref="vehicleFormDialog" />
    <precheckin-form-dialog ref="precheckinFormDialog" />
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import TitleComponent from '@/components/shared/Title.vue'
import CheckoutDialog from '@/components/my-bookings/CheckoutDialog.vue'
import CheckinDialog from '@/components/my-bookings/CheckinDialog.vue'
import ReceiptDialog from '@/components/my-bookings/ReceiptDialog.vue'
import VehicleFormDialog from '@/components/my-bookings/VehicleFormDialog.vue'
import PrecheckinFormDialog from '@/components/my-bookings/PrecheckinFormDialog.vue'
import { currency360 } from '~/shared/currency'
import { openApi as api360 } from '@/api'

export default {
  name: 'MyBookingsPage',
  components: {
    TitleComponent,
    CheckinDialog,
    CheckoutDialog,
    ReceiptDialog,
    VehicleFormDialog,
    PrecheckinFormDialog
  },
  filters: {
    getStatusText (val) {
      switch (val) {
        case 'confirmed':
          return 'confirmada'
        case 'cancelled':
          return 'cancelada'
        case 'past':
          return 'concluída'
        case 'ongoing':
          return 'andamento'
        default:
          return 'desconhecida'
      }
    }
  },
  mixins: [currency360],
  layout: 'profile',
  data () {
    return {
      isLoading: false,
      filters: ['ongoing', 'confirmed', 'past'],
      search: '',
      bookings: [],
      email: ''
    }
  },
  computed: {
    filteredBookings () {
      let bookings = [...this.bookings]

      // add is refundable based on infoItems
      bookings = bookings.map((booking) => {
        const isRefundable = !!booking.infoItems.find(item => item.code === 'REFUNDABLE' && item.text === 'S')
        const isFromOTA = booking.refererEditable !== 'site360suites'
        return {
          ...booking,
          isRefundable,
          isFromOTA
        }
      })

      if (this.search) {
        // eslint-disable-next-line eqeqeq
        bookings = bookings.filter(booking => booking.id == this.search)
      }
      if (this.filters.length > 0) {
        bookings = bookings.filter(booking => this.filters.includes(booking.bookingStatus))
      }

      return bookings
    }
  },
  beforeMount () {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        this.email = user.attributes.email
        this.fetchBookings()
      })
      .catch((err) => {
        this.signOut()
        // eslint-disable-next-line no-console
        console.error(err)
      })
  },
  methods: {
    signOut () {
      localStorage.setItem('redirect', this.$route.path)
      this.$router.replace('/login')
      Auth.signOut({ global: true })
    },
    redirectDigitalCheckin (booking) {
      if (!booking.precheckin) {
        this.$router.push(`/checkin?bookId=${booking.id}`)
      }
    },
    getStatusColor (status) {
      switch (status) {
        case 'confirmed':
          return 'success'
        case 'cancelled':
          return 'error'
        case 'past':
          return 'cyan'
        case 'ongoing':
          return 'grey'
        default:
          return ''
      }
    },
    fetchBookings () {
      this.isLoading = true
      api360.get(`/bookings/by-email?email=${this.email}`).then((response) => {
        this.bookings = response.data
      }).finally(() => {
        this.isLoading = false
      })
    }
  }
}
</script>
