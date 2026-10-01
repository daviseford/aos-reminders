import type { Ability, ContentEntity, Warscroll, Weapon } from '../../aos4/domain'
import { AOS4_FULL_CATALOG } from '../support/aos4FullCatalog'

/**
 * The September 2026 Rules Updates errata the corpus shipped in an earlier form until
 * `aos4-corpus-2026-10-01` (#2060). Each case pins the exact player-facing value the erratum
 * prints, so a refresh that brings back the old wording fails here. All of them ship through
 * reviewed overrides that cite the Rules Updates page (and, where Games Workshop reprinted the
 * corrected rule, the reprint), so each also cites the September document.
 */

const RULES_UPDATES = '03f602f23a103504ca24b5bf5ac3c4f7fc83be769696d55252928ae5009de315'

const entityById = new Map<string, ContentEntity>(
  AOS4_FULL_CATALOG.entities.map(entity => [entity.id, entity])
)
const ability = (id: string): Ability => {
  const entity = entityById.get(id)
  if (entity?.kind !== 'ability') throw new Error(`No ability ${id}`)
  return entity
}
const citesPage = (entity: ContentEntity, page: number): boolean =>
  entity.sourceRefs.some(
    reference => reference.sourceRecordId === `source-record:games-workshop:${RULES_UPDATES}%3Apage%3A${page}`
  )

describe('Summon Shyish Reaper uses the September 2026 erratum for every army (#2060)', () => {
  const twelveInches =
    'Set up a Shyish Reaper wholly within 12" of and visible to the caster and more than 9" from all enemy units.'
  it.each([
    ['the Nighthaunt battletome lore', 'ability:1764fc3b-08ad-5707-80f0-4f0afb9b6721', 'NIGHTHAUNT WIZARD'],
    [
      'The Clattering Procession',
      'ability:29b435ca-1b95-5dbc-a229-0b426059d82e',
      'CLATTERING PROCESSION WIZARD',
    ],
    ['The Eternal Nightmare', 'ability:60de0166-0d8c-5ffe-9892-144cc2f91093', 'ETERNAL NIGHTMARE WIZARD'],
  ])('%s sets the Shyish Reaper up within 12"', (_, id, caster) => {
    const summon = ability(id)
    expect(summon.name).toBe('SUMMON SHYISH REAPER')
    expect(summon.text.effect).toBe(twelveInches)
    expect(summon.text.effect).not.toMatch(/within 9" of the caster/)
    expect(summon.text.declare).toContain(caster)
    expect(summon.cost).toEqual({ kind: 'spell', value: 6 })
  })

  it('cites page 58 on both Army of Renown copies', () => {
    expect(citesPage(ability('ability:29b435ca-1b95-5dbc-a229-0b426059d82e'), 58)).toBe(true)
    expect(citesPage(ability('ability:60de0166-0d8c-5ffe-9892-144cc2f91093'), 58)).toBe(true)
  })
})

describe('Summon Unholy Reliquary uses the September 2026 erratum for every army (#2060)', () => {
  // Rules Updates page 70 names the Manifestations of the Grave lore; the owner ruled on 2026-10-01
  // that it applies to every copy, as with Summon Shyish Reaper.
  const erratum =
    'Set up an Unholy Reliquary wholly within 18" of the caster, visible to them and more than 3" from all enemy units.'
  it.each([
    [
      'the Soulblight Gravelords battletome lore',
      'ability:6126d130-c65a-5050-a31f-17db042e1a95',
      'SOULBLIGHT GRAVELORDS WIZARD',
    ],
    ['Knights of the Crimson Keep', 'ability:e57cb4e8-1fe1-56ff-b093-9a76c568517e', 'CRIMSON KEEP WIZARD'],
  ])('%s sets the Unholy Reliquary up visible and more than 3" from enemies', (_, id, caster) => {
    const summon = ability(id)
    expect(summon.name).toBe('SUMMON UNHOLY RELIQUARY')
    expect(summon.text.effect).toBe(erratum)
    expect(summon.text.declare).toContain(caster)
    expect(summon.cost).toEqual({ kind: 'spell', value: 6 })
  })

  it('cites page 70 on the Knights of the Crimson Keep copy', () => {
    expect(citesPage(ability('ability:e57cb4e8-1fe1-56ff-b093-9a76c568517e'), 70)).toBe(true)
  })
})

describe('owner-directed corrections from current official reprints (#2060)', () => {
  const SERAPHON_FACTION_PACK = '9341256d83906a6e4c044fd8145109706dea06c4dba10b7ec5e5fc664749ce18'

  it('restores where Lord Kroak’s Arcane Vassal measures from, citing Faction Pack: Seraphon page 7', () => {
    const vassal = ability('ability:7f5b2e38-5dc9-567e-8e0d-09c171dae6a1')
    expect(vassal.text.effect).toBe(
      'Measure the range and visibility of the next SPELL ability used by this unit this phase from the target instead of from this unit.\nThe target is treated as the caster for the purpose of other abilities or spell effects, such as ‘Unbind’ or ‘The Earth Trembles’.'
    )
    expect(citesPage(vassal, 27)).toBe(true)
    expect(vassal.sourceRefs.map(reference => String(reference.sourceRecordId))).toContain(
      `source-record:games-workshop:${SERAPHON_FACTION_PACK}%3Apage%3A7`
    )
    // The Slann Starmaster copy already printed the clause; both now agree.
    expect(ability('ability:bde61192-9e81-572e-8765-b41b07745a7f').text.effect).toBe(vassal.text.effect)
  })

  it('keeps Dirty Tricks on its shipped text: no accessible official reprint settles the erratum', () => {
    // Page 61 removes "the first sentence" of Dirty Tricks, but the shipped first sentence is the
    // one the mechanic needs and no accepted official document reprints the battle trait. It stays
    // a documented blocker on #2060 until a citeable official text exists.
    const dirtyTricks = ability('ability:1345c64a-4638-5ce3-99cb-b9b41cddd692')
    expect(dirtyTricks.text.effect).toMatch(
      /^The effect of a DIRTY TRICK ability is only applied if you make a successful dirty trick roll\./
    )
    expect(citesPage(dirtyTricks, 61)).toBe(false)
  })
})

describe('September 2026 Rules Updates ability text (#2060)', () => {
  // [label, ability id, field, exact erratum value, old wording that must be gone, Rules Updates page]
  const cases: Array<[string, string, keyof Ability['text'], string, string | RegExp, number]> = [
    [
      'Lightning Master drops the 2+ roll',
      'ability:475c9bd8-e54e-5466-8d39-4db37bda29ab',
      'effect',
      'Set the Attacks characteristic of the target’s Warpvolt Scourgers to 10 for the rest of the turn.',
      /On a 2\+/,
      65,
    ],
    [
      'Abyssal Dweller loses its Move penalty',
      'ability:52df4c79-548b-52b8-b3f9-66bcbf3da517',
      'effect',
      'For the rest of the battle, while enemy units are contesting the target objective, those units cannot use RUN, RETREAT or CHARGE abilities.',
      /battle round number/,
      33,
    ],
    [
      'Rolling Ash-clouds covers terrain features',
      'ability:b7dd89c9-5f3f-5358-b0ec-dc922bd0963f',
      'effect',
      'While the ash-clouds are low-lying:\nUnits, terrain features and MANIFESTATIONS cannot be set up in neutral territory.\nUnits, terrain features and MANIFESTATIONS cannot end a move within neutral territory unless they started that move wholly within neutral territory.\nModels, terrain features and MANIFESTATIONS are not visible to other models more than 3" away unless a straight line can be drawn between any points on their bases that does not cross neutral territory.',
      /(?:Units|Models) and MANIFESTATIONS/,
      25,
    ],
    [
      'Lingering Burns works from reserve',
      'ability:64e4d2a6-d00c-5060-a657-15aa9a9b3715',
      'declare',
      'This unit can use this ability even if it has been destroyed or is in reserve. Pick any number of BURNING enemy units to be the targets.',
      /destroyed\. Pick/,
      41,
    ],
    [
      'Spectral Alchemy is rewritten',
      'ability:7b2718a8-31b4-5026-8373-51db06934a53',
      'effect',
      'If this unit’s shooting attacks inflicted damage on the target this turn, apply 1 of the following effects. Otherwise, roll a dice. On a 3+, apply 1 of the following effects:\nPhantasmal Solvent: If the target has a Move characteristic of ‘-’, inflict 6 mortal damage on the target.\nAcidic Fug: Inflict D3 mortal damage on the target.\nCorrosive Mist: Inflict 1 mortal damage on each enemy unit within the target’s combat range.\nChoking Vapours: If the target is a WIZARD, subtract 1 from its power level until the start of your next turn.\nFear-laced Hallucinogen: If the target is a PRIEST, remove D3 ritual points from it.\nUnholy Prescription: Ward rolls cannot be made for the target for the rest of the turn.',
      /Fling Concoctions|roll two dice/,
      58,
    ],
    [
      'Song of the Lost heals any target',
      'ability:780842c8-041f-566d-98fd-b139ba1982ad',
      'effect',
      'Until the start of your next turn, subtract 1 from wound rolls for attacks that target that friendly unit. In addition, if the chanting roll was 8+, pick 1 of the following effects:\nYou can Heal (3) the target.\nIf the target is not a MONSTER, ignore modifiers to save rolls for the target (positive and negative) until the start of your next turn.',
      /If the target is a MONSTER, Heal/,
      73,
    ],
    [
      'Essence of the Gnaw targets a friendly unit',
      'ability:92596ad2-35c8-5a1d-b1a9-221200bd4ab2',
      'declare',
      'Pick another visible friendly SKAVEN unit wholly within 13" of this unit and in combat to be the target.',
      /visible SKAVEN/,
      32,
    ],
    [
      'Stalk the Prey needs the quarry on the battlefield',
      'ability:61b3acc9-1656-5712-a681-dc3fc2d968a8',
      'declare',
      'If this unit’s quarry is on the battlefield, pick this unit and up to 1 friendly Flesh Hounds unit to be the targets.',
      /^Pick this unit/,
      35,
    ],
    [
      'In the Shadow of the Ethersea replaces both Deploy abilities',
      'ability:d97e6e6b-6cbb-5b10-8eac-e39fd01157c3',
      'declare',
      'This ability must be used to deploy this Regiment of Renown instead of the ‘Deploy Unit’ ability or the ‘Deploy Regiment’ ability.',
      /Renown\.$/,
      51,
    ],
    [
      'Shifting Manifestations removes the old manifestation from play (Oracles of Fate)',
      'ability:f98edbfa-ecea-5edc-a1f2-02f8f1ddba81',
      'effect',
      'If there is already a friendly MANIFESTATION from the list above on the battlefield, it is immediately banished and removed from play. Then, set up the MANIFESTATION you picked within 1" of the caster and visible to them.',
      /banished\. Then/,
      41,
    ],
    [
      'For the Kingdom! names the Flesh-eater Courts keyword',
      'ability:6d9c880c-e53f-5c74-a0a6-db702b1cbc2a',
      'effect',
      'While you believe this DELUSION, add 1 to charge rolls for friendly KNIGHTS units and friendly FLESH-EATER COURTS MONSTERS while they are wholly within 12" of any friendly FLESH-EATER COURTS HEROES.\nAdd 2 to charge rolls for friendly KNIGHTS units and friendly FLESH-EATER COURTS MONSTERS instead while they are wholly within 12" of any friendly Abhorrant Ghoul Kings on Royal Zombie Dragons.',
      /FLEASH/,
      43,
    ],
    [
      'Scything Blade rolls a D6 for each target',
      'ability:be5095cc-512f-5735-9806-721bf4c20973',
      'effect',
      'This MANIFESTATION can move a distance up to its Move characteristic in one direction (see ‘The Pendulum Swings’). It can pass through models during that move and can end that move in combat. Then, pick up to 3 enemy units that this MANIFESTATION passed across during that move or that are within 1⁄2" of it to be the targets. Roll a D6 for each target. On a 2+, inflict an amount of mortal damage on the target equal to the roll.',
      /for each targets/,
      20,
    ],
    [
      'Shining Company (Spearhead) subtracts from hit rolls for attacks',
      'ability:9a0b84e4-0d25-5556-bf96-4f974240d6c9',
      'effect',
      'Subtract 1 from hit rolls for attacks that target friendly units.',
      /hit rolls that target/,
      15,
    ],
    [
      'Bestigors Despoilers (Legends) scores critical hits on 5+',
      'ability:1d26773e-0240-5095-a1e5-a9e7908ab869',
      'effect',
      'This unit’s attacks score critical hits on unmodified hit rolls of 5+ for the rest of the turn.',
      /Despoiler Axes/,
      29,
    ],
  ]

  it.each(cases)('%s', (_, id, field, expected, old, page) => {
    const entity = ability(id)
    expect(entity.text[field]).toBe(expected)
    expect(entity.text[field]).not.toMatch(old)
    expect(citesPage(entity, page)).toBe(true)
  })

  it('repairs the secondary letter-pair losses inside erratum wording', () => {
    const texts = [
      'ability:61b3acc9-1656-5712-a681-dc3fc2d968a8',
      'ability:ff8569fc-42ad-584b-96cc-070c0d2f9680',
      'ability:d31e0921-85d5-54ef-ae5f-bd191a2cb5ac',
      'ability:9abc8566-0530-555d-aed0-d1701fdf5bc4',
      'ability:bac38434-3159-50f3-83cc-a6cb9b817136',
      'ability:9283931d-a53c-56b6-92f1-fe7e9502213d',
      'ability:54b546ef-1caf-57c0-8a4a-a79ade800b5b',
      'ability:074be6cf-f9f2-5962-8301-e2fba1a0c045',
      'ability:544084d6-caec-5fe0-9d14-56c495a1ba4e',
      'ability:5bfa9f25-fcde-59d2-b204-105200da053f',
    ].map(id => Object.values(ability(id).text).join('\n'))
    texts.forEach(text =>
      expect(text).not.toMatch(
        /battleeld|\bInict|inicted|\beect\b|afected|\befects\b|AAdd|modiers|D6"\. at move|those unit have/
      )
    )
    expect(ability('ability:ff8569fc-42ad-584b-96cc-070c0d2f9680').text.effect).toContain(
      'In such cases, the effect of that Delusion applies as if the unit had not been destroyed.'
    )
    expect(ability('ability:bac38434-3159-50f3-83cc-a6cb9b817136').text.effect).toBe(
      'The target can move up to D6". That move cannot pass through or end within the combat range of an enemy unit.'
    )
    expect(ability('ability:3eb1bfda-47a5-526f-9218-29a25bc4bbdd').text.effect).toBe(
      'The target’s melee weapons have Crit (2 Hits) until the start of your next turn.'
    )
  })

  it('names the Slaughter Queen and Hag Queen in The Croneseer’s Pariahs', () => {
    const cauldron = 'SLAUGHTER QUEEN ON CAULDRON OF BLOOD or HAG QUEEN ON CAULDRON OF BLOOD'
    expect(ability('ability:222921d1-0c22-5453-a2fd-f1095ac3f83f').text).toEqual({
      declare: `Pick a friendly empty ${cauldron}.`,
      effect: `If any enemy models were slain this turn by that ${cauldron}’s combat attacks, it becomes full.`,
    })
    ;[
      'ability:e0a7a9b2-36d6-587b-b649-e7ffbe1288c2',
      'ability:222921d1-0c22-5453-a2fd-f1095ac3f83f',
      'ability:e7301c62-ac23-53a9-be76-53ba5c5afa6c',
    ].forEach(id => {
      const text = Object.values(ability(id).text).join('\n')
      expect(text.replaceAll(cauldron, '')).not.toMatch(/CAULDRON OF BLOOD/)
      expect(citesPage(ability(id), 32)).toBe(true)
    })
  })
})

describe('September 2026 Rules Updates timings (#2060)', () => {
  it.each([
    [
      'Rune of Farsight',
      'ability:4e1c578e-e377-538b-9559-c3b8df6db6be',
      'Once Per Battle (Army), Any Shooting Phase',
      'any',
      'shooting',
    ],
    [
      'Ruin-blessed Conqueror',
      'ability:0a49487d-96f2-55de-aca0-dd6e9f8c6d95',
      'Once Per Turn (Army), Any Hero Phase',
      'any',
      'hero',
    ],
    [
      'Ironjawz Waaagh!',
      'ability:cf68081b-99f1-5835-8257-f1fdf1c87e60',
      'Once Per Turn (Army), Your Charge Phase',
      'your',
      'charge',
    ],
    [
      'The Hand of Gork (Spearhead)',
      'ability:5405555a-c922-534f-96e3-f6978817f51e',
      'Once Per Battle (Army), Your Movement Phase',
      'your',
      'movement',
    ],
  ])('%s uses the erratum timing', (_, id, raw, perspective, phase) => {
    const entity = ability(id)
    expect(entity.abilityKind).toBe('active')
    expect(entity.timings).toHaveLength(1)
    expect(entity.timings[0]).toMatchObject({ raw, perspective, window: { kind: 'turn-phase', phase } })
  })

  it('makes Babbling Wand a Passive ability with no reaction trigger', () => {
    const wand = ability('ability:e851eee5-bc1a-522b-9958-3584898c65b1')
    expect(wand.abilityKind).toBe('passive')
    expect(wand.timings).toEqual([
      { kind: 'passive', perspective: 'neutral', raw: 'Passive', window: { kind: 'always' } },
    ])
    expect(wand.text).toEqual({
      effect:
        'Each time a friendly MOONCLAN unit wholly within 12" of this unit uses the ‘Redeploy’ command, no command points are spent.',
    })
  })

  it('makes Unerring Hunters (Legends) an active once-per-turn combat ability', () => {
    const hunters = ability('ability:da9c77f6-ae1b-538d-89d2-a9c96814cfc4')
    expect(hunters.abilityKind).toBe('active')
    expect(hunters.timings).toEqual([
      {
        kind: 'active',
        perspective: 'any',
        raw: 'Once Per Turn (Army), Any Combat Phase',
        usage: { limit: 1, period: 'turn', scope: 'army' },
        window: { kind: 'turn-phase', phase: 'combat' },
      },
    ])
    expect(hunters.text.reactionTrigger).toBeUndefined()
  })

  it('repairs the Ruination Chamber reaction wording', () => {
    const chamber = ability('ability:9a733296-2aa8-5423-a578-952bb31ceeba')
    expect(chamber.text.reactionTrigger).toBe('This unit was picked as the target of a non-CORE ability')
    expect(chamber.timings[0].raw).toBe(
      'Once Per Turn (Army), Reaction: This unit was picked as the target of a non-CORE ability'
    )
  })
})

describe('September 2026 Rules Updates names, costs, keywords, and weapons (#2060)', () => {
  it('renames Feral Ruin to YOU WILL SERVE! without changing its identity', () => {
    const serve = ability('ability:95cc601e-abff-5b54-8ea1-7145d4d2763a')
    expect(serve.name).toBe('YOU WILL SERVE!')
    expect(
      AOS4_FULL_CATALOG.entities.some(entity => entity.kind === 'ability' && entity.name === 'FERAL RUIN')
    ).toBe(false)
  })

  it('removes the command point cost from A Reputation for Cunning', () => {
    const cunning = ability('ability:20b05375-e140-55b1-b219-e7143f62b165')
    expect(cunning.name).toBe('A REPUTATION FOR CUNNING')
    expect(cunning.cost).toBeUndefined()
  })

  it('gives the historical General’s Handbook 2025-26 Sacred Rites a chanting value of 2', () => {
    expect(ability('ability:64833c8e-0e45-570b-a0fb-14dd24df37b2').cost).toEqual({ kind: 'prayer', value: 2 })
  })

  it('shows that chanting value to players who pick the 2025-26 past season (#2042)', () => {
    const pastSeason = AOS4_FULL_CATALOG.rulesContexts.find(context => context.status === 'past-season')!
    const sacredRites = ability('ability:64833c8e-0e45-570b-a0fb-14dd24df37b2')
    expect(sacredRites.rulesContextIds).toContain(pastSeason.id)
    expect(sacredRites.cost).toEqual({ kind: 'prayer', value: 2 })
  })

  it('sets the Legends Hunter’s Glaive to Rend 1', () => {
    const glaive = entityById.get('weapon:616cdd30-476b-5ce6-8b8d-3a9c1d30d7b2') as Weapon
    expect(glaive.name).toBe('Hunter’s Glaive')
    expect(glaive.profile.rend).toBe('1')
  })

  it('removes ORRUK from Hedkrakka’s Madmob and adds REINFORCEMENTS to the Rotmire Creed', () => {
    const madmob = entityById.get('warscroll:761c72e5-66f9-513f-bab4-c3a9bae6bee6') as Warscroll
    expect(madmob.keywords).not.toContain('ORRUK')
    expect(madmob.keywords).toContain('BONESPLITTERZ')
    const creed = entityById.get('warscroll:85afd15d-6f6f-52bb-88ee-8810455613e6') as Warscroll
    expect(creed.keywords).toEqual(['INFANTRY', 'REINFORCEMENTS', 'WARD (6+)'])
  })
})
