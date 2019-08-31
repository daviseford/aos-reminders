import { uniqBy } from 'lodash'
import DaughtersOfKhaine from 'army/daughters_of_khaine'
import Dispossessed from 'army/dispossessed'
import Fyreslayers from 'army/fyreslayers'
import IdonethDeepkin from 'army/idoneth'
import KharadronOverlords from 'army/kharadron_overlords'
import Seraphon from 'army/seraphon'
import StormcastEternals from 'army/stormcast_eternals'
import Sylvaneth from 'army/sylvaneth'
import { TUnits } from 'types/army'
import { DURING_GAME, SHOOTING_PHASE } from 'types/phases'

export const MonstrousArcanumOrder: TUnits = [
  {
    name: `Carmine Dragon`,
    effects: [
      {
        name: `Deathly Dark Scales`,
        desc: `Roll a dice each time you allocate a mortal wound to this unit. On a 5+, that mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Soul-sheering Blast`,
        desc: `Do not use the attack sequence for an attack made with a Soul-sheering Blast. Instead roll a dice. On a 5+, the target unit suffers D6 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Spell Devourer`,
        desc: `Each time this model is affected by a spell or endless spell, you can roll a dice. If you do so, on a 4+, ignore the effects of that spell on this model.`,
        when: [DURING_GAME],
      },
    ],
  },
]

// Unit Names
export const Units: TUnits = uniqBy(
  [
    ...DaughtersOfKhaine.Units,
    ...Dispossessed.Units,
    ...Fyreslayers.Units,
    ...IdonethDeepkin.Units,
    ...KharadronOverlords.Units,
    ...MonstrousArcanumOrder,
    ...Seraphon.Units,
    ...StormcastEternals.Units,
    ...Sylvaneth.Units,
  ],
  'name'
)
