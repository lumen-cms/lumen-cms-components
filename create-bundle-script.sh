#!/bin/sh
rm -rf ./dist/
# entire "view" build
vue-cli-service build --target lib --name LcComponents --dest dist/content/ src/components/view.js
# each single component
vue-cli-service build --target lib --name LcContentRenderer --dest dist/components/LcContentRenderer/ src/components/view/LcContentRenderer.js
vue-cli-service build --target lib --name LcDivider --dest dist/components/LcDivider/ src/components/view/LcDivider.js
vue-cli-service build --target lib --name LcHtml --dest dist/components/LcHtml/ src/components/view/LcHtml.js
