import { TBattalions, TUnits } from 'types/army'
import { BATTLESHOCK_PHASE, COMBAT_PHASE, HERO_PHASE, SHOOTING_PHASE, START_OF_HERO_PHASE } from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Hedonite Host`,
    effects: [
      {
        name: `Transcendental Warriors`,
        desc: `If this battalion is part of a Slaanesh army you receive D3 depravity points.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Transcendental Warriors`,
        desc: `Add 1 to the bravery characteric of units in this battalion.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Supreme Sybarites`,
    effects: [
      {
        name: `Ruling Cabal`,
        desc: `Roll a dice.  If the roll is less than or equal to the number of heroes from this battalion that are on the battlefield, you receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Epicurean Revellers`,
    effects: [
      {
        name: `Perfect Destroyers`,
        desc: `If the unmodified wound roll for an attack made with a melee weapon by a Daemonette from this battalion is a 6, that attack inflicts 1 mortal wound on the target and the attack sequence ends (do not make a save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Seeker Cavalcade`,
    effects: [
      {
        name: `Drawn to Battle`,
        desc: `A model from this battalion is eligible to fight in the combat phase if it is within 6" of an enemy unit instead of 3".  It can also move an extra 3" when it piles in.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]
