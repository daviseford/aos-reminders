import {
  BEASTCLAW_RAIDERS,
  DAUGHTERS_OF_KHAINE,
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
  NURGLE,
  SERAPHON,
  SKAVEN,
  SLAANESH,
  STORMCAST_ETERNALS,
  SYLVANETH,
  TZEENTCH,
  TSupportedFaction,
} from './factions'
import { CHAOS, DEATH, DESTRUCTION, ORDER, TGrandAlliances } from './alliances'
import { IArmyWithoutGame } from 'types/army'

import BeastclawRaiders from 'army/beastclaw_raiders'
import DaughtersOfKhaine from 'army/daughters_of_khaine'
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
import Nurgle from 'army/nurgle'
import Seraphon from 'army/seraphon'
import Skaven from 'army/skaven'
import Slaanesh from 'army/slaanesh'
import StormcastEternals from 'army/stormcast_eternals'
import Sylvaneth from 'army/sylvaneth'
import Tzeentch from 'army/tzeentch'

const ArmyList: TArmyList = {
  [BEASTCLAW_RAIDERS]: {
    Army: { ...BeastclawRaiders },
    GrandAlliance: DESTRUCTION,
  },
  [DAUGHTERS_OF_KHAINE]: {
    Army: { ...DaughtersOfKhaine },
    GrandAlliance: ORDER,
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
  [NURGLE]: {
    Army: { ...Nurgle },
    GrandAlliance: CHAOS,
  },
  [SERAPHON]: {
    Army: { ...Seraphon },
    GrandAlliance: ORDER,
  },
  [SKAVEN]: {
    Army: { ...Skaven },
    GrandAlliance: CHAOS,
  },
  [SLAANESH]: {
    Army: { ...Slaanesh },
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
