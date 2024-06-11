<template>
  <div style="height: 100%;" class="px-0">
    <title-component title-normal="Apartamentos" />
    <v-row v-if="$vuetify.breakpoint.mdAndDown" class="mb-6">
      <v-col cols="12" md="6">
        <span role="button" class="desc-medium-xxs primary--text" @click="clearFilters">
          Limpar filtros
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" :class="$vuetify.breakpoint.smAndUp ? 'mt-n12' : 'mt-n8'">
        <v-autocomplete
          v-model="selectedBuildings"
          :items="buildings"
          item-text="name"
          item-value="id"
          prepend-inner-icon="fas fa-location"
          label="Localização"
          class="rounded-pill"
          multiple
          chips
        >
          <template #selection="{ item, index }">
            <v-chip v-if="index === 0">
              <span>{{ item.name }}</span>
            </v-chip>
            <span
              v-if="index === 1"
              class="grey--text text-caption"
            >
              (+{{ selectedBuildings.length - 1 }} outros)
            </span>
          </template>
          <template #no-data>
            <div class="px-4">
              <span>Localização não encontrada</span>
            </div>
          </template>
          <template #prepend-item>
            <v-list-item
              ripple
              @click="toggle"
            >
              <v-list-item-action>
                <v-icon :color="selectAll ? 'primary' : ''">
                  {{ selectAll ? 'fa-solid fa-square-check'
                    : 'fa-regular fa-square'
                  }}
                </v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Selecionar todos</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-2" />
          </template>
        </v-autocomplete>
      </v-col>
      <v-col cols="12" md="6" :class="$vuetify.breakpoint.smAndUp ? 'mt-n6' : 'mt-n8'">
        <v-menu
          ref="menu"
          v-model="menuStartDate"
          :close-on-content-click="true"
          transition="scale-transition"
          offset-y
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              :readonly="true"
              v-bind="attrs"
              label="Entrada"
              :value="formatDate(dates[0])"
              prepend-inner-icon="fas fa-calendar"
              v-on="on"
              @change="changeDates"
            />
          </template>
          <v-date-picker
            v-model="dates"
            no-title
            scrollable
            range
            :min="new Date().toISOString().substr(0, 10)"
            color="primary"
            @input="menuEndDate = true"
          >
            <v-spacer />
            <v-btn
              text
              color="primary"
              @click="resetDates"
            >
              Limpar
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="6" :class="$vuetify.breakpoint.smAndUp ? 'mt-n6' : 'mt-n8'">
        <v-menu
          ref="menu"
          v-model="menuEndDate"
          :close-on-content-click="true"
          transition="scale-transition"
          offset-y
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              :readonly="true"
              v-bind="attrs"
              label="Saída"
              :value="formatDate(dates[1])"
              prepend-inner-icon="fas fa-calendar"
              v-on="on"
              @change="changeDates"
            />
          </template>
          <v-date-picker
            v-model="dates"
            no-title
            scrollable
            range
            :min="new Date().toISOString().substr(0, 10)"
            color="primary"
          >
            <v-spacer />
            <v-btn
              text
              color="primary"
              @click="resetDates"
            >
              Limpar
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" :class="$vuetify.breakpoint.smAndUp ? 'mt-n6' : 'mt-n8'">
        <v-menu
          open-on-click
          :close-on-content-click="false"
          bottom
          nudge-bottom="50"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              prepend-inner-icon="fas fa-user"
              :placeholder="`${guest} ${ guest === 1 ? 'Pessoa' : 'Pessoas'}`"
              class="rounded-pill"
              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <div class="white py-4 px-8 rounded-xl">
            <v-row>
              <v-col cols="4" class="mt-2">
                <span class="text-regular-xxs black--text">Pessoas</span>
              </v-col>
              <v-col cols="8" align="right">
                <v-btn
                  width="30px"
                  height="30px"
                  class="mx-2 mt-n2"
                  fab
                  dark
                  small
                  :color="`${ guest === 1 ? '#f3d2db' : 'primary'}`"
                  @click="guest > 1 ? guest-- : guest = 1"
                >
                  <v-icon dark>
                    fas fa-minus
                  </v-icon>
                </v-btn>
                <span class="text-bold-xs black--text mx-2"> {{ guest }} </span>
                <v-btn
                  width="30px"
                  height="30px"
                  class="mx-2 mt-n2"
                  fab
                  dark
                  small
                  :color="`${ guest === 5 ? '#f3d2db' : 'primary'}`"
                  @click="guest > 4 ? guest = 5 : guest++"
                >
                  <v-icon dark>
                    fas fa-plus
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-menu>
      </v-col>
      <v-col cols="12" :class="$vuetify.breakpoint.smAndUp ? 'mt-n4' : 'mt-n6'">
        <div class="badges--info">
          <h3 class="mb-6 mb-md-0" :class="$vuetify.breakpoint.lgAndUp ? 'badges--info--title' : 'text-medium-xs'">
            Comodidades
          </h3>
          <span role="button" class="desc-medium-xxs primary--text" @click="toggleAllFeatures">
            {{ selectAllFeatures ? 'Desmarcar todos' : 'Marcar todos' }}
          </span>
        </div>
        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
          <filter-badge
            v-for="feat in allFeatures"
            :id="feat.id"
            :key="feat.id"
            :name="feat.friendlyName"
            :icon-name="feat.icon"
            :badge-selected="feat.selected"
            @selected="handleSelected"
          />
        </div>
      </v-col>
    </v-row>
    <v-row class="align-center">
      <v-col v-if="$vuetify.breakpoint.lgAndUp" cols="12" md="6" class="d-flex justify-center">
        <span role="button" class="desc-medium-xxs primary--text" @click="clearFilters">
          Limpar filtros
        </span>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn
          elevation="0"
          color="secondary"
          class="rounded-pill black--text text-capitalize"
          block
          :loading="isLoading"
          @click="filterRooms"
        >
          Filtrar
        </v-btn>
      </v-col>
    </v-row>
    <date-filter-warning-dialog ref="dateFilterWarningDialog" :start-date="dates[0]" :modal="false" @search-dates="searchDate" @cancel="cancelReservation" />
  </div>
</template>
<script>
import { isAfter, parseISO } from 'date-fns'
import FilterBadge from './FilterBadge.vue'
import TitleComponent from '@/components/shared/Title.vue'
import { openApi as api360 } from '@/api'
import { formatDate } from '@/shared/banner'
import { useReservationStore } from '@/store'
import { addOneDayToDate, calculateDateDifference } from '@/shared/utils/date'
import DateFilterWarningDialog from '@/components/properties/dates/DateFilterWarning.vue'

export default {
  name: 'FiltersComponent',
  components: {
    TitleComponent,
    FilterBadge,
    DateFilterWarningDialog
  },
  props: {
    startSearchRooms: {
      type: Function,
      default: () => []
    },
    selectedPropertyIds: {
      type: Array,
      default: () => []
    },
    filters: {
      type: Object,
      default: () => {},
      required: true
    },
    buildings: {
      type: Array,
      default: () => [],
      required: true
    },
    clearFilter: {
      type: Function,
      default: () => []
    }
  },
  setup () {
    const { setSelectedDates } = useReservationStore()
    return {
      setSelectedDates
    }
  },
  data () {
    return {
      selectedFeatures: this.filters.featureIds || [],
      selectedBuildings: [...this.selectedPropertyIds],
      dates: this.filters.dates ? [...this.filters.dates] : [],
      features: [],
      location: this.filters.location || null,
      allFeatures: [],
      selectAllFeatures: false,
      suites: 1,
      guest: this.filters.maxPeople || 1,
      menuStartDate: false,
      menuEndDate: false,
      formatDate,
      isLoading: false,
      selectAll: false,
      allBuildings: []
    }
  },
  watch: {
    dates () {
      const [start, end] = this.dates
      if (start && end) {
        if (isAfter(parseISO(start), parseISO(end))) {
          this.dates = [end, start]
        }

        if (start === end) {
          const endNextDay = addOneDayToDate(end)
          this.dates = [start, endNextDay]
        }
      }

      if (this.dates.length) {
        this.setSelectedDates(this.dates)
        localStorage.setItem('dates', JSON.stringify(this.dates))
      } else {
        this.setSelectedDates([])
        localStorage.setItem('dates', [])
      }

      const diffInDays = calculateDateDifference(start, end)
      if (diffInDays > 90) {
        this.openDateFilterWarning()
      }
    }
  },
  beforeMount () {
    this.getFeatures()
    this.getAllBuildings()
  },
  methods: {
    cancelReservation () {
      this.resetDates()
      this.$refs.dateFilterWarningDialog.closeDateFilterWarning()
    },
    searchDate (checkoutDate) {
      this.dates = [this.dates[0], checkoutDate]
      this.filterRooms()
      this.$refs.dateFilterWarningDialog.closeDateFilterWarning()
    },
    getFeatures () {
      this.isLoading = true
      Promise.all([
        api360.get('/features-api/list-by-highlight'), api360.get('/features-api/list-by-filter')
      ]).then(([{ data: featuresHighlighted }, { data: featuresFilter }]) => {
        function clearDuplicateObjects (array) {
          return array.filter((item, index) => {
            return array.findIndex((item2) => {
              return item.id === item2.id
            }) === index
          })
        }
        const filterClearDuplicateObjects = [clearDuplicateObjects]
        const all = [...featuresHighlighted, ...featuresFilter]
        const diff = filterClearDuplicateObjects[0](all)

        this.features = diff.sort((a, b) => {
          return a.friendlyName.localeCompare(b.friendlyName)
        })
        this.allFeatures = diff
          .map((feat) => {
            return {
              ...feat,
              selected: false
            }
          }).sort((a, b) => {
            return a.friendlyName.localeCompare(b.friendlyName)
          })
        this.setAllFeaturesInitalState()
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      }).finally(() => {
        this.isLoading = false
      })
    },
    getAllBuildings () {
      this.isLoading = true
      api360.get('/property-api/website').then(({ data }) => {
        this.allBuildings = data
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      }).finally(() => {
        this.isLoading = false
      })
    },
    changeDates (dates) {
      if (!dates) {
        this.dates = []
      }
    },
    toggle () {
      this.selectAll = !this.selectAll
      if (this.selectAll) {
        this.selectedBuildings = this.buildings.map((building) => {
          return building.id
        })
      } else {
        this.selectedBuildings = []
      }
    },
    filterRooms () {
      this.startSearchRooms(this.guest, this.dates, this.selectedBuildings, this.selectedFeatures, this.location)
    },
    resetDates () {
      this.dates = []
      this.menuRangeDates = false
    },
    setAllFeaturesState (state) {
      this.allFeatures = this.allFeatures.map((feat) => {
        feat.selected = state
        return feat
      })
    },
    setAllFeaturesInitalState () {
      this.allFeatures = this.allFeatures.map((feat) => {
        feat.selected = this.filters.featureIds.includes(feat.id)
        return feat
      })
    },
    toggleAllFeatures () {
      if (this.selectAllFeatures) {
        this.setAllFeaturesState(false)
        this.selectedFeatures = []
      } else {
        this.setAllFeaturesState(true)
        this.selectedFeatures = this.allFeatures.map(feat => feat.id)
      }
      this.selectAllFeatures = !this.selectAllFeatures
    },
    handleSelected (selectedBadge) {
      const badgeIndex = this.allFeatures.findIndex(badge => badge.id === selectedBadge.id)
      this.allFeatures[badgeIndex].selected = selectedBadge.selected
      this.selectedFeatures = this.allFeatures.filter(item => item.selected).map(feat => feat.id)
      if (this.selectAllFeatures && this.selectedFeatures.length === 0) {
        this.selectAllFeatures = false
      } else if (!this.selectAllFeatures && this.selectedFeatures.length === this.allFeatures.length) {
        this.selectAllFeatures = true
      }
    },
    clearFilters () {
      this.clearFilter()
      this.selectedBuildings = this.allBuildings.map((building) => {
        return building.id
      })
      this.dates = []
      this.selectAllFeatures = false
      this.suites = 1
      this.guest = 1
      this.setAllFeaturesState(false)
      this.selectedFeatures = []
      this.filterRooms()
    },
    openDateFilterWarning () {
      this.$refs.dateFilterWarningDialog.openDateFilterWarning(true)
    }
  }

}
</script>
<style lang="scss" scoped>
@import '~/assets/mixins.scss';

.badges--info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 16px;
  @include desktop-up () {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  &--title {
    font-size: 18px;
    line-height: 18px;
    font-weight: 400;
  }
}
</style>
