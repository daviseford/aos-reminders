import { TTraits } from 'types/army'
import { TURN_ONE_START_OF_ROUND, BATTLESHOCK_PHASE, DURING_GAME, COMBAT_PHASE } from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Strategic Genius (Order)`,
    effects: [
      {
        name: `Strategic Genius (Order)`,
        desc: `At the start of the first battle round, you receive 1 extra command point.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
    ],
  },
  {
    name: `Inspiring (Order)`,
    effects: [
      {
        name: `Inspiring (Order)`,
        desc: `Friendly ORDER units do not have to take battleshock tests while they are within 6" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Dauntless (Order)`,
    effects: [
      {
        name: `Dauntless (Order)`,
        desc: `You can re-roll charge rolls for this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Tenacious (Order)`,
    effects: [
      {
        name: `Tenacious (Order)`,
        desc: `Add 1 to this general's Wounds characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Legendary Fighter (Order)`,
    effects: [
      {
        name: `Legendary Fighter (Order)`,
        desc: `When this general is selected to fight, add 1 to the Attacks characteristic of one of their melee weapons for that fight.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Master of Defence (Order)`,
    effects: [
      {
        name: `Master of Defence (Order)`,
        desc: `Each time you allocate a wound or mortal wound to this general, roll a dice. On a 6+ the wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
]

export default CommandTraits
