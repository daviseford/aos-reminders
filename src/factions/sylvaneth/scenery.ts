import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import {
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  START_OF_SETUP,
} from 'types/phases'
import rule_sources from './rule_sources'

const Scenery = {
  'Awakened Wyldwood': {
    effects: [
      {
        name: `Setup`,
        desc: `After territories are determined, you can set up this faction terrain feature wholly within your territory and more than 3" from all objectives and other terrain features. If both players can set up faction terrain features at the same time, they must roll off and the winner chooses who sets up their faction terrain features first.

        This faction terrain feature consists of 3 scenery pieces. When you set it up, you can set up the 3 scenery pieces so that they form a circle with an area of open ground inside the circle, or you can set them up more than 3" from each other. If you set them up so that they form a circle, they form 1 large Awakened Wyldwood, and the area of open ground inside the circle is considered to be part of the Awakened Wyldwood. If you set them up more than 3" from each other, they form 3 small Awakened Wyldwoods that are separate faction terrain features.`,
        when: [START_OF_SETUP],
        rule_sources: [
          rule_sources.BATTLETOME_SYLVANETH,
          meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS,
          rule_sources.ERRATA_SYLVANETH_JULY_2021,
        ],
      },
      {
        name: `Wyldwood`,
        desc: `An Awakened Wyldwood formed from all 3 scenery pieces is also a wyldwood (core rules, 17.1.4).`,
        when: [START_OF_SETUP],
        rule_sources: [rule_sources.ERRATA_SYLVANETH_JULY_2021],
      },
      {
        name: `Roused By Magic`,
        desc: `In the hero phase, if a spell is successfully cast by a unit wholly within 6" of this terrain feature and not unbound, roll a dice for each unit within 1" of this terrain feature that does not have the SYLVANETH keyword. On a 5+, that unit suffers D3 mortal wounds after that spell's effects have been resolved.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.ERRATA_SYLVANETH_JULY_2021],
      },
      {
        name: `Overgrown Wilderness`,
        desc: `Visibility between 2 models is blocked is a 1mm straight line drawn between the closest points between the models passes across more than 3" of an AWAKENED WYLDWOOD. Does not apply to SYLVANETH units or models with a Wounds characteristic of 10 or more.`,
        when: [DURING_GAME],
        rule_sources: [
          rule_sources.BATTLETOME_SYLVANETH,
          meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS,
          rule_sources.ERRATA_SYLVANETH_JULY_2021,
        ],
      },
      {
        name: `Forest Spirits`,
        desc: `At the end of the charge phase, roll a dice for each unit within 1" of this terrain feature that does not have the SYLVANETH keyword. On a 6, that unit suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_SYLVANETH,
          meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS,
          rule_sources.ERRATA_SYLVANETH_JULY_2021,
        ],
      },
      {
        name: `Navigate Realmroots`,
        desc: `At the end of your movement phase, if there is a friendly SYLVANETH unit wholly within 6" of this terrain feature, you can remove that unit from the battlefield and set it up wholly within 6" of a different Awakened Wyldwood in your army and more than 9" from all enemy models. You can only transport up to 1 friendly unit in this way per battle round, regardless of the number of Awakened Wyldwoods in your army.`,
        when: [END_OF_MOVEMENT_PHASE],
        rule_sources: [rule_sources.ERRATA_SYLVANETH_JULY_2021],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
