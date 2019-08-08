import { TTraits } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_COMBAT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Shielded by Faith`,
    effects: [
      {
        name: `Shielded by Faith`,
        desc: `On a 5+, an allocated wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Consummate Commander`,
    effects: [
      {
        name: `Consummate Commander`,
        desc: `If this general is on the battlefield at the start of your hero phase, roll a dice. On a 4+ you receive 1 extra command point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Cunning Strategist`,
    effects: [
      {
        name: `Cunning Strategist`,
        desc: `After set-up is complete, but before the battle begins, D3 friendly STORMCAST ETERNAL units can move up to 5".`,
        when: [END_OF_SETUP],
      },
    ],
  },
  {
    name: `Zealous Crusader`,
    effects: [
      {
        name: `Zealous Crusader`,
        desc: `You can reroll charge rolls for this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Staunch Defender`,
    effects: [
      {
        name: `Staunch Defender`,
        desc: `Add 1 to save rolls for attacks that target friendly STORMCAST ETERNAL units wholly within 9" of this general if that STORMCAST ETERNAL unit has not made a charge move the same turn.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Champion of the Realms`,
    effects: [
      {
        name: `Champion of the Realms`,
        desc: `Pick one of this general's melee weapons. Add 1 to the Attacks of that weapon.`,
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
  {
    name: `Drake-kin (Mount Trait)`,
    effects: [
      {
        name: `Drake-kin (Mount Trait)`,
        desc: `Before determining damage for an attack that targets this model that has a Damage characteristic of any value other than 1, roll a dice. On a 5+ change the Damage characteristic of that attack to 1.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Thunder Caller (Mount Trait)`,
    effects: [
      {
        name: `Thunder Caller (Mount Trait)`,
        desc: `This model's Storm Breath ability has a range of 16" rather than 12".`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Pack Leader (Mount Trait)`,
    effects: [
      {
        name: `Pack Leader (Mount Trait)`,
        desc: `Add 2 to the Attacks characteristic oof this model's Claws and Fangs while this model is within 6" of any friendly DRACOTHIAN GUARD models.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Storm-winged (Mount Trait)`,
    effects: [
      {
        name: `Storm-winged (Mount Trait)`,
        desc: `After this model has moved, you can pick 1 enemy unit that has any models that this model passed across, and roll a dice. On a 2+ that unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Thunderlord (Mount Trait)`,
    effects: [
      {
        name: `Thunderlord (Mount Trait)`,
        desc: `The Roiling Thunderhead from this model's Lord of the Heavens ability has a range of 24" instead of 18".`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Star-branded (Mount Trait)`,
    effects: [
      {
        name: `Star-branded (Mount Trait)`,
        desc: `Subtract 1 from the number of wounds allocated to this model (to a minimum of 0) when determining which row on its damage table to use.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Wind Runner (Mount Trait)`,
    effects: [
      {
        name: `Wind Runner (Mount Trait)`,
        desc: `When this model Rides the Winds Aetheric, roll an extra dice when determining the distance it can move.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Aethereal Stalker (Mount Trait)`,
    effects: [
      {
        name: `Aethereal Stalker (Mount Trait)`,
        desc: `When this model is set up, choose an enemy unit. You can re-roll failed hit and wound rolls for attacks made with this model's Gryph-charger's Razor Beak and Claws that target that enemy unit.`,
        when: [DURING_SETUP, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Indefatigable (Mount Trait)`,
    effects: [
      {
        name: `Indefatigable (Mount Trait)`,
        desc: `You can re-roll run rolls for this model.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Swiftwing (Mount Trait)`,
    effects: [
      {
        name: `Swiftwing (Mount Trait)`,
        desc: `You can re-roll run rolls for this model.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Lashing Tail (Mount Trait)`,
    effects: [
      {
        name: `Lashing Tail (Mount Trait)`,
        desc: `At the end of the combat phase, you can pick an enemy unit within 3" of this model and roll a dice. On a 4+ that unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Steel Pinions (Mount Trait)`,
    effects: [
      {
        name: `Steel Pinions (Mount Trait)`,
        desc: `On a 6+, an allocated wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Bounding Leap (Mount Trait)`,
    effects: [
      {
        name: `Bounding Leap (Mount Trait)`,
        desc: `This model is eligible to fight in the combat phase if it is within 6" of an enemy unit instead of 3", and it can move an extra 3" when it piles in.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Pride Leader (Mount Trait)`,
    effects: [
      {
        name: `Pride Leader (Mount Trait)`,
        desc: `Add 1 to hit rolls for attacks made by friendly DRACOLINE units while they are wholly within 9" of this model.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Ear-bursting Roar (Mount Trait)`,
    effects: [
      {
        name: `Ear-bursting Roar (Mount Trait)`,
        desc: `At the start of the combat phase you can pick an enemy unit within 3" oof this model and roll a dice. On a 4+ subtract 1 from hit rolls for attacks made by that unit until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
]

export default CommandTraits
