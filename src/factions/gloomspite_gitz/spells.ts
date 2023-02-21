import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, HERO_PHASE, MOVEMENT_PHASE, SHOOTING_PHASE } from 'types/phases'

const Spells = {
  // Lore of the Moonclan
  // 'Vindictive Glare': {
  //   effects: [
  //     {
  //       name: `Vindictive Glare`,
  //       desc: `Casting value of 5. Pick 1 enemy unit within 12" of the caster and visible to them. That unit suffers D3 mortal wounds.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  'Itchy Nuisance': {
    effects: [
      {
        name: `Itchy Nuisance`,
        desc: `Casting value of 6 and a range of 18". Pick 1 enemy unit within range and visible to the caster. The strike-last effect applies to that unit until the end of the turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // 'The Great Green Spite': {
  //   effects: [
  //     {
  //       name: `The Great Green Spite`,
  //       desc: `Casting value of 7. Pick 1 friendly GLOOMSPITE GITZ unit wholly within 18" of the caster, and an enemy unit within 24" of the caster and visible to them. The enemy unit suffers 1 mortal wound if the friendly unit has fewer than 10 models, D3 mortal wounds if the friendly unit has 10 to 20 models, and D6 mortal wounds if it has more than 20 models.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  'The Hand of Gork': {
    effects: [
      {
        name: `The Hand of Gork`,
        desc: `Casting value of 7 and a range of 24". Pick 1 friendly GLOOMSPITE GITZ unit more than 3" from all enemy units and that is wholly within range and visible to the caster. Remove that unit from the battlefield and set it up again anywhere on the battlefield more than 9" from all enemy units. It cannot move in the following movement phase.`,
        when: [HERO_PHASE, MOVEMENT_PHASE],
      },
    ],
  },
  'Squig Lure': {
    effects: [
      {
        name: `Squig Lure`,
        desc: `Casting value of 5 and a range of 18". Pick 1 friendly SQUIG unit wholly within range and visible to the caster. Until your next hero phase, you can reroll charge rolls for that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // 'Call da Moon': {
  //   effects: [
  //     {
  //       name: `Call da Moon`,
  //       desc: `Casting value of 8. Pick 1 enemy unit visible to the caster. That unit suffers D3 mortal wounds. If that unit is wholly affected by the Light of the Bad Moon, you can reroll the D3 that determines the number of mortal wounds.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // Lore of the Spiderfangs
  // 'Deadly Webbing': {
  //   effects: [
  //     {
  //       name: `Deadly Webbing`,
  //       desc: `Casting value of 5. Pick 1 terrain feature within 24" of the caster that is visible to them. Until your next hero phase, that terrain feature has the Deadly and Sinister scenery rules in addition to any other scenery rules it already has (core rules, 28.1.3). SPIDERFANG units ignore the effects of this spell.`,
  //       when: [HERO_PHASE],
  //       rule_sources: [rule_sources.BATTLETOME_GLOOMSPITE_GITZ, rule_sources.ERRATA_JULY_2021],
  //     },
  //   ],
  // },
  // 'Venomous Spiderlings': {
  //   effects: [
  //     {
  //       name: `Venomous Spiderlings`,
  //       desc: `Casting value of 6. Pick 1 enemy unit within 12" of the caster and visible to them and roll a number of dice equal to the number of models in that unit. For each 6+ that unit suffers 1 mortal wound.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  'Scuttling Terrors': {
    effects: [
      {
        name: `Scuttling Terrors`,
        desc: `Casting value of 6 and a range of 18". Pick 1 friendly SPIDERFANG unit wholly within range and visible to the caster. That unit can make a normal move.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Sneaky Distraction': {
    effects: [
      {
        name: `Sneaky Distraction`,
        desc: `Casting value of 7 and a range of 12". If successfully cast, until your next hero phase, subtract 1 from hit rolls for attacks made by enemy units while they are within range of the caster.`,
        when: [HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Curse of da Spider God': {
    effects: [
      {
        name: `Curse of da Spider God`,
        desc: `Casting value of 7 and a range of 24". Pick 1 enemy unit within range and visible to the caster. Until the start of your next hero phase, hit rolls for attacks made by that unit always fail on an unmodified roll of 1 or 2 instead of only a 1, and save rolls for attacks that target that unit always fail on an unmodified roll of 1 or 2 instead of only a 1.`,
        when: [HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  // 'Gift of da Spider God': {
  //   effects: [
  //     {
  //       name: `Gift of da Spider God`,
  //       desc: `Casting value of 8. Pick 1 friendly SPIDERFANG MONSTER within 12" of the caster that is visible to them. You can heal D6 wounds allocated to that unit.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // Unit spells
  'Nikkit! Nikkit!': {
    effects: [
      {
        name: `Nikkit! Nikkit!`,
        desc: `Nikkit! Nikkit! is a spell that has a casting value of 8 and a range of 12". Pick 1 enemy model within range and visible to the caster. That model's unit suffers D3 mortal wounds. In addition, if that model bears an artefact of power and the casting roll was 10+, that model's artefact of power can no longer be used (if it was used to enhance a weapon, that weapon reverts to its normal form).`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Night Shroud': {
    effects: [
      {
        name: `Night Shroud`,
        desc: `Casting value of 5 and a range of 12". Pick 1 friendly Gloomspite Gitz unit wholly within range and visible to the caster. Until the start of your next hero phase, subtract 1 from hit rolls for attacks made with missile weapons that target that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Spore Maws': {
    effects: [
      {
        name: `Spore Maws`,
        desc: `Casting value of 7 and a range of 6". If successfully cast, each enemy unit within range suffers D6 mortal wounds (roll separately for each unit).`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fangz of da Bad Moon': {
    effects: [
      {
        name: `Fangz of da Bad Moon`,
        desc: `Casting value of 3 and a range of 24". Pick 1 enemy unit within range and visible to the caster and roll a number of dice equal to the casting roll. For each 3+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Face of Da Bad Moon': {
    effects: [
      {
        name: `Face of Da Bad Moon`,
        desc: `Casting value of 5 and a range of 9". Pick 1 enemy unit within range and visible to the caster. That unit must retreat. If it is impossible for the unit to retreat for any reason, it suffers D6 mortal wounds instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Venom of the Spider God': {
    effects: [
      {
        name: `Venom of the Spider God`,
        desc: `Casting value of 6 and a range of 18". Pick 1 friendly Spiderfang unit wholly within range and visible to the caster. Until the start of your next hero phase, add 1 to the number of mortal wounds caused by the 'Spider Venom' ability of that unit if the unmodified hit roll was 6. If the casting roll was 10 or more, pick up to D3 different friendly Spiderfang units instead of 1. Designer's Note: If a unit is affected by the Light of the Bad Moon, this spell does not affect unmodified hit rolls of 5; it only affects unmodified hit rolls of 6.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Speed of the Spider God': {
    effects: [
      {
        name: `Speed of the Spider God`,
        desc: `Casting value of 4 and a range of 24". Pick 1 friendly Spiderfang unit wholly within range and visible to the caster. Until your next hero phase, that unit can run and still shoot and/or charge later in the turn. If the casting roll was 8 or more, pick up to D3 friendly Spiderfang units instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Jealous Hex': {
    effects: [
      {
        name: `Jealous Hex`,
        desc: `Casting value of 6 and a range of 18". Pick 1 enemy Hero within range and visible to the caster. Until the start of your next hero phase, ignore positive modifiers to hit rolls and wound rolls for attacks made by that Hero, and ignore positive modifiers to save rolls for attacks that target that Hero.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Hag Curse': {
    effects: [
      {
        name: `Hag Curse`,
        desc: `Casting value of 7 and a range of 12". Pick 1 enemy unit within range and visible to the caster. Until your next hero phase, subtract 1 from hit rolls for attacks made by that unit and subtract 1 from save rolls for attacks that target that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Mesmerise: {
    effects: [
      {
        name: `Mesmerise`,
        desc: `Casting value of 6 and a range of 12". Only this unit's Boggleye knows this spell and can attempt to cast it. Pick 1 enemy unit within range and visible to the caster. Until the start of your next hero phase, that unit cannot issue or receive commands.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fungoid Cloud': {
    effects: [
      {
        name: `Fungoid Cloud`,
        desc: `Casting value of 6 and a range of 12". Only this unit's Shroomancer knows this spell and can attempt to cast it. If successfully cast, until the start of your next hero phase, subtract 1 from hit rolls for attacks that target friendly Gloomspite Gitz units while they are wholly within range of this unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
