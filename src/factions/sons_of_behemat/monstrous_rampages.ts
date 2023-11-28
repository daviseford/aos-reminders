import { tagAs } from 'factions/metatagger'
import { END_OF_CHARGE_PHASE } from 'types/phases'

const MonstrousRampages = {
  'Beast Grapple': {
    effects: [
      {
        name: `Beast Grapple`,
        desc: `Pick 1 enemy MONSTER within 3" of this unit and roll a dice. On a 3+, until the end of the following combat phase, the strike-last effect applies to both that Monster and the unit carrying out this monstrous rampage.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Earth-shaking Roar': {
    effects: [
      {
        name: `Earth-shaking Roar`,
        desc: `Pick 1 enemy unit with a Wounds characteristic of 1 or 2 within 3" of this unit and roll 2D6. If the roll is higher than that unit's Bravery characteristic, for each point by which the roll exceeds the unit's Bravery characteristic, 1 model in that unit flees. That unit's commanding player decides which models flee. The effect of this monstrous rampage is not considered to be a battleshock test.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Colossal Slam': {
    effects: [
      {
        name: `Colossal Slam`,
        desc: `Pick 1 enemy MONSTER that is not part of a unit consisting of 2 or more models and that is within 1/2" of this unit. Roll a dice. On a 3+, you can remove that MONSTER from the battlefield and set it up again anywhere wholly on open ground within 1/2" of this unit. That MONSTER suffers D3 mortal wounds. In addition, subtract 1 from hit rolls for attacks made by the unit carrying out this monstrous rampage until the end of the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  "The King's Stomp": {
    effects: [
      {
        name: `The King's Stomp`,
        desc: `Only a model that has made a charge move in the same phase can carry out this monstrous rampage. This model can make a 3D6" move but it must finish that move within 3" of any enemy units. When it makes a move in this way, it can pass across models and terrain features in the same manner as a unit that can fly. At the end of the move, roll a dice for each unit it passed across. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
}

export default tagAs(MonstrousRampages, 'monstrous_rampage')
