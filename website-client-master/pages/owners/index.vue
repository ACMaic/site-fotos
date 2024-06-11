<template>
  <div>
    <BannerOwner />
    <our-services />
    <PurchaseService />
    <contact-form />
  </div>
</template>

<script>
import BannerOwner from '@/components/owner/BannerOwner.vue'
import OurServices from '@/components/owner/OurServices.vue'
import PurchaseService from '@/components/owner/PurchaseServices.vue'
import ContactForm from '@/components/owner/ContactForm.vue'

export default {
  name: 'OwnersPage',
  components: {
    BannerOwner,
    OurServices,
    PurchaseService,
    ContactForm
  },
  layout: 'owners'
}
</script>
