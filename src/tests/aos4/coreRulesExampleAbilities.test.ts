import { readFileSync } from 'node:fs'
import path from 'node:path'
import { armyFactions, type Aos4Catalog, type Faction } from '../../aos4/domain'
import { AOS4_CATALOG } from '../../aos4/generated'
import { projectReminders } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'

/**
 * Customer report 2026-07-31: reminders for ordinary armies showed "Mystic Shield" and
 * "Resurrection", which are not playable AoS 4 abilities. Wahapedia's core rules page (and the
 * General's Handbook 2024-25 / 2025-26 rules pages) reproduce the core rulebook's illustrative
 * EXAMPLE SPELL card (Mystic Shield) and EXAMPLE PRAYER card (Resurrection) to show the
 * ability-card format, and the bounded rules-page parser ingested those example cards as real
 * abilities inside the universal "Spells" / "Prayers" groups.
 *
 * The correction is a reviewed input: the accepted review (`data/aos4/reviews/corpus-2026-08-01.json`,
 * carried forward from the prepared corpus-2026-07-31 revision) dispositions the six example-card
 * source records as ignored, and the shipped catalog no longer contains those entities. The
 * Ascension page's Mystic Shield and Resurrection are deliberately NOT excluded: there they are
 * genuine Path of the Mage / Path of the Devout rank rewards ("ELITE: When a HERO on this Path
 * gains this rank, pick 1 of the following abilities"), and that page is already reference-only.
 * Sacred Rites is likewise kept: the core rules state "All PRIESTS know the following prayer", so
 * it is a real universal ability.
 */

interface AcceptedReview {
  revision: string
  ignoredSourceRecords: Array<{ sourceRecordId: string; reason: string }>
}

const wahapediaRulesAbilityRecordId = (page: string, section: string, index: number): string =>
  `source-record:wahapedia:html%3Ahttps%3A%2F%2Fwahapedia.ru%2Faos4%2Fthe-rules%2F${page}%2F%23rules-ability%3A${section}%3Aability%3A${index}`

const EXAMPLE_CARD_SOURCE_RECORD_IDS = [
  wahapediaRulesAbilityRecordId('the-core-rules', 'Spells', 1),
  wahapediaRulesAbilityRecordId('the-core-rules', 'Prayers', 2),
  wahapediaRulesAbilityRecordId('general-s-handbook-2024-25', 'Spells', 1),
  wahapediaRulesAbilityRecordId('general-s-handbook-2024-25', 'Prayers', 1),
  wahapediaRulesAbilityRecordId('general-s-handbook-2025-26', 'Spells', 1),
  wahapediaRulesAbilityRecordId('general-s-handbook-2025-26', 'Prayers', 2),
]

const EXAMPLE_CARD_NAMES = ['MYSTIC SHIELD', 'RESURRECTION']

const acceptedReview = JSON.parse(
  readFileSync(path.join(process.cwd(), 'data', 'aos4', 'reviews', 'corpus-2026-08-01.json'), 'utf8')
) as AcceptedReview

const exampleRecordIdSet = new Set(EXAMPLE_CARD_SOURCE_RECORD_IDS)

/** The shipped catalog is generated from the accepted review, so nothing should remain to drop. */
const excludedEntityIds = new Set(
  AOS4_CATALOG.entities
    .filter(
      entity =>
        entity.sourceRefs.length > 0 &&
        entity.sourceRefs.every(reference => exampleRecordIdSet.has(reference.sourceRecordId))
    )
    .map(entity => entity.id)
)

const correctedCatalog: Aos4Catalog = {
  ...AOS4_CATALOG,
  entities: AOS4_CATALOG.entities.filter(entity => !excludedEntityIds.has(entity.id)),
  relationships: AOS4_CATALOG.relationships.filter(
    relationship => !excludedEntityIds.has(relationship.from) && !excludedEntityIds.has(relationship.to)
  ),
}

const reminderNames = (
  catalog: Aos4Catalog,
  faction: Faction,
  rulesContextId: string,
  overlays: { allowsLegends?: boolean; allowsHistorical?: boolean } = {}
): string[] => {
  const selection = resolveSelection(catalog, {
    explicitIds: [faction.id],
    rulesContextId: rulesContextId as never,
    ...overlays,
  })
  return projectReminders(catalog, selection).map(reminder => reminder.name)
}

describe('core-rules example ability cards stay out of reminders (customer report 2026-07-31)', () => {
  it('dispositions every example-card source record as ignored in the accepted review revision', () => {
    expect(acceptedReview.revision).toBe('aos4-corpus-2026-08-01')
    const ignoredById = new Map(
      acceptedReview.ignoredSourceRecords.map(record => [record.sourceRecordId, record.reason])
    )
    EXAMPLE_CARD_SOURCE_RECORD_IDS.forEach(sourceRecordId => {
      expect(ignoredById.has(sourceRecordId)).toBe(true)
      expect(ignoredById.get(sourceRecordId)).toMatch(/example/i)
      expect(String(ignoredById.get(sourceRecordId)).trim()).not.toBe('')
    })
    // The previously accepted disposition is carried forward, not replaced.
    expect(
      ignoredById.has('source-record:wahapedia:Faction_abilities.csv%3ACoS%3A000000529%3A000002058%3A2')
    ).toBe(true)
    // The class fix must not overreach onto real universal abilities or the genuine Ascension
    // Path of the Mage / Path of the Devout rank rewards.
    acceptedReview.ignoredSourceRecords.forEach(record =>
      expect(record.sourceRecordId).not.toMatch(/ascension/)
    )
    // Sacred Rites is a real universal prayer ("All PRIESTS know the following prayer").
    expect(ignoredById.has(wahapediaRulesAbilityRecordId('the-core-rules', 'Prayers', 1))).toBe(false)
  })

  it('targets only the illustrative Mystic Shield and Resurrection cards', () => {
    const targeted = AOS4_CATALOG.entities.filter(entity =>
      entity.sourceRefs.some(reference => exampleRecordIdSet.has(reference.sourceRecordId))
    )
    // The accepted catalog is generated from the review, so the list is expected to be empty.
    // Either way, nothing except the two example cards may be touched by the exclusions.
    expect(targeted).toEqual([])
    targeted.forEach(entity => {
      expect(entity.kind).toBe('ability')
      expect(EXAMPLE_CARD_NAMES).toContain(entity.name)
      expect(entity.sourceRefs.every(reference => exampleRecordIdSet.has(reference.sourceRecordId))).toBe(
        true
      )
    })
    expect(targeted.length).toBeLessThanOrEqual(EXAMPLE_CARD_SOURCE_RECORD_IDS.length)
  })

  it('keeps the example cards out of every army reminder view in every context and overlay', () => {
    const armies = armyFactions(correctedCatalog)
    expect(armies.length).toBeGreaterThan(0)
    armies.forEach(faction => {
      faction.rulesContextIds.forEach(rulesContextId => {
        const names = reminderNames(correctedCatalog, faction, rulesContextId, {
          allowsLegends: true,
          allowsHistorical: true,
        })
        EXAMPLE_CARD_NAMES.forEach(name => expect(names).not.toContain(name))
      })
    })
  })

  it('loses nothing except the example cards from a representative army', () => {
    const stormcast = AOS4_CATALOG.entities.find(
      (entity): entity is Faction => entity.kind === 'faction' && entity.name === 'Stormcast Eternals'
    )
    expect(stormcast).toBeDefined()
    stormcast!.rulesContextIds.forEach(rulesContextId => {
      const before = reminderNames(AOS4_CATALOG, stormcast!, rulesContextId)
      const after = reminderNames(correctedCatalog, stormcast!, rulesContextId)
      expect(after).toEqual(before.filter(name => !EXAMPLE_CARD_NAMES.includes(name)))
      EXAMPLE_CARD_NAMES.forEach(name => expect(after).not.toContain(name))
    })

    // The real universal abilities from the same core-rules page survive the exclusion.
    const seasonal = AOS4_CATALOG.rulesContexts.find(context => context.status === 'seasonal')!
    const seasonalNames = reminderNames(correctedCatalog, stormcast!, seasonal.id)
    ;['SACRED RITES', 'UNBIND', 'BANISH MANIFESTATION', 'ALL-OUT ATTACK', 'RALLY'].forEach(name =>
      expect(seasonalNames).toContain(name)
    )
  })
})
