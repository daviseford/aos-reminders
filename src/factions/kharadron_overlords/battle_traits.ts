import { tagAs } from 'factions/metatagger'
import { KHARADRON_OVERLORDS } from 'meta/factions'
import { DURING_GAME, START_OF_HERO_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const BattleTraits = {
  [KHARADRON_OVERLORDS]: {
    effects: [
      {
        name: `Aether-gold`,
        desc: `Each KHARADRON OVERLORDS HERO, SKYVESSEL and KHARADRON OVERLORDS unit with 10 or more models starts a battle with 1 share of aether-gold. Once per phase, you can say that 1 unit from your army that has any shares of aether-gold will spend 1 of them. If you do so, subtract 1 from that unit's Bravery characteristic for the rest of the battle, but you can pick a triumph it is eligible to use and immediately apply its effect to that unit. Ignore any restrictions on a triumph that say it can only be used once per battle if you pay to use it with a share of aether-gold.`,
        when: [DURING_GAME],
      },
    ],
  },

  'Battle Tactics': {
    effects: [
      {
        name: `Bombing Run`,
        desc: `Pick 1 enemy unit. You complete this battle tactic if that unit is destroyed during this turn by a friendly model using the 'Bomb Racks' ability.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.WHITE_DWARF_MAY_2022],
      },
      {
        name: `Mobilise the Fleet`,
        desc: `You cannot pick this battle tactic in the first battle round. Pick 3 friendly units on the battlefield. You complete this battle tactic at the end of the turn if those units are all garrisoned within SKYVESSELS.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.WHITE_DWARF_MAY_2022],
      },
      {
        name: `Boots on the Ground`,
        desc: `Pick 3 friendly units garrisoned in SKYVESSELS. You complete this battle tactic at the end of the turn if those units are all on the battlefield, are not garrisoned and wholly within enemy territory.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.WHITE_DWARF_MAY_2022, rule_sources.ERRATA_OCTOBER_2022],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
