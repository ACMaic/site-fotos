<template>
  <v-container fluid>
    <h2 class="font-weight-medium my-6" :class="$vuetify.breakpoint.xs ? 'text-regular-xs' : 'text-medium-md'">
      O que dizem nossos clientes
    </h2>
    <div v-if="$vuetify.breakpoint.mdAndUp">
      <v-row>
        <v-col cols="5">
          <v-img
            :src="require(`~/static/testimonials.svg`)"
            contain
            width="368px"
            height="416px"
          />
        </v-col>
        <v-col cols="7">
          <v-carousel height="416px" hide-delimiters>
            <v-carousel-item v-for="(item, i) in items" :key="i">
              <div style="display: flex; justify-content: center; justify-items: center; padding: 64px; height: 100%;">
                <v-card elevation="0" class="rounded-xxl align-self-center" max-height="300" min-height="200" width="600">
                  <v-card-title class="justify-center primary--text headline">
                    {{ item.author }}
                  </v-card-title>
                  <v-card-text class="text-center quote">
                    {{ item.testimony }}
                  </v-card-text>
                </v-card>
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row class="mt-12">
        <v-col>
          <v-img
            :src="require(`~/static/testimony-guy.svg`)"
            contain
            class="testimony-guy"
            width="368px"
            height="416px"
          />
          <v-carousel height="416px" hide-delimiters>
            <v-carousel-item v-for="(item, i) in items" :key="i">
              <div style="display: flex; justify-content: center; justify-items: center; padding: 32px; height: 100%;">
                <v-card elevation="0" class="rounded-xxl align-self-center" max-height="300" min-height="200" width="100%">
                  <v-card-title class="justify-center primary--text headline">
                    {{ item.author }}
                  </v-card-title>
                  <v-card-text class="text-center quote">
                    {{ item.testimony }}
                  </v-card-text>
                </v-card>
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { openApi as api360 } from '@/api'

export default {
  name: 'NewTestimonialsComponent',
  data () {
    return {
      items: [],
      isLoading: false
    }
  },
  beforeMount () {
    this.getTestimonials()
  },
  methods: {
    getTestimonials () {
      this.isLoading = true
      api360.get('/client-testimony-api/list-testimonials').then(({ data }) => {
        this.items = [...data,
          {
            author: 'Maicon',
            createdAt: '2023-12-12T17:35:22.553Z',
            id: '657899da28507c5b87d1ae41',
            order: 1,
            testimony: 'Ótimas acomodações',
            updatedAt: '2024-03-14T13:13:29.092Z'
          }
        ]
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      }).finally(() => {
        this.isLoading = false
      })
    },
    formatName (name) {
      return name.substring(0, 30).trim()
    }
  }
}
</script>
<style lang="scss" scoped>
.testimonial-card-desktop {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
}

.testimony-guy {
  position: absolute;
  right: -16px;
  margin-top: -48px;

}

.quote {
  quotes: '"' '"' "'" "'";
}

.quote::before {
  content: open-quote;
}

.quote::after {
  content: close-quote;
}
</style>
