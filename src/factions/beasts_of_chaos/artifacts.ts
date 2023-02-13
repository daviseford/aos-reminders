import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  START_OF_TURN,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Artifacts = {
  'Slitherwrack Helm': {
    effects: [
      {
        name: `Slitherwrack Helm`,
        desc: `After the bearer makes a charge move, pick 1 enemy unit within 1" of them and roll a dice. On a 2+, the strike-last effect applies to that unit until the end of that turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Brayblast Trumpet': {
    effects: [
      {
        name: `Brayblast Trumpet (Brayherds)`,
        desc: `Once per battle, at the end of your movement phase, you can say that the bearer will sound the brayblast trumpet. If you do so, roll a dice. On a 2+, you can summon a unit to the battlefield from the list below. Set up that unit wholly within 9" of the battlefield edge and more than 9" from all enemy units. On a 1, you can still summon 1 of the units listed, but you must do so at the end of your next movement phase instead.
        1 unit of 10 Gors
        1 unit of 10 Ungors
        1 unit of 10 Ungor Raiders`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'The Knowing Eye': {
    effects: [
      {
        name: `The Knowing Eye (Brayherds)`,
        desc: `If you take the first turn in the current battle round, after the players have received their starting command points, you receive 1 command point that can only be spent during that turn to allow the bearer to issue a command. If you take the second turn in the current battle round, after the players have received their starting command points, the bearer can make a normal move of up to 6".`,
        when: [START_OF_TURN],
      },
    ],
  },
  'Axe of Morghur': {
    effects: [
      {
        name: `Axe of Morghur`,
        desc: `Pick 1 of the bearer's melee weapons. Ward rolls cannot be made for wounds caused by attacks made with that weapon.`,
        when: [COMBAT_PHASE, WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Bleating Gnarlstaff': {
    effects: [
      {
        name: `Bleating Gnarlstaff (Brayherds)`,
        desc: `At the end of your movement phase, you can pick 1 objective or terrain feature within 6" of the bearer and roll a dice. On a 2+, each unit within 6" of that objective or terrain feature suffers D3 mortal wounds. This ability has no effect on BEASTS OF CHAOS units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
}

export default tagAs(Artifacts, 'artifact')
