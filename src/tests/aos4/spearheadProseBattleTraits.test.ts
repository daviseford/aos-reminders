import { describe, expect, it } from 'vitest'
import { AOS4_CATALOG } from '../../aos4/generated'
import { projectReminders } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'
import { createAos4ArmyDocument } from '../../aos4/state'
import { createAos4ReminderViewModel } from '../../aos4/view'

/**
 * Spearhead battle traits Wahapedia prints as prose rather than as ability cards (#2095): whole traits,
 * the standalone rules beside a section's cards, and the reserve conditions in front of arrival cards.
 * Text and timing come from reviewed overrides citing the official Spearhead packs.
 */
const SPEARHEAD = 'rules-context:90000000-0000-4000-8000-000000000002'
const STANDARD = 'rules-context:90000000-0000-4000-8000-000000000006'

const factionId = (name: string) => {
  const faction = AOS4_CATALOG.entities.find(entity => entity.kind === 'faction' && entity.name === name)
  if (!faction) throw new Error(`No faction ${name}`)
  return faction.id
}
const ability = (id: string) => {
  const entity = AOS4_CATALOG.entities.find(candidate => candidate.id === id)
  if (entity?.kind !== 'ability') throw new Error(`No ability ${id}`)
  return entity
}
const reminders = (faction: string, army: string, rulesContextId = SPEARHEAD) =>
  projectReminders(
    AOS4_CATALOG,
    resolveSelection(AOS4_CATALOG, {
      explicitIds: [factionId(faction), army] as never,
      rulesContextId: rulesContextId as never,
    })
  )
const projected = (faction: string, army: string, abilityId: string, rulesContextId = SPEARHEAD) =>
  reminders(faction, army, rulesContextId).filter(reminder =>
    reminder.abilityIds.includes(abilityId as never)
  )

const PROSE_RULES = [
  {
    name: 'TEMPTATIONS OF SLAANESH',
    id: 'ability:003e56ae-e995-5185-a780-8c8e4a9d79e0',
    faction: 'Hedonites of Slaanesh',
    army: 'content-group:a1e5610e-5237-5a19-9c5c-6a9c95b480cc', // Blades of the Lurid Dream
    window: 'always',
    // September 2026 Rules Updates page 15 thresholds, which the official card also prints.
    text: ['18+ – SADISTIC SPITE', '24+ – OBLIVIOUS INDULGENCE', '12+ – TANTALISING TORMENT'],
  },
  {
    name: 'BLOOD RITES',
    id: 'ability:2806b8c3-22c0-5a64-9aa4-82812993abe1',
    faction: 'Daughters of Khaine',
    army: 'content-group:5126a322-8d10-5561-9fec-fbf7536fca4a', // Heartflayer Troupe
    window: 'always',
    text: ['1 – QUICKENING BLOODLUST', '4 – SLAUGHTERER’S STRENGTH'],
  },
  {
    name: 'TIDES OF DEATH',
    id: 'ability:a2df15b8-e094-5d74-852a-8f1cb73e1bcc',
    faction: 'Idoneth Deepkin',
    army: 'content-group:6dd9a5fa-ec56-58c2-9d57-58dc976708e7', // Soulraid Hunt
    window: 'always',
    text: ['1 – LOW TIDE', '3 – HIGH TIDE: This unit has STRIKE-FIRST.'],
  },
  {
    name: 'CYCLE OF CORRUPTION',
    id: 'ability:d86869bc-6d63-5a0a-b6af-d6cf20338067',
    faction: 'Maggotkin of Nurgle',
    army: 'content-group:2d596e16-cc2a-5d83-8dfd-b879e0f90d08', // Bubonic Cell
    window: 'always',
    text: ['next CYCLE ability in the sequence', '1 – NUMBERLESS PESTS', '2 – PLAGUE OF MISERY'],
  },
  {
    name: 'OSSIARCH COMMANDS',
    id: 'ability:666df0a3-abef-5ba9-a83c-755753598505',
    faction: 'Ossiarch Bonereapers',
    army: 'content-group:951edd9a-ae64-578a-b260-779dc2143a1c', // Tithe-reaper Echelon
    window: 'battle-round-start',
    text: ['you receive 2 Ossiarch command points', 'all remaining Ossiarch command points are lost'],
  },
  // These two set only the general's keywords and print no timing: an untimed army rule, never an
  // invented Passive timing or a keyword change to every copy of the warscroll.
  {
    name: 'BULLSTOMPER',
    id: 'ability:a555f5b6-bb19-5a1d-b6d6-77f406685a2d',
    faction: 'Sons of Behemat',
    army: 'content-group:8a3f926b-ee56-5ee0-9ffa-c341728bd15d', // Wallsmasher Stomp
    window: 'army-rule',
    text: ['Your general has the HERO keyword (in addition to the MONSTER keyword)'],
  },
  {
    name: 'Boulder Basher',
    id: 'ability:406ff0f2-d627-57cf-9791-3984cacde196',
    faction: 'Sons of Behemat',
    army: 'content-group:d5201880-8180-54eb-9fdb-ccbb0ed9c522', // Stone Lobbas
    window: 'army-rule',
    text: ['Add the HERO keyword to your general’s warscroll and remove the REINFORCEMENTS keyword.'],
  },
]
const UNTIMED_RULES = PROSE_RULES.filter(rule => rule.window === 'army-rule')

const ARRIVAL_CARDS = [
  [
    'ability:02faa033-d06',
    'Stormcast Eternals',
    'content-group:d374dcf5-d6bd-512b-a2b6-d04c213ba2d9',
    'third',
  ],
  ['ability:0be0eba7-a58', 'Ogor Mawtribes', 'content-group:44d5d98d-cead-53e0-8ed0-079d1a90748b', 'second'],
  ['ability:0cdccdc4-b6f', 'Seraphon', 'content-group:e460fbb3-38fd-5270-9501-00e944a50769', 'third'],
  [
    'ability:0d003008-fb4',
    'Ossiarch Bonereapers',
    'content-group:951edd9a-ae64-578a-b260-779dc2143a1c',
    'third',
  ],
  ['ability:20d2da4e-668', 'Nighthaunt', 'content-group:d1c3aaa4-c14f-524c-a902-8583384d41ba', 'second'],
  [
    'ability:29a1b466-fac',
    'Maggotkin of Nurgle',
    'content-group:dccf9d0e-b0e4-5725-8bec-9fedad48b1e2',
    'third',
  ],
  [
    'ability:3ff1c6b8-786',
    'Soulblight Gravelords',
    'content-group:7c5f8798-41c8-5c11-960f-5432ceabab0e',
    'third',
  ],
  [
    'ability:9cee35f9-e9f',
    'Soulblight Gravelords',
    'content-group:12e9ce6f-de79-578b-9dd9-211b0a24d0d4',
    'third',
  ],
  ['ability:ac3f5edd-265', 'Ogor Mawtribes', 'content-group:9566705b-388a-5cc6-b800-71189eaf000f', 'third'],
  [
    'ability:b95c9a52-ca9',
    'Ossiarch Bonereapers',
    'content-group:a9bf15e4-2f59-5059-a92c-560b170ce756',
    'second',
  ],
  [
    'ability:fe08039b-ee7',
    'Cities of Sigmar',
    'content-group:ce53ea50-602d-5e89-be13-9bf1e28a2db8',
    'second',
  ],
] as const

describe('Spearhead battle traits printed as prose (#2095)', () => {
  it.each(PROSE_RULES)('reminds a $faction Spearhead army of $name', rule => {
    const entity = ability(rule.id)
    expect(entity.name).toBe(rule.name)
    expect(entity.rulesContextIds).toEqual([SPEARHEAD])
    expect(entity.timings.map(timing => timing.window.kind)).toEqual([rule.window])
    rule.text.forEach(fragment => expect(entity.text.effect).toContain(fragment))

    expect(projected(rule.faction, rule.army, rule.id)).toHaveLength(1)
    // Only its own army carries it: the faction alone, or the faction outside Spearhead, does not.
    const factionOnly = projectReminders(
      AOS4_CATALOG,
      resolveSelection(AOS4_CATALOG, {
        explicitIds: [factionId(rule.faction)] as never,
        rulesContextId: SPEARHEAD as never,
      })
    )
    expect(factionOnly.filter(reminder => reminder.abilityIds.includes(rule.id as never))).toHaveLength(0)
    expect(projected(rule.faction, rule.army, rule.id, STANDARD)).toHaveLength(0)
  })

  it.each(UNTIMED_RULES)('shows $name as an untimed army rule, not a passive ability', rule => {
    const entity = ability(rule.id)
    expect(entity.abilityKind).toBe('rule')
    expect(entity.timings).toEqual([
      { kind: 'rule', window: { kind: 'army-rule' }, perspective: 'neutral', raw: '' },
    ])
    const views = createAos4ReminderViewModel(
      AOS4_CATALOG,
      createAos4ArmyDocument({
        id: 'army:untimed-rule',
        name: 'Untimed rule',
        rulesContextId: SPEARHEAD as never,
        explicitSelectionIds: [factionId(rule.faction), rule.army] as never,
      })
    )
    const view = views.filter(reminder => reminder.projected.abilityIds.includes(rule.id as never))
    expect(view.map(reminder => [reminder.windowKey, reminder.windowLabel, reminder.typeLabel])).toEqual([
      ['army-rule', 'Army Rules', 'Rule · Neutral turn'],
    ])
    // Army rules come before anything timed.
    expect(views[0].windowKey).toBe('army-rule')
  })

  it('changes no warscroll keywords for a rule that applies to the general only', () => {
    // Wallsmasher Stomp's three Mancrusher Gargants share this warscroll; only the general becomes a HERO.
    const mancrusher = AOS4_CATALOG.entities.find(entity => entity.id.startsWith('warscroll:b5b33938')) as
      { name: string; keywords: unknown[] } | undefined
    expect(mancrusher?.name).toBe('Mancrusher Gargant')
    expect(JSON.stringify(mancrusher?.keywords)).toContain('REINFORCEMENTS')
    expect(JSON.stringify(mancrusher?.keywords)).not.toContain('HERO')
  })

  it('keeps the Soulraid Hunt trait apart from the Tides of Death manifestation spell', () => {
    // The trait cites Spearhead: Idoneth Deepkin - Soulraid Hunt page 2 (review input); the same-named
    // Universal Manifestations rule is Lauchon the Soulseeker's ability.
    const trait = ability('ability:a2df15b8-e094-5d74-852a-8f1cb73e1bcc')
    const manifestation = AOS4_CATALOG.entities.find(
      entity => entity.kind === 'ability' && entity.name === 'TRAVERSE THE TIDES OF DEATH'
    )
    expect(manifestation?.id).not.toBe(trait.id)
    expect(
      projected('Idoneth Deepkin', 'content-group:6dd9a5fa-ec56-58c2-9d57-58dc976708e7', manifestation!.id)
    ).toHaveLength(0)
  })

  it.each(ARRIVAL_CARDS)(
    'gives arrival card %s the reserve condition its official card prints',
    (prefix, faction, army, round) => {
      const entity = AOS4_CATALOG.entities.find(candidate => candidate.id.startsWith(prefix))
      if (entity?.kind !== 'ability') throw new Error(`No ability ${prefix}`)
      const opening = entity.text.declare ?? entity.text.effect
      expect(opening).toMatch(
        new RegExp(
          `from the ${round} battle round onwards, (?:it|they|you) can use the following ability:\\n`,
          'i'
        )
      )
      expect(opening).toMatch(/not set up during the deployment phase|start the battle in reserve/)
      expect(projected(faction, army, entity.id)).toHaveLength(1)
    }
  )
})
