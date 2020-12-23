import {
  CHARGE_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
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
        desc: `Add 2 to this model's Wounds characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Ebullient Buoyancy Aid (Great Endrinwork)': {
    effects: [
      {
        name: `Ebullient Buoyancy Aid (Great Endrinwork)`,
        desc: `This model can fly high and/or disengage even while it has a garrison of 16 or more models.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Prudency Chutes (Great Endrinwork)': {
    effects: [
      {
        name: `Prudency Chutes (Great Endrinwork)`,
        desc: `If this model is destroyed, you do not have to roll to see if models in its garrison are slain (they all survive).`,
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
  'Iggrind-Kaz Surge-injection Endrin Mk. IV (Great Endrinwork)': {
    effects: [
      {
        name: `Iggrind-Kaz Surge-injection Endrin Mk. IV (Great Endrinwork)`,
        desc: `When this model makes a normal move, you can add D3" to that move. If you wish, you can add 2D3" to that move instead of D3", but if you do so and you roll a double, then this model suffers 1 mortal wound after the move is made.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  "Zonbarcorp 'Debtsettler' Spar Torpedo (Great Endrinwork)": {
    effects: [
      {
        name: `Zonbarcorp 'Debtsettler' Spar Torpedo (Great Endrinwork)`,
        desc: `Once per battle, after this model makes its first charge move, you can pick 1 enemy unit within 1" of this model and roll a D6. On a 2+, that enemy unit suffers D6 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  "Coalbeard's Collapsible Compartments (Great Endrinwork)": {
    effects: [
      {
        name: `Coalbeard's Collapsible Compartments (Great Endrinwork)`,
        desc: `This model can use the Flying Transport ability from the Arkanaut Ironclad warscroll. If it does so, the maximum number of models that can garrison it is 5 instead of 25, and it can always fly high and/or disengage no matter how many models are in its garrison.`,
        when: [DURING_GAME],
      },
    ],
  },
}

export const BreathOfMorgrimEffect = {
  'Breath of Morgrim': {
    effects: [
      {
        name: `Breath of Morgrim`,
        desc: `In your shooting phase, you can pick 1 enemy unit and roll 1 dice for each model from that unit within 6" of the bearer. For each 6, that unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
}
