import fetch from 'node-fetch';
import { writeFileSync, mkdirSync } from 'fs';

const languages = ['en','es'];
const assets = ['cfp-form.ftl', 'events.ftl', 'languages.ftl']

const locales = Object.fromEntries(
  languages.map(lang => [lang, Object.fromEntries(
    assets.map(asset => [asset, get(lang, asset)])
  )])
);

for (const lang of Object.keys(locales)) {
  for (const asset of Object.keys(locales[lang])) {
    locales[lang][asset] = await locales[lang][asset];
  }
}

mkdirSync('./src/data', { recursive: true });
writeFileSync('./src/data/locales.json', JSON.stringify(locales, null, 2));

async function get(lang, asset) {
  const res = await fetch(`https://raw.githubusercontent.com/RustFestEU/localization/main/${lang}/${asset}`);
  return res.text();
}
