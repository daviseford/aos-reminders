import { pickEffects } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  END_OF_SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  TURN_FOUR_START_OF_TURN,
  TURN_ONE_MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import Artifacts from './artifacts'
import CommandTraits from './command_traits'

const Flavors = {
  "Dracothion's Tail": {
    effects: [
      {
        name: `Appear on Command`,
        desc: `Instead of setting up a friendly DRACOTHION'S TAIL unit on the battlefield before the battle begins, you can place it to one side and say that it is set up waiting to appear at command as a reserve unit. You can set up 1 reserve unit waiting to appear at command for each friendly DRACOTHION'S TAIL unit you have already set up on the battlefield.`,
        when: [DURING_SETUP],
      },
      {
        name: `Appear on Command`,
        desc: `At the end of your movement phase, you can set up one or more of the reserve units waiting to appear at command on the battlefield, more than 9" from any enemy units and wholly within 18" of a friendly DRACOTHION'S TAIL SLANN.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Appear on Command`,
        desc: `Any reserve units waiting to appear at command which are not set up on the battlefield before the start of the fourth battle round are slain.`,
        when: [TURN_FOUR_START_OF_TURN],
      },
      ...pickEffects(CommandTraits, ['Ancient Knowledge']),
      ...pickEffects(Artifacts, ['Godbeast Pendant']),
    ],
  },

  'Fangs of Sotek': {
    effects: [
      {
        name: `First to Battle`,
        desc: `In the first battle round, add 3" to the Move characteristic of FANGS OF SOTEK SKINK units.`,
        when: [TURN_ONE_MOVEMENT_PHASE],
      },
      {
        name: `Parting Shot`,
        desc: `You can use this command ability when an enemy unit ends a charge move within 3" of a friendly FANGS OF SOTEK unit from the Skinks or Chameleon Skinks warscroll that is wholly within 18" of a friendly FANGS OF SOTEK HERO. If you do so, that unit can shoot. After you have resolved all of that unit's shooting attacks, roll a D6. On a 4+, that unit must retreat but cannot run. A unit cannot benefit from this command ability more than once per phase.`,
        when: [CHARGE_PHASE],
        command_ability: true,
      },
      ...pickEffects(CommandTraits, ['Old and Grizzled']),
      ...pickEffects(Artifacts, ['Serpent God Dagger']),
    ],
  },

  "Koatl's Claw": {
    effects: [
      {
        name: `Savagery Incarnate`,
        desc: `Add 1 to hit rolls for attacks made by friendly KOATL'S CLAW SAURUS units that made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Controlled Fury`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly KOATL'S CLAW SAURUS unit wholly within 24" of a friendly KOATL'S CLAW SAURUS HERO. That unit counts as having made a charge move in that turn for the purposes of the Savagery Incarnate ability.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      ...pickEffects(CommandTraits, ['Dominant Predator']),
      ...pickEffects(Artifacts, ['Eviscerating Blade']),
    ],
  },

  'Thunder Lizard': {
    effects: [
      {
        name: `Mighty Beasts of War`,
        desc: `Add 2 to the Wounds characteristic of THUNDER LIZARD MONSTERS.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Trove of Old One Technology`,
        desc: `You can use this command ability at the end of your shooting phase. If you do so, pick 1 friendly THUNDER LIZARDBASTILADON, or friendly THUNDER LIZARDENGINE OF THE GODS, that is wholly within 18" of a friendly THUNDER LIZARD HERO. If that unit is a BASTILADON, it can shoot with its Solar Engine even if it has already done so in that phase. If that unit is an ENGINE OF THE GODS, you can make a cosmic engine roll for it even if you have already done so in that phase. A unit cannot benefit from this command ability more than once per phase.`,
        when: [END_OF_SHOOTING_PHASE],
        command_ability: true,
      },
      ...pickEffects(CommandTraits, ['Prime Warbeast']),
      ...pickEffects(Artifacts, ['Fusil of Conflagration']),
    ],
  },
}

export default Flavors
