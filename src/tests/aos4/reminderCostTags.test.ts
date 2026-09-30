import type { ContentGroup, Faction, Warscroll } from '../../aos4/domain'
import {
  AOS4_CATALOG,
  AOS4_DEFAULT_RULES_CONTEXT_ID,
  REPRESENTATIVE_CATALOG,
  REPRESENTATIVE_CONTEXT_ID,
  REPRESENTATIVE_EXPLICIT_SELECTION_IDS,
} from '../../aos4/generated'
import { createAos4PrintDocument } from '../../aos4/print'
import { createAos4ArmyDocument } from '../../aos4/state'
import { createAos4ReminderViewModel, type Aos4ReminderViewModel } from '../../aos4/view'

type PickableKind = 'faction' | 'content-group' | 'warscroll'

const entityByName = (kind: PickableKind, name: string): Faction | ContentGroup | Warscroll => {
  const entity = AOS4_CATALOG.entities.find(candidate => candidate.kind === kind && candidate.name === name)
  if (!entity) throw new Error(`No ${kind} named ${name} in the catalog`)
  return entity as Faction | ContentGroup | Warscroll
}

const remindersFor = (explicitNames: Array<[PickableKind, string]>): Aos4ReminderViewModel[] =>
  createAos4ReminderViewModel(
    AOS4_CATALOG,
    createAos4ArmyDocument({
      id: 'army:test-command-point-tags',
      name: 'Command Point Tag Test',
      rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
      explicitSelectionIds: explicitNames.map(([kind, name]) => entityByName(kind, name).id),
    })
  )

const reminderNamed = (reminders: Aos4ReminderViewModel[], name: string): Aos4ReminderViewModel => {
  const reminder = reminders.find(candidate => candidate.name === name)
  if (!reminder) throw new Error(`No reminder named ${name}`)
  return reminder
}

describe('reminder command-point tags (#1856)', () => {
  it('puts the accepted Sylvaneth 1 CP cost first with a singular explanation', () => {
    const reminder = reminderNamed(
      remindersFor([
        ['faction', 'Sylvaneth'],
        ['content-group', 'Lords of the Clan'],
      ]),
      'ROUSED TO FURY'
    )

    expect(reminder.projected.cost).toEqual({ kind: 'command-points', value: 1 })
    expect(reminder.tags[0]).toEqual({
      label: '1 CP',
      tone: 'cost',
      description: 'Costs 1 command point to use.',
    })
    expect(reminder.accessibleLabel).toContain('Costs 1 command point to use.')
  })

  it('uses the plural explanation for an accepted 2 CP ability', () => {
    const reminder = reminderNamed(
      remindersFor([
        ['faction', 'Sylvaneth'],
        ['warscroll', 'Alarielle the Everqueen'],
      ]),
      'THE GODDESS OF LIFE'
    )

    expect(reminder.tags[0]).toEqual({
      label: '2 CP',
      tone: 'cost',
      description: 'Costs 2 command points to use.',
    })
  })
})

describe('reminder spell and prayer cost tags (#2032)', () => {
  it('renders the casting value of an accepted spell as the first tag', () => {
    const reminder = reminderNamed(
      remindersFor([
        ['faction', 'Kruleboyz'],
        ['content-group', 'Braggit’s Bottle-Snatchaz'],
      ]),
      'SNEAKY DISTRACTION'
    )

    expect(reminder.projected.cost).toEqual({ kind: 'spell', value: 7 })
    expect(reminder.tags[0]).toEqual({
      label: 'CV 7',
      tone: 'cost',
      description:
        'Casting value 7: the caster must roll 7 or higher on the 2D6 casting roll or the spell fails.',
    })
    expect(reminder.accessibleLabel).toContain('Casting value 7')
  })

  it('flows the casting-value tag into the print document', () => {
    const reminder = reminderNamed(
      remindersFor([
        ['faction', 'Kruleboyz'],
        ['content-group', 'Braggit’s Bottle-Snatchaz'],
      ]),
      'SNEAKY DISTRACTION'
    )

    const document = createAos4PrintDocument([reminder], { armyName: 'Army', factionName: 'Faction' })
    expect(document.sections[0].rules[0].tags?.[0]).toMatchObject({ label: 'CV 7', tone: 'cost' })
  })

  it('renders the chanting value of a prayer cost', () => {
    const reminder = reminderNamed(
      createAos4ReminderViewModel(
        REPRESENTATIVE_CATALOG,
        createAos4ArmyDocument({
          id: 'army:test-prayer-cost-tags',
          name: 'Prayer Cost Tag Test',
          rulesContextId: REPRESENTATIVE_CONTEXT_ID,
          explicitSelectionIds: REPRESENTATIVE_EXPLICIT_SELECTION_IDS,
        })
      ),
      'Healing Storm'
    )

    expect(reminder.projected.cost).toEqual({ kind: 'prayer', value: 4 })
    expect(reminder.tags[0]).toEqual({
      label: 'ChV 4',
      tone: 'cost',
      description:
        'Chanting value 4: the chanter must roll 4 or higher on the chanting roll or the prayer is not answered.',
    })
    expect(reminder.accessibleLabel).toContain('Chanting value 4')
  })
})

describe('Krondys print acceptance (#2032)', () => {
  const krondysReminders = () =>
    remindersFor([
      ['faction', 'Stormcast Eternals'],
      ['warscroll', 'Krondys, Son of Dracothion'],
      ['content-group', 'Lore of the Storm'],
    ])

  // Krondys's own spell plus the three Lore of the Storm spells, at their accepted casting values.
  const KRONDYS_SPELLS: Array<[string, number]> = [
    ['ATAVISTIC TEMPEST', 8],
    ['LIGHTNING BLAST', 5],
    ['STARFALL', 7],
    ['THUNDERSHOCK', 6],
  ]

  it.each(KRONDYS_SPELLS)('shows the accepted casting value on %s (CV %i)', (name, value) => {
    const reminder = reminderNamed(krondysReminders(), name)
    expect(reminder.projected.cost).toEqual({ kind: 'spell', value })
    expect(reminder.tags[0]).toMatchObject({ label: `CV ${value}`, tone: 'cost' })
  })

  it('carries every Krondys spell casting value into the print document', () => {
    const document = createAos4PrintDocument(krondysReminders(), {
      armyName: 'Krondys',
      factionName: 'Stormcast Eternals',
    })

    const rules = document.sections.flatMap(section => section.rules)
    const printed = KRONDYS_SPELLS.map(([name]) => [name, rules.find(rule => rule.title === name)?.tags?.[0]])
    expect(printed).toEqual(
      KRONDYS_SPELLS.map(([name, value]) => [
        name,
        expect.objectContaining({ label: `CV ${value}`, tone: 'cost' }),
      ])
    )
  })
})

describe('accepted casting and chanting value coverage (#2032)', () => {
  const abilities = AOS4_CATALOG.entities.filter(entity => entity.kind === 'ability')
  const hasKeyword = (keywords: readonly string[] | undefined, keyword: string) =>
    (keywords ?? []).some(candidate => candidate.toUpperCase() === keyword)

  // Reviewed dispositions for the PRAYER abilities that ship without a chanting value. The three
  // SACRED RITES records are the core chanting rule itself, which Wahapedia prints with no badge
  // (the September 2026 Rules Updates page 22 adds a chanting value of 2 only to the historical
  // General's Handbook 2025-26 copy, and no accepted text source carries it yet). The Cities of
  // Sigmar Runelord's FORGEFIRE carries its value in a spell-class badge on a PRAYER ability, so
  // the adapter fails closed rather than guess which kind of value it is.
  const PRAYERS_WITHOUT_CHANTING_VALUE = new Set([
    'ability:64833c8e-0e45-570b-a0fb-14dd24df37b2',
    'ability:a89234c6-b4b0-5a92-af47-e046f6e57bb8',
    'ability:aa42ff31-bafb-55e6-a80c-279f531558cf',
    'ability:a5e8d40e-9d11-5b10-915e-8eae5b30fc23',
  ])

  it('gives every accepted SPELL ability a casting value', () => {
    const spells = abilities.filter(ability => hasKeyword(ability.keywords, 'SPELL'))
    expect(spells.length).toBeGreaterThan(390)
    expect(spells.filter(spell => spell.cost?.kind !== 'spell').map(spell => spell.name)).toEqual([])
  })

  it('gives every accepted PRAYER ability a chanting value except the reviewed dispositions', () => {
    const prayers = abilities.filter(ability => hasKeyword(ability.keywords, 'PRAYER'))
    expect(prayers.length).toBeGreaterThan(150)
    const unvalued = prayers.filter(prayer => prayer.cost?.kind !== 'prayer').map(prayer => prayer.id)
    expect(new Set(unvalued)).toEqual(PRAYERS_WITHOUT_CHANTING_VALUE)
  })

  it('never classifies a cost against the ability keyword strip', () => {
    const mismatched = abilities.filter(
      ability =>
        (ability.cost?.kind === 'spell' && !hasKeyword(ability.keywords, 'SPELL')) ||
        (ability.cost?.kind === 'prayer' && !hasKeyword(ability.keywords, 'PRAYER'))
    )
    expect(mismatched.map(ability => ability.name)).toEqual([])
  })
})
