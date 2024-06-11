<template>
  <v-container v-if="selectedProperty" fluid class="my-4 px-md-0 pt-8 pt-md-0">
    <v-col v-if="$vuetify.breakpoint.mdAndUp" class="ma-0 pa-0 pb-8">
      <title-component
        v-if="propertyId === null"
        class="px-2"
        title-normal="Edifício"
        :title-bold="selectedProperty.name"
        bold-color-class="primary--text"
      />
    </v-col>
    <v-card
      class="ml-0 mt-n12 py-6 pa-sm-6 pb-md-8 radius-card"
      :class="$vuetify.breakpoint.mdAndUp ? 'white' : 'transparent'"
      flat
      persistent
      max-width="1264"
      height="555"
      :style="propertyId && $vuetify.breakpoint.smAndDown ? 'height: 100%;' : ''"
    >
      <v-row v-if="propertyId">
        <v-col cols="12" class="ma-0 pa-0" align="right">
          <v-btn
            v-if="$vuetify.breakpoint.smAndDown"
            rounded
            icon
            width="40px"
            height="40px"
            class="btn-close mb-4"
            @click="$emit('closePropertyDetails')"
          >
            x
          </v-btn>
        </v-col>
        <v-col cols="12" md="3" lg="auto" class="pa-0 mr-md-8 mr-lg-3 px-2">
          <v-btn
            :ripple="false"
            depressed
            width="100%"
            color="primary"
            class="btn-group px-md-8 mb-2"
            style="cursor: default"
          >
            Edifício {{ selectedProperty.name }}
          </v-btn>
        </v-col>
        <v-col cols="12" md="2" lg="auto" class="ma-0 pa-0 btn-spacing px-2">
          <v-btn
            ref="propRulesDialog"
            outlined
            class="btn-group"
            style="border: 1px solid #0003 !important; background-color: white !important"
            block
            @click="$refs.propRulesDialog.openRulesDialog()"
          >
            Regras do condomínio
          </v-btn>
        </v-col>
        <v-col cols="12" md="2" lg="1" class="ma-0 mt-2 mt-md-0 ml-md-3 pa-0 px-2">
          <v-btn
            outlined
            class="btn-group"
            style="border: 1px solid #0003 !important; background-color: white !important"
            block
            @click="$refs.propMapDialog.openMapDialog()"
          >
            <v-icon size="18" class="mx-1">
              fa fa-location-dot
            </v-icon>
            Mapa
          </v-btn>
        </v-col>

        <v-icon
          :style="$vuetify.breakpoint.smAndDown ? 'display: none' : ''"
          color="primary"
          class="close-btn"
          @click="$emit('closePropertyDetails')"
        >
          fa-solid fa-close
        </v-icon>
      </v-row>
      <v-row class="pt-4">
        <v-col cols="12" md="6" class="ma-0 pa-2 d-flex" max-width="1205">
          <v-img
            class="mx-auto mr-md-6 mr-lg-3"
            :style="firstImg"
            style="border-radius: 20px 40px 40px 1px !important"
            :height="$vuetify.breakpoint.xs ? '200' : '290'"
          >
            <v-btn
              v-if="propertyId"
              elevation="0"
              :icon="$vuetify.breakpoint.smAndDown"
              :width="$vuetify.breakpoint.smAndDown ? '40px' : '200px'"
              :height="$vuetify.breakpoint.smAndDown ? '40px' : '55px'"
              class="desc-regular-xxs text-transform btn-photo white--text ma-2 ma-md-0"
              :class="$vuetify.breakpoint.smAndDown ? 'btn-photo-mobile' : ''"
              @click="$refs.propGalleryDialog.openGalleryDialog()"
            >
              <span v-if="$vuetify.breakpoint.smAndDown"><v-icon class="" size="16"> fas fa-search </v-icon></span>
              <span v-else>Todas as fotos</span>
            </v-btn>
            <h2
              v-if="$vuetify.breakpoint.smAndDown && propertyId === null"
              class="pl-5 pt-6 text-bold-xs white--text"
            >
              Edifício {{ selectedProperty.name || '-' }}
            </h2>
          </v-img>
        </v-col>
        <v-col
          v-if="$vuetify.breakpoint.mdAndUp && selectedProperty?.propertyImages"
          cols="6"
          lg="3"
        >
          <v-img
            :src="selectedProperty?.propertyImages[1]?.url || ''"
            class="mr-lg-3 radius-card"
            cover
            height="290"
          />
        </v-col>
        <v-col v-if="$vuetify.breakpoint.lgAndUp && selectedProperty?.propertyImages" cols="3">
          <v-img
            :src="selectedProperty?.propertyImages[2]?.url || ''"
            class="radius-card"
            cover
            height="290"
          />
        </v-col>
        <v-col
          v-if="selectedProperty?.propertyImages && propertyId === null"
          class="ml-4 ml-md-n2 mt-n16 mt-md-n12"
        >
          <v-btn
            class="mt-n9 text-medium-xxs text-transform rounded-lg"
            height="54"
            rounded
            @click="$refs.propGalleryDialog.openGalleryDialog()"
          >
            Todas as fotos
          </v-btn>
        </v-col>
      </v-row>

      <v-row
        :class="$vuetify.breakpoint.xs && 'mt-4 d-flex flex-column'"
        :max-width="$vuetify.breakpoint.md && '959px'"
      >
        <v-col class="mt-4 ml-md-4 pa-2 pa-md-0">
          <p
            class="ma-0 mb-2 pa-0 text-regular-sm primary--text"
            :class="$vuetify.breakpoint.smAndDown && 'mt-n4 mb-2 text-bold-xs'"
          >
            {{ selectedProperty.name }}
          </p>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span class="mt-sm-n16 mt-md-0 pt-2 black--text" v-html="selectedProperty.address" />
          <v-divider
            v-if="propertyId && $vuetify.breakpoint.smAndDown ? 'mt-8' : ''"
            class="mt-6"
          />
        </v-col>
        <v-col cols="12" md="9" :class="$vuetify.breakpoint.xs ? 'py-0 pb-2 mt-n5 ' : 'py-sm-0'">
          <p
            v-if="$vuetify.breakpoint.mdAndUp"
            class="mt-4 px-4 black--text"
            v-html="selectedProperty.locationDescription"
          />
          <p
            v-else
            class="mt-3 mt-sm-0 black--text"
            :max-height="$vuetify.breakpoint.xs ? '120px' : ''"
          >
            {{ selectedProperty.locationDescription | formatDescription }}
            <!--<a href="#" class="info--text">Ver mais</a>-->
          </p>
        </v-col>
        <v-col cols="12" align="center">
          <v-btn
            v-if="propertyId && $vuetify.breakpoint.smAndDown"
            text
            large
            class="text-medium-xxs text-transform primary--text mt-xs-4 mt-sm-n8"
            @click="$emit('closePropertyDetails')"
          >
            Fechar
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="propertyId === null">
        <v-col cols="3" md="3" lg="auto" class="ma-0 pa-0 mr-md-8 mr-lg-3">
          <v-btn
            :ripple="false"
            depressed
            color="primary"
            class="btn-group px-8 mb-2"
            style="cursor: default"
          >
            Edifício {{ selectedProperty.name }}
          </v-btn>
        </v-col>
        <v-col cols="12" md="3" lg="auto" class="ma-0 pa-0 btn-spacing">
          <v-btn
            ref="propRulesDialog"
            outlined
            class="btn-group"
            style="border: 1px solid #0003 !important; background-color: white !important"
            block
            @click="$refs.propRulesDialog.openRulesDialog()"
          >
            Regras do condomínio
          </v-btn>
        </v-col>
        <v-col cols="12" md="3" lg="1" class="ma-0 mt-2 mt-md-0 ml-md-3 pa-0">
          <v-btn
            outlined
            class="btn-group"
            style="border: 1px solid #0003 !important; background-color: white !important"
            block
            @click="$refs.propMapDialog.openMapDialog()"
          >
            <v-icon size="18" class="mx-1">
              fa fa-location-dot
            </v-icon>
            Mapa
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <gallery-dialog
      ref="propGalleryDialog"
      :title="selectedProperty.name"
      :images="selectedProperty.propertyImages || []"
      :has-title="true"
    />
    <property-map-dialog ref="propMapDialog" :property-name="selectedProperty.name" />
    <property-rules-dialog
      ref="propRulesDialog"
      :property-name="selectedProperty.name"
      :rules="selectedProperty.description1"
    />
  </v-container>
</template>

<script>
import TitleComponent from '@/components/shared/Title.vue'
import GalleryDialog from '~/components/properties/GalleryDialog.vue'
import PropertyMapDialog from '@/components/properties/PropertyMapDialog.vue'
import PropertyRulesDialog from '@/components/properties/PropertyRulesDialog.vue'
import { openApi as api360 } from '@/api'

export default {
  name: 'PropertyHeader',
  components: {
    TitleComponent,
    GalleryDialog,
    PropertyMapDialog,
    PropertyRulesDialog
  },

  filters: {
    formatDescription (description) {
      if (description && description.length > 184) {
        return `${description.substring(0, 185).trim()}...`
      }
      return description
    }
  },
  props: {
    selectedPropertyIds: {
      type: Array,
      required: false,
      default: () => []
    },
    buildings: {
      type: Array,
      required: false,
      default: () => []
    },
    propertyId: {
      type: Number,
      required: false,
      default: null
    }
  },
  emits: ['closePropertyDetails'],
  data: () => ({
    selectedProperty: null
  }),
  computed: {
    firstImg () {
      let url = 'https://assets.360suites.com.br/website/no_image.png'
      if (this.selectedProperty?.propertyImages.length > 0) {
        const [first] = this.selectedProperty.propertyImages
        url = first.url
      }
      const gradient = this.$vuetify.breakpoint.xs
        ? 'rgba(0,0,0,0.30), rgba(0,0,0,0.40)'
        : 'rgba(0,0,0,0.10), rgba(0,0,0,0.20)'
      return `background-image: linear-gradient(${gradient}), url(${url}); background-size: cover; background-position: center`
    }
  },
  watch: {
    selectedPropertyIds () {
      this.toggleHeader()
    }
  },
  mounted () {
    if (this.propertyId !== null) {
      this.getProperty(this.propertyId)
      return
    }
    this.toggleHeader()
  },
  methods: {
    getProperty (id) {
      api360
        .post('/property-api/website/list-by-ids', {
          propertyIds: [id]
        })
        .then(({ data }) => {
          const [selected] = data
          this.selectedProperty = selected
        })
        .catch(() => {
          this.selectedProperty = null
        })
    },
    toggleHeader () {
      if (this.selectedPropertyIds && this.selectedPropertyIds.length === 1) {
        const [propertyId] = this.selectedPropertyIds
        this.getProperty(propertyId)
      } else {
        this.selectedProperty = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/mixins.scss';

.btn-close {
  background-color: #c31c4a !important;
  color: #fff !important;
}

.close-btn {
  position: absolute;
  right: 24px;
}

.btn-spacing {
  @include small-iphone-only() {
    margin-top: 30px !important;
  }
}

.btn-group {
  height: 40px !important;
  border-radius: 25px !important;
  font-size: 16px !important;
  font-weight: 400 !important;
  text-transform: inherit !important;

  @include small-iphone-only() {
    margin-top: -32px !important;
    margin-bottom: 40px !important;
  }
}
.btn-photo {
  position: absolute !important;
  z-index: 99 !important;
  border-radius: 10px;
  background-color: #c31c4a !important;
}

.btn-photo-mobile {
  background-color: #333 !important;
  border-radius: 25px !important;
}
</style>
