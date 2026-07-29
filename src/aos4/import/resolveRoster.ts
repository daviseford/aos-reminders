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
import { aliasedImportLabel } from './labelAliases'
import { normalizeImportLabel, normalizeImportLabelExact } from './normalizeLabel'
import type {
  Aos4ImportDiagnostic,
  Aos4ImportMatch,
  Aos4ImportPreview,
  ParsedRoster,
  ParsedRosterSelection,
  ParsedRosterSelectionKind,
} from './types'

/**
 * Severity policy: an import fails only when the file cannot be read.
 *
 * Everything past a successful read is a judgement about *content*, and content judgements are
 * reported as warnings so the player still gets their army. Rosters come from other people's
 * builders, built against catalogs maintained by other people, which are variously stale, ahead of
 * ours, or simply wrong — refusing an entire list because one name among forty diverges makes the
 * feature hostage to that drift, and leaves the player staring at a unit they can see in the tool
 * they exported from.
 *
 * This is not a licence to guess. Nothing is ever resolved on a hunch: an unplaceable name is
 * skipped and named in a warning, so the army is incomplete rather than wrong. Silently importing
 * the wrong unit would be far worse than importing without it, because a wrong reminder is one the
 * player has no reason to doubt.
 *
 * The remaining errors are the cases where no army can be produced at all: an unreadable file
 * (raised before this module), no resolvable faction, no usable rules context, or a document that
 * fails to round-trip. Game legality is deliberately not among them.
 */
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

/**
 * Kind hints that name an individual enhancement rather than the group offering it.
 *
 * A roster names the artefact or heroic trait a hero carries ("Charnel Vestments"), while the
 * catalog models the individual enhancement as an `ability` and reserves `content-group` for the
 * container that offers it ("Artefacts of Power"). Matching only the container would mean no
 * enhancement on any real roster could ever resolve, so these hints accept both.
 */
const ENHANCEMENT_KIND_HINTS = new Set<ParsedRosterSelectionKind>(['enhancement', 'artefact-of-power'])

const kindMatches = (entity: ContentEntity, kindHint: ParsedRosterSelectionKind): boolean => {
  if (kindHint === 'faction') return entity.kind === 'faction'
  if (kindHint === 'warscroll') return entity.kind === 'warscroll'
  if (ENHANCEMENT_KIND_HINTS.has(kindHint)) {
    return entity.kind === 'ability' || entity.kind === 'content-group'
  }
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
    /**
     * An unrecognised battlepack falls back rather than failing.
     *
     * Builders publish new seasons before we carry them, and older rosters name packs we have
     * retired. Neither means the file is unreadable, and the player can change the context in the
     * preview, so this reports what happened and continues on the default.
     */
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
      message: `The rules context "${parsedRoster.declaredContext}" is not one we carry; using ${fallback.name}. Change it above if that is wrong.`,
    })
    return fallback
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
  /** Set when the faction only exists outside the context we started in. */
  rulesContext?: RulesContext
  matches: Aos4ImportMatch[]
}

/**
 * Strip a provider's bracketed status marker from a faction name.
 *
 * New Recruit labels retired armies "Beasts of Chaos [LEGENDS]". The bracket is provenance about
 * the catalogue, not part of the army's name, and leaving it in means the faction never matches —
 * which fails the import outright, since without a faction nothing else can resolve.
 */
const PROVIDER_STATUS_SUFFIX = /\s*\[[^\]]*\]\s*$/

const factionNameCandidates = (label: string): string[] => {
  const stripped = label.replace(PROVIDER_STATUS_SUFFIX, '').trim()
  return stripped && stripped !== label.trim() ? [label, stripped] : [label]
}

const findFactions = (catalog: Aos4Catalog, label: string, rulesContextId: RulesContextId): Faction[] => {
  for (const candidate of factionNameCandidates(label)) {
    const normalized = normalizeImportLabel(candidate)
    const matches = catalog.entities.filter(
      (entity): entity is Faction =>
        entity.kind === 'faction' &&
        isApplicable(entity, rulesContextId) &&
        normalizeImportLabel(entity.name) === normalized
    )
    if (matches.length) return matches
  }
  return []
}

/**
 * The importable context a faction can actually be fielded in, when it is absent from the one the
 * roster declared.
 *
 * A Legends-only army — Beasts of Chaos, Bonesplitterz — has no presence in the current or
 * seasonal contexts at all, so importing it there resolves nothing and the player gets an empty
 * army. Its whole catalogue lives in Legends, and moving the *document* there is coherent in a way
 * that mixing contexts is not: every unit in such a list is Legends content.
 */
const alternativeContextForFaction = (
  catalog: Aos4Catalog,
  label: string,
  currentContextId: RulesContextId
): RulesContext | undefined => {
  const candidates = catalog.rulesContexts.filter(
    context =>
      context.id !== currentContextId &&
      IMPORTABLE_CONTEXT_STATUSES.has(context.status) &&
      findFactions(catalog, label, context.id).length === 1
  )
  return candidates.length === 1 ? candidates[0] : undefined
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

  let switchedContext: RulesContext | undefined
  const resolved = labels.map(({ label, line }) => {
    let candidates = findFactions(catalog, label, rulesContextId)

    if (!candidates.length) {
      const alternative = alternativeContextForFaction(catalog, label, rulesContextId)
      if (alternative) {
        switchedContext = alternative
        candidates = findFactions(catalog, label, alternative.id)
        diagnostics.push({
          code: 'unsupported-context',
          severity: 'warning',
          message: `"${label.replace(PROVIDER_STATUS_SUFFIX, '').trim()}" is only available in ${alternative.name}, so the army was imported there.`,
          ...(line === undefined ? {} : { line }),
        })
      }
    }

    if (candidates.length !== 1) {
      diagnostics.push({
        code: candidates.length ? 'ambiguous-selection' : 'missing-faction',
        severity: 'error',
        message: candidates.length
          ? `Faction "${label}" matches more than one catalog faction.`
          : `Faction "${label}" is not available in any supported rules context.`,
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
    ...(switchedContext ? { rulesContext: switchedContext } : {}),
    matches: factionSelections.flatMap(selection =>
      faction ? [{ line: selection.line, label: selection.label, canonicalId: faction.id }] : []
    ),
  }
}

/**
 * The parenthetical or bracketed qualifiers that merely restate the rules context being imported into.
 *
 * New Recruit distinguishes a warscroll's seasonal version in its display name — "Blood Warriors
 * (Scourge of Aqshy)" — but the catalog carries one warscroll whose seasonal differences live in
 * the rules context. Since "Scourge of Aqshy" *is* the battlepack of the context we resolved, the
 * suffix is redundant here and stripping it recovers the base warscroll.
 *
 * Listbot shortens the same battlepack qualifier to an acronym such as "[SoA]".
 *
 * Built from the resolved context only, so a qualifier naming some *other* season is left alone
 * and still fails closed rather than silently resolving to the wrong edition of a unit.
 */
const contextQualifiers = (context: RulesContext): Set<string> => {
  const battlepackAcronym = context.battlepack
    ?.trim()
    .split(/\s+/)
    .map(word => word[0])
    .join('')

  return new Set(
    [context.battlepack, context.season, context.name, battlepackAcronym]
      .flatMap(value => (value?.trim() ? [normalizeImportLabel(value)] : []))
      .filter(Boolean)
  )
}

const stripContextQualifier = (label: string, qualifiers: Set<string>): string | undefined => {
  const match = /^(.*?)\s*(?:\(([^()]*)\)|\[([^[\]]*)\])\s*$/.exec(label.normalize('NFKC'))
  if (!match) return undefined
  const [, base, parentheticalQualifier, bracketedQualifier] = match
  const qualifier = parentheticalQualifier ?? bracketedQualifier
  if (!base.trim() || !qualifiers.has(normalizeImportLabel(qualifier))) return undefined
  return base.trim()
}

/**
 * Is this name something the catalog only carries as Legends content?
 *
 * Legends is modelled as its own rules context whose content is disjoint from the current and
 * seasonal ones — a warscroll is in one or the other, never both. A roster that mixes them
 * therefore cannot be expressed as a single-context document, so these units are skipped. Saying
 * so by name is the difference between a player understanding the limitation and assuming the
 * importer is broken.
 */
const isLegendsOnly = (catalog: Aos4Catalog, label: string, kindHint: ParsedRosterSelectionKind): boolean => {
  const legendsContextIds = new Set(
    catalog.rulesContexts.filter(context => context.status === 'legends').map(context => context.id)
  )
  if (!legendsContextIds.size) return false
  const normalized = normalizeImportLabel(label)
  return catalog.entities.some(
    entity =>
      kindMatches(entity, kindHint) &&
      normalizeImportLabel(entity.name) === normalized &&
      entity.rulesContextIds.some(id => legendsContextIds.has(id))
  )
}

const resolveRosterSelection = (
  catalog: Aos4Catalog,
  selection: ParsedRosterSelection,
  context: RulesContext,
  reachableIds: Set<CanonicalId>,
  allowsLegends: boolean,
  diagnostics: Aos4ImportDiagnostic[]
): Aos4ImportMatch | undefined => {
  const rulesContextId = context.id
  const eligible = catalog.entities.filter(
    entity => isApplicable(entity, rulesContextId) && kindMatches(entity, selection.kindHint)
  )

  /**
   * Match on the exact label first, then on the model-count-stripped form.
   *
   * Going lenient-first makes the catalog's deliberate size variants indistinguishable: both
   * "Crypt Flayers" and "Crypt Flayers (2 models)" reduce to the same string, so every roster
   * naming either one resolved to two candidates and failed as ambiguous. Preferring the exact
   * form lets a roster that says "(2 Models)" pick the variant and one that says nothing pick the
   * base warscroll, while the fallback still absorbs counts the catalog does not model.
   */
  const matchLabel = (label: string): ContentEntity[] => {
    const exact = normalizeImportLabelExact(label)
    const exactCandidates = eligible.filter(entity => normalizeImportLabelExact(entity.name) === exact)
    if (exactCandidates.length) return exactCandidates
    const lenient = normalizeImportLabel(label)
    return eligible.filter(entity => normalizeImportLabel(entity.name) === lenient)
  }

  /**
   * Labels to try, in descending order of confidence.
   *
   * The roster's own wording always wins. A reviewed alias is consulted only when that finds
   * nothing, and the seasonal-qualifier strip last, so a name the catalog knows verbatim can never
   * be diverted by a correction meant for a different spelling.
   */
  const attempts = [
    selection.label,
    aliasedImportLabel(selection.label),
    stripContextQualifier(selection.label, contextQualifiers(context)),
  ].filter((label): label is string => Boolean(label))

  const contextCandidates =
    attempts.reduce<ContentEntity[]>((found, label) => (found.length ? found : matchLabel(label)), []) ?? []
  const candidates = contextCandidates.filter(entity => reachableIds.has(entity.id))

  /**
   * A name we cannot place is skipped and reported, never fatal.
   *
   * Rosters are built in other people's tools against their own data, which goes stale, carries
   * typos, and adds entries before we do. Refusing the whole import over one such name would make
   * the feature hostage to every divergence between two independently maintained catalogs, and
   * the player — who can see the unit perfectly well in the builder they came from — has no way to
   * act on the refusal. Importing the rest and naming what was dropped is both more useful and
   * more honest: we still never guess, so no wrong reminder is ever produced.
   */
  if (!contextCandidates.length) {
    const legendsOnly = isLegendsOnly(catalog, selection.label, selection.kindHint)
    diagnostics.push({
      code: 'unknown-selection',
      severity: 'warning',
      message: legendsOnly
        ? `"${selection.label}" is Legends content${
            allowsLegends ? ' and this roster allows Legends' : ''
          }, but Legends cannot be combined with ${context.name} yet, so it was not imported.`
        : `Couldn't find a ${selection.kindHint} named "${selection.label}", so it was not imported.`,
      line: selection.line,
    })
    return undefined
  }
  if (!candidates.length) {
    diagnostics.push({
      code: 'inapplicable-selection',
      severity: 'warning',
      message: `"${selection.label}" is not available to this faction in the selected rules context, so it was not imported.`,
      line: selection.line,
    })
    return undefined
  }
  if (candidates.length !== 1) {
    diagnostics.push({
      code: 'ambiguous-selection',
      severity: 'warning',
      message: `"${selection.label}" matches more than one ${selection.kindHint}, so it was not imported. Add it by hand to be sure of the right one.`,
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

  /**
   * A faction found only elsewhere moves the whole document to that context, so the units in the
   * list are resolved somewhere they can actually exist.
   */
  const effectiveContext = factionResolution.rulesContext ?? context
  const reachableIds = buildReachableIds(catalog, factionResolution.faction.id, effectiveContext.id)
  const matches = [
    ...factionResolution.matches,
    ...parsedRoster.selections
      .filter(selection => selection.kindHint !== 'faction')
      .flatMap(selection => {
        const match = resolveRosterSelection(
          catalog,
          selection,
          effectiveContext,
          reachableIds,
          Boolean(parsedRoster.allowsLegends),
          diagnostics
        )
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
    rulesContextId: effectiveContext.id,
  })
  const selectionErrors = selection.diagnostics.filter(diagnostic => diagnostic.severity === 'error')
  if (selectionErrors.length) {
    /**
     * A composition the selection graph objects to is reported, not rejected.
     *
     * Whether an army is legal to field belongs to a list builder and a tournament organiser, not
     * to us — we turn a list into reminders. Players import part-built lists, over-points lists,
     * and lists whose legality depends on rules we do not model, and all of them still want their
     * reminders. The document is only abandoned below if it cannot be built at all.
     */
    diagnostics.push({
      code: 'invalid-selection-graph',
      severity: 'warning',
      message: `The imported composition may not be legal to field: ${selectionErrors
        .map(diagnostic => diagnostic.code)
        .join(', ')}.`,
    })
  }

  const proposedDocument = createAos4ArmyDocument({
    id: options.createDocumentId(),
    name: parsedRoster.proposedName.trim() || 'Imported Army',
    rulesContextId: effectiveContext.id,
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
