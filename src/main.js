import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import { createProvider } from './vue-apollo'
import VueObserveVisibility from 'vue-observe-visibility'

import router from './router'
import store from './store'

// import all content elements
import './components/view'

import cmsConfigDefaults from './defaultConfig'

// general styles for css TODO configurable
import './assets/style/imports.styl'

Vue.use(VueObserveVisibility)
Vue.config.productionTip = false

// apply config TODO: configurable
Vue.prototype.$cms = cmsConfigDefaults

new Vue({
  apolloProvider: createProvider(),
  router,
  store,
  render: h => h(App)
}).$mount('#app')
