import { tagAs } from 'factions/metatagger'
import { START_OF_COMBAT_PHASE } from 'types/phases'

const CommandAbilities = {
  'Rejoice in Exalted Slaughter': {
    effects: [
      {
        name: `Rejoice in Exalted Slaughter`,
        desc: `You can use this command ability at the start of the combat phase. The command must be issued by this model and received by a friendly KHORNE DAEMON unit. In that combat phase, the unit that receives the command is eligible to fight if it is within 6" of an enemy unit instead of 3", and models from that unit can move an extra 3" when they pile in.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  "The Butcher's Due": {
    effects: [
      {
        name: `The Butcher's Due`,
        desc: `You can use this command ability at the start of the combat phase. The command must be issued by this model and received by a friendly KHORNE unit. Add 1 to wound rolls for attacks made by that unit until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  "'Bring Me Their Skull!'": {
    effects: [
      {
        name: `'Bring Me Their Skull!'`,
        desc: `You can use this command ability at the start of the combat phase. This unit must issue the command and the unit that receives the command must be a friendly GORECHOSEN unit. The strike-first effect applies to that GORECHOSEN unit until the end of the phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')
