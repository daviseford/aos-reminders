import {
  TURN_PHASES,
  type AbilityTiming,
  type Aos4Catalog,
  type CanonicalId,
  type CombatPriority,
  type ContentEntity,
  type RulesContextId,
  type TimingKind,
  type TimingPerspective,
  type UsageLimit,
  type UsageScope,
} from '../domain'
import {
  gameWindowKey,
  projectReminders,
  type ProjectedReminder,
  type ReminderOccurrenceId,
} from '../reminders'
import { resolveSelection } from '../select'
import type { Aos4ArmyDocument } from '../state'

const phaseNames = new Map(TURN_PHASES.map(phase => [phase.id, phase.name]))

const windowLabel = (timing: AbilityTiming): string => {
  switch (timing.window.kind) {
    case 'battle-start':
      return 'Start of Battle'
    case 'deployment':
      return 'Deployment'
    case 'battle-round-start':
      return `Start of Battle Round${timing.window.round ? ` ${timing.window.round}` : ''}`
    case 'phase-independent':
      return 'No Named Phase'
    case 'turn-phase':
      return `${phaseNames.get(timing.window.phase) ?? timing.window.phase} Phase`
    case 'battle-round-end':
      return `End of Battle Round${timing.window.round ? ` ${timing.window.round}` : ''}`
    case 'battle-end':
      return 'End of Battle'
    case 'reaction':
      return 'Triggered Reaction'
    case 'always':
      return 'Passive'
    case 'unknown':
      return 'Timing Requires Review'
  }
}

const titleCase = (value: string): string =>
  value
    .split('-')
    .map(part => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(' ')

const timingDetails = (timing: AbilityTiming): string[] => [
  titleCase(timing.kind),
  ...(timing.perspective ? [`${titleCase(timing.perspective)} turn`] : []),
  ...(timing.priority ? [titleCase(timing.priority)] : []),
  ...(timing.usage
    ? [`${timing.usage.limit} per ${timing.usage.period.replace('-', ' ')} (${timing.usage.scope})`]
    : []),
]

/**
 * Tone drives colour and fill in both renderers. It names the *facet*, not a palette entry, so the
 * web theme and the PDF can disagree about the exact colour while agreeing about the meaning.
 */
export type Aos4ReminderTagTone =
  | 'cost'
  | 'kind-active'
  | 'kind-reaction'
  | 'kind-passive'
  | 'turn-your'
  | 'turn-enemy'
  | 'turn-neutral'
  | 'usage'
  | 'priority'
  | 'source'
  | 'provenance'
  | 'keyword'

export interface Aos4ReminderTag {
  label: string
  tone: Aos4ReminderTagTone
  /** Plain-language expansion. The abbreviated labels are not self-explanatory, least of all the
   * usage scope, where `unit` and `army` mean very different things at the table. */
  description: string
}

const kindDescription: Record<TimingKind, string> = {
  active: 'Used by declaring it during the listed window.',
  reaction: 'Used only when its trigger happens, interrupting the current sequence.',
  passive: 'Always in effect. There is nothing to declare.',
}

const perspectiveDescription: Record<TimingPerspective, string> = {
  your: 'Only during your own turn.',
  enemy: "Only during your opponent's turn.",
  any: "During either player's turn.",
  neutral: "Not tied to either player's turn.",
}

const usageScopeDescription: Record<UsageScope, string> = {
  unit: 'to each unit separately',
  army: 'across your whole army',
  player: 'to you as a player',
}

const usageDescription = (usage: UsageLimit): string =>
  `Can be used ${usage.limit} time${usage.limit === 1 ? '' : 's'} per ${usage.period.replace('-', ' ')}. ` +
  `That limit applies ${usageScopeDescription[usage.scope]}.`

const priorityDescription: Record<CombatPriority, string> = {
  'strike-first': 'Fights before units that do not strike first.',
  normal: 'Fights in the normal sequence.',
  'strike-last': 'Fights after units that do not strike last.',
}

const kindTone: Record<TimingKind, Aos4ReminderTagTone> = {
  active: 'kind-active',
  reaction: 'kind-reaction',
  passive: 'kind-passive',
}

const perspectiveTone = (perspective: TimingPerspective): Aos4ReminderTagTone => {
  switch (perspective) {
    case 'your':
      return 'turn-your'
    case 'enemy':
      return 'turn-enemy'
    default:
      return 'turn-neutral'
  }
}

const costTag = (reminder: ProjectedReminder): Aos4ReminderTag | undefined => {
  const cost = reminder.cost
  if (cost?.kind !== 'command-points') return undefined
  return {
    label: `${cost.value} CP`,
    tone: 'cost',
    description: `Costs ${cost.value} command point${cost.value === 1 ? '' : 's'} to use.`,
  }
}

/**
 * The same four facets `timingDetails` flattens into a string, kept discrete so each can be styled
 * and scanned on its own.
 *
 * Two deliberate differences from `typeLabel`: a `normal` combat priority is dropped because it is
 * the default and carries no information, and the usage limit is compressed to `1 / turn · army`,
 * which survives a narrow print column where `1 per turn (army)` does not.
 */
const timingTags = (timing: AbilityTiming): Aos4ReminderTag[] => [
  {
    label: titleCase(timing.kind),
    tone: kindTone[timing.kind],
    description: kindDescription[timing.kind],
  },
  ...(timing.perspective
    ? [
        {
          label: `${titleCase(timing.perspective)} turn`,
          tone: perspectiveTone(timing.perspective),
          description: perspectiveDescription[timing.perspective],
        },
      ]
    : []),
  ...(timing.priority && timing.priority !== 'normal'
    ? [
        {
          label: titleCase(timing.priority),
          tone: 'priority' as const,
          description: priorityDescription[timing.priority],
        },
      ]
    : []),
  ...(timing.usage
    ? [
        {
          label: `${timing.usage.limit} / ${timing.usage.period.replace('-', ' ')} · ${timing.usage.scope}`,
          tone: 'usage' as const,
          description: usageDescription(timing.usage),
        },
      ]
    : []),
]

export interface Aos4ReminderViewModel {
  id: ReminderOccurrenceId
  name: string
  windowKey: string
  windowLabel: string
  /** Flattened facets, retained for the accessible label and any text-only consumer. */
  typeLabel: string
  /** The same facets, discrete, for tag rendering on screen and in print. */
  tags: Aos4ReminderTag[]
  accessibleLabel: string
  declare?: string
  reactionTrigger?: string
  effect: string
  hidden: boolean
  note?: string
  order?: number
  sourceRecordIds: string[]
  /** The game-wide rules module carrying this reminder, when one does. Text-only provenance data;
   * the tag row renders the quieter `provenance` tone instead (see `provenanceTag`). */
  rulesModule?: string
  projected: ProjectedReminder
}

/**
 * Names the selection that put this reminder in the army, so an ability is recognizable as
 * belonging to what the player picked (issue #1836: Well-Fed Beasts grants HORN TOSS, and nothing
 * on the HORN TOSS reminder said so). One tag per distinct granting source:
 *
 * - An ability with a warscroll ancestor is that unit's own — its warscroll name wins, even when
 *   the unit itself arrived through a group (a Regiment of Renown).
 * - Otherwise the cause's root names the grant when the root is a picked content-group: a spell
 *   lore, an enhancement trait, an Army of Renown. Faction-rooted content is deliberately
 *   untagged — stamping the faction name on every automatic battle trait and core rule is noise.
 *
 * A tag that would repeat the reminder's own name is dropped: enhancement picks are groups named
 * after their single ability, and "Tunnel Master — Tunnel Master" attributes nothing.
 */
const sourceTags = (
  reminder: ProjectedReminder,
  entityById: Map<CanonicalId, ContentEntity>
): Aos4ReminderTag[] => {
  const tagsByLabel = new Map<string, Aos4ReminderTag>()
  reminder.causes.forEach(cause => {
    const ancestors = cause.entityPath.slice(0, -1)
    for (let index = ancestors.length - 1; index >= 0; index -= 1) {
      const ancestor = entityById.get(ancestors[index])
      if (ancestor?.kind === 'warscroll') {
        tagsByLabel.set(ancestor.name, {
          label: ancestor.name,
          tone: 'source',
          description: `Printed on the ${ancestor.name} warscroll. Only that unit uses it.`,
        })
        return
      }
    }
    const root = entityById.get(cause.rootId)
    if (root?.kind === 'content-group') {
      tagsByLabel.set(root.name, {
        label: root.name,
        tone: 'source',
        description: `In your army because you took ${root.name}.`,
      })
    }
  })
  return Array.from(tagsByLabel.values())
    .filter(tag => tag.label.toLowerCase() !== reminder.name.toLowerCase())
    .sort((left, right) => left.label.localeCompare(right.label))
}

/**
 * Names where a faction-automatic reminder actually comes from, for the rules `sourceTags`
 * deliberately leaves untagged (issue #1857: MUSICIAN, the season counter, and Bull Charge all
 * looked equally faction-owned). One quiet tag, three families, checked in this order:
 *
 * - A rules-module ancestor (The Core Rules) names a game-wide module every army includes.
 * - An ability that exists only in a seasonal rules context is the season's, not the faction's —
 *   the current corpus carries these as a faction-rooted `Season Rules 2026-27` group.
 * - A battle-trait group under the faction root is the faction's own battletome battle traits.
 *
 * Anything else faction-rooted stays untagged rather than guessing. The tone is `provenance`, not
 * `source`: a source tag names something the player picked, and tests and consumers filter on that
 * distinction.
 */
const provenanceTag = (
  reminder: ProjectedReminder,
  entityById: Map<CanonicalId, ContentEntity>,
  seasonalContextIds: ReadonlySet<RulesContextId>
): Aos4ReminderTag | undefined => {
  for (const cause of reminder.causes) {
    const ancestors = cause.entityPath.slice(0, -1).map(id => entityById.get(id))

    const module = ancestors.find(
      ancestor => ancestor?.kind === 'content-group' && ancestor.groupType === 'rules-module'
    )
    if (module) {
      return /core rules/i.test(module.name)
        ? {
            label: 'Core Rules',
            tone: 'provenance',
            description: 'From the core rules. Every army uses this.',
          }
        : {
            label: module.name,
            tone: 'provenance',
            description: `From ${module.name}, which every army includes.`,
          }
    }

    const ability = entityById.get(cause.entityPath[cause.entityPath.length - 1])
    if (
      ability &&
      ability.rulesContextIds.length > 0 &&
      ability.rulesContextIds.every(id => seasonalContextIds.has(id))
    ) {
      // The nearest carrying group names the season's package, e.g. `Season Rules 2026-27`.
      const carrier = [...ancestors].reverse().find(ancestor => ancestor?.kind === 'content-group')
      return {
        label: 'Seasonal',
        tone: 'provenance',
        description: `From ${carrier ? carrier.name : "the current season's rules"} — every army uses these while the season lasts.`,
      }
    }

    const battleTraits = ancestors.find(
      ancestor => ancestor?.kind === 'content-group' && ancestor.groupType === 'battle-trait'
    )
    const root = entityById.get(cause.rootId)
    if (battleTraits && root?.kind === 'faction') {
      return {
        label: battleTraits.name,
        tone: 'provenance',
        description: `One of ${root.name}'s battle traits. In your army automatically.`,
      }
    }
  }
  return undefined
}

/**
 * Ability keywords collapse punctuation and pluralization when a rule refers back to them: the
 * DIRTY TRICK keyword is governed by the battle trait named DIRTY TRICKS. Comparing on this key —
 * uppercased alphanumerics with any trailing S dropped — is what lets the two meet without a
 * per-faction table.
 */
const keywordMatchKey = (value: string): string =>
  value
    .normalize('NFKD')
    .toUpperCase()
    .replace(/[^A-Z0-9!]/g, '')
    .replace(/S$/, '')

const keywordLabel = (keyword: string): string =>
  keyword
    .toLowerCase()
    .split(' ')
    .map(part => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(' ')

/**
 * Tags an ability's keywords, but only the ones another rule in the army answers to (issue #1855:
 * NOISY RACKET is a DIRTY TRICK ability, and whether it works at all is decided by the DIRTY
 * TRICKS battle trait's escalating roll — nothing on the reminder said so). The governing rule
 * must be the army's own content: the core rules define abilities named RUN, CHARGE, and SHOOT
 * that would otherwise claim the matching core keywords on every army, and that baseline is
 * exactly the noise this tag must not add (so SPELL, CORE, and RAMPAGE stay untagged too — no
 * rule names them at all). A keyword whose governing rule is this reminder itself attributes
 * nothing and is dropped.
 */
const keywordTags = (
  reminder: ProjectedReminder,
  ruleNameByMatchKey: Map<string, string>
): Aos4ReminderTag[] =>
  reminder.keywords.flatMap(keyword => {
    const ruleName = ruleNameByMatchKey.get(keywordMatchKey(keyword))
    if (!ruleName || ruleName === reminder.name) return []
    const label = keywordLabel(keyword)
    return [
      {
        label,
        tone: 'keyword' as const,
        description: `This is a ${label} ability. See the ${ruleName} rule in your reminders for how ${label} abilities work.`,
      },
    ]
  })

/**
 * Names the game-wide rules module (The Core Rules, a General's Handbook) that carries a
 * faction-rooted reminder. MUSICIAN and STANDARD BEARER are not faction rules — they arrive
 * through a rules-module container every army includes. Kept as data alongside the quiet
 * `provenance` tag (issue #1857) for text-only surfaces (filtering, an explainer, print grouping).
 */
const rulesModuleName = (
  reminder: ProjectedReminder,
  entityById: Map<CanonicalId, ContentEntity>
): string | undefined => {
  for (const cause of reminder.causes) {
    for (const ancestorId of cause.entityPath.slice(0, -1)) {
      const ancestor = entityById.get(ancestorId)
      if (ancestor?.kind === 'content-group' && ancestor.groupType === 'rules-module') {
        return ancestor.name
      }
    }
  }
  return undefined
}

const withPreferences = (
  reminder: ProjectedReminder,
  document: Aos4ArmyDocument,
  entityById: Map<CanonicalId, ContentEntity>,
  seasonalContextIds: ReadonlySet<RulesContextId>,
  ruleNameByMatchKey: Map<string, string>
): Aos4ReminderViewModel => {
  const preference = document.reminderPreferences[reminder.id]
  const details = timingDetails(reminder.timing)
  const label = windowLabel(reminder.timing)
  const grantedBy = sourceTags(reminder, entityById)
  // A picked source already names the grant; provenance covers only the faction-automatic rest.
  const provenance = grantedBy.length ? undefined : provenanceTag(reminder, entityById, seasonalContextIds)
  const attribution = provenance ? [provenance] : grantedBy
  const keyworded = keywordTags(reminder, ruleNameByMatchKey)
  const rulesModule = rulesModuleName(reminder, entityById)
  const cost = costTag(reminder)
  return {
    id: reminder.id,
    name: reminder.name,
    windowKey: gameWindowKey(reminder.timing.window),
    windowLabel: label,
    typeLabel: details.join(' · '),
    tags: [...(cost ? [cost] : []), ...attribution, ...keyworded, ...timingTags(reminder.timing)],
    accessibleLabel: [
      reminder.name,
      ...(cost ? [cost.description] : []),
      ...attribution.map(tag => `From ${tag.label}`),
      ...keyworded.map(tag => `${tag.label} ability`),
      label,
      ...details,
      ...(reminder.text.reactionTrigger ? [`Trigger: ${reminder.text.reactionTrigger}`] : []),
    ].join('; '),
    ...(reminder.text.declare ? { declare: reminder.text.declare } : {}),
    ...(reminder.text.reactionTrigger ? { reactionTrigger: reminder.text.reactionTrigger } : {}),
    effect: reminder.text.effect,
    hidden: preference?.hidden ?? false,
    ...(preference?.note ? { note: preference.note } : {}),
    ...(preference?.order !== undefined ? { order: preference.order } : {}),
    sourceRecordIds: reminder.sourceRefs.map(reference => String(reference.sourceRecordId)),
    ...(rulesModule ? { rulesModule } : {}),
    projected: reminder,
  }
}

export const createAos4ReminderViewModel = (
  catalog: Aos4Catalog,
  document: Aos4ArmyDocument
): Aos4ReminderViewModel[] => {
  const selection = resolveSelection(catalog, {
    explicitIds: document.explicitSelectionIds,
    rulesContextId: document.rulesContextId,
    ...(document.allowsLegends ? { allowsLegends: true } : {}),
    ...(document.allowsHistorical ? { allowsHistorical: true } : {}),
  })
  const entityById = new Map(catalog.entities.map(entity => [entity.id, entity]))
  const seasonalContextIds: ReadonlySet<RulesContextId> = new Set(
    catalog.rulesContexts.filter(context => context.status === 'seasonal').map(context => context.id)
  )
  const projected = projectReminders(catalog, selection)
  const ruleNameByMatchKey = new Map(
    projected
      .filter(reminder => rulesModuleName(reminder, entityById) === undefined)
      .map(reminder => [keywordMatchKey(reminder.name), reminder.name])
  )
  const reminders = projected.map(reminder =>
    withPreferences(reminder, document, entityById, seasonalContextIds, ruleNameByMatchKey)
  )
  const baseOrder = new Map(reminders.map((reminder, index) => [reminder.id, index]))
  return reminders.sort((left, right) => {
    if (left.windowKey !== right.windowKey) {
      return (baseOrder.get(left.id) ?? 0) - (baseOrder.get(right.id) ?? 0)
    }
    return (
      (left.order ?? baseOrder.get(left.id) ?? 0) - (right.order ?? baseOrder.get(right.id) ?? 0) ||
      left.id.localeCompare(right.id)
    )
  })
}

export const createPrintableAos4Reminders = (
  catalog: Aos4Catalog,
  document: Aos4ArmyDocument
): Aos4ReminderViewModel[] =>
  createAos4ReminderViewModel(catalog, document).filter(reminder => !reminder.hidden)
