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
        submission: {
          language: locales[0].lang,
          presentation_lang: '',
          presentation_format: configuration.presentation_formats[0],
          title: '',
          summary: '',
          description: '',
          audience_target: configuration.audience_targets[0],
          proposal_notes: '',
          name: '',
          tagline: '',
          bio: '',
        }
      })
    },
    computed: {
      submission_language_name() {
        return this.languageName(this.submission.language) ?? this.locales[0].name
      }
    },
    methods: {
      $mt(...args) {
        return marked(fluent.format(...args), { smartypants: true });
      },
      $mti(...args) {
        return marked.parseInline(fluent.format(...args), { smartypants: true });
      },
      languageName(language) {
        const c = this.locales.find(loc => loc.lang === language);
        return c ? c.name : void 0
      },
      localeChange(event) {
        fluent.bundles = localeBundles[this.submission.language]
      },
      dump() {
        console.log(this.submission)
        let s = '# EXPORTED PROPOSAL - RustFest Global 2021\n'
          +'# '+new Date().toLocaleString()+'\n'
          +'# '+window.location.href+'\n'
          +'\n'
          +Array.from(document.querySelectorAll('[data-export-format]')).map(e => e.dataset.exportFormat).join('\n\n')
        return s
      },
      tomlString(s) {
        return JSON.stringify(s.trim())
      },
      tomlText(s) {
        return '"""\n' +s.trim()+ '\n"""'
      },
      // TODO: https://github.com/eligrey/FileSaver.js/
      downloadExport(event) {
        event.preventDefault()
        const d = 'data:text/plain,'+encodeURIComponent(this.dump())
        console.log(d)

        const a = document.createElement('a')
        a.href = d
        a.download = 'Proposal_RustFest_Global_2021.toml'
        a.rel = 'noopener'
        a.dispatchEvent(new MouseEvent('click'))
      }
    },
    template: template
  })

  app.mount('#app')
})();
