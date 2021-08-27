import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import { DURING_GAME, END_OF_CHARGE_PHASE, START_OF_SETUP } from 'types/phases'
import rule_sources from './rule_sources'

const Scenery = {
  'Awakened Wyldwood': {
    effects: [
      {
        name: `Setup`,
        desc: `After territories are determined, you can set up this faction terrain feature wholly within your territory and more than 3" from all objectives and other terrain features. If both players can set up faction terrain features at the same time, they must roll off and the winner chooses who sets up their faction terrain features first.

        Abilities that allow you to add Awakened Wyldwood terrain features to the battlefield will tell you how to set them up. In addition, they must be set up more than 3" from all models, objectives, other terrain features, endless spells and invocations.

        This faction terrain feature consists of 1-3 scenery pieces. If an Awakened Wyldwood has more than 1 scenery piece, each piece must be set up touching all of the other pieces to form a circle with an area of open ground inside the circle. The area of open ground inside the circle is considered to be part of the Awakened Wyldwood terrain feature.`,
        when: [START_OF_SETUP],
        rule_sources: [
          rule_sources.BATTLETOME_SYLVANETH,
          meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS,
          rule_sources.ERRATA_SYLVANETH_JULY_2021,
          meta_rule_sources.ERRATA_BROKEN_REALMS_KRAGNOS_AUGUST_2021,
        ],
      },
      {
        name: `Overgrown Wilderness`,
        desc: `Visibility from units with the Sylvaneth keyword is not blocked by this terrain feature.`,
        when: [DURING_GAME],
        rule_sources: [
          rule_sources.BATTLETOME_SYLVANETH,
          meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS,
          rule_sources.ERRATA_SYLVANETH_JULY_2021,
          meta_rule_sources.ERRATA_BROKEN_REALMS_KRAGNOS_AUGUST_2021,
        ],
      },
      {
        name: `Vengeful Forest Spirits`,
        desc: `At the end of the charge phase, roll a dice for each unit that does not have the Sylvaneth keyword that is within 1" of any terrain features with this scenery rule. Add 2 to the roll if any WIZARDS or endless spells are within 6" of any of those terrain features. On a 6+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_SYLVANETH,
          meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS,
          rule_sources.ERRATA_SYLVANETH_JULY_2021,
          meta_rule_sources.ERRATA_BROKEN_REALMS_KRAGNOS_AUGUST_2021,
        ],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
