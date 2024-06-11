<template>
  <div class="container-360 pa-0">
    <banner />
    <div :class="$vuetify.breakpoint.lgAndUp ? 'rounded-content-header' : ''">
      <!--<div class="alert-wrapper">
        <v-alert
          prominent
          color="#FFFBE6"
          class="px-8 py-4"
        >
          <div>
            <v-icon class="mt-n1 mr-2" color="#FAAD14" size="32">
              fas fa-info-circle
            </v-icon> <span :class="$vuetify.breakpoint.smAndUp ? 'text-regular-xs' : 'text-regular-xxs'" class="mt-2">ATENÇÃO: Cuidado com golpes!</span>
          </div>
          <div class="mt-3 ml-md-10">
            <span class="text-regular-xxs">Todos os nossos pagamentos são confirmados no ato da reserva. Caso receba alguma mensagem via Whatsapp ou outras plataformas solicitando pagamento ou dados bancários, entre em contato imediatamente através do nosso número oficial: (11) 96171-8008.</span>
          </div>
        </v-alert>
      </div>-->

      <highlighted id="highlighted-suites" />
      <our-differences />
      <new-testimonials />
      <instagram />
    </div>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import Banner from '@/components/home/Banner.vue'
import NewTestimonials from '@/components/home/NewTestimonials.vue'
import OurDifferences from '@/components/home/OurDifferences.vue'
import Highlighted from '@/components/home/Highlighted.vue'
import { useFilters } from '@/shared/composables'
import { usePaymentStore } from '@/store'
import Instagram from '@/components/home/Instagram.vue'
import { sendForm, hubspotForm } from '@/api'

export default {
  name: 'IndexPage',
  components: {
    Banner,
    OurDifferences,
    NewTestimonials,
    Highlighted,
    Instagram
  },
  setup () {
    const { clearFilter } = useFilters()
    const { resetPaymentStore } = usePaymentStore()
    return {
      clearFilter,
      resetPaymentStore
    }
  },
  beforeMount () {
    if (this.$route.fullPath.includes('access_token=')) {
      Auth.currentAuthenticatedUser().then((response) => {
        this.userLogged = true
        sendForm([
          {
            name: 'email',
            value: response?.attributes?.email
          },
          {
            name: 'firstname',
            value: response?.attributes?.given_name
          },
          {
            name: 'lastname',
            value: response?.attributes?.family_name
          }
        ], {
          pageUri: hubspotForm.googleSignup.pageUri,
          pageName: hubspotForm.googleSignup.pageName
        }, hubspotForm.googleSignup.id)
      }).catch(() => {
        this.userLogged = false
      })
    }
    this.clearFilter()
    const redirect = localStorage.getItem('redirect')
    if (redirect !== null && redirect !== '/') {
      if (redirect.includes('minha-conta') || redirect.includes('pagamento') || redirect.includes('checkin')) {
        Auth.currentAuthenticatedUser().then((response) => {
          localStorage.removeItem('redirect')
          this.$router.push(redirect)
        }).catch(() => {
          localStorage.removeItem('redirect')
        })
      }
    } else {
      this.resetPaymentStore()
      localStorage.setItem('dates', [])
      localStorage.setItem('guests', 1)
    }
  }
}
</script>
<style scoped lang="scss">
.alert-wrapper {
  padding: 4% 4% 0 5%;
}
</style>
