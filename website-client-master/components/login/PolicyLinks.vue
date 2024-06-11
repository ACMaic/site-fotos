<template>
  <v-row v-if="$vuetify.breakpoint.smAndUp" class="login-footer mx-auto pt-2 login-360">
    <v-col class="d-flex justify-space-between px-0">
      <span class="copyright desc-regular-xxs mr-3 text-center">Copyright &copy; {{ new Date().getFullYear() }}.</span>
      <span>
        <nuxt-link to="/politica-de-privacidade" class="mx-1">
          <span class="desc-regular-xxs">Política de Privacidade</span>
        </nuxt-link>
        <nuxt-link to="/politicas-cancelamento" class="mr-1">
          <span class="desc-regular-xxs">Política de Cancelamento</span>
        </nuxt-link>
        <nuxt-link to="/termos-de-uso">
          <span class="desc-regular-xxs">Termos de uso</span>
        </nuxt-link>
      </span>
    </v-col>
  </v-row>
  <v-row v-else class="login-footer pa-1">
    <v-col cols="3" class="pr-0 pt-6">
      <span class="copyright desc-regular-xxs mr-3 text-center">Copyright &copy; {{ new Date().getFullYear() }}.</span>
    </v-col>
    <v-col cols="3" class="pt-6">
      <nuxt-link to="/politica-de-privacidade" class="mx-1">
        <span class="desc-regular-xxs">Política de Privacidade</span>
      </nuxt-link>
    </v-col>
    <v-col cols="3" class="pt-6 pl-1">
      <nuxt-link to="/politicas-cancelamento" class="mr-1">
        <span class="desc-regular-xxs">Política de Cancelamento</span>
      </nuxt-link>
    </v-col>
    <v-col cols="3" class="pt-6">
      <nuxt-link to="/termos-de-uso">
        <span class="desc-regular-xxs">Termos de uso</span>
      </nuxt-link>
    </v-col>
  </v-row>
</template>

<script>

export default {
  name: 'PolicyLinks'
}
</script>

<style lang="scss" scoped>
.copyright  {
  color: #707070 !important;
}
</style>
