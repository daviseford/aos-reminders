import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const CommandTraits = {
  'Monstrously Tough': {
    effects: [
      {
        name: `Monstrously Tough`,
        desc: `This general has a Wounds characteristic of 40 instead of 35.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Furious Temper': {
    effects: [
      {
        name: `Furious Temper`,
        desc: `Once per battle, when this general is picked to fight, you can say that they are overcome with rage. If you do so, until the end of that phase, use the top row on this general's damage table, regardless of how many wounds they have suffered.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Rabble Rouser': {
    effects: [
      {
        name: `Rabble Rouser`,
        desc: `Add 1 to charge rolls for friendly SONS OF BEHEMAT units wholly within 18"of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  // Taker Tribe
  'Extremely Intimidating (Taker Tribe)': {
    effects: [
      {
        name: `Extremely Intimidating (Taker Tribe)`,
        desc: `Enemy units within 6" of this general cannot receive the Inspiring Presence or Rally commands.`,
        when: [BATTLESHOCK_PHASE, START_OF_HERO_PHASE],
      },
    ],
  },
  'Very Acquisitive (Taker Tribe)': {
    effects: [
      {
        name: `Very Acquisitive (Taker Tribe)`,
        desc: `If you give an artefact of power to this general, you can pick 1 additional artefact of power and give it to them as well (this general can have 2 artefacts of power). Both artefacts of power must be different.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  // Stomper Tribe
  'Inescapable Grip (Stomper Tribe)': {
    effects: [
      {
        name: `Inescapable Grip (Stomper Tribe)`,
        desc: `When you use this general's Hurled Body ability, you can reroll both dice rolls.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Eager for the Fight (Stomper Tribe)': {
    effects: [
      {
        name: `Eager for the Fight (Stomper Tribe)`,
        desc: `You can attempt a charge with this general if it is within 18" of an enemy unit instead of 12". In addition, roll 3D6 instead of 2D6 when making a charge roll for this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  // Smasher Tribe
  'Sees Green (Smasher Tribe)': {
    effects: [
      {
        name: `Sees Green (Smasher Tribe)`,
        desc: `Once per battle, at the start of a phase, you can say that this general is Gorkamorka made manifest. If you do so, this general has a ward of 4+ against mortal wounds until the end of that phase.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Marrow-drinker (Smasher Tribe)': {
    effects: [
      {
        name: `Marrow-drinker (Smasher Tribe)`,
        desc: `Each time an enemy Monster is slain by this general, roll a number of dice equal to that Monster's Wounds chracteristic. For each 5+, you can heal 1 wound allocated to this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  // Breaker Tribe
  'Extremely Bitter (Breaker Tribe)': {
    effects: [
      {
        name: `Extremely Bitter (Breaker Tribe)`,
        desc: `You can pick a second fierce loathing that applies only to your general.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  'Sees Red (Breaker Tribe)': {
    effects: [
      {
        name: `Sees Red (Breaker Tribe)`,
        desc: `In the combat phase, if this general is within 3" of a defensible terrain feature or an enemy unit that is wholly on a terrain feature, use the top row on this general's damage table, regardless of how many wounds they have suffered.`,
        when: [DURING_GAME],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')
