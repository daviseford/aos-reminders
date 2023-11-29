import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_CHARGE_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const AlmightyStompEffect = {
  name: `Almighty Stomp`,
  desc: `Add 1 to hit rolls for attacks made with this unit's Almighty Stomp that target an enemy unit with a Wounds characteristic of 3 or less.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const CrushingChargeEffect = {
  name: `Crushing Charge`,
  desc: `After this model makes a charge move, roll a dice for each enemy unit within 1" of this model. On a 2+, that unit suffers D3 mortal wounds if it is a MONSTER, or D6 mortal wounds if it is not a MONSTER.`,
  when: [CHARGE_PHASE],
  shared: true,
}
const DeathGripEffect = {
  name: `Death Grip`,
  desc: `When determinig the damage inflicted by an attack made with this unit's Death Grip that targets an enemy Monster, you can roll 2 dice instead of 1 and pick either result.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const LongshanksEffect = {
  name: `Longshanks`,
  desc: `When this unit makes a normal move, run or retreats, it can pass across other models that are not Monsters and parts of terrain features that are less than 4" tall in the same manner as a unit that can fly.`,
  when: [MOVEMENT_PHASE],
  shared: true,
}
const SonOfBehematEffect = {
  name: `Son of Behemat`,
  desc: `If a spell or ability would slay this model without any wounds or mortal wounds being caused by the spell or ability, this model suffers D6 mortal wounds instead of being slain.`,
  when: [WOUND_ALLOCATION_PHASE],
  shared: true,
}
const TerrorEffect = {
  name: `Terror`,
  desc: `Enemy units cannot receive the Inspiring PResence command while they are within 3" of any friendly units with this ability.`,
  when: [BATTLESHOCK_PHASE],
  shared: true,
}
const TimberrrrrEffect = {
  name: `Timberrrrr!`,
  desc: `If this model is slain, before removing the model from the battlefield, the players must roll off. The winner must pick a point on the battlefield 5" from this model. Each unit within 3" of that point that is not a Mega-Gargant suffers D3 mortal wounds. This slain model is then removed from the battlefield.`,
  when: [WOUND_ALLOCATION_PHASE],
  shared: true,
}
const BaseMegaGargantEffects = [
  AlmightyStompEffect,
  CrushingChargeEffect,
  DeathGripEffect,
  TerrorEffect,
  LongshanksEffect,
  SonOfBehematEffect,
  TimberrrrrEffect,
]

const BaseGargantEffects = [
  {
    name: `Keep Up!`,
    desc: `If this unit is wholly within 15" of a friendly MEGA-GARGANT at the start of the charge phase, it can attempt to charge in that charge phase even if it ran in the same turn.`,
    when: [START_OF_CHARGE_PHASE],
    shared: true,
  },
  {
    name: `Stomping Charge`,
    desc: `After a model from this unit makes a charge move, pick 1 enemy unit within 1" of it and roll a dice. If the roll is equal to or greater than the Stomping Charge value for the charging model shown on the damage table above, that unit suffers D3 mortal wounds. If this unit has more than 1 model, do not allocate the mortal wounds until all of the models in this unit have made their charge moves.`,
    when: [CHARGE_PHASE],
    shared: true,
  },
  {
    name: `Stuff 'Em In Me Bag`,
    desc: `After a model from this unit piles in, you can pick 1 enemy model within 3" of it and roll a D6. If the roll is at least double that model's Wounds characteristic, it is slain.`,
    when: [COMBAT_PHASE],
    shared: true,
  },
  {
    name: `Timber!`,
    desc: `If a model from this unit is slain, before removing it from the battlefield, the players must roll off. The winner must pick a point on the battlefield 3" from that model. Each unit within 2" of that point that is not a Gargant or Mega-Gargant suffers D3 mortal wounds. The slain model is then removed from the battlefield.`,
    when: [WOUND_ALLOCATION_PHASE],
    shared: true,
  },
]

const Units = {
  'King Brodd': {
    effects: [
      ...BaseMegaGargantEffects,
      {
        name: `Warmaster`,
        desc: `If this unit is included in a Sons of Behemat army, it is treated as a general even if it is not the model picked to be the army's general.`,
        when: [DURING_GAME],
      },
      {
        name: `Creepers`,
        desc: `In each charge phase, the first time an enemy Monster within 3" of this unit is picked to carry out a monstrous rampage, roll a dice. If the roll is equal to or greate than the Creepers value shown on this unit's damage table, that Monster cannot carry out a monstrous rampage that phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Power of Behemat`,
        desc: `Answer value of 3. Add 1 to the chanting roll if an enemy Monster has been slain by this unit in this battle. If answered, pick 1 of the effects below. The same effect cannot be picked more than once per battle.`,
        when: [HERO_PHASE],
      },
      {
        name: `Power of Behemat - Shatter the Mountains`,
        desc: `Add 2" to the Move characteristic of friendly Sons of Behemat units until the end of the turn.`,
        when: [HERO_PHASE, MOVEMENT_PHASE],
      },
      {
        name: `Power of Behemat - Might of the Earth`,
        desc: `You can heal up to D3 wounds allocated to each friendly Sons of Behemat unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Power of Behemat - Pummel All to Dust`,
        desc: `Improve the Rend characteristic of the following melee weapons used by friendly Sons of Behemat units by 1 until the end of the turn: Obelisk of Tor Cranks, Menhir Club, Shipwrecka Warclub, Titanic Boulderclub, Fortcrusha Flail and Massive Club.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Beast-Smasher': {
    effects: [
      ...BaseMegaGargantEffects,
      {
        name: `Beast-breaking Strike`,
        desc: `When this unit fights, if it is within 3" of an enemy Monster, you can say that it will unlease a beast-breaking strike. If you do so, until the end of the phase, the Attacks characteristic of this unit's Menhir club is 1 and cannot be modified, the Damage characteristic is 5D6, and all attacks made with its Menhir Club must target an enemy Monster.`,
        when: [COMBAT_PHASE],
        shared: true, // it's not normally correct to set this directly on units, but this unit gets extended for the merc version
      },
      {
        name: `Behemoth Brawler`,
        desc: `At the end of the charge phase, if this unit is within 3" of any enemy Monsters, you can carry out 2 monstrous rampages with this unit instead of 1. If you do so each monstrous rampage carried out with this unit must be different and each must target an enemy Monster.`,
        when: [END_OF_CHARGE_PHASE],
        shared: true, // it's not normally correct to set this directly on units, but this unit gets extended for the merc version
      },
    ],
  },
  Gatebreaker: {
    effects: [
      ...BaseMegaGargantEffects,
      {
        name: `Pulverising Strike`,
        desc: `When this unit fights, you can say it will unleash a pulverising strike. If you do so, instead of making attacks with this unit's melee weapons, pick 1 enemy unit within 3" of this unit and roll a dice. On a 4+, that enemy unit suffers 4D6 mortal wounds.`,
        when: [COMBAT_PHASE],
        shared: true, // it's not normally correct to set this directly on units, but this unit gets extended for the merc version
      },
      {
        name: `Smash Down`,
        desc: `Add 1 to the Damage characteristic of this unit's Fortcrusha Flail for attacks that target an enemy unit in cover or garrisoning a terrain feature.`,
        when: [COMBAT_PHASE],
        shared: true, // it's not normally correct to set this directly on units, but this unit gets extended for the merc version
      },
      {
        name: `Smash Down`,
        desc: `If you carry out the Smash To Rubble monstrous action with this unit, roll a dice for each enemy unit within 3" of the terrain feature picked and for each unit garrsioning it. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
        shared: true, // it's not normally correct to set this directly on units, but this unit gets extended for the merc version
      },
    ],
  },
  'Kraken-Eater': {
    effects: [
      ...BaseMegaGargantEffects,
      {
        name: `Get Orf Me Land!`,
        desc: `In your hero phase, if any friendly units with this ability are on the battlefield and within 1" of an objective that you control, you can pick 1 of those units and say that it will kick 1 objective that is within 1" of it away. If you do so, you can move that objective up to 2D6" to a new position on the battlefield, more than 1" from any models, terrain features or other objectives. 
        
        Deisgner's Note: As some objectives behave differently in different areas of the battlefield, the value of an objective can change when it is kicked into different territories.`,
        when: [HERO_PHASE],
        shared: true, // it's not normally correct to set this directly on units, but this unit gets extended for the merc version
      },
      {
        name: `Stuff 'Em In Me Net`,
        desc: `After this unit makes a pile-in move, pick up to D3 enemy models within 3" of it and roll a dice for each. If the roll is at least double that model's Wounds characteristic, it is slain.`,
        when: [COMBAT_PHASE],
        shared: true, // it's not normally correct to set this directly on units, but this unit gets extended for the merc version
      },
    ],
  },
  Warstomper: {
    effects: [
      ...BaseMegaGargantEffects,
      {
        name: `Hurled Body`,
        desc: `After this unit makes a pile-in move, pick 1 enemy model within 3" of this model and roll a dice. Add the Hurled Body modifier shown on this model's damage table to the roll. If the roll is at least double that enemy model's Wounds characteristic, it is slain and you can roll another dice. On a 4, pick an enemy unit within 12" of this model and visible to it. That unit suffers a number of mortal wounds equal to the Wounds characteristic of the slain model.`,
        when: [COMBAT_PHASE],
        shared: true, // it's not normally correct to set this directly on units, but this unit gets extended for the merc version
      },
      {
        name: `Titanic Boulderclub`,
        desc: `The Attacks characteristic of a Titanic Boulderclub is equal to the number of enemy models within 3" of the attacking model. Add the Titanic Boulderclub value on the attacking model's damage table to the total, and add 4 to the total for each enemy MONSTER within 3" of the attacking model. If the modified Attacks characteristic Of the Titanic Boulderclub is less than 1, count it as being 1, and if the modified Attacks characteristic of the Titanic Boulderclub is more than 10, count it as being 10.`,
        when: [COMBAT_PHASE],
        shared: true, // it's not normally correct to set this directly on units, but this unit gets extended for the merc version
      },
    ],
  },
  'Mancrusher Gargant': {
    effects: [...BaseGargantEffects],
  },
  'Mancrusher Mob': {
    effects: [
      ...BaseGargantEffects,
      {
        name: `Oo's Under the Heel Now!`,
        desc: `If you carry out the Stomp monstrous rampage with this unti's Bullstomper and roll a 2+, for each other Mancrusher Gargant model in this unit, add 1 to the number of mortal wounds caused.`,
        when: [END_OF_CHARGE_PHASE],
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
} satisfies TItemDescriptions

export default tagAs(Units, 'unit')
