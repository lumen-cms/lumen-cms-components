import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import { createProvider } from './vue-apollo'
import VueObserveVisibility from 'vue-observe-visibility'

import router from './router'
import store from './store'

// import all content elements
import './components/coreElements'
import './components/viewElements'
import './components/layoutElements'

import cmsConfigDefaults from './defaultConfig'

Vue.use(VueObserveVisibility)
Vue.config.productionTip = false

// apply config
Vue.prototype.$cms = cmsConfigDefaults

new Vue({
  apolloProvider: createProvider(),
  router,
  store,
  render: h => h(App)
}).$mount('#app')
