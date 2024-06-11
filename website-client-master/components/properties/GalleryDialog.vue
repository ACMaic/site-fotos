<template>
  <div>
    <div v-if="dialogGallery" class="blur" />
    <v-dialog
      v-model="dialogGallery"
      max-width="1264"
      height="794"
      :fullscreen="$vuetify.breakpoint.mdAndDown"
      hide-overlay
      persistent
    >
      <v-card class="card-radius pa-8">
        <dialog-title-component
          v-if="hasTitle"
          :property-name="title"
          style="position: absolute !important; margin-top: 30px !important;"
        />
        <v-row no-gutters :class="$vuetify.breakpoint.mdAndDown ? 'pt-12 px-6' : ''">
          <v-col cols="6" align="left">
            <p>{{ currentImage + 1 }} de {{ images.length }}</p>
          </v-col>
          <v-col cols="6" align="right">
            <v-btn
              medium
              text
              class="rounded-lg"
              color="primary"
              @click="closeGalleryDialog"
            >
              x
            </v-btn>
          </v-col>
          <v-col cols="12" class="mt-5 mb-5">
            <v-carousel
              v-model="currentImage"
              continuous
              cycle
              :show-arrows="true"
              hide-delimiter-background
              delimiter-icon="fas fa-minus"
              max-height="610"
              width="992"
            >
              <v-carousel-item
                v-for="(image, i) in images"
                :key="i"
                :src="image.url"
              />
            </v-carousel>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import DialogTitleComponent from '@/components/shared/DialogTitle.vue'
export default {
  name: 'GalleryDialog',
  components: {
    DialogTitleComponent
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    hasTitle: {
      type: Boolean,
      default: false
    },
    images: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  data () {
    return {
      dialogGallery: false,
      currentImage: 0
    }
  },
  methods: {
    openGalleryDialog () {
      this.dialogGallery = true
    },
    closeGalleryDialog () {
      this.dialogGallery = false
    }
  }
}
</script>

<style scoped lang="scss">
    .card-radius {
      border-radius: 40px !important;
    }

  </style>
