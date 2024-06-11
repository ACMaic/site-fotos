<template>
  <v-app light class="background-360">
    <div>
      <template v-if="render">
        <header-component :is-owner="true" />
      </template>
      <v-main v-if="render">
        <nuxt />
        <v-snackbar
          :value="snackbar.show"
          :timeout="snackbar.timeout"
          :color="snackbar.color"
          @input="closeSnackbar"
        >
          {{ snackbar.text }}
          <template #action="{ attrs }">
            <v-btn text v-bind="attrs" @click="closeSnackbar">
              Fechar
            </v-btn>
          </template>
        </v-snackbar>
      </v-main>
      <footer-component v-if="render" :contact-options="contactOwnerOptions" />
    </div>
  </v-app>
</template>
<script>

import { mapState, mapActions } from 'pinia'
import HeaderComponent from '@/components/Header'
import FooterComponent from '@/components/Footer'
import { useSnackbar } from '@/store'
import { contactOwnerOptions } from '@/shared/footer'

export default {
  components: {
    HeaderComponent,
    FooterComponent
  },
  data () {
    return {
      render: false,
      userName: '',
      contactOwnerOptions
    }
  },
  head () {
    return {
      htmlAttrs: {
        lang: 'pt-BR'
      }
    }
  },
  computed: {
    ...mapState(useSnackbar, ['snackbar'])
  },
  watch: {
    $route (from, to) {
      this.closeSnackbar()
    }
  },
  mounted () {
    this.render = true
  },
  methods: {
    ...mapActions(useSnackbar, ['closeSnackbar'])
  }
}
</script>
