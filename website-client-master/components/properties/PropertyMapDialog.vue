<template>
  <div>
    <div v-if="dialogMap" class="blur" />
    <v-dialog
      v-model="dialogMap"
      max-width="850"
      hide-overlay
      persistent
      :fullscreen="$vuetify.breakpoint.xs"
    >
      <v-card>
        <v-row no-gutters>
          <v-col cols="10">
            <dialog-title-component
              :property-name="propertyName"
              type="map"
            />
          </v-col>

          <v-col cols="2" class="ma-0 pa-0" align="right">
            <v-btn
              v-if="$vuetify.breakpoint.smAndDown"
              rounded
              icon
              width="40px"
              height="40px"
              class="btn-close mb-4"
              @click="closeMapDialog"
            >
              x
            </v-btn>
          </v-col>
        </v-row>
        <iframe
          width="100%"
          :height="$vuetify.breakpoint.xs ? '800' : '500'"
          style="border:0"
          loading="lazy"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          :src="`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_KEY}&q=${formatPropertyName(propertyName)}`"
        />
        <v-card-actions v-if="$vuetify.breakpoint.mdAndUp">
          <v-row no-gutters>
            <v-col cols="12" align="right">
              <v-btn
                medium
                text
                class="rounded-lg"
                color="primary"
                @click="closeMapDialog"
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
import { GOOGLE_MAPS_KEY, formatPropertyName } from '@/shared/maps'
import DialogTitleComponent from '@/components/shared/DialogTitle.vue'
export default {
  name: 'PropertyMapDialog',
  components: {
    DialogTitleComponent
  },
  props: {
    propertyName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogMap: false,
      GOOGLE_MAPS_KEY,
      formatPropertyName
    }
  },
  methods: {
    openMapDialog () {
      this.dialogMap = true
    },
    closeMapDialog () {
      this.dialogMap = false
    }
  }
}
</script>

<style scoped lang="scss">
.btn-close {
  background-color: #c31c4a !important;
  color: #fff !important;
}
</style>
