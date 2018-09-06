import Vue from 'vue'
import Vuex from 'vuex'
import * as view from './store/view'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    lc: {
      state: { ...view.state },
      getters: { ...view.getters },
      mutations: { ...view.mutations },
      actions: { ...view.actions }
    }
  }
})
