import { tagAs } from 'factions/metatagger'
import { DAUGHTERS_OF_KHAINE } from 'meta/factions'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
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

  'Battle Tactics': {
    effects: [
      {
        name: `Clash of Arms`,
        desc: `You complete this tactic if 3 or more friendly units make a charge move this turn. If 2 or more of those units are WITCH AELVES or SISTERS OF SLAUGHTER, score 1 additional victory point.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Cruel Delight`,
        desc: `You complete this tactic if 2 or more friendly KHINERAI units move using their Fire and Flight ability or Fight and Flight ability this turn.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Tide of Blades`,
        desc: `You complete this tactic if there are 2 or more units from your starting army wholly within your opponent's territory at the end of this turn. If 2 or more of those units are WITCH AELVES, score 1 additional victory point.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Executioner's Cult`,
        desc: `You can pick this battle tactic only if there is a friendly HIGH GLADIATRIX on the battlefield. You complete this tactic if an enemy HERO is slain by that unit's Killing Stroke ability this turn.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Hatred of Chaos`,
        desc: `You can pick this battle tactic only if you have a Hagg Nar or Khelt Nar army. You complete this tactic if 2 or more CHAOS units are destroyed this turn.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Unexpected Attack`,
        desc: `You complete this tactic if a friendly KHAINITE SHADOWSTALKERS unit uses its Shadow Leap ability and makes a charge move this turn.`,
        when: [START_OF_ROUND],
      },
    ],
  },

  // Hagg Nar Flavor
  'Daughters of the First Temple': {
    effects: [
      {
        name: `Daughters of the First Temple`,
        desc: `Add 1 to the number of the current battle round when determining the abilities gained by friendly HAGG NAR units from the Blood Rites battle trait (pg 66). This ability and other similar abilities are cumulative.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  // Draichi Ganeth Flavor
  'Bladed Killers': {
    effects: [
      {
        name: `Bladed Killers`,
        desc: `Improve the Rend characteristic of melee weapons used by friendly DRAICHI GANETH WITCH AELVES units and friendly DRAICHI GANETH SISTERS OF SLAUGHTER units by 1 if those units made a charge move in the same turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  // Kraith Flavor
  'Disciples of Slaughter': {
    effects: [
      {
        name: `Disciples of Slaughter`,
        desc: `After a friendly KRAITH SISTERS OF SLAUGHTER unit has fought for the first time in the combat phase, roll a dice. On a 4+, that unit can fight for a second time in that phase. The strike-last effect applies to that unit when they fight for that second time.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Khelt Nar Flavor
  'Strike and Fade': {
    effects: [
      {
        name: `Strike and Fade`,
        desc: `Friendly KHELT NAR units can retreat and still charge in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  // Zainthar Kai Flavor
  "Khaine's Essence": {
    effects: [
      {
        name: `Khaine's Essence`,
        desc: `Each time a model in a friendly ZAINTHAR KAI MELUSAI unit is slain, that model can fight before it is removed from play.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
