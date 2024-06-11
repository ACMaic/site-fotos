<template>
  <v-app-bar
    v-if="$vuetify.breakpoint.lgAndUp"
    style="z-index: 4 !important"
    app
    dense
    color="lightBlack"
    height="55"
    elevation="0"
  >
    <v-toolbar dense color="primaryOwner" height="55" class="container-360" elevation="0">
      <v-toolbar-title>
        <nuxt-link to="/">
          <v-img
            src="https://assets.360suites.com.br/logos/logo-white.svg"
            alt="360 Suítes Logo"
            width="70"
            min-width="70"
            contain
          />
        </nuxt-link>
      </v-toolbar-title>

      <v-spacer />

      <span
        class="pointer text-capitalize header-options-desktop ml-6 secondary--text text-decoration-none"
        @click="goToReservation"
      >
        <span> Reserve já! </span>
      </span>

      <a
        href="https://mensalistas.360suites.com.br/more-na-360-2024-fev"
        target="_blank"
        class="text-capitalize header-options-desktop ml-6 white-link"
      >
        Plano Mensal
      </a>
      <a
        href="https://lp.360suites.com.br/corporativo/"
        target="_blank"
        class="text-capitalize header-options-desktop ml-6 white-link"
      >
        Empresas
      </a>

      <a
        href="https://app.pipefy.com/public/form/Az3SAjBV"
        target="_blank"
        class="text-capitalize header-options-desktop ml-6 white-link"
      >
        Trabalhe Conosco
      </a>

      <a
        class="text-capitalize header-options-desktop ml-6 white-link"
        href="https://blog.360suites.com.br/"
        target="_blank"
      >
        Blog
      </a>
      <a
        class="text-capitalize header-options-desktop ml-6 white-link"
        href="https://proprietarios.360suites.com.br"
        target="_blank"
      >
        Proprietários
      </a>
      <a
        v-if="!userName"
        class="text-capitalize header-options-desktop ml-6 white-link mt-1"
        @click="login"
      >
        <v-icon size="26" color="white" class="mr-2"> fas fa-circle-user </v-icon>
        {{ userName || 'Entrar' }}
      </a>
      <v-menu
        v-else
        auto
        offset-y
        open-on-hover
        rounded="xl"
        class="mt-12"
      >
        <template #activator="{ attrs, on }">
          <span
            class="text-capitalize header-options-desktop ml-6 white-link mt-2"
            v-bind="attrs"
            v-on="on"
          ><v-icon size="26" color="white" class="mr-2"> fas fa-circle-user </v-icon>
            {{ userName || 'Entrar' }}</span>
        </template>
        <v-list class="py-6 px-3">
          <v-list-item flat dense @click="$router.push('/minha-conta/perfil')">
            Área do cliente
          </v-list-item>
          <v-list-item flat dense @click="signOut">
            Sair
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
  </v-app-bar>

  <div v-else>
    <v-app-bar color="lightBlack" height="75" elevation="0" style="z-index: 4 !important">
      <nuxt-link to="/">
        <v-img
          src="https://assets.360suites.com.br/logos/logo-white.svg"
          alt="360 Suítes Logo"
          width="70"
          class=""
        />
      </nuxt-link>

      <v-spacer />
      <v-btn text color="white" @click="drawer = true">
        <v-icon size="30">
          fas fa-bars
        </v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary color="primaryOwner">
      <nuxt-link to="/">
        <v-img
          src="https://assets.360suites.com.br/logos/logo-white.svg"
          alt="360 Suítes Logo"
          width="120"
          min-width="100"
          height="70"
          contain
          class="ma-6"
        />
      </nuxt-link>
      <v-list nav dense>
        <v-list-item>
          <span

            class="pointer secondary--text header-options-mobile mt-2 text-decoration-none mb-8"
            @click="goToReservation"
          >
            <span> Reserve já! </span>
          </span>
        </v-list-item>
        <v-list-item
          v-for="(item, index) in headerMobileOptions"
          :key="index"
        >
          <a
            v-if="item.isExternal"
            :href="item.path"
            class="white--text header-options-mobile mt-2 text-decoration-none mb-8"
            target="_blank"
          >{{ item.label }}</a>
          <nuxt-link
            v-else
            :to="`${item.path}`"
            class="white--text header-options-mobile mt-2 text-decoration-none mb-8"
          >
            {{ item.label }}
          </nuxt-link>
        </v-list-item>
        <a v-if="!userName" class="text-capitalize header-options-mobile white-link" @click="login">
          <v-icon size="26" color="white" class="mb-1 ml-1"> fas fa-circle-user </v-icon>
          {{ userName || 'Entrar' }}
        </a>
        <v-menu
          v-else
          auto
          offset-y
          open-on-hover
          rounded="xl"
          class="mt-12"
        >
          <template #activator="{ attrs, on }">
            <span
              class="text-capitalize header-options-mobile ml-2 white-link"
              v-bind="attrs"
              v-on="on"
            ><v-icon size="26" color="white" class="mr-2 mb-1"> fas fa-circle-user </v-icon>
              {{ userName || 'Entrar' }}
              <v-list>
                <v-list-item
                  flat
                  class="background--text mt-2"
                  dense
                  @click="$router.push('/minha-conta/perfil')"
                >
                  Área do cliente
                </v-list-item>
                <v-list-item class="background--text" flat dense @click="signOut">
                  Sair
                </v-list-item>
              </v-list>
            </span>
          </template>
        </v-menu>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import { openApi as api360 } from '@/api'
import { headerMobileOptions } from '@/shared/header'
import { useFilters } from '@/shared/composables'

export default {
  name: 'HeaderComponent',
  props: {
    userName: {
      type: String,
      default: '',
      required: false
    }
  },
  setup () {
    const { startSearchProperties } = useFilters()
    return {
      startSearchProperties
    }
  },
  data: () => ({
    drawer: false,
    headerMobileOptions,
    buildings: [],
    isLoading: false.valueOf
  }),
  beforeMount () {
    this.getBuildings()
  },
  methods: {
    signOut () {
      Auth.signOut({ global: true })
        .then(() => {
          // eslint-disable-next-line vue/no-mutating-props
          this.userName = ''
          this.$router.push('/')
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error)
        })
    },
    getBuildings () {
      this.isLoading = true
      api360
        .get('/property-api/website')
        .then(({ data }) => {
          this.buildings = data
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    login () {
      localStorage.setItem('redirect', '/')
      this.$router.push('/entrar')
    },
    goToReservation () {
      this.startSearchProperties([], this.buildings, 2, [])
    }
  }
}
</script>

<style lang="scss">
div.v-toolbar__content {
  padding: 0 8px !important;
}
</style>
