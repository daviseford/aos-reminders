import fs from 'node:fs'
import path from 'node:path'

import type { Aos4ParsedRosterResult } from '../../aos4/import'
import { decodeAos4TextRoster } from '../../importers/aos4'

export const OFFICIAL_APP_FIXTURE_DIR = path.resolve(
  process.cwd(),
  'src/tests/fixtures/aos4/import/official-app/lists'
)

export const LIST_FILE = 'list.txt'
export const EXPECTED_FILE = 'expected.json'

export const officialAppFixtureIds = (): string[] =>
  fs
    .readdirSync(OFFICIAL_APP_FIXTURE_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(id => fs.existsSync(path.join(OFFICIAL_APP_FIXTURE_DIR, id, LIST_FILE)))
    .sort()

export const readOfficialAppFixture = (id: string): string =>
  fs.readFileSync(path.join(OFFICIAL_APP_FIXTURE_DIR, id, LIST_FILE), 'utf8')

export const officialAppExpectedPath = (id: string): string =>
  path.join(OFFICIAL_APP_FIXTURE_DIR, id, EXPECTED_FILE)

export const readOfficialAppExpected = (id: string): unknown =>
  JSON.parse(fs.readFileSync(officialAppExpectedPath(id), 'utf8'))

export const decodeOfficialAppFixture = (id: string): Aos4ParsedRosterResult =>
  decodeAos4TextRoster(readOfficialAppFixture(id))

/**
 * The golden shape written to `expected.json`.
 *
 * Selections are recorded with their source line so a golden diff points at the roster text that
 * produced it, rather than at an index that shifts whenever a line is added above.
 */
export const officialAppGolden = (id: string): unknown => {
  const { parsedRoster, diagnostics } = decodeOfficialAppFixture(id)
  return {
    id,
    diagnostics,
    ...(parsedRoster
      ? {
          proposedName: parsedRoster.proposedName,
          declaredFaction: parsedRoster.declaredFaction ?? null,
          declaredContext: parsedRoster.declaredContext ?? null,
          allowsLegends: Boolean(parsedRoster.allowsLegends),
          selections: parsedRoster.selections.map(selection => ({
            line: selection.line,
            kindHint: selection.kindHint,
            label: selection.label,
            ...(selection.count === undefined ? {} : { count: selection.count }),
            ...(selection.isLegends ? { isLegends: true } : {}),
          })),
        }
      : { parsedRoster: null }),
  }
}

export const writeOfficialAppGolden = (id: string): void => {
  fs.writeFileSync(officialAppExpectedPath(id), `${JSON.stringify(officialAppGolden(id), null, 2)}\n`)
}
