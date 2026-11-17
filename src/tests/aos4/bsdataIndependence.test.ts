import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { ACCEPTED_MANIFEST_PATH, ACCEPTED_REVIEW_PATH } from '../../aos4/data/acceptedRevision'
import { extractBsDataWarscrolls } from '../../aos4/data/bsdata'
import type { CanonicalId, ContentGroup, Faction, Warscroll } from '../../aos4/domain'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { resolveParsedRoster } from '../../aos4/import'
import { projectReminders } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'
import { decodeAos4TextRoster } from '../../importers'

/**
 * Corpus 2026-11-17 (#1757): BSData/age-of-sigmar-4th was taken down (Games Workshop DMCA notice,
 * 2026-11-12). The owner approved shipping the affected units profile-only with their canonical
 * ids, retiring the BSData-only rules, and sourcing what official packs print from those packs.
 */
const read = (relative: string) => JSON.parse(readFileSync(path.join(process.cwd(), relative), 'utf8'))
const manifest = read(ACCEPTED_MANIFEST_PATH) as { artifacts: Array<{ adapterVersion: string }> }
const review = read(ACCEPTED_REVIEW_PATH) as Record<string, unknown>
const radar = read('data/aos4/radar/config.json') as { bsData: { status: string } }

const standard = AOS4_CATALOG.rulesContexts.find(
  context => context.mode === 'standard' && context.status === 'current'
)!
const legends = AOS4_CATALOG.rulesContexts.find(context => context.status === 'legends')!
const entityById = new Map(AOS4_CATALOG.entities.map(entity => [entity.id, entity]))
const faction = (name: string) =>
  AOS4_CATALOG.entities.find(
    (entity): entity is Faction => entity.kind === 'faction' && entity.name === name
  )!
const warscroll = (id: string) => entityById.get(id as CanonicalId) as Warscroll
const includes = (from: string) =>
  AOS4_CATALOG.relationships
    .filter(relationship => relationship.kind === 'includes' && relationship.from === from)
    .map(relationship => entityById.get(relationship.to)!)

const CLANSHIELDS = 'warscroll:48b84fae-a54b-59cb-9f93-826ba6055c2a'
const GREYCAP_FUSILIERS = 'warscroll:fb78e7a3-b445-5e07-a428-234297003622'
const RAVEN_PRIEST = 'warscroll:c733f40b-77b8-5e0e-a7db-4e43771d16d2'

describe('BSData independence (corpus 2026-11-17, #1757)', () => {
  it('pins no BSData input and keeps the radar lane disabled', () => {
    expect(manifest.artifacts.filter(artifact => artifact.adapterVersion.startsWith('bsdata'))).toEqual([])
    expect(review.communityWarscrollSources).toBeUndefined()
    expect(JSON.stringify(review)).not.toMatch(/"sourceRecordId":"source-record:bsdata:/)
    expect(radar.bsData.status).toBe('disabled')
  })

  it('keeps the affected units selectable with their canonical ids and official points, without rules', () => {
    const profileOnly = AOS4_CATALOG.entities.filter(
      (entity): entity is Warscroll =>
        entity.kind === 'warscroll' && entity.rulesAvailability === 'profile-only'
    )
    expect(profileOnly).toHaveLength(38)
    profileOnly.forEach(unit => {
      expect(includes(unit.id).filter(entity => entity.kind !== 'battle-profile')).toEqual([])
      const profiles = includes(unit.id).filter(entity => entity.kind === 'battle-profile')
      expect(profiles).toHaveLength(1)
    })
    const clanshields = warscroll(CLANSHIELDS)
    expect(clanshields).toMatchObject({ name: 'Clanshields', rulesAvailability: 'profile-only' })
    expect(includes(CLANSHIELDS)).toEqual([expect.objectContaining({ kind: 'battle-profile', points: 110 })])

    const khazalite = faction('Khazalite Holds')
    const selection = resolveSelection(AOS4_CATALOG, {
      explicitIds: [khazalite.id, CLANSHIELDS as CanonicalId],
      rulesContextId: standard.id,
    })
    expect(selection.diagnostics).toEqual([])
    expect(selection.selectedIds).toContain(CLANSHIELDS)
    // No reminder is attributed to a unit whose rules are unavailable.
    expect(
      projectReminders(AOS4_CATALOG, selection).filter(reminder =>
        reminder.contributingEntityIds.includes(CLANSHIELDS as CanonicalId)
      )
    ).toEqual([])
    expect(khazalite.unavailableRules).toEqual(expect.arrayContaining(['Battle traits', 'Battle formations']))
  })

  it('offers the four Legends units profile-only in the Legends context only', () => {
    const cities = faction('Cities of Sigmar')
    ;[GREYCAP_FUSILIERS, RAVEN_PRIEST].forEach(id => {
      const unit = warscroll(id)
      expect(unit).toMatchObject({ rulesAvailability: 'profile-only' })
      expect(unit.rulesContextIds).toEqual([legends.id])
      const selection = resolveSelection(AOS4_CATALOG, {
        explicitIds: [cities.id, id as CanonicalId],
        rulesContextId: standard.id,
        allowsLegends: true,
      })
      expect(selection.diagnostics).toEqual([])
      expect(selection.selectedIds).toContain(id)
    })
  })

  it('imports a Khazalite Holds list by name onto the same canonical ids', () => {
    // Wayfarer Nomads is a retired battletome formation: the importer reports it instead of guessing.
    const { parsedRoster } = decodeAos4TextRoster(
      [
        'Khazalite Holds',
        'Wayfarer Nomads',
        '',
        '- 1 x Clanshields (110)',
        '',
        '110/2000pts',
        '',
        'Generated by Listbot 4.0',
        '',
      ].join('\n')
    )
    const preview = resolveParsedRoster(AOS4_CATALOG, parsedRoster!, {
      defaultRulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
      createDocumentId: () => 'army:bsdata-independence',
    })
    expect(preview.matches.find(match => match.label === 'Clanshields')?.canonicalId).toBe(CLANSHIELDS)
    expect(preview.diagnostics).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'unknown-selection', line: 2 })])
    )
    expect(preview.diagnostics).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'unknown-selection' })])
    )
  })

  it('ships both Khazalite Holds regiments from the official Rules of Renown pack', () => {
    const cities = faction('Cities of Sigmar')
    const regiment = (name: string) =>
      AOS4_CATALOG.entities.find(
        (entity): entity is ContentGroup =>
          entity.kind === 'content-group' && entity.groupType === 'regiment-of-renown' && entity.name === name
      )!
    const fjori = regiment('Fjori’s Vengeance')
    expect(fjori.id).toBe('content-group:e0e14bc4-715c-5636-83f1-ecd03e2ba164')
    expect(
      includes(fjori.id)
        .filter(entity => entity.kind === 'warscroll')
        .map(entity => entity.name)
        .sort()
    ).toEqual(['Auric Flamekeeper', 'Grimhold Exile', 'Hearthguard Berzerkers'])
    const selection = resolveSelection(AOS4_CATALOG, {
      explicitIds: [cities.id, fjori.id],
      rulesContextId: standard.id,
    })
    expect(selection.diagnostics).toEqual([])
    expect(projectReminders(AOS4_CATALOG, selection).map(reminder => reminder.name)).toContain(
      'ITINERANT GRIMMDRON'
    )
    const thengin = regiment('Thengin’s Grudgesettlers')
    expect(
      includes(thengin.id)
        .filter(entity => entity.kind === 'ability')
        .map(entity => entity.name)
        .sort()
    ).toEqual(['GRUDGESETTLERS', 'RUNE OF STOICISM'])
  })

  it('leaves the Fyreslayers rules untouched as a control', () => {
    const fyreslayers = faction('Fyreslayers')
    const runefather = AOS4_CATALOG.entities.find(
      (entity): entity is Warscroll =>
        entity.kind === 'warscroll' &&
        entity.name === 'Auric Runefather' &&
        entity.factionIds.includes(fyreslayers.id) &&
        entity.rulesContextIds.includes(standard.id)
    )!
    expect(runefather.rulesAvailability).toBeUndefined()
    expect(runefather.characteristics.move).not.toBe('')
    expect(includes(runefather.id).some(entity => entity.kind === 'ability')).toBe(true)
    expect(fyreslayers.unavailableRules).toBeUndefined()
  })

  it('keeps the historical BSData provenance and the dormant adapter readable', () => {
    const previous = read('data/aos4/manifests/accepted-2026-11-10.json') as typeof manifest
    expect(previous.artifacts.filter(artifact => artifact.adapterVersion === 'bsdata-cat/1')).toHaveLength(8)
    expect(
      existsSync(path.join(process.cwd(), 'data/aos4/certifications/aos4-corpus-2026-11-10-machine-r1'))
    ).toBe(true)
    expect(typeof extractBsDataWarscrolls).toBe('function')
  })
})

describe('official Scourge of Aqshy - Khazalite Holds warscrolls (#1757)', () => {
  it('ships both seasonal warscrolls from the official pack with their canonical ids', () => {
    const runeson = warscroll('warscroll:5aebcca6-f377-522a-bd8a-9565f914a5aa')
    expect(runeson).toMatchObject({
      name: 'Scourge of Aqshy Auric Runeson on Magmadroth',
      characteristics: { move: '10"', save: '4+', control: '5', health: '14', ward: '6+' },
    })
    expect(runeson.rulesAvailability).toBeUndefined()
    const contents = includes(runeson.id)
    expect(
      contents
        .filter(entity => entity.kind === 'weapon')
        .map(entity => entity.id)
        .sort()
    ).toEqual([
      'weapon:60b36e24-4d5c-5b8c-af5d-9a49e180ff0a',
      'weapon:906a070f-fed4-5196-9c5b-f86aaa1ef772',
      'weapon:9d071f48-2414-57fe-a4f0-1fdd13b51f59',
      'weapon:f4627921-183a-570c-9f6d-cda91a44a0b7',
    ])
    const seeingRed = contents.find(entity => entity.id === 'ability:72904354-57c8-580e-98ef-f2833e385fec')
    expect(seeingRed).toMatchObject({ name: 'SEEING RED', keywords: ['RAMPAGE'] })
    const flameseekers = warscroll('warscroll:03b032cd-69f8-59ff-9c87-7f40bb5b5d32')
    expect(flameseekers.rulesAvailability).toBeUndefined()
    expect(includes(flameseekers.id).map(entity => entity.name)).toEqual(
      expect.arrayContaining(['FIERY DISPOSITION', 'Vulkyn Weapons', 'Emberteeth'])
    )
  })
})
