// This component was made as wrapper to fix overflow scroll issue in desktop resolutions since
// the original VSlideGroup on its onScroll function always sets position to zero
// https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/components/VSlideGroup/VSlideGroup.ts#L257
import VSlideGroup from 'vuetify/lib/components/VSlideGroup/VSlideGroup'

export default {
  name: 'CustomVSlideGroup',
  extends: VSlideGroup,
  props: {
    showArrows: {
      type: [Boolean, String],
      validator: v => (
        typeof v === 'boolean' || [
          'always',
          // covers https://github.com/vuetifyjs/vuetify/pull/14587 that will be realeased in v2.7
          'never',
          'desktop',
          'mobile'
        ].includes(v)
      )
    }
  },
  computed: {
    hasAffixes () {
      switch (this.showArrows) {
        // Always show arrows on desktop & mobile
        case 'always': return true

          // Always show arrows on desktop
        case 'desktop': return !this.isMobile

          // Show arrows on mobile when overflowing.
          // This matches the default 2.2 behavior
        case true: return this.isOverflowing || Math.abs(this.scrollOffset) > 0

          // Always show on mobile
        case 'mobile': return (
          this.isMobile ||
              (this.isOverflowing || Math.abs(this.scrollOffset) > 0)
        )

        case 'never': return false

          // https://material.io/components/tabs#scrollable-tabs
          // Always show arrows when
          // overflowed on desktop
        default: return (
          !this.isMobile &&
              (this.isOverflowing || Math.abs(this.scrollOffset) > 0)
        )
      }
    }
  },
  methods: {
    onScroll: () => {
      return null
    }
  }
}
