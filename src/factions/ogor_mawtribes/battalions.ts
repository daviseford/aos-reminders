import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// TODO: Add mandatory units
const RegularBattalions = {
  'Gutbuster Warglutt': {
    effects: [
      {
        name: `The Mawpath`,
        desc: `At the start of your hero phase in the first battle round, each friendly unit from this battalion can make a move of D6". Roll separately for each unit.`,
        when: [TURN_ONE_START_OF_HERO_PHASE],
      },
    ],
  },

  "Tyrant's Gutguard": {
    effects: [
      {
        name: `Wall of Fat`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly TYRANT from this battalion while it is within 3" of a friendly IRONGUTS unit from this battalion. On a 4+, that wound or mortal wound is negated. That unit of IRONGUTS then suffers 1 mortal wound.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },

  Goremand: {
    effects: [
      {
        name: `The Tyrant's Butcher`,
        desc: `The SLAUGHTERMASTER from this battalion can use its Great Cauldron ability twice in each of your hero phases instead of once.`,
        when: [HERO_PHASE],
      },
    ],
  },

  "Butcher's Band": {
    effects: [
      {
        name: `Well-fed Warriors`,
        desc: `At the start of your hero phase, you can heal 1 wound allocated to each friendly unit from this battalion that is wholly within 12" of the BUTCHER from this battalion.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  Junkmob: {
    effects: [
      {
        name: `Don't Eat Me, Boss!`,
        desc: `Add 1 to the Attacks characteristic of Piles of Old Scrap used by any GNOBLAR SCRAPLAUNCHERS from this battalion while they are within 3" of any GNOBLAR units from this battalion that have 20 or more models.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },

  Alfrostun: {
    effects: [
      {
        name: `Alfrostun Avalanche`,
        desc: `When using the Grasp of the Everwinter battle trait and rolling a dice for each enemy unit within 3" of a unit from this battalion, subtract 1 from the roll.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  Jorlbad: {
    effects: [
      {
        name: `Tip of the Hunting Spear`,
        desc: `At the start of your hero phase in the first battle round, each friendly unit from this battalion can make a move of D6". Roll separately for each unit.`,
        when: [TURN_ONE_START_OF_HERO_PHASE],
      },
    ],
  },

  Eurlbad: {
    effects: [
      {
        name: `Crush, Mangle, Tenderise`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon used by a model from this battalion is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  Torrbad: {
    effects: [
      {
        name: `Heat-numbing Chill`,
        desc: `At the start of your hero phase, roll 1 dice for each enemy unit within 3" of any units from this battalion. On a 2+, that unit suffers 1 mortal wound.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  Skal: {
    effects: [
      {
        name: `Hunting Pack`,
        desc: `Add 1 to charge rolls for units from this battalion while they are wholly within 12" of another unit from this battalion.`,
        when: [CHARGE_PHASE],
      },
    ],
  },

  "Kin-eater's Bully Boys": {
    effects: [
      {
        name: `Bully Boys`,
        desc: `You can reroll charge rolls for units from this battalion while they are wholly within 12" of the TYRANT from the same battalion.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
}

export default tagAs(RegularBattalions, 'battalion')
