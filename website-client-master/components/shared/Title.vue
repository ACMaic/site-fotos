<template>
  <div class="mt-2" :class="ltr ? 'd-flex flex-column align-start' : ''">
    <v-row class="d-flex d-sm-none" :style="ltr ? '': 'max-width: 170px'" :class="ltr ? 'ma-0 justify-start flex-column' : 'mx-auto justify-center'">
      <h2 class="text-regular-xs text-center" :class="colorClass" :style="ltr ? 'text-align: left !important' : ''">
        {{ titleNormal }} <span class="font-weight-medium" :class="boldColorClass">{{ titleBold }}</span>
      </h2>
      <!---<v-sheet
        rounded="rounded"
        class="my-2"
        :class="ltr ? 'mx-0' : 'mx-auto d-flex d-sm-none justify-center'"
        height="8"
        width="109"
        color="secondary"
      />-->
    </v-row>
    <v-row class="ma-0 pa-0">
      <v-col class="px-0">
        <div>
          <h2 class="d-none d-sm-flex flex-row title-medium-md" :class="colorClass">
            {{ titleNormal }}<span v-if="titleBold" class="font-weight-medium" :class="boldColorClass">&nbsp;{{ titleBold }}</span>
          </h2>
          <!--<v-sheet
            class="mx-auto my-1 ml-0 d-none d-sm-flex rounded-pill"
            height="16"
            width="130"
            color="secondary"
          />-->
          <p
            class="mx-auto"
            :class="
              $vuetify.breakpoint.smAndUp
                ? 'text-regular-xs py-4'
                : ltr ? 'text-regular-xxs text-left' : 'text-regular-xxs text-center'
            "
            :style="$vuetify.breakpoint.xs && !ltr && 'max-width: 270px'"
          >
            {{ subtitle }}
          </p>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'TitleComponent',
  props: {
    titleNormal: {
      type: String,
      required: true
    },
    titleBold: {
      type: String,
      required: false,
      default: ''
    },
    titlePrimary: {
      type: String,
      required: false,
      default: ''
    },
    subtitle: {
      type: String,
      required: false,
      default: ''
    },
    colorClass: {
      type: String,
      required: false,
      default: 'text-black'
    },
    boldColorClass: {
      type: String,
      required: false,
      default: 'text-black'
    },
    ltr: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>
