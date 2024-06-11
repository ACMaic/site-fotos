<template>
  <div>
    <div v-if="featuresDialog" :class="secondModal ? 'blur-second-modal' : 'blur'" />
    <v-dialog
      v-model="featuresDialog"
      max-width="750"
      hide-overlay
      persistent
      style="z-index: 200"
    >
      <v-card class="py-2">
        <v-card-title class=" primary--text">
          <v-row no-gutters class="pt-4">
            <v-col cols="12" align="right">
              <v-btn icon color="primary" @click="closeFeaturesDialog">
                <v-icon>fas fa-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="black--text pb-6" :class="$vuetify.breakpoint.smAndUp ? 'text-regular-xl' : 'text-regular-xxs'">
          Comodidades | Apartamento <span class="primary--text"> {{ roomName }}</span>
        </v-card-text>
        <v-row v-for="category in Object.keys(features)" :key="category" class="mx-5">
          <v-col cols="12">
            <span class="text-bold-xxs">{{ category || 'Outros' }}</span>
          </v-col>
          <v-col v-for="feat in features[category]" :key="feat.id" cols="12">
            <div>
              <div style="width: 18px;" class="d-inline-block mx-auto">
                <v-icon size="16" class="lightBlack--text">
                  {{ feat?.icon || 'fas fa-question' }}
                </v-icon>
              </div>
              <span class="mx-4 text-regular-xxxs">{{ feat?.friendlyName || '-' }}</span>
            </div>
            <v-divider :key="`d${feat.id}`" class="my-2" />
          </v-col>
        </v-row>
        <v-card-actions>
          <v-row class="mt-4">
            <v-col cols="12" align="right">
              <v-btn
                medium
                text
                class="rounded-lg"
                color="primary"
                @click="closeFeaturesDialog"
              >
                Fechar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>

import { openApi as api360 } from '@/api'

export default {
  name: 'FeaturesDialog',
  props: {
    roomName: {
      type: String,
      default: ''
    },
    roomId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      features: [],
      featuresDialog: false,
      secondModal: false
    }
  },
  methods: {
    openFeaturesDialog (isSecond) {
      this.featuresDialog = true
      this.secondModal = isSecond
      api360
        .get(`/room-api/features-by-category/${this.roomId}`)
        .then(({ data }) => {
          const featuresGroupedByCategory = data.reduce((acc, feature) => {
            const { cat } = feature
            acc[cat] = acc[cat] || []
            acc[cat].push(...feature.features)
            return acc
          }, {})
          const sorted = Object.keys(featuresGroupedByCategory).reduce((acc, key) => {
            acc[key] = featuresGroupedByCategory[key].sort((a, b) => a.friendlyName.localeCompare(b.friendlyName))
            return acc
          }, {})

          this.features = sorted
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    closeFeaturesDialog () {
      this.featuresDialog = false
    }
  }
}
</script>
