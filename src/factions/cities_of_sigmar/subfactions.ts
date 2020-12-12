import { TItemDescriptions } from 'factions/factionTypes'
import { CITIES_OF_SIGMAR } from 'meta/factions'
import DaughtersUnits from '../daughters_of_khaine/units'
import KharadronUnits from '../kharadron_overlords/units'
import { pickEffects } from '../metatagger'
import StormcastUnits from '../stormcast_eternals/units'
import SylvanethUnits from '../sylvaneth/units'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import Prayers from './prayers'
import Spells from './spells'
import Units from './units'

const subFactions: TItemDescriptions = {
  [CITIES_OF_SIGMAR]: {
    effects: pickEffects(BattleTraits, [CITIES_OF_SIGMAR]),
    available: {
      allied_units: [StormcastUnits, KharadronUnits, SylvanethUnits, DaughtersUnits],
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      flavors: [Flavors],
      prayers: [Prayers],
      spells: [Spells],
      units: [Units],
    },
  },
}

export default subFactions
