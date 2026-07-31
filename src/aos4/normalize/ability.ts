import type {
  Ability,
  AbilityActor,
  AbilityCost,
  AbilityKind,
  CanonicalId,
  RulesContextId,
  SourceReference,
} from '../domain'
import type { NormalizationDiagnostic } from './diagnostics'
import { normalizeAbilityText } from './text'
import { parseTiming } from './timing'

export interface NormalizeAbilityInput {
  id: CanonicalId<'ability'>
  revision: string
  name: string
  abilityKind: AbilityKind
  actor: AbilityActor
  descriptionHtml: string
  reactionTriggerHtml?: string
  rawTiming: string
  keywords: string[]
  rulesContextIds: RulesContextId[]
  sourceRefs: SourceReference[]
  cost?: AbilityCost
}

export interface AbilityNormalizationResult {
  ability: Ability
  diagnostics: NormalizationDiagnostic[]
}

const normalizeKeywords = (keywords: string[]): string[] => {
  const normalized = keywords.map(keyword => keyword.trim().toUpperCase()).filter(Boolean)
  return Array.from(new Set(normalized))
}

export const normalizeAbility = (input: NormalizeAbilityInput): AbilityNormalizationResult => {
  const text = normalizeAbilityText({
    descriptionHtml: input.descriptionHtml,
    reactionTriggerHtml: input.reactionTriggerHtml,
  })
  const timing = parseTiming(input.rawTiming, {
    abilityKind: input.abilityKind,
    actor: input.actor,
  })
  const sourceRecordId = input.sourceRefs[0]?.sourceRecordId
  const diagnostics = [...text.diagnostics, ...timing.diagnostics].map(diagnostic => ({
    ...diagnostic,
    ...(diagnostic.sourceRecordId || !sourceRecordId ? {} : { sourceRecordId }),
  }))

  if (input.abilityKind === 'reaction' && !text.text.reactionTrigger) {
    diagnostics.push({
      code: 'missing-reaction-trigger',
      severity: 'error',
      message: `Reaction ability "${input.name}" did not retain a trigger`,
      ...(sourceRecordId ? { sourceRecordId } : {}),
    })
  }

  return {
    ability: {
      id: input.id,
      kind: 'ability',
      revision: input.revision,
      name: input.name.trim(),
      abilityKind: input.abilityKind,
      actor: input.actor,
      text: text.text,
      timings: timing.timings,
      keywords: normalizeKeywords(input.keywords),
      rulesContextIds: input.rulesContextIds,
      sourceRefs: input.sourceRefs,
      ...(input.cost ? { cost: input.cost } : {}),
    },
    diagnostics,
  }
}
