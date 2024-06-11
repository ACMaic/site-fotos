<template>
  <div>
    <div v-if="dialogRules" class="blur" />
    <v-dialog
      v-model="dialogRules"
      max-width="750"
      hide-overlay
      persistent
    >
      <v-card class="py-2">
        <v-card-title class=" primary--text">
          <v-row no-gutters class="pt-4">
            <v-col cols="12" align="right">
              <v-btn icon color="primary" @click="closeRulesDialog">
                <v-icon>fas fa-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="black--text py-4" :class="$vuetify.breakpoint.smAndUp ? 'text-regular-xl' : 'text-regular-xs'">
          Regras do condomínio | Edifício <span class="primary--text"> {{ propertyName }}</span>
        </v-card-text>
        <v-card-text :style="$vuetify.breakpoint.smAndUp ? 'max-width: 50%' : ''" v-html="rules" />
        <v-card-actions>
          <v-row no-gutters>
            <v-col cols="12" align="right">
              <v-btn
                medium
                text
                class="rounded-lg"
                color="primary"
                @click="closeRulesDialog"
              >
                Fechar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: 'PropertyRulesDialog',
  props: {
    propertyName: {
      type: String,
      default: ''
    },
    rules: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogRules: false
    }
  },
  methods: {
    openRulesDialog () {
      this.dialogRules = true
    },
    closeRulesDialog () {
      this.dialogRules = false
    }
  }
}
</script>
