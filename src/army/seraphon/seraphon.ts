import { IArmy, IArtifacts, ICommandTraits } from 'types/army'
import {
  GAME_DURING,
  GAME_START,
  HERO_PHASE,
  COMBAT_PHASE,
  COMBAT_PHASE_START,
  MOVEMENT_PHASE_START,
  HERO_PHASE_START,
} from 'types/meta'

export { Army, Artifacts, CommandTraits }

// Command Trait Keywords
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

const CommandTraits: ICommandTraits = {
  [SLANN]: {
    'Arcane Might': {
      desc: 'You can re-roll one casting or unbinding roll for this general each hero phase.',
      when: [HERO_PHASE],
    },
    'Vast Intellect': {
      desc:
        'This general can use the Curse of Fates and Summon Starlight spells from the Skink Starseer and Skink Starpriest warscrolls.',
      when: [HERO_PHASE],
    },
    'Great Rememberer': {
      desc:
        'If this general is on the battlefield, you can use the Lords of Space and Time battle trait twice in each of your hero phases rather than only once.',
      when: [HERO_PHASE],
    },
  },
  [SAURUS]: {
    'Disciplined Fury': {
      desc: 'You can re-roll hit rolls of 1 for attacks made with this general’s melee weapons.',
      when: [COMBAT_PHASE],
    },
    'Thickly Scaled Hide': { desc: 'You can re-roll save rolls of 1 for this general.', when: [GAME_DURING] },
    'Mighty War Leader': {
      desc:
        'At the start of your hero phase, if this general is on the battlefield, roll a dice. On a 5+ you receive 1 extra command point.',
      when: [HERO_PHASE_START],
    },
  },
  [SKINK]: {
    'Master of Star Rituals': {
      desc:
        'If this general is a SKINK PRIEST from the Skink Priest warscroll, they can use the Celestial Rites ability from their warscroll twice in each of their hero phases rather than once. If they are not a SKINK PRIEST from the Skink Priest warscroll, then they can use the Celestial Rites ability.',
      when: [HERO_PHASE],
    },
    Nimble: {
      desc:
        'Add 1 to this general’s Move characteristic. In addition, add 1 to save rolls for this general as long as they are not riding upon a mount.',
      when: [GAME_DURING],
    },
    Cunning: {
      desc:
        'Roll a dice at the start of the combat phase if this general is within 3" of an enemy HERO. On a 4+ the enemy HERO suffers 1 mortal wound.',
      when: [COMBAT_PHASE_START],
    },
  },
}

const Army: IArmy = {
  heroes: [
    {
      name: 'Lord Kroak',
      wounds: '10',
      desc: 'Wizard',
      points: '5',
      tags: [SLANN],
    },
    {
      name: 'Slann Starmaster',
      wounds: '7',
      desc: 'Wizard',
      points: '2.5',
      tags: [SLANN],
    },
    {
      name: 'Saurus Oldblood on Carnosaur',
      wounds: '12',
      desc: 'Monster',
      points: '3',
      tags: [SAURUS],
    },
    {
      name: 'Saurus Oldblood',
      wounds: '7',
      desc: '',
      points: '1',
      tags: [SAURUS],
    },
    {
      name: 'Saurus Scar-Veteran on Cold One',
      wounds: '7',
      desc: '',
      points: '1',
      tags: [SAURUS],
    },
    {
      name: 'Saurus Eternity Warden',
      wounds: '7',
      desc: '',
      points: '1.5',
      tags: [SAURUS],
    },
    {
      name: 'Saurus Sunblood',
      wounds: '7',
      desc: '',
      points: '1',
      tags: [SAURUS],
    },
    {
      name: 'Scar-Veteran with Battle Standard',
      wounds: '6',
      desc: 'Totem',
      points: '1.5',
      tags: [SAURUS],
    },
    {
      name: 'Saurus Astrolith Bearer',
      wounds: '6',
      desc: 'Totem',
      points: '1.5',
      tags: [SAURUS],
    },
    {
      name: 'Saurus Scar-Veteran on Carnosaur',
      wounds: '12',
      desc: 'Monster',
      points: '3',
      tags: [SAURUS],
    },
    {
      name: 'Skink Priest',
      wounds: '4',
      desc: 'Priest',
      points: '1.5',
      tags: [SKINK],
    },
    {
      name: 'Skink Starseer',
      wounds: '5',
      desc: 'Wizard',
      points: '2',
      tags: [SKINK],
    },
    {
      name: 'Skink Starpriest',
      wounds: '4',
      desc: 'Priest',
      points: '1.5',
      tags: [SKINK],
    },
    {
      name: 'Engine of the Gods',
      wounds: '10',
      desc: '',
      points: '3',
      tags: [SKINK],
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
