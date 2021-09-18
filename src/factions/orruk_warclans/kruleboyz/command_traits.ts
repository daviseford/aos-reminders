import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, TURN_ONE_START_OF_ROUND, WOUND_ALLOCATION_PHASE } from 'types/phases'

const KruleboyzCommandTraits = {
  'Slippery Skumbag': {
    effects: [
      {
        name: `Slippery Skumbag`,
        desc: `This general can retreat and charge in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Supa Sneaky': {
    effects: [
      {
        name: `Supa Sneaky`,
        desc: `If this general is on the battlefield at the start of the first battle round, before determining who has the first turn, you can pick 1 friendly KRULEBOYZ unit and set it up again anywhere on the battlefield that is more than 9" from all enemy units.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
    ],
  },

  Egomaniak: {
    effects: [
      {
        name: `Egomaniak`,
        desc: `If this general is within 3" of another friendly unit, roll a dice before you allocate a wound or mortal wound to this general or instead of making a ward roll for this general. On a 4+, pick 1 other friendly unit within 3" of this general. That wound is allocated to that unit instead and cannot be negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
}

export default tagAs(KruleboyzCommandTraits, 'command_trait')
