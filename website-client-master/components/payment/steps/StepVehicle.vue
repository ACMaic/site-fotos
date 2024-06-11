<template>
  <v-container fluid>
    <v-form
      ref="form"
      v-model="valid"
      @submit.prevent="($event) => $event.preventDefault()"
    >
      <div v-if="hasParking">
        <p>
          <v-icon size="14" color="black" class="mr-2 mt-n1">
            fa-solid fa-car
          </v-icon>
          <span class="text-medium-xxs">
            Veículo
          </span>
        </p>
        <v-row no-gutters class="mt-md-n3">
          <v-col cols="12" md="6">
            <v-list-item-content>Marca/Modelo</v-list-item-content>
            <v-text-field
              v-model="form.carModel"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              placeholder="Marca e Modelo do veículo"
              height="45px"
              hide-details="auto"
              :disabled="disableFields"
            />
          </v-col>
          <v-col cols="12" md="6" class="pl-md-2">
            <v-list-item-content>Cor</v-list-item-content>
            <v-text-field
              v-model="form.color"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              placeholder="Cor do veículo"
              height="45px"
              hide-details="auto"
              :disabled="disableFields"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-list-item-content>Modelo da placa</v-list-item-content>
            <v-select
              v-model="form.licensePlateModel"
              :items="licenseTypes"
              background-color="white"
              outlined
              item-value="id"
              item-text="label"
              dense
              height="45px"
              hide-details="auto"
              :disabled="disableFields"
            />
          </v-col>
          <v-col cols="12" md="6" class="pl-md-2">
            <v-list-item-content>Placa</v-list-item-content>
            <v-text-field
              v-if="form.licensePlateModel === 'P'"
              v-model="form.licensePlate"
              v-mask="['AAA-####']"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              placeholder="ABC-1234"
              height="45px"
              hide-details="auto"
              :disabled="form.licensePlateModel === null || disableFields"
            />
            <v-text-field
              v-else
              v-model="form.licensePlate"
              v-mask="['AAA#A##']"
              dense
              outlined
              background-color="white"
              class="radius-login-360"
              placeholder="ABC1D23"
              height="45px"
              hide-details="auto"
              :disabled="form.licensePlateModel === null || disableFields"
            />
          </v-col>
        </v-row>
      </div>
      <v-row no-gutters class="mt-md-2">
        <v-col cols="12" md="4" class="flex-checkboxes--parent">
          <v-list-item-content class="desc-regular-xxs list-item" :class="$vuetify.breakpoint.smAndDown ? 'mt-5' : 'mt-2'">
            Estou me hospedando para*
          </v-list-item-content>
        </v-col>
        <v-col
          v-for="interest in interests"
          :key="interest.id"
          cols="6"
          md="2"
        >
          <v-checkbox
            v-model="form.selectedInterests"
            hide-details="auto"
            class="form--checkbox"
            :label="interest"
            :value="interest"
            required
            :disabled="disableFields"
          />
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
<script>
import { usePaymentStore } from '~/store'
export default {
  name: 'StepVehicleComponent',
  props: {
    hasParking: {
      type: Boolean,
      default: false
    },
    disableFields: {
      type: Boolean,
      default: false
    }
  },
  emits: ['vehichle-data'],
  setup () {
    const { peopleForm, setPeopleForm } = usePaymentStore()
    return { peopleForm, setPeopleForm }
  },
  data () {
    return {
      valid: false,
      form: {
        carModel: null,
        licensePlateModel: null,
        licensePlate: null,
        color: null,
        selectedInterests: []
      },
      interests: ['Namorar', 'Turistar', 'Comprar', 'Trabalhar'],
      licenseTypes: [{ id: 'P', label: 'Padrão' }, { id: 'M', label: 'Mercosul' }]
    }
  },
  watch: {
    form: {
      handler: function (newValue) {
        this.$emit('vehichle-data', { ...newValue, valid: this.valid })
        this.setPeopleForm({ vehicleForm: newValue })
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
