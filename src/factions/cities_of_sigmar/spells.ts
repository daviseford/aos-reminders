import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Spells = {
  'Wings of Fire (Hammerhal)': {
    effects: [
      {
        name: `Wings of Fire (Hammerhal)`,
        desc: `Casting value of 6. Pick 1 friendly unit that is visible to the caster. Add 1 to run and charge rolls for that unit until the start of your next hero phase. In addition, until the start of your next hero phase, that unit can fly.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Cindercloud (Hammerhal)': {
    effects: [
      {
        name: `Cindercloud (Hammerhal)`,
        desc: `Casting value of 7. Until the start of your next hero phase, subtract 1 from hit rolls for attacks that target friendly units wholly within 9" of the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Twin-Tailed Comet (Hammerhal)': {
    effects: [
      {
        name: `Twin-Tailed Comet (Hammerhal)`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster that is visible to them. That unit suffers D3 mortal wounds. If that unit has 10 or more models, it suffers D6 mortal wounds instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Lifesurge (The Living City)': {
    effects: [
      {
        name: `Lifesurge (The Living City)`,
        desc: `Casting value of 6. Pick 1 friendly model within 18" of the caster that is visible to them. Heal up to D6 wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Cage of Thorns (The Living City)': {
    effects: [
      {
        name: `Cage of Thorns (The Living City)`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster that is visible to them. Halve the Move characteristic of that unit until the start of your next hero phase. In addition, until the start of your next hero phase, the first time that unit moves, it suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Ironoak Skin (The Living City)': {
    effects: [
      {
        name: `Ironoak Skin (The Living City)`,
        desc: `Casting value of 6. Pick 1 friendly unit within 18" of the caster that is visible to them. Subtract 1 from wound rolls for attacks that target that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Descending Ash Cloud (Greywater Fastness)': {
    effects: [
      {
        name: `Descending Ash Cloud (Greywater Fastness)`,
        desc: `Casting value of 6. Pick 1 enemy unit within 18" of the caster that is visible to them. Subtract 1 from hit rolls for attacks made by that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Eroding Blast (Greywater Fastness)': {
    effects: [
      {
        name: `Eroding Blast (Greywater Fastness)`,
        desc: `Casting value of 6. Pick 1 terrain feature wholly within 18" of the caster that is visible to them. Roll 1 dice for each model within 1" of that terrain feature. For each 5+, that model's unit suffers 1 mortal wound. In addition, until your next hero phase, that terrain feature has the Deadly scenery rule in addition to any other scenery rules it may have.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Choking Fumes (Greywater Fastness)': {
    effects: [
      {
        name: `Choking Fumes (Greywater Fastness)`,
        desc: `Casting value of 6. Pick 1 enemy unit within 15" of the caster that is visible to them. Roll 1 dice for each model from that unit that is within 15" of the caster. For each 5+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Amber Tide (The Phoenicium)': {
    effects: [
      {
        name: `Amber Tide (The Phoenicium)`,
        desc: `Casting value of 6. Pick 1 enemy unit within 18" of the caster that is visible to them. Until the start of your next hero phase, halve that unit's Move characteristic.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Phoenix Cry (The Phoenicium)': {
    effects: [
      {
        name: `Phoenix Cry (The Phoenicium)`,
        desc: `Casting value of 5. Until the start of your next hero phase, subtract 1 from the Bravery characteristic of enemy units while they are within 18" of the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Golden Mist (The Phoenicium)': {
    effects: [
      {
        name: `Golden Mist (The Phoenicium)`,
        desc: `Casting value of 6. You can heal D3 wounds allocated to each friendly PHOENICIUM unit within 12" of the caster that is visible to them.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Sap Strength (Anvilgard, Har Kuron)': {
    effects: [
      {
        name: `Sap Strength (Anvilgard, Har Kuron)`,
        desc: `Casting value of 6. Pick 1 enemy unit within 18" of the caster that is visible to them. Subtract 1 from hit rolls for attacks made by that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Shadow Daggers (Anvilgard, Har Kuron)': {
    effects: [
      {
        name: `Shadow Daggers (Anvilgard, Har Kuron)`,
        desc: `Casting value of 7. Pick 1 enemy unit within 9" of the caster that is visible to them. That unit suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Vitriolic Spray (Anvilgard, Har Kuron)': {
    effects: [
      {
        name: `Vitriolic Spray (Anvilgard, Har Kuron)`,
        desc: `Casting value of 8. Pick 1 enemy unit within 6" of the caster that is visible to them. Until the start of your next hero phase, that unit has a Save characteristic of '-'.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Roaming Wildfire (Hallowheart)': {
    effects: [
      {
        name: `Roaming Wildfire (Hallowheart)`,
        desc: `Casting value of 6. Pick 1 enemy unit within 18" of the caster that is visible to them. That unit suffers D3 mortal wounds. Then roll a D6 for each other enemy unit within 6" of that unit. On a 4+, that other unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Sear Wounds (Hallowheart)': {
    effects: [
      {
        name: `Sear Wounds (Hallowheart)`,
        desc: `Casting value of 6. Pick 1 friendly unit within 18" of the caster that is visible to them. You can heal up to D6 wounds allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Elemental Cyclone (Hallowheart)': {
    effects: [
      {
        name: `Elemental Cyclone (Hallowheart)`,
        desc: `Casting value of 6. Pick 1 enemy unit within 12" of the caster that is visible to them. Roll 1 dice for each model from that unit that is within 12" of the caster. For each 4+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Warding Brand (Hallowheart)': {
    effects: [
      {
        name: `Warding Brand (Hallowheart)`,
        desc: `Casting value of 6. Pick 1 friendly unit wholly within 18" of the caster that is visible to them. Until the start of your next hero phase, roll a D6 each time a wound inflicted by a melee weapon is allocated to a model from that unit and not negated. On a 4+, the attacking unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Crystal Aegis (Hallowheart)': {
    effects: [
      {
        name: `Crystal Aegis (Hallowheart)`,
        desc: `Casting value of 5. Until the start of your next hero phase, add 1 to rolls for the Eldritch Attunement battle trait (see opposite) for friendly HALLOWHEART units wholly within 12" of the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Ignite Weapons (Hallowheart)': {
    effects: [
      {
        name: `Ignite Weapons (Hallowheart)`,
        desc: `Casting value of 6. Pick 1 friendly unit wholly within 18" of the caster that is visible to them. Add 1 to wound rolls for attacks made by that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Aura of Glory (Tempest's Eye)": {
    effects: [
      {
        name: `Aura of Glory (Tempest's Eye)`,
        desc: `Casting value of 7. Until the start of your next hero phase, add 1 to the Attacks characteristic of melee weapons used by friendly TEMPEST'S EYE units while they are wholly within 12" of the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Strike of Eagles (Tempest's Eye)": {
    effects: [
      {
        name: `Strike of Eagles (Tempest's Eye)`,
        desc: `Casting value of 7. Pick 1 enemy unit within 30" of the caster that is visible to them, and roll 6 dice. For each 4+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Celestial Visions (Tempest's Eye)": {
    effects: [
      {
        name: `Celestial Visions (Tempest's Eye)`,
        desc: `Casting value of 7. You receive 1 extra command point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Withering (Har Kuron)': {
    effects: [
      {
        name: `The Withering (Har Kuron)`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster and visible. Add 1 to wound rolls against the targeted unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Steed of Shadows (Har Kuron)': {
    effects: [
      {
        name: `Steed of Shadows (Har Kuron)`,
        desc: `Casting value of 6. The caster can fly and has a move characteristic of 16" until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Pit of Shadows (Har Kuron)': {
    effects: [
      {
        name: `Pit of Shadows (Har Kuron)`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster and visible. Roll 2D6. If the roll is higher than the targets move characteristic, it suffers a number of mortal wounds equal to the difference of the roll and the move characterisitc.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Wildform (Ghur)': {
    effects: [
      {
        name: `Wildform (Ghur)`,
        desc: `Casting value of 5+. Pick 1 visible friendly unit within 12" of the caster. Add 2 to run and charge rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Chain Lightning (Azyr)': {
    effects: [
      {
        name: `Chain Lightning (Azyr)`,
        desc: `Casting value of 6+. Pick 1 visible enemy unit within 18" of the caster. That unit suffers D3 mortal wounds. Then, roll a D6 for every other enemy unit within 6" of the original target. On a 4+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fireball (Aqshy)': {
    effects: [
      {
        name: `Fireball (Aqshy)`,
        desc: `Casting value of 5+. Pick 1 visible enemy unit within 18" of the caster. If the enemy unit has 1 model, it suffers 1 mortal wound; if it has 2 to 9 models, it suffers D3 mortal wounds; and if it has 10 or more models, it suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Mystifying Miasma (Ulgu)': {
    effects: [
      {
        name: `Mystifying Miasma (Ulgu)`,
        desc: `Casting value of 4+. Pick 1 visible enemy unit within 18" of the caster. That unit cannot run until your next hero phase. In addition, subtract 2 from charge rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Pall of Doom (Shyish)': {
    effects: [
      {
        name: `Pall of Doom (Shyish)`,
        desc: `Casting value of 6+. Pick 1 visible enemy unit within 18" of the caster. Subtract 2 from the Bravery characteristic of that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Pha's Protection (Hysh)": {
    effects: [
      {
        name: `Pha's Protection (Hysh)`,
        desc: `Casting value of 5+. Pick 1 visible friendly unit within 18" of the caster. Subtract 1 from hit rolls for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Transmutation of Lead (Chamon)': {
    effects: [
      {
        name: `Transmutation of Lead (Chamon)`,
        desc: `Casting value of 7+. Pick 1 visible enemy unit within 18" of the caster. Until your next hero phase, halve the Move characteristic of the unit you picked, rounding up. In addition, if that unit has a Save characteristic of 2+, 3+ or 4+, you can reroll hit rolls of 1 for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Shield of Thorns (Ghyran)': {
    effects: [
      {
        name: `Shield of Thorns (Ghyran)`,
        desc: `Casting value of 5+. Pick 1 visible friendly unit within 18" of the caster. Until your next hero phase, any enemy unit that finishes a charge move within 3" of that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Amber Spear': {
    effects: [
      {
        name: `Amber Spear`,
        desc: `Casting value of 7+. Pick 1 visible point on the battlefield within 18" of the caster. Draw an imaginary straight line 1mm wide between that point and the closest part of the caster's base. Roll a D6 for each unit that has models passed across by this line. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Comet of Casandora': {
    effects: [
      {
        name: `Comet of Casandora`,
        desc: `Casting value of 6+. Pick 1 visible enemy unit within 18" of the caster and roll 2D6. If the roll is less than or equal to that unit's Move characteristic, that unit suffers D3 mortal wounds. If the roll is greater than that unit's Move characteristic, that unit suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Burning Gaze': {
    effects: [
      {
        name: `Burning Gaze`,
        desc: `Casting value of 6+. Pick 1 visible enemy unit within 18" of the caster. That unit suffers D3 mortal wounds. Double the number of wounds inflicted if that unit has 10 or more models, or triple the number of wounds inflicted if that unit has 20 or more models.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Word of Pain': {
    effects: [
      {
        name: `Word of Pain`,
        desc: `Cast on 7+. Pick 1 visible enemy unit within 18". That unit suffers D3 mortal wounds. In addition, subtract 1 from hit rolls for attacks made by that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Bladewind: {
    effects: [
      {
        name: `Bladewind`,
        desc: `Cast on 6+. Pick 1 visible enemy unit within 18" and roll 9 dice. For each roll that is lower than that unit's Save characteristic, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Armour of Thorns': {
    effects: [
      {
        name: `Armour of Thorns`,
        desc: `7+ casting value. Pick 1 friendly WANDERERS unit wholly within 18" of the caster that is visible to them. Until that unit moves, that unit is treated as being in cover.In addition, until that unit moves, if the unmodified save roll for an attack made with a melee weapon that targets that unit is 6, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
