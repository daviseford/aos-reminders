import { HERO_PHASE } from 'types/phases'
import { TSpells } from 'types/army'

const Spells: TSpells = [
  // Lore of the Deathmages
  {
    name: `Overwhelming Dread (Deathmages)`,
    effects: [
      {
        name: `Overwhelming Dread (Deathmages)`,
        desc: `Casting value of 5. If successfully cast, pick an enemy unit within 18" of the caster that is visible to them. Until your next hero phase, subtract 1 from hit rolls for that unit and subtract 1 from that unit's Bravery characteristic.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Fading Vigour (Deathmages)`,
    effects: [
      {
        name: `Fading Vigour (Deathmages)`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 18" of the caster that is visible to them. Until the start of your next hero phase, subtract 1 from the Attacks characteristic of that unit's melee weapons (to a minimum of 1), and roll only a single dice when making charge rolls for it.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Spectral Grasp (Deathmages)`,
    effects: [
      {
        name: `Spectral Grasp (Deathmages)`,
        desc: `Casting value of 6. If successfully cast, pick a terrain feature within 18" of the caster that is visible to them. Until your next hero phase, halve the Move characteristic (rounding down) of enemy units within 3" of any terrain features affected by any Spectral Grasp spells at the start of their movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Prison of Grief (Deathmages)`,
    effects: [
      {
        name: `Prison of Grief (Deathmages)`,
        desc: `Casting value of 7. If successfully cast, pick an enemy unit within 12" of the caster that is visible to them. Until your next hero phase, before a unit affected by any Prison of Grief spells moves, roll a D6. On a 5+ the unit may not move in that phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Decrepify (Deathmages)`,
    effects: [
      {
        name: `Decrepify (Deathmages)`,
        desc: `Casting value of 6. If successfully cast, pick an enemy HERO within 18" of the caster that is visible to them. Until your next hero phase, subtract 1 from wound rolls made for that model and subtract 1 from the Damage characteristics of that model's melee weapons (to a minimum of 1).`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Soul Harvest (Deathmages)`,
    effects: [
      {
        name: `Soul Harvest (Deathmages)`,
        desc: `Casting value of 7. If successfully cast, each enemy unit within 3" of the caster suffers D3 mortal wounds. Then, roll a D6 for each mortal wound that was allocated to an enemy unit and not negated. For each 5+, heal 1 wound that has been allocated to the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Lore of the Vampires
  {
    name: `Blades of Shyish (Vampires)`,
    effects: [
      {
        name: `Blades of Shyish (Vampires)`,
        desc: `Casting value of 5. If successfully cast, roll a D6 for each enemy unit within 12" of the caster. On a 5+ that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Spirit Gale (Vampires)`,
    effects: [
      {
        name: `Spirit Gale (Vampires)`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 12" of the caster that is visible to them and roll 3 dice. For each 5+, that unit suffers 1 mortal wound. In addition, if 2 of these dice show the same number, subtract 1 from hit rolls for that unit until your next hero phase. If all 3 dice show the same number, subtract 1 from hit and wound rolls for that unit until your next hero phase instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Vile Transference (Vampires)`,
    effects: [
      {
        name: `Vile Transference (Vampires)`,
        desc: `Casting value of 7. If successfully cast, pick an enemy unit within 12" of the caster that is visible to them, and a friendly DEATH unit within 6" of that enemy unit. The enemy unit suffers D3 mortal wounds. Then, for each of these wounds that was allocated and not negated, you can heal 1 wound allocated to the friendly unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Amethystine Pinions (Vampires)`,
    effects: [
      {
        name: `Amethystine Pinions (Vampires)`,
        desc: `Casting value of 5. If successfully cast, until your next hero phase add 5" to the caster's Move characteristic and the caster can fly.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Soulpike (Vampires)`,
    effects: [
      {
        name: `Soulpike (Vampires)`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 18" of the caster that is visible to them. Until your next hero phase, after a unit affected by any Soulpike spells makes a charge move, roll a number of dice equal to the result of their charge roll. For each 5+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Amaranthine Orb (Vampires)`,
    effects: [
      {
        name: `Amaranthine Orb (Vampires)`,
        desc: `Casting value of 7. If successfully cast, pick a point on the battlefield within 12" of the caster and draw an imaginary straight line 1mm wide between that point and the closest part of the caster. Roll a D6 for each unit (friend or foe, apart from the caster) that has any models beneath this line. On a 4+ that unit suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells
