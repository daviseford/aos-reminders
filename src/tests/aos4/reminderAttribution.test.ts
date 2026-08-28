import type { ContentGroup, Faction, Warscroll } from '../../aos4/domain'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { createAos4ArmyDocument } from '../../aos4/state'
import { createAos4ReminderViewModel, type Aos4ReminderViewModel } from '../../aos4/view'

/**
 * Reminders name the selection that granted them (issue #1836). Without attribution, a player who
 * picks Well-Fed Beasts scans the reminders for that name and finds nothing — the granted
 * abilities surface under their own names (HORN TOSS, GRUMPY ALPHA) with no visible tie to the
 * trait. Every player-picked grant carries a `source` tag; faction-automatic content never carries
 * one, so the faction name is not stamped on every core rule. Game-wide content instead carries a
 * quiet `provenance` tag naming its real origin — core rules, the season, or the battletome's
 * battle traits (issue #1857).
 */

type PickableKind = 'faction' | 'warscroll' | 'content-group'

const entityByName = (kind: PickableKind, name: string): Faction | Warscroll | ContentGroup => {
  const entity = AOS4_CATALOG.entities.find(candidate => candidate.kind === kind && candidate.name === name)
  if (!entity) throw new Error(`No ${kind} named ${name} in the catalog`)
  return entity as Faction | Warscroll | ContentGroup
}

const remindersFor = (explicitNames: Array<[PickableKind, string]>): Aos4ReminderViewModel[] =>
  createAos4ReminderViewModel(
    AOS4_CATALOG,
    createAos4ArmyDocument({
      id: 'army:test-attribution',
      name: 'Attribution Test',
      rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
      explicitSelectionIds: explicitNames.map(([kind, name]) => entityByName(kind, name).id),
    })
  )

const sourceLabels = (reminder: Aos4ReminderViewModel): string[] =>
  reminder.tags.filter(tag => tag.tone === 'source').map(tag => tag.label)

const provenanceLabels = (reminder: Aos4ReminderViewModel): string[] =>
  reminder.tags.filter(tag => tag.tone === 'provenance').map(tag => tag.label)

describe('reminder source attribution (#1836)', () => {
  it('tags a monstrous trait pick on each granted ability reminder', () => {
    const wellFed = entityByName('content-group', 'Well-Fed Beasts')
    expect(wellFed).toBeDefined()
    const reminders = remindersFor([
      ['faction', 'Ogor Mawtribes'],
      ['content-group', 'Well-Fed Beasts'],
    ])
    const granted = ['HORN TOSS', 'GRUMPY ALPHA', 'EXTREMELY OBSTINATE']
    granted.forEach(name => {
      const reminder = reminders.find(candidate => candidate.name === name)
      expect(reminder).toBeDefined()
      expect(sourceLabels(reminder!)).toEqual(['Well-Fed Beasts'])
    })
  })

  it('keeps the source tone off faction-automatic content', () => {
    const reminders = remindersFor([['faction', 'Ogor Mawtribes']])
    expect(reminders.length).toBeGreaterThan(0)
    reminders.forEach(reminder => {
      expect(sourceLabels(reminder)).toEqual([])
    })
  })

  /**
   * Game-wide rules carry a quiet provenance tag naming their origin (issue #1857): MUSICIAN is
   * not an Ogor rule, and without a tag it read as one. The tag uses its own `provenance` tone —
   * never `source`, which is reserved for things the player picked — and the `rulesModule` data
   * stays for text-only surfaces.
   */
  it('tags game-wide core rules with a Core Rules provenance tag', () => {
    const reminders = remindersFor([['faction', 'Ogor Mawtribes']])
    const coreReminders = ['MUSICIAN', 'STANDARD BEARER', 'RALLY']
    coreReminders.forEach(name => {
      const reminder = reminders.find(candidate => candidate.name === name)
      expect(reminder).toBeDefined()
      expect(reminder!.rulesModule).toBe('The Core Rules')
      expect(sourceLabels(reminder!)).toEqual([])
      expect(provenanceLabels(reminder!)).toEqual(['Core Rules'])
    })
  })

  /**
   * The season's rules arrive through a faction-rooted seasonal group (`Season Rules 2026-27`),
   * so without a tag they read as faction rules. They are classified by rules context — the
   * ability exists only in a seasonal context — never by group name.
   */
  it('tags seasonal rules as Seasonal', () => {
    const reminders = remindersFor([['faction', 'Ogor Mawtribes']])
    const seasonal = ['RAISING THE HEAT', 'FIGHT THROUGH THE PAIN']
    seasonal.forEach(name => {
      const reminder = reminders.find(candidate => candidate.name === name)
      expect(reminder).toBeDefined()
      expect(sourceLabels(reminder!)).toEqual([])
      expect(provenanceLabels(reminder!)).toEqual(['Seasonal'])
      const tag = reminder!.tags.find(candidate => candidate.tone === 'provenance')
      expect(tag!.description).toContain('Season Rules 2026-27')
    })
  })

  it("tags battletome battle traits with the faction's battle-trait group", () => {
    const reminders = remindersFor([['faction', 'Ogor Mawtribes']])
    const battleTraits = ['BULL CHARGE', 'EAT ’EM ALIVE']
    battleTraits.forEach(name => {
      const reminder = reminders.find(candidate => candidate.name === name)
      expect(reminder).toBeDefined()
      expect(reminder!.rulesModule).toBeUndefined()
      expect(sourceLabels(reminder!)).toEqual([])
      expect(provenanceLabels(reminder!)).toEqual(['Battle Traits'])
      const tag = reminder!.tags.find(candidate => candidate.tone === 'provenance')
      expect(tag!.description).toContain('Ogor Mawtribes')
    })
  })

  /**
   * A picked source is the stronger attribution: a reminder the player granted names its pick and
   * never also carries a game-wide provenance tag.
   */
  it('never adds a provenance tag to a reminder attributed to a pick', () => {
    const reminders = remindersFor([
      ['faction', 'Ogor Mawtribes'],
      ['content-group', 'Well-Fed Beasts'],
      ['content-group', 'Lore of Gut Magic'],
    ])
    reminders
      .filter(reminder => sourceLabels(reminder).length > 0)
      .forEach(reminder => {
        expect(provenanceLabels(reminder)).toEqual([])
      })
    const spell = reminders.find(reminder => reminder.name === 'BLOOD FEAST')
    expect(spell).toBeDefined()
    expect(sourceLabels(spell!)).toEqual(['Lore of Gut Magic'])
    expect(provenanceLabels(spell!)).toEqual([])
  })

  it('tags a warscroll-native spell with its unit', () => {
    const kroak = entityByName('warscroll', 'Lord Kroak')
    expect(kroak).toBeDefined()
    const reminders = remindersFor([
      ['faction', 'Seraphon'],
      ['warscroll', 'Lord Kroak'],
    ])
    const spell = reminders.find(reminder => reminder.name === 'CELESTIAL DELIVERANCE')
    expect(spell).toBeDefined()
    expect(sourceLabels(spell!)).toEqual(['Lord Kroak'])
  })

  it('tags Army of Renown grants with the army root', () => {
    const rovingMaw = entityByName('content-group', 'The Roving Maw') as ContentGroup
    expect(rovingMaw.groupType).toBe('army-of-renown')
    const reminders = remindersFor([
      ['faction', 'Ogor Mawtribes'],
      ['content-group', 'The Roving Maw'],
    ])
    const spell = reminders.find(reminder => reminder.name === 'MAWMEAT')
    expect(spell).toBeDefined()
    expect(sourceLabels(spell!)).toEqual(['The Roving Maw'])
  })

  it('never repeats the reminder name as its own attribution', () => {
    const ogor = entityByName('faction', 'Ogor Mawtribes')
    expect(ogor).toBeDefined()
    const documents: Array<Array<[PickableKind, string]>> = [
      [
        ['faction', 'Ogor Mawtribes'],
        ['content-group', 'Well-Fed Beasts'],
      ],
      [
        ['faction', 'Ogor Mawtribes'],
        ['content-group', 'The Roving Maw'],
      ],
      [
        ['faction', 'Seraphon'],
        ['warscroll', 'Lord Kroak'],
      ],
    ]
    documents.forEach(explicit => {
      remindersFor(explicit).forEach(reminder => {
        sourceLabels(reminder).forEach(label => {
          expect(label.toLowerCase()).not.toBe(reminder.name.toLowerCase())
        })
      })
    })
  })
})
