import {
  AvailableChaosUnits,
  AvailableDeathUnits,
  AvailableDestructionUnits,
  AvailableOrderUnits,
} from 'factions/grand_alliances'
import {
  CoreBattalions,
  GenericArtifacts,
  GenericCommandAbilities,
  GenericCommandTraits,
  GenericEndlessSpells,
  GenericGrandStrategies,
  GenericIncarnates,
  GenericMonstrousRampages,
  GenericPrayers,
  GenericScenery,
  GenericSpells,
  GenericTriumphs,
} from 'generic_rules'
import { sortBy, uniqBy } from 'lodash'
import { CHAOS, DEATH, DESTRUCTION, ORDER, TGrandAlliances } from 'meta/alliances'
import { TCollection } from 'types/army'
import { TEntry } from 'types/data'
import { GrandAllianceConfig } from 'utils/getArmy/grandAllianceConfig'

const modifyFlavors = (flavors: TEntry[], Collection: TCollection): TEntry[] => {
  return uniqBy(sortBy(flavors.concat(Collection.Flavors), 'name'), 'name')
}
const modifyBattalions = (battalions: TEntry[], Collection: TCollection): TEntry[] => {
  return uniqBy(
    sortBy(CoreBattalions, 'name')
      .concat(sortBy(battalions.concat(Collection.Battalions), 'name'))
      .map(u => ({ ...u, battalion: true })),
    'name'
  )
}

const modifyUnits = (
  units: TEntry[],
  alliedUnits: TEntry[],
  alliance: TGrandAlliances,
  Collection: TCollection
): TEntry[] => {
  const GrandAllianceUnits: TEntry[] = {
    [CHAOS]: AvailableChaosUnits,
    [DEATH]: AvailableDeathUnits,
    [DESTRUCTION]: AvailableDestructionUnits,
    [ORDER]: AvailableOrderUnits,
  }[alliance]

  return uniqBy(
    sortBy(units.concat(Collection.Units), 'name')
      .concat(sortBy(alliedUnits, 'name'))
      .concat(sortBy(GrandAllianceUnits, 'name'))
      .map(u => ({ ...u, unit: true })),
    'name'
  )
}

const modifyArtifacts = (
  artifacts: TEntry[],
  alliance: TGrandAlliances,
  Collection: TCollection
): TEntry[] => {
  const { Artifacts } = GrandAllianceConfig[alliance]
  return uniqBy(
    sortBy(artifacts.concat(Collection.Artifacts), 'name')
      .concat(sortBy(GenericArtifacts, 'name'))
      .concat(sortBy(Artifacts, 'name'))
      .map(a => ({ ...a, artifact: true })),
    'name'
  )
}

const modifyCommandTraits = (
  command_traits: TEntry[],
  alliance: TGrandAlliances,
  Collection: TCollection
): TEntry[] => {
  const { CommandTraits } = GrandAllianceConfig[alliance]
  return uniqBy(
    sortBy(command_traits.concat(Collection.CommandTraits), 'name')
      .concat(sortBy(GenericCommandTraits, 'name'))
      .concat(sortBy(CommandTraits, 'name'))
      .map(t => ({ ...t, command_trait: true })),
    'name'
  )
}

const modifyCoreRules = (core_rules: TEntry[]): TEntry[] => {
  return uniqBy(
    sortBy(core_rules, 'name').map(t => ({ ...t, core_rule: true })),
    'name'
  )
}

const modifyMonstrousRampages = (monstrous_rampages: TEntry[], Collection: TCollection): TEntry[] => {
  return uniqBy(
    sortBy(monstrous_rampages.concat(Collection.MonstrousRampages), 'name')
      .concat(sortBy(GenericMonstrousRampages, 'name'))
      .map(t => ({ ...t, monstrous_rampage: true })),
    'name'
  )
}

const modifyMountTraits = (mount_traits: TEntry[], Collection: TCollection): TEntry[] => {
  return uniqBy(
    sortBy(mount_traits.concat(Collection.MountTraits), 'name').map(t => ({ ...t, mount_trait: true })),
    'name'
  )
}

const modifyCommandAbilities = (command_abilities: TEntry[], Collection: TCollection): TEntry[] => {
  return uniqBy(
    sortBy(command_abilities.concat(Collection.CommandAbilities), 'name')
      .concat(sortBy(GenericCommandAbilities, 'name'))
      .map(c => ({ ...c, command_ability: true })),
    'name'
  )
}

const modifyTriumphs = (triumphs: TEntry[], Collection: TCollection): TEntry[] => {
  return uniqBy(
    sortBy(triumphs, 'name')
      .concat(sortBy(GenericTriumphs.concat(Collection.Triumphs), 'name'))
      .map(t => ({ ...t, triumph: true })),
    'name'
  )
}

const modifyGrandStrategies = (grand_strategies: TEntry[], Collection: TCollection): TEntry[] => {
  return uniqBy(
    sortBy(grand_strategies, 'name')
      .concat(sortBy(GenericGrandStrategies.concat(Collection.GrandStrategies), 'name'))
      .map(t => ({ ...t, grand_strategy: true })),
    'name'
  )
}

const modifySpells = (spells: TEntry[], Collection: TCollection): TEntry[] => {
  return uniqBy(
    sortBy(spells.concat(Collection.Spells), 'name')
      .concat(sortBy(GenericSpells, 'name'))
      .map(s => ({ ...s, spell: true })),
    'name'
  )
}

const modifyPrayers = (prayers: TEntry[], Collection: TCollection): TEntry[] => {
  const Prayers = prayers.concat(Collection.Prayers)
  debugger
  return uniqBy(
    sortBy(Prayers, 'name')
      .concat(sortBy(GenericPrayers, 'name'))
      .map(s => ({ ...s, prayer: true })),
    'name'
  )
}

const modifyScenery = (scenery: TEntry[], Collection: TCollection): TEntry[] => {
  return sortBy(scenery.concat(Collection.Scenery), 'name')
    .concat(sortBy(GenericScenery, 'name'))
    .map(s => ({ ...s, scenery: true }))
}

const modifyEndlessSpells = (
  endless_spells: TEntry[],
  grandAllianceEndlessSpells: TEntry[],
  Collection: TCollection
): TEntry[] => {
  return uniqBy(
    sortBy(endless_spells.concat(Collection.EndlessSpells), 'name')
      .concat(sortBy(grandAllianceEndlessSpells, 'name'))
      .concat(sortBy(GenericEndlessSpells, 'name'))
      .map(e => ({ ...e, endless_spell: true })),
    'name'
  )
}

const modifyIncarnates = (incarnates: TEntry[], Collection: TCollection): TEntry[] => {
  return uniqBy(
    sortBy(incarnates.concat(Collection.Incarnates), 'name')
      .concat(sortBy(GenericIncarnates, 'name'))
      .map(t => ({ ...t, incarnate: true })),
    'name'
  )
}

export const modify = {
  Artifacts: modifyArtifacts,
  Battalions: modifyBattalions,
  CommandAbilities: modifyCommandAbilities,
  CommandTraits: modifyCommandTraits,
  CoreRules: modifyCoreRules,
  EndlessSpells: modifyEndlessSpells,
  Flavors: modifyFlavors,
  GrandStrategies: modifyGrandStrategies,
  Incarnates: modifyIncarnates,
  MonstrousRampages: modifyMonstrousRampages,
  MountTraits: modifyMountTraits,
  Prayers: modifyPrayers,
  Scenery: modifyScenery,
  Spells: modifySpells,
  Triumphs: modifyTriumphs,
  Units: modifyUnits,
}
