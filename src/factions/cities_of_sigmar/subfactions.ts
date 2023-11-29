import { CITIES_OF_SIGMAR } from 'meta/factions'
import DaughtersUnits from '../daughters_of_khaine/units'
import KharadronUnits from '../kharadron_overlords/units'
import LuminethUnits from '../lumineth_realmlords/units'
import { pickEffects } from '../metatagger'
import StormcastUnits from '../stormcast_eternals/units'
import SylvanethUnits from '../sylvaneth/units'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import Prayers from './prayers'
import Spells from './spells'
import Units from './units'
import { TItemDescriptions } from 'factions/factionTypes'

const subFactions = {
  [CITIES_OF_SIGMAR]: {
    effects: pickEffects(BattleTraits, [CITIES_OF_SIGMAR]),
    available: {
      allied_units: [StormcastUnits, KharadronUnits, SylvanethUnits, DaughtersUnits, LuminethUnits],
      artifacts: [Artifacts],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      flavors: [Flavors],
      prayers: [Prayers],
      spells: [Spells],
      units: [Units],
    },
  },
} satisfies TItemDescriptions

export default subFactions
