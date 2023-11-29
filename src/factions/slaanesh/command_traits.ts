import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

const CommandTraits = {
  // Invaders Host - Obessions of the Invader
  'Best of the Best': {
    effects: [
      {
        name: `Best of the Best`,
        desc: `Add 1 to the Attacks characteristic of this general's melee weapons while they are within 6" of a different HERO.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Glory Hog': {
    effects: [
      {
        name: `Glory Hog`,
        desc: `At the end of the combat phase, if any enemy units were destroyed in that phase and this general is on the battlefield, you receive 1 command point.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Hurler of Obscenities': {
    effects: [
      {
        name: `Hurler of Obscenities`,
        desc: `At the start of the combat phase, you can pick 1 enemy unit within 6" of this general. Until the end of that phase, add 1 to hit rolls for attacks made by that unit, but subtract 1 from save rolls for attacks that target that unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  // Pretenders Host - Aspects of the Perfect Liege
  'Strength of Godhood': {
    effects: [
      {
        name: `Strength of Godhood`,
        desc: `If this general issues a command to a different friendly HEDONITES OF SLAANESH unit, until the end of the turn, improve the Rend characteristic of this general's melee weapons by 1 and add 1 to the Damage characteristic of this general's melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Monarch of Lies': {
    effects: [
      {
        name: `Monarch of Lies`,
        desc: `Roll a dice each time an enemy unit receives a command within 6" of this general. On a 5+, that command is not received (it still counts as having been used) and the command point that was spent to issue that command is lost.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Strongest Alone': {
    effects: [
      {
        name: `Strongest Alone`,
        desc: `Add 1 to hit rolls and wound rolls for this general while they are more than 6" from all other friendly units.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  // Godseekers Host
  'Hunter Supreme': {
    effects: [
      {
        name: `Hunter Supreme`,
        desc: `MONSTER only: Enemy units within 3" of this general cannot make pile-in moves if this general made a charge move in the same turn. In addition, add 1 to the Attacks characteristic of this general's melee weapons if they made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Into the Fray': {
    effects: [
      {
        name: `Into the Fray`,
        desc: `The strike-first effect applies to this general if they made a charge move in the same turn.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Speed-chaser': {
    effects: [
      {
        name: `Speed-chaser`,
        desc: `After this general makes a charge move, you can pick 1 enemy unit within 1" of this general and roll a number of dive equal to the charge roll for that charge move. For each 4+, that enemy unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(CommandTraits, 'command_trait')
