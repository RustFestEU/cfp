#!/bin/bash
TARGET=${1:-"../rustfest.global"}

# pulls the cfp localization data and packs it up into a locales.json
cd app
node update.mjs

# build the cfp app
npm run build
cd ..

# clean rustfest cfp folder and copy assets and build artifacts over
rm -rf $TARGET/assets/cfp
mkdir -p $TARGET/assets/cfp && cp app/dist/assets/*.* $TARGET/assets/cfp/

# copy the asset imports into an njk file that will include them in the CFP header
mkdir -p $TARGET/_includes && grep assets app/dist/index.html | sed s/assets/assets\\\/cfp/ > $TARGET/_includes/cfp-app.njk
