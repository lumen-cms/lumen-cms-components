import Vue from 'vue'
import LcHtmlRenderer from './core/LcHtmlRenderer'
import LcVueRenderer from './core/LcVueRenderer'

const components = {
  LcHtmlRenderer,
  LcVueRenderer
}

Object.keys(components).forEach(comp => {
  Vue.component(comp, components[comp])
})
