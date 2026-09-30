import { readFileSync } from 'node:fs'
import type { Ability, CanonicalId, Faction, Warscroll } from '../../aos4/domain'
import { AOS4_CATALOG } from '../../aos4/generated'
import { ACCEPTED_REVIEW_PATH } from '../../aos4/data/acceptedRevision'
import { createAos4ArmyDocument } from '../../aos4/state'
import { createAos4ReminderViewModel } from '../../aos4/view'

/**
 * Pyregheists' LIGHT A PYRE has no named phase (issue #2048).
 *
 * A player reported that the ability is used at the end of any turn and that the app shows it under
 * "No Named Phase". The September 2026 Rules Updates (page 58, Battletome: Nighthaunt, marked NEW)
 * reads "Change the timing of ‘Light a Pyre’ to ‘Once Per Turn (Army)’", so the end-of-turn timing
 * the report remembers is the pre-erratum rule. The accepted Wahapedia collection prints the
 * erratum's timing, and the app's phase-independent placement is correct. This pins it so a
 * refresh cannot quietly restore an end-of-turn window while the erratum is current.
 */

const LIGHT_A_PYRE_ID = 'ability:a703721c-5a81-540b-a065-1c46cb84f7b5' as CanonicalId<'ability'>
const RULES_UPDATES_PAGE_58 =
  'source-record:games-workshop:03f602f23a103504ca24b5bf5ac3c4f7fc83be769696d55252928ae5009de315%3Apage%3A58'

const pyregheists = AOS4_CATALOG.entities.find(
  (entity): entity is Warscroll => entity.kind === 'warscroll' && entity.name === 'Pyregheists'
)!
const lightAPyre = AOS4_CATALOG.entities.find(
  (entity): entity is Ability => entity.kind === 'ability' && entity.id === LIGHT_A_PYRE_ID
)!

describe('Pyregheists LIGHT A PYRE after the September 2026 Nighthaunt erratum (#2048)', () => {
  it('ships on the Pyregheists warscroll with the erratum timing and no named phase', () => {
    expect(lightAPyre.name).toBe('LIGHT A PYRE')
    expect(
      AOS4_CATALOG.relationships.some(
        relationship =>
          relationship.kind === 'includes' &&
          relationship.from === pyregheists.id &&
          relationship.to === LIGHT_A_PYRE_ID
      )
    ).toBe(true)
    expect(lightAPyre.timings).toEqual([
      {
        kind: 'active',
        perspective: 'neutral',
        raw: 'Once Per Turn (Army)',
        usage: { limit: 1, period: 'turn', scope: 'army' },
        window: { kind: 'phase-independent' },
      },
    ])
  })

  it('keeps the erratum page among the accepted official evidence', () => {
    const review = JSON.parse(readFileSync(ACCEPTED_REVIEW_PATH, 'utf8')) as {
      officialDocuments: Array<{ sourceRecords: Array<{ id: string }> }>
    }
    expect(
      review.officialDocuments.flatMap(document => document.sourceRecords.map(record => record.id))
    ).toContain(RULES_UPDATES_PAGE_58)
  })

  it('shows the reminder under No Named Phase, never an end-of-turn window, in a Nighthaunt army', () => {
    const nighthaunt = AOS4_CATALOG.entities.find(
      (entity): entity is Faction => entity.kind === 'faction' && entity.name === 'Nighthaunt'
    )!
    const seasonal = AOS4_CATALOG.rulesContexts.find(context => context.status === 'seasonal')!
    const reminders = createAos4ReminderViewModel(
      AOS4_CATALOG,
      createAos4ArmyDocument({
        id: 'army:pyregheists',
        name: 'Pyregheists',
        rulesContextId: seasonal.id,
        explicitSelectionIds: [nighthaunt.id, pyregheists.id],
      })
    ).filter(reminder => reminder.projected.abilityIds.includes(LIGHT_A_PYRE_ID))

    expect(reminders.map(reminder => [reminder.windowKey, reminder.windowLabel])).toEqual([
      ['phase-independent', 'No Named Phase'],
    ])
  })
})
