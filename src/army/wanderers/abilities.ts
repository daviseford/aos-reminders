import { BATTLESHOCK_PHASE, START_OF_MOVEMENT_PHASE, DURING_GAME } from 'types/phases'
import { TAbilities } from 'types/army'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Defiant Hunters`,
    desc: `You can re-roll battleshock tests for friendly WANDERERS units.`,
    when: [BATTLESHOCK_PHASE],
  },
  {
    name: `Realm Wanderers`,
    desc: `At the start of your movement phase, 1 friendly WANDERERS unit wholly within 6" of the edge of the battlefield can leave to travel along a hidden pathway instead of making a normal move. If they do so, remove that unit from the battlefield. Then set that unit up on the battlefield, anywhere wholly within 6" of the edge of the battlefield by which it left, and more than 9" from any enemy units.`,
    when: [START_OF_MOVEMENT_PHASE],
  },
  {
    name: `Navigate Realmroots`,
    desc: `Friendly WANDERERS units can retreat and still shoot later in the same turn.`,
    when: [DURING_GAME],
  },
]

export default Abilities
