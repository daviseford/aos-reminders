import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_CHARGE_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

const AlmightyStompEffect = {
  name: `Almighty Stomp`,
  desc: `You can reroll hit rolls of 1 for Almighty Stomp attacks unless the target is a MONSTER.`,
  when: [COMBAT_PHASE],
}
const CrushingChargeEffect = {
  name: `Crushing Charge`,
  desc: `After this model makes a charge move, roll a D6 for each enemy unit within 1" of this model. On a 2+, that unit suffers D3 mortal wounds if it is a MONSTER, or D6 mortal wounds if it is not a MONSTER.`,
  when: [CHARGE_PHASE],
}
const DeathGripEffect = {
  name: `Death Grip`,
  desc: `You can reroll hit rolls of 1 for Death Grip attacks that target a MONSTER.`,
  when: [COMBAT_PHASE],
}
const LongshanksEffect = {
  name: `Longshanks`,
  desc: `When this model makes a move, it can ignore models, endless spells, invocations and terrain features that are less than 4" tall at their highest point. It cannot finish the move on top of another model or within 3" of an enemy model.`,
  when: [MOVEMENT_PHASE],
  rule_sources: [
    rule_sources.BATTLETOME_SONS_OF_BEHEMAT,
    rule_sources.ERRATA_SONS_OF_BEHEMAT_MARCH_2021,
    rule_sources.ERRATA_SONS_OF_BEHEMAT_JULY_2021,
  ],
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
const BaseMegaGargantEffects = [
  AlmightyStompEffect,
  CrushingChargeEffect,
  DeathGripEffect,
  GenericEffects.Terror,
  LongshanksEffect,
  SonOfBehematEffect,
  TimberrrrrEffect,
]

const Units = {
  Gatebreaker: {
    effects: [
      ...BaseMegaGargantEffects,
      {
        name: `Smash Down`,
        desc: `Add 1 to the damage inflicted by each successful attack made by this unit that targets a unit that is part of a garrison or is wholly on or within a terrain feature.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_SONS_OF_BEHEMAT,
          rule_sources.ERRATA_SONS_OF_BEHEMAT_JULY_2021,
        ],
      },
      {
        name: `Smash Down`,
        desc: `Add 1 to the roll when you carry out a Smash To Rubble monstrous rampage with this unit.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_SONS_OF_BEHEMAT,
          rule_sources.ERRATA_SONS_OF_BEHEMAT_JULY_2021,
        ],
      },
    ],
  },
  'Kraken-Eater': {
    effects: [
      ...BaseMegaGargantEffects,
      {
        name: `Get Orf Me Land!`,
        desc: `In your hero phase, if you have any models with this ability within 1" of an objective that you control, you can pick one of those models and say that it will kick the objective away. If you do so, you can move that objective up to 2D6" to a new position on the battlefield, more than 1" away from any models, terrain features or other objectives. An objective cannot be kicked away more than once in the same phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Stuff 'Em In Me Net`,
        desc: `After this model piles in, you can pick up to D3 enemy models within 3" of this model and roll a D6 for each of them. If the roll is at least double that model's Wounds characteristic, it is slain.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Warstomper: {
    effects: [
      ...BaseMegaGargantEffects,
      {
        name: `Hurled Body`,
        desc: `Once per combat phase, you can pick 1 enemy model within 3" of this model and roll a D6. Add the Hurled Body modifier shown on this model's damage table to the roll. If the roll is at least double that enemy model's Wounds characteristic, it is slain and you can roll another dice. On a 4+ you can pick an enemy unit within 12" of this model and visible to it. That unit suffers a number of mortal wounds equal to the Wounds characteristic of the slain model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Titanic Boulderclub`,
        desc: `The Attacks characteristic of a Titanic Boulderclub is equal to the number of enemy models within 3" of the attacking model. Add the Titanic Boulderclub value on the attacking model's damage table to the total, and add 4 to the total for each enemy MONSTER within 3" of the attacking model. If the modified Attacks characteristic Of the Titanic Boulderclub is less than 1, count it as being 1, and if the modified Attacks characteristic of the Titanic Boulderclub is more than 10, count it as being 10.`,
        when: [COMBAT_PHASE],
      },
    ],
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
      SonOfBehematEffect,
      GenericEffects.Terror,
      LongshanksEffect,
      TimberrrrrEffect,
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
        name: `Mega-Club of Gork`,
        desc: `Add 1 to the Bravery characteristic of friendly Orruk units while they are wholly within 12" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      LongshanksEffect,
    ],
  },
}

export default tagAs(Units, 'unit')
