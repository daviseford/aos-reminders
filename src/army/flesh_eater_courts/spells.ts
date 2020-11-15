import { TSpells } from 'types/army'
import { HERO_PHASE } from 'types/phases'

const Spells: TSpells = [
  {
    name: `Bonestorm`,
    effects: [
      {
        name: `Bonestorm`,
        desc: `Casting value of 5. Roll a D6 for each enemy unit within 12" of the caster. On a 2+ that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Spectral Host`,
    effects: [
      {
        name: `Spectral Host`,
        desc: `Casting value of 6. Pick 1 friendly unit wholly within 12" of the caster that is visible to them. That unit can fly until your next hero phase. If that unit can already fly, until your next hero phase it can run and still charge in the same turn. If the casting roll was 10 or more, you can pick up to 3 friendly units to be affected by the spell instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Monstrous Vigour`,
    effects: [
      {
        name: `Monstrous Vigour`,
        desc: `Casting value of 5. Pick 1 friendly FLESH-EATER COURTS MONSTER within 24" of the caster that is visible to them. Until your next hero phase, when you look up a value on that MONSTER's damage table, that MONSTER is treated as if it has suffered 0 wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Miasmal Shroud`,
    effects: [
      {
        name: `Miasmal Shroud`,
        desc: `Casting value of 5. Pick 1 enemy unit within 18" of the caster that is visible to them and roll 3 dice. For each 5+ that unit suffers 1 mortal wound. In addition, if you rolled a triple, subtract 1 from hit and wound rolls for that unit until your next hero phase. If you rolled a double, subtract 1 from hit rolls only for that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Deranged Transformation`,
    effects: [
      {
        name: `Deranged Transformation`,
        desc: `Casting value of 6. Pick 1 friendly unit with a Wounds characteristic of up to 6 that is wholly within 24" of the caster and visible to them. Add that unit's Wounds characteristic to its Move characteristic until your next hero phase. For example, if the unit had a Wounds characteristic of 6, you would add 6" to its Move characteristic. If the casting roll was 10 or more, you can pick up to 3 friendly units to be affected by the spell instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Blood Feast`,
    effects: [
      {
        name: `Blood Feast`,
        desc: `Casting value of 7. Pick 1 enemy unit within 12" of the caster that is visible to them, and a friendly FLESH-EATER COURTS unit within 6" of that enemy unit. The enemy unit suffers D3 mortal wounds. If the casting roll was 10 or more, the enemy unit suffers D6 mortal wounds instead of D3 mortal wounds.

        Then, for each mortal wound that was inflicted on the enemy unit, you can heal 1 wound allocated to the friendly unit. If the friendly unit has a Wounds characteristic of 1, for each mortal wound that was inflicted on the enemy unit, you can return 1 slain model to the friendly unit instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells
