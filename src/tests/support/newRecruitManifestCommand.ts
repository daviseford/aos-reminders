import { MANIFEST_PATH, writeManifest } from './newRecruitManifest'

const manifest = writeManifest()

console.log(`Wrote ${MANIFEST_PATH}`)
console.log(
  `${manifest.totals.lists} list(s), ${manifest.totals.shapes} shape(s) covered, ` +
    `${(Object.values(manifest.totals.bytes).reduce((sum, value) => sum + value, 0) / 1024).toFixed(0)} KB total`
)
