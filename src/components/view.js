import Vue from 'vue'
// content elements
import LcContentRenderer from './view/LcContentRenderer'
import LcDivider from './view/LcDivider'
import LcHtml from './view/LcHtml'
import LcLayout from './view/LcLayout'
import LcListWidget from './view/LcListWidget'
import LcReadMore from './view/LcReadMore'
import LcTextImage from './view/LcTextImage'
import LcArticleList from './view/article/LcArticleList'

// layout
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
import LcHtmlRenderer from './core/LcHtmlRenderer'
import LcVueRenderer from './core/LcVueRenderer'
import LcColumnsMenu from './core/navigation/LcColumnsMenu'
import LcExpansionPanelMenu from './core/navigation/LcExpansionPanelMenu'
import LcToolbarMenu from './core/navigation/LcToolbarMenu'
import NoSsr from 'vue-no-ssr'

const components = {
  // content elements
  LcContentRenderer,
  LcDivider,
  LcHtml,
  LcLayout,
  LcListWidget,
  LcReadMore,
  LcTextImage,
  LcArticleList,
  // layout
  LcAddress,
  LcDialog,
  LcLanguageSwitch,
  LcMainFooter,
  LcPageToolbar,
  LcMainLogo,
  LcMainSearch,
  LcSidebarLeft,
  LcSidebarRight,
  LcSystemBar,
  // core
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
