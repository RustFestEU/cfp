<script setup>
import { ref, reactive, computed, watchEffect } from 'vue';

import { useFluent } from 'fluent-vue';
const { $t } = useFluent();
import { $mt, $mti } from '../lib/markdown.js';

import { ptxString, ptxText, collect, downloadPortatext, uploadPortatext } from '../lib/portatext.js';

import CfpFormSubmit from './CfpFormSubmit.vue';

const props = defineProps({
  language: String,
  defaultLocale: String,
  languages: Object,
  locales: Array,
  presentationFormats: Array,
  audienceTargets: Array,
  events: Array,
  links: Object,
});

const emit = defineEmits(['update:language']);


// Submission object with empty defaults
const [_submission, _required] = (() => {
  const fields = `
    *language
      presentation_lang
    *presentation_format
    *title
    *summary
    *description
    *audience_target
      event_target
      notes
    *name
      tagline
    *bio
    *email
  `.replace(/\s+/g,'\n').trim().split('\n');

  const submission = Object.fromEntries(
    fields.map(f => [f.replace('*',''),''])
  );

  // Default submission language
  submission['language'] = props.language ?? 'en';

  // Other submission defaults
  submission['presentation_format'] = props.presentationFormats?.[0]?.label ?? '';
  submission['audience_target'] = props.audienceTargets?.[0]?.label ?? '';

  const required = fields.filter(r => r.includes('*')).map(r => r.slice(1));

  return [ submission, required ]
})();

const submission = reactive(_submission);
const required = _required;

// Automatically update form language when submission language changes
watchEffect(() => emit('update:language', submission.language));

function uploadProposal() {
  uploadPortatext(updateSubmission);
}

function updateSubmission(updates) {
  // Update submission fields
  for (let k of Object.keys(submission)) {
    if (k in updates) submission[k] = updates[k];
  }

  // Scroll to submission
  // TODO: REFS HOW??
  //this.$refs.proposal.scrollIntoView();
  document.querySelector('#proposal')?.scrollIntoView();
}

const confirmDialog = ref(false);

function check() {
  const errors = [];

  for (const f of required) {
    if (!submission[f]) errors.push(f);
  }

  if (errors.length > 0) {
    proposalErrors = 'Please fill out all required fields: '+errors.join(',');
    return false;
  }

  return true;
}

function submit() {
  if (check()) confirmDialog.value=true;
}

const currentLang = computed(() => {
  const lang = submission.language ?? props.defaultLocale;
  return props.languages[lang][lang] ?? '';
});

const currentEventTarget = computed(() => {
  return props.events.find(e => e.label == submission.event_target)?.name ?? $t('event-none');
});

let proposalErrors = ref('');
</script>

<script>
export default {
  data() {
    const data = {
      // All links are directly exposed to ease passing to Fluent
      ...this.$props.links,
    }

    return data;
  },
}
</script>

<template>
<section class="cfp-form">
  <h1 v-t:f-title></h1>

  <!-- Information about the CFP process and the unconventional handling of deadlines -->
  <h2 v-t:f-submission-deadline-t></h2>
  <div v-html="$mt('f-submission-deadline', { linkUpcomingEvents })"></div>

  <div v-html="$mt('f-form-notes')"></div>


  <!-- Upload an existing proposal and manage existing submissions -->
  <h2 v-t:f-manage-t></h2>
  <div v-html="$mt('f-manage')"></div>
  <button @click.prevent="uploadProposal" v-t:f-manage-upload-btn=""></button>

  <!-- Temporarily unavailable -->
  <!-- <CfpLogin /> -->

  <!-- SUBMISSION FORM -->
  <h2 id="submission" v-t:f-submission-t></h2>
  
  <form @submit.prevent="submit.call(this)">

    <!-- Language selection for the submission and the instructions -->
    <h3><label for="submission_language" v-t:f-submission-lang-t></label></h3>
    <select
      name="submission_language"
      v-model="submission.language"
      :data-ptx="
        '# ' + $t('f-submission-lang-t') +'\n'
        +'language = '+ ptxString(submission.language) +' # '+ currentLang"
    >
      <option
        v-for="loc in locales"
        :value="loc"
        v-html="languages[submission.language][loc]
              + (submission.language != loc ? ' ('+languages[loc][loc]+')' :'')"
      ></option>
    </select>

    <div v-html="$mt('f-submission-lang', { linkSupportedLanguages })"></div>

    <!-- Language selection for the presentation itself -->

    <h3><label for="submission_presentation_lang" v-t:f-submission-presentation-lang-t></label></h3>
    <input
      type="text"
      name="submission_presentation_lang"
      v-model="submission.presentation_lang"
      v-bind:placeholder="currentLang"
      :data-ptx=
        "'# ' + $t('f-submission-presentation-lang-t') +'\n'
        +'presentation_lang = ' + ptxString(submission.presentation_lang)"
    />

    <div v-html="$mt('f-submission-presentation-lang', { currentLang, linkSupportedLanguages })"></div>

    <!-- Chosing a presentation format -->

    <h3 v-t:f-submission-presentation-format-t></h3>
    <ol :data-ptx=
      "'# '+ $t('f-submission-presentation-format-t') +'\n'
      +'presentation_format = '+ ptxString(submission.presentation_format)
      +' # '+ $t('f-submission-presentation-format-'+submission.presentation_format+'-t')"
    >
      <li v-for="opt in presentationFormats">
        <label>
          <input
            type="radio"
            name="presentation_format"
            v-model="submission.presentation_format"
            v-bind:value="opt.label"
          />
          {{ $mti('f-submission-presentation-format-'+opt.label+'-t') }}
        </label>
      </li>
    </ol>

    <div v-html="$mt('f-submission-presentation-format')"></div>


    <!-- PROPOSAL CONTENTS -->
    <h2 id="proposal" ref="proposal" v-t:f-proposal-t></h2>

    <!-- Title of the proposal -->

    <h3><label for="title" v-t:f-proposal-title-t></label></h3>
    <input
      type="text"
      name="title"
      v-model="submission.title"
      required
      :data-ptx=
        "'# '+ $t('f-proposal-t') +'\n\n## '+ $t('f-proposal-title-t') +'\n'
        +'title = '+ ptxString(submission.title)"
    />

    <!-- Proposal summary (pitch/abstract) -->

    <h3><label for="summary" v-t:f-proposal-summary-t></label></h3>
    <textarea
      name="summary"
      v-model="submission.summary"
      v-autosize
      required
      :data-ptx=
        "'## '+ $t('f-proposal-summary-t') +'\n'
        +'summary = '+ ptxText(submission.summary)"
    ></textarea>

    <div v-html="$mt('f-proposal-summary')"></div>

    <!-- Detailed description of the proposal -->

    <h3><label for="description" v-t:f-proposal-description-t></label></h3>
    <textarea
      name="description"
      v-model="submission.description"
      v-autosize
      required
      :data-ptx=
        "'## '+ $t('f-proposal-description-t') +'\n'
        +'description = '+ ptxText(submission.description)"
      @focus="autogrow" @input="autogrow"
    ></textarea>

    <div v-html="$mt('f-proposal-description', { linkCfpGuidelines })"></div>

    <!-- Selecting the target audience for the proposed session -->

    <h3 v-t:f-proposal-audience-t></h3>

    <div v-html="$mt('f-proposal-audience')"></div>

    <ol :data-ptx=
      "'## '+ $t('f-proposal-audience-t') +'\n'
      +'audience_target = '+ ptxString(submission.audience_target)
      +' # '+ $t('f-proposal-audience-'+submission.audience_target+'-t')"
    >
      <li v-for="opt in audienceTargets">
        <label>
          <input
            type="radio"
            name="audience_target"
            v-model="submission.audience_target"
            v-bind:value="opt.label"
          />
          <span v-html="$mti('f-proposal-audience-'+opt.label+'-t')"></span>
        </label>
      </li>
    </ol>

    <!-- Highlight this proposal for being suited particularly well to one specific event -->

    <h3 v-t:f-proposal-highlight-t></h3>

    <div v-html="$mt('f-proposal-highlight')"></div>

    <ol :data-ptx=
      "'## '+ $t('f-proposal-highlight-t') +'\n'
      +'event_target = '+ ptxString(submission.event_target)
      +' # '+ currentEventTarget"
    >
      <li>
        <label>
          <input
            type="radio"
            name="event_target"
            v-model="submission.event_target"
            v-bind:value="''"
          />
          <strong v-html="$mti('event-none')"></strong><br />
          <em v-html="$mti('event-none-summary')"></em>
        </label>
      </li>
      <li v-for="opt in events">
        <label>
          <input
            type="radio"
            name="event_target"
            v-model="submission.event_target"
            v-bind:value="opt.label"
          />
          <strong v-html="opt.name"></strong><br />
          <span class="event-summary" v-html="$mti('event-'+opt.label+'-summary')"></span>
          <br>
          <span class="event-date" v-html="'('+ $mti('event-date',{date:new Date(opt.date+'/01')}) +')'"></span>
          <span class="event-link" v-html="' '+ $mti('event-link',{link:opt.link}) +' '"></span>
        </label>
      </li>
    </ol>
    
    <!-- Notes for the organizers about the proposal -->

    <h3><label for="notes" v-t:f-proposal-notes-t></label></h3>
    <textarea
      name="notes"
      v-model="submission.notes"
      v-autosize
      :data-ptx=
        "'## '+ $t('f-proposal-notes-t') +'\n'
        +'notes = '+ ptxText(submission.notes)"
    ></textarea>

    <div v-html="$mt('f-proposal-notes')"></div>


    <!-- ABOUT THE SUBMITTER -->
    <h2 id="submitter" v-t:f-submitter-t></h2>

    <!-- Name of the submitter -->

    <h3><label for="name" v-t:f-submitter-name-t></label></h3>
    <input
      type="text"
      name="name"
      v-model="submission.name"
      v-autosize
      required
      :data-ptx=
        "'# '+ $t('f-submitter-t') +'\n\n## '+ $t('f-submitter-name-t') +'\n'
        +'name = '+ ptxString(submission.name)"
    />

    <!-- Tagline or affiliation of the submitter -->

    <h3><label for="tagline" v-t:f-submitter-tagline-t></label></h3>
    <input
      type="text"
      name="tagline"
      v-model="submission.tagline"
      :data-ptx=
        "'## '+ $t('f-submitter-tagline-t') +'\n'
        +'tagline = '+ ptxString(submission.tagline)"
    />

    <div v-html="$mt('f-submitter-tagline')"></div>

    <!-- Speaker bio -->

    <h3><label for="bio" v-t:f-submitter-bio-t></label></h3>
    <textarea
      name="bio"
      v-model="submission.bio"
      v-autosize
      required
      :data-ptx=
        "'## '+ $t('f-submitter-bio-t') +'\n'
        +'bio = '+ ptxText(submission.bio)"
      @focus="autogrow" @input="autogrow"
    ></textarea>

    <div v-html="$mt('f-submitter-bio')"></div>


    <h2 v-html="$t('f-manage-download-t')"></h2>
    <div v-html="$mt('f-manage-download')"></div>

    <button @click.prevent="downloadPortatext(this.$el)" v-t:f-manage-download-btn></button>


    <!-- CONTACT INFORMATION -->
    <h2 id="contact" v-t:f-contact-t></h2>

    <!-- Submitter email address -->
    <h3><label for="email" v-t:f-contact-email-t></label></h3>
    <input
      type="email"
      name="email"
      v-model="submission.email"
      required
      :data-ptx=
        "'# '+ $t('f-contact-t') +' - '+ $t('f-contact-email-t') +'\n'
        +'email = '+ ptxString(submission.email)"
    />

    <div v-html="$mt('f-contact-email')"></div>

    <CfpFormSubmit
      :email="submission.email"
      :submission="submission"
      :submission-ptx="collect($el)"
      v-model:confirm-dialog="confirmDialog"
    >
      <button v-t:f-submit-btn></button>
      <span class="error" v-html="proposalErrors"></span>
    </CfpFormSubmit>
  </form>
</section>
</template>

<style scoped>
input[type=radio] {
	width: 1.25rem;
	height: 1.25rem;
  line-height: 1.25rem;
	display: inline-block;
	color: black;
	background: transparent;
	appearance: none;
	border: .2rem solid var(--c-teal-400);
	border-radius: 50%;
  margin: 0.2em .75em;
  vertical-align:bottom;
  margin-left: -1.85rem;
}

input[type=radio]:checked {
  background: radial-gradient(var(--c-magenta-500) .25rem,transparent .3rem);
}

.cfp-form ol {
  list-style-type: none;
  padding-left: 2.25rem;
}
.cfp-form li {
  margin-bottom: .5rem;
}
.cfp-form h3 {
  font-size: 1.75em;
}

.cfp-form select+div,
.cfp-form textarea+div,
.cfp-form input+div {
  margin-top: 1em;
}
.error {
  font-weight: bold;
  color: red;
}
</style>
