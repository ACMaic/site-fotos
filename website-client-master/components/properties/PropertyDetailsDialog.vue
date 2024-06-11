<template>
  <div>
    <div v-if="dialogDetails" class="blur" />
    <v-dialog
      v-model="dialogDetails"
      max-width="1264"
      hide-overlay
      persistent
      :fullscreen="$vuetify.breakpoint.mdAndDown"
    >
      <v-card class="py-4 px-8" :class="$vuetify.breakpoint.lgAndUp ? 'card-radius' : ''">
        <property-header v-if="propertyId" :property-id="propertyId" @closePropertyDetails="dialogDetails = false" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import PropertyHeader from '@/components/properties/PropertyHeader.vue'

export default {
  name: 'PropertyDetailsDialog',
  components: {
    PropertyHeader
  },
  props: {
    propertyId: {
      type: Number,
      required: false,
      default: null
    }
  },
  data () {
    return {
      dialogDetails: false
    }
  },
  methods: {
    openPropertyDetailsDialog () {
      this.dialogDetails = true
    },
    closePropertyDetailsDialog () {
      this.dialogDetails = false
    }
  }

}
</script>

<style scoped lang="scss">
.card-radius {
  border-radius: 40px !important;
}

</style>
