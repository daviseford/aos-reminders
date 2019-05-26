import { TCommandTraits } from 'types/army'
import {
  COMBAT_PHASE,
  DURING_GAME,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  SHOOTING_PHASE,
  CHARGE_PHASE,
  BATTLESHOCK_PHASE,
} from 'types/phases'

const CommandTraits: TCommandTraits = [
  {
    name: 'Realm Walker',
    effects: [
      {
        name: 'Realm Walker',
        desc: 'If your general uses the Navigate Realmroots ability, add 2 to the dice result.',
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: 'Gnarled Warrior',
    effects: [
      {
        name: 'Gnarled Warrior',
        desc: 'When you make save rolls for your general, ignore the enemy’s Rend unless it is -2 or better.',
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: 'Gift of Ghyran',
    effects: [
      {
        name: 'Gift of Ghyran',
        desc:
          'Your general heals 1 wound at the start of each of your hero phases, or D3 wounds if they are within 3" of a Sylvaneth Wyldwood.',
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: 'Lord of Spites',
    effects: [
      {
        name: 'Lord of Spites',
        desc: 'You can re-roll the first failed hit roll made for your general in each phase.',
        when: [COMBAT_PHASE],
      },
      {
        name: 'Lord of Spites',
        desc: 'You can re-roll the first failed hit roll made for your general in each phase.',
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: 'Warsinger',
    effects: [
      {
        name: 'Warsinger',
        desc:
          'You can add 1 to any charge rolls made for friendly SYLVANETH units that are within 10" of your general.',
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: 'Wisdom of the Ancients',
    effects: [
      {
        name: 'Wisdom of the Ancients',
        desc:
          'All friendly SYLVANETH units within 10" of your general in the battleshock phase add 1 to their Bravery.',
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: 'Ancient Nobility (Oakenbrow)',
    effects: [
      {
        name: 'Ancient Nobility (Oakenbrow)',
        desc:
          'All friendly SYLVANETH units within 15" of your general in the battleshock phase add 1 to their Bravery.',
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
]

export default CommandTraits
