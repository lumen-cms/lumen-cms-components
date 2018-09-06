import Vue from 'vue'
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  transitions,
  VProgressCircular,
  VImg,
  VCard,
  VTabs,
  VCarousel,
  VDivider,
  VSubheader,
  VDialog,
  VMenu
} from 'vuetify'
import { Ripple, Scroll } from 'vuetify/es5/directives'

import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    transitions,
    VProgressCircular,
    VImg,
    VCard,
    VTabs,
    VCarousel,
    VDivider,
    VSubheader,
    VDialog,
    VMenu
  },
  directives: {
    Ripple, Scroll
  }
})
