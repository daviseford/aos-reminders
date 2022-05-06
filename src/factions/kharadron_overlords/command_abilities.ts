import { tagAs } from 'factions/metatagger'
import { START_OF_CHARGE_PHASE, START_OF_HERO_PHASE, START_OF_SHOOTING_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const CommandAbilities = {
  'By Grungni, I Have My Eye On You!': {
    effects: [
      {
        name: `By Grungni, I Have My Eye On You!`,
        desc: `You can use this command ability in your hero phase before a friendly ENDRINRIGGERS unit wholly within 18" of a friendly model with this command ability uses its Endrincraft ability. If you do so, you can reroll any of the dice that determine how many wounds are healed by that ENDRINRIGGERS unit in that phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Master of the Skies': {
    effects: [
      {
        name: `Master of the Skies`,
        desc: `You can use this command ability at the start of your shooting phase. The command must be issued by this unit and must be received by a friendly SKYVESSEL. That Skyvessel can shoot in that phase even if it ran earlier in the turn.`,
        when: [START_OF_SHOOTING_PHASE],
        rule_sources: [rule_sources.WHITE_DWARF_MAY_2022],
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

export default tagAs(CommandAbilities, 'command_ability')
