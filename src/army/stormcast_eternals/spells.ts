import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'
import { TSpells } from 'types/army'

// Lore of the Storm, Lore of Invigoration & Prayers of the Stormhosts
const Spells: TSpells = [
  {
    name: `Lightning Blast`,
    effects: [
      {
        name: `Lightning Blast`,
        desc: `Casting value of 5. Closest enemy unit that is visible to caster suffers D3 mortal wounds. If more than one visible unit is equally close you can pick.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Starfall`,
    effects: [
      {
        name: `Starfall`,
        desc: `Casting value of 5. Pick a point on the battlefield within 12" and visible to caster. Roll a D6 for each enemy unit within 3" of that point. On a 4+ that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Thundershock`,
    effects: [
      {
        name: `Thundershock`,
        desc: `Casting value of 6. Roll a D6 for each enemy unit within 6" of the caster that is visible to them. On a 4+ that unit suffers 1 mortal wound. In addition subtract 1 from hit rolls for attacks made by that unit until your next hero phase.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Azyrite Halo`,
    effects: [
      {
        name: `Azyrite Halo`,
        desc: `Casting value of 5. Pick a friendly STORMCAST ETERNAL unit wholly within 12" of the caster that is visible to them. Until your next hero phase, each time you make an unmodified save roll of 6 for that unit, the attacking unit suffers 1 mortal wound after all its attacks have been made.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Chain Lightning`,
    effects: [
      {
        name: `Chain Lightning`,
        desc: `Casting value of 7. Pick an enemy unit within 24" that is visible. That unit suffers D3 mortal wounds. Then roll a D6 for each enemy unit within 3" of the first. On a 4+ that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Stormcaller`,
    effects: [
      {
        name: `Stormcaller`,
        desc: `Casting value of 7. Roll a D6 for each enemy unit on the battlefield. On a 6+ that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Celestial Blades`,
    effects: [
      {
        name: `Celestial Blades`,
        desc: `Casting value of 5. Pick a friendly STORMCAST ETERNAL unit wholly within 18" of the caster that is visible. Add 1 to wound rolls for attacks made with that unit's melee weapons until your next hero phase.`,
        when: [HERO_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Terrifying Aspect`,
    effects: [
      {
        name: `Terrifying Aspect`,
        desc: `Casting value of 5. Pick a friendly STORMCAST ETERNAL unit wholly within 18" that is visible. Until your next hero phase subtract 1 from the bravery characteristic of enemy units within 3" of that unit.`,
        when: [HERO_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Speed of Lightning`,
    effects: [
      {
        name: `Speed of Lightning`,
        desc: `Casting value of 5. Pick a friendly STORMCAST ETERNAL unit wholly within 9" that is visible. You can re-roll charge rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Divine Light`,
    effects: [
      {
        name: `Divine Light`,
        desc: `Pick a unit wholly within 18" of this PRIEST and roll dice. 3+. Enemy units re-roll hit rolls of 1 that target that unit. Friendly units re-roll unmodified hit rolls of 6 for attacks that target that unit.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bless Weapons`,
    effects: [
      {
        name: `Bless Weapons`,
        desc: `Pick a friendly unit wholly within 18" of this PRIEST and roll dice. 4+. Until next hero phase each unmodified hit roll of 6 for that unit inflicts 1 extra hit on the target. Make a wound and save roll for each.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bolster Faith`,
    effects: [
      {
        name: `Bolster Faith`,
        desc: `Pick a friendly STORMCAST ETERNAL unit wholly within 9" of this PRIEST and roll dice. 3+. Until your next hero phase this unit does not take battleshock tests.`,
        when: [HERO_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Abjuration`,
    effects: [
      {
        name: `Abjuration`,
        desc: `At the start of the ENEMY hero phase pick an enemy WIZARD within 12" of this PRIEST and roll a D6. 3+. This PRIEST can attempt to unbind 1 spell cast by that enemy WIZARD in that hero phase in the same manner as a WIZARD.`,
        when: [START_OF_HERO_PHASE, HERO_PHASE],
      },
    ],
  },
  {
    name: `God King's Aspect`,
    effects: [
      {
        name: `God King's Aspect`,
        desc: `3+. Until your next hero phase subtract 1 from bravery of enemy units within 6" of this PRIEST.`,
        when: [HERO_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Translocation`,
    effects: [
      {
        name: `Translocation`,
        desc: `Pick a friendly STORMCAST ETERNAL unit wholly within 9" of this PRIEST and roll dice. 3+. Remove that unit from the battlefield and set it up again anywhere more than 9" from any enemy units. Cannot move in subsequent movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells
