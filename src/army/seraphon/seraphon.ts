import { IArmy, IArtifacts } from 'types/army'
import {
  GAME_DURING,
  GAME_START,
  HERO_PHASE,
  COMBAT_PHASE,
  MOVEMENT_PHASE,
  COMBAT_PHASE_START,
  MOVEMENT_PHASE_START,
} from 'types/meta'

export { Army, Artifacts, CommandTraits }

const SLANN = 'Slann'
const SKINK = 'Skink'
const SAURUS = 'Saurus'

const Artifacts: IArtifacts = {
  'Zoetic Dial': {
    desc:
      'Roll a dice after set-up is complete, but before the battle begins. In the battle round corresponding to the number you roll, you can re-roll failed save rolls for the bearer. If you roll a 6, you can decide to use this ability at the start of any one battle round, rather than having to use it in the 6th battle round.',
    when: [GAME_DURING],
  },
  'Incandescent Rectrices': {
    desc:
      'Roll a dice the first time a wound is allocated to the bearer that would slay them. On a 1-2 the bearer is slain. On a 3+ heal D6 wounds allocated to the bearer instead.',
    when: [GAME_DURING],
  },
  'Blade of Realities': {
    desc: 'Pick one of the bearer’s melee weapons. Improve the Rend characteristic of that weapon by 1.',
    when: [GAME_START],
  },
  'Light of Dracothion': {
    desc: 'Once per battle, you can automatically unbind one spell cast by an enemy WIZARD within 15" of the bearer.',
    when: [HERO_PHASE],
  },
  'Coronal Shield': {
    desc:
      'At the start of each combat phase, roll a dice for each enemy unit within 3" of the bearer. On a 4+ subtract 1 from hit rolls for that unit in that combat phase.',
    when: [COMBAT_PHASE_START],
  },
  'Prism of Amyntok': {
    desc:
      'Once per the battle, at the start of your movement phase, pick an enemy unit within 12" of the bearer and roll a dice. On a 1 that unit suffers 1 mortal wound. On a 2-5 that unit suffers D3 mortal wounds. On a 6 that unit suffers D6 mortal wounds.',
    when: [MOVEMENT_PHASE_START],
  },
}

const CommandTraits = {
  [SLANN]: {
    'Arcane Might': { desc: '', when: {} },
    'Vast Intellect': { desc: '', when: {} },
    'Great Rememberer': { desc: '', when: {} },
  },
  [SAURUS]: {
    'Disciplined Fury': { desc: '', when: {} },
    'Thickly Scaled Hide': { desc: '', when: {} },
    'Mighty War Leader': { desc: '', when: {} },
  },
  [SKINK]: {
    'Master of Star Rituals': { desc: '', when: {} },
    Nimble: { desc: '', when: {} },
    Cunning: { desc: '', when: {} },
  },
}

const Army: IArmy = {
  heroes: [
    {
      name: 'Lord Kroak',
      wounds: '10',
      desc: 'Wizard',
      points: '5',
    },
    {
      name: 'Slann Starmaster',
      wounds: '7',
      desc: 'Wizard',
      points: '2.5',
    },
    {
      name: 'Saurus Oldblood on Carnosaur',
      wounds: '12',
      desc: 'Monster',
      points: '3',
    },
    {
      name: 'Saurus Oldblood',
      wounds: '7',
      desc: '',
      points: '1',
    },
    {
      name: 'Saurus Scar-Veteran on Cold One',
      wounds: '7',
      desc: '',
      points: '1',
    },
    {
      name: 'Saurus Eternity Warden',
      wounds: '7',
      desc: '',
      points: '1.5',
    },
    {
      name: 'Saurus Sunblood',
      wounds: '7',
      desc: '',
      points: '1',
    },
    {
      name: 'Scar-Veteran with Battle Standard',
      wounds: '6',
      desc: 'Totem',
      points: '1.5',
    },
    {
      name: 'Saurus Astrolith Bearer',
      wounds: '6',
      desc: 'Totem',
      points: '1.5',
    },
    {
      name: 'Saurus Scar-Veteran on Carnosaur',
      wounds: '12',
      desc: 'Monster',
      points: '3',
    },
    {
      name: 'Skink Priest',
      wounds: '4',
      desc: 'Priest',
      points: '1.5',
    },
    {
      name: 'Skink Starseer',
      wounds: '5',
      desc: 'Wizard',
      points: '2',
    },
    {
      name: 'Skink Starpriest',
      wounds: '4',
      desc: 'Priest',
      points: '1.5',
    },
    {
      name: 'Engine of the Gods',
      wounds: '10',
      desc: '',
      points: '3',
    },
  ],
  units: [
    {
      name: 'Saurus Warriors',
      wounds: '10',
      models: '10',
      desc: '',
      points: '.75',
    },
    {
      name: 'Saurus Guard',
      wounds: '5',
      models: '5',
      desc: '',
      points: '1',
    },
    {
      name: 'Saurus Knights',
      wounds: '10',
      models: '5',
      desc: '',
      points: '1',
    },
    {
      name: 'Skinks',
      wounds: '10',
      models: '10',
      desc: '',
      points: '.75',
    },
    {
      name: 'Chameleon Skinks',
      wounds: '5',
      models: '5',
      desc: '',
      points: '1.5',
    },
    {
      name: 'Terradon Riders',
      wounds: '9',
      models: '3',
      desc: '',
      points: '1.5',
    },
    {
      name: 'Ripperdactyl Riders',
      wounds: '9',
      models: '3',
      desc: '',
      points: '1.5',
    },
    {
      name: 'Skink Handlers',
      wounds: '3',
      models: '3',
      desc: '',
      points: '.5',
    },
    {
      name: 'Salamanders',
      wounds: '3',
      models: '1',
      desc: '',
      points: '1',
    },
    {
      name: 'Razordons',
      wounds: '3',
      models: '1',
      desc: '',
      points: '1',
    },
    {
      name: 'Kroxigor',
      wounds: '12',
      models: '3',
      desc: '',
      points: '2',
    },
  ],
  monsters: [
    {
      name: 'Stegadon',
      wounds: '10',
      desc: '',
      points: '2.5',
    },
    {
      name: 'Bastiladon',
      wounds: '8',
      desc: '',
      points: '4',
    },
    {
      name: 'Troglodon',
      wounds: '12',
      desc: '',
      points: '2',
    },
    {
      name: 'Dread Saurian',
      wounds: '16',
      desc: '',
      points: '5',
    },
  ],
  formations: [
    {
      name: 'Bloodclaw Starhost',
      desc: 'Formation',
      points: '1.5',
    },
    {
      name: 'Eternal Starhost',
      desc: 'Formation',
      points: '1.5',
    },
    {
      name: 'Firelance Starhost',
      desc: 'Formation',
      points: '.5',
    },
    {
      name: 'Heavenswatch Starhost',
      desc: 'Formation',
      points: '.5',
    },
    {
      name: 'Shadowstrike Starhost',
      desc: 'Formation',
      points: '.5',
    },
    {
      name: 'Starbeast Constellation',
      desc: 'Formation',
      points: '1.5',
    },
    {
      name: 'Sunclaw Starhost',
      desc: 'Formation',
      points: '1',
    },
    {
      name: 'Thunderquake Starhost',
      desc: 'Formation',
      points: '2.5',
    },
    {
      name: 'Fangs of Sotek',
      desc: 'Formation',
      points: '2.5',
    },
    {
      name: "Dracothion's Tail",
      desc: 'Formation',
      points: '2.5',
    },
  ],
}
