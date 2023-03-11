import { tagAs } from 'factions/metatagger'
import {
  END_OF_MOVEMENT_PHASE,
  MOVEMENT_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

const CommandAbilities = {
  'Combat Landing': {
    effects: [
      {
        name: `Combat Landing`,
        desc: `You can use this command ability at the end of your movement phase. The unit that receives the command must be a friendly TRANSPORT VESSEL. Any units embarked in that TRANSPORT VESSEL can immediately disembark. A unit that disembarks in this way cannot move in the same turn.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Fly High': {
    effects: [
      {
        name: `Fly High`,
        desc: `You can use this command ability at the end of your movement phase. The unit that receives the command must be a friendly SKYVESSEL more than 3" from all enemy units. Remove that unit from the battlefield and set it up anywhere on the battlefield more than 9" from all enemy units and more than 1" from all terrain features.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  Disengage: {
    effects: [
      {
        name: `Disengage`,
        desc: `You can use this command ability in your movement phase. The unit that receives the command must be a friendly SKYVESSEL that has not yet moved in that phase. That unit and any units embarked in it can retreat and still shoot later in the turn.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
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
