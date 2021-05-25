import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Spells = {
  // Every Soulblight hero knows this spell!
  'Invigorating Aura': {
    effects: [
      {
        name: `Invigorating Aura`,
        desc: `Casting value of 8. Add 1 to the roll for each friendly SOULBLIGHT GRAVELORDS HERO on the battlefield. If successfully cast, pick 1 friendly SOULBLIGHT GRAVELORDS SUMMONABLE unit wholly within 18" of the caster. You can either heal up to 3 wounds allocated to that unit or, if no wounds are allocated to it, you can return a number of slain models to that unit that have a combined Wounds characteristic of 3 or less. The same unit cannot benefit from this spell more than once per turn.`,
        when: [HERO_PHASE],
      },
    ],
  },

  // Lore of the Vampires
  'Blades of Shyish': {
    effects: [
      {
        name: `Blades of Shyish`,
        desc: `Casting value of 5. If successfully cast, roll a dice for each enemy unit within 12" of the caster. On a 3+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Spirit Gale': {
    effects: [
      {
        name: `Spirit Gale`,
        desc: `Casting value of 5. If successfully cast, pick 1 enemy unit within 18" of the caster that is visible to them and roll 2D6. If the roll is greater than that unit's Bravery characteristic, that unit suffers a number of mortal wounds equal to the difference between its Bravery characteristic and the roll.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Soulpike: {
    effects: [
      {
        name: `Soulpike`,
        desc: `Casting value of 6. If successfully cast, pick 1 enemy unit within 18" of the caster that is visible to them. Until your next hero phase, if that unit makes a charge move, roll a number of dice equal to the charge roll for that unit. For each 4+, that unit suffers 1 mortal wound. The same unit cannot be affected by this spell more than once per turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Amethystine Pinions': {
    effects: [
      {
        name: `Amethystine Pinions`,
        desc: `Casting value of 5. If successfully cast, until your next hero phase, add 6" to the caster's Move characteristic. The same unit cannot benefit from this spell more than once per turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Vile Transference': {
    effects: [
      {
        name: `Vile Transference`,
        desc: `Casting value of 4. If successfully cast, pick 1 enemy unit within 6" of the caster that is visible to them. Roll a number of dice equal to half of that enemy unit's Wounds characteristic (rounding up). For each 6, you can heal 1 wound allocated to the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Amaranthine Orb': {
    effects: [
      {
        name: `Amaranthine Orb`,
        desc: `Casting value of 6. If successfully cast, pick 1 point on the battlefield within 9" of the caster that is visible to them and draw an imaginary straight line 1mm wide between that point and the closest part of the caster's base. Roll a dice for each unit that has models passed across by this line. On a 2+, that unit suffers D3 mortal wounds. DEATH units are not affected by this spell.`,
        when: [HERO_PHASE],
      },
    ],
  },

  // Lore of the Deathmages
  'Overwhelming Dread': {
    effects: [
      {
        name: `Overwhelming Dread`,
        desc: `Casting value of 5. If successfully cast, pick 1 enemy unit within 18" of the caster that is visible to them. Until your next hero phase, subtract 1 from hit rolls for attacks made by that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fading Vigour': {
    effects: [
      {
        name: `Fading Vigour`,
        desc: `Casting value of 6. If successfully cast, pick 1 enemy unit within 18" of the caster that is visible to them. Subtract 1 from the Attacks characteristic of that unit's melee weapons (to a minimum of 1) until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Spectral Grasp': {
    effects: [
      {
        name: `Spectral Grasp`,
        desc: `Casting value of 6. If successfully cast, pick 1 terrain feature wholly within 18" of the caster that is visible to them. Until your next hero phase, halve the Move characteristic (rounding down) of enemy units that start a normal move within 3" of that terrain feature.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Prison of Grief': {
    effects: [
      {
        name: `Prison of Grief`,
        desc: `Casting value of 6. If successfully cast, pick 1 enemy unit within 12" of the caster that is visible to them. Until your next hero phase, roll a dice each time that unit attempts to move. On a 5+, that unit cannot move in that phase. The same unit cannot be affected by this spell more than once per turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Decrepify': {
    effects: [
      {
        name: `Decrepify`,
        desc: `Casting value of 6. If successfully cast, pick 1 enemy HERO within 18" of the caster that is visible to them. Until your next hero phase, subtract 1 from wound rolls for attacks made by that model and subtract 1 from the Damage characteristic of that model's melee weapons (to a minimum of 1).`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Soul Harvest': {
    effects: [
      {
        name: `Soul Harvest`,
        desc: `Casting value of 7. If successfully cast, each enemy unit within 3" of the caster suffers mortal wounds. In addition, for each mortal wound inflicted by this spell and not negated, roll a dice, For each 5+, you can heal 1 wound allocated to the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },

  // Individual unit spells
  'Hand of Dust': {
    effects: [
      {
        name: `Hand of Dust`,
        desc: `Casting value of 8. If successfully cast, pick 1 enemy model within 3" of the caster. Then, take a dice and hide it in one of your hands. Your opponent must pick one of your hands. If they pick the one holding the dice, the spell has no effect. If they pick the empty hand, the enemy model is slain,`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Soul Stealer': {
    effects: [
      {
        name: `Soul Stealer`,
        desc: `Casting value of 6. If successfully cast, pick 1 enemy unit within 24" of the caster that is visible to them and roll 2D6. If the roll is greater than that unit's Bravery characteristic, it suffers D3 mortal wounds. If the roll is at least double that unit's Bravery characteristic, it suffers D6 mortal wounds instead. You can heal up to 1 wound that has been allocated to the caster for each mortal wound inflicted by this spell that is not negated.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Wind of Death': {
    effects: [
      {
        name: `Wind of Death`,
        desc: `Casting value of 7. If successfully cast, pick 1 enemy unit within 18" of the caster that is visible to them, and roll a dice for that enemy unit and each other enemy unit within 6" of that enemy unit. On a 3+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  '': {
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },



  // '': {
  //   effects: [
  //     {
  //       name: ``,
  //       desc: ``,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
}

export default tagAs(Spells, 'spell')
