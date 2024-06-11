<template>
  <div>
    <div v-if="formDialog" class="blur-second-modal" />
    <v-dialog v-model="formDialog" max-width="1200" hide-overlay persistent style="z-index: 200">
      <v-card class="py-14 px-8 rounded-xl">
        <v-row>
          <v-col cols="12 form-wrapper">
            <v-img
              src="https://assets.360suites.com.br/website/carta-email.webp"
              alt="Carta E-mail"
              width="64px"
            />
            <p
              :class="$vuetify.breakpoint.lgAndUp ? 'mb-5 mt-8 text-medium-xl' : 'mb-6 mt-8 text-regular-xs'"
            >
              Obrigado!
            </p>
            <p
              class="mb-10 text-center"
              :class="$vuetify.breakpoint.lgAndUp ? 'text-regular-xs' : 'text-regular-xxs'"
            >
              Recebemos seus dados. Nossa equipe entrará em contato em breve.
            </p>
            <v-btn
              class="radius-login-360 text-unset text-bold-xs secondary"
              color="secondary"
              height="50px"
              @click="closeFormDialog"
            >
              <span class="search-button">Voltar para o site</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: 'ContactFormDialog',
  data () {
    return {
      formDialog: false
    }
  },
  methods: {

    openFormDialog () {
      this.formDialog = true
    },
    closeFormDialog () {
      this.formDialog = false
      this.$router.go()
    }
  }
}
</script>
<style lang="scss" scoped>
.form-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
