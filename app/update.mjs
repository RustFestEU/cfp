#!/bin/env node
import 'dotenv/config'
import fetch from 'node-fetch';
import { fileURLToPath } from 'url'
import { writeFile, mkdir } from 'fs/promises';


// Check if we are running from the commandline
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  update({
    localeDataUrl: process.env.CFP_LOCALEDATA_URL,
    localeFiles: process.env.CFP_LOCALEFILES,
    dataPath: process.env.CFP_DATAPATH,
  }).then(r => { console.log('Done'); process.exit(0) })
}

export default async function update(opts = {}) {
  const localeDataUrl = opts.localeDataUrl || 'https://raw.githubusercontent.com/RustFestEU/localization/main/';
  const localeFiles = opts.localeFiles || 'cfp-form.ftl|events.ftl';
  const dataPath = opts.dataPath|| './src/data';

  // Fetch the CFP configuration from the CMS
  const configRes = await fetch(
    `${process.env.CMS_HOST}/cfp/configuration`,
    {
      headers: {
        'Authorization': `Bearer ${await auth()}`,
        'Cache-Control': 'no-store'
      }
    }
  );

  console.log(`Fetching CFP configuration...`)
  if (process.env.DEBUG) console.log(`Reponse: HTTP/`+configRes.status)

  const config = await configRes.json();

  const languages =   [];
  const languagePo =  [];
  const languageFtl = [];

  for (const loc of config.locales) {
    const [ lang, po ] = loc.split('|', 2);
    languages.push(lang);
    languagePo.push(po ?? lang);
  }

  // Normalize locales before writeing the config.json
  // TODO: maybe do this on serverside and serve separate .PO property?
  config.locales = languages;
  await mkdir(dataPath, { recursive: true });
  await writeFile(dataPath+'/config.js', 'export default ('+JSON.stringify(config, null, 2)+')');

  // Fetch the CLDR data to map language codes => their English names
  const CLDRDATA = 'https://raw.githubusercontent.com/WeblateOrg/language-data/main/cldr.csv'
  const cldrRes = await fetch(CLDRDATA);
  const cldr = await cldrRes.text();
  const cldrMap = new Map( cldr.split('\n').map(r => r.split(';',3)) );

  const languageNames = new Map( languages.map(l => [ l, cldrMap.get(l) ]) );
  if (process.env.DEBUG) console.log('Languages selected: ', languageNames);

  // Look up the the names of the languages in their respective languages
  for (const [ li, lang ] of languages.entries()) {
    const languageFile = languagePo[li];
    const lfRes = await fetch(`https://raw.githubusercontent.com/WeblateOrg/language-data/main/languages-po/${languageFile}.po`);
    const lf = await lfRes.text();

    // Simple RegExp matcher to parse the po file into a map of English -> Localized names
    const poRx = /msgid "(?<key>[^"]+)"\nmsgstr "(?<value>[^"]+)"/g;
    const llMap = new Map();

    while(true) {
      const entry = poRx.exec(lf)?.groups;
      if (!entry) break;

      llMap.set(entry.key,entry.value);
    }

    // Use the PO map to generate language.ftl
    const ftl = languages.map(
      targetLang => `lang-${targetLang} = `+ llMap.get(languageNames.get(targetLang))
    ).join('\n');

    languageFtl.push(ftl);
  }

  const assets = localeFiles.split(/[|;]/g)

  // Start all requests and load them in parallel
  const locales = Object.fromEntries(
    languages.map(lang => [lang, Object.fromEntries(
      assets.map(asset => [
        asset,
        fetch(`${localeDataUrl}/${lang}/${asset}`).then(res => res.text())
      ])
    )])
  );

  for (const lang of Object.keys(locales)) {
    for (const asset of Object.keys(locales[lang])) {
      locales[lang][asset] = await locales[lang][asset];
    }

    locales[lang]['languages.ftl'] = languageFtl[languages.indexOf(lang)];
  }

  await writeFile(dataPath+'/locales.json', JSON.stringify(locales, null, 2));
}

// Authenticate with the CMS API
// After first authentication it caches the resulting JWT and serves
// it to all consumers. A var declaration will get hoisted all the way up.
var JWT_AUTH;
async function auth() {
  if (!JWT_AUTH) {
    // We need to authenticate with the API first
    console.log('Authenticating...');

    JWT_AUTH = await fetch(
      `${process.env.CMS_HOST}/auth/local`,
      {
        method: 'post',
        body: JSON.stringify({
          identifier: process.env.CMS_USERNAME || 'sitebuild',
          password: process.env.CMS_PASSWORD
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then(r => r.json());
  }

  // Successful auth will result in a JWT token we can use to authorize the content request
  return JWT_AUTH.jwt;
}
