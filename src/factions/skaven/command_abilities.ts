import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const CommandAbilities = {
  'Gnash-gnaw on their Bones!': {
    effects: [
      {
        name: `Gnash-gnaw on their Bones!`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly CLANS VERMINUS unit wholly within 13" of a friendly model with this command ability. Add 1 to the Attacks characteristic of melee weapons used by that unit in that phase. You cannot pick the same unit to benefit from this ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Power Behind the Throne': {
    effects: [
      {
        name: `Power Behind the Throne`,
        desc: `You can use this command ability at the start of your hero phase. If you do so, until your next hero phase, one friendly SKAVEN HERO other than this model can use the At the Double command ability without a command point being spent; another friendly SKAVEN HERO other than this model can use the Forward to Victory command ability without a command point being spent; and a third friendly SKAVEN HERO other than this model can use the Inspiring Presence command ability without a command point being spent.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'The Rat King': {
    effects: [
      {
        name: `The Rat King`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, in that phase you can reroll wound rolls of 1 for attacks made by friendly SKAVENTIDE units while they are wholly within 13" of a friendly model with this command ability.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Forth-forth, Children of the Horned Rat!': {
    effects: [
      {
        name: `Forth-forth, Children of the Horned Rat!`,
        desc: `You can use this command ability at the start of the battleshock phase. If you do so, pick 1 friendly model with this command ability. Do not take battleshock tests for friendly SKAVEN units while they are wholly within 26" of that model in that phase.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  'Tyrant of Battle': {
    effects: [
      {
        name: `Tyrant of Battle`,
        desc: `You can use this command ability in the combat phase. If you do so, pick 1 friendly model with this command ability. In that phase, you can reroll hit and wound rolls of 1 for friendly CLANS VERMINUS units while they are wholly within 13" of that model.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Lord of Pestilence': {
    effects: [
      {
        name: `Lord of Pestilence`,
        desc: `You can use this command ability in the combat phase. If you do so, pick 1 friendly model with this command ability. In that phase, you can reroll hit rolls for friendly CLANS PESTILENS units while they are wholly within 13" of that model.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Lord of Assassins': {
    effects: [
      {
        name: `Lord of Assassins`,
        desc: `You can use this command ability in your shooting phase or any combat phase. If you do so, pick 1 friendly model with this command ability. In that phase, you can reroll wound rolls for friendly CLANS ESHIN units while they are wholly within 13" of that model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')
