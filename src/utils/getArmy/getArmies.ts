import { TGrandAlliances } from 'meta/alliances'
import { TSupportedFaction } from 'meta/factions'
import ArmyList from 'meta/army_list'

export const getArmyList = (factionName: TSupportedFaction) => {
  return ArmyList[factionName]
}

export const getArmiesInfo = () => {
  return Object.keys(ArmyList).reduce(
    (a, k) => {
      a[k] = { GrandAlliance: a[k].GrandAlliance }
      return a
    },
    {} as { [key in TSupportedFaction]: { GrandAlliance: TGrandAlliances } }
  )
}
