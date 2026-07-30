import { officialAppFixtureIds, writeOfficialAppGolden } from './officialAppFixtures'

/**
 * Regenerate the `expected.json` golden beside every official app list fixture.
 *
 * Goldens are review artefacts, not proof: regenerating records whatever the parser does today.
 * Read the diff before committing — `officialAppFixtures.test.ts` also asserts corpus-backed
 * invariants that hold independently of these files.
 */
const main = (): void => {
  const ids = officialAppFixtureIds()
  ids.forEach(id => {
    writeOfficialAppGolden(id)
    console.log(`wrote expected.json for ${id}`)
  })
  console.log(`\n${ids.length} fixture${ids.length === 1 ? '' : 's'} regenerated.`)
}

main()
