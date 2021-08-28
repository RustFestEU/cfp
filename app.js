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

  let configuration = await fetch(`./config.json`).then(r => r.json())
  const { locales } = configuration;

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

  app.use(fluent)


  let template = await fetch(`./pages/cfp.vue`).then(r => r.text())

  app.component('main-content', {
    data() {
      return ({
        md: marked,
        locales,
        presentation_formats: configuration.presentation_formats,
        audience_targets: configuration.audience_targets,

        // Form data
        submission_language: locales[0].lang,
        submission_presentation_lang: '',
        presentation_format: configuration.presentation_formats[0],
        title: '',
        summary: '',
        description: '',
        audience_target: configuration.audience_targets[0],
        proposal_notes: '',
        
      })
    },
    computed: {
      submission_language_name() {
        const c = this.locales.find(loc => loc.lang === this.submission_language);
        return c ? c.name : this.locales[0].name
      }
    },
    methods: {
      $mt(...args) {
        return marked(fluent.format(...args));
      },
      $mti(...args) {
        return marked.parseInline(fluent.format(...args), { smartypants: true });
      },
      localeChange(event) {
        fluent.bundles = localeBundles[this.submission_language]
      }
    },
    template: template
  })

  app.mount('#app')
})();
