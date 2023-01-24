import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  MOVEMENT_PHASE,
  START_OF_HERO_PHASE,
  TURN_FIVE_START_OF_HERO_PHASE,
  TURN_FOUR_START_OF_HERO_PHASE,
  TURN_THREE_START_OF_HERO_PHASE,
  TURN_TWO_START_OF_HERO_PHASE,
} from 'types/phases'

const BattleTraits = {
  //allegiance abilities
  'Trampling Charge': {
    effects: [
      {
        name: `Trampling Charge`,
        desc: `After a friendly OGOR or RHINOX unit makes a charge move, you can pick 1 enemy unit within 1" of that unit and roll a number of dice equal to the unmodified charge roll for that charge move. Add 1 to each roll if the charging unit is an OGOR unit that has 3 or more models. Add 2 to each roll if it is a MONSTER. For each 6+, that enemy unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
    ],
  },

  'Grasp of the Everwinter': {
    effects: [
      {
        name: `Grasp of the Everwinter`,
        desc: `At the start of your hero phase, roll a dice for each enemy unit within 3" of any friendly BEASTCLAW RAIDERS units. If the roll is equal to or less than the number of the current battle round, that unit suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  'Might Makes Right': {
    effects: [
      {
        name: `Might Makes Right`,
        desc: `For the purposes of contesting objectives (core rules, 18.1.2), each friendly OGOR MAWTRIBES OGOR counts as 2 models, each friendly OGOR MAWTRIBES HERO that is not a MONSTER counts as 5 models, and each friendly OGOR MAWTRIBES MONSTER counts as 10 models.`,
        when: [DURING_GAME],
      },
    ],
  },

  'Ravenous Brutes': {
    effects: [
      {
        name: `Ravenous Brutes`,
        desc: `If an OGOR unit is more than 3" from any enemy units, it is hungry. If an OGOR unit is within 3" of any enemy units, it is eating. Add 2" to the Move characteristic of a unit that is hungry. Add 2 to the Bravery characteristic of a unit that is eating.`,
        when: [DURING_GAME],
      },
      {
        name: `Ravenous Brutes`,
        desc: `If an OGOR unit is more than 3" from any enemy units, it is hungry. Add 2" to the Move characteristic of a unit that is hungry.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Ravenous Brutes`,
        desc: `If an OGOR unit is within 3" of any enemy units, it is eating. Add 2 to the Bravery characteristic of a unit that is eating.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },

  'Gulping Bites': {
    effects: [
      {
        name: `Gulping Bites`,
        desc: `Roll a dice for each enemy unit within 3" of any friendly GUTBUSTERS OGOR units. On a 4+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },

  //Battle tactics
  'Battle Tactics': {
    effects: [
      {
        name: `Eat Your Fill`,
        desc: `You complete this tactic at the start of the combat phase if every friendly OGOR unit is eating.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Savour the Taste`,
        desc: `You cannot pick this battle tactic in the first battle round. You complete this tactic at the end of your turn if every friendly OGOR unit is hungry.`,
        when: [
          TURN_TWO_START_OF_HERO_PHASE,
          TURN_THREE_START_OF_HERO_PHASE,
          TURN_FOUR_START_OF_HERO_PHASE,
          TURN_FIVE_START_OF_HERO_PHASE,
        ],
      },
      {
        name: `Avalanche of Flesh`,
        desc: `You complete this tactic at the end of the turn if 10+ mortal wounds were caused by the trampling charge battle trait this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Winter Take Thee`,
        desc: `Pick 1 enemy HERO of enemy MONSTER. You complete this tactic if that enemy unit is destroyed by wounds caused by the Grasp of the Everwinter battle trait (pg 64) this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Let them Loose`,
        desc: `You complete this tactic at the end of your turn if you carried out 4 or more monstrous rampages this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Boil their Bones`,
        desc: `Pick 1 enemy HERO or enemy MONSTER. You complete this tactic if that enemy unit is destroyed within 6 of an empty Great Mawpot in your army.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
