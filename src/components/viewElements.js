import Vue from 'vue'
import LcContentRenderer from './view/LcContentRenderer'
import LcDivider from './view/LcDivider'
import LcHtml from './view/LcHtml'
import LcLayout from './view/LcLayout'
import LcListWidget from './view/LcListWidget'
import LcReadMore from './view/LcReadMore'
import LcTextImage from './view/LcTextImage'
import LcArticleList from './view/article/LcArticleList'

const components = {
  LcContentRenderer,
  LcDivider,
  LcHtml,
  LcLayout,
  LcListWidget,
  LcReadMore,
  LcTextImage,
  LcArticleList
}

Object.keys(components).forEach(comp => {
  Vue.component(comp, components[comp])
})
