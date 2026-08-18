import path from 'node:path'

/**
 * The accepted corpus revision's dated artifact paths, declared once. Every acceptance cycle
 * re-points these constants; command defaults import them so a cycle can no longer leave one
 * CLI silently reading a superseded manifest/review/report pair.
 */
export const ACCEPTED_MANIFEST_PATH = path.join('data', 'aos4', 'manifests', 'accepted-2026-08-18.json')
export const ACCEPTED_REVIEW_PATH = path.join('data', 'aos4', 'reviews', 'corpus-2026-08-18.json')
export const ACCEPTED_SUMMARY_REPORT_PATH = path.join(
  'data',
  'aos4',
  'reports',
  'corpus-2026-08-18-summary.json'
)
export const ACCEPTED_RECONCILIATION_REPORT_PATH = path.join(
  'data',
  'aos4',
  'reports',
  'corpus-2026-08-18-reconciliation.json'
)

/**
 * Forward-slash form of the reconciliation-report path for values embedded in generated packet
 * records, which must stay byte-identical across platforms.
 */
export const ACCEPTED_RECONCILIATION_REPORT_DESTINATION =
  'data/aos4/reports/corpus-2026-08-18-reconciliation.json'
