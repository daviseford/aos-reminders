import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Spells = {
  // Lore of Shadows
  'Steed of Shadows': {
    effects: [
      {
        name: `Steed of Shadows`,
        desc: `Casting value of 6. If successfully cast, until your next hero phase, the caster has a Move characteristic of 16" and can fly.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Pit of Shades': {
    effects: [
      {
        name: `Pit of Shades`,
        desc: `Casting value of 6 and a range of 18". If successfully cast, pick 1 enemy unit within range and visible to the caster and roll 2D6. If the roll is higher than that unit's Move characteristic, that unit suffers a number of mortal wounds equal to the difference between its Move characteristic and the roll.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Mirror Dance': {
    effects: [
      {
        name: `Mirror Dance`,
        desc: `Casting value of 6 and a range of 18". If successfully cast, pick 2 friendly DAUGHTERS OF KHAINE HEROES that are wholly within range, visible to the caster and each more than 3" from all enemy units. Remove those HEROES from the battlefield. Then, set each model up again within 1" of the location that had been occupied by the other model before it was removed from the battlefield and more than 3" from all enemy units.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Withering': {
    effects: [
      {
        name: `The Withering`,
        desc: `Casting value of 7 and a range of 18". If successfully cast, pick 1 enemy unit within range and visible to the caster. Add 1 to wound rolls for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Mindrazor: {
    effects: [
      {
        name: `Mindrazor`,
        desc: `Casting value of 8 and a range of 18". If successfully cast, pick 1 friendly DAUGHTERS OF KHAINE unit wholly within range and visible to the caster. Improve the Rend characteristic of that unit's melee weapons by 1 until your next hero phase. In addition, until your next hero phase, add 1 to the Damage characteristic of that unit's melee weapons if it made a charge move in the same turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Shroud of Despair': {
    effects: [
      {
        name: `Shroud of Despair`,
        desc: `Casting value of 4 and a range of 18". If successfully cast, pick 1 enemy unit within range and visible to the caster. Subtract 1 from that unit's Bravery characteristic until your next hero phase. If the casting roll was 8+, subtract D3 from that unit's Bravery characteristic instead of 1 until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Unit spells
  // 'Enfeebling Foe': {
  //   effects: [
  //     {
  //       name: `Enfeebling Foe`,
  //       desc: `Casting value of 5. Pick a unit within 18" and visible to the caster. Until your next hero phase, subtract 1 from wound rolls for that unit in the combat phase.`,
  //       when: [HERO_PHASE],
  //     },
  //     {
  //       name: `Enfeebling Foe`,
  //       desc: `If active, subtract 1 from wound rolls for debuffed unit in the combat phase.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Black Horror of Ulgu': {
  //   effects: [
  //     {
  //       name: `Black Horror of Ulgu`,
  //       desc: `Casting value of 7. Pick a unit within 36" and visible to the caster. Roll a D6. On a 1, target suffers 1 mortal wound. On a 2-3 target suffers D3 mortal wounds. On a 4+ target suffers D6 mortal wounds.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // Doomfire: {
  //   effects: [
  //     {
  //       name: `Doomfire`,
  //       desc: `Casting value of 6. Pick an enemy unit within 12" of the casting unit. The target suffers D3 mortal wounds if the casting unit has fewer than 5 models. D6 mortal wounds if it has 5 to 9 models. 6 mortal wounds if it has 10 or more models.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
}

export default tagAs(Spells, 'spell')
