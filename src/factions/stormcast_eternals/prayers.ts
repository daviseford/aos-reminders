import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Prayers = {
  'Divine Light': {
    effects: [
      {
        name: `Divine Light`,
        desc: `Answer value of 3 and a range of 12" if the chanter is a KNIGHT or 18" if the chanter is a LORD. If answered, pick 1 enemy unit within range and visible to the chanter. You can reroll hit rolls of 1 for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Translocation: {
    effects: [
      {
        name: `Translocation`,
        desc: `Answer value of 3 and a range of 9" if the chanter is a KNIGHT or 12" if the chanter is a LORD, If answered, pick 1 friendly STORMCAST ETERNALS unit wholly within range and visible to the chanter. You can remove that unit from the battlefield and set it up again anywhere on the battlefield more than 9" from all enemy units.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Bless Weapons': {
    effects: [
      {
        name: `Bless Weapons`,
        desc: `Answer value of 3 and a range of 12" if the chanter is a KNIGHT or 18" if the chanter is a LORD. If answered, pick 1 friendly STORMCAST ETERNALS unit wholly within range and visible to the chanter. Until your next hero phase, if the unmodified hit roll for an attack made by that unit is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
