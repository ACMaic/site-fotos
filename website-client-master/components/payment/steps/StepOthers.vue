<template>
  <v-container
    fluid
    class="form-wrapper"
    :style="$vuetify.breakpoint.lgAndUp ? 'background-color: #F6F6F6;' : ''"
  >
    <v-form
      ref="form"
      v-model="valid"
      class="pa-2"
      @submit.prevent="($event) => $event.preventDefault()"
    >
      <v-row no-gutters>
        <v-col cols="12">
          <v-list-item-content>Nome completo*</v-list-item-content>
          <v-text-field
            v-model="form.name"
            dense
            outlined
            background-color="white"
            class="radius-login-360"
            :rules="nameRules"
            placeholder="Nome completo"
            required
            height="45px"
            hide-details="auto"
            :disabled="disableFields"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" md="6" class="pt-4">
          <v-list-item-content>Documento*</v-list-item-content>
          <v-select
            v-model="form.typeDocumentId"
            placeholder="CPF"
            :items="documentIdList"
            dense
            outlined
            background-color="white"
            class="radius-login-360"
            :rules="requiredRules"
            required
            height="45px"
            hide-details="auto"
            :disabled="disableFields"
          >
            <template #selection="{ item }">
              <span style="font-size: 13px">{{ item }}</span>
            </template>
            <template #item="{ item }">
              {{ item }}
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" md="6" class="pt-4 pl-2">
          <v-list-item-content>Nº Documento*</v-list-item-content>
          <v-text-field
            v-model="form.documentId"
            v-mask="documentHelpers.getDocumentIdMaks(form)"
            dense
            outlined
            background-color="white"
            class="radius-login-360"
            :rules="documentHelpers.getDocumentIdRules(form)"
            required
            height="45px"
            hide-details="auto"
            :disabled="disableFields"
          />
        </v-col>
        <v-col cols="12" md="5" class="pt-4">
          <v-list-item-content>Data de Nascimento*</v-list-item-content>
          <v-text-field
            v-model.trim="form.birthdate"
            dense
            outlined
            background-color="white"
            class="radius-login-360"
            :rules="minorBirthdateRules"
            type="date"
            height="45px"
            hide-details="auto"
            max="2023-12-01"
            :disabled="disableFields"
          />
        </v-col>
        <v-col cols="4" md="2" class="pt-4 pl-md-2">
          <v-list-item-content>DDI{{ isUserOlderThan18(form.birthdate) ? '*' : '' }}</v-list-item-content>
          <v-autocomplete
            v-model="form.ddi"
            :items="country_and_ddi"
            dense
            outlined
            background-color="white"
            class="radius-login-360"
            full-width
            placeholder="DDI"
            :item-text="(item) => `+${item.ddi} - (${item.country})`"
            item-value="ddi"
            append-icon=""
            height="45px"
            hide-details="auto"
            :menu-props="{ rounded: 'sm' }"
            :rules="isUserOlderThan18(form.birthdate) ? requiredRules : []"
            :disabled="disableFields"
          >
            <template #selection="{ item }">
              <span>+{{ item.ddi }}</span>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="8" md="5" class="pt-4 pl-2">
          <v-list-item-content>Celular{{ isUserOlderThan18(form.birthdate) ? '*' : '' }}</v-list-item-content>
          <v-text-field
            v-model="form.cellPhone"
            v-mask="['(##) #####-####']"
            dense
            outlined
            background-color="white"
            class="radius-login-360"
            placeholder="Celular"
            :rules="isUserOlderThan18(form.birthdate) ? phoneRules : form.cellPhone ? phoneOtherRules : []"
            height="45px"
            hide-details="auto"
            :disabled="disableFields"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12">
          <v-list-item-content>E-mail{{ isUserOlderThan18(form.birthdate) ? '*' : '' }}</v-list-item-content>
          <v-text-field
            v-model="form.email"
            dense
            outlined
            background-color="white"
            class="radius-login-360"
            :rules="isUserOlderThan18(form.birthdate) ? emailRules : form.email ? emailOtherRules : []"
            placeholder="E-mail"
            height="45px"
            hide-details="auto"
            :disabled="disableFields"
          />
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
<script>
import { mapActions } from 'pinia'
import documentHelpers from './StepHelpers'
import { usePaymentStore, useSnackbar } from '@/store'
import { openApi as api360 } from '@/api'
import {
  nameRules,
  requiredRules,
  cpfRules,
  rgRules,
  passaporteRules,
  minorBirthdateRules,
  phoneOtherRules,
  cepRules,
  noSpecialCharsRules,
  emailOtherRules,
  phoneRules,
  emailRules,
  isUserOlderThan18
} from '@/rules'
export default {
  name: 'StepOthersComponent',
  props: {
    id: {
      type: Number,
      required: true
    },
    isPreCheckin: {
      type: Boolean,
      default: false
    },
    guestData: {
      type: Object,
      default: () => ({})
    },
    disableFields: {
      type: Boolean,
      default: false
    }
  },
  emits: ['other-persons-form'],
  setup () {
    const { otherReservationForm, setOtherReservationForm } = usePaymentStore()
    return { otherReservationForm, setOtherReservationForm }
  },
  data () {
    return {
      form: {
        name: '',
        typeDocumentId: 'CPF',
        documentId: '',
        birthdate: null
      },
      valid: false,
      nameRules,
      requiredRules,
      cpfRules,
      rgRules,
      passaporteRules,
      minorBirthdateRules,
      phoneOtherRules,
      cepRules,
      noSpecialCharsRules,
      emailOtherRules,
      documentIdList: ['CPF', 'RG', 'Passaporte'],
      country_and_ddi: [],
      states: [],
      isLoadingCities: false,
      documentHelpers,
      phoneRules,
      emailRules,
      isUserOlderThan18
    }
  },
  watch: {
    form: {
      handler: function (newValue) {
        this.$emit('other-persons-form', { ...newValue, valid: this.valid })
        this.setOtherReservationForm({ id: this.id, ...newValue, valid: this.valid })
      },
      deep: true
    },
    valid: {
      handler: function (newValue) {
        this.setOtherReservationForm({ id: this.id, ...this.form, valid: newValue })
      },
      deep: true
    }
  },
  beforeMount () {
    this.getDdiAndCountry()
    this.form.typeDocumentId = 'CPF'

    if (this.isPreCheckin) {
      this.form = {
        name: this.guestData.name,
        typeDocumentId: this.guestData.docType || 'CPF',
        documentId: this.guestData.doc,
        birthdate: this.guestData.birthday,
        cellPhone: this.guestData.phone,
        email: this.guestData.email,
        ddi: this.guestData.ddi
      }
    }
  },
  methods: {
    ...mapActions(useSnackbar, ['showSnackbar']),
    getDdiAndCountry () {
      api360
        .get('/website-users')
        .then(({ data }) => {
          this.country_and_ddi = data
        })
        .catch((error) => {
          this.showSnackbar({
            text: error,
            timeout: -1,
            color: 'error'
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.v-list-item__content {
  font-size: 14px !important;
}
</style>
