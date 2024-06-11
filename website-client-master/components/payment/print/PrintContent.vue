<template>
  <div style="font-family: Rubik, sans-serif !important; align-items: center;">
    <div class="px-8 py-2">
      <v-row no-gutters class="mb-12">
        <v-col cols="6">
          <img
            src="https://assets.360suites.com.br/logos/logo.svg"
            alt="360 Suítes Logo"
            style="max-width: 160px;"
          >
        </v-col>
        <v-col cols="6" align="right">
          <span class="text-medium-xs">
            Reserva: <span style="color: var(--v-primary-base);">54545454</span>
          </span>
          <br>
          <span class="primary--text text-regular-xs">{{ room?.property?.name }}</span>
        </v-col>
      </v-row>
      <v-row no-gutters class="my-2">
        <v-col cols="12">
          <span class="primary--text text-medium-xs">
            Dados da Reserva
          </span>
        </v-col>
        <v-col cols="12" class="my-1 desc-regular-xxs">
          <span><b>Check-in: </b> Quarta-Feira - 27/12/2023 a partir das 15:00h</span>
        </v-col>
        <v-col cols="12" class="my-1 desc-regular-xxs">
          <span><b>Checkout: </b> Quarta-Feira - 27/12/2023 a partir das 15:00h</span>
        </v-col>
        <v-col cols="12" class="my-1 desc-regular-xxs">
          <span><b>Valor da Reserva: </b> Quarta-Feira - 27/12/2023 a partir das 15:00h</span>
        </v-col>
        <v-col cols="12" class="my-1 desc-regular-xxs">
          <span><b>Data da Confirmação: </b>-</span>
        </v-col>
        <v-col cols="12" class="my-1 desc-regular-xxs">
          <span><b>Nome: </b> Quarta-Feira - 27/12/2023 a partir das 15:00h</span>
        </v-col>
        <v-col cols="12" class="my-1 desc-regular-xxs">
          <span><b>Telefone: </b> Quarta-Feira - 27/12/2023 a partir das 15:00h</span>
        </v-col>
      </v-row>

      <v-row no-gutters class="my-2">
        <v-col cols="12">
          <span class="primary--text text-medium-xs">
            Dados do Apartamento
          </span>
        </v-col>
        <v-col cols="12" class="my-1 desc-regular-xxs">
          <span><b>Condomínio: </b> {{ room?.property?.name }}</span>
        </v-col>
        <v-col cols="12" class="my-1 desc-regular-xxs">
          <span><b>Endereço: </b> {{ room?.property?.address }}</span>
        </v-col>
        <v-col cols="12" class="my-1 desc-regular-xxs">
          <span><b>Categoria: </b> {{ room?.displayName }}</span>
        </v-col>
      </v-row>

      <v-row no-gutters class="my-2">
        <v-col cols="12">
          <span class="primary--text text-medium-xs">
            Sobre o Condomínio
          </span>
        </v-col>
        <v-col cols="12" class="my-1 desc-regular-xxs">
          <span v-html="room?.property?.description1" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ReservationContent',
  data () {
    return {
      printDialog: false,
      room: JSON.parse(localStorage.getItem('room')) || {}
    }
  },
  methods: {
    openPrintDialog () {
      this.printDialog = true
    },
    closePrintDialog () {
      this.printDialog = false
    }
  }
}
</script>
<style lang="scss" scoped>
.modal-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
