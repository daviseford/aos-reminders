import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const OrderBattalions = {
  'Dragonlord Host': {
    effects: [
      {
        name: `Martial Pride`,
        desc: `Once per battle, in any of your hero phases, the Dragonlord Hosts's Dragonlord, and each other unit from his battalion that is within 8" of him, can make a move as if it were the movement phase (models cannot run as part of this move). If, after a unit moves, there are any enemy units within 12" of it, roll a D6; on a 4+ that unit can then attempt to charge as if it were the charge phase. On a 4+ the Dragonlord can instead choose to attack with its Dragonfire as if it were the shooting phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(OrderBattalions, 'battalion')
