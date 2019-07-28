import {
  BEASTCLAW_RAIDERS,
  DISPOSSESSED,
  FLESH_EATER_COURTS,
  FYRESLAYERS,
  GLOOMSPITE_GITZ,
  IDONETH_DEEPKIN,
  IRONJAWZ,
  KHARADRON_OVERLORDS,
  KHORNE,
  LEGIONS_OF_NAGASH,
  NIGHTHAUNT,
  SERAPHON,
  SKAVEN,
  STORMCAST_ETERNALS,
  SYLVANETH,
  TZEENTCH,
  TSupportedFaction,
} from './factions'
import { CHAOS, DEATH, DESTRUCTION, ORDER, TGrandAlliances } from './alliances'
import { IArmyWithoutGame } from 'types/army'

import BeastclawRaiders from 'army/beastclaw_raiders'
import Dispossessed from 'army/dispossessed'
import FleshEaterCourts from 'army/flesh_eater_courts'
import Fyreslayers from 'army/fyreslayers'
import GloomspiteGitz from 'army/gloomspite'
import IdonethDeepkin from 'army/idoneth'
import Ironjawz from 'army/ironjawz'
import KharadronOverlords from 'army/kharadron_overlords'
import Khorne from 'army/khorne'
import LegionsOfNagash from 'army/legions_of_nagash'
import Nighthaunt from 'army/nighthaunt'
import Seraphon from 'army/seraphon'
import Skaven from 'army/skaven'
import StormcastEternals from 'army/stormcast_eternals'
import Sylvaneth from 'army/sylvaneth'
import Tzeentch from 'army/tzeentch'

const ArmyList: TArmyList = {
  [BEASTCLAW_RAIDERS]: {
    Army: { ...BeastclawRaiders },
    GrandAlliance: DESTRUCTION,
  },
  [DISPOSSESSED]: {
    Army: { ...Dispossessed },
    GrandAlliance: ORDER,
  },
  [FLESH_EATER_COURTS]: {
    Army: { ...FleshEaterCourts },
    GrandAlliance: DEATH,
  },
  [FYRESLAYERS]: {
    Army: { ...Fyreslayers },
    GrandAlliance: ORDER,
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
  [KHARADRON_OVERLORDS]: {
    Army: { ...KharadronOverlords },
    GrandAlliance: ORDER,
  },
  [KHORNE]: {
    Army: { ...Khorne },
    GrandAlliance: CHAOS,
  },
  [LEGIONS_OF_NAGASH]: {
    Army: { ...LegionsOfNagash },
    GrandAlliance: DEATH,
  },
  [NIGHTHAUNT]: {
    Army: { ...Nighthaunt },
    GrandAlliance: DEATH,
  },
  [SERAPHON]: {
    Army: { ...Seraphon },
    GrandAlliance: ORDER,
  },
  [SKAVEN]: {
    Army: { ...Skaven },
    GrandAlliance: CHAOS,
  },
  [STORMCAST_ETERNALS]: {
    Army: { ...StormcastEternals },
    GrandAlliance: ORDER,
  },
  [SYLVANETH]: {
    Army: { ...Sylvaneth },
    GrandAlliance: ORDER,
  },
  [TZEENTCH]: {
    Army: { ...Tzeentch },
    GrandAlliance: CHAOS,
  },
}

export default ArmyList

type TArmyList = { [factionName in TSupportedFaction]: IArmyListEntry }

interface IArmyListEntry {
  Army: IArmyWithoutGame
  GrandAlliance: TGrandAlliances
}
