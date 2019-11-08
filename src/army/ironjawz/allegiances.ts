import { TAllegiances } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_CHARGE_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_GAME,
} from 'types/phases'

// This is where we store sub-allegiances such as
const Allegiances: TAllegiances = [
  {
    name: `Ironsunz`,
    effects: [
      {
        name: `Ironsunz Kunnin'`,
        desc: `-1 to be hit for enemy attacks in the first battle round.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Alright - Get 'Em`,
        desc: `Use at the end of the enemy charge phase, pick 1 friendly unit that is between 3" and 12" of an enemy unit and wholly within 18" of a friendly hero, that unit can charge.`,
        when: [END_OF_CHARGE_PHASE],
        command_ability: true,
      },
      {
        name: `Right Fist of Dakkbad`,
        desc: `Gain +1 CP at the start of the game.`,
        when: [START_OF_GAME],
        command_trait: true,
      },
      {
        name: `Sunzblessed Armour`,
        desc: `Attacks that target the bearer have their rend reduced by 1, to a minimum of 0.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Bloodtoofs`,
    effects: [
      {
        name: `Hunt and Crush`,
        desc: `+1 to run and charge rolls. This stacks with Eager for Battle.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Break Through da Line`,
        desc: `Pick a friendly unit that's already fought wholly within 24" of a hero, that unit can make a normal move but can't retreat or run.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Get Da Realmgate`,
        desc: `Add 2 to the dice result when you use the IRONJAWZ Waaagh! ability if there's a baleful realmgate on the table.`,
        when: [START_OF_COMBAT_PHASE],
        command_trait: true,
      },
      {
        name: `Quickduff Amulet`,
        desc: `Once per battle, the bearer may automatically cast the Great Green Hand of Gork for free and cannot be unbound.`,
        when: [HERO_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Da Choppas`,
    effects: [
      {
        name: `Vandal Hordes`,
        desc: `Re-roll charges if the unit is within 12" of a terrain feature that's partially or wholly within enemy territory.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Rabble Rouser`,
        desc: `Pick a warchanter, that warchanter can pick 3 Brutes or Ardboyz to benefit from its Violent fury ability instead of 1.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Checked Out`,
        desc: `Add 2 to the Bravery characteristic for units wholly within 18" of this general.`,
        when: [BATTLESHOCK_PHASE],
        command_trait: true,
      },
      {
        name: `Megaskull Staff`,
        desc: `The bearer gains the Megaboss keyword for the purposes of using the IRONJAWZ Waaagh! ability.`,
        when: [START_OF_COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
]

export default Allegiances
