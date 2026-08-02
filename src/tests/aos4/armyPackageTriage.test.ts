import type { ContentGroup, Faction } from '../../aos4/domain'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { createAos4ArmyDocument } from '../../aos4/state'
import { createAos4BuilderViewModel } from '../../aos4/view'

/**
 * Battletome and Legends Armies of Renown await their reviewed `armiesOfRenown` classification
 * (issue #1844). Until the corpus types them `army-of-renown`, their subgroups decode as pickable
 * options under a bogus builder card named after the army — and picking one would apply the
 * variant's rules additively, which is rules-wrong. The builder view model withholds them, except
 * for subgroups already selected in the document, which stay visible so the player can see and
 * remove the active rules.
 */

const factionByName = (name: string): Faction => {
  const entity = AOS4_CATALOG.entities.find(
    candidate => candidate.kind === 'faction' && candidate.name === name
  )
  if (!entity) throw new Error(`No faction named ${name} in the catalog`)
  return entity as Faction
}

const builderFor = (explicitSelectionIds: Faction['id'][]) =>
  createAos4BuilderViewModel(
    AOS4_CATALOG,
    createAos4ArmyDocument({
      id: 'army:test-package-triage',
      name: 'Package Triage Test',
      rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
      explicitSelectionIds,
    })
  )

describe('unclassified Army of Renown package triage (#1844)', () => {
  it('withholds unclassified army packages from the builder options', () => {
    const packageTypes = {
      'Stormcast Eternals': ['heroes-of-the-first-forged', 'ruination-brotherhood', 'astral-templars'],
      'Maggotkin of Nurgle': ['cycle-of-corruption', 'the-gardeners-of-nurgle'],
      'Flesh-eater Courts': ['the-equinox-feast', 'the-knights-of-new-summercourt'],
    }
    Object.entries(packageTypes).forEach(([factionName, groupTypes]) => {
      const builder = builderFor([factionByName(factionName).id])
      const offeredTypes = new Set(
        builder.options.filter(option => option.kind === 'content-group').map(option => option.groupType)
      )
      groupTypes.forEach(groupType => {
        expect(offeredTypes).not.toContain(groupType)
      })
    })
  })

  it('keeps regular category groups and classified Armies of Renown on offer', () => {
    const stormcast = builderFor([factionByName('Stormcast Eternals').id])
    const stormcastTypes = new Set(
      stormcast.options.filter(option => option.kind === 'content-group').map(option => option.groupType)
    )
    ;['battle-formation', 'artefact-of-power', 'spell-lore', 'heroic-trait', 'scars-of-war'].forEach(
      groupType => {
        expect(stormcastTypes).toContain(groupType)
      }
    )

    // The Roving Maw carries the reviewed army-of-renown classification and must keep surfacing.
    const ogor = builderFor([factionByName('Ogor Mawtribes').id])
    const armyOfRenownNames = ogor.options
      .filter(option => option.kind === 'content-group' && option.groupType === 'army-of-renown')
      .map(option => option.name)
    expect(armyOfRenownNames).toContain('The Roving Maw')
  })

  it('keeps an already-selected package subgroup visible so it can be removed', () => {
    const stormcast = factionByName('Stormcast Eternals')
    const packageSubgroup = AOS4_CATALOG.entities.find(
      (entity): entity is ContentGroup =>
        entity.kind === 'content-group' && entity.groupType === 'ruination-brotherhood'
    )
    expect(packageSubgroup).toBeDefined()

    const builder = builderFor([stormcast.id, packageSubgroup!.id])
    const offered = builder.options.find(option => option.id === packageSubgroup!.id)
    expect(offered).toBeDefined()
    expect(offered!.selected).toBe(true)
  })
})
