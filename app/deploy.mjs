import update from './update.mjs'
import build from './build.mjs'

export default async function deploy(config) {
  await update(config)
  await build(config)
}
