import { createApp } from 'vue'

import './assets/tailwind.css'
import './index.css'

import App from './App.vue'
import router from './router'
import store from './vuex'

createApp(App)
  .use(router)
  .use(store)
  .mount('#app')
