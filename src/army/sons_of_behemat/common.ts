import GenericEffects from 'army/generic/effects'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const AlmightyStompEffect = {
  name: `Almighty Stomp`,
  desc: `You can reroll hit rolls of 1 for Almighty Stomp attacks unless the target is a MONSTER.`,
  when: [COMBAT_PHASE],
}
const CrushingChargeEffect = {
  name: `Crushing Charge`,
  desc: `After this model makes a charge move, roll a dice for each enemy unit within 1" of this model. On a 2+, that unit suffers D3 mortal wounds if it is a MONSTER, or D6 mortal wounds if it is not a MONSTER.`,
  when: [CHARGE_PHASE],
}
const DeathGripEffect = {
  name: `Death Grip`,
  desc: `You can reroll hit rolls of 1 for Death Grip attacks that target a MONSTER.`,
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
const BaseMegaGargantEffects = [
  AlmightyStompEffect,
  CrushingChargeEffect,
  DeathGripEffect,
  GenericEffects.Terror,
  LongshanksEffect,
  SonOfBehematEffect,
  TimberrrrrEffect,
]

const CommonSonsOfBehematData = {
  EFFECTS: {
    WarstomperEffects: [
      ...BaseMegaGargantEffects,
      {
        name: `Hurled Body`,
        desc: `Once per combat phase, you can pick 1 enemy model within 3" of this model and roll a dice. Add the Hurled Body modifier shown on this model's damage table to the roll. If the roll is at least double that enemy model's Wounds characteristic, it is slain and you can roll another dice. On a 4+ you can pick an enemy unit within 12" of this model and visible to it. That unit suffers a number of mortal wounds equal to the Wounds characteristic of the slain model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Titanic Boulderclub`,
        desc: `The Attacks characteristic of a Titanic Boulderclub is equal to the number of enemy models within 3" of the attacking model. Add the Titanic Boulderclub value on the attacking model's damage table to the total, and add 4 to the total for each enemy MONSTER within 3" of the attacking model. If the modified Attacks characteristic Of the Titanic Boulderclub is less than 1, count it as being 1, and if the modified Attacks characteristic of the Titanic Boulderclub is more than 10, count it as being 10.`,
        when: [COMBAT_PHASE],
      },
    ],
    GatebreakerEffects: [
      ...BaseMegaGargantEffects,
      {
        name: `Smash Down`,
        desc: `Add 1 to the damage inflicted by each successful attack made by this model that targets a unit that is part of a garrison or is wholly on or within a terrain feature.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Smash Down`,
        desc: `At the end of the combat phase, you can pick 1 terrain feature within 3" of this model and roll a dice. If the roll is equal to or greater than the Smash Down value on this model's damage table, that terrain feature is reduced to rubble: all of its scenery rules are replaced with the Deadly scenery rule, and its keywords are changed to SCENERY, RUBBLE.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
    KrakenEaterEffects: [
      ...BaseMegaGargantEffects,
      {
        name: `Get Orf Me Land!`,
        desc: `In your hero phase, if you have any models with this ability within 1" of an objective that you control, you can pick one of those models and say that it will kick the objective away, If you do so, you can move that objective up to 2D6" to a new position on the battlefield, more than 1" away from any models, terrain features or other objectives. An objective cannot be kicked away more than once in the same phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Stuff 'Em In Me Net`,
        desc: `After this model piles in, you can pick up to D3 enemy models within 3" of this model and roll a dice for each of them. If the roll is at least double that model's Wounds characteristic, it is slain.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  TRIBES: {
    Breaker: `Breaker`,
    BreakerTag: `(Breaker Tribe)`,
    Stomper: `Stomper`,
    StomperTag: `(Stomper Tribe)`,
    Taker: `Taker`,
    TakerTag: `(Taker Tribe)`,
  },
  TAGS: {
    BigShoutTag: `(Big Shout)`,
    FierceLoathingTag: `(Fierce Loathing)`,
  },
}

export default CommonSonsOfBehematData
