import { DaughtersOfKhaineFaction } from 'factions/daughters_of_khaine'
import { LegionsOfNagashFaction } from 'factions/legions_of_nagash'
import { MegaGargantMercenariesFaction } from 'factions/mega_gargant_mercenaries'
import { NurgleFaction } from 'factions/nurgle'
import { OgorMawtribesFaction } from 'factions/ogor_mawtribes'
import { OssiarchBonereapersFaction } from 'factions/ossiarch_bonereapers'
import { SampleFaction } from 'factions/sample'
import { SeraphonFaction } from 'factions/seraphon'
import { SlaaneshFaction } from 'factions/slaanesh'
import { SlavesToDarknessFaction } from 'factions/slaves_to_darkness'
import { SonsOfBehematFaction } from 'factions/sons_of_behemat'
import { StormcastFaction } from 'factions/stormcast_eternals'
import {
  DAUGHTERS_OF_KHAINE,
  LEGIONS_OF_NAGASH,
  MEGA_GARGANT_MERCENARIES,
  NURGLE,
  OGOR_MAWTRIBES,
  OSSIARCH_BONEREAPERS,
  SAMPLE,
  SERAPHON,
  SLAANESH,
  SLAVES_TO_DARKNESS,
  SONS_OF_BEHEMAT,
  STORMCAST_ETERNALS,
  TSupportedFaction,
} from 'meta/factions'

// Enable as you add them to /factions/
const FactionList = {
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
  [DAUGHTERS_OF_KHAINE]: { ...DaughtersOfKhaineFaction },
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
  [MEGA_GARGANT_MERCENARIES]: { ...MegaGargantMercenariesFaction },
  // [MERCENARY_COMPANIES]: {
  //   Army: { ...MercenaryCompaniesArmy },
  //   GrandAlliance: ORDER,
  // },
  // [NIGHTHAUNT]: {
  //   Army: { ...NighthauntArmy },
  //   GrandAlliance: DEATH,
  // },
  [NURGLE]: { ...NurgleFaction },
  [OGOR_MAWTRIBES]: { ...OgorMawtribesFaction },
  // [ORDER_GRAND_ALLIANCE]: {
  //   Army: { ...OrderArmy },
  //   GrandAlliance: ORDER,
  // },
  [OSSIARCH_BONEREAPERS]: { ...OssiarchBonereapersFaction },
  //   Army: { ...OssiarchBonereapersArmy },
  //   GrandAlliance: DEATH,
  // },
  [SERAPHON]: { ...SeraphonFaction },
  [SAMPLE]: { ...SampleFaction },
  // [SKAVEN]: {
  //   Army: { ...SkavenArmy },
  //   GrandAlliance: CHAOS,
  // },
  [SLAANESH]: { ...SlaaneshFaction },
  [SLAVES_TO_DARKNESS]: { ...SlavesToDarknessFaction },
  [SONS_OF_BEHEMAT]: { ...SonsOfBehematFaction },
  // [SOULBLIGHT]: {
  //   Army: { ...SoulblightArmy },
  //   GrandAlliance: DEATH,
  // },
  [STORMCAST_ETERNALS]: { ...StormcastFaction },
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
