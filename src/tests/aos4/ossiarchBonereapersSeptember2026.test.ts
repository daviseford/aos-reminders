import { readFileSync } from 'node:fs'
import { ACCEPTED_REVIEW_PATH } from '../../aos4/data/acceptedRevision'
import type { Ability, ContentEntity } from '../../aos4/domain'
import { projectReminders } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'
import { AOS4_FULL_CATALOG } from '../support/aos4FullCatalog'

/**
 * Ossiarch Bonereapers after the corpus 2026-09-30 page re-pin (issue #2037).
 *
 * The September 2026 Rules Updates (page 64, marked NEW) removes the second line of the effect of
 * five Relentless Discipline battle traits and of Katakros's Supreme Lord of the Bonereaper
 * Legions: the extra point a reinforced unit with more than half its models used to cost. The
 * pinned Wahapedia pages predated the erratum; the re-pinned root and collection pages print it,
 * so the corrected text ships from the page itself, without an override. The Lance of Ossia
 * abilities kept their surcharge (page 64 does not name them) until corpus 2026-11-19 (#1757): the
 * 18 November 2026 Rules Updates page 65 removes it, shipped through reviewed overrides.
 *
 * The re-pinned root page also wraps the Scourge of Ghyran battle formations and lore in its
 * Legendary styling. Official Scourge of Ghyran - Ossiarch Bonereapers page 1 prints them as
 * 2025-26 seasonal content, so reviewed context overrides keep them historical, where every
 * other faction's Scourge of Ghyran content sits.
 */

// Corpus 2026-10-20 and again 2026-10-27 re-pin both pages (#1757); they still print the erratum.
// corpus 2026-11-24 (#1757): both pages re-pinned again from the 2026-11-22 export.
const RE_PINNED_ROOT = 'artifact:sha256:260db4787bdd7dd8ee242e4bfc372be07ec0d881adca38d7500c5dd4249e5198'
const RE_PINNED_COLLECTION =
  'artifact:sha256:9db54c6d24da3c174b31848735645d7ca7f912f0302973460e73fbefeed25180'
const SURCHARGE = /reinforced and has more than half of its starting models/
const NOVEMBER_RULES_UPDATES_PAGE_65 =
  'source-record:games-workshop:d78cb5c2bf1bdbd72a04804f3f7872bdf3a307a910ee1b0e51bea93ba9673fda%3Apage%3A65'
/**
 * corpus 2026-11-24 (#1757): the re-pinned root page prints the page 65 Lance of Ossia erratum, so
 * the four overrides retired; each ability cites only the page, and the Rules Updates page stays
 * pinned as reviewed official evidence.
 */
const PRINTED_BY_PAGE = new Set([
  'ability:1cc1cbd2-23e1-5741-ac02-0e13461db4c5', // Vengeful Outriders
  'ability:3c26fbf7-0d57-555a-86de-b1bf803bc849', // Fury of Zandtos
  'ability:59b31e18-1482-5bb2-a0c6-54640b0536c1', // Silent Menace
  'ability:a8b3634f-afa1-5b34-b626-b0c9a4100f5b', // Blood-smeared Hooves
])
const pinnedRulesUpdatesPages = new Set(
  (
    JSON.parse(readFileSync(ACCEPTED_REVIEW_PATH, 'utf8')) as {
      officialDocuments: Array<{ sourceRecords: Array<{ id: string }> }>
    }
  ).officialDocuments.flatMap(document => document.sourceRecords.map(record => record.id))
)

const entityById = new Map<string, ContentEntity>(
  AOS4_FULL_CATALOG.entities.map(entity => [entity.id, entity])
)
const recordById = new Map(AOS4_FULL_CATALOG.sourceRecords.map(record => [record.id, record]))
const ability = (id: string): Ability => {
  const entity = entityById.get(id)
  if (entity?.kind !== 'ability') throw new Error(`No ability ${id}`)
  return entity
}
const artifactIds = (entity: ContentEntity): string[] =>
  entity.sourceRefs.flatMap(reference => {
    const record = recordById.get(reference.sourceRecordId)
    return record ? [String(record.artifactId)] : []
  })
const contextStatuses = (entity: ContentEntity): string[] =>
  entity.rulesContextIds
    .map(id => AOS4_FULL_CATALOG.rulesContexts.find(context => context.id === id)!.status)
    .sort()

// Canonical ids are the stable handles saved hides and notes hang off; the fix must keep them.
const ERRATUM_ABILITIES: Array<[string, string, string]> = [
  ['ability:de5519bc-8f30-5721-ae93-77969e28a8b2', 'IMPASSIVE RETREAT', RE_PINNED_ROOT],
  ['ability:4fc244a1-5dc2-57a3-b6a3-8b54adb4e2f4', 'RUTHLESS EXTERMINATION', RE_PINNED_ROOT],
  ['ability:78ea2b56-28bb-5181-a038-8cc6a6874ef6', 'PITILESS ASSAULT', RE_PINNED_ROOT],
  ['ability:6888f2e1-92a2-5d69-ad67-6385cc400af7', 'REMORSELESS MARCH', RE_PINNED_ROOT],
  ['ability:10efb9b5-ecf1-5d26-9874-16d4edae29fd', 'INVIOLATE LEGIONS', RE_PINNED_ROOT],
  [
    'ability:0115b296-d1dc-5af0-b6bc-f68336df4212',
    'SUPREME LORD OF THE BONEREAPER LEGIONS',
    RE_PINNED_COLLECTION,
  ],
]

describe('Ossiarch Bonereapers September 2026 Rules Updates page 64 (#2037)', () => {
  it.each(ERRATUM_ABILITIES)('drops the reinforced surcharge from %s (%s)', (id, name, artifactId) => {
    const erratum = ability(id)
    expect(erratum.name).toBe(name)
    expect(erratum.text.effect).not.toMatch(SURCHARGE)
    expect(erratum.text.effect).not.toMatch(
      /additional relentless discipline point|2 relentless discipline points/
    )
    expect(artifactIds(erratum)).toContain(artifactId)
  })

  it('keeps the rest of each erratum ability unchanged', () => {
    expect(ability('ability:6888f2e1-92a2-5d69-ad67-6385cc400af7').text.effect).toBe(
      'Spend 1 relentless discipline point. Add 3" to the Move characteristic of that unit for the rest of the phase. That unit cannot use RUN abilities for the rest of the turn.'
    )
    const inviolate = ability('ability:10efb9b5-ecf1-5d26-9874-16d4edae29fd')
    expect(inviolate.keywords).toEqual(['RELENTLESS DISCIPLINE'])
    expect(inviolate.timings.map(timing => timing.raw)).toEqual([
      'Reaction: Opponent declared an ATTACK ability',
    ])
    const katakros = ability('ability:0115b296-d1dc-5af0-b6bc-f68336df4212')
    expect(katakros.text.effect).toBe(
      'Spend a number of relentless discipline points equal to the target’s Health characteristic. The target can use 2 FIGHT abilities this phase. After the first is used, however, the target has STRIKE-LAST for the rest of the turn. In addition, the target cannot use RELENTLESS DISCIPLINE abilities for the rest of the phase.'
    )
    expect(katakros.timings.map(timing => timing.raw)).toEqual(['Any Combat Phase'])
  })

  // corpus 2026-11-19 (#1757): the November 2026 Rules Updates page 65 drops the Lance of Ossia
  // surcharge and rewords the declare steps; reviewed overrides ship the printed text.
  // corpus 2026-11-24 (#1757): the re-pinned page prints it, so the text ships from the page: Vengeful
  // Outriders' declare ends with its printed period, and Silent Menace gains the declare the retired
  // override had dropped.
  it.each([
    [
      'ability:1cc1cbd2-23e1-5741-ac02-0e13461db4c5',
      'VENGEFUL OUTRIDERS',
      'Pick a friendly LANCE OF OSSIA unit that has not used a RELENTLESS DISCIPLINE ability this phase to use this ability.',
      'Spend 1 relentless discipline point. Add 2" to that unit’s Move characteristic for the rest of the phase.',
    ],
    [
      'ability:3c26fbf7-0d57-555a-86de-b1bf803bc849',
      'FURY OF ZANDTOS',
      'Pick a friendly LANCE OF OSSIA unit that charged this turn and that has not used a RELENTLESS DISCIPLINE ability this phase to use this ability.',
      'Spend 1 relentless discipline point. That unit’s melee weapons, including Companion weapons, have Crit (2 Hits) for the rest of the turn.',
    ],
    [
      'ability:59b31e18-1482-5bb2-a0c6-54640b0536c1',
      'SILENT MENACE',
      'Pick a friendly LANCE OF OSSIA unit that has not used a RELENTLESS DISCIPLINE ability this phase to use this ability, then pick a visible enemy unit within 12" of it to be the target.',
      'Spend 1 relentless discipline point. The target cannot use the ‘Redeploy’ command for the rest of the turn.',
    ],
    [
      'ability:a8b3634f-afa1-5b34-b626-b0c9a4100f5b',
      'BLOOD-SMEARED HOOVES',
      'Pick a friendly LANCE OF OSSIA unit that charged this turn and has not used a RELENTLESS DISCIPLINE ability this phase to use this ability.',
      'Spend 1 relentless discipline point. Add 1 to the Rend characteristic of that unit’s weapons, including Companion weapons, for the rest of the turn.',
    ],
  ])(
    'ships the November Rules Updates page 65 Lance of Ossia erratum on %s (%s)',
    (id, name, declare, effect) => {
      const lance = ability(id)
      expect(lance.name).toBe(name)
      expect(lance.text.declare).toBe(declare)
      expect(lance.text.effect).toBe(effect)
      expect(lance.text.effect).not.toMatch(SURCHARGE)
      const citesPage65 = lance.sourceRefs.some(
        reference => String(reference.sourceRecordId) === NOVEMBER_RULES_UPDATES_PAGE_65
      )
      expect(
        citesPage65 ||
          (PRINTED_BY_PAGE.has(id) &&
            pinnedRulesUpdatesPages.has(NOVEMBER_RULES_UPDATES_PAGE_65) &&
            artifactIds(lance).includes(RE_PINNED_ROOT))
      ).toBe(true)
    }
  )

  it('shows the corrected battle traits in an Ossiarch Bonereapers army’s reminders', () => {
    const faction = AOS4_FULL_CATALOG.entities.find(
      entity => entity.kind === 'faction' && entity.name === 'Ossiarch Bonereapers'
    )!
    const seasonal = AOS4_FULL_CATALOG.rulesContexts.find(context => context.status === 'seasonal')!
    const selection = resolveSelection(AOS4_FULL_CATALOG, {
      explicitIds: [faction.id],
      rulesContextId: seasonal.id,
    })
    expect(selection.diagnostics).toEqual([])
    const reminderAbilityIds = new Set<string>(
      projectReminders(AOS4_FULL_CATALOG, selection).flatMap(reminder => reminder.abilityIds)
    )
    ERRATUM_ABILITIES.slice(0, 5).forEach(([id]) => expect(reminderAbilityIds.has(id)).toBe(true))
  })

  it.each([
    ['content-group:1f8fada5-4fbc-5454-b161-af3962681cd3', 'Tithe Guards'],
    ['content-group:61c03db0-94ea-5ca4-a653-5aff1bf9dd6f', 'Hekatos Drillmasters'],
    ['content-group:3a4d496a-89a0-58cb-94d3-323df94a6f62', 'Lore of Necrotheurgy'],
    ['ability:b9aac486-613b-5875-a68d-329b6821e184', 'PLENTIFUL BONE'],
    ['ability:03bab8d0-300c-5a6a-b53e-e5c410431aa0', 'DISCIPLINED HEKATOI'],
    ['ability:04dfb818-8bd0-5572-b5c7-b48444a48bd2', 'BOLSTER CREATION'],
    ['ability:f05c2b27-f64e-534f-a4f0-2648e683c9fe', 'INVIGORATE THE RANKS'],
    ['ability:7139b2ac-3d8d-5b57-aaba-0f64412b6899', 'SOUL-CLAIM'],
  ])('keeps the Scourge of Ghyran %s (%s) historical and in 2025-26, not Legends', (id, name) => {
    const entity = entityById.get(id)!
    expect(entity.name).toBe(name)
    // The overrides also name the General's Handbook 2025-26 past season (#2042), whose own content
    // this is; historical membership stays so saved armies on the overlay keep resolving it.
    expect(contextStatuses(entity)).toEqual(['historical', 'past-season'])
    expect(artifactIds(entity)).toContain(RE_PINNED_ROOT)
  })
})
