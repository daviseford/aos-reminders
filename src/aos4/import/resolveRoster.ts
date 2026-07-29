import type {
  Aos4Catalog,
  CanonicalId,
  ContentEntity,
  ContentRelationship,
  Faction,
  RulesContext,
  RulesContextId,
} from '../domain'
import { resolveSelection } from '../select'
import { createAos4ArmyDocument, deserializeAos4ArmyDocument, serializeAos4ArmyDocument } from '../state'
import { normalizeImportLabel } from './normalizeLabel'
import type {
  Aos4ImportDiagnostic,
  Aos4ImportMatch,
  Aos4ImportPreview,
  ParsedRoster,
  ParsedRosterSelection,
  ParsedRosterSelectionKind,
} from './types'

export interface ResolveParsedRosterOptions {
  defaultRulesContextId: RulesContextId
  createDocumentId: () => string
}

const IMPORTABLE_CONTEXT_STATUSES = new Set<RulesContext['status']>(['current', 'seasonal', 'legends'])
const REACHABLE_RELATIONSHIP_KINDS = new Set<ContentRelationship['kind']>(['offers', 'includes', 'requires'])

const sortDiagnostics = (diagnostics: Aos4ImportDiagnostic[]): Aos4ImportDiagnostic[] =>
  diagnostics.sort(
    (left, right) =>
      (left.line ?? Number.MAX_SAFE_INTEGER) - (right.line ?? Number.MAX_SAFE_INTEGER) ||
      left.code.localeCompare(right.code) ||
      left.message.localeCompare(right.message)
  )

const sortMatches = (matches: Aos4ImportMatch[]): Aos4ImportMatch[] =>
  matches.sort(
    (left, right) =>
      left.line - right.line ||
      left.label.localeCompare(right.label) ||
      left.canonicalId.localeCompare(right.canonicalId)
  )

const isApplicable = (entity: ContentEntity, rulesContextId: RulesContextId): boolean =>
  entity.rulesContextIds.includes(rulesContextId)

const relationshipIsApplicable = (
  relationship: ContentRelationship,
  rulesContextId: RulesContextId
): boolean => !relationship.rulesContextIds?.length || relationship.rulesContextIds.includes(rulesContextId)

const kindMatches = (entity: ContentEntity, kindHint: ParsedRosterSelectionKind): boolean => {
  if (kindHint === 'faction') return entity.kind === 'faction'
  if (kindHint === 'warscroll') return entity.kind === 'warscroll'
  return entity.kind === 'content-group' && entity.groupType === kindHint
}

const contextAliases = (context: RulesContext): string[] => {
  const aliases = [context.id, context.name, context.battlepack, context.season]
  if (context.season) {
    aliases.push(`GHB ${context.season}`, `General's Handbook ${context.season}`)
  }
  aliases.push(context.name.replace(/^Age of Sigmar Fourth Edition\s*/i, ''))
  return aliases.flatMap(alias => (alias?.trim() ? [normalizeImportLabel(alias)] : []))
}

const resolveRulesContext = (
  catalog: Aos4Catalog,
  parsedRoster: ParsedRoster,
  defaultRulesContextId: RulesContextId,
  diagnostics: Aos4ImportDiagnostic[]
): RulesContext | undefined => {
  if (!parsedRoster.declaredContext?.trim()) {
    const fallback = catalog.rulesContexts.find(context => context.id === defaultRulesContextId)
    if (!fallback || !IMPORTABLE_CONTEXT_STATUSES.has(fallback.status)) {
      diagnostics.push({
        code: 'unsupported-context',
        severity: 'error',
        message: 'The default rules context is not available for import.',
      })
      return undefined
    }
    diagnostics.push({
      code: 'unsupported-context',
      severity: 'warning',
      message: `No rules context was declared; using ${fallback.name}.`,
    })
    return fallback
  }

  const normalized = normalizeImportLabel(parsedRoster.declaredContext)
  const matches = catalog.rulesContexts.filter(context => contextAliases(context).includes(normalized))
  if (matches.length !== 1 || !IMPORTABLE_CONTEXT_STATUSES.has(matches[0].status)) {
    diagnostics.push({
      code: 'unsupported-context',
      severity: 'error',
      message: `The declared rules context "${parsedRoster.declaredContext}" is not supported for import.`,
    })
    return undefined
  }
  return matches[0]
}

const buildReachableIds = (
  catalog: Aos4Catalog,
  factionId: CanonicalId<'faction'>,
  rulesContextId: RulesContextId
): Set<CanonicalId> => {
  const entityById = new Map(catalog.entities.map(entity => [entity.id, entity]))
  const outgoing = new Map<CanonicalId, ContentRelationship[]>()
  catalog.relationships
    .filter(
      relationship =>
        REACHABLE_RELATIONSHIP_KINDS.has(relationship.kind) &&
        relationshipIsApplicable(relationship, rulesContextId)
    )
    .forEach(relationship => {
      outgoing.set(relationship.from, [...(outgoing.get(relationship.from) ?? []), relationship])
    })

  const reachable = new Set<CanonicalId>([factionId])
  const queue: CanonicalId[] = [factionId]
  for (let index = 0; index < queue.length; index += 1) {
    const from = queue[index]
    ;(outgoing.get(from) ?? []).forEach(relationship => {
      const target = entityById.get(relationship.to)
      if (!target || !isApplicable(target, rulesContextId) || reachable.has(target.id)) return
      reachable.add(target.id)
      queue.push(target.id)
    })
  }
  return reachable
}

interface FactionResolution {
  faction?: Faction
  matches: Aos4ImportMatch[]
}

const resolveFaction = (
  catalog: Aos4Catalog,
  parsedRoster: ParsedRoster,
  rulesContextId: RulesContextId,
  diagnostics: Aos4ImportDiagnostic[]
): FactionResolution => {
  const factionSelections = parsedRoster.selections.filter(selection => selection.kindHint === 'faction')
  const labels = parsedRoster.declaredFaction?.trim()
    ? [{ label: parsedRoster.declaredFaction, line: undefined }]
    : factionSelections.map(selection => ({ label: selection.label, line: selection.line }))

  if (!labels.length) {
    diagnostics.push({
      code: 'missing-faction',
      severity: 'error',
      message: 'The roster does not declare a supported faction.',
    })
    return { matches: [] }
  }

  const resolved = labels.map(({ label, line }) => {
    const normalized = normalizeImportLabel(label)
    const candidates = catalog.entities.filter(
      (entity): entity is Faction =>
        entity.kind === 'faction' &&
        isApplicable(entity, rulesContextId) &&
        normalizeImportLabel(entity.name) === normalized
    )
    if (candidates.length !== 1) {
      diagnostics.push({
        code: candidates.length ? 'ambiguous-selection' : 'missing-faction',
        severity: 'error',
        message: candidates.length
          ? `Faction "${label}" matches more than one catalog faction.`
          : `Faction "${label}" is not available in the selected rules context.`,
        ...(line === undefined ? {} : { line }),
      })
      return undefined
    }
    return { faction: candidates[0], label, line }
  })

  const factionIds = new Set(resolved.flatMap(value => (value ? [value.faction.id] : [])))
  if (factionIds.size !== 1) {
    if (factionIds.size > 1) {
      diagnostics.push({
        code: 'ambiguous-selection',
        severity: 'error',
        message: 'The roster declares more than one faction.',
      })
    }
    return { matches: [] }
  }

  const faction = resolved.find(value => value)?.faction
  return {
    faction,
    matches: factionSelections.flatMap(selection =>
      faction ? [{ line: selection.line, label: selection.label, canonicalId: faction.id }] : []
    ),
  }
}

const resolveRosterSelection = (
  catalog: Aos4Catalog,
  selection: ParsedRosterSelection,
  rulesContextId: RulesContextId,
  reachableIds: Set<CanonicalId>,
  diagnostics: Aos4ImportDiagnostic[]
): Aos4ImportMatch | undefined => {
  const normalized = normalizeImportLabel(selection.label)
  const contextCandidates = catalog.entities.filter(
    entity =>
      isApplicable(entity, rulesContextId) &&
      kindMatches(entity, selection.kindHint) &&
      normalizeImportLabel(entity.name) === normalized
  )
  const candidates = contextCandidates.filter(entity => reachableIds.has(entity.id))

  if (!contextCandidates.length) {
    diagnostics.push({
      code: 'unknown-selection',
      severity: 'error',
      message: `No ${selection.kindHint} named "${selection.label}" exists in the selected rules context.`,
      line: selection.line,
    })
    return undefined
  }
  if (!candidates.length) {
    diagnostics.push({
      code: 'inapplicable-selection',
      severity: 'error',
      message: `"${selection.label}" is not available to the resolved faction.`,
      line: selection.line,
    })
    return undefined
  }
  if (candidates.length !== 1) {
    diagnostics.push({
      code: 'ambiguous-selection',
      severity: 'error',
      message: `"${selection.label}" matches more than one applicable ${selection.kindHint}.`,
      line: selection.line,
    })
    return undefined
  }

  return {
    line: selection.line,
    label: selection.label,
    canonicalId: candidates[0].id,
  }
}

export const resolveParsedRoster = (
  catalog: Aos4Catalog,
  parsedRoster: ParsedRoster,
  options: ResolveParsedRosterOptions
): Aos4ImportPreview => {
  const diagnostics: Aos4ImportDiagnostic[] = []
  const context = resolveRulesContext(catalog, parsedRoster, options.defaultRulesContextId, diagnostics)
  if (!context) {
    return {
      source: parsedRoster.source,
      matches: [],
      diagnostics: sortDiagnostics(diagnostics),
    }
  }

  const factionResolution = resolveFaction(catalog, parsedRoster, context.id, diagnostics)
  if (!factionResolution.faction) {
    return {
      source: parsedRoster.source,
      matches: sortMatches(factionResolution.matches),
      diagnostics: sortDiagnostics(diagnostics),
    }
  }

  const reachableIds = buildReachableIds(catalog, factionResolution.faction.id, context.id)
  const matches = [
    ...factionResolution.matches,
    ...parsedRoster.selections
      .filter(selection => selection.kindHint !== 'faction')
      .flatMap(selection => {
        const match = resolveRosterSelection(catalog, selection, context.id, reachableIds, diagnostics)
        return match ? [match] : []
      }),
  ]

  if (diagnostics.some(diagnostic => diagnostic.severity === 'error')) {
    return {
      source: parsedRoster.source,
      matches: sortMatches(matches),
      diagnostics: sortDiagnostics(diagnostics),
    }
  }

  const explicitSelectionIds = Array.from(
    new Set<CanonicalId>([factionResolution.faction.id, ...matches.map(match => match.canonicalId)])
  )
  const selection = resolveSelection(catalog, {
    explicitIds: explicitSelectionIds,
    rulesContextId: context.id,
  })
  const selectionErrors = selection.diagnostics.filter(diagnostic => diagnostic.severity === 'error')
  if (selectionErrors.length) {
    diagnostics.push({
      code: 'invalid-selection-graph',
      severity: 'error',
      message: `The imported composition is not valid: ${selectionErrors
        .map(diagnostic => diagnostic.code)
        .join(', ')}.`,
    })
    return {
      source: parsedRoster.source,
      matches: sortMatches(matches),
      diagnostics: sortDiagnostics(diagnostics),
    }
  }

  const proposedDocument = createAos4ArmyDocument({
    id: options.createDocumentId(),
    name: parsedRoster.proposedName.trim() || 'Imported Army',
    rulesContextId: context.id,
    explicitSelectionIds,
  })
  const roundTrip = deserializeAos4ArmyDocument(serializeAos4ArmyDocument(proposedDocument), catalog)
  if (!roundTrip.document || roundTrip.diagnostics.some(diagnostic => diagnostic.severity === 'error')) {
    diagnostics.push({
      code: 'invalid-selection-graph',
      severity: 'error',
      message: 'The imported composition did not produce a valid AoS 4 army document.',
    })
    return {
      source: parsedRoster.source,
      matches: sortMatches(matches),
      diagnostics: sortDiagnostics(diagnostics),
    }
  }

  return {
    source: parsedRoster.source,
    proposedDocument: roundTrip.document,
    matches: sortMatches(matches),
    diagnostics: sortDiagnostics(diagnostics),
  }
}
