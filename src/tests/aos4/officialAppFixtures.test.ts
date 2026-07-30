import fs from 'node:fs'

import { AOS4_RUNTIME_PROJECTION } from '../../aos4/generated'
import { decodeAos4TextRoster } from '../../importers/aos4'
import {
  decodeOfficialAppFixture,
  officialAppExpectedPath,
  officialAppFixtureIds,
  officialAppGolden,
  readOfficialAppExpected,
  readOfficialAppFixture,
} from '../support/officialAppFixtures'

const ids = officialAppFixtureIds()

const factionNames = new Set(
  AOS4_RUNTIME_PROJECTION.entities.filter(entity => entity.kind === 'faction').map(entity => entity.name)
)

/**
 * Lines the app emits that are bookkeeping rather than roster content. A selection label matching
 * any of these means the parser mistook scaffolding for a unit — the failure mode that let a
 * `-----` separator become a faction name.
 */
const scaffoldingPattern =
  /^(?:[-–—]{2,}|Regiment \d+|Auxiliary Units|Auxiliaries|Faction Terrain|Regiments? of Renown|Drops?:|App:|Army of Renown|Battle Tactics? Cards?:|Legends|General|Reinforced)$/i

describe('official app list fixtures', () => {
  it('has at least one fixture and a golden for each', () => {
    expect(ids.length).toBeGreaterThan(0)
    const missing = ids.filter(id => !fs.existsSync(officialAppExpectedPath(id)))
    expect(missing).toEqual([])
  })

  it.each(ids)('%s matches its recorded golden', id => {
    expect(officialAppGolden(id)).toEqual(readOfficialAppExpected(id))
  })

  it.each(ids)('%s imports cleanly and declares a faction the catalog knows', id => {
    const { parsedRoster, diagnostics } = decodeOfficialAppFixture(id)

    // Illegal armies are a tournament organiser's problem, not the importer's. These fixtures are
    // deliberately over points; they must still decode without complaint.
    expect(diagnostics).toEqual([])
    expect(parsedRoster).toBeDefined()
    expect(factionNames).toContain(parsedRoster?.declaredFaction)
  })

  it.each(ids)('%s produces no selection built from scaffolding', id => {
    const { parsedRoster } = decodeOfficialAppFixture(id)
    const sourceLines = readOfficialAppFixture(id).split(/\r\n?|\n/)

    for (const selection of parsedRoster?.selections ?? []) {
      expect(selection.label.trim()).not.toBe('')
      expect(selection.label).not.toMatch(scaffoldingPattern)
      // A points cost is roster metadata; it must never survive into a label we try to resolve.
      expect(selection.label).not.toMatch(/\(\s*\+?\d+\s*(?:pts?|points?)?\s*\)$/i)
      // Every selection must be traceable to a real, non-empty line of the source roster.
      expect(sourceLines[selection.line - 1]?.trim()).not.toBe('')
    }
  })

  it.each(ids)('%s decodes deterministically and survives CRLF', id => {
    const text = readOfficialAppFixture(id)
    expect(decodeOfficialAppFixture(id)).toEqual(decodeOfficialAppFixture(id))
    expect(decodeAos4TextRoster(text.replace(/\n/g, '\r\n'))).toEqual(decodeAos4TextRoster(text))
  })
})
