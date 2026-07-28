import type { SourceRecordId } from '../domain'
import { stableCompactJson } from '../generate/serialization'
import {
  AOS4_REVIEW_SCHEMA_VERSION,
  checksumReviewRecord,
  createReviewFinding,
  reviewerConfigurationId,
  type ReviewAssignmentId,
  type ReviewFinding,
  type ReviewPacketSourceEvidence,
  type ReviewerMetadata,
  type ReviewerResult,
} from './records'
import type { ReviewPacketPair } from './packets'

export interface AdversarialAssessment {
  outcome: ReviewerResult['outcome']
  rationale: string
  findings: ReviewFinding[]
}

interface FailedCheck {
  field: string
  message: string
  expected?: unknown
  actual?: unknown
}

const compareText = (left: string, right: string): number => (left < right ? -1 : left > right ? 1 : 0)

const same = (left: unknown, right: unknown): boolean => stableCompactJson(left) === stableCompactJson(right)

const sameStringSet = (left: unknown, right: unknown): boolean =>
  Array.isArray(left) &&
  Array.isArray(right) &&
  same(left.map(String).sort(compareText), right.map(String).sort(compareText))

const sameJoinedText = (left: unknown, right: unknown): boolean => {
  const text = (value: unknown): string =>
    (Array.isArray(value) ? value : [value]).map(String).join(' ').replace(/\s+/g, ' ').trim()
  return text(left) === text(right)
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const evidenceBlockByRef = (pair: ReviewPacketPair): Map<string, string> =>
  new Map(pair.evidence.map(block => [block.ref, block.content]))

const sourceComparableText = (value: unknown): string =>
  String(value)
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/gi, '')
    .toLowerCase()

const decodeHtmlEntities = (value: string): string =>
  value.replace(
    /&(?:#(\d+)|#x([0-9a-f]+)|([a-z]+));/gi,
    (entity, decimal: string | undefined, hexadecimal: string | undefined, named: string | undefined) => {
      if (decimal) return String.fromCodePoint(Number.parseInt(decimal, 10))
      if (hexadecimal) return String.fromCodePoint(Number.parseInt(hexadecimal, 16))
      const entities: Record<string, string> = {
        amp: '&',
        apos: "'",
        gt: '>',
        hellip: '…',
        ldquo: '“',
        lsquo: '‘',
        lt: '<',
        mdash: '—',
        nbsp: ' ',
        ndash: '–',
        quot: '"',
        rdquo: '”',
        rsquo: '’',
      }
      return entities[named?.toLowerCase() ?? ''] ?? entity
    }
  )

const visibleSourceText = (value: unknown): string =>
  decodeHtmlEntities(String(value))
    .replace(/<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const semanticCharacteristic = (value: unknown): string =>
  visibleSourceText(value)
    .toLowerCase()
    .replace(/[\u2010-\u2015\u2212]/g, '-')
    .replace(/\s+/g, '')

const evidenceJsonValue = (
  pair: ReviewPacketPair
): { recordKind: string; value: Record<string, unknown> } | undefined => {
  const evidence = pair.comparisonPacket.sourceEvidence[0]
  const content = evidence?.excerptRef ? evidenceBlockByRef(pair).get(evidence.excerptRef) : undefined
  if (!content) return undefined
  try {
    const parsed = JSON.parse(content) as unknown
    return isRecord(parsed) &&
      typeof parsed.recordKind === 'string' &&
      isRecord(parsed.value)
      ? { recordKind: parsed.recordKind, value: parsed.value }
      : undefined
  } catch {
    return undefined
  }
}

const generatedCatalogEntities = (pair: ReviewPacketPair): Record<string, unknown>[] =>
  pair.comparisonPacket.generatedDestinations.flatMap(destination =>
    destination.path.endsWith('catalog/catalog.json') &&
    destination.field === 'entity' &&
    isRecord(destination.value)
      ? [destination.value]
      : []
  )

const entityOfKind = (
  entities: Record<string, unknown>[],
  kind: string
): Record<string, unknown> | undefined => entities.find(entity => entity.kind === kind)

const unsupportedSourceValue = (
  field: string,
  source: unknown,
  generated: unknown,
  exact = false
): FailedCheck[] => {
  if (source === undefined || source === null || String(source).trim() === '') return []
  const sourceValue = exact ? semanticCharacteristic(source) : sourceComparableText(visibleSourceText(source))
  const generatedValue = exact
    ? semanticCharacteristic(generated)
    : sourceComparableText(visibleSourceText(generated))
  return sourceValue && sourceValue !== generatedValue
    ? [
        failed(
          `secondary.source-${field}`,
          `Generated ${field} is not a faithful interpretation of the source-only record`,
          visibleSourceText(source),
          generated
        ),
      ]
    : []
}

const unsupportedGeneratedText = (
  field: string,
  source: unknown,
  generated: unknown
): FailedCheck[] => {
  if (generated === undefined || generated === null || String(generated).trim() === '') return []
  const sourceTokens: string[] =
    visibleSourceText(source).toLowerCase().match(/[a-z0-9]+/g) ?? []
  const generatedTokens: string[] =
    visibleSourceText(generated).toLowerCase().match(/[a-z0-9]+/g) ?? []
  let sourceIndex = 0
  const grounded = generatedTokens.every(token => {
    const index = sourceTokens.indexOf(token, sourceIndex)
    if (index < 0) return false
    sourceIndex = index + 1
    return true
  })
  return grounded
    ? []
    : [
        failed(
          `secondary.source-${field}`,
          `Generated ${field} is not grounded in the source-only record`,
          visibleSourceText(source),
          generated
        ),
      ]
}

const reviewEquivalentTimingSource = (value: string): string =>
  value
    .replace(/\bAny Comhat Phase\b/gi, 'Any Combat Phase')
    .replace(/\bYour Hero Quest\b/gi, 'Your Hero Phase')
    .replace(/\bEnd of Ypur Turn\b/gi, 'End of Your Turn')

const abilitySourceFidelityChecks = (
  source: Record<string, unknown>,
  ability: Record<string, unknown> | undefined
): FailedCheck[] => {
  if (!ability) {
    return [failed('secondary.source-ability', 'Source ability has no generated ability entity')]
  }
  const checks = unsupportedSourceValue('ability-name', source.name, ability.name)
  const condition = visibleSourceText(source.conditionHtml)
  const description = visibleSourceText(source.descriptionHtml)
  const sourceRuleText = `${condition} ${description} ${visibleSourceText(source.keywordsHtml)}`
  if (Array.isArray(ability.timings)) {
    ability.timings.forEach((timing, index) => {
      if (!isRecord(timing) || !condition) return
      checks.push(
        ...unsupportedGeneratedText(
          `ability-timings[${index}].raw`,
          reviewEquivalentTimingSource(condition),
          timing.raw
        )
      )
    })
  }
  if (isRecord(ability.text)) {
    Object.entries(ability.text).forEach(([field, value]) => {
      checks.push(...unsupportedGeneratedText(`ability-text.${field}`, sourceRuleText, value))
    })
  }
  if (Array.isArray(ability.keywords)) {
    ability.keywords.forEach((keyword, index) => {
      checks.push(...unsupportedGeneratedText(`ability-keywords[${index}]`, sourceRuleText, keyword))
    })
  }
  const expectedKind = /\bPassive\b/i.test(condition)
    ? 'passive'
    : /\bReaction\s*:/i.test(condition) || source.isReaction === true
      ? 'reaction'
      : condition
        ? 'active'
        : undefined
  if (expectedKind) {
    checks.push(...unsupportedSourceValue('ability-kind', expectedKind, ability.abilityKind))
  }
  return checks
}

const weaponSourceFidelityChecks = (
  source: Record<string, unknown>,
  weapon: Record<string, unknown> | undefined,
  officialOverride: boolean
): FailedCheck[] => {
  if (!weapon) return [failed('secondary.source-weapon', 'Source weapon has no generated weapon entity')]
  const checks = [
    ...unsupportedSourceValue('weapon-name', source.name, weapon.name),
    ...unsupportedSourceValue('weapon-type', source.weaponType, weapon.weaponType),
  ]
  if (isRecord(weapon.profile) && !officialOverride) {
    const range = String(source.range ?? '').match(/\d+/)?.[0]
    checks.push(
      ...unsupportedSourceValue(
        'weapon-profile.rangeInches',
        range,
        weapon.profile.rangeInches,
        true
      )
    )
    const profileFields = ['attacks', 'hit', 'wound', 'rend', 'damage'] as const
    profileFields.forEach(field => {
      checks.push(
        ...unsupportedSourceValue(`weapon-profile.${field}`, source[field], weapon.profile?.[field], true)
      )
    })
  }
  const abilityText = visibleSourceText(source.abilitiesHtml)
  if (Array.isArray(weapon.keywords)) {
    weapon.keywords.forEach((keyword, index) => {
      const value = isRecord(keyword) ? keyword.raw : keyword
      checks.push(...unsupportedGeneratedText(`weapon-keywords[${index}]`, abilityText, value))
    })
  }
  return checks
}

const warscrollSourceFidelityChecks = (
  pair: ReviewPacketPair,
  source: Record<string, unknown>,
  entities: Record<string, unknown>[]
): FailedCheck[] => {
  const warscroll = entityOfKind(entities, 'warscroll')
  if (!warscroll) {
    const sourceHasCharacteristics = ['move', 'save', 'control', 'health', 'ward'].some(field =>
      String(source[field] ?? '').trim()
    )
    const group = entityOfKind(entities, 'content-group')
    if (!sourceHasCharacteristics && group) {
      return unsupportedSourceValue('content-group-name', source.name, group.name)
    }
    return [failed('secondary.source-warscroll', 'Source warscroll has no generated warscroll entity')]
  }
  const checks = unsupportedSourceValue('warscroll-name', source.name, warscroll.name)
  if (isRecord(warscroll.characteristics)) {
    ;(['move', 'save', 'control', 'health', 'ward'] as const).forEach(field => {
      checks.push(
        ...unsupportedSourceValue(
          `warscroll-characteristics.${field}`,
          source[field],
          warscroll.characteristics?.[field],
          true
        )
      )
    })
  }
  if (!pair.comparisonPacket.cohortIds.includes('high-risk:official-override')) {
    const profile = entityOfKind(entities, 'battle-profile')
    if (profile) {
      checks.push(
        ...unsupportedSourceValue('battle-profile-points', source.cost, profile.points, true),
        ...unsupportedSourceValue('battle-profile-unit-size', source.unitSize, profile.unitSize, true)
      )
      const sourceOptions = String(source.regimentOptions ?? '')
        .split(/\s*(?:,|;)\s*/)
        .filter(Boolean)
      const generatedOptions = Array.isArray(profile.regimentOptions)
        ? profile.regimentOptions.map(String)
        : []
      sourceOptions.forEach((option, index) => {
        if (
          !generatedOptions.some(
            generatedOption =>
              sourceComparableText(generatedOption) === sourceComparableText(option)
          )
        ) {
          checks.push(
            failed(
              `secondary.source-battle-profile-regiment-options[${index}]`,
              'Source regiment option is absent from the generated battle profile',
              option,
              generatedOptions
            )
          )
        }
      })
      generatedOptions.forEach((option, index) => {
        if (
          !sourceOptions.some(
            sourceOption => sourceComparableText(sourceOption) === sourceComparableText(option)
          )
        ) {
          checks.push(
            failed(
              `secondary.generated-battle-profile-regiment-options[${index}]`,
              'Generated regiment option is absent from the source-only record',
              sourceOptions,
              option
            )
          )
        }
      })
      if (source.noReinforced === true) {
        const generatedNotes = Array.isArray(profile.notes) ? profile.notes.join(' ') : profile.notes
        if (
          !sourceComparableText(generatedNotes).includes(
            sourceComparableText('This unit cannot be reinforced.')
          )
        ) {
          checks.push(
            failed(
              'secondary.source-battle-profile-no-reinforcement-note',
              'Source reinforcement restriction is absent from the generated battle profile',
              'This unit cannot be reinforced.',
              generatedNotes
            )
          )
        }
      }
    }
  }
  return checks
}

const secondarySourceFidelityChecks = (pair: ReviewPacketPair): FailedCheck[] => {
  const parsed = evidenceJsonValue(pair)
  if (!parsed) return []
  const entities = generatedCatalogEntities(pair)
  const { recordKind, value } = parsed
  if (recordKind === 'warscroll-ability' || recordKind === 'faction-ability') {
    return abilitySourceFidelityChecks(value, entityOfKind(entities, 'ability'))
  }
  if (recordKind === 'warscroll-weapon') {
    return weaponSourceFidelityChecks(
      value,
      entityOfKind(entities, 'weapon'),
      pair.comparisonPacket.cohortIds.includes('high-risk:official-override')
    )
  }
  if (recordKind === 'warscroll') return warscrollSourceFidelityChecks(pair, value, entities)
  if (recordKind === 'warscroll-keyword') {
    const warscroll = entityOfKind(entities, 'warscroll')
    const expected = `${String(value.keyword ?? '')}${value.parameter ? ` ${String(value.parameter)}` : ''}`
    const keywords = Array.isArray(warscroll?.keywords) ? warscroll.keywords : []
    return keywords.some(keyword =>
      sourceComparableText(keyword).includes(sourceComparableText(expected))
    )
      ? []
      : [
          failed(
            'secondary.source-warscroll-keyword',
            'Source keyword is absent from the generated warscroll',
            expected,
            keywords
          ),
        ]
  }
  if (recordKind === 'warscroll-base') {
    if (pair.comparisonPacket.cohortIds.includes('high-risk:official-override')) return []
    const profile = entityOfKind(entities, 'battle-profile')
    const baseSizes = Array.isArray(profile?.baseSizes) ? profile.baseSizes : []
    const expected = [value.base, value.model].filter(Boolean).join(' ')
    return baseSizes.some(baseSize =>
      sourceComparableText(baseSize).includes(sourceComparableText(expected))
    )
      ? []
      : [
          failed(
            'secondary.source-warscroll-base',
            'Source base size is absent from the generated battle profile',
            expected,
            baseSizes
          ),
        ]
  }
  if (recordKind === 'faction-ability-type' || recordKind === 'faction-ability-subtype') {
    const group = entityOfKind(entities, 'content-group')
    return group
      ? unsupportedSourceValue('content-group-name', value.name, group.name)
      : [failed('secondary.source-content-group', 'Source content group has no generated entity')]
  }
  if (recordKind === 'faction') {
    const faction = entityOfKind(entities, 'faction')
    return faction
      ? unsupportedSourceValue('faction-name', value.name, faction.name)
      : [failed('secondary.source-faction', 'Source faction has no generated faction entity')]
  }
  if (recordKind === 'publication') {
    const publication = entityOfKind(entities, 'publication')
    return publication
      ? unsupportedSourceValue(
          'publication-name',
          value.name ?? value.title,
          publication.name
        )
      : [failed('secondary.source-publication', 'Source publication has no generated publication entity')]
  }
  return []
}

const sourceFactValues = (fact: Record<string, unknown>): Array<{ field: string; value: unknown }> =>
  [
    'name',
    'optionType',
    'unitSize',
    'points',
    'baseSizes',
    'regimentOptions',
    'relevantKeywords',
    'notes',
    'unitSummary',
  ].flatMap(field => {
    const value = fact[field]
    if (value === undefined) return []
    return (Array.isArray(value) ? value : [value]).map(item => ({ field, value: item }))
  })

const officialSourceFidelityChecks = (pair: ReviewPacketPair): FailedCheck[] => {
  const evidence = pair.comparisonPacket.sourceEvidence[0]
  const structured = evidence?.structuredValue
  if (!evidence || !isRecord(structured) || !isRecord(structured.fact)) return []
  const sourceText = evidence.excerptRef ? evidenceBlockByRef(pair).get(evidence.excerptRef) : undefined
  if (!sourceText) {
    return [failed('official.source-evidence', 'Official fact has no source-only excerpt for review')]
  }
  const comparableSource = sourceComparableText(sourceText)
  return sourceFactValues(structured.fact).flatMap(({ field, value }) => {
    const comparableValue = sourceComparableText(value)
    return comparableValue && !comparableSource.includes(comparableValue)
      ? [
          failed(
            `official.source-${field}`,
            `Official ${field} is not supported by the source-only page excerpt`,
            value
          ),
        ]
      : []
  })
}

const sourceRecordId = (pair: ReviewPacketPair): SourceRecordId =>
  pair.comparisonPacket.sourceEvidence[0]?.sourceRecordId ??
  ('source-record:review:missing-evidence' as SourceRecordId)

const evidenceIdentity = (evidence: ReviewPacketSourceEvidence[]) =>
  evidence.map(
    ({ sourceRecordId: id, recordChecksum, locator, authority, artifactId, excerptRef }) => ({
      sourceRecordId: id,
      recordChecksum,
      locator,
      authority,
      ...(artifactId ? { artifactId } : {}),
      ...(excerptRef ? { excerptRef } : {}),
    })
  )

const evidenceReferences = (evidence: ReviewPacketSourceEvidence[]) =>
  evidence.map(value => ({
    sourceRecordId: value.sourceRecordId,
    recordChecksum: value.recordChecksum,
    locator: value.locator,
  }))

const failed = (field: string, message: string, expected?: unknown, actual?: unknown): FailedCheck => ({
  field,
  message,
  ...(expected === undefined ? {} : { expected }),
  ...(actual === undefined ? {} : { actual }),
})

const officialChecks = (pair: ReviewPacketPair): FailedCheck[] => {
  const evidence = pair.comparisonPacket.sourceEvidence[0]?.structuredValue
  if (!isRecord(evidence) || !isRecord(evidence.fact)) {
    return [failed('official.fact', 'Official review evidence does not contain a structured fact')]
  }
  const fact = evidence.fact
  const ledgerRecord = pair.comparisonPacket.generatedDestinations.find(
    destination =>
      destination.path.endsWith('official-battle-profiles.json') &&
      isRecord(destination.value) &&
      same(destination.value.fact, fact)
  )?.value
  const checks: FailedCheck[] = officialSourceFidelityChecks(pair)
  if (!isRecord(ledgerRecord)) {
    checks.push(
      failed(
        'official.ledger',
        'The exact official fact is absent from the generated official ledger',
        fact,
        ledgerRecord
      )
    )
    return checks
  }
  if (ledgerRecord.status !== evidence.applicationStatus) {
    checks.push(
      failed(
        'official.status',
        'Official application status differs from the reviewed evidence',
        evidence.applicationStatus,
        ledgerRecord.status
      )
    )
  }
  if (ledgerRecord.disposition !== evidence.disposition) {
    checks.push(
      failed(
        'official.disposition',
        'Official disposition differs from the reviewed evidence',
        evidence.disposition,
        ledgerRecord.disposition
      )
    )
  }
  if (evidence.disposition !== 'applied-to-runtime' || fact.kind !== 'unit') return checks

  const expectedName = `${String(fact.name)} battle profile`
  const profile = pair.comparisonPacket.generatedDestinations.find(
    destination =>
      isRecord(destination.value) &&
      destination.value.kind === 'battle-profile' &&
      destination.value.name === expectedName
  )?.value
  if (!isRecord(profile)) {
    checks.push(
      failed(
        'official.runtime-profile',
        'An effective official unit fact has no matching generated battle profile',
        expectedName
      )
    )
    return checks
  }
  const fields = ['points', 'unitSize', 'baseSizes', 'regimentOptions', 'notes'] as const
  fields.forEach(field => {
    const matches =
      field === 'baseSizes' || field === 'regimentOptions'
        ? sameStringSet(profile[field], fact[field])
        : field === 'notes'
          ? sameJoinedText(profile[field], fact[field])
          : same(profile[field], fact[field])
    if (fact[field] !== undefined && !matches) {
      checks.push(
        failed(
          `official.${field}`,
          `Generated battle-profile ${field} differs from the official fact`,
          fact[field],
          profile[field]
        )
      )
    }
  })
  return checks
}

const exactDestinationCheck = (pair: ReviewPacketPair, field: string): FailedCheck[] => {
  const evidenceValues = pair.comparisonPacket.sourceEvidence
    .map(evidence => evidence.structuredValue)
    .filter(value => value !== undefined)
  const destinations = pair.comparisonPacket.generatedDestinations.map(destination => destination.value)
  return evidenceValues.some(evidence => destinations.some(destination => same(evidence, destination)))
    ? []
    : [
        failed(
          field,
          'No generated audit destination exactly preserves the reviewed structured evidence',
          evidenceValues,
          destinations
        ),
      ]
}

const reconciliationChecks = (pair: ReviewPacketPair): FailedCheck[] => {
  const evidence = pair.comparisonPacket.sourceEvidence[0]
  const structured = evidence?.structuredValue
  const destination = pair.comparisonPacket.generatedDestinations[0]?.value
  if (!evidence || !isRecord(structured) || !isRecord(destination)) {
    return [
      failed(
        'reconciliation.discrepancy',
        'Reconciliation packet is missing structured evidence or its audit destination'
      ),
    ]
  }
  const expected = {
    field: structured.field,
    official: structured.official,
    secondary: structured.secondary,
    officialSourceRecordId: evidence.sourceRecordId,
    url: structured.secondaryUrl,
  }
  return Object.entries(expected).flatMap(([key, value]) =>
    same(destination[key], value)
      ? []
      : [
          failed(
            `reconciliation.${key}`,
            `Reconciliation audit ${key} differs from the independently reviewed disagreement`,
            value,
            destination[key]
          ),
        ]
  )
}

const ignoredChecks = (pair: ReviewPacketPair): FailedCheck[] => {
  const evidence = pair.comparisonPacket.sourceEvidence[0]?.structuredValue
  if (!isRecord(evidence)) {
    return [failed('ignored.disposition', 'Ignored-record evidence is missing its disposition')]
  }
  const destination = pair.comparisonPacket.generatedDestinations.find(value =>
    value.path.endsWith('corpus-2026-07-27.json')
  )?.value
  if (!isRecord(destination)) {
    return [
      failed(
        'ignored.disposition',
        'Ignored source record has no durable disposition in the corpus review',
        evidence,
        destination
      ),
    ]
  }
  const checks: FailedCheck[] = []
  if (destination.sourceRecordId !== sourceRecordId(pair)) {
    checks.push(
      failed(
        'ignored.sourceRecordId',
        'Ignored disposition references a different source record',
        sourceRecordId(pair),
        destination.sourceRecordId
      )
    )
  }
  if (destination.reason !== evidence.reason) {
    checks.push(
      failed(
        'ignored.reason',
        'Ignored disposition rationale differs from the reviewed evidence',
        evidence.reason,
        destination.reason
      )
    )
  }
  return checks
}

const sourceRecordChecks = (pair: ReviewPacketPair): FailedCheck[] => {
  const evidence = pair.comparisonPacket.sourceEvidence[0]
  if (!evidence) return [failed('source.evidence', 'Source-record packet contains no source evidence')]
  const auditRecord = pair.comparisonPacket.generatedDestinations.find(
    destination =>
      destination.field === 'sourceRecords' &&
      isRecord(destination.value) &&
      destination.value.id === evidence.sourceRecordId
  )?.value
  if (!isRecord(auditRecord)) {
    return [
      failed(
        'source.audit-record',
        'Current source record is absent from the generated audit catalog',
        evidence.sourceRecordId
      ),
    ]
  }
  const checks: FailedCheck[] = []
  if (auditRecord.recordChecksum !== evidence.recordChecksum) {
    checks.push(
      failed(
        'source.recordChecksum',
        'Generated audit record checksum differs from the reviewed source evidence',
        evidence.recordChecksum,
        auditRecord.recordChecksum
      )
    )
  }
  if (!same(auditRecord.locator, evidence.locator)) {
    checks.push(
      failed(
        'source.locator',
        'Generated audit record locator differs from the reviewed source evidence',
        evidence.locator,
        auditRecord.locator
      )
    )
  }
  const entityDestinations = pair.comparisonPacket.generatedDestinations.filter(
    destination => destination.field === 'entity'
  )
  if (
    pair.comparisonPacket.canonicalEntityId &&
    !entityDestinations.some(
      destination => destination.canonicalEntityId === pair.comparisonPacket.canonicalEntityId
    )
  ) {
    checks.push(
      failed(
        'source.canonical-entity',
        'Source record does not reach its declared canonical entity',
        pair.comparisonPacket.canonicalEntityId,
        entityDestinations.map(destination => destination.canonicalEntityId)
      )
    )
  }
  if (evidence.authority === 'secondary') {
    checks.push(...secondarySourceFidelityChecks(pair))
  }
  return checks
}

const structuralChecks = (pair: ReviewPacketPair): FailedCheck[] => {
  const checks: FailedCheck[] = []
  if (pair.blindPacket.generatedDestinations.length) {
    checks.push(
      failed(
        'protocol.blind-generated-values',
        'Blind packet exposes generated destinations before interpretation'
      )
    )
  }
  if (pair.blindPacket.sourceEvidence.some(evidence => evidence.structuredValue !== undefined)) {
    checks.push(
      failed(
        'protocol.blind-generated-values',
        'Blind packet exposes normalized structured values before interpretation'
      )
    )
  }
  if (
    !same(
      evidenceIdentity(pair.blindPacket.sourceEvidence),
      evidenceIdentity(pair.comparisonPacket.sourceEvidence)
    )
  ) {
    checks.push(
      failed('protocol.evidence-drift', 'Blind and comparison packets do not bind identical source evidence')
    )
  }
  if (
    pair.blindPacket.protocolVersion !== pair.comparisonPacket.protocolVersion ||
    pair.blindPacket.rubricVersion !== pair.comparisonPacket.rubricVersion
  ) {
    checks.push(
      failed('protocol.version-drift', 'Blind and comparison packets use different review contracts')
    )
  }
  return checks
}

const categoryChecks = (pair: ReviewPacketPair): FailedCheck[] => {
  if (pair.calibrationKind === 'insufficient-evidence') return []
  if (pair.calibrationKind === 'defect') {
    return [
      failed(
        'calibration.seeded-defect',
        'Seeded comparison value is intentionally unsupported',
        pair.blindPacket.sourceEvidence.map(evidence => evidence.structuredValue),
        pair.comparisonPacket.generatedDestinations.map(destination => destination.value)
      ),
    ]
  }
  switch (pair.category) {
    case 'official-record':
      return officialChecks(pair)
    case 'reconciliation-discrepancy':
      return reconciliationChecks(pair)
    case 'profile-only-fact':
      return exactDestinationCheck(pair, 'reconciliation.profile-only')
    case 'ignored-record':
      return ignoredChecks(pair)
    case 'source-record':
      return sourceRecordChecks(pair)
    case 'golden-truth':
      return pair.comparisonPacket.generatedDestinations.some(
        destination =>
          destination.path.endsWith('goldenTruth.json') &&
          destination.field === 'baseSizes[1]' &&
          destination.value === '25mm [1]'
      )
        ? []
        : [
            failed(
              'golden-truth.lord-terminos-base',
              'Lord-Terminos regression no longer preserves the reviewed 25mm base'
            ),
          ]
  }
}

const findingFor = (pair: ReviewPacketPair, check: FailedCheck): ReviewFinding =>
  createReviewFinding({
    packetId: pair.comparisonPacket.id,
    subject: {
      ...(pair.comparisonPacket.canonicalEntityId
        ? { canonicalEntityId: pair.comparisonPacket.canonicalEntityId }
        : {}),
      sourceRecordId: sourceRecordId(pair),
      field: check.field,
    },
    ...(check.expected === undefined ? {} : { expectedValue: check.expected }),
    ...(check.actual === undefined ? {} : { actualValue: check.actual }),
    severity: check.field.startsWith('protocol.') ? 'blocker' : 'major',
    confidence: 'high',
    rationale: check.message,
    evidence: evidenceReferences(pair.comparisonPacket.sourceEvidence),
  })

export const blindInterpretationFor = (pair: ReviewPacketPair): unknown => ({
  category: pair.category,
  evidence: pair.blindPacket.sourceEvidence.map(evidence => {
    const content = evidence.excerptRef ? evidenceBlockByRef(pair).get(evidence.excerptRef) : undefined
    let interpretation: unknown
    if (content) {
      try {
        interpretation = JSON.parse(content)
      } catch {
        interpretation = {
          evidenceChecksum: checksumReviewRecord(content),
          observedNumbers: Array.from(new Set(content.match(/\b\d+(?:\.\d+)?\b/g) ?? [])).sort(
            compareText
          ),
          observedMeasurements: Array.from(
            new Set(content.match(/\b\d+(?:\.\d+)?(?:\s*[Ã—x]\s*\d+(?:\.\d+)?)?\s*mm\b/gi) ?? [])
          ).sort(compareText),
        }
      }
    }
    return {
      sourceRecordId: evidence.sourceRecordId,
      authority: evidence.authority,
      locator: evidence.locator,
      ...(evidence.excerptRef ? { excerptRef: evidence.excerptRef } : {}),
      ...(interpretation === undefined ? {} : { interpretation }),
    }
  }),
})

export const assessAdversarialComparison = (pair: ReviewPacketPair): AdversarialAssessment => {
  if (pair.calibrationKind === 'insufficient-evidence') {
    return {
      outcome: 'cannot-verify',
      rationale: 'The calibration packet intentionally contains insufficient evidence.',
      findings: [],
    }
  }
  const checks = [...structuralChecks(pair), ...categoryChecks(pair)]
  const findings = checks
    .map(check => findingFor(pair, check))
    .sort((left, right) => compareText(left.id, right.id))
  return findings.length
    ? {
        outcome: 'finding',
        rationale: `Adversarial comparison found ${findings.length} evidence-bound mismatch${
          findings.length === 1 ? '' : 'es'
        }.`,
        findings,
      }
    : {
        outcome: 'pass',
        rationale:
          'Blind structured interpretation, provenance, disposition, and generated destination agree.',
        findings: [],
      }
}

export const createAdversarialBlindResult = (
  pair: ReviewPacketPair,
  assignmentId: ReviewAssignmentId,
  reviewer: ReviewerMetadata,
  reviewedAt: string
): ReviewerResult => {
  const configurationId = reviewerConfigurationId(reviewer)
  const blindHasEvidence =
    pair.blindPacket.sourceEvidence.length > 0 &&
    pair.blindPacket.sourceEvidence.every(
      evidence => evidence.excerptRef && evidenceBlockByRef(pair).has(evidence.excerptRef)
    )
  return {
    schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
    assignmentId,
    packetId: pair.blindPacket.id,
    packetChecksum: pair.blindPacket.packetChecksum,
    reviewerConfigurationId: configurationId,
    reviewedAt,
    outcome: blindHasEvidence && pair.calibrationKind !== 'insufficient-evidence' ? 'pass' : 'cannot-verify',
    rationale:
      blindHasEvidence && pair.calibrationKind !== 'insufficient-evidence'
        ? 'Captured a checksum-bound source-only interpretation before generated values were exposed.'
        : 'The packet contains no source evidence from which to derive an interpretation.',
    ...(pair.blindDerivationRequired && blindHasEvidence
      ? { blindExpectedInterpretation: blindInterpretationFor(pair) }
      : {}),
    findings: [],
  }
}

export const createAdversarialComparisonResult = (
  pair: ReviewPacketPair,
  blindResult: ReviewerResult,
  assignmentId: ReviewAssignmentId,
  reviewer: ReviewerMetadata,
  reviewedAt: string
): ReviewerResult => {
  const configurationId = reviewerConfigurationId(reviewer)
  const blindIsValid =
    blindResult.assignmentId === assignmentId &&
    blindResult.packetId === pair.blindPacket.id &&
    blindResult.packetChecksum === pair.blindPacket.packetChecksum &&
    blindResult.reviewerConfigurationId === configurationId &&
    new Date(blindResult.reviewedAt).valueOf() < new Date(reviewedAt).valueOf() &&
    (!pair.blindDerivationRequired || blindResult.blindExpectedInterpretation !== undefined)
  if (!blindIsValid || (pair.blindDerivationRequired && blindResult.outcome !== 'pass')) {
    return {
      schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
      assignmentId,
      packetId: pair.comparisonPacket.id,
      packetChecksum: pair.comparisonPacket.packetChecksum,
      reviewerConfigurationId: configurationId,
      reviewedAt,
      outcome: 'cannot-verify',
      rationale: 'A valid saved blind interpretation was not available before comparison.',
      findings: [],
    }
  }
  const comparison = assessAdversarialComparison(pair)
  return {
    schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
    assignmentId,
    packetId: pair.comparisonPacket.id,
    packetChecksum: pair.comparisonPacket.packetChecksum,
    reviewerConfigurationId: configurationId,
    reviewedAt,
    outcome: comparison.outcome,
    rationale: comparison.rationale,
    findings: comparison.findings,
  }
}

export const createAdversarialPairResults = (
  pair: ReviewPacketPair,
  assignmentId: ReviewAssignmentId,
  reviewer: ReviewerMetadata,
  blindReviewedAt: string,
  comparisonReviewedAt: string
): [ReviewerResult, ReviewerResult] => {
  const blind = createAdversarialBlindResult(pair, assignmentId, reviewer, blindReviewedAt)
  return [
    blind,
    createAdversarialComparisonResult(
      pair,
      blind,
      assignmentId,
      reviewer,
      comparisonReviewedAt
    ),
  ]
}
