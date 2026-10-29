import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { AOS4_CATALOG } from '../../aos4/generated'
import { projectReminders } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'
import { deserializeAos4ArmyDocument, serializeAos4ArmyDocument } from '../../aos4/state'

/**
 * Khazalite Holds is added alongside Fyreslayers, never in its place (#2087). A Fyreslayers army
 * saved before the intake — locally, in the cloud, or behind a share link, all of which store this
 * document — must open unchanged. The ids and the digests below were captured from the corpus
 * 2026-10-20 runtime, before any Khazalite Holds matched-play content existed.
 */
const STANDARD = 'rules-context:90000000-0000-4000-8000-000000000006'
const FYRESLAYERS = 'faction:16248666-7b1f-549c-9d76-14ff340da6b8'
const SAVED_SELECTIONS = [
  FYRESLAYERS,
  'content-group:5fc91c43-8918-5d5a-be1d-9d9df6c186df', // Lords of the Lodge
  'content-group:7f47e497-d300-55e4-849b-9b4030745f5a', // Inheritance of Grimnir
  'content-group:6acdcfc5-888f-5e69-96a5-63ff55d54ba8', // Heirlooms of the Lodge
  'content-group:abc0abc3-f03d-5b57-8197-6035503d4a04', // Zharrgrim Blessings
  'content-group:be33f505-23ec-5ede-92c5-28d4ab6b529a', // Magmic Invocations
  'warscroll:acf5b6b5-5e04-5643-8cb4-8f3c8dcbfe30', // Auric Runefather
  'warscroll:d99d56de-6b51-593e-95cc-1e3b4e790794', // Auric Hearthguard
  'warscroll:0a5acace-eee5-5382-8bdd-67cb3a13b1e6', // Hearthguard Berzerkers with Flamestrike Poleaxes
  'warscroll:7735cdd9-a891-510e-986d-0da216b1019c', // Vulkite Berzerkers with Fyresteel Weapons
]
const SAVED_DOCUMENT = JSON.stringify({
  schemaVersion: 1,
  id: 'army:fyreslayers-before-khazalite',
  name: 'Lodge',
  rulesContextId: STANDARD,
  explicitSelectionIds: [...SAVED_SELECTIONS].sort(),
  reminderPreferences: {},
})

const digest = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex')

describe('Fyreslayers armies saved before the Khazalite Holds intake (#2087)', () => {
  it('open with every saved id intact and no diagnostics', () => {
    const result = deserializeAos4ArmyDocument(SAVED_DOCUMENT, AOS4_CATALOG)
    expect(result.diagnostics).toEqual([])
    expect(result.document?.explicitSelectionIds).toEqual([...SAVED_SELECTIONS].sort())
    // The stored bytes round-trip unchanged.
    expect(JSON.parse(serializeAos4ArmyDocument(result.document!))).toEqual(JSON.parse(SAVED_DOCUMENT))
  })

  it('resolve to exactly the selection, availability and reminders they had before', () => {
    const selection = resolveSelection(AOS4_CATALOG, {
      explicitIds: SAVED_SELECTIONS as never,
      rulesContextId: STANDARD as never,
    })
    expect(selection.diagnostics).toEqual([])
    expect(selection.selectedIds).toHaveLength(108)
    expect(digest([...selection.selectedIds].sort())).toBe(
      '7d40d2a3f47bcd70ffa96efebb4c91eff1830918d35ccbdd8fed38876db94503'
    )
    expect(selection.availableIds).toHaveLength(98)
    expect(digest([...selection.availableIds].sort())).toBe(
      '8ff4a369c27680ee10cac7fccb27560ee839ce2b204a1258990989c3f4cf4ee9'
    )
    const reminders = projectReminders(AOS4_CATALOG, selection)
    expect(reminders).toHaveLength(57)
    expect(digest(reminders.map(reminder => [reminder.id, reminder.name, reminder.timing]))).toBe(
      'c9b950cd2cd98b915235fc79420c1a3d16d01acedd2a7cb634d191cd8a971d48'
    )
  })

  it('keeps Fyreslayers and Khazalite Holds as separate armies with separate unit ids', () => {
    const factions = AOS4_CATALOG.entities.filter(entity => entity.kind === 'faction')
    const fyreslayers = factions.find(entity => entity.name === 'Fyreslayers')!
    const khazalite = factions.find(entity => entity.name === 'Khazalite Holds')!
    expect(fyreslayers.id).toBe(FYRESLAYERS)
    expect(khazalite.id).not.toBe(FYRESLAYERS)
    const offered = (factionId: string) =>
      new Set(
        AOS4_CATALOG.relationships
          .filter(relationship => relationship.kind === 'offers' && relationship.from === factionId)
          .map(relationship => relationship.to)
      )
    // Universal content (manifestation lores every army may take) is offered to every army alike.
    const everyArmy = offered(factions.find(entity => entity.name === 'Stormcast Eternals')!.id)
    const shared = Array.from(offered(fyreslayers.id)).filter(
      id => offered(khazalite.id).has(id) && !everyArmy.has(id)
    )
    // The Magmic Invocations lore and its three manifestations are offered to both, and since corpus
    // 2026-10-29 (#1757) the Regiments of Renown whose October 2026 inclusion lists name Khazalite
    // Holds (Fyreslayers keeps its offer under the owner's additive decision).
    expect(shared.map(id => AOS4_CATALOG.entities.find(entity => entity.id === id)!.name).sort()).toEqual([
      'Enforcers of the Tithe',
      'Exile Scavengers',
      'Magmic Invocations',
      'Molten Infernoth',
      'Nurgle’s Gift',
      'Runic Fyrewall',
      'The Blacktalons',
      'The Horizon Seekers',
      'Valnir’s Stormwing',
      'Zharrgron Flame-spitter',
    ])
  })
})

describe('Khazalite Holds faction variants beside the Fyreslayers originals (#1757)', () => {
  const offeredGroup = (factionName: string, name: string) => {
    const faction = AOS4_CATALOG.entities.find(
      entity => entity.kind === 'faction' && entity.name === factionName
    )!
    return AOS4_CATALOG.entities.find(
      entity =>
        entity.name === name &&
        AOS4_CATALOG.relationships.some(
          relationship =>
            relationship.kind === 'offers' &&
            relationship.from === faction.id &&
            relationship.to === entity.id
        )
    )!
  }
  const abilitiesUnder = (groupId: string): Array<{ name: string; text: string }> => {
    const children = (id: string): string[] =>
      AOS4_CATALOG.relationships
        .filter(relationship => relationship.kind === 'includes' && relationship.from === id)
        .flatMap(relationship => [relationship.to as string, ...children(relationship.to as string)])
    return children(groupId).flatMap(id => {
      const entity = AOS4_CATALOG.entities.find(candidate => candidate.id === id)
      return entity?.kind === 'ability' ? [{ name: entity.name, text: JSON.stringify(entity.text) }] : []
    })
  }

  it('keeps the Fyreslayers Lofnir Drothkeepers unchanged and gives Khazalite Holds the October rules', () => {
    const fyreslayers = abilitiesUnder(offeredGroup('Fyreslayers', 'Lofnir Drothkeepers').id)
    const khazalite = abilitiesUnder(offeredGroup('Khazalite Holds', 'Lofnir Drothkeepers').id)
    expect(offeredGroup('Fyreslayers', 'Lofnir Drothkeepers').id).toBe(
      'content-group:755f54da-1cf3-5685-b462-b4aed3e7a67b'
    )
    expect(fyreslayers.map(ability => ability.name)).not.toContain('BLAZING VENGEANCE')
    expect(fyreslayers.find(ability => ability.name === 'SKILLED DROTHWRANGLERS')!.text).toMatch(
      /hitched a lift/
    )
    expect(fyreslayers.find(ability => ability.name === 'BREATH OF VULCATRIX')!.text).toMatch(
      /DROTHKEEPERS MAGMADROTH/
    )
    // Armies of Renown (October 2026) pages 3-4.
    expect(khazalite.map(ability => ability.name)).toContain('BLAZING VENGEANCE')
    expect(khazalite.find(ability => ability.name === 'SKILLED DROTHWRANGLERS')!.text).toMatch(/Packdroth/)
    expect(khazalite.find(ability => ability.name === 'BREATH OF VULCATRIX')!.text).toMatch(
      /DROTHKEEPERS MONSTER/
    )
    expect(khazalite).toHaveLength(fyreslayers.length + 1)
  })

  it('words each faction’s The Duardin Ascendant for that faction', () => {
    const duardrazhal = (factionName: string) =>
      abilitiesUnder(offeredGroup(factionName, 'The Duardin Ascendant').id).find(
        ability => ability.name === 'DUARDRAZHAL'
      )!.text
    expect(duardrazhal('Fyreslayers')).toMatch(/at least 1 FYRESLAYERS/)
    // Rules Updates (October 2026) page 33.
    expect(duardrazhal('Khazalite Holds')).toMatch(/at least 1 KHAZALITE HOLDS/)
  })
})
