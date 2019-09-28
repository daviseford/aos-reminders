import {
  TAllegiances,
  TBattalions,
  TUnits,
  TArtifacts,
  ICollection,
  TTraits,
  TCommands,
  TTriumphs,
  TSpells,
  TScenery,
  TEndlessSpells,
} from 'types/army'
import { sortBy, uniqBy, sortedUniqBy } from 'lodash'
import { TGrandAlliances } from 'meta/alliances'
import { GrandAllianceConfig } from './grandAllianceConfig'
import {
  RealmArtifacts,
  RealmscapeCommands,
  GenericCommands,
  GenericTriumphs,
  RealmscapeSpells,
  GenericSpells,
  GenericScenery,
  GenericEndlessSpells,
} from 'army/generic'
import { TRealms } from 'types/realmscapes'

const modifyAllegiances = (allegiances: TAllegiances): TAllegiances =>
  sortedUniqBy(sortBy(allegiances, 'name'), 'name')
const modifyBattalions = (battalions: TBattalions): TBattalions =>
  sortedUniqBy(sortBy(battalions, 'name'), 'name')

const modifyUnits = (units: TUnits, alliance: TGrandAlliances): TUnits => {
  const { Units } = GrandAllianceConfig[alliance]
  return uniqBy(units.concat(sortBy(Units, 'name')).map(u => ({ ...u, unit: true })), 'name')
}

const modifyArtifacts = (
  artifacts: TArtifacts,
  alliance: TGrandAlliances,
  Collection: ICollection
): TArtifacts => {
  const { Artifacts } = GrandAllianceConfig[alliance]
  return uniqBy(
    artifacts
      .concat(Collection.Artifacts)
      .concat(Artifacts)
      .concat(RealmArtifacts)
      .map(a => ({ ...a, artifact: true })),
    'name'
  )
}

const modifyTraits = (traits: TTraits, alliance: TGrandAlliances, Collection: ICollection): TTraits => {
  const { Traits } = GrandAllianceConfig[alliance]
  return uniqBy(
    traits
      .concat(Collection.Traits)
      .concat(Traits)
      .map(t => ({ ...t, command_trait: true })),
    'name'
  )
}

const modifyCommands = (realmscape: TRealms | null, Collection: ICollection): TCommands => {
  const realmCommands = realmscape ? RealmscapeCommands.filter(c => c.name.includes(realmscape)) : []
  return uniqBy(
    Collection.Commands.concat(sortBy(GenericCommands, 'name'))
      .concat(sortBy(realmCommands, 'name'))
      .map(c => ({ ...c, command_ability: true })),
    'name'
  )
}

const getTriumphs = (): TTriumphs => {
  return sortBy(GenericTriumphs, 'name').map(t => ({ ...t, triumph: true }))
}

const modifySpells = (spells: TSpells, realmscape: TRealms | null, Collection: ICollection): TSpells => {
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
  return sortBy(endlessSpells, 'name')
    .concat(sortBy(GenericEndlessSpells, 'name'))
    .map(e => ({ ...e, endless_spell: true }))
}

export const modify = {
  Allegiances: modifyAllegiances,
  Artifacts: modifyArtifacts,
  Battalions: modifyBattalions,
  Commands: modifyCommands,
  EndlessSpells: modifyEndlessSpells,
  Scenery: modifyScenery,
  Spells: modifySpells,
  Traits: modifyTraits,
  Triumphs: getTriumphs,
  Units: modifyUnits,
}
