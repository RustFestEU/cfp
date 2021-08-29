<!-- - - - - - - - - - - - - -->
<!-- CALL FOR PROPOSALS FORM -->
<!-- - - - - - - - - - - - - -->

<main>
  <h1 v-t:f_title></h1>

  <!-- Information about the CFP process and the unconventional handling of deadlines -->
  <h2 v-t:f_submission_deadline_t></h2>
  <div v-html="$mt('f_submission_deadline')"></div>


  <!-- Upload an existing proposal and manage existing submissions -->
  <h2>Upload & Manage proposals</h2>
  <p>If you already have a proposal in a TOML format (exported from this page
    or another compatible conference) you can import the file here:

    <br><button>Upload Proposal</button>
  </p>

  <p>
    You may also confirm your email address to manage your existing submissions:
    <br><input type="email"><button>Send Code</button>
  </p>
  <strong>TODO: localize strings</strong>

  <!-- SUBMISSION FORM -->
  <h2 v-t:f_submission_t></h2>
  
  <form>
  
    <!-- Language selection for the submission and the instructions -->

    <h3><label for="submission_language" v-t:f_submission_lang_t></label></h3>
    <select
      name="submission_language"
      v-model="submission.language"
      @change="localeChange"
      v-bind:data-export-format=
        "'# ' + $t('f_submission_lang_t') +'\n'
        +'language = '+ tomlString(submission.language) +' # '+ languageName(submission.language)"
    >
      <option v-for="loc in locales" :value="loc.lang">
        {{ loc.name }}
      </option>
    </select>

    <div v-html="$mt('f_submission_lang')"></div>

    <!-- Language selection for the presentation itself -->

    <h3><label for="submission_presentation_lang" v-t:f_submission_presentation_lang_t></label></h3>
    <input
      name="submission_presentation_lang"
      v-model="submission.presentation_lang"
      v-bind:placeholder="submission_language_name"
      v-bind:data-export-format=
        "'# ' + $t('f_submission_presentation_lang_t') +'\n'
        +'presentation_lang = ' + tomlString(submission.presentation_lang)"
    />

    <div v-html="$mt('f_submission_presentation_lang', { submission_language_name })"></div>

    <!-- Chosing a presentation format -->

    <h3 v-t:f_submission_presentation_format_t></h3>
    <ol v-bind:data-export-format=
      "'# '+ $t('f_submission_presentation_format_t') +'\n'
      +'presentation_format = '+ tomlString(submission.presentation_format)"
    >
      <li v-for="opt in presentation_formats">
        <label>
          <input
            type="radio"
            name="presentation_format"
            v-model="submission.presentation_format"
            v-bind:value="opt"
          />
          {{ $mti('f_submission_presentation_format_'+opt+'_t') }}
        </label>
      </li>
    </ol>

    <div v-html="$mt('f_submission_presentation_format')"></div>


    <!-- PROPOSAL CONTENTS -->
    <h2 v-t:f_proposal_t></h2>

    <!-- Title of the proposal -->

    <h3><label for="title" v-t:f_proposal_title_t></label></h3>
    <input
      name="title"
      v-model="submission.title"
      v-bind:data-export-format=
        "'# '+ $t('f_proposal_t') +' - '+ $t('f_proposal_title_t') +'\n'
        +'title = '+ tomlString(submission.title)"
    />

    <!-- Proposal summary (pitch/abstract) -->

    <h3><label for="summary" v-t:f_proposal_summary_t></label></h3>
    <textarea
      name="summary"
      v-model="submission.summary"
      v-bind:data-export-format=
        "'# '+ $t('f_proposal_t') +' - '+ $t('f_proposal_summary_t') +'\n'
        +'summary = '+ tomlText(submission.summary)"
    ></textarea>

    <div v-html="$mt('f_proposal_summary')"></div>

    <!-- Detailed description of the proposal -->

    <h3><label for="description" v-t:f_proposal_description_t></label></h3>
    <textarea
      name="description"
      v-model="submission.description"
      v-bind:data-export-format=
        "'# '+ $t('f_proposal_t') +' - '+ $t('f_proposal_description_t') +'\n'
        +'description = '+ tomlText(submission.description)"
    ></textarea>

    <div v-html="$mt('f_proposal_description')"></div>

    <!-- Selecting the target audience for the proposed session -->

    <h3 v-t:f_proposal_audience_t></h3>

    <div v-html="$mt('f_proposal_audience')"></div>

    <ol v-bind:data-export-format=
      "'# '+ $t('f_proposal_t') +' - '+ $t('f_proposal_audience_t') +'\n'
      +'audience_target = '+ tomlString(submission.audience_target)"
    >
      <li v-for="opt in audience_targets">
        <label>
          <input
            type="radio"
            name="audience_target"
            v-model="submission.audience_target"
            v-bind:value="opt"
          />
          <span v-html="$mti('f_proposal_audience_'+opt+'_t')"></span>
        </label>
      </li>
    </ol>

    <!-- Notes for the organizers about the proposal -->

    <h3><label for="proposal_notes" v-t:f_proposal_notes_t></label></h3>
    <textarea
      name="proposal_notes"
      v-model="submission.proposal_notes"
      v-bind:data-export-format=
        "'# '+ $t('f_proposal_t') +' - '+ $t('f_proposal_notes_t') +'\n'
        +'proposal_notes = '+ tomlText(submission.proposal_notes)"
    ></textarea>

    <div v-html="$mt('f_proposal_notes')"></div>


    <!-- ABOUT THE SUBMITTER -->
    <h2 v-t:f_submitter_t></h2>

    <!-- Name of the submitter -->

    <h3><label for="name" v-t:f_submitter_name_t></label></h3>
    <input
      name="name"
      v-model="submission.name"
      v-bind:data-export-format=
        "'# '+ $t('f_submitter_t') +' - '+ $t('f_submitter_name_t') +'\n'
        +'name = '+ tomlString(submission.name)"
    />

    <!-- Tagline or affiliation of the submitter -->

    <h3><label for="tagline" v-t:f_submitter_tagline_t></label></h3>
    <input
      name="tagline"
      v-model="submission.tagline"
      v-bind:data-export-format=
        "'# '+ $t('f_submitter_t') +' - '+ $t('f_submitter_tagline_t') +'\n'
        +'tagline = '+ tomlString(submission.tagline)"
    />

    <div v-html="$mt('f_submitter_tagline')"></div>

    <!-- Speaker bio -->

    <h3><label for="bio" v-t:f_submitter_bio_t></label></h3>
    <textarea
      name="bio"
      v-model="submission.bio"
      v-bind:data-export-format=
       "'# '+ $t('f_submitter_t') +' - '+ $t('f_submitter_bio_t') +'\n'
       +'bio = '+ tomlText(submission.bio)"
    ></textarea>

    <div v-html="$mt('f_submitter_bio')"></div>

    <button @click="downloadExport">Download Proposal</button>
  </form>
</main>
