import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const CommandTraits = {
  'Fury of the Fyreslayers': {
    effects: [
      {
        name: `Fury of the Fyreslayers`,
        desc: `+1 to charges for friendly FYRESLAYERS units wholly within 18" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Honour of the Ancestors': {
    effects: [
      {
        name: `Honour of the Ancestors`,
        desc: `Do not take battleshock tests for friendly FYRESLAYERS units wholly within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Spirit of Grimnir': {
    effects: [
      {
        name: `Spirit of Grimnir`,
        desc: `If this general is on the battlefield, when you roll to activate an ur-gold rune, it has the enhanced effect on a 5+.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Blood of the Berzerker': {
    effects: [
      {
        name: `Blood of the Berzerker`,
        desc: `Once per battle in the combat phase, after this general has fought in that phase for the first time, if they are within 3" of an enemy unit, they and their mount (if they have one) can immediately make a pile-in move and then attack with all of the melee weapons they are armed with for a second time.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Iron Will of the Guardian': {
    effects: [
      {
        name: `Iron Will of the Guardian`,
        desc: `Add 1 to save rolls for attacks that target this general.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Destroyer of Foes': {
    effects: [
      {
        name: `Destroyer of Foes`,
        desc: `Add 1 to the Damage characteristic of this general's melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Fyremantle: {
    effects: [
      {
        name: `Fyremantle`,
        desc: `-1 to hit to enemy units within 3" of this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Wisdom and Authority': {
    effects: [
      {
        name: `Wisdom and Authority`,
        desc: `At the start of the first battle round you receive D3 additional command points.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  Oathslayer: {
    effects: [
      {
        name: `Oathslayer`,
        desc: `Add 1 to bravery of friendly DUARDIN units while wholly within 18" of this general.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
      },
    ],
  },
  'Ash-beard': {
    effects: [
      {
        name: `Ash-beard`,
        desc: `This general knows 2 prayers from the Zharrgrim Blessings table.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Fyresteel Weaponsmith': {
    effects: [
      {
        name: `Fyresteel Weaponsmith`,
        desc: `Improve the rend characteristic of this general's weapons by 1.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Master Priest': {
    effects: [
      {
        name: `Master Priest`,
        desc: `Once per battle, at the start of your hero phase, if this general is on the battlefield, you can activate one ur-gold rune that has already been activated, instead of one that has not been activated.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  // Vostarg (Lodge)
  'Fiery Endurance': {
    effects: [
      {
        name: `Fiery Endurance`,
        desc: `Friendly VOSTARG units wholly within 12" of this general at the start of your movement phase can run and still charge later that turn.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  // Greyfyrd (Lodge)
  'Battle-scarred Veteran': {
    effects: [
      {
        name: `Battle-scarred Veteran`,
        desc: `+1 attack for general's melee weapons while there are 5 or more enemy models within 3" of this general.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Hermdar (Lodge)
  'Warrior Indominate': {
    effects: [
      {
        name: `Warrior Indominate`,
        desc: `Subtract 1 from wound rolls that target this general and friendly HERMDAR units wholly within 12".`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Lofnir (Lodge)
  'Explosive Charge': {
    effects: [
      {
        name: `Explosive Charge`,
        desc: `+1 charge for friendly LOFNIR MAGMADROTHS within 12" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')
