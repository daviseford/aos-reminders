import {
  extractGamesWorkshopBattleProfiles,
  extractGamesWorkshopBattleProfileSupplement,
  type PdfDocumentLoader,
  type PdfTextItem,
} from '../../aos4/data'

const item = (str: string, x: number, y: number): PdfTextItem => ({ str, x, y })

const unitPage = (name: string, unitSize: number, points: number, baseSizes = '40mm'): PdfTextItem[] => [
  item('UNIT SIZE', 155, 760),
  item('UNITS', 40, 750),
  item(name, 40, 700),
  item(String(unitSize), 160, 700),
  item(String(points), 210, 700),
  item('Warrior', 260, 700),
  item(baseSizes, 520, 700),
]

const lordTerminosPage = (): PdfTextItem[] => [
  item('UNIT SIZE', 155, 760),
  item('HEROES', 40, 750),
  item('Lord-Terminos', 40, 700),
  item('1', 160, 700),
  item('140', 210, 700),
  item('0-1 Stormcast Exemplar', 260, 700),
  item('40mm [1],', 505, 700),
  item('2', 525, 700),
  item('5', 530, 700),
  item('m', 535, 700),
  item('m [1]', 540, 700),
]

const validMultiBasePage = (): PdfTextItem[] => [
  item('UNIT SIZE', 155, 760),
  item('UNITS', 40, 750),
  item('Mixed-base unit', 40, 700),
  item('4', 160, 700),
  item('180', 210, 700),
  item('Warrior', 260, 700),
  item('.', 505, 712),
  item('28.5mm [3]', 505, 704),
  item('or', 525, 700),
  item('40mm [1]', 505, 696),
]

const championBasePage = (): PdfTextItem[] => [
  item('UNIT SIZE', 155, 760),
  item('UNITS', 40, 750),
  item('Champion-base unit', 40, 700),
  item('3', 160, 700),
  item('170', 210, 700),
  item('Warrior', 260, 700),
  item('60 × 35mm.', 505, 708),
  item('Champion is', 505, 700),
  item('40mm.', 505, 692),
]

const continuedMultiBasePage = (): PdfTextItem[] => [
  ...unitPage('Upper unit', 10, 150, '32mm').map(value => ({
    ...value,
    y: value.y === 700 ? 722 : value.y,
  })),
  item('Claws of Karanak', 40, 700),
  item('8', 160, 700),
  item('100', 210, 700),
  item('Bloodbound', 260, 700),
  item('60 × 35mm', 515, 712),
  item('[1], 40mm [1],', 510, 704),
  item('32mm [2],', 515, 696),
  item('28.5mm [4]', 515, 688),
  ...unitPage('Lower unit', 5, 120, '60mm').map(value => ({
    ...value,
    y: value.y === 700 ? 678 : value.y,
  })),
]

const rosterPage = (): PdfTextItem[] => [
  item('Heroic Trait', 40, 700),
  item('Shock and Awe', 180, 700),
  item('20', 280, 700),
  item('Scourge of Aqshy only', 320, 700),
]

const manifestationPage = (): PdfTextItem[] => [
  item('NAME', 40, 760),
  item('Primal Energy', 40, 700),
  item('20', 280, 700),
  item('One manifestation lore', 320, 700),
]

const regimentPage = (): PdfTextItem[] => [
  item('MERCENARY CH AOS Saviours of Cinderfall', 40, 700),
  item('UNIT SUMMARY Callis, Toll and companions', 130, 700),
  item('310', 250, 700),
  item('NOTES Order armies only', 320, 700),
]

const legendsHeroPage = (): PdfTextItem[] => [
  item('LEGENDS HEROES', 40, 750),
  item('UNIT SIZE', 155, 750),
  item('S K A V E N', 300, 770),
  item('R EGIMENT OPTIONS', 260, 750),
  item('Tomb Banshee', 40, 700),
  item('1', 160, 700),
  item('130', 210, 700),
  item('0-1 Black Coach, Any Infantry', 260, 700),
  item('This Hero can join an eligible regiment as a Cursed Soul.', 405, 700),
  item('32mm', 520, 700),
]

const verticallyCenteredNotesPage = (): PdfTextItem[] => [
  item('HEROES', 40, 750),
  item('UNIT SIZE', 155, 750),
  item('Upper Hero', 40, 700),
  item('1', 160, 700),
  item('100', 210, 700),
  item('Any Upper', 260, 700),
  item('Upper note.', 405, 700),
  item('32mm', 520, 700),
  item('Lower Hero', 40, 665),
  item('1', 160, 665),
  item('120', 210, 665),
  item('Any Lower', 260, 665),
  item('This long lower note', 405, 685),
  item('begins above its numeric row', 405, 677),
  item('and continues over several', 405, 669),
  item('vertically centred lines', 405, 661),
  item('without belonging to', 405, 653),
  item('the upper profile.', 405, 645),
  item('40mm', 520, 665),
]

const rightEdgeNotesPage = (): PdfTextItem[] => [
  item('HEROES', 40, 750),
  item('UNIT SIZE', 155, 750),
  item('Black Ark Fleetmaster', 40, 700),
  item('1', 160, 700),
  item('90', 210, 700),
  item('Any Aelf', 260, 700),
  item('This Hero can join a Sorceress on Black Dragon', 401, 700),
  item('’s regiment.', 501, 700),
  item('25mm', 525, 700),
]

const verticallyCenteredRegimentNotesPage = (): PdfTextItem[] => [
  item('Upper Regiment', 40, 700),
  item('1 Upper Unit', 130, 700),
  item('200', 250, 700),
  item('Upper note.', 320, 700),
  item('Lower Regiment', 40, 665),
  item('1 Lower Unit', 130, 665),
  item('300', 250, 665),
  item('This Regiment of Renown can be included in the following factions:', 320, 685),
  item('Lower faction one, Lower faction two.', 320, 674),
  item('The note continues over several', 320, 666),
  item('vertically centred lines', 320, 658),
  item('without belonging to', 320, 650),
  item('the upper regiment.', 320, 642),
]

const fragmentedAndBleedingTextPage = (): PdfTextItem[] => [
  item('UNIT SIZE', 155, 760),
  item('UNITS', 40, 750),
  item('Wa r Hyd ra', 40, 700),
  item('1', 160, 700),
  item('170', 210, 700),
  item('R E L E V A N T K E Y WOR DS Da e m o n, C ava l r y NOTES This unit cannot be reinforced.', 260, 700),
  item('120 × 92mm', 520, 700),
]

const wrappedKeywordBelowNotePage = (): PdfTextItem[] => [
  item('LEGENDS UNITS', 40, 750),
  item('UNIT SIZE', 155, 750),
  item('Khagra’s Ravagers', 40, 700),
  item('4', 160, 700),
  item('170', 210, 700),
  item('Unique, Warriors of Chaos,', 260, 704),
  item('This unit cannot be reinforced.', 399, 700),
  item('Infantry', 260, 696),
  item('32mm', 520, 700),
]

const fragmentedOfficialRosterNamesPage = (): PdfTextItem[] =>
  [
    'Bu l l fat her’s Scor n',
    'G od sw rat h Wa rba nd',
    'Fool ’s C ap',
    'Trophy Sku l ls',
    'Wa rbeat s',
    'Wei rd fi st',
  ].flatMap((name, index) => {
    const y = 700 - index * 20
    return [
      item('Artefact of Power', 40, y),
      item(name, 180, y),
      item('10', 280, y),
      item('Scourge of Aqshy', 320, y),
    ]
  })

const fragmentedOfficialUnitNamesPage = (): PdfTextItem[] => [
  item('UNIT SIZE', 155, 760),
  item('HEROES', 40, 750),
  ...[
    'Tree-Revena nts',
    'Tzaa ngors',
    'Wa r Despot',
    'A rch-Wa rlock',
    'Mor tek Tria xes',
    'Wa rcha nter',
    'K a ma ndora’s Blades',
    'K a i na n’s Reapers',
    'Z a rbag’s Git z',
  ].flatMap((name, index) => {
    const y = 720 - index * 22
    return [
      item(name, 40, y),
      item('1', 160, y),
      item('100', 210, y),
      item('Any S k av e n, Any Ogor M aw t r i be s', 260, y),
      item(
        index === 0
          ? 'This Hero can join a Sorceress ’ or Trugg ’s regiment.'
          : 'This Hero can join Trugg ’s regiment.',
        405,
        y
      ),
      item(index === 0 ? '40mm [1], . 28.5mm [1]' : '40mm', 520, y),
    ]
  }),
]

const fragmentedOfficialRegimentNamesPage = (): PdfTextItem[] =>
  ['Nu rg le’s Gi ft', 'K r it tok ’s Claw pack', 'Phu lgot h ’s Shudderhood'].flatMap(
    (name, index) => {
      const y = 700 - index * 30
      return [
        item(name, 40, y),
        item('1 Unit', 130, y),
        item('300', 250, y),
        item('Order armies only.', 320, y),
      ]
    }
  )

const fakeLoader = (
  pageCount: number,
  pages: Record<number, PdfTextItem[]>,
  onDestroy: () => void = () => undefined
): PdfDocumentLoader => ({
  async load() {
    return {
      numPages: pageCount,
      async getPage(page) {
        return {
          async getTextItems() {
            if (pages[page]) return pages[page]
            if (pageCount >= 57 && page === 57) return manifestationPage()
            if (pageCount >= 57 && page >= 58 && page <= 63) return regimentPage()
            if (pageCount >= 57 && page >= 64) return unitPage(`Legend unit ${page}`, 1, 100)
            if (pageCount >= 57 && page >= 3) return rosterPage()
            return [item(`Page ${page}`, 1, 1)]
          },
        }
      },
      async destroy() {
        onDestroy()
      },
    }
  },
})

describe('Games Workshop Battle Profiles extraction', () => {
  it('extracts units, roster options, manifestations, regiments, and Legends with provenance', async () => {
    const loader = fakeLoader(64, {
      3: rosterPage(),
      20: unitPage('Liberators', 5, 90),
      57: manifestationPage(),
      58: regimentPage(),
      64: unitPage('Celestant-Prime (Legends)', 1, 330),
    })

    const first = await extractGamesWorkshopBattleProfiles(new Uint8Array([1]), 'a'.repeat(64), loader)
    const second = await extractGamesWorkshopBattleProfiles(new Uint8Array([1]), 'a'.repeat(64), loader)

    expect(first).toEqual(second)
    expect(first.diagnostics).toEqual([])
    expect(first.facts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'roster-option',
          faction: 'Cities of Sigmar',
          context: 'seasonal',
          optionType: 'Heroic Trait',
          name: 'Shock and Awe',
          points: 20,
          page: 3,
        }),
        expect.objectContaining({
          kind: 'unit',
          faction: 'Stormcast Eternals',
          context: 'standard',
          name: 'Liberators',
          unitSize: 5,
          points: 90,
          baseSizes: ['40mm'],
          page: 20,
        }),
        expect.objectContaining({
          kind: 'roster-option',
          faction: 'Universal Manifestation Lores',
          optionType: 'Manifestation Lore',
          name: 'Primal Energy',
          page: 57,
        }),
        expect.objectContaining({
          kind: 'regiment-of-renown',
          name: 'Saviours of Cinderfall',
          unitSummary: ['Callis, Toll and companions'],
          notes: ['Order armies only'],
          points: 310,
          page: 58,
        }),
        expect.objectContaining({
          kind: 'unit',
          faction: 'Warhammer Legends',
          context: 'legends',
          name: 'Celestant-Prime (Legends)',
          page: 64,
        }),
      ])
    )
    expect(
      first.facts.every(
        fact =>
          fact.factChecksum.length === 64 &&
          String(fact.sourceRecordId).includes(`${'a'.repeat(64)}%3Apage%3A`)
      )
    ).toBe(true)
  })

  it('recognizes Legends hero headers before assigning regiment options', async () => {
    const result = await extractGamesWorkshopBattleProfiles(
      new Uint8Array([1]),
      'e'.repeat(64),
      fakeLoader(70, { 70: legendsHeroPage() })
    )

    expect(result.diagnostics).toEqual([])
    expect(result.facts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'unit',
          name: 'Tomb Banshee',
          context: 'legends',
          regimentOptions: ['0-1 Black Coach', 'Any Infantry'],
          relevantKeywords: [],
        }),
      ])
    )
  })

  it('assigns a vertically centred wrapped cell to one profile row', async () => {
    const result = await extractGamesWorkshopBattleProfiles(
      new Uint8Array([1]),
      'f'.repeat(64),
      fakeLoader(57, { 20: verticallyCenteredNotesPage() })
    )

    expect(result.diagnostics).toEqual([])
    expect(result.facts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Upper Hero', notes: ['Upper note.'] }),
        expect.objectContaining({
          name: 'Lower Hero',
          notes: [
            'This long lower note begins above its numeric row and continues over several vertically centred lines without belonging to the upper profile.',
          ],
        }),
      ])
    )
  })

  it('retains note text that extends to the base-size column boundary', async () => {
    const result = await extractGamesWorkshopBattleProfiles(
      new Uint8Array([1]),
      '0'.repeat(64),
      fakeLoader(57, { 20: rightEdgeNotesPage() })
    )

    expect(result.diagnostics).toEqual([])
    expect(result.facts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Black Ark Fleetmaster',
          notes: ['This Hero can join a Sorceress on Black Dragon’s regiment.'],
          baseSizes: ['25mm'],
        }),
      ])
    )
  })

  it('assigns vertically centred regiment notes to one regiment row', async () => {
    const result = await extractGamesWorkshopBattleProfiles(
      new Uint8Array([1]),
      '2'.repeat(64),
      fakeLoader(58, { 58: verticallyCenteredRegimentNotesPage() })
    )

    expect(result.diagnostics).toEqual([])
    expect(result.facts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Upper Regiment', notes: ['Upper note.'] }),
        expect.objectContaining({
          name: 'Lower Regiment',
          notes: [
            'This Regiment of Renown can be included in the following factions: Lower faction one, Lower faction two. The note continues over several vertically centred lines without belonging to the upper regiment.',
          ],
        }),
      ])
    )
  })

  it('repairs fragmented official terms and separates a note that bled into the keyword column', async () => {
    const result = await extractGamesWorkshopBattleProfiles(
      new Uint8Array([1]),
      '1'.repeat(64),
      fakeLoader(57, { 20: fragmentedAndBleedingTextPage() })
    )

    expect(result.diagnostics).toEqual([])
    expect(result.facts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'War Hydra',
          relevantKeywords: ['Daemon', 'Cavalry'],
          notes: ['This unit cannot be reinforced.'],
        }),
      ])
    )
  })

  it('keeps a wrapped keyword below an adjacent note in the keyword column', async () => {
    const result = await extractGamesWorkshopBattleProfiles(
      new Uint8Array([1]),
      '4'.repeat(64),
      fakeLoader(69, { 69: wrappedKeywordBelowNotePage() })
    )

    expect(result.diagnostics).toEqual([])
    expect(result.facts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Khagra’s Ravagers',
          relevantKeywords: ['Unique', 'Warriors of Chaos', 'Infantry'],
          notes: ['This unit cannot be reinforced.'],
        }),
      ])
    )
  })

  it('repairs confirmed PDF font-fragmentation defects without changing source meaning', async () => {
    const result = await extractGamesWorkshopBattleProfiles(
      new Uint8Array([1]),
      '3'.repeat(64),
      fakeLoader(58, {
        3: fragmentedOfficialRosterNamesPage(),
        20: fragmentedOfficialUnitNamesPage(),
        58: fragmentedOfficialRegimentNamesPage(),
      })
    )

    expect(result.diagnostics).toEqual([])
    expect(result.facts.map(fact => fact.name)).toEqual(
      expect.arrayContaining([
        'Bullfather’s Scorn',
        'Godswrath Warband',
        'Fool’s Cap',
        'Trophy Skulls',
        'Warbeats',
        'Weirdfist',
        'Tree-Revenants',
        'Tzaangors',
        'War Despot',
        'Arch-Warlock',
        'Mortek Triaxes',
        'Warchanter',
        'Kamandora’s Blades',
        'Kainan’s Reapers',
        'Zarbag’s Gitz',
        'Nurgle’s Gift',
        'Krittok’s Clawpack',
        'Phulgoth’s Shudderhood',
      ])
    )
    expect(result.facts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Tree-Revenants',
          regimentOptions: ['Any Skaven', 'Any Ogor Mawtribes'],
          notes: ['This Hero can join a Sorceress’ or Trugg’s regiment.'],
          baseSizes: ['40mm [1]', '28.5mm [1]'],
        }),
      ])
    )
  })

  it('extracts a three-page faction supplement without assuming main-document page numbers', async () => {
    const result = await extractGamesWorkshopBattleProfileSupplement(
      new Uint8Array([1]),
      'b'.repeat(64),
      'Helsmiths of Hashut',
      fakeLoader(3, {
        1: unitPage('Infernal Cohort', 10, 140),
        2: [item('Supplement page two', 1, 1)],
        3: regimentPage(),
      })
    )

    expect(result.diagnostics).toEqual([])
    expect(result.facts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'unit',
          faction: 'Helsmiths of Hashut',
          name: 'Infernal Cohort',
        }),
        expect.objectContaining({
          kind: 'regiment-of-renown',
          name: 'Saviours of Cinderfall',
        }),
      ])
    )
  })

  it('repairs split official base-size measurement tokens without collapsing multi-base entries', async () => {
    const result = await extractGamesWorkshopBattleProfiles(
      new Uint8Array([1]),
      'd'.repeat(64),
      fakeLoader(57, {
        20: lordTerminosPage(),
        21: validMultiBasePage(),
        22: championBasePage(),
        26: continuedMultiBasePage(),
        27: unitPage('Leading-bullet unit', 1, 100, '. 28.5mm [1]'),
      })
    )

    expect(result.diagnostics).toEqual([])
    expect(result.facts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Lord-Terminos',
          baseSizes: ['40mm [1]', '25mm [1]'],
        }),
        expect.objectContaining({
          name: 'Mixed-base unit',
          baseSizes: ['28.5mm [3] or 40mm [1]'],
        }),
        expect.objectContaining({
          name: 'Leading-bullet unit',
          baseSizes: ['28.5mm [1]'],
        }),
        expect.objectContaining({
          name: 'Champion-base unit',
          baseSizes: ['60 × 35mm. Champion is 40mm.'],
        }),
        expect.objectContaining({
          name: 'Claws of Karanak',
          baseSizes: ['60 × 35mm [1]', '40mm [1]', '32mm [2]', '28.5mm [4]'],
        }),
      ])
    )
  })

  it('fails closed on an incompatible layout and still destroys the PDF handle', async () => {
    let destroyed = false
    const result = await extractGamesWorkshopBattleProfiles(
      new Uint8Array([1]),
      'c'.repeat(64),
      fakeLoader(56, {}, () => {
        destroyed = true
      })
    )

    expect(result.facts).toEqual([])
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'ambiguous-layout', severity: 'error' })
    )
    expect(destroyed).toBe(true)
  })

  it('reports loader failures instead of producing partial facts', async () => {
    const loader: PdfDocumentLoader = {
      async load() {
        throw new Error('synthetic PDF failure')
      },
    }

    const result = await extractGamesWorkshopBattleProfiles(new Uint8Array([1]), 'd'.repeat(64), loader)

    expect(result.facts).toEqual([])
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'pdf-extraction-error',
        severity: 'error',
        message: expect.stringContaining('synthetic PDF failure'),
      })
    )
  })
})
