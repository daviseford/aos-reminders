import type {
  LinkedCandidateFact,
  OverrideValidationResult,
  ReconciliationDiagnostic,
  ReviewedOverride,
} from './records'

const ISO_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/

const compareOverrides = (left: ReviewedOverride, right: ReviewedOverride): number =>
  left.entityId.localeCompare(right.entityId) ||
  left.field.localeCompare(right.field) ||
  left.reviewedAt.localeCompare(right.reviewedAt) ||
  left.id.localeCompare(right.id)

export const validateReviewedOverrides = (
  overrides: ReviewedOverride[],
  facts: LinkedCandidateFact[]
): OverrideValidationResult => {
  const valid: ReviewedOverride[] = []
  const diagnostics: ReconciliationDiagnostic[] = []
  const factSources = new Set(facts.map(fact => fact.sourceRecordId))
  const seenIds = new Set<string>()

  ;[...overrides].sort(compareOverrides).forEach(override => {
    const errors: ReconciliationDiagnostic[] = []
    if (!override.id.trim() || seenIds.has(override.id)) {
      errors.push({
        code: 'invalid-override-id',
        severity: 'error',
        message: `Reviewed override ID ${override.id || '(missing)'} is missing or duplicated`,
        overrideIds: [override.id],
      })
    }
    seenIds.add(override.id)
    if (!override.reason.trim()) {
      errors.push({
        code: 'invalid-override-reason',
        severity: 'error',
        message: `Reviewed override ${override.id} requires a reason`,
        overrideIds: [override.id],
      })
    }
    if (!override.author.trim()) {
      errors.push({
        code: 'invalid-override-author',
        severity: 'error',
        message: `Reviewed override ${override.id} requires an author`,
        overrideIds: [override.id],
      })
    }
    if (!ISO_INSTANT.test(override.reviewedAt) || Number.isNaN(new Date(override.reviewedAt).valueOf())) {
      errors.push({
        code: 'invalid-override-date',
        severity: 'error',
        message: `Reviewed override ${override.id} requires an ISO UTC review timestamp`,
        overrideIds: [override.id],
      })
    }
    if (!override.sourceRecordIds.length || override.sourceRecordIds.some(id => !factSources.has(id))) {
      errors.push({
        code: 'invalid-override-sources',
        severity: 'error',
        message: `Reviewed override ${override.id} must reference known source records`,
        overrideIds: [override.id],
      })
    }
    if (!override.rulesContextIds.length) {
      errors.push({
        code: 'invalid-override-context',
        severity: 'error',
        message: `Reviewed override ${override.id} must declare at least one rules context`,
        overrideIds: [override.id],
      })
    }

    if (errors.length) {
      diagnostics.push(...errors)
    } else {
      valid.push(override)
    }
  })

  return { valid, diagnostics }
}
