<template>
  <v-container fluid>
    <h2 class="font-weight-medium my-6" :class="$vuetify.breakpoint.xs ? 'text-regular-xs': 'text-medium-md'">
      Depoimentos
    </h2>
    <custom-v-slide-group
      v-if="$vuetify.breakpoint.mdAndUp"
      multiple
      hide-arrows
      show-arrows="desktop"
    >
      <v-row v-if="isLoading">
        <v-col
          v-for="item in 4"
          :key="item"
          cols="3"
        >
          <v-skeleton-loader
            col
            type="card"
            :tile="false"
            :multiple="true"
          />
        </v-col>
      </v-row>
      <v-slide-item
        v-for="(item,i) in items"
        :key="i"
        class="mr-8"
        show-arrows="never"
      >
        <v-card
          class="border-360"
          width="420"
          height="300"
          elevation="0"
        >
          <v-row
            no-gutters
            class="mx-6 testimonial-card-desktop"
          >
            <v-col cols="12">
              <span
                class="text-justify text-center black--text text-regular-rating"
              >
                {{ item.testimony }}
              </span>
            </v-col>
            <v-col cols="12" align="center" class="mt-3">
              <span
                class="text-justify text-center black--text text-medium-xxs"
              >
                {{ formatName(item.author) }}
              </span>
            </v-col>
          </v-row>
        </v-card>
      </v-slide-item>
    </custom-v-slide-group>
    <custom-v-slide-group
      v-else
      multiple
      hide-arrows
      show-arrows="desktop"
      class="rounded-l-xxl"
    >
      <v-slide-item
        v-for="(item, i) in items"
        :key="i"
      >
        <div>
          <v-card width="300" height="100%" elevation="0" class="rounded-xxl mr-4">
            <v-card-text>
              <p
                class="text-justify text-center black--text text-regular-rating pt-3"
              >
                {{ item.testimony }}
              </p>
            </v-card-text>
            <v-card-title class="justify-center">
              <span
                class="text-justify text-center black--text text-medium-xxs"
              >
                {{ formatName(item.author) }}
              </span>
            </v-card-title>
          </v-card>
        </div>
      </v-slide-item>
    </custom-v-slide-group>
  </v-container>
</template>

<script>
import CustomVSlideGroup from '@/components/shared/CustomVSlideGroup'
import { openApi as api360 } from '@/api'

export default {
  name: 'TestimonialsComponent',
  components: {
    CustomVSlideGroup
  },
  data () {
    return {
      items: [],
      carousel: 0,
      isLoading: false,
      colors: [
        'indigo',
        'warning',
        'pink darken-2',
        'red lighten-1',
        'deep-purple accent-4'
      ],
      slides: [
        'First',
        'Second',
        'Third',
        'Fourth',
        'Fifth'
      ]
    }
  },
  beforeMount () {
    this.getTestimonials()
  },
  methods: {
    getTestimonials () {
      this.isLoading = true
      api360.get('/client-testimony-api/list-testimonials').then(({ data }) => {
        this.items = data
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      }).finally(() => {
        this.isLoading = false
      })
    },
    formatName (name) {
      return name.substring(0, 30).trim()
    }
  }
}
</script>
<style lang="scss" scoped>
.testimonial-card-desktop {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
}
</style>
