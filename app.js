import Configuration from './src/config.js';
import * as Form from './src/form.js';

import { locales, bundles, languages, defaultLocale } from './src/l10n.js';

const { createApp } = Vue;
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
  const { approot } = Configuration;

  const fluent = createFluentVue({
    bundles: bundles[defaultLocale]
  });
  app.use(fluent);


  let template = await fetch(`${approot ?? '.'}/cfp.vue`).then(r => r.text())

  const links = Object.fromEntries(
    Configuration.links
      .map(({ label, url }) => ([ 'link_'+label, url ]))
      .map( ([k,v]) => [camelCase(k),v])
  );


  app.use(VueFinalModal);


  app.component('main-content', {
    data() {
      return ({
        confirmDialog: false,

        md: marked,
        locales, languages,
        presentation_formats: Configuration.presentation_formats,
        audience_targets: Configuration.audience_targets,
        events: Configuration.events,
        verification_code: '',

        ...links,

        // Form data
        submission: {
          language: defaultLocale, // TODO: take url language into account
          presentation_lang: '',
          presentation_format: Configuration.presentation_formats[0].label,
          title: '',
          summary: '',
          description: '',
          audience_target: Configuration.audience_targets[0].label,
          event_target: '',
          notes: '',
          name: '',
          tagline: '',
          bio: '',
          email: '',
        }
      })
    },
    computed: {
      currentLang() {
        return this.languages[this.submission.language][this.submission.language];
      },
      currentEventTarget() {
        return this.events.find(e => e.label == this.submission.event_target)?.name ?? this.$mti('event-none');
      },
    },
    methods: {
      $mt(...args) {
        return marked(fluent.format(...args), { smartypants: true });
      },
      $mti(...args) {
        return marked.parseInline(fluent.format(...args), { smartypants: true });
      },
      localeChange(event) {
        fluent.bundles = bundles[this.submission.language]
      },
      dump() {
        let s = '# EXPORTED PROPOSAL - RustFest Global 2021\n'
          +'## '+new Date().toLocaleString()+'\n'
          +'## '+window.location.href+'\n'
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
        // TODO: validate required fields
        Form.verify(this.submission.email);
        this.confirmDialog = true;
      },
      submitProposalSend(event) {
        Form.submit(this.submission, this.verification_code);
        this.confirmDialog = false;
      },
      submitProposalCancel(event) {
        this.confirmDialog = false;
      },
    },
    template: template
  })

  app.mount(Configuration['mountroot'] ?? '#app')
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