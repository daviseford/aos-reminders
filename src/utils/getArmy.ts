import { TSupportedFaction, SERAPHON, GLOOMSPITE_GITZ, SYLVANETH } from 'meta/factions'
import { IArmy } from 'types/army'

import * as GloomspiteGitz from '../army/gloomspite'
import * as Seraphon from '../army/seraphon'
import * as Sylvaneth from '../army/sylvaneth'

export const getArmy = (factionName: TSupportedFaction): IArmy => {
  return {
    [GLOOMSPITE_GITZ]: { ...GloomspiteGitz },
    [SERAPHON]: { ...Seraphon },
    [SYLVANETH]: { ...Sylvaneth },
  }[factionName]
}
