import Vue from 'vue'
import './plugins/vuetify'
import './plugins/veevalidate'
import App from './App.vue'
import router from './router'
import store from './store'
import { createProvider } from './vue-apollo'

import TextField from './components/TextField'
import Alert from './components/Alert'

Vue.config.productionTip = false
Vue.component('TextField', TextField)
Vue.component('Alert', Alert)

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')
