import type { Ability, BattleProfile, ContentGroup, Faction, Warscroll } from '../../aos4/domain'
import { AOS4_FULL_CATALOG } from '../support/aos4FullCatalog'
import { projectReminders } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'

/**
 * The September 2026 Battletome: Sons of Behemat cycle accepted the faction's battle-profile
 * supplement as corpus 2026-09-10 (see `sonsOfBehematSeptember2026.test.ts`). As of corpus
 * 2026-09-22 (issue #1999) the four brand-new units, six coherent legacy rewrites, the current
 * faction package (battle formations, heroic traits, artefacts of power, and Prayers of the World
 * Titan), and the regular faction's own army-wide battle traits ship provisionally from the pinned
 * BSData `gargants` branch, commit `2b7df92f`, because Wahapedia has not republished the battletome
 * pages (unchanged since 2026-08-25).
 *
 * Deferred this revision, each for a distinct reason:
 * - Lore of Behemat: no Wahapedia Spell Lore type record for Sons of Behemat exists to attach to.
 * - Realm-shaking Rampage: no Wahapedia faction anywhere has ever published a Realm-shaking
 *   Rampage(s) ability-type section, so there is no canonical type record for the new adapter
 *   support (added this revision) to attach the six official roster-option facts to.
 * - King Brodd's Stomp's own battle traits: they decode as a subtype of the Army of Renown root
 *   (its `typeId` resolves to the root itself), never as a standalone faction-page ability-type
 *   record, and the community-option merge only attaches to the latter.
 * - The Stone Lobbas Spearhead: still blocked (no secondary carries its rules text at all).
 *
 * Krong the Club was deferred too, for lack of a BSData Regiment-of-Renown intake path (BSData
 * always carried its rules text). As of corpus 2026-09-24 it ships from the pinned BSData
 * `Regiments of Renown.cat`, with its inclusion factions, member, and points from the official
 * row; `regimentsOfRenown.test.ts` covers it in detail.
 */

const standard = AOS4_FULL_CATALOG.rulesContexts.find(
  context => context.mode === 'standard' && context.status === 'current'
)!

const artifactById = new Map(AOS4_FULL_CATALOG.sourceArtifacts.map(artifact => [artifact.id, artifact]))
const recordById = new Map(AOS4_FULL_CATALOG.sourceRecords.map(record => [record.id, record]))

const sob = AOS4_FULL_CATALOG.entities.find(
  (entity): entity is Faction => entity.kind === 'faction' && entity.name === 'Sons of Behemat'
)!

const warscrollFor = (name: string): Warscroll | undefined =>
  AOS4_FULL_CATALOG.entities.find(
    (entity): entity is Warscroll =>
      entity.kind === 'warscroll' && entity.name === name && entity.factionIds.includes(sob.id)
  )

const profileFor = (warscroll: Warscroll): BattleProfile | undefined =>
  AOS4_FULL_CATALOG.entities.find(
    (entity): entity is BattleProfile =>
      entity.kind === 'battle-profile' && entity.warscrollId === warscroll.id
  )

const offeredGroups = (groupType: string): ContentGroup[] => {
  const offered = new Set(
    AOS4_FULL_CATALOG.relationships
      .filter(relationship => relationship.kind === 'offers' && relationship.from === sob.id)
      .map(relationship => relationship.to)
  )
  return AOS4_FULL_CATALOG.entities.filter(
    (entity): entity is ContentGroup =>
      entity.kind === 'content-group' && entity.groupType === groupType && offered.has(entity.id)
  )
}

const membersOf = (group: ContentGroup): Ability[] => {
  const included = new Set(
    AOS4_FULL_CATALOG.relationships
      .filter(relationship => relationship.kind === 'includes' && relationship.from === group.id)
      .map(relationship => relationship.to)
  )
  return AOS4_FULL_CATALOG.entities.filter(
    (entity): entity is Ability => entity.kind === 'ability' && included.has(entity.id)
  )
}

const hasProvisionalCommunityAttribution = (entity: ContentGroup | Ability | Warscroll): boolean =>
  entity.sourceRefs.some(reference => {
    const record = recordById.get(reference.sourceRecordId)
    const artifact = record && artifactById.get(record.artifactId)
    return (
      artifact?.authority.kind === 'community' &&
      artifact.publisher === 'other' &&
      /provisional/i.test(artifact.title)
    )
  })

describe('Sons of Behemat battletome intake from the pinned BSData catalogue (issue #1999)', () => {
  it('ships the four brand-new units with official points, sizes, and keywords', () => {
    const units: Array<{ name: string; points: number; unitSize: number; keywords: string[] }> = [
      {
        name: 'Ma Maegran, Chooser of the Mighty',
        points: 370,
        unitSize: 1,
        keywords: ['HERO', 'UNIQUE', 'MONSTER', 'WIZARD (1)', 'DESTRUCTION', 'SONS OF BEHEMAT', 'LITTLE'],
      },
      {
        name: 'Ancient Ghyrochs',
        points: 0,
        unitSize: 2,
        keywords: ['BEAST', 'UNIQUE', 'DESTRUCTION', 'SONS OF BEHEMAT'],
      },
      {
        name: 'Boss-stompers',
        points: 370,
        unitSize: 3,
        keywords: ['MONSTER', 'CHAMPION', 'DESTRUCTION', 'SONS OF BEHEMAT', 'LITTLE'],
      },
      {
        name: 'Rock-hurlers',
        points: 380,
        unitSize: 3,
        keywords: ['MONSTER', 'CHAMPION', 'DESTRUCTION', 'SONS OF BEHEMAT', 'LITTLE'],
      },
    ]
    units.forEach(({ name, points, unitSize, keywords }) => {
      const warscroll = warscrollFor(name)
      expect(warscroll).toBeDefined()
      expect(warscroll!.keywords.sort()).toEqual([...keywords].sort())
      expect(hasProvisionalCommunityAttribution(warscroll!)).toBe(true)
      const profile = profileFor(warscroll!)
      expect(profile).toBeDefined()
      expect(profile).toMatchObject({ points, unitSize })

      const selection = resolveSelection(AOS4_FULL_CATALOG, {
        explicitIds: [sob.id, warscroll!.id],
        rulesContextId: standard.id,
      })
      expect(selection.diagnostics).toEqual([])
    })
  })

  it('rewrites six legacy datasheets while keeping their canonical identity', () => {
    const rewrites = [
      'King Brodd',
      'Beast-smasher Mega-Gargant',
      'Gatebreaker Mega-Gargant',
      'Kraken-eater Mega-Gargant',
      'Warstomper Mega-Gargant',
      'Mancrusher Gargant',
    ]
    rewrites.forEach(name => {
      const warscroll = warscrollFor(name)
      expect(warscroll).toBeDefined()
      expect(warscroll!.keywords).toEqual(expect.arrayContaining([expect.stringMatching(/^(BIG|LITTLE)$/)]))
      // BIG/LITTLE replaces the index-era MEGA-GARGANT/GARGANT keywords wholesale.
      expect(warscroll!.keywords).not.toContain('MEGA-GARGANT')
      expect(warscroll!.keywords).not.toContain('GARGANT')
      expect(hasProvisionalCommunityAttribution(warscroll!)).toBe(true)
    })
    // Mancrusher Mob is absent from the September 2026 supplement and from BSData; it stays in
    // its current applicable state pending explicit official retirement evidence.
    expect(warscrollFor('Mancrusher Mob')).toBeDefined()
    // Kragnos is content-identical on the pinned branch; the accepted Wahapedia sheet is untouched.
    expect(hasProvisionalCommunityAttribution(warscrollFor('Kragnos, the End of Empires')!)).toBe(false)
  })

  it('offers the four battletome battle formations under their official names', () => {
    const formations = [
      { name: 'Conquering Stomp', ability: "Arrogant Big 'Uns" },
      { name: 'Eager Louts', ability: 'Ten-League Strides' },
      { name: 'Heirs of the Old Ways', ability: 'Brute Spirituality' },
      { name: 'Looting Leviathans', ability: 'Get to the Goods' },
    ]
    formations.forEach(({ name, ability }) => {
      const formation = offeredGroups('battle-formation').find(
        group => group.name === name && group.rulesContextIds.includes(standard.id)
      )
      expect(formation).toBeDefined()
      expect(hasProvisionalCommunityAttribution(formation!)).toBe(true)
      expect(membersOf(formation!).map(member => member.name)).toEqual([ability])

      const selection = resolveSelection(AOS4_FULL_CATALOG, {
        explicitIds: [sob.id, formation!.id],
        rulesContextId: standard.id,
      })
      expect(selection.diagnostics).toEqual([])
      const reminders = projectReminders(AOS4_FULL_CATALOG, selection).filter(reminder =>
        reminder.contributingEntityIds.includes(formation!.id)
      )
      expect(reminders.length).toBeGreaterThan(0)
    })
  })

  it('offers the six battletome heroic traits and six artefacts of power under a shared subtype', () => {
    const traits = offeredGroups('heroic-trait').find(
      group => group.name === 'Big Personalities' && group.rulesContextIds.includes(standard.id)
    )
    expect(traits).toBeDefined()
    expect(hasProvisionalCommunityAttribution(traits!)).toBe(true)
    expect(
      membersOf(traits!)
        .map(member => member.name)
        .sort()
    ).toEqual(
      [
        'Always First In',
        'Brute of Brutes',
        'One-hit Wonder',
        'Spell-chomper',
        'Thundering Titan',
        'Unreasonable Tyrant',
      ].sort()
    )

    const artefacts = offeredGroups('artefact-of-power').find(
      group => group.name === 'Titanic Trophies' && group.rulesContextIds.includes(standard.id)
    )
    expect(artefacts).toBeDefined()
    expect(hasProvisionalCommunityAttribution(artefacts!)).toBe(true)
    expect(
      membersOf(artefacts!)
        .map(member => member.name)
        .sort()
    ).toEqual(
      [
        'Enchanted Portcullis',
        'Glowy Lantern',
        'Krakenskin Sandals',
        'Mantle of the Wood-Kings',
        'Massive Stuffin’ Sack',
        'Protecty Bits',
      ].sort()
    )
  })

  it('offers Prayers of the World Titan and does not offer Lore of Behemat', () => {
    const prayerLore = offeredGroups('prayer-lore').find(
      group => group.name === 'Prayers of the World Titan' && group.rulesContextIds.includes(standard.id)
    )
    expect(prayerLore).toBeDefined()
    expect(hasProvisionalCommunityAttribution(prayerLore!)).toBe(true)
    expect(
      membersOf(prayerLore!)
        .map(member => member.name)
        .sort()
    ).toEqual(["Behemat's Vengeance", 'Might of the Earth', "World Titan's Stride"])

    // Deferred: no Wahapedia Spell Lore type record exists for Sons of Behemat to attach to.
    expect(offeredGroups('spell-lore').find(group => group.name === 'Lore of Behemat')).toBeUndefined()
    // Deferred: no Wahapedia faction has ever published a Realm-shaking Rampage(s) type record.
    expect(AOS4_FULL_CATALOG.entities.some(entity => entity.name === 'Battered Shrimp')).toBe(false)
  })

  it('ships the regular Sons of Behemat battle traits automatically, retiring the index-era set', () => {
    const selection = resolveSelection(AOS4_FULL_CATALOG, {
      explicitIds: [sob.id],
      rulesContextId: standard.id,
    })
    expect(selection.diagnostics).toEqual([])
    const reminderNames = projectReminders(AOS4_FULL_CATALOG, selection).map(reminder => reminder.name)
    ;['Take a Run at It', 'Argy Bargy', 'Wrathful Rampaging', 'Haring Back', 'The Big One'].forEach(name =>
      expect(reminderNames).toContain(name)
    )
    const battleTraits = AOS4_FULL_CATALOG.entities.filter(
      (entity): entity is Ability =>
        entity.kind === 'ability' &&
        ['Take a Run at It', 'Argy Bargy', 'Wrathful Rampaging', 'Haring Back', 'The Big One'].includes(
          entity.name
        )
    )
    expect(battleTraits).toHaveLength(5)
    battleTraits.forEach(ability => expect(hasProvisionalCommunityAttribution(ability)).toBe(true))
  })

  it("leaves King Brodd's Stomp Army of Renown on the July 2026 wording (adapter gap, not yet supported)", () => {
    const kbs = AOS4_FULL_CATALOG.entities.find(
      (entity): entity is ContentGroup =>
        entity.kind === 'content-group' &&
        entity.groupType === 'army-of-renown' &&
        entity.name === 'King Brodd’s Stomp'
    )
    expect(kbs).toBeDefined()
    const includedGroups = AOS4_FULL_CATALOG.relationships
      .filter(relationship => relationship.kind === 'includes' && relationship.from === kbs!.id)
      .map(relationship => relationship.to)
      .map(id => AOS4_FULL_CATALOG.entities.find(entity => entity.id === id))
      .filter((entity): entity is ContentGroup => entity?.kind === 'content-group')
    const battleTraits = includedGroups.find(group => group.groupType === 'battle-trait')
    expect(battleTraits).toBeDefined()
    // None of the September 2026 rewrite's trait names are present: the July wording ships as-is.
    const rewriteNames = [
      'Smash It All to Bits',
      "The World Titan's Prophet",
      'Timberrrrr!',
      'Double Stomp',
      'Wrath of Brodd',
      'Watch This!',
      'Crafty Creepers',
    ]
    const currentNames = membersOf(battleTraits!).map(member => member.name)
    rewriteNames.forEach(name => expect(currentNames).not.toContain(name))
    includedGroups.forEach(group => expect(hasProvisionalCommunityAttribution(group)).toBe(false))
  })

  it('ships Krong the Club as one provisional BSData regiment and still gates the Stone Lobbas Spearhead', () => {
    const krong = AOS4_FULL_CATALOG.entities.filter(
      (entity): entity is ContentGroup => entity.kind === 'content-group' && entity.name === 'Krong the Club'
    )
    expect(krong.map(group => group.groupType)).toEqual(['regiment-of-renown'])
    expect(hasProvisionalCommunityAttribution(krong[0])).toBe(true)
    expect(
      AOS4_FULL_CATALOG.entities.some(
        entity => entity.kind === 'content-group' && /Stone Lobbas/i.test(entity.name ?? '')
      )
    ).toBe(false)
  })
})
