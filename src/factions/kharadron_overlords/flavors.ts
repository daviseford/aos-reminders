import { keyPicker } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  START_OF_SETUP,
  TURN_ONE_START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import Artifacts from './artifacts'
import CommandTraits from './command_traits'

const Flavors = {
  'Barak-Zilfin, The Windswept City (Skyport)': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Staff of Ocular Optimisation'])],
      command_traits: [
        keyPicker(CommandTraits, [
          'Master Commander',
          "FOOTNOTE: There's Always a Breeze if You Look for it",
          "AMENDMENT: Don't Argue With the Wind",
          'ARTYCLE: Master the Skies',
        ]),
      ],
    },
    effects: [
      {
        name: `Magnificent Skyvessels`,
        desc: `You can choose 1 extra SKYVESSEL in your army to have a great endrinwork.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  'Barak-Zon, City of the Sun (Skyport)': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Aethersped Hammer'])],
      command_traits: [
        keyPicker(CommandTraits, [
          'Bearer of the Ironstar',
          'ARTYCLE: Honour is Everything',
          'AMENDMENT: Leave no Duardin Behind',
          'FOOTNOTE: Show Them Your Steel',
        ]),
      ],
    },
    effects: [
      {
        name: `Deeds, Not Words`,
        desc: `Add 1 to wound rolls for attacks made with melee weapons by friendly SKYFARERS units that made a charge move in the same turn, and add 1 to hit rolls for attacks made with melee weapons by friendly SKYWARDENS units that made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Barak-Urbaz, The Market City (Skyport)': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Breath of Morgrim'])],
      command_traits: [
        keyPicker(CommandTraits, [
          'Khemist Supreme',
          'AMENDMENT: Always Take What You Are Owed',
          'ARTYCLE: Seek New Prospects',
          "FOOTNOTE: Where There's War, There's Gold",
        ]),
      ],
    },
    effects: [
      {
        name: `The Market City`,
        desc: `Do not subtract 1 from the Bravery characteristic of an BARAK-URBAZ unit that spends a share of aether-gold.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Barak-Mhornar, City of Shadow (Skyport)': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Galeforce Stave'])],
      command_traits: [
        keyPicker(CommandTraits, [
          'Opportunistic Privateers',
          'ARTYCLE: Seek New Prospects',
          'FOOTNOTE: Who Strikes First, Strikes Hardest',
        ]),
      ],
    },
    effects: [
      {
        name: `Fearsome Raiders`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 6" of any friendly BARAK-MHORNAR units.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Barak-Thryng, City of the Ancestors (Skyport)': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Grudgehammer'])],
      command_traits: [
        keyPicker(CommandTraits, [
          'Supremely Stubborn',
          'ARTYCLE: Chronicle of Grudges',
          'FOOTNOTE: Honour the Gods, Just in Case',
          'AMENDMENT: Take Help Where You Can Get It',
        ]),
      ],
    },
    effects: [
      {
        name: `Incredibly Stubborn`,
        desc: `If a friendly SKYFARERS model is slain while it is within 3" of an enemy unit, roll a D6. On a 4+, that model can fight before it is removed from play.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Barak-Nar, City of the First Sunrise (Skyport)': {
    mandatory: {
      artifacts: [keyPicker(Artifacts, ['Aethercharged Rune'])],
      command_traits: [
        keyPicker(CommandTraits, [
          'Champion of Progress',
          'ARTYCLE: Respect Your Commanders',
          'FOOTNOTE: Through Knowledge, Power',
          'AMENDMENT: Trust Aethermatics, Not Superstition',
        ]),
      ],
    },
    effects: [
      {
        name: `Scholars and Commanders`,
        desc: `At the start of the first battle round, roll a D6 for each friendly BARAK-NAR HERO on the battlefield (including any that are part of a garrison). For each 4+, you receive 1 extra command point.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
    ],
  },
}

// Note: We do NOT use tagAs for Flavors
export default Flavors
