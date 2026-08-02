import type {
  Aos4ImportDiagnostic,
  Aos4ParsedRosterResult,
  ParsedRosterSelection,
  ParsedRosterSelectionKind,
} from '../aos4/import'
import { MAX_IMPORT_SELECTIONS } from './detectTextSource'

/**
 * One roster tree, whichever way New Recruit serialised it.
 *
 * New Recruit exports the same list three ways: `.ros` XML, that XML zipped as `.rosz`, and a
 * `.json` mechanical transliteration of it — same field names, containers as arrays, numeric and
 * boolean attributes typed. Because they are the same tree, they have to import to the same army,
 * and the only way to *guarantee* that is to have one reader for all of them rather than two that
 * agree today.
 *
 * So each format contributes only a validating adapter that presents its own parse as `RosterNode`,
 * and everything a roster *means* — which selections are units, which are enhancements, which side
 * of the Legends boundary the builder filed an entry on — is written once, here.
 */
export interface RosterNode {
  /** Element name in XML; the key its container array was written under in JSON. */
  name: string
  /**
   * The containing node, absent at the root.
   *
   * Parentage is load-bearing rather than incidental: an army unit is a `selection` sitting
   * directly in a `force`'s `selections`, and the same shape nested one level deeper is a model or
   * an upgrade of the unit above it. The JSON adapter therefore synthesises the container level
   * that its arrays leave implicit, so both formats answer this question identically.
   */
  parent?: RosterNode
  /** 1-based line in the file the player supplied, for diagnostics. */
  line: number
  attribute(key: string): string | undefined
  children(): RosterNode[]
}

export const rosterError = (code: Aos4ImportDiagnostic['code'], message: string): Aos4ParsedRosterResult => ({
  diagnostics: [{ code, severity: 'error', message }],
})

export const childrenNamed = (node: RosterNode, name: string): RosterNode[] =>
  node.children().filter(child => child.name === name)

/** Every descendant with this name, in document order, including the root itself. */
export const descendantsNamed = (root: RosterNode, name: string): RosterNode[] => {
  const found: RosterNode[] = []
  const visit = (node: RosterNode) => {
    if (node.name === name) found.push(node)
    node.children().forEach(visit)
  }
  visit(root)
  return found
}

const groupKind = (group: string): ParsedRosterSelectionKind | undefined => {
  if (/^Battle Formations(?:\b|:)/i.test(group)) return 'battle-formation'
  if (/^Artefacts? of Power(?:\b|:)/i.test(group)) return 'artefact-of-power'
  if (/^Heroic Traits?(?:\b|:)/i.test(group)) return 'enhancement'
  if (/^Spell Lores?(?:\b|:)/i.test(group)) return 'spell-lore'
  if (/^Prayer Lores?(?:\b|:)/i.test(group)) return 'prayer-lore'
  if (/^Manifestation Lores?(?:\b|:)/i.test(group)) return 'manifestation-lore'
  if (/^Regiments? of Renown(?:\b|:)/i.test(group)) return 'regiment-of-renown'
  return undefined
}

/**
 * New Recruit marks each retired entry with a `Legends` category on the selection itself, which is
 * a far stronger signal than recognising the name later: it says which side of the Legends
 * boundary *the builder* filed this entry on. Only the selection's direct `categories` child is
 * consulted — the same category id also appears on nested upgrade children, which describe the
 * upgrade, not the unit.
 */
const hasLegendsCategory = (selection: RosterNode): boolean =>
  childrenNamed(selection, 'categories')
    .flatMap(container => childrenNamed(container, 'category'))
    .some(category => category.attribute('name')?.trim().toLocaleLowerCase('en') === 'legends')

/**
 * A unit's label is the roster's own wording, parenthetical qualifier and all.
 *
 * This used to collapse "Killaboss with Stab-grot (Scourge of Aqshy)" to the nested model's name,
 * on the theory that the parenthetical merely restated the season being imported into. It does
 * not: the qualifier is New Recruit distinguishing a General's Handbook replacement warscroll —
 * a distinct catalog entity — from the battletome one, and the same shape carries the catalog's
 * genuine size variants ("Stormdrake Guard (1 model)"). Erasing it here resolved every such unit
 * to the base warscroll and handed the player the wrong reminders (#1862). Interpreting a
 * qualifier requires knowing the rules context, so that judgement belongs to resolution, not
 * parsing.
 */
const unitLabel = (selection: RosterNode): string => selection.attribute('name')?.trim() ?? ''

const declaredContextFromForce = (force: RosterNode): string | undefined => {
  const name = (force.attribute('name') ?? '').replace(/^[^A-Za-z0-9]+/, '').trim()
  const supportedShape = name.match(
    /(?:General['’]s Handbook|GHB)\b.*$|^(?:Spearhead|Legends|Current Standard)\b.*$/i
  )
  return supportedShape?.[0].trim()
}

/**
 * Read composition out of a validated roster tree.
 *
 * The caller has already established that this is a roster at all — a well-formed document with a
 * single supported root. What remains is true of every serialisation: the export has to be marked
 * as an AoS 4 roster-schema export, carry exactly one army force, and name a faction catalogue.
 */
export const parseAos4RosterTree = (root: RosterNode): Aos4ParsedRosterResult => {
  if (
    root.attribute('gameSystemName') !== 'Age of Sigmar 4.0' ||
    !/^2\./.test(root.attribute('battleScribeVersion') ?? '')
  ) {
    return rosterError(
      'unsupported-source',
      'The roster is not marked as an Age of Sigmar 4.0 roster-schema export.'
    )
  }

  const allSelections = descendantsNamed(root, 'selection')
  if (allSelections.length > MAX_IMPORT_SELECTIONS) {
    return rosterError(
      'input-too-large',
      `A roster may contain at most ${MAX_IMPORT_SELECTIONS} selection nodes.`
    )
  }

  const topForces = childrenNamed(root, 'forces').flatMap(container => childrenNamed(container, 'force'))
  if (topForces.length !== 1) {
    return rosterError('unsafe-input', 'The roster must contain exactly one top-level army force.')
  }
  const topForce = topForces[0]
  const declaredFaction = topForce.attribute('catalogueName')?.trim()
  if (!declaredFaction) {
    return rosterError('missing-faction', 'The roster does not declare a faction catalogue.')
  }

  const selections: ParsedRosterSelection[] = []
  allSelections.forEach(selection => {
    const group = selection.attribute('group')?.trim()
    const kindHint = group ? groupKind(group) : undefined
    if (kindHint) {
      const label = selection.attribute('name')?.trim()
      if (label) {
        selections.push({
          line: selection.line,
          label,
          kindHint,
          ...(hasLegendsCategory(selection) ? { isLegends: true } : {}),
        })
      }
      return
    }

    const container = selection.parent
    const parent = container?.parent
    /**
     * A `unit` nested inside another selection is normally a model or a piece of the unit above
     * it. The exception is a manifestation: New Recruit files each manifestation warscroll as a
     * `unit` under the chosen manifestation lore, and those are warscrolls the player summons and
     * fields, not parts of the lore (#1854).
     */
    const parentGroup = parent?.name === 'selection' ? parent.attribute('group')?.trim() : undefined
    const isManifestationUnit = Boolean(parentGroup && groupKind(parentGroup) === 'manifestation-lore')
    if (
      selection.attribute('type') !== 'unit' ||
      container?.name !== 'selections' ||
      (parent?.name !== 'force' && !isManifestationUnit)
    ) {
      return
    }
    const label = unitLabel(selection)
    if (!label) return
    const count = Number(selection.attribute('number'))
    selections.push({
      line: selection.line,
      label,
      kindHint: 'warscroll',
      ...(Number.isFinite(count) && count > 1 ? { count } : {}),
      ...(hasLegendsCategory(selection) ? { isLegends: true } : {}),
    })
  })

  const declaredContext = declaredContextFromForce(topForce)
  /**
   * New Recruit records the Legends opt-in as an ordinary configuration selection rather than an
   * attribute, so it is recognised by name. Without it, a roster full of retired warscrolls is
   * indistinguishable from one full of typos.
   */
  const allowsLegends = allSelections.some(
    selection => selection.attribute('name')?.trim().toLocaleLowerCase('en') === 'allow legends'
  )

  return {
    parsedRoster: {
      /**
       * All three exports report the same source, because to the player they are the same thing:
       * the preview says "New Recruit roster file" either way, and the roster that comes out is
       * identical. Splitting the identifier per serialisation would put a distinction in the model
       * that nothing downstream — resolution, preview, or the document — has any reason to make.
       */
      source: 'roster-xml',
      proposedName: root.attribute('name')?.trim() || `${declaredFaction} imported army`,
      declaredFaction,
      ...(declaredContext ? { declaredContext } : {}),
      ...(allowsLegends ? { allowsLegends } : {}),
      selections,
    },
    diagnostics: [],
  }
}
