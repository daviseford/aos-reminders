import {
  BEASTCLAW_RAIDERS,
  GLOOMSPITE_GITZ,
  IDONETH_DEEPKIN,
  IRONJAWZ,
  SERAPHON,
  SYLVANETH,
  TSupportedFaction,
} from './factions'
import { ORDER, DESTRUCTION, TGrandAlliances } from './alliances'
import { IArmy } from 'types/army'

import * as BeastclawRaiders from '../army/beastclaw_raiders'
import * as GloomspiteGitz from '../army/gloomspite'
import * as IdonethDeepkin from '../army/idoneth'
import * as Ironjawz from '../army/ironjawz'
import * as Seraphon from '../army/seraphon'
import * as Sylvaneth from '../army/sylvaneth'

const ArmyList: TArmyList = {
  [BEASTCLAW_RAIDERS]: {
    Army: { ...BeastclawRaiders },
    GrandAlliance: DESTRUCTION,
  },
  [GLOOMSPITE_GITZ]: {
    Army: { ...GloomspiteGitz },
    GrandAlliance: DESTRUCTION,
  },
  [IDONETH_DEEPKIN]: {
    Army: { ...IdonethDeepkin },
    GrandAlliance: ORDER,
  },
  [IRONJAWZ]: {
    Army: { ...Ironjawz },
    GrandAlliance: DESTRUCTION,
  },
  [SERAPHON]: {
    Army: { ...Seraphon },
    GrandAlliance: ORDER,
  },
  [SYLVANETH]: {
    Army: { ...Sylvaneth },
    GrandAlliance: ORDER,
  },
}

export default ArmyList

type TArmyList = { [factionName in TSupportedFaction]: IArmyListEntry }

interface IArmyListEntry {
  Army: IArmy
  GrandAlliance: TGrandAlliances
}
