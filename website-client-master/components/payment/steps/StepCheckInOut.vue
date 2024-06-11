<template>
  <v-container fluid>
    <v-form
      ref="form"
      v-model="valid"
      @submit.prevent="($event) => $event.preventDefault()"
    >
      <p class="mt-3">
        <v-icon size="14" color="black" class="mr-2 mt-n1">
          fa-solid fa-right-from-bracket
        </v-icon>
        <span class="text-medium-xxs">
          Check-in | Check-out
        </span>
      </p>
      <v-row no-gutters class="mt-md-n3">
        <v-col cols="12" md="6">
          <v-list-item-content>Horário previsto para chegada*</v-list-item-content>
          <v-select
            v-model="form.checkInTime"
            :items="checkinOptions"
            background-color="white"
            outlined
            dense
            required
            height="45px"
            hide-details="auto"
            :rules="requiredRules"
            :disabled="disableFields"
          />
        </v-col>
        <v-col cols="12" md="6" class="pl-md-2">
          <v-list-item-content>Horário previsto para saída*</v-list-item-content>
          <v-select
            v-model="form.checkOutTime"
            :items="checkoutOptions"
            background-color="white"
            outlined
            dense
            required
            height="45px"
            hide-details="auto"
            :rules="requiredRules"
            :disabled="disableFields"
          />
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
<script>
import { requiredRules } from '@/rules'
import { usePaymentStore } from '~/store'
import { getCheckinHours, getCheckoutHours } from '@/shared/utils'

export default {
  name: 'StepCheckInOutComponent',
  props: {
    disableFields: {
      type: Boolean,
      default: false
    }
  },
  setup () {
    const { peopleForm, setPeopleForm } = usePaymentStore()
    return { peopleForm, setPeopleForm }
  },
  data () {
    return {
      valid: false,
      form: {
        checkInTime: null,
        checkOutTime: null
      },
      requiredRules,
      startDatePickerModal: false,
      endDatePickerModal: false,
      checkinOptions: getCheckinHours(JSON.parse(localStorage.getItem('dates'))[0]),
      checkoutOptions: getCheckoutHours(JSON.parse(localStorage.getItem('dates'))[1])
    }
  },
  watch: {
    form: {
      handler: function (newValue) {
        if (this.form.checkInTime && this.form.checkOutTime) {
          this.setPeopleForm({ checkInOutForm: newValue })
        } else {
          this.setPeopleForm({ checkInOutForm: null })
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
