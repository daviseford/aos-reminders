import {
  BEASTCLAW_RAIDERS,
  GLOOMSPITE_GITZ,
  IDONETH_DEEPKIN,
  IRONJAWZ,
  SERAPHON,
  SYLVANETH,
  TSupportedFaction,
  FLESH_EATER_COURTS,
} from './factions'
import { ORDER, DESTRUCTION, TGrandAlliances, DEATH } from './alliances'
import { IArmyWithoutGame } from 'types/army'

import BeastclawRaiders from '../army/beastclaw_raiders'
import FleshEaterCourts from '../army/flesh_eater_courts'
import GloomspiteGitz from '../army/gloomspite'
import IdonethDeepkin from '../army/idoneth'
import Ironjawz from '../army/ironjawz'
import Seraphon from '../army/seraphon'
import Sylvaneth from '../army/sylvaneth'

const ArmyList: TArmyList = {
  [BEASTCLAW_RAIDERS]: {
    Army: { ...BeastclawRaiders },
    GrandAlliance: DESTRUCTION,
  },
  [FLESH_EATER_COURTS]: {
    Army: { ...FleshEaterCourts },
    GrandAlliance: DEATH,
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
  Army: IArmyWithoutGame
  GrandAlliance: TGrandAlliances
}
