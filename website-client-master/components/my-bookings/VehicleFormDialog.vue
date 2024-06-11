<template>
  <div>
    <div v-if="vehicleFormDialog" class="blur" />
    <v-dialog
      v-model="vehicleFormDialog"
      max-width="1200"
      min-width="800"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      hide-overlay
      persistent
      class="card-radius"
    >
      <v-card class="card-radius py-4 px-4">
        <v-icon color="primary" class="close-btn" @click="closeDialog">
          fa-solid fa-close
        </v-icon>
        <v-container>
          <v-row>
            <v-col cols="12" class="text-start">
              <h1>
                <v-icon color="black">
                  fa-solid fa-car
                </v-icon><span class="ml-2">Veículo</span>
              </h1>
            </v-col>
            <v-col cols="12">
              <v-row no-gutters class="mt-md-n3">
                <v-col cols="12" md="3">
                  <v-list-item-content>Marca/Modelo</v-list-item-content>
                  <v-text-field
                    v-model="form.vehicle.carModel"
                    dense
                    outlined
                    background-color="white"
                    class="radius-login-360"
                    placeholder="Marca e Modelo do veículo"
                    height="45px"
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="12" md="3" class="pl-md-2">
                  <v-list-item-content>Cor</v-list-item-content>
                  <v-text-field
                    v-model="form.vehicle.color"
                    dense
                    outlined
                    background-color="white"
                    class="radius-login-360"
                    placeholder="Cor do veículo"
                    height="45px"
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="12" md="3" class="pl-md-2">
                  <v-list-item-content>Modelo da placa</v-list-item-content>
                  <v-select
                    v-model="form.vehicle.licensePlateModel"
                    :items="licenseTypes"
                    background-color="white"
                    outlined
                    item-value="id"
                    item-text="label"
                    dense
                    height="45px"
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="12" md="3 " class="pl-md-2">
                  <v-list-item-content>Placa</v-list-item-content>
                  <v-text-field
                    v-if="form.vehicle.licensePlateModel === 'P'"
                    v-model="form.vehicle.licensePlate"
                    v-mask="['AAA-####']"
                    dense
                    outlined
                    background-color="white"
                    class="radius-login-360"
                    placeholder="ABC-1234"
                    height="45px"
                    hide-details="auto"
                    :disabled="form.vehicle.licensePlateModel === null"
                  />
                  <v-text-field
                    v-else
                    v-model="form.vehicle.licensePlate"
                    v-mask="['AAA#A##']"
                    dense
                    outlined
                    background-color="white"
                    class="radius-login-360"
                    placeholder="ABC1D23"
                    height="45px"
                    hide-details="auto"
                    :disabled="form.vehicle.licensePlateModel === null"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="py-0">
              <p>
                <strong>Atenção:</strong> Ao incluir ou editar os dados do veículo, por trabalharmos
                com portarias terceiras, pode demorar até 45 minutos para que essas informações
                sejam validadas.
              </p>
              <p class="mb-0">
                Feito isso, basta apresentar dos seus documentos para liberação no edifício.
              </p>
            </v-col>
            <v-col cols="12">
              <v-row justify="end">
                <v-col class="d-flex justify-end">
                  <v-btn
                    color="secondary"
                    class="radius-login-360 text-transform black--text"
                    height="45px"
                    :block="$vuetify.breakpoint.smAndDown"
                    width="150px"
                    elevation="0"
                    type="submit"
                    :loading="isSaving"
                    @click="save"
                  >
                    Salvar
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import { sendForm, hubspotForm } from '@/api'

export default {
  name: 'VehicleFormDialog',
  data () {
    return {
      vehicleFormDialog: false,
      booking: {},
      form: {
        vehicle: {

        }
      },
      licenseTypes: [{ id: 'P', label: 'Padrão' }, { id: 'M', label: 'Mercosul' }],
      isSaving: false
    }
  },
  methods: {
    openDialog (booking) {
      this.booking = booking
      this.vehicleFormDialog = true
      const vehicleString = booking?.custom2
      if (!vehicleString) { return }
      const vehicleArray = vehicleString.split('|')
      const [carModel, color] = vehicleArray[0].split('-')
      const [, plate] = vehicleArray
      this.form.vehicle = {
        carModel,
        color,
        licensePlate: plate,
        licensePlateModel: plate.includes('-') ? 'P' : 'M'
      }
    },
    save () {
      sendForm([
        {
          name: 'email',
          value: this.form?.email
        },
        {
          name: 'marca_e_modelo_do_veiculo',
          value: this.form?.vehicle?.carModel
        },
        {
          name: 'cor_do_veiculo',
          value: this.form?.vehicle?.color
        },
        {
          name: 'placa_do_veiculo',
          value: this.form?.vehicle?.licensePlate
        }
      ], {
        pageUri: hubspotForm.digitalCheckinVehicleUpdate.pageUri,
        pageName: hubspotForm.digitalCheckinVehicleUpdate.pageName
      }, hubspotForm.digitalCheckinVehicleUpdate.id)
      this.closeDialog()
    },
    closeDialog () {
      this.vehicleFormDialog = false
    }
  }
}
</script>

<style scoped lang="scss">
.close-btn {
  position: absolute;
  top: 24px;
  right: 24px;
}

.card-radius {
  border-radius: 24px !important;
}
</style>
