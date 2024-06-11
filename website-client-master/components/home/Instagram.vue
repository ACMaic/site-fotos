<template>
  <v-container fluid>
    <h2 class="font-weight-medium my-6" :class="$vuetify.breakpoint.xs ? 'text-regular-xs': 'text-medium-md'">
      Nos siga no Instagram
    </h2>
    <custom-v-slide-group multiple hide-arrows show-arrows="desktop">
      <div id="instafeed" />
    </custom-v-slide-group>
  </v-container>
</template>

<script>
import axios from 'axios'
import Instafeed from '~/shared/scripts/instafeed.min'
import CustomVSlideGroup from '@/components/shared/CustomVSlideGroup'

export default {
  name: 'InstagramComponent',
  components: {
    CustomVSlideGroup
  },
  data () {
    return {
      instafeed: null
    }
  },
  beforeMount () {
    this.getInsta()
  },
  methods: {
    getInsta () {
      axios
        .get(
          'https://ig.instant-tokens.com/users/de1bc14b-2326-4501-83f9-e83075af70e5/instagram/6198909353543271/token?userSecret=sa9izxyfpg8yfw1h57r5kg'
        )
        .then(({ data }) => {
          const feed = new Instafeed({
            accessToken: data.Token,
            template:
              '<div class="insta-item"><a href="{{link}}" target="_blank"><img src="{{image}}" alt="{{caption}}"></a></div>',
            resolution: 'standard_resolution'
          })
          feed.run()
        })
    }
  }
}
</script>

<style>
#instafeed {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: space-around !important;
}

.insta-item {
  margin: 10px !important;
}

.insta-item img {
  height: 300px !important;
}
</style>
