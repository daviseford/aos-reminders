import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { ContentGroup, Faction, Warscroll } from '../../aos4/domain'
import { AOS4_CATALOG } from '../../aos4/generated'
import { projectReminders } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'
import { createAos4BuilderViewModel } from '../../aos4/view'

/**
 * Regiments of Renown are purchasable bundles: an army from any faction a regiment's INCLUSION
 * block names may buy the whole regiment, gaining its member units and its regiment abilities
 * (issue #1858: a Skaven list with Lord Skaldior's Chosen never saw the IRONCLAD DESPOILERS
 * passive, because the native-faction filter dropped every regiment datasheet and the corpus had
 * no Regiment of Renown content at all). The reviewed classification types each kept datasheet
 * `regiment-of-renown`, offers it from exactly its inclusion factions, includes its abilities and
 * member warscrolls, and dispositions the official regiment-of-renown battle-profile rows as
 * applied to runtime.
 */

const REVIEW_PATH = path.join(process.cwd(), 'data', 'aos4', 'reviews', 'corpus-2026-08-02b.json')

const seasonal = AOS4_CATALOG.rulesContexts.find(context => context.status === 'seasonal')!
const factionByName = (name: string): Faction =>
  AOS4_CATALOG.entities.find(
    (entity): entity is Faction => entity.kind === 'faction' && entity.name === name
  )!
const regimentRoots = AOS4_CATALOG.entities.filter(
  (entity): entity is ContentGroup =>
    entity.kind === 'content-group' && entity.groupType === 'regiment-of-renown'
)
const regimentByName = (name: string): ContentGroup =>
  regimentRoots.find(root => root.name === name)!
const offeringFactionNames = (groupId: string): string[] => {
  const factionNameById = new Map(
    AOS4_CATALOG.entities.flatMap(entity => (entity.kind === 'faction' ? [[entity.id, entity.name]] : []))
  )
  return AOS4_CATALOG.relationships
    .filter(relationship => relationship.kind === 'offers' && relationship.to === groupId)
    .flatMap(relationship => {
      const name = factionNameById.get(relationship.from as never)
      return name ? [name] : []
    })
    .sort()
}

describe('Regiments of Renown in the corpus (issue #1858)', () => {
  it('classifies every source-classified Regiment of Renown with reviewed evidence', () => {
    expect(regimentRoots).toHaveLength(75)
    const review = JSON.parse(readFileSync(REVIEW_PATH, 'utf8')) as {
      regimentsOfRenown: Array<{
        officialSourceRecordIds: string[]
        reason: string
        evidenceTier?: string
      }>
    }
    expect(review.regimentsOfRenown).toHaveLength(75)
    review.regimentsOfRenown.forEach(entry => {
      expect(entry.reason).toMatch(/Regiment of Renown/)
      if (entry.evidenceTier === undefined) {
        // The official tier must cite official naming evidence.
        expect(entry.officialSourceRecordIds.length).toBeGreaterThan(0)
      } else {
        expect(entry.evidenceTier).toBe('secondary-provisional')
        expect(entry.reason).toMatch(/three-tier source policy/)
      }
    })
    // Heroes of The Jade Abbey is the one Legends regiment with no official profile row.
    expect(review.regimentsOfRenown.filter(entry => entry.evidenceTier === undefined)).toHaveLength(74)
  })

  it('offers Lord Skaldior’s Chosen to exactly its six inclusion factions, never its home faction', () => {
    const regiment = regimentByName('Lord Skaldior’s Chosen')
    expect(offeringFactionNames(regiment.id)).toEqual([
      'Blades of Khorne',
      'Disciples of Tzeentch',
      'Hedonites of Slaanesh',
      'Helsmiths of Hashut',
      'Maggotkin of Nurgle',
      'Skaven',
    ])
  })

  it('surfaces IRONCLAD DESPOILERS in a Skaven army’s reminders when the regiment is selected', () => {
    const skaven = factionByName('Skaven')
    const regiment = regimentByName('Lord Skaldior’s Chosen')

    const without = resolveSelection(AOS4_CATALOG, {
      explicitIds: [skaven.id],
      rulesContextId: seasonal.id,
    })
    expect(without.diagnostics).toEqual([])
    expect(without.availableIds).toContain(regiment.id)
    expect(projectReminders(AOS4_CATALOG, without).map(reminder => reminder.name)).not.toContain(
      'IRONCLAD DESPOILERS'
    )

    const selection = resolveSelection(AOS4_CATALOG, {
      explicitIds: [skaven.id, regiment.id],
      rulesContextId: seasonal.id,
    })
    expect(selection.diagnostics).toEqual([])
    const reminders = projectReminders(AOS4_CATALOG, selection)
    const ironclad = reminders.find(reminder => reminder.name === 'IRONCLAD DESPOILERS')
    expect(ironclad).toBeDefined()

    // Buying the regiment brings its member units.
    const selectedWarscrollNames = AOS4_CATALOG.entities
      .filter(
        (entity): entity is Warscroll =>
          entity.kind === 'warscroll' && selection.selectedIds.includes(entity.id)
      )
      .map(entity => entity.name)
    ;['Chaos Lord on Daemonic Mount', 'Chaos Knights', 'Chaos Warriors'].forEach(member =>
      expect(selectedWarscrollNames).toContain(member)
    )
  })

  it('shows the regiment as a selectable builder option in its own card group', () => {
    const skaven = factionByName('Skaven')
    const builder = createAos4BuilderViewModel(AOS4_CATALOG, {
      id: 'test',
      name: 'test',
      rulesContextId: seasonal.id,
      explicitSelectionIds: [skaven.id],
      reminderPreferences: {},
    } as never)
    const options = builder.options.filter(option => option.groupType === 'regiment-of-renown')
    expect(options.map(option => option.name)).toContain('Lord Skaldior’s Chosen')
  })

  it('keeps the Legends regiment out of the current contexts', () => {
    const jadeAbbey = regimentByName('Heroes of The Jade Abbey')
    const legends = AOS4_CATALOG.rulesContexts.find(context => context.status === 'legends')!
    expect(jadeAbbey.rulesContextIds).toEqual([legends.id])
  })

  it('dispositions the official regiment-of-renown profile rows honestly', () => {
    const catalog = JSON.parse(
      readFileSync(path.join(process.cwd(), 'data', 'aos4', 'catalog', 'official-battle-profiles.json'), 'utf8')
    ) as {
      records: Array<{ disposition: string; fact: { kind: string; name: string } }>
    }
    const rows = catalog.records.filter(record => record.fact.kind === 'regiment-of-renown')
    expect(rows).toHaveLength(76)
    const applied = rows.filter(record => record.disposition === 'applied-to-runtime')
    expect(applied).toHaveLength(74)
    // Wahapedia does not yet carry the two new Ogor supplement regiments' rules; their rows
    // honestly remain structured references until a rules source is accepted.
    expect(
      rows
        .filter(record => record.disposition === 'structured-reference')
        .map(record => record.fact.name)
        .sort()
    ).toEqual(['Okar’s Torrbad', 'Urrgar’s Maulerguts'])
  })
})
