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
      async downloadExport(event) {
        event.preventDefault()
        const d = 'data:text/plain,'+encodeURIComponent(this.dump())
        console.log(d)

        const a = document.createElement('a')
        a.href = d
        a.download = 'Proposal_RustFest_Global_2021.toml'
        a.rel = 'noopener'
        a.dispatchEvent(new MouseEvent('click'))
      },
      async importProposal(event) {
        event.preventDefault()

        const f = document.createElement('input')
        f.type = 'file'
        f.style.opacity = 0
        document.body.appendChild(f)

        await new Promise((resolve, reject) => {
          f.addEventListener('change', resolve);
          f.click()
        })

        const fr = new FileReader()
        await new Promise((resolve, reject) => {
          fr.addEventListener('loadend', resolve)
          fr.readAsText(f.files[0])
        })

        let multi = false;
        let multitext = '';
        let importdata = [];
        fr.result.split('\n').filter(ln => ln.startsWith('#') === false).forEach(ln => {
          let l = ln.trim();
          if (l.endsWith('"""')) {
            let kv
            if (multi) {
              kv = [multi,multitext.join('\n').trim()];
              multi = ''
            } else {
              multi = l.match(/^\S+/)?.[0];
              multitext = []
            }
            if (kv) importdata.push(kv)
          } else {
            let kv;
            if (!multi) {
              if (l.trim() !== '') {
                // Line-ending comments
                l = l.replace(/\s*#[^"]+$/,'')

                // Parse key-value
                kv = l.match(/^(\S+) = (".+")$/)
              }
            } else {
              // Multiline-string line
              multitext.push(l)
            }
            if (kv) importdata.push([kv[1],JSON.parse(kv[2])])
          }
        })

        const importedSubmission = Object.fromEntries(importdata)
        for (let k of Object.keys(this.submission)) {
          if (k in importedSubmission) this.submission[k] = importedSubmission[k]
        }

        //TODO:two-way binding doesn't do a localechange automatically
        this.localeChange()
        document.getElementById('proposal').scrollIntoView()
      }
    },
    template: template
  })

  app.mount('#app')
})();
