<template>
  <v-app light class="background-360">
    <header-component v-if="render" :user-name="userName" />
    <v-main v-if="render" class="background-360">
      <v-container class="container-360">
        <v-row>
          <v-col cols="0" lg="3">
            <v-btn
              v-if="$vuetify.breakpoint.mdAndDown"
              icon
              width="30px"
              height="80px"
              class="primaryOwner"
              :class="drawer ? 'chevron-position-right' : 'chevron-position-left'"
              @click="drawer = !drawer"
            >
              <v-icon color="white">
                {{ drawer ? 'fa-solid fa-chevron-left' : 'fa-solid fa-chevron-right' }}
              </v-icon>
            </v-btn>

            <v-navigation-drawer
              v-model="drawer"
              clipped
              :fixed="$vuetify.breakpoint.mdAndDown"
              :permanent="$vuetify.breakpoint.lgAndUp"
              class="background-360"
            >
              <div class="mt-8">
                <v-sheet
                  v-if="$vuetify.breakpoint.lgAndUp"
                  color="background-360"
                  class="mt-2 d-flex flex-column align-center justify-center black--text"
                >
                  <v-icon size="72" color="black" class="pb-5 mr-2">
                    fa-solid fa-circle-user
                  </v-icon>
                  <span class="text-regular-xs mb-4">
                    Olá, {{ userName }}
                  </span>
                </v-sheet>
                <v-col v-else class="mt-8 mb-4 ml-4">
                  <h2 class="text-regular-sm">
                    Perfil
                  </h2>
                  <v-sheet
                    rounded
                    class="my-2 d-flex rounded-lg"
                    height="12"
                    width="80"
                    color="secondary"
                  />
                </v-col>

                <v-list flat>
                  <v-divider class="mb-6 hidden-md-and-down" />
                  <v-list-item
                    v-for="{label, icon, path} in links"
                    :key="label"
                    :class="{'primary--text': $route.fullPath === path}"
                    link
                    :to="path"
                  >
                    <v-list-item-icon class="pr-2 mx-2">
                      <v-icon size="18" :class=" $route.fullPath === label ? 'primary--text' : 'black--text'">
                        {{ icon }}
                      </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <span class="d-flex justify-start text-regular-xxs font-weight-regular">{{ label }} <div :class="{'active-option': $route.fullPath === path}" />
                      </span>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="mt-16" />

                  <v-list-item-icon class="menu-option pointer mt-4 d-flex align-center text-decoration-none" to="/" @click="signOut">
                    <v-icon size="18" class="menu-option ml-4 mr-3 black--text">
                      fa-solid fa-right-from-bracket
                    </v-icon>
                    Sair
                  </v-list-item-icon>
                </v-list>
              </div>
            </v-navigation-drawer>
          </v-col>
          <v-col cols="12" lg="9">
            <nuxt />
          </v-col>
        </v-row>
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
      </v-container>
    </v-main>
    <footer-component v-if="render" />
  </v-app>
</template>

<script>

import { mapState, mapActions } from 'pinia'
import { Auth } from 'aws-amplify'
import HeaderComponent from '@/components/Header'
import FooterComponent from '@/components/Footer'
import { useSnackbar } from '@/store'
import { useCheckUser } from '@/shared/composables/checkUser'

export default {
  name: 'ProfileLayout',
  components: {
    HeaderComponent,
    FooterComponent
  },
  setup (context) {
    const { userName, checkUser, useRouteWatcher } = useCheckUser(context)
    checkUser()
    useRouteWatcher()
    return {
      userName
    }
  },
  data () {
    return {
      links: [
        {
          label: 'Informações Pessoais',
          icon: 'fa-solid fa-user-large',
          path: '/minha-conta/perfil'
        },
        {
          label: 'Minhas Reservas',
          icon: 'fa-sharp fa-solid fa-book-open',
          path: '/minha-conta/reservas'
        }
        /* {
          label: 'Serviços',
          icon: 'fa-solid fa-tag',
          path: '/minha-conta/servicos'
        } */

      ],
      drawer: false,
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
  beforeMount () {
    Auth.currentAuthenticatedUser()
      .catch((err) => {
        this.signOut()
        // eslint-disable-next-line no-console
        console.error(err)
      })
  },
  methods: {
    ...mapActions(useSnackbar, ['closeSnackbar']),
    signOut () {
      Auth.signOut({ global: true })
        .then(() => {
          localStorage.setItem('redirect', this.$route.path)
          this.$router.replace('/login')
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/mixins.scss';
.chevron-position-right {
  position: absolute;
  top: 4.6px;
  left: 260px;
  z-index: 99;
  border-radius: 0 10px 10px 0;
  transform: translateX(-10%);
}

.chevron-position-left {
  position: absolute;
  top: 4.6px;
  left: 0px;
  border-radius: 0 10px 10px 0;
}

.menu-option {
  color: black;
  &:hover {
    color: #C31C4A !important;
  }
}

.active-option {
  position: fixed !important;
  right: -0px;
  width: 10px !important;
  height: 22px !important;
  background-color: #C31C4A !important;
}

.v-navigation-drawer {
  @include phone-only() {
    top: 80px !important;
    border-right: none !important;
  }
  @include tablet-portrait-up () {
    top: 80px !important;
    border-right: none !important;
  }
}

</style>
