<template>
  <div
    class="pa-3 modal-title"
    :class="$vuetify.breakpoint.xs ? 'pa-6' : 'pa-5'"
  >
    <span
      :class="$vuetify.breakpoint.xs ? 'text-medium-xxs' : 'text-medium-xl'"
    >
      Edifício {{ propertyName }}
    </span>
  </div>
</template>
<script>
export default {
  name: 'DialogTitleComponent',
  props: {
    propertyName: {
      type: String,
      default: '360 Luz'
    },
    type: {
      type: String,
      default: 'gallery'
    }
  }
}
</script>
<style scoped lang="scss">
@import '~/assets/mixins.scss';

.modal-title {
  background-color: var(--v-primary-base);
  height: 75px;
  width: 75%;
  z-index: 5;
  color: #fff;
  border-radius: 0 50px 50px 0 !important;

  @include small-iphone-only() {
  padding-top: 12px !important;
 }
}
</style>
