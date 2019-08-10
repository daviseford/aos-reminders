import { TTraits } from 'types/army'
import { HERO_PHASE, COMBAT_PHASE, DURING_GAME } from 'types/phases'

// These Are The General Allegiance Traits From Destruction
const CommandTraits: TTraits = [
  {
    name: `Nothing Left Standing`,
    effects: [
      {
        name: `Nothing Left Standing`,
        desc: `Pick a terrain feature within 6" of this general and at least 5 other DESTRUCTION models. For the rest of the battle, that feature no longer grants cover.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Might is Right`,
    effects: [
      {
        name: `Might is Right`,
        desc: `Add 1 to wound rolls made for this general's melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Wild Fury`,
    effects: [
      {
        name: `Wild Fury`,
        desc: `When you pick this general to fight, pick a melee weapon to add 1 attack to. If the general has 3 wounds or more allocated, add 2 attacks instead.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bellowing Tyrant`,
    effects: [
      {
        name: `Bellowing Tyrant`,
        desc: `Pick a friendly DESTRUCTION unit within 6" of this general. Until your next hero phase, add 1 to charge and run rolls for the unit. Use the general's bravery characteristic instead of the unit's own.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Big and Brutish`,
    effects: [
      {
        name: `Big and Brutish`,
        desc: `+1 wound characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Ravager`,
    effects: [
      {
        name: `Ravager`,
        desc: `Add 3 to the Rampaging Destroyers dice roll for this general.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default CommandTraits
