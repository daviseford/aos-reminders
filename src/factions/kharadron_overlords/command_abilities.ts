import { tagAs } from 'factions/metatagger'
import {
  END_OF_MOVEMENT_PHASE,
  MOVEMENT_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'

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
  'Master of the Skies': {
    effects: [
      {
        name: `Master of the Skies`,
        desc: `You can use this command ability at the start of your movement phase. The unit that receives the command must be a friendly SKYVESSEL more than 3" from all enemy units. That unit can reroll run rolls this phase. In addition, that unit can run and still shoot and/or charge later in the turn.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Bring Every Gun to Bear': {
    effects: [
      {
        name: `Bring Every Gun to Bear`,
        desc: `You can use this command ability at the start of your shooting phase. The unit that receieves the command must be a friendly SKYVESSEL that is more than 3" from all enemy units, that remained stationary in the preceding movement phase and that did not receive the Fly High command in the preceding movement phase. Add 1 to the Attacks characteristic of that unit's missile weapons until the end of the phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  'Command the Fleet': {
    effects: [
      {
        name: `Command the Fleet`,
        desc: `You can use this command ability at the start of your movement phase. Up to 3 friendly SKYVESSELS that are more than 3" from all enemy units can receive the command. In that phase you can reroll run rolls for the units that receive the command. In addition, the units that recieve the command can run and still shoot and/or charge later in the turn.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')
