import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useReservationStore = defineStore('reservation', () => {
  const room = ref({
    id: null,
    propertyId: null,
    name: '',
    maxPeople: null,
    roomDescription1: '',
    images: [],
    features: [],
    roomInventory: [],
    property: {
      id: null,
      address: ''
    }
  })
  const dates = ref([])
  const guest = ref({})
  const calculatedPrice = ref({})
  const highlightedFeatures = ref({})

  const getRoom = computed(() => room.value)
  const getDates = computed(() => dates.value)
  const getGuest = computed(() => guest.value)
  const getCalculatedPrice = computed(() => calculatedPrice.value)
  const getHighlightedFeatures = computed(() => highlightedFeatures.value)

  const setSelectedRoom = (value) => {
    room.value = value
  }

  const setSelectedDates = (value) => {
    dates.value = value
  }

  const setSelectedGuest = (value = {}) => {
    guest.value = value
  }

  const setSelectedCalculatedPrice = (value = {}) => {
    calculatedPrice.value = value
  }

  const setHighlightedFeatures = (value = {}) => {
    highlightedFeatures.value = value
  }

  if (localStorage.getItem('room')) {
    room.value = JSON.parse(localStorage.getItem('room'))
  }

  if (localStorage.getItem('dates')) {
    dates.value = JSON.parse(localStorage.getItem('dates'))
  }

  if (localStorage.getItem('guest')) {
    guest.value = JSON.parse(localStorage.getItem('guest')) || 1
  }

  if (localStorage.getItem('calculatedPrice')) {
    calculatedPrice.value = JSON.parse(localStorage.getItem('calculatedPrice'))
  }

  if (localStorage.getItem('highlightedFeatures')) {
    highlightedFeatures.value = JSON.parse(localStorage.getItem('highlightedFeatures'))
  }

  watch(
    room,
    (roomVal) => {
      localStorage.setItem('room', JSON.stringify(roomVal))
    },
    { deep: true }
  )

  watch(
    dates,
    (datesVal) => {
      localStorage.setItem('dates', JSON.stringify(datesVal))
    },
    { deep: true }
  )

  watch(
    guest,
    (guestVal) => {
      localStorage.setItem('guest', JSON.stringify(guestVal))
    },
    { deep: true }
  )

  watch(
    calculatedPrice,
    (calculatedPriceVal) => {
      localStorage.setItem('calculatedPrice', JSON.stringify(calculatedPriceVal))
    },
    { deep: true }
  )

  watch(
    highlightedFeatures,
    (highlightedFeaturesVal) => {
      localStorage.setItem('highlightedFeatures', JSON.stringify(highlightedFeaturesVal))
    },
    { deep: true }
  )

  return {
    room,
    dates,
    guest,
    calculatedPrice,
    highlightedFeatures,
    getRoom,
    getDates,
    getGuest,
    getCalculatedPrice,
    getHighlightedFeatures,
    setSelectedRoom,
    setSelectedDates,
    setSelectedGuest,
    setSelectedCalculatedPrice,
    setHighlightedFeatures
  }
})
