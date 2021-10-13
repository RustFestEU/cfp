import { createFluentVue } from 'fluent-vue';
import { FluentBundle, FluentResource } from '@fluent/bundle';

import Configuration from '../data/config.js';
import availableLocales from '../data/locales.json';



export const bundles = {};
export const defaultLocale = urlLocale() ?? Configuration['default_locale'];
let currentLocale;

// Fetch & create all locale bundles
for (let lang of Configuration.locales) {
  // useIsolating OFF (needed to avoid junk in interpolated URLs)
  // https://projectfluent.org/fluent.js/bundle/classes/fluentbundle.html#constructor
  // Intl.DateTimeFormat chokes on zn_Hans, but accepts zn-Hans
  const b = new FluentBundle(lang.replace('_','-'), { useIsolating: false });

  const resources = ['cfp-form.ftl', 'events.ftl', 'languages.ftl'];
  for (const res of resources) {
    const resource = availableLocales[lang]?.[res];
    if (!resource) {
      console.log(`Locale bundle ${lang}/${res} not found or empty!`);
    }
  
    // Add translations to bundle
    b.addResource(new FluentResource(resource))
  
    bundles[lang] = [b];
  }
}

// Add the fallback locale to all other language bundles
for (const [lang,bundle] of Object.entries(bundles)) {
  if (lang !== defaultLocale) {
    bundle.push(...bundles[defaultLocale]);
  }
}

// List of locales and languages
// Locale information
export const locales = Object.keys(bundles);

export const languages = {};
for (const [inlang, resourceBundles] of Object.entries(bundles)) {
  languages[inlang] = Object.fromEntries(
    locales.map(lang => [
      lang,
      // Check each resource for the language, get the first non-empty message
      resourceBundles.map(
        b => b.getMessage(`lang-${lang}`)?.value
      ).filter(i => !!i)[0] ?? lang
    ])
  )
}

// Changes the currently used language bundle
export function setLocale(language) {
  if (language === currentLocale) return;

  if (!language || language in bundles === false) {
    console.error(new Error(`Requested invalid locale for setLocale: ${language ?? typeof language}`));
    return;
  }

  currentLocale = language;
  fluent.bundles = bundles[currentLocale];

  return currentLocale;
}
export function getLocale() {
  return currentLocale;
}

// Create fluent-vue instance
export const fluent = createFluentVue({
  bundles: bundles[defaultLocale]
});
setLocale(currentLocale);

// Allow the default locale to be controlled externally
// Page location / hash:
function urlLocale() {
  const hash = window.location.hash.slice(1).replace(/-/g,'_').toLowerCase();

  for (let lang of Configuration.locales) {
    if (hash === lang.toLowerCase()) return lang;
  }
}
