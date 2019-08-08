import { TTraits } from 'types/army'
import {
  HERO_PHASE,
  COMBAT_PHASE,
  CHARGE_PHASE,
  MOVEMENT_PHASE,
  BATTLESHOCK_PHASE,
  DURING_GAME,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Nothing Left Standing (Destruction)`,
    effects: [
      {
        name: `Nothing Left Standing (Destruction)`,
        desc: `In your hero phase, pick a terrain feature that is within 6" of this general and at least 5 other friendly DESTRUCTION models. For the rest of the battle, that terrain feature no longer gives cover to models that are in or on it.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Might is Right (Destruction)`,
    effects: [
      {
        name: `Might is Right (Destruction)`,
        desc: `Add 1 to wound rolls made for this general's melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Wild Fury (Destruction)`,
    effects: [
      {
        name: `Wild Fury (Destruction)`,
        desc: `When this general is picked to fight, pick one of their melee weapons. Add 1 to the Attacks characteristic of that melee weapon for that fight. While 3 or more wounds are allocated to this general, instead add 2 to the Attacks characteristic of that melee weapon for that fight.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bellowing Tyrant (Destruction)`,
    effects: [
      {
        name: `Bellowing Tyrant (Destruction)`,
        desc: `In your hero phase, pick a friendly DESTRUCTION unit within 6" of this general. Until your next hero phase, add 1 to charge and run rolls for the unit you picked, and use this general's Bravery characteristic for the unit instead of its own.`,
        when: [HERO_PHASE, CHARGE_PHASE, MOVEMENT_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Big and Brutish (Destruction)`,
    effects: [
      {
        name: `Big and Brutish (Destruction)`,
        desc: `Add 1 to this general's Wounds characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Ravager (Destruction)`,
    effects: [
      {
        name: `Ravager (Destruction)`,
        desc: `Add 3 to the Rampaging Destroyers dice roll (see battle trait) for this general instead of 2.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default CommandTraits
