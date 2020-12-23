import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  MOVEMENT_PHASE,
  START_OF_CHARGE_PHASE,
} from 'types/phases'

// Store Command Traits here. You can add them to units, abilties, flavors, and subfactions later.
const CommandTraits = {
  'Swift Strikes': {
    effects: [
      {
        name: `Swift Strikes`,
        desc: `Each time you make a hit roll of 6+ in the combat phase for this general, you can make one additional hit roll for the same weapon against the same target.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Soul-crushing Contempt': {
    effects: [
      {
        name: `Soul-crushing Contempt`,
        desc: `If this general slays any models in the combat phase, subtract 1 from the Bravery characteristic of the slain model's unit until the end of the turn.`,
        when: [COMBAT_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  'Aristocracy of Blood': {
    effects: [
      {
        name: `Aristocracy of Blood`,
        desc: `You can reroll failed charge rolls for friendly SOULBLIGHT units that are within 9" of this general at the start of the charge phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  'Aura of Dark Majesty': {
    effects: [
      {
        name: `Aura of Dark Majesty`,
        desc: `Subtract 1 from the hit rolls of attacks that target this general in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Walking Death': {
    effects: [
      {
        name: `Walking Death`,
        desc: `If the hit roll for an attack made with one of this general's melee weapons is 6+, do not roll to wound. Instead, the target suffers a number of mortal wounds equal to the Damage characteristic of that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Sanguine Blur': {
    effects: [
      {
        name: `Sanguine Blur`,
        desc: `Add 2" to this general's Move characteristic. In addition, you can reroll failed charge rolls for this general.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandTraits, 'command_trait')
