import { keyPicker } from 'factions/metatagger'
import Artifacts from './artifacts'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import {
  COMBAT_PHASE,
  END_OF_SETUP,
  START_OF_CHARGE_PHASE,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
} from 'types/phases'

const Flavors = {
  'The Lurid Haze': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Oil of Exultation'])],
      command_traits: [keyPicker(CommandTraits, ['Feverish Anticipation'])],
      command_abilities: [keyPicker(CommandAbilities, ['Intoxicating Pall'])],
    },
    effects: [
      {
        name: `Billowing Mists`,
        desc: `After set up is complete but before the first battle round begins, you can remove D3 friendly LURID HAZE INVADERS HOST units from the battlefield and say that they are set up in ambush as reserve units (any set-up restrictions in the battleplan being used still apply). If you do so, at the end of your first movement phase, you must set up those friendly LURID HAZE INVADERS HOST units on the battlefield, wholly within 6" of the battlefield edge and more than 9" from any enemy units.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Billowing Mists`,
        desc: `If you set units up in reserve, at the end of your first movement phase, you must set up those friendly LURID HAZE INVADERS HOST units on the battlefield, wholly within 6" of the battlefield edge and more than 9" from any enemy units.`,
        when: [TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Faultless Blades': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Contemptuous Brand'])],
      command_traits: [keyPicker(CommandTraits, ['Contest of Cruelty'])],
      command_abilities: [keyPicker(CommandAbilities, ['Armour of Arrogance'])],
    },
    effects: [
      {
        name: `Send Me Your Best`,
        desc: `Add 1 to hit rolls for attacks made with melee weapons by friendly FAULTLESS BLADES PRETENDERS HOST units that target a HERO if that friendly unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Scarlet Cavalcade': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Helm of the Last Rider'])],
      command_traits: [keyPicker(CommandTraits, ['Embodiment of Haste'])],
      command_abilities: [keyPicker(CommandAbilities, ['Vicious Spurs'])],
    },
    effects: [
      {
        name: `Excessive Swiftness`,
        desc: `At the start of your charge phase, if 2 friendly SCARLET CAVALCADE GODSEEKERS HOST units that each have 10 or more models are within 6" of each other, you can make 1 charge roll to determine the charge distance for both units in that phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
}

export default Flavors
