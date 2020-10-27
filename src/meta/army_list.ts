import BeastsOfChaosArmy from 'army/beasts_of_chaos'
import BigWaaaghArmy from 'army/big_waaagh'
import BonesplitterzArmy from 'army/bonesplitterz'
import CitiesOfSigmarArmy from 'army/cities_of_sigmar'
import DaughtersOfKhaineArmy from 'army/daughters_of_khaine'
import DispossessedArmy from 'army/dispossessed'
import FleshEaterCourtsArmy from 'army/flesh_eater_courts'
import FyreslayersArmy from 'army/fyreslayers'
import GloomspiteGitzArmy from 'army/gloomspite_gitz'
import ChaosArmy from 'army/grand_alliances/chaos'
import DeathArmy from 'army/grand_alliances/death'
import DestructionArmy from 'army/grand_alliances/destruction'
import OrderArmy from 'army/grand_alliances/order'
import GrandHostOfNagashArmy from 'army/grand_host_of_nagash'
import GreenskinzArmy from 'army/greenskinz'
import IdonethDeepkinArmy from 'army/idoneth_deepkin'
import IronjawzArmy from 'army/ironjawz'
import KharadronOverlordsArmy from 'army/kharadron_overlords'
import KhorneArmy from 'army/khorne'
import LegionsOfAzgorhArmy from 'army/legions_of_azgorh'
import LegionsOfGriefArmy from 'army/legions_of_grief'
import LegionOfBloodArmy from 'army/legion_of_blood'
import LegionOfChaosAscendantArmy from 'army/legion_of_chaos_ascendant'
import LegionOfNightArmy from 'army/legion_of_night'
import LegionOfSacramentArmy from 'army/legion_of_sacrament'
import LethisianArmyArmy from 'army/lethisian_defenders'
import LuminethRealmlordsArmy from 'army/lumineth_realmlords'
import MercenaryCompaniesArmy from 'army/mercenary_companies'
import NighthauntArmy from 'army/nighthaunt'
import NurgleArmy from 'army/nurgle'
import OgorMawtribesArmy from 'army/ogor_mawtribes'
import OssiarchBonereapersArmy from 'army/ossiarch_bonereapers'
import SeraphonArmy from 'army/seraphon'
import SkavenArmy from 'army/skaven'
import SlaaneshArmy from 'army/slaanesh'
import SlavesToDarknessArmy from 'army/slaves_to_darkness'
import SonsOfBehematArmy from 'army/sons_of_behemat'
import SoulblightArmy from 'army/soulblight'
import StormcastEternalsArmy from 'army/stormcast_eternals'
import SylvanethArmy from 'army/sylvaneth'
import TamurkhansHordeArmy from 'army/tamurkhans_horde'
import TombKingsArmy from 'army/tomb_kings'
import TzeentchArmy from 'army/tzeentch'
import WanderersArmy from 'army/wanderers'
import { CHAOS, DEATH, DESTRUCTION, ORDER, TGrandAlliances } from 'meta/alliances'
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
  FLESH_EATER_COURTS,
  FYRESLAYERS,
  GLOOMSPITE_GITZ,
  GRAND_HOST_OF_NAGASH,
  GREENSKINZ,
  IDONETH_DEEPKIN,
  IRONJAWZ,
  KHARADRON_OVERLORDS,
  KHORNE,
  LEGIONS_OF_AZGORH,
  LEGIONS_OF_GRIEF,
  LEGION_OF_BLOOD,
  LEGION_OF_CHAOS_ASCENDANT,
  LEGION_OF_NIGHT,
  LEGION_OF_SACRAMENT,
  LETHISIAN_DEFENDERS,
  LUMINETH_REALMLORDS,
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
  SONS_OF_BEHEMAT,
  SOULBLIGHT,
  STORMCAST_ETERNALS,
  SYLVANETH,
  TAMURKHANS_HORDE,
  TOMB_KINGS,
  TSupportedFaction,
  TZEENTCH,
  WANDERERS,
} from 'meta/factions'
import { IInitialArmy } from 'types/army'

const ArmyList: TArmyList = {
  [BEASTS_OF_CHAOS]: {
    Army: { ...BeastsOfChaosArmy },
    GrandAlliance: CHAOS,
  },
  [BIG_WAAAGH]: {
    Army: { ...BigWaaaghArmy },
    GrandAlliance: DESTRUCTION,
  },
  [BONESPLITTERZ]: {
    Army: { ...BonesplitterzArmy },
    GrandAlliance: DESTRUCTION,
  },
  [CHAOS_GRAND_ALLIANCE]: {
    Army: { ...ChaosArmy },
    GrandAlliance: CHAOS,
  },
  [CITIES_OF_SIGMAR]: {
    Army: { ...CitiesOfSigmarArmy },
    GrandAlliance: ORDER,
  },
  [DAUGHTERS_OF_KHAINE]: {
    Army: { ...DaughtersOfKhaineArmy },
    GrandAlliance: ORDER,
  },
  [DEATH_GRAND_ALLIANCE]: {
    Army: { ...DeathArmy },
    GrandAlliance: DEATH,
  },
  [DESTRUCTION_GRAND_ALLIANCE]: {
    Army: { ...DestructionArmy },
    GrandAlliance: DESTRUCTION,
  },
  [DISPOSSESSED]: {
    Army: { ...DispossessedArmy },
    GrandAlliance: ORDER,
  },
  [FLESH_EATER_COURTS]: {
    Army: { ...FleshEaterCourtsArmy },
    GrandAlliance: DEATH,
  },
  [FYRESLAYERS]: {
    Army: { ...FyreslayersArmy },
    GrandAlliance: ORDER,
  },
  [GLOOMSPITE_GITZ]: {
    Army: { ...GloomspiteGitzArmy },
    GrandAlliance: DESTRUCTION,
  },
  [GRAND_HOST_OF_NAGASH]: {
    Army: { ...GrandHostOfNagashArmy },
    GrandAlliance: DEATH,
  },
  [GREENSKINZ]: {
    Army: { ...GreenskinzArmy },
    GrandAlliance: DESTRUCTION,
  },
  [IDONETH_DEEPKIN]: {
    Army: { ...IdonethDeepkinArmy },
    GrandAlliance: ORDER,
  },
  [IRONJAWZ]: {
    Army: { ...IronjawzArmy },
    GrandAlliance: DESTRUCTION,
  },
  [KHARADRON_OVERLORDS]: {
    Army: { ...KharadronOverlordsArmy },
    GrandAlliance: ORDER,
  },
  [KHORNE]: {
    Army: { ...KhorneArmy },
    GrandAlliance: CHAOS,
  },
  [LEGION_OF_BLOOD]: {
    Army: { ...LegionOfBloodArmy },
    GrandAlliance: DEATH,
  },
  [LEGION_OF_CHAOS_ASCENDANT]: {
    Army: { ...LegionOfChaosAscendantArmy },
    GrandAlliance: CHAOS,
  },
  [LEGION_OF_NIGHT]: {
    Army: { ...LegionOfNightArmy },
    GrandAlliance: DEATH,
  },
  [LEGION_OF_SACRAMENT]: {
    Army: { ...LegionOfSacramentArmy },
    GrandAlliance: DEATH,
  },
  [LEGIONS_OF_AZGORH]: {
    Army: { ...LegionsOfAzgorhArmy },
    GrandAlliance: CHAOS,
  },
  [LEGIONS_OF_GRIEF]: {
    Army: { ...LegionsOfGriefArmy },
    GrandAlliance: DEATH,
  },
  [LETHISIAN_DEFENDERS]: {
    Army: { ...LethisianArmyArmy },
    GrandAlliance: ORDER,
  },
  [LUMINETH_REALMLORDS]: {
    Army: { ...LuminethRealmlordsArmy },
    GrandAlliance: ORDER,
  },
  [MERCENARY_COMPANIES]: {
    Army: { ...MercenaryCompaniesArmy },
    GrandAlliance: ORDER,
    //TODO: Add allyOnly tag
  },
  [NIGHTHAUNT]: {
    Army: { ...NighthauntArmy },
    GrandAlliance: DEATH,
  },
  [NURGLE]: {
    Army: { ...NurgleArmy },
    GrandAlliance: CHAOS,
  },
  [OGOR_MAWTRIBES]: {
    Army: { ...OgorMawtribesArmy },
    GrandAlliance: DESTRUCTION,
  },
  [ORDER_GRAND_ALLIANCE]: {
    Army: { ...OrderArmy },
    GrandAlliance: ORDER,
  },
  [OSSIARCH_BONEREAPERS]: {
    Army: { ...OssiarchBonereapersArmy },
    GrandAlliance: DEATH,
  },
  [SERAPHON]: {
    Army: { ...SeraphonArmy },
    GrandAlliance: ORDER,
  },
  [SKAVEN]: {
    Army: { ...SkavenArmy },
    GrandAlliance: CHAOS,
  },
  [SLAANESH]: {
    Army: { ...SlaaneshArmy },
    GrandAlliance: CHAOS,
  },
  [SLAVES_TO_DARKNESS]: {
    Army: { ...SlavesToDarknessArmy },
    GrandAlliance: CHAOS,
  },
  [SONS_OF_BEHEMAT]: {
    Army: { ...SonsOfBehematArmy },
    GrandAlliance: DESTRUCTION,
  },
  [SOULBLIGHT]: {
    Army: { ...SoulblightArmy },
    GrandAlliance: DEATH,
  },
  [STORMCAST_ETERNALS]: {
    Army: { ...StormcastEternalsArmy },
    GrandAlliance: ORDER,
  },
  [SYLVANETH]: {
    Army: { ...SylvanethArmy },
    GrandAlliance: ORDER,
  },
  [TAMURKHANS_HORDE]: {
    Army: { ...TamurkhansHordeArmy },
    GrandAlliance: CHAOS,
  },
  [TOMB_KINGS]: {
    Army: { ...TombKingsArmy },
    GrandAlliance: DEATH,
  },
  [TZEENTCH]: {
    Army: { ...TzeentchArmy },
    GrandAlliance: CHAOS,
  },
  [WANDERERS]: {
    Army: { ...WanderersArmy },
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
