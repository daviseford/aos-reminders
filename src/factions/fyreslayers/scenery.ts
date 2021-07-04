import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { START_OF_HERO_PHASE, START_OF_SETUP } from 'types/phases'
import rule_sources from './rule_sources'

const Scenery = {
  'Magmic Battleforge': {
    effects: [
      {
        name: `Set Up`,
        desc: `After territories are determined, you can set up this faction terrain feature wholly within your territory and more than 3" from all objectives and other terrain features. If both players can set up faction terrain features at the same time, they must roll off and the winner chooses who sets up their faction terrain features first.`,
        when: [START_OF_SETUP],
        rule_sources: [rule_sources.BATTLETOME_FYRESLAYERS, rule_sources.ERRATA_FYRESLAYERS_JULY_2021],
      },
      GenericEffects.Impassable,
      {
        name: `Molten Blessing`,
        desc: `At the start of your hero phase, you can pick 1 friendly FYRESLAYERS PRIEST within 6" of this terrain feature to control its magmic energies. If you do so, until the end of that phase, add 1 to chanting rolls for friendly FYRESLAYERS PRIESTS within 18" of this terrain feature. You cannot use this terrain feature's Molten Blessing ability and its Spending the Forge ability in the same phase.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_FYRESLAYERS, rule_sources.ERRATA_FYRESLAYERS_JULY_2021],
      },
      {
        name: `Spending the Forge`,
        desc: `Once per battle, at the start of your hero phase, instead of using this terrain feature's Molten Blessing ability, you can pick 1 friendly FYRESLAYERS PRIEST within 6" of this terrain feature to spend all of its energy. If you do so, until the start of your next hero phase, friendly FYRESLAYERS units on the battlefield have a ward of 6+. However, for the rest of the battle, FYRESLAYERS PRIESTS can no longer use this terrain feature's Molten Blessing ability.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_FYRESLAYERS, rule_sources.ERRATA_FYRESLAYERS_JULY_2021],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
