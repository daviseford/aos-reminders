import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, END_OF_MOVEMENT_PHASE, HERO_PHASE } from 'types/phases'

const CommandAbilities = {
  'Endless Legions': {
    effects: [
      {
        name: `Endless Legions`,
        desc: `You can use this command ability at the end of your movement phase. If you do so, pick a gravesite that is within 9" of your general, and then pick a friendly Summonable unit that has been destroyed. Set up that unit wholly within 9" of that gravesite and more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Lord of Bones': {
    effects: [
      {
        name: `Lord of Bones`,
        desc: `If this model uses this ability, pick a friendly DEATHRATTLE unit within 18" of it. Until your next hero phase, add 1 to the Attacks characteristic of that unit's melee weapons. You cannot pick the same unit to benefit from this command ability more than once per hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Supreme Lord of Death': {
    effects: [
      {
        name: `Supreme Lord of Death`,
        desc: `If Nagash uses this ability, then until your next hero phase you can reroll hit and save rolls of 1 for all friendly DEATH units. In addition, do not take battleshock tests for DEATH units affected by this ability.`,
        when: [HERO_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'First of the Mortarchs': {
    effects: [
      {
        name: `First of the Mortarchs`,
        desc: `If Arkhan the Black uses this ability, then until the end of the hero phase all friendly DEATH WIZARDS within 18" of him can increase the range of their spells by 6". You cannot use this command ability multiple times.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Vigour of Undeath': {
    effects: [
      {
        name: `Vigour of Undeath`,
        desc: `If Mannfred uses this ability, then until your next hero phase you can reroll hit and wound rolls of 1 for friendly DEATH units that are within the range shown on the damage table.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Twilights Allure': {
    effects: [
      {
        name: `Twilights Allure`,
        desc: `If Neferata uses this ability, then until your next hero phase subtract 1 from hit rolls for enemy units that are within the range shown on the damage table.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fist of Nagash': {
    effects: [
      {
        name: `Fist of Nagash`,
        desc: `If Prince Vhordrai uses this ability, pick a friendly DEATH HERO within 14" of him (you cannot choose Prince Vhordrai). That hero can immediately either be chosen to pile in and attack as if it were the combat phase, or if it is a WIZARD, attempt to cast a spell in addition to any others they can attempt to cast this phase. The same unit cannot be picked to benefit from this command ability more than once per hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dread Knight': {
    effects: [
      {
        name: `Dread Knight`,
        desc: `If this model uses this ability, pick a friendly DEATH unit within 15" of it. Until your next hero phase, you can reroll failed hit rolls for that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Blood Feast': {
    effects: [
      {
        name: `Blood Feast`,
        desc: `If this model uses this ability, pick a friendly DEATH unit within 15" of it. Models in that unit make one extra attack with each of their melee weapons until your next hero phase. You cannot pick the same unit to benefit from this command ability more than once per hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Tactical Insight': {
    effects: [
      {
        name: `Tactical Insight`,
        desc: `If this model uses this ability, pick a friendly DEATH unit within 12" of it. You can reroll hit, wound and save rolls of 1 for that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')
