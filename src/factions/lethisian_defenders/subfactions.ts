import { TItemDescriptions } from 'factions/factionTypes'
import { LETHISIAN_DEFENDERS } from 'meta/factions'
import FyreslayersUnits from '../fyreslayers/units'
import KharadronUnits from '../kharadron_overlords/units'
import { keyOmitter, keyPicker, pickEffects } from '../metatagger'
import StormcastUnits from '../stormcast_eternals/units'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Prayers from './prayers'
import Units from './units'

const subFactions: TItemDescriptions = {
  [LETHISIAN_DEFENDERS]: {
    effects: pickEffects(BattleTraits, [LETHISIAN_DEFENDERS]),
    available: {
      allied_units: [
        KharadronUnits,
        keyOmitter(FyreslayersUnits, ['Fjul-Grimnir', 'The Chosen Axes']),
        keyOmitter(StormcastUnits, [
          'Astreia Solbright',
          'Aventis Firestrike',
          'Gavriel Sureheart',
          'Neave Blacktalon',
          "Steelheart's Champions",
          'The Farstriders',
          'Vandus Hammerhand',
        ]),
        // TODO: All units valid except Volturnos.
        // keyOmitter(IdonethUnits, ['Volturnos, High King of the Deep']),
      ],
      artifacts: [Artifacts],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      prayers: [Prayers],
      units: [Units],
    },
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Onyx Shield Wall'])],
    },
  },
}

export default subFactions
