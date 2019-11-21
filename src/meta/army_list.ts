import { CHAOS, DEATH, DESTRUCTION, ORDER, TGrandAlliances } from 'meta/alliances'
import { IInitialArmy } from 'types/army'
import {
  BEASTS_OF_CHAOS,
  BIG_WAAAGH,
  BONESPLITTERZ,
  CHAOS_GRAND_ALLIANCE,
  CITIES_OF_SIGMAR,
  DAUGHTERS_OF_KHAINE,
  DEATH_GRAND_ALLIANCE,
  DESTRUCTION_GRAND_ALLIANCE,
  DISPOSSESSED,
  EVERCHOSEN,
  FLESH_EATER_COURTS,
  FYRESLAYERS,
  GLOOMSPITE_GITZ,
  GRAND_HOST_OF_NAGASH,
  GREENSKINZ,
  IDONETH_DEEPKIN,
  IRONJAWZ,
  KHARADRON_OVERLORDS,
  KHORNE,
  LEGION_OF_BLOOD,
  LEGION_OF_NIGHT,
  LEGION_OF_SACRAMENT,
  LEGIONS_OF_AZGORH,
  LEGIONS_OF_GRIEF,
  LETHISIAN_DEFENDERS,
  MERCENARY_COMPANIES,
  NIGHTHAUNT,
  NURGLE,
  OGOR_MAWTRIBES,
  ORDER_GRAND_ALLIANCE,
  OSSIARCH_BONEREAPERS,
  SERAPHON,
  SKAVEN,
  SLAANESH,
  SLAVES_TO_DARKNESS,
  SOULBLIGHT,
  STORMCAST_ETERNALS,
  SYLVANETH,
  TAMURKHANS_HORDE,
  TOMB_KINGS,
  TSupportedFaction,
  TZEENTCH,
  WANDERERS,
} from 'meta/factions'

import BeastsOfChaos from 'army/beasts_of_chaos'
import BigWaaagh from 'army/big_waaagh'
import Bonesplitterz from 'army/bonesplitterz'
import ChaosGrandAlliance from 'army/grand_alliances/chaos'
import CitiesOfSigmar from 'army/cities_of_sigmar'
import DaughtersOfKhaine from 'army/daughters_of_khaine'
import DeathGrandAlliance from 'army/grand_alliances/death'
import DestructionGrandAlliance from 'army/grand_alliances/destruction'
import Dispossessed from 'army/dispossessed'
import Everchosen from 'army/everchosen'
import FleshEaterCourts from 'army/flesh_eater_courts'
import Fyreslayers from 'army/fyreslayers'
import GloomspiteGitz from 'army/gloomspite'
import GrandHostOfNagash from 'army/grand_host_of_nagash'
import Greenskinz from 'army/greenskinz'
import IdonethDeepkin from 'army/idoneth'
import Ironjawz from 'army/ironjawz'
import KharadronOverlords from 'army/kharadron_overlords'
import Khorne from 'army/khorne'
import LegionOfBlood from 'army/legion_of_blood'
import LegionOfNight from 'army/legion_of_night'
import LegionOfSacrament from 'army/legion_of_sacrament'
import LegionsOfAzgorh from 'army/legions_of_azgorh'
import LegionsOfGrief from 'army/legions_of_grief'
import LethisianArmy from 'army/lethisian_army'
import MercenaryCompanies from 'army/mercenary_companies'
import Nighthaunt from 'army/nighthaunt'
import Nurgle from 'army/nurgle'
import OgorMawtribes from 'army/ogor_mawtribes'
import OrderGrandAlliance from 'army/grand_alliances/order'
import OssiarchBonereapers from 'army/ossiarch_bonereapers'
import Seraphon from 'army/seraphon'
import Skaven from 'army/skaven'
import Slaanesh from 'army/slaanesh'
import SlavesToDarkness from 'army/slaves_to_darkness'
import Soulblight from 'army/soulblight'
import StormcastEternals from 'army/stormcast_eternals'
import Sylvaneth from 'army/sylvaneth'
import TamurkhansHorde from 'army/tamurkhans_horde'
import TombKings from 'army/tomb_kings'
import Tzeentch from 'army/tzeentch'
import Wanderers from 'army/wanderers'

const ArmyList: TArmyList = {
  [BEASTS_OF_CHAOS]: {
    Army: { ...BeastsOfChaos },
    GrandAlliance: CHAOS,
  },
  [BIG_WAAAGH]: {
    Army: { ...BigWaaagh },
    GrandAlliance: DESTRUCTION,
  },
  [BONESPLITTERZ]: {
    Army: { ...Bonesplitterz },
    GrandAlliance: DESTRUCTION,
  },
  [CHAOS_GRAND_ALLIANCE]: {
    Army: { ...ChaosGrandAlliance },
    GrandAlliance: CHAOS,
  },
  [CITIES_OF_SIGMAR]: {
    Army: { ...CitiesOfSigmar },
    GrandAlliance: ORDER,
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
  [GRAND_HOST_OF_NAGASH]: {
    Army: { ...GrandHostOfNagash },
    GrandAlliance: DEATH,
  },
  [GREENSKINZ]: {
    Army: { ...Greenskinz },
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
  [LEGION_OF_BLOOD]: {
    Army: { ...LegionOfBlood },
    GrandAlliance: DEATH,
  },
  [LEGION_OF_NIGHT]: {
    Army: { ...LegionOfNight },
    GrandAlliance: DEATH,
  },
  [LEGION_OF_SACRAMENT]: {
    Army: { ...LegionOfSacrament },
    GrandAlliance: DEATH,
  },
  [LEGIONS_OF_AZGORH]: {
    Army: { ...LegionsOfAzgorh },
    GrandAlliance: CHAOS,
  },
  [LEGIONS_OF_GRIEF]: {
    Army: { ...LegionsOfGrief },
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
  [OGOR_MAWTRIBES]: {
    Army: { ...OgorMawtribes },
    GrandAlliance: DESTRUCTION,
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
  [SOULBLIGHT]: {
    Army: { ...Soulblight },
    GrandAlliance: DEATH,
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
  [TOMB_KINGS]: {
    Army: { ...TombKings },
    GrandAlliance: DEATH,
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

export const getArmyList = () => ArmyList
export const getArmyFromList = (factionName: TSupportedFaction) => ArmyList[factionName]

type TArmyList = { readonly [factionName in TSupportedFaction]: IArmyListEntry }

interface IArmyListEntry {
  readonly Army: IInitialArmy
  readonly GrandAlliance: TGrandAlliances
}
