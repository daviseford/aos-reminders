import { TItemDescription, TItemDescriptions } from 'factions/factionTypes'
import { keyOmitter, keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'
//import SlavesToDarknessUnits from 'factions/SlavestoDarkness/units'

/*
const SlaveUnits = getChaosSlaves(MARK_NURGLE)

const getSlavesBattalion = () => {
  const listOfBattalions = ['Plaguetouched Warband']
  return filterBattalions(SlavestoDarkness.Battalions, listOfBattalions)
}

const getSkavenUnits = () => {
  const listOfUnits = [
    'Plague Censer Bearers',
    'Plague Monks',
    'Plague Priest on Plague Furnace',
    'Plague Priest',
    'Plagueclaw',
    'Verminlord Corruptor',
  ]
  return filterUnits(Skaven.Units, listOfUnits)
}

const getBoCUnits = () => {
  const listOfUnits = [
    'Beastlord',
    'Bestigors',
    'Bullgors',
    'Centigors',
    'Cygor',
    'Doombull',
    'Dragon Ogor Shaggoth',
    'Dragon Ogors',
    'Ghorgon',
    'Gors',
    'Great Bray-Shaman',
    'Tuskgor Chariots',
    'Ungor Raiders',
    'Ungors',
  ]
  return filterUnits(BeastsofChaos.Units, listOfUnits)
}

const getBoCBattalion = () => {
  const listOfBattalions = ['Pestilent Throng']
  return filterBattalions(BeastsofChaos.Battalions, listOfBattalions)
}
*/

const baseSubFaction: TItemDescription = {
  effects: pickEffects(BattleTraits, ['Nurgle']),

  available: {
    scenery: [Scenery],
    spells: [Spells],
    units: [Units],
    flavors: [Flavors],
  },
}

const subFactions: TItemDescriptions = {
  Nurgle: {
    effects: pickEffects(BattleTraits, ['Nurgle', 'Tamurkhan`s Horde']),

    available: {
      ...baseSubFaction.available,
      artifacts: [keyOmitter(Artifacts, ['Daemon Flask'])],
      battalions: [keyOmitter(Battalions, ['Sons of the Maggot Lord', 'Leaping Pox'])],
      command_abilities: [keyOmitter(CommandAbilities, ['Shout of Command'])],
      command_traits: [keyOmitter(CommandTraits, ['Unrelenting Conqueror'])],
    },
  },

  'Tamurkhan`s Horde': {
    effects: pickEffects(BattleTraits, ['Nurgle']),

    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Daemon Flask'])],
      command_abilities: [keyPicker(CommandAbilities, ['Shout of Command'])],
      command_traits: [keyPicker(CommandTraits, ['Unrelenting Conqueror'])],
    },

    available: {
      ...baseSubFaction.available,
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [CommandAbilities],
    },
  },
}

export default subFactions
