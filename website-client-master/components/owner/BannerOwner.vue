<template>
  <v-container fluid class="ma-0 pa-0" style="margin-top: -150px !important">
    <div
      class="banner-content-owner"
      :style="$vuetify.breakpoint.lgAndUp ? 'padding-left: 6% !important' : ''"
    >
      <h1
        :class="
          $vuetify.breakpoint.lgAndUp ? 'title-medium-banner' : $vuetify.breakpoint.sm ? 'title-medium-lg text-left': 'title-medium-xs text-left'
        "
        class="secondary--text text-medium-xl pt-10"
      >
        Rentabilize  <span class="black--text">o seu imóvel </span>
      </h1> <br>
      <p class="d-flex">
        <v-icon class="secondary--text mr-5">
          fas fa-dollar-sign
        </v-icon> Aumente a rentabilidade do seu apartamento até 37% acima dos valores de aluguel tradicionais
      </p>
      <p class="d-flex">
        <v-icon class="secondary--text mr-3">
          fa-solid fa-suitcase
        </v-icon> Sem burocracia de imobiliárias
      </p>
      <p class="d-flex">
        <v-icon class="secondary--text mr-3">
          fa-solid fa-binoculars
        </v-icon> Maior visibilidade para os interessados em potencial
      </p>
      <p class="d-flex">
        <v-icon class=" secondary--text mr-3">
          fa-solid fa-chart-line
        </v-icon> Acompanhe em tempo real a performance do seu ativo imobiliário
      </p>

      <div class="anchor-bottom">
        <v-btn
          class="py-4 d-none d-md-block"
          fab
          dark
          medium
          color="#888888"
          href="#ourservices"
        >
          <v-icon>
            fa-solid fa-chevron-down
          </v-icon>
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>

export default {
  name: 'BannerOwner'
}
</script>

<style lang="scss" scoped>
@import '~/assets/mixins.scss';
  .banner-content-owner {
    position: relative;
    background-image: url(https://assets.360suites.com.br/website/investidor-banner.webp);
    overflow: hidden;
    padding: 0 24px;
    padding-top: 220px;
    z-index: 3 !important;
    width: 100%;
    height: calc(100vh + 150px );
    width: 100%;
    background-size: cover;
    object-fit: contain;
    background-position: center;
    background-repeat: no-repeat !important;
    @include thin-phones() {
      height: calc(100vh + 150px ) !important;
    }
    @include phone-only() {
      padding-top: 220px !important;
      height: calc(100vh + 80px ) !important;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(246, 246, 246, 0.8);
        z-index: -1;
      }
    }
    @include tablet-portrait-up() {
      padding-top: 200px;
    }
    @include desktop-up() {
      padding-top: 240px;
    }
    @include big-desktop-up() {
      padding-top: 300px;
    }
  }

  .anchor-bottom{
    display: flex;
    justify-content: center;
    margin-top: 35vh;
  }

</style>
