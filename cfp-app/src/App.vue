<script setup>
import { ref, watchEffect } from 'vue';
import Configuration from './data/config.js';
import CfpForm from './components/CfpForm.vue';
import { locales, defaultLocale, languages, setLocale } from './lib/l10n.js';
import configLinks from './lib/config-links.js';


/**
 * Change the locale in use on language change
 */
const currentLanguage = ref(defaultLocale ?? 'en');
watchEffect(() => setLocale(currentLanguage.value));
</script>

<template>
  <CfpForm
    v-model:language="currentLanguage"

    :locales="locales"
    :languages="languages"
    :default-locale="defaultLocale"
    :events="Configuration['events']"
    :presentation-formats="Configuration['presentation_formats']"
    :audience-targets="Configuration['audience_targets']"
    :links="configLinks()"

  />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

.modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
	position: relative;
	display: flex;
	flex-direction: column;
	max-height: 90%;
	padding: 2rem 2rem;
	border: .2rem solid var(--c-teal-300);
	border-radius: .25rem;
	background: var(--c-gray-900);
}
@media (max-width: 540px) {
  input[type=text], input[type=email], textarea { width: 100% }
}
</style>
