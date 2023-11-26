import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Spells = {
  // Lore of the Storm
  'Lightning Blast': {
    effects: [
      {
        name: `Lightning Blast`,
        desc: `Casting value of 5. The closest enemy unit that is visible to caster suffers D3 mortal wounds. If more than 1 enemy unit visible to the caster is equally close you can pick which unit is affected by this spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Azyrite Halo': {
    effects: [
      {
        name: `Azyrite Halo`,
        desc: `Casting value of 5 and range of 12" if the caster is a KNIGHT or 18" if the caster is a LORD or DRACONITH. Pick 1 friendly STORMCAST ETERNALS unit wholly within range and visible to the caster. Until your next hero phase, if the unmodified save roll for an attack that targets that unit is 6, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Celestial Blades': {
    effects: [
      {
        name: `Celestial Blades`,
        desc: `Casting value of 5 and range of 12" if the caster is a KNIGHT or 18" if the caster is a LORD or DRACONITH. Pick 1 friendly STORMCAST ETERNALS unit wholly within range and visible to the caster. Add 1 to wound rolls for attacks made with melee weapons by that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Chain Lightning': {
    effects: [
      {
        name: `Chain Lightning`,
        desc: `Casting value of 6 and range of 12" if the caster is a KNIGHT or 18" if the caster is a LORD or DRACONITH. Pick 1 enemy unit within range and visible to the caster. That unit suffers D3 mortal wounds. Then, roll a dice for each other enemy unit within 6" of that unit. On a 3+, that other unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Thundershock: {
    effects: [
      {
        name: `Thundershock`,
        desc: `Casting value of 6 and range of 12" if the caster is a KNIGHT or 18" if the caster is a LORD or DRACONITH. If successfully cast, roll a dice for each enemy unit within range and visible to the caster. On a 3+, subtract 1 from wound rolls for attacks made by that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Starfall: {
    effects: [
      {
        name: `Starfall`,
        desc: `Casting value of 5 and range of 12" if the caster is a KNIGHT or 18" if the caster is a LORD or DRACONITH. Pick 1 point on the battlefield within range and visible to caster. Roll a D6 for each enemy unit within 3" of that point. On a 3+, that unit cannot make pile-in moves until the end of that turn.`,
        when: [HERO_PHASE],
      },
    ],
  },

  // Unit spells
  'Lightning Pulse': {
    effects: [
      {
        name: `Lightning Pulse`,
        desc: `Casting value of 6 and range of 6". If successfully cast, subtract 1 from hit rolls for attacks made by enemy units within range until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Pyroelectric Blast': {
    effects: [
      {
        name: `Pyroelectric Blast`,
        desc: `Casting value of 7 and range of 9". Pick 1 point on the battlefield within range and visible to the caster. Each enemy unit within 3" of that point suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Stormsire: {
    effects: [
      {
        name: `Stormsire`,
        desc: `Casting value of 7 and range of 18". If successfully cast, each enemy unit within range suffers 1 mortal wound. Enemy units within 6" of the caster suffer D3 mortal wounds instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Blaze of the Heavens': {
    effects: [
      {
        name: `Blaze of the Heavens`,
        desc: `Casting value of 7 and range of 18". Pick 1 enemy unit within range and visible to the caster. That unit suffers D3 mortal wounds. Add 2" to the range of this spell for each other friendly Stormcast Eternals Thunderstrike unit wholly within 12" of the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Spirit Storm': {
    effects: [
      {
        name: `Spirit Storm`,
        desc: `Casting value of 7 and range of 18". If successfully cast, subtract 1 from run and charge rolls for enemy units within range until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Atavistic Tempest': {
    effects: [
      {
        name: `Atavistic Tempest`,
        desc: `Casting value of 9 and range of 24". If successfully cast, pick 1 enemy unit within range and visible to the caster, then pick 1 of the effects below. That effect lasts until your next hero phase.

        Blinding Gales: Subtract 1 from hit rolls for attacks made by that unit.

        Meteor-hail: Worsen the Rend characteristic of weapons used by that unit by 1 (to a minimum of '-')

        Lightning Vortex: Subtract 1 from the Attacks characteristic of missile weapons used by that unit (to a minimum of 1).

        Flash-freezing Blizzard: Subtract 1 from save rolls for attacks that target that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Thunderclap: {
    effects: [
      {
        name: `Thunderclap`,
        desc: `Casting value of 6 and range of 18". Pick 1 enemy unit within range and visible to the caster. Subtract 1 from hit rolls for attacks made by that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Storm Lance': {
    effects: [
      {
        name: `Storm Lance`,
        desc: `Casting value of 5 and range of 12". Pick 1 point on the battlefield within range and visible to the caster and draw a straight line between that point and the closest part of the caster's base. Roll a dice for each enemy unit passed across by that line. On a 4+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Healing Light': {
    effects: [
      {
        name: `Healing Light`,
        desc: `Casting value of 5 and range of 18". Pick 1 friendly Stormcast Eternals unit within range. Heal up to D3 wounds allocated to that unit. If the unmodified casting roll was 8+, heal up to D6 wounds allocated to that unit instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Lightning Orb': {
    effects: [
      {
        name: `Lightning Orb`,
        desc: `Casting value of 6 and range of 12". Pick 1 point on the battlefield within range and visible to the caster. Roll a dice for each enemy unit within 3" of that point. On a 4+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Purifying Blast': {
    effects: [
      {
        name: `Purifying Blast`,
        desc: `Casting value of 5 and range of 12". If successfully cast, roll a dice for each enemy unit within range. Add that unit's Bravery characteristic to the roll. If the result is 12 or less, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Empower: {
    effects: [
      {
        name: `Empower`,
        desc: `Casting value of 6 and range of 12". Pick 1 friendly Redeemer or Sacrosanct unit wholly within range. Add 1 to wound rolls for attacks made by that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Regal Authority': {
    effects: [
      {
        name: `Regal Authority`,
        desc: `Casting value of 7 and a range of 18". Pick 1 friendly DRACONITH unit wholly within range and visible to the caster. Until the start of your next hero phase, each time that unit issues a command, roll a dice. On a 5+, the command point used to issue that command is not spent.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
