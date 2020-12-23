import { keyPicker, tagAs } from 'factions/metatagger'
import { DURING_SETUP } from 'types/phases'
import Units from './units'

const Battalions = {
  'Waystone Pathfinders': {
    mandatory: {
      units: [keyPicker(Units, ['Nomad Prince', 'Spellweaver'])],
    },
    effects: [
      {
        name: `Realm Wanderers`,
        desc: `Instead of setting up units in this battalion on the battlefield, you can place them to one side. In your first movement phase, set up all of these wholly within 6" of the edges of the battlefield, and more than 9" from any enemy models. This is each unit's move for that movement phase.`,
        when: [DURING_SETUP],
      },
      {
        name: `Protective Volley`,
        desc: `In your hero phase, pick one enemy unit within 12" of the battalions Nomad Prince. All other Waystone Pathfinder units can immediately make a shooting attack against the unit as if it were the shooting phase.`,
        when: [DURING_SETUP],
      },
    ],
  },
}

export default tagAs(Battalions, 'battalion')
