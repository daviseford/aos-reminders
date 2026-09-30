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
