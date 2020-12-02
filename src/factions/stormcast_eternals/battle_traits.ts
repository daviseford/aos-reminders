import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  SAVES_PHASE,
} from 'types/phases'

const BattleTraits = {
  'Legends of the Living Tempest': {
    effects: [
      {
        name: `Scions of the Storm`,
        desc: `Set up 1 unit in the Celestial Realm for every unit you set up on the battlefield. At the end of your movement phase you can set up one or more reserve units more than 9" from the enemy. Any units not set up before the 4th Battleround are slain.`,
        when: [DURING_SETUP, END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Shock and Awe`,
        desc: `Subtract 1 from hit rolls for attacks that target any unit set up this turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Celestial Sentinels': {
    effects: [
      {
        name: `Shield of Civilisation`,
        desc: `Add 1 to the bravery characteristic of friendly Stormcast Eternal units wholly within 12" of any friendly Liberators units.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
      },
      {
        name: `Shield of Civilisation`,
        desc: `You can pick any friendly Liberators units that did not move and were not set up this phase. Selected units can add 1 to hit and save rolls until your next movement phase.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Shield of Civilisation`,
        desc: `If active, you can add 1 to hit rolls for affected Liberators units.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Shield of Civilisation`,
        desc: `If active, you can add 1 to save rolls for affected Liberators units.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Mortal Auxiliaries`,
        desc: `Add 1 to the bravery characteristic of Cities of Sigmar units wholly within 12" of a friendly Liberators unit.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
      },
      {
        name: `Mortal Auxiliaries`,
        desc: `Cities of Sigmar units can be treated as Stormcast Eternals when benefiting from a command ability.`,
        when: [DURING_GAME],
      },
    ],
  },
}

export default BattleTraits
