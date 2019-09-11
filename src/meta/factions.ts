import { sortBy } from 'lodash'

// Supported Faction Types
export type TBeastclawRaiders = 'BEASTCLAW_RAIDERS'
export type TBeastsOfChaos = 'BEASTS_OF_CHAOS'
export type TBonesplitterz = 'BONESPLITTERZ'
export type TChaosGrandAlliance = 'CHAOS_GRAND_ALLIANCE'
export type TDaughtersOfKhaine = 'DAUGHTERS_OF_KHAINE'
export type TDeathGrandAlliance = 'DEATH_GRAND_ALLIANCE'
export type TDestructionGrandAlliance = 'DESTRUCTION_GRAND_ALLIANCE'
export type TDispossessed = 'DISPOSSESSED'
export type TEverchosen = 'EVERCHOSEN'
export type TFleshEaterCourts = 'FLESH_EATER_COURTS'
export type TFyreslayers = 'FYRESLAYERS'
export type TGloomspiteGitz = 'GLOOMSPITE_GITZ'
export type TGrandHostOfNagash = 'GRAND_HOST_OF_NAGASH'
export type TGutbusters = 'GUTBUSTERS'
export type TIdonethDeepkin = 'IDONETH_DEEPKIN'
export type TIronjawz = 'IRONJAWZ'
export type TKharadronOverlords = 'KHARADRON_OVERLORDS'
export type TKhorne = 'KHORNE'
export type TLegionOfBlood = 'LEGION_OF_BLOOD'
export type TLegionOfNight = 'LEGION_OF_NIGHT'
export type TLegionOfSacrament = 'LEGION_OF_SACRAMENT'
export type TLegionsOfAzgorh = 'LEGIONS_OF_AZGORH'
export type TLegionsOfGrief = 'LEGIONS_OF_GRIEF'
export type TLethisianDefenders = 'LETHISIAN_DEFENDERS'
export type TMercenaryCompanies = 'MERCENARY_COMPANIES'
export type TNighthaunt = 'NIGHTHAUNT'
export type TNurgle = 'NURGLE'
export type TOrderGrandAlliance = 'ORDER_GRAND_ALLIANCE'
export type TOssiarchBonereapers = 'OSSIARCH_BONEREAPERS'
export type TSeraphon = 'SERAPHON'
export type TSkaven = 'SKAVEN'
export type TSlaanesh = 'SLAANESH'
export type TSlavesToDarkness = 'SLAVES_TO_DARKNESS'
export type TSoulblight = 'SOULBLIGHT'
export type TStormcastEternals = 'STORMCAST_ETERNALS'
export type TSylvaneth = 'SYLVANETH'
export type TTamurkhansHorde = 'TAMURKHANS_HORDE'
export type TTzeentch = 'TZEENTCH'
export type TWanderers = 'WANDERERS'

// Exported Faction Names
export const BEASTCLAW_RAIDERS: TBeastclawRaiders = 'BEASTCLAW_RAIDERS'
export const BEASTS_OF_CHAOS: TBeastsOfChaos = 'BEASTS_OF_CHAOS'
export const CHAOS_GRAND_ALLIANCE: TChaosGrandAlliance = 'CHAOS_GRAND_ALLIANCE'
export const BONESPLITTERZ: TBonesplitterz = 'BONESPLITTERZ'
export const DAUGHTERS_OF_KHAINE: TDaughtersOfKhaine = 'DAUGHTERS_OF_KHAINE'
export const DEATH_GRAND_ALLIANCE: TDeathGrandAlliance = 'DEATH_GRAND_ALLIANCE'
export const DESTRUCTION_GRAND_ALLIANCE: TDestructionGrandAlliance = 'DESTRUCTION_GRAND_ALLIANCE'
export const DISPOSSESSED: TDispossessed = 'DISPOSSESSED'
export const EVERCHOSEN: TEverchosen = 'EVERCHOSEN'
export const FLESH_EATER_COURTS: TFleshEaterCourts = 'FLESH_EATER_COURTS'
export const FYRESLAYERS: TFyreslayers = 'FYRESLAYERS'
export const GLOOMSPITE_GITZ: TGloomspiteGitz = 'GLOOMSPITE_GITZ'
export const GRAND_HOST_OF_NAGASH: TGrandHostOfNagash = 'GRAND_HOST_OF_NAGASH'
export const GUTBUSTERS: TGutbusters = 'GUTBUSTERS'
export const IDONETH_DEEPKIN: TIdonethDeepkin = 'IDONETH_DEEPKIN'
export const IRONJAWZ: TIronjawz = 'IRONJAWZ'
export const KHARADRON_OVERLORDS: TKharadronOverlords = 'KHARADRON_OVERLORDS'
export const KHORNE: TKhorne = 'KHORNE'
export const LEGION_OF_BLOOD: TLegionOfBlood = 'LEGION_OF_BLOOD'
export const LEGION_OF_NIGHT: TLegionOfNight = 'LEGION_OF_NIGHT'
export const LEGION_OF_SACRAMENT: TLegionOfSacrament = 'LEGION_OF_SACRAMENT'
export const LEGIONS_OF_AZGORH: TLegionsOfAzgorh = 'LEGIONS_OF_AZGORH'
export const LEGIONS_OF_GRIEF: TLegionsOfGrief = 'LEGIONS_OF_GRIEF'
export const LETHISIAN_DEFENDERS: TLethisianDefenders = 'LETHISIAN_DEFENDERS'
export const MERCENARY_COMPANIES: TMercenaryCompanies = 'MERCENARY_COMPANIES'
export const NIGHTHAUNT: TNighthaunt = 'NIGHTHAUNT'
export const ORDER_GRAND_ALLIANCE: TOrderGrandAlliance = 'ORDER_GRAND_ALLIANCE'
export const OSSIARCH_BONEREAPERS: TOssiarchBonereapers = 'OSSIARCH_BONEREAPERS'
export const NURGLE: TNurgle = 'NURGLE'
export const SERAPHON: TSeraphon = 'SERAPHON'
export const SKAVEN: TSkaven = 'SKAVEN'
export const SLAANESH: TSlaanesh = 'SLAANESH'
export const SLAVES_TO_DARKNESS: TSlavesToDarkness = 'SLAVES_TO_DARKNESS'
export const SOULBLIGHT: TSoulblight = 'SOULBLIGHT'
export const STORMCAST_ETERNALS: TStormcastEternals = 'STORMCAST_ETERNALS'
export const SYLVANETH: TSylvaneth = 'SYLVANETH'
export const TAMURKHANS_HORDE: TTamurkhansHorde = 'TAMURKHANS_HORDE'
export const TZEENTCH: TTzeentch = 'TZEENTCH'
export const WANDERERS: TWanderers = 'WANDERERS'

// Supported Factions
export type TSupportedFaction =
  | TBeastclawRaiders
  | TBeastsOfChaos
  | TBonesplitterz
  | TChaosGrandAlliance
  | TDaughtersOfKhaine
  | TDeathGrandAlliance
  | TDestructionGrandAlliance
  | TDispossessed
  | TEverchosen
  | TFleshEaterCourts
  | TFyreslayers
  | TGloomspiteGitz
  | TGrandHostOfNagash
  | TGutbusters
  | TIdonethDeepkin
  | TIronjawz
  | TKharadronOverlords
  | TKhorne
  | TLegionOfBlood
  | TLegionOfSacrament
  | TLegionOfNight
  | TLegionsOfAzgorh
  | TLegionsOfGrief
  | TLethisianDefenders
  | TMercenaryCompanies
  | TNighthaunt
  | TNurgle
  | TOrderGrandAlliance
  | TOssiarchBonereapers
  | TSeraphon
  | TSkaven
  | TSlaanesh
  | TSlavesToDarkness
  | TSoulblight
  | TStormcastEternals
  | TSylvaneth
  | TTamurkhansHorde
  | TTzeentch
  | TWanderers

export const SUPPORTED_FACTIONS: TSupportedFaction[] = sortBy([
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
  GRAND_HOST_OF_NAGASH,
  GUTBUSTERS,
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
  TZEENTCH,
  WANDERERS,
])
