import { tagAs } from 'factions/metatagger'
import rule_sources from 'meta/rule_sources'
import { DURING_GAME, END_OF_CHARGE_PHASE, START_OF_SETUP } from 'types/phases'

const Scenery = {
  'Awakened Wyldwood': {
    effects: [
      {
        name: `Setup`,
        desc: `After territories have been chosen but before armies are set up, you may place 1 AWAKENED WYLDWOOD wholly within your own territory more than 3" from all other terrain features and objectives.`,
        when: [START_OF_SETUP],
        rule_sources: [rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
      {
        name: `Overgrown Wilderness`,
        desc: `Visibility between 2 models is blocked is a 1mm straight line drawn between the closest points between the models passes across more than 3" of an AWAKENED WYLDWOOD. Does not apply to Sylvaneth units or models with a Wounds characteristic of 10 or more.`,
        when: [DURING_GAME],
        rule_sources: [rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
      {
        name: `Vengeful Forest Spirits`,
        desc: `Roll D6 for each unit within 1" of an AWAKENED WYLDWOOD. Add 2 to the roll is any wizards or endless spells are within 6" of that AWAKENED WYLDWOOD. On a 6+ the target suffers D3 mortal wounds. Does not apply to Sylvaneth units.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
