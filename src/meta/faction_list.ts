import { BeastOfChaosFaction } from 'factions/beasts_of_chaos'
import { CitiesOfSigmarFaction } from 'factions/cities_of_sigmar'
import { DaughtersOfKhaineFaction } from 'factions/daughters_of_khaine'
import { DispossessedFaction } from 'factions/dispossessed'
import { FleshEaterCourtsFaction } from 'factions/flesh_eater_courts'
import { FyreslayersFaction } from 'factions/fyreslayers'
import { GloomspiteGitzFaction } from 'factions/gloomspite_gitz'
import { ChaosFaction, DeathFaction, DestructionFaction, OrderFaction } from 'factions/grand_alliances'
import { GreenskinzFaction } from 'factions/greenskinz'
import { IdonethDeepkinFaction } from 'factions/idoneth_deepkin'
import { KharadronOverlordsFaction } from 'factions/kharadron_overlords'
import { KhorneFaction } from 'factions/khorne'
import { LegionsOfGriefFaction } from 'factions/legions_of_grief'
import { LegionsOfNagashFaction } from 'factions/legions_of_nagash'
import { LegionOfAzgorhFaction } from 'factions/legion_of_azgorh'
import { LegionOfChaosAscendantFaction } from 'factions/legion_of_chaos_ascendant'
import { LethisianDefendersFaction } from 'factions/lethisian_defenders'
import { LuminethRealmlordsFaction } from 'factions/lumineth_realmlords'
import { MegaGargantMercenariesFaction } from 'factions/mega_gargant_mercenaries'
import { MercenaryCompaniesFaction } from 'factions/mercenary_companies'
import { NighthauntFaction } from 'factions/nighthaunt'
import { NurgleFaction } from 'factions/nurgle'
import { OgorMawtribesFaction } from 'factions/ogor_mawtribes'
import { OrrukWarclansFaction } from 'factions/orruk_warclans'
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
import { WanderersFaction } from 'factions/wanderers'
import {
  BEASTS_OF_CHAOS,
  CHAOS_GRAND_ALLIANCE,
  CITIES_OF_SIGMAR,
  DAUGHTERS_OF_KHAINE,
  DEATH_GRAND_ALLIANCE,
  DESTRUCTION_GRAND_ALLIANCE,
  DISPOSSESSED,
  FLESH_EATER_COURTS,
  FYRESLAYERS,
  GLOOMSPITE_GITZ,
  GREENSKINZ,
  IDONETH_DEEPKIN,
  KHARADRON_OVERLORDS,
  KHORNE,
  LEGIONS_OF_GRIEF,
  LEGIONS_OF_NAGASH,
  LEGION_OF_AZGORH,
  LEGION_OF_CHAOS_ASCENDANT,
  LETHISIAN_DEFENDERS,
  LUMINETH_REALMLORDS,
  MEGA_GARGANT_MERCENARIES,
  MERCENARY_COMPANIES,
  NIGHTHAUNT,
  NURGLE,
  OGOR_MAWTRIBES,
  ORDER_GRAND_ALLIANCE,
  ORRUK_WARCLANS,
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
  WANDERERS,
} from 'meta/factions'

// Enable as you add them to /factions/
const FactionList = {
  [BEASTS_OF_CHAOS]: { ...BeastOfChaosFaction },
  [CHAOS_GRAND_ALLIANCE]: { ...ChaosFaction },
  [CITIES_OF_SIGMAR]: { ...CitiesOfSigmarFaction },
  [DAUGHTERS_OF_KHAINE]: { ...DaughtersOfKhaineFaction },
  [DEATH_GRAND_ALLIANCE]: { ...DeathFaction },
  [DESTRUCTION_GRAND_ALLIANCE]: { ...DestructionFaction },
  [DISPOSSESSED]: { ...DispossessedFaction },
  [FLESH_EATER_COURTS]: { ...FleshEaterCourtsFaction },
  [FYRESLAYERS]: { ...FyreslayersFaction },
  [GLOOMSPITE_GITZ]: { ...GloomspiteGitzFaction },
  [GREENSKINZ]: { ...GreenskinzFaction },
  [IDONETH_DEEPKIN]: { ...IdonethDeepkinFaction },
  [KHARADRON_OVERLORDS]: { ...KharadronOverlordsFaction },
  [KHORNE]: { ...KhorneFaction },
  [LEGION_OF_AZGORH]: { ...LegionOfAzgorhFaction },
  [LEGION_OF_CHAOS_ASCENDANT]: { ...LegionOfChaosAscendantFaction },
  [LEGIONS_OF_NAGASH]: { ...LegionsOfNagashFaction },
  [LEGIONS_OF_GRIEF]: { ...LegionsOfGriefFaction },
  [LETHISIAN_DEFENDERS]: { ...LethisianDefendersFaction },
  [LUMINETH_REALMLORDS]: { ...LuminethRealmlordsFaction },
  [MEGA_GARGANT_MERCENARIES]: { ...MegaGargantMercenariesFaction },
  [MERCENARY_COMPANIES]: { ...MercenaryCompaniesFaction },
  [NIGHTHAUNT]: { ...NighthauntFaction },
  [NURGLE]: { ...NurgleFaction },
  [OGOR_MAWTRIBES]: { ...OgorMawtribesFaction },
  [ORDER_GRAND_ALLIANCE]: { ...OrderFaction },
  [ORRUK_WARCLANS]: { ...OrrukWarclansFaction },
  [OSSIARCH_BONEREAPERS]: { ...OssiarchBonereapersFaction },
  [SAMPLE]: { ...SampleFaction },
  [SERAPHON]: { ...SeraphonFaction },
  [SKAVENTIDE]: { ...SkaventideFaction },
  [SLAANESH]: { ...SlaaneshFaction },
  [SLAVES_TO_DARKNESS]: { ...SlavesToDarknessFaction },
  [SONS_OF_BEHEMAT]: { ...SonsOfBehematFaction },
  [STORMCAST_ETERNALS]: { ...StormcastFaction },
  [SYLVANETH]: { ...SylvanethFaction },
  [TOMB_KINGS]: { ...TombKingsFaction },
  [TZEENTCH]: { ...TzeentchFaction },
  [WANDERERS]: { ...WanderersFaction },
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
