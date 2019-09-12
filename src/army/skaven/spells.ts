import { TSpells } from 'types/army'
import { DURING_GAME, END_OF_HERO_PHASE, HERO_PHASE } from 'types/phases'

// Spell Lores of Skaventide
const Spells: TSpells = [
  // Lore of Ruin
  {
    name: `Scorch (Grey Seer)`,
    effects: [
      {
        name: `Scorch`,
        desc: `Casting value of 5. If successfully cast, pick 1 enemy unit within 13" of the caster that is visible to them. Roll a number of dice equal to the casting roll. For each 6, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Splinter (Grey Seer)`,
    effects: [
      {
        name: `Splinter`,
        desc: `Casting value of 6. If successfully cast, pick 1 enemy model within 6" of the caster. Roll a D6 and if the roll is greater than that model's Wounds characteristic, it is slain.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Skitterleap (Grey Seer)`,
    effects: [
      {
        name: `Skitterleap`,
        desc: `Casting value of 6. If successfully cast, pick 1 friendly Skaventide unit with a wounds characteristic of 12 or less within 13" of the caster that is visible to them. Remove that HERO from the battlefield and then set it up again anywhere on the battlefield more than 9" from any enemy units. That HERO may not move in the following movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Plague (Grey Seer)`,
    effects: [
      {
        name: `Plague`,
        desc: `Casting value of 7. If successfully cast, pick 1 enemy unit within 13" of the caster. Roll 1 dice for each model in the target unit. For each 5+ that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Death Frenzy (Grey Seer)`,
    effects: [
      {
        name: `Death Frenzy`,
        desc: `Casting value of 7. If successfully cast, pick 1 friendly Skaventide unit that is not a hero wholly within 13" of the caster that is visible to them. Until your next hero phase, when a model from the target unit is slain, it may make a pile-in move and attack with all of its melee weapons.`,
        when: [HERO_PHASE],
      },
      {
        name: `Death Frenzy`,
        desc: `If active, when a model from the target unit is slain, it may make a pile-in move and attack with all of its melee weapons.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Warpgale (Grey Seer)`,
    effects: [
      {
        name: `Warpgale`,
        desc: `Casting value of 8. If successfully cast, pick 1 enemy unit within 26" of the caster that is visible to them. That unit suffers D3 mortal wounds and any run or charge rolls for that unit are halved and cannot fly until your next hero phase.`,
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
  {
    name: `More-more-more Warp Power! (Skryre Wizard)`,
    effects: [
      {
        name: `More-more-more Warp Power!`,
        desc: `Casting value of 7. If successfully cast, pick 1 friendly Clans Skryre unit wholly within 12" of the caster that is visible to them. You can re-roll hit and wound rolls for that unit until your next hero phase. However at the end of your next hero phase, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `More-more-more Warp Power!`,
        desc: `If active, you can re-roll hit and wound rolls for that unit until your next hero phase.`,
        when: [DURING_GAME],
      },
      {
        name: `More-more-more Warp Power!`,
        desc: `If activated on your last turn, buffed unit suffers D3 mortal wounds.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Chain Warp Lightning (Skryre Wizard)`,
    effects: [
      {
        name: `Chain Warp Lightning`,
        desc: `Casting value of 6. If successfully cast, pick up to D6 different enemy units within 18" of the caster. Each of those units suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Warp Lightning Shield (Skryre Wizard)`,
    effects: [
      {
        name: `Warp Lightning Shield`,
        desc: `Casting value of 6. If successfully cast, until you next hero phase, the first 3 wounds allocated to the caster in each phase are negated. If a fourth wound is allocated, then the caster suffers D6 mortal wounds and the spell is unbound (the first three wounds are still negated).`,
        when: [HERO_PHASE],
      },
      {
        name: `Warp Lightning Shield`,
        desc: `If active, the first 3 wounds allocated to the caster in each phase are negated. If a fourth wound is allocated, then the caster suffers D6 mortal wounds and the spell is unbound (the first three wounds are still negated).`,
        when: [DURING_GAME],
      },
    ],
  },
]

export default Spells
