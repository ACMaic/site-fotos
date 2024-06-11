<template>
  <v-container fluid>
    <v-form
      ref="form"
      v-model="valid"
      @submit.prevent="($event) => $event.preventDefault()"
    >
      <span class="text-medium-xxs">
        Termos de uso
      </span>
      <v-row class="mt-md-n4" no-gutters>
        <v-col cols="12">
          <v-checkbox
            v-model.trim="form.termsAndConditions"
            color="primary"
            hide-details="auto"
          >
            <template #label>
              <span class="desc-regular-xxs mt-3">Declaro estar de acordo com os termos de uso, política de privacidade e política de cancelamento.</span>
            </template>
          </v-checkbox>
        </v-col>
        <v-col cols="12">
          <v-checkbox
            v-model.trim="form.whatsappOffers"
            color="primary"
            hide-details="auto"
          >
            <template #label>
              <span class="desc-regular-xxs">Aceito receber atualizações da minha reserva por WhatsApp.</span>
            </template>
          </v-checkbox>
        </v-col>
        <v-col cols="12">
          <v-checkbox
            v-model.trim="form.emailOffers"
            color="primary"
            hide-details="auto"
          >
            <template #label>
              <span class="desc-regular-xxs">Quero receber ofertas, promoções exclusivas, cupons e novidades por e-mail.</span>
            </template>
          </v-checkbox>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
<script>
import { usePaymentStore } from '~/store'

export default {
  name: 'StepTermsComponent',
  setup () {
    const { peopleForm, setPeopleForm } = usePaymentStore()
    return { peopleForm, setPeopleForm }
  },
  data () {
    return {
      valid: false,
      form: {
        termsAndConditions: null,
        whatsappOffers: null,
        licensePlate: null,
        emailOffers: null
      }
    }
  },
  watch: {
    form: {
      handler: function (newValue) {
        if ((this.form.termsAndConditions)) {
          this.setPeopleForm({ termsForm: newValue })
        } else {
          this.setPeopleForm({ termsForm: null })
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/mixins.scss';
.list-item {
  flex: initial;
  width: 100%;
  text-align: left;
  @include desktop-up() {
    width: initial;
  }
}

.v-list-item__content {
  font-size: 14px !important;
}

.form--checkbox label {
  font-size: 14px;
  color: #333333 !important;
}
.flex-checkboxes--parent {
  display: flex;
  flex-direction: column;
  @include desktop-up() {
    flex-direction: row;
  }
}
</style>
