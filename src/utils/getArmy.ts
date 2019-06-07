import { IArmy } from 'types/army'
import {
  TSupportedFaction,
  BEASTCLAW_RAIDERS,
  GLOOMSPITE_GITZ,
  IDONETH_DEEPKIN,
  IRONJAWZ,
  SERAPHON,
  SYLVANETH,
} from 'meta/factions'

import * as BeastclawRaiders from '../army/beastclaw_raiders'
import * as GloomspiteGitz from '../army/gloomspite'
import * as IdonethDeepkin from '../army/idoneth'
import * as Ironjawz from '../army/ironjawz'
import * as Seraphon from '../army/seraphon'
import * as Sylvaneth from '../army/sylvaneth'

export const getArmy = (factionName: TSupportedFaction): IArmy => {
  return {
    [BEASTCLAW_RAIDERS]: { ...BeastclawRaiders },
    [GLOOMSPITE_GITZ]: { ...GloomspiteGitz },
    [IDONETH_DEEPKIN]: { ...IdonethDeepkin },
    [IRONJAWZ]: { ...Ironjawz },
    [SERAPHON]: { ...Seraphon },
    [SYLVANETH]: { ...Sylvaneth },
  }[factionName]
}
