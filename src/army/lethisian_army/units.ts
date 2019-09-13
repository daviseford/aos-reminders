import { removeUnits } from 'utils/filterUtils'
import Fyreslayers from 'army/fyreslayers'
import IdonethDeepkin from 'army/idoneth'
import KharadronOverlords from 'army/kharadron_overlords'
import StormcastEternals from 'army/stormcast_eternals'
import { TBattalions, TUnits } from 'types/army'
import { COMBAT_PHASE, DURING_SETUP, HERO_PHASE } from 'types/phases'

// Importing valid SCE units.
// All units valid except Hammers of Sigmar (named).
const getStormcastUnits = () => {
  const listOfUnits = [
    `Astreia Solbright`,
    `Aventis Firestrike`,
    `Gavriel Sureheart`,
    `Neave Blacktalon`,
    `Steelheart's Champions`,
    `The Farstriders`,
    `Vandus Hammerhand`,
  ]
  return removeUnits(StormcastEternals.Units, listOfUnits)
}

// Importing valid IDK units.
// All units valid except Volturnos.
const getIdonethUnits = () => {
  return removeUnits(IdonethDeepkin.Units, [`Volturnos, High King of the Deep`])
}

// Importing valid KO units.
const getKharadronUnits = () => KharadronOverlords.Units

// Importing valid FS units.
// All units valid except Fjul-Grimnir and Chosen Axes.
const getFyreslayerUnits = () => {
  return removeUnits(Fyreslayers.Units, [`Fjul-Grimnir`, `The Chosen Axes`])
}

export const AlliedUnits: TUnits = [
  ...getFyreslayerUnits(),
  ...getIdonethUnits(),
  ...getKharadronUnits(),
  ...getStormcastUnits(),
]

// Unit Names
export const Units: TUnits = [
  // Add warpriest manually until Cities of Sigmar is released.
  {
    name: `Excelsior Warpriest`,
    effects: [
      {
        name: `Light of Sigmar`,
        desc: `Prayer is answered on a 3+. If successful, pick one unit within 10" of the priest. Selected friendly unit heal 1 wound (Order units heal D3 instead). Selected enemy unit suffers 1 mortal wound (Chaos units suffer D3 instead).`,
        when: [HERO_PHASE],
      },
      {
        name: `Divine Power`,
        desc: `This model can attempt to unbind 1 spell as if it were a wizard.`,
        when: [HERO_PHASE],
      },
      {
        name: `Loyal Companion`,
        desc: `After setting up the Warpriest, you can set up 1 Gryph-hound within 3" of this model. The Gryph-hound is bound to that Warpriest.`,
        when: [DURING_SETUP],
      },
      {
        name: `Loyal Companion`,
        desc: `If the Gryph-hound is within 3" its bound Warpriest, it makes 4 attacks rather than 2.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = []
