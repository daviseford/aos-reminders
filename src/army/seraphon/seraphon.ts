import { IArmy } from 'types/army'

export { Army, Artifacts, CommandTraits }

const SLANN = 'Slann'
const SKINK = 'Skink'
const SAURUS = 'Saurus'

const Artifacts = {
  'Zoetic Dial': { desc: '', when: [] },
  'Incandescent Rectrices': { desc: '', when: [] },
  'Blade of Realities': { desc: '', when: [] },
  'Light of Dracothion': { desc: '', when: [] },
  'Coronal Shield': { desc: '', when: [] },
  'Prism of Amyntok': { desc: '', when: [] },
}

const CommandTraits = {
  [SLANN]: {
    'Arcane Might': { desc: '', when: [] },
    'Vast Intellect': { desc: '', when: [] },
    'Great Rememberer': { desc: '', when: [] },
  },
  [SAURUS]: {
    'Disciplined Fury': { desc: '', when: [] },
    'Thickly Scaled Hide': { desc: '', when: [] },
    'Mighty War Leader': { desc: '', when: [] },
  },
  [SKINK]: {
    'Master of Star Rituals': { desc: '', when: [] },
    Nimble: { desc: '', when: [] },
    Cunning: { desc: '', when: [] },
  },
}

const Army: IArmy = {
  heroes: [
    {
      name: 'Lord Kroak',
      wounds: '10',
      desc: 'Seraphon | Wizard',
      points: '5',
    },
    {
      name: 'Slann Starmaster',
      wounds: '7',
      desc: 'Seraphon | Wizard',
      points: '2.5',
    },
    {
      name: 'Saurus Oldblood on Carnosaur',
      wounds: '12',
      desc: 'Seraphon | Monster',
      points: '3',
    },
    {
      name: 'Saurus Oldblood',
      wounds: '7',
      desc: 'Seraphon',
      points: '1',
    },
    {
      name: 'Saurus Scar-Veteran on Cold One',
      wounds: '7',
      desc: 'Seraphon',
      points: '1',
    },
    {
      name: 'Saurus Eternity Warden',
      wounds: '7',
      desc: 'Seraphon',
      points: '1.5',
    },
    {
      name: 'Saurus Sunblood',
      wounds: '7',
      desc: 'Seraphon',
      points: '1',
    },
    {
      name: 'Scar-Veteran with Battle Standard',
      wounds: '6',
      desc: 'Seraphon | Totem',
      points: '1.5',
    },
    {
      name: 'Saurus Astrolith Bearer',
      wounds: '6',
      desc: 'Seraphon | Totem',
      points: '1.5',
    },
    {
      name: 'Saurus Scar-Veteran on Carnosaur',
      wounds: '12',
      desc: 'Seraphon | Monster',
      points: '3',
    },
    {
      name: 'Skink Priest',
      wounds: '4',
      desc: 'Seraphon | Priest',
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
      desc: 'Seraphon',
      points: '3',
    },
  ],
  units: [
    {
      name: 'Saurus Warriors',
      wounds: '10',
      models: '10',
      desc: 'Seraphon',
      points: '.75',
    },
    {
      name: 'Saurus Guard',
      wounds: '5',
      models: '5',
      desc: 'Seraphon',
      points: '1',
    },
    {
      name: 'Saurus Knights',
      wounds: '10',
      models: '5',
      desc: 'Seraphon',
      points: '1',
    },
    {
      name: 'Skinks',
      wounds: '10',
      models: '10',
      desc: 'Seraphon',
      points: '.75',
    },
    {
      name: 'Chameleon Skinks',
      wounds: '5',
      models: '5',
      desc: 'Seraphon',
      points: '1.5',
    },
    {
      name: 'Terradon Riders',
      wounds: '9',
      models: '3',
      desc: 'Seraphon',
      points: '1.5',
    },
    {
      name: 'Ripperdactyl Riders',
      wounds: '9',
      models: '3',
      desc: 'Seraphon',
      points: '1.5',
    },
    {
      name: 'Skink Handlers',
      wounds: '3',
      models: '3',
      desc: 'Seraphon',
      points: '.5',
    },
    {
      name: 'Salamanders',
      wounds: '3',
      models: '1',
      desc: 'Seraphon',
      points: '1',
    },
    {
      name: 'Razordons',
      wounds: '3',
      models: '1',
      desc: 'Seraphon',
      points: '1',
    },
    {
      name: 'Kroxigor',
      wounds: '12',
      models: '3',
      desc: 'Seraphon',
      points: '2',
    },
  ],
  monsters: [
    {
      name: 'Stegadon',
      wounds: '10',
      desc: 'Seraphon',
      points: '2.5',
    },
    {
      name: 'Bastiladon',
      wounds: '8',
      desc: 'Seraphon',
      points: '4',
    },
    {
      name: 'Troglodon',
      wounds: '12',
      desc: 'Seraphon',
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
