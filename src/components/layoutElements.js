import Vue from 'vue'
import LcAddress from './layout/LcAddress'
import LcDialog from './layout/LcDialog'
import LcLanguageSwitch from './layout/LcLanguageSwitch'
import LcMainFooter from './layout/LcMainFooter'
import LcPageToolbar from './layout/LcPageToolbar'
import LcMainLogo from './layout/LcMainLogo'
import LcMainSearch from './layout/LcMainSearch'
import LcSidebarLeft from './layout/LcSidebarLeft'
import LcSidebarRight from './layout/LcSidebarRight'
import LcSystemBar from './layout/LcSystemBar'

const components = {
  LcAddress,
  LcDialog,
  LcLanguageSwitch,
  LcMainFooter,
  LcPageToolbar,
  LcMainLogo,
  LcMainSearch,
  LcSidebarLeft,
  LcSidebarRight,
  LcSystemBar
}

Object.keys(components).forEach(comp => {
  Vue.component(comp, components[comp])
})
