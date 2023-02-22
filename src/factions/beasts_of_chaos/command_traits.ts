import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const CommandTraits = {
  'Bestial Cunning': {
    effects: [
      {
        name: `Bestial Cunning`,
        desc: `After deployment, you can pick 1 friendly BEASTS OF CHAOS reserve unit. When you set up that unit at the end of your movement phase, you can set it up anywhere on the battlefield more than 7" from all enemy units.`,
        when: [DURING_SETUP, END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Propagator of Ruin': {
    effects: [
      {
        name: `Propagator of Ruin`,
        desc: `If this general is on the battlefield and you pick them to carry out a heroic action from the Rituals of Ruin battle trait (pg 62-63), you can carry out a second different heroic action from the Rituals of Ruin battle trait with this general in that phase, and you do not have to allocate mortal wounds to this general before resolving the effect of that second heroic action.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Skullfray Gorehorn': {
    effects: [
      {
        name: `Skullfray Gorehorn`,
        desc: `While this general is within 3" of any enemy units, add 1 to the Attacks characteristic of melee weapons used by friendly BEASTS OF CHAOS BRAYHERD units wholly within 12' of this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Twist fray Cursebeast': {
    effects: [
      {
        name: `Twist fray Cursebeast`,
        desc: `Add the number of the current battle round to casting rolls for this general.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Rotfray Plaguepelt': {
    effects: [
      {
        name: `Rotfray Plaguepelt`,
        desc: `At the start of the combat phase, roll a dice for each enemy unit within 3" of this general. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Slakefray Reveller': {
    effects: [
      {
        name: `Slakefray Reveller`,
        desc: `If this general is on the battlefield at the start of your movement phase, add 3" to the Move characteristic of friendly BEASTS OF CHAOS units that start a normal move within 6" of a terrain feature until the end of that phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')
