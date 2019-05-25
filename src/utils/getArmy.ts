import * as Seraphon from '../army/seraphon'
import * as GloomspiteGitz from '../army/gloomspite'
import * as IdonethDeepkin from '../army/idoneth'
import { TSupportedFaction, SERAPHON, GLOOMSPITE_GITZ, IDONETH_DEEPKIN } from 'meta/factions'
import { IArmy } from 'types/army'

export const getArmy = (factionName: TSupportedFaction): IArmy => {
  return {
    [SERAPHON]: { ...Seraphon },
    [GLOOMSPITE_GITZ]: { ...GloomspiteGitz },
    [IDONETH_DEEPKIN]: { ...IdonethDeepkin },
  }[factionName]
}
