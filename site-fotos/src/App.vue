<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <v-sheet class="ml-0 mt-n12 py-6 pa-sm-6 pb-md-8 radius-card v-card v-card--flat theme--light white" style="height: 555px; max-width: 1264px;">
              <v-row class="pt-4">
                <v-col cols="12" md="6" class="d-flex ma-0 pa-2">
                  <v-image
                    class="v-responsive mx-auto mr-md-6 mr-lg-3 theme--light"
                    style="height: 290px; border-radius: 20px 40px 40px 1px !important; background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2)), url('https://beds24.360suites.com.br/images/205067/Fachada.jpg');
                           background-size: cover; background-position: center center;">
                    <div class="v-responsive__content"></div>
                  </v-image>
                </v-col>
                <v-col cols="6" lg="3">
                  <v-image
                    class="v-responsive mr-lg-3 radius-card theme--light"
                    cover
                    style="height: 290px;"
                    :src="images[1]?.url">
                  </v-image>
                </v-col>
                <v-col cols="3">
                  <v-image
                    class="v-responsive radius-card theme--light"
                    cover
                    style="height: 290px;"
                    :src="images[2]?.url">
                  </v-image>
                </v-col>
                <v-col class="ml-4 ml-md-n2 mt-n16 mt-md-n12">
                  <v-btn @click="openGallery" class="mt-n9 text-medium-xxs text-transform rounded-lg v-btn--is-elevated v-btn--has-bg v-btn--rounded theme--light" style="height: 54px;">
                    <span class="v-btn__content">Todas as fotos</span>
                  </v-btn>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="3">
                  <p class="ma-0 mb-2 pa-0 text-regular-sm primary--text">360 Apeninos</p>
                  <span class="black--text">R. Apeninos, 1131 - Vila Mariana, São Paulo - SP</span>
                </v-col>
                <v-col cols="12" md="9" class="py-sm-0">
                  <p class="mt-4 px-4 black--text"></p>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>


      <v-dialog v-model="galleryDialog" max-width="800px">
        <v-card>
          <v-card-title>Galeria de Fotos</v-card-title>
          <v-card-text>
            <v-carousel show-arrows="hover" cycle hide-delimiter-background>
              <v-carousel-item v-for="(image, i) in images" :key="i">
                <v-sheet>
                  <img :src="image.url" :alt="'Slide ' + (i + 1)" class="carousel-image"/>
                </v-sheet>
              </v-carousel-item>
            </v-carousel>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const images = ref([]);
    const galleryDialog = ref(false);

    const openGallery = () => {
      galleryDialog.value = true;
    };

    const fetchImages = async () => {
      try {
        const response = await axios.get('https://api.360suites.com.br/room-api/233789');
        images.value = response.data.property.propertyImages;
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    onMounted(() => {
      fetchImages();
    });

    return { images, galleryDialog, openGallery };
  }
};
</script>

<style scoped>
.radius-card {
  border-radius: 20px;
}

.carousel-image {
  width: 100%;
  height: 500px;
  object-fit: cover;
}

.main-image {
  border-radius: 20px 40px 40px 1px !important;
  background-size: cover;
  background-position: center center;
}

.sub-image {
  height: 290px;
  background-size: cover;
  background-position: center center;
}
</style>
