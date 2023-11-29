import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'
import rule_sources from './rule_sources'
import meta_rule_sources from 'meta/rule_sources'

const BattleTactics = {
  'Clash of Arms': {
    effects: [
      {
        name: `Clash of Arms`,
        desc: `You complete this tactic if 3 or more friendly units make a charge move this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE,
          rule_sources.ERRATA_DECEMBER_2022,
          meta_rule_sources.BATTLESCROLL_ANDTOR_SEPTEMBER_2023,
        ],
      },
    ],
  },
  'Cruel Delight': {
    effects: [
      {
        name: `Cruel Delight`,
        desc: `You complete this tactic if 2 or more friendly KHINERAI units move using their Fire and Flight ability or Fight and Flight ability this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Tide of Blades': {
    effects: [
      {
        name: `Tide of Blades`,
        desc: `You complete this tactic if there are 2 or more units from your starting army wholly within your opponent's territory at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE,
          rule_sources.ERRATA_DECEMBER_2022,
          meta_rule_sources.BATTLESCROLL_GALLETIAN_CHAMPIONS_JANUARY_2022,
          meta_rule_sources.BATTLESCROLL_ANDTOR_SEPTEMBER_2023,
        ],
      },
    ],
  },
  "Executioner's Cult": {
    effects: [
      {
        name: `Executioner's Cult`,
        desc: `You can pick this battle tactic only if there is a friendly HIGH GLADIATRIX on the battlefield. You complete this tactic if an enemy HERO is slain by that unit's Killing Stroke ability this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Hatred of Chaos': {
    effects: [
      {
        name: `Hatred of Chaos`,
        desc: `You can pick this battle tactic only if you have a Hagg Nar or Khelt Nar army. You complete this tactic if 2 or more CHAOS units are destroyed this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Unexpected Attack': {
    effects: [
      {
        name: `Unexpected Attack`,
        desc: `You complete this tactic if a friendly KHAINITE SHADOWSTALKERS unit uses its Shadow Leap ability and makes a charge move this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTactics, 'battle_tactic')
