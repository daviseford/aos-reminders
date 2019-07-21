import { TCommandTraits } from 'types/army'
import { HERO_PHASE, CHARGE_PHASE, DURING_GAME, END_OF_SETUP, COMBAT_PHASE, MOVEMENT_PHASE } from 'types/phases'

const CommandTraits: TCommandTraits = [
  {
    name: `Shielded by Faith (Aspects of Azyr)`,
    effects: [
      {
        name: `Shielded by Faith (Aspects of Azyr)`,
        desc: `Roll a dice each time you allocate a mortal wound to this general. On a 5+ that mortal wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Consummate Commander (Aspects of Azyr)`,
    effects: [
      {
        name: `Consummate Commander (Aspects of Azyr)`,
        desc: `If this general is on the battlefield at the start of your hero phase, roll a dice. On a 4+ you receive 1 extra command point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Cunning Strategist (Aspects of Azyr)`,
    effects: [
      {
        name: `Cunning Strategist (Aspects of Azyr)`,
        desc: `After set-up is complete, but before the battle begins, D3 friendly STORMCAST ETERNAL units can move up to 5".`,
        when: [END_OF_SETUP],
      },
    ],
  },
  {
    name: `Zealous Crusader (Aspects of Azyr)`,
    effects: [
      {
        name: `Zealous Crusader (Aspects of Azyr)`,
        desc: `You can reroll charge rolls for this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Staunch Defender (Aspects of Azyr)`,
    effects: [
      {
        name: `Staunch Defender (Aspects of Azyr)`,
        desc: `Add 1 to save rolls for attacks that target friendly STORMCAST ETERNAL units wholly within 9" of this general if that STORMCAST ETERNAL unit has not made a charge move the same turn.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Champion of the Realms (Aspects of Azyr)`,
    effects: [
      {
        name: `Champion of the Realms (Aspects of Azyr)`,
        desc: `Pick one of this general's melee weapons. Add 1 to the Attacks characteristic of that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Lithe Limbed (Mount Trait)`,
    effects: [
      {
        name: `Lithe Limbed (Mount Trait)`,
        desc: `Add 1 to the move characteristic of this model.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Keen-clawed (Mount Trait)`,
    effects: [
      {
        name: `Keen-clawed (Mount Trait)`,
        desc: `If the unmodified wound roll for an attack made with this mount's melee weapons is 6, that attack has a rend characteristic of -3.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Savage Loyalty (Mount Trait)`,
    effects: [
      {
        name: `Savage Loyalty (Mount Trait)`,
        desc: `If this model is slain by wounds or mortal wounds inflicted by an attack made with an enemy unit's melee weapons, roll a dice. On a 4+ that enemy unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]

export default CommandTraits
