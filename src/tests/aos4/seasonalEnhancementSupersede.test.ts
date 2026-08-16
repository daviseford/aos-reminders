import type { Ability, ContentGroup, Faction } from '../../aos4/domain'
import { AOS4_CATALOG } from '../../aos4/generated'

/**
 * The General's Handbook 2026-27 (Scourge of Aqshy) hands each faction a replacement enhancement
 * table under the battletome table's own name, and Wahapedia keeps both sections on the faction
 * page: the battletome section applies as standard (current + seasonal) while the replacement is
 * marked seasonal. Without structural precedence the seasonal context offered both identically
 * named groups — the builder showed two "Devious Machinations" heroic-trait options for Skaven
 * (beta report 2026-08-16). Generation now drops the seasonal context from a standard subtype
 * (and its abilities) whenever a seasonal subtype shares its faction, parent group, and name.
 */

const seasonal = AOS4_CATALOG.rulesContexts.find(context => context.status === 'seasonal')!
const standard = AOS4_CATALOG.rulesContexts.find(
  context => context.mode === 'standard' && context.status === 'current'
)!

const label = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim()
    .toLowerCase()

const factionOffers = (faction: Faction): ContentGroup[] => {
  const offered = new Set(
    AOS4_CATALOG.relationships
      .filter(relationship => relationship.kind === 'offers' && relationship.from === faction.id)
      .map(relationship => relationship.to)
  )
  return AOS4_CATALOG.entities.filter(
    (entity): entity is ContentGroup => entity.kind === 'content-group' && offered.has(entity.id)
  )
}

const membersOf = (group: ContentGroup): Ability[] => {
  const included = new Set(
    AOS4_CATALOG.relationships
      .filter(relationship => relationship.kind === 'includes' && relationship.from === group.id)
      .map(relationship => relationship.to)
  )
  return AOS4_CATALOG.entities.filter(
    (entity): entity is Ability => entity.kind === 'ability' && included.has(entity.id)
  )
}

describe('seasonal enhancement tables supersede the same-named battletome tables', () => {
  it('never offers a faction two identically named groups of one category in the same context', () => {
    const factions = AOS4_CATALOG.entities.filter((entity): entity is Faction => entity.kind === 'faction')
    const duplicates: string[] = []
    factions.forEach(faction => {
      const groups = factionOffers(faction)
      AOS4_CATALOG.rulesContexts.forEach(context => {
        const seen = new Map<string, ContentGroup>()
        groups
          .filter(group => group.rulesContextIds.includes(context.id))
          .forEach(group => {
            const key = `${group.groupType}|${label(group.name)}`
            if (seen.has(key)) {
              duplicates.push(`${faction.name} :: ${context.name} :: ${group.groupType} :: ${group.name}`)
            }
            seen.set(key, group)
          })
      })
    })
    expect(duplicates).toEqual([])
  })

  it('offers exactly one Devious Machinations table per context, seasonal traits in season', () => {
    const skaven = AOS4_CATALOG.entities.find(
      (entity): entity is Faction => entity.kind === 'faction' && entity.name === 'Skaven'
    )!
    const tables = factionOffers(skaven).filter(
      group => group.groupType === 'heroic-trait' && group.name === 'Devious Machinations'
    )
    expect(tables).toHaveLength(2)

    const inSeason = tables.filter(group => group.rulesContextIds.includes(seasonal.id))
    expect(inSeason).toHaveLength(1)
    expect(
      membersOf(inSeason[0])
        .map(member => member.name)
        .sort()
    ).toEqual(['ESSENCE OF THE GNAW', 'MASTER OF THE SWARM', 'MASTERCLAN CONNECTIONS'])

    const outOfSeason = tables.filter(group => group.rulesContextIds.includes(standard.id))
    expect(outOfSeason).toHaveLength(1)
    expect(outOfSeason[0].rulesContextIds).not.toContain(seasonal.id)
    expect(
      membersOf(outOfSeason[0])
        .map(member => member.name)
        .sort()
    ).toEqual(['SCURRY AWAY', 'SHORT-TEMPERED', 'SKILLED MANIPULATOR'])
    membersOf(outOfSeason[0]).forEach(member => expect(member.rulesContextIds).not.toContain(seasonal.id))
  })
})
