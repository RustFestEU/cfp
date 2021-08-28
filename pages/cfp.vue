<main>
  <h1 v-t:f_title></h1>
  <h2 v-t:f_submission_deadline_t></h2>

  <div v-html="md( $t('f_submission_deadline') )"></div>

  <h2 v-t:f_submission_t></h2>
  
  <form>
    
    <h3><label for="locale-select" v-t:f_submission_lang_t></label></h3>
    <select id="locale-select" name="submission_language" v-model="submission_language" @change="localeChange">
      <option v-for="loc in locales" :value="loc.lang">{{ loc.name }}</option>
    </select>

    <div v-html="md( $t('f_submission_lang') )"></div>
  
    <h3 v-t:f_submission_presentation_lang_t></h3>
    <div v-html="md( $t('f_submission_presentation_lang', { submission_language_name }) )"></div>

  </form>
</main>
