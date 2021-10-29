#!/bin/env node
const { writeFileSync, mkdir } = require('fs')
const { resolve } = require('path')
const { pathToFileURL } = require('url')
const { prompt } = require('enquirer')

const exampleConfig = pathToFileURL(resolve(__dirname, './example-config.json'))
const customization = [
  {
    type: 'input',
    name: 'configurationUrl',
    message: 'Configuration file? (defaults to the example config.)',
    initial: 'example-config.json',
    footer: 'This can be either JSON file, local or online, or the URL of a Strapi backend instance (with the cfp plugin installed and configured).'
  },
  {
    type: 'input',
    name: 'localeDataUrl',
    message: 'URL of the localization data?',
    initial: 'https://raw.githubusercontent.com/RustFestEU/localization/main',
  },
  {
    type: 'input',
    name: 'localeFiles',
    message: 'L10n filenames to look for?',
    initial: 'cfp-form.ftl|events.ftl',
  },
  {
    type: 'input',
    name: 'deployDir',
    message: 'Deploy dir?',
    initial: resolve(process.cwd(), 'demo')
  },
  {
    type: 'input',
    name: 'assetsDir',
    message: 'Path of the CFP App assets? (JS,CSS)',
    initial: 'assets'
  },
  {
    type: 'input',
    name: 'writeIndex',
    message: 'Create the HTML output? (default: yes)',
    initial: 'index.html'
  },
  {
    type: 'input',
    name: 'writeHeaders',
    meesage: 'Create the HTML header-contents only file? (default: no)',
    writeHeaders: '',
  }
]

if (process.env.DEBUG) console.log(process.argv)
if (!process.argv[1].includes('/create-cfp-app')) {
  console.error('Please run standalone (e.g.: yarn create cfp-app)')
  process.exit(1)
}

console.clear();
(async () => {
  const cfpApp = await import('cfp-app')

  const options = await prompt(customization)
  if (options.configurationUrl === 'example-config.json') options.configurationUrl = exampleConfig

  const settings = resolve(options.deployDir, '.settings.json')
  writeFileSync(settings, JSON.stringify(options, null, 2))
  console.log('Settings saved in: '+settings)

  await cfpApp.default(options)

})().then(r => process.exit(0), e => process.exit(console.error(e) ?? 1))
