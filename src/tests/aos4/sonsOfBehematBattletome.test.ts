import type { Ability, BattleProfile, ContentGroup, Faction, Warscroll } from '../../aos4/domain'
import { AOS4_FULL_CATALOG } from '../support/aos4FullCatalog'
import { projectReminders } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'

/**
 * The September 2026 Battletome: Sons of Behemat cycle accepted the faction's battle-profile
 * supplement as corpus 2026-09-10 (see `sonsOfBehematSeptember2026.test.ts`). From corpus
 * 2026-09-22 to 2026-09-24 (issue #1999) the four brand-new units, six coherent legacy rewrites,
 * the faction package (battle formations, heroic traits, artefacts of power, Prayers of the World
 * Titan), and the regular army-wide battle traits shipped provisionally from the pinned BSData
 * `gargants` branch, commit `2b7df92f`, because Wahapedia had not republished the battletome pages.
 *
 * On 2026-09-25 the provisional watch fired: Wahapedia republished the Sons of Behemat faction
 * and warscroll collection pages with the battletome, and the 2026-09-25 revision re-pinned both
 * and completed the swap (the Ogor 2026-08-28b precedent). The pages now supply everything as
 * ordinary secondary facts (in the page's uppercase ability style), the three BSData catalogues,
 * their community source entries, and the contextOverrides that retired the index-era set are
 * gone, and the content the BSData cycle had to defer ships from the page: Lore of Behemat, the
 * six Realm-shaking Rampages, the King Brodd's Stomp September rewrite, the Stone Lobbas
 * Spearhead, and the two battletome Armies of Renown (Matriarch's Mob, Stomper Tribe).
 *
 * Krong the Club still ships from the pinned BSData `Regiments of Renown.cat`
 * (`regimentsOfRenown.test.ts` covers it): no re-pinned page carries it.
 */

const standard = AOS4_FULL_CATALOG.rulesContexts.find(
  context => context.mode === 'standard' && context.status === 'current'
)!
const spearhead = AOS4_FULL_CATALOG.rulesContexts.find(context => context.mode === 'spearhead')!

const artifactById = new Map(AOS4_FULL_CATALOG.sourceArtifacts.map(artifact => [artifact.id, artifact]))
const recordById = new Map(AOS4_FULL_CATALOG.sourceRecords.map(record => [record.id, record]))
const entityById = new Map(AOS4_FULL_CATALOG.entities.map(entity => [entity.id, entity]))

const sob = AOS4_FULL_CATALOG.entities.find(
  (entity): entity is Faction => entity.kind === 'faction' && entity.name === 'Sons of Behemat'
)!

const warscrollFor = (name: string, contextId = standard.id): Warscroll | undefined =>
  AOS4_FULL_CATALOG.entities.find(
    (entity): entity is Warscroll =>
      entity.kind === 'warscroll' &&
      entity.name === name &&
      entity.factionIds.includes(sob.id) &&
      entity.rulesContextIds.includes(contextId)
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

const includedBy = (group: ContentGroup) =>
  AOS4_FULL_CATALOG.relationships
    .filter(relationship => relationship.kind === 'includes' && relationship.from === group.id)
    .map(relationship => entityById.get(relationship.to)!)

const memberNames = (group: ContentGroup): string[] =>
  includedBy(group)
    .filter((entity): entity is Ability => entity.kind === 'ability')
    .map(member => member.name)
    .sort()

const hasCommunityAttribution = (entity: ContentGroup | Ability | Warscroll): boolean =>
  entity.sourceRefs.some(reference => {
    const record = recordById.get(reference.sourceRecordId)
    return record ? artifactById.get(record.artifactId)?.authority.kind === 'community' : false
  })

const armyOfRenown = (name: string): ContentGroup | undefined =>
  offeredGroups('army-of-renown').find(group => group.name === name)

describe('Sons of Behemat battletome on the re-pinned Wahapedia pages (issue #1999)', () => {
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
      expect([...warscroll!.keywords].sort()).toEqual([...keywords].sort())
      expect(hasCommunityAttribution(warscroll!)).toBe(false)
      expect(profileFor(warscroll!)).toMatchObject({ points, unitSize })

      const selection = resolveSelection(AOS4_FULL_CATALOG, {
        explicitIds: [sob.id, warscroll!.id],
        rulesContextId: standard.id,
      })
      expect(selection.diagnostics).toEqual([])
    })
  })

  it('ships the six legacy rewrites from the page and retires Mancrusher Mob with it', () => {
    ;[
      'King Brodd',
      'Beast-smasher Mega-Gargant',
      'Gatebreaker Mega-Gargant',
      'Kraken-eater Mega-Gargant',
      'Warstomper Mega-Gargant',
      'Mancrusher Gargant',
    ].forEach(name => {
      const warscroll = warscrollFor(name)
      expect(warscroll).toBeDefined()
      expect(warscroll!.keywords).toEqual(expect.arrayContaining([expect.stringMatching(/^(BIG|LITTLE)$/)]))
      expect(warscroll!.keywords).not.toContain('MEGA-GARGANT')
      expect(warscroll!.keywords).not.toContain('GARGANT')
      expect(hasCommunityAttribution(warscroll!)).toBe(false)
    })
    // The re-pinned collection page no longer publishes Mancrusher Mob, and no official
    // September 2026 document lists it, so it left the corpus with the page that carried it.
    expect(AOS4_FULL_CATALOG.entities.some(entity => entity.name === 'Mancrusher Mob')).toBe(false)
  })

  it('carries the September 2026 Scourge of Aqshy BIG/LITTLE rewrite natively', () => {
    const season = AOS4_FULL_CATALOG.rulesContexts.find(context => context.status === 'seasonal')!
    const gatebreaker = warscrollFor('Scourge of Aqshy Gatebreaker Mega-Gargant', season.id)!
    expect(gatebreaker.keywords).toContain('BIG')
    expect(gatebreaker.keywords).not.toContain('MEGA-GARGANT')
    expect(gatebreaker.characteristics).toMatchObject({ health: '25', control: '10' })
    const mancrusher = warscrollFor('Scourge of Aqshy Mancrusher Gargant', season.id)!
    expect(mancrusher.keywords).toContain('LITTLE')
    expect(mancrusher.keywords).not.toContain('GARGANT')
  })

  it('offers the battletome package under the page names, with no community attribution', () => {
    const formations = offeredGroups('battle-formation').filter(group =>
      group.rulesContextIds.includes(standard.id)
    )
    expect(formations.map(group => [group.name, memberNames(group)]).sort()).toEqual(
      [
        ['Conquering Stomp', ['ARROGANT BIG ’UNS']],
        ['Eager Louts', ['TEN-LEAGUE STRIDES']],
        ['Heirs of the Old Ways', ['BRUTE SPIRITUALITY']],
        ['Looting Leviathans', ['GET TO THE GOODS']],
      ].sort()
    )
    const traits = offeredGroups('heroic-trait').find(
      group => group.name === 'Big Personalities' && group.rulesContextIds.includes(standard.id)
    )!
    expect(memberNames(traits)).toEqual(
      [
        'ALWAYS FIRST IN',
        'BRUTE OF BRUTES',
        'ONE-HIT WONDER',
        'SPELL-CHOMPER',
        'THUNDERING TITAN',
        'UNREASONABLE TYRANT',
      ].sort()
    )
    const artefacts = offeredGroups('artefact-of-power').find(
      group => group.name === 'Titanic Trophies' && group.rulesContextIds.includes(standard.id)
    )!
    expect(memberNames(artefacts)).toEqual(
      [
        'ENCHANTED PORTCULLIS',
        'GLOWY LANTERN',
        'KRAKENSKIN SANDALS',
        'MANTLE OF THE WOOD-KINGS',
        'MASSIVE STUFFIN’ SACK',
        'PROTECTY BITS',
      ].sort()
    )
    const prayers = offeredGroups('prayer-lore').find(group => group.name === 'Prayers of the World Titan')!
    expect(memberNames(prayers)).toEqual([
      'BEHEMAT’S VENGEANCE',
      'MIGHT OF THE EARTH',
      'WORLD TITAN’S STRIDE',
    ])
    ;[...formations, traits, artefacts, prayers].forEach(group =>
      expect(hasCommunityAttribution(group)).toBe(false)
    )
    // The index-era formations are no longer published anywhere, so they left the corpus.
    ;['Taker Tribe', 'Breaker Tribe', 'Boss Tribe'].forEach(name =>
      expect(AOS4_FULL_CATALOG.entities.some(entity => entity.name === name)).toBe(false)
    )
  })

  it('offers the previously deferred Lore of Behemat and the six Realm-shaking Rampages', () => {
    const lore = offeredGroups('spell-lore').find(group => group.name === 'Lore of Behemat')!
    expect(lore.rulesContextIds).toContain(standard.id)
    expect(memberNames(lore)).toEqual(['ENERGY SURGE', 'PIPSQUEAK CURSE', 'THORNFANG’S WRATH'])

    const rampages = offeredGroups('realm-shaking-rampage')
    expect(rampages.map(group => group.name).sort()).toEqual(
      [
        'BATTERED SHRIMP',
        'COLOSSAL SLAM',
        'EARTHSHAKING ROAR',
        'HAMMER THROW',
        'RANCID FLATULENCE',
        'WINDMILL WALLOPING',
      ].sort()
    )
    rampages.forEach(group => expect(memberNames(group)).toEqual([group.name]))

    const selection = resolveSelection(AOS4_FULL_CATALOG, {
      explicitIds: [sob.id, lore.id, rampages[0].id],
      rulesContextId: standard.id,
    })
    expect(selection.diagnostics).toEqual([])
  })

  it('ships the regular army-wide battle traits automatically, retiring the index-era set', () => {
    const selection = resolveSelection(AOS4_FULL_CATALOG, {
      explicitIds: [sob.id],
      rulesContextId: standard.id,
    })
    expect(selection.diagnostics).toEqual([])
    const reminderNames = projectReminders(AOS4_FULL_CATALOG, selection).map(reminder => reminder.name)
    ;['TAKE A RUN AT IT', 'ARGY BARGY', 'WRATHFUL RAMPAGE', 'HARING BACK', 'THE BIG ONE'].forEach(name =>
      expect(reminderNames).toContain(name)
    )
    ;['GARGANT CHARGE', 'JUMP UP AND DOWN'].forEach(name => expect(reminderNames).not.toContain(name))
  })

  it("ships King Brodd's Stomp's September 2026 rewrite (Big/Little, Destructive Impulse)", () => {
    const kbs = armyOfRenown('King Brodd’s Stomp')!
    const battleTraits = includedBy(kbs).find(
      (entity): entity is ContentGroup =>
        entity.kind === 'content-group' && entity.groupType === 'battle-trait'
    )!
    const traits = includedBy(battleTraits).filter((entity): entity is Ability => entity.kind === 'ability')
    expect(traits.map(trait => trait.name).sort()).toEqual(
      [
        'CRAFTY CREEPERS',
        'DOUBLE STOMP',
        'SMASH IT ALL TO BITS',
        'THE WORLD TITAN’S PROPHET',
        'TIMBERRRRR!',
        'WATCH THIS!',
        'WRATH OF BRODD',
      ].sort()
    )
    const wrath = traits.find(trait => trait.name === 'WRATH OF BRODD')!
    expect(wrath.keywords).toEqual(['DESTRUCTIVE IMPULSE'])
    expect(JSON.stringify(traits.map(trait => trait.text))).not.toMatch(/MEGA-GARGANT|RAMPAGE ability/)
  })

  it('classifies the two battletome Armies of Renown with replace semantics', () => {
    ;['Matriarch’s Mob', 'Stomper Tribe'].forEach(name => {
      const root = armyOfRenown(name)!
      expect(root.rulesContextIds).toContain(standard.id)
      const excluded = new Set(
        AOS4_FULL_CATALOG.relationships
          .filter(relationship => relationship.kind === 'excludes' && relationship.from === root.id)
          .map(relationship => relationship.to)
      )
      offeredGroups('battle-formation')
        .filter(group => group.rulesContextIds.includes(standard.id))
        .forEach(group => expect(excluded.has(group.id)).toBe(true))
      const lore = offeredGroups('spell-lore').find(group => group.name === 'Lore of Behemat')!
      expect(excluded.has(lore.id)).toBe(true)
    })
    // The index-era Stomper Tribe battle formation shares the name but is a different entity; it
    // is no longer published, so only the Army of Renown remains.
    expect(
      AOS4_FULL_CATALOG.entities.filter(
        entity => entity.kind === 'content-group' && entity.name === 'Stomper Tribe'
      )
    ).toHaveLength(1)
  })

  it('ships the Stone Lobbas Spearhead with its Rock-hurlers warscroll', () => {
    const regiment = offeredGroups('supplemental-content').find(group => group.name === 'Stone Lobbas')!
    expect(regiment.rulesContextIds).toEqual([spearhead.id])
    const members = includedBy(regiment).map(entity => `${entity.kind}:${entity.name}`)
    expect(members).toEqual(['warscroll:Rock-hurlers'])
    const rules = AOS4_FULL_CATALOG.entities.filter(
      (entity): entity is ContentGroup =>
        entity.kind === 'content-group' &&
        entity.groupType === 'stone-lobbas' &&
        entity.name !== 'Stone Lobbas'
    )
    expect(rules.map(group => [group.name, memberNames(group)]).sort()).toEqual(
      [
        ['Battle Traits', ['BOWLED OVER', 'CLOSE ONE EYE']],
        ['Enhancements', ['HUMONGOUS STRIDES', 'HUNGRY GOBBLER', 'LUCKY ROCK', '’ARD ’EAD']],
        ['Regiment Abilities', ['GREEDY AND GRABBY', 'SURLY SORTS']],
      ].sort()
    )
  })

  it('keeps no BSData Sons of Behemat catalogue in the corpus apart from Krong the Club', () => {
    const community = AOS4_FULL_CATALOG.sourceArtifacts.filter(
      artifact => artifact.authority.kind === 'community'
    )
    expect(community.map(artifact => artifact.title)).toEqual([
      expect.stringMatching(/Regiments of Renown catalogue — Krong the Club/),
    ])
  })
})
