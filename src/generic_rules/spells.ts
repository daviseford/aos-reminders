// Spells go here
import { TEntry } from 'types/data'
import { HERO_PHASE } from 'types/phases'

const GenericSpells: TEntry[] = [
  // Core Spells
  {
    name: `Arcane Bolt`,
    effects: [
      {
        name: `Arcane Bolt`,
        desc: `Casting value of 5 and range of 12". If successfully cast, at the start of any 1 phase before your next hero phase, you can pick 1 enemy unit within range and visible to the caster. That unit suffers 1 mortal wound. If that unit is within 3" of the caster, it suffers D3 mortal wounds instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Mystic Shield`,
    effects: [
      {
        name: `Mystic Shield`,
        desc: `Casting value of 5 and range of 12". Pick 1 friendly unit wholly within range and visible to the caster. Add 1 to save rolls for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Enhancements
  {
    name: `Flaming Weapon`,
    effects: [
      {
        name: `Flaming Weapon`,
        desc: `Casting value of 4. Pick 1 of the caster's melee weapons. Add 1 to Damage characteristic of that weapon until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Levitate`,
    effects: [
      {
        name: `Levitate`,
        desc: `Casting value of 8 and range of 18". Pick 1 friendly unit wholly within range and visible to the caster. That unit can fly until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Ghost-mist`,
    effects: [
      {
        name: `Ghost-mist`,
        desc: `Ghost-mist is a spell that has a casting value of 5 and range of 6". Pick 1 terrain feature within range and visible to the caster. Until your next hero phase, visibility between 2 models is blocked if a straight line 1mm wide drawn between the closest points of the 2 models passes across more than 3" of that terrain feature. This effect does not block visibility to or from models with a Wounds characteristic of 10 or more.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default GenericSpells
