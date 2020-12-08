import { tagAs } from 'factions/metatagger'
import { DURING_GAME, END_OF_HERO_PHASE, HERO_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

const Spells = {
  'Warp Lightning': {
    effects: [
      {
        name: `Warp Lightning`,
        desc: `Casting value of 5. Pick 1 enemy unit within 13" of the caster and visible to them. That unit suffers D3 mortal wounds. Before making the casting roll, you can say that this model will use its warp-power accumulator to augment the spell. If you do so and the casting attempt is successful and not unbound, the spell inflicts D6 mortal wounds instead of D3. However, if you do so and the casting attempt fails or is unbound, this model suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Lore of Ruin
  'Scorch (Grey Seer)': {
    effects: [
      {
        name: `Scorch`,
        desc: `Casting value of 5. Pick 1 enemy unit within 13" of the caster that is visible to them. Roll a number of dice equal to the casting roll. For each 6, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Splinter (Grey Seer)': {
    effects: [
      {
        name: `Splinter`,
        desc: `Casting value of 6. Pick 1 enemy model within 6" of the caster. Roll a D6 and if the roll is greater than that model's Wounds characteristic, it is slain.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Skitterleap (Grey Seer)': {
    effects: [
      {
        name: `Skitterleap`,
        desc: `Casting value of 6. Pick 1 friendly Skaventide unit with a wounds characteristic of 12 or less within 13" of the caster that is visible to them. Remove that HERO from the battlefield and then set it up again anywhere on the battlefield more than 9" from any enemy units. That HERO may not move in the following movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Plague (Grey Seer)': {
    effects: [
      {
        name: `Plague`,
        desc: `Casting value of 7. Pick 1 enemy unit within 13" of the caster. Roll 1 dice for each model in the target unit. For each 5+ that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Death Frenzy (Grey Seer)': {
    effects: [
      {
        name: `Death Frenzy`,
        desc: `Casting value of 7. Pick 1 friendly Skaventide unit that is not a hero wholly within 13" of the caster that is visible to them. Until your next hero phase, when a model from the target unit is slain, it may make a pile-in move and attack with all of its melee weapons.`,
        when: [HERO_PHASE],
      },
      {
        name: `Death Frenzy`,
        desc: `If active, when a model from the target unit is slain, it may make a pile-in move and attack with all of its melee weapons.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Warpgale (Grey Seer)': {
    effects: [
      {
        name: `Warpgale`,
        desc: `Casting value of 8. Pick 1 enemy unit within 26" of the caster that is visible to them. That unit suffers D3 mortal wounds and any run or charge rolls for that unit are halved and cannot fly until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Warpgale`,
        desc: `If active, any run or charge rolls for that unit are halved and cannot fly until your next hero phase.`,
        when: [DURING_GAME],
      },
    ],
  },
  // Lore of Warpvolt Galvanism
  'More-more-more Warp Power! (Skryre Wizard)': {
    effects: [
      {
        name: `More-more-more Warp Power!`,
        desc: `Casting value of 7. Pick 1 friendly Clans Skryre unit wholly within 12" of the caster that is visible to them. You can reroll hit and wound rolls for that unit until your next hero phase. However at the end of your next hero phase, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `More-more-more Warp Power!`,
        desc: `If active, you can reroll hit and wound rolls for that unit until your next hero phase.`,
        when: [DURING_GAME],
      },
      {
        name: `More-more-more Warp Power!`,
        desc: `If activated on your last turn, buffed unit suffers D3 mortal wounds.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  'Chain Warp Lightning (Skryre Wizard)': {
    effects: [
      {
        name: `Chain Warp Lightning`,
        desc: `Casting value of 6. Pick up to D6 different enemy units within 18" of the caster. Each of those units suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Warp Lightning Shield (Skryre Wizard)': {
    effects: [
      {
        name: `Warp Lightning Shield`,
        desc: `Casting value of 6. Until your next hero phase, the first 3 wounds allocated to the caster in each phase are negated. If a fourth wound is allocated, then the caster suffers D6 mortal wounds and the spell is unbound (the first three wounds are still negated).`,
        when: [HERO_PHASE],
      },
      {
        name: `Warp Lightning Shield`,
        desc: `If active, the first 3 wounds allocated to the caster in each phase are negated. If a fourth wound is allocated, then the caster suffers D6 mortal wounds and the spell is unbound (the first three wounds are still negated).`,
        when: [DURING_GAME],
      },
    ],
  },

  Madness: {
    effects: [
      {
        name: `Madness`,
        desc: `Casting value of 8. Pick 1 enemy HERO within 3" of the caster and visible to them, and roll a number of dice equal to the combined value of the Attacks characteristics of all melee weapons that HERO is armed with. For each 5+ you can inflict 1 mortal wound on 1 enemy unit within 3" of that HERO (you can choose different units to suffer the mortal wounds if you wish).`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dreaded Thirteenth Spell': {
    effects: [
      {
        name: `Dreaded Thirteenth Spell`,
        desc: `Casting value of 8. Pick 1 enemy unit within 13" of the caster and visible to them, and roll 13 dice. For each 4+ that unit suffers 1 mortal wound. You can then summon 1 unit of CLANRATS to the battlefield, and add it to your army. The summoned unit can have up to 1 model for each mortal wound that was inflicted by this spell. The summoned unit must be set up wholly within 13" of the caster and more than 9" from any enemy units. The summoned unit cannot move in the following movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dreaded Warpgale': {
    effects: [
      {
        name: `Dreaded Warpgale`,
        desc: `Casting value of 8. Pick 1 enemy unit within 26" of the caster and visible to them. That unit suffers D6 mortal wounds, and run and charge rolls for that unit are halved until your next hero phase. If that unit can fly, it cannot fly until your next hero phase (in addition to having its run and charge rolls halved).`,
        when: [HERO_PHASE],
      },
    ],
  },
  Wither: {
    effects: [
      {
        name: `Wither`,
        desc: `Casting value of 7. Pick 1 enemy unit within 13" of the caster and visible to them, and roll 2D6. If the roll is greater than that unit's Wounds characteristic, that unit suffers D3 mortal wounds. In addition, if the roll is greater than that unit's Wounds characteristic, subtract 1 from hit rolls for attacks made with melee weapons by that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Warp Lightning Storm': {
    effects: [
      {
        name: `Warp Lightning Storm`,
        desc: `Casting value of 7. Pick up to D3 enemy units within 13" of the caster and visible to them. Those units each suffer D3 mortal wounds. Before making the casting roll, you can say that this model will use its warp-power accumulator to augment the spell. If you do so and the casting attempt is successful and not unbound, the spell inflicts D6 mortal wounds on each of those units instead of D3. However, if you do so and the casting attempt fails or is unbound, this model suffers D3xD6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dreaded Death Frenzy': {
    effects: [
      {
        name: `Dreaded Death Frenzy`,
        desc: `Casting value of 7. Pick up to D3 friendly SKAVENTIDE units wholly within 13" of the caster and visible to them. Until your next hero phase, when a model from any of those units is slain, before it is removed from play, it can make a pile-in move and then attack with all of the melee weapons it is armed with.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dreaded Plague': {
    effects: [
      {
        name: `Dreaded Plague`,
        desc: `Casting value of 7. Pick 1 enemy unit within 13" of the caster and roll 1 dice for each model in that unit. For each 4+ that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Cracks Call': {
    effects: [
      {
        name: `Cracks Call`,
        desc: `Casting value of 6. Pick 1 enemy unit within 18" of the caster and visible to them, and roll 2D6. If the roll is greater than that unit's Move characteristic, that unit suffers a number of mortal wounds equal to the difference between its Move characteristic and the roll. This spell has no effect on units that can fly.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dreaded Skitterleap': {
    effects: [
      {
        name: `Dreaded Skitterleap`,
        desc: `Casting value of 6. Pick 1 friendly Skaventide Hero with a Wounds characteristic of 12 or less that is within 26" of the caster and visible to them. Remove that HERO from the battlefield and then set it up again anywhere on the battlefield more than 6" from any enemy units. That Hero may not move in the following movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
