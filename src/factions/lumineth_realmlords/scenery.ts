import { tagAs } from 'factions/metatagger'
import { DURING_GAME, DURING_TURN } from 'types/phases'

const Scenery = {
  'Shrine Luminor': {
    effects: [
      {
        name: `Garrison`,
        desc: `The garrison of a Shrine Luminor can be a single LUMINETH REALM-LORDS HERO model that is not a MONSTER and does not have a mount. The garrison is referred to as the terrain feature's 'Shrine Guardian'.`,
        when: [DURING_GAME],
      },
      {
        name: `Cleansing Rituals`,
        desc: `Once per turn, you can reroll one casting, unbinding or dispeling roll for a friendly LUMINETH REALM-LORDS HERO that is within 12" of their terrain feature. From the second battle round onwards, if this terrain feature has a Shrine Guardian, add 12" to this ability.`,
        when: [DURING_TURN],
      },
      {
        name: `Shrine Guardian`,
        desc: `Once per turn, you can use a command ability for this terrain feature's Shrine Guardian without a command point being spent.`,
        when: [DURING_TURN],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
