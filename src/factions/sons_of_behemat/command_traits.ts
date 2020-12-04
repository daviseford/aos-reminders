import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_SETUP,
  TURN_ONE_START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const getLouderThanWordsEffect = (numAttacks: number, weaponName: string, tag: string) => {
  return [
    {
      name: `Louder than Words ${tag}`,
      desc: `Add ${numAttacks} to the Attacks characteristic of this general's ${weaponName}.`,
      when: [COMBAT_PHASE],
    },
  ]
}

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
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
  'Old and Gnarly': {
    effects: [
      {
        name: `Old and Gnarly`,
        desc: `You can reroll save rolls of 1 for attacks that target this general.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  // Taker Tribe
  'Louder Than Words (Taker Tribe)': {
    effects: getLouderThanWordsEffect(1, 'Shipwrecka Warclub', '(Taker Tribe)'),
  },
  'Strong Right Foot (Taker Tribe)': {
    effects: [
      {
        name: `Strong Right Foot (Taker Tribe)`,
        desc: `When you use this general's Get Orf Me Land! ability to kick an objective marker away, you can roll 3D6 instead of 2D6 to determine how far it is kicked.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Very Acquisitive (Taker Tribe)': {
    effects: [
      {
        name: `Very Acquisitive (Taker Tribe)`,
        desc: `You can take 1 extra Trophies Taken By Force artefact of power for this general's army. In addition, this general can have up to 2 artefacts of power instead of 1.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  'Extremely Intimidating (Taker Tribe)': {
    effects: [
      {
        name: `Extremely Intimidating (Taker Tribe)`,
        desc: `Subtract 1 from hit rolls for enemy models that are within 3" of this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  // Stomper Tribe
  'Louder Than Words (Stomper Tribe)': {
    effects: getLouderThanWordsEffect(1, 'Titanic Boulderclub (to a maximum of 10)', '(Stomper Tribe)'),
  },
  'Inescapable Grip (Stomper Tribe)': {
    effects: [
      {
        name: `Inescapable Grip (Stomper Tribe)`,
        desc: `When you use this general's Hurled Body ability, you can reroll the dice that determines if the target is slain and thrown.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Very Shouty (Stomper Tribe)': {
    effects: [
      {
        name: `Very Shouty (Stomper Tribe)`,
        desc: `If this general is on the battlefield at the start of the first battle round, you receive D3 extra command points.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
    ],
  },
  'Eager for the Fight (Stomper Tribe)': {
    effects: [
      {
        name: `Eager for the Fight (Stomper Tribe)`,
        desc: `You can attempt to charge with this general if it is within 18" of the enemy instead of 12". Roll 3D6 instead of 2D6 when making a charge roll for this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  // Breaker Tribe
  'Bossy Pants and Clever Clogs (Fierce Loathing)': {
    effects: [
      {
        name: `Bossy Pants and Clever Clogs (Fierce Loathing)`,
        desc: `Add 1 to hit rolls for attacks made by units with this ability that target a HERO or WIZARD.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Idiots with Flags (Fierce Loathing)': {
    effects: [
      {
        name: `Idiots with Flags (Fierce Loathing)`,
        desc: `Add 1 to hit rolls for attacks made by units with this ability that target a TOTEM or a unit with any command models.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  "Shiny 'Uns (Fierce Loathing)": {
    effects: [
      {
        name: `Shiny 'Uns (Fierce Loathing)`,
        desc: `Add 1 to hit rolls for attacks made by units with this ability that target a unit with a Save characteristic of 1+, 2+, 3+ or 4+ and that is not a HERO or MONSTER.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Crowds (Fierce Loathing)': {
    effects: [
      {
        name: `Crowds (Fierce Loathing)`,
        desc: `Add 1 to hit rolls for attacks made by units with this ability that target a unit with 20 or more models.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Wannabes (Fierce Loathing)': {
    effects: [
      {
        name: `Wannabes (Fierce Loathing)`,
        desc: `Add 1 to hit rolls for attacks made by units with this ability that target a WAR MACHINE or MONSTER.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Piggybackers (Fierce Loathing)': {
    effects: [
      {
        name: `Piggybackers (Fierce Loathing)`,
        desc: `Add 1 to hit rolls for attacks made by units with this ability that target a unit with a mount and that is not a MONSTER.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Louder Than Words (Breaker Tribe)': {
    effects: getLouderThanWordsEffect(2, 'Fortcrusha Flail', '(Breaker Tribe)'),
  },
  'Extremely Bitter (Breaker Tribe)': {
    effects: [
      {
        name: `Extremely Bitter (Breaker Tribe)`,
        desc: `You can choose or roll for 2 abilities from the Fierce Loathings table for your army instead of 1. If you randomly generate the second, roll again if it is the same as the first. The second ability only applies to the general.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  'Smasher (Breaker Tribe)': {
    effects: [
      {
        name: `Smasher (Breaker Tribe)`,
        desc: `When you use this general's Smash Down ability, you can reroll the dice roll that determines if the terrain feature is turned into rubble.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Sees Red (Breaker Tribe)': {
    effects: [
      {
        name: `Sees Red (Breaker Tribe)`,
        desc: `While this general is within 9" of a terrain feature that can have a garrison, when you look up a value on this general's damage table, they are treated as if they have suffered 0 wounds.`,
        when: [DURING_GAME],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandTraits, 'command_trait')
