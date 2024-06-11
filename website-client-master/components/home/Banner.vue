<template>
  <v-container fluid class="mb-4">
    <v-row justify="center">
      <v-col
        cols="12"
        lg="5"
        class="pa-lg-12 pl-lg-3"
        align-self="center"
        order="2"
        order-lg="1"
        :class="$vuetify.breakpoint.mdAndDown ? 'd-flex justify-center' : ''"
      >
        <v-card elevation="0" class="rounded-xxl" :max-width="!$vuetify.breakpoint.xsOnly ? '400px' : '100%'" height="100%">
          <v-card-title class="justify-center mb-6">
            <h1 class="card-title mt-12">
              Compra
            </h1>
          </v-card-title>
          <v-card-subtitle class="text-center mb-4 card-subtitle" style="font-size: 24px;">
            ou venda
          </v-card-subtitle>
          <v-card-text>
            <filters :buildings="buildings" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        lg="7"
        class="pa-0 py-lg-12"
        order="1"
        order-lg="2"
      >
        <v-img
          v-if="$vuetify.breakpoint.lgAndUp"
          :src="require(`~/static/banner.jpg`)"
          cover
          class="rounded-xxl"
          max-width="728px"
          height="100%"
        />
        <!--<v-img v-else :src="require(`~/static/banner.jpg`)" aspect-ratio :style="`height: ${height}px;`" />-->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { openApi as api360 } from '@/api'
import { images } from '@/shared/banner'
import Filters from '~/components/home/filters/Filters.vue'

export default {
  name: 'BannerComponent',
  components: {
    Filters
  },
  data () {
    return {
      images,
      buildings: [],
      isLoading: false
    }
  },
  computed: {
    height () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 128
        case 'sm': return 300
        case 'md': return 480
        default: return 128
      }
    }
  },
  beforeMount () {
    this.getBuildings()
  },
  methods: {
    getBuildings () {
      this.isLoading = true
      api360.get('/property-api/website').then(({ data }) => {
        this.buildings = data
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      }).finally(() => {
        this.isLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/mixins.scss';

.card-title {
    font-size: 64px;
}

.card-subtitle {
    font-size: 24px;
    letter-spacing: 5px;
    font-weight: lighter;
}

.banner-content {
  position: absolute !important;
  margin-top: 220px;
  z-index: 3 !important;
  width: 100%;
  @include thin-phones() {
    margin-top: 140px;
  }
  @include phone-only() {
    margin-top: 220px;
  }
  @include tablet-portrait-up() {
    margin-top: 200px;
  }
  @include desktop-up() {
    margin-top: 240px;
  }
  @include big-desktop-up() {
    margin-top: 300px;
  }
}
</style>
