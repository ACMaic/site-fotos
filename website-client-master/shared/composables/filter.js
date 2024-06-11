import { ref, watch } from '@nuxtjs/composition-api'
import { openApi as api360 } from '@/api'
import { usePropertyStore } from '@/store'

export function useFilters () {
  const { setFilteredProperties, setSelectedPropertyIds, getSelectedPropertyIds, setFilters, filters: storedFilters, getProperties } = usePropertyStore()
  const isLoading = ref(false)
  const rooms = ref([])
  const features = ref([])
  const location = ref(null)
  const pagination = ref({
    allTotal: 0,
    page: 1,
    pageSize: 12,
    total: 0
  })
  const selectedPropertyIds = ref([...getSelectedPropertyIds])
  const filters = ref({ maxPeople: storedFilters.maxPeople, dates: storedFilters.dates, featureIds: storedFilters.featureIds, location: storedFilters.location })

  function startSearchProperties (selectedBuildings, buildings, guest, dates, featureIds = [], loc = null) {
    isLoading.value = true

    if (selectedBuildings && selectedBuildings.length < 1) {
      selectedBuildings = buildings.map((building) => {
        return building.id
      })
    }

    features.value = featureIds

    location.value = loc

    api360.post('/property-api/website/list-by-ids', {
      propertyIds: selectedBuildings
    })
      .then(({ data }) => {
        setFilteredProperties(data)
        setSelectedPropertyIds(selectedBuildings)
        // eslint-disable-next-line no-self-assign
        dates.length > 1 ? dates = dates : dates = []

        setFilters({
          maxPeople: guest,
          dates,
          featureIds,
          location: loc
        })

        this.$router.push('/reserva')
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      })
      .finally(() => {
        isLoading.value = false
      })
  }

  function startSearchRooms (maxPeople, dates = [], propertyIds = [], featureIds = [], loc = null, resetPaging = true) {
    isLoading.value = true

    if (resetPaging) {
      pagination.value.page = 1
    }

    setSelectedPropertyIds(propertyIds)
    setFilters({ maxPeople, dates: [...dates], featureIds, location: loc })

    features.value = featureIds
    location.value = loc
    filters.value = { maxPeople, dates: [...dates], featureIds, location: loc }
    selectedPropertyIds.value = propertyIds
    pagination.value.pageSize = loc ? 3 : 12

    // eslint-disable-next-line no-self-assign
    dates.length > 1 ? dates = dates : dates = []
    const [startDate, endDate] = dates
    const payload = {
      maxPeople,
      propertyIds: propertyIds.length > 0 ? propertyIds : selectedPropertyIds.value,
      startDate: startDate || null,
      endDate: endDate || null,
      pageSize: pagination.value.pageSize,
      page: pagination.value.page,
      featureIds,
      location: loc
    }

    watch(
      () => rooms.value,
      (roomsVal) => {
        rooms.value = roomsVal
      },
      { lazy: false }
    )

    localStorage.setItem('dates', JSON.stringify(dates))

    api360.post('/room-api/list-with-pagination', payload)
      .then(({ data }) => {
        pagination.value = {
          allTotal: data.total,
          page: data.page,
          pageSize: loc ? 3 : 12,
          total: data.total
        }
        rooms.value = data.rooms
        selectedPropertyIds.value = propertyIds
        location.value = loc
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error)
      })
      .finally(() => {
        isLoading.value = false
      })
  }

  function clearFilter () {
    setFilters({})
    setSelectedPropertyIds([])
  }

  return { isLoading, rooms, pagination, startSearchProperties, startSearchRooms, selectedPropertyIds, filters, getProperties, features, location, clearFilter }
}
