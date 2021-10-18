#!/bin/env node
import 'dotenv/config'
import { build } from 'vite'
//import vue from '@vitejs/plugin-vue'

import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { mkdir, writeFile } from 'fs/promises'

const ROOT = dirname(fileURLToPath(import.meta.url))

// Check if we are running from the commandline
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generate({
    assetsDir: process.env.CFP_ASSETS_DIR,
    deployDir: process.env.CFP_DEPLOY_DIR,
    // Path or falsey value if not needed
    writeIndex: process.env.CFP_WRITE_INDEX,
    //writeIndex: false,
    // Absolute path, or relative to deploy dir
    writeHeaders: process.env.CFP_WRITE_HEADERS,
    //writeHeaders: 'cfp/cfp-app.header-include.njk',
  }).then(r => { console.log('Done'); process.exit(0) })
}

export default async function generate(opts = {}) {
  const writeIndex = typeof opts.writeIndex == 'string' ? opts.writeIndex : (opts.writeIndex && 'index.html')
  const writeHeaders = typeof opts.writeHeaders == 'string' ? opts.writeHeaders : (opts.writeHeaders && 'headers.html')
  const assetsDir = opts.assetsDir || 'assets'
  const deployDir = opts.deployDir || '.'

  console.log('Generating CFP App build...')

  const { output } = await build({
    root: ROOT,
    logLevel: 'error',
    build: {
      write: false,
      assetsDir,
    },
    //https://github.com/vitejs/vite/issues/5335
    //plugins: [vue()],
  })

  if (process.env.DEBUG) console.log(
    output.map(r => `[cfp::build] ${r.fileName}: [${r.type ?? '-'}] ${r.code?.length ?? r.source.length ?? '?'}b`).join('\n')
  )

  const result = {
    files: [],
    index: '',
    imports: ''
  }
  for (const r of output) {

    // Save individual files
    if (r.fileName.startsWith(assetsDir)) {
      result.files.push([ r.fileName, r.code ?? r.source ])

    // Pull <header> resources to be included on the page
    } else if (r.fileName === 'index.html') {
      result.index = r.source

      // Extract style links and scripts pointing to the assetsDir
      const headLines = r.source.split('\n').flatMap(
        ln => ln.includes(assetsDir)? [ ln.trim() ] : []
      )

      result.imports = headLines.join('\n')
    }
  }

  if (opts.writeIndex || opts.writeHeaders) {
    await writeout({ writeIndex, writeHeaders, deployDir }, result)
  }
}

async function writeout(opts = {}, result) {
  const { writeIndex, writeHeaders, deployDir } = opts

  // Write asset files
  for (const [ fn, data ] of result.files) {
    const file = resolve(opts.deployDir, fn)

    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, data)
  }

  // Write index.html
  if (writeIndex) {
    const file = resolve(opts.deployDir, writeIndex)
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, result.index)
  }

  // Write headers include only
  if (writeHeaders) {
    const file = resolve(opts.deployDir, writeHeaders)
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, result.imports)
  }
}
