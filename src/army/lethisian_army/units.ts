import { TBattalions, TUnits } from 'types/army'
import { COMBAT_PHASE, DURING_SETUP, HERO_PHASE } from 'types/phases'
import StormcastEternals from 'army/stormcast_eternals'
import IdonethDeepkin from 'army/idoneth'
import KharadronOverlords from 'army/kharadron_overlords'
import Fyreslayers from 'army/fyreslayers'

// Importing valid SCE units.
// All units valid except Hammers of Sigmar (named).
const getStormcastUnits = () => {
  const listOfUnits = [
    `Aventis Firestrike`,
    `Astreia Solbright`,
    `Vandus Hammerhand`,
    `Neave Blacktalon`,
    `Gavriel Sureheart`,
    `Steelheart's Champions`,
    `The Farstriders`,
  ]
  return StormcastEternals.Units.filter(unit => !listOfUnits.includes(unit.name))
}

// Importing valid IDK units.
// All units valid except Volturnos.
const getIdonethUnits = () => {
  const listOfUnits = [`Volturnos, High King of the Deep`]
  return IdonethDeepkin.Units.filter(unit => !listOfUnits.includes(unit.name))
}

// Importing valid KO units.
const getKharadronUnits = () => {
  return KharadronOverlords.Units
}

// Importing valid FS units.
// All units valid except Chosen Axes.
const getFyreslayerUnits = () => {
  const listOfUnits = [`Fjul-Grimnir`, `The Chosen Axes`]
  return Fyreslayers.Units.filter(unit => !listOfUnits.includes(unit.name))
}

// Unit Names
export const Units: TUnits = [
  // Import valid army units.
  ...getStormcastUnits(),
  ...getIdonethUnits(),
  ...getKharadronUnits(),
  ...getFyreslayerUnits(),
  // Add warpriest manually until Cities of Sigmar is released.
  {
    name: `Excelsior Warpriest`,
    effects: [
      {
        name: `Light of Sigmar`,
        desc: `Prayer is answered on a 3+.  If successful, pick one unit within 10" of the priest.  Selected friendly unit heal 1 wound (Order units heal D3 instead).  Selected enemy unit suffers 1 mortal wound (Chaos units suffer D3 instead).`,
        when: [HERO_PHASE],
      },
      {
        name: `Divine Power`,
        desc: `This model can attempt to unbind 1 spell as if it were a wizard.`,
        when: [HERO_PHASE],
      },
      {
        name: `Loyal Companion`,
        desc: `After setting up the Warpriest, you can set up 1 Gryph-hound within 3" of this model.  The Gryph-hound is bound to that Warpriest.`,
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
