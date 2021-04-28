import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  DURING_GAME,
  END_OF_SETUP,
  MOVEMENT_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'
import Flavors from './flavors'
import Units from './units'

const Battalions = {
  'Intrepid Prospectors': {
    effects: [
      {
        name: `This'll Be Quick Work`,
        desc: `After armies have been set up but before the first battle round begins, you can move friendly units from this battalion up to 6".`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'Grand Armada': {
    effects: [
      {
        name: `Constitutional Experts`,
        desc: `Once per battle, if the ARKANAUT ADMIRAL or BROKK GRUNGSSON from this battalion is on the battlefield, you can use a footnote even if it has been used before in the same battle.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Iron Sky Command': {
    effects: [
      {
        name: `Lords of the Skies`,
        desc: `Do not take battleshock tests for friendly KHARADRON OVERLORDS units while they are wholly within 18" of the ARKANAUT IRONCLAD from this battalion.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Iron Sky Attack Squadron': {
    effects: [
      {
        name: `Bold Privateers`,
        desc: `ARKANAUT COMPANY units from this battalion can leave an ARKANAUT FRIGATE from the same battalion either before or after it has moved.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Bold Privateers`,
        desc: `Roll 3D6 instead of 2D6 when making charge rolls for ARKANAUT COMPANY units from this battalion that left an ARKANAUT FRIGATE from the same battalion in the movement phase of the same turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Grundstok Escort Wing': {
    effects: [
      {
        name: `Focused Fire`,
        desc: `At the start of your shooting phase, you can pick 1 enemy unit for this battalion to focus fire on. If you do so, you can reroll hit rolls of 1 for attacks made by units from this battalion that target that unit in that phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  "Drongon's Aether-Runners": {
    mandatory: {
      flavors: [keyPicker(Flavors, ['Barak-Zilfin, The Windswept City (Skyport)'])],
      units: [keyPicker(Units, ['Endrinmaster with Dirigible Suit'])],
    },
    effects: [
      {
        name: `Fastest Vessels in the Fleet`,
        desc: `Add 3 to the move characteristic of this battalion's units.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Fastest Vessels in the Fleet`,
        desc: `For each battalion unit, you can pick 1 friendly Skyvessel within 3" of that unit (the same target cannot be selected more than once in the same phase). Add 3 to the move characteristic of the target until the end of the phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
}

export default tagAs(Battalions, 'battalion')
