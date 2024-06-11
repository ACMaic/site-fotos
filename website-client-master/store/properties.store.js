import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const usePropertyStore = defineStore('properties', () => {
  const properties = ref([])
  const selectedPropertyIds = ref([])
  const filters = ref({})

  const getProperties = computed(() => properties.value)
  const getSelectedPropertyIds = computed(() => selectedPropertyIds.value)
  const getFilters = computed(() => filters.value)

  const setFilteredProperties = (value) => {
    properties.value = value
  }

  const setSelectedPropertyIds = (value) => {
    selectedPropertyIds.value = value
  }

  const setFilters = (value = {}) => {
    filters.value = value
  }

  if (localStorage.getItem('properties')) {
    properties.value = JSON.parse(localStorage.getItem('properties'))
  }

  if (localStorage.getItem('selectedPropertyIds')) {
    selectedPropertyIds.value = JSON.parse(localStorage.getItem('selectedPropertyIds'))
  }

  if (localStorage.getItem('filters')) {
    filters.value = JSON.parse(localStorage.getItem('filters'))
  }

  watch(
    properties,
    (propertiesVal) => {
      localStorage.setItem('properties', JSON.stringify(propertiesVal))
    },
    { deep: true }
  )

  watch(
    selectedPropertyIds,
    (selectedPropertyIdsVal) => {
      localStorage.setItem('selectedPropertyIds', JSON.stringify(selectedPropertyIdsVal))
    },
    { deep: true }
  )

  watch(
    filters,
    (filtersVal) => {
      localStorage.setItem('filters', JSON.stringify(filtersVal))
    },
    { deep: true }
  )

  return {
    properties,
    selectedPropertyIds,
    filters,
    getProperties,
    getSelectedPropertyIds,
    getFilters,
    setFilteredProperties,
    setSelectedPropertyIds,
    setFilters
  }
})
