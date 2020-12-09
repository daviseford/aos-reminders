import { TItemDescriptions } from 'factions/factionTypes'
import { TZEENTCH } from 'meta/factions'
import { pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import Spells from './spells'
import Units from './units'
//import SlavesToDarknessUnits from 'factions/SlavestoDarkness/units'

/*
const SlaveUnits = getChaosSlaves(MARK_TZEENTCH)

const getSlavesBattalion = () => {
  const listOfBattalions = ['Fatesworn Warband']
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
    'Dragon Ogor Shaggoth',
    'Dragon Ogors',
    'Ghorgon',
    'Gors',
    'Great Bray-Shaman',
    'Tuskgor Chariots',
    'Tzaangors',
    `Tzaangor Enlightened`,
    `Tzaangor Skyfires`,
    `Tzaangor Shaman`,
    'Ungor Raiders',
    'Ungors',
  ]
  return filterUnits(BeastsofChaos.Units, listOfUnits)
}

const getBoCBattalion = () => {
  const listOfBattalions = ['Phantasmagoria of Fate']
  return filterBattalions(BeastsofChaos.Battalions, listOfBattalions)
}
*/

const subFactions: TItemDescriptions = {
  [TZEENTCH]: {
    effects: pickEffects(BattleTraits, ['The Flow of Change']),

    available: {
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      spells: [Spells],
      endless_spells: [EndlessSpells],
      units: [Units],
      flavors: [Flavors],
    },
  },
}

export default subFactions
