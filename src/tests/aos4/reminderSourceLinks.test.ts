import type { CanonicalId, Faction, SourceLocator, Warscroll } from '../../aos4/domain'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID, loadAos4SourceData } from '../../aos4/generated'
import { createAos4ArmyDocument } from '../../aos4/state'
import {
  createAos4ReminderSourceLinkResolver,
  createAos4ReminderViewModel,
  sourceRecordUrl,
  type Aos4ReminderSourceLink,
  type Aos4ReminderViewModel,
} from '../../aos4/view'
import capture from '../fixtures/aos4/reminderSourceLinks.capture.json'

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

/*
 * Built from the real loader rather than a static import of the artifact, so these cases exercise
 * the path a player's browser takes when a source menu is first opened.
 */
let resolveLinks: (reminder: { sourceRecordIndexes: readonly number[] }) => Aos4ReminderSourceLink[]

beforeAll(async () => {
  resolveLinks = createAos4ReminderSourceLinkResolver(await loadAos4SourceData())
})

const wahapediaHrefs = (reminder: Aos4ReminderViewModel): string[] =>
  resolveLinks(reminder).flatMap(link =>
    !link.official && link.href?.includes('wahapedia.ru') ? [link.href] : []
  )

/**
 * The characterization capture. `reminderSourceLinks.capture.json` records every link three
 * representative armies resolve today, and it is checked in so a refactor of the resolution path
 * has to reproduce it byte for byte rather than merely stay self-consistent. The URL derivation
 * below is subtle enough to break silently: regenerate the fixture only when a deliberate product
 * change to source links has been reviewed.
 */
const CAPTURED_WARSCROLLS_PER_FACTION = 40

const capturedArmyReminders = (factionName: string): Aos4ReminderViewModel[] => {
  const faction = entityByName('faction', factionName)
  const warscrolls = AOS4_CATALOG.entities
    .filter(entity => entity.kind === 'warscroll')
    .filter(entity =>
      AOS4_CATALOG.relationships.some(
        relationship => relationship.from === faction.id && relationship.to === entity.id
      )
    )
    .slice(0, CAPTURED_WARSCROLLS_PER_FACTION)
  return createAos4ReminderViewModel(
    AOS4_CATALOG,
    createAos4ArmyDocument({
      id: 'army:source-link-characterization',
      name: factionName,
      rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
      explicitSelectionIds: [faction.id, ...warscrolls.map(warscroll => warscroll.id as CanonicalId)],
    })
  )
}

describe('reminder source link characterization', () => {
  /*
   * Three full armies through selection and projection is seconds of real work, and the whole point
   * is the breadth — a smaller army stops covering the derivation's branches. The generous timeout
   * is for suite-wide CPU contention, not for a slow assertion.
   */
  it('resolves every captured army to exactly the links the fixture records', () => {
    expect(
      capture.map(({ faction }) => ({
        faction,
        reminders: capturedArmyReminders(faction).map(reminder => ({
          id: reminder.id,
          links: resolveLinks(reminder).map(
            link =>
              `${link.official ? 'official' : 'secondary'}\t${link.label}\t${link.href ?? ''}\t${link.id}`
          ),
        })),
      }))
    ).toEqual(capture)
  }, 30_000)

  it('captures the cases the derivation turns on, so a regression cannot hide in an empty fixture', () => {
    const links = capture.flatMap(army => army.reminders.flatMap(reminder => reminder.links))
    const href = (link: string) => link.split('\t')[2]
    expect(links.length).toBeGreaterThan(300)
    // A faction-root datasheet anchored as a fragment, and a warscroll ability deep-linked to the
    // unit's own page — the two halves of issue #1860's rule.
    expect(links.filter(link => href(link).includes('#')).length).toBeGreaterThan(50)
    expect(
      links.filter(link => /\/factions\/[^/]+\/[^/#]+$/.test(href(link)) && !href(link).includes('#')).length
    ).toBeGreaterThan(50)
    expect(links.some(link => href(link).endsWith('/warscrolls.html'))).toBe(false)
    expect(links.some(link => link.startsWith('official\t'))).toBe(true)
    // Reminders whose merged abilities cite several destinations still list each one once.
    const multi = capture.flatMap(army => army.reminders).filter(reminder => reminder.links.length > 1)
    expect(multi.length).toBeGreaterThan(5)
    multi.forEach(reminder => expect(new Set(reminder.links).size).toBe(reminder.links.length))
  })
})

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

describe('the sources artifact behind the links', () => {
  it('fetches once however many menus ask for it', async () => {
    const first = loadAos4SourceData()
    const second = loadAos4SourceData()
    expect(first).toBe(second)
    expect(await first).toBe(await second)
  })

  /**
   * `createAos4ReminderViewModel` lists a reminder's citations in ascending record index, which is
   * the order the menu shows them in. That reproduces the order source records were deduped in
   * before the split — by record ID — only because the projection emits them in ID order. Pin it:
   * an unsorted artifact would silently reshuffle every card's source list.
   */
  it('emits source records in ID order, which is what makes index order the menu order', async () => {
    const { sourceRecords } = await loadAos4SourceData()
    expect(sourceRecords.length).toBeGreaterThan(0)
    expect(
      sourceRecords.filter(
        (record, index) =>
          index > 0 && String(sourceRecords[index - 1].id).localeCompare(String(record.id)) > 0
      )
    ).toEqual([])
  })

  it('drops an index that names no record rather than failing the card', async () => {
    const sources = await loadAos4SourceData()
    const resolve = createAos4ReminderSourceLinkResolver(sources)
    expect(resolve({ sourceRecordIndexes: [sources.sourceRecords.length, -1] })).toEqual([])
    // A good index beside the bad ones still resolves, so one broken citation cannot take a card's
    // whole source list with it.
    expect(resolve({ sourceRecordIndexes: [-1, 0, sources.sourceRecords.length] })).toHaveLength(1)
  })

  it('gives a reminder citing two artifacts one link per destination', async () => {
    const sources = await loadAos4SourceData()
    const resolve = createAos4ReminderSourceLinkResolver(sources)
    const firstOfArtifact = new Map<string, number>()
    sources.sourceRecords.forEach((record, index) => {
      if (!firstOfArtifact.has(record.artifactId)) firstOfArtifact.set(record.artifactId, index)
    })
    const [left, right] = Array.from(firstOfArtifact.values()).slice(0, 2)
    expect(resolve({ sourceRecordIndexes: [left, right, left, right] })).toHaveLength(2)
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
