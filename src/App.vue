<template>
  <v-app>
    <lc-sidebar-left/>
    <lc-sidebar-right/>
    <lc-page-toolbar/>

    <v-content class="page-view-layout">
      <v-container fluid class="pa-0">
        <lc-content-renderer :elements="Article.contents"
                             :pageProps="{ id: Article.id }">
        </lc-content-renderer>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import articleGql from './gql/article/ArticleBySlug.gql'
  import allPageTemplatesGql from './gql/pageTemplate/allPageTemplates.gql'
  import * as view from './store/view'

  const viewState = {
    state: { ...view.state },
    getters: { ...view.getters },
    mutations: { ...view.mutations },
    actions: { ...view.actions }
  }
  export default {
    name: 'app',
    components: {},
    data () {
      return {
        Article: {}
      }
    },
    beforeCreate () {
      this.$store.registerModule('lc', viewState, { preserveState: !!this.$store.state.lc })
    },
    apollo: {
      page: {
        query: articleGql,
        variables () {
          const slug = this.$route.params.slug
          return { slug: slug || 'en' }
        },
        update: r => r,
        manual: true,
        result ({ data }) {
          console.log(data)
          if (!data) return
          this.Article = data.Article
        }
      },
      pageTemplates: {
        query: allPageTemplatesGql,
        variables () {
          return { languageKey: 'EN' }
        },
        update: r => r,
        manual: true,
        result ({ data }) {
          if (!data) return
          const pageTemplates = data.allPageTemplates
          return this.$store.dispatch('setPageTemplates', pageTemplates)
        }
      }
    }
  }
</script>

<style>

</style>
