import { TItemDescriptions } from 'factions/factionTypes'
import { KHORNE } from 'meta/factions'
import { pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import Prayers from './prayers'
import Scenery from './scenery'
import Units from './units'
//import SlavesToDarknessUnits from 'factions/SlavestoDarkness/units'

/*
const SlaveUnits = getChaosSlaves(MARK_KHORNE)

const getSlavesBattalion = () => {
  const listOfBattalions = ['Bloodmarked Warband']
  return filterBattalions(SlavestoDarkness.Battalions, listOfBattalions)
}

const getBoCUnits = () => {
  const listOfUnits = [
    'Beastlord',
    'Bestigors',
    'Bullgors',
    'Centigors',
    'Cygor',
    'Doombull',
    'Dragon Ogors',
    'Ghorgon',
    'Gors',
    'Tuskgor Chariots',
  ]
  return filterUnits(BeastsofChaos.Units, listOfUnits)
}

const getBoCBattalion = () => {
  const listOfBattalions = ['Brass Despoilers']
  return filterBattalions(BeastsofChaos.Battalions, listOfBattalions)
}
*/

const subFactions: TItemDescriptions = {
  [KHORNE]: {
    effects: pickEffects(BattleTraits, ['Boundless Might']),

    available: {
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      scenery: [Scenery],
      prayers: [Prayers],
      endless_spells: [EndlessSpells],
      units: [Units],
      flavors: [Flavors],
    },
  },
}

export default subFactions
