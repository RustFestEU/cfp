<!-- - - - - - - - - - - - - -->
<!-- CALL FOR PROPOSALS FORM -->
<!-- - - - - - - - - - - - - -->

<main>
  <h1 v-t:f-title></h1>

  <!-- Information about the CFP process and the unconventional handling of deadlines -->
  <h2 v-t:f-submission-deadline-t></h2>
  <div v-html="$mt('f-submission-deadline', { linkUpcomingEvents })"></div>

  <div v-html="$mt('f-form-notes')"></div>


  <!-- Upload an existing proposal and manage existing submissions -->
  <h2 v-t:f-manage-t></h2>
  <div v-html="$mt('f-manage')"></div>
  <button @click=importProposal v-t:f-manage-upload-btn></button>

  <div v-html="$mt('f-manage-auth')"></div>

  <div>
    <h3><label for="auth-email" v-t:f-contact-email-t></label></h3>

    <input type="email" name="auth-email">
    <button @click=importProposal v-t:f-manage-auth-btn></button>
  </div>

  <!-- SUBMISSION FORM -->
  <h2 id="submission" v-t:f-submission-t></h2>
  
  <form>
  
    <!-- Language selection for the submission and the instructions -->

    <h3><label for="submission_language" v-t:f-submission-lang-t></label></h3>
    <select
      name="submission_language"
      v-model="submission.language"
      @change="localeChange"
      v-bind:data-export-format=
        "'# ' + $t('f-submission-lang-t') +'\n'
        +'language = '+ tomlString(submission.language) +' # '+ languageName(submission.language)"
    >
      <option v-for="loc in locales" :value="loc.lang">
        {{ loc.name }}
      </option>
    </select>

    <div v-html="$mt('f-submission-lang', { linkSupportedLanguages })"></div>

    <!-- Language selection for the presentation itself -->

    <h3><label for="submission_presentation_lang" v-t:f-submission-presentation-lang-t></label></h3>
    <input
      type="text"
      name="submission_presentation_lang"
      v-model="submission.presentation_lang"
      v-bind:placeholder="submission_language_name"
      v-bind:data-export-format=
        "'# ' + $t('f-submission-presentation-lang-t') +'\n'
        +'presentation_lang = ' + tomlString(submission.presentation_lang)"
    />

    <div v-html="$mt('f-submission-presentation-lang', { submission_language_name, linkSupportedLanguages })"></div>

    <!-- Chosing a presentation format -->

    <h3 v-t:f-submission-presentation-format-t></h3>
    <ol v-bind:data-export-format=
      "'# '+ $t('f-submission-presentation-format-t') +'\n'
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
          {{ $mti('f-submission-presentation-format-'+opt+'-t') }}
        </label>
      </li>
    </ol>

    <div v-html="$mt('f-submission-presentation-format')"></div>


    <!-- PROPOSAL CONTENTS -->
    <h2 id="proposal" v-t:f-proposal-t></h2>

    <!-- Title of the proposal -->

    <h3><label for="title" v-t:f-proposal-title-t></label></h3>
    <input
      type="text"
      name="title"
      v-model="submission.title"
      v-bind:data-export-format=
        "'# '+ $t('f-proposal-t') +' - '+ $t('f-proposal-title-t') +'\n'
        +'title = '+ tomlString(submission.title)"
    />

    <!-- Proposal summary (pitch/abstract) -->

    <h3><label for="summary" v-t:f-proposal-summary-t></label></h3>
    <textarea
      name="summary"
      v-model="submission.summary"
      v-bind:data-export-format=
        "'# '+ $t('f-proposal-t') +' - '+ $t('f-proposal-summary-t') +'\n'
        +'summary = '+ tomlText(submission.summary)"
    ></textarea>

    <div v-html="$mt('f-proposal-summary')"></div>

    <!-- Detailed description of the proposal -->

    <h3><label for="description" v-t:f-proposal-description-t></label></h3>
    <textarea
      name="description"
      v-model="submission.description"
      v-bind:data-export-format=
        "'# '+ $t('f-proposal-t') +' - '+ $t('f-proposal-description-t') +'\n'
        +'description = '+ tomlText(submission.description)"
      @focus="autogrow" @input="autogrow"
    ></textarea>

    <div v-html="$mt('f-proposal-description', { linkCfpGuidelines })"></div>

    <!-- Selecting the target audience for the proposed session -->

    <h3 v-t:f-proposal-audience-t></h3>

    <div v-html="$mt('f-proposal-audience')"></div>

    <ol v-bind:data-export-format=
      "'# '+ $t('f-proposal-t') +' - '+ $t('f-proposal-audience-t') +'\n'
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
          <span v-html="$mti('f-proposal-audience-'+opt+'-t')"></span>
        </label>
      </li>
    </ol>

    <!-- Highlight this proposal for being suited particularly well to one specific event -->

    <h3 v-t:f-proposal-highlight-t></h3>

    <div v-html="$mt('f-proposal-highlight')"></div>

    <ol v-bind:data-export-format=
      "'# '+ $t('f-proposal-t') +' - '+ $t('f-proposal-highlight-t') +'\n'
      +'event_target = '+ tomlString(submission.event_target)"
    >
      <li>
        <label>
          <input
            type="radio"
            name="event_target"
            v-model="submission.event_target"
            v-bind:value="'default'"
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
            v-bind:value="opt"
          />
          <strong v-html="$mti('event-'+opt)"></strong><br />
          <span v-html="$mti('event-'+opt+'-summary')"></span>
        </label>
      </li>
    </ol>
    
    <!-- Notes for the organizers about the proposal -->

    <h3><label for="proposal_notes" v-t:f-proposal-notes-t></label></h3>
    <textarea
      name="proposal_notes"
      v-model="submission.proposal_notes"
      v-bind:data-export-format=
        "'# '+ $t('f-proposal-t') +' - '+ $t('f-proposal-notes-t') +'\n'
        +'proposal_notes = '+ tomlText(submission.proposal_notes)"
      @focus="autogrow" @input="autogrow"
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
      v-bind:data-export-format=
        "'# '+ $t('f-submitter-t') +' - '+ $t('f-submitter-name-t') +'\n'
        +'name = '+ tomlString(submission.name)"
    />

    <!-- Tagline or affiliation of the submitter -->

    <h3><label for="tagline" v-t:f-submitter-tagline-t></label></h3>
    <input
      type="text"
      name="tagline"
      v-model="submission.tagline"
      v-bind:data-export-format=
        "'# '+ $t('f-submitter-t') +' - '+ $t('f-submitter-tagline-t') +'\n'
        +'tagline = '+ tomlString(submission.tagline)"
    />

    <div v-html="$mt('f-submitter-tagline')"></div>

    <!-- Speaker bio -->

    <h3><label for="bio" v-t:f-submitter-bio-t></label></h3>
    <textarea
      name="bio"
      v-model="submission.bio"
      v-bind:data-export-format=
        "'# '+ $t('f-submitter-t') +' - '+ $t('f-submitter-bio-t') +'\n'
        +'bio = '+ tomlText(submission.bio)"
      @focus="autogrow" @input="autogrow"
    ></textarea>

    <div v-html="$mt('f-submitter-bio')"></div>


    <h2 v-html="$mt('f-manage-download-t')"></h2>
    <div v-html="$mt('f-manage-download')"></div>

    <button @click="downloadExport" v-t:f-manage-download-btn></button>


    <!-- CONTACT INFORMATION -->
    <h2 id="contact" v-t:f-contact-t></h2>

    <!-- Submitter email address -->
    <h3><label for="email" v-t:f-contact-email-t></label></h3>
    <input
      type="email"
      name="email"
      v-model="submission.email"
      v-bind:data-export-format=
        "'# '+ $t('f-submitter-t') +' - '+ $t('f-contact-email-t') +'\n'
        +'email = '+ tomlString(submission.email)"
    />

    <div v-html="$mt('f-contact-email')"></div>

    <button>Submit Proposal</button>
  </form>
</main>
