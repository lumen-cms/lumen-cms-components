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

  export default {
    name: 'app',
    components: {},
    data () {
      return {
        Article: {}
      }
    },
    apollo: {
      page: {
        query: articleGql,
        variables () {
          const slug = this.$route.params.slug
          console.log('hier', slug)
          return { slug: slug || 'en' }
        },
        update: r => r,
        manual: true,
        result ({ data }) {
          console.log(data)
          if (!data) return
          this.Article = data.Article
        }
      }
    }
  }
</script>

<style>

</style>
