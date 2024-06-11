<script>
import { VStepper } from 'vuetify/lib'
// stepper step types by component name, so the VStepperIcon
// is able to display different types of stepper steps
const STEPPER_STEP_COMPONENTS = ['v-stepper-step', 'v-stepper-step-icon']
// comparing name to possible stepper step component names
const isStepperStepComponent = (componentList) => {
  return name => componentList.includes(name)
}
// function to check if a string is in the allowed componentList
const isStep = isStepperStepComponent(STEPPER_STEP_COMPONENTS)
export default {
  // name is in dash-case, as Vuetify uses that
  // eslint-disable-next-line
  name: 'v-stepper-icon',
  extends: VStepper,
  methods: {
    register (item) {
      if (isStep(item.$options.name)) {
        this.steps.push(item)
      } else if (item.$options.name === 'v-stepper-content') {
        item.isVertical = this.vertical
        this.content.push(item)
      }
    },
    unregister (item) {
      if (isStep(item.$options.name)) {
        this.steps = this.steps.filter(i => i !== item)
      } else if (item.$options.name === 'v-stepper-content') {
        item.isVertical = this.vertical
        this.content = this.content.filter(i => i !== item)
      }
    }
  }
}
</script>
