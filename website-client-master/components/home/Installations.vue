<template>
  <v-container fluid>
    <title-component title-normal="Comodidades e" title-bold="Instalações" subtitle="Conte com o conforto dos nossos apartamentos mobiliadas e dos nossos condomínios completos." />
    <p
      class="ml-5"
      :class="
        $vuetify.breakpoint.lgAndUp ? 'pt-5 text-medium-xl' : 'pt-10 text-regular-xs'
      "
    >
      Apartamentos
    </p>
    <custom-v-slide-group
      multiple
      hide-arrows
      show-arrows="desktop"
    >
      <v-slide-item
        v-for="(suite, index) in suites"
        :key="index"
        class="mr-3"
      >
        <v-card
          flat
          class="ma-4 rounded-xl rounded-bs-0 d-flex flex-column"
          :height="$vuetify.breakpoint.lg ? 220 : $vuetify.breakpoint.lgAndUp ? 240 : 180"
          :width="$vuetify.breakpoint.lg ? 300 : $vuetify.breakpoint.lgAndUp ? 330 : 238"
          :style="`background-image:linear-gradient(rgba(0,0,0,0.30),rgba(0,0,0,0.70)), url(${suite.src}); background-size: cover;`"
        >
          <v-row class="d-flex fill-height align-center justify-center">
            <v-col class="text-center">
              <p
                class="mx-auto white--text text-center"
                :class="$vuetify.breakpoint.lgAndUp ? 'text-medium-xs' : 'text-regular-xs font-weight-regular'"
                :style="$vuetify.breakpoint.lgAndUp ? 'max-width: 220px' : 'max-width: 180px'"
              >
                {{ suite.title }}
              </p>
            </v-col>
          </v-row>
        </v-card>
      </v-slide-item>
    </custom-v-slide-group>

    <p
      class="ml-5"
      :class="
        $vuetify.breakpoint.lgAndUp ? 'pt-8 text-medium-xl' : 'pt-6 ml-5 text-regular-xs'
      "
    >
      Condomínios
    </p>

    <custom-v-slide-group
      multiple
      hide-arrows
      show-arrows="desktop"
    >
      <v-slide-item
        v-for="(building, index) in buildings"
        :key="index"
        class="mr-3"
      >
        <v-card
          flat
          class="ma-4 rounded-xl rounded-bs-0 d-flex flex-column"
          :height="$vuetify.breakpoint.lg ? 220 : $vuetify.breakpoint.lgAndUp ? 240 : 180"
          :width="$vuetify.breakpoint.lg ? 300 : $vuetify.breakpoint.lgAndUp ? 330 : 238"
          :style="`background-image:linear-gradient(rgba(0,0,0,0.30),rgba(0,0,0,0.70)), url(${building.src}); background-size: cover;`"
        >
          <v-row class="d-flex fill-height align-center justify-center">
            <v-col class="text-center">
              <p
                class="mx-auto white--text text-center font-weight-regular"
                :class="$vuetify.breakpoint.lgAndUp ? 'text-medium-xs' : 'text-regular-xs font-weight-regular'"
                :style="$vuetify.breakpoint.lgAndUp ? 'max-width: 170px' : 'max-width: 120px'"
              >
                {{ building.title }}
              </p>
            </v-col>
          </v-row>
        </v-card>
      </v-slide-item>
    </custom-v-slide-group>
  </v-container>
</template>
<script>
import { suites, buildings } from '@/shared/installations'
import TitleComponent from '@/components/shared/Title.vue'
import CustomVSlideGroup from '@/components/shared/CustomVSlideGroup'

export default {
  name: 'InstallationsComponent',
  components: {
    TitleComponent,
    CustomVSlideGroup
  },
  data () {
    return {
      model: null,
      sliderSuites: null,
      sliderBuildings: null,
      suites,
      buildings
    }
  }
}
</script>
