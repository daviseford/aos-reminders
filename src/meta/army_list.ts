import { CHAOS, DEATH, DESTRUCTION, ORDER, TGrandAlliances } from './alliances'
import { IInitialArmy } from 'types/army'
import {
  BEASTCLAW_RAIDERS,
  BEASTS_OF_CHAOS,
  BONESPLITTERZ,
  CHAOS_GRAND_ALLIANCE,
  DAUGHTERS_OF_KHAINE,
  DEATH_GRAND_ALLIANCE,
  DESTRUCTION_GRAND_ALLIANCE,
  DISPOSSESSED,
  EVERCHOSEN,
  FLESH_EATER_COURTS,
  FYRESLAYERS,
  GLOOMSPITE_GITZ,
  GUTBUSTERS,
  IDONETH_DEEPKIN,
  IRONJAWZ,
  KHARADRON_OVERLORDS,
  KHORNE,
  LEGIONS_OF_AZGORH,
  LEGIONS_OF_BLOOD,
  LEGIONS_OF_GRIEF,
  LEGIONS_OF_NAGASH,
  LETHISIAN_DEFENDERS,
  MERCENARY_COMPANIES,
  NIGHTHAUNT,
  NURGLE,
  ORDER_GRAND_ALLIANCE,
  OSSIARCH_BONEREAPERS,
  SERAPHON,
  SKAVEN,
  SLAANESH,
  SLAVES_TO_DARKNESS,
  STORMCAST_ETERNALS,
  SYLVANETH,
  TAMURKHANS_HORDE,
  TSupportedFaction,
  TZEENTCH,
  WANDERERS,
} from './factions'

import BeastclawRaiders from 'army/beastclaw_raiders'
import BeastsOfChaos from 'army/beasts_of_chaos'
import Bonesplitterz from 'army/bonesplitterz'
import ChaosGrandAlliance from 'army/grand_alliances/chaos'
import DaughtersOfKhaine from 'army/daughters_of_khaine'
import DeathGrandAlliance from 'army/grand_alliances/death'
import DestructionGrandAlliance from 'army/grand_alliances/destruction'
import Dispossessed from 'army/dispossessed'
import Everchosen from 'army/everchosen'
import FleshEaterCourts from 'army/flesh_eater_courts'
import Fyreslayers from 'army/fyreslayers'
import GloomspiteGitz from 'army/gloomspite'
import Gutbusters from 'army/gutbusters'
import IdonethDeepkin from 'army/idoneth'
import Ironjawz from 'army/ironjawz'
import KharadronOverlords from 'army/kharadron_overlords'
import Khorne from 'army/khorne'
import LegionsOfAzgorh from 'army/legions_of_azgorh'
import LegionsOfBlood from 'army/legion_of_blood'
import LegionsOfGrief from 'army/legions_of_grief'
import LegionsOfNagash from 'army/legions_of_nagash'
import LethisianArmy from 'army/lethisian_army'
import MercenaryCompanies from 'army/mercenary_companies'
import Nighthaunt from 'army/nighthaunt'
import Nurgle from 'army/nurgle'
import OrderGrandAlliance from 'army/grand_alliances/order'
import OssiarchBonereapers from 'army/ossiarch_bonereapers'
import Seraphon from 'army/seraphon'
import Skaven from 'army/skaven'
import Slaanesh from 'army/slaanesh'
import SlavesToDarkness from 'army/slaves_to_darkness'
import StormcastEternals from 'army/stormcast_eternals'
import Sylvaneth from 'army/sylvaneth'
import TamurkhansHorde from 'army/tamurkhans_horde'
import Tzeentch from 'army/tzeentch'
import Wanderers from 'army/wanderers'

export const ArmyList: TArmyList = {
  [BEASTCLAW_RAIDERS]: {
    Army: { ...BeastclawRaiders },
    GrandAlliance: DESTRUCTION,
  },
  [BEASTS_OF_CHAOS]: {
    Army: { ...BeastsOfChaos },
    GrandAlliance: CHAOS,
  },
  [BONESPLITTERZ]: {
    Army: { ...Bonesplitterz },
    GrandAlliance: DESTRUCTION,
  },
  [CHAOS_GRAND_ALLIANCE]: {
    Army: { ...ChaosGrandAlliance },
    GrandAlliance: CHAOS,
  },
  [DAUGHTERS_OF_KHAINE]: {
    Army: { ...DaughtersOfKhaine },
    GrandAlliance: ORDER,
  },
  [DEATH_GRAND_ALLIANCE]: {
    Army: { ...DeathGrandAlliance },
    GrandAlliance: DEATH,
  },
  [DESTRUCTION_GRAND_ALLIANCE]: {
    Army: { ...DestructionGrandAlliance },
    GrandAlliance: DESTRUCTION,
  },
  [DISPOSSESSED]: {
    Army: { ...Dispossessed },
    GrandAlliance: ORDER,
  },
  [EVERCHOSEN]: {
    Army: { ...Everchosen },
    GrandAlliance: CHAOS,
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
  [GUTBUSTERS]: {
    Army: { ...Gutbusters },
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
  [LEGIONS_OF_AZGORH]: {
    Army: { ...LegionsOfAzgorh },
    GrandAlliance: CHAOS,
  },
  [LEGIONS_OF_BLOOD]: {
    Army: { ...LegionsOfBlood },
    GrandAlliance: DEATH,
  },
  [LEGIONS_OF_GRIEF]: {
    Army: { ...LegionsOfGrief },
    GrandAlliance: DEATH,
  },
  [LEGIONS_OF_NAGASH]: {
    Army: { ...LegionsOfNagash },
    GrandAlliance: DEATH,
  },
  [LETHISIAN_DEFENDERS]: {
    Army: { ...LethisianArmy },
    GrandAlliance: ORDER,
  },
  [MERCENARY_COMPANIES]: {
    Army: { ...MercenaryCompanies },
    GrandAlliance: ORDER,
    //TODO: Add allyOnly tag
  },
  [NIGHTHAUNT]: {
    Army: { ...Nighthaunt },
    GrandAlliance: DEATH,
  },
  [NURGLE]: {
    Army: { ...Nurgle },
    GrandAlliance: CHAOS,
  },
  [ORDER_GRAND_ALLIANCE]: {
    Army: { ...OrderGrandAlliance },
    GrandAlliance: ORDER,
  },
  [OSSIARCH_BONEREAPERS]: {
    Army: { ...OssiarchBonereapers },
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
  [SLAANESH]: {
    Army: { ...Slaanesh },
    GrandAlliance: CHAOS,
  },
  [SLAVES_TO_DARKNESS]: {
    Army: { ...SlavesToDarkness },
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
  [TAMURKHANS_HORDE]: {
    Army: { ...TamurkhansHorde },
    GrandAlliance: CHAOS,
  },
  [TZEENTCH]: {
    Army: { ...Tzeentch },
    GrandAlliance: CHAOS,
  },
  [WANDERERS]: {
    Army: { ...Wanderers },
    GrandAlliance: ORDER,
  },
}

type TArmyList = { readonly [factionName in TSupportedFaction]: IArmyListEntry }

interface IArmyListEntry {
  readonly Army: IInitialArmy
  readonly GrandAlliance: TGrandAlliances
}
