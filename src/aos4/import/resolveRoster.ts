import {
  armyFactions,
  type Aos4Catalog,
  type CanonicalId,
  type ContentEntity,
  type ContentRelationship,
  type Faction,
  type RulesContext,
  type RulesContextId,
} from '../domain'
import { resolveSelection } from '../select'
import { createAos4ArmyDocument, deserializeAos4ArmyDocument, serializeAos4ArmyDocument } from '../state'
import { buildArmyOfRenownIndex, type ArmyOfRenownIndex } from './armiesOfRenown'
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

const kindMatches = (
  entity: ContentEntity,
  kindHint: ParsedRosterSelectionKind,
  armiesOfRenown?: ArmyOfRenownIndex
): boolean => {
  if (kindHint === 'faction') return entity.kind === 'faction'
  if (kindHint === 'warscroll') return entity.kind === 'warscroll'
  if (ENHANCEMENT_KIND_HINTS.has(kindHint)) {
    return entity.kind === 'ability' || entity.kind === 'content-group'
  }
  /**
   * An Army of Renown arrives under the battle-formation hint because that is the slot it occupies.
   *
   * The official app's header always ends `faction | battle formation`, and an Army of Renown takes
   * that trailing slot (`Gloomspite Gitz | Da King's Gitz`) — the roster gives the parser nothing
   * to tell the two apart with. The catalog does distinguish them: an army is a container group
   * carrying its own slug as `groupType`, never `battle-formation`. So accept both here and let
   * the name decide which one the roster meant.
   */
  if (kindHint === 'battle-formation' && armiesOfRenown?.containerIds.has(entity.id)) return true
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

/**
 * The ruleset a roster declared, when it names one we carry.
 *
 * The import preview asks the player which ruleset to use only when this returns nothing, so the
 * question is asked exactly when the roster leaves it open — or names a pack we cannot honour.
 */
export const findDeclaredRulesContext = (
  catalog: Aos4Catalog,
  declaredContext?: string
): RulesContext | undefined => {
  if (!declaredContext?.trim()) return undefined
  const normalized = normalizeImportLabel(declaredContext)
  const matches = catalog.rulesContexts.filter(context => contextAliases(context).includes(normalized))
  if (matches.length !== 1 || !IMPORTABLE_CONTEXT_STATUSES.has(matches[0].status)) return undefined
  return matches[0]
}

/**
 * The season a roster declared, as the year it began.
 *
 * Battlepacks are named by season — "General's Handbook 2025-26" — and that is the only part of
 * the string worth reading once the name itself has failed to match a context we carry. Deliberately
 * narrow: it recognises the four-digit-year form the handbooks use and nothing else, so an
 * unfamiliar battlepack name yields nothing rather than a wrong year.
 */
const declaredSeasonStart = (declaredContext: string | undefined): number | undefined => {
  const match = /\b(20\d{2})\s*[-–—/]\s*\d{2}\b/.exec(declaredContext ?? '')
  return match ? Number(match[1]) : undefined
}

/** What the roster's declared ruleset resolved to, and whether it left content behind. */
interface RulesContextResolution {
  context: RulesContext
  /**
   * The roster named a season that has since lapsed, so its seasonal content is historical.
   *
   * Set here rather than inferred later because this is the only point that sees what the roster
   * actually asked for.
   */
  allowsHistorical: boolean
}

const resolveRulesContext = (
  catalog: Aos4Catalog,
  parsedRoster: ParsedRoster,
  defaultRulesContextId: RulesContextId,
  diagnostics: Aos4ImportDiagnostic[]
): RulesContextResolution | undefined => {
  const declared = findDeclaredRulesContext(catalog, parsedRoster.declaredContext)
  if (declared) return { context: declared, allowsHistorical: false }

  /**
   * A missing or unrecognised battlepack falls back rather than failing.
   *
   * Builders publish new seasons before we carry them, and older rosters name packs we have
   * retired. Neither means the file is unreadable, and the player can change the ruleset in the
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

  /**
   * A lapsed season falls back to the current one *and* keeps what it lost.
   *
   * When a General's Handbook expires, everything it introduced — the `Scourge of Ghyran` unit
   * variants, that season's battle formations — is catalogued as historical rather than deleted,
   * while the army's warscrolls carry on into the new season unchanged. Falling back without the
   * overlay therefore drops exactly the picks that made the list that season's list, and does it
   * silently: the player sees a formation they chose simply missing. The overlay resolves those
   * names where they actually live, without moving the document into a context that holds only
   * 42 warscrolls and could not describe the rest of the army.
   */
  const seasonStart = declaredSeasonStart(parsedRoster.declaredContext)
  const fallbackSeasonStart = declaredSeasonStart(fallback.season)
  const allowsHistorical =
    seasonStart !== undefined && fallbackSeasonStart !== undefined && seasonStart < fallbackSeasonStart

  diagnostics.push({
    code: 'unsupported-context',
    severity: 'warning',
    message: parsedRoster.declaredContext?.trim()
      ? allowsHistorical
        ? `The rules context "${parsedRoster.declaredContext}" has been superseded; using ${fallback.name} with that season's content still available. Change it above if that is wrong.`
        : `The rules context "${parsedRoster.declaredContext}" is not one we carry; using ${fallback.name}. Change it above if that is wrong.`
      : `No rules context was declared; using ${fallback.name}.`,
  })
  return { context: fallback, allowsHistorical }
}

const buildReachableIds = (
  catalog: Aos4Catalog,
  factionId: CanonicalId<'faction'>,
  rulesContextId: RulesContextId,
  armiesOfRenown: ArmyOfRenownIndex
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

  /**
   * An Army of Renown container is reachable when the faction can reach its sections.
   *
   * The generator attaches an army's sections to the faction that offers them, but attaches
   * nothing to the container itself — it exists only as the parent of those sections, with no
   * inbound edge from anything. Traversal therefore never arrives at it, and a roster naming the
   * army would be told it is unavailable to a faction that plainly offers its every rule. Deriving
   * the container's availability from its sections says the same thing the graph already says,
   * without inventing an edge the catalog does not have.
   */
  armiesOfRenown.sectionIdsByContainerId.forEach((sectionIds, containerId) => {
    if (reachable.has(containerId)) return
    const container = entityById.get(containerId)
    if (!container || !isApplicable(container, rulesContextId)) return
    if (sectionIds.some(sectionId => reachable.has(sectionId))) reachable.add(containerId)
  })

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

/**
 * Match a roster's faction label against the armies a player can actually field.
 *
 * The search space is `armyFactions`, not every decoded faction row: `Endless Spells` is a
 * container for universal manifestations rather than an army (#1796), and a roster naming it would
 * resolve to a force with no units instead of failing where the player can see it.
 */
const findFactions = (armies: Faction[], label: string, rulesContextId: RulesContextId): Faction[] => {
  for (const candidate of factionNameCandidates(label)) {
    const normalized = normalizeImportLabel(candidate)
    const matches = armies.filter(
      faction => isApplicable(faction, rulesContextId) && normalizeImportLabel(faction.name) === normalized
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
  armies: Faction[],
  label: string,
  currentContextId: RulesContextId
): RulesContext | undefined => {
  const candidates = catalog.rulesContexts.filter(
    context =>
      context.id !== currentContextId &&
      IMPORTABLE_CONTEXT_STATUSES.has(context.status) &&
      findFactions(armies, label, context.id).length === 1
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

  const armies = armyFactions(catalog)
  let switchedContext: RulesContext | undefined
  const resolved = labels.map(({ label, line }) => {
    let candidates = findFactions(armies, label, rulesContextId)

    if (!candidates.length) {
      const alternative = alternativeContextForFaction(catalog, armies, label, rulesContextId)
      if (alternative) {
        switchedContext = alternative
        candidates = findFactions(armies, label, alternative.id)
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
 * The parenthetical or bracketed qualifiers that restate the rules context being imported into.
 *
 * New Recruit distinguishes a warscroll's seasonal version in its display name — "Killaboss with
 * Stab-grot (Scourge of Aqshy)" — and Listbot shortens the same battlepack qualifier to an acronym
 * such as "[SoA]". The catalog carries that seasonal replacement as its own warscroll named with
 * the battlepack as a prefix ("Scourge of Aqshy Killaboss with Stab-grot"), so a qualified label
 * is first rewritten into that prefixed form; only when no such variant exists is the qualifier
 * treated as redundant and stripped to recover the base warscroll.
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
 * A qualified label rewritten to the catalog's name for the seasonal variant it points at.
 *
 * A General's Handbook replaces some warscrolls for its season, and those replacements are
 * catalogued as distinct entities named with the battlepack prefixed — "Scourge of Aqshy
 * Killaboss with Stab-grot" lives alongside the battletome "Killaboss with Stab-grot" in the same
 * seasonal context. A roster that says "(Scourge of Aqshy)" or "[SoA]" means that replacement, so
 * the qualifier is rewritten into the prefix the catalog uses. This must be attempted *before*
 * the bare qualifier strip: stripping first resolves the battletome warscroll the variant merely
 * shares a base name with, and the player gets the wrong unit's reminders (#1862).
 */
const prefixContextQualifier = (
  label: string,
  context: RulesContext,
  qualifiers: Set<string>
): string | undefined => {
  const base = stripContextQualifier(label, qualifiers)
  const battlepack = context.battlepack?.trim()
  return base && battlepack ? `${battlepack} ${base}` : undefined
}

/**
 * Is this name something the catalog only carries as Legends content?
 *
 * Legends is modelled as its own rules context whose warscrolls are disjoint from the current and
 * seasonal ones. A roster that opted into Legends resolves such names through the Legends overlay;
 * one that did not gets them skipped, and saying *why* by name is the difference between a player
 * understanding the boundary and assuming the importer is broken.
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

/** A rules context a selection may resolve in, with what this faction can reach inside it. */
interface ResolutionContext {
  context: RulesContext
  reachableIds: Set<CanonicalId>
}

const resolveRosterSelection = (
  catalog: Aos4Catalog,
  selection: ParsedRosterSelection,
  /**
   * Contexts to try, in descending order of preference.
   *
   * A roster that opted into Legends holds names from two catalogues at once, and names collide
   * across that boundary — a unit retired to Legends and later reintroduced keeps its name but is
   * a different warscroll. The order encodes which side the roster meant: the document's own
   * context first for ordinary entries, the Legends context first for entries the builder itself
   * filed as Legends. The first context that yields a unique reachable match wins, so a collision
   * resolves to the intended side instead of failing as ambiguous.
   */
  resolutionContexts: ResolutionContext[],
  allowsLegends: boolean,
  armiesOfRenown: ArmyOfRenownIndex,
  diagnostics: Aos4ImportDiagnostic[]
): Aos4ImportMatch | undefined => {
  const matchInContext = ({ context, reachableIds }: ResolutionContext) => {
    const rulesContextId = context.id
    const eligible = catalog.entities.filter(
      entity =>
        isApplicable(entity, rulesContextId) && kindMatches(entity, selection.kindHint, armiesOfRenown)
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
     * Match an Army of Renown's section by the qualified name the roster writes.
     *
     * The catalog calls it `Spell Lore` because it is nested under `Da King’s Gitz`; a flat roster
     * line has to say `Da King's Gitz Spell Lore` or the player could not tell whose lore they
     * picked. Searched separately from {@link matchLabel} rather than folded into `eligible`,
     * because a section's `groupType` is its army's slug — admitting sections to the ordinary kind
     * filter would make a bare `Spell Lore` match all 37 of them and fail as ambiguous. The
     * section's own heading supplies the category instead.
     */
    const matchQualifiedLabel = (label: string): ContentEntity[] => {
      const normalized = normalizeImportLabel(label)
      return catalog.entities.filter(entity => {
        const section = armiesOfRenown.sectionsById.get(entity.id)
        if (!section || !isApplicable(entity, rulesContextId)) return false
        const kindFits =
          ENHANCEMENT_KIND_HINTS.has(selection.kindHint) || section.categoryGroupType === selection.kindHint
        return kindFits && normalizeImportLabel(section.qualifiedName) === normalized
      })
    }

    /**
     * Labels to try, in descending order of confidence.
     *
     * The roster's own wording always wins. A reviewed alias is consulted only when that finds
     * nothing, then the seasonal qualifier rewritten as the catalog's battlepack prefix, and the
     * bare qualifier strip last — so a name the catalog knows verbatim can never be diverted by a
     * correction meant for a different spelling, and a seasonal replacement warscroll is preferred
     * over the base warscroll it shares a name with.
     */
    const qualifiers = contextQualifiers(context)
    const attempts = [
      selection.label,
      aliasedImportLabel(selection.label),
      prefixContextQualifier(selection.label, context, qualifiers),
      stripContextQualifier(selection.label, qualifiers),
    ].filter((label): label is string => Boolean(label))

    /**
     * Collapse a container and its own content matched under one name.
     *
     * A Moulder Mutation such as "Anabolic Accelerators" is modelled twice: a content-group the
     * faction offers, and the ability inside it carrying the rules text. A roster line naming it
     * means that one pick, not two rivals, so a candidate that `includes` another wins over what
     * it contains — the same shape a hand-built army holds, where the offered group is the
     * selectable and brings its ability along.
     */
    const collapseContainedCandidates = (found: ContentEntity[]): ContentEntity[] => {
      if (found.length < 2) return found
      const ids = new Set(found.map(entity => entity.id))
      const contained = new Set(
        catalog.relationships
          .filter(
            relationship =>
              relationship.kind === 'includes' &&
              relationshipIsApplicable(relationship, rulesContextId) &&
              ids.has(relationship.from) &&
              ids.has(relationship.to)
          )
          .map(relationship => relationship.to)
      )
      if (!contained.size) return found
      const containers = found.filter(entity => !contained.has(entity.id))
      return containers.length ? containers : found
    }

    const contextCandidates = collapseContainedCandidates(
      [
        ...attempts.map(label => () => matchLabel(label)),
        ...attempts.map(label => () => matchQualifiedLabel(label)),
      ].reduce<ContentEntity[]>((found, attempt) => (found.length ? found : attempt()), [])
    )
    return { contextCandidates, candidates: contextCandidates.filter(entity => reachableIds.has(entity.id)) }
  }

  const ambiguous = (): undefined => {
    diagnostics.push({
      code: 'ambiguous-selection',
      severity: 'warning',
      message: `"${selection.label}" matches more than one ${selection.kindHint}, so it was not imported. Add it by hand to be sure of the right one.`,
      line: selection.line,
    })
    return undefined
  }
  const matched = (entity: ContentEntity): Aos4ImportMatch => ({
    line: selection.line,
    label: selection.label,
    canonicalId: entity.id,
  })

  const perContext = resolutionContexts.map(resolutionContext => matchInContext(resolutionContext))

  for (const { candidates } of perContext) {
    if (candidates.length === 1) return matched(candidates[0])
    if (candidates.length > 1) return ambiguous()
  }
  const known = perContext.some(({ contextCandidates }) => contextCandidates.length > 0)

  /**
   * A regiment of renown resolves outside the army's faction.
   *
   * The band is bought as a whole and brings units the army has no other way to field — an
   * Ironjawz list can hold Gloomspite, Ossiarch and Kharadron warscrolls through one. Reachability
   * is still tried first above, so a name the faction *can* reach resolves to its own version and
   * collisions are decided the same way as before; this only runs once that found nothing, and
   * still refuses to guess between two candidates.
   */
  if (selection.isRegimentOfRenown && known) {
    for (const { contextCandidates } of perContext) {
      if (contextCandidates.length === 1) return matched(contextCandidates[0])
      if (contextCandidates.length > 1) return ambiguous()
    }
  }

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
  if (!known) {
    const legendsOnly = !allowsLegends && isLegendsOnly(catalog, selection.label, selection.kindHint)
    diagnostics.push({
      code: 'unknown-selection',
      severity: 'warning',
      message: legendsOnly
        ? `"${selection.label}" is Legends content, but this roster does not opt into Legends, so it was not imported.`
        : `Couldn't find a ${selection.kindHint} named "${selection.label}", so it was not imported.`,
      line: selection.line,
    })
    return undefined
  }
  diagnostics.push({
    code: 'inapplicable-selection',
    severity: 'warning',
    message: `"${selection.label}" is not available to this faction in the selected rules context, so it was not imported.`,
    line: selection.line,
  })
  return undefined
}

export const resolveParsedRoster = (
  catalog: Aos4Catalog,
  parsedRoster: ParsedRoster,
  options: ResolveParsedRosterOptions
): Aos4ImportPreview => {
  const diagnostics: Aos4ImportDiagnostic[] = []
  const contextResolution = resolveRulesContext(
    catalog,
    parsedRoster,
    options.defaultRulesContextId,
    diagnostics
  )
  if (!contextResolution) {
    return {
      source: parsedRoster.source,
      matches: [],
      diagnostics: sortDiagnostics(diagnostics),
    }
  }
  const context = contextResolution.context

  const factionResolution = resolveFaction(catalog, parsedRoster, context.id, diagnostics)
  const faction = factionResolution.faction
  if (!faction) {
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
  const allowsLegends = Boolean(parsedRoster.allowsLegends)
  /**
   * Moving the document to another context abandons the superseded-season overlay.
   *
   * The overlay exists to keep a lapsed season's content reachable from the season that replaced
   * it. A faction found only in Legends is a different situation entirely — the document is no
   * longer in a seasonal context at all — so carrying the overlay across would be layering last
   * season's standard-play content onto an army that is not playing standard.
   */
  const allowsHistorical = contextResolution.allowsHistorical && !factionResolution.rulesContext
  const armiesOfRenown = buildArmyOfRenownIndex(catalog)

  /**
   * A roster resolves against its own context *and* whichever overlays it earned.
   *
   * Legends warscrolls live in a context of their own, so without the overlay a list that mixes a
   * faction's current units with its retired ones — exactly what the opt-in is for — could only
   * import half of itself. A lapsed season is the same problem with a different boundary. Both
   * are additive: the document stays in the context that describes the bulk of the army, and the
   * overlay only widens what a name may resolve to. Reachability is computed per context, because
   * the relationship edges that connect a faction to its units are context-scoped too.
   */
  const overlayStatuses = new Set(
    [allowsLegends ? 'legends' : undefined, allowsHistorical ? 'historical' : undefined].filter(
      (status): status is RulesContext['status'] => Boolean(status)
    )
  )
  const overlayContexts = catalog.rulesContexts.filter(
    rulesContext => overlayStatuses.has(rulesContext.status) && rulesContext.id !== effectiveContext.id
  )
  const reachableByContextId = new Map(
    [effectiveContext, ...overlayContexts].map(rulesContext => [
      rulesContext.id,
      buildReachableIds(catalog, faction.id, rulesContext.id, armiesOfRenown),
    ])
  )
  const resolutionContexts = (preferLegends: boolean): ResolutionContext[] =>
    (preferLegends ? [...overlayContexts, effectiveContext] : [effectiveContext, ...overlayContexts]).map(
      rulesContext => ({
        context: rulesContext,
        reachableIds: reachableByContextId.get(rulesContext.id) ?? new Set<CanonicalId>(),
      })
    )

  const matches = [
    ...factionResolution.matches,
    ...parsedRoster.selections
      .filter(selection => selection.kindHint !== 'faction')
      .flatMap(selection => {
        const match = resolveRosterSelection(
          catalog,
          selection,
          resolutionContexts(Boolean(selection.isLegends)),
          allowsLegends,
          armiesOfRenown,
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
    new Set<CanonicalId>([faction.id, ...matches.map(match => match.canonicalId)])
  )
  const selection = resolveSelection(catalog, {
    explicitIds: explicitSelectionIds,
    rulesContextId: effectiveContext.id,
    ...(allowsLegends ? { allowsLegends: true } : {}),
    ...(allowsHistorical ? { allowsHistorical: true } : {}),
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
    ...(allowsLegends ? { allowsLegends: true } : {}),
    ...(allowsHistorical ? { allowsHistorical: true } : {}),
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
