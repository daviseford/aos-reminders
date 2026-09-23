import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { ContentGroup, Faction, Warscroll } from '../../aos4/domain'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { resolveParsedRoster } from '../../aos4/import'
import { projectReminders } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'
import { createAos4BuilderViewModel } from '../../aos4/view'
import { decodeAos4TextRoster } from '../../importers'

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
const regimentByName = (name: string): ContentGroup => regimentRoots.find(root => root.name === name)!
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

  /**
   * The September 2026 Sons of Behemat intake (#2013) replaced these gargants' Wahapedia
   * datasheets with BSData rewrites that keep the canonical identity, but the regiments still
   * listed the removed dataset ids as members, so every membership edge was silently dropped and
   * buying the regiment no longer brought its gargant (issue #2015). The expected ids are the
   * canonical members the regiments carried before that intake.
   */
  it.each([
    ['Stumblefoot Gargant', 'Mancrusher Gargant', 'warscroll:06a69891-28af-5713-862f-ac3fb4dafe8a'],
    ['Big Drogg Fort-Kicka', 'Gatebreaker Mega-Gargant', 'warscroll:c50102f8-30ae-554e-bfdf-bb69b5309cfa'],
    ['Bundo Whalebiter', 'Kraken-eater Mega-Gargant', 'warscroll:016bb11c-2513-5e75-a59a-77d04a656975'],
    ['One-eyed Grunnock', 'Warstomper Mega-Gargant', 'warscroll:c1ca7743-2b84-5477-a00c-df3e47641b92'],
    ['Odo Godswallow', 'Beast-smasher Mega-Gargant', 'warscroll:93fa0797-5c2b-5160-ab13-868f82e36017'],
  ])(
    'brings %s’s member %s when an Ironjawz army buys it (issue #2015)',
    (regimentName, memberName, memberId) => {
      const ironjawz = factionByName('Ironjawz')
      const regiment = regimentByName(regimentName)
      const without = resolveSelection(AOS4_CATALOG, {
        explicitIds: [ironjawz.id],
        rulesContextId: seasonal.id,
      })
      expect(without.availableIds).toContain(regiment.id)
      expect(without.selectedIds).not.toContain(memberId)

      const selection = resolveSelection(AOS4_CATALOG, {
        explicitIds: [ironjawz.id, regiment.id],
        rulesContextId: seasonal.id,
      })
      expect(selection.diagnostics).toEqual([])
      const selectedWarscrolls = AOS4_CATALOG.entities.filter(
        (entity): entity is Warscroll =>
          entity.kind === 'warscroll' && selection.selectedIds.includes(entity.id)
      )
      expect(selectedWarscrolls.map(entity => [entity.id, entity.name])).toEqual([[memberId, memberName]])
    }
  )

  /**
   * Imported rosters reach the member two ways. The official app lists it on its own line inside
   * the bundle, which resolves across factions even without the regiment's edge; Listbot writes
   * only the regiment's unit line, so the member arrives solely through the `includes` edge that
   * issue #2015 lost.
   */
  describe('importing an Ironjawz roster that buys Stumblefoot Gargant (issue #2015)', () => {
    const mancrusherId = 'warscroll:06a69891-28af-5713-862f-ac3fb4dafe8a'
    const importedWarscrollIds = (text: string) => {
      const { parsedRoster, diagnostics } = decodeAos4TextRoster(text)
      expect(diagnostics).toEqual([])
      const preview = resolveParsedRoster(AOS4_CATALOG, parsedRoster!, {
        defaultRulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
        createDocumentId: () => 'army:ror-member-import',
      })
      expect(preview.diagnostics).toEqual([])
      const document = preview.proposedDocument!
      const selection = resolveSelection(AOS4_CATALOG, {
        explicitIds: document.explicitSelectionIds,
        rulesContextId: document.rulesContextId,
      })
      expect(selection.diagnostics).toEqual([])
      return AOS4_CATALOG.entities
        .filter(entity => entity.kind === 'warscroll' && selection.selectedIds.includes(entity.id))
        .map(entity => entity.id)
    }

    it('brings the member from a Listbot regiment unit line', () => {
      const listbot = [
        'Ironjawz',
        'Ironfist',
        '',
        "General's Handbook 2026-27",
        '',
        '- 1 x Stumblefoot Gargant (140)',
        '',
        '140/2000pts',
        '1 drop',
        '',
        'Generated by Listbot 4.0',
        '',
      ].join('\n')
      expect(importedWarscrollIds(listbot)).toEqual([mancrusherId])
    })

    it('brings the current member from an official app bundle with its member line', () => {
      const officialApp = [
        'Member import 140/2000 pts',
        '-----',
        'Orruk Warclans | Ironjawz | Ironfist',
        "General's Handbook 2026-27",
        '-----',
        'Regiments of Renown',
        'Stumblefoot Gargant (140)',
        'Mancrusher Gargant',
        '-----',
        'Created with Warhammer Age of Sigmar: The App',
        'App: v1.36.0 (1) | Data: v466',
        '',
      ].join('\n')
      expect(importedWarscrollIds(officialApp)).toEqual([mancrusherId])
    })
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
      readFileSync(
        path.join(process.cwd(), 'data', 'aos4', 'catalog', 'official-battle-profiles.json'),
        'utf8'
      )
    ) as {
      records: Array<{ disposition: string; fact: { kind: string; name: string } }>
    }
    const rows = catalog.records.filter(record => record.fact.kind === 'regiment-of-renown')
    expect(rows).toHaveLength(81)
    const applied = rows.filter(record => record.disposition === 'applied-to-runtime')
    expect(applied).toHaveLength(74)
    // The September 2026 Sons of Behemat supplement re-published four SoB regiment rows; its
    // rows apply and the July 2026 main-document rows they replace are superseded.
    expect(
      rows
        .filter(record => record.disposition === 'superseded')
        .map(record => record.fact.name)
        .sort()
    ).toEqual(['Big Drogg Fort-kicker', 'Bundo Whalebiter', 'Odo Godswallow', 'One-eyed Grunnock'])
    // Wahapedia does not yet carry the two new Ogor supplement regiments' rules or the September
    // 2026 Krong the Club regiment (#1999); their rows honestly remain structured references
    // until a rules source is accepted.
    expect(
      rows
        .filter(record => record.disposition === 'structured-reference')
        .map(record => record.fact.name)
        .sort()
    ).toEqual(['Krong the Club', 'Okar’s Torrbad', 'Urrgar’s Maulerguts'])
  })
})
