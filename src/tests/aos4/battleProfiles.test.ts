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
  item('Primal Energy', 40, 700),
  item('20', 280, 700),
  item('One manifestation lore', 320, 700),
]

const regimentPage = (): PdfTextItem[] => [
  item('Saviours of Cinderfall', 40, 700),
  item('Callis, Toll and companions', 130, 700),
  item('310', 250, 700),
  item('Order armies only', 320, 700),
]

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
