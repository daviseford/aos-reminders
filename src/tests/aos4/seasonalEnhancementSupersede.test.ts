import type { Ability, ContentGroup, Faction } from '../../aos4/domain'
import { AOS4_CATALOG } from '../../aos4/generated'

/**
 * The General's Handbook 2026-27 (Scourge of Aqshy) hands each faction a seasonal enhancement
 * table under the battletome table's own name. "Using the Scourge of Aqshy Rules" (eng_30-06)
 * makes the relationship explicit: you pick "from that table instead of other such tables
 * available to your faction, not in addition to" — an exclusivity applied at the pick, while
 * both tables stay legal options in a seasonal army. The 2026-08-16 structural supersede
 * (#1953) instead dropped the battletome table from the seasonal context, which made its
 * enhancements unimportable there (#1979: a GHB 2026-27 Sylvaneth roster lost Seed of Rebirth).
 * Generation now keeps both same-named tables in season; the builder tells them apart by
 * grouping season-exclusive options under the season's own header.
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

const isSeasonExclusive = (group: ContentGroup): boolean =>
  group.rulesContextIds.includes(seasonal.id) && !group.rulesContextIds.includes(standard.id)

describe('seasonal enhancement tables stand beside the same-named battletome tables', () => {
  it('same-named groups in one context always differ on season exclusivity', () => {
    // Two identically named groups in one context are tolerable only when exactly one of them is
    // season-exclusive — that is the dimension the builder's seasonal group header renders, so the
    // player can tell them apart. A same-named pair on the same side of that line is a real
    // duplicate again (the two "Devious Machinations" of beta report 2026-08-16).
    const factions = AOS4_CATALOG.entities.filter((entity): entity is Faction => entity.kind === 'faction')
    const ambiguous: string[] = []
    factions.forEach(faction => {
      const groups = factionOffers(faction)
      AOS4_CATALOG.rulesContexts.forEach(context => {
        const seen = new Map<string, ContentGroup>()
        groups
          .filter(group => group.rulesContextIds.includes(context.id))
          .forEach(group => {
            const key = `${group.groupType}|${label(group.name)}|${isSeasonExclusive(group)}`
            if (seen.has(key)) {
              ambiguous.push(`${faction.name} :: ${context.name} :: ${group.groupType} :: ${group.name}`)
            }
            seen.set(key, group)
          })
      })
    })
    expect(ambiguous).toEqual([])
  })

  it('offers Skaven both Devious Machinations tables in season, distinguished by exclusivity', () => {
    const skaven = AOS4_CATALOG.entities.find(
      (entity): entity is Faction => entity.kind === 'faction' && entity.name === 'Skaven'
    )!
    const tables = factionOffers(skaven).filter(
      group => group.groupType === 'heroic-trait' && group.name === 'Devious Machinations'
    )
    expect(tables).toHaveLength(2)

    const inSeason = tables.filter(group => group.rulesContextIds.includes(seasonal.id))
    expect(inSeason).toHaveLength(2)

    const seasonalTable = tables.find(isSeasonExclusive)!
    expect(seasonalTable).toBeDefined()
    expect(
      membersOf(seasonalTable)
        .map(member => member.name)
        .sort()
    ).toEqual(['ESSENCE OF THE GNAW', 'MASTER OF THE SWARM', 'MASTERCLAN CONNECTIONS'])

    const battletomeTable = tables.find(group => !isSeasonExclusive(group))!
    expect(battletomeTable).toBeDefined()
    expect(battletomeTable.rulesContextIds).toContain(standard.id)
    expect(battletomeTable.rulesContextIds).toContain(seasonal.id)
    expect(
      membersOf(battletomeTable)
        .map(member => member.name)
        .sort()
    ).toEqual(['SCURRY AWAY', 'SHORT-TEMPERED', 'SKILLED MANIPULATOR'])
    membersOf(battletomeTable).forEach(member => expect(member.rulesContextIds).toContain(seasonal.id))
  })

  it('imports a battletome enhancement in a seasonal army (#1979)', () => {
    // Seed of Rebirth is a Sylvaneth battletome artefact; under the replacement model it resolved
    // only in the core context and a GHB 2026-27 roster dropped it with a "switch the rules
    // context" warning. Both tables being offered in season means the ability itself is reachable.
    const seed = AOS4_CATALOG.entities.find(
      (entity): entity is Ability => entity.kind === 'ability' && /seed of rebirth/i.test(entity.name)
    )!
    expect(seed).toBeDefined()
    expect(seed.rulesContextIds).toContain(seasonal.id)
  })
})
