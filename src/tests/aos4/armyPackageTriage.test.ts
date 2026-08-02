import type { CanonicalId, Faction } from '../../aos4/domain'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { createAos4ArmyDocument } from '../../aos4/state'
import { createAos4BuilderViewModel } from '../../aos4/view'

/**
 * Battletome and Legends Armies of Renown once decoded as generic content groups whose subgroups
 * rendered as pickable options under a bogus builder card named after the army (issue #1844) —
 * rules-wrong, because an Army of Renown replaces the faction's rules. The interim triage
 * withheld those cards from the view model; the reviewed `armiesOfRenown` classification now
 * types every source-classified root `army-of-renown`, so the packages surface only through the
 * masthead dropdown with replace semantics. This pins the regression: no package slug survives
 * as a group type, and the classified armies are offered as top-level choices.
 */

const RETIRED_PACKAGE_GROUP_TYPES = [
  'aelementiri-conclave',
  'allies-of-the-free-cities',
  'astral-templars',
  'barrow-legion',
  'big-waaagh',
  'champions-of-the-arena',
  'change-cult-uprising',
  'court-of-the-godlings',
  'cycle-of-corruption',
  'da-kings-gitz',
  'droggzs-gitmob',
  'gorechosen-champions',
  'heroes-of-the-first-forged',
  'ironsunz',
  'knights-of-the-crimson-keep',
  'legion-of-the-first-prince',
  'lords-of-the-clan',
  'murkvast-menagerie',
  'petrifex-elite',
  'pioneer-outpost',
  'pyrofane-cult',
  'ruination-brotherhood',
  'soulpod-guardians',
  'taars-grand-forgehost',
  'thanquols-mutated-menagerie',
  'the-baleful-lords',
  'the-clattering-procession',
  'the-decadent-host',
  'the-duardin-ascendant',
  'the-equinox-feast',
  'the-eternal-nightmare',
  'the-first-phalanx-of-ionrach',
  'the-gardeners-of-nurgle',
  'the-great-grand-gnawhorde',
  'the-iron-march',
  'the-knights-of-new-summercourt',
  'the-lance-of-ossia',
  'the-magnates-crew',
  'the-null-myriad',
  'the-oracles-of-fate',
  'vanari-paragons',
  'wardens-of-the-chorrileum',
  'zainthar-kai',
  'ziggurat-stampede',
  'zoggroks-ironmongerz',
]

const factionByName = (name: string): Faction => {
  const entity = AOS4_CATALOG.entities.find(
    candidate => candidate.kind === 'faction' && candidate.name === name
  )
  if (!entity) throw new Error(`No faction named ${name} in the catalog`)
  return entity as Faction
}

const builderFor = (explicitSelectionIds: CanonicalId[]) =>
  createAos4BuilderViewModel(
    AOS4_CATALOG,
    createAos4ArmyDocument({
      id: 'army:test-package-triage',
      name: 'Package Triage Test',
      rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
      explicitSelectionIds,
    })
  )

describe('Army of Renown package classification (#1844)', () => {
  it('leaves no army package decoded as a generic self-slugged content group', () => {
    const groupTypes = new Set(
      AOS4_CATALOG.entities.flatMap(entity =>
        entity.kind === 'content-group' ? [entity.groupType] : []
      )
    )
    RETIRED_PACKAGE_GROUP_TYPES.forEach(groupType => {
      expect(groupTypes).not.toContain(groupType)
    })
  })

  it('offers the battletome armies as top-level choices instead of builder cards', () => {
    const stormcast = builderFor([factionByName('Stormcast Eternals').id])
    const armies = stormcast.options.filter(option => option.groupType === 'army-of-renown')
    const byName = new Map(armies.map(option => [option.name, option]))
    // Seasonal, battletome, and White Dwarf (Legends) armies all surface through the dropdown…
    expect(byName.get('Draconith Skywing')?.overlay).toBeUndefined()
    expect(byName.get('Heroes of the First-Forged')?.overlay).toBeUndefined()
    expect(byName.get('Ruination Brotherhood')?.overlay).toBeUndefined()
    expect(byName.get('Astral Templars')?.overlay).toBe('legends')
    // …and never as a card of their own group type.
    const cardTypes = new Set(
      stormcast.options
        .filter(option => option.kind === 'content-group' && option.groupType !== 'army-of-renown')
        .map(option => option.groupType)
    )
    RETIRED_PACKAGE_GROUP_TYPES.forEach(groupType => expect(cardTypes).not.toContain(groupType))
    ;['battle-formation', 'artefact-of-power', 'spell-lore', 'heroic-trait', 'scars-of-war'].forEach(
      groupType => expect(cardTypes).toContain(groupType)
    )
  })

  it('replaces the regular rules while a battletome army is selected', () => {
    const nighthaunt = factionByName('Nighthaunt')
    const withoutArmy = builderFor([nighthaunt.id])
    const eternalNightmare = withoutArmy.options.find(
      option => option.groupType === 'army-of-renown' && option.name === 'The Eternal Nightmare'
    )
    expect(eternalNightmare).toBeDefined()

    const withArmy = builderFor([nighthaunt.id, eternalNightmare!.id])
    // The faction's regular rules-choice groups are suppressed, not offered alongside.
    const offeredGroups = withArmy.options.filter(
      option =>
        option.kind === 'content-group' &&
        (option.available || option.selected) &&
        ['battle-formation', 'spell-lore', 'heroic-trait', 'artefact-of-power'].includes(
          option.groupType ?? ''
        )
    )
    offeredGroups.forEach(option => expect(option.selected).toBe(true))
    // Deselecting restores the regular offers.
    const restored = builderFor([nighthaunt.id])
    expect(
      restored.options.some(
        option => option.groupType === 'battle-formation' && option.available && !option.selected
      )
    ).toBe(true)
  })
})
