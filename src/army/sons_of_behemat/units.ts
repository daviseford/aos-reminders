import GenericEffects from 'army/generic/effects'
import { TBattalions, TUnits } from 'types/army'
import { CHARGE_PHASE, COMBAT_PHASE, HERO_PHASE, MOVEMENT_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

const AlmightyStompEffect = {
  name: `Almighty Stomp`,
  desc: `You can reroll hit rolls of 1 for Almighty Stomp attacks unless the target is a MONSTER.`,
  when: [COMBAT_PHASE],
}
const CrushingChargeEffect = {
  name: `Crushing Charge`,
  desc: `After this model makes a charge move, roll a dice for each enemy unit within 1" of this model. On a 24, that unit suffers D3 mortal wounds if it is a MONSTER, or D6 mortal wounds if it is not a MONSTER.`,
  when: [CHARGE_PHASE],
}
const DeathGripEffect = {
  name: `Death Grip`,
  desc: `You can reroll hit rolls of 1 for Death Grip attacks that target a MONSTER.`,
  when: [HERO_PHASE],
}
const GetOrfMeLandEffect = {
  name: `Get Orf Me Land!`,
  desc: `In your hero phase, if you have any models with this ability within 1" of an objective that you control, you can pick one of those models and say that it will kick the objective away, If you do so, you can move that objective up to 2D6" to a new position on the battlefield, more than 1" away from any models, terrain features or other objectives. An objective cannot be kicked away more than once in the same phase.`,
  when: [HERO_PHASE],
}
const LongshanksEffect = {
  name: `Longshanks`,
  desc: `When this model makes a normal move, it can ignore models that have a Wounds characteristic of 10 or less and terrain features that are less than 4" tall at their highest point. It cannot finish the move on top of another model or within 3" of an enemy model.`,
  when: [MOVEMENT_PHASE],
}
const SonOfBehematEffect = {
  name: `Son of Behemat`,
  desc: `If a spell or ability would slay this model without any wounds or mortal wounds being inflicted by the spell or ability, this model suffers D6 mortal wounds instead.`,
  when: [WOUND_ALLOCATION_PHASE],
}
const TimberrrrrEffect = {
  name: `Timberrrrr!`,
  desc: `If this model is slain, before removing the model from the battlefield, the players must roll off. The winner must pick a point on the battlefield 5" from this model. Each unit within 3" of that point suffers D3 mortal wounds unless it is a MEGA-GARGANT. This model is then removed from the battlefield.`,
  when: [WOUND_ALLOCATION_PHASE],
}

// Unit Names
export const Units: TUnits = [
  {
    name: `Kraken-eater Mega-Gargant`,
    effects: [
      AlmightyStompEffect,
      CrushingChargeEffect,
      DeathGripEffect,
      GetOrfMeLandEffect,
      LongshanksEffect,
      SonOfBehematEffect,
      GenericEffects.Terror,
      {
        name: `Stuff 'Em In Me Net`,
        desc: `After this model piles in, you can pick up to D3 enemy models within 3" of this model and roll a dice for each of them. If the roll is at least double that model's Wounds characteristic, it is slain.`,
        when: [COMBAT_PHASE],
      },
      TimberrrrrEffect,
    ],
  },
  {
    name: `Gatebreaker Mega-Gargant`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Warstomper Mega-Gargant`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
]

// Allied units (usually this will involve writing a function to grab units from another army)
// Check out Nurgle or Khorne for good examples
export const AlliedUnits: TUnits = []

// Battalions
export const Battalions: TBattalions = [
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
]
