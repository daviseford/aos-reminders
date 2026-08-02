import type { Faction } from '../../aos4/domain'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { createAos4ArmyDocument } from '../../aos4/state'
import { createAos4ReminderViewModel, type Aos4ReminderViewModel } from '../../aos4/view'

/**
 * An ability keyword is tagged only when another rule in the army answers to it (issue #1855):
 * NOISY RACKET is a DIRTY TRICK ability, and whether it works at all is decided by the DIRTY
 * TRICKS battle trait's escalating roll. Core ability keywords no army rule names (SPELL, CORE,
 * RAMPAGE) stay untagged.
 */

const remindersFor = (factionName: string): Aos4ReminderViewModel[] => {
  const faction = AOS4_CATALOG.entities.find(
    (candidate): candidate is Faction => candidate.kind === 'faction' && candidate.name === factionName
  )
  if (!faction) throw new Error(`No faction named ${factionName} in the catalog`)
  return createAos4ReminderViewModel(
    AOS4_CATALOG,
    createAos4ArmyDocument({
      id: 'army:test-keyword-tags',
      name: 'Keyword Tag Test',
      rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
      explicitSelectionIds: [faction.id],
    })
  )
}

const keywordLabels = (reminder: Aos4ReminderViewModel): string[] =>
  reminder.tags.filter(tag => tag.tone === 'keyword').map(tag => tag.label)

describe('reminder keyword tags (#1855)', () => {
  const kruleboyz = remindersFor('Kruleboyz')

  it('tags every Dirty Trick battle trait with its keyword', () => {
    const dirtyTricks = ['NOISY RACKET', 'SNEAKY SNEAKIN’', 'VENOM-ENCRUSTED WEAPONS']
    dirtyTricks.forEach(name => {
      const reminder = kruleboyz.find(candidate => candidate.name === name)
      expect(reminder).toBeDefined()
      expect(keywordLabels(reminder!)).toEqual(['Dirty Trick'])
    })
  })

  it('names the governing rule in the tag description and accessible label', () => {
    const reminder = kruleboyz.find(candidate => candidate.name === 'NOISY RACKET')
    const tag = reminder!.tags.find(candidate => candidate.tone === 'keyword')
    expect(tag!.description).toContain('DIRTY TRICKS')
    expect(reminder!.accessibleLabel).toContain('Dirty Trick ability')
  })

  it('does not tag the governing rule itself', () => {
    const governing = kruleboyz.find(candidate => candidate.name === 'DIRTY TRICKS')
    expect(governing).toBeDefined()
    expect(keywordLabels(governing!)).toEqual([])
  })

  it('leaves core ability keywords untagged', () => {
    // Kruleboyz lore spells carry SPELL keywords; no rule named SPELL exists to govern them. The
    // core rules DO define a rule named RUN, but a game-wide module never claims a keyword: only
    // the army's own content (a battle trait like DIRTY TRICKS) is tag-worthy.
    kruleboyz.forEach(reminder => {
      expect(keywordLabels(reminder)).not.toContain('Spell')
      expect(keywordLabels(reminder)).not.toContain('Core')
      expect(keywordLabels(reminder)).not.toContain('Run')
    })
  })

  it('tags no keywords in an army whose own rules never name one', () => {
    remindersFor('Ogor Mawtribes').forEach(reminder => {
      expect(keywordLabels(reminder)).toEqual([])
    })
  })
})
