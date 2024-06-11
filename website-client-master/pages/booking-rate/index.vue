<template>
  <v-container class="ma-0 pa-0 mb-4 mx-auto">
    <v-row justify="center" class="mt-12 mx-4 mx-lg-0" no-gutters>
      <v-col cols="12" lg="6">
        <v-row>
          <v-col cols="12">
            <h1 v-if="userName" class="primary--text mb-4 text-medium-sm font-weight-bold">
              {{ userName }}, falta pouco para concluir o checkout.
            </h1>
            <p class="font-weight-bold desc-regular-xxs">
              Sua opinião é muito importante para nós! Pode nos ajudar?
            </p>
          </v-col>
          <v-col cols="12" :style="bookingRate.overview == null && ($vuetify.breakpoint.xs ? 'height: calc(100vh - 75px);' : 'height: calc(100vh - 346px - 75px);')">
            <p>Em uma escala de <strong>0-10</strong>, o quanto você recomendaria a 360 Suítes a um amigo ou familiar? <span class="primary--text">*</span></p>
            <div class="text-center mb-2">
              <v-btn-toggle
                v-model="bookingRate.overview"
                class="transparent"
                borderless
                :style="$vuetify.breakpoint.xs && 'display: inline-block !important;'"
                @change="save"
              >
                <v-btn
                  v-for="(_rate, index) in 11"
                  :key="index"
                  icon
                  class="inactive"
                  active-class="active"
                >
                  <v-icon
                    class="white--text rounded-pill"
                    style="font-size: 18px !important; height: 34px !important; width: 34px !important;"
                    :class="genColor(index, 'overviewColors')"
                    :value="index"
                  >
                    {{ index }}
                  </v-icon>
                </v-btn>
              </v-btn-toggle>
            </div>
            <div class="d-flex justify-space-between grey--text caption">
              <span>0-Não recomendaria</span>
              <span>10-Recomendaria muito</span>
            </div>
          </v-col>
          <v-col v-if="bookingRate.overview != null" cols="12">
            <p>Como você avalia a sua entrada na portaria ou recepção? <span class="primary--text">*</span></p>
            <div class="text-center">
              <v-btn-toggle
                v-model="bookingRate.questions[0].rate"
                class="transparent"
                borderless
              >
                <v-btn
                  v-for="(rate, index) in 5"
                  :key="index"
                  icon
                  class="inactive"
                  active-class="active"
                  :value="rate"
                >
                  <v-icon
                    :color="genColor(index, 'questionColors')"
                    large
                  >
                    {{ bookingRate.questions[0].rate == rate ? 'fa-solid' : 'fa-regular' }} fa-face-{{ genIcon(index) }}
                  </v-icon>
                </v-btn>
              </v-btn-toggle>
            </div>
            <div class="d-flex justify-space-between grey--text caption">
              <span>Muito ruim</span>
              <span>Ótimo</span>
            </div>
          </v-col>
          <v-col v-if="bookingRate.overview != null" cols="12">
            <p>Como você avalia a limpeza do apartamento? <span class="primary--text">*</span></p>
            <div class="text-center">
              <v-btn-toggle
                v-model="bookingRate.questions[1].rate"
                class="transparent"
                borderless
              >
                <v-btn
                  v-for="(rate, index) in 5"
                  :key="index"
                  icon
                  class="inactive"
                  active-class="active"
                  :value="rate"
                >
                  <v-icon
                    :color="genColor(index, 'questionColors')"
                    large
                  >
                    {{ bookingRate.questions[1].rate == rate? 'fa-solid' : 'fa-regular' }} fa-face-{{ genIcon(index) }}
                  </v-icon>
                </v-btn>
              </v-btn-toggle>
            </div>
            <div class="d-flex justify-space-between grey--text caption">
              <span>Muito ruim</span>
              <span>Ótimo</span>
            </div>
          </v-col>
          <v-col v-if="bookingRate.overview != null" cols="12">
            <p>Como você avalia o nosso time de atendimento? <span class="primary--text">*</span></p>
            <div>
              <v-checkbox
                v-model="optionalQuestion"
                dense
              >
                <template #label>
                  <div class="primary--text caption">
                    Não precisei de atendimento durante minha estadia.
                  </div>
                </template>
              </v-checkbox>
            </div>
            <div class="text-center">
              <v-btn-toggle
                v-model="bookingRate.questions[2].rate"
                class="transparent"
                borderless
              >
                <v-btn
                  v-for="(rate, index) in 5"
                  :key="index"
                  icon
                  class="inactive"
                  active-class="active"
                  :value="rate"
                >
                  <v-icon
                    :color="genColor(index, 'questionColors')"
                    large
                  >
                    {{ bookingRate.questions[2].rate == rate ? 'fa-solid' : 'fa-regular' }} fa-face-{{ genIcon(index) }}
                  </v-icon>
                </v-btn>
              </v-btn-toggle>
            </div>
            <div class="d-flex justify-space-between grey--text caption">
              <span>Muito ruim</span>
              <span>Ótimo</span>
            </div>
          </v-col>
          <v-col v-if="bookingRate.overview != null" cols="12">
            <p>Conte mais sobre a sua experiência:</p>
            <v-textarea
              v-model="bookingRate.comment"
              outlined
              name="input-7-4"
              placeholder="Digite aqui"
              value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
            />
          </v-col>
          <v-col v-if="bookingRate.overview != null" cols="12">
            <v-btn
              elevation="0"
              class="black--text"
              :color="isInvalid ? 'grey lighten-2' : 'secondary'"
              :disabled="isInvalid"
              height="40"
              width="150"
              :block="$vuetify.breakpoint.smAndDown"
              :loading="isLoading"
              @click="saveAll"
            >
              Enviar
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Auth } from 'aws-amplify'
import { openApi as api360, sendForm, hubspotForm } from '@/api'

export default {
  name: 'BookingRatePage',
  data () {
    return {
      email: '',
      userName: '',
      overviewColors: ['red darken-4', 'red darken-1', 'orange darken-4', 'orange darken-3', 'orange darken-1', 'amber darken-1', 'lime lighten-2', 'lime lighten-1', 'light-green lighten-2', 'light-green lighten-1', 'green'],
      questionColors: ['red', 'orange', 'amber', 'cyan', 'green'],
      icons: ['angry', 'frown', 'confused', 'smile', 'grin'],
      optionalQuestion: false,
      foundRate: null,
      isLoading: false,
      bookingRate: {
        bookingId: Number.parseInt(this.$route.params.id, 10),
        comment: '',
        accountType: 'Website',
        positiveComment: '',
        negativeComment: '',
        overview: null,
        source: 'Website',
        questions: [
          {
            name: 'checkIn',
            rate: null
          },
          {
            name: 'cleanliness',
            rate: null
          },
          {
            name: 'staff',
            rate: null
          }

        ],
        reviewDate: new Date()
      }
    }
  },
  computed: {
    isInvalid () {
      if (this.bookingRate.questions[0].rate == null) { return true }
      if (this.bookingRate.questions[1].rate == null) { return true }
      if (!this.optionalQuestion && this.bookingRate.questions[2].rate == null) { return true }
      return false
    }
  },
  beforeMount () {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        this.userName = `${user.attributes.given_name} ${user.attributes.family_name}`
        this.email = user.attributes.email
      })
      .catch((err) => {
        Auth.signOut({ global: true })
        // eslint-disable-next-line no-console
        console.error(err)
      })

    api360.get(`/booking-rates/booking/${this.$route.params.id}`).then((res) => {
      this.foundRate = res.data

      if (this.foundRate?.questions?.length > 0) { this.$router.replace('/avaliacao-finalizada') }
    })
  },
  methods: {
    save () {
      const bookingRate = {
        ...this.bookingRate,
        questions: []
      }

      if (!this.foundRate) {
        this.isLoading = true
        api360.post('/booking-rates', bookingRate).then((res) => {
          this.foundRate = res.data
        }).finally(() => {
          this.isLoading = false
        })
      }
    },
    saveAll () {
      this.isLoading = true

      const bookingRate = { ...this.bookingRate, questions: [...this.bookingRate.questions] }
      if (this.optionalQuestion) {
        bookingRate.questions.pop()
      }

      api360.put(`/booking-rates/${this.foundRate.id}`, bookingRate).then((res) => {
        this.foundRate = res.data

        sendForm([
          {
            name: 'email',
            value: this.email
          },
          {
            name: 'nps_check_out',
            value: this.bookingRate?.overview
          }, {
            name: 'avaliacao_da_entrada',
            value: this.bookingRate?.questions[0]?.rate
          }, {
            name: 'avaliacao_da_limpeza',
            value: this.bookingRate?.questions[1]?.rate
          },
          {
            name: 'avaliacao_do_atendimento',
            value: !this.optionalQuestion ? this.bookingRate?.questions[2]?.rate : 'null'
          },
          {
            name: 'nao_precisou_de_atendimento',
            value: this.optionalQuestion
          },
          {
            name: 'justificativa_nps',
            value: this.bookingRate?.comment
          }
        ], {
          pageUri: hubspotForm.rate.pageUri,
          pageName: hubspotForm.rate.pageName
        }, hubspotForm.rate.id)

        this.$router.replace('/avaliacao-finalizada')
      }).finally(() => {
        this.isLoading = false
      })
    },
    genColor (i, type) {
      return this[type][i]
    },
    genIcon (i) {
      return this.icons[i]
    }
  }
}
</script>

<style lang="scss" scoped>
.inactive {
  opacity: 40% !important;
}

.active {
  opacity: 100% !important;
}

.theme--light.v-btn--active:hover::before, .theme--light.v-btn--active::before {
  opacity: 0%;
}
</style>
