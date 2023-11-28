import { tagAs } from 'factions/metatagger'
import {
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_DURING_ROUND,
} from 'types/phases'

const GruntaStampedeBattleTraits = {
  'Grunta Waaagh!': {
    effects: [
      {
        name: `Grunta Waaagh!`,
        desc: `Once per battle, at the start of your charge phase, you can pick 1 friendly MAW-GRUNTA general on the battlefield and say that they are calling a Grunta Waaagh!. If you do so, until the end of that phase, each time a friendly MAW-GRUNTA unit finishes a charge move, roll a dice for each enemy unit within 1" of any models in that MAW-GRUNTA unit. On a 3+, that enemy unit suffers D3 mortal wounds.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  'Hogs of War': {
    effects: [
      {
        name: `Hogs of War`,
        desc: `Friendly GORE-GRUNTAS units gain the Battleline battlefield role.`,
        when: [DURING_GAME],
      },
    ],
  },
  "'Ere We Come!": {
    effects: [
      {
        name: `'Ere We Come!`,
        desc: `During the first battle round, do not subtract 1 from the momentum score of friendly MAW-GRUNTA units at the end of each turn.`,
        when: [TURN_ONE_DURING_ROUND],
      },
    ],
  },
  'Monstrous Rampages': {
    effects: [
      {
        name: `Greedy Gobble`,
        desc: `You can only carry out this monstrous rampage with a unit that has a momentum score of 3 or less. Pick 1 enemy model within 3" of it and roll a dice. If the roll is at least double that model's Wounds characteristic, it is slain.`,
        when: [END_OF_CHARGE_PHASE],
        monstrous_rampage: true,
      },
      {
        name: `Charge Down`,
        desc: `You can only carry out this monstrous rampage with a model that made a charge move this turn and is not in a unit that has multiple models. That model can make a D6" move but must finish that move within 3" of any enemy units. Then, add 1 to the momentum score of that model.`,
        when: [END_OF_CHARGE_PHASE],
        monstrous_rampage: true,
      },
    ],
  },
  'Battle Tactics': {
    effects: [
      {
        name: `Out of Control`,
        desc: `You complete this battle tactic if you carry out Greedy Gobble, Charge Down and 2 other monstrous rampages this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Da Boss Leads Da Way`,
        desc: `You complete this battle tactic if, during this turn, your general calls a Grunta Waaagh! and any enemy units are destroyed by attacks made by your general or abilities used by your general this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Full-speed Stampede`,
        desc: `You complete this battle tactic if, at the end of the turn, there are 3 or more friendly MAW-GRUNTA units on the battlefield that each have a momentum score of 5+.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(GruntaStampedeBattleTraits, 'battle_trait')
