import { ref } from 'vue'
import Toggle from './Toggle.vue'

export default {
  title: 'Toggles',
  component: Toggle,
  argTypes: {
    onClick: {},
  },
}

const Template = (args) => ({
  components: { Toggle },
  setup() {
    const enabled = ref(false)
    return { args, enabled }
  },
  template: '<Toggle v-bind="args" v-model="enabled" />',
})

export const Simple = Template.bind({})
Simple.args = {
  type: 'simple',
}

export const Short = Template.bind({})
Short.args = {
  type: 'short',
  color: 'bg-green-600',
}
