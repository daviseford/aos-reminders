import {
  BEASTCLAW_RAIDERS,
  DISPOSSESSED,
  FLESH_EATER_COURTS,
  GLOOMSPITE_GITZ,
  IDONETH_DEEPKIN,
  IRONJAWZ,
  KHARADRON_OVERLORDS,
  KHORNE,
  NIGHTHAUNT,
  SERAPHON,
  SKAVEN,
  SYLVANETH,
  TZEENTCH,
  LEGIONS_OF_NAGASH,
  TSupportedFaction,
} from './factions'
import { CHAOS, DEATH, DESTRUCTION, ORDER, TGrandAlliances } from './alliances'
import { IArmyWithoutGame } from 'types/army'

import BeastclawRaiders from 'army/beastclaw_raiders'
import Dispossessed from 'army/dispossessed'
import FleshEaterCourts from 'army/flesh_eater_courts'
import GloomspiteGitz from 'army/gloomspite'
import IdonethDeepkin from 'army/idoneth'
import Ironjawz from 'army/ironjawz'
import KharadronOverlords from 'army/kharadron_overlords'
import Khorne from 'army/khorne'
import Nighthaunt from 'army/nighthaunt'
import Seraphon from 'army/seraphon'
import Skaven from 'army/skaven'
import Sylvaneth from 'army/sylvaneth'
import Tzeentch from 'army/tzeentch'
import LegionsofNagash from 'army/legions_of_nagash'

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
  [SYLVANETH]: {
    Army: { ...Sylvaneth },
    GrandAlliance: ORDER,
  },
  [TZEENTCH]: {
    Army: { ...Tzeentch },
    GrandAlliance: CHAOS,
  },
  [LEGIONS_OF_NAGASH]: {
    Army: { ...LegionsofNagash },
    GrandAlliance: DEATH,
  },
}

export default ArmyList

type TArmyList = { [factionName in TSupportedFaction]: IArmyListEntry }

interface IArmyListEntry {
  Army: IArmyWithoutGame
  GrandAlliance: TGrandAlliances
}
