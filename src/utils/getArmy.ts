import { IArmy } from 'types/army'
import { TSupportedFaction, SERAPHON, GLOOMSPITE_GITZ, SYLVANETH, IDONETH_DEEPKIN, IRONJAWZ } from 'meta/factions'

import * as GloomspiteGitz from '../army/gloomspite'
import * as IdonethDeepkin from '../army/idoneth'
import * as Ironjawz from '../army/ironjawz'
import * as Seraphon from '../army/seraphon'
import * as Sylvaneth from '../army/sylvaneth'

export const getArmy = (factionName: TSupportedFaction): IArmy => {
  return {
    [GLOOMSPITE_GITZ]: { ...GloomspiteGitz },
    [IDONETH_DEEPKIN]: { ...IdonethDeepkin },
    [IRONJAWZ]: { ...Ironjawz },
    [SERAPHON]: { ...Seraphon },
    [SYLVANETH]: { ...Sylvaneth },
  }[factionName]
}
