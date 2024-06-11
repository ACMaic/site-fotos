<template>
  <v-container fluid>
    <h2 class="font-weight-medium my-6" :class="$vuetify.breakpoint.xs ? 'text-regular-xs': 'text-medium-md'">
      Apartamentos em Destaque
    </h2>
    <custom-v-slide-group
      multiple
      hide-arrows
      show-arrows="desktop"
      class="d-flex flex-row "
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
      <div v-for="room in roomsList" :key="room.id">
        <suite-card
          :room="room"
          :features="room?.features || []"
          :is-property="false"
          :highlighted-features="highlightedFeatures"
          :button-properties="{
            color: 'primary',
            text: 'Reservar',
            colorText: 'white--text',
          }"
          :button-function="(event) => $refs.suiteDetailsDialog.openSuiteDetailsDialog(event, room, highlightedFeatures)"
        />
      </div>
    </custom-v-slide-group>
    <suite-details-dialog
      ref="suiteDetailsDialog"
    />
  </v-container>
</template>
<script>
import { openApi as api360 } from '@/api'
import CustomVSlideGroup from '@/components/shared/CustomVSlideGroup'
import SuiteCard from '@/components/shared/SuiteCard'
import SuiteDetailsDialog from '@/components/properties/SuiteDetails.vue'

export default {
  name: 'HighlightedComponent',
  components: {
    CustomVSlideGroup,
    SuiteCard,
    SuiteDetailsDialog
  },
  data: () => ({
    roomsList: [],
    isLoading: false,
    highlightedFeatures: []
  }),
  beforeMount () {
    this.getData()
  },
  methods: {
    getData () {
      this.isLoading = true
      Promise.all([
        api360.get('/featured-room-api'),
        api360.get('/features-api/list-by-highlight')
      ]).then(([{ data: rooms }, { data: features }]) => {
        this.roomsList = rooms.map((obj) => {
          return {
            id: obj.id,
            ...obj
          }
        })
        this.highlightedFeatures = features
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
