<template>
  <div class="service-card d-flex gap-16" :class="$vuetify.breakpoint.smAndDown ? 'flex-column' : rtl ? '' : 'flex-row-reverse'" :style="backgroundColor ? `background-color: ${backgroundColor};` : `border: 1px solid ${borderColor}`">
    <div v-if="$vuetify.breakpoint.smAndDown" style="height: 55px;" />
    <div class="d-flex flex-column gap-10 service-card--content">
      <h3 class="title">
        {{ title }}
      </h3>
      <v-sheet
        class="mx-auto my-1 ml-0 d-sm-flex rounded-pill"
        height="8"
        width="69"
        color="secondary"
      />
      <div class="description-wrapper">
        <p v-for="item in description" :key="item" class="description">
          {{ item }}
        </p>
      </div>
    </div>
    <img class="service-card--img" :src="src" :alt="alt" :style="`${$vuetify.breakpoint.smAndDown ? '' : rtl ? 'right: 16px' : 'left: 16px'}`">
  </div>
</template>

<script>

export default {
  name: 'ServiceCardComponent',
  props: {
    rtl: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: Array,
      required: true
    },
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    },
    backgroundColor: {
      type: String,
      required: false,
      default: ''
    },
    borderColor: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      isRtlAndDesktop: true
    }
  },
  mounted () {
    this.isRtlAndDesktop = this.rtl && this.$vuetify.breakpoint.lgAndUp
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/mixins.scss';
$image-size: 280px;
$px-content: 14px;

.service-card {
  position: relative;
  border-radius: 24px;
  padding: 16px 4px;
  margin-bottom: 80px;
  min-height: 232px;
  @include tablet-portrait-down() {
    min-height: 330px;
  }
}
.service-card--content {
  padding: 0 $px-content;

  @include desktop-up() {
    max-width: calc(100% - #{$image-size} - #{$px-content});
  }
}
.service-card--img {
  width: $image-size;
  height: $image-size;
  border-radius: 24px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  @include tablet-portrait-down() {
    width: 250px;
    height: 140px;
    top: 0;
    right: 50%;
    transform: translate(50%, -50%);
  }
  @include phone-only() {
    width: 230px;
  }
}
.title {
  font-size: 18px;
  line-height: 100%;
}
.description-wrapper {
  @include phone-only() {
    max-width: 100%;
  }
}
.description {
  font-size: 14px;
  line-height: 18px;
  @include big-desktop-up() {
    font-size: 16px;
  }
}
</style>
