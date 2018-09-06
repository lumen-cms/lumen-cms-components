import Vue from 'vue'
import LcHtmlRenderer from './core/LcHtmlRenderer'
import LcVueRenderer from './core/LcVueRenderer'
import LcColumnsMenu from './core/navigation/LcColumnsMenu'
import LcExpansionPanelMenu from './core/navigation/LcExpansionPanelMenu'
import LcToolbarMenu from './core/navigation/LcToolbarMenu'
import NoSsr from 'vue-no-ssr'

const components = {
  LcHtmlRenderer,
  LcVueRenderer,
  LcColumnsMenu,
  LcExpansionPanelMenu,
  LcToolbarMenu,
  NoSsr
}

Object.keys(components).forEach(comp => {
  Vue.component(comp, components[comp])
})
