import CitiesOfSigmar from 'army/cities_of_sigmar'
import StormcastEternals from 'army/stormcast_eternals'
import { TBattalions, TUnits } from 'types/army'
import {
  COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  SHOOTING_PHASE,
  TURN_ONE_START_OF_HERO_PHASE,
} from 'types/phases'

const getStormcastUnits = () => StormcastEternals.Units
const getCitiesUnits = () => CitiesOfSigmar.Units
const getStormcastBattalions = () => StormcastEternals.Battalions

// Unit Names
export const Units: TUnits = [...getStormcastUnits()]

// Allied units
export const AlliedUnits: TUnits = [...getCitiesUnits()]

// Battalions
export const Battalions: TBattalions = [
  ...getStormcastBattalions(),
  {
    name: `Wardens of the Stormkeep`,
    effects: [
      {
        name: `Watchful Commanders`,
        desc: `Roll 1 dice for each hero from this battalion, adding 3 to the roll if the hero is the general. On each 5+ you receive 1 command point.`,
        when: [TURN_ONE_START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Stormtower Garrison`,
    effects: [
      {
        name: `Brothers in Arms`,
        desc: `Paladin and Justicar battalion units wholly within 12" of any battalion Liberators units can use the Shield of Civilisation trait.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Stormkeep Patrol`,
    effects: [
      {
        name: `Ever Vigilent`,
        desc: `You can remove the battalion units from the battlefield. You may then set up the Lord-Veritant more than 9" from enemy units followed by the remaining battalion units, again more than 9" from the enemy and wholly within 12" of the Lord-Veritant.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  {
    name: `Stormkeep Brotherhood`,
    effects: [
      {
        name: `Defenders of the Faithful`,
        desc: `You can add 1 to wound rolls for this battalion's units while any of those unit's models are in your territory.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
]
