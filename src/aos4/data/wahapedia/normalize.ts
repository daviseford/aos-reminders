import type { AbilityActor, AbilityKind, AbilityText, AbilityTiming, WeaponType } from '../../domain'
import {
  normalizeAbilityText,
  normalizeSourceText,
  parseTiming,
  type NormalizationDiagnostic,
} from '../../normalize'
import type {
  WahapediaDataset,
  WahapediaDiagnostic,
  WahapediaFactionAbilityRecord,
  WahapediaWarscrollAbilityRecord,
  WahapediaWarscrollWeaponRecord,
} from './records'

type WahapediaAbilityRecord = WahapediaWarscrollAbilityRecord | WahapediaFactionAbilityRecord

export interface NormalizedWahapediaWeaponFact {
  sourceRecordId: WahapediaWarscrollWeaponRecord['meta']['sourceRecordId']
  warscrollId: string
  name: string
  weaponType: WeaponType | 'unknown'
  profile: {
    range: string
    attacks: string
    hit: string
    wound: string
    rend: string
    damage: string
  }
  abilityLabels: string[]
  abilitiesHtml: string
  hasBattleDamage: boolean | null
  diagnostics: NormalizationDiagnostic[]
}

export interface NormalizedWahapediaAbilityFact {
  sourceRecordId: WahapediaAbilityRecord['meta']['sourceRecordId']
  name: string
  abilityKind: AbilityKind
  actor: AbilityActor
  text: AbilityText
  timings: AbilityTiming[]
  keywords: string[]
  raw: {
    descriptionHtml: string
    condition: string
    abilityPhase: string
    abilityType: string
    isReaction: boolean | null
    pointsType: string
    points: string
  }
  diagnostics: NormalizationDiagnostic[]
}

const splitList = (value: string): string[] =>
  value
    .split(/\s*,\s*/)
    .map(item => item.trim())
    .filter(Boolean)

export const normalizeWahapediaWeapon = (
  record: WahapediaWarscrollWeaponRecord
): NormalizedWahapediaWeaponFact => {
  const abilities = normalizeSourceText(record.abilitiesHtml)
  const weaponType: NormalizedWahapediaWeaponFact['weaponType'] =
    record.weaponType === 'MELEE' ? 'melee' : record.weaponType === 'RANGED' ? 'ranged' : 'unknown'

  return {
    sourceRecordId: record.meta.sourceRecordId,
    warscrollId: record.warscrollId,
    name: record.name.trim(),
    weaponType,
    profile: {
      range: record.range,
      attacks: record.attacks,
      hit: record.hit,
      wound: record.wound,
      rend: record.rend,
      damage: record.damage,
    },
    abilityLabels: splitList(abilities.text),
    abilitiesHtml: record.abilitiesHtml,
    hasBattleDamage: record.hasBattleDamage,
    diagnostics: abilities.diagnostics,
  }
}

const abilityKind = (record: WahapediaAbilityRecord): AbilityKind => {
  if (record.isReaction || /\breaction\s*:/i.test(record.conditionHtml)) return 'reaction'
  if (/\bpassive\b/i.test(record.conditionHtml)) return 'passive'
  return 'active'
}

const reactionTrigger = (conditionHtml: string): string | undefined =>
  conditionHtml.match(/\bReaction:\s*([\s\S]*)$/i)?.[1]?.trim()

const correctKnownSourceTimingTypos = (
  value: string
): { value: string; diagnostics: NormalizationDiagnostic[] } => {
  const corrections = [
    { pattern: /\bAny Comhat Phase\b/gi, replacement: 'Any Combat Phase' },
    { pattern: /\bYour Hero Quest\b/gi, replacement: 'Your Hero Phase' },
  ]
  const diagnostics: NormalizationDiagnostic[] = []
  let corrected = value

  corrections.forEach(correction => {
    if (!correction.pattern.test(corrected)) return
    correction.pattern.lastIndex = 0
    corrected = corrected.replace(correction.pattern, correction.replacement)
    diagnostics.push({
      code: 'source-timing-correction',
      severity: 'warning',
      message: `Corrected a known Wahapedia timing typo to "${correction.replacement}"`,
    })
  })

  return { value: corrected, diagnostics }
}

const normalizeKeywords = (
  keywordsHtml: string
): { keywords: string[]; diagnostics: NormalizationDiagnostic[] } => {
  const normalized = normalizeSourceText(keywordsHtml)
  return {
    keywords: splitList(normalized.text).map(keyword => keyword.toUpperCase()),
    diagnostics: normalized.diagnostics,
  }
}

export const normalizeWahapediaAbility = (
  record: WahapediaAbilityRecord,
  actor: AbilityActor
): NormalizedWahapediaAbilityFact => {
  const kind = abilityKind(record)
  const text = normalizeAbilityText({
    descriptionHtml: record.descriptionHtml,
    reactionTriggerHtml: kind === 'reaction' ? reactionTrigger(record.conditionHtml) : undefined,
  })
  const timingOptions = {
    abilityKind: kind,
    actor,
  }
  const timingSource = correctKnownSourceTimingTypos(record.conditionHtml || record.abilityPhase)
  const primaryTiming = parseTiming(timingSource.value, timingOptions)
  const sourcePhaseTiming =
    primaryTiming.timings[0]?.window.kind === 'unknown' && record.abilityPhase
      ? parseTiming(record.abilityPhase, timingOptions)
      : undefined
  const canUseSourcePhase = sourcePhaseTiming && sourcePhaseTiming.timings[0]?.window.kind !== 'unknown'
  const timings = canUseSourcePhase
    ? sourcePhaseTiming.timings.map(timing => ({
        ...timing,
        raw: primaryTiming.timings[0].raw,
        ...(primaryTiming.timings[0].usage ? { usage: primaryTiming.timings[0].usage } : {}),
        ...(primaryTiming.timings[0].priority ? { priority: primaryTiming.timings[0].priority } : {}),
      }))
    : primaryTiming.timings
  const timingDiagnostics = canUseSourcePhase
    ? [
        ...primaryTiming.diagnostics.filter(diagnostic => diagnostic.code !== 'unknown-timing'),
        {
          code: 'source-phase-fallback' as const,
          severity: 'warning' as const,
          message: `Used lossy Wahapedia ability_phase "${record.abilityPhase}" because condition did not identify a window`,
        },
        ...sourcePhaseTiming.diagnostics,
      ]
    : primaryTiming.diagnostics
  const keywords = normalizeKeywords(record.keywordsHtml)
  const reactionFlagDiagnostics: NormalizationDiagnostic[] =
    record.isReaction === false && /\breaction\s*:/i.test(record.conditionHtml)
      ? [
          {
            code: 'reaction-flag-mismatch',
            severity: 'warning',
            message: 'Wahapedia condition identifies a reaction while is_reaction is false',
          },
        ]
      : []

  return {
    sourceRecordId: record.meta.sourceRecordId,
    name: record.name.trim(),
    abilityKind: kind,
    actor,
    text: text.text,
    timings,
    keywords: keywords.keywords,
    raw: {
      descriptionHtml: record.descriptionHtml,
      condition: record.conditionHtml,
      abilityPhase: record.abilityPhase,
      abilityType: record.abilityType,
      isReaction: record.isReaction,
      pointsType: record.pointsType,
      points: record.points,
    },
    diagnostics: [
      ...text.diagnostics,
      ...timingSource.diagnostics,
      ...timingDiagnostics,
      ...keywords.diagnostics,
      ...reactionFlagDiagnostics,
    ],
  }
}

export interface WahapediaFreshnessReport {
  exportUpdatedAt: string | null
  artifacts: Partial<Record<keyof WahapediaDataset['artifacts'], { retrievedAt: string; checksum: string }>>
  sourceDates: Array<{
    sourceId: string
    raw: string
    instant: string | null
  }>
  diagnostics: WahapediaDiagnostic[]
}

const sourceDateInstant = (raw: string): string | null => {
  const match = raw.match(/^(\d{2})\.(\d{2})\.(\d{4})(?: (\d{1,2}):(\d{2}):(\d{2}))?$/)
  if (!match) return null
  const year = Number(match[3])
  const month = Number(match[2])
  const day = Number(match[1])
  const hour = Number(match[4] ?? '0')
  const minute = Number(match[5] ?? '0')
  const second = Number(match[6] ?? '0')
  const instant = new Date(Date.UTC(year, month - 1, day, hour, minute, second))
  if (
    instant.getUTCFullYear() !== year ||
    instant.getUTCMonth() !== month - 1 ||
    instant.getUTCDate() !== day ||
    instant.getUTCHours() !== hour ||
    instant.getUTCMinutes() !== minute ||
    instant.getUTCSeconds() !== second
  ) {
    return null
  }
  return instant.toISOString()
}

export const assessWahapediaFreshness = (dataset: WahapediaDataset): WahapediaFreshnessReport => {
  const exportUpdatedAt = dataset.lastUpdate?.instant ?? null
  const sourceDates = dataset.sources.map(source => ({
    sourceId: source.id,
    raw: source.errataDate,
    instant: source.errataDate ? sourceDateInstant(source.errataDate) : null,
  }))
  const diagnostics: WahapediaDiagnostic[] = []

  sourceDates.forEach(sourceDate => {
    if (sourceDate.raw && !sourceDate.instant) {
      const source = dataset.sources.find(record => record.id === sourceDate.sourceId)
      if (!source) return
      diagnostics.push({
        code: 'invalid-source-date',
        severity: 'warning',
        file: source.meta.file,
        row: source.meta.row,
        field: 'errata_date',
        value: sourceDate.raw,
        message: `Source ${sourceDate.sourceId} has an invalid errata date`,
      })
    }
  })

  if (exportUpdatedAt) {
    sourceDates.forEach(sourceDate => {
      if (sourceDate.instant && sourceDate.instant > exportUpdatedAt) {
        const source = dataset.sources.find(record => record.id === sourceDate.sourceId)
        if (!source) return
        diagnostics.push({
          code: 'source-newer-than-export-marker',
          severity: 'warning',
          file: source.meta.file,
          row: source.meta.row,
          field: 'errata_date',
          value: sourceDate.raw,
          message: `Source ${sourceDate.sourceId} is dated after Last_update.csv`,
        })
      }
    })
  }

  const artifacts = Object.fromEntries(
    Object.entries(dataset.artifacts)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([file, artifact]) => [
        file,
        {
          retrievedAt: artifact.retrievedAt,
          checksum: artifact.checksum,
        },
      ])
  )

  return {
    exportUpdatedAt,
    artifacts,
    sourceDates,
    diagnostics,
  }
}
