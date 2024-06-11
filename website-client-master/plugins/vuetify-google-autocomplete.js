import Vue from 'vue'
// @ts-ignore
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete'

Vue.use(VuetifyGoogleAutocomplete, {
  apiKey: process.env.NUXT_ENV_GOOGLE_MAPS_API
})
