import { IArmy } from 'types/army'
import { Tags } from './units'

const Army: IArmy = {
  heroes: [
    {
      name: 'Lord Kroak',
      desc: 'Wizard',
      tags: [Tags.SLANN],
    },
    {
      name: 'Slann Starmaster',
      desc: 'Wizard',
      tags: [Tags.SLANN],
    },
    {
      name: 'Saurus Oldblood on Carnosaur',
      desc: 'Monster',
      tags: [Tags.SAURUS],
    },
    {
      name: 'Saurus Oldblood',
      desc: '',
      tags: [Tags.SAURUS],
    },
    {
      name: 'Saurus Scar-Veteran on Cold One',
      desc: '',
      tags: [Tags.SAURUS],
    },
    {
      name: 'Saurus Eternity Warden',
      desc: '',
      tags: [Tags.SAURUS],
    },
    {
      name: 'Saurus Sunblood',
      desc: '',
      tags: [Tags.SAURUS],
    },
    {
      name: 'Scar-Veteran with Battle Standard',
      desc: 'Totem',
      tags: [Tags.SAURUS],
    },
    {
      name: 'Saurus Astrolith Bearer',
      desc: 'Totem',
      tags: [Tags.SAURUS],
    },
    {
      name: 'Saurus Scar-Veteran on Carnosaur',
      desc: 'Monster',
      tags: [Tags.SAURUS],
    },
    {
      name: 'Skink Priest',
      desc: 'Priest',
      tags: [Tags.SKINK],
    },
    {
      name: 'Skink Starseer',
      desc: 'Wizard',
      tags: [Tags.SKINK],
    },
    {
      name: 'Skink Starpriest',
      desc: 'Priest',
      tags: [Tags.SKINK],
    },
    {
      name: 'Engine of the Gods',
      desc: '',
      tags: [Tags.SKINK],
    },
  ],
  units: [
    {
      name: 'Saurus Warriors',
      models: '10',
      desc: '',
    },
    {
      name: 'Saurus Guard',
      models: '5',
      desc: '',
    },
    {
      name: 'Saurus Knights',
      models: '5',
      desc: '',
    },
    {
      name: 'Skinks',
      models: '10',
      desc: '',
    },
    {
      name: 'Chameleon Skinks',
      models: '5',
      desc: '',
    },
    {
      name: 'Terradon Riders',
      models: '3',
      desc: '',
    },
    {
      name: 'Ripperdactyl Riders',
      models: '3',
      desc: '',
    },
    {
      name: 'Skink Handlers',
      models: '3',
      desc: '',
    },
    {
      name: 'Salamanders',
      models: '1',
      desc: '',
    },
    {
      name: 'Razordons',
      models: '1',
      desc: '',
    },
    {
      name: 'Kroxigor',
      models: '3',
      desc: '',
    },
  ],
  monsters: [
    {
      name: 'Stegadon',
      desc: '',
    },
    {
      name: 'Bastiladon',
      desc: '',
    },
    {
      name: 'Troglodon',
      desc: '',
    },
    {
      name: 'Dread Saurian',
      desc: '',
    },
  ],
  formations: [
    {
      name: 'Bloodclaw Starhost',
      desc: 'Formation',
    },
    {
      name: 'Eternal Starhost',
      desc: 'Formation',
    },
    {
      name: 'Firelance Starhost',
      desc: 'Formation',
    },
    {
      name: 'Heavenswatch Starhost',
      desc: 'Formation',
    },
    {
      name: 'Shadowstrike Starhost',
      desc: 'Formation',
    },
    {
      name: 'Starbeast Constellation',
      desc: 'Formation',
    },
    {
      name: 'Sunclaw Starhost',
      desc: 'Formation',
    },
    {
      name: 'Thunderquake Starhost',
      desc: 'Formation',
    },
    {
      name: 'Fangs of Sotek',
      desc: 'Formation',
    },
    {
      name: "Dracothion's Tail",
      desc: 'Formation',
    },
  ],
}

export default Army
