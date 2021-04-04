import { tagAs } from 'factions/metatagger'
import { HERO_PHASE, SAVES_PHASE } from 'types/phases'

const Battalions = {
  'Lords of Sacrament': {
    effects: [
      {
        name: `Unearthly Focus`,
        desc: `In your hero phase, each WIZARD from the Lords of Sacrament may cast an additional spell whilst they are within 6" of the battalion's Mortis Engine.`,
        when: [HERO_PHASE],
      },
      {
        name: `Swirling Spirits`,
        desc: `In the shooting phase, add 1 to save rolls for units from the Lords of Sacrament whilst they are within 6" of the battalion's Mortis Engine.`,
        when: [SAVES_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(Battalions, 'battalion')
