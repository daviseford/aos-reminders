import { tagAs } from 'factions/metatagger'
import { BATTLESHOCK_PHASE, CHARGE_PHASE, COMBAT_PHASE, HERO_PHASE, SHOOTING_PHASE } from 'types/phases'

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
}

export default tagAs(Spells, 'spell')
