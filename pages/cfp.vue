<!-- - - - - - - - - - - - - -->
<!-- CALL FOR PROPOSALS FORM -->
<!-- - - - - - - - - - - - - -->

<main>
  <h1 v-t:f_title></h1>

  <!-- Information about the CFP process and the unconventional handling of deadlines -->
  <h2 v-t:f_submission_deadline_t></h2>
  <div v-html="md( $t('f_submission_deadline') )"></div>


  <!-- SUBMISSION FORM -->
  <h2 v-t:f_submission_t></h2>
  
  <form>
  
    <!-- Language selection for the submission and the instructions -->

    <h3><label for="submission_language" v-t:f_submission_lang_t></label></h3>
    <select
      name="submission_language"
      v-model="submission_language"
      @change="localeChange"
    >
      <option v-for="loc in locales" :value="loc.lang">
        {{ loc.name }}
      </option>
    </select>

    <div v-html="md( $t('f_submission_lang') )"></div>

    <!-- Language selection for the presentation itself -->

    <h3><label for="submission_presentation_lang" v-t:f_submission_presentation_lang_t></label></h3>
    <input
      name="submission_presentation_lang"
      v-model="submission_presentation_lang"
      v-bind:placeholder="submission_language_name"
    />

    <div v-html="md( $t('f_submission_presentation_lang', { submission_language_name }) )"></div>

    <!-- Chosing a presentation format -->

    <h3 v-t:f_submission_presentation_format_t></h3>
    <ol>
      <li v-for="opt in presentation_formats">
        <label>
          <input
            type="radio"
            name="presentation_format"
            v-model="presentation_format"
            v-bind:value="opt"
          />
          {{ $t('f_submission_presentation_format_'+opt+'_t') }}
        </label>
      </li>
    </ol>

    <div v-html="md( $t('f_submission_presentation_format') )"></div>


    <!-- PROPOSAL CONTENTS -->
    <h2 v-t:f_proposal_t></h2>

    <!-- Title of the proposal -->

    <h3><label for="title" v-t:f_proposal_title_t></label></h3>
    <input
      name="title"
      v-model="title"
    />

    <!-- Proposal summary (pitch/abstract) -->

    <h3><label for="summary" v-t:f_proposal_summary_t></label></h3>
    <textarea
      name="summary"
      v-model="summary"
    ></textarea>

    <div v-html="md( $t('f_proposal_summary') )"></div>

    <!-- Detailed description of the proposal -->

    <h3><label for="description" v-t:f_proposal_description_t></label></h3>
    <textarea
      name="description"
      v-model="description"
    ></textarea>

    <div v-html="md( $t('f_proposal_description') )"></div>

    <!-- Selecting the target audience for the proposed session -->

    <h3 v-t:f_proposal_audience_t></h3>

    <div v-html="md( $t('f_proposal_audience') )"></div>

    <ol>
      <li v-for="opt in audience_targets">
        <label>
          <input
            type="radio"
            name="audience_target"
            v-model="audience_target"
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
      v-model="proposal_notes"
    ></textarea>

    <div v-html="md( $t('f_proposal_notes') )"></div>

  </form>
</main>
