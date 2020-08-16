import { TSpells } from 'types/army'
import { HERO_PHASE } from 'types/phases'

const Spells: TSpells = [
  {
    name: `Wings of Fire (Hammerhal)`,
    effects: [
      {
        name: `Wings of Fire (Hammerhal)`,
        desc: `Casting value of 6. Pick 1 friendly unit that is visible to the caster. Add 1 to run and charge rolls for that unit until the start of your next hero phase. In addition, until the start of your next hero phase, that unit can fly.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Cindercloud (Hammerhal)`,
    effects: [
      {
        name: `Cindercloud (Hammerhal)`,
        desc: `Casting value of 7. Until the start of your next hero phase, subtract 1 from hit rolls for attacks that target friendly units wholly within 9" of the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Twin-Tailed Comet (Hammerhal)`,
    effects: [
      {
        name: `Twin-Tailed Comet (Hammerhal)`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster that is visible to them. That unit suffers D3 mortal wounds. If that unit has 10 or more models, it suffers D6 mortal wounds instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Lifesurge (The Living City)`,
    effects: [
      {
        name: `Lifesurge (The Living City)`,
        desc: `Casting value of 6. Pick 1 friendly model within 18" of the caster that is visible to them. Heal up to D6 wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Cage of Thorns (The Living City)`,
    effects: [
      {
        name: `Cage of Thorns (The Living City)`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster that is visible to them. Halve the Move characteristic of that unit until the start of your next hero phase. In addition, until the start of your next hero phase, the first time that unit moves, it suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Ironoak Skin (The Living City)`,
    effects: [
      {
        name: `Ironoak Skin (The Living City)`,
        desc: `Casting value of 6. Pick 1 friendly unit within 18" of the caster that is visible to them. Subtract 1 from wound rolls for attacks that target that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Descending Ash Cloud (Greywater Fastness)`,
    effects: [
      {
        name: `Descending Ash Cloud (Greywater Fastness)`,
        desc: `Casting value of 6. Pick 1 enemy unit within 18" of the caster that is visible to them. Subtract 1 from hit rolls for attacks made by that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Eroding Blast (Greywater Fastness)`,
    effects: [
      {
        name: `Eroding Blast (Greywater Fastness)`,
        desc: `Casting value of 6. Pick 1 terrain feature wholly within 18" of the caster that is visible to them. Roll 1 dice for each model within 1" of that terrain feature. For each 5+, that model's unit suffers 1 mortal wound. In addition, until your next hero phase, that terrain feature has the Deadly scenery rule in addition to any other scenery rules it may have.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Choking Fumes (Greywater Fastness)`,
    effects: [
      {
        name: `Choking Fumes (Greywater Fastness)`,
        desc: `Casting value of 6. Pick 1 enemy unit within 15" of the caster that is visible to them. Roll 1 dice for each model from that unit that is within 15" of the caster. For each 5+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Amber Tide (The Phoenicium)`,
    effects: [
      {
        name: `Amber Tide (The Phoenicium)`,
        desc: `Casting value of 6. Pick 1 enemy unit within 18" of the caster that is visible to them. Until the start of your next hero phase, halve that unit's Move characteristic.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Phoenix Cry (The Phoenicium)`,
    effects: [
      {
        name: `Phoenix Cry (The Phoenicium)`,
        desc: `Casting value of 5. Until the start of your next hero phase, subtract 1 from the Bravery characteristic of enemy units while they are within 18" of the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Golden Mist (The Phoenicium)`,
    effects: [
      {
        name: `Golden Mist (The Phoenicium)`,
        desc: `Casting value of 6. You can heal D3 wounds allocated to each friendly PHOENICIUM unit within 12" of the caster that is visible to them.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Sap Strength (Anvilgard)`,
    effects: [
      {
        name: `Sap Strength (Anvilgard)`,
        desc: `Casting value of 6. Pick 1 enemy unit within 18" of the caster that is visible to them. Subtract 1 from hit rolls for attacks made by that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Shadow Daggers (Anvilgard)`,
    effects: [
      {
        name: `Shadow Daggers (Anvilgard)`,
        desc: `Casting value of 7. Pick 1 enemy unit within 9" of the caster that is visible to them. That unit suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Vitriolic Spray (Anvilgard)`,
    effects: [
      {
        name: `Vitriolic Spray (Anvilgard)`,
        desc: `Casting value of 8. Pick 1 enemy unit within 6" of the caster that is visible to them. Until the start of your next hero phase, that unit has a Save characteristic of '-'.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Roaming Wildfire (Hallowheart)`,
    effects: [
      {
        name: `Roaming Wildfire (Hallowheart)`,
        desc: `Casting value of 6. Pick 1 enemy unit within 18" of the caster that is visible to them. That unit suffers D3 mortal wounds. Then roll a D6 for each other enemy unit within 6" of that unit. On a 4+, that other unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Sear Wounds (Hallowheart)`,
    effects: [
      {
        name: `Sear Wounds (Hallowheart)`,
        desc: `Casting value of 6. Pick 1 friendly unit within 18" of the caster that is visible to them. You can heal up to D6 wounds allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Elemental Cyclone (Hallowheart)`,
    effects: [
      {
        name: `Elemental Cyclone (Hallowheart)`,
        desc: `Casting value of 6. Pick 1 enemy unit within 12" of the caster that is visible to them. Roll 1 dice for each model from that unit that is within 12" of the caster. For each 4+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Warding Brand (Hallowheart)`,
    effects: [
      {
        name: `Warding Brand (Hallowheart)`,
        desc: `Casting value of 6. Pick 1 friendly unit wholly within 18" of the caster that is visible to them. Until the start of your next hero phase, roll a D6 each time a wound inflicted by a melee weapon is allocated to a model from that unit and not negated. On a 4+, the attacking unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Crystal Aegis (Hallowheart)`,
    effects: [
      {
        name: `Crystal Aegis (Hallowheart)`,
        desc: `Casting value of 5. Until the start of your next hero phase, add 1 to rolls for the Eldritch Attunement battle trait (see opposite) for friendly HALLOWHEART units wholly within 12" of the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Ignite Weapons (Hallowheart)`,
    effects: [
      {
        name: `Ignite Weapons (Hallowheart)`,
        desc: `Casting value of 6. Pick 1 friendly unit wholly within 18" of the caster that is visible to them. Add 1 to wound rolls for attacks made by that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Aura of Glory (Tempest's Eye)`,
    effects: [
      {
        name: `Aura of Glory (Tempest's Eye)`,
        desc: `Casting value of 7. Until the start of your next hero phase, add 1 to the Attacks characteristic of melee weapons used by friendly TEMPEST'S EYE units while they are wholly within 12" of the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Strike of Eagles (Tempest's Eye)`,
    effects: [
      {
        name: `Strike of Eagles (Tempest's Eye)`,
        desc: `Casting value of 7. Pick 1 enemy unit within 30" of the caster that is visible to them, and roll 6 dice. For each 4+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Celestial Visions (Tempest's Eye)`,
    effects: [
      {
        name: `Celestial Visions (Tempest's Eye)`,
        desc: `Casting value of 7. You receive 1 extra command point.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells
