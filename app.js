const { createApp } = Vue;
const { FluentBundle, FluentResource } = window.FluentBundle;
const { createFluentVue } = FluentVue;

const app = createApp({
  setup() {
    return { md: marked }
  }
});

(async function run() {
  const localeBundles = {}

  let locales = await fetch(`./locales/locales.json`).then(r => r.json())

  // Fetch & create all locale bundles
  for (loc of locales) {
    const b = new FluentBundle(loc.lang)
    const resource = await fetch(`./locales/${loc.lang}/cfp.flt`).then(r => r.text())

    if (resource) {
      b.addResource(new FluentResource(resource))
      localeBundles[loc.lang] = [b];
    } else {
      console.log(`Locale bundle ${loc.lang} not loaded!`);
    }
  }

  const fluent = createFluentVue({
    bundles: localeBundles[locales[0].lang]
  })
  console.log(localeBundles)

  app.use(fluent)


  let template = await fetch(`./pages/cfp.vue`).then(r => r.text())

  app.component('main-content', {
    data() {
      return ({
        md: marked,
        submission_language: locales[0].lang,
        locales
      })
    },
    computed: {
      submission_language_name() {
        const c = this.locales.find(loc => loc.lang === this.submission_language);
        return c ? c.name : this.locales[0].name
      }
    },
    methods: {
      localeChange(event) {
        fluent.bundles = localeBundles[this.submission_language]
      }
    },
    template: template
  })

  app.mount('#app')
})();
