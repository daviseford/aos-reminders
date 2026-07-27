import type {
  GamesWorkshopCandidateFact,
  GamesWorkshopDiagnostic,
  GamesWorkshopFactExtractionResult,
  GamesWorkshopPdfDocument,
} from './records'

export interface GamesWorkshopFactMatch {
  entityName: string
  value: string
}

export interface GamesWorkshopFactExtractor {
  id: string
  entityKind: string
  field: string
  pattern: RegExp
  mapMatch(match: RegExpExecArray): GamesWorkshopFactMatch | undefined
}

interface LocatedMatch extends GamesWorkshopFactMatch {
  page: number
}

const matchesForPage = (
  text: string,
  page: number,
  extractor: GamesWorkshopFactExtractor
): LocatedMatch[] => {
  const flags = extractor.pattern.flags.includes('g')
    ? extractor.pattern.flags
    : `${extractor.pattern.flags}g`
  const pattern = new RegExp(extractor.pattern.source, flags)
  const matches: LocatedMatch[] = []
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    const mapped = extractor.mapMatch(match)
    if (mapped?.entityName.trim() && mapped.value.trim()) {
      matches.push({
        entityName: mapped.entityName.trim(),
        value: mapped.value.trim(),
        page,
      })
    }
    if (match[0] === '') pattern.lastIndex += 1
  }
  return matches
}

const factKey = (match: GamesWorkshopFactMatch): string =>
  `${match.entityName.toLocaleLowerCase('en')}:${match.value.toLocaleLowerCase('en')}`

export const extractGamesWorkshopFacts = (
  document: GamesWorkshopPdfDocument,
  extractors: GamesWorkshopFactExtractor[]
): GamesWorkshopFactExtractionResult => {
  const facts: GamesWorkshopCandidateFact[] = []
  const diagnostics: GamesWorkshopDiagnostic[] = []

  extractors.forEach(extractor => {
    const matches = document.pages.flatMap(page => matchesForPage(page.text, page.page, extractor))
    if (!matches.length) {
      diagnostics.push({
        code: 'fact-not-found',
        severity: 'warning',
        message: `Extractor ${extractor.id} found no ${extractor.field} fact`,
        field: extractor.field,
      })
      return
    }

    const distinct = new Map<string, LocatedMatch>()
    matches.forEach(match => {
      if (!distinct.has(factKey(match))) distinct.set(factKey(match), match)
    })
    const names = new Set(matches.map(match => match.entityName.toLocaleLowerCase('en')))
    const values = new Set(matches.map(match => match.value.toLocaleLowerCase('en')))
    if (names.size === 1 && values.size > 1) {
      diagnostics.push({
        code: 'fact-conflict',
        severity: 'error',
        message: `Extractor ${extractor.id} found conflicting ${extractor.field} values`,
        field: extractor.field,
      })
      return
    }
    if (matches.length > distinct.size || (names.size === 1 && matches.length > 1)) {
      diagnostics.push({
        code: 'ambiguous-layout',
        severity: 'warning',
        message: `Extractor ${extractor.id} matched repeated document text; retained unique facts`,
        field: extractor.field,
      })
    }

    distinct.forEach(match => {
      const sourceRecord = document.sourceRecords.find(
        record => record.locator.kind === 'page' && record.locator.page === match.page
      )
      if (!sourceRecord) {
        diagnostics.push({
          code: 'pdf-extraction-error',
          severity: 'error',
          message: `PDF page ${match.page} has no source record`,
          page: match.page,
          field: extractor.field,
        })
        return
      }
      facts.push({
        extractorId: extractor.id,
        entityKind: extractor.entityKind,
        entityName: match.entityName,
        field: extractor.field,
        value: match.value,
        location: {
          artifactId: document.artifactId,
          sourceRecordId: sourceRecord.id,
          page: match.page,
        },
      })
    })
  })

  facts.sort(
    (left, right) =>
      left.entityKind.localeCompare(right.entityKind) ||
      left.entityName.localeCompare(right.entityName) ||
      left.field.localeCompare(right.field) ||
      left.value.localeCompare(right.value) ||
      left.location.page - right.location.page
  )
  diagnostics.sort(
    (left, right) =>
      (left.field ?? '').localeCompare(right.field ?? '') ||
      left.code.localeCompare(right.code) ||
      left.message.localeCompare(right.message)
  )
  return { facts, diagnostics }
}
