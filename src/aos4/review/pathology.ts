import type { Aos4Catalog, SourceLocator, SourceRecordId } from '../domain'
import goldenTruthCases from './goldenTruth.json'

export type PathologySeverity = 'error' | 'review'

export type PathologyCode =
  | 'replacement-character'
  | 'control-character'
  | 'malformed-measurement-token'
  | 'invalid-base-size'
  | 'suspicious-measurement-layout'
  | 'invalid-warscroll-characteristic'
  | 'invalid-weapon-characteristic'
  | 'suspicious-weapon-characteristic'
  | 'missing-required-text'
  | 'unresolved-placeholder'
  | 'suspicious-single-letter-token-run'

export interface PathologyIssue {
  code: PathologyCode
  severity: PathologySeverity
  subject: string
  path: string
  message: string
  value?: string
}

export interface GoldenTruthCase {
  id: string
  sourceRecordId: SourceRecordId
  locator: SourceLocator
  field: string
  observedValue: unknown
  expectedValue: unknown
  rationale: string
}

export const AOS4_GOLDEN_TRUTH_CASES = goldenTruthCases as GoldenTruthCase[]

const MALFORMED_MEASUREMENT = /\b(?:\d(?:\s+\d)+\s*m\s*m|\d+(?:\.\d+)?\s*m\s+m)\b/i
const UNRESOLVED_PLACEHOLDER = /\{\{[^{}]+\}\}|\$\{[^{}]+\}|\b(?:TODO|TBD)\b|<\s*unknown\s*>/i
const SINGLE_LETTER_TOKEN_RUN = /(?:^|\s)(?:[A-Za-z]\s+){3,}[A-Za-z](?=\s|$)/
const BASE_COMPONENT = /\d+(?:\.\d+)?(?:\s*[×x]\s*\d+(?:\.\d+)?)?mm(?:\s*\[\d+\])?/gi
const ATTACK_OR_DAMAGE = /^(?:\d+|\d*D(?:3|6)(?:\+\d+)?)$/i
const DAMAGE = /^(?:\d+|\d*D(?:3|6)(?:\+\d+)?|See below)$/i
const HIT_OR_WOUND = /^(?:[2-6]\+|See below)$/i
const REND = /^(?:-|\d+|See below)$/i
const MOVE = /^(?:-|\d*D6(?:\+\d+)?"|\d+")$/i
const SAVE = /^(?:-|[2-6]\+)$/
const CONTROL = /^(?:-|\d+\+?)$/
const HEALTH = /^(?:\*|\d+)$/

const issue = (
  code: PathologyCode,
  severity: PathologySeverity,
  subject: string,
  path: string,
  message: string,
  value?: string
): PathologyIssue => ({
  code,
  severity,
  subject,
  path,
  message,
  ...(value === undefined ? {} : { value }),
})

const compareText = (left: string, right: string): number => (left < right ? -1 : left > right ? 1 : 0)

const compareIssues = (left: PathologyIssue, right: PathologyIssue): number =>
  compareText(`${left.subject}|${left.path}|${left.code}`, `${right.subject}|${right.path}|${right.code}`) ||
  compareText(left.message, right.message)

const hasForbiddenControlCharacter = (value: string): boolean =>
  Array.from(value).some(character => {
    const codePoint = character.codePointAt(0) ?? 0
    return (
      codePoint <= 0x08 ||
      codePoint === 0x0b ||
      codePoint === 0x0c ||
      (codePoint >= 0x0e && codePoint <= 0x1f) ||
      (codePoint >= 0x7f && codePoint <= 0x9f)
    )
  })

const uniqueIssues = (issues: PathologyIssue[]): PathologyIssue[] => {
  const byLocation = new Map<string, PathologyIssue>()
  issues.forEach(pathology => {
    byLocation.set(`${pathology.subject}|${pathology.path}|${pathology.code}`, pathology)
  })
  return Array.from(byLocation.values()).sort(compareIssues)
}

export const pathologyReviewCohorts = (issues: PathologyIssue[]): string[] => {
  const codes = Array.from(
    new Set(issues.filter(pathology => pathology.severity === 'review').map(pathology => pathology.code))
  ).sort(compareText)
  return codes.length ? ['high-risk:pathology', ...codes.map(code => `high-risk:pathology:${code}`)] : []
}

export const decodeUtf8Strict = (bytes: Uint8Array, label: string): string => {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    throw new Error(`${label} is not valid UTF-8`)
  }
}

export const inspectStructuredString = (value: string, path: string, subject = path): PathologyIssue[] => {
  const issues: PathologyIssue[] = []
  if (value.includes('\uFFFD')) {
    issues.push(
      issue(
        'replacement-character',
        'error',
        subject,
        path,
        'Structured text contains a Unicode replacement character',
        value
      )
    )
  }
  if (hasForbiddenControlCharacter(value)) {
    issues.push(
      issue(
        'control-character',
        'error',
        subject,
        path,
        'Structured text contains a forbidden control character',
        value
      )
    )
  }
  if (MALFORMED_MEASUREMENT.test(value)) {
    issues.push(
      issue(
        'malformed-measurement-token',
        'error',
        subject,
        path,
        'Measurement digits or unit letters are split into impossible tokens',
        value
      )
    )
  }
  if (UNRESOLVED_PLACEHOLDER.test(value)) {
    issues.push(
      issue(
        'unresolved-placeholder',
        'error',
        subject,
        path,
        'Generated text contains an unresolved placeholder',
        value
      )
    )
  }
  if (SINGLE_LETTER_TOKEN_RUN.test(value)) {
    issues.push(
      issue(
        'suspicious-single-letter-token-run',
        'review',
        subject,
        path,
        'Text contains a suspicious run of split single-letter tokens',
        value
      )
    )
  }
  return uniqueIssues(issues)
}

export const inspectStructuredPathologies = (
  value: unknown,
  subject: string,
  path = subject
): PathologyIssue[] => {
  if (typeof value === 'string') return inspectStructuredString(value, path, subject)
  if (Array.isArray(value)) {
    return value
      .flatMap((item, index) => inspectStructuredPathologies(item, subject, `${path}[${index}]`))
      .sort(compareIssues)
  }
  if (!value || typeof value !== 'object') return []
  return Object.entries(value)
    .flatMap(([key, item]) => inspectStructuredPathologies(item, subject, `${path}.${key}`))
    .sort(compareIssues)
}

const baseSizeIssues = (value: string, subject: string, path: string): PathologyIssue[] => {
  if (MALFORMED_MEASUREMENT.test(value)) {
    return [
      issue(
        'malformed-measurement-token',
        'error',
        subject,
        path,
        'Base size contains split measurement digits or unit letters',
        value
      ),
    ]
  }
  const components = value.match(BASE_COMPONENT) ?? []
  if (!components.length) {
    if (/^Use model$/i.test(value.trim())) {
      return [
        issue(
          'suspicious-measurement-layout',
          'review',
          subject,
          path,
          'Base size defers to the physical model instead of a structured measurement',
          value
        ),
      ]
    }
    return [
      issue(
        'invalid-base-size',
        'error',
        subject,
        path,
        'Base size does not contain a measurable base shape',
        value
      ),
    ]
  }
  const residual = value
    .replace(BASE_COMPONENT, ' ')
    .replace(/\b(?:or|and|champion is)\b|[.,;:()[\]]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const suspiciousLayout = residual || /^[\s.’'`-]/.test(value)
  return suspiciousLayout
    ? [
        issue(
          'suspicious-measurement-layout',
          'review',
          subject,
          path,
          'Base size contains layout text outside recognized base shapes',
          value
        ),
      ]
    : []
}

const characteristicIssue = (
  valid: boolean,
  subject: string,
  path: string,
  value: string,
  kind: 'warscroll' | 'weapon',
  severity: PathologySeverity
): PathologyIssue[] =>
  valid
    ? []
    : [
        issue(
          kind === 'warscroll'
            ? 'invalid-warscroll-characteristic'
            : severity === 'review'
              ? 'suspicious-weapon-characteristic'
              : 'invalid-weapon-characteristic',
          severity,
          subject,
          path,
          `${kind === 'warscroll' ? 'Warscroll' : 'Weapon'} characteristic has an unrecognized shape`,
          value
        ),
      ]

export const inspectCatalogPathologies = (catalog: Aos4Catalog): PathologyIssue[] => {
  const issues: PathologyIssue[] = []
  catalog.entities.forEach(entity => {
    const root = `entities.${entity.id}`
    issues.push(...inspectStructuredPathologies(entity, entity.id, root))
    if (!entity.name.trim()) {
      issues.push(
        issue('missing-required-text', 'error', entity.id, `${root}.name`, 'Generated entity name is empty')
      )
    }
    if (entity.kind === 'battle-profile') {
      entity.baseSizes.forEach((value, index) =>
        issues.push(...baseSizeIssues(value, entity.id, `${root}.baseSizes[${index}]`))
      )
    } else if (entity.kind === 'warscroll') {
      const values = entity.characteristics
      issues.push(
        ...characteristicIssue(
          MOVE.test(values.move),
          entity.id,
          `${root}.characteristics.move`,
          values.move,
          'warscroll',
          'error'
        ),
        ...characteristicIssue(
          SAVE.test(values.save),
          entity.id,
          `${root}.characteristics.save`,
          values.save,
          'warscroll',
          'error'
        ),
        ...characteristicIssue(
          CONTROL.test(values.control),
          entity.id,
          `${root}.characteristics.control`,
          values.control,
          'warscroll',
          'error'
        ),
        ...characteristicIssue(
          HEALTH.test(values.health),
          entity.id,
          `${root}.characteristics.health`,
          values.health,
          'warscroll',
          'error'
        )
      )
    } else if (entity.kind === 'weapon') {
      const profile = entity.profile
      const declaredMissing = new Set(profile.sourceIncompleteCharacteristics ?? [])
      const checks = [
        ['attacks', profile.attacks, ATTACK_OR_DAMAGE],
        ['hit', profile.hit, HIT_OR_WOUND],
        ['wound', profile.wound, HIT_OR_WOUND],
        ['rend', profile.rend, REND],
        ['damage', profile.damage, DAMAGE],
      ] as const
      checks.forEach(([field, value, pattern]) => {
        if (!value && declaredMissing.has(field)) return
        issues.push(
          ...characteristicIssue(
            pattern.test(value),
            entity.id,
            `${root}.profile.${field}`,
            value,
            'weapon',
            'review'
          )
        )
      })
    } else if (entity.kind === 'ability' && !entity.text.effect.trim()) {
      issues.push(
        issue(
          'missing-required-text',
          'error',
          entity.id,
          `${root}.text.effect`,
          'Generated ability effect is empty'
        )
      )
    }
  })
  return uniqueIssues(issues)
}

export const validateCatalogPathologies = inspectCatalogPathologies
