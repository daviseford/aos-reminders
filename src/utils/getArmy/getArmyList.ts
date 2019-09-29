import ArmyList from 'meta/army_list'
import { TSupportedFaction } from 'meta/factions'

export const getArmyList = () => ArmyList
export const getArmyFromList = (factionName: TSupportedFaction) => ArmyList[factionName]
