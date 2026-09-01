import type { Ability, ContentGroup, Faction, Warscroll } from '../../aos4/domain'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { createAos4ArmyDocument, type Aos4ArmyDocument } from '../../aos4/state'
import { createAos4BuilderViewModel, createAos4ReminderViewModel } from '../../aos4/view'
import { describe, expect, it } from 'vitest'

/**
 * The builder's "carried by" picker (#1992). Imports populate `enhancementBearers` because a
 * roster export states which hero carries each enhancement (#1989); a hand-built army had no way
 * to say so. The view model exposes one control per selected heroic trait or artefact of power —
 * whether the document holds the individual ability an import records or the offering group a
 * hand-built pick records — offering the army's HERO-keyworded warscrolls as bearers, and the
 * reminder view renders a group-keyed assignment exactly like an imported one.
 */

type PickableKind = 'faction' | 'warscroll' | 'content-group' | 'ability'

const currentStandardContextId = AOS4_CATALOG.rulesContexts.find(
  context => context.mode === 'standard' && context.status === 'current'
)?.id

const entityByName = (kind: PickableKind, name: string): Faction | Warscroll | ContentGroup | Ability => {
  // Seasonal enhancement tables share their battletome counterparts' names (#1979); the
  // current-standard entity is the one a plain hand-built pick lands on.
  const candidates = AOS4_CATALOG.entities.filter(
    candidate => candidate.kind === kind && candidate.name === name
  )
  const entity =
    candidates.find(
      candidate => currentStandardContextId && candidate.rulesContextIds.includes(currentStandardContextId)
    ) ?? candidates[0]
  if (!entity) throw new Error(`No ${kind} named ${name} in the catalog`)
  return entity as Faction | Warscroll | ContentGroup | Ability
}

const STORMCAST = entityByName('faction', 'Stormcast Eternals')
const KNIGHT_QUESTOR = entityByName('warscroll', 'Knight-Questor')
const LIBERATORS = entityByName('warscroll', 'Liberators')
const ARTEFACT_GROUP = entityByName('content-group', 'Artefacts of the Tempest')
const HEROIC_TRAIT_GROUP = entityByName('content-group', 'Aspects of Azyr')
const SPELL_LORE_GROUP = entityByName('content-group', 'Lore of the Storm')
const ARTEFACT_ABILITY = entityByName('ability', 'QUICKSILVER DRAUGHT')

const createDocument = (
  explicitSelectionIds: Aos4ArmyDocument['explicitSelectionIds'],
  enhancementBearers?: Aos4ArmyDocument['enhancementBearers']
): Aos4ArmyDocument =>
  createAos4ArmyDocument({
    id: 'army:bearer-picker',
    name: 'Bearer Picker Test',
    rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
    explicitSelectionIds,
    ...(enhancementBearers ? { enhancementBearers } : {}),
    reminderPreferences: {},
  })

describe('builder carried-by picker (#1992)', () => {
  it('offers the army HERO warscrolls as bearers for a hand-built enhancement pick', () => {
    const document = createDocument([STORMCAST.id, KNIGHT_QUESTOR.id, LIBERATORS.id, ARTEFACT_GROUP.id])

    const builder = createAos4BuilderViewModel(AOS4_CATALOG, document)
    const control = builder.enhancementBearers.find(
      candidate => candidate.enhancementId === ARTEFACT_GROUP.id
    )

    expect(control).toBeDefined()
    expect(control!.groupType).toBe('artefact-of-power')
    expect(control!.enhancementName).toBe('Artefacts of the Tempest')
    expect(control!.bearerId).toBeUndefined()
    // Knight-Questor carries the HERO keyword; Liberators do not, and neither does the faction.
    expect(control!.bearerOptions).toEqual([{ id: KNIGHT_QUESTOR.id, name: 'Knight-Questor' }])
  })

  it('keys an imported enhancement ability chip and surfaces its assigned bearer as the current value', () => {
    const document = createDocument([STORMCAST.id, KNIGHT_QUESTOR.id, ARTEFACT_ABILITY.id], {
      [ARTEFACT_ABILITY.id]: KNIGHT_QUESTOR.id,
    })

    const builder = createAos4BuilderViewModel(AOS4_CATALOG, document)
    const control = builder.enhancementBearers.find(
      candidate => candidate.enhancementId === ARTEFACT_ABILITY.id
    )

    expect(control).toBeDefined()
    expect(control!.groupType).toBe('artefact-of-power')
    // Chip casing, like the ability's own builder chip — not the corpus's uppercase record name.
    expect(control!.enhancementName).toBe('Quicksilver Draught')
    expect(control!.bearerId).toBe(KNIGHT_QUESTOR.id)
  })

  it('keeps a non-HERO assignment visible so an imported bearer always displays and stays clearable', () => {
    // The import joins bearers by roster line, not by keyword, so the map can name any warscroll.
    const document = createDocument([STORMCAST.id, LIBERATORS.id, ARTEFACT_ABILITY.id], {
      [ARTEFACT_ABILITY.id]: LIBERATORS.id,
    })

    const builder = createAos4BuilderViewModel(AOS4_CATALOG, document)
    const control = builder.enhancementBearers.find(
      candidate => candidate.enhancementId === ARTEFACT_ABILITY.id
    )

    expect(control).toBeDefined()
    expect(control!.bearerId).toBe(LIBERATORS.id)
    expect(control!.bearerOptions).toEqual([{ id: LIBERATORS.id, name: 'Liberators' }])
  })

  it('offers no picker without an eligible bearer, and none for lore picks', () => {
    // No HERO warscroll and no assignment: a picker would offer an empty list.
    const noHeroes = createDocument([STORMCAST.id, LIBERATORS.id, ARTEFACT_GROUP.id])
    expect(createAos4BuilderViewModel(AOS4_CATALOG, noHeroes).enhancementBearers).toEqual([])

    // A lore grants its spells to every eligible caster; a single bearer would misstate it.
    const withLore = createDocument([STORMCAST.id, KNIGHT_QUESTOR.id, SPELL_LORE_GROUP.id])
    expect(createAos4BuilderViewModel(AOS4_CATALOG, withLore).enhancementBearers).toEqual([])
  })

  it('lists controls per selected enhancement, ordered like the builder cards', () => {
    const document = createDocument([
      STORMCAST.id,
      KNIGHT_QUESTOR.id,
      ARTEFACT_GROUP.id,
      HEROIC_TRAIT_GROUP.id,
    ])

    const builder = createAos4BuilderViewModel(AOS4_CATALOG, document)

    expect(builder.enhancementBearers.map(control => [control.groupType, control.enhancementName])).toEqual([
      ['artefact-of-power', 'Artefacts of the Tempest'],
      ['heroic-trait', 'Aspects of Azyr'],
    ])
  })

  it('writes and clears an assignment through the document normalization the builder rides', () => {
    // The exact update expression HomeCatalogBound uses for both directions of the control.
    const document = createDocument([STORMCAST.id, KNIGHT_QUESTOR.id, ARTEFACT_GROUP.id])

    const assigned = createAos4ArmyDocument({
      ...document,
      enhancementBearers: { ...document.enhancementBearers, [ARTEFACT_GROUP.id]: KNIGHT_QUESTOR.id },
    })
    expect(assigned.enhancementBearers).toEqual({ [ARTEFACT_GROUP.id]: KNIGHT_QUESTOR.id })
    expect(assigned.explicitSelectionIds).toEqual(document.explicitSelectionIds)

    const cleared = createAos4ArmyDocument({
      ...assigned,
      enhancementBearers: { ...assigned.enhancementBearers, [ARTEFACT_GROUP.id]: undefined },
    })
    expect(cleared.enhancementBearers).toBeUndefined()
  })

  it('renders a hand-built group-keyed assignment as the carried-by tag on the group reminders', () => {
    // The hand-built pick records the offering group, so the bearer map is keyed by the group ID —
    // the root of every reminder cause the group grants — and the view needs no changes (#1990).
    const document = createDocument([STORMCAST.id, KNIGHT_QUESTOR.id, ARTEFACT_GROUP.id], {
      [ARTEFACT_GROUP.id]: KNIGHT_QUESTOR.id,
    })

    const reminders = createAos4ReminderViewModel(AOS4_CATALOG, document)
    const artefact = reminders.find(reminder => reminder.name === 'QUICKSILVER DRAUGHT')

    expect(artefact).toBeDefined()
    const bearerTag = artefact!.tags.find(tag => tag.tone === 'source' && tag.label === 'Knight-Questor')
    expect(bearerTag?.description).toBe('Carried by your Knight-Questor. Only that unit uses it.')
  })

  it('keeps the group tag beside the bearer tag, so the pick stays findable by its own name', () => {
    // A heroic-trait table grants abilities under their own names (Aspects of Renewal grants
    // REALMROOT GUIDE), and the table's tag is what lets the player find them. Assigning a bearer
    // must add "Carried by" alongside that tag, never replace it — replacing it made the pick
    // vanish from the reminders as far as the player could tell.
    const document = createDocument([STORMCAST.id, KNIGHT_QUESTOR.id, ARTEFACT_GROUP.id], {
      [ARTEFACT_GROUP.id]: KNIGHT_QUESTOR.id,
    })

    const reminders = createAos4ReminderViewModel(AOS4_CATALOG, document)
    const artefact = reminders.find(reminder => reminder.name === 'QUICKSILVER DRAUGHT')
    const sourceLabels = artefact!.tags.filter(tag => tag.tone === 'source').map(tag => tag.label)

    expect(sourceLabels).toContain('Knight-Questor')
    expect(sourceLabels).toContain(ARTEFACT_GROUP.name)
  })
})
