import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  END_OF_BATTLESHOCK_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Artifacts = {
  // Invaders Host
  'The Rod of Misrule': {
    effects: [
      {
        name: `The Rod of Misrule`,
        desc: `Keep track of the number of unmodified hit rolls of 6 and unmodified wound rolls of 6 for attacks made by the bearer in each turn. At the end of the battleshock phase, if the total is 6 or more and the bearer is on the battlefield, you gain 1 depravity point.`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  'Icon of Infinite Excess': {
    effects: [
      {
        name: `Icon of Infinite Excess`,
        desc: `Once per battle, at the start of the combat phase, you can say that the bearer will plant the Icon of Infinite Excess. If you do so. add 1 to the Attacks characteristic of weapons used by friendly HEDONITES OF SLAANESH units on the battlefield until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'The Beguiling Gem': {
    effects: [
      {
        name: `The Beguiling Gem`,
        desc: `At the start of the combat phase, pick 1 enemy HERO within 3" of the bearer and roll 3D6. If the roll is greater than that HERO'S Bravery characteristic, subtract 1 from the Attacks characteristic of that HERO's melee weapons (to a minimum of 1) until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  // Pretenders Host
  'The Crown of Dark Secrets': {
    effects: [
      {
        name: `The Crown of Dark Secrets`,
        desc: `At the start of your first hero phase, pick 1 enemy unit on the battlefield. For the rest of the battle, while that unit is within 6" of the bearer, the Attacks characteristic of that unit's melee weapons is 1.`,
        when: [TURN_ONE_START_OF_HERO_PHASE],
      },
    ],
  },
  'Sceptre of Domination': {
    effects: [
      {
        name: `Sceptre of Domination`,
        desc: `At the start of the combat phase, roll a dice for each enemy unit within 3" of the bearer. On a 5+, the strike-last effect applies to that unit until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  Breathtaker: {
    effects: [
      {
        name: `Breathtaker`,
        desc: `Pick 1 of the bearer's melee weapons. If an enemy model is slain by an attack made with that weapon, all effects that would be triggered when that model is slain are ignored.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  // Godseekers Host
  'Cameo of the Dark Prince': {
    effects: [
      {
        name: `Cameo of the Dark Prince`,
        desc: `Once per battle, at the start of your hero phase, you can say that the bearer will gaze upon the cameo. If you do so, until the end of that turn, the bearer can issue commands to friendly HEDONITES OF SLAANESH units without any command points being spent.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Girdle of the Realm-racer': {
    effects: [
      {
        name: `Girdle of the Realm-racer`,
        desc: `The bearer can fly.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Girdle of the Realm-racer`,
        desc: `The bearer is eligible to fight in the combat phase if they are within 6" of any enemy units instead of 3", and they can move an extra 3" when they pile in.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Threnody Voicebox': {
    effects: [
      {
        name: `Threnody Voicebox`,
        desc: `Once per battle, at the start of the combat phase, you can say that the bearer will play their melody. If you do so, until the end of that phase, subtract 1 from the Attacks characteristic of melee weapons used by enemy units within 6" of the bearer (to a minimum of 1).`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Artifacts, 'artifact')
