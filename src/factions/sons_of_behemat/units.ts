import { pickEffects, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  MOVEMENT_PHASE,
  START_OF_CHARGE_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import battle_traits from './battle_traits'

const Units = {
  Gatebreaker: {
    effects: pickEffects(battle_traits, ['Gatebreaker']),
  },
  'Kraken-Eater': {
    effects: pickEffects(battle_traits, ['KrakenEater']),
  },
  Warstomper: {
    effects: pickEffects(battle_traits, ['Warstomper']),
  },
  'Mancrusher Gargants': {
    effects: [
      {
        name: `Keep Up!`,
        desc: `If this unit is within 12" of a friendly MEGA-GARGANT at the start of the charge phase, it can attempt to charge in that charge phase even if it ran in the same turn.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Stomping Charge`,
        desc: `After a model from this unit makes a charge move, pick 1 enemy unit within 1" of it and roll a D6. If the roll is equal to or greater than the Stomping Charge value for the charging model shown on the damage table above, that unit suffers D3 mortal wounds. If this unit has more than 1 model, do not allocate the mortal wounds until all of the models in this unit have made their charge moves.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Stuff 'Em In Me Bag`,
        desc: `After a model from this unit piles in, you can pick 1 enemy model within 3" of it and roll a D6. If the roll is at least double that model's Wounds characteristic, it is slain.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Bonegrinder Mega-Gargant': {
    effects: [
      {
        name: `Thunderous Stomp`,
        desc: `You can reroll hit rolls of 1 for Thunderous Stomp attacks unless the target is a MONSTER.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `I'll Bite Your Head Off!`,
        desc: `After this model piles in, you can pick 1 enemy model that is within 3" of this model, and roll a dice. If the roll is greater than that enemy model's Wounds characteristic, that enemy model is slain.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Sons of Behemat`,
        desc: `If a spell or ability would slay this model without any wounds or mortal wounds being inflicted by the spell or ability, this model suffers D6 mortal wounds instead.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Terror`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units if they are within 3" of any friendly units with this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Timberrr!!!`,
        desc: `If this model is slain, before removing the model from the battlefield, the players must roll off. The winner must pick a point on the battlefield 5" from this model. Each unit within 3" of that point suffers D3 mortal wounds unless it is a MEGA-GARGANT. This model is then removed from the battlefield.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Mega-Club of Gork`,
        desc: `Add 1 to the Bravery characteristic of friendly Orruk units while they are wholly within 12" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Longshanks`,
        desc: `When this model makes a normal move, it can ignore models that have a Wounds characteristic of 10 or less and terrain features that are less than 4" tall at their highest point. It cannot finish the move on top of another model or within 3" of an enemy model.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
