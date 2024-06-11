<template>
  <v-container fluid height="100%" class="container-360">
    <v-row>
      <v-col>
        <property-header :buildings="buildings" :selected-property-ids="selectedPropertyIds" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4" lg="3">
        <filters-component
          :start-search-rooms="startSearchRooms"
          :selected-property-ids="selectedPropertyIds"
          :filters="filters"
          :buildings="buildings"
          :is-loading-filter="isLoading"
          :clear-filter="clearFilter"
        />
      </v-col>
      <v-col
        v-if="
          !isLoading"
      >
        <template v-if="rooms && rooms.length > 0">
          <v-row>
            <v-col
              v-for="room in rooms"
              :key="room.id"
              cols="12"
              sm="6"
              lg="4"
            >
              <suite-card
                v-if="!isLoading"
                :room="room"
                :features="room.features || []"
                :highlighted-features="highlightedFeatures"
                :button-properties="filters.dates.length > 1 ? { color: 'primary',
                                                                 text: 'Reservar',
                                                                 colorText: 'white--text'} : { color: 'secondary',
                                                                                               text: 'Selecione a data',
                                                                                               colorText: 'black--text'}"
                :button-function="(event) => $refs.suiteDetailsDialog.openSuiteDetailsDialog(event, room, highlightedFeatures)"
                class="mx-auto"
              />
            </v-col>
          </v-row>
          <v-row v-if="pagination.total > 12" justify="center">
            <v-col>
              <v-pagination
                v-model="pagination.page"
                :length="Math.ceil(pagination.total / pagination.pageSize)"
                total-visible="7"
                circle
                @input="startSearchRooms(filters.maxPeople, filters.dates, selectedPropertyIds, features, location, false)"
              />
            </v-col>
          </v-row>
        </template>
        <template v-else>
          <v-row v-if="!isLoading" justify="center">
            <v-col>
              <h2 class="text-center ma-4">
                Nenhum quarto encontrado...
              </h2>
            </v-col>
          </v-row>
        </template>
      </v-col>
      <v-col v-else>
        <v-row>
          <v-col
            v-for="item in 6"
            :key="item"
            cols="12"
            sm="6"
            :md="$vuetify.breakpoint.width > 960 && $vuetify.breakpoint.width < 1060 ? '12' : '6'"
            :lg="$vuetify.breakpoint.width > 1200 && $vuetify.breakpoint.width < 1530 ? '6' : '4'"
            xl="4"
          >
            <v-skeleton-loader
              col
              type="card, card, card"
              :tile="false"
              :multiple="true"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <suite-details-dialog
      ref="suiteDetailsDialog"
    />
  </v-container>
</template>

<script>
import { ref } from 'vue'
import PropertyHeader from '@/components/properties/PropertyHeader.vue'
import FiltersComponent from '@/components/properties/Filters.vue'
import SuiteCard from '@/components/shared/SuiteCard.vue'
import { useFilters } from '@/shared/composables'
import { openApi as api360 } from '@/api'
import SuiteDetailsDialog from '@/components/properties/SuiteDetails.vue'

export default {
  name: 'PropertyPage',
  components: {
    PropertyHeader,
    FiltersComponent,
    SuiteDetailsDialog,
    SuiteCard
  },
  setup () {
    const { startSearchRooms, isLoading, pagination, rooms, getProperties, selectedPropertyIds, filters, features, location, clearFilter } = useFilters()
    const buildings = ref([])

    return {
      features,
      getProperties,
      filters,
      selectedPropertyIds,
      startSearchRooms,
      location,
      rooms,
      pagination,
      buildings,
      isLoading,
      clearFilter
    }
  },
  data: () => ({
    highlightedFeatures: [],
    isLoadingFeatures: false
  }),
  created () {
    if (this.$route.query?.propertyId) {
      this.selectedPropertyIds = [Number(this.$route.query.propertyId)]
    }
    this.isLoadingFeatures = true
    Promise.all(
      [
        this.getBuildings(),
        this.getFeatures()
      ]
    ).then(([resBuildings, resFeatures]) => {
      this.buildings = resBuildings.data
      this.highlightedFeatures = resFeatures.data
      this.startSearchRooms(this.filters.maxPeople, this.filters.dates, this.selectedPropertyIds, this.filters.featureIds, this.filters.location)
    }).finally(() => {
      this.isLoadingFeatures = false
    })
  },
  beforeMount () {
    localStorage.setItem('guest', 1)
    localStorage.setItem('hasParking', null)
    localStorage.setItem('dates', [])
  },
  methods: {
    getBuildings () {
      return api360.get('/property-api/website')
    },
    getFeatures () {
      return api360.get('/features-api/list-by-highlight')
    }
  }
}
</script>
