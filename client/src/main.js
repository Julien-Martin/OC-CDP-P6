import Vue from 'vue'
import './plugins/vuetify'
import './plugins/veevalidate'
import App from './App.vue'
import router from './router'
import store from './store'
import {createProvider} from './vue-apollo'
import TextField from './components/TextField'
import Alert from './components/Alert'
import Loader from './components/Loader'
import Modal from './components/Modal'
import * as moment from 'moment'

Vue.config.productionTip = false;
Vue.component('TextField', TextField);
Vue.component('Alert', Alert);
Vue.component('Loader', Loader);
Vue.component('Modal', Modal);

moment.locale('fr');

const apolloProvider = createProvider()

new Vue({
    router,
    store,
    apolloProvider,
    render: h => h(App)
}).$mount('#app');
