import * as Seraphon from '../army/seraphon'
import * as GloomspiteGitz from '../army/gloomspite'
import { TSupportedFaction, SERAPHON, GLOOMSPITE_GITZ } from 'meta/factions'
import { IArmy } from 'types/army'

export const getArmy = (factionName: TSupportedFaction): IArmy => {
  return {
    [SERAPHON]: { ...Seraphon },
    [GLOOMSPITE_GITZ]: { ...GloomspiteGitz },
  }[factionName]
}
