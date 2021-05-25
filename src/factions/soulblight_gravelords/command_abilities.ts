import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, HERO_PHASE } from 'types/phases'

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
const CommandAbilities = {
  'Supreme Lord of the Undead': {
    effects: [
      {
        name: `Supreme Lord of the Undead`,
        desc: `You can use this command ability in your hero phase if this model is on the battlefield. If you do so, until your next hero phase, you can re-roll hit rolls of 1 for attacks made by friendly DEATH units, you can re-roll save rolls of 1 for attacks that target friendly DEATH units, and do not take battleshock tests for friendly DEATH units.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Vigour of Undeath': {
    effects: [
      {
        name: `Vigour of Undeath`,
        desc: `You can use this command ability once per turn in your hero phase. If you do so, add 1 to hit and wound rolls for friendly SOULBLIGHT GRAVELORDS units wholly within 12" of this model until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Twilight's Allure": {
    effects: [
      {
        name: `Twilight's Allure`,
        desc: `You can use this command ability once per turn in your hero phase. If you do so, subtract 1 from hit rolls for attacks made with melee weapons that target friendly SOULBLIGHT GRAVELORDS units wholly within 12" of this model until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fist of Nagash': {
    effects: [
      {
        name: `Fist of Nagash`,
        desc: `You can use this command ability once per turn in your hero phase. If you do so, pick 1 other friendly SOULBLIGHT GRAVELORDS HERO that is wholly within 12" of this model and within 3" of any enemy units. That HERO can fight.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'A Queen Amongst Monsters': {
    effects: [
      {
        name: `A Queen Amongst Monsters`,
        desc: `You can use this command ability once per turn in your hero phase, If you do so, pick 1 enemy unit on the battlefield. Until your next hero phase, add 1 to hit rolls for attacks made with melee weapons by friendly SOULBLIGHT GRAVELORDS MONSTERS that target that enemy unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `A Queen Amongst Monsters`,
        desc: `If active, until your next hero phase, add 1 to hit rolls for attacks made with melee weapons by friendly SOULBLIGHT GRAVELORDS MONSTERS that target that enemy unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  '': {
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  // '': {
  //   effects: [
  //     {
  //       name: ``,
  //       desc: ``,
  //       when: [END_OF_SETUP],
  //     },
  //   ],
  // },
}

// Always export using tagAs
export default tagAs(CommandAbilities, 'command_ability')
