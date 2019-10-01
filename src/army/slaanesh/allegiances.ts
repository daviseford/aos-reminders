import { TAllegiances } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_CHARGE_PHASE,
  SHOOTING_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Allegiances: TAllegiances = [
  {
    name: `Invaders (Host)`,
    effects: [
      {
        name: `Figureheads of the Dark Prince`,
        desc: `This army can have up to 3 generals instead of 1. Only 1 of the generals (your choice) can have a command trait but all 3 are considered to be a general for command ability purposes. An Invaders Host general cannot use a command trait or command ability while within 12" of another Invaders Host general. In addition each time 1 of your generals is slain for the first time, you receive 1 extra command point.`,
        when: [START_OF_GAME],
      },
      {
        name: `Escalating Havoc`,
        desc: `You receive D3 depravity points if any friendly Invaders Host units are wholly within enemy territory. If 3 or more friendly Invaders Host units are wholly within enemy territory at the start of your hero phase, you receive D6 depravity points instead.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Invaders Hedonite Host`,
        desc: `A Hedonite Host battalion in an Invaders Host army must contain 2-4 Epicurean Revellers battalions and 0-2 Seeker Cavalcade battalions instead of the standard quantities.`,
        when: [START_OF_GAME],
      },
    ],
  },
  {
    name: `Pretenders (Host)`,
    effects: [
      {
        name: `Heir to the Throne`,
        desc: `If the general of a Pretenders Host army is a hero, they have 2 different command traits instead of 1. If you randomly generate traits, roll again if the second result matches the first.`,
        when: [START_OF_GAME],
      },
      {
        name: `Heir to the Throne`,
        desc: `You can re-roll hit rolls of 1 for attacks made with melee and missle weapons by Pretenders Host units while they have 10 or more models.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Warlord Supreme`,
        desc: `You receive D3 depravity points if your general is within 3" of any enemy units. If your general is within 3" of 3 or more enemy units you receive D6 depravity points instead.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Pretenders Hedonite Host`,
        desc: `A Supreme Sybarites battalion in a Pretenders Host army must have only 1 Chaos Slaanesh hero instead of 3-6.`,
        when: [START_OF_GAME],
      },
    ],
  },
  {
    name: `Godseekers (Host)`,
    effects: [
      {
        name: `Thundering Cavalcade`,
        desc: `Add 1 charge rolls for units in a Godseekers Host army.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Maniacal Hunters`,
        desc: `You receive D3 depravity points if any friendly Godseekers Host units made a charge move in this phase. If 3 or more friendly Godseekers Host units made a charge move in this phase receive D6 depravity points instead.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Godseekers Hedonite Host`,
        desc: `A Hedonite Host in a Godseekers Host army must contain 0-2 Epicurean Revellers battalions and 2-4 Seeker Cavalcade battalions.`,
        when: [START_OF_GAME],
      },
    ],
  },
]

export default Allegiances
