import Configuration from './config.js';

//TODO: import
const { FluentBundle, FluentResource } = window.FluentBundle;


export const bundles = {};
export const defaultLocale = Configuration['default_locale'];

// Fetch & create all locale bundles
for (const lang of Configuration.locales) {
  // useIsolating OFF (needed to avoid junk in interpolated URLs)
  // https://projectfluent.org/fluent.js/bundle/classes/fluentbundle.html#constructor
  const b = new FluentBundle(lang, { useIsolating: false });
  const resource = await fetch(
    `${Configuration.approot ?? '.'}/locales/${lang}/cfp.ftl`
  ).then(r => r.text());

  if (resource) {
    // Add translations to bundle
    b.addResource(new FluentResource(resource))

    bundles[lang] = [b];

  } else {
    console.log(`Locale bundle ${lang} not loaded!`);
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
