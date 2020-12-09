import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

const Spells = {
  'Lightning Blast': {
    effects: [
      {
        name: `Lightning Blast`,
        desc: `Casting value of 5. Closest enemy unit that is visible to caster suffers D3 mortal wounds. If more than one visible unit is equally close you can pick.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Starfall: {
    effects: [
      {
        name: `Starfall`,
        desc: `Casting value of 5. Pick a point on the battlefield within 12" and visible to caster. Roll a D6 for each enemy unit within 3" of that point. On a 4+ that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Thundershock: {
    effects: [
      {
        name: `Thundershock`,
        desc: `Casting value of 6. Roll a D6 for each enemy unit within 6" of the caster that is visible to them. On a 4+ that unit suffers 1 mortal wound. In addition subtract 1 from hit rolls for attacks made by that unit until your next hero phase.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Azyrite Halo': {
    effects: [
      {
        name: `Azyrite Halo`,
        desc: `Casting value of 5. Pick a friendly STORMCAST ETERNAL unit wholly within 12" of the caster that is visible to them. Until your next hero phase, each time you make an unmodified save roll of 6 for that unit, the attacking unit suffers 1 mortal wound after all its attacks have been made.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Chain Lightning': {
    effects: [
      {
        name: `Chain Lightning`,
        desc: `Casting value of 7. Pick an enemy unit within 24" that is visible. That unit suffers D3 mortal wounds. Then roll a D6 for each enemy unit within 3" of the first. On a 4+ that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Stormcaller: {
    effects: [
      {
        name: `Stormcaller`,
        desc: `Casting value of 7. Roll a D6 for each enemy unit on the battlefield. On a 6+ that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Celestial Blades': {
    effects: [
      {
        name: `Celestial Blades`,
        desc: `Casting value of 5. Pick a friendly STORMCAST ETERNAL unit wholly within 18" of the caster that is visible. Add 1 to wound rolls for attacks made with that unit's melee weapons until your next hero phase.`,
        when: [HERO_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Terrifying Aspect': {
    effects: [
      {
        name: `Terrifying Aspect`,
        desc: `Casting value of 5. Pick a friendly STORMCAST ETERNAL unit wholly within 18" that is visible. Until your next hero phase subtract 1 from the bravery characteristic of enemy units within 3" of that unit.`,
        when: [HERO_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  'Speed of Lightning': {
    effects: [
      {
        name: `Speed of Lightning`,
        desc: `Casting value of 5. Pick a friendly STORMCAST ETERNAL unit wholly within 9" that is visible. You can reroll charge rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Pyroelectric Blast': {
    effects: [
      {
        name: `Pyroelectric Blast`,
        desc: `Casting value of 6. Pick a point on the battlefield within 9" of the caster that is visible to them. Draw an imaginary line 1mm wide between that point and the closest part of the caster. Each unit, apart from the caster, that has any models beneath this line suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Lightning Pulse': {
    effects: [
      {
        name: `Lightning Pulse`,
        desc: `Casting value of 5. Roll a D6 for each enemy unit within 12" of the caster that is visible to them. On a 5+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Thunderclap: {
    effects: [
      {
        name: `Thunderclap`,
        desc: `Casting value of 6. Pick 1 enemy unit within 18" of the caster that is visible to them. Subtract 1 from hit rolls for attacks made by that unit until your next hero phase.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Lightning Orb': {
    effects: [
      {
        name: `Lightning Orb`,
        desc: `Casting value of 6. Pick a point on the battlefield within 12" of the caster that is visible to them. Roll a D6 for each enemy unit within 3" of this point. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Storm Lance': {
    effects: [
      {
        name: `Storm Lance`,
        desc: `Casting value of 5. Pick a point on the battlefield within 12" of the caster that is visible to them. Draw an imaginary line 1mm wide between that point and the closest part of the caster. Roll a D6 for each enemy model passed across by this line. On a 5+ that model suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Healing Light': {
    effects: [
      {
        name: `Healing Light`,
        desc: `Casting value of 5. Pick a friendly STORMCAST ETERNAL model within 18" of the caster. Heal D3 wounds that have been allocated to that model. If the casting roll was 8+, heal D6 wounds that have been allocated to that model instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Purifying Blast': {
    effects: [
      {
        name: `Purifying Blast`,
        desc: `Casting value of 5. Roll a D6 for each enemy unit within 6" of the caster. Add that unit's Bravery to the roll. If the result is less than 10, that unit suffers D3 mortal wounds. Halve the Bravery (rounding down) of DEATH and DAEMON units for this spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Spirit Storm': {
    effects: [
      {
        name: `Spirit Storm`,
        desc: `Casting value of 7. Each enemy unit within 18" of the caster suffers a mortal wound. In addition, until your next hero phase, subtract 1 from run and charge rolls for enemy units while they are within 18" of the caster.`,
        when: [HERO_PHASE, MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  Empower: {
    effects: [
      {
        name: `Empower`,
        desc: `Casting value of 6. Pick a friendly REDEEMER or SACROSANCT unit wholly within 12" of the caster. Until your next hero phase, you can reroll failed wound rolls for attacks made by that unit.`,
        when: [HERO_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Amethyst Gale': {
    effects: [
      {
        name: `Amethyst Gale`,
        desc: `Casting value of 6. Pick a enemy unit within 12" of the caster that is visible to them. That unit suffers D3 mortal wounds. In addition, until your next hero phase, subtract 1 from hit rolls for attacks made by that unit.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  Stormsire: {
    effects: [
      {
        name: `Stormsire`,
        desc: `Casting value of 7. Each enemy unit within 18" of the caster suffers 1 mortal wound. Enemy units within 6" of the caster suffer D3 mortal wounds instead. In addition, until your next hero phase, subtract 1 from run and charge rolls for enemy units while they are within 18" of the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
