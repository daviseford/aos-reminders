import { TAbilities } from 'types/army'
import { DURING_GAME, START_OF_CHARGE_PHASE, START_OF_GAME } from 'types/phases'

// Import all Nurgle abilities as they are cross compatible with Tamurkan's Horde.
import NurgleAbilities from 'army/nurgle/abilities'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Tamurkhan's Horde Army`,
    desc: `After you have chosen the Maggotkin of Nurgle allegiance for your army, you can give it the Tamurkhan's Horde keyword. All Maggotkin of Nurgle units in your army gain that keyword (with the exception of named characters that do not already have the Tamurkhan's Horde keyword on their warscroll). All units with that keyword benefit from the allegiance abilities listed below, in addition to the allegiance abilities in Battletome: Maggotkin of Nurgle.`,
    when: [START_OF_GAME],
  },
  {
    name: `Winds of Corruption`,
    desc: `Subtract 1 from run and charge rolls for enemy units.`,
    when: [DURING_GAME],
  },
  {
    name: `Shout of Command`,
    desc: `Pick 1 friendly Tamurkhan's Horde Hero. You can re-roll charge rolls for friendly Tamurkhan's Horde units while they are wholly within 14" of that Hero in that phase.`,
    when: [START_OF_CHARGE_PHASE],
    command_ability: true,
  },
  {
    name: `Command Trait`,
    desc: `A Tamurkhan's Horde general must have the Unrelenting Conqueror command trait instead of one from the Maggotkin of Nurgle allegiance abilities.`,
    when: [START_OF_GAME],
  },
  {
    name: `Artifact of Power`,
    desc: `The first Tamurkhan's Horde Hero to receive an artifact of power must be given the Daemon Flask.`,
    when: [START_OF_GAME],
  },
  ...NurgleAbilities,
]

export default Abilities
