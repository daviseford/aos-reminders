import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_CHARGE_PHASE } from 'types/phases'

const MonstrousRampages = {
  'Paralysing Venom': {
    effects: [
      {
        name: `Paralysing Venom`,
        desc: `Pick 1 enemy MONSTER that made a charge move this turn and is within 3" of this unit. Roll a dice. On a 3+, the strike-last effect applies to that enemy MONSTER until the end of the turn.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(MonstrousRampages, 'monstrous_rampage')
