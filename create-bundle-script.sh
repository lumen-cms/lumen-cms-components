#!/bin/sh
# entire build
vue-cli-service build --target lib --name LcContentElements --dest dist/content/ src/components/index.js
# each single component
vue-cli-service build --target lib --name HelloWorld --dest dist/components/HelloWorld/ src/components/HelloWorld.vue
vue-cli-service build --target lib --name Button --dest dist/components/Button/ src/components/Button.vue
