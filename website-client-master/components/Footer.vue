<template>
  <v-container
    id="footer"
    fluid
    class="pa-0 footer-wrapper-desktop"
    min-height="214"
    :max-height="$vuetify.breakpoint.lgAndUp ? '214' : ''"
    style="overflow: hidden;"
  >
    <v-footer class="greyBackground" color="greyBackground">
      <v-row class="container-360">
        <v-col cols="12" md="3" class="mx-auto mx-sm-0" :align="$vuetify.breakpoint.mdAndUp ? '' : 'center'">
          <nuxt-link to="/">
            <v-img
              src="https://assets.360suites.com.br/logos/logo.svg"
              alt="360 Suítes Logo"
              max-width="200px"
              class="mt-6"
            />
          </nuxt-link>
        </v-col>
        <v-col cols="12" md="3" :align="$vuetify.breakpoint.mdAndUp ? '' : 'center'" class="mx-auto mx-sm-0 pt-md-8 my-3">
          <span class="text-medium-sm lightBlack--text">
            Redes Sociais
          </span>
          <v-col cols="12">
            <a
              v-for="(social, index) in socialMedia"
              :key="index"
              class="mr-md-4 mr-4 text-decoration-none"
              :href="social.link"
              target="_blank"
            ><v-icon class="social-icon-size" color="lightBlack">{{ social.icon }}</v-icon></a>
          </v-col>
        </v-col>
        <v-col v-if="$vuetify.breakpoint.smAndDown" cols="12" class="justify-center my-3 mx-auto mx-sm-0" align="center">
          <nuxt-link
            v-for="(link, index) in links"
            :key="index"
            class="d-block black-link py-3 px-4 desc-medium-xxs text-decoration-underline"
            :to="link.path"
          >
            {{ link.content }}
          </nuxt-link>
        </v-col>

        <v-col cols="12" md="3" :align="$vuetify.breakpoint.mdAndUp ? '' : 'center'" class="mx-auto mx-sm-0 pt-md-8 my-3">
          <span class="text-medium-sm lightBlack--text">
            Fale Conosco
          </span>
          <small class="footer-text lightBlack--text" style="white-space: nowrap;">
            <a
              v-for="(contact, index) in contactOptions"
              :key="index"
              class="d-block black-link py-1"
              :href="contact.link"
            >
              <v-icon class="contact-icon-size" color="lightBlack">{{ contact.icon }}</v-icon>
              {{ contact.content }}
            </a>
          </small>
        </v-col>
        <v-col cols="12" md="3" :align="$vuetify.breakpoint.mdAndUp ? '' : 'center'" class="mx-sm-0 pt-md-8 my-3 pl-md-12">
          <span class="text-medium-sm lightBlack--text">
            Endereço
          </span>
          <small class="footer-text lightBlack--text">
            <a
              href="http://maps.google.com/?q=Av. Marquês de São Vicente, 121 Santa Cecilia, São Paulo / SP CEP /
                      01139-001"
              target="_blank"
              class="d-block black-link py-1"
            >Av. Marquês de São Vicente<br>
              Santa Cecilia - São Paulo - SP<br>
              CEP 01139-001</a>
          </small>
        </v-col>
        <v-col v-if="$vuetify.breakpoint.lgAndUp" cols="12" class="d-flex justify-center mt-n7">
          <nuxt-link
            v-for="(link, index) in links"
            :key="index"
            class="d-block black-link py-3 px-4 desc-medium-xxs"
            :class="$vuetify.breakpoint.mdAndDown ? 'text-decoration-underline' : ''"
            :to="link.path"
          >
            {{ link.content }}
          </nuxt-link>
        </v-col>
      </v-row>
    </v-footer>
  </v-container>
</template>

<script>
import { links, socialMedia, contactOptions as defaultContacts } from '@/shared/footer.js'
export default {
  name: 'FooterComponent',
  props: {
    contactOptions: {
      type: Array,
      default: () => defaultContacts
    }
  },
  data: () => ({
    links,
    socialMedia
  })
}
</script>

<style lang="scss" scoped>
@import '~/assets/mixins.scss';
.footer-wrapper-desktop {
  align-items: center !important;
  justify-content: center;
}

.social-icon-size {
  font-size: 28px !important;
}

.contact-icon-size {
  font-size: 16px !important;
}
</style>
