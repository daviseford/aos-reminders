import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, DURING_GAME, MOVEMENT_PHASE } from 'types/phases'

// Store Command Traits here. You can add them to units, abilties, flavors, and subfactions later.
const CommandTraits = {
  'Curse of the Revenant': {
    effects: [
      {
        name: `Curse of the Revenant`,
        desc: `Add 1 to this general's Wounds characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Deathless Duelist': {
    effects: [
      {
        name: `Deathless Duelist`,
        desc: `Reroll hits rolls of 1 for this general when they attack an enemy HERO in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Transfix: {
    effects: [
      {
        name: `Transfix`,
        desc: `At the start of the combat phase, pick one enemy HERO within 3" of this general. Until the end of the phase, subtract 1 from hit rolls for the model you picked when it targets the general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Mist Form': {
    effects: [
      {
        name: `Mist Form`,
        desc: `If this general retreats, they can move as if they can fly and they can still charge in the same turn.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Killing Blow': {
    effects: [
      {
        name: `Killing Blow`,
        desc: `Wound rolls of 6+ for attacks made by this general in the combat phase inflict a mortal wound in addition to any other damage they inflict.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Blood Fury': {
    effects: [
      {
        name: `Blood Fury`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandTraits, 'command_trait')
