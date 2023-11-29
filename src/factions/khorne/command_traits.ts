import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
} from 'types/phases'

const CommandTraits = {
  'Embodiment of Wrath': {
    effects: [
      {
        name: `Embodiment of Wrath`,
        desc: `At the start of your hero phase, roll a dice for each friendly BLOODLETTER HOST wholly within 16" of this general. On a 2+, you can return D3 slain models to that unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  Firebrand: {
    effects: [
      {
        name: `Firebrand`,
        desc: `This general becomes a PRIEST. If this general is already a PRIEST, they instead know 1 additional prayer from the Blood Blessings of Khorne.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Favoured of Khorne': {
    effects: [
      {
        name: `Favoured of Khorne`,
        desc: `If your general has this command trait, you begin the battle with 1 Blood Tithe point.`,
        when: [START_OF_GAME],
      },
    ],
  },
  'Unrelenting Hunter': {
    effects: [
      {
        name: `Unrelenting Hunter`,
        desc: `At the end of the combat phase, if this general fought in that phase and is within 3" of any enemy units, this general can make a pile-in move. Alternatively, at the end of the combat phase, if this general fought in that phase and is more than 3" from all enemy units, this general can make a normal move or attempt a charge.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Diabolical Purpose': {
    effects: [
      {
        name: `Diabolical Purpose`,
        desc: `Add 1 to the Damage characteristic of attacks made by this general that target an enemy HERO.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Barbarian Lord': {
    effects: [
      {
        name: `Barbarian Lord`,
        desc: `Add 1 to run rolls and charge rolls for this general and for friendly BLOODREAVERS, CLAWS OF KARANAK and FLESH HOUNDS units while they are wholly within 16" of this general.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Lord of the Gorechosen': {
    effects: [
      {
        name: `Lord of the Gorechosen`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by friendly GORECHOSEN units while they are wholly within 16" of this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'High-priest of Khorne': {
    effects: [
      {
        name: `High-priest of Khorne`,
        desc: `PRIEST only. In each of your hero phases, your general can chant 2 prayers that they know instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(CommandTraits, 'command_trait')
