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
import {
  ICollection,
  TArtifacts,
  TBattalions,
  TCommandAbilities,
  TCommandTraits,
  TEndlessSpells,
  TFlavors,
  TScenery,
  TSpells,
  TTriumphs,
  TUnits,
} from 'types/army'
import { TBattleRealms, TOriginRealms } from 'types/realmscapes'
import { GrandAllianceConfig } from 'utils/getArmy/grandAllianceConfig'

const modifyFlavors = (allegiances: TFlavors): TFlavors => sortedUniqBy(sortBy(allegiances, 'name'), 'name')
const modifyBattalions = (battalions: TBattalions): TBattalions =>
  sortedUniqBy(sortBy(battalions, 'name'), 'name')

const modifyUnits = (units: TUnits, alliedUnits: TUnits, alliance: TGrandAlliances): TUnits => {
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
  artifacts: TArtifacts,
  originRealm: TOriginRealms | null,
  alliance: TGrandAlliances,
  Collection: ICollection
): TArtifacts => {
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
  traits: TCommandTraits,
  alliance: TGrandAlliances,
  Collection: ICollection
): TCommandTraits => {
  const { CommandTraits } = GrandAllianceConfig[alliance]
  return uniqBy(
    sortBy(traits, 'name')
      .concat(sortBy(Collection.CommandTraits, 'name'))
      .concat(sortBy(CommandTraits, 'name'))
      .map(t => ({ ...t, command_trait: true })),
    'name'
  )
}

const modifyCommandAbilities = (
  realmscape: TBattleRealms | null,
  Collection: ICollection
): TCommandAbilities => {
  const realmCommands = realmscape ? RealmscapeCommands.filter(c => c.name.includes(realmscape)) : []
  return uniqBy(
    Collection.CommandAbilities.concat(sortBy(GenericCommands, 'name'))
      .concat(sortBy(realmCommands, 'name'))
      .map(c => ({ ...c, command_ability: true })),
    'name'
  )
}

const getTriumphs = (): TTriumphs => {
  return sortBy(GenericTriumphs, 'name').map(t => ({ ...t, triumph: true }))
}

const modifySpells = (
  spells: TSpells,
  realmscape: TBattleRealms | null,
  Collection: ICollection
): TSpells => {
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

const modifyScenery = (scenery: TScenery): TScenery => {
  return sortBy(scenery, 'name')
    .concat(sortBy(GenericScenery, 'name'))
    .map(s => ({ ...s, scenery: true }))
}

const modifyEndlessSpells = (endlessSpells: TEndlessSpells): TEndlessSpells => {
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
