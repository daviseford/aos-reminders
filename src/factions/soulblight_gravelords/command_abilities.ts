import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

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
