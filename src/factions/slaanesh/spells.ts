import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Spells = {
  'Lash of Slaanesh': {
    effects: [
      {
        name: `Lash of Slaanesh`,
        desc: `Casting value of 6 and a range of 12". Pick 1 enemy unit within range and visible to the caster, and roll number of dice equal to the number of models in that unit. For each 5+, subtract 1 from the Attacks characteristic of that unit's melee weapons (to a minimum of 1) until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Pavane of Slaanesh': {
    effects: [
      {
        name: `Pavane of Slaanesh`,
        desc: `Casting value of 6 and a range of 12". Pick 1 enemy unit within range and visible to the caster, and roll a number of dice equal to that unit's Move characteristic. For each 5+, subtract 1" from that unit's Move characteristic (to a minimum of 1") for the rest of the battle. Ihe same unit cannot be affected by this ability more than once per battle.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Hysterical Frenzy': {
    effects: [
      {
        name: `Hysterical Frenzy`,
        desc: `Casting value of 7 and a range of 18". Pick 1 enemy unit within range and visible to the caster, and roll a number of dice equal to that unit's Bravery characteristic. For each 6, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Soulslice Shards': {
    effects: [
      {
        name: `Soulslice Shards`,
        desc: `Casting value of 5 and a range of 12. Pick 1 enemy unit within range and visible to the caster, and roll 2D6. If the roll is greater than that unit's Bravery characteristic, that unit cannot issue or receive commands until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Phantasmagoria: {
    effects: [
      {
        name: `Phantasmagoria`,
        desc: `Casting value of 5 and a range of 12". Pick 1 enemy unit within range and visible to the caster. Until your next hero phase, each time that unit is picked to fight, roll a dice. On a 3+, you can pick 1 friendly Hedonites of Slaanesh unit within 3" of that unit. That friendly unit can retreat before that enemy unit piles in.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Born of Damnation': {
    effects: [
      {
        name: `Born of Damnation`,
        desc: `Casting value of 6. If successfully cast, roll 6 dice. For each 4+, you receive 1 depravity point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Paths of the Dark Prince': {
    effects: [
      {
        name: `Paths of the Dark Prince`,
        desc: `Casting value of 5. If successfully cast, roll 3D6 instead of 2D6 when making a charge roll for the caster until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Progeny of Damnation': {
    effects: [
      {
        name: `Progeny of Damnation`,
        desc: `Casting value of 5 and a range of 12". Pick 1 friendly HEDONITES OF SLAANESH unit wholly within range and visible to the caster. Until your next hero phase, if that unit finishes a normal move, run or retreat within 9" of any enemy units, those units cannot receive the Redeploy command.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Slothful Stupor': {
    effects: [
      {
        name: `Slothful Stupor`,
        desc: `Casting value of 7 and a range of 12". Pick 1 enemy unit within range and visible to the caster. Until your next hero phase, the Move characteristic of that unit is 3" and all run rolls and charge rolls for that unit are treated as being 3.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Cacophonic Choir': {
    effects: [
      {
        name: `Cacophonic Choir`,
        desc: `Casting value of 6 and a range of 6". If successfully cast, roll 2D6. Each enemy unit within range that has a Bravery characteristic of less than the roll suffers D3 mortal wounds (roll separately for each unit).`,
        when: [HERO_PHASE],
      },
    ],
  },
  Acquiescence: {
    effects: [
      {
        name: `Acquiescence`,
        desc: `Casting value of 5 and a range of 18". Pick 1 enemy unit within range and visible to the caster. Add 1 to wound rolls for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Subvert: {
    effects: [
      {
        name: `Subvert`,
        desc: `Casting value of 7 and a range of 18". Pick 1 enemy unit within range and visible to the caster. That unit cannot issue or receive commands until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Refine Senses': {
    effects: [
      {
        name: `Refine Senses`,
        desc: `Casting value of 4. If successfully cast, until your next hero phase, add 1 to hit rolls and wound rolls for attacks made by the caster that target an enemy Hero and add 1 to save rolls for attacks made by enemy Heroes that target the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Overwhelming Acquiescence': {
    effects: [
      {
        name: `Overwhelming Acquiescence`,
        desc: `Casting value of 6 and a range of 24". Pick up to D3 different enemy units within range and visible to the caster. Add 1 to wound rolls for attacks that target those units until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Crippling Famishment': {
    effects: [
      {
        name: `Crippling Famishment`,
        desc: `Casting value of 7 and a range of 18". Pick 1 enemy unit within range and visible to the caster. Until your next hero phase, halve the Move characteristic of that unit, and halve run rolls and charge rolls for that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Reflection Eternal': {
    effects: [
      {
        name: `Reflection Eternal`,
        desc: `Casting value of 6 and a range of 12". Pick 1 enemy unit within range and visible to the caster. Subtract 1 from the Attacks characteristic of that unit's melee weapons (to a minimum of 1) until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Whispers of Doubt': {
    effects: [
      {
        name: `Whispers of Doubt`,
        desc: `Casting value of 6. Pick 1 enemy Hero visible to the caster and roll 3D6. If the roll is equal to or greater than that Hero's Bravery characteristic, add 1 to hit rolls and wound rolls for attacks that target that Hero until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
