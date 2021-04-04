import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  TURN_ONE_START_OF_ROUND,
} from 'types/phases'

const Flavors = {
  'The First Circle': {
    effects: [
      {
        name: `The First Circle`,
        desc: `After determining who has the first turn, you can remove any friendly First Circle units from the battlefield and set them up again (following any battleplan set up restrictions).`,
        when: [TURN_ONE_START_OF_ROUND],
      },
    ],
  },
  'The Second Circle': {
    effects: [
      {
        name: `The Second Circle`,
        desc: `Subtract 1 from the bravery characteristic of enemy units while they are within 6" of any friendly Second Circle units.`,
        when: [DURING_GAME],
      },
      {
        name: `The Second Circle`,
        desc: `If an enemy unit fails a battleshock test within 6" of any friendly Second Circle units, add D3 to the number of models that flee.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'The Third Circle': {
    effects: [
      {
        name: `The Third Circle`,
        desc: `Subtract 1 from hit rolls by missile weapons targetting Third Circle units.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'The Fourth Circle': {
    effects: [
      {
        name: `The Fourth Circle`,
        desc: `You can pick 1 terrain feature within 3" of any friendly Fourth Circle units. Each enemy unit within 3" of that terrain feature suffers D3 mortal wounds (roll separately for each unit).`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Fifth Circle': {
    effects: [
      {
        name: `The Fifth Circle`,
        desc: `You can reroll hit and wound rolls for attacks made by Fifth Circle units against heros or monsters.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'The Sixth Circle': {
    effects: [
      {
        name: `The Sixth Circle`,
        desc: `Add 1 to the damage inflicted by attacks made with Sixth Circle melee weapons from units that charged in the same turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'The Seventh Circle': {
    effects: [
      {
        name: `The Seventh Circle`,
        desc: `If any attacks made by a friendly Seventh Circle unit in this phase destroyed any enemy units, heal up to D3 wounds allocated to that Seventh Circle unit.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'The Eighth Circle': {
    effects: [
      {
        name: `The Eighth Circle`,
        desc: `Eighth Circle units can fly.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
}

export default Flavors
