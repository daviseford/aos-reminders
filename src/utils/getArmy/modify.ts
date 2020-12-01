import {
  GenericCommands,
  GenericEndlessSpells,
  GenericScenery,
  GenericSpells,
  GenericTriumphs,
  RealmscapeArtifacts,
  RealmscapeCommands,
  RealmscapeSpells,
} from 'army/generic'
import { sortBy, sortedUniqBy, uniqBy } from 'lodash'
import { TGrandAlliances } from 'meta/alliances'
import { TCollection } from 'types/army'
import { TEntry } from 'types/data'
import { TBattleRealms, TOriginRealms } from 'types/realmscapes'
import { GrandAllianceConfig } from 'utils/getArmy/grandAllianceConfig'

const modifyFlavors = (flavors: TEntry[]): TEntry[] => sortedUniqBy(sortBy(flavors, 'name'), 'name')
const modifyBattalions = (battalions: TEntry[]): TEntry[] => sortedUniqBy(sortBy(battalions, 'name'), 'name')

const modifyUnits = (units: TEntry[], alliedUnits: TEntry[], alliance: TGrandAlliances): TEntry[] => {
  const { Units } = GrandAllianceConfig[alliance]
  return uniqBy(
    sortBy(units, 'name')
      .concat(sortBy(alliedUnits, 'name'))
      .concat(sortBy(Units, 'name'))
      .map(u => ({ ...u, unit: true })),
    'name'
  )
}

const modifyArtifacts = (
  artifacts: TEntry[],
  originRealm: TOriginRealms | null,
  alliance: TGrandAlliances,
  Collection: TCollection
): TEntry[] => {
  const originArtifacts = originRealm
    ? RealmscapeArtifacts.filter(c => c.name.includes(originRealm))
    : RealmscapeArtifacts
  const { Artifacts } = GrandAllianceConfig[alliance]
  return uniqBy(
    artifacts
      .concat(Collection.Artifacts)
      .concat(Artifacts)
      .concat(originArtifacts)
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
    sortBy(command_traits, 'name')
      .concat(sortBy(Collection.CommandTraits, 'name'))
      .concat(sortBy(CommandTraits, 'name'))
      .map(t => ({ ...t, command_trait: true })),
    'name'
  )
}

const modifyCommandAbilities = (realmscape: TBattleRealms | null, Collection: TCollection): TEntry[] => {
  const realmCommands = realmscape ? RealmscapeCommands.filter(c => c.name.includes(realmscape)) : []
  return uniqBy(
    Collection.CommandAbilities.concat(sortBy(GenericCommands, 'name'))
      .concat(sortBy(realmCommands, 'name'))
      .map(c => ({ ...c, command_ability: true })),
    'name'
  )
}

const getTriumphs = (): TEntry[] => {
  return sortBy(GenericTriumphs, 'name').map(t => ({ ...t, triumph: true }))
}

const modifySpells = (
  spells: TEntry[],
  realmscape: TBattleRealms | null,
  Collection: TCollection
): TEntry[] => {
  const realmSpells = realmscape ? RealmscapeSpells.filter(s => s.name.includes(realmscape)) : []
  return uniqBy(
    sortBy(spells, 'name')
      .concat(Collection.Spells)
      .concat(sortBy(realmSpells, 'name'))
      .concat(sortBy(GenericSpells, 'name'))
      .map(s => ({ ...s, spell: true })),
    'name'
  )
}

const modifyScenery = (scenery: TEntry[]): TEntry[] => {
  return sortBy(scenery, 'name')
    .concat(sortBy(GenericScenery, 'name'))
    .map(s => ({ ...s, scenery: true }))
}

const modifyEndlessSpells = (endlessSpells: TEntry[]): TEntry[] => {
  return uniqBy(
    sortBy(endlessSpells, 'name')
      .concat(sortBy(GenericEndlessSpells, 'name'))
      .map(e => ({ ...e, endless_spell: true })),
    'name'
  )
}

export const modify = {
  Artifacts: modifyArtifacts,
  Battalions: modifyBattalions,
  CommandAbilities: modifyCommandAbilities,
  CommandTraits: modifyCommandTraits,
  EndlessSpells: modifyEndlessSpells,
  Flavors: modifyFlavors,
  Scenery: modifyScenery,
  Spells: modifySpells,
  Triumphs: getTriumphs,
  Units: modifyUnits,
}
