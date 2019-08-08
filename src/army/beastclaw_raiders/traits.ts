import { TTraits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Massive Bulk`,
    effects: [
      {
        name: `Massive Bulk`,
        desc: `Add 1 to your general's Wounds characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Everwinter's Master`,
    effects: [
      {
        name: `Everwinter's Master`,
        desc: `You can choose to re-roll the dice when rolling on the Everwinter's Blessing table whilst your general is alive.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Avalanche Voice`,
    effects: [
      {
        name: `Avalanche Voice`,
        desc: `You can add 8" to the range of any command abilities your general uses.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Famed Hunter`,
    effects: [
      {
        name: `Famed Hunter`,
        desc: `You can re-roll all hit rolls of 1 made for your general's melee and missile weapons. This does not apply to any attacks made for your general's mount (if he has one).`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Beast Eater`,
    effects: [
      {
        name: `Beast Eater`,
        desc: `You can re-roll wound rolls for your general when making attacks against MONSTERS.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Fearsome Leader`,
    effects: [
      {
        name: `Fearsome Leader`,
        desc: `Enemy units that are within 3" of your general must subtract 1 from their Bravery.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
]

export default CommandTraits
