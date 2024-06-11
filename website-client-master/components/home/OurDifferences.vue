<template>
  <v-container fluid class="mb-4">
    <h2 class="font-weight-medium my-6" :class="$vuetify.breakpoint.xs ? 'text-regular-xs': 'text-medium-md'">
      Nossos Diferenciais
    </h2>
    <v-row v-if="$vuetify.breakpoint.mdAndUp">
      <v-col>
        <v-card class="rounded-xxl pa-12" elevation="0">
          <v-row>
            <v-col
              v-for="(diff, index) in differences"
              :key="index"
              cols="12"
              md="6"
            >
              <v-row>
                <v-col class="text-center">
                  <h3>{{ diff.title }}</h3>
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <p class="grey--text" v-html="diff.desc" />
                </v-col>
                <v-col>
                  <v-img :src="diff.src" width="176px" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <custom-v-slide-group
      v-else
      multiple
      hide-arrows
      show-arrows="desktop"
      class="white rounded-l-xxl"
    >
      <v-slide-item
        v-for="(diff, index) in differences"
        :key="index"
        class="py-4"
      >
        <div>
          <v-card
            flat
            class="mx-4 rounded-xl rounded-bs-0 d-flex flex-column"
            height="100%"
            :width="$vuetify.breakpoint.lg ? 300 : $vuetify.breakpoint.lgAndUp ? 330 : 238"
          >
            <v-row class="d-flex fill-height align-center justify-center">
              <v-col>
                <v-img :src="diff.src" width="176px" class="mx-auto" />
              </v-col>
            </v-row>

            <div
              class="mx-auto pt-3 text-center text-black text-medium-xxs"
            >
              <h3>{{ diff.title }}</h3>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <p class="grey--text font-weight-regular" v-html="diff.desc" />
            </div>
          </v-card>
        </div>
      </v-slide-item>
    </custom-v-slide-group>
  </v-container>
</template>
<script>
import CustomVSlideGroup from '@/components/shared/CustomVSlideGroup'
import { differences } from '@/shared/differences'

export default {
  name: 'OurDifferencesComponent',
  components: {
    CustomVSlideGroup
  },
  data () {
    return {
      differences
    }
  }
}
</script>
