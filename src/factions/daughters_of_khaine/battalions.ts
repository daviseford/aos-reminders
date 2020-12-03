import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_ROUND,
} from 'types/phases'

export const RegularBattalions = {
  'Cauldron Guard': {
    effects: [
      {
        name: `Frenzied Devotees`,
        desc: `Add 1 to the run and charge rolls made for units from this battalion.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Slaughter Troupe': {
    effects: [
      {
        name: `Gladiatorial Acrobatics`,
        desc: `Slaughter Troupe units that retreat can still shoot and charge in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Temple Nest': {
    effects: [
      {
        name: `Lethal Transfixion`,
        desc: `Each time your opponent makes a hit roll of 1 (after rerolls, but before modifiers are applied) when attacking a Temple Nest unit in the combat phase, the attacking unit suffers 1 mortal wound after all of its attacks have been made.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Shadow Patrol': {
    effects: [
      {
        name: `Shadowpaths`,
        desc: `Once per battle round, instead of moving one unit from this battalion that is more than 3" from enemy models, you can move along the shadowpaths. If it does so, remove the unit from the battlefield and set it up anywhere on the battlefield more than 9" from enemy models. This counts as its move in the movement phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Shadowhammer Compact': {
    effects: [
      {
        name: `Righteous Fervour`,
        desc: `Choose one Daughters of Khaine unit from this battalion and one Stormcast Eternals unit from this battalion that are within 6" of each other. Both units can either make a normal move (as though in the movement phase), shoot (as though in the shooting phase), or pile in and attack (as though in the combat phase). Both units must perform the same action. If only one can perform the selected action you may use the valid unit while the other does nothing.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Bloodwrack Sisterhood': {
    effects: [
      {
        name: `Delight in Slaughter`,
        desc: `In your hero phase, roll a D6 for each unit in this battalion that is within 3" of an enemy unit and within 9" of the battalion's Cauldron of Blood; on a 6 it can immediately pile in and attack as if it were the combat phase. This does not stop them from piling in and attacking again later in the turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Tyralla`s Scathcoven': {
    effects: [
      {
        name: `Devoted to the Oracle`,
        desc: `You can reroll 1's to save for attacks against this battalion's units.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Vyperic Guard': {
    effects: [
      {
        name: `Vaunted Slayers`,
        desc: `Once per battle, a hero from this battalion can use a command ability without spending a command point.`,
        when: [DURING_GAME],
      },
    ],
  },
  Scathcoven: {
    effects: [
      {
        name: `Devoted to Morathi`,
        desc: `Do not take battleshocks test for this battalion's units.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Shrine Blood': {
    effects: [
      {
        name: `Blood Sacrifice`,
        desc: `You can pick any number this battalion's units within 6" of a battallion Bloodwrack Shrine. 1 model from each selected unit is slain. Heal 1 allocated wound for each slain Harpy or 2 allocated wounds for each slain Melusai on the Shrine.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

const SuperBattalions = {
  'War Coven of Morathi': {
    effects: [
      {
        name: `Blood Rituals`,
        desc: `If your army has the Daughters of Khaine allegiance, units in this battalion count the current battle round number as being 1 higher than it actually is when determining the effect of the Blood Rites table. This effect is cumulative with other, similar abilities.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Devout Followers`,
        desc: `Do not take battleshock tests for War Coven of Morathi units that are within 18" of Morathi (in either form) when the test is taken.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
}

const Battalions = { ...RegularBattalions, ...SuperBattalions }

export default tagAs(Battalions, 'battalion')
