import { tagAs } from 'factions/metatagger'
import { DAUGHTERS_OF_KHAINE } from 'meta/factions'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
} from 'types/phases'

const BattleTraits = {
  // Daughters of Khaine Allegiance
  [DAUGHTERS_OF_KHAINE]: {
    effects: [
      {
        name: `Battle Fury`,
        desc: `This is a heroic action that you can carry out with 1 friendly DAUGHTERS OF KHAINE HERO that is not a MONSTER instead of picking 1 from the table in the core rules. If you do so, add 2 to the Attacks characteristic of melee weapons used by that HERO until the end of that turn. This heroic action does not affect the weapons used by that HERO'S mount.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Fanatical Faith`,
        desc: `Friendly DAUGHTERS OF KHAINE units have a ward of 6+`,
        when: [SAVES_PHASE],
      },
      {
        name: `Blood Rites`,
        desc: `Friendly DAUGHTERS OF KHAINE units gain an ability each battle round. Units have the abilities of the current battle round and each previous battle round.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Blood Rites - Level 1: Quickening Bloodlust`,
        desc: `Add 1 to run rolls for this unit.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Blood Rites - Level 2: Headlong Fury`,
        desc: `Add 1 to charge rolls for this unit.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Blood Rites - Level 3: Zealot's Rage`,
        desc: `Add 1 to hit rolls for attacks made with melee weapons by this unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Blood Rites - Level 4: Slaughterer's Strength`,
        desc: `Add 1 to wound rolls for attacks made with melee weapons by this unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Blood Rites - Level 5: Unquenchable Fervour`,
        desc: `Friendly DAUGHTERS OF KHAINE units have a ward of 5+`,
        when: [SAVES_PHASE],
      },
    ],
  },
  // Hagg Nar Flavor
  // 'Daughters of the First Temple': {
  //   effects: [
  //     {
  //       name: `Daughters of the First Temple`,
  //       desc: `Add 1 to the current battle round when determining active Blood Rites. This effect is cumulative with other similar abilities.`,
  //       when: [START_OF_ROUND],
  //     },
  //   ],
  // },
  // // Draichi Ganeth Flavor
  // 'Bladed Killers': {
  //   effects: [
  //     {
  //       name: `Bladed Killers`,
  //       desc: `Improve the melee rend characteristic of friendly Draichi Ganeth Witch Aelves and Sisters of Slaughter units by 1 if they charged this turn.`,
  //       when: [CHARGE_PHASE, COMBAT_PHASE],
  //     },
  //   ],
  // },
  // // Kraith Flavor
  // 'Disciples of Slaughter': {
  //   effects: [
  //     {
  //       name: `Disciples of Slaughter`,
  //       desc: `Roll a D6 for each Kraith Sisters of Slaughter unit that fought in this phase. On a 5+ that unit can fight a second time.`,
  //       when: [END_OF_COMBAT_PHASE],
  //     },
  //   ],
  // },
  // // Khailebron Flavor
  // 'Concealment and Stealth': {
  //   effects: [
  //     {
  //       name: `Concealment and Stealth`,
  //       desc: `Subtract 1 from missle hit rolls that target friendly Khailebron units.`,
  //       when: [SHOOTING_PHASE],
  //     },
  //   ],
  // },
  // // Khelt Nar Flavor
  // 'Strike and Fade': {
  //   effects: [
  //     {
  //       name: `Strike and Fade`,
  //       desc: `Friendly Khelt Nar units can retreat and charge in the same turn.`,
  //       when: [MOVEMENT_PHASE, CHARGE_PHASE],
  //     },
  //   ],
  // },
  // // Zainthar Kai Flavor
  // "Khaine's Essence": {
  //   effects: [
  //     {
  //       name: `Khaine's Essence`,
  //       desc: `Add 1 to the bravery characteristic of Zainthar Kai Melusai and Khinerai Harpies units.`,
  //       when: [DURING_GAME, BATTLESHOCK_PHASE],
  //     },
  //   ],
  // },
}

export default tagAs(BattleTraits, 'battle_trait')
