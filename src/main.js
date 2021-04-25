import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import './index.css'
import router from './router'
import store from './vuex'

createApp(App)
  .use(router)
  .use(store)
  .mount('#app')
