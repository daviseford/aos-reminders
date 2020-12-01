import { SeraphonFaction } from 'factions/seraphon'
import { SlaaneshFaction } from 'factions/slaanesh'
import { temporaryAdapter } from 'factions/temporaryAdapter'
import { CHAOS, ORDER, TGrandAlliances } from 'meta/alliances'
import { SERAPHON, SLAANESH, TSupportedFaction } from 'meta/factions'
import { TInitialArmy } from 'types/army'

const SlaaneshNew = temporaryAdapter(SlaaneshFaction, 'INVADERS')
const SeraphonNew = temporaryAdapter(SeraphonFaction, 'COALESCED')
console.log(SlaaneshNew)
console.log(SeraphonNew)

// Enable as you add them to /factions/

const ArmyList: TArmyList = {
  // [BEASTS_OF_CHAOS]: {
  //   Army: { ...BeastsOfChaosArmy },
  //   GrandAlliance: CHAOS,
  // },
  // [BIG_WAAAGH]: {
  //   Army: { ...BigWaaaghArmy },
  //   GrandAlliance: DESTRUCTION,
  // },
  // [BONESPLITTERZ]: {
  //   Army: { ...BonesplitterzArmy },
  //   GrandAlliance: DESTRUCTION,
  // },
  // [CHAOS_GRAND_ALLIANCE]: {
  //   Army: { ...ChaosArmy },
  //   GrandAlliance: CHAOS,
  // },
  // [CITIES_OF_SIGMAR]: {
  //   Army: { ...CitiesOfSigmarArmy },
  //   GrandAlliance: ORDER,
  // },
  // [DAUGHTERS_OF_KHAINE]: {
  //   Army: { ...DaughtersOfKhaineArmy },
  //   GrandAlliance: ORDER,
  // },
  // [DEATH_GRAND_ALLIANCE]: {
  //   Army: { ...DeathArmy },
  //   GrandAlliance: DEATH,
  // },
  // [DESTRUCTION_GRAND_ALLIANCE]: {
  //   Army: { ...DestructionArmy },
  //   GrandAlliance: DESTRUCTION,
  // },
  // [DISPOSSESSED]: {
  //   Army: { ...DispossessedArmy },
  //   GrandAlliance: ORDER,
  // },
  // [FLESH_EATER_COURTS]: {
  //   Army: { ...FleshEaterCourtsArmy },
  //   GrandAlliance: DEATH,
  // },
  // [FYRESLAYERS]: {
  //   Army: { ...FyreslayersArmy },
  //   GrandAlliance: ORDER,
  // },
  // [GLOOMSPITE_GITZ]: {
  //   Army: { ...GloomspiteGitzArmy },
  //   GrandAlliance: DESTRUCTION,
  // },
  // [GRAND_HOST_OF_NAGASH]: {
  //   Army: { ...GrandHostOfNagashArmy },
  //   GrandAlliance: DEATH,
  // },
  // [GREENSKINZ]: {
  //   Army: { ...GreenskinzArmy },
  //   GrandAlliance: DESTRUCTION,
  // },
  // [IDONETH_DEEPKIN]: {
  //   Army: { ...IdonethDeepkinArmy },
  //   GrandAlliance: ORDER,
  // },
  // [IRONJAWZ]: {
  //   Army: { ...IronjawzArmy },
  //   GrandAlliance: DESTRUCTION,
  // },
  // [KHARADRON_OVERLORDS]: {
  //   Army: { ...KharadronOverlordsArmy },
  //   GrandAlliance: ORDER,
  // },
  // [KHORNE]: {
  //   Army: { ...KhorneArmy },
  //   GrandAlliance: CHAOS,
  // },
  // [LEGION_OF_BLOOD]: {
  //   Army: { ...LegionOfBloodArmy },
  //   GrandAlliance: DEATH,
  // },
  // [LEGION_OF_CHAOS_ASCENDANT]: {
  //   Army: { ...LegionOfChaosAscendantArmy },
  //   GrandAlliance: CHAOS,
  // },
  // [LEGION_OF_NIGHT]: {
  //   Army: { ...LegionOfNightArmy },
  //   GrandAlliance: DEATH,
  // },
  // [LEGION_OF_SACRAMENT]: {
  //   Army: { ...LegionOfSacramentArmy },
  //   GrandAlliance: DEATH,
  // },
  // [LEGIONS_OF_AZGORH]: {
  //   Army: { ...LegionsOfAzgorhArmy },
  //   GrandAlliance: CHAOS,
  // },
  // [LEGIONS_OF_GRIEF]: {
  //   Army: { ...LegionsOfGriefArmy },
  //   GrandAlliance: DEATH,
  // },
  // [LETHISIAN_DEFENDERS]: {
  //   Army: { ...LethisianArmyArmy },
  //   GrandAlliance: ORDER,
  // },
  // [LUMINETH_REALMLORDS]: {
  //   Army: { ...LuminethRealmlordsArmy },
  //   GrandAlliance: ORDER,
  // },
  // [MEGA_GARGANT_MERCENARIES]: {
  //   Army: { ...MegaGargantMercenariesArmy },
  //   GrandAlliance: DESTRUCTION,
  // },
  // [MERCENARY_COMPANIES]: {
  //   Army: { ...MercenaryCompaniesArmy },
  //   GrandAlliance: ORDER,
  // },
  // [NIGHTHAUNT]: {
  //   Army: { ...NighthauntArmy },
  //   GrandAlliance: DEATH,
  // },
  // [NURGLE]: {
  //   Army: { ...NurgleArmy },
  //   GrandAlliance: CHAOS,
  // },
  // [OGOR_MAWTRIBES]: {
  //   Army: { ...OgorMawtribesArmy },
  //   GrandAlliance: DESTRUCTION,
  // },
  // [ORDER_GRAND_ALLIANCE]: {
  //   Army: { ...OrderArmy },
  //   GrandAlliance: ORDER,
  // },
  // [OSSIARCH_BONEREAPERS]: {
  //   Army: { ...OssiarchBonereapersArmy },
  //   GrandAlliance: DEATH,
  // },
  [SERAPHON]: {
    // Army: { ...SeraphonArmy },
    Army: { ...SeraphonNew },
    GrandAlliance: ORDER,
  },
  // [SKAVEN]: {
  //   Army: { ...SkavenArmy },
  //   GrandAlliance: CHAOS,
  // },
  [SLAANESH]: {
    // Army: { ...SlaaneshArmy },
    Army: { ...SlaaneshNew },
    GrandAlliance: CHAOS,
  },
  // [SLAVES_TO_DARKNESS]: {
  //   Army: { ...SlavesToDarknessArmy },
  //   GrandAlliance: CHAOS,
  // },
  // [SONS_OF_BEHEMAT]: {
  //   Army: { ...SonsOfBehematArmy },
  //   GrandAlliance: DESTRUCTION,
  // },
  // [SOULBLIGHT]: {
  //   Army: { ...SoulblightArmy },
  //   GrandAlliance: DEATH,
  // },
  // [STORMCAST_ETERNALS]: {
  //   Army: { ...StormcastEternalsArmy },
  //   GrandAlliance: ORDER,
  // },
  // [STORMCAST_ETERNALS_STORMKEEP]: {
  //   Army: { ...StormcastEternalsStormkeepArmy },
  //   GrandAlliance: ORDER,
  // },
  // [SYLVANETH]: {
  //   Army: { ...SylvanethArmy },
  //   GrandAlliance: ORDER,
  // },
  // [TAMURKHANS_HORDE]: {
  //   Army: { ...TamurkhansHordeArmy },
  //   GrandAlliance: CHAOS,
  // },
  // [TOMB_KINGS]: {
  //   Army: { ...TombKingsArmy },
  //   GrandAlliance: DEATH,
  // },
  // [TZEENTCH]: {
  //   Army: { ...TzeentchArmy },
  //   GrandAlliance: CHAOS,
  // },
  // [WANDERERS]: {
  //   Army: { ...WanderersArmy },
  //   GrandAlliance: ORDER,
  // },
}

export const getArmyList = () => ArmyList
export const getArmyFromList = (factionName: TSupportedFaction) => ArmyList[factionName]

type TArmyList = { readonly [factionName in TSupportedFaction]: IArmyListEntry }

interface IArmyListEntry {
  readonly Army: TInitialArmy
  readonly GrandAlliance: TGrandAlliances
}
