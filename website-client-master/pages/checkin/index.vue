<template>
  <div v-if="!isLoading" id="booking-payment">
    <v-card class="step-card-wrapper rounded-xl rounded-bs-0 ml-md-5">
      <v-row
        class="mb-11 pt-5"
        :class="$vuetify.breakpoint.lgAndUp ? 'justify-space-between' : 'justify-content-center'"
        :style="$vuetify.breakpoint.lgAndUp && 'width: 100%'"
        no-gutters
      >
        <v-col cols="12" md="7">
          <h3
            class="primary--text text-medium-xs"
          >
            Apartamento e pessoas
          </h3>
        </v-col>
        <v-col cols="12" md="4" class="pt-md-2">
          <p class="d-flex align-center mb-0">
            <v-icon size="12" color="black" class="mr-2">
              fas fa-bed
            </v-icon>
            <span class="text-regular-xxxs mr-6">
              1 Apartamento
            </span>
            <v-icon size="12" color="black" class="mr-2">
              fas fa-user
            </v-icon>
            <span class="text-regular-xxxs">
              {{ guest }} {{ guest > 1 ? 'Pessoas' : 'Pessoa' }}
            </span>
          </p>
        </v-col>
      </v-row>
      <v-expansion-panels v-model="mainPanels" class="v-expansion-panels">
        <v-expansion-panel class="main-expansion">
          <v-expansion-panel-header class="v-expansion-panel-header--parent">
            <p class="mb-0">
              <span class="desc-regular-xxs white--text">
                <v-icon size="16" color="white" class="mr-4">fas fa-bed</v-icon>
                Apartamento 360 {{ room?.displayName || room?.name }}
              </span>
            </p>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <guest-form :is-pre-checkin="true" />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </div>
</template>

<script>
import { useReservationStore, usePaymentStore } from '@/store'
import GuestForm from '@/components/precheckin/GuestForm.vue'
import { openApi as api360 } from '@/api'

export default {
  name: 'CheckinPage',
  components: {
    GuestForm
  },
  layout: 'precheckin',
  setup () {
    const { setSelectedDates } = useReservationStore()
    const paymentStore = usePaymentStore()
    return {
      setSelectedDates,
      paymentStore
    }
  },
  data () {
    return {
      guest: localStorage.getItem('guest'),
      room: JSON.parse(localStorage.getItem('room')),
      isLoading: true,
      mainPanels: 0
    }
  },
  beforeMount () {
    const bookId = this.$route?.query?.bookId || this.$route?.query?.bookingId
    api360.get(`/check-in-api/${bookId}`).then(({ data }) => {
      this.paymentStore.setPeopleForm({
        firstPersonForm: data.firstPerson
      })
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error)
    }).finally(() => {
      this.isLoading = false
    })
  }
}
</script>
<style lang="scss" scoped>
.step-card-wrapper {
  padding: 25px 32px;
  margin-top: 30px;
  margin-bottom: 30px;
}

.step-card-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: none !important;
}
</style>
