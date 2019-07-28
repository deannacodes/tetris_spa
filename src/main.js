import Vue from 'vue'
import App from './components/App.vue'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { store } from './store.js'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/style.css'
Vue.use(BootstrapVue)
Vue.use(Vuex)

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
 