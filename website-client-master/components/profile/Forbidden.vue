<template>
  <div>
    <div v-if="forbiddenDialog" class="blur" />
    <v-dialog
      v-model="forbiddenDialog"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      hide-overlay
      max-width="800"
      persistent
    >
      <v-card class="py-2 px-5">
        <v-container>
          <title-component title-normal="Ação" title-bold="não permitida" />
          <p class="ml-5 mt-sm-n10">
            Não é possível alterar sua senha.<br>Seu login foi realizado através da sua conta {{ provider }}. Para redefinir sua senha, é necessário alterá-la diretamente no {{ provider }}.
          </p>
          <v-row
            class="align-sm-center align-self-sm-center align-sm-content-center"
            justify="end"
          >
            <v-btn
              class="align-sm-center align-self-sm-center align-sm-content-center"
              large
              text
              style="text-transform: inherit !important;"
              color="primary"
              @click="closeForbidden"
            >
              Fechar
            </v-btn>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import TitleComponent from '@/components/shared/Title.vue'

export default {
  name: 'ForbiddenDialog',
  components: {
    TitleComponent
  },
  props: {
    provider: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      forbiddenDialog: false
    }
  },
  methods: {
    openForbidden () {
      this.forbiddenDialog = true
    },
    closeForbidden () {
      this.forbiddenDialog = false
    }

  }
}
</script>
