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
  WahapediaGeneralRuleAbilityRecord,
  WahapediaWarscrollAbilityRecord,
  WahapediaWarscrollWeaponRecord,
} from './records'

type WahapediaAbilityRecord =
  WahapediaWarscrollAbilityRecord | WahapediaFactionAbilityRecord | WahapediaGeneralRuleAbilityRecord

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
  const profile = {
    range: record.range,
    attacks: record.attacks,
    hit: record.hit,
    wound: record.wound,
    rend: record.rend,
    damage: record.damage,
  }
  const missingCharacteristics = Object.entries(profile)
    .filter(([name, value]) => name !== 'range' && !value.trim())
    .map(([name]) => name)
  const weaponType: NormalizedWahapediaWeaponFact['weaponType'] =
    record.weaponType === 'MELEE' ? 'melee' : record.weaponType === 'RANGED' ? 'ranged' : 'unknown'

  return {
    sourceRecordId: record.meta.sourceRecordId,
    warscrollId: record.warscrollId,
    name: record.name.trim(),
    weaponType,
    profile,
    abilityLabels: splitList(abilities.text),
    abilitiesHtml: record.abilitiesHtml,
    hasBattleDamage: record.hasBattleDamage,
    diagnostics: [
      ...abilities.diagnostics,
      ...(missingCharacteristics.length
        ? [
            {
              code: 'source-incomplete-weapon-profile' as const,
              severity: 'warning' as const,
              message: `Wahapedia omitted weapon characteristics: ${missingCharacteristics.join(', ')}`,
            },
          ]
        : []),
    ],
  }
}

const abilityKind = (record: WahapediaAbilityRecord): AbilityKind => {
  if (/\breaction\s*:\s*passive\b/i.test(record.conditionHtml)) return 'passive'
  if (/\breaction\s*:/i.test(record.conditionHtml)) return 'reaction'
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
    { pattern: /\bEnd of Ypur Turn\b/gi, replacement: 'End of Your Turn' },
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

const explicitEffectPhaseTimings = (
  effect: string,
  options: { abilityKind: AbilityKind; actor: AbilityActor },
  conditionTiming: AbilityTiming
): { timings: AbilityTiming[]; diagnostics: NormalizationDiagnostic[] } | undefined => {
  if (
    !['unknown', 'phase-independent'].includes(conditionTiming.window.kind) ||
    conditionTiming.usage?.period !== 'phase'
  ) {
    return undefined
  }

  const labels =
    effect.match(
      /\b(?:Your|Enemy|Any) (?:Start of Turn|Hero Phase|Movement Phase|Shooting Phase|Charge Phase|Combat Phase|End of Turn):/gi
    ) ?? []
  const timings = labels
    .map(label => parseTiming(label.slice(0, -1), options))
    .flatMap(result => result.timings)
    .filter(timing => timing.window.kind !== 'unknown')
    .map(timing => ({
      ...timing,
      usage: conditionTiming.usage,
      raw: `${conditionTiming.raw}; ${timing.raw}`,
    }))
  const uniqueTimings = Array.from(
    new Map(
      timings.map(timing => [
        `${timing.window.kind === 'turn-phase' ? timing.window.phase : timing.window.kind}:${timing.perspective}`,
        timing,
      ])
    ).values()
  )
  if (!uniqueTimings.length) return undefined

  return {
    timings: uniqueTimings,
    diagnostics: [
      {
        code: 'effect-phase-windows',
        severity: 'warning',
        message: `Classified ${uniqueTimings.length} windows from explicit phase labels in the effect text`,
      },
    ],
  }
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

const windowKey = (timing: AbilityTiming): string =>
  timing.window.kind === 'turn-phase' ? `${timing.window.kind}:${timing.window.phase}` : timing.window.kind

const sourcePhaseConflict = (
  record: WahapediaAbilityRecord,
  kind: AbilityKind,
  actor: AbilityActor,
  timings: AbilityTiming[]
): NormalizationDiagnostic[] => {
  if (kind !== 'active' || !record.abilityPhase) return []

  const sourcePhaseTiming = parseTiming(record.abilityPhase, { abilityKind: kind, actor })
  const sourceWindows = sourcePhaseTiming.timings
    .filter(timing => timing.window.kind !== 'unknown')
    .map(windowKey)
  const canonicalWindows = timings.filter(timing => timing.window.kind !== 'unknown').map(windowKey)
  if (
    !sourceWindows.length ||
    !canonicalWindows.length ||
    (sourceWindows.length === canonicalWindows.length &&
      sourceWindows.every(window => canonicalWindows.includes(window)))
  ) {
    return []
  }

  return [
    {
      code: 'source-phase-conflict',
      severity: 'warning',
      message: `Wahapedia ability_phase "${record.abilityPhase}" conflicts with the canonical timing and was retained only as review evidence`,
    },
  ]
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
  const promotedPassiveDeclare = kind === 'passive' && !text.text.effect && Boolean(text.text.declare)
  const normalizedText: AbilityText = promotedPassiveDeclare ? { effect: text.text.declare! } : text.text
  const textDiagnostics: NormalizationDiagnostic[] = promotedPassiveDeclare
    ? [
        ...text.diagnostics.filter(diagnostic => diagnostic.code !== 'missing-ability-effect'),
        {
          code: 'passive-declare-promoted',
          severity: 'warning',
          message: 'Promoted a passive source section mislabeled Declare to its effect',
        },
      ]
    : text.diagnostics
  const timingOptions = {
    abilityKind: kind,
    actor,
  }
  const timingSource = correctKnownSourceTimingTypos(record.conditionHtml)
  const primaryTiming = parseTiming(timingSource.value, timingOptions)
  const effectTimings = explicitEffectPhaseTimings(
    normalizedText.effect,
    timingOptions,
    primaryTiming.timings[0]
  )
  const timings = effectTimings ? effectTimings.timings : primaryTiming.timings
  const timingDiagnostics = effectTimings
    ? [
        ...primaryTiming.diagnostics.filter(diagnostic => diagnostic.code !== 'unknown-timing'),
        ...effectTimings.diagnostics,
      ]
    : primaryTiming.diagnostics
  const sourcePhaseDiagnostics = sourcePhaseConflict(record, kind, actor, timings)
  const keywords = normalizeKeywords(record.keywordsHtml)
  const conditionIsReaction = /\breaction\s*:/i.test(record.conditionHtml)
  const correctedReactionPassive = /\breaction\s*:\s*passive\b/i.test(record.conditionHtml)
  const sourceKindDiagnostics: NormalizationDiagnostic[] = correctedReactionPassive
    ? [
        {
          code: 'source-kind-correction',
          severity: 'warning',
          message: 'Classified the contradictory source label "Reaction: Passive" as passive',
        },
      ]
    : []
  const reactionFlagDiagnostics: NormalizationDiagnostic[] =
    !correctedReactionPassive && record.isReaction !== null && record.isReaction !== conditionIsReaction
      ? [
          {
            code: 'reaction-flag-mismatch',
            severity: 'warning',
            message: `Wahapedia condition ${
              conditionIsReaction ? 'identifies' : 'does not identify'
            } a reaction while is_reaction is ${String(record.isReaction)}`,
          },
        ]
      : []

  return {
    sourceRecordId: record.meta.sourceRecordId,
    name: record.name.trim(),
    abilityKind: kind,
    actor,
    text: normalizedText,
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
      ...textDiagnostics,
      ...timingSource.diagnostics,
      ...timingDiagnostics,
      ...sourcePhaseDiagnostics,
      ...sourceKindDiagnostics,
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
