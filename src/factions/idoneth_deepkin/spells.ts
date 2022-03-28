import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Spells = {
  'Steed of Tides': {
    effects: [
      {
        name: `Steed of Tides`,
        desc: `Casting value of 5 and range of 6". If cast, pick a friendly HERO that is not a MONSTER and that is within range and visible to the caster. Remove that HERO from the battlefield and set it up again on the battlefield more than 9" from all enemy units. A unit set up with this abaility cannot move in the following movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Counter-current': {
    effects: [
      {
        name: `Counter-current`,
        desc: `Casting value of 6 and range of 18". If cast, pick 1 enemy unit within range and visible to the caster. Until your next hero phase, halve run rolls and charge rolls for that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Pressure of the Deep': {
    effects: [
      {
        name: `Pressure of the Deep`,
        desc: `Casting value of 7 and range of 12". If cast, pick 1 enemy model within range that is visible to the caster and roll a dice. If the dice roll is greater than that model's Wounds characteristic, it is slain.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Arcane Corrasion': {
    effects: [
      {
        name: `Arcane Corrasion`,
        desc: `Casting value of 6 and range of 12". If cast, pick 1 enemy unit within range and visible to the caster. Worsen the Rend characteristic of that unit's melee weapons by 1 until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },

  // Unit spells
  'Cloying Seas Mists': {
    effects: [
      {
        name: `Cloying Seas Mists`,
        desc: `Casting value of 6 and range of 12". If cast, pick 1 friendly IDONETH DEEPKIN unit, or 1 enemy unit, within range and visible to the caster. If you picked a friendly IDONETH DEEPKIN unit, heal up to D3 wounds allocated to that unit. If you picked an enemy unit, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Tsunami of Terror': {
    effects: [
      {
        name: `Tsunami of Terror`,
        desc: `Casting value of 7 and range of 12". If cast, pick up to D3 enemy units within range and visible to the caster. Subtract 1 from save rolls for attacks made with melee weapons that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Riptide: {
    effects: [
      {
        name: `Riptide`,
        desc: `Casting value of 7 and range of 18". If cast, pick 1 enemy unit within range and visible to the caster. That unit suffers D3 mortal wounds. In addition, subtract 1 from hit rolls for attacks made by that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
