<template>
  <v-container class="ma-0 pa-0 mb-4 mx-auto">
    <v-row>
      <v-col class="text-center" :style="$vuetify.breakpoint.mdAndUp && 'height: calc(100vh - 267px);'">
        <v-img :src="require(`~/static/done.png`)" contain height="300" width="240" class="mx-auto" />
        <p class="text-medium-xs font-weight-bold">
          Checkout realizado com sucesso.
        </p>
        <p class="text-regular-xxxs">
          Muito obrigado!
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'DoneBookingRatePage',
  data () {
    return {

    }
  },
  beforeMount () {

  }

}
</script>

<style lang="scss" scoped>
</style>
