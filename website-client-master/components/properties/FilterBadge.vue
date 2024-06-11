<template>
  <v-chip
    class="badge px-3 py-1 rounded"
    :class="badgeSelected ? 'white--text': 'black--text'"
    :color="badgeSelected ? 'primary': 'white'"
    @click="toggleSelected"
  >
    <v-icon
      size="12px"
      :color="badgeSelected ? 'white': 'lightBlack'"
      class="icon"
    >
      {{ iconName }}
    </v-icon>
    {{ name }}
  </v-chip>
</template>

<script>
export default {
  name: 'FilterBadgeComponent',
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    iconName: {
      type: String,
      required: true
    },
    badgeSelected: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    toggleSelected () {
      this.$emit('selected', {
        id: this.id,
        selected: !this.badgeSelected
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.badge {
  font-size: 12px;
  line-height: 18px;
  gap: 4px;

  .icon {
    margin-right: 8px;
  }
}
</style>
