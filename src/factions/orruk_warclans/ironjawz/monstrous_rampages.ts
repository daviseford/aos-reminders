import { tagAs } from 'factions/metatagger'
import { END_OF_CHARGE_PHASE } from 'types/phases'

const MonstrousRampages = {
  'Flattened into the Mud': {
    effects: [
      {
        name: `Flattened into the Mud`,
        desc: `Only a model in a unit that has made a charge move this turn can carry out this monstrous rampage. Pick an enemy unit with a Wounds characteristic of 1 or 2 within 3" of this unit and roll a dice. If the roll is less than this unit's momentum score, the strike-last effect applies to that enemy unit until the end of the turn.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
}

export default tagAs(MonstrousRampages, 'monstrous_rampage')
