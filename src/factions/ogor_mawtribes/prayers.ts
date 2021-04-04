import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Prayers = {
  'Pulverising Hailstorm': {
    effects: [
      {
        name: `Pulverising Hailstorm`,
        desc: `This prayer is answered on a 4+. If this prayer is answered, pick a point on the battlefield within 18" of the model chanting this prayer. Roll 1 dice for each unit within 3" of that point. On a 3+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Keening Gale': {
    effects: [
      {
        name: `Keening Gale`,
        desc: `This prayer is answered on a 4+. If this prayer is answered, pick 1 friendly MONSTER or MOURNFANG PACK unit wholly within 18" of the model chanting this prayer. Until the start of your next hero phase, add 3" to that unit's Move characteristic.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Call of the Blizzard': {
    effects: [
      {
        name: `Call of the Blizzard`,
        desc: `This prayer is answered on a 4+. If this prayer is answered, pick 1 friendly unit of ICEFALL YHETEES within 18" of the model chanting this prayer that is visible to them. You can return 1 slain model to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
