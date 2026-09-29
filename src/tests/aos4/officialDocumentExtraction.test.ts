import { readFile } from 'node:fs/promises'
import path from 'node:path'
import {
  artifactChecksum,
  createGamesWorkshopSourceArtifact,
  extractGamesWorkshopFacts,
  extractGamesWorkshopPdfText,
  horizontalRulesFromOperatorList,
  struckTextItems,
  type ArtifactManifestEntry,
  type GamesWorkshopDownload,
  type PdfDocumentLoader,
  type PdfTextItem,
} from '../../aos4/data'
import { rulesContextId } from '../../aos4/domain'
import { OPS } from 'pdfjs-dist/legacy/build/pdf.mjs'

const download: GamesWorkshopDownload = {
  externalId: 'synthetic-official-document',
  title: 'Synthetic Official Document',
  url: 'https://assets.warhammer-community.com/aos4/synthetic.pdf',
  categories: ['core-rules-and-key-downloads'],
  gameSystems: ['warhammer-age-of-sigmar'],
  topics: [],
  discoveryMethod: 'private-api',
}

const input = (bytes: Uint8Array) => {
  const checksum = artifactChecksum(bytes)
  const artifact: ArtifactManifestEntry = {
    requestUrl: download.url,
    finalUrl: download.url,
    redirectChain: [],
    retrievedAt: '2026-07-27T12:00:00.000Z',
    adapterVersion: 'games-workshop-pdf/1',
    mediaType: 'application/pdf',
    byteLength: bytes.byteLength,
    checksum,
  }
  return { bytes, artifact, download }
}

const fakeLoader = (pages: PdfTextItem[][], declaredPages = pages.length): PdfDocumentLoader => ({
  async load() {
    return {
      numPages: declaredPages,
      async getPage(page) {
        return {
          async getTextItems() {
            return pages[page - 1] ?? []
          },
        }
      },
      async destroy() {
        return undefined
      },
    }
  },
})

describe('Games Workshop official PDF extraction', () => {
  it('extracts page-addressed text from a small born-digital PDF', async () => {
    const encoded = await readFile(
      path.join(
        process.cwd(),
        'src',
        'tests',
        'fixtures',
        'aos4',
        'games-workshop',
        'official-text.pdf.base64'
      ),
      'utf8'
    )
    const bytes = new Uint8Array(Buffer.from(encoded.trim(), 'base64'))

    const result = await extractGamesWorkshopPdfText(input(bytes))

    expect(result.diagnostics).toEqual([])
    expect(result.document?.pages).toHaveLength(1)
    expect(result.document?.pages[0].text).toContain('Synthetic Core Rule')
    expect(result.document?.pages[0].text).toContain('MOVE 5 inches')
  })

  it('creates stable page source records with explicit context', async () => {
    const context = rulesContextId('10000000-0000-4000-8000-000000000001')
    const source = input(new Uint8Array([1, 2, 3]))
    const first = await extractGamesWorkshopPdfText(source, {
      loader: fakeLoader([[{ str: 'Page one' }], [{ str: 'Page two' }]]),
      rulesContextIds: [context],
    })
    const second = await extractGamesWorkshopPdfText(source, {
      loader: fakeLoader([[{ str: 'Page one' }], [{ str: 'Page two' }]]),
      rulesContextIds: [context],
    })

    expect(first.document?.sourceRecords).toEqual(second.document?.sourceRecords)
    expect(first.document?.sourceRecords).toEqual([
      expect.objectContaining({
        locator: { kind: 'page', page: 1 },
        rulesContextIds: [context],
      }),
      expect.objectContaining({
        locator: { kind: 'page', page: 2 },
        rulesContextIds: [context],
      }),
    ])
    expect(createGamesWorkshopSourceArtifact(source)).toMatchObject({
      publisher: 'games-workshop',
      authority: { kind: 'official' },
      title: 'Synthetic Official Document',
      edition: '4',
      checksum: source.artifact.checksum,
    })
  })

  it('refuses partial extraction when the document exceeds its page limit', async () => {
    const result = await extractGamesWorkshopPdfText(input(new Uint8Array([1])), {
      loader: fakeLoader([], 201),
      maxPages: 200,
    })

    expect(result.document).toBeUndefined()
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'pdf-page-limit', severity: 'error' })
    )
  })

  it('refuses partial extraction when decoded text exceeds its byte limit', async () => {
    const result = await extractGamesWorkshopPdfText(input(new Uint8Array([1])), {
      loader: fakeLoader([[{ str: 'too much text' }]]),
      maxTextBytes: 4,
    })

    expect(result.document).toBeUndefined()
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'pdf-text-byte-limit', page: 1 })
    )
  })

  it('diagnoses image-only documents instead of treating them as empty rules', async () => {
    const result = await extractGamesWorkshopPdfText(input(new Uint8Array([1])), {
      loader: fakeLoader([[], []]),
    })

    expect(result.document).toBeUndefined()
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'pdf-image-only', severity: 'error' })
    )
  })

  it('classifies encrypted document failures', async () => {
    const loader: PdfDocumentLoader = {
      async load() {
        const error = new Error('A password is required')
        error.name = 'PasswordException'
        throw error
      },
    }

    const result = await extractGamesWorkshopPdfText(input(new Uint8Array([1])), { loader })

    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'pdf-encrypted', severity: 'error' })
    )
  })

  it('bounds extraction execution time', async () => {
    const loader: PdfDocumentLoader = {
      load: () => new Promise(() => undefined),
    }

    const result = await extractGamesWorkshopPdfText(input(new Uint8Array([1])), {
      loader,
      timeoutMs: 5,
    })

    expect(result.document).toBeUndefined()
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'pdf-timeout', severity: 'error' })
    )
  })

  it('extracts configured facts with exact page provenance', async () => {
    const extracted = await extractGamesWorkshopPdfText(input(new Uint8Array([1])), {
      loader: fakeLoader([
        [
          {
            str: 'Warscroll: Example Guard MOVE 5" SAVE 3+ CONTROL 1 HEALTH 2',
          },
        ],
      ]),
    })
    const result = extractGamesWorkshopFacts(extracted.document!, [
      {
        id: 'synthetic-warscroll-move',
        entityKind: 'warscroll',
        field: 'move',
        pattern: /Warscroll:\s+(.+?)\s+MOVE\s+(\d+")/i,
        mapMatch: match => ({ entityName: match[1], value: match[2] }),
      },
    ])

    expect(result.diagnostics).toEqual([])
    expect(result.facts).toEqual([
      expect.objectContaining({
        extractorId: 'synthetic-warscroll-move',
        entityKind: 'warscroll',
        entityName: 'Example Guard',
        field: 'move',
        value: '5"',
        location: expect.objectContaining({ page: 1 }),
      }),
    ])
  })

  it('leaves conflicting official layout matches unresolved', async () => {
    const extracted = await extractGamesWorkshopPdfText(input(new Uint8Array([1])), {
      loader: fakeLoader([[{ str: 'Example Guard MOVE 5"' }], [{ str: 'Example Guard MOVE 6"' }]]),
    })
    const result = extractGamesWorkshopFacts(extracted.document!, [
      {
        id: 'conflicting-move',
        entityKind: 'warscroll',
        field: 'move',
        pattern: /(Example Guard)\s+MOVE\s+(\d+")/i,
        mapMatch: match => ({ entityName: match[1], value: match[2] }),
      },
    ])

    expect(result.facts).toEqual([])
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'fact-conflict', severity: 'error' })
    )
  })

  it('diagnoses missing configured facts', async () => {
    const extracted = await extractGamesWorkshopPdfText(input(new Uint8Array([1])), {
      loader: fakeLoader([[{ str: 'No unit profile here' }]]),
    })
    const result = extractGamesWorkshopFacts(extracted.document!, [
      {
        id: 'missing-save',
        entityKind: 'warscroll',
        field: 'save',
        pattern: /SAVE\s+(\d\+)/i,
        mapMatch: match => ({ entityName: 'Example Guard', value: match[1] }),
      },
    ])

    expect(result.facts).toEqual([])
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'fact-not-found', severity: 'warning' })
    )
  })
})

describe('official PDF strikethrough detection (#1757)', () => {
  it('reads stroked horizontal segments in page space through save, transform, and form XObjects', () => {
    const operators: Array<[number, unknown]> = [
      [
        OPS.paintFormXObjectBegin,
        [
          [1, 0, 0, 1, 0, 10],
          [0, 0, 595, 842],
        ],
      ],
      [OPS.setLineWidth, [0.4]],
      [OPS.save, null],
      [OPS.transform, [1, 0, 0, 1, 401.6693, 318.4276]],
      // The September 2026 Battle Profiles strikes a note with exactly this path.
      [OPS.constructPath, [OPS.stroke, [new Float32Array([0, 0, 0, 1, 101.5, 0])], null]],
      [OPS.restore, null],
      // Filled table cells, closed rectangles, and vertical rules are not strikethrough.
      [OPS.constructPath, [OPS.fill, [new Float32Array([0, 34, 489, 1, 561, 489])], null]],
      [OPS.constructPath, [OPS.stroke, [new Float32Array([0, 34, 489, 1, 561, 489, 1, 561, 677, 4])], null]],
      [OPS.constructPath, [OPS.stroke, [new Float32Array([0, 100, 100, 1, 100, 200])], null]],
      [OPS.paintFormXObjectEnd, []],
      [OPS.constructPath, [OPS.stroke, [new Float32Array([0, 10, 20, 1, 30, 20])], null]],
    ]
    const rules = horizontalRulesFromOperatorList({
      fnArray: operators.map(([operator]) => operator),
      argsArray: operators.map(([, args]) => args),
    })

    expect(rules).toHaveLength(2)
    expect(rules[0].x1).toBeCloseTo(401.6693, 3)
    expect(rules[0].x2).toBeCloseTo(503.1693, 3)
    expect(rules[0].y).toBeCloseTo(328.4276, 3)
    expect(rules[0].lineWidth).toBeCloseTo(0.4, 5)
    // Restoring past the form XObject drops its matrix and line width again.
    expect(rules[1]).toEqual({ x1: 10, x2: 30, y: 20, lineWidth: 1 })
  })

  it('strikes only the text a thin midline rule covers', () => {
    const note = { str: 'This unit cannot be reinforced.', x: 401.7, y: 315.8, width: 101.5, height: 8 }
    const neighbour = { str: '40mm [1],', x: 516, y: 315.8, width: 40, height: 8 }
    const spawning = [
      { str: 'regiment as a', x: 401.1, y: 355.6, width: 43.5, height: 8 },
      { str: 'Favoured', x: 446.4, y: 355.6, width: 30.3, height: 8 },
    ]
    const items = [note, neighbour, ...spawning]
    const struck = (rule: { x1: number; x2: number; y: number; lineWidth: number }) =>
      Array.from(struckTextItems(items, [rule])).map(item => item.str)

    expect(struck({ x1: 401.7, x2: 503.2, y: 318.4, lineWidth: 0.4 })).toEqual([note.str])
    // One rule may strike several items on a line.
    expect(struck({ x1: 401.1, x2: 478.5, y: 358.3, lineWidth: 0.4 })).toEqual(['regiment as a', 'Favoured'])
    // A thick bar, a table rule spanning the whole row, an underline, and a rule over part of an
    // item are not strikethrough.
    expect(struck({ x1: 401.7, x2: 503.2, y: 318.4, lineWidth: 11 })).toEqual([])
    expect(struck({ x1: 34, x2: 561, y: 318.4, lineWidth: 0.5 })).toEqual([])
    expect(struck({ x1: 401.7, x2: 503.2, y: 315.3, lineWidth: 0.4 })).toEqual([])
    expect(struck({ x1: 401.7, x2: 450, y: 318.4, lineWidth: 0.4 })).toEqual([])
  })
})
