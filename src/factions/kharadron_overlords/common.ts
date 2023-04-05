import {
  CHARGE_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

/**
 * These are used as both artifacts and mount_traits
 */
export const GreatEndrinworks = {
  'The Last Word (Great Endrinwork)': {
    effects: [
      {
        name: `The Last Word (Great Endrinwork)`,
        desc: `At the end of the enemy charge phase you can pick 1 enemy unit that finished a charge move in that phase within 3" of this model. This model can shoot at that unit with its Great Sky Cannon, Great Skyhook or Great Volley Cannon.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  "Hegsson Solutions 'Old Reliable' Hullplates (Great Endrinwork)": {
    effects: [
      {
        name: `Hegsson Solutions 'Old Reliable' Hullplates (Great Endrinwork)`,
        desc: `The first wound that would be allocated to this unit each phase is ignored.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Prudency Chutes (Great Endrinwork)': {
    effects: [
      {
        name: `Prudency Chutes (Great Endrinwork)`,
        desc: `If this model is destroyed, you do not have to roll to see if models embarked in it are slain. In addition, if this unit is destroyed, embarked units do not have to be set up more than 3" form all enemy units.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Magnificent Omniscope (Great Endrinwork)': {
    effects: [
      {
        name: `Magnificent Omniscope (Great Endrinwork)`,
        desc: `Add 2" to this model's Move characteristic.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  "Zonbarcorp 'Dealbreaker' Battle Ram (Great Endrinwork)": {
    effects: [
      {
        name: `Zonbarcorp 'Dealbreaker' Battle Ram (Great Endrinwork)`,
        desc: `After this model makes a charge move, you can pick 1 enemy unit within 1" of this model, and roll a number of dice equal to the charge roll for that charge move. For each 4+. that enemy unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Malefic Skymines (Great Endrinwork)': {
    effects: [
      {
        name: `Malefic Skymines (Great Endrinwork)`,
        desc: `Once per battle, at the start of the combat phase, you can pick 1 enemy unit that can fly and is within 6" of this model and roll a D6. On a 2-3, that enemy unit suffers D3 mortal wounds. On a 4+ that enemy unit suffers D6 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  "'Khazzar Farewell' Scuttling Fail-safe (Great Endrinwork)": {
    effects: [
      {
        name: `'Khazzar Farewell' Scuttling Fail-safe (Great Endrinwork)`,
        desc: `If this unit is destroyed, before it is removed from play and before any units embarked in it disembark, roll a dice for each unit within 3" of this unit. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Iggrind-Kaz Surge-injection Endrin Mk. IV (Great Endrinwork)': {
    effects: [
      {
        name: `Iggrind-Kaz Surge-injection Endrin Mk. IV (Great Endrinwork)`,
        desc: `When this model makes a normal move or retreats, you can add D3" to that move. If you wish, you can add 2D3" to that move instead of D3", but if you do so and you roll a double, then this model suffers 1 mortal wound after the move is made.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  "Zonbarcorp 'Debtsettler' Spar Torpedo (Great Endrinwork)": {
    effects: [
      {
        name: `Zonbarcorp 'Debtsettler' Spar Torpedo (Great Endrinwork)`,
        desc: `Once per battle, after this model makes its first charge move, you can pick 1 enemy unit within 1" of this model and roll a D6. On a 2+, that enemy unit suffers a number of mortal wounds equal to the roll.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  "Coalbeard's Collapsible Compartments (Great Endrinwork)": {
    effects: [
      {
        name: `Coalbeard's Collapsible Compartments (Great Endrinwork)`,
        desc: `This unit gains the TRANSPORT VESSEL keyword. Up to 6 friendly SKYFARER models can be embarked in it.`,
        when: [DURING_GAME],
      },
    ],
  },
}
