import { slugifyTemplateKey } from '../util/slugifyHelpers'

export const state = {
  locale: 'en',
  mainSearch: null,
  searchActive: false,
  hasJumbotron: false,
  activeSidebarRight: false,
  activeSidebarLeft: false,
  pageTemplates: [],
  pageProps: {
    articleId: null,
    id: null,
    languageKey: null
  },
  currentArticleCategories: []
}

export const mutations = {
  SET_SIDEBAR_RIGHT: (state, val) => {
    state.activeSidebarRight = val
  },
  SET_MAIN_SEARCH: (state, val) => {
    state.mainSearch = val
  },
  SET_SEARCH_ACTIVE: (state, val) => {
    state.searchActive = val
  },
  SET_CMS_LOADING (state, val) {
    state.cmsLoading = val
  },
  SET_CMS_JUMBOTRON (state, val) {
    state.hasJumbotron = val
  },
  SET_SIDEBAR_LEFT: (state, val) => {
    state.activeSidebarLeft = val
  },
  SET_PAGE_TEMPLATES (state, payload) {
    state.pageTemplates = payload
  }
}

export const getters = {
  getPageTemplate: (state) => (section) => {
    const slugifiedTemplateString = slugifyTemplateKey(section, state.locale)
    const findTempl = state.pageTemplates.find(e => e.key === slugifiedTemplateString)
    if (!findTempl) {
      return null
    }
    return findTempl
  },
  isPageTemplateVisible: (state) => ($cms, section) => {
    const categories = state.currentArticleCategories
    let templateVisibilityElement = $cms.pageTemplateVisibility[section]
    if (typeof templateVisibilityElement === 'boolean') {
      return templateVisibilityElement
    } else if (typeof templateVisibilityElement === 'string') {
      return !!categories.find(category => [category.slug, category.title, category.id].includes(templateVisibilityElement))
    } else if (Array.isArray(templateVisibilityElement)) {
      return !!categories.find(category => templateVisibilityElement.some(item => [category.slug, category.title, category.id].includes(item)))
    }
    return true
  }
}

export const actions = {
  setPageTemplates ({ commit }, payload) {
    return Promise.resolve(commit('SET_PAGE_TEMPLATES', payload))
  },

  toggleCmsLoading ({ commit, state }) {
    commit('SET_CMS_LOADING', !state.cmsLoading)
  },
  setLanguageKey ({ commit }, payload) {
    commit('SET_LANG', { locale: payload, $cms: this.app.$cms })
    this.app.i18n && (this.app.i18n.locale = payload)
    return Promise.resolve(true)
  },
  setMainSearch ({ commit }, payload) {
    commit('SET_MAIN_SEARCH', payload)
  },
  toggleSearchActive ({ commit, state }) {
    commit('SET_SEARCH_ACTIVE', !state.searchActive)
  },
  setCmsJumbotron ({ commit }, val) {
    commit('SET_CMS_JUMBOTRON', val)
  },
  toggleSidebarLeft ({ commit, state }) {
    commit('SET_SIDEBAR_LEFT', !state.activeSidebarLeft)
  },
  toggleSidebarRight ({ commit, state }) {
    commit('SET_SIDEBAR_RIGHT', !state.activeSidebarRight)
  }
}
