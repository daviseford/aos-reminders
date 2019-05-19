import { IBattalions, IUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  DURING_GAME,
  COMBAT_PHASE,
  CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

// Command Trait Keywords
export const Tags = {}

// Unit Names
export const Units: IUnits = {
  SKRAGROTT: {
    name: 'Skragrott, The Loonking',
    effects: [],
  },
  GROT_WARBOSS: {
    name: 'Grot Warboss',
    effects: [],
  },
  LOONBOSS: {
    name: 'Loonboss',
    effects: [],
  },
  LOONBOSS_ON_MANGER_SQUIG: {
    name: 'Loonboss on Mangler Squigs',
    effects: [],
  },
  LOONBOSS_ON_GIANT_CAVE_SQUIG: {
    name: 'Loonboss with Giant Cave Squig',
    effects: [],
  },
  MADCAP_SHAMAN: {
    name: 'Madcap Shaman',
    effects: [],
  },
  FUNGOID_CAVE_SHAMAN: {
    name: 'Fungoid Cave-Shaman',
    effects: [],
  },
  ZARBAG: {
    name: 'Zarbag',
    effects: [],
  },
  STABBAS: {
    name: 'Stabbas',
    effects: [],
  },
  SHOOTAS: {
    name: 'Shootas',
    effects: [],
  },
  LOONSMASHA_FANATICS: {
    name: 'Loonsmasha Fanatics',
    effects: [],
  },
  SPORESPLATTA_FANATICS: {
    name: 'Sporesplatta Fanatics',
    effects: [],
  },
  SQUIG_HOPPERS: {
    name: 'Squig Hoppers',
    effects: [],
  },
  BOINGROT_BOUNDERZ: {
    name: 'Boingrot Bounderz',
    effects: [],
  },
  GROT_SQUIG_HERDERS: {
    name: 'Grot Squig Herders',
    effects: [],
  },
  ZARBAGS_GITZ: {
    name: "Zarbag's Gitz",
    effects: [],
  },
  SCAREMONGER: {
    name: 'Scaremonger',
    effects: [],
  },
  BREWGIT: {
    name: 'Brewgit',
    effects: [],
  },
  SPIKER: {
    name: 'Spiker',
    effects: [],
  },
  BOGGLEYE: {
    name: 'Boggleye',
    effects: [],
  },
  SHROOMANCER: {
    name: 'Shroomancer',
    effects: [],
  },
  SNEAKY_SNUFFLERS: {
    name: 'Sneaky Snufflers',
    effects: [],
  },
  SQUIG_HERD: {
    name: 'Squig Herd',
    effects: [],
  },
  MANGER_SQUIGS: {
    name: 'Mangler Squigs',
    effects: [],
  },
  COLOSSAL_SQUIG: {
    name: 'Colossal Squig',
    effects: [],
  },
  SQUIG_GOBBAS: {
    name: 'Squig Gobba',
    effects: [],
  },
  WEBSPINNER_SHAMAN_ON_ARACHNAROK_SPIDER: {
    name: 'Webspinner Shaman on Arachnarok Spider',
    effects: [],
  },
  SCUTTLEBOSS_ON_GIGANTIC_SPIDER: {
    name: 'Scuttleboss on Gigantic Spider',
    effects: [],
  },
  WEBSPINNER_SHAMAN: {
    name: 'Webspinner Shaman',
    effects: [],
  },
  SPIDER_RIDERS: {
    name: 'Spider Riders',
    effects: [],
  },
  ARACHNAROK_SPIDER_WITH_FLINGER: {
    name: 'Arachnarok Spider with Flinger',
    effects: [],
  },
  ARACHNAROK_SPIDER_WITH_SPIDERFANG_WARPARTY: {
    name: 'Arachnarok Spider with Spiderfang Warparty',
    effects: [],
  },
  SKITTERSTRAND_ARACHNAROK: {
    name: 'Skitterstrand Arachnarok',
    effects: [],
  },
  TROGGOTH_HAG: {
    name: 'Troggoth Hag',
    effects: [],
  },
  DANKHOLD_TROGGBOSS: {
    name: 'Dankhold Troggboss',
    effects: [],
  },
  MOLLOG: {
    name: 'Mollog',
    effects: [],
  },
  FELLWATER_TROGGOTHS: {
    name: 'Fellwater Troggoths',
    effects: [],
  },
  SOURBREATH_TROGGOTHS: {
    name: 'Sourbreath Troggoths',
    effects: [],
  },
  ROCKGUT_TROGGOTHS: {
    name: 'Rockgut Troggoths',
    effects: [],
  },
  DANKHOLD_TROGGOTHS: {
    name: 'Dankhold Troggoths',
    effects: [],
  },
  ALEGUZZLER_GARGANT: {
    name: 'Aleguzzler Gargant',
    effects: [],
  },
  BONEGRINDER_GARGANT: {
    name: 'Bonegrinder Gargant',
    effects: [],
  },
}

// Battalions
export const Battalions: IBattalions = {
  ARACHNAROK_SPIDER_CLUSTER: {
    name: 'Arachnarok Spider Cluster',
    effects: [
      {
        name: 'Hunting Brood',
        desc:
          'You can re-roll hit rolls of 1 for attacks made by a model from the Arachnarok Spider Cluster battalion while it is within 6" of another model from the same battalion.',
        when: COMBAT_PHASE,
      },
    ],
  },
  GOBBAPALOOZA: {
    name: 'Gobbapalooza',
    effects: [
      {
        name: 'Brew-fuelled Madness',
        desc:
          'Add 1 to casting and Gobbapalooza Know-wotz rolls for a model from the Gobbapalooza battalion while that model is within 8" of any other models from the same battalion.',
        when: HERO_PHASE,
      },
    ],
  },
  MOONCLAN_SKRAP: {
    name: 'Moonclan Skrap',
    effects: [
      {
        name: 'Spreading Loonacy',
        desc:
          'Do not take battleshock tests for units from the Moonclan Skrap battalion while they are affected by the light of the Bad Moon.',
        when: BATTLESHOCK_PHASE,
      },
    ],
  },
  SKITTERSTRAND_NEST: {
    name: 'Skitterstrand Nest',
    effects: [
      {
        name: 'Burst from Beyond',
        desc:
          'Add 1 to charge rolls for models from the Skitterstrand Nest battalion for each model from this battalion that was set up in the same turn.',
        when: CHARGE_PHASE,
      },
    ],
  },
  SKULKMOB_HORDE: {
    name: 'Skulkmob Horde',
    effects: [
      {
        name: 'Endless Hordes',
        desc:
          'Once per battle, when you use a Bad Moon Loonshrine’s Moonclan Lair ability to successfully replace a destroyed unit from the Endless Hordes battalion, the replacement unit has all of the models from the destroyed unit instead of half.',
        when: HERO_PHASE,
      },
    ],
  },
  SPIDERFANG_STALK_TRIBE: {
    name: 'Spiderfang Stalk Tribe',
    effects: [
      {
        name: 'Power of the Spider God',
        desc:
          'You can re-roll save rolls of 1 for attacks that target a unit from a Spiderfang Stalk Tribe battalion while the target unit is wholly within 24" of a SPIDERFANG WIZARD from the same battalion.',
        when: DURING_GAME,
      },
    ],
  },
  SPIDER_RIDER_SKITTERMOB: {
    name: 'Spider Rider Skittermob',
    effects: [
      {
        name: 'Outriders of the Spider God',
        desc: 'Add 2" to the Move characteristic of units from the Spider Rider Skittermob battalion.',
        when: MOVEMENT_PHASE,
      },
    ],
  },
  SQUIGALANCHE: {
    name: 'Squigalanche',
    effects: [
      {
        name: 'Over Da Moon',
        desc:
          'If the light of the Bad Moon affects a unit from the Squigalanche battalion at the start of a combat phase, that unit is eligible to fight in the combat phase if it is within 6" of an enemy unit instead of 3", and can move an extra 3" when it piles in.',
        when: START_OF_COMBAT_PHASE,
      },
    ],
  },
  SQUIG_RIDER_STAMPEDE: {
    name: 'Squig Rider Stampede',
    effects: [
      {
        name: 'Madcap Momentum',
        desc:
          'You can re-roll the roll that determines the Move characteristic of units from the Squig Rider Stampede battalion.',
        when: MOVEMENT_PHASE,
      },
    ],
  },
  TROGGHERD: {
    name: 'Troggherd',
    effects: [
      {
        name: 'Eat on the Move',
        desc:
          'If the unmodified wound roll for an attack made with a melee weapon used by a model from the Troggherd battalion is 6, add 1 to the Damage characteristic for that attack.',
        when: COMBAT_PHASE,
      },
    ],
  },
}
