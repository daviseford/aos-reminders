import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Spells = {
  'Tide of Serpents': {
    effects: [
      {
        name: `Tide of Serpents`,
        desc: `Casting value of 7 and a range of 15". Pick 1 enemy unit within range and visible to the caster. Roll a number of dice equal to the number of models in that unit. For each 5+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Mystical Unforging': {
    effects: [
      {
        name: `Mystical Unforging`,
        desc: `Casting value of 8 and a range of 12". Pick 1 enemy unit within range and visible to the caster. Until the start of your next hero phase, the Rend characteristic of that unit's weapons is treated as '-'.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Stellar Tempest': {
    effects: [
      {
        name: `Stellar Tempest`,
        desc: `Casting value of 8 and a range of 24". Pick 1 enemy unit within range and visible to the caster. Roll a number of dice equal to the number of models in that unit. For each 5+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Cosmic Crush': {
    effects: [
      {
        name: `Cosmic Crush`,
        desc: `Casting value of 7 and a range of 12". Pick 1 enemy unit within range and visible to the caster. Roll a number of dice equal to the number of models in that unit. For each roll that equals or exceeds that unit's Save characteristic, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Celestial Harmony': {
    effects: [
      {
        name: `Celestial Harmony`,
        desc: `Casting value of 5 and a range of 18". Pick 1 friendly SERAPHON unit wholly within range and visible to the caster. If the casting roll was 10+, pick all friendly SERAPHON units wholly within range and visible to the caster instead of 1. Until your next hero phase, the units picked have a Bravery characteristic of 10.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Speed of Huanchi': {
    effects: [
      {
        name: `Speed of Huanchi`,
        desc: `Casting value of 6 and a range of 18". Pick 1 friendly KROXIGOR or SKINK unit that is not a MONSTER and that is wholly within range and visible to the caster. That unit can make a normal move.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Celestial Equilibrium': {
    effects: [
      {
        name: `Celestial Equilibrium`,
        desc: `Casting value of 6. If successfully cast, until the end of the phase, add 1 to casting rolls for friendly WIZARDS other than the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Drain Magic': {
    effects: [
      {
        name: `Drain Magic`,
        desc: `Casting value of 6. Until the end of the phase, each time a friendly Seraphon Wizard is picked to cast a spell, instead of attempting to cast that spell, they can attempt to dispel an endless spell. If they do so, add 1 to the dispelling roll. In addition, until the end of the phase, subtract
        1 from unbinding rolls made for enemy units.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Comet's Call": {
    effects: [
      {
        name: `Comet's Call`,
        desc: `Casting value of 7. Pick up to D3 different enemy units on the battlefield. If the casting roll was 10+, pick up to D6 different enemy units instead of up to D3. Each of those units suffers D3 mortal wounds (roll separately for each unit).`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Tepok's Beneficence": {
    effects: [
      {
        name: `Tepok's Beneficence`,
        desc: `Casting value of 5 and a range of 18". Pick 1 friendly SKINK unit wholly within range and visible to the caster. Until the start of your next hero phase, subtract 1 from wound rolls for attacks that target that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Celestial Deliverance': {
    effects: [
      {
        name: `Celestial Deliverance`,
        desc: `Casting value of 7 and a range of 12". This unit can attempt to cast this spell multiple times in your hero phase. Each time this spell is successfully cast, pick up to 3 different enemy units within range and visible to the caster. Each of those units suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Blazing Starlight': {
    effects: [
      {
        name: `Blazing Starlight`,
        desc: `Casting value of 6 and a range of 18". Pick 1 enemy unit within range and visible to the caster. Until your next hero phase, subtract 1 from hit rolls for attacks made by that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Earth Trembles': {
    effects: [
      {
        name: `The Earth Trembles`,
        desc: `Casting value of 8. Pick 1 of the corners of the battlefield and draw a straight line between that corner and the closest part of the caster's base. Roll a dice for each enemy unit passed across by that line. On a 4+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Empowered Celestite': {
    effects: [
      {
        name: `Empowered Celestite`,
        desc: `Casting value of 7 and a range of 18". Pick 1 friendly SAURUS unit wholly within range and visible to the caster. Until the start of the next hero phase, improve the Rend characteristic of that unit's Celestite weapons by 1. A Celestite weapon is any weapon that has 'Celestite' in the name.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Itzl's Invigoration": {
    effects: [
      {
        name: `Itzl's Invigoration`,
        desc: `Casting value of 6 and a range of 12". Pick 1 friendly MONSTER wholly within range and visible to the caster. Until the start of your next hero phase, use the top row of that unit's damage table, regardless of how many wounds it has suffered.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Telepathic Summons': {
    effects: [
      {
        name: `Telepathic Summons`,
        desc: `Casting value of 6 and a range of 9". Pick 1 friendly Seraphon unit that is not a Monster and that is visible to the caster. Remove that unit from the battlefield and set it up again wholly within range of the caster and more than 9" from all enemy units. That unit cannot move in the next movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Light of Chotec': {
    effects: [
      {
        name: `Light of Chotec`,
        desc: `Casting value of 7 and a range of 12". Pick 1 friendly SERAPHON model wholly within range and visible to the caster. Roll a number of dice equal to the number of wounds allocated to it. For each 5+, heal 1 wound allocated to that model.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Heavenly Frenzy': {
    effects: [
      {
        name: `Heavenly Frenzy`,
        desc: `Casting value of 7 and a range of 18". Pick 1 friendly SERAPHON unit wholly within range and visible to the caster. Until the end of the turn, that unit can run and still charge later in the turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Primordial Mire': {
    effects: [
      {
        name: `Primordial Mire`,
        desc: `Casting value of 7 and a range of 12". Pick 1 objective or terrain feature within range and visible to the caster. Until your next hero phase, units within 3" of that objective or terrain feature cannot run or retreat and must halve the result of any charge rolls. This spell has no effect on SKINK units and units that can fly.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Celestial Doom': {
    effects: [
      {
        name: `Celestial Doom`,
        desc: `Casting value of 7 and a range of 12". Pick 1 enemy unit within range and visible to the caster. Until the end of your turn, ward rolls cannot be made for models in that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Shield of the Old Ones': {
    effects: [
      {
        name: `Shield of the Old Ones`,
        desc: `Casting value of 7. If successfully cast, the caster has a ward of 4+ against mortal wounds until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Spells, 'spell')
