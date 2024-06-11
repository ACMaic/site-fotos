<template>
  <div>
    <div v-if="checkinDialog" class="blur" />
    <v-dialog
      v-model="checkinDialog"
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
          <v-row>
            <v-col cols="12" class="text-start">
              <h1>Instruções de Check-in</h1>
              <p>
                {{ booking?.firstName }}, a sua reserva com a 360 está confirmada!
              </p>
              <p><strong>Código da reserva:</strong> {{ booking?.id }}</p>
              <p><strong>Check-in:</strong> {{ booking?.formattedArrival }} | A partir das 15h</p>
              <p><strong>Checkout:</strong> {{ booking?.formattedDeparture }} | Até 11h</p>
              <p><strong>Endereço:</strong> {{ booking?.formattedPropertyAddress }}</p>
              <p><strong>Apartamento:</strong> {{ booking.room?.displayName }}</p>
              <p><strong>Código da Porta:</strong> {{ booking.bookingStatus == 'ongoing' ? getUnitInfo(booking)?.name2 : '*' }}</p>
              <p><strong>Rede Wi-Fi e Senha:</strong> {{ booking.bookingStatus == 'ongoing' ? getUnitInfo(booking)?.name3 : '*' }}</p>
              <p v-if="!booking.precheckin" class="primary--text">
                *O pré check-in precisa ser realizado com antecedência para que os dados de acesso sejam liberados.
              </p>
              <p class="primary--text">
                Com o preenchimento concluído, as informações completas do seu apartamento serão enviadas no dia {{ booking?.formattedArrival }}, após as 14h.
              </p>
              <p>Mas não se preocupe! Você também receberá as instruções pelo e-mail cadastrado em sua reserva.</p>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  name: 'CheckinDialog',
  data () {
    return {
      checkinDialog: false,
      booking: {}
    }
  },
  methods: {
    getUnitInfo (booking) {
      const { unitId } = booking
      return booking?.room?.units.find(unit => unitId === unit.id) || {}
    },
    openDialog (booking) {
      this.booking = booking
      this.checkinDialog = true
    },
    closeDialog () {
      this.checkinDialog = false
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
