<template>
  <div class="desc-regular-xxs mt-md-n2">
    <p
      v-if="countdownTime > 0"
      :class="$vuetify.breakpoint.lgAndUp ? 'mt-n8 ml-6' : ''"
    >
      Você tem <span class="primary--text">{{ formattedTime }} minutos</span> para garantir esta reserva
    </p>
    <p
      v-else
      :class="$vuetify.breakpoint.lgAndUp ? 'mt-n5' : ''"
    >
      Tempo expirado!
    </p>
  </div>
</template>

<script>
import { mapActions } from 'pinia'
import { usePaymentStore, useSnackbar } from '@/store'
const MINUTES = 20
const SECONDS = 0
const TOTAL_SECONDS = MINUTES * 60 + SECONDS

export default {
  name: 'BookingCountdownComponent',
  setup () {
    const { getCountdownTime: storedCountdownTime, setCountdownTime, setCurrentStep } = usePaymentStore()

    const minutes = MINUTES * 60 * 1000
    const seconds = SECONDS * 1000
    const sumMinAndSeconds = minutes + seconds

    const checkStoredTime = () => {
      const pastDatetime = new Date(storedCountdownTime)

      const currentTime = Date.now()
      const elapsedTime = currentTime - pastDatetime.getTime()

      if (elapsedTime < sumMinAndSeconds) {
        const remainingTimeInSeconds = Math.floor((sumMinAndSeconds - elapsedTime) / 1000)
        return remainingTimeInSeconds
      }
      return 0
    }

    return { storedCountdownTime, sumMinAndSeconds, setCountdownTime, checkStoredTime, setCurrentStep }
  },
  data () {
    const hasStoredTime = this.checkStoredTime()

    const totalSeconds = hasStoredTime > 0 ? hasStoredTime : TOTAL_SECONDS
    return {
      countdownTime: totalSeconds,
      countdownInterval: null
    }
  },
  computed: {
    formattedTime () {
      const minutes = Math.floor((this.countdownTime % 3600) / 60)
      const seconds = this.countdownTime % 60
      return `${minutes}:${seconds}`
    }
  },
  watch: {
    countdownTime (value) {
      if (value === 0) {
        this.setCountdownTime(null)
        localStorage.setItem('guest', 1)
        localStorage.setItem('hasParking', null)
        localStorage.setItem('dates', [])
        this.$router.push('/')
        this.showSnackbar({
          text: 'Tempo de reserva expirado!',
          timeout: -1,
          color: 'error'
        })
      } else {
        this.setCountdownTime(value)
      }
    }
  },
  mounted () {
    this.startCountdown()
    window.addEventListener('beforeunload', this.leavingPage)
  },
  beforeDestroy () {
    clearInterval(this.countdownInterval)
  },
  methods: {
    ...mapActions(useSnackbar, ['showSnackbar']),
    ...mapActions(useSnackbar, ['closeSnackbar']),
    startCountdown () {
      this.countdownInterval = setInterval(() => {
        if (this.countdownTime > 0) {
          this.countdownTime--
        } else {
          this.setCountdownTime(Date.now())
          this.countdownTime = TOTAL_SECONDS
          this.$route.push('/')
          localStorage.clear()
        }
      }, 1000)
    },
    leavingPage () {
      clearInterval(this.countdownInterval)

      const currentDate = new Date()
      const thresholdTime = new Date(currentDate.getTime() - (this.sumMinAndSeconds))
      const pastDatetime = new Date(this.storedCountdownTime)

      if (pastDatetime < thresholdTime) {
        this.setCountdownTime(Date.now())
      }
    }
  }
}
</script>
