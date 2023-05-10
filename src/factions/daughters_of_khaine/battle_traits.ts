import { tagAs } from 'factions/metatagger'
import { DAUGHTERS_OF_KHAINE } from 'meta/factions'
import meta_rule_sources from 'meta/rule_sources'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
} from 'types/phases'
import rule_sources from './rule_sources'

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
        desc: `You complete this tactic if 3 or more friendly units make a charge move this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE, rule_sources.ERRATA_DECEMBER_2022],
      },
      {
        name: `Cruel Delight`,
        desc: `You complete this tactic if 2 or more friendly KHINERAI units move using their Fire and Flight ability or Fight and Flight ability this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Tide of Blades`,
        desc: `You complete this tactic if there are 2 or more units from your starting army wholly within your opponent's territory at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE,
          rule_sources.ERRATA_DECEMBER_2022,
          meta_rule_sources.BATTLESCROLL_GALLETIAN_CHAMPIONS_JANUARY_2022,
        ],
      },
      {
        name: `Executioner's Cult`,
        desc: `You can pick this battle tactic only if there is a friendly HIGH GLADIATRIX on the battlefield. You complete this tactic if an enemy HERO is slain by that unit's Killing Stroke ability this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Hatred of Chaos`,
        desc: `You can pick this battle tactic only if you have a Hagg Nar or Khelt Nar army. You complete this tactic if 2 or more CHAOS units are destroyed this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Unexpected Attack`,
        desc: `You complete this tactic if a friendly KHAINITE SHADOWSTALKERS unit uses its Shadow Leap ability and makes a charge move this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
