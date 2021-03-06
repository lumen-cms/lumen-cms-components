<template>
  <div>
    <v-dialog v-model="show"
              persistent
              scrollable
              lazy
              v-if="model">
      <v-card>
        <v-toolbar dense flat>
          <v-toolbar-title>Menu Builder</v-toolbar-title>
          <v-spacer/>
          <v-btn icon @click="onClose">
            <v-icon>clear</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text style="height: 60vh">
          <lc-form-container ref="baseForm">

            <v-container grid-list-md>
              <v-layout>
                <v-flex>
                  <v-text-field name="title"
                                label="Title"
                                v-model="model.title"
                                validate-on-blur
                                :rules="[onRequiredRule]"
                                required/>
                </v-flex>
                <v-flex>
                  <v-combobox name="key"
                            :items="keyItems"
                            label="Key"
                            required
                            :rules="[onRequiredRule]"
                            v-model="model.key"/>
                </v-flex>
              </v-layout>
            </v-container>
          </lc-form-container>
          <div v-if="model.id">
            <v-list>
              <lc-menu-builder-item v-for="(item,i) in navigation"
                                    :item="item"
                                    :i="i"
                                    :key="i"
                                    :level="0"/>
            </v-list>
            <div class="pl-3">
              <a href="#" @click="$store.dispatch('setMenuEdit', {isNew:true})">[ &#x2b; ] Create New...</a>
            </div>
          </div>
          <v-alert v-else :value="true" color="info" icon="info">Please save initial values before you start..</v-alert>
        </v-card-text>
        <v-card-actions>
          <lc-confirm-btn v-if="model.id"
                          label="Delete"
                          :loading="deleting"
                          btn-class="red--text"
                          @onConfirm="onDelete"/>
          <v-spacer/>
          <v-btn flat @click="onClose">
            CANCEL
          </v-btn>
          <v-btn flat
                 color="primary"
                 :loading="loading"
                 @click="saveMenu">
            SAVE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editShow"
              max-width="500"
              persistent
              lazy
              v-if="editModel && model">
      <v-card>
        <v-toolbar dense flat>
          <v-toolbar-title>Edit</v-toolbar-title>
          <v-spacer/>
          <v-btn icon @click="editShow=false;editModel = {};$refs.editFormModel.resetForm()">
            <v-icon>clear</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <lc-form-container ref="editFormModel">

            <v-select :items="['link','directory','subheader','divider']"
                      v-model="editModel.type"
                      name="type"
                      required
                      :rules="[onRequiredRule]"
                      label="Type"/>
            <template v-if="editModel.type !== 'divider'">
              <template v-if="editModel.type === 'subheader'">
                <v-text-field name="subheader"
                              required
                              v-model="editModel.subheader"
                              :rules="[onRequiredRule]"
                              label="Title"/>
              </template>
              <v-text-field name="title"
                            required
                            :rules="[onRequiredRule]"
                            v-model="editModel.title"
                            label="Text"
                            v-else/>
            </template>
            <lc-material-icon-picker v-if="editModel.type !== 'divider'"
                                     v-model="editModel.action"/>
            <v-select label="Item visibility"
                      clearable
                      :items="['hidden-xs-only', 'hidden-sm-and-down', 'hidden-sm-and-up', 'hidden-md-only', 'hidden-md-and-down', 'hidden-md-and-up', 'hidden-lg-only', 'hidden-lg-and-down', 'hidden-lg-and-up', 'hidden-xl-only']"
                      v-model="editModel.linkClass"/>
            <template v-if="editModel.type !== 'directory' && editModel.type !== 'divider'">

              <v-select label="Icon class breakpoint"
                        clearable
                        :items="['xsOnly','smAndDown','mdAndDown','lgAndDown','xlOnly','smAndUp','mdAndUp','lgAndUp']"
                        v-model="editModel.iconBreakpoint"
                        persistent-hint
                        hint="On which breakpoint shall be icon only?"/>
              <v-switch v-model="editModel.isVuexAction" label="Is vuex action"/>
              <v-text-field label="Vuex action name"
                            v-if="editModel.isVuexAction"
                            required
                            v-model="editModel.vuexAction"/>
              <lc-page-href-select :required="editModel.type === 'link'"
                                   v-if="!editModel.isVuexAction"
                                   @updated="onPageSelection"
                                   :value="editModel.link"/>
              <v-switch v-model="editModel.linkOpenExternal"
                        label="Open external"
                        v-if="!editModel.isVuexAction"/>
            </template>
          </lc-form-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" flat @click="removeEditItem" v-if="!editModel.originId"> Remove</v-btn>
          <v-spacer/>
          <v-btn flat @click.stop="saveEditDialog">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import { slugifyTemplateKey } from '../../../util/slugifyHelpers'
  import LcMenuBuilderItem from './LcMenuBuilderItem'
  import createTemplateGql from '../../../gql/pageTemplate/createPageTemplate.gql'
  import updateTemplateGql from '../../../gql/pageTemplate/updatePageTemplate.gql'
  import deleteTemplateGql from '../../../gql/pageTemplate/deletePageTemplate.gql'
  import validationRules from '../../../mixins/formValidation'

  const editModel = {
    type: null,
    title: null,
    subheader: null,
    link: null,
    linkOpenExternal: false,
    isVuexAction: false,
    vuexAction: null,
    to: null,
    linkClass: null,
    iconBreakpoint: null
  }
  export default {
    name: 'LcMenuBuilder',
    mixins: [validationRules],
    props: {
      content: Array | Object
    },
    components: { LcMenuBuilderItem },
    data () {
      return {
        show: false,
        editShow: false,
        model: {
          id: null,
          title: null,
          key: null
        },
        navigation: [],
        editModel: Object.assign({}, editModel),
        loading: false,
        deleting: false
      }
    },
    watch: {
      '$store.state.lc.menuEdit' (value) {
        const model = JSON.parse(JSON.stringify(value))
        this.editShow = !this.editShow
        if (!model.isNew) {
          // update a menu entry
          const currentModel = model.item
          this.editModel = Object.assign({}, currentModel, {
            link: currentModel.to ? this.getHrefValue(currentModel) : null,
            type: currentModel.type || this.getItemType(currentModel)
          }
          )
        } else {
          let originId = model.item && model.item.id
          if (originId === undefined || originId === null) {
            // click on create new button
            originId = this.navigation[this.navigation.length - 1] && this.navigation[this.navigation.length - 1].id
          }
          this.editModel = Object.assign({}, { originId: originId, firstChild: model.firstChild })
        }
      },
      content (value) {
        this.setModel(value)
      },
      '$store.state.lc.menuCutPaste.toItem.id' () {
        !!this.$store.state.lc.menuCutPaste && this.pasteItemToNewPosition()
      }
    },
    computed: {
      keyItems () {
        return Object.keys(this.$cms.pageTemplate).map(e => ({
          value: slugifyTemplateKey(e, this.$store.state.lc.locale),
          text: e
        }))
      }
    },
    methods: {
      pasteItemToNewPosition () {
        const currentNavigation = JSON.parse(JSON.stringify(this.navigation.slice(0)))
        const pasteObject = JSON.parse(JSON.stringify(this.$store.state.lc.menuCutPaste))
        this.navigation = []
        this.navigation = findReplace(currentNavigation)
        this.$nextTick(() => {
          this.$store.dispatch('setMenuCutPaste', null)
        })

        function findReplace (array) {
          // first look for old item position and remove the item from there
          let findOldIndex = array.findIndex(i => i.id === pasteObject.item.id)
          if (findOldIndex !== -1) {
            array.splice(findOldIndex, 1)
          }
          let findNewPosition = array.findIndex(i => i.id === pasteObject.toItem.id)
          if (findNewPosition !== -1) {
            array.splice(findNewPosition + 1, 0, Object.assign({}, pasteObject.item))
          }
          return array.map(item => {
            if (item.items) {
              item.items = findReplace(item.items)
            }
            return item
          })
        }
      },
      setModel (value) {
        // main model
        this.model = !value ? {} : Object.assign({}, {
          title: value.title,
          key: value.key,
          id: value.id
        })

        // navigation
        let bodyJson = value && value.bodyJson
        if (!bodyJson) return []
        let navigation = []
        Object.keys(bodyJson).forEach(item => {
          const root = bodyJson[item]
          if (Array.isArray(root)) {
            navigation = root
          } else {
            console.warn('no array navigation element found')
          }
        })
        this.navigation = this.addIdToNavigation(navigation)
      },
      addIdToNavigation (navigation) {
        let id = 0
        return mapItems(navigation)

        function mapItems (array) {
          return array.map(item => {
            item = Object.assign({}, item, { id })
            id++
            if (item.items) {
              item.items = mapItems(item.items)
            }
            return item
          })
        }
      },
      afterEditSave () {
        this.editShow = false
        this.editModel = Object.assign({}, editModel)
        this.$nextTick(() => {
          this.$refs.editFormModel.resetForm()
        })
      },
      /**
       * click on edit triggered
       */
      removeEditItem () {
        const currentNavigation = JSON.parse(JSON.stringify(this.navigation.slice(0)))
        const form = Object.assign({}, this.editModel)

        this.navigation = []
        this.navigation = removeItem(currentNavigation)
        this.afterEditSave()

        function removeItem (array) {
          let findIndex = array.findIndex(i => i.id === form.id)
          if (findIndex !== -1) {
            array.splice(findIndex, 1)
          }
          return array.map(item => {
            if (item.items) {
              item.items = removeItem(item.items)
            }
            return item
          })
        }
      },
      /**
       * click on save edit form triggered
       */
      saveEditDialog () {
        const v = this.$refs.editFormModel.validate()
        if (!v) return
        const form = JSON.parse(JSON.stringify(this.editModel))
        if (form.type === 'directory' && !form.items) {
          form.items = []
        }
        if (form.type === 'divider') {
          form.divider = true
        }
        const currentNavigation = JSON.parse(JSON.stringify(this.navigation.slice(0)))
        if (!currentNavigation.length) {
          this.navigation = this.addIdToNavigation([form])
          this.afterEditSave()
          return
        }
        this.navigation = []
        if (typeof form.originId === 'number') {
          // create element inside
          if (form.firstChild) {
            const tempNavigation = insertFirstChild(currentNavigation)
            this.navigation = this.addIdToNavigation(tempNavigation)
            this.$forceUpdate()
          } else {
            this.$nextTick(() => {
              const tempNavigation = insertItem(currentNavigation)
              this.navigation = this.addIdToNavigation(tempNavigation)
            })
          }
        } else {
          // update element
          this.navigation = updateItems(currentNavigation)
        }
        // this.editModel = null
        this.afterEditSave()

        function insertFirstChild (array) {
          return array.map(item => {
            if (item.id === form.originId) {
              // add first child into current item.items
              const newValue = Object.assign({}, form)
              delete newValue.originId
              delete newValue.firstChild
              item.items = [newValue]
              return item
            }
            if (item.items) {
              item.items = insertFirstChild(item.items)
            }
            return item
          })
        }

        function insertItem (array) {
          let findIndex = array.findIndex(i => i.id === form.originId)
          if (findIndex !== -1) {
            const newValue = Object.assign({}, form)
            delete newValue.originId
            array.splice(findIndex + 1, 0, newValue)
          }
          return array.map(item => {
            if (item.items) {
              item.items = insertItem(item.items)
            }
            return item
          })
        }

        function updateItems (array) {
          return array.map(item => {
            if (item.id === form.id) {
              item = form
            }
            if (item.items) {
              item.items = updateItems(item.items)
            }
            return item
          })
        }
      },
      getItemType (element) {
        if (element.items) {
          return 'directory'
        } else if (element.subheader) {
          return 'subheader'
        } else if (element.divider) {
          return 'divider'
        } else {
          return 'link'
        }
      },
      getHrefValue (element) {
        return element.link || {
          linkSlug: element.to,
          linkType: null,
          linkId: null
        }
      },
      toggleVisibility () {
        this.show = !this.show
        if (this.show) {
          this.setModel(this.content)
        }
      },
      onPageSelection (value) {
        const link = {
          linkSlug: value.value,
          linkType: value.type,
          linkId: value.id
        }
        this.$set(this.editModel, 'link', link)
        this.$set(this.editModel, 'to', value.value)
      },
      onClose () {
        this.loading = false
        this.deleting = false
        this.model = {}
        this.navigation = []
        this.show = false
      },
      async saveMenu () {
        const v = this.$refs.baseForm.validate()
        if (!v) return
        this.loading = true
        const navigation = JSON.parse(JSON.stringify(this.navigation))
        const variables = Object.assign({}, this.model, {
          bodyJson: {
            NAV: navigation
          },
          type: 'JSON',
          languageKey: this.$store.state.lc.locale.toUpperCase(),
          key: slugifyTemplateKey(this.model.key, this.$store.state.lc.locale)
        })
        if (variables.id) {
          // update template
          await this.mutateGql({
            mutation: updateTemplateGql,
            variables
          })
        } else {
          // create template
          const res = await this.mutateGql({
            mutation: createTemplateGql,
            variables
          }, 'createPageTemplate')
          this.model = res
          this.$emit('refetchTemplates', true)
        }
        this.loading = false
      },
      async onDelete () {
        this.deleting = true
        await this.mutateGql({
          mutation: deleteTemplateGql,
          variables: { id: this.model.id }
        })
        this.$emit('refetchTemplates', true)
        this.onClose()
      }
    }
  }
</script>
