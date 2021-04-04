import { tagAs } from 'factions/metatagger'
import { HERO_PHASE, SAVES_PHASE } from 'types/phases'

const Spells = {
  'Fleshcrave Curse': {
    effects: [
      {
        name: `Fleshcrave Curse`,
        desc: `Casting value of 6. Pick 1 enemy unit within 12" of the caster that is visible to them. That unit suffers D6 mortal wounds. In addition, add 1 to the Attacks characteristic of that unit's melee weapons until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Blood Feast': {
    effects: [
      {
        name: `Blood Feast`,
        desc: `Casting value of 7. Pick 1 friendly OGOR unit that is not a MONSTER and that is wholly within 18" of the caster and visible to them. Add 1 to the Attacks characteristic of that unit's melee weapons until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Ribcracker: {
    effects: [
      {
        name: `Ribcracker`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster that is visible to them. Subtract 1 from save rolls for attacks that target that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Ribcracker`,
        desc: `If active, subtract 1 from save rolls for attacks that target that unit until the start of your next hero phase.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Blubbergrub Stench': {
    effects: [
      {
        name: `Blubbergrub Stench`,
        desc: `Casting value of 5. Until the start of your next hero phase, friendly RHINOX units are treated as MONSTERS for the purposes of the Trampling Charge battle trait while they are wholly within 18" of the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Molten Entrails': {
    effects: [
      {
        name: `Molten Entrails`,
        desc: `Casting value of 7. Pick 1 friendly OGOR MAWTRIBES MONSTER wholly within 18" of the caster that is visible to them. Until the start of your next hero phase, add 1 to the Damage characteristic of the melee weapons used by that MONSTER'S mount.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Greasy Deluge': {
    effects: [
      {
        name: `Greasy Deluge`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster that is visible to them. Subtract 1 from hit rolls for attacks made by that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fiery Whirlwind': {
    effects: [
      {
        name: `Fiery Whirlwind`,
        desc: `Casting value of 5. Pick one enemy unit. Roll 1 dice for each model in that unit that is within 12" of the caster and visible to them. For each 4+, that unit suffers 1 mortal wound. If that unit only has 1 model, roll 3 dice instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Billowing Ash': {
    effects: [
      {
        name: `Billowing Ash`,
        desc: `Casting value of 8. Until the start of your next hero phase, subtract 1 from hit rolls for attacks that target friendly units wholly within 12" of the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Tongues of Flame': {
    effects: [
      {
        name: `Tongues of Flame`,
        desc: `Casting value of 6. Pick 1 enemy unit that has 5 or more models that are within 18" of the caster and visible to them. Until the start of your next hero phase, each time that unit finishes any type of move, it suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Voracious Maw': {
    effects: [
      {
        name: `Voracious Maw`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster that is visible to them. That unit suffers D3 mortal wounds. After resolving any damage, roll a D6. On a 1, 2 or 3, the maw is said to be satisfied and the spell ends. On a 4+, the target unit suffers D3 additional mortal wounds. Keep repeating this process until the maw is satisfied or the target unit is destroyed.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Cascading Fire-cloak': {
    effects: [
      {
        name: `Cascading Fire-cloak`,
        desc: `Casting value of 6. Roll 1 dice for each enemy unit within 3" of the caster. On a 4+, that enemy unit suffers D3 mortal wounds. In addition, if this spell is successfully cast, add 1 to save rolls for attacks that target this model until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },

  Rockchomper: {
    effects: [
      {
        name: `Rockchomper`,
        desc: `Casting value of 5. Pick 1 friendly unit of Ogor Gluttons wholly within 18" of the caster that is visible to them. Until the start of your next hero phase, if the unmodified wound roll for an attack made with that unit's Gulping Bite is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage and that unit can heal 1 wound allocated to it.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
