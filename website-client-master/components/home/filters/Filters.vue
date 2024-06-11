<template>
  <v-row>
    <v-col cols="12" class="d-flex justify-center">
      <v-btn-toggle
        v-model="toggleSearch"
        mandatory
        active-class="secondary"
        borderless
        class="rounded-lg"
        @change="clearToggle"
      >
        <v-btn value="PLACES" class="text-capitalize font-weight-regular" height="40px" small style="letter-spacing: 0;">
          Buscar por localização
        </v-btn>
        <v-btn value="BUILDINGS" class="text-capitalize font-weight-regular" height="40px" small style="letter-spacing: 0;">
          Selecionar edifício
        </v-btn>
      </v-btn-toggle>
    </v-col>
    <v-col cols="12" style="margin: 0 !important">
      <vuetify-google-autocomplete
        v-if="toggleSearch == 'PLACES'"
        id="map"
        ref="address"
        v-model="address"
        flat
        height="36px"
        class="mt-n3"
        country="br"
        placeholder="Quer ficar perto de onde?"
        @placechanged="getAddressData"
      >
        <template #prepend-inner>
          <v-icon class="mr-1 pb-2">
            fas fa-map-marker-alt
          </v-icon>
        </template>
      </vuetify-google-autocomplete>
      <v-autocomplete
        v-if="toggleSearch == 'BUILDINGS'"
        v-model="selectedBuildings"
        :items="buildings"
        item-text="name"
        item-value="id"
        prepend-inner-icon="fas fa-building"
        placeholder="Selecione"
        class="rounded-pill"
        multiple
        chips
        height="36px"
        flat
        dense
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
        </template>
      </v-autocomplete>
    </v-col>
    <v-col
      cols="12"
      class="mt-n6"
    >
      <v-menu
        ref="menu"
        v-model="menuRangeDates"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        content-class="elevation-0"
      >
        <template #activator="{ on, attrs }">
          <div class="rounded-pill py-4 px-3" style="background-color: #FFF; height: 36px; width: 100%; color: #9e9e9e; b" v-bind="attrs" v-on="on">
            <v-row>
              <v-col style="border-bottom: 1px solid grey;">
                <v-row>
                  <v-col cols="2" class="thin-display-icon pl-0">
                    <v-icon class="mt-n1" color="grey darken-1" size="24">
                      fas fa-calendar
                    </v-icon>
                  </v-col>
                  <v-col cols="10" class="pl-0">
                    <span class="desc-regular-xxs">
                      {{ dates[0] ? formatDate(dates[0]) : 'Entrada' }}
                    </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col style="border-bottom: 1px solid grey;">
                <v-row>
                  <v-col cols="2" class="thin-display-icon pl-0">
                    <v-icon class="mt-n1" color="grey darken-1" size="24">
                      fas fa-calendar
                    </v-icon>
                  </v-col>
                  <v-col cols="10" class="pl-0">
                    <span class="desc-regular-xxs">{{ dates[1] ? formatDate(dates[1]) : 'Saída' }}</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </template>
        <v-date-picker
          v-model="dates"
          no-title
          scrollable
          range
          :min="new Date().toISOString().substr(0, 10)"
          color="primary"
          style="border 1px solid grey"
          @input="dates[0] && dates[1] ? menuRangeDates = false : ''"
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
    <v-col cols="6" class="pr-0">
      <v-menu
        open-on-click
        :close-on-content-click="false"
        bottom
        nudge-bottom="50"
        content-class="elevation-0"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            prepend-inner-icon="fas fa-user"
            :placeholder="`${guest} ${ guest === 1 ? 'Pessoa' : 'Pessoas'}`"
            class="rounded-pill"
            readonly
            flat
            height="36px"
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
    <v-col cols="6" class="pl-0">
      <v-menu
        v-model="menu"
        open-on-click
        :close-on-content-click="false"
        bottom
        nudge-bottom="50"
        content-class="elevation-0"
        max-width="500"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            prepend-inner-icon="fa-solid fa-sliders"
            :placeholder="appliedFeatures ? `${appliedFeatures} Selecionados` : 'Mais filtros'"
            class="rounded-pill"
            readonly
            flat
            height="36px"
            v-bind="attrs"
            v-on="on"
          />
        </template>
        <div class="white py-4 px-8 rounded-xl">
          <v-row>
            <v-col cols="12" :class="$vuetify.breakpoint.smAndUp ? 'mt-n4' : 'mt-n6'">
              <v-icon color="primary" class="close-btn" @click="menu = false">
                fa-solid fa-close
              </v-icon>
              <div class="badges--info">
                <h3 class="my-6 mb-md-0" :class="$vuetify.breakpoint.lgAndUp ? 'badges--info--title' : 'text-medium-xs'">
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
        </div>
      </v-menu>
    </v-col>
    <v-col cols="12">
      <v-btn
        class="rounded-lg button-text text-capitalize px-12 font-weight-regular black--text"
        color="secondary"
        height="54px"
        block
        :loading="isLoading"
        elevation="0"
        @click="search"
      >
        Pesquisar
      </v-btn>
    </v-col>
    <date-filter-warning-dialog ref="dateFilterWarningDialog" :start-date="dates[0]" :modal="false" @search-dates="searchDate" @cancel="cancelReservation" />
  </v-row>
</template>
<script>
import { isAfter, parseISO } from 'date-fns'
import FilterBadge from '../../properties/FilterBadge.vue'
import { formatDate } from '@/shared/banner'
import { useFilters } from '@/shared/composables'
import { useReservationStore } from '@/store'
import { openApi as api360 } from '@/api'
import { addOneDayToDate, calculateDateDifference } from '@/shared/utils/date'
import DateFilterWarningDialog from '@/components/properties/dates/DateFilterWarning.vue'

export default {
  name: 'FiltersComponent',
  components: {
    FilterBadge,
    DateFilterWarningDialog
  },
  props: {
    buildings: {
      type: Array,
      required: true
    }
  },
  setup () {
    const { startSearchProperties, isLoading } = useFilters()
    const { setSelectedDates } = useReservationStore()
    return {
      startSearchProperties,
      setSelectedDates,
      isLoading
    }
  },
  data () {
    return {
      menu: false,
      toggleSearch: 'PLACES',
      formatDate,
      selectedBuildings: [],
      menuRangeDates: false,
      suites: 1,
      guest: 1,
      dates: [],
      selectAll: false,
      selectedFeatures: [],
      features: [],
      allFeatures: [],
      selectAllFeatures: false,
      address: '',
      addressData: null
    }
  },
  computed: {
    appliedFeatures () {
      return this.selectedFeatures.length
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
    },
    selectedBuildings () {
      if (this.selectedBuildings.length === 0) {
        this.selectAll = false
      }
      if (this.selectedBuildings.length === this.buildings.length) {
        this.selectAll = true
      }
    }
  },
  beforeMount  () {
    this.getFeatures()
  },
  methods: {
    cancelReservation () {
      this.resetDates()
      this.$refs.dateFilterWarningDialog.closeDateFilterWarning()
    },
    searchDate (checkoutDate) {
      this.dates[1] = checkoutDate
      this.search()
    },
    resetDates () {
      this.dates = []
      this.menuRangeDates = false
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
    clearToggle () {
      this.address = ''
      this.addressData = null
      this.selectedBuildings = []
    },
    search () {
      localStorage.setItem('dates', JSON.stringify(this.dates))
      if (this.toggleSearch === 'PLACES' && this.addressData) {
        this.startSearchProperties(this.selectedBuildings, this.buildings, this.guest, this.dates, this.selectedFeatures, { lat: this.addressData.latitude, long: this.addressData.longitude })
      } else {
        this.startSearchProperties(this.selectedBuildings, this.buildings, this.guest, this.dates, this.selectedFeatures)
      }
    },
    getAddressData (addressData, _placeResultData, id) {
      this.addressData = addressData
      dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
      dataLayer.push({
        event: 'search',
        address: addressData

      })
      // eslint-disable-next-line no-console
      console.log('view_item', {
        event: 'search',
        address: addressData
      })
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
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      }).finally(() => {
        this.isLoading = false
      })
    },
    setAllFeaturesState (state) {
      this.allFeatures = this.allFeatures.map((feat) => {
        feat.selected = state
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
    openDateFilterWarning () {
      this.$refs.dateFilterWarningDialog.openDateFilterWarning(true)
    }
  }

}
</script>
<style lang="scss" scoped>
@import '~/assets/mixins.scss';

.thin-display-icon {
  display: block;

  @include thin-phones() {
    display: none;
  }
}

.v-menu__content {
  max-height: 600px !important;
}

.close-btn {
  position: absolute;
  top: 24px;
  right: 24px;
}
</style>
