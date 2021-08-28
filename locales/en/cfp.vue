<main>
  <h1 v-t:f_title></h1>
  <h2 v-t:f_submission_deadline_t></h2>

  <div v-html="md( $t('f_submission_deadline') )"></div>

  <h2 v-t:f_submission_t></h2>
  <h3 v-t:f_submission_lang_t></h3>
  
  <form>
    <label for="locale-select">...</label>
    <select id="locale-select" name="submission_language" v-model="locale">
      <option value="en">English</option>
      <option value="es">Español (Spanish)</option>
      <option value="ja">日本語で (Japanese)</option>
    </select>
  </form>

  <div v-html="md( $t('f_submission_lang') )"></div>
  
  <h3 v-t:f_submission_presentation_lang_t></h3>
  <div v-html="md( $t('f_submission_presentation_lang', { submission_language: 'English'}) )"></div>
</main>
