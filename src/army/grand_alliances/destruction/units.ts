import { TUnits } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  TURN_TWO_END_OF_MOVEMENT_PHASE,
} from 'types/phases'

export const MonstrousArcanumDestruction: TUnits = [
  {
    name: `Basilisk`,
    effects: [
      {
        name: `Corrosive Miasma`,
        desc: `At the start of the combat phase, roll 1 dice for each enemy unit within 3" of this model. On a 2+, that unit suffers 1 mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Malignant Gaze`,
        desc: `In your hero phase, you can pick 1 enemy unit within 12" of this model that is visible to it, and roll a dice. On a 1, nothing happens. On a 2-3, that unit suffers D3 mortal wounds. On a 4+, that unit suffers D3+1 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Dread Maw`,
    effects: [
      {
        name: `Devourer From Below`,
        desc: `Instead of setting up this model on the battlefield, you can place it to one side and say that it is tunnelling through the earth in reserve. If you do so, at the end of your second movement phase, you must set up this model on the battlefield more than 9" from any enemy units.`,
        when: [DURING_SETUP, TURN_TWO_END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Impenetrable Hide`,
        desc: `Roll a dice each time you allocate a mortal wound to this model. On a 4+ that mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Yawning Maw`,
        desc: `You can re-roll wound rolls of 1 for attacks made with this model's Cavernous Maw if the target unit has a Wounds characteristic of 2 or less.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Tunnel Worm`,
        desc: `When this model makes a move, it can pass across terrain features and other models in the same manner as a model that can fly.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Fimirach Noble`,
    effects: [
      {
        name: `Baleglyph Mauls`,
        desc: `If the unmodified wound roll for an attack made with a Baleglyph Maul is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Shrouding Mists`,
        desc: `Subtract 1 from hit rolls for attacks made with missile weapons that target this model. In addition, roll a dice each time you allocate a mortal wound to this model. On a 5+ that mortal wound is negated.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Unnatural Flesh`,
        desc: `In your hero phase, you can heal 1 wound allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Born to Lead`,
        desc: `You can use this command ability at the start of your charge phase. If you do so, pick 1 friendly model with this command ability. You can reroll charge rolls for friendly Fimir units while they are wholly within 12" of that model in that charge phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Fimir Warriors`,
    effects: [
      {
        name: `Baleglyph Mauls`,
        desc: `If the unmodified wound roll for an attack made with a Baleglyph Maul is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Shrouding Mists`,
        desc: `Subtract 1 from hit rolls for attacks made with missile weapons that target this model. In addition, roll a dice each time you allocate a mortal wound to this model. On a 5+ that mortal wound is negated.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Unnatural Flesh`,
        desc: `In your hero phase, you can heal 1 wound allocated to this model.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Incarnate Elemental Of Beasts`,
    effects: [
      {
        name: `Savage Frenzy`,
        desc: `If this model is slain, before removing the model from play, it can make a pile-in move and then attack with all of the melee weapons it is armed with. This model is then removed from play.`,
        when: [DURING_GAME],
      },
      {
        name: `Incarnate of Ghur`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to this model if the battle is taking place in Ghur, the Realm of Beasts. In addition, you can re-roll wound rolls of 1 for attacks made by this model if the battle is taking place in Ghur, the Realm of Beasts.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Lure of Spirit Blood`,
        desc: `You can re-roll charge rolls for this model while it is within 12" of any enemy models that have any wounds allocated to them.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Incarnate Elemental Of Fire`,
    effects: [
      {
        name: `Ashes to Ashes`,
        desc: `If the unmodified hit roll for an attack made by this model is 6, double the Damage characteristic for that attack.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Gift of Elemental Fire`,
        desc: `At the end of the combat phase, roll a dice for each enemy unit within 3" of this model. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Incarnate of Aqshy`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to this model if the battle is taking place in Aqshy, the Realm of Fire. In addition, you can re-roll wound rolls of 1 for attacks made by this model if the battle is taking place in Aqshy, the Realm of Fire.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Magma Dragon`,
    effects: [
      {
        name: `Brimstone Dragonfire`,
        desc: `Do not use the attack sequence for an attack made with this model's Brimstone Dragonfire. Instead, roll a dice. On a 2+, the target unit suffers D6 mortal wounds. If the target unit has 10 or more models, it suffers 2D6 mortal wounds instead of D6.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Burning Blood`,
        desc: `Roll a dice each time a wound or mortal wound that was inflicted by a melee weapon is allocated to this model. On a 4+, the attacking unit suffers 1 mortal wound. On a 6, the attacking unit suffers D3 mortal wounds instead.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Merwyrm`,
    effects: [
      {
        name: `Abyssal Predator`,
        desc: `If the unmodified wound roll for an attack made with this model's Hideous Jaws is 6, that attack has a Damage characteristic of D6 instead of D3.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Stench of the Deep`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Unnatural Metabolism`,
        desc: `At the end of the combat phase, if any enemy models were slain by wounds inflicted by this model's attacks in that combat phase, you can heal up to D3 wounds allocated to this model.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Rogue Idol`,
    effects: [
      {
        name: `Avalanche!`,
        desc: `If this model is slain, before removing the model from play, roll a dice for each unit within 3" of this model. On a 4+, that unit suffers D3 mortal wounds. This model is then removed from play.`,
        when: [DURING_GAME],
      },
      {
        name: `Da Big' Un`,
        desc: `Halve the damage inflicted by an attack that targets this model (rounding up). In addition, roll a dice each time you allocate a mortal wound to this model. On a 4+, that mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Livin' Idol`,
        desc: `Add 1 to casting rolls for friendly Orruk Wizards and friendly Grot Wizards while they are within 6" of any friendly models with this ability. In addition, add 1 to the Bravery characteristic of friendly Orruk and friendly Grot units while they are wholly within 18" of any friendly models with this ability.`,
        when: [HERO_PHASE],
      },
      {
        name: `Rubble and Ruin`,
        desc: `At the end of the combat phase, roll a dice for each enemy unit within 3" of this model. On a 4+, that unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Spirit of the Waaagh!`,
        desc: `You can re-roll hit rolls of 1 for attacks made by this model if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Warpfire Dragon`,
    effects: [
      {
        name: `Deadly Demise`,
        desc: `If this model is slain, before this model is removed from play, roll a dice for each unit within 3" of this model. On a 4+, that unit suffers D3 mortal wounds. This model is then removed from play.`,
        when: [DURING_GAME],
      },
      {
        name: `Warpfire`,
        desc: `Do not use the attack sequence for an attack made with this model's Warpfire. Instead roll a dice. On a 1, nothing happens. On a 2-5, the target unit suffers D3 mortal wounds. On a 6, the target unit suffers D6 mortal wounds.`,
        when: [DURING_GAME],
      },
    ],
  },
]

// Units available to this Grand Alliance allegiance
export const Units: TUnits = [...MonstrousArcanumDestruction]

// Available to ALL factions in this Grand Alliance
export const DestructionUnits = [...MonstrousArcanumDestruction]
