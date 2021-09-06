const { createApp } = Vue;
const { FluentBundle, FluentResource } = window.FluentBundle;
const { createFluentVue } = FluentVue;
const VueFinalModal = window.VueFinalModal();

const camelCase = (s) => (s??'').replace(/\_(.)/g, (_,c) => c.toUpperCase());


const marked = window.marked;
marked.use(markedExtLinks());

const app = createApp({
  setup() {
    return { md: marked }
  }
});

(async function run() {
  const localeBundles = {}

  let configuration = await fetch(`./config.json`).then(r => r.json())
  const { approot, locales } = configuration;

  // Fetch & create all locale bundles
  for (loc of locales) {
    // useIsolating OFF (needed to avoid junk in interpolated URLs)
    // https://projectfluent.org/fluent.js/bundle/classes/fluentbundle.html#constructor
    const b = new FluentBundle(loc.lang, { useIsolating: false });
    const resource = await fetch(`${approot ?? '.'}/locales/${loc.lang}/cfp.flt`).then(r => r.text());

    if (resource) {
      // Add translations to bundle
      b.addResource(new FluentResource(resource))

      // Add event information to bundle
      for (e of configuration.events) {
        const eventRes = [];

        eventRes.push(`event-${e.id} = ${e.name}`);
        if (e.summary[loc.lang]) {
          eventRes.push(`event-${e.id}-summary = ${e.summary[loc.lang]} [ℹ️](${e.link})`);
        }
        eventRes.push(`event-${e.id}-date = ${e.date}`);

        b.addResource(new FluentResource(eventRes.join('\n')));
      }

      // Finalize locale
      localeBundles[loc.lang] = [b];
      window.LB = localeBundles;

    } else {
      console.log(`Locale bundle ${loc.lang} not loaded!`);
    }
  }

  // Add the fallback locale to all other language bundles
  for (const [lang,bundle] of Object.entries(localeBundles)) {
    if (lang !== configuration['fallback_locale']) {
      bundle.push(localeBundles[configuration['fallback_locale']][0]);
    }
  }

  const fluent = createFluentVue({
    bundles: localeBundles[locales[0].lang]
  })

  app.use(fluent)


  let template = await fetch(`${approot ?? '.'}/cfp.vue`).then(r => r.text())

  app.use(VueFinalModal);


  app.component('main-content', {
    data() {
      const links = Object.fromEntries(
        Object.entries(configuration)
          .filter( ([k]) => k.startsWith('link_') )
          .map( ([k,v]) => [camelCase(k),v])
      );

      return ({
        confirmDialog: false,

        md: marked,
        locales,
        presentation_formats: configuration.presentation_formats,
        audience_targets: configuration.audience_targets,
        events: configuration.events.map(i => i.id),

        ...links,

        // Form data
        submission: {
          language: locales[0].lang,
          presentation_lang: '',
          presentation_format: configuration.presentation_formats[0],
          title: '',
          summary: '',
          description: '',
          audience_target: configuration.audience_targets[0],
          event_target: 'default',
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
        return typeof s === 'string' ? JSON.stringify(s.trim()) : '';
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
      },
      autogrow(event) {
        const box = event.target
        box.style.height = box.scrollHeight+'px'
      },
      submitProposal(event) {
        this.confirmDialog = true;
      },
      submitProposalCancel(event) {
        this.confirmDialog = false;
      },
    },
    template: template
  })

  app.mount(configuration['mountroot'] ?? '#app')
})();


// All links open in a new window
function markedExtLinks() {
  const escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
  const escapeReplacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  const getEscapeReplacement = (ch) => escapeReplacements[ch];
  const escape = (href) => href.replace(escapeReplaceNoEncode, getEscapeReplacement);

  return { renderer: {
    link(href, title, text) {
      if (href === null) {
        return text;
      }
      let out = '<a target="_blank" href="' + escape(href) + '"';
      if (title) {
        out += ' title="' + title + '"';
      }
      out += '>' + text + '</a>';
      return out;
    }
  }}
}