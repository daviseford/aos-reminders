import { tagAs } from 'factions/metatagger'
import {
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_SHOOTING_PHASE,
  START_OF_SETUP,
  WARDS_PHASE,
} from 'types/phases'

const Artifacts = {
  'Masterwrought Armour': {
    effects: [
      {
        name: `Masterwrought Armour`,
        desc: `The bearer has a ward of 5+`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Celestium Burst-grenade': {
    effects: [
      {
        name: `Celestium Burst-grenade`,
        desc: `Once per battle, you can pick 1 enemy unit within 12". On a D6 2+, ward rolls cannot be made for models in that unit in that phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  "Blazebeard and Sons 'Drakk-hobbler' Mag-bolas": {
    effects: [
      {
        name: `Blazebeard and Sons 'Drakk-hobbler' Mag-bolas`,
        desc: `You can pick 1 enemy MONSTER within 12". On a D6 2+, that unit is grappled until the end of your opponent's next turn. While grappled, roll 1 fewer dice when making a charge, to a minimum of 1 dice.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  'Spell in a Bottle': {
    effects: [
      {
        name: `Spell in a Bottle`,
        desc: `Pick 1 endless spell that does not belong to a faction. You can include that endless spell in your army without spending any points to do so.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Spell in a Bottle`,
        desc: `Once per battle, bearer can automatically cast the spell that summons the endless spell (do not make a casting roll), and it cannot be unbound. Bearer cannot control the endless spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Phosphorite Bomblets': {
    effects: [
      {
        name: `Phosphorite Bomblets`,
        desc: `Once per battle, you can pick 1 enemy unit within 6". Ona D6 2+, the unit suffers 1 MW and you may roll again. Repeat until you roll a 1.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Voidstone Orb': {
    effects: [
      {
        name: `Voidstone Orb`,
        desc: `Once per battle, when attempting to unbind a spell, the bearer can unbind it automatically (do not make an unbinding roll).`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs({ ...Artifacts }, 'artifact')
