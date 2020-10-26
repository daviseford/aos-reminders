import { sortBy } from 'lodash'

// Supported Faction Types
type TBeastsOfChaos = 'BEASTS_OF_CHAOS'
type TBigWaaagh = 'BIG_WAAAGH'
type TBonesplitterz = 'BONESPLITTERZ'
type TChaosGrandAlliance = 'CHAOS_GRAND_ALLIANCE'
type TCitiesOfSigmar = 'CITIES_OF_SIGMAR'
type TDaughtersOfKhaine = 'DAUGHTERS_OF_KHAINE'
type TDeathGrandAlliance = 'DEATH_GRAND_ALLIANCE'
type TDestructionGrandAlliance = 'DESTRUCTION_GRAND_ALLIANCE'
type TDispossessed = 'DISPOSSESSED'
type TFleshEaterCourts = 'FLESH_EATER_COURTS'
type TFyreslayers = 'FYRESLAYERS'
type TGloomspiteGitz = 'GLOOMSPITE_GITZ'
type TGrandHostOfNagash = 'GRAND_HOST_OF_NAGASH'
type TGreenskinz = 'GREENSKINZ'
type TIdonethDeepkin = 'IDONETH_DEEPKIN'
type TIronjawz = 'IRONJAWZ'
type TKharadronOverlords = 'KHARADRON_OVERLORDS'
type TKhorne = 'KHORNE'
type TLegionOfBlood = 'LEGION_OF_BLOOD'
type TLegionOfChaosAscendant = 'LEGION_OF_CHAOS_ASCENDANT'
type TLegionOfNight = 'LEGION_OF_NIGHT'
type TLegionOfSacrament = 'LEGION_OF_SACRAMENT'
type TLegionsOfAzgorh = 'LEGIONS_OF_AZGORH'
type TLegionsOfGrief = 'LEGIONS_OF_GRIEF'
type TLethisianDefenders = 'LETHISIAN_DEFENDERS'
type TLuminethRealmlords = 'LUMINETH_REALMLORDS'
type TMercenaryCompanies = 'MERCENARY_COMPANIES'
type TNighthaunt = 'NIGHTHAUNT'
type TNurgle = 'NURGLE'
type TOgorMawtribes = 'OGOR_MAWTRIBES'
type TOrderGrandAlliance = 'ORDER_GRAND_ALLIANCE'
type TOssiarchBonereapers = 'OSSIARCH_BONEREAPERS'
type TSeraphon = 'SERAPHON'
type TSkaven = 'SKAVEN'
type TSlaanesh = 'SLAANESH'
type TSlavesToDarkness = 'SLAVES_TO_DARKNESS'
type TSonsOfBehemat = 'SONS_OF_BEHEMAT'
type TSoulblight = 'SOULBLIGHT'
type TStormcastEternals = 'STORMCAST_ETERNALS'
type TSylvaneth = 'SYLVANETH'
type TTamurkhansHorde = 'TAMURKHANS_HORDE'
type TTombKings = 'TOMB_KINGS'
type TTzeentch = 'TZEENTCH'
type TWanderers = 'WANDERERS'

// Exported Faction Names
export const BEASTS_OF_CHAOS: TBeastsOfChaos = 'BEASTS_OF_CHAOS'
export const BIG_WAAAGH: TBigWaaagh = 'BIG_WAAAGH'
export const BONESPLITTERZ: TBonesplitterz = 'BONESPLITTERZ'
export const CHAOS_GRAND_ALLIANCE: TChaosGrandAlliance = 'CHAOS_GRAND_ALLIANCE'
export const CITIES_OF_SIGMAR: TCitiesOfSigmar = 'CITIES_OF_SIGMAR'
export const DAUGHTERS_OF_KHAINE: TDaughtersOfKhaine = 'DAUGHTERS_OF_KHAINE'
export const DEATH_GRAND_ALLIANCE: TDeathGrandAlliance = 'DEATH_GRAND_ALLIANCE'
export const DESTRUCTION_GRAND_ALLIANCE: TDestructionGrandAlliance = 'DESTRUCTION_GRAND_ALLIANCE'
export const DISPOSSESSED: TDispossessed = 'DISPOSSESSED'
export const FLESH_EATER_COURTS: TFleshEaterCourts = 'FLESH_EATER_COURTS'
export const FYRESLAYERS: TFyreslayers = 'FYRESLAYERS'
export const GLOOMSPITE_GITZ: TGloomspiteGitz = 'GLOOMSPITE_GITZ'
export const GRAND_HOST_OF_NAGASH: TGrandHostOfNagash = 'GRAND_HOST_OF_NAGASH'
export const GREENSKINZ: TGreenskinz = 'GREENSKINZ'
export const IDONETH_DEEPKIN: TIdonethDeepkin = 'IDONETH_DEEPKIN'
export const IRONJAWZ: TIronjawz = 'IRONJAWZ'
export const KHARADRON_OVERLORDS: TKharadronOverlords = 'KHARADRON_OVERLORDS'
export const KHORNE: TKhorne = 'KHORNE'
export const LEGION_OF_BLOOD: TLegionOfBlood = 'LEGION_OF_BLOOD'
export const LEGION_OF_CHAOS_ASCENDANT: TLegionOfChaosAscendant = 'LEGION_OF_CHAOS_ASCENDANT'
export const LEGION_OF_NIGHT: TLegionOfNight = 'LEGION_OF_NIGHT'
export const LEGION_OF_SACRAMENT: TLegionOfSacrament = 'LEGION_OF_SACRAMENT'
export const LEGIONS_OF_AZGORH: TLegionsOfAzgorh = 'LEGIONS_OF_AZGORH'
export const LEGIONS_OF_GRIEF: TLegionsOfGrief = 'LEGIONS_OF_GRIEF'
export const LETHISIAN_DEFENDERS: TLethisianDefenders = 'LETHISIAN_DEFENDERS'
export const LUMINETH_REALMLORDS: TLuminethRealmlords = 'LUMINETH_REALMLORDS'
export const MERCENARY_COMPANIES: TMercenaryCompanies = 'MERCENARY_COMPANIES'
export const NIGHTHAUNT: TNighthaunt = 'NIGHTHAUNT'
export const NURGLE: TNurgle = 'NURGLE'
export const OGOR_MAWTRIBES: TOgorMawtribes = 'OGOR_MAWTRIBES'
export const ORDER_GRAND_ALLIANCE: TOrderGrandAlliance = 'ORDER_GRAND_ALLIANCE'
export const OSSIARCH_BONEREAPERS: TOssiarchBonereapers = 'OSSIARCH_BONEREAPERS'
export const SERAPHON: TSeraphon = 'SERAPHON'
export const SKAVEN: TSkaven = 'SKAVEN'
export const SLAANESH: TSlaanesh = 'SLAANESH'
export const SLAVES_TO_DARKNESS: TSlavesToDarkness = 'SLAVES_TO_DARKNESS'
export const SONS_OF_BEHEMAT: TSonsOfBehemat = 'SONS_OF_BEHEMAT'
export const SOULBLIGHT: TSoulblight = 'SOULBLIGHT'
export const STORMCAST_ETERNALS: TStormcastEternals = 'STORMCAST_ETERNALS'
export const SYLVANETH: TSylvaneth = 'SYLVANETH'
export const TAMURKHANS_HORDE: TTamurkhansHorde = 'TAMURKHANS_HORDE'
export const TOMB_KINGS: TTombKings = 'TOMB_KINGS'
export const TZEENTCH: TTzeentch = 'TZEENTCH'
export const WANDERERS: TWanderers = 'WANDERERS'

/**
 * Primary factions - excluding mercenary armies that are only taken as allies
 * e.g. Mercenary Companies
 */
export type TPrimaryFactions =
  | TBeastsOfChaos
  | TBigWaaagh
  | TBonesplitterz
  | TChaosGrandAlliance
  | TCitiesOfSigmar
  | TDaughtersOfKhaine
  | TDeathGrandAlliance
  | TDestructionGrandAlliance
  | TDispossessed
  | TFleshEaterCourts
  | TFyreslayers
  | TGloomspiteGitz
  | TGrandHostOfNagash
  | TGreenskinz
  | TIdonethDeepkin
  | TIronjawz
  | TKharadronOverlords
  | TKhorne
  | TLegionOfBlood
  | TLegionOfChaosAscendant
  | TLegionOfNight
  | TLegionOfSacrament
  | TLegionsOfAzgorh
  | TLegionsOfGrief
  | TLethisianDefenders
  | TLuminethRealmlords
  | TMercenaryCompanies
  | TNighthaunt
  | TNurgle
  | TOgorMawtribes
  | TOrderGrandAlliance
  | TOssiarchBonereapers
  | TSeraphon
  | TSkaven
  | TSlaanesh
  | TSlavesToDarkness
  | TSonsOfBehemat
  | TSoulblight
  | TStormcastEternals
  | TSylvaneth
  | TTamurkhansHorde
  | TTombKings
  | TTzeentch
  | TWanderers

// Supported Factions
export type TSupportedFaction = TPrimaryFactions | TMercenaryCompanies

export const PRIMARY_FACTIONS: TPrimaryFactions[] = [
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
  LEGION_OF_BLOOD,
  LEGION_OF_CHAOS_ASCENDANT,
  LEGION_OF_NIGHT,
  LEGION_OF_SACRAMENT,
  LEGIONS_OF_AZGORH,
  LEGIONS_OF_GRIEF,
  LETHISIAN_DEFENDERS,
  LUMINETH_REALMLORDS,
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
  TZEENTCH,
  WANDERERS,
]

export const SUPPORTED_FACTIONS: TSupportedFaction[] = sortBy([...PRIMARY_FACTIONS, MERCENARY_COMPANIES])
