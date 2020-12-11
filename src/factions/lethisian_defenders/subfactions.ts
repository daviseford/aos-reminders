import { TItemDescriptions } from 'factions/factionTypes'
import { LETHISIAN_DEFENDERS } from 'meta/factions'
import FyreslayersUnits from '../fyreslayers/units'
import { keyOmitter, keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Prayers from './prayers'
import Units from './units'

// Importing valid SCE units.
// All units valid except Hammers of Sigmar (named).
// const getStormcastUnits = () => {
//   const listOfUnits = [
//     `Astreia Solbright`,
//     `Aventis Firestrike`,
//     `Gavriel Sureheart`,
//     `Neave Blacktalon`,
//     `Steelheart's Champions`,
//     `The Farstriders`,
//     `Vandus Hammerhand`,
//   ]
//   return removeUnits(StormcastEternals.Units, listOfUnits)
// }

// TODO
// Importing valid IDK units.
// All units valid except Volturnos.
// const getIdonethUnits = () => {
//   return removeUnits(IdonethDeepkin.Units, [`Volturnos, High King of the Deep`])
// }

// TODO
// Importing valid KO units.
// const getKharadronUnits = () => KharadronOverlords.Units

// Importing valid FS units.
// All units valid except Fjul-Grimnir and Chosen Axes.
// const getFyreslayerUnits = () => {
//   return removeUnits(Fyreslayers.Units, [`Fjul-Grimnir`, `The Chosen Axes`])
// }

// TODO: Explain what a subfaction is (vs faction, vs flavor)

const subFactions: TItemDescriptions = {
  [LETHISIAN_DEFENDERS]: {
    effects: pickEffects(BattleTraits, [LETHISIAN_DEFENDERS]),
    available: {
      allied_units: [
        keyOmitter(FyreslayersUnits, ['Fjul-Grimnir', 'The Chosen Axes']),
        //TODO
        // ...getIdonethUnits(),
        // ...getKharadronUnits(),
        // ...getStormcastUnits(),
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
