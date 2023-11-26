import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, START_OF_COMBAT_PHASE, START_OF_MOVEMENT_PHASE } from 'types/phases'

const CommandAbilities = {
  // IRONBARK Flavor
  'Stand Firm': {
    effects: [
      {
        name: `Stand Firm`,
        desc: `You can use this command ability at the start of the enemy combat phase. The unit that receives the command must be a friendly IRONBARK unit that is within 3" of an enemy unit that made a charge move in the same turn. Pick 1 enemy unit within 3" of that friendly IRONBARK unit and roll a dice. On a 2+, that enemy unit suffers D3 mortal wounds. You can use this command ability more than once in the same phase, but if you do SO, you cannot pick the same enemy unit more than once in the same phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // ARCH-REVENANT Commands
  'Call to Battle': {
    effects: [
      {
        name: `Call to Battle`,
        desc: `You can use this command ability at the start of the combat phase. Pick 1 friendly SYLVANETH, add 1 to the Attacks characteristic of melee weapons used by that unit until the end of the phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  // Belthanos
  'The Unending Hunt': {
    effects: [
      {
        name: `The Unending Hunt`,
        desc: `You can use this command ability at the start of your movement phase. The unit that receives the command must be a friendly SYLVANETH unit. That unit can retreat and still charge later in the turn.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')
