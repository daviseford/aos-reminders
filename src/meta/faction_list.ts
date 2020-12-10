import { BeastOfChaosFaction } from 'factions/beasts_of_chaos'
import { DaughtersOfKhaineFaction } from 'factions/daughters_of_khaine'
import { DispossessedFaction } from 'factions/dispossessed'
import { ChaosFaction, DeathFaction, DestructionFaction, OrderFaction } from 'factions/grand_alliances'
import { GreenskinzFaction } from 'factions/greenskinz'
import { KhorneFaction } from 'factions/khorne'
import { LegionsOfNagashFaction } from 'factions/legions_of_nagash'
import { LegionOfAzgorhFaction } from 'factions/legion_of_azgorh'
import { MegaGargantMercenariesFaction } from 'factions/mega_gargant_mercenaries'
import { MercenaryCompaniesFaction } from 'factions/mercenary_companies'
import { NurgleFaction } from 'factions/nurgle'
import { OgorMawtribesFaction } from 'factions/ogor_mawtribes'
import { OssiarchBonereapersFaction } from 'factions/ossiarch_bonereapers'
import { SampleFaction } from 'factions/sample'
import { SeraphonFaction } from 'factions/seraphon'
import { SkaventideFaction } from 'factions/skaventide'
import { SlaaneshFaction } from 'factions/slaanesh'
import { SlavesToDarknessFaction } from 'factions/slaves_to_darkness'
import { SonsOfBehematFaction } from 'factions/sons_of_behemat'
import { StormcastFaction } from 'factions/stormcast_eternals'
import { SylvanethFaction } from 'factions/sylvaneth'
import { TombKingsFaction } from 'factions/tomb_kings'
import { TzeentchFaction } from 'factions/tzeentch'
import {
  BEASTS_OF_CHAOS,
  CHAOS_GRAND_ALLIANCE,
  DAUGHTERS_OF_KHAINE,
  DEATH_GRAND_ALLIANCE,
  DESTRUCTION_GRAND_ALLIANCE,
  DISPOSSESSED,
  GREENSKINZ,
  KHORNE,
  LEGIONS_OF_NAGASH,
  LEGION_OF_AZGORH,
  MEGA_GARGANT_MERCENARIES,
  MERCENARY_COMPANIES,
  NURGLE,
  OGOR_MAWTRIBES,
  ORDER_GRAND_ALLIANCE,
  OSSIARCH_BONEREAPERS,
  SAMPLE,
  SERAPHON,
  SKAVENTIDE,
  SLAANESH,
  SLAVES_TO_DARKNESS,
  SONS_OF_BEHEMAT,
  STORMCAST_ETERNALS,
  SYLVANETH,
  TOMB_KINGS,
  TSupportedFaction,
  TZEENTCH,
} from 'meta/factions'

// Enable as you add them to /factions/
const FactionList = {
  [BEASTS_OF_CHAOS]: { ...BeastOfChaosFaction },
  // [BIG_WAAAGH]: {
  //   Army: { ...BigWaaaghArmy },
  //   GrandAlliance: DESTRUCTION,
  // },
  // [BONESPLITTERZ]: {
  //   Army: { ...BonesplitterzArmy },
  //   GrandAlliance: DESTRUCTION,
  // },
  [CHAOS_GRAND_ALLIANCE]: { ...ChaosFaction },
  // [CITIES_OF_SIGMAR]: {
  //   Army: { ...CitiesOfSigmarArmy },
  //   GrandAlliance: ORDER,
  // },
  [DAUGHTERS_OF_KHAINE]: { ...DaughtersOfKhaineFaction },
  [DEATH_GRAND_ALLIANCE]: { ...DeathFaction },
  [DESTRUCTION_GRAND_ALLIANCE]: { ...DestructionFaction },
  [DISPOSSESSED]: { ...DispossessedFaction },
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
  [GREENSKINZ]: { ...GreenskinzFaction },
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
  [KHORNE]: { ...KhorneFaction },
  [LEGIONS_OF_NAGASH]: { ...LegionsOfNagashFaction },
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
  [LEGION_OF_AZGORH]: { ...LegionOfAzgorhFaction },
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
  [MEGA_GARGANT_MERCENARIES]: { ...MegaGargantMercenariesFaction },
  [MERCENARY_COMPANIES]: { ...MercenaryCompaniesFaction },
  // [NIGHTHAUNT]: {
  //   Army: { ...NighthauntArmy },
  //   GrandAlliance: DEATH,
  // },
  [NURGLE]: { ...NurgleFaction },
  [OGOR_MAWTRIBES]: { ...OgorMawtribesFaction },
  [ORDER_GRAND_ALLIANCE]: { ...OrderFaction },
  [OSSIARCH_BONEREAPERS]: { ...OssiarchBonereapersFaction },
  [SAMPLE]: { ...SampleFaction },
  [SERAPHON]: { ...SeraphonFaction },
  [SKAVENTIDE]: { ...SkaventideFaction },
  [SLAANESH]: { ...SlaaneshFaction },
  [SLAVES_TO_DARKNESS]: { ...SlavesToDarknessFaction },
  [SONS_OF_BEHEMAT]: { ...SonsOfBehematFaction },
  // [SOULBLIGHT]: {
  //   Army: { ...SoulblightArmy },
  //   GrandAlliance: DEATH,
  // },
  [STORMCAST_ETERNALS]: { ...StormcastFaction },
  [SYLVANETH]: { ...SylvanethFaction },
  // [TAMURKHANS_HORDE]: {
  //   Army: { ...TamurkhansHordeArmy },
  //   GrandAlliance: CHAOS,
  // },
  [TOMB_KINGS]: { ...TombKingsFaction },
  [TZEENTCH]: { ...TzeentchFaction },
  // },
  // [WANDERERS]: {
  //   Army: { ...WanderersArmy },
  //   GrandAlliance: ORDER,
  // },
}

export const getFactionList = () => FactionList
export const getFactionFromList = (factionName: TSupportedFaction) => FactionList[factionName]
export const getSubFactionKeys = (factionName: TSupportedFaction) => FactionList[factionName].subFactionKeys

// export const getAggregatedArmyList = () =>
//   Object.entries(ArmyList).reduce((a, [k, v]) => {
//     a[k] = v.AggregateArmy
//     return a
//   }, {} as Record<keyof typeof ArmyList, TInitialArmy>)
// export const getSubFactionFromList = (factionName: TSupportedFaction, subFactionName: string) => {
//   const subfaction = ArmyList[factionName].SubFactions[subFactionName]
//   if (!subfaction) {
//     throw new Error(`Invalid faction/subFaction combo: ${factionName}, ${subFactionName}`)
//   }
//   return subfaction
// }
