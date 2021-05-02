import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import '@vueform/multiselect/themes/default.css'

import './assets/tailwind.css'
import './index.css'

import App from './App.vue'
import router from './router'
import store from './vuex'

import messages from './i18n'

const i18n = createI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
  // If you need to specify other options, you can set other options
  // ...
})

createApp(App)
  .use(router)
  .use(store)
  .use(i18n)
  .mount('#app')
