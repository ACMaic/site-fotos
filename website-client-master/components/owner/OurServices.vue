<template>
  <v-container id="ourservices" fluid :style="$vuetify.breakpoint.lgAndUp ? 'padding-left: 6%' : ''" class="mt-12 scroll-margin-owners">
    <title-component :ltr="true" title-normal="Nossos serviços" subtitle="Entenda como a plataforma 360 Suítes funciona" />
    <v-row :class="$vuetify.breakpoint.smAndDown ? 'px-6 flex-nowrap overflow-auto pt-16' : ''" :style="$vuetify.breakpoint.smAndDown ? 'margin-top: 80px;' : 'margin-top: 70px;'">
      <v-col v-for="item in services" :key="item.id" cols="12" md="6">
        <service-card
          :rtl="item.rtl"
          :background-color="$vuetify.breakpoint.smAndDown ? item.mobileBackgroundColor : item.desktopBackgroundColor"
          :border-color="$vuetify.breakpoint.smAndDown ? item.mobileBorderColor : item.desktopBorderColor"
          :title="item.title"
          :description="item.description"
          :src="item.imgPath"
          :alt="item.imgAlt"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { services } from '@/shared/owner'
import TitleComponent from '@/components/shared/Title.vue'
import ServiceCard from '@/components/owner/ServiceCard.vue'

export default {
  name: 'OurServicesComponent',
  components: {
    TitleComponent,
    ServiceCard
  },
  data () {
    return {
      services
    }
  }
}
</script>
