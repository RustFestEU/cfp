npm run build
rm -f ../../rustfest.global/assets/cfp/* && cp dist/assets/* ../../rustfest.global/assets/cfp/
grep assets dist/index.html | sed s/assets/assets\\\/cfp/ > ../../rustfest.global/_includes/cfp-app.njk