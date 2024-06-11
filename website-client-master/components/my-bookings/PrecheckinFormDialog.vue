<template>
  <div>
    <div v-if="precheckinFormDialog" class="blur" />
    <v-dialog
      v-model="precheckinFormDialog"
      max-width="1200"
      min-width="800"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      hide-overlay
      persistent
      class="card-radius"
    >
      <v-card class="card-radius py-4 px-4">
        <v-icon color="primary" class="close-btn" @click="closeDialog">
          fa-solid fa-close
        </v-icon>
        <v-container>
          <v-col cols="12" class="text-start">
            <h1>
              <v-icon color="black">
                fa-solid fa-form
              </v-icon><span class="ml-2">Dados Cadastrados</span>
            </h1>
          </v-col>
          <v-col id="booking-payment" cols="12">
            <v-expansion-panels v-model="mainPanel" class="v-expansion-panels">
              <v-expansion-panel class="main-expansion">
                <guest-form ref="guestForm" :my-reservations="true" :is-pre-checkin="false" :booking="booking" />
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import GuestForm from '@/components/precheckin/GuestForm.vue'

export default {
  name: 'PrecheckinFormDialog',
  components: {
    GuestForm
  },
  data () {
    return {
      booking: {},
      precheckin: {},
      isLoading: false,
      precheckinFormDialog: false,
      mainPanel: 0
    }
  },
  methods: {
    openDialog (booking) {
      this.booking = booking
      this.precheckin = booking.precheckin
      this.precheckinFormDialog = true

      this.$nextTick(() => {
        this.$refs.guestForm.fillGuestForm(booking)
      })
    },

    save () {
      this.closeDialog()
    },
    closeDialog () {
      this.precheckinFormDialog = false
    }

  }
}
</script>

<style scoped lang="scss">

.close-btn {
  position: absolute;
  top: 24px;
  right: 24px;
}

.card-radius {
  border-radius: 24px !important;
}

</style>
