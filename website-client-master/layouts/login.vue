<template>
  <v-app light class="background-360">
    <div>
      <v-main v-if="render">
        <Nuxt />
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
    </div>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useSnackbar } from '@/store'

export default {
  data () {
    return {
      render: false
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
  mounted () {
    this.render = true
  },
  methods: { ...mapActions(useSnackbar, ['closeSnackbar']) }
}
</script>
