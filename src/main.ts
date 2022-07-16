import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import type { LocaleMessages, VueMessageType } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import routes from 'virtual:generated-pages'
import App from './App.vue'

import './styles/main.css'

// Import i18n resources
// https://vitejs.dev/guide/features.html#glob-import
const messages = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ default: LocaleMessages<VueMessageType> }>('../locales/*.y(a)?ml', { eager: true })
  ).map(([key, value]) => [
    key
      .split('/')
      .at(-1)
      ?.replace(/\.ya?ml$/, ''),
    value.default,
  ])
)

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(router)

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages,
})
app.use(i18n)

app.mount('#app')
