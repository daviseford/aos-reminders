import { tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, SHOOTING_PHASE, TURN_THREE_END_OF_CHARGE_PHASE } from 'types/phases'

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
const CommandAbilities = {
  'Command Ability 1': {
    effects: [
      {
        name: `Command Ability 1`,
        desc: `You can use this command ability when an enemy unit exists. Kill it instantly.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Command Ability 2': {
    effects: [
      {
        name: `Command Ability 2`,
        desc: `You can use this command ability when an enemy unit exists. Kill it instantly.`,
        when: [TURN_THREE_END_OF_CHARGE_PHASE],
      },
    ],
  },
  'A Third Command Ability': {
    effects: [
      {
        name: `A Third Command Ability`,
        desc: `You can use this command ability when an enemy unit exists. Kill it instantly.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandAbilities, 'command_ability')
