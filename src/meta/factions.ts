import { sortBy } from 'lodash'

// Supported Faction Types
type TBeastsOfChaos = 'BEASTS_OF_CHAOS'
type TChaosGrandAlliance = 'CHAOS_GRAND_ALLIANCE'
type TCitiesOfSigmar = 'CITIES_OF_SIGMAR'
type TDaughtersOfKhaine = 'DAUGHTERS_OF_KHAINE'
type TDeathGrandAlliance = 'DEATH_GRAND_ALLIANCE'
type TDestructionGrandAlliance = 'DESTRUCTION_GRAND_ALLIANCE'
type TDispossessed = 'DISPOSSESSED'
type TFleshEaterCourts = 'FLESH_EATER_COURTS'
type TFyreslayers = 'FYRESLAYERS'
type TGloomspiteGitz = 'GLOOMSPITE_GITZ'
type TGreenskinz = 'GREENSKINZ'
type TIdonethDeepkin = 'IDONETH_DEEPKIN'
type TKharadronOverlords = 'KHARADRON_OVERLORDS'
type TKhorne = 'KHORNE'
type TLegionOfChaosAscendant = 'LEGION_OF_CHAOS_ASCENDANT'
type TLegionOfAzgorh = 'LEGION_OF_AZGORH'
type TLegionsOfGrief = 'LEGIONS_OF_GRIEF'
type TLegionsOfNagash = 'LEGIONS_OF_NAGASH'
type TLethisianDefenders = 'LETHISIAN_DEFENDERS'
type TLuminethRealmlords = 'LUMINETH_REALMLORDS'
type TMegaGargantMercenaries = 'MEGA_GARGANT_MERCENARIES'
type TMercenaryCompanies = 'MERCENARY_COMPANIES'
type TNighthaunt = 'NIGHTHAUNT'
type TNurgle = 'NURGLE'
type TOgorMawtribes = 'OGOR_MAWTRIBES'
type TOrderGrandAlliance = 'ORDER_GRAND_ALLIANCE'
type TOrrukWarclans = 'ORRUK_WARCLANS'
type TOssiarchBonereapers = 'OSSIARCH_BONEREAPERS'
type TSeraphon = 'SERAPHON'
type TSample = 'SAMPLE' // TODO: Remove before publishing
type TSkaventide = 'SKAVENTIDE'
type TSlaanesh = 'SLAANESH'
type TSlavesToDarkness = 'SLAVES_TO_DARKNESS'
type TSonsOfBehemat = 'SONS_OF_BEHEMAT'
type TStormcastEternals = 'STORMCAST_ETERNALS'
type TSylvaneth = 'SYLVANETH'
type TTamurkhansHorde = 'TAMURKHANS_HORDE' // !! REMOVE THIS AFTER V4 NURGLE !!
type TTombKings = 'TOMB_KINGS'
type TTzeentch = 'TZEENTCH'
type TWanderers = 'WANDERERS'

// Exported Faction Names
export const BEASTS_OF_CHAOS: TBeastsOfChaos = 'BEASTS_OF_CHAOS'
export const CHAOS_GRAND_ALLIANCE: TChaosGrandAlliance = 'CHAOS_GRAND_ALLIANCE'
export const CITIES_OF_SIGMAR: TCitiesOfSigmar = 'CITIES_OF_SIGMAR'
export const DAUGHTERS_OF_KHAINE: TDaughtersOfKhaine = 'DAUGHTERS_OF_KHAINE'
export const DEATH_GRAND_ALLIANCE: TDeathGrandAlliance = 'DEATH_GRAND_ALLIANCE'
export const DESTRUCTION_GRAND_ALLIANCE: TDestructionGrandAlliance = 'DESTRUCTION_GRAND_ALLIANCE'
export const DISPOSSESSED: TDispossessed = 'DISPOSSESSED'
export const FLESH_EATER_COURTS: TFleshEaterCourts = 'FLESH_EATER_COURTS'
export const FYRESLAYERS: TFyreslayers = 'FYRESLAYERS'
export const GLOOMSPITE_GITZ: TGloomspiteGitz = 'GLOOMSPITE_GITZ'
export const GREENSKINZ: TGreenskinz = 'GREENSKINZ'
export const IDONETH_DEEPKIN: TIdonethDeepkin = 'IDONETH_DEEPKIN'
export const KHARADRON_OVERLORDS: TKharadronOverlords = 'KHARADRON_OVERLORDS'
export const KHORNE: TKhorne = 'KHORNE'
export const LEGION_OF_CHAOS_ASCENDANT: TLegionOfChaosAscendant = 'LEGION_OF_CHAOS_ASCENDANT'
export const LEGION_OF_AZGORH: TLegionOfAzgorh = 'LEGION_OF_AZGORH'
export const LEGIONS_OF_GRIEF: TLegionsOfGrief = 'LEGIONS_OF_GRIEF'
export const LEGIONS_OF_NAGASH: TLegionsOfNagash = 'LEGIONS_OF_NAGASH'
export const LETHISIAN_DEFENDERS: TLethisianDefenders = 'LETHISIAN_DEFENDERS'
export const LUMINETH_REALMLORDS: TLuminethRealmlords = 'LUMINETH_REALMLORDS'
export const MEGA_GARGANT_MERCENARIES: TMegaGargantMercenaries = 'MEGA_GARGANT_MERCENARIES'
export const MERCENARY_COMPANIES: TMercenaryCompanies = 'MERCENARY_COMPANIES'
export const NIGHTHAUNT: TNighthaunt = 'NIGHTHAUNT'
export const NURGLE: TNurgle = 'NURGLE'
export const OGOR_MAWTRIBES: TOgorMawtribes = 'OGOR_MAWTRIBES'
export const ORDER_GRAND_ALLIANCE: TOrderGrandAlliance = 'ORDER_GRAND_ALLIANCE'
export const ORRUK_WARCLANS: TOrrukWarclans = 'ORRUK_WARCLANS'
export const OSSIARCH_BONEREAPERS: TOssiarchBonereapers = 'OSSIARCH_BONEREAPERS'
export const SERAPHON: TSeraphon = 'SERAPHON'
export const SKAVENTIDE: TSkaventide = 'SKAVENTIDE'
export const SAMPLE: TSample = 'SAMPLE'
export const SLAANESH: TSlaanesh = 'SLAANESH'
export const SLAVES_TO_DARKNESS: TSlavesToDarkness = 'SLAVES_TO_DARKNESS'
export const SONS_OF_BEHEMAT: TSonsOfBehemat = 'SONS_OF_BEHEMAT'
export const STORMCAST_ETERNALS: TStormcastEternals = 'STORMCAST_ETERNALS'
export const SYLVANETH: TSylvaneth = 'SYLVANETH'
export const TAMURKHANS_HORDE: TTamurkhansHorde = 'TAMURKHANS_HORDE' // !! REMOVE THIS AFTER V4 NURGLE !!
export const TOMB_KINGS: TTombKings = 'TOMB_KINGS'
export const TZEENTCH: TTzeentch = 'TZEENTCH'
export const WANDERERS: TWanderers = 'WANDERERS'

/**
 * Primary factions
 *
 * Excludes mercenary armies that are only taken as allies e.g. Mercenary Companies and Mega Gargant Mercenaries
 */
export type TPrimaryFactions =
  | TBeastsOfChaos
  | TChaosGrandAlliance
  // | TCitiesOfSigmar
  | TDaughtersOfKhaine
  | TDeathGrandAlliance
  | TDestructionGrandAlliance
  | TDispossessed
  // | TFleshEaterCourts
  // | TFyreslayers
  // | TGloomspiteGitz
  // | TGrandHostOfNagash
  | TGreenskinz
  // | TIdonethDeepkin
  // | TKharadronOverlords
  | TKhorne
  // | TLegionOfChaosAscendant
  | TLegionOfAzgorh
  // | TLegionsOfGrief
  | TLegionsOfNagash
  // | TLethisianDefenders
  // | TLuminethRealmlords
  // | TMegaGargantMercenaries
  | TMercenaryCompanies
  // | TNighthaunt
  | TNurgle
  | TOgorMawtribes
  | TOrderGrandAlliance
  | TOrrukWarclans
  | TOssiarchBonereapers
  | TSeraphon
  | TSkaventide
  | TSlaanesh
  | TSample
  | TSlavesToDarkness
  | TSonsOfBehemat
  | TStormcastEternals
  | TSylvaneth
  | TTombKings
  | TTzeentch
// | TWanderers

// Supported Factions
export type TSupportedFaction = TPrimaryFactions | TMercenaryCompanies | TMegaGargantMercenaries

export const PRIMARY_FACTIONS: TPrimaryFactions[] = [
  BEASTS_OF_CHAOS,
  CHAOS_GRAND_ALLIANCE,
  // CITIES_OF_SIGMAR,
  DAUGHTERS_OF_KHAINE,
  DEATH_GRAND_ALLIANCE,
  DESTRUCTION_GRAND_ALLIANCE,
  DISPOSSESSED,
  // FLESH_EATER_COURTS,
  // FYRESLAYERS,
  // GLOOMSPITE_GITZ,
  // GRAND_HOST_OF_NAGASH,
  GREENSKINZ,
  // IDONETH_DEEPKIN,
  // KHARADRON_OVERLORDS,
  KHORNE,
  // LEGION_OF_CHAOS_ASCENDANT,
  LEGION_OF_AZGORH,
  // LEGIONS_OF_GRIEF,
  LEGIONS_OF_NAGASH,
  // LETHISIAN_DEFENDERS,
  // LUMINETH_REALMLORDS,
  // NIGHTHAUNT,
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
  TZEENTCH,
  // WANDERERS,
]

export const SUPPORTED_FACTIONS: TSupportedFaction[] = sortBy([
  ...PRIMARY_FACTIONS,
  MEGA_GARGANT_MERCENARIES,
  MERCENARY_COMPANIES,
])
