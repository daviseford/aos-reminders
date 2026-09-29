import { createHash } from 'node:crypto'
import { getDocument, OPS } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { artifactId, sourceRecordId, type RulesContextId, type SourceRecord } from '../../domain'
import type {
  GamesWorkshopDiagnostic,
  GamesWorkshopPdfDocument,
  GamesWorkshopPdfExtractionResult,
  GamesWorkshopPdfInput,
  GamesWorkshopPdfPage,
} from './records'

export interface PdfTextItem {
  str: string
  hasEOL?: boolean
  x?: number
  y?: number
  width?: number
  height?: number
}

/**
 * A stroked, perfectly horizontal line segment in page space. Games Workshop marks removed text
 * (a struck battle-profile note, a `DELETED` row or erratum) with a thin rule drawn through the
 * text's midline; pdf.js reports it as a path, never as a text-content attribute, so the text
 * alone reads struck words as live.
 */
export interface PdfHorizontalRule {
  x1: number
  x2: number
  y: number
  lineWidth: number
}

export interface PdfPageHandle {
  getTextItems(): Promise<PdfTextItem[]>
  /** Stroked horizontal segments, for strikethrough detection. A loader may omit it (no rules). */
  getHorizontalRules?(): Promise<PdfHorizontalRule[]>
}

export interface PdfDocumentHandle {
  numPages: number
  getPage(page: number): Promise<PdfPageHandle>
  destroy(): Promise<void>
}

export interface PdfDocumentLoader {
  load(bytes: Uint8Array): Promise<PdfDocumentHandle>
}

interface PdfJsTextContent {
  items: Array<{
    str?: unknown
    hasEOL?: unknown
    transform?: unknown
    width?: unknown
    height?: unknown
  }>
}

interface PdfJsPage {
  getTextContent(options: { normalizeWhitespace: boolean }): Promise<PdfJsTextContent>
  getOperatorList(): Promise<{ fnArray: number[]; argsArray: unknown[] }>
}

interface PdfJsDocument {
  numPages: number
  getPage(page: number): Promise<PdfJsPage>
}

interface PdfJsLoadingTask {
  promise: Promise<PdfJsDocument>
  destroy(): Promise<void>
}

type Matrix = [number, number, number, number, number, number]

const multiply = (m: Matrix, n: Matrix): Matrix => [
  m[0] * n[0] + m[1] * n[2],
  m[0] * n[1] + m[1] * n[3],
  m[2] * n[0] + m[3] * n[2],
  m[2] * n[1] + m[3] * n[3],
  m[4] * n[0] + m[5] * n[2] + n[4],
  m[4] * n[1] + m[5] * n[3] + n[5],
]

const isMatrix = (value: unknown): value is Matrix =>
  (Array.isArray(value) || ArrayBuffer.isView(value)) &&
  (value as ArrayLike<unknown>).length === 6 &&
  Array.from(value as ArrayLike<unknown>).every(entry => typeof entry === 'number')

/**
 * Collects every stroked single-segment horizontal path on a page, tracking the transformation
 * matrix through `save`/`restore`, `transform`, and form XObjects. pdf.js 6 batches a path into
 * one `constructPath` operation whose arguments are the painting operator and a flat draw-op
 * array (`0 x y` moveTo, `1 x y` lineTo); a strikethrough is exactly one moveTo and one lineTo.
 */
export const horizontalRulesFromOperatorList = (operatorList: {
  fnArray: ArrayLike<number>
  argsArray: ArrayLike<unknown>
}): PdfHorizontalRule[] => {
  const rules: PdfHorizontalRule[] = []
  let state = { matrix: [1, 0, 0, 1, 0, 0] as Matrix, lineWidth: 1 }
  const stack: (typeof state)[] = []
  for (let index = 0; index < operatorList.fnArray.length; index += 1) {
    const operator = operatorList.fnArray[index]
    const args = operatorList.argsArray[index] as unknown[] | null
    if (operator === OPS.save) {
      stack.push(state)
    } else if (operator === OPS.restore || operator === OPS.paintFormXObjectEnd) {
      state = stack.pop() ?? state
    } else if (operator === OPS.paintFormXObjectBegin) {
      stack.push(state)
      if (args && isMatrix(args[0]))
        state = { ...state, matrix: multiply(Array.from(args[0]) as Matrix, state.matrix) }
    } else if (operator === OPS.transform && args && args.length === 6 && isMatrix(args)) {
      state = { ...state, matrix: multiply(Array.from(args) as Matrix, state.matrix) }
    } else if (operator === OPS.setLineWidth && args && typeof args[0] === 'number') {
      state = { ...state, lineWidth: args[0] }
    } else if (operator === OPS.constructPath && args && args[0] === OPS.stroke) {
      const data = Array.isArray(args[1]) ? (args[1][0] as ArrayLike<number> | null | undefined) : undefined
      if (!data || data.length !== 6 || data[0] !== 0 || data[3] !== 1) continue
      const [a, b, c, d, e, f] = state.matrix
      const start = { x: a * data[1] + c * data[2] + e, y: b * data[1] + d * data[2] + f }
      const end = { x: a * data[4] + c * data[5] + e, y: b * data[4] + d * data[5] + f }
      if (Math.abs(start.y - end.y) > 0.01 || Math.abs(start.x - end.x) < 1) continue
      rules.push({
        x1: Math.min(start.x, end.x),
        x2: Math.max(start.x, end.x),
        y: start.y,
        lineWidth: state.lineWidth * Math.sqrt(Math.abs(a * d - b * c)),
      })
    }
  }
  return rules
}

/**
 * The text items a strikethrough rule crosses. A rule strikes an item when it runs through the
 * item's midline band (20-60% of the glyph height above the baseline) and covers at least 90% of
 * its width; the rule itself must be thin and no longer than the items it strikes, which keeps
 * table borders and decorative bars (thicker, or spanning whole cells) from reading as strikes.
 */
export const struckTextItems = <TItem extends PdfTextItem>(
  items: TItem[],
  rules: PdfHorizontalRule[]
): Set<TItem> => {
  const struck = new Set<TItem>()
  rules
    .filter(rule => rule.lineWidth <= 1)
    .forEach(rule => {
      const hits = items.filter(item => {
        if (
          typeof item.x !== 'number' ||
          typeof item.y !== 'number' ||
          !item.width ||
          !item.height ||
          !item.str.trim()
        ) {
          return false
        }
        const covered = Math.min(rule.x2, item.x + item.width) - Math.max(rule.x1, item.x)
        return (
          rule.y > item.y + item.height * 0.2 &&
          rule.y < item.y + item.height * 0.6 &&
          covered >= item.width * 0.9
        )
      })
      if (!hits.length) return
      const left = Math.min(...hits.map(item => item.x!))
      const right = Math.max(...hits.map(item => item.x! + item.width!))
      if (right - left < (rule.x2 - rule.x1) * 0.9) return
      hits.forEach(item => struck.add(item))
    })
  return struck
}

export const createPdfJsDocumentLoader = (): PdfDocumentLoader => ({
  async load(bytes) {
    // pdfjs-dist 6 runs the worker inline in Node (fake worker); `disableWorker` no longer exists,
    // and `destroy()` moved from the document to the loading task. It also rejects Node Buffers
    // outright, and the artifact cache hands out `readFile` Buffers, so copy into a plain
    // Uint8Array here — the copy also keeps pdf.js from ever touching cached bytes.
    const loadingTask = (
      getDocument as unknown as (options: { data: Uint8Array; isEvalSupported: boolean }) => PdfJsLoadingTask
    )({
      data: new Uint8Array(bytes),
      isEvalSupported: false,
    })
    const document = await loadingTask.promise

    return {
      numPages: document.numPages,
      async getPage(pageNumber) {
        const page = await document.getPage(pageNumber)
        return {
          async getTextItems() {
            const content = await page.getTextContent({ normalizeWhitespace: true })
            return content.items.flatMap(item => {
              if (typeof item.str !== 'string') return []
              const transform =
                Array.isArray(item.transform) &&
                item.transform.length >= 6 &&
                item.transform.every(value => typeof value === 'number')
                  ? item.transform
                  : undefined
              return [
                {
                  str: item.str,
                  hasEOL: item.hasEOL === true,
                  ...(transform ? { x: transform[4], y: transform[5] } : {}),
                  ...(typeof item.width === 'number' ? { width: item.width } : {}),
                  ...(typeof item.height === 'number' ? { height: item.height } : {}),
                },
              ]
            })
          },
          async getHorizontalRules() {
            return horizontalRulesFromOperatorList(await page.getOperatorList())
          },
        }
      },
      destroy: () => loadingTask.destroy(),
    }
  },
})

export interface PdfTextExtractionOptions {
  maxPages?: number
  maxTextBytes?: number
  timeoutMs?: number
  rulesContextIds?: RulesContextId[]
  loader?: PdfDocumentLoader
}

const normalizedPageText = (items: PdfTextItem[]): string =>
  items
    .map(item => `${item.str}${item.hasEOL ? '\n' : ' '}`)
    .join('')
    .replace(/\u00a0/g, ' ')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

const textChecksum = (text: string): string => createHash('sha256').update(text, 'utf8').digest('hex')

const diagnosticForPdfError = (error: unknown, url: string): GamesWorkshopDiagnostic => {
  const name =
    typeof error === 'object' && error !== null && 'name' in error
      ? String((error as { name: unknown }).name)
      : ''
  const message = error instanceof Error ? error.message : String(error)
  if (name === 'PasswordException' || /password|encrypted/i.test(message)) {
    return {
      code: 'pdf-encrypted',
      severity: 'error',
      message: 'Games Workshop PDF is encrypted and cannot be inspected',
      url,
    }
  }
  return {
    code: 'pdf-extraction-error',
    severity: 'error',
    message: `Games Workshop PDF extraction failed: ${message}`,
    url,
  }
}

const extract = async (
  input: GamesWorkshopPdfInput,
  options: Required<Pick<PdfTextExtractionOptions, 'maxPages' | 'maxTextBytes' | 'rulesContextIds'>> & {
    loader: PdfDocumentLoader
  }
): Promise<GamesWorkshopPdfExtractionResult> => {
  let document: PdfDocumentHandle | undefined
  try {
    document = await options.loader.load(input.bytes)
    if (document.numPages > options.maxPages) {
      return {
        diagnostics: [
          {
            code: 'pdf-page-limit',
            severity: 'error',
            message: `Games Workshop PDF has ${document.numPages} pages; limit is ${options.maxPages}`,
            url: input.download.url,
          },
        ],
      }
    }

    const pages: GamesWorkshopPdfPage[] = []
    let textBytes = 0
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber)
      const text = normalizedPageText(await page.getTextItems())
      textBytes += new TextEncoder().encode(text).byteLength
      if (textBytes > options.maxTextBytes) {
        return {
          diagnostics: [
            {
              code: 'pdf-text-byte-limit',
              severity: 'error',
              message: `Games Workshop PDF text exceeded the ${options.maxTextBytes}-byte limit`,
              url: input.download.url,
              page: pageNumber,
            },
          ],
        }
      }
      pages.push({ page: pageNumber, text })
    }

    if (!pages.some(page => page.text)) {
      return {
        diagnostics: [
          {
            code: 'pdf-image-only',
            severity: 'error',
            message: 'Games Workshop PDF contains no extractable text',
            url: input.download.url,
          },
        ],
      }
    }

    const id = artifactId(input.artifact.checksum)
    const sourceRecords: SourceRecord[] = pages.map(page => ({
      id: sourceRecordId('games-workshop', `${input.artifact.checksum}:page:${page.page}`),
      artifactId: id,
      locator: { kind: 'page', page: page.page },
      recordChecksum: textChecksum(page.text),
      rulesContextIds: [...options.rulesContextIds],
    }))
    const result: GamesWorkshopPdfDocument = {
      artifactId: id,
      download: input.download,
      pages,
      sourceRecords,
    }
    return { document: result, diagnostics: [] }
  } catch (error) {
    return {
      diagnostics: [diagnosticForPdfError(error, input.download.url)],
    }
  } finally {
    if (document) {
      try {
        await document.destroy()
      } catch {
        // Extraction output and its primary diagnostic remain more useful than a
        // cleanup failure from the PDF runtime.
      }
    }
  }
}

export const extractGamesWorkshopPdfText = async (
  input: GamesWorkshopPdfInput,
  options: PdfTextExtractionOptions = {}
): Promise<GamesWorkshopPdfExtractionResult> => {
  const timeoutMs = options.timeoutMs ?? 20_000
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<GamesWorkshopPdfExtractionResult>(resolve => {
    timer = setTimeout(
      () =>
        resolve({
          diagnostics: [
            {
              code: 'pdf-timeout',
              severity: 'error',
              message: `Games Workshop PDF extraction exceeded ${timeoutMs}ms`,
              url: input.download.url,
            },
          ],
        }),
      timeoutMs
    )
  })

  try {
    return await Promise.race([
      extract(input, {
        loader: options.loader ?? createPdfJsDocumentLoader(),
        maxPages: options.maxPages ?? 200,
        maxTextBytes: options.maxTextBytes ?? 8 * 1024 * 1024,
        rulesContextIds: options.rulesContextIds ?? [],
      }),
      timeout,
    ])
  } finally {
    if (timer) clearTimeout(timer)
  }
}
