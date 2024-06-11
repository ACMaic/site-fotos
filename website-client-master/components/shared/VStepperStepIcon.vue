<script>
import { VStepperStep } from 'vuetify/lib/components/VStepper'
export default {
  name: 'v-stepper-step-icon',
  // eslint-disable-next-line
  extends: VStepperStep,
  methods: {
    genStepContent () {
      const children = []
      if (this.hasError) {
        children.push(this.genIcon(this.errorIcon))
      } else if (this.complete) {
        if (this.editable) {
          children.push(this.genIcon(this.editIcon))
        } else {
          children.push(this.genIcon(this.completeIcon))
        }
      } else if (this.$attrs.icon) {
        children.push(this.genIcon(this.$attrs.icon))
      } else {
        children.push(String(this.step))
      }
      return children
    }
  }
}
</script>
