import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const usePaymentStore = defineStore('payment', () => {
  const peopleForm = ref({})
  const currentStep = ref(1)
  const otherReservationForm = ref([])
  const countdownTime = ref(null)

  const setPeopleForm = (newValue = {}) => {
    peopleForm.value = { ...peopleForm.value, ...newValue }
  }
  const setOtherReservationForm = (value = {}) => {
    const index = otherReservationForm.value.findIndex(item => item.id === value.id)
    if (index !== -1) {
      otherReservationForm.value[index] = value
    } else {
      otherReservationForm.value.push(value)
    }
    setPeopleForm({ otherReservationForm: otherReservationForm.value })
  }
  const setCountdownTime = (value) => {
    countdownTime.value = value
  }

  const getCurrentStep = computed(() => currentStep.value)
  const getPeopleForm = computed(() => peopleForm.value)
  const getCountdownTime = computed(() => countdownTime.value)

  const setCurrentStep = (value) => {
    currentStep.value = value
  }
  const setNextStep = () => {
    currentStep.value++
  }
  const setPreviousStep = () => {
    currentStep.value--
  }

  if (localStorage.getItem('currentStep')) {
    currentStep.value = JSON.parse(localStorage.getItem('currentStep'))
  }
  if (localStorage.getItem('countdownTime')) {
    countdownTime.value = JSON.parse(localStorage.getItem('countdownTime'))
  }

  watch(
    currentStep,
    (currentStepVal) => {
      localStorage.setItem('currentStep', JSON.stringify(currentStepVal))
    },
    { deep: true }
  )

  watch(
    countdownTime,
    (startCountdownTimeVal) => {
      localStorage.setItem('countdownTime', JSON.stringify(startCountdownTimeVal))
    },
    { deep: true }
  )

  const resetPaymentStore = () => {
    currentStep.value = 1
    peopleForm.value = {}
    otherReservationForm.value = []
    countdownTime.value = null

    const keysToRemove = ['refundTax', 'discountToSubtract', 'datesAmount', 'voucher', 'total', 'guests', 'bookingId', 'hasParking']
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key)
    })
  }

  return {
    currentStep,
    otherReservationForm,
    peopleForm,
    countdownTime,
    getCurrentStep,
    getPeopleForm,
    getCountdownTime,
    setCurrentStep,
    setNextStep,
    setPreviousStep,
    setOtherReservationForm,
    setPeopleForm,
    setCountdownTime,
    resetPaymentStore
  }
})
