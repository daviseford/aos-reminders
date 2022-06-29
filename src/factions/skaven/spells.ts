import { tagAs } from 'factions/metatagger'
import { HERO_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

const Spells = {
  // Lore of Ruin
  Scorch: {
    effects: [
      {
        name: `Scorch`,
        desc: `Casting value of 5 and a range of 13". Pick 1 enemy unit within range and visible to the caster and roll a number of dice equal to the casting roll. For each 6, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Skitterleap: {
    effects: [
      {
        name: `Skitterleap`,
        desc: `Casting value of 6 and a range of 13". Pick 1 friendly SKAVEN HERO with a wounds characteristic of 13 or less within range and visible to the caster. Remove that HERO from the battlefield and set it up again on the battlefield more than 9" from all enemy units. That HERO cannot move in the following movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Death Frenzy': {
    effects: [
      {
        name: `Death Frenzy`,
        desc: `Casting value of 7 and a range of 13". Pick 1 friendly SKAVEN unit that is not a HERO within range and visible to the caster. Until your next hero phase, if any models in that unit are slain, those models can fight before they are removed from play.`,
        when: [HERO_PHASE],
      },
      {
        name: `Death Frenzy`,
        desc: `If active, if any models in that unit are slain, those models can fight before they are removed from play.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  // Lore of Warpvolt Galvanism
  'More-more-more Warp Power!': {
    effects: [
      {
        name: `More-more-more Warp Power!`,
        desc: `Casting value of 7 and a range of 13". Pick 1 friendly CLANS SKRYRE unit wholly within range and visible to the caster. Add 1 to hit rolls and wound rolls for attacks made by that unit until your next hero phase. However, that unit suffers D3 mortal wounds at the end of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Chain Warp Lightning': {
    effects: [
      {
        name: `Chain Warp Lightning`,
        desc: `Casting value of 7 and a range of 13". If successfully cast, each unit within range suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Warp Lightning Shield': {
    effects: [
      {
        name: `Warp Lightning Shield`,
        desc: `Casting value of 6. If successfully cast, until your next hero phase, the first 3 wounds caused to the caster in each phase are negated. If a fourth wound is caused to the caster in the same phase, then the caster suffers 3 mortal wounds and this spell is unbound (the first wounds caused in that phase are still negated).`,
        when: [HERO_PHASE],
      },
    ],
  },

  // Unit spells
  'Warp Lightning': {
    effects: [
      {
        name: `Warp Lightning`,
        desc: `Casting value of 5 and a range of 13". Pick 1 enemy unit within range and visible to the caster. That unit suffers D3 mortal wounds. Alternatively, before making the casting roll, you can say that this unit will use its warp-power accumulator to augment the spell. If you do so, and the spell is successfully cast and not unbound, pick 1 enemy unit within range and visible to the caster. That unit suffers D6 mortal wounds. However, if the spell is not successfully cast or is unbound, this unit suffers D6 mortal wounds that cannot be negated.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Madness: {
    effects: [
      {
        name: `Madness`,
        desc: `Casting value of 8 and a range of 3". Pick 1 enemy Hero within range and visible to the caster and roll a number of dice equal to the combined value of the Attacks characteristics of all melee weapons with which that Hero is armed. For each 4+, you can pick 1 enemy unit within 3" of that Hero to suffer 1 mortal wound (you can pick different units to suffer the mortal wounds if you wish).`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Dreaded Thirteenth Spell': {
    effects: [
      {
        name: `The Dreaded Thirteenth Spell`,
        desc: `Casting value of 8 and a range of 13". Pick 1 enemy unit within range and visible to the caster and roll 13 dice. For each 4+, that unit suffers 1 mortal wound. You can then summon 1 unit of Clanrats to the battlefield and add it to your army. The summoned unit can have up to 1 model for each mortal wound that was caused by this spell. The summoned unit must be set up wholly within range of the caster and more than 9" from all enemy units. The summoned unit cannot move in the following movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dreaded Warpgale': {
    effects: [
      {
        name: `Dreaded Warpgale`,
        desc: `Casting value of 8 and a range of 18". Pick 1 enemy unit within range and visible to the caster. That unit suffers D6 mortal wounds. In addition, run rolls and charge rolls for that unit are halved until your next hero phase, and if that unit can fly, it also cannot fly until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Wither: {
    effects: [
      {
        name: `Wither`,
        desc: `Casting value of 7 and a range of 13". Pick 1 enemy unit within range and visible to the caster and roll 2D6. If the roll is greater than that unit's Wounds characteristic, that unit suffers D3 mortal wounds and you can subtract 1 from hit rolls for attacks made with melee weapons by that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Warp Lightning Storm': {
    effects: [
      {
        name: `Warp Lightning Storm`,
        desc: `Casting value of 7 and a range of 13". Pick up to D3 different enemy units within range and visible to the caster. Those units each suffer D3 mortal wounds. Alternatively, before making the casting roll, you can say that this unit will use its warp-power accumulator to augment the spell. If you do so, and the spell is successfully cast and not unbound, pick up to D3 different enemy units within range and visible to the caster. Those units each suffer D6 mortal wounds. However, if the spell is not successfully cast or is unbound, this unit suffers mortal wounds that cannot be negated.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dreaded Death Frenzy': {
    effects: [
      {
        name: `Dreaded Death Frenzy`,
        desc: `Casting value of 7 and a range of 13". Pick up to D3 friendly Skaven units wholly within range and visible to the caster. Until your next hero phase, if any models in that unit are slain, those models can fight before they are removed from play.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dreaded Plague': {
    effects: [
      {
        name: `Dreaded Plague`,
        desc: `Casting value of 7 and a range of 13". Pick 1 enemy unit within range and visible to the caster and roll a dice for each model in that unit. For each 4+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Cracks Call': {
    effects: [
      {
        name: `Cracks Call`,
        desc: `Casting value of 6 and a range of 13". Pick 1 enemy unit within range and visible to the caster and roll 2D6. If the roll is greater than that unit's Move characteristic, that unit suffers a number of mortal wounds equal to the difference between its Move characteristic and the roll (rounding up). This spell has no effect on units that can fly.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dreaded Skitterleap': {
    effects: [
      {
        name: `Dreaded Skitterleap`,
        desc: `Casting value of 6 and a range of 18". Pick 1 friendly Skaven Hero with a Wounds characteristic of 13 or less within range and visible to the caster. Remove that Hero from the battlefield and set it up again on the battlefield more than 6" from all enemy units. That Hero cannot move in the following movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
