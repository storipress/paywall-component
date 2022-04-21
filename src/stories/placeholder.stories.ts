import type { Story } from '@storybook/vue3'
import { h } from 'vue'
import Placeholder from './placeholder.vue'

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Placeholder',
  component: Placeholder,
}

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template: Story = (args) => ({
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return () => h(Placeholder, args)
  },
})

export const Default: Story = Template.bind({})
