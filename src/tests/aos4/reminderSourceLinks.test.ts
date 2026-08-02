import type { Faction, SourceLocator, Warscroll } from '../../aos4/domain'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { createAos4ArmyDocument } from '../../aos4/state'
import {
  createAos4ReminderSourceLinkResolver,
  createAos4ReminderViewModel,
  sourceRecordUrl,
  type Aos4ReminderViewModel,
} from '../../aos4/view'

/**
 * Reminder source links point at the unit the record describes (issue #1860). Warscroll abilities
 * are read from the faction-wide Wahapedia `warscrolls.html` index, and linking that artifact URL
 * sent every unit's "source" link to the top of the same index page. The record's datasheet
 * locator names the unit's anchor, which on a warscroll collection is also the slug of the unit's
 * standalone page.
 */

const entityByName = (kind: 'faction' | 'warscroll', name: string): Faction | Warscroll => {
  const entity = AOS4_CATALOG.entities.find(candidate => candidate.kind === kind && candidate.name === name)
  if (!entity) throw new Error(`No ${kind} named ${name} in the catalog`)
  return entity as Faction | Warscroll
}

const remindersFor = (explicitNames: Array<['faction' | 'warscroll', string]>): Aos4ReminderViewModel[] =>
  createAos4ReminderViewModel(
    AOS4_CATALOG,
    createAos4ArmyDocument({
      id: 'army:test-source-links',
      name: 'Source Link Test',
      rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
      explicitSelectionIds: explicitNames.map(([kind, name]) => entityByName(kind, name).id),
    })
  )

const resolveLinks = createAos4ReminderSourceLinkResolver(AOS4_CATALOG)

const wahapediaHrefs = (reminder: Aos4ReminderViewModel): string[] =>
  resolveLinks(reminder).flatMap(link =>
    !link.official && link.href?.includes('wahapedia.ru') ? [link.href] : []
  )

describe('reminder source links (#1860)', () => {
  it("links a warscroll ability to its unit's own Wahapedia page, not the warscrolls index", () => {
    const reminders = remindersFor([
      ['faction', 'Kruleboyz'],
      ['warscroll', 'Killaboss with Stab-grot'],
    ])
    const reminder = reminders.find(candidate => candidate.name === 'UNLEASH THE STAB-GROT!')
    expect(reminder).toBeDefined()
    expect(wahapediaHrefs(reminder!)).toEqual([
      'https://wahapedia.ru/aos4/factions/kruleboyz/Killaboss-with-Stab-grot',
    ])
  })

  it('never leaves a reminder pointing at the bare warscrolls index', () => {
    const reminders = remindersFor([
      ['faction', 'Kruleboyz'],
      ['warscroll', 'Killaboss with Stab-grot'],
      ['warscroll', 'Gutrippaz'],
      ['warscroll', 'Beast-skewer Killbow'],
    ])
    expect(reminders.length).toBeGreaterThan(0)
    reminders.forEach(reminder => {
      wahapediaHrefs(reminder).forEach(href => {
        expect(href).not.toMatch(/\/warscrolls\.html$/)
      })
    })
  })

  it('resolves one link per destination, so shared-artifact records do not duplicate', () => {
    const reminders = remindersFor([
      ['faction', 'Kruleboyz'],
      ['warscroll', 'Gutrippaz'],
    ])
    reminders.forEach(reminder => {
      const hrefs = wahapediaHrefs(reminder)
      expect(new Set(hrefs).size).toBe(hrefs.length)
    })
  })
})

describe('sourceRecordUrl', () => {
  const locator = (section: string): SourceLocator => ({ kind: 'section', section })

  it('turns a warscroll-collection datasheet section into the standalone unit page', () => {
    expect(
      sourceRecordUrl(
        {
          publisher: 'wahapedia',
          sourceUrl: 'https://wahapedia.ru/aos4/factions/kruleboyz/warscrolls.html',
        },
        locator('datasheet:Killaboss-with-Stab-grot/ability:1')
      )
    ).toBe('https://wahapedia.ru/aos4/factions/kruleboyz/Killaboss-with-Stab-grot')
  })

  it('anchors a faction-root datasheet into the root page, which has no standalone unit pages', () => {
    expect(
      sourceRecordUrl(
        { publisher: 'wahapedia', sourceUrl: 'https://wahapedia.ru/aos4/factions/kruleboyz/' },
        locator('datasheet:Swampskulka-Gang/warscroll')
      )
    ).toBe('https://wahapedia.ru/aos4/factions/kruleboyz/#Swampskulka-Gang')
  })

  it('anchors a nested datasheet to its anchored parent group', () => {
    expect(
      sourceRecordUrl(
        { publisher: 'wahapedia', sourceUrl: 'https://wahapedia.ru/aos4/factions/kruleboyz/' },
        locator('datasheet:Swampskulka-Gang:Beast-skewer-Killbow/ability:1')
      )
    ).toBe('https://wahapedia.ru/aos4/factions/kruleboyz/#Swampskulka-Gang')
  })

  it('leaves non-datasheet sections on the artifact URL', () => {
    expect(
      sourceRecordUrl(
        {
          publisher: 'wahapedia',
          sourceUrl: 'https://wahapedia.ru/aos4/factions/kruleboyz/warscrolls.html',
        },
        locator('keyword:1')
      )
    ).toBe('https://wahapedia.ru/aos4/factions/kruleboyz/warscrolls.html')
  })

  it('leaves rules pages and non-Wahapedia artifacts untouched', () => {
    expect(
      sourceRecordUrl(
        { publisher: 'wahapedia', sourceUrl: 'https://wahapedia.ru/aos4/the-rules/the-core-rules/' },
        locator('datasheet:Something/ability:1')
      )
    ).toBe('https://wahapedia.ru/aos4/the-rules/the-core-rules/')
    expect(
      sourceRecordUrl(
        { publisher: 'games-workshop', sourceUrl: 'https://assets.warhammer-community.com/some.pdf' },
        { kind: 'page', page: 3 }
      )
    ).toBe('https://assets.warhammer-community.com/some.pdf')
  })
})
