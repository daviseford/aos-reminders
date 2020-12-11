import { tagAs } from 'factions/metatagger'
import {
  HERO_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
const CommandAbilities = {
  'By Grungni, I Have My Eye On You!': {
    effects: [
      {
        name: `By Grungni, I Have My Eye On You!`,
        desc: `You can use this command ability in your hero phase before a friendly ENDRINRIGGERS unit wholly within 18" of a friendly model with this command ability uses its Endrincraft ability. If you do so, you can reroll any of the dice that determine how many wounds are healed by that ENDRINRIGGERS unit in that phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Master of the Skies': {
    effects: [
      {
        name: `Master of the Skies`,
        desc: `You can use this command ability at the start of your shooting phase. If you do so, pick 1 friendly SKYVESSEL that has a model with this command ability in its garrison. That SKYVESSEL can shoot in that phase even if it ran earlier in the same turn.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  'On My Mark, Fire!': {
    effects: [
      {
        name: `On My Mark, Fire!`,
        desc: `You can use this command ability at the start of your shooting phase. If you do so, pick 1 friendly SKYVESSEL that has a model with this command ability in its garrison. You can reroll hit rolls of 1 for attacks made by that SKYVESSEL in that phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  'Repel Boarders!': {
    effects: [
      {
        name: `Repel Boarders!`,
        desc: `You can use this command ability at the start of your combat phase. If you do so, pick 1 friendly SKYVESSEL that has a model with this command ability in its garrison. Add 1 to hit rolls for attacks made by that SKYVESSEL and any models in its garrison in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Up And At Them!': {
    effects: [
      {
        name: `Up And At Them!`,
        desc: `You can use this command ability at the start of your charge phase. If you do so, pick 1 friendly SKYFARERS unit that is wholly within 12" of a friendly model with this command ability. You can reroll charge rolls for that unit in that phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  'First Rule of Grungsson': {
    effects: [
      {
        name: `First Rule of Grungsson`,
        desc: `You can use this command ability at the start of your charge phase if a friendly model with this command ability is on the battlefield. If you do so, pick 1 friendly model with this command ability. You can reroll charge rolls for friendly BARAK-NAR units that are wholly within 24" of that model until the end of that phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandAbilities, 'command_ability')
