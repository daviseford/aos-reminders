import { createHash } from 'node:crypto'
import pdfjsLib from 'pdfjs-dist'
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
}

export interface PdfPageHandle {
  getTextItems(): Promise<PdfTextItem[]>
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
  items: Array<{ str?: unknown; hasEOL?: unknown }>
}

interface PdfJsPage {
  getTextContent(options: { normalizeWhitespace: boolean }): Promise<PdfJsTextContent>
}

interface PdfJsDocument {
  numPages: number
  getPage(page: number): Promise<PdfJsPage>
  destroy(): Promise<void>
}

interface PdfJsLoadingTask {
  promise: Promise<PdfJsDocument>
}

export const createPdfJsDocumentLoader = (): PdfDocumentLoader => ({
  async load(bytes) {
    const library = pdfjsLib as unknown as {
      getDocument(options: {
        data: Uint8Array
        disableWorker: boolean
        isEvalSupported: boolean
      }): PdfJsLoadingTask
    }
    const document = await library.getDocument({
      data: bytes,
      disableWorker: true,
      isEvalSupported: false,
    }).promise

    return {
      numPages: document.numPages,
      async getPage(pageNumber) {
        const page = await document.getPage(pageNumber)
        return {
          async getTextItems() {
            const content = await page.getTextContent({ normalizeWhitespace: true })
            return content.items.flatMap(item =>
              typeof item.str === 'string' ? [{ str: item.str, hasEOL: item.hasEOL === true }] : []
            )
          },
        }
      },
      destroy: () => document.destroy(),
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
