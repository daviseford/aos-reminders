import { IBattalions } from 'types/army'
import { SETUP_END, HERO_PHASE, MOVEMENT_PHASE } from 'types/meta'

// Command Trait Keywords
export const Tags = {
  SLANN: 'Slann',
  SKINK: 'Skink',
  SAURUS: 'Saurus',
}

// Unit Names
export const Units = {
  LORD_KROAK: 'Lord Kroak',
  SLANN: 'Slann Starmaster',
  OLDBLOOD_ON_CARNOSAUR: 'Saurus Oldblood on Carnosaur',
  OLDBLOOD: 'Saurus Oldblood',
  SCARVET_ON_COLD_ONE: 'Saurus Scar-Veteran on Cold One',
  ETERNITY_WARDEN: 'Saurus Eternity Warden',
  SUNBLOOD: 'Saurus Sunblood',
  SCARVET: 'Scar-Veteran with Battle Standard',
  ASTROLITH_BEARER: 'Saurus Astrolith Bearer',
  SKINK_PRIEST: 'Skink Priest',
  SKINK_STARSEER: 'Skink Starseer',
  SKINK_STARPRIEST: 'Skink Starpriest',
  ENGINE_OF_THE_GODS: 'Engine of the Gods',
  SAURUS_WARRIORS: 'Saurus Warriors',
  SAURUS_GUARD: 'Saurus Guard',
  SAURUS_KNIGHTS: 'Saurus Knights',
  SKINKS: 'Skinks',
  CHAMELEON_SKINKS: 'Chameleon Skinks',
  TERRADONS: 'Terradon Riders',
  RIPPERDACTYLS: 'Ripperdactyl Riders',
  SKINK_HANDLERS: 'Skink Handlers',
  SALAMANDERS: 'Salamanders',
  RAZORDONS: 'Razordons',
  KROXIGOR: 'Kroxigor',
  STEGADON: 'Stegadon',
  BASTILADON: 'Bastiladon',
  TROGLODON: 'Troglodon',
  DREAD_SAURIAN: 'Dread Saurian',
}

// Battalions
export const Battalions: IBattalions = {
  //   BLOODCLAW_STARHOST: 'Bloodclaw Starhost',
  //   ETERNAL_STARHOST: 'Eternal Starhost',
  //   FIRELANCE_STARHOST: 'Firelance Starhost',
  //   HEAVENSWATCH_STARHOST: 'Heavenswatch Starhost',
  SHADOWSTRIKE_STARHOST: {
    name: 'Shadowstrike Starhost',
    effects: [
      {
        name: 'Stealthy Advance',
        desc:
          'After set-up is complete, you can roll two dice for each unit in a Shadowstrike Starhost and move all of its models up to that many inches.',
        when: [SETUP_END],
      },
      {
        name: 'The Trap is Sprung',
        desc:
          'In your hero phase, pick a unit that is visible to the starhost’s Skink Priest or Starpriest. Until your next hero phase, you can re-roll hit and wound rolls of 1 for units from the Shadowstrike Starhost that attack the unit you picked.',
        when: [HERO_PHASE],
      },
      {
        name: 'Strike From the Skies',
        desc:
          'Instead of setting up the flying unit from this battalion on the battlefield, you can place it to one side and say that it is hidden amid the clouds. In any of your movement phases, the unit can plummet from the skies to assail the foe. When it does so, you can set it up anywhere more than 3" from the enemy. In the following combat phase, add 1 to the result of any wound rolls made for models from that unit.',
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  //   STARBEAST_CONSTELLATION: 'Starbeast Constellation',
  //   SUNCLAW_STARHOST: 'Sunclaw Starhost',
  //   THUNDERQUAKE_STARHOST: 'Thunderquake Starhost',
  //   FANGS_OF_SOTEK: 'Fangs of Sotek',
  //   DRACOTHIANS_TAIL: "Dracothion's Tail",
}
