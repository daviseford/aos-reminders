import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Spells = {
  'Celestial Apotheosis': {
    effects: [
      {
        name: `Celestial Apotheosis`,
        desc: `Casting value of 5. Pick 1 friendly unit wholly within 18" of the caster and visible to them. Heal 1 wound allocated to that unit. In addition, until your next hero phase, subtract 1 from the Bravery characteristic of enemy units while they are within 3" of that unit. If the casting roll was 10+, heal up to D3 wounds instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Walk Between Realms': {
    effects: [
      {
        name: `Walk Between Realms`,
        desc: `Casting value of 6. Pick 1 friendly unit wholly within 18" of the caster and visible to them. Until your next hero phase, that unit can fly.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Tide of Serpents': {
    effects: [
      {
        name: `Tide of Serpents`,
        desc: `Casting value of 8. Pick 1 enemy unit within 12" of the caster and roll a number of dice equal to the number of models in that unit. For each 5+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Mystical Unforging': {
    effects: [
      {
        name: `Mystical Unforging`,
        desc: `Casting value of 7. Pick 1 enemy HERO that bears an artefact of power within 12" of the caster and visible to them. That HERO suffers D3 mortal wounds and you must roll a D6. On a 5+, that HERO no longer bears that artefact of power (if a weapon was picked when it was selected, the weapon reverts to normal).`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Stellar Tempest': {
    effects: [
      {
        name: `Stellar Tempest`,
        desc: `Casting value of 8. Pick 1 enemy unit within 24" of the caster and visible to them. Roll 1 dice for each model in that unit. For each 5+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fiery Convocation': {
    effects: [
      {
        name: `Fiery Convocation`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster and visible to them. Until your next hero phase, at the end of each phase of a turn, roll a D6 for that unit. On a 6, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Bind Endless Spell': {
    effects: [
      {
        name: `Bind Endless Spell`,
        desc: `Casting value of 7. Pick 1 endless spell within 18" of the caster, not soul-linked, and visible to them. Until your next hero phase, that endless spell has the BOUND keyword.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Extend Astromatrix': {
    effects: [
      {
        name: `Extend Astromatrix`,
        desc: `Casting value of 6. Pick 1 terrain feature wholly within 18" of the caster and visible to them. Any Damned, Arcane, Inspiring and Mystical scenery rules for that terrain feature only apply to SERAPHON units, while any Deadly and Sinister scenery rules for that terrain feature do not apply to SERAPHON units.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Hand of Glory': {
    effects: [
      {
        name: `Hand of Glory`,
        desc: `Casting value of 6. Pick 1 friendly unit wholly within 18" of the caster and visible to them. Until your next hero phase, you can reroll hit rolls of 1 for attacks made by that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Celestial Harmony': {
    effects: [
      {
        name: `Celestial Harmony`,
        desc: `Casting value of 5. Pick 1 friendly unit wholly within 18" of the caster and visible to them. Until your next hero phase, do not take battleshock tests for that unit. If the casting roll was 10 or more, pick all friendly units within 18" of the caster and visible to them instead of only 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Celestial Equilibrium': {
    effects: [
      {
        name: `Celestial Equilibrium`,
        desc: `Casting value of 7. Until your next hero phase, add 1 to casting, dispelling and unbinding rolls for friendly WIZARDS other than the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Drain Magic': {
    effects: [
      {
        name: `Drain Magic`,
        desc: `Casting value of 9. All endless spells within 24" of the caster that are not BOUND are dispelled.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Comet's Call": {
    effects: [
      {
        name: `Comet's Call`,
        desc: `Casting value of 7. You can pick up to D3 different enemy units anywhere on the battlefield, Each of those units suffers D3 mortal wounds (roll separately for each). If the casting roll was 10+, pick up to D6 different enemy units instead of up to D3.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Celestial Deliverance': {
    effects: [
      {
        name: `Celestial Deliverance`,
        desc: `The caster can attempt to cast this spell up to 3 times in the same hero phase.

    Casting value of 7 the first time it is attempted in a phase, a casting value of 8 the second time it is attempted in a phase, and a casting value of 9 the third time it is attempted in a phase.

    Each time this spell is successfully cast, pick up to 3 different enemy units within 10" of the caster and visible to them, and roll 1 dice for each unit you pick. On a 2+, that unit suffers D3 mortal wounds, If that unit is a CHAOS DAEMON unit, on a 2+ it suffers 3 mortal wounds instead of D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Control Fate': {
    effects: [
      {
        name: `Control Fate`,
        desc: `Casting value of 7. Pick 1 unit within 18" of the caster and visible to them. If that unit is an enemy unit, until your next hero phase, subtract 1 from save rolls for attacks that target that unit, If that unit is a friendly SERAPHON unit, until your next hero phase, add 1 to save rolls for attacks that target that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Blazing Starlight': {
    effects: [
      {
        name: `Blazing Starlight`,
        desc: `Casting value of 6. Pick 1 enemy unit within 18" of the caster and visible to them. Until your next hero phase, subtract 1 from hit rolls for attacks made by that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
