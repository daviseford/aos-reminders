import { describe, expect, it } from 'vitest'
import { mergeOfficialProfileOnlyWarscrolls } from '../../aos4/data/gamesWorkshop/profileOnlyMerge'
import { extractOfficialRegimentOfRenownPage } from '../../aos4/data/gamesWorkshop/rulesOfRenown'
import type { SourceRecordId } from '../../aos4/domain'

const CHECKSUM = 'a'.repeat(64)
// The extracted text layout of Regiments of Renown - Khazalite Holds page 2 (October 2026): the
// timing bar and casting value of one ability share a line with the next ability's name.
const PAGE = [
  'THENGIN’S GRUDGESETTLERS',
  'REGIMENT OF RENOWN',
  'INCLUSION',
  'ORGANISATION',
  '♦ 1 Runewright',
  '♦ 1 Clanshields unit with 10 models',
  '♦ 1 Clangunners with Thrundok Rifles unit with',
  '10 models',
  'RUNE OF STOICISM: The sombre',
  'resonance of this rune instils in duardin a',
  'stubborn determination.',
  'Declare: Pick the Runewright in this Regiment of',
  'Renown to cast this spell, then make a casting roll',
  'of 2D6.',
  'Effect: Until the start of your next turn, units',
  'in this Regiment of Renown have Ward (6+).',
  'Keywords Spell',
  'Your Hero Phase 7 GRUDGESETTLERS: No matter the grievance.',
  'Effect: Each unit in this Regiment of Renown',
  'starts the battle with 1 grudge mark .',
  'Passive RULES OF RENOWN',
].join('\n')
const page = (text: string) => ({ page: 2, text, pageSourceRecordId: 'source-record:x' as SourceRecordId })

describe('official Rules of Renown page reader (#1757)', () => {
  it('reads members, abilities, timings and casting values from the page text', () => {
    const fact = extractOfficialRegimentOfRenownPage(page(PAGE), CHECKSUM)
    expect(fact).toMatchObject({
      name: 'Thengin’s Grudgesettlers',
      section: 'regiment:thengins-grudgesettlers',
      members: [
        { name: 'Runewright', count: 1 },
        { name: 'Clanshields', count: 1 },
        { name: 'Clangunners with Thrundok Rifles', count: 1 },
      ],
    })
    expect(fact.abilities).toEqual([
      expect.objectContaining({
        name: 'RUNE OF STOICISM',
        kind: 'spell',
        timing: 'Your Hero Phase',
        costValue: 7,
        keywords: ['Spell'],
        declare:
          'Pick the Runewright in this Regiment of Renown to cast this spell, then make a casting roll of 2D6.',
        effect: 'Until the start of your next turn, units in this Regiment of Renown have Ward (6+).',
      }),
      expect.objectContaining({
        name: 'GRUDGESETTLERS',
        kind: 'passive',
        timing: 'Passive',
        effect: 'Each unit in this Regiment of Renown starts the battle with 1 grudge mark.',
      }),
    ])
    expect(String(fact.abilities[0].sourceRecordId)).toContain(CHECKSUM)
  })

  it('fails closed on a page that is not a regiment, lacks members, or an ability without timing', () => {
    expect(() =>
      extractOfficialRegimentOfRenownPage(page('SOMETHING ELSE\nNOT A REGIMENT'), CHECKSUM)
    ).toThrow(/does not open with a regiment name/)
    expect(() =>
      extractOfficialRegimentOfRenownPage(
        page(PAGE.replace(/♦ 1 Runewright\n/, '').replace(/♦[^\n]*\n/g, '')),
        CHECKSUM
      )
    ).toThrow(/lists no members|unreadable member/)
    expect(() =>
      extractOfficialRegimentOfRenownPage(
        page(PAGE.replace('Passive RULES OF RENOWN', 'RULES OF RENOWN')),
        CHECKSUM
      )
    ).toThrow(/has no timing bar/)
  })
})

describe('official profile-only merge (#1757)', () => {
  const fact = {
    kind: 'unit' as const,
    key: 'page:2:unit:4',
    page: 2,
    row: 4,
    faction: 'Khazalite Holds',
    context: 'standard' as const,
    name: 'Clanshields',
    unitSize: 10,
    points: 110,
    regimentOptions: [],
    relevantKeywords: ['Kromdron', 'Infantry'],
    notes: [],
    baseSizes: ['28.5mm'],
    sourceRecordId: `source-record:games-workshop:${CHECKSUM}%3Apage%3A2` as SourceRecordId,
    factChecksum: 'f'.repeat(64),
  }
  const dataset = {
    factions: [{ id: 'GW-KHZ', name: 'Khazalite Holds' }],
    warscrolls: [],
    warscrollKeywords: [],
    warscrollBases: [],
  } as never
  const reconciliation = (unmatched: boolean) =>
    ({ unmatchedOfficialUnitFacts: unmatched ? [{ factChecksum: fact.factChecksum }] : [] }) as never
  const entry = {
    name: 'Clanshields',
    faction: 'Khazalite Holds',
    context: 'standard' as const,
    identitySourceRecordId:
      'source-record:bsdata:BSData%2Fage-of-sigmar-4th%3Aunit%3Aclanshields' as SourceRecordId,
    reason: 'test',
  }
  const official = [{ artifactChecksum: CHECKSUM, status: 'effective' as const, fact }]

  it('ships an unmatched official row as a rules-less unit on the pinned identity alias', () => {
    const merged = mergeOfficialProfileOnlyWarscrolls(
      dataset,
      reconciliation(true),
      [entry],
      official
    ) as never as {
      warscrolls: Array<Record<string, unknown> & { meta: Record<string, unknown> }>
      warscrollKeywords: Array<{ keyword: string }>
      warscrollBases: Array<{ base: string }>
    }
    expect(merged.warscrolls).toHaveLength(1)
    expect(merged.warscrolls[0]).toMatchObject({
      profileOnly: true,
      name: 'Clanshields',
      factionId: 'GW-KHZ',
      cost: '110',
      unitSize: '10',
      move: '',
      meta: {
        identitySourceRecordId: entry.identitySourceRecordId,
        rulesContextKinds: ['standard'],
        officialSourceRecordIds: [fact.sourceRecordId],
      },
    })
    // Its own record, not the page record, so the page's other contexts never widen the unit.
    expect(merged.warscrolls[0].meta.sourceRecordId).not.toBe(fact.sourceRecordId)
    expect(merged.warscrollKeywords.map(keyword => keyword.keyword)).toEqual(['KROMDRON', 'INFANTRY'])
    expect(merged.warscrollBases.map(base => base.base)).toEqual(['28.5mm'])
  })

  it('refuses a row a rules source already matched, a missing row, and a repeated entry', () => {
    expect(() =>
      mergeOfficialProfileOnlyWarscrolls(dataset, reconciliation(false), [entry], official)
    ).toThrow(/already matched/)
    expect(() =>
      mergeOfficialProfileOnlyWarscrolls(
        dataset,
        reconciliation(true),
        [{ ...entry, name: 'Nobody' }],
        official
      )
    ).toThrow(/matches 0 effective official unit facts/)
    expect(() =>
      mergeOfficialProfileOnlyWarscrolls(dataset, reconciliation(true), [entry, entry], official)
    ).toThrow(/reviewed twice/)
  })
})

describe('official faction-pack transcription (#1757)', () => {
  it('accepts only what the cited page prints', async () => {
    const { extractOfficialFactionOptionSources } = await import('../../aos4/generate/corpusCommand')
    const pageRecord = 'source-record:games-workshop:page-1' as SourceRecordId
    const review = (effect: string) =>
      ({
        officialDocuments: [
          {
            title: 'Scourge of Aqshy - Khazalite Holds',
            artifact: { checksum: CHECKSUM },
            sourceRecords: [{ id: pageRecord, page: 1 }],
          },
        ],
        officialFactionOptionSources: [
          {
            artifactChecksum: CHECKSUM,
            page: 1,
            faction: 'Khazalite Holds',
            officialSourceRecordIds: [],
            options: [
              {
                name: 'Thickened Scales',
                optionType: 'mark-of-vulcatrix',
                groupName: 'Marks of Vulcatrix',
                section: 'option:thickened-scales',
                createsType: true,
                context: 'seasonal',
                abilities: [{ name: 'THICKENED SCALES', timing: 'Passive', effect, keywords: [] }],
              },
            ],
            reason: 'test',
          },
        ],
      }) as never
    const text = new Map([
      [pageRecord, 'THICKENED SCALES: Effect: Subtract 1 from the Rend characteristic of weapons. Passive'],
    ])
    const [source] = extractOfficialFactionOptionSources(
      review('Subtract 1 from the Rend characteristic of weapons.'),
      text
    )
    expect(source).toMatchObject({
      publisher: 'games-workshop',
      seasonalSections: ['option:thickened-scales'],
      createsTypeSections: ['option:thickened-scales'],
    })
    expect(() =>
      extractOfficialFactionOptionSources(review('Subtract 2 from the Rend characteristic of weapons.'), text)
    ).toThrow(/is not printed on Scourge of Aqshy - Khazalite Holds page 1/)
  }, 60_000)
})

describe('official full-page warscroll reader (#1757)', () => {
  const item = (str: string, x: number, y: number, height: number) => ({
    str,
    x,
    y,
    width: str.length * 4,
    height,
  })
  const page = [
    item('• SCOU RGE OF AQSH Y WA R SCROLL •', 73, 706, 10),
    item('V ULK Y N FLA M ESEEK ER S', 51, 681, 18),
    item('6+', 120, 645, 14),
    item('4"', 83, 627, 14),
    item('2', 68, 610, 14),
    item('5+', 100, 610, 14),
    item('1', 86, 589, 14),
    item('MELEE WEAPONS', 74, 543, 9),
    item('Emberteeth', 93, 508, 9),
    item('Companion', 68, 499, 9),
    item('1', 194, 503, 10),
    item('3+', 212, 503, 10),
    item('3+', 233, 503, 10),
    item('-', 258, 503, 10),
    item('2', 279, 503, 10),
    item('Passive', 61, 424, 8),
    item('KINDLED:', 55, 412, 8),
    item('Effect:', 55, 379, 8),
    item('Add 1 to save rolls for this unit.', 79, 379, 8),
    item('KEY WORDS', 60, 96, 7),
    item('Infantry, Ward (6+)', 136, 102, 8),
    item('Order, Khazalite Holds', 137, 91, 8),
  ]

  it('reads the stat badge, weapons, abilities and keywords from relative positions', async () => {
    const { parseOfficialWarscrollPage } = await import('../../aos4/data/gamesWorkshop/scourgeWarscroll')
    const warscroll = parseOfficialWarscrollPage(page, 3, 'Vulkyn Flameseekers', 'test')
    expect(warscroll).toMatchObject({
      move: '4"',
      save: '5+',
      health: '2',
      control: '1',
      ward: '6+',
      keywords: ['INFANTRY', 'WARD (6+)', 'ORDER', 'KHAZALITE HOLDS'],
      weapons: [
        expect.objectContaining({
          name: 'Emberteeth',
          attacks: '1',
          hit: '3+',
          rend: '-',
          damage: '2',
          abilities: 'Companion',
        }),
      ],
      abilities: [
        expect.objectContaining({
          name: 'KINDLED',
          timing: 'Passive',
          effect: 'Add 1 to save rolls for this unit.',
        }),
      ],
    })
  })

  it('fails closed without the banner, on another title, or when the ward disagrees', async () => {
    const { parseOfficialWarscrollPage } = await import('../../aos4/data/gamesWorkshop/scourgeWarscroll')
    expect(() => parseOfficialWarscrollPage(page.slice(1), 3, 'Vulkyn Flameseekers', 'test')).toThrow(
      /banner/
    )
    expect(() => parseOfficialWarscrollPage(page, 3, 'Auric Runeson', 'test')).toThrow(/title/)
    const noWard = page.map(entry =>
      entry.str === 'Infantry, Ward (6+)' ? { ...entry, str: 'Infantry' } : entry
    )
    expect(() => parseOfficialWarscrollPage(noWard, 3, 'Vulkyn Flameseekers', 'test')).toThrow(/ward/)
  })
})
